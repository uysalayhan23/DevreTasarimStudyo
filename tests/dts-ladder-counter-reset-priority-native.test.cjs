'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const IO=require('../dist/ladder-program-io.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,type,ref,input,extra={})=>({id,paths:[[{type:'NO',ref:input}]],coil:{type,ref,...extra}});
const program=(type='CTU',order='reset-first',preset=2)=>{
 const owner=rung('count',type,'C1','I1',{preset}),reset=rung('reset','RESET','C1','I2');
 return {version:1,rungs:[...(order==='reset-first'?[reset,owner]:[owner,reset]),rung('lamp','OUT','Q1','C1')]};
};
const scan=(p,mem,i1,i2,now=1)=>{const r=L.scan(p,{I1:i1,I2:i2},mem,now,limits);assert.equal(r.ok,true,r.error);return r};
test('P0-03 CTU reset-first blocks simultaneous count pulse and Q1',()=>{
 const p=program('CTU','reset-first'),m={};
 const r=scan(p,m,true,true);
 assert.equal(m.blocks.C1?.count,0);assert.equal(r.outputs.Q1,false);
 assert.equal(r.traces.find(t=>t.id==='count').value,false);
});
test('P0-03 CTD reset-first reloads preset without consuming simultaneous count pulse',()=>{
 const p=program('CTD','reset-first',3),m={};
 const r=scan(p,m,true,true);
 assert.equal(m.blocks.C1?.count,3);assert.equal(r.outputs.Q1,false);
});
test('P0-03 CTU reset-last does not count held I1 when RESET is released',()=>{
 const p=program('CTU','count-first'),m={};
 scan(p,m,false,false);scan(p,m,true,true);
 const held=scan(p,m,true,false),still=scan(p,m,true,false);
 assert.equal(m.blocks.C1?.count,0);assert.equal(held.outputs.Q1,false);assert.equal(still.outputs.Q1,false);
 scan(p,m,false,false);const fresh=scan(p,m,true,false);
 assert.equal(m.blocks.C1?.count,1);assert.equal(fresh.outputs.Q1,false);
});
test('P0-03 CTD reset-last waits for a fresh edge after releasing RESET',()=>{
 const p=program('CTD','count-first',2),m={};
 scan(p,m,false,false);scan(p,m,true,true);scan(p,m,true,false);
 assert.equal(m.blocks.C1?.count,2);
 scan(p,m,false,false);scan(p,m,true,false);
 assert.equal(m.blocks.C1?.count,1);
});
test('P0-03 reset-first held RESET keeps CTU at zero across scans; fresh pulse counts',()=>{
 const p=program('CTU','reset-first'),m={};
 scan(p,m,false,false);scan(p,m,true,true);scan(p,m,true,true);
 assert.equal(m.blocks.C1?.count,0);
 scan(p,m,true,false);assert.equal(m.blocks.C1?.count,0);
 scan(p,m,false,false);scan(p,m,true,false);assert.equal(m.blocks.C1?.count,1);
});
test('P0-03 positive: CTU without reset still reaches Q1 on second distinct rising edge',()=>{
 const p=program(),m={};
 scan(p,m,false,false);scan(p,m,true,false);scan(p,m,false,false);
 const r=scan(p,m,true,false);assert.equal(m.blocks.C1?.count,2);assert.equal(r.outputs.Q1,true);
});
test('P0-03 preset reached before reset clears C1 and physical Q1',()=>{
 const p=program('CTU','count-first'),m={};
 scan(p,m,false,false);scan(p,m,true,false);scan(p,m,false,false);
 assert.equal(scan(p,m,true,false).outputs.Q1,true);
 const clear=scan(p,m,true,true);
 assert.equal(clear.outputs.Q1,false);assert.equal(m.blocks.C1?.count,0);
});
test('P0-03 RESET-only C1 does not retain counter memory or assign Q1',()=>{
 const p={version:1,rungs:[rung('reset','RESET','C1','I2'),rung('lamp','OUT','Q1','C1')]},m={values:{C1:true},blocks:{C1:{count:99}}};
 const r=scan(p,m,false,true);assert.equal(r.outputs.Q1,false);assert.equal(m.blocks.C1,undefined);
});
test('P0-03 CTU RESET program roundtrips through canonical file without mutation',()=>{
 const p=program('CTU','reset-first'),raw=IO.serialize(p,limits,'Sayaç'),got=IO.parse(raw,limits);
 assert.deepEqual(got,p);const m={};scan(got,m,true,true);assert.equal(m.blocks.C1?.count,0);
});
test('P0-03 existing timer RESET behavior stays unchanged',()=>{
 const p={version:1,rungs:[rung('timer','TON','T1','I1',{presetMs:100}),rung('reset','RESET','T1','I2'),rung('out','OUT','Q1','T1')]},m={};
 scan(p,m,true,false,0);const started=scan(p,m,true,false,110);assert.equal(started.outputs.Q1,true);
 const reset=scan(p,m,true,true,111);assert.equal(reset.outputs.Q1,false);assert.equal(m.blocks.T1,undefined);
});

