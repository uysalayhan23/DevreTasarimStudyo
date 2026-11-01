'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=(fields={})=>({
 projectId:'p1',version:7,name:'Pano',workspaceMode:'panel',components:[],wires:[],
 panel:{width:600,height:800,depth:220,items:[],rails:[],ducts:[],wires:[],...fields}
});
const rail=id=>({id,x:40,y:100,length:200});
const duct=id=>({id,x:20,y:200,width:25,length:100});
test('P0-04 rejects repeated DIN rail and cable duct IDs before panel open',()=>{
 for(const fields of [{rails:[rail('r'),rail('r')]},{ducts:[duct('d'),duct('d')]}]){
  assert.throws(()=>Projects.parse(JSON.stringify(project(fields))),/Pano ray\/kanal kimliği/);
  assert.throws(()=>Projects.validate(project(fields)),/Pano ray\/kanal kimliği/);
 }
});
test('P0-04 rejects shared mounting IDs across item rail and duct collections',()=>{
 for(const fields of [
  {rails:[rail('part')],items:[{id:'part',typeId:'lamp'}]},
  {ducts:[duct('part')],items:[{id:'part',typeId:'lamp'}]},
  {rails:[rail('shared')],ducts:[duct('shared')]},
  {items:[{id:123,typeId:'lamp'}],rails:[rail('123')]}
 ])assert.throws(()=>Projects.parse(JSON.stringify(project(fields))),/Pano ray\/kanal kimliği/);
});
test('P0-04 rejects malformed rail duct identities, not just duplicates',()=>{
 for(const value of ['', '  ',123,null,undefined]){
  const entry=value===null?null:rail(value);
  assert.throws(()=>Projects.parse(JSON.stringify(project({rails:[entry]}))),/Pano ray\/kanal kimliği/);
  const other=value===null?null:duct(value);
  assert.throws(()=>Projects.parse(JSON.stringify(project({ducts:[other]}))),/Pano ray\/kanal kimliği/);
 }
});
test('P0-04 preserves valid physical parts and legacy numeric item IDs',()=>{
 const p=project({items:[{id:123,typeId:'lamp'}],rails:[rail('r1')],ducts:[duct('d1')]});
 const result=Projects.parse(JSON.stringify(p));
 assert.deepEqual(result.panel.items,p.panel.items);
 assert.deepEqual(result.panel.rails,p.panel.rails);
 assert.deepEqual(result.panel.ducts,p.panel.ducts);
});
test('P0-04 preserves optional absent and empty legacy rail/duct fields',()=>{
 for(const value of [undefined,null,[]]){
  const p=Projects.parse(JSON.stringify(project({rails:value,ducts:value})));
  assert.deepEqual(p.panel.rails,value);
  assert.deepEqual(p.panel.ducts,value);
 }
});
test('P0-04 invalid mount IDs fail before a draft or index can be persisted',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const s=Projects.create({storage,indexedDB:null,env:{}});
 await assert.rejects(s.put(project({rails:[rail('same'),rail('same')]})),/Pano ray\/kanal kimliği/);
 assert.equal(data.size,0);
 assert.deepEqual(s.list(),[]);
});
test('P0-04 preserves previously distinct panel wire and rail namespaces',()=>{
 const p=project({rails:[rail('R1')],wires:[]});
 assert.equal(Projects.validate(p),p);
});
