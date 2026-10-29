'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const sample=()=>({version:7,workspaceMode:'panel',name:'Pano testi',
 components:[],wires:[],junctions:[],
 panel:{width:600,height:800,items:[
  {id:'a',typeId:'lamp-green',x:80,y:100,w:32,h:32},
  {id:'b',typeId:'push-no',x:140,y:100,w:32,h:32}
 ],wires:[{id:'W1',from:{c:'a',p:'1'},to:{c:'b',p:'2'}}]}});
const parse=p=>Projects.parse(JSON.stringify(p));
test('P0-04 unique panel item and cable IDs preserve original project and structure',()=>{
 const p=sample(),snapshot=JSON.stringify(p),loaded=parse(p);
 assert.equal(loaded.panel.items.length,2);
 assert.equal(loaded.panel.wires[0].id,'W1');
 assert.equal(JSON.stringify(p),snapshot);
});
test('P0-04 repeated panel part IDs fail closed instead of selecting an arbitrary component',()=>{
 const p=sample();p.panel.items[1].id='a';
 assert.throws(()=>parse(p),/Pano malzeme kimliği/);
});
test('P0-04 empty panel part ID and malformed item array are invalid',()=>{
 const p=sample();p.panel.items[0].id=' ';
 assert.throws(()=>parse(p),/Pano malzeme kimliği/);
 p.panel.items={};
 assert.throws(()=>parse(p),/Pano malzeme listesi/);
});
test('P0-04 repeated and blank panel cable identities are rejected',()=>{
 const p=sample();p.panel.wires.push({...p.panel.wires[0]});
 assert.throws(()=>parse(p),/Pano kablo kimliği/);
 p.panel.wires=[{id:'  ',from:{c:'a',p:'1'},to:{c:'b',p:'2'}}];
 assert.throws(()=>parse(p),/Pano kablo kimliği/);
});
test('P0-04 corrupt panel cable collection cannot become valid',()=>{
 const p=sample();p.panel.wires={};
 assert.throws(()=>parse(p),/Pano kablo listesi/);
});
test('P0-04 legitimate old unnamed panel wire records still import',()=>{
 const p=sample();delete p.panel.wires[0].id;
 assert.equal(parse(p).panel.wires[0].id,undefined);
});
test('P0-04 numeric legacy part identity remains readable and not double counted',()=>{
 const p=sample();p.panel.items[0].id=123;
 assert.equal(parse(p).panel.items[0].id,123);
});
test('P0-04 protected real training panel remains readonly after parsing',()=>{
 const p={...sample(),defaultTemplate:{id:'protected',readOnly:true}};
 assert.equal(Projects.isProtected(parse(p)),true);
});

test('P0-04 panel inventory respects 10000 component limit without rewriting valid panels',()=>{
 const p=sample();p.panel.items=Array.from({length:10000},(_,i)=>({id:'part-'+i,typeId:'lamp'}));
 assert.equal(parse(p).panel.items.length,10000);
 p.panel.items.push({id:'over',typeId:'lamp'});
 assert.throws(()=>parse(p),/Pano projesi eğitim çalışma alanı için çok büyük/);
});
test('P0-04 panel conductors respect 40000 cable limit with legacy compatibility',()=>{
 const p=sample();p.panel.wires=Array.from({length:40000},(_,i)=>({id:'wire-'+i}));
 assert.equal(parse(p).panel.wires.length,40000);
 p.panel.wires.push({id:'over'});
 assert.throws(()=>parse(p),/Pano projesi eğitim çalışma alanı için çok büyük/);
});
