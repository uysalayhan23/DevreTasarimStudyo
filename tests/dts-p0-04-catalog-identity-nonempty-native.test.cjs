'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const base=()=>({projectId:'catalog-id-case',name:'Kimlik testi',version:7,workspaceMode:'control',components:[],wires:[]});
function schematic(typeId){return {...base(),components:[{id:'c1',typeId,x:32,y:48}]}}
function panel(typeId){return {...base(),workspaceMode:'panel',panel:{items:[{id:'c1',typeId,mount:'plate',x:50,y:50,w:50,h:60}],wires:[]}}}
test('P0-04 missing schematic catalog ID cannot reopen silently',()=>{
 for(const typeId of ['', ' ', '\t\n'])assert.throws(()=>Projects.parse(JSON.stringify(schematic(typeId))),/katalog|tür/i);
});
test('P0-04 malformed schema rejects direct save without updating index',async()=>{
 const writes=[];
 const storage={getItem:()=>null,setItem:k=>writes.push(k),removeItem:k=>writes.push(k)};
 const store=Projects.create({storage,indexedDB:null,env:{}});
 for(const typeId of ['', ' '])await assert.rejects(store.put(schematic(typeId)),/katalog|tür/i);
 assert.deepEqual(writes,[]);
});
test('P0-04 explicit blank panel catalog ID cannot reopen silently',()=>{
 for(const typeId of ['', '  '])assert.throws(()=>Projects.parse(JSON.stringify(panel(typeId))),/katalog|tür/i);
});
test('P0-04 valid schematic, future catalog model and legacy aliases remain readable',()=>{
 for(const typeId of ['lamp-green','future-unknown-model'])for(const version of [5,6,7]){
  const read=Projects.parse(JSON.stringify({...schematic(typeId),version}));
  assert.equal(read.components[0].typeId,typeId);
  assert.equal(read.version,7);
 }
});
test('P0-04 legacy panel material without typeId remains open for review',()=>{
 const p=panel('lamp-green');delete p.panel.items[0].typeId;
 assert.equal(Projects.parse(JSON.stringify(p)).panel.items[0].typeId,undefined);
 assert.equal(Projects.parse(JSON.stringify(panel('lamp-green'))).panel.items[0].typeId,'lamp-green');
});
test('P0-04 missing BOM-free/UTF8-BOM schema retains valid IDs',()=>{
 const p=schematic('lamp-green');
 assert.equal(Projects.parse('\ufeff'+JSON.stringify(p)).components[0].typeId,'lamp-green');
});
