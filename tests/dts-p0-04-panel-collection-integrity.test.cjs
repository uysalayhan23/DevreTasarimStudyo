'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=panelData=>({projectId:'panel-1',name:'Pano',version:7,workspaceMode:'panel',
 components:[],wires:[],panel:{width:600,height:800,items:[],wires:[],...panelData}});
test('P0-04 malformed saved panel rail and duct collections are rejected before data loss',()=>{
 for(const data of [{rails:{}},{rails:'corrupted'},{rails:4},{ducts:{}},{ducts:'corrupted'},{ducts:4}]){
  assert.throws(()=>Projects.parse(JSON.stringify(project(data))),/Pano (rails|ducts) listesi geçersiz/);
  assert.throws(()=>Projects.validate(project(data)),/Pano (rails|ducts) listesi geçersiz/);
 }
});
test('P0-04 explicit malformed panel collection cannot persist a hidden or partial draft',async()=>{
 const data=new Map();
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const store=Projects.create({storage,indexedDB:null,env:{}});
 await assert.rejects(store.put(project({rails:'broken'})),/Pano rails listesi geçersiz/);
 await assert.rejects(store.put(project({ducts:{id:'x'}})),/Pano ducts listesi geçersiz/);
 assert.equal(data.size,0);
 assert.deepEqual(store.list(),[]);
});
test('P0-04 valid panel collections retain exact rail and duct identities',()=>{
 const rails=[{id:'r1',x:20,y:40,length:100}];
 const ducts=[{id:'d1',x:40,y:70,length:150,width:30}];
 const p=Projects.parse(JSON.stringify(project({rails,ducts})));
 assert.deepEqual(p.panel.rails,rails);
 assert.deepEqual(p.panel.ducts,ducts);
});
test('P0-04 missing and null legacy optional collections remain readable',()=>{
 for(const data of [{},{rails:null},{ducts:null},{rails:[],ducts:[]}]){
  const p=Projects.parse(JSON.stringify(project(data)));
  assert.equal(p.panel.width,600);
  assert.deepEqual(p.panel.rails,data.rails);
  assert.deepEqual(p.panel.ducts,data.ducts);
 }
});
test('P0-04 existing invalid required panel items and wires are still rejected',()=>{
 assert.throws(()=>Projects.parse(JSON.stringify(project({items:{}}))),/Pano malzeme listesi/);
 assert.throws(()=>Projects.parse(JSON.stringify(project({wires:{}}))),/Pano kablo listesi/);
});
