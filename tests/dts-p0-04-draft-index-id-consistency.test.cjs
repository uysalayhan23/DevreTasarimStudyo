'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function fixture(rows){
 const data=new Map([['dts-project-index',JSON.stringify(rows)]]);
 const storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};
 return Projects.create({storage,indexedDB:null,env:{}});
}
const draft=id=>({projectId:id,name:'Güncel',version:7,components:[],wires:[],junctions:[]});

test('P0-04 numeric legacy index is replaced by string project ID on save',async()=>{
 const store=fixture([{id:7,name:'Eski'},{id:'other',name:'Diğer'}]);
 await store.put(draft('7'));
 assert.equal(store.list().filter(row=>String(row.id)==='7').length,1);
 assert.equal(store.list().find(row=>row.id==='7').name,'Güncel');
 assert.equal(store.list().some(row=>row.id==='other'),true);
 await store.put(draft('7'));
 assert.equal(store.list().filter(row=>String(row.id)==='7').length,1);
});

test('P0-04 deletion clears numeric legacy index without deleting unrelated entries',async()=>{
 const store=fixture([{id:7,name:'Eski'},{id:'other',name:'Diğer'}]);
 await store.removeDraft('7');
 assert.deepEqual(store.list().map(row=>row.id),['other']);
});

test('P0-04 numeric delete input also matches stored string identity',async()=>{
 const store=fixture([{id:'7',name:'Eski'}]);
 await store.removeDraft(7);
 assert.deepEqual(store.list(),[]);
});

test('P0-04 distinct IDs and protected examples retain previous behavior',async()=>{
 const store=fixture([{id:'8',name:'Diğer'}]);
 await store.put(draft('7'));
 assert.equal(store.list().length,2);
 await store.put({...draft('7'),defaultTemplate:{id:'starter',readOnly:true}});
 assert.equal(store.list().length,2);
 assert.equal(store.list()[0].name,'Güncel');
});

function legacyFallback(project){
 const data=new Map([['ods-project',JSON.stringify(project)]]);
 const storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};
 return Projects.create({storage,indexedDB:null,env:{}});
}

test('P0-04 numeric legacy fallback project ID is readable through a string key',async()=>{
 const project=draft(7),store=legacyFallback(project);
 assert.equal((await store.get('7')).projectId,7);
 assert.equal((await store.get(7)).projectId,7);
});

test('P0-04 string legacy fallback project ID is readable through a numeric key',async()=>{
 const store=legacyFallback(draft('7'));
 assert.equal((await store.get(7)).projectId,'7');
});

test('P0-04 legacy fallback does not alias unrelated or missing project IDs',async()=>{
 const store=legacyFallback(draft(7));
 assert.equal(await store.get('8'),null);
 const missing=legacyFallback({...draft(7),projectId:null});
 assert.equal(await missing.get('null'),null);
});
