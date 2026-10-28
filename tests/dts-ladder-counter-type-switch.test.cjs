'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const limits={inputCount:2,outputCount:2};
const program=type=>({version:1,rungs:[{id:'counter',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'C1',preset:3}},{id:'load',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q1'}}]});
function run(steps){const mem={};return steps.map(([type,now,on])=>{const result=L.scan(program(type),{I1:on},mem,now,limits);assert.equal(result.ok,true);return [result.traces[0].count,result.outputs.Q1]})}
test('CTU to CTD reloads preset, not stale count',()=>{assert.deepEqual(run([['CTU',0,false],['CTD',1,false],['CTD',2,true]]),[[0,false],[3,false],[2,false]])});
test('CTD to CTU starts from zero and clears stale output',()=>{assert.deepEqual(run([['CTD',0,false],['CTD',1,true],['CTD',2,false],['CTD',3,true],['CTD',4,false],['CTD',5,true],['CTU',6,false]]),[[3,false],[2,false],[2,false],[1,false],[1,false],[0,true],[0,false]])});
test('unchanged CTU retains rising edge and same-timestamp safety',()=>{assert.deepEqual(run([['CTU',0,false],['CTU',1,true],['CTU',1,true],['CTU',2,false],['CTU',3,true]]),[[0,false],[1,false],[1,false],[1,false],[2,false]])});