// Actual original Simulation.solve and canonical 703-component catalogue.
const Simulation=require('../dist/simulation.js');
const previousWindow=global.window;
global.window=global;require('../dist/library.js');
const byId=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));
global.window=previousWindow;
function poweredCircuit(order='reset-first',type='CTU'){
 const plc={id:'plc',typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:program(type,order)};
 const count={id:'b1',typeId:'push-no',state:false},reset={id:'b2',typeId:'push-no',state:false},lamp={id:'lamp',typeId:'lamp-red'};
 const components=[{id:'ac',typeId:'supply-1p'},{id:'smps',typeId:'smps'},plc,count,reset,lamp];
 const wires=[['ac','L','smps','L'],['ac','N','smps','N'],['smps','P','plc','X10:1'],['smps','M','plc','X10:2'],['smps','M','plc','X10:6'],['smps','P','plc','X12:1'],['smps','M','plc','X12:2'],['smps','P','b1','13'],['b1','14','plc','X10:7'],['smps','P','b2','13'],['b2','14','plc','X10:8'],['plc','X12:3','lamp','X1'],['lamp','X2','smps','M']].map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp}}));
 const project={components,wires,junctions:[]};let n=0;
 return {plc,lamp,step(i1=false,i2=false){count.state=i1;reset.state=i2;const state=Simulation.solve(project,byId,{now:100+n++*10,reset:n===1});assert.equal(state.blocked,false);assert.equal(state.stable,true);return {count:plc._dtsLadderMemory?.blocks?.C1?.count,Q1:plc._plcRuntime.outputs['X12:3'],power:plc._plcRuntime.powered,active:lamp._active}}};
}
test('P0-03 actual 703 catalogue/SMPS/CPU 1211C, reset-first C1 ignores held count input',()=>{
 assert.equal(global.COMPONENT_LIBRARY.length,703);
 const {step}=poweredCircuit('reset-first');
 const values=[step(false,false),step(true,true),step(true,true),step(true,false),step(false,false),step(true,false)];
 assert.deepEqual(values.map(x=>x.count),[0,0,0,0,0,1]);
 assert.deepEqual(values.map(x=>x.Q1),[false,false,false,false,false,false]);
 assert.equal(values.every(x=>x.power),true);
});
test('P0-03 actual native solver, reset-last C1 does not invent an edge on release',()=>{
 const {step}=poweredCircuit('count-first');
 const values=[step(false,false),step(true,true),step(true,false),step(false,false),step(true,false),step(false,false),step(true,false)];
 assert.deepEqual(values.map(x=>x.count),[0,0,0,0,1,1,2]);
 assert.equal(values.at(-1).Q1,true);
});
