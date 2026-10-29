'use strict';
// Native Simulation.solve with the real catalog; a boolean voltage() alone cannot
// establish the polarity of the verified CPU 1211C's separate power domains.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const defs=QA.catalog(),typeId='plc-hw-6es7211-1ae40-0xb0',model=defs[typeId];
const base=[
 ['g','P','plc','X10:1'],['g','M','plc','X10:2'],
 ['g','M','plc','X10:6'],['g','P','plc','X12:1'],['g','M','plc','X12:2'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','g','M'],['g','P','plc','X10:7']
];
function project(change){
 const pairs=base.map(row=>row.slice());
 if(change==='reverseCPU'){pairs[0][1]='M';pairs[1][1]='P'}
 if(change==='reverseBank'){pairs[3][1]='M';pairs[4][1]='P'}
 if(change==='reverseDI'){pairs[7][1]='M';pairs[2][1]='P'}
 if(change==='cutCPU')pairs.splice(0,1);
 if(change==='cutBank')pairs.splice(3,1);
 if(change==='cutDI')pairs.splice(7,1);
 return {components:[
  {id:'g',typeId:'supply-dc-plus'},
  {id:'plc',typeId,plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()},
  {id:'lamp',typeId:'lamp-green'}
 ],wires:pairs.map(([a,ap,b,bp],i)=>({
  id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]
 })),junctions:[],colorRoles:{}};
}
function solve(change,catalog=defs){
 const p=project(change),s=Native.solve(p,catalog,{now:1000});
 assert.equal(s.blocked,false);assert.equal(s.stable,true);
 return {cpu:p.components[1],lamp:p.components[2]};
}
for(const [change,powered,q,lamp] of [
 ['normal',true,true,true],['reverseCPU',false,false,false],
 ['reverseBank',true,false,false],['reverseDI',true,false,false],
 ['cutCPU',false,false,false],['cutBank',true,false,false],
 ['cutDI',true,false,false]
])test('native signed PLC wiring: '+change,()=>{
 assert.ok(model);assert.equal(Ladder.supportedPLC(model),true);
 const {cpu,lamp:load}=solve(change);
 assert.equal(cpu._plcRuntime.powered,powered);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],q);
 assert.equal(load._active,lamp);
});
test('reordered power pins cannot borrow output bank to power a disconnected CPU',()=>{
 const changed=JSON.parse(JSON.stringify(model));
 changed.pins=[
  ...changed.pins.filter(p=>/^X12:/.test(p.id)),
  ...changed.pins.filter(p=>!/^X12:/.test(p.id))
 ];
 assert.equal(Ladder.supportedPLC(changed),true);
 const {cpu,lamp}=solve('cutCPU',{...defs,[typeId]:changed});
 assert.equal(cpu._plcRuntime.powered,false);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(lamp._active,false);
});
test('missing CPU power terminals are rejected without virtual backplane fallback',()=>{
 const changed=JSON.parse(JSON.stringify(model));
 changed.pins=changed.pins.filter(p=>!['X10:1','X10:2'].includes(p.id));
 assert.equal(Ladder.supportedPLC(changed),false);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()};
 const net={voltage(){return true},dcVoltage(){return 24}};
 assert.equal(PLC.evaluate(c,changed,net,1000).powered,false);
});
test('legacy PLC boolean-voltage behavior remains scoped and unchanged',()=>{
 const old={id:'legacy',isPLC:true,outputType:'PNP',pins:[
  {id:'P',label:'L+',signalType:'POWER'},{id:'M',label:'M',signalType:'POWER'},
  {id:'I',signalType:'DI'},{id:'Q',signalType:'DO'}
 ]};
 const c={plcProgram:'mirror'};
 const net={voltage(_c,a,b){return a==='P'&&b==='M'||a==='I'&&b==='M'}};
 const state=PLC.evaluate(c,old,net,1000);
 assert.equal(state.powered,true);assert.equal(state.outputs.Q,true);
});
