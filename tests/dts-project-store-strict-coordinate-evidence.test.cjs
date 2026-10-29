'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Store=require('../dist/project-store.js');
const base=()=>({version:7,workspaceMode:'control',components:[{id:'A',typeId:'lamp',x:0,y:-10,rotation:0}],wires:[],junctions:[]});
const panel=()=>({version:7,workspaceMode:'panel',components:[],wires:[],junctions:[],
 panel:{items:[{id:'p',typeId:'lamp',x:0,y:20,w:30,h:50,depth:0}],wires:[]}});
const parse=p=>Store.parse(JSON.stringify(p));
test('P0-04 genuine numeric zero, negative coordinates and legal rotation survive import',()=>{
 const p=base(),copy=JSON.stringify(p);const out=parse(p);
 assert.equal(out.components[0].x,0);assert.equal(out.components[0].y,-10);
 assert.equal(out.components[0].rotation,0);assert.equal(JSON.stringify(p),copy);
});
test('P0-04 null blank string and Boolean schematic coordinates are rejected, never coerced to zero',()=>{
 for(const key of ['x','y','rotation'])for(const value of [null,'',' ','10',false,true]){
  const p=base();p.components[0][key]=value;
  assert.throws(()=>parse(p),/eleman kimliği veya konumu/);
 }
});
test('P0-04 absent legacy schematic position fields remain importable',()=>{
 const p=base();delete p.components[0].x;delete p.components[0].rotation;
 assert.equal(parse(p).components[0].x,undefined);
});
test('P0-04 out-of-range component geometry is still rejected',()=>{
 for(const x of [100001,-100001]){
  const p=base();p.components[0].x=x;
  assert.throws(()=>parse(p),/eleman kimliği veya konumu/);
 }
});
test('P0-04 panel item numeric zero and valid footprint remain importable',()=>{
 const p=panel(),before=JSON.stringify(p);const v=parse(p);
 assert.equal(v.panel.items[0].x,0);assert.equal(v.panel.items[0].depth,0);
 assert.equal(JSON.stringify(p),before);
});
test('P0-04 null strings and Boolean panel positions or dimensions never become measured geometry',()=>{
 for(const key of ['x','y','w','h','depth'])for(const val of [null,'','20',false]){
  const p=panel();p.panel.items[0][key]=val;
  assert.throws(()=>parse(p),/Pano malzeme geometrisi/);
 }
});
test('P0-04 zero or negative panel footprint and negative depth are rejected',()=>{
 for(const key of ['w','h'])for(const val of [0,-1]){
  const p=panel();p.panel.items[0][key]=val;
  assert.throws(()=>parse(p),/Pano malzeme geometrisi/);
 }
 const p=panel();p.panel.items[0].depth=-1;
 assert.throws(()=>parse(p),/Pano malzeme geometrisi/);
});
test('P0-04 omitted panel geometry in old catalogs still migrates without fabricated positions',()=>{
 const p=panel();p.panel.items[0]={id:'p',typeId:'lamp'};
 assert.equal(parse(p).panel.items[0].x,undefined);
});
test('P0-04 real bundled protected training panel stays readable and readonly',()=>{
 const example=JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'),'utf8'));
 const p=parse(example);assert.equal(p.panel.items.length,15);assert.equal(Store.isProtected(p),true);
});

test('P0-04 supported junction count is bounded at the established wire limit',()=>{
 const p=base();p.junctions=Array.from({length:40000},(_,i)=>({id:'j'+i,x:0,y:0}));
 assert.equal(parse(p).junctions.length,40000);
 p.junctions.push({id:'overflow',x:0,y:0});
 assert.throws(()=>parse(p),/çok fazla kablo birleşim noktası/);
});
test('P0-04 oversized node-only document is rejected even without any connected wire',()=>{
 const p=base();p.components=[];p.wires=[];
 p.junctions=Array.from({length:40001},(_,i)=>({id:'j'+i,x:0,y:0}));
 assert.throws(()=>parse(p),/çok fazla kablo birleşim noktası/);
});
