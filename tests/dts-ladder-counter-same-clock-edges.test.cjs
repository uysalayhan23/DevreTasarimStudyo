'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
function run(type,steps){
 const program={version:1,rungs:[
  {id:'C',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'C1',preset:2}},
  {id:'Q',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q1'}}
 ]};
 let memory={};
 return steps.map(([now,active])=>{
  const r=L.scan(program,{I1:active},memory,now,{inputCount:6,outputCount:4});
  assert.equal(r.ok,true,r.error);memory=r.memory;
  return [r.traces[0].count,r.outputs.Q1];
 });
}
test('CTU counts separate rising edges at unchanged virtual time',()=>{
 assert.deepEqual(run('CTU',[[0,false],[0,true],[0,false],[0,true]]),
 [[0,false],[1,false],[1,false],[2,true]]);
});
test('CTD counts separate rising edges at unchanged virtual time',()=>{
 assert.deepEqual(run('CTD',[[0,false],[0,true],[0,false],[0,true]]),
 [[2,false],[1,false],[1,false],[0,true]]);
});
test('unchanged active input cannot double count',()=>{
 assert.deepEqual(run('CTU',[[0,true],[0,true],[0,true]]),
 [[1,false],[1,false],[1,false]]);
});
test('normal CTU rising edges remain unchanged',()=>{
 assert.deepEqual(run('CTU',[[0,false],[1,true],[2,false],[3,true]]),
 [[0,false],[1,false],[1,false],[2,true]]);
});
test('normal CTD falling values remain unchanged',()=>{
 assert.deepEqual(run('CTD',[[0,false],[1,true],[2,false],[3,true]]),
 [[2,false],[1,false],[1,false],[0,true]]);
});
