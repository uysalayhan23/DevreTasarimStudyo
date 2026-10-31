'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
function fixture(rows){
  const data=new Map([['dts-project-index',JSON.stringify(rows)]]);
  const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
  return {store:Projects.create({storage,indexedDB:null,env:{}}),data};
}
test('P0-04 duplicate string index entries show only the newest card',()=>{
  const {store}=fixture([{id:'p',name:'New'},{id:'p',name:'Old'},{id:'q',name:'Other'}]);
  assert.deepEqual(store.list().map(x=>x.name),['New','Other']);
});
test('P0-04 numeric legacy ID and text ID share one card, distinct IDs remain',()=>{
  const {store}=fixture([{id:7,name:'New'},{id:'7',name:'Old'},{id:'8',name:'Other'},{id:'01',name:'Distinct'}]);
  assert.deepEqual(store.list().map(x=>x.name),['New','Other','Distinct']);
});
test('P0-04 malformed rows do not become phantom project cards',()=>{
  const {store}=fixture([{id:' ',name:'Bad'},{id:null,name:'Bad'},{id:'ok',name:'Good'},null,[],{id:{},name:'Bad'}]);
  assert.deepEqual(store.list().map(x=>x.id),['ok']);
});
test('P0-04 save/delete still preserve unrelated projects after legacy duplicates',async()=>{
  const {store}=fixture([{id:7,name:'Old'},{id:'7',name:'Older'},{id:'other',name:'Keep'}]);
  await store.put({projectId:'7',name:'New',version:7,components:[],wires:[],junctions:[]});
  assert.deepEqual(store.list().map(x=>x.name),['New','Keep']);
  await store.removeDraft(7);
  assert.deepEqual(store.list().map(x=>x.id),['other']);
});
test('P0-04 read-only index recovery does not rewrite saved raw metadata',()=>{
  const rows=[{id:'x',name:'First'},{id:'x',name:'Second'}],{store,data}=fixture(rows);
  assert.equal(store.list().length,1);
  assert.equal(data.get('dts-project-index'),JSON.stringify(rows));
});
