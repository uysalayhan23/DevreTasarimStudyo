'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const base=()=>({projectId:'p1',version:7,workspaceMode:'control',components:[],wires:[]});
const dated=(name,updatedAt)=>({...base(),name,updatedAt});
const old=dated('Eski','2026-10-27T10:00:00Z'),newer=dated('Yeni','2026-10-28T10:00:00Z');
const memory=raw=>({getItem:key=>key==='dts-project:p1'?raw:null,setItem(){}});
function indexedDBWith(value,fail=false){
 return {open(){const req={};Promise.resolve().then(()=>{
  req.result={transaction(){
   if(fail)throw Error('IndexedDB unavailable');
   const tx={objectStore(){return {get(){const r={};Promise.resolve().then(()=>{r.result=value;r.onsuccess();tx.oncomplete()});return r}}}};
   return tx;
  }};req.onsuccess();
 });return req}};
}
test('newer local draft wins over stale IndexedDB record',async()=>{
 const store=Projects.create({storage:memory(JSON.stringify(newer)),indexedDB:indexedDBWith(old),env:{}});
 assert.equal((await store.get('p1')).name,'Yeni');
});
test('newer IndexedDB record wins over stale local draft',async()=>{
 const store=Projects.create({storage:memory(JSON.stringify(old)),indexedDB:indexedDBWith(newer),env:{}});
 assert.equal((await store.get('p1')).name,'Yeni');
});
test('same timestamps retain IndexedDB priority',async()=>{
 const store=Projects.create({storage:memory(JSON.stringify({...newer,name:'Local'})),indexedDB:indexedDBWith({...newer,name:'DB'}),env:{}});
 assert.equal((await store.get('p1')).name,'DB');
});
test('corrupt local backup does not hide valid IndexedDB record',async()=>{
 const store=Projects.create({storage:memory('{'),indexedDB:indexedDBWith(newer),env:{}});
 assert.equal((await store.get('p1')).name,'Yeni');
});
test('denied localStorage read does not hide valid IndexedDB record',async()=>{
 const storage={getItem(){throw Error('storage denied')}};
 const store=Projects.create({storage,indexedDB:indexedDBWith(newer),env:{}});
 assert.equal((await store.get('p1')).name,'Yeni');
});
test('file URL download fallback also keeps draft when IndexedDB write fails',async()=>{
 let clicks=0;
 const storage={data:new Map(),getItem(k){return this.data.get(k)||null},setItem(k,v){this.data.set(k,String(v))}};
 const env={Blob:class{constructor(parts){this.parts=parts}},URL:{createObjectURL:()=> 'blob:local',revokeObjectURL(){}},setTimeout(fn){fn()},document:{createElement:()=>({click(){clicks++}})}};
 const store=Projects.create({storage,indexedDB:indexedDBWith(null,true),env});
 const result=await store.save({...base(),name:'Çevrimdışı'});
 assert.equal(result.download,true);assert.equal(clicks,1);
 assert.equal((await store.get('p1')).name,'Çevrimdışı');
});
test('protected example remains locked after Save As download fallback',async()=>{
 let clicks=0;
 const storage={data:new Map(),getItem(k){return this.data.get(k)||null},setItem(k,v){this.data.set(k,String(v))}};
 const env={Blob:class{constructor(parts){this.parts=parts}},URL:{createObjectURL:()=> 'blob:local',revokeObjectURL(){}},setTimeout(fn){fn()},document:{createElement:()=>({click(){clicks++}})}};
 const protectedExample={...base(),defaultTemplate:{id:'starter:test',readOnly:true},name:'Örnek'};
 const store=Projects.create({storage,indexedDB:indexedDBWith(null,true),env});
 const result=await store.save(protectedExample,{saveAs:true});
 assert.equal(result.download,true);assert.equal(result.requiresOpen,true);assert.equal(clicks,1);
 assert.equal(Projects.isProtected(protectedExample),true);assert.equal(Projects.isProtected(result.project),false);
});

test('mismatched IndexedDB project ID cannot override correct local draft',async()=>{
 const store=Projects.create({storage:memory(JSON.stringify(base())),indexedDB:indexedDBWith({...base(),projectId:'other'}),env:{}});
 assert.equal((await store.get('p1')).projectId,'p1');
});
test('mismatched local project ID cannot override correct IndexedDB draft',async()=>{
 const store=Projects.create({storage:memory(JSON.stringify({...base(),projectId:'other'})),indexedDB:indexedDBWith(base()),env:{}});
 assert.equal((await store.get('p1')).projectId,'p1');
});
test('mismatched project ID without valid backup is rejected',async()=>{
 const store=Projects.create({storage:memory(null),indexedDB:indexedDBWith({...base(),projectId:'other'}),env:{}});
 await assert.rejects(store.get('p1'),/kimliği uyuşmuyor/);
});
test('matching project IDs retain normal restore behavior',async()=>{
 const store=Projects.create({storage:memory(JSON.stringify(base())),indexedDB:indexedDBWith(base()),env:{}});
 assert.equal((await store.get('p1')).projectId,'p1');
});
