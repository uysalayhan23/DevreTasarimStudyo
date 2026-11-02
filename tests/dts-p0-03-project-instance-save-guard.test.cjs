'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
function fixture(){
 const c={id:'CPU1',typeId:'cpu-model',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const project={components:[c]};let activeProject=project;
 const editor={byId:{'cpu-model':cpu},getProject:()=>activeProject};
 return {c,project,editor,active:E.stateFor(c,editor),setProject:p=>activeProject=p};
}
test('negative: opening a different project sharing same PLC object must reject stale draft save',()=>{
 const f=fixture();assert.equal(E.canCommitDraft(f.active,f.editor),true);
 f.setProject({components:[f.c]});assert.equal(E.canCommitDraft(f.active,f.editor),false);
});
test('negative: project switch with unchanged PLC ID/type and saved baseline still rejects stale save',()=>{
 const f=fixture();const p=f.active.draft; p.rungs[0].coil.ref='Q2';
 assert.equal(L.validate(p,{inputCount:6,outputCount:4}).ok,true);
 f.setProject({components:[f.c]});assert.equal(E.canCommitDraft(f.active,f.editor),false);
 assert.equal(f.c.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('positive: active project and unchanged PLC remain saveable',()=>{
 const f=fixture();assert.equal(E.canCommitDraft(f.active,f.editor),true);
 assert.equal(f.active.savedBaseline,JSON.stringify(f.c.ladderProgram));
});
test('positive: reopening same PLC in replacement project produces fresh authorized state',()=>{
 const f=fixture();f.setProject({components:[f.c]});const fresh=E.stateFor(f.c,f.editor);
 assert.equal(E.canCommitDraft(fresh,f.editor),true);
 assert.equal(E.canCommitDraft(f.active,f.editor),false);
});
test('positive: restoring exact original project does not silently change saved program',()=>{
 const f=fixture(),another={components:[f.c]};f.setProject(another);
 assert.equal(E.canCommitDraft(f.active,f.editor),false);
 f.setProject(f.project);assert.equal(E.canCommitDraft(f.active,f.editor),true);
 assert.equal(f.c.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('negative: replaced PLC component or missing project component still blocked',()=>{
 const f=fixture();f.project.components=[{...f.c}];assert.equal(E.canCommitDraft(f.active,f.editor),false);
 f.project.components=[];assert.equal(E.canCommitDraft(f.active,f.editor),false);
});
