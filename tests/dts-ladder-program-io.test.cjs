'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const IO=require('../dist/ladder-program-io.js');
const p={version:1,rungs:[{id:'R1',comment:'Eğitim',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const limits={inputCount:6,outputCount:4};
test('DTS ladder export/import retains authentic rung program',()=>{
 const text=IO.serialize(p,limits,'DTS');assert.equal(IO.parse(text,limits).rungs[0].comment,'Eğitim');
 const parsed=IO.parse(text,limits);parsed.rungs[0].comment='Changed';assert.equal(p.rungs[0].comment,'Eğitim');
});
test('Foreign formats, malformed JSON and invalid pin ranges are rejected',()=>{
 for(const raw of ['{}','[]','no JSON'])assert.throws(()=>IO.parse(raw,limits));
 assert.throws(()=>IO.parse(IO.serialize(p,limits),{inputCount:0,outputCount:0}));
});
test('Serialized size is limited to 512 KiB',()=>assert.throws(()=>IO.parse('x'.repeat(IO.maxBytes+1),limits)));
