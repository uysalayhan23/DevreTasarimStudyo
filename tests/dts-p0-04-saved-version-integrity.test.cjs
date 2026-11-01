'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=version=>({projectId:'p1',name:'Şema sürümü',version,components:[],wires:[]});
function storage(){
 const data=new Map();
 return {
  data,getItem:key=>data.get(key)??null,
  setItem:(key,value)=>data.set(key,String(value)),
  removeItem:key=>data.delete(key)
 };
}
test('P0-04 reject versions that saved project loader cannot reopen',()=>{
 for(const version of [4,999,'unknown',6.5,Infinity,-1]){
  assert.throws(()=>Projects.validate(project(version)),/şema sürümü/,String(version));
 }
});
test('P0-04 preserve valid and legacy version handling',()=>{
 for(const version of [5,6,7,'5','7',null,undefined]){
  const p=project(version);
  assert.equal(Projects.validate(p),p);
  assert.equal(Projects.parse(JSON.stringify(p)).version,7);
 }
});
test('P0-04 unsupported saved version is rejected before any local persistence',async()=>{
 const mem=storage(),store=Projects.create({storage:mem,indexedDB:null,env:{}});
 await assert.rejects(store.put(project(999)),/şema sürümü/);
 assert.equal(mem.data.size,0);
 assert.deepEqual(store.list(),[]);
});
test('P0-04 valid project still saves and reopens with original identity',async()=>{
 const mem=storage(),store=Projects.create({storage:mem,indexedDB:null,env:{}});
 const p=project(7);
 const saved=await store.put(p);
 assert.equal(saved.projectId,'p1');
 const opened=await store.get('p1');
 assert.equal(opened.projectId,'p1');
 assert.equal(opened.version,7);
 assert.equal(store.list().length,1);
});
test('P0-04 existing malformed project shape is still rejected',()=>{
 assert.throws(()=>Projects.validate({version:7,components:{},wires:[]}));
});
