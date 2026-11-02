'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');
const base=()=>({version:7,projectId:'p0-04-panel-meta',name:'Pano',workspaceMode:'panel',components:[],wires:[],panel:{width:600,height:800,depth:220,doorAngle:105,items:[],rails:[],ducts:[],wires:[]}});
const item=()=>({id:'part1',typeId:'relay',x:100,y:100,w:40,h:60,depth:40,mount:'plate'});
for(const [label,angle] of [['string', '95'],['non-numeric','abc'],['too-high',121],['negative',-1]]) {
 test('P0-04 negative: explicit '+label+' doorAngle rejected before opening',()=>{
  const p=base();p.panel.doorAngle=angle;
  assert.throws(()=>Store.parse(JSON.stringify(p)),/Pano kapak açısı geçersiz/);
 });
}
for(const [label,mount] of [['unknown','roof'],['numeric',7],['null',null]]){
 test('P0-04 negative: '+label+' item mount rejected before opening',()=>{
  const p=base();const x=item();x.mount=mount;p.panel.items.push(x);
  assert.throws(()=>Store.parse(JSON.stringify(p)),/Pano malzeme montaj yüzeyi geçersiz/);
 });
}
test('P0-04 positive: explicit min/max door angle and valid mount preserved',()=>{
 for(const angle of [0,120]){
  const p=base();p.panel.doorAngle=angle;p.panel.items.push(item());
  const loaded=Store.parse(JSON.stringify(p));
  assert.equal(loaded.panel.doorAngle,angle);
  assert.equal(loaded.panel.items[0].mount,'plate');
  assert.equal(Panel.normalize(loaded.panel,{}).doorAngle,angle);
 }
});
test('P0-04 positive: missing legacy panel angle and mount remain importable',()=>{
 const p=base();delete p.panel.doorAngle;const x=item();delete x.mount;p.panel.items.push(x);
 assert.equal(Store.parse(JSON.stringify(p)).panel.items[0].id,'part1');
});
test('P0-04 positive: null optional angle retains previous default-handling behavior',()=>{
 const p=base();p.panel.doorAngle=null;
 assert.equal(Store.parse(JSON.stringify(p)).panel.doorAngle,null);
});
test('P0-04 negative: malformed panel angle does not hide healthy folder entries',async()=>{
 const good=base(),bad=base();bad.projectId='bad';bad.panel.doorAngle='abc';
 const files=[['good.odsdevre',good],['bad.odsdevre',bad]].map(([name,p])=>({name,size:100,lastModified:1,text:async()=>JSON.stringify(p)}));
 const storage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
 const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(files);
 const result=await store.scan();
 assert.deepEqual(result.entries.map(x=>x.project.projectId),['p0-04-panel-meta']);
 assert.equal(result.warnings.length,1);
});
test('P0-04 negative: explicitly invalid mount rejected on save too',()=>{
 const p=base();const x=item();x.mount=false;p.panel.items=[x];
 assert.throws(()=>Store.validate(p),/Pano malzeme montaj yüzeyi geçersiz/);
});
