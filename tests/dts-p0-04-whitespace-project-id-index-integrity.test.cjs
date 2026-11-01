'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=id=>({projectId:id,version:7,name:'Identity check',workspaceMode:'control',components:[],wires:[]});
function fixture(){
 const records=new Map(),events=[];
 const storage={getItem:k=>records.get(k)??null,setItem:(k,v)=>records.set(k,String(v)),removeItem:k=>records.delete(k)};
 const env={Blob:class{constructor(){events.push('blob')}},
  URL:{createObjectURL(){events.push('url');return 'blob:test'},revokeObjectURL(){}},
  document:{createElement(){return{click(){events.push('click')}}}},
  setTimeout(){}};
 return {store:Projects.create({storage,indexedDB:null,env}),records,events};
}
test('P0-04 whitespace-only saved project IDs fail validation and file import',()=>{
 for(const id of [' ','  ','\t','\n','\u00a0']){
  assert.throws(()=>Projects.validate(project(id)),/kimliği yalnız boşluk/);
  assert.throws(()=>Projects.parse(JSON.stringify(project(id))),/kimliği yalnız boşluk/);
 }
});
test('P0-04 invalid IDs cannot create hidden drafts',async()=>{
 for(const id of ['  ','\t','\n','\u00a0']){
  const f=fixture();
  await assert.rejects(f.store.put(project(id)),/kimliği yalnız boşluk/);
  assert.equal(f.records.size,0);
  assert.deepEqual(f.store.list(),[]);
 }
});
test('P0-04 invalid IDs cannot create download blob or click',()=>{
 const f=fixture();
 assert.throws(()=>f.store.download(project('   ')),/kimliği yalnız boşluk/);
 assert.deepEqual(f.events,[]);
});
test('P0-04 truly missing or empty IDs still receive visible generated IDs',async()=>{
 for(const id of ['',null,undefined]){
  const f=fixture(),p=project(id),saved=await f.store.put(p);
  assert.equal(typeof saved.projectId,'string');
  assert.ok(saved.projectId.trim());
  assert.equal(f.store.list().length,1);
  assert.equal((await f.store.get(saved.projectId)).projectId,saved.projectId);
 }
});
test('P0-04 legacy numeric zero and ordinary IDs stay intact',async()=>{
 for(const id of [0,'0','normal-id','a b']){
  const f=fixture(),saved=await f.store.put(project(id));
  assert.equal(saved.projectId,id);
  assert.equal(f.store.list().length,1);
  assert.equal((await f.store.get(id)).projectId,id);
 }
});
test('P0-04 invalid ID types still fail',()=>{
 for(const id of [false,{},[],Infinity,NaN])
  assert.throws(()=>Projects.validate(project(id)),/Proje kimliği/);
});
