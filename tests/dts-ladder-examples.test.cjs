'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const L=require('../dist/ladder-runtime.js'),Examples=require('../dist/ladder-examples.js');
const limits={inputCount:6,outputCount:4};
test('only hardware-compatible programs show in the sample selector',()=>{
 assert.equal(Examples.list(limits).length,4);
 assert.deepEqual(Examples.list({inputCount:1,outputCount:1}).map(x=>x.id),['ton']);
 for(const e of Examples.list(limits))assert.equal(L.validate(Examples.build(e.id,limits),limits).ok,true);
 assert.throws(()=>Examples.build('interlock',{inputCount:2,outputCount:1}));
});
test('Start/Stop seals in until STOP, never auto-restarts',()=>{
 const p=Examples.build('seal',limits),m={};
 assert.equal(L.scan(p,{I1:true},m,1,limits).outputs.Q1,true);
 assert.equal(L.scan(p,{},m,2,limits).outputs.Q1,true);
 assert.equal(L.scan(p,{I2:true},m,3,limits).outputs.Q1,false);
 assert.equal(L.scan(p,{},m,4,limits).outputs.Q1,false);
});
test('TON waits 1,500ms and immediately resets on release',()=>{
 const p=Examples.build('ton',limits),m={};
 assert.equal(L.scan(p,{I1:true},m,0,limits).outputs.Q1,false);
 assert.equal(L.scan(p,{I1:true},m,1499,limits).outputs.Q1,false);
 assert.equal(L.scan(p,{I1:true},m,1500,limits).outputs.Q1,true);
 assert.equal(L.scan(p,{},m,1501,limits).outputs.Q1,false);
});
test('counter counts rising edges, resets on I2',()=>{
 const p=Examples.build('counter',limits),m={};
 assert.equal(L.scan(p,{I1:true},m,1,limits).outputs.Q1,false);
 L.scan(p,{},m,2,limits);
 assert.equal(L.scan(p,{I1:true},m,3,limits).outputs.Q1,false);
 L.scan(p,{},m,4,limits);
 assert.equal(L.scan(p,{I1:true},m,5,limits).outputs.Q1,true);
 assert.equal(L.scan(p,{I2:true},m,6,limits).outputs.Q1,false);
});
test('forward/reverse outputs cannot be simultaneously active',()=>{
 const p=Examples.build('interlock',limits),m={};
 for(const [time,inputs] of [[1,{I1:true,I3:true}],[2,{}],[3,{I2:true}],[4,{I3:true}],[5,{I1:true}]]){
  const q=L.scan(p,inputs,m,time,limits).outputs;
  assert.equal(q.Q1&&q.Q2,false,'unsafe dual state at '+time);
 }
});
test('draft clone cannot mutate the source example',()=>{
 const a=Examples.build('seal',limits),b=Examples.build('seal',limits);
 a.rungs[0].paths[0][0].ref='I6';
 assert.equal(b.rungs[0].paths[0][0].ref,'I1');
});
