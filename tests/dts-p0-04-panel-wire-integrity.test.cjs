'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function base(){
 return {version:7,name:'Pano kayıt bütünlüğü',workspaceMode:'panel',components:[],wires:[],
   panel:{items:[{id:'i1',typeId:'plc',x:10,y:20,w:40,h:30},
                 {id:'i2',typeId:'lamp',x:50,y:60,w:30,h:30}],wires:[]}};
}
function cable(){
 return {id:'w1',from:{c:'i1',p:'Q1'},to:{c:'i2',p:'1'},
   points:[{x:5,y:5,surface:'plate'}]};
}
function parseWire(mutate){
 const p=base(),w=cable();mutate(w);p.panel.wires.push(w);
 return Projects.parse(JSON.stringify(p));
}
test('P0-04 valid panel cable reopens without modifying endpoints, color or route',()=>{
 const p=parseWire(()=>{});assert.deepEqual(p.panel.wires[0],cable());
});
test('P0-04 legacy unnamed panel wire remains readable',()=>{
 const p=parseWire(w=>{delete w.id});assert.equal(p.panel.wires[0].id,undefined);
});
test('P0-04 existing numeric panel wire ID is not rewritten',()=>{
 const p=parseWire(w=>{w.id=12});assert.equal(p.panel.wires[0].id,12);
});
test('P0-04 absent panel route remains readable',()=>{
 const p=parseWire(w=>{delete w.points});assert.equal(p.panel.wires[0].points,undefined);
});
test('P0-04 null panel route remains readable',()=>{
 const p=parseWire(w=>{w.points=null});assert.equal(p.panel.wires[0].points,null);
});
for(const [name,mutate] of [
 ['missing from',w=>{delete w.from}],
 ['missing to',w=>{delete w.to}],
 ['array endpoint',w=>{w.from=[]}],
 ['blank terminal pin',w=>{w.from.p=' '}],
 ['numeric terminal pin',w=>{w.to.p=42}],
 ['same terminal at both ends',w=>{w.to={...w.from}}],
 ['non-array route',w=>{w.points={x:1}}],
 ['unsupported route surface',w=>{w.points=[{x:1,y:2,surface:'other'}]}],
 ['null route point',w=>{w.points=[null]}],
 ['oversized route',w=>{w.points=Array.from({length:1001},()=>({x:0,y:0,surface:'plate'}))}],
 ['out-of-bounds route point',w=>{w.points=[{x:10001,y:2,surface:'plate'}]}]
])test('P0-04 rejects '+name+' before panel editor loads',()=>{
 assert.throws(()=>parseWire(mutate),/Pano kablo (uç referansı|güzergâhı) geçersiz/);
});
test('P0-04 in-memory nonfinite panel route is rejected before serialization',()=>{
 const p=base();const w=cable();w.points=[{x:Infinity,y:2,surface:'plate'}];p.panel.wires.push(w);
 assert.throws(()=>Projects.validate(p),/Pano kablo güzergâhı geçersiz/);
});
test('P0-04 malformed panel cable does not mutate the input project',()=>{
 const p=base();const w=cable();delete w.from;p.panel.wires.push(w);const before=JSON.stringify(p);
 assert.throws(()=>Projects.validate(p),/Pano kablo uç referansı geçersiz/);
 assert.equal(JSON.stringify(p),before);
});
test('P0-04 ordinary schematic project still parses',()=>{
 const p={version:7,components:[{id:'a',typeId:'resistor',x:0,y:0}],
   wires:[{id:'w',from:{c:'a',p:'1'},to:{j:'j'}}],junctions:[{id:'j',x:5,y:5}]};
 assert.equal(Projects.parse(JSON.stringify(p)).wires.length,1);
});
