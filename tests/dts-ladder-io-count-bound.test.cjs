'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const nop={version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]};
test('oversized output bank is rejected before scan allocation',()=>{
 const result=L.scan(nop,{}, {},0,{inputCount:6,outputCount:1000});
 assert.equal(result.ok,false);assert.deepEqual(result.outputs,{});
});
test('oversized input bank is rejected',()=>assert.equal(L.validate(nop,{inputCount:17,outputCount:4}).ok,false));
test('negative I/O count is rejected',()=>assert.equal(L.validate(nop,{inputCount:-1,outputCount:4}).ok,false));
test('verified CPU six-input four-output limits remain valid',()=>{
 const result=L.scan(nop,{}, {},0,{inputCount:6,outputCount:4});
 assert.equal(result.ok,true);assert.equal(Object.keys(result.outputs).length,4);
 assert.equal(Object.values(result.outputs).some(Boolean),false);
});
