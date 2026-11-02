'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const E=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const IO=require('../dist/ladder-program-io.js');
const srcPath=path.resolve(__dirname,'../dist/ladder-editor.js');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'}, {id:'X10:2',signalType:'POWER'},
 {id:'X10:6',signalType:'POWER',label:'1M'},
 {id:'X12:1',signalType:'POWER',label:'3L+'},
 {id:'X12:2',signalType:'POWER',label:'3M'},
 ...Array.from({length:6},(_,i)=>({id:`X10:${i+7}`,signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:`X12:${i+3}`,signalType:'DO'}))
]};
assert.equal(L.supportedPLC(cpu),true);
const limits={inputCount:6,outputCount:4};
const program=()=>{
 const p=L.blank();p.rungs[0].coil.ref='Q2';return p;
};
const importData=()=>IO.serialize(program(),limits,'Imported');
function runHandler(scope,event){
 const source=fs.readFileSync(srcPath,'utf8');
 const start="  overlay.addEventListener('change',async e=>{";
 const following="   if(e.target.id==='dtsLadderTarget')";
 const a=source.indexOf(start),b=source.indexOf(following,a+start.length);
 assert.ok(a>=0&&b>a,'actual async import event handler must be located');
 const body=source.slice(a+start.length,b);
 // Execute the exact import branch from the real editor, including its await.
 // Dependencies are the editor's actual helpers; only DOM/File state is stubbed.
 const fn=new Function('scope','e',`return (async()=>{\nconst {active,editor,overlay,ProgramIO,canCommitDraft,importContextMatches,render}=scope;\nlet importSerial=1;\n${body}\n})();`);
 return fn(scope,event);
}
function fixture({allowEdit=true,content=importData(),deferred=false}={}){
 const component={id:'CPU1',typeId:'cpu-model',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const project={components:[component],defaultTemplate:{id:'sample-1',readOnly:!allowEdit}};
 let currentProject=project,editAllowed=allowEdit,resolveText,guardCount=0,renderCount=0;
 const editor={running:false,byId:{'cpu-model':cpu},getProject:()=>currentProject,
  guardEdit:()=>{guardCount++;return editAllowed},toast:()=>{}};
 const active=E.stateFor(component,editor);active.history=E.createDraftHistory(active.draft);
 const overlay={hidden:false};const file={size:Buffer.byteLength(content,'utf8'),text:()=>deferred?new Promise(resolve=>{resolveText=resolve}):Promise.resolve(content)};
 const input={id:'dtsLadderImport',files:[file],value:'selected-file'};
 const scope={active,editor,overlay,ProgramIO:IO,canCommitDraft:E.canCommitDraft,
  importContextMatches:E.importContextMatches,render:()=>{renderCount++}};
 return {scope,event:{target:input},component,project,editor,overlay,active,
  setProject:p=>currentProject=p,setGuard:x=>editAllowed=x,resolve:()=>resolveText(content),
  guards:()=>guardCount,renders:()=>renderCount};
}
const getCoil=f=>f.active.draft.rungs[0].coil.ref;
test('P0-03 readonly example must not import into the local Ladder draft',async()=>{
 const f=fixture({allowEdit:false});assert.equal(E.canCommitDraft(f.active,f.editor),true);
 await runHandler(f.scope,f.event);
 assert.equal(getCoil(f),'Q1');assert.equal(f.component.ladderProgram.rungs[0].coil.ref,'Q1');
 assert.equal(f.active.history.canUndo(),false);assert.equal(f.renders(),0);
 assert.equal(f.guards(),1);
});
test('P0-03 editable project imports only into draft, never saved PLC',async()=>{
 const f=fixture();await runHandler(f.scope,f.event);
 assert.equal(getCoil(f),'Q2');assert.equal(f.active.history.canUndo(),true);
 assert.equal(f.component.ladderProgram.rungs[0].coil.ref,'Q1');assert.equal(f.renders(),1);
 assert.equal(f.guards(),1);
});
test('P0-03 guard becoming readonly while File.text is pending rejects late import',async()=>{
 const f=fixture({deferred:true});const promise=runHandler(f.scope,f.event);
 f.setGuard(false);f.resolve();await promise;
 assert.equal(getCoil(f),'Q1');assert.equal(f.active.history.canUndo(),false);
 assert.equal(f.guards(),1);
});
test('P0-03 project switch while File.text is pending does not modify original draft',async()=>{
 const f=fixture({deferred:true});const promise=runHandler(f.scope,f.event);
 f.setProject({components:[f.component]});f.resolve();await promise;
 assert.equal(getCoil(f),'Q1');assert.equal(f.active.history.canUndo(),false);
});
test('P0-03 Undo history change during File.text prevents outdated import',async()=>{
 const f=fixture({deferred:true});const promise=runHandler(f.scope,f.event);
 const draft=f.active.history.current();draft.rungs[0].coil.ref='Q3';f.active.history.push(draft);
 f.resolve();await promise;assert.equal(getCoil(f),'Q1');
 assert.equal(f.active.history.current().rungs[0].coil.ref,'Q3');
});
test('P0-03 closing modal while File.text is pending rejects import',async()=>{
 const f=fixture({deferred:true});const promise=runHandler(f.scope,f.event);
 f.overlay.hidden=true;f.resolve();await promise;
 assert.equal(getCoil(f),'Q1');assert.equal(f.active.history.canUndo(),false);
});
test('P0-03 running simulation rejects even editable file import',async()=>{
 const f=fixture();f.editor.running=true;await runHandler(f.scope,f.event);
 assert.equal(getCoil(f),'Q1');assert.equal(f.active.history.canUndo(),false);
});
test('P0-03 malformed .dtsladder cannot poison the saved or draft programs',async()=>{
 const f=fixture({content:'{"dangerous":true}'});await runHandler(f.scope,f.event);
 assert.equal(getCoil(f),'Q1');assert.equal(f.component.ladderProgram.rungs[0].coil.ref,'Q1');
 assert.equal(f.active.history.canUndo(),false);
});
test('P0-03 missing edit guard fails closed rather than allowing a readonly import',async()=>{
 const f=fixture();delete f.editor.guardEdit;await runHandler(f.scope,f.event);
 assert.equal(getCoil(f),'Q1');assert.equal(f.active.history.canUndo(),false);
});
