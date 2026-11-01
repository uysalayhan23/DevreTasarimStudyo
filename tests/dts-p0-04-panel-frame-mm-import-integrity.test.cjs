'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),Projects=require('../dist/project-store.js');
const project=(frame={})=>({projectId:'p1',name:'Pano',version:7,workspaceMode:'panel',
 components:[],wires:[],panel:{width:600,height:800,depth:220,items:[],wires:[],rails:[],ducts:[],...frame}});
test('P0-04 rejects invalid panel mm frame in validator and JSON import',()=>{
 for(const key of ['width','height','depth']){
  const lo=key==='depth'?100:200,hi=key==='depth'?800:2400;
  for(const value of ['bad',false,{},[],0,-1,lo-1,hi+1,Infinity]){
   const p=project({[key]:value});
   assert.throws(()=>Projects.validate(p),/Pano (width|height|depth) fiziksel ölçüsü/);
   // JSON serializes Infinity as null, which is a supported legacy optional value.
   if(value!==Infinity)assert.throws(()=>Projects.parse(JSON.stringify(p)),/Pano (width|height|depth) fiziksel ölçüsü/);
  }
 }
});
test('P0-04 preserves valid mm boundaries and exact frame coordinates',()=>{
 for(const key of ['width','height','depth'])for(const value of [key==='depth'?100:200,key==='depth'?800:2400])
  assert.equal(Projects.parse(JSON.stringify(project({[key]:value}))).panel[key],value);
 assert.deepEqual(Projects.parse(JSON.stringify(project())).panel,project().panel);
});
test('P0-04 preserves missing and null legacy dimensions',()=>{
 for(const key of ['width','height','depth'])for(const value of [null,undefined])
  assert.equal(Projects.parse(JSON.stringify(project({[key]:value}))).panel[key],value);
});
test('P0-04 invalid mm frame cannot persist an orphaned project',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const s=Projects.create({storage,indexedDB:null,env:{}});
 for(const frame of [{width:'bad'},{height:0},{depth:900}])
  await assert.rejects(s.put(project(frame)),/Pano (width|height|depth) fiziksel ölçüsü/);
 assert.equal(data.size,0);
 assert.deepEqual(s.list(),[]);
});
test('P0-04 valid mm frame draft still saves and reopens intact',async()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
 const s=Projects.create({storage,indexedDB:null,env:{}});
 const saved=await s.put(project({width:1200,height:1000,depth:260}));
 const opened=await s.get(saved.projectId);
 assert.equal(opened.panel.width,1200);
 assert.equal(opened.panel.height,1000);
 assert.equal(opened.panel.depth,260);
 assert.equal(s.list().length,1);
});
test('P0-04 rails, ducts and numeric zero IDs retain existing validation',()=>{
 assert.throws(()=>Projects.parse(JSON.stringify(project({rails:'broken'}))),/Pano rails listesi/);
 assert.throws(()=>Projects.parse(JSON.stringify(project({ducts:{}}))),/Pano ducts listesi/);
 assert.equal(Projects.parse(JSON.stringify({...project(),projectId:0})).projectId,0);
});
