'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const L=require('../dist/ladder-runtime.js');
const sourcePath=path.resolve(__dirname,'../dist/ladder-editor.js');
const original=fs.readFileSync(sourcePath,'utf8');
function mounted(allowed=false){
 const handlers={};let renderCount=0,editAttempts=0,notices=0;
 const overlay={hidden:true,dataset:{},setAttribute(){},addEventListener(type,fn){handlers[type]=fn},
   contains(){return true},querySelector(){return null}};
 const button={dataset:{},addEventListener(){},focus(){}};
 const doc={getElementById:k=>k==='dtsLadderBtn'?button:null,
  createElement:()=>overlay,body:{appendChild(){}}};
 const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
  {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
  {id:'X10:6',signalType:'POWER',label:'1M'},
  {id:'X12:1',signalType:'POWER',label:'3L+'},
  {id:'X12:2',signalType:'POWER',label:'3M'},
  ...Array.from({length:6},(_,i)=>({id:'X10:'+(7+i),signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'X12:'+(3+i),signalType:'DO'}))
 ]};
 const project={components:[]};
 const editor={getProject:()=>project,byId:{cpu},running:false,
   guardEdit(){editAttempts++;if(!allowed){notices++;return false}return true},toast(){}};
 const inject="  const sessions=createDraftSessions();";
 const accessor="  const sessions=createDraftSessions();\n  globalThis.__dtsReadonlyCapture={setActive(value){active=value},setMode(value){diagramMode=value},getMode(){return diagramMode}};";
 const renderDecl="  function render(preferredFocus=null){";
 assert.equal(original.split(inject).length,2);
 assert.equal(original.split(renderDecl).length,2);
 // Only test instrumentation: preserve the real click, change, drop and keyboard handlers.
 const code=original.replace(inject,accessor).replace(renderDecl,
   "  function render(preferredFocus=null){if(globalThis.__dtsReadonlyNoRender){globalThis.__dtsReadonlyRenderCount++;return;}");
 const originalRenderSkip=globalThis.__dtsReadonlyNoRender;
 globalThis.__dtsReadonlyNoRender=true;globalThis.__dtsReadonlyRenderCount=0;
 const m=new Module(sourcePath,module);m.filename=sourcePath;m.paths=Module._nodeModulePaths(path.dirname(sourcePath));
 m._compile(code,sourcePath);assert.equal(m.exports.init(doc,editor),true);
 const E=m.exports;
 const c={id:'CPU1',typeId:'cpu',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};project.components.push(c);
 const history=E.createDraftHistory(c.ladderProgram);
 const next=history.current();next.rungs[0].coil.ref='Q2';history.push(next);
 const active=E.stateFor(c,editor);active.draft=history.current();active.history=history;
 globalThis.__dtsReadonlyCapture.setActive(active);
 function clickAction(action){const b={dataset:{action}};return handlers.click({target:{closest(q){return q==='[data-action]'?b:null}}})}
 function clickFBD(structural){globalThis.__dtsReadonlyCapture.setMode('fbd');
  const sel=structural?'[data-fbd-structure]':'[data-fbd-toggle-contact]';
  const el={dataset:{fbdStructure:'add-path',fbdPosition:'0:0',fbdToggleContact:'0:0:0'}};
  return handlers.click({target:{closest(q){return q===sel?el:null}}});}
 function drop(){globalThis.__dtsReadonlyCapture.setMode('ladder');const zone={dataset:{r:'0',p:'0',dropKind:'contact'},classList:{remove(){}}};
  return handlers.drop({target:{closest(q){return q==='[data-drop-kind]'?zone:null}},
   preventDefault(){},dataTransfer:{getData:()=> 'DTS-LAD:NO'}})}
 function field(){return handlers.change({target:{id:'edit-field',dataset:{field:'rung-comment',r:'0'},value:'READONLY EDIT'}})}
 function key(){return handlers.keydown({key:'z',ctrlKey:true,altKey:false,metaKey:false,shiftKey:false,
  target:{tagName:'DIV',closest:()=>null},preventDefault(){},stopPropagation(){}})}
 return {active,history,c,editor,handlers,clickAction,clickFBD,drop,field,key,edits:()=>editAttempts,
  notices:()=>notices,allow(){allowed=true},getMode:()=>globalThis.__dtsReadonlyCapture.getMode(),
  cleanup(){globalThis.__dtsReadonlyNoRender=originalRenderSkip;delete globalThis.__dtsReadonlyCapture}};
}
test('readonly: toolbar Undo and Redo cannot mutate a protected Ladder draft',()=>{
 const f=mounted(false);try{
  f.clickAction('undo');assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');assert.equal(f.history.canUndo(),true);
  f.clickAction('redo');assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');assert.equal(f.history.canRedo(),false);
 }finally{f.cleanup()}
});
test('readonly: starter and example loading cannot replace local draft',()=>{
 const f=mounted(false);try{
  f.clickAction('starter');f.clickAction('load-example');
  assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');assert.equal(f.history.current().rungs[0].coil.ref,'Q2');
 }finally{f.cleanup()}
});
test('readonly: NOP removal, Network creation and copy are not editable',()=>{
 const f=mounted(false);try{
  for(const a of ['remove-output','remove-block','add-rung','copy-rung','add-contact'])f.clickAction(a);
  assert.equal(f.active.draft.rungs.length,1);assert.equal(f.active.draft.rungs[0].coil.type,'OUT');
  assert.equal(f.history.current().rungs[0].coil.ref,'Q2');
 }finally{f.cleanup()}
});
test('readonly: LAD text field changes cannot mutate draft or Undo revision',async()=>{
 const f=mounted(false);try{const before=f.history.revision();await f.field();
  assert.equal(f.active.draft.rungs[0].comment,undefined);assert.equal(f.history.revision(),before);
 }finally{f.cleanup()}
});
test('readonly: FBD structure and polarity click cannot edit shared LAD draft',()=>{
 const f=mounted(false);try{const before=f.history.revision();f.clickFBD(true);f.clickFBD(false);
  assert.equal(f.history.revision(),before);assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');
 }finally{f.cleanup()}
});
test('readonly: drag/drop cannot insert contacts into Ladder draft',()=>{
 const f=mounted(false);try{const before=f.history.revision();f.drop();
  assert.equal(f.history.revision(),before);assert.equal(f.active.draft.rungs[0].paths[0].length,1);
 }finally{f.cleanup()}
});
test('readonly: Ctrl+Z is blocked while view-only LAD/FBD mode switch remains allowed',()=>{
 const f=mounted(false);try{f.key();assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');
  f.clickAction('toggle-diagram');assert.equal(f.getMode(),'fbd');
  f.clickAction('toggle-diagram');assert.equal(f.getMode(),'ladder');
 }finally{f.cleanup()}
});
test('editable: toolbar Undo and Redo remain functional',()=>{
 const f=mounted(true);try{
  f.clickAction('undo');assert.equal(f.active.draft.rungs[0].coil.ref,'Q1');
  f.clickAction('redo');assert.equal(f.active.draft.rungs[0].coil.ref,'Q2');
 }finally{f.cleanup()}
});
test('editable: LAD field changes are still tracked in Undo history',async()=>{
 const f=mounted(true);try{const before=f.history.revision();await f.field();
  assert.equal(f.active.draft.rungs[0].comment,'READONLY EDIT');assert.equal(f.history.revision(),before+1);
 }finally{f.cleanup()}
});
test('readonly: mutation attempts must query actual editor permission rather than only running flag',async()=>{
 const f=mounted(false);try{f.clickAction('undo');f.clickAction('starter');await f.field();f.key();f.drop();
  assert.ok(f.edits()>=5);assert.ok(f.notices()>=5);
 }finally{f.cleanup()}
});
