'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const FBD=require('../dist/fbd-view.js');
const Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:4,outputCount:4};
const rung=(id,type,ref)=>({
 id,paths:[[{type:'NO',ref:'I1'}]],
 coil:{type,ref,...(['TON','TOF','TP'].includes(type)?{presetMs:100}:
   ['CTU','CTD'].includes(type)?{preset:3}:{})}
});
const pg=(...rungs)=>({version:1,rungs});
test('FBD conversion OUT to TON chooses T2 if T1 is occupied',()=>{
 const original=pg(rung('a','TON','T1'),rung('b','OUT','Q1'));
 const result=FBD.editCoil(original,1,{type:'TON'},limits);
 assert.equal(result.ok,true);
 assert.equal(result.program.rungs[1].coil.ref,'T2');
 assert.equal(Ladder.validate(result.program,limits).ok,true);
 assert.equal(original.rungs[1].coil.type,'OUT');
 assert.equal(original.rungs[1].coil.ref,'Q1');
});
test('FBD conversion OUT to CTD chooses C2 when CTU already owns C1',()=>{
 const original=pg(rung('a','CTU','C1'),rung('b','OUT','Q1'));
 const result=FBD.editCoil(original,1,{type:'CTD'},limits);
 assert.equal(result.ok,true);
 assert.equal(result.program.rungs[1].coil.ref,'C2');
});
test('FBD timer/counter type conversion preserves its own free address',()=>{
 const timer=pg(rung('a','TON','T2'));
 const t=FBD.editCoil(timer,0,{type:'TP'},limits);
 assert.equal(t.ok,true);assert.equal(t.program.rungs[0].coil.ref,'T2');
 const counter=pg(rung('c','CTU','C1'));
 const c=FBD.editCoil(counter,0,{type:'CTD'},limits);
 assert.equal(c.ok,true);assert.equal(c.program.rungs[0].coil.ref,'C1');
});
test('explicit duplicate T address is rejected without changing draft',()=>{
 const original=pg(rung('a','TON','T1'),rung('b','TOF','T2'));
 const result=FBD.editCoil(original,1,{ref:'T1'},limits);
 assert.equal(result.ok,false);
 assert.equal(original.rungs[1].coil.ref,'T2');
});
test('all 16 timer slots occupied rejects new timer and keeps original',()=>{
 const original=pg(...Array.from({length:16},(_,i)=>rung('t'+i,'TON','T'+(i+1))),
  rung('out','OUT','Q1'));
 assert.equal(Ladder.validate(original,limits).ok,true);
 const result=FBD.editCoil(original,16,{type:'TP'},limits);
 assert.equal(result.ok,false);
 assert.equal(original.rungs[16].coil.type,'OUT');
 assert.equal(original.rungs[16].coil.ref,'Q1');
});
test('RESET to timer reference does not reserve the timer block address',()=>{
 const original=pg(rung('reset','RESET','T2'),rung('timer','TON','T1'),rung('out','OUT','Q1'));
 const result=FBD.editCoil(original,2,{type:'TOF'},limits);
 assert.equal(result.ok,true);
 assert.equal(result.program.rungs[2].coil.ref,'T2');
});
test('non-timer FBD edit and valid explicit ref changes remain intact',()=>{
 const p=pg(rung('a','TON','T1'),rung('b','TON','T2'),rung('q','OUT','Q1'));
 const ref=FBD.editCoil(p,1,{ref:'T3'},limits);
 assert.equal(ref.ok,true);assert.equal(ref.program.rungs[1].coil.ref,'T3');
 const set=FBD.editCoil(p,2,{type:'SET'},limits);
 assert.equal(set.ok,true);assert.equal(set.program.rungs[2].coil.ref,'Q1');
});
