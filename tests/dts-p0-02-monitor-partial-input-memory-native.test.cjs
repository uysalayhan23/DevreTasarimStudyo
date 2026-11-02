'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const M=require('../dist/ladder-monitor.js');
const pins=[{id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
function fixture(kind='NO',input=true,internal=true){
 const contacts=[{type:kind,ref:'I1'},...(internal?[{type:'NO',ref:'M1'}]:[])];
 const program={version:1,rungs:[{id:'R1',paths:[contacts],coil:{type:'OUT',ref:'Q1'}}]};
 const scanned=L.scan(program,{I1:input},{values:{M1:true}},100,{inputCount:6,outputCount:4});
 assert.equal(scanned.ok,true);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program,
  _dtsLadderTraces:scanned.traces,_dtsLadderMemory:scanned.memory,
  _plcRuntime:{powered:true,program:'dts-ladder-v1',
   inputs:Object.fromEntries(pins.filter(p=>p.signalType==='DI').map((p,i)=>[p.id,i===0?input:false])),
   outputs:Object.fromEntries(pins.filter(p=>p.signalType==='DO').map((p,i)=>[p.id,i===0?scanned.outputs.Q1:false]))}};
 return c;
}
const snap=c=>M.snapshot(c,cpu,true,true);
for(const kind of ['NO','NC'])for(const input of [true,false]){
 test('negative: '+kind+' I1='+input+' with internal M1 and missing I1 sample is not live',()=>{
  const c=fixture(kind,input,true);delete c._dtsLadderMemory.values.I1;
  assert.equal(snap(c).live,false);
  assert.equal(snap(c).outputs[0].value,null);
 });
 test('positive: '+kind+' I1='+input+' with complete native memory remains live',()=>{
  const c=fixture(kind,input,true);assert.equal(snap(c).live,true);
 });
}
test('negative: missing unused I6 sample still invalidates complete native scan memory',()=>{
 const c=fixture();delete c._dtsLadderMemory.values.I6;assert.equal(snap(c).live,false);
});
test('negative: wrong type I2 sample invalidates complete native scan memory',()=>{
 const c=fixture();c._dtsLadderMemory.values.I2='false';assert.equal(snap(c).live,false);
});
test('positive: pure physical I path remains live without legacy scan memory',()=>{
 const c=fixture('NO',true,false);delete c._dtsLadderMemory;assert.equal(snap(c).live,true);
});
test('negative: missing entire internal memory still fails closed',()=>{
 const c=fixture();delete c._dtsLadderMemory;assert.equal(snap(c).live,false);
});
test('negative: mismatched physical I input fails closed with complete memory',()=>{
 const c=fixture();c._plcRuntime.inputs['X10:7']=false;assert.equal(snap(c).live,false);
});
test('negative: PLC power loss hides stale values',()=>{
 const c=fixture();c._plcRuntime.powered=false;assert.equal(snap(c).live,false);
});
