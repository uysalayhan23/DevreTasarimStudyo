'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,type,ref,contactType,contactRef,extra={})=>({id,paths:[[{type:contactType,ref:contactRef}]],coil:{type,ref,...extra}});
const owner=(id,ref,input,type='CTU',preset=1)=>rung(id,type,ref,'NO',input,{preset});
const lamp=(id,ref,c)=>rung(id,'OUT',ref,'NO',c);
const reset=(id,ref,type,c)=>rung(id,'RESET',ref,type,c);
const program=(...rungs)=>({version:1,rungs});
const reached=(refs=['C1'])=>({values:Object.fromEntries(refs.map(ref=>[ref,true])),blocks:Object.fromEntries(refs.map(ref=>[ref,{kind:'CTU',preset:1,count:1,prev:false}]))});
const scan=(p,m,inputs={},now=100)=>{assert.equal(Ladder.validate(p,limits).ok,true);const r=Ladder.scan(p,inputs,m,now,limits);assert.equal(r.ok,true,r.error);return r};

test('P1-06 late C1 RESET clears earlier Q1 and counter count in one scan',()=>{
 const p=program(owner('c','C1','I1'),lamp('q','Q1','C1'),reset('r','C1','NO','I2'));
 const m=reached(),s=scan(p,m,{I2:true});
 assert.equal(m.blocks.C1.count,0);assert.equal(s.outputs.Q1,false);
 assert.equal(s.traces.find(t=>t.id==='q').value,false);
 assert.equal(s.traces.find(t=>t.id==='r').resetApplied,true);
});
for(const kind of ['CTU','CTD'])for(const via of ['NO','NC']){
 test('P1-06 '+kind+' late RESET '+via+' input safely clears Q1',()=>{
  const p=program(owner('c','C1','I1',kind,2),lamp('q','Q1','C1'),reset('r','C1',via,'I2'));
  const m={values:{C1:true},blocks:{C1:{kind,preset:2,count:kind==='CTU'?2:0,prev:false}}};
  const s=scan(p,m,{I2:via==='NO'});
  assert.equal(s.outputs.Q1,false);assert.equal(m.blocks.C1.count,kind==='CTU'?0:2);
 });
}
test('P1-06 cascaded C1 -> Q1 -> C2 reset closes both outputs',()=>{
 const p=program(owner('c1','C1','I1'),lamp('q1','Q1','C1'),reset('r1','C1','NO','I2'),owner('c2','C2','I3'),lamp('q2','Q2','C2'),reset('r2','C2','NC','Q1'));
 const m=reached(['C1','C2']);const s=scan(p,m,{I2:true});
 assert.equal(m.blocks.C1.count,0);assert.equal(m.blocks.C2.count,0);
 assert.equal(s.outputs.Q1,false);assert.equal(s.outputs.Q2,false);
 assert.equal(s.traces.find(t=>t.id==='r2').resetApplied,true);
});
test('P1-06 three-counter cascade converges without repeated edge increments',()=>{
 const p=program(owner('c1','C1','I1'),lamp('q1','Q1','C1'),reset('r1','C1','NO','I2'),
  owner('c2','C2','I3'),lamp('q2','Q2','C2'),reset('r2','C2','NC','Q1'),
  owner('c3','C3','I4'),lamp('q3','Q3','C3'),reset('r3','C3','NC','Q2'));
 const m=reached(['C1','C2','C3']);const s=scan(p,m,{I2:true});
 assert.deepEqual([m.blocks.C1.count,m.blocks.C2.count,m.blocks.C3.count],[0,0,0]);
 assert.deepEqual([s.outputs.Q1,s.outputs.Q2,s.outputs.Q3],[false,false,false]);
});
test('P1-06 feedback RESET event is exposed without false hot-wire trace',()=>{
 const p=program(owner('c','C1','I1'),lamp('m','M1','C1'),lamp('q','Q1','M1'),reset('r','C1','NO','M1'));
 const m={};scan(p,m,{I1:false},0);const s=scan(p,m,{I1:true},1);
 assert.equal(s.outputs.Q1,false);assert.equal(m.blocks.C1.count,0);
 const t=s.traces.find(t=>t.id==='r');assert.equal(t.active,false);assert.equal(t.resetApplied,true);
});
test('P1-06 no reset leaves normal rising edge, no invented reset trace',()=>{
 const p=program(owner('c','C1','I1'),lamp('q','Q1','C1'));
 const m={};scan(p,m,{I1:false},0);const s=scan(p,m,{I1:true},1);
 assert.equal(m.blocks.C1.count,1);assert.equal(s.outputs.Q1,true);
 assert.equal(s.traces.some(t=>t.resetApplied),false);
});
test('P1-06 held count input after late reset does not create second edge',()=>{
 const p=program(owner('c','C1','I1','CTU',2),lamp('q','Q1','C1'),reset('r','C1','NO','I2'));
 const m={};scan(p,m,{I1:true,I2:true},0);scan(p,m,{I1:true,I2:false},1);
 assert.equal(m.blocks.C1.count,0);scan(p,m,{I1:false},2);scan(p,m,{I1:true},3);
 assert.equal(m.blocks.C1.count,1);
});
test('P1-06 TP timer running alongside counter RESET is not double-triggered',()=>{
 const p=program(rung('tp','TP','T1','NO','I4',{presetMs:100}),owner('c','C1','I1'),lamp('q','Q1','C1'),reset('r','C1','NO','I2'));
 const m=reached();scan(p,m,{I2:true,I4:true},10);
 assert.equal(m.blocks.T1.pulseStart,10);
 const s=scan(p,m,{I2:true,I4:true},50);
 assert.equal(m.blocks.T1.pulseStart,10);assert.equal(s.traces.find(t=>t.id==='tp').elapsedMs,40);
});
test('P1-06 invalid program remains fail-closed without mutating memory',()=>{
 const m=reached();const before=JSON.stringify(m);
 const p=program(owner('dup','C1','I1'),owner('dup','C2','I2'));
 const s=Ladder.scan(p,{},m,1,limits);
 assert.equal(s.ok,false);assert.deepEqual(s.outputs,{});assert.equal(JSON.stringify(m),before);
});

