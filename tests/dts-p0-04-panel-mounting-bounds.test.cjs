'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const project=()=>({version:7,projectId:'panel-bounds',name:'Pano',workspaceMode:'panel',components:[],wires:[],panel:{items:[],wires:[],rails:[],ducts:[]}});
const mounting=(type,count)=>Array.from({length:count},(_,i)=>({id:type+'-'+i}));
function make(type,count){const p=project();p.panel[type]=mounting(type,count);return p;}
for(const kind of ['rails','ducts']){
 test('P0-04 negative: '+kind+' 10001 entries rejected on parse',()=>{
  assert.throws(()=>Store.parse(JSON.stringify(make(kind,10001))),/Pano ray\/kanal sayısı/);
 });
 test('P0-04 negative: '+kind+' 10001 entries rejected by validate',()=>{
  assert.throws(()=>Store.validate(make(kind,10001)),/Pano ray\/kanal sayısı/);
 });
 test('P0-04 positive: '+kind+' 10000 entries remain accepted',()=>{
  const p=Store.parse(JSON.stringify(make(kind,10000)));
  assert.equal(p.panel[kind].length,10000);
 });
}
test('P0-04 positive: ordinary mixed rail/duct project still accepted',()=>{
 const p=project();p.panel.rails=[{id:'R1'}];p.panel.ducts=[{id:'D1'}];p.panel.items=[{id:'C1',typeId:'relay'}];
 const loaded=Store.parse(JSON.stringify(p));
 assert.equal(loaded.panel.items.length,1);assert.equal(loaded.panel.rails[0].id,'R1');
});
test('P0-04 negative: invalid folder mounting data does not hide healthy project',async()=>{
 const valid=project(),invalid=make('rails',10001);
 const files=[['valid.odsdevre',valid],['invalid.odsdevre',invalid]].map(([name,p])=>({name,size:Buffer.byteLength(JSON.stringify(p)),lastModified:1,text:async()=>JSON.stringify(p)}));
 const storage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
 const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(files);
 const scan=await store.scan();
 assert.deepEqual(scan.entries.map(e=>e.name),['valid.odsdevre']);
 assert.equal(scan.warnings.length,1);
 assert.match(scan.warnings[0],/invalid.odsdevre/);
});
test('P0-04 positive: saved ordinary project roundtrips after new bounds',()=>{
 const p=project();p.panel.rails=[{id:'rail1'}];p.panel.ducts=[{id:'duct1'}];
 assert.deepEqual(Store.parse(JSON.stringify(p)).panel.rails,p.panel.rails);
});
