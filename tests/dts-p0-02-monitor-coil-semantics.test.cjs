'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),M=require('../dist/ladder-monitor.js');
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},{id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
const program=(type)=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'Q1'}}]});
function fixture(type,input){
 const p=program(type),bits=Object.fromEntries(Array.from({length:6},(_,i)=>['I'+(i+1),i===0&&input]));
 const scan=L.scan(p,bits,{},100,{inputCount:6,outputCount:4});assert.equal(scan.ok,true);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p,_dtsLadderTraces:scan.traces,
  _dtsLadderMemory:scan.memory,_plcRuntime:{powered:true,program:'dts-ladder-v1',
   inputs:Object.fromEntries(d.pins.filter(x=>x.signalType==='DI').map((x,i)=>[x.id,bits['I'+(i+1)]])),
   outputs:Object.fromEntries(d.pins.filter(x=>x.signalType==='DO').map((x,i)=>[x.id,!!scan.outputs['Q'+(i+1)]]))}};
 return c;
}
function forged(type,input,claim){
 const c=fixture(type,input);
 c._dtsLadderTraces[0].value=claim;
 c._dtsLadderMemory.values.Q1=claim;
 c._plcRuntime.outputs['X12:3']=claim;
 return c;
}
test('negative: active SET cannot claim Q=0 and remain live',()=>{
 assert.equal(M.snapshot(forged('SET',true,false),d,true,true).live,false);
});
test('negative: active RESET cannot claim Q=1 and remain live',()=>{
 assert.equal(M.snapshot(forged('RESET',true,true),d,true,true).live,false);
});
test('negative: RESET-only inactive cannot invent Q=1 and remain live',()=>{
 assert.equal(M.snapshot(forged('RESET',false,true),d,true,true).live,false);
});
test('positive: native OUT ON/OFF remains live',()=>{
 for(const v of [true,false])assert.equal(M.snapshot(fixture('OUT',v),d,true,true).live,true);
});
test('positive: native SET active and native RESET active remain live',()=>{
 assert.equal(M.snapshot(fixture('SET',true),d,true,true).live,true);
 assert.equal(M.snapshot(fixture('RESET',true),d,true,true).live,true);
});
test('positive: native SET latch after release remains live',()=>{
 const c=fixture('SET',true),bits=Object.fromEntries(Array.from({length:6},(_,i)=>['I'+(i+1),false]));
 const scan=L.scan(c.ladderProgram,bits,c._dtsLadderMemory,200,{inputCount:6,outputCount:4});
 c._dtsLadderTraces=scan.traces;c._plcRuntime.inputs['X10:7']=false;
 c._plcRuntime.outputs['X12:3']=true;
 assert.equal(M.snapshot(c,d,true,true).live,true);
});
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const catalog=QA.catalog(),device=catalog['plc-hw-6es7211-1ae40-0xb0'];
const wiring=[
 ['g','P','plc','X10:1'],['g','M','plc','X10:2'],['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],['g','M','plc','X12:2'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','g','M'],['g','P','plc','X10:7']
];
function physical(type){
 const project={components:[{id:'g',typeId:'supply-dc-plus'},
  {id:'plc',typeId:device.id,plcProgram:'dts-ladder-v1',ladderProgram:program(type)},
  {id:'lamp',typeId:'lamp-green'}],
  wires:wiring.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]})),
  junctions:[],colorRoles:{}};
 const solved=Native.solve(project,catalog,{now:1500});
 assert.equal(solved.blocked,false);assert.equal(solved.stable,true);
 return project.components[1];
}
test('703 catalogue + original Simulation.solve: genuine SET/RESET traces remain live',()=>{
 for(const type of ['SET','RESET']){
  const c=physical(type);
  assert.equal(M.snapshot(c,device,true,true).live,true);
  assert.equal(c._plcRuntime.outputs['X12:3'],type==='SET');
 }
});
test('703 catalogue + original Simulation.solve: forged SET/RESET telemetry fails closed',()=>{
 for(const [type,claim] of [['SET',false],['RESET',true]]){
  const c=physical(type);
  c._dtsLadderTraces[0].value=claim;
  c._dtsLadderMemory.values.Q1=claim;
  c._plcRuntime.outputs['X12:3']=claim;
  assert.equal(M.snapshot(c,device,true,true).live,false);
 }
});