test('P1-06 malformed source is rejected without throwing during replay preflight',()=>{
 const bad=[{version:1,rungs:{}},{version:1,rungs:[{id:'r',paths:'bad',coil:{type:'RESET',ref:'C1'}}]},null];
 for(const p of bad){const m={};const s=Ladder.scan(p,{},m,1,limits);assert.equal(s.ok,false);assert.deepEqual(s.outputs,{});}
});

// Original electrical solver + actual 703-component catalogue (not a stub).
const Simulation=require('../dist/simulation.js');
const prevWindow=global.window;global.window=global;require('../dist/library.js');
const byId=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));global.window=prevWindow;
test('P1-06 native 703 catalogue SMPS/CPU1211C cascade clears Q1/Q2 and both lamps',()=>{
 assert.equal(global.COMPONENT_LIBRARY.length,703);
 const ladder=program(owner('c1','C1','I1'),lamp('q1','Q1','C1'),reset('r1','C1','NO','I2'),owner('c2','C2','I3'),lamp('q2','Q2','C2'),reset('r2','C2','NC','Q1'));
 const plc={id:'plc',typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:ladder};
 const resetButton={id:'resetButton',typeId:'push-no',state:true};
 const c=[{id:'ac',typeId:'supply-1p'},{id:'smps',typeId:'smps'},plc,resetButton,{id:'lamp1',typeId:'lamp-red'},{id:'lamp2',typeId:'lamp-red'}];
 const edges=[['ac','L','smps','L'],['ac','N','smps','N'],['smps','P','plc','X10:1'],['smps','M','plc','X10:2'],['smps','M','plc','X10:6'],['smps','P','plc','X12:1'],['smps','M','plc','X12:2'],['smps','P','resetButton','13'],['resetButton','14','plc','X10:8'],['plc','X12:3','lamp1','X1'],['lamp1','X2','smps','M'],['plc','X12:4','lamp2','X1'],['lamp2','X2','smps','M']];
 const wires=edges.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp}}));
 const project={components:c,wires,junctions:[]};
 let s=Simulation.solve(project,byId,{now:100,reset:true});assert.equal(s.blocked,false);assert.equal(s.stable,true);
 // Simulate two counters already at their targets before the reset input.
 plc._dtsLadderMemory.values.C1=true;plc._dtsLadderMemory.values.C2=true;
 plc._dtsLadderMemory.blocks.C1={kind:'CTU',preset:1,count:1,prev:false};
 plc._dtsLadderMemory.blocks.C2={kind:'CTU',preset:1,count:1,prev:false};
 s=Simulation.solve(project,byId,{now:110,reset:false});
 assert.equal(s.blocked,false);assert.equal(s.stable,true);
 assert.equal(plc._plcRuntime.powered,true);
 assert.equal(plc._dtsLadderMemory.blocks.C1.count,0);
 assert.equal(plc._dtsLadderMemory.blocks.C2.count,0);
 assert.equal(plc._plcRuntime.outputs['X12:3'],false);
 assert.equal(plc._plcRuntime.outputs['X12:4'],false);
 assert.equal(c.find(x=>x.id==='lamp1')._active,false);
 assert.equal(c.find(x=>x.id==='lamp2')._active,false);
});
