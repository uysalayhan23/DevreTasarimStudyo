'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
function program(type,preset=100){
 return {version:1,rungs:[
  {id:'T',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:type==='CTU'?'C1':'T1',...(type==='CTU'?{preset:2}:{presetMs:preset})}},
  {id:'Q',paths:[[{type:'NO',ref:type==='CTU'?'C1':'T1'}]],coil:{type:'OUT',ref:'Q1'}}
 ]};
}
function outputs(source,steps){
 let memory={};
 return steps.map(([now,input])=>{
  const result=Ladder.scan(source,{I1:input},memory,now,limits);
  assert.equal(result.ok,true,result.error);
  memory=result.memory;
  return result.outputs.Q1;
 });
}
test('TOF expired output stays off after virtual clock rewind',()=>{
 assert.deepEqual(outputs(program('TOF'),[[0,true],[1,false],[201,false],[0,false]]),[true,true,false,false]);
});
test('TOF pending delay is safely cancelled by rewind without active input',()=>{
 assert.deepEqual(outputs(program('TOF'),[[0,true],[20,false],[30,false],[5,false]]),[true,true,true,false]);
});
test('TOF re-arms normally after rewind and a new energized input',()=>{
 assert.deepEqual(outputs(program('TOF'),[[0,true],[1,false],[201,false],[0,false],[2,true],[3,false],[104,false]]),
  [true,true,false,false,true,true,false]);
});
test('TOF ordinary delay is unchanged',()=>{
 assert.deepEqual(outputs(program('TOF'),[[0,true],[10,false],[99,false],[110,false]]),[true,true,true,false]);
});
test('TON elapsed delay restarts on rewind',()=>{
 assert.deepEqual(outputs(program('TON'),[[0,true],[110,true],[0,true],[99,true],[100,true]]),[false,true,false,false,true]);
});
test('TP expired pulse cannot reappear after rewind; a fresh edge works',()=>{
 assert.deepEqual(outputs(program('TP'),[[0,true],[101,false],[0,false],[2,true],[52,true],[103,true]]),
  [true,false,false,true,true,false]);
});
test('counter memory survives a timer-only clock rewind',()=>{
 assert.deepEqual(outputs(program('CTU'),[[0,false],[1,true],[2,false],[3,true],[0,false]]),
  [false,false,false,true,true]);
});
test('independent SET M latch survives a timer-only clock rewind',()=>{
 const source={version:1,rungs:[
  {id:'M',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'M1'}},
  {id:'Q',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'Q1'}}
 ]};
 assert.deepEqual(outputs(source,[[0,true],[101,false],[0,false]]),[true,true,true]);
});
