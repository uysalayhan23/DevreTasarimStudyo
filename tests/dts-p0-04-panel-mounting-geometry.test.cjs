'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');
const base=()=>({version:7,projectId:'P',name:'Pano',workspaceMode:'panel',components:[],wires:[],panel:{width:600,height:800,depth:220,items:[],wires:[],rails:[],ducts:[]}});
function entry(kind,part){const p=base();p.panel[kind]=[part];return p}
const parse=p=>Store.parse(JSON.stringify(p));
for(const [kind,key,value] of [
 ['rails','x','40'],['rails','y',null],['rails','length','300'],['rails','length',-20],
 ['ducts','x',true],['ducts','y',[]],['ducts','width','30'],['ducts','length',0]
])test('P0-04 negative: '+kind+' malformed '+key+' is rejected before panel normalization',()=>{
 const part=kind==='rails'?{id:'r1',x:40,y:100,length:300}:{id:'d1',x:40,y:100,width:30,length:200,vertical:false};
 part[key]=value;
 const bad=entry(kind,part);
 assert.throws(()=>parse(bad),/Pano ray\/kanal geometrisi geçersiz/);
});
test('P0-04 negative: string false duct orientation cannot be interpreted as true',()=>{
 assert.throws(()=>parse(entry('ducts',{id:'d1',x:40,y:100,width:30,length:200,vertical:'false'})),/Pano kablo kanalı yönü geçersiz/);
});
test('P0-04 positive: legal numeric rail/duct geometry and Boolean orientation preserved',()=>{
 const p=base();p.panel.rails=[{id:'r1',x:0,y:80,length:300}];p.panel.ducts=[{id:'d1',x:40,y:100,width:30,length:200,vertical:false}];
 const q=parse(p);assert.deepEqual(q.panel.rails,p.panel.rails);assert.deepEqual(q.panel.ducts,p.panel.ducts);
 assert.ok(Panel.normalize(q.panel,{}));
});
test('P0-04 positive: historical id-only mounting entries remain importable',()=>{
 const p=base();p.panel.rails=[{id:'r1'}];p.panel.ducts=[{id:'d1'}];
 assert.deepEqual(parse(p).panel.rails,p.panel.rails);
});
test('P0-04 negative: corrupt geometry is isolated by folder scan; healthy project remains visible',async()=>{
 const valid=base(),bad=entry('rails',{id:'r1',x:'40',y:100,length:300});
 const files=[['healthy.odsdevre',valid],['bad.odsdevre',bad]].map(([name,p])=>({name,lastModified:1,size:Buffer.byteLength(JSON.stringify(p)),text:async()=>JSON.stringify(p)}));
 const storage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
 const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(files);
 const result=await store.scan();assert.deepEqual(result.entries.map(e=>e.name),['healthy.odsdevre']);assert.equal(result.warnings.length,1);
});
test('P0-04 evidence: panel engine refuses imported malformed explicit rail data',()=>{
 const p=entry('rails',{id:'r1',x:'40',y:100,length:300});
 assert.throws(()=>Panel.normalize(p.panel,{}),/konum veya ölçü bilgileri geçersiz/);
});
