'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=id=>({version:7,workspaceMode:'control',projectId:id,name:'Taslak',components:[],wires:[],junctions:[]});
function memory(){
 const rows=new Map();
 return {rows,storage:{getItem:k=>rows.get(k)||null,setItem:(k,v)=>rows.set(k,v),removeItem:k=>rows.delete(k)}};
}
test('P0-04 imported object, array and boolean IDs are rejected before persistence',()=>{
 for(const id of [{a:1},{b:2},['7'],true,false])
  assert.throws(()=>Projects.parse(JSON.stringify(project(id))),/Proje kimliği/);
});
test('P0-04 non-finite in-memory IDs cannot become browser storage keys',()=>{
 for(const id of [Infinity,-Infinity,NaN])
  assert.throws(()=>Projects.validate(project(id)),/Proje kimliği/);
});
test('P0-04 legacy numeric and string project IDs remain readable',()=>{
 assert.equal(Projects.parse(JSON.stringify(project(7))).projectId,7);
 assert.equal(Projects.parse(JSON.stringify(project('7'))).projectId,'7');
 assert.equal(Projects.parse(JSON.stringify(project(null))).projectId,null);
});
test('P0-04 missing project ID still receives a unique draft ID',async()=>{
 const {storage}=memory(),store=Projects.create({storage,indexedDB:null,env:{}});
 const saved=await store.put(project(undefined));
 assert.equal(typeof saved.projectId,'string');
 assert.equal((await store.get(saved.projectId)).projectId,saved.projectId);
});
test('P0-04 rejected object ID never overwrites an existing draft or index',async()=>{
 const {rows,storage}=memory(),store=Projects.create({storage,indexedDB:null,env:{}});
 await store.put(project('stable'));
 await assert.rejects(()=>store.put(project({a:1})),/Proje kimliği/);
 await assert.rejects(()=>store.put(project({b:2})),/Proje kimliği/);
 assert.equal(rows.has('dts-project:[object Object]'),false);
 assert.equal((await store.get('stable')).projectId,'stable');
 assert.deepEqual(store.list().map(row=>row.id),['stable']);
});
test('P0-04 invalid project ID cannot invoke disk picker or fallback download',async()=>{
 const {storage}=memory();let opened=0;
 const store=Projects.create({storage,indexedDB:null,env:{showSaveFilePicker(){opened++}}});
 await assert.rejects(()=>store.save(project({a:1})),/Proje kimliği/);
 assert.equal(opened,0);
});
