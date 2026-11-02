'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const L=require('../dist/ladder-runtime.js');
const sourcePath=path.resolve(__dirname,'../dist/ladder-editor.js');
const source=fs.readFileSync(sourcePath,'utf8');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',signalType:'POWER',label:'1M'},
 {id:'X12:1',signalType:'POWER',label:'3L+'},
 {id:'X12:2',signalType:'POWER',label:'3M'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(7+i),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(3+i),signalType:'DO'}))
]};
assert.equal(L.supportedPLC(cpu),true);
function fixture(){
 const events={};let simClicks=0;
 const sim={disabled:false,click(){simClicks++}};
 const btn={dataset:{},addEventListener(){},focus(){}};
 const overlay={hidden:false,dataset:{},setAttribute(){},addEventListener(name,fn){events[name]=fn},contains(){return true},querySelector(){return null}};
 const doc={getElementById:id=>id==='dtsLadderBtn'?btn:id==='simulateBtn'?sim:null,
  createElement:()=>overlay,body:{appendChild(){}}};
 const c={id:'CPU-A',typeId:'model',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const initialProject={components:[c]};let project=initialProject;
 const editor={getProject:()=>project,byId:{model:cpu,alias:cpu},running:false,
  guardEdit:()=>true,toast(){}};
 const anchor='  const sessions=createDraftSessions();',render='  function render(preferredFocus=null){';
 assert.equal(source.split(anchor).length,2);assert.equal(source.split(render).length,2);
 const compiled=source.replace(anchor,anchor+'\n  globalThis.__dtsSetActive=state=>{active=state};')
  .replace(render,render+'if(globalThis.__dtsSkipRender)return;');
 const previous=globalThis.__dtsSkipRender;globalThis.__dtsSkipRender=true;
 const mod=new Module(sourcePath,module);mod.filename=sourcePath;mod.paths=Module._nodeModulePaths(path.dirname(sourcePath));
 mod._compile(compiled,sourcePath);
 const E=mod.exports;assert.equal(E.init(doc,editor),true);
 const active=E.stateFor(c,editor);active.history=E.createDraftHistory(active.draft);
 assert.equal(E.canStartLadder(c,active.draft,false,sim,{inputCount:6,outputCount:4}),true);
 globalThis.__dtsSetActive(active);
 return {E,c,editor,sim,initialProject,active,clicks:()=>simClicks,setProject:p=>{project=p},
  action:()=>events.click({target:{closest:q=>q==='[data-action]'?{dataset:{action:'toggle-sim'}}:null}}),
  cleanup(){globalThis.__dtsSkipRender=previous;delete globalThis.__dtsSetActive}};
}
test('P0-03 negative: replaced project instance cannot start old PLC Ladder program',()=>{
 const f=fixture();try{f.setProject({components:[f.c]});f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 negative: renamed PLC cannot trigger native simulator from stale editor',()=>{
 const f=fixture();try{f.c.id='CPU-B';f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 negative: supported catalog swap cannot start a stale Ladder dialog',()=>{
 const f=fixture();try{f.c.typeId='alias';f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 negative: deleted PLC cannot start simulation via old editor',()=>{
 const f=fixture();try{f.initialProject.components=[];f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 negative: replacement PLC object with reused ID cannot start old program',()=>{
 const f=fixture();try{f.initialProject.components=[{...f.c}];f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 positive: valid saved program starts via enabled native simulator',()=>{
 const f=fixture();try{f.action();assert.equal(f.clicks(),1)}finally{f.cleanup()}
});
test('P0-03 positive: stop stays available during a running simulator, even if project switched',()=>{
 const f=fixture();try{f.editor.running=true;f.setProject({components:[f.c]});f.action();assert.equal(f.clicks(),1)}finally{f.cleanup()}
});
test('P0-03 positive: unsaved draft and native simulator disabled still reject Start',()=>{
 const f=fixture();try{f.active.draft.rungs[0].coil.ref='Q2';f.action();assert.equal(f.clicks(),0);
 f.active.draft=L.blank();f.sim.disabled=true;f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 positive: external program mode mismatch still rejects Start',()=>{
 const f=fixture();try{f.c.plcProgram='mirror';f.action();assert.equal(f.clicks(),0)}finally{f.cleanup()}
});
test('P0-03 regression: button state and 300ms refresh must use same project start lock',()=>{
 assert.match(source,/const canRun=[^\n]*canToggleLadder\(\)/);
 assert.match(source,/simAction\.disabled=[^\n]*canToggleLadder\(\)/);
});
