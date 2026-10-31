'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

const base=(id)=>({version:7,name:'Legacy',workspaceMode:'control',components:[],wires:[],junctions:[],...(id===undefined?{}:{projectId:id})});
function storage(entries=[]){
 const rows=new Map(entries);
 return {rows,getItem:k=>rows.get(k)??null,setItem(k,v){rows.set(k,String(v))},removeItem:k=>rows.delete(k)};
}
function indexed(value){
 return {open(){
  const req={};
  Promise.resolve().then(()=>{
   req.result={transaction(){
    const tx={objectStore(){return {get(){
     const q={};Promise.resolve().then(()=>{q.result=value;q.onsuccess();tx.oncomplete()});return q;
    }}}};return tx;
   }};
   req.onsuccess();
  });
  return req;
 }};
}
test('P0-04 legacy local draft without embedded ID adopts its storage key',async()=>{
 const s=storage([['dts-project:legacy',JSON.stringify(base())]]);
 assert.equal((await Projects.create({storage:s,indexedDB:null,env:{}}).get('legacy')).projectId,'legacy');
});
test('P0-04 recovered legacy draft saves in place without a duplicate dashboard row',async()=>{
 const s=storage([['dts-project-index',JSON.stringify([{id:'legacy',name:'Legacy'}])],['dts-project:legacy',JSON.stringify(base())]]);
 const store=Projects.create({storage:s,indexedDB:null,env:{}}),p=await store.get('legacy');
 await store.put(p);
 assert.equal(p.projectId,'legacy');
 assert.equal(store.list().length,1);
 assert.equal(s.rows.has('dts-project:legacy'),true);
});
test('P0-04 ID-less IndexedDB draft adopts its verified key',async()=>{
 const store=Projects.create({storage:storage(),indexedDB:indexed(base()),env:{}});
 assert.equal((await store.get('legacy')).projectId,'legacy');
});
test('P0-04 existing matching ID is unchanged',async()=>{
 const s=storage([['dts-project:legacy',JSON.stringify(base('legacy'))]]);
 assert.equal((await Projects.create({storage:s,indexedDB:null,env:{}}).get('legacy')).projectId,'legacy');
});
test('P0-04 mismatched project ID still cannot alias another draft',async()=>{
 const s=storage([['dts-project:legacy',JSON.stringify(base('other'))]]);
 await assert.rejects(Projects.create({storage:s,indexedDB:null,env:{}}).get('legacy'),/kimliği uyuşmuyor/);
});
test('P0-04 numeric legacy key remains supported',async()=>{
 const s=storage([['dts-project:7',JSON.stringify(base())]]);
 assert.equal((await Projects.create({storage:s,indexedDB:null,env:{}}).get(7)).projectId,7);
});
test('P0-04 empty embedded ID is treated as missing, not a foreign identity',async()=>{
 const s=storage([['dts-project:legacy',JSON.stringify(base(''))]]);
 assert.equal((await Projects.create({storage:s,indexedDB:null,env:{}}).get('legacy')).projectId,'legacy');
});
test('P0-04 recovery never removes protected example lock',async()=>{
 const s=storage([['dts-project:legacy',JSON.stringify({...base(),defaultTemplate:{id:'example',readOnly:true}})]]);
 const p=await Projects.create({storage:s,indexedDB:null,env:{}}).get('legacy');
 assert.equal(p.projectId,'legacy');
 assert.equal(Projects.isProtected(p),true);
});
