'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const limits={inputCount:2,outputCount:2};
const program={version:1,rungs:[
 {id:'pulse',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TP',ref:'T1',presetMs:100}},
 {id:'load',paths:[[{type:'NO',ref:'T1'}]],coil:{type:'OUT',ref:'Q1'}}
]};
test('TP ignores new rising edges during its active pulse (non-retriggerable)',()=>{
 const memory={},at=(t,v)=>L.scan(program,{I1:v},memory,t,limits);
 assert.equal(at(0,true).outputs.Q1,true);
 assert.equal(at(10,false).outputs.Q1,true);
 assert.equal(at(20,true).outputs.Q1,true);
 assert.equal(at(99,true).outputs.Q1,true);
 assert.equal(at(100,true).outputs.Q1,false,'second edge at 20ms must not extend 100ms pulse');
 assert.equal(at(101,true).outputs.Q1,false,'held input cannot start another pulse');
 assert.equal(at(102,false).outputs.Q1,false);
 assert.equal(at(103,true).outputs.Q1,true,'fresh rising edge after expiry can rearm');
 assert.equal(at(203,true).outputs.Q1,false);
});
test('TP stays active across an input release and resets on fresh memory',()=>{
 const memory={},at=(t,v)=>L.scan(program,{I1:v},memory,t,limits);
 assert.equal(at(500,true).outputs.Q1,true);
 assert.equal(at(550,false).outputs.Q1,true);
 assert.equal(at(600,false).outputs.Q1,false);
 assert.equal(L.scan(program,{I1:true},{},601,limits).outputs.Q1,true,'new powered run starts clean');
});
test('TP rejects an invalid program without energizing outputs',()=>{
 const invalid=structuredClone(program);invalid.rungs[0].coil.presetMs=0;
 const result=L.scan(invalid,{I1:true},{},0,limits);
 assert.equal(result.ok,false);assert.deepEqual(result.outputs,{});
});
test('TP accepts a fresh rising edge exactly at pulse expiry',()=>{
 const memory={},at=(t,v)=>L.scan(program,{I1:v},memory,t,limits);
 assert.equal(at(0,true).outputs.Q1,true);
 assert.equal(at(50,false).outputs.Q1,true);
 assert.equal(at(100,true).outputs.Q1,true,'new pulse may begin after first expires');
 assert.equal(at(199,true).outputs.Q1,true);
 assert.equal(at(200,true).outputs.Q1,false);
});
test('TP virtual clock rewind does not keep a future pulse energized',()=>{
 const memory={},at=(t,v)=>L.scan(program,{I1:v},memory,t,limits);
 assert.equal(at(1000,true).outputs.Q1,true);
 assert.equal(at(1001,false).outputs.Q1,true);
 assert.equal(at(0,false).outputs.Q1,false);
 assert.equal(at(1,true).outputs.Q1,true);
});
