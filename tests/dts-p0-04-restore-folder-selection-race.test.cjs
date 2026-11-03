'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const deferred=()=>{let resolve;const promise=new Promise(r=>{resolve=r});return {promise,resolve}};
const storage=()=>({getItem:()=>null,setItem(){},removeItem(){}});
function database({previous,readGate,started}){
 const values=new Map([['directory',previous]]);
 return {open(){const req={};req.result={createObjectStore(){},transaction(){
  const tx={objectStore(){return {
   get(key){const r={},loaded=values.get(key);started?.resolve();(readGate?.promise||Promise.resolve()).then(()=>{r.result=loaded;r.onsuccess();tx.oncomplete()});return r},
   put(value,key){const r={};queueMicrotask(()=>{values.set(key,value);r.onsuccess();tx.oncomplete()});return r}
  }}};return tx
 }};queueMicrotask(()=>req.onsuccess());return req},values};
}
function folder(name, permission='granted'){
 return {name,queryPermission:()=>typeof permission==='string'?Promise.resolve(permission):permission.promise};
}
test('P0-04 delayed old IndexedDB restore must not replace newly selected folder',async()=>{
 const gate=deferred(),started=deferred(),A=folder('OLD'),B=folder('NEW');
 const idb=database({previous:A,readGate:gate,started});
 const store=Projects.create({storage:storage(),indexedDB:idb,env:{showDirectoryPicker:async()=>B}});
 const restore=store.restoreFolder();await started.promise;
 await store.chooseFolder();assert.equal(store.folderName,'NEW');
 gate.resolve();await restore;
 assert.equal(store.folderName,'NEW');assert.equal(store.permissionNeeded,false);
 assert.equal(idb.values.get('directory'),B);
});
test('P0-04 delayed old folder permission denial must not contaminate new folder',async()=>{
 const gate=deferred(),A=folder('OLD',gate),B=folder('NEW');
 const store=Projects.create({storage:storage(),indexedDB:database({previous:A}),env:{showDirectoryPicker:async()=>B}});
 const restore=store.restoreFolder();
 // The old folder is published, but its permission request is still pending.
 for(let i=0;i<12&&store.folderName!=='OLD';i++)await Promise.resolve();
 assert.equal(store.folderName,'OLD');
 await store.chooseFolder();gate.resolve('denied');await restore;
 assert.equal(store.folderName,'NEW');assert.equal(store.permissionNeeded,false);
});
test('P0-04 readonly folder-file selection wins over pending old restore',async()=>{
 const gate=deferred(),started=deferred(),A=folder('OLD');
 const store=Projects.create({storage:storage(),indexedDB:database({previous:A,readGate:gate,started}),env:{}});
 const restore=store.restoreFolder();await started.promise;
 store.useFolderFiles([{name:'Local.odsdevre',text:async()=>'{"version":7,"components":[],"wires":[]}'}]);
 gate.resolve();await restore;
 assert.equal(store.folderName,'');
});
test('P0-04 normal startup restore remains functional',async()=>{
 const A=folder('OLD');const store=Projects.create({storage:storage(),indexedDB:database({previous:A}),env:{}});
 assert.equal(await store.restoreFolder(),true);assert.equal(store.folderName,'OLD');assert.equal(store.permissionNeeded,false);
});
test('P0-04 normal folder switch still works',async()=>{
 const A=folder('OLD'),B=folder('NEW');const store=Projects.create({storage:storage(),indexedDB:database({previous:A}),env:{showDirectoryPicker:async()=>B}});
 await store.restoreFolder();await store.chooseFolder();assert.equal(store.folderName,'NEW');assert.equal(store.permissionNeeded,false);
});
