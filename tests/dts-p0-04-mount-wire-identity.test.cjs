'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');
const component=id=>({id,typeId:'relay',mount:'plate',x:id==='c1'?30:120,y:30,w:40,h:40,depth:20});
const rail=id=>({id,x:35,y:110,length:230});
const duct=id=>({id,x:40,y:160,width:30,length:180,vertical:false});
const wire=id=>({id,from:{c:'c1',p:'1'},to:{c:'c2',p:'1'}});
const project=()=>({version:7,projectId:'id-test',name:'Pano',workspaceMode:'panel',components:[],wires:[],panel:{width:600,height:800,depth:220,items:[component('c1'),component('c2')],rails:[rail('rail-A')],ducts:[duct('duct-B')],wires:[wire('wire-C')]}});
const read=p=>Store.parse(JSON.stringify(p));
for(const [kind,id] of [['rail','rail-A'],['duct','duct-B']]) {
 test('negative: '+kind+' ID cannot also be panel wire ID when parsing',()=>{
  const p=project();p.panel.wires[0].id=id;
  assert.throws(()=>read(p),/Pano kablo kimliği/);
 });
 test('negative: '+kind+' ID cannot also be panel wire ID when validating',()=>{
  const p=project();p.panel.wires[0].id=id;
  assert.throws(()=>Store.validate(p),/Pano kablo kimliği/);
 });
}
test('negative: numeric legacy wire id must not alias string rail id',()=>{
 const p=project();p.panel.rails[0].id='17';p.panel.wires[0].id=17;
 assert.throws(()=>read(p),/Pano kablo kimliği/);
});
test('positive: independent wire, rail and duct IDs survive parse',()=>{
 const p=project(),out=read(p);
 assert.equal(out.panel.wires[0].id,'wire-C');
 assert.equal(out.panel.rails[0].id,'rail-A');
 assert.equal(out.panel.ducts[0].id,'duct-B');
 assert.doesNotThrow(()=>Panel.normalize(structuredClone(out.panel)));
});
test('positive: legacy numeric wire id remains supported when independent',()=>{
 const p=project();p.panel.wires[0].id=17;
 assert.equal(read(p).panel.wires[0].id,17);
});
test('positive: unnamed legacy panel wire remains supported',()=>{
 const p=project();delete p.panel.wires[0].id;
 assert.equal(read(p).panel.wires[0].id,undefined);
});
test('negative: wire ID colliding with component is still blocked',()=>{
 const p=project();p.panel.wires[0].id='c1';
 assert.throws(()=>read(p),/Pano kablo kimliği/);
});
test('negative: duplicate wire IDs remain blocked',()=>{
 const p=project();p.panel.wires=[wire('wire-C'),wire('wire-C')];
 assert.throws(()=>read(p),/Pano kablo kimliği/);
});
test('negative: overlapping mount/wire ID cannot hide healthy project in folder scan',async()=>{
 const good=project(),bad=project();bad.projectId='bad';bad.panel.wires[0].id='duct-B';
 const files=[['good.odsdevre',good],['bad.odsdevre',bad]].map(([name,p])=>({name,lastModified:1,size:120,text:async()=>JSON.stringify(p)}));
 const storage={getItem:()=>null,setItem:()=>{},removeItem:()=>{}};
 const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(files);
 const scan=await store.scan();
 assert.deepEqual(scan.entries.map(x=>x.project.projectId),['id-test']);
 assert.equal(scan.warnings.length,1);
});
test('positive: valid saved panel is not mutated by parse',()=>{
 const p=project(),before=JSON.stringify(p);
 assert.deepEqual(read(p),Store.migrate(p));
 assert.equal(JSON.stringify(p),before);
});
