'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const editorPath = path.resolve(__dirname, '..', 'dist', 'ladder-editor.js');
const source = fs.readFileSync(editorPath, 'utf8');
const L = require('../dist/ladder-runtime.js');
const CPU = {id:'plc-hw-6es7211-1ae40-0xb0', isPLC:true, pins:[
  {id:'X10:1',signalType:'POWER'}, {id:'X10:2',signalType:'POWER'},
  {id:'X10:6',signalType:'POWER',label:'1M'}, {id:'X12:1',signalType:'POWER',label:'3L+'},
  {id:'X12:2',signalType:'POWER',label:'3M'},
  ...Array.from({length:6},(_,i)=>({id:'X10:'+(7+i),signalType:'DI'})),
  ...Array.from({length:4},(_,i)=>({id:'X12:'+(3+i),signalType:'DO'}))
]};
assert.equal(L.supportedPLC(CPU), true, 'Native CPU1211C must be supported');
const anchor='  const sessions=createDraftSessions();';
const render='  function render(preferredFocus=null){';
assert.equal(source.split(anchor).length,2,'Editor session anchor changed');
assert.equal(source.split(render).length,2,'Editor render anchor changed');
function fixture() {
  const events={}, messages=[];let downloads=0;
  const c={id:'CPU-A',typeId:'cpu',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
  let project={components:[c]};const originalProject=project;
  const editor={getProject:()=>project,byId:{cpu:CPU,alias:CPU},running:false,
    guardEdit:()=>true,toast:m=>messages.push(m)};
  const button={dataset:{},addEventListener(){}};
  const overlay={hidden:false,dataset:{},setAttribute(){},addEventListener(k,fn){events[k]=fn},
    contains(){return true},querySelector(){return null}};
  const doc={getElementById:id=>id==='dtsLadderBtn'?button:id==='simulateBtn'?{disabled:false}:null,
    createElement:tag=>tag==='a'?{click(){downloads++},remove(){}}:overlay,body:{appendChild(){}}};
  const originalURL=globalThis.URL,oldSkip=globalThis.__p003Skip;
  globalThis.URL={createObjectURL:()=> 'blob:p003',revokeObjectURL(){}};
  globalThis.__p003Skip=true;
  const instrumented=source.replace(anchor,anchor+'\n  globalThis.__p003SetActive=s=>{active=s};')
    .replace(render,render+'if(globalThis.__p003Skip)return;');
  const mod=new Module(editorPath,module);mod.filename=editorPath;
  mod.paths=Module._nodeModulePaths(path.dirname(editorPath));
  try {
    mod._compile(instrumented,editorPath);
    const E=mod.exports;
    assert.equal(E.init(doc,editor),true);
    const active=E.stateFor(c,editor);active.history=E.createDraftHistory(active.draft);
    assert.equal(E.canCommitDraft(active,editor),true,'Initial context must be valid');
    globalThis.__p003SetActive(active);
    return {E,c,editor,active,originalProject,messages,downloads:()=>downloads,
      replaceProject:p=>{project=p},
      trigger(){events.click({target:{closest:q=>q==='[data-action]'?{dataset:{action:'export-program'}}:null}})},
      cleanup(){globalThis.URL=originalURL;globalThis.__p003Skip=oldSkip;delete globalThis.__p003SetActive}};
  }catch(e){globalThis.URL=originalURL;globalThis.__p003Skip=oldSkip;delete globalThis.__p003SetActive;throw e}
}
function check(name,mutate,expected){
  test(name,()=>{
    const f=fixture();
    try{mutate(f);f.trigger();assert.equal(f.downloads(),expected);}
    finally{f.cleanup()}
  });
}
check('P0-03 positive: current PLC exports one Ladder file',()=>{},1);
check('P0-03 negative: replaced project cannot export old draft',f=>f.replaceProject({components:[f.c]}),0);
check('P0-03 negative: PLC ID changed cannot export old draft',f=>{f.c.id='CPU-B'},0);
check('P0-03 negative: PLC catalog model changed cannot export',f=>{f.c.typeId='alias'},0);
check('P0-03 negative: removed PLC cannot export',f=>{f.originalProject.components=[]},0);
check('P0-03 negative: replacement PLC object with reused ID cannot export',f=>{f.originalProject.components=[{...f.c}]},0);
check('P0-03 negative: saved program changed cannot export old draft',f=>{f.c.ladderProgram={...f.c.ladderProgram,changed:true}},0);
check('P0-03 negative: changed PLC program mode cannot export',f=>{f.c.plcProgram='external'},0);
check('P0-03 positive: readonly draft remains exportable without saving',f=>{f.editor.guardEdit=()=>false},1);
