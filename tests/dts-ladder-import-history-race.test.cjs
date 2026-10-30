'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const sample=()=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]});
const modified=()=>({version:1,rungs:[{id:'R1',paths:[[{type:'NC',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]});
function context(history,rev,opt={}){
 const baseline=sample(),item={},project={};
 return E.importContextMatches(item,opt.otherItem?{}:item,project,opt.otherProject?{}:project,
  opt.visible!==false,1,opt.requestChanged?2:1,
  JSON.stringify(baseline),history.current(),JSON.stringify(baseline),
  opt.savedChanged?modified():baseline,rev,history.revision());
}
test('valid import with unchanged draft and revision',()=>{
 const h=E.createDraftHistory(sample());
 assert.equal(L.validate(h.current(),{inputCount:6,outputCount:4}).ok,true);
 assert.equal(h.revision(),0);assert.equal(context(h,0),true);
});
test('edit and undo restores same JSON but rejects in-flight import',()=>{
 const h=E.createDraftHistory(sample()),start=JSON.stringify(h.current());
 h.push(modified());h.undo();
 assert.equal(JSON.stringify(h.current()),start);
 assert.equal(h.revision(),2);
 assert.equal(context(h,0),false);
 assert.equal(context(h,2),true);
});
test('redo increments revision and rejects stale request',()=>{
 const h=E.createDraftHistory(sample());h.push(modified());h.undo();
 const rev=h.revision();assert.deepEqual(h.redo(),modified());
 assert.equal(h.revision(),rev+1);assert.equal(context(h,rev),false);
});
test('unavailable undo and redo and no-op push do not advance revision',()=>{
 const h=E.createDraftHistory(sample());
 assert.equal(h.undo(),null);assert.equal(h.redo(),null);
 assert.equal(h.push(sample()),false);
 assert.equal(h.revision(),0);assert.equal(context(h,0),true);
});
test('different PLC, project, modal, request or saved program rejects import',()=>{
 const h=E.createDraftHistory(sample());
 for(const opt of [{otherItem:true},{otherProject:true},{visible:false},{requestChanged:true},{savedChanged:true}])
  assert.equal(context(h,0,opt),false);
});
test('malformed explicitly supplied revisions cannot pass the guard',()=>{
 const h=E.createDraftHistory(sample());
 for(const rev of ['0',NaN,-1,1.5])assert.equal(context(h,rev),false);
});
test('bounded history remains monotonic when undo branch is replaced',()=>{
 const h=E.createDraftHistory(sample(),2);
 for(let i=0;i<7;i++)assert.equal(h.push(i%2?sample():modified()),true);
 const before=h.revision();
 assert.deepEqual(h.undo(),sample());
 assert.equal(h.push(modified()),true);
 assert.equal(h.canRedo(),false);
 assert.equal(h.revision(),before+2);
 assert.equal(context(h,before),false);
});
test('history mutation never changes saved program or native simulation',()=>{
 const p=sample(),h=E.createDraftHistory(p);
 h.push(modified());h.undo();
 assert.deepEqual(p,sample());
 assert.equal(L.validate(h.current(),{inputCount:6,outputCount:4}).ok,true);
});
