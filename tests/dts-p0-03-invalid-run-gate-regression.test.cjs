'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const E=require('../dist/ladder-editor.js');
const nativeButton={disabled:false};
const component=program=>({plcProgram:'dts-ladder-v1',ladderProgram:program});
const starts=p=>E.canStartLadder(component(p),structuredClone(p),false,nativeButton);
const noWriter=()=>({version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]});
test('P0-03 rejects saved Ladder without networks even when draft matches',()=>{
 const p={version:1,rungs:[]};assert.equal(L.validate(p).ok,false);assert.equal(starts(p),false);
});
test('P0-03 rejects wrong-version saved program despite identical draft',()=>{
 const p={version:2,rungs:L.blank().rungs};assert.equal(L.validate(p).ok,false);assert.equal(starts(p),false);
});
test('P0-03 rejects duplicate Q1 writers in saved matching draft',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}]};
 assert.equal(L.validate(p).ok,false);assert.equal(starts(p),false);
});
test('P0-03 rejects malformed NOP with a Q target even when snapshots match',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:'Q1'}}]};
 assert.equal(L.validate(p).ok,false);assert.equal(starts(p),false);
});
test('P0-03 permits valid saved Ladder and safe address-free NOP',()=>{
 for(const p of [L.blank(),noWriter()]){assert.equal(L.validate(p).ok,true);assert.equal(starts(p),true)}
});
test('P0-03 rejects unsaved drafts, missing native simulator, blocked simulator, and wrong mode',()=>{
 const p=L.blank(),draft=structuredClone(p);draft.rungs[0].coil.ref='Q2';
 assert.equal(E.canStartLadder(component(p),draft,false,nativeButton),false);
 assert.equal(E.canStartLadder(component(p),p,false,null),false);
 assert.equal(E.canStartLadder(component(p),p,false,{disabled:true}),false);
 assert.equal(E.canStartLadder({...component(p),plcProgram:'mirror'},p,false,nativeButton),false);
});
test('P0-03 preserves stop control when simulation already runs',()=>{
 const p={version:1,rungs:[]};assert.equal(E.canStartLadder(component(p),p,true,{disabled:true}),true);
});
