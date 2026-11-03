'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Brief=require('../dist/component-brief.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
const library=ctx.window.COMPONENT_LIBRARY;
const scenarios=[
 ['nh-fuse-holder','nh-holder-front-v111.png'],
 ['converter-pressure','weid-front-v115.png'],
 ['reed-no','reed-mr228b-v113.jpg'],
 ['reed-nc','reed-mr228b-v113.jpg'],
 ['fuse-switch-3','wsi-top-v111.png'],
 ['fuse-switch','wsi-top-v111.png'],
 ['unit-ut33d-plus','ut33d-front-transparent.webp'],
 ['sensor-temperature-humidity','gentek-front-v115.png'],
 ['temperature-controller','enda-et4420-front-transparent.webp']
];

test('original product reference photographs appear in right-side component info, not as invented vector content',()=>{
 for(const [id,file] of scenarios){
  const d=library.find(x=>x.id===id);assert.ok(d,'missing catalog product '+id);
  const item=Brief.model(d,{id:'COMP-'+id});
  assert.equal(item.originalPhoto,'assets/products/'+file,id);
  const html=Brief.markup(item);
  assert.match(html,/<figure class="dts-original-product-photo"/);
  assert.ok(html.includes('<img src="assets/products/'+file+'"'),id);
  assert.match(html,/loading="lazy" decoding="async"/);
  assert.match(html,/Orijinal\/katalog fotoğrafı/);
  assert.doesNotMatch(html,/<svg|data-view="top-orthographic"/);
 }
});

test('ET4420 right panel never falls back to opaque legacy PNG or untrusted photo',()=>{
 const d=library.find(x=>x.id==='temperature-controller');
 const row=Brief.model(d,{id:'ET4420'});
 const markup=Brief.markup(row);
 assert.match(markup,/enda-et4420-front-transparent\.webp/);
 assert.doesNotMatch(markup,/enda-front-v115\.png/);
 assert.doesNotMatch(Brief.markup({...row,originalPhoto:'javascript:alert(1)'}),/<img/);
 assert.equal(row.totalPins,14);
});

test('other catalog parts do not have fictitious product photographs',()=>{
 const row=Brief.model({id:'generic-training-resistor',name:'Test resistor',kind:'resistor',pins:[{id:'1'}]},{id:'R1'});
 assert.equal(row.originalPhoto,null);
 assert.doesNotMatch(Brief.markup(row),/<img|<figure/);
});

test('photo src is strictly allowlisted; no external URL or injected HTML from a malformed entry',()=>{
 const row=Brief.model({id:'converter-pressure',name:'<svg onload=alert(1)>',kind:'instrument'},{id:'x'});
 const malicious=['https://attacker.example/image.png','javascript:alert(1)','assets/products/weid-front-v115.png" onerror="alert(1)'];
 for(const src of malicious){
  const html=Brief.markup({...row,originalPhoto:src});
  assert.doesNotMatch(html,/<img|onerror|attacker\.example|javascript:/);
 }
 assert.match(Brief.markup(row),/&lt;svg onload=alert\(1\)&gt;/);
});

test('original info photo does not alter live terminal metadata or current settings',()=>{
 const d=library.find(x=>x.id==='converter-pressure');
 const result=Brief.model(d,{id:'WAZ5',ref:'B1'});
 assert.equal(result.totalPins,d.pins.length);
 assert.equal(result.terminals.length,8);
 assert.match(Brief.markup(result),/Cihaz: B1/);
});

test('existing selected-device card is already wired to right-hand properties panel',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(html,/aside id="propertiesPanel"[\s\S]*section id="dtsComponentBrief"/);
 assert.match(app,/window\.DTSComponentBrief\.markup\(item\)/);
});
