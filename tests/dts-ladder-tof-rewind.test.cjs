'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const limits={inputCount:2,outputCount:2};
function timer(type){
 return {version:1,rungs:[
  {id:'timer',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'T1',presetMs:100}},
  {id:'out',paths:[[{type:'NO',ref:'T1'}]],coil:{type:'OUT',ref:'Q1'}}
 ]};
}
function run(type,steps){
 const mem={},program=timer(type);
 return steps.map(([now,input])=>{
  const r=L.scan(program,{I1:input},mem,now,limits);
  assert.equal(r.ok,true);
  return r.outputs.Q1;
 });
}
test('TOF off-delay restarts safely when virtual clock rewinds',()=>{
 assert.deepEqual(run('TOF',[[1000,true],[1010,false],[1050,false],[0,false],[99,false],[100,false]]),
  [true,true,true,true,true,false]);
});
test('TOF normal expiry remains unchanged',()=>{
 assert.deepEqual(run('TOF',[[0,true],[10,false],[109,false],[110,false]]),
  [true,true,true,false]);
});
test('TOF input rising cancels pending off delay',()=>{
 assert.deepEqual(run('TOF',[[0,true],[10,false],[50,true],[120,false],[219,false],[220,false]]),
  [true,true,true,true,true,false]);
});
test('TOF does not energize with initially low input',()=>{
 assert.deepEqual(run('TOF',[[0,false],[50,false],[100,false]]),[false,false,false]);
});
test('TON and TP timing remain unchanged',()=>{
 assert.deepEqual(run('TON',[[0,true],[99,true],[100,true],[101,false]]),[false,false,true,false]);
 assert.deepEqual(run('TP',[[0,true],[10,false],[20,true],[100,true],[102,false],[103,true]]),
  [true,true,true,false,false,true]);
});
