'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const Toolbox=require('../dist/ladder-toolbox.js');
const limits={inputCount:4,outputCount:4};
const program=(type,ref)=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref,...(['TON','TOF','TP'].includes(type)?{presetMs:1000}:['CTU','CTD'].includes(type)?{preset:2}:{})}}]});
for(const [type,ref] of [['OUT','Q2'],['SET','Q4'],['OUT','M7'],['TON','T3'],['CTU','C4'],['RESET','Q3']]){
 test('RESET palette preserves '+type+' '+ref,()=>{
  const original=program(type,ref),before=JSON.stringify(original);
  const result=Toolbox.apply(original,'RESET',{kind:'coil',r:0},limits);
  assert.equal(result.ok,true);assert.deepEqual(result.program.rungs[0].coil,{type:'RESET',ref});
  assert.equal(Ladder.validate(result.program,limits).ok,true);
  assert.equal(JSON.stringify(original),before);
 });
}
test('NOP defaults to Q1 without an existing target',()=>{
 const result=Toolbox.apply(program('NOP',''),'RESET',{kind:'coil',r:0},limits);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[0].coil.ref,'Q1');
});
test('zero-output PLC uses M1 fallback',()=>{
 const result=Toolbox.apply(program('NOP',''),'RESET',{kind:'coil',r:0},{inputCount:4,outputCount:0});
 assert.equal(result.ok,true);assert.equal(result.program.rungs[0].coil.ref,'M1');
});
test('malformed drop index does not mutate the original',()=>{
 const original=program('OUT','Q2'),before=JSON.stringify(original);
 assert.equal(Toolbox.apply(original,'RESET',{kind:'coil',r:null},limits).ok,false);
 assert.equal(JSON.stringify(original),before);
});
test('contact drop zone cannot receive RESET',()=>{
 assert.equal(Toolbox.apply(program('OUT','Q2'),'RESET',{kind:'contact',r:0,p:0},limits).ok,false);
});
test('real Ladder scan leaves unrelated Q1 energized',()=>{
 const original={version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
  {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q2'}}
 ]};
 const result=Toolbox.apply(original,'RESET',{kind:'coil',r:1},limits);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.ref,'Q2');
 const scanned=Ladder.scan(result.program,{I1:true,I2:true},{},0,limits);
 assert.equal(scanned.ok,true);assert.equal(scanned.outputs.Q1,true);
 assert.equal(scanned.traces[1].coil,'Q2');
});
