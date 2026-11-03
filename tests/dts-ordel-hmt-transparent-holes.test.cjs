'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Mat=require('../dist/materials-v115.js');
const Physical=require('../dist/physical-metadata.js');
const file=fs.readFileSync(require.resolve('../dist/materials-v115.js'),'utf8');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
const d=ctx.window.COMPONENT_LIBRARY.find(p=>p.id==='converter-temperature'&&p.instrument==='hmt');
const svg=(c={id:'hmt-photo',instrumentSettings:{input:'PT100'}})=>Mat.markup(d,c);

test('ORDEL original overhead photograph is preserved as a separate source asset',()=>{
 assert.ok(d);assert.ok(fs.statSync(path.join(__dirname,'../dist/assets/products/ordel-top-v115.png')).size>500000);
 assert.match(svg(),/assets\/products\/ordel-top-transparent\.webp/);
});
test('ORDEL self-contained image transparency does not require incorrect hole winding',()=>{
 const x=svg();assert.match(x,/ordel-top-transparent\.webp/);
 assert.doesNotMatch(x,/<clipPath|clip-rule|M697 615A72/);
});
test('photo square ratio and physical 45mm dimensions remain unchanged',()=>{
 const x=svg();assert.match(x,/<svg width="240" height="240" viewBox="0 0 480 480" preserveAspectRatio="xMidYMid meet"/);
 assert.match(x,/<image href="assets\/products\/ordel-top-transparent.webp" width="480" height="480"/);
 const physical=Physical.get(d);assert.equal(physical.widthMm,45);assert.equal(physical.heightMm,45);
});

test('all original catalog terminals remain unchanged and HMT temperature settings still work',()=>{
 assert.ok(Array.isArray(d.pins));assert.ok(d.pins.length>0);
 const snapshot=d.pins.map(p=>[p.id,p.x,p.y]);
 for(const input of ['PT100','TC']){
   const x=svg({id:'hmt'+input,instrumentSettings:{input}});
   assert.match(x,/ordel-top-transparent\.webp/);
   assert.doesNotMatch(x,/NaN|Infinity/);
 }
 assert.deepEqual(d.pins.map(p=>[p.id,p.x,p.y]),snapshot);
});

test('other instrument photographs and overlays remain unchanged',()=>{
 const ut=Mat.markup({id:'unit-ut33d-plus',kind:'multimeter',w:180,h:340},{id:'ut'});
 assert.match(ut,/ut33d-front-transparent\.webp/);
 const waz=Mat.markup({id:'converter-pressure',instrument:'waz5',w:35,h:184.8},{id:'waz'});
 assert.match(waz,/waz5-front-transparent\.webp/);
 assert.doesNotMatch(waz,/ordel-top-v115\.png/);
});
