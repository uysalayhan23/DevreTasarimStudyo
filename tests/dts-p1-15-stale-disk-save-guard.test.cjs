'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const src=fs.readFileSync(path.join(__dirname,'../dist/studio.js'),'utf8');
const start=src.indexOf('  async function save(saveAs=false){'),end=src.indexOf("\n  $('#projectFolderInput')",start);
assert.ok(start>=0&&end>start,'The actual app Save/Save As handler must exist');
const saveHandler=src.slice(start,end);
const deferred=()=>{let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j});return {promise,resolve,reject}};
function harness(){
 let current={version:7,projectId:'A',name:'A',components:[],wires:[],updatedAt:'2026-01-01'};
 const initial=current,operation=deferred(),state={clean:0,loads:[],toasts:[],storage:0,saves:[],buttons:{save:{disabled:false},copy:{disabled:false}}};
 const context={
  isHome:false,safety:{visible:false},protectedNotice:()=>false,protectedProject:()=>false,templateOriginal:null,
  Projects:{clean:p=>JSON.parse(JSON.stringify(p))},
  E:{getProject:()=>current,toast:msg=>state.toasts.push(msg)},
  $:id=>id==='#exportBtn'?state.buttons.copy:state.buttons.save,
  store:{save:async(p,opts)=>{state.saves.push({p,opts,snapshot:JSON.stringify(p)});return operation.promise}},
  markClean:()=>{state.clean++},load:p=>{state.loads.push(p);current=p},
  localStorage:{setItem(){state.storage++}}
 };
 const save=vm.runInNewContext('('+saveHandler+')',context);
 return {state,initial,save,operation,getProject:()=>current,replaceProject:p=>{current=p},
  mutate:()=>{current.components.push({id:'new',typeId:'lamp',x:5,y:5})},
  changeTimestamp:()=>{current.updatedAt='2026-11-02';current.projectId='A-new'},
  leaveHome:()=>{context.isHome=true}};
}

test('P1-15 negative: a late ordinary disk save must not clear edits made during write',async()=>{
 const f=harness(),pending=f.save(false);f.mutate();
 f.operation.resolve({saved:true,name:'A.odsdevre',project:{projectId:'A'}});await pending;
 assert.equal(f.state.clean,0,'Unsaved new component must remain dirty');
 assert.equal(f.getProject().components.length,1);
 assert.match(f.state.toasts.join(' '),/henüz kaydedilmedi/);
});
test('P1-15 negative: late Save As must not replace edits made during write',async()=>{
 const f=harness(),pending=f.save(true);f.mutate();
 f.operation.resolve({saved:true,name:'copy.odsdevre',project:{projectId:'COPY',components:[],wires:[]}});await pending;
 assert.equal(f.state.loads.length,0,'Old copy must never replace edited live project');
 assert.equal(f.getProject(),f.initial);assert.equal(f.getProject().components.length,1);
 assert.equal(f.state.clean,0);
});
test('P1-15 negative: late Save As must not reopen a different project selected during write',async()=>{
 const f=harness(),pending=f.save(true),newProject={version:7,projectId:'B',components:[],wires:[]};
 f.replaceProject(newProject);f.operation.resolve({saved:true,name:'copy.odsdevre',project:{projectId:'COPY'}});await pending;
 assert.equal(f.getProject(),newProject);assert.equal(f.state.loads.length,0);assert.equal(f.state.clean,0);
});
test('P1-15 negative: late ordinary Save cannot mark a different project clean',async()=>{
 const f=harness(),pending=f.save(false),newProject={version:7,projectId:'B',components:[],wires:[]};
 f.replaceProject(newProject);f.operation.resolve({saved:true,name:'A.odsdevre'});await pending;
 assert.equal(f.getProject(),newProject);assert.equal(f.state.clean,0);
});
test('P1-15 positive: healthy ordinary Save clears dirty status',async()=>{
 const f=harness(),pending=f.save(false);f.operation.resolve({saved:true,name:'A.odsdevre'});await pending;
 assert.equal(f.state.clean,1);assert.equal(f.state.loads.length,0);
});
test('P1-15 positive: healthy Save As opens saved editable copy',async()=>{
 const f=harness(),pending=f.save(true),copy={version:7,projectId:'COPY',name:'Copy',components:[],wires:[]};
 f.operation.resolve({saved:true,name:'copy.odsdevre',project:copy});await pending;
 assert.equal(f.state.clean,1);assert.equal(f.state.loads.length,1);assert.equal(f.getProject(),copy);
});
test('P1-15 positive: timestamp and project ID assigned by successful save do not count as unsaved edits',async()=>{
 const f=harness(),pending=f.save(false);f.changeTimestamp();f.operation.resolve({saved:true,name:'A.odsdevre'});await pending;
 assert.equal(f.state.clean,1);
});
test('P1-15 negative: leaving workspace while saving cannot reopen copied project',async()=>{
 const f=harness(),pending=f.save(true);f.leaveHome();f.operation.resolve({saved:true,name:'copy.odsdevre',project:{projectId:'COPY'}});await pending;
 assert.equal(f.state.loads.length,0);assert.equal(f.state.clean,0);
});
