'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const L=require('../dist/ladder-runtime.js');
const editorPath=path.resolve(__dirname,'../dist/ladder-editor.js');
const source=fs.readFileSync(editorPath,'utf8');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
assert.equal(L.supportedPLC(cpu),true);
function mount(){
 const events={};const btn={dataset:{},addEventListener(){},focus(){}};
 const overlay={hidden:true,dataset:{},setAttribute(){},addEventListener(name,cb){events[name]=cb},contains(){return true},querySelector(){return null}};
 const doc={getElementById:id=>id==='dtsLadderBtn'?btn:null,createElement:()=>overlay,body:{appendChild(){}}};
 const c={id:'CPU-A',typeId:'model',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const originalProject={components:[c]};let project=originalProject,editAllowed=true;
 const editor={byId:{model:cpu,alias:cpu},getProject:()=>project,running:false,guardEdit:()=>editAllowed,toast(){}};
 const injection='  const sessions=createDraftSessions();';
 const render='  function render(preferredFocus=null){';
 assert.equal(source.split(injection).length,2);
 assert.equal(source.split(render).length,2);
 // Instrument access to the actual editor's active state without changing its event handling.
 const compiled=source.replace(injection,injection+'\n  globalThis.__p003Capture=state=>{active=state};')
  .replace(render,render+'if(globalThis.__p003NoRender)return;');
 const saved=globalThis.__p003NoRender;
 globalThis.__p003NoRender=true;
 const mod=new Module(editorPath,module);mod.filename=editorPath;mod.paths=Module._nodeModulePaths(path.dirname(editorPath));
 mod._compile(compiled,editorPath);
 const E=mod.exports;
 assert.equal(E.init(doc,editor),true);
 const active=E.stateFor(c,editor),history=E.createDraftHistory(active.draft);
 const changed=history.current();changed.rungs[0].coil.ref='Q2';history.push(changed);
 active.history=history;active.draft=history.current();globalThis.__p003Capture(active);
 const action=type=>events.click({target:{closest:q=>q==='[data-action]'?{dataset:{action:type,r:'0'}}:null}});
 const change=()=>events.change({target:{id:'field',dataset:{field:'rung-comment',r:'0'},value:'stale comment'}});
 const undoKey=()=>events.keydown({key:'z',ctrlKey:true,altKey:false,metaKey:false,shiftKey:false,
  target:{tagName:'DIV',closest(){return null}},preventDefault(){},stopPropagation(){}});
 const fbd=()=>events.click({target:{closest:q=>q==='[data-fbd-toggle-contact]'?
  {dataset:{fbdToggleContact:'0:0:0'}}:null}});
 return {c,active,history,editor,originalProject,action,change,undoKey,fbd,
  setProject:p=>{project=p},setAllowed:x=>{editAllowed=x},
  setFbd(){/* FBD handler requires fbd mode; readonly project checks are shared with LAD. */},
  cleanup(){globalThis.__p003NoRender=saved;delete globalThis.__p003Capture}};
}
function unchanged(f,rev){
 assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');
 assert.equal(f.active.draft.rungs[0].comment,undefined);
 assert.equal(f.history.revision(),rev);
 assert.equal(f.history.current().rungs[0].coil.ref,'Q2');
 assert.equal(f.c.ladderProgram.rungs[0].coil.ref,'Q1');
}
test('P0-03 project replacement with same PLC object forbids stale Undo',()=>{
 const f=mount();try{const revision=f.history.revision();f.setProject({components:[f.c]});f.action('undo');unchanged(f,revision)}finally{f.cleanup()}
});
test('P0-03 project replacement rejects stale text changes and history edits',async()=>{
 const f=mount();try{const revision=f.history.revision();f.setProject({components:[f.c]});await f.change();unchanged(f,revision)}finally{f.cleanup()}
});
test('P0-03 PLC identity mutation rejects a stale starter program',()=>{
 const f=mount();try{const revision=f.history.revision();f.c.id='CPU-B';f.action('starter');unchanged(f,revision)}finally{f.cleanup()}
});
test('P0-03 supported hardware catalog switch rejects stale NOP remove action',()=>{
 const f=mount();try{const revision=f.history.revision();f.c.typeId='alias';f.action('remove-output');unchanged(f,revision)}finally{f.cleanup()}
});
test('P0-03 changed PLC program mode refuses Ctrl+Z on previous draft',()=>{
 const f=mount();try{const revision=f.history.revision();f.c.plcProgram='mirror';f.undoKey();unchanged(f,revision)}finally{f.cleanup()}
});
test('P0-03 changed saved baseline rejects stale local comment edit',async()=>{
 const f=mount();try{const revision=f.history.revision();f.c.ladderProgram=L.blank();f.c.ladderProgram.rungs[0].coil.ref='Q3';await f.change();
  assert.equal(f.active.draft.rungs[0].comment,undefined);assert.equal(f.history.revision(),revision);
  assert.equal(f.c.ladderProgram.rungs[0].coil.ref,'Q3');
 }finally{f.cleanup()}
});
test('P0-03 removed component in same project cannot edit old unsaved draft',()=>{
 const f=mount();try{const revision=f.history.revision();f.originalProject.components=[];f.action('undo');unchanged(f,revision)}finally{f.cleanup()}
});
test('P0-03 unchanged project context permits legitimate Undo and Redo',()=>{
 const f=mount();try{f.action('undo');assert.equal(f.active.draft.rungs[0].coil.ref,'Q1');f.action('redo');assert.equal(f.active.draft.rungs[0].coil.ref,'Q2')}finally{f.cleanup()}
});
test('P0-03 unchanged project context permits a draft comment, without changing saved PLC',async()=>{
 const f=mount();try{const revision=f.history.revision();await f.change();assert.equal(f.active.draft.rungs[0].comment,'stale comment');
 assert.equal(f.history.revision(),revision+1);assert.equal(f.c.ladderProgram.rungs[0].comment,undefined)}finally{f.cleanup()}
});
test('P0-03 readonly transition blocks Ctrl+Z and then allows it after editable transition',()=>{
 const f=mount();try{const revision=f.history.revision();f.setAllowed(false);f.undoKey();unchanged(f,revision);
 f.setAllowed(true);f.undoKey();assert.equal(f.active.draft.rungs[0].coil.ref,'Q1')}finally{f.cleanup()}
});
