'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');
const base=()=>({version:7,projectId:'S',name:'Pano',workspaceMode:'panel',components:[],wires:[],panel:{width:600,height:800,depth:220,items:[],wires:[],rails:[],ducts:[]}});
const item=()=>({id:'i1',typeId:'relay',mount:'plate',x:25,y:30,w:40,h:60,depth:70});
for(const [field,value] of [['w',1],['h',4.999],['w',-1],['h',0],['depth',-3]]) {
 test('negative: invalid explicit panel item '+field+'='+value+' rejected before open',()=>{
   const p=base();p.panel.items=[{...item(),[field]:value}];
   assert.throws(()=>Store.parse(JSON.stringify(p)),/Pano malzeme geometrisi geçersiz/);
 });
}
for(const invalid of [42,[],{},false,null]) {
 test('negative: invalid explicit typeId '+String(invalid)+' rejected before open',()=>{
   const p=base();p.panel.items=[{...item(),typeId:invalid}];
   assert.throws(()=>Store.parse(JSON.stringify(p)),/Pano malzeme katalog türü geçersiz/);
 });
}
test('positive: established legacy depth zero remains importable',()=>{
 const p=base();p.panel.items=[{...item(),depth:0}];assert.equal(Store.parse(JSON.stringify(p)).panel.items[0].depth,0);
});
test('positive: inclusive legal item footprint minima roundtrip with panel engine',()=>{
 const p=base();p.panel.items=[{...item(),w:5,h:5,depth:1}];
 const loaded=Store.parse(JSON.stringify(p));assert.deepEqual(loaded.panel.items,p.panel.items);
 assert.equal(Panel.normalize(loaded.panel,{}).items.length,1);
});
test('positive: legacy omitted item dimensions and typeId remain readable',()=>{
 const p=base();p.panel.items=[{id:'old'}];
 const loaded=Store.parse(JSON.stringify(p));assert.deepEqual(loaded.panel.items,p.panel.items);
});
test('positive: corrupt item file isolated from good projects in folder listing',async()=>{
 const good=base();good.panel.items=[item()];
 const bad=base();bad.projectId='bad';bad.panel.items=[{...item(),w:2}];
 const files=[['good.odsdevre',good],['bad.odsdevre',bad]].map(([name,p])=>({name,size:120,lastModified:1,text:async()=>JSON.stringify(p)}));
 const storage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
 const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(files);
 const result=await store.scan();assert.deepEqual(result.entries.map(e=>e.project.projectId),['S']);assert.equal(result.warnings.length,1);
});
test('positive: source project unchanged after bad external file rejection',()=>{
 const p=base();p.panel.items=[{...item(),typeId:[] }];const before=JSON.stringify(p);
 assert.throws(()=>Store.parse(before),/Pano malzeme katalog türü geçersiz/);
 assert.equal(JSON.stringify(p),before);
});
