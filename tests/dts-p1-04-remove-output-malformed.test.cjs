'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {removeOutput}=require('../dist/ladder-editor.js');
const Ladder=require('../dist/ladder-runtime.js');
const mk=coil=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil}]});

test('missing coil is rejected without throwing',()=>{
 const result=removeOutput(mk(undefined),0,{inputCount:1,outputCount:2});
 assert.equal(result.ok,false);
});
test('null coil is rejected without throwing',()=>{
 const result=removeOutput(mk(null),0,{inputCount:1,outputCount:2});
 assert.equal(result.ok,false);
});
test('valid OUT Q2 becomes an address-free NOP without mutating input',()=>{
 const original=mk({type:'OUT',ref:'Q2'}),before=JSON.stringify(original);
 const result=removeOutput(original,0,{inputCount:1,outputCount:2});
 assert.equal(result.ok,true);
 assert.deepEqual(result.program.rungs[0].coil,{type:'NOP',ref:''});
 assert.equal(Ladder.validate(result.program,{inputCount:1,outputCount:2}).ok,true);
 assert.equal(JSON.stringify(original),before);
});
test('valid SET M2 becomes NOP',()=>{
 const result=removeOutput(mk({type:'SET',ref:'M2'}),0,{inputCount:1,outputCount:0});
 assert.equal(result.ok,true);
 assert.deepEqual(result.program.rungs[0].coil,{type:'NOP',ref:''});
});
test('existing NOP is rejected without mutation',()=>{
 const original=mk({type:'NOP',ref:''}),before=JSON.stringify(original);
 assert.equal(removeOutput(original,0,{}).ok,false);
 assert.equal(JSON.stringify(original),before);
});
test('missing Network index is rejected',()=>{
 assert.equal(removeOutput(mk({type:'OUT',ref:'Q1'}),2,{}).ok,false);
});
test('fractional index is rejected',()=>{
 assert.equal(removeOutput(mk({type:'OUT',ref:'Q1'}),0.5,{}).ok,false);
});
test('negative index is rejected',()=>{
 assert.equal(removeOutput(mk({type:'OUT',ref:'Q1'}),-1,{}).ok,false);
});
