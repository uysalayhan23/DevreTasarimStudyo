'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Editor=require('../dist/ladder-editor.js');
const Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,ref='I1')=>({id,paths:[[{type:'NO',ref}]],coil:{type:'NOP',ref:''}});
const original=()=>({version:1,rungs:[rung('R1'),rung('R2','I2')]});
test('copy inserts independent network with a unique ID without mutating source',()=>{
 const source=original(),result=Editor.editNetworkOrder(source,'copy',0,limits);
 assert.equal(result.ok,true);assert.deepEqual(result.program.rungs.map(r=>r.id),['R1','R3','R2']);
 result.program.rungs[1].paths[0][0].ref='I3';
 assert.equal(source.rungs[0].paths[0][0].ref,'I1');
 assert.equal(source.rungs.length,2);
 assert.equal(Ladder.validate(result.program,limits).ok,true);
});
test('moves maintain valid programs and do not mutate the original',()=>{
 const source=original();
 assert.deepEqual(Editor.editNetworkOrder(source,'down',0,limits).program.rungs.map(r=>r.id),['R2','R1']);
 assert.deepEqual(Editor.editNetworkOrder(source,'up',1,limits).program.rungs.map(r=>r.id),['R2','R1']);
 assert.deepEqual(source.rungs.map(r=>r.id),['R1','R2']);
});
test('boundary, missing index and unknown operation are rejected',()=>{
 const source=original();
 for(const [action,index] of [['up',0],['down',1],['copy',-1],['copy',2],['erase',0]])
  assert.equal(Editor.editNetworkOrder(source,action,index,limits).ok,false);
});
test('32 network maximum rejects copy and preserves source',()=>{
 const source={version:1,rungs:Array.from({length:32},(_,i)=>rung('R'+(i+1)))};
 assert.equal(Editor.editNetworkOrder(source,'copy',0,limits).ok,false);
 assert.equal(source.rungs.length,32);
});
test('copied timer network with duplicate timer ownership is rejected',()=>{
 const source=original();
 source.rungs[0].coil={type:'TON',ref:'T1',presetMs:100};
 assert.equal(Editor.editNetworkOrder(source,'copy',0,limits).ok,false);
});
test('invalid original program cannot be reordered',()=>{
 const source=original();source.rungs[1].id='R1';
 assert.equal(Editor.editNetworkOrder(source,'down',0,limits).ok,false);
});

test('copying an OUT writer disconnects the duplicate until explicitly assigned',()=>{
 const source={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const result=Editor.editNetworkOrder(source,'copy',0,limits);
 assert.equal(result.ok,true);
 assert.deepEqual(result.program.rungs.map(r=>r.coil),[{type:'OUT',ref:'Q1'},{type:'NOP',ref:''}]);
 assert.equal(Ladder.scan(result.program,{I1:false},{},0,limits).outputs.Q1,false);
 assert.equal(Ladder.scan(result.program,{I1:true},{},0,limits).outputs.Q1,true);
 assert.equal(source.rungs.length,1);
});
test('SET and RESET copies cannot silently duplicate a writer',()=>{
 for(const type of ['SET','RESET']){
  const source={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'Q1'}}]};
  const result=Editor.editNetworkOrder(source,'copy',0,limits);
  assert.equal(result.ok,true);
  assert.deepEqual(result.program.rungs[1].coil,{type:'NOP',ref:''});
  assert.equal(result.program.rungs[0].coil.type,type);
 }
});
