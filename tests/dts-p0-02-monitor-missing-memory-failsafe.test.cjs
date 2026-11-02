'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const Monitor=require('../dist/ladder-monitor.js');
const pins=[{id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
const limits={inputCount:6,outputCount:4};
function fixture(ref,kind='NO',memory={values:{}},input=true){
 const program={version:1,rungs:[{id:'R1',paths:[[{type:kind,ref}]],coil:{type:'OUT',ref:'Q1'}}]};
 const scan=Ladder.scan(program,{I1:input},memory||{},100,limits);
 assert.equal(scan.ok,true);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program,_dtsLadderTraces:scan.traces,
  _dtsLadderMemory:scan.memory,_plcRuntime:{powered:true,program:'dts-ladder-v1',
  inputs:Object.fromEntries(pins.filter(x=>x.signalType==='DI').map((p,i)=>[p.id,i===0?input:false])),
  outputs:Object.fromEntries(pins.filter(x=>x.signalType==='DO').map((p,i)=>[p.id,i===0?!!scan.outputs.Q1:false]))}};
 return {c,scan};
}
function snap(c){return Monitor.snapshot(c,cpu,true,true)}
for(const ref of ['M1','Q2','T1','C1']){
 test('negative: missing memory with forged active '+ref+' contact cannot be live',()=>{
  const {c}=fixture(ref,'NO',{values:{[ref]:false}});
  c._dtsLadderTraces=[{...c._dtsLadderTraces[0],pathStates:[true],active:true,value:true}];
  c._plcRuntime.outputs['X12:3']=true;
  delete c._dtsLadderMemory;
  assert.equal(snap(c).live,false);
  assert.equal(snap(c).outputs[0].value,null);
 });
 test('positive: valid false '+ref+' contact with scan memory remains live',()=>{
  const {c}=fixture(ref,'NO',{values:{[ref]:false}});
  assert.equal(snap(c).live,true);
  assert.equal(snap(c).outputs[0].value,false);
 });
}
test('negative: missing memory with forged inactive M1 NC contact cannot be live',()=>{
 const {c}=fixture('M1','NC',{values:{M1:false}});
 c._dtsLadderTraces=[{...c._dtsLadderTraces[0],pathStates:[false],active:false,value:false}];
 c._plcRuntime.outputs['X12:3']=false;
 delete c._dtsLadderMemory;
 assert.equal(snap(c).live,false);
});
test('positive: valid true M1 contact remains live',()=>{
 const {c}=fixture('M1','NO',{values:{M1:true}});
 assert.equal(snap(c).live,true);
 assert.equal(snap(c).outputs[0].value,true);
});
test('positive: absent M1 bit in genuine scan memory defaults false and remains live',()=>{
 const {c}=fixture('M1','NO',{values:{}});
 assert.equal(snap(c).live,true);
 assert.equal(snap(c).outputs[0].value,false);
});
test('positive: pure physical I1 trace remains live without scan memory',()=>{
 const {c}=fixture('I1');delete c._dtsLadderMemory;
 assert.equal(snap(c).live,true);
 assert.equal(snap(c).outputs[0].value,true);
});
test('negative: pure I1 stale input trace is blocked without scan memory',()=>{
 const {c}=fixture('I1');delete c._dtsLadderMemory;
 c._plcRuntime.inputs['X10:7']=false;
 assert.equal(snap(c).live,false);
});
test('positive: power loss and stopped monitor remain non-live',()=>{
 const {c}=fixture('M1','NO',{values:{M1:true}});
 c._plcRuntime.powered=false;
 assert.equal(snap(c).live,false);
 assert.equal(Monitor.snapshot(c,cpu,false,true).live,false);
});
test('negative: malformed saved program does not crash the monitor',()=>{
 const {c}=fixture('M1','NO',{values:{M1:true}});
 for(const malformed of [{version:1,rungs:[{}]},{version:1,rungs:'bad'},{version:1,rungs:null}]){
  c.ladderProgram=malformed;
  assert.doesNotThrow(()=>snap(c));
  assert.equal(snap(c).live,false);
 }
});
