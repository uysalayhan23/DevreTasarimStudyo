'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const FBD=require('../dist/fbd-view.js');
const limits={inputCount:4,outputCount:4};
const rung=(id,type,ref,input='I1')=>({
 id,paths:[[{type:'NO',ref:input}]],
 coil:{type,ref,...(['TON','TOF','TP'].includes(type)?{presetMs:100}:
  ['CTU','CTD'].includes(type)?{preset:3}:{})}
});
const program=(...rungs)=>({version:1,rungs});
test('two TON owners sharing T1 are invalid',()=>{
 const p=program(rung('a','TON','T1'),rung('b','TON','T1','I2'));
 assert.equal(L.validate(p,limits).ok,false);
});
test('different timing commands cannot share T1',()=>{
 const p=program(rung('a','TON','T1'),rung('b','TP','T1','I2'));
 assert.equal(L.validate(p,limits).ok,false);
});
test('two counters may not write C1 (same or different type)',()=>{
 for(const type of ['CTU','CTD']){
  const p=program(rung('a','CTU','C1'),rung('b',type,'C1','I2'));
  assert.equal(L.validate(p,limits).ok,false);
 }
});
test('distinct T1 T2 C1 blocks and explicit RESET remain valid',()=>{
 const p=program(rung('a','TON','T1'),rung('b','TOF','T2','I2'),rung('c','CTU','C1','I3'),
  rung('d','RESET','T1','I4'),rung('e','RESET','C1','I4'));
 assert.equal(L.validate(p,limits).ok,true);
});
test('invalid shared timer returns no outputs or state mutation',()=>{
 const p=program(rung('a','TON','T1'),rung('b','TON','T1','I2'),rung('q','OUT','Q1','T1'));
 const memory={};
 const r=L.scan(p,{I1:true,I2:false},memory,100,limits);
 assert.equal(r.ok,false);assert.deepEqual(r.outputs,{});
 assert.deepEqual(memory,{});
});
test('one TON still reaches Q1 on time',()=>{
 const p=program(rung('a','TON','T1'),rung('q','OUT','Q1','T1'));
 const memory={};
 assert.equal(L.scan(p,{I1:true},memory,0,limits).outputs.Q1,false);
 assert.equal(L.scan(p,{I1:true},memory,100,limits).outputs.Q1,true);
});
test('FBD refuses conflicting timer address without mutating the draft',()=>{
 const p=program(rung('a','TON','T1'),rung('b','TON','T2','I2'));
 const result=FBD.editCoil(p,1,{ref:'T1'},limits);
 assert.equal(result.ok,false);assert.equal(p.rungs[1].coil.ref,'T2');
 const valid=FBD.editCoil(p,1,{ref:'T3'},limits);
 assert.equal(valid.ok,true);assert.equal(valid.program.rungs[1].coil.ref,'T3');
});
