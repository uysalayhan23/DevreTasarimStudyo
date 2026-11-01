'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=(mode,version=7)=>({projectId:'p1',name:'Workspace',version,workspaceMode:mode,components:[],wires:[]});
test('P0-04 invalid JSON workspace mode types cannot be reopened',()=>{
 for(const mode of [1,true,[],{},['installation'],['control']])
  assert.throws(()=>Projects.parse(JSON.stringify(project(mode))),/çalışma alanı türü/);
});
test('P0-04 explicit invalid mode is rejected before direct draft persistence',async()=>{
 const writes=[],storage={getItem:()=>null,setItem:key=>writes.push(key),removeItem:key=>writes.push(key)};
 const store=Projects.create({storage,indexedDB:null,env:{}});
 for(const mode of [1,false,{},['installation']])
  await assert.rejects(store.put(project(mode)),/çalışma alanı türü/);
 assert.deepEqual(writes,[]);
 assert.deepEqual(store.list(),[]);
});
test('P0-04 invalid mode is rejected before direct download blob creation',()=>{
 const writes=[];
 const env={Blob:class {constructor(){writes.push('blob')}},
  URL:{createObjectURL(){writes.push('url');return 'blob:test'},revokeObjectURL(){}},
  document:{createElement(){return{click(){writes.push('click')}}}},setTimeout(){}};
 const storage={getItem:()=>null,setItem(){},removeItem(){}};
 const store=Projects.create({storage,indexedDB:null,env});
 for(const mode of [1,true,{},['installation']])
  assert.throws(()=>store.download(project(mode)),/çalışma alanı türü/);
 assert.deepEqual(writes,[]);
});
test('P0-04 valid and legacy workspace names retain their expected mapping',()=>{
 const aliases={installation:'building',tesisat:'building',cabinet:'panel',pano:'panel','arduino-workshop':'arduino',kumanda:'control'};
 for(const [name,target] of Object.entries(aliases))
  assert.equal(Projects.parse(JSON.stringify(project(name))).workspaceMode,target);
 for(const name of ['control','building','panel','arduino','__proto__','constructor','custom-mode'])
  assert.equal(Projects.parse(JSON.stringify(project(name))).workspaceMode,name);
});
test('P0-04 supported project versions, absent mode and inferences survive',()=>{
 for(const version of [5,6,7])
  assert.equal(Projects.parse(JSON.stringify(project('installation',version))).workspaceMode,'building');
 assert.equal(Projects.parse(JSON.stringify(project(null))).workspaceMode,'control');
 assert.equal(Projects.parse(JSON.stringify(project(undefined))).workspaceMode,'control');
 assert.equal(Projects.parse(JSON.stringify({...project(null),panel:{}})).workspaceMode,'panel');
 assert.equal(Projects.parse(JSON.stringify({...project(null),components:[{id:'a',typeId:'arduino-uno'}]})).workspaceMode,'arduino');
});
