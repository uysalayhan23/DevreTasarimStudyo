'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const base=()=>({version:7,workspaceMode:'control',components:[
 {id:'c1',typeId:'resistor',x:5,y:6},{id:'c2',typeId:'lamp-green',x:20,y:10}],
 junctions:[{id:'j1',x:0,y:0}],wires:[
 {id:'w1',from:{c:'c1',p:'1'},to:{j:'j1'},color:'#cc0000',points:[{x:2,y:3}]}]});
function change(fn){const p=base();fn(p);return p}
function check(p,valid){
 const before=JSON.stringify(p);
 if(valid){const loaded=Projects.parse(before);assert.equal(loaded.wires[0].color,'#cc0000');}
 else assert.throws(()=>Projects.parse(before),/birleşim noktaları geçersiz|kablo güzergâhı geçersiz/);
 assert.equal(JSON.stringify(p),before,'validation must not mutate source');
}
for(const [name,mutate,valid] of [
 ['ordinary',()=>{},true],
 ['max junction',p=>{p.junctions[0].x=100000;p.junctions[0].y=-100000},true],
 ['positive junction overflow',p=>{p.junctions[0].x=100001},false],
 ['negative junction overflow',p=>{p.junctions[0].y=-100001},false],
 ['max route coordinate',p=>{p.wires[0].points=[{x:100000,y:-100000}]},true],
 ['positive route overflow',p=>{p.wires[0].points=[{x:100001,y:0}]},false],
 ['negative fixed route overflow',p=>{p.wires[0].fixedPoints=[{x:0,y:-100001}]},false],
 ['1000 route points',p=>{p.wires[0].points=Array.from({length:1000},(_,i)=>({x:i,y:i}))},true],
 ['1001 route points',p=>{p.wires[0].points=Array.from({length:1001},(_,i)=>({x:i,y:i}))},false],
 ['missing route',p=>{delete p.wires[0].points},true],
 ['null route',p=>{p.wires[0].points=null},true],
 ['legacy v5',p=>{p.version=5},true]
])test('P0-04 schematic coordinate safety: '+name,()=>check(change(mutate),valid));
test('P0-04 in-memory nonfinite junction cannot be saved',()=>{
 const p=base();p.junctions[0].x=Infinity;
 assert.throws(()=>Projects.validate(p),/birleşim noktaları geçersiz/);
});
test('P0-04 panel graph is not rewritten by schematic bounds',()=>{
 const p={version:7,components:[],wires:[],workspaceMode:'panel',
  panel:{items:[{id:'i1',typeId:'plc',x:10,y:20,w:20,h:30}],wires:[]}};
 assert.equal(Projects.parse(JSON.stringify(p)).panel.items[0].id,'i1');
});
test('P0-04 offline file loader uses new validation revision',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
 assert.ok(html.includes('project-store.js?rev=20261030-p0-04-coordinate-guard1'));
});
