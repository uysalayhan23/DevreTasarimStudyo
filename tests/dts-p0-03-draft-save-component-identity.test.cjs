'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
const fixture=()=>{
 const c={id:'CPU1',typeId:'cpu-model',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const project={components:[c]},editor={byId:{'cpu-model':cpu,'cpu-alias':cpu},getProject:()=>project};
 assert.equal(L.supportedPLC(cpu),true);
 return {c,project,editor,active:E.stateFor(c,editor)};
};
test('P0-03 negative: changed catalog model, even still supported, cannot receive stale Ladder draft',()=>{
 const {c,editor,active}=fixture();assert.equal(E.canCommitDraft(active,editor),true);
 c.typeId='cpu-alias';assert.equal(E.canCommitDraft(active,editor),false);
});
test('P0-03 negative: changing PLC component identity while editor is open prevents stale save',()=>{
 const {c,editor,active}=fixture();assert.equal(E.canCommitDraft(active,editor),true);
 c.id='CPU2';assert.equal(E.canCommitDraft(active,editor),false);
});
test('P0-03 positive: same PLC and unchanged saved program remain saveable',()=>{
 const {c,editor,active}=fixture();assert.equal(E.canCommitDraft(active,editor),true);
 const draft=structuredClone(active.draft);draft.rungs[0].coil.ref='Q2';
 assert.equal(L.validate(draft,{inputCount:6,outputCount:4}).ok,true);
 assert.equal(E.canCommitDraft(active,editor),true);
 assert.equal(c.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('P0-03 negative: changed project instance or replaced PLC object cannot receive stale draft',()=>{
 const {c,editor,active,project}=fixture();
 editor.getProject=()=>({components:[c]});assert.equal(E.canCommitDraft(active,editor),true);
 editor.getProject=()=>project;project.components=[{...c}];
 assert.equal(E.canCommitDraft(active,editor),false);
});
test('P0-03 negative: saved baseline or program mode mutation stays blocked',()=>{
 for(const mutation of [c=>c.plcProgram='mirror',c=>{c.ladderProgram=L.blank();c.ladderProgram.rungs[0].coil.ref='Q2'}]){
  const {c,editor,active}=fixture();assert.equal(E.canCommitDraft(active,editor),true);
  mutation(c);assert.equal(E.canCommitDraft(active,editor),false);
 }
});
test('P0-03 negative: missing catalog support or deleted project component remains blocked',()=>{
 const {c,editor,active,project}=fixture();
 editor.byId['cpu-model']={...cpu,pins:[]};assert.equal(E.canCommitDraft(active,editor),false);
 editor.byId['cpu-model']=cpu;project.components=[];assert.equal(E.canCommitDraft(active,editor),false);
});
test('P0-03 positive: deliberate reopened valid component gets a fresh authorized context',()=>{
 const {c,editor}=fixture();c.typeId='cpu-alias';const fresh=E.stateFor(c,editor);
 assert.equal(E.canCommitDraft(fresh,editor),true);
 c.typeId='cpu-model';assert.equal(E.canCommitDraft(fresh,editor),false);
});
test('P0-03 positive: canonical NOP stays safe and saved program is not auto-edited',()=>{
 const {c,editor,active}=fixture();const nop={version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]};
 assert.equal(L.validate(nop,{inputCount:6,outputCount:4}).ok,true);
 assert.equal(E.canCommitDraft(active,editor),true);
 assert.equal(c.ladderProgram.rungs[0].coil.type,'OUT');
});
