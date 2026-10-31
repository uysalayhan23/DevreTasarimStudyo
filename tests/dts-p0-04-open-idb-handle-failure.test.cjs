'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=()=>({projectId:'open-1',name:'Diskteki proje',version:7,workspaceMode:'control',components:[],wires:[]});
const storage=()=>({getItem:()=>null,setItem(){},removeItem(){}});
function brokenIndexedDB(){
 return {open(){const request={};queueMicrotask(()=>{
  request.result={transaction(){throw Error('IndexedDB transaction unavailable')}};
  request.onsuccess();
 });return request}};
}
function handle(raw=JSON.stringify(project())){
 return {name:'Disk.odsdevre',kind:'file',queryPermission:async()=> 'granted',
  getFile:async()=>({size:raw.length,lastModified:7,text:async()=>raw})};
}
test('openFile keeps a valid disk project open when IndexedDB handle cache fails',async()=>{
 const h=handle();const store=Projects.create({storage:storage(),indexedDB:brokenIndexedDB(),env:{showOpenFilePicker:async()=>[h]}});
 const opened=await store.openFile();assert.equal(opened.project.name,'Diskteki proje');
});
test('readEntry keeps a valid disk project open when IndexedDB handle cache fails',async()=>{
 const h=handle();const store=Projects.create({storage:storage(),indexedDB:brokenIndexedDB(),env:{}});
 const opened=await store.readEntry({handle:h,name:h.name});assert.equal(opened.projectId,'open-1');
});
test('invalid disk JSON remains rejected even when IndexedDB cache is unavailable',async()=>{
 const h=handle('{');const store=Projects.create({storage:storage(),indexedDB:brokenIndexedDB(),env:{showOpenFilePicker:async()=>[h]}});
 await assert.rejects(store.openFile());
});

test('successful IndexedDB handle persistence remains available',async()=>{
 const writes=[];const indexedDB={open(){const request={};queueMicrotask(()=>{
  request.result={transaction(){const tx={objectStore(){return {put(value,key){const r={};queueMicrotask(()=>{writes.push({value,key});r.onsuccess();tx.oncomplete()});return r}}}};return tx}};
  request.onsuccess();
 });return request}};
 const h=handle();const store=Projects.create({storage:storage(),indexedDB,env:{showOpenFilePicker:async()=>[h]}});
 assert.equal((await store.openFile()).project.projectId,'open-1');
 assert.equal(writes.length,1);assert.equal(writes[0].key,'handle:open-1');assert.equal(writes[0].value.handle,h);
});
