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

test('ORDEL HMT real overhead photographic image preserved, not replaced with a generated drawing',()=>{
  assert.ok(d);const x=svg();
  assert.match(x,/assets\/products\/ordel-top-v115\.png/);
  assert.match(x,/<image\s+href=/);
  assert.doesNotMatch(x,/top-plan|waz5-top-plan|data-view="top-orthographic"/);
});

test('ORDEL HMT punched holes have reverse winding, making actual photographic background transparent',()=>{
  const x=svg();
  for(const path of ['M697 615A72 72 0 1 1 553 615A72 72 0 1 1 697 615',
    'M293 595A63 63 0 1 1 167 595A63 63 0 1 1 293 595',
    'M1084 594A63 63 0 1 1 958 594A63 63 0 1 1 1084 594'])
    assert.ok(x.includes(path), 'missing inverse subpath '+path);
  assert.doesNotMatch(x,/M697 615A72 72 0 1 0 553 615/);
  assert.match(x,/clip-rule="evenodd"/);
});

test('photo source framing, true round proportions, scale and existing label remain intact',()=>{
 const x=svg();
 assert.match(x,/<svg width="240" height="240" viewBox="85 75 1080 1080"/);
 assert.match(x,/<image href="assets\/products\/ordel-top-v115.png" width="1254" height="1254"/);
 assert.doesNotMatch(x,/preserveAspectRatio="none"|scale\(0\.7 1\)|skewX|skewY/);
 const physical=Physical.get(d);assert.equal(physical.widthMm,45);assert.equal(physical.heightMm,45);
});

test('all original catalog terminals remain unchanged and HMT temperature settings still work',()=>{
 assert.ok(Array.isArray(d.pins));assert.ok(d.pins.length>0);
 const snapshot=d.pins.map(p=>[p.id,p.x,p.y]);
 for(const input of ['PT100','TC']){
   const x=svg({id:'hmt'+input,instrumentSettings:{input}});
   assert.match(x,/ordel-top-v115\.png/);
   assert.doesNotMatch(x,/NaN|Infinity/);
 }
 assert.deepEqual(d.pins.map(p=>[p.id,p.x,p.y]),snapshot);
});

test('other instrument photographs and overlays remain unchanged',()=>{
 const ut=Mat.markup({id:'unit-ut33d-plus',kind:'multimeter',w:180,h:340},{id:'ut'});
 assert.match(ut,/ut33d-front-transparent\.webp/);
 const waz=Mat.markup({id:'converter-pressure',instrument:'waz5',w:35,h:184.8},{id:'waz'});
 assert.match(waz,/weid-front-v115\.png/);
 assert.doesNotMatch(waz,/ordel-top-v115\.png/);
});
