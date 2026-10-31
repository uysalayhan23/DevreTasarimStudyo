'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

const project=id=>({projectId:id,name:'Kayıt',version:7,workspaceMode:'control',components:[],wires:[]});
function memory(){
 const values=new Map();
 return {values,storage:{
  getItem:key=>values.get(key)??null,
  setItem:(key,value)=>values.set(key,String(value)),
  removeItem:key=>values.delete(key)
 }};
}
test('P0-04 zero numeric project ID survives draft put, index and get',async()=>{
 const {storage}=memory(),store=Projects.create({storage,indexedDB:null,env:{}}),p=project(0);
 const saved=await store.put(p);
 assert.equal(p.projectId,0);
 assert.equal(saved.projectId,0);
 assert.equal(store.list()[0].id,0);
 assert.equal((await store.get(0)).projectId,0);
});
test('P0-04 positive numeric and string zero IDs remain compatible',async()=>{
 for(const id of [1,'0','p1']){
  const {storage}=memory(),store=Projects.create({storage,indexedDB:null,env:{}}),p=project(id);
  assert.equal((await store.put(p)).projectId,id);
  assert.equal((await store.get(id)).projectId,id);
 }
});
test('P0-04 missing and empty IDs still receive generated IDs',async()=>{
 for(const id of [null,undefined,'']){
  const {storage}=memory(),store=Projects.create({storage,indexedDB:null,env:{}});
  const saved=await store.put(project(id));
  assert.equal(typeof saved.projectId,'string');
  assert.equal(saved.projectId.startsWith('dts-'),true);
 }
});
test('P0-04 invalid object IDs are rejected without overwriting an existing draft',async()=>{
 const {storage}=memory(),store=Projects.create({storage,indexedDB:null,env:{}});
 await store.put(project('stable'));
 await assert.rejects(()=>store.put(project({bad:1})),/Proje kimliği/);
 assert.equal((await store.get('stable')).projectId,'stable');
 assert.equal(store.list().length,1);
});
test('P0-04 download fallback keeps zero ID and its retrievable draft',async()=>{
 const {storage}=memory();
 let downloaded='';
 const env={
  Blob:class{constructor(parts){this.parts=parts}},
  URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},
  document:{createElement:()=>({click(){downloaded=this.download}})},
  setTimeout:()=>{}
 };
 const store=Projects.create({storage,indexedDB:null,env});
 const result=await store.save(project(0));
 assert.equal(result.download,true);
 assert.equal(result.project.projectId,0);
 assert.equal(downloaded,'Kayıt.odsdevre');
 assert.equal((await store.get(0)).projectId,0);
});
test('P0-04 folder cache and reopen preserve zero ID',async()=>{
 const {storage}=memory(),raw=JSON.stringify(project(0));
 const file={name:'zero.odsdevre',size:raw.length,lastModified:1,text:async()=>raw};
 const handle={kind:'file',name:file.name,getFile:async()=>file};
 const folder={
  name:'Projects',kind:'directory',
  queryPermission:async()=> 'granted',
  requestPermission:async()=> 'granted',
  async *entries(){yield [file.name,handle]},
  getFileHandle:async()=>handle
 };
 const store=Projects.create({storage,indexedDB:null,env:{showDirectoryPicker:async()=>folder}});
 await store.chooseFolder();
 const entries=(await store.scan()).entries;
 assert.equal(entries.length,1);
 assert.equal(JSON.parse(storage.getItem('dts-folder-index')).entries[0].project.projectId,0);
 assert.equal((await store.readEntry(entries[0])).projectId,0);
});
test('P0-04 disk Save preserves numeric zero identity of original file',async()=>{
 const {storage}=memory();
 let raw=JSON.stringify(project(0)),stamp=1;
 const handle={
  name:'zero.odsdevre',kind:'file',
  queryPermission:async()=> 'granted',
  getFile:async()=>({size:raw.length,lastModified:stamp,text:async()=>raw}),
  createWritable:async()=>{
   let next;
   return {write:async value=>{next=value},close:async()=>{raw=next;stamp++},abort:async()=>{}};
  }
 };
 const store=Projects.create({storage,indexedDB:null,env:{showOpenFilePicker:async()=>[handle]}});
 const opened=(await store.openFile()).project;
 assert.equal(opened.projectId,0);
 opened.name='Güncel';
 const result=await store.save(opened);
 assert.equal(result.saved,true);
 assert.equal(result.project.projectId,0);
 assert.equal(JSON.parse(raw).projectId,0);
 assert.equal((await store.get(0)).name,'Güncel');
});
