'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const Panel=require('../dist/panel.js');
function base(){return {version:7,projectId:'capacity',name:'Panel',components:[],wires:[],workspaceMode:'panel',panel:{width:600,height:800,depth:220,items:[],wires:[],rails:[],ducts:[]}}}
const makeItem=i=>({id:'i'+i,typeId:'relay',mount:'plate',x:30,y:30,w:40,h:60,depth:50});
const makeRail=i=>({id:'r'+i,x:40,y:120,length:300});
const makeDuct=i=>({id:'d'+i,x:40,y:160,width:30,length:200,vertical:false});
const cases=[['items',makeItem,5000],['rails',makeRail,1000],['ducts',makeDuct,1000]];
for(const [kind,maker,max] of cases){
  test(`negative: reject ${max+1} ${kind} before panel normalization`,()=>{
    const p=base();p.panel[kind]=Array.from({length:max+1},(_,i)=>maker(i));
    assert.throws(()=>Panel.normalize(p.panel),/çok fazla nesne/);
    assert.throws(()=>Store.parse(JSON.stringify(p)),/çok fazla|sınırını|çok büyük/);
  });
  test(`negative: reject ${max+1} ${kind} when saving`,()=>{
    const p=base();p.panel[kind]=Array.from({length:max+1},(_,i)=>maker(i));
    assert.throws(()=>Store.validate(p),/çok fazla|sınırını|çok büyük/);
  });
  test(`positive: accept exact ${max} ${kind} collection cap`,()=>{
    const p=base();p.panel[kind]=Array.from({length:max},(_,i)=>maker(i));
    const read=Store.parse(JSON.stringify(p));
    assert.equal(read.panel[kind].length,max);
    assert.equal(Panel.normalize(read.panel)[kind].length,max);
  });
}
test('positive: normal mixed panel stays valid',()=>{
  const p=base();p.panel.items.push(makeItem(1));p.panel.rails.push(makeRail(1));p.panel.ducts.push(makeDuct(1));
  const v=Store.parse(JSON.stringify(p));assert.equal(v.panel.items.length,1);assert.equal(Panel.normalize(v.panel).rails.length,1);
});

test('negative: one oversized panel file does not hide healthy projects in folder scan',async()=>{
  const good=base(),bad=base();bad.projectId='bad';bad.panel.rails=Array.from({length:1001},(_,i)=>makeRail(i));
  const fs=[['good.odsdevre',good],['bad.odsdevre',bad]].map(([name,p])=>({name,lastModified:1,size:Buffer.byteLength(JSON.stringify(p)),text:async()=>JSON.stringify(p)}));
  const storage={getItem:()=>null,setItem(){},removeItem(){}};
  const store=Store.create({storage,indexedDB:null,env:{}});store.useFolderFiles(fs);
  const result=await store.scan();
  assert.deepEqual(result.entries.map(e=>e.project.projectId),['capacity']);
  assert.equal(result.warnings.length,1);assert.match(result.warnings[0],/bad.odsdevre/);
});
