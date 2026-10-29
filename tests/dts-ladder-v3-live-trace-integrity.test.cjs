'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),D=require('../dist/ladder-diagram.js');
const E=require('../dist/ladder-editor.js'),M=require('../dist/ladder-monitor.js');
const limits={inputCount:6,outputCount:4};
const ton={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TON',ref:'T1',presetMs:100}}]};
const scan=(p,m,now,inputs)=>L.scan(p,inputs,m,now,limits);
const draw=(p,t,values)=>D.render(p.rungs[0],{live:true,values,pathStates:t.pathStates,coilValue:t.value});
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(7+i),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(3+i),signalType:'DO'}))
]};
const state={powered:true,program:'dts-ladder-v1',
 inputs:Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DI').map(p=>[p.id,false])),
 outputs:Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DO').map(p=>[p.id,false]))};
test('native TON input path can be live while output remains off',()=>{
 const a=scan(ton,{},0,{I1:true});
 assert.equal(a.ok,true);assert.equal(a.traces[0].value,false);
 assert.match(draw(ton,a.traces[0],a.memory.values),/dts-ladder-wire-hot/);
 assert.doesNotMatch(draw(ton,a.traces[0],a.memory.values),/dts-ladder-function-block dts-ladder-path-on/);
});
test('unknown coil telemetry never borrows the path color',()=>{
 const t=scan(ton,{},0,{I1:true}).traces[0];
 const svg=D.render(ton.rungs[0],{live:true,values:{I1:true},pathStates:t.pathStates});
 assert.doesNotMatch(svg,/dts-ladder-function-block dts-ladder-path-on/);
});
test('completed native TON is correctly highlighted',()=>{
 const memory={};scan(ton,memory,0,{I1:true});
 const b=scan(ton,memory,100,{I1:true});
 assert.equal(b.traces[0].value,true);
 assert.match(draw(ton,b.traces[0],b.memory.values),/dts-ladder-function-block dts-ladder-path-on/);
});
test('parallel join and branch become hot only for conducting lower path',()=>{
 const rung={id:'P',paths:[[{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}};
 const p={version:1,rungs:[rung]};
 const x=scan(p,{},0,{I1:false,I2:true});
 const svg=draw(p,x.traces[0],x.memory.values);
 assert.match(svg,/x1="94" y1="80" x2="94" y2="158" class="dts-ladder-wire-hot"/);
 assert.match(svg,/x1="686" y1="80" x2="686" y2="158" class="dts-ladder-wire-hot"/);
 const y=scan(p,{},1,{I1:false,I2:false});
 assert.doesNotMatch(draw(p,y.traces[0],y.memory.values),/dts-ladder-wire-hot/);
});
test('valid native trace keeps live Network value and path',()=>{
 const p=L.blank(),t=scan(p,{},0,{I1:true}).traces;
 const row=E.monitorRows(p,p,t,true,'dts-ladder-v1',true)[0];
 assert.equal(row.value,true);assert.deepEqual(row.pathStates,[true]);
});
test('reordered or incomplete trace is not replayed as current Network',()=>{
 const p=L.blank(),t=scan(p,{},0,{I1:true}).traces;
 assert.equal(E.monitorRows(p,p,[{...t[0],id:'other'}],true,'dts-ladder-v1',true)[0].value,null);
 assert.equal(E.monitorRows(p,p,[],true,'dts-ladder-v1',true)[0].value,null);
});
test('string values and string path states are not interpreted as live',()=>{
 const p=L.blank(),t=scan(p,{},0,{I1:true}).traces[0];
 assert.equal(E.monitorRows(p,p,[{...t,value:'false'}],true,'dts-ladder-v1',true)[0].value,null);
 assert.equal(E.monitorRows(p,p,[{...t,pathStates:['false']}],true,'dts-ladder-v1',true)[0].pathStates,null);
});
test('read-only PLC monitor waits for a fresh scan after a saved program',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:L.blank(),_plcRuntime:state};
 assert.equal(M.snapshot(c,cpu,true,true).live,false);
 const t=scan(c.ladderProgram,{},0,{I1:false}).traces;
 assert.equal(M.snapshot({...c,_dtsLadderTraces:t},cpu,true,true).live,true);
 assert.equal(M.snapshot({...c,_dtsLadderTraces:[{...t[0],id:'old'}]},cpu,true,true).live,false);
});
test('corrupt catalog pin record is fail-closed instead of crashing',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:L.blank(),_plcRuntime:state};
 const info=M.snapshot(c,{...cpu,pins:[null,...cpu.pins]},true,true);
 assert.equal(info.live,false);
});
test('stopped and powerless monitoring never expose old output',()=>{
 const p=L.blank(),t=scan(p,{},0,{I1:true}).traces;
 assert.equal(E.monitorRows(p,p,t,false,'dts-ladder-v1',true)[0].value,null);
 assert.equal(E.monitorRows(p,p,t,true,'dts-ladder-v1',false)[0].value,null);
});
test('virtual TOF rewind keeps output deenergized until new active input',()=>{
 const p={version:1,rungs:[{id:'T',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TOF',ref:'T1',presetMs:100}}]};
 const m={},a=scan(p,m,1000,{I1:true}),b=scan(p,m,1010,{I1:false}),c=scan(p,m,0,{I1:false});
 assert.equal(a.traces[0].value,true);assert.equal(b.traces[0].value,true);assert.equal(c.traces[0].value,false);
});
