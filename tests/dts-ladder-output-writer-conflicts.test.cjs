'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
function program(coils){
 return {version:1,rungs:coils.map(([type,ref],i)=>({
  id:'R'+(i+1),paths:[[{type:'NO',ref:'I'+(i+1)}]],coil:{type,ref}
 }))};
}
test('duplicate OUT on Q is rejected before any physical scan',()=>{
 const p=program([['OUT','Q1'],['OUT','Q1']]);
 assert.equal(Ladder.validate(p,limits).ok,false);
 assert.equal(Ladder.scan(p,{I1:true,I2:false},{},0,limits).ok,false);
});
test('mixed OUT and SET on same Q is rejected',()=>{
 assert.equal(Ladder.validate(program([['OUT','Q1'],['SET','Q1']]),limits).ok,false);
});
test('duplicate SET on M is rejected',()=>{
 assert.equal(Ladder.validate(program([['SET','M1'],['SET','M1']]),limits).ok,false);
});
test('different Q outputs remain valid',()=>{
 assert.equal(Ladder.validate(program([['OUT','Q1'],['OUT','Q2']]),limits).ok,true);
});
test('OUT and RESET on same Q remain supported',()=>{
 const p=program([['OUT','Q1'],['RESET','Q1']]);
 assert.equal(Ladder.validate(p,limits).ok,true);
 assert.equal(Ladder.scan(p,{I1:true,I2:true},{},0,limits).outputs.Q1,false);
});
test('SET and RESET on same M remain supported',()=>{
 assert.equal(Ladder.validate(program([['SET','M1'],['RESET','M1']]),limits).ok,true);
});
test('RESET-only Q stays valid and de-energized',()=>{
 const p=program([['RESET','Q1']]);
 assert.equal(Ladder.validate(p,limits).ok,true);
 assert.equal(Ladder.scan(p,{I1:true},{values:{Q1:true}},0,limits).outputs.Q1,false);
});
test('different address families do not conflict',()=>{
 assert.equal(Ladder.validate(program([['OUT','M1'],['OUT','Q1']]),limits).ok,true);
});
