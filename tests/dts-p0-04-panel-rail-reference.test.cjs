'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');
const fixture=()=>({version:7,projectId:'rail-reference',name:'Pano',workspaceMode:'panel',components:[],wires:[],panel:{width:600,height:800,depth:220,items:[{id:'C1',typeId:'relay',mount:'rail',railId:'R1',x:100,y:120,w:45,h:80,depth:60}],rails:[{id:'R1',x:40,y:160,length:300}],ducts:[{id:'D1',x:40,y:260,length:200,width:30,vertical:false}],wires:[]}});
const parse=p=>Store.parse(JSON.stringify(p));
for(const [name,invalid] of [
 ['deleted rail','missing-rail'],['accessory duct','D1'],['numeric rail ID',7],['empty rail ID',''],['null rail ID',null],['array rail ID',['R1']]
]){
 test('P0-04 negative: explicit '+name+' rail reference is rejected before opening',()=>{
   const p=fixture();p.panel.items[0].railId=invalid;
   assert.throws(()=>parse(p),/Pano ray montaj referansı geçersiz/);
 });
}
test('P0-04 negative: direct save-side validation rejects deleted rail reference',()=>{
 const p=fixture();p.panel.rails=[];
 assert.throws(()=>Store.validate(p),/Pano ray montaj referansı geçersiz/);
});
test('P0-04 positive: valid mounted rail reference round trips unchanged',()=>{
 const p=fixture(),out=parse(p);assert.deepEqual(out.panel.items,p.panel.items);
 assert.equal(Panel.check(out.panel,out.panel.items[0]).ok,true);
});
test('P0-04 positive: absent legacy rail reference remains readable',()=>{
 const p=fixture();delete p.panel.items[0].railId;
 const out=parse(p);assert.equal(out.panel.items[0].railId,undefined);
});
test('P0-04 positive: existing non-rail mounting must ignore old railId metadata',()=>{
 const p=fixture();p.panel.items[0].mount='plate';p.panel.items[0].railId='removed';
 assert.equal(parse(p).panel.items[0].railId,'removed');
});
test('P0-04 negative: bad rail reference cannot suppress a good project in a folder listing',async()=>{
 const good=fixture(),bad=fixture();bad.projectId='bad';bad.panel.items[0].railId='deleted';
 const files=[['good.odsdevre',good],['bad.odsdevre',bad]].map(([name,p])=>({name,lastModified:1,size:Buffer.byteLength(JSON.stringify(p)),text:async()=>JSON.stringify(p)}));
 const storage={getItem:()=>null,setItem(){},removeItem(){}};
 const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(files);
 const r=await store.scan();assert.deepEqual(r.entries.map(e=>e.project.projectId),['rail-reference']);assert.equal(r.warnings.length,1);
});
