'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r});return {promise,resolve};};
const project=()=>({version:7,projectId:'mine',name:'My project',components:[],wires:[],junctions:[],workspaceMode:'control'});
function fixture({permissionGate=null,lookupGate=null,creationGate=null}={}){
 const created=[],writes=[],picked=[],removed=[],files=new Map();
 function folder(name){
   const owned=new Map();files.set(name,owned);
   const dir={name,
     async queryPermission(){if(name==='A'&&permissionGate){permissionGate.started.resolve();await permissionGate.gate.promise;}return 'granted';},
     async getFileHandle(filename,options){
       if(name==='A'&&lookupGate&&!options?.create){lookupGate.started.resolve();await lookupGate.gate.promise;}
       if(!options?.create){if(owned.has(filename))return owned.get(filename);const e=Error('Not found');e.name='NotFoundError';throw e;}
       created.push(name);
       const h={name:filename,isSameEntry:async other=>other===h,async getFile(){return {size:0,lastModified:44,text:async()=>''};},
         async createWritable(){return {async write(s){writes.push({folder:name,body:s})},async close(){},async abort(){}}}};
       owned.set(filename,h);
       if(name==='A'&&creationGate){creationGate.started.resolve();await creationGate.gate.promise;}
       return h;
     },
     async removeEntry(filename){owned.delete(filename);removed.push({folder:name,filename});}
   };return dir;
 }
 const A=folder('A'),B=folder('B');
 const storage=new Map(),cache={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const store=Projects.create({storage:cache,indexedDB:null,env:{showDirectoryPicker:async()=>picked.shift()}});
 return {store,A,B,picked,created,writes,removed,files};
}
async function select(x,dir){x.picked.push(dir);await x.store.chooseFolder()}
test('P0-04 negative: save pending old folder permission never writes newly selected folder',async()=>{
 const gate={started:deferred(),gate:deferred()},x=fixture({permissionGate:gate});
 await select(x,x.A);
 const pending=x.store.save(project());await gate.started.promise;
 await select(x,x.B);gate.gate.resolve();
 await assert.rejects(pending,/klasör|değiş|seçim/i);
 assert.deepEqual(x.created,[]);assert.deepEqual(x.writes,[]);assert.equal(x.store.folderName,'B');
});
test('P0-04 negative: save pending folder file lookup must not continue in selected new folder',async()=>{
 const gate={started:deferred(),gate:deferred()},x=fixture({lookupGate:gate});
 await select(x,x.A);
 const pending=x.store.save(project());await gate.started.promise;
 await select(x,x.B);gate.gate.resolve();
 await assert.rejects(pending,/klasör|değiş|seçim/i);
 assert.deepEqual(x.created,[]);assert.deepEqual(x.writes,[]);assert.equal(x.store.folderName,'B');
});
test('P0-04 positive: ordinary folder save creates a new file in selected folder',async()=>{
 const x=fixture();await select(x,x.A);const result=await x.store.save(project());
 assert.equal(result.saved,true);assert.deepEqual(x.created,['A']);assert.equal(x.writes.length,1);
 assert.equal(x.writes[0].folder,'A');assert.equal(JSON.parse(x.writes[0].body).projectId,'mine');
});
test('P0-04 positive: normal consecutive folder choice saves to latest folder',async()=>{
 const x=fixture();await select(x,x.A);await select(x,x.B);const result=await x.store.save(project());
 assert.equal(result.saved,true);assert.deepEqual(x.created,['B']);assert.deepEqual(x.writes.map(r=>r.folder),['B']);
});
test('P0-04 positive: existing remembered file handle saves without a folder selection',async()=>{
 const x=fixture();let data='',written=0,stamp=2;
 const existing={name:'my.odsdevre',queryPermission:async()=> 'granted',getFile:async()=>({size:data.length,lastModified:stamp,text:async()=>data}),createWritable:async()=>({write:async s=>{data=s;written++},close:async()=>{stamp++},abort:async()=>{}})};
 const p=project();await x.store.remember(p,existing,stamp);
 const result=await x.store.save(p);assert.equal(result.saved,true);assert.equal(written,1);
 assert.equal(JSON.parse(data).projectId,'mine');
});

test('P0-04 negative: stale save after creating an empty file rolls back only that unchanged file',async()=>{
 const gate={started:deferred(),gate:deferred()},x=fixture({creationGate:gate});
 await select(x,x.A);
 const pending=x.store.save(project());await gate.started.promise;
 await select(x,x.B);gate.gate.resolve();
 await assert.rejects(pending,/klasör|değiş|seçim/i);
 assert.deepEqual(x.writes,[]);
 assert.equal(x.files.get('A').size,0,'aborted save must not leave an empty ghost file');
 assert.equal(x.files.get('B').size,0);
 assert.deepEqual(x.removed.map(e=>e.folder),['A']);
});
