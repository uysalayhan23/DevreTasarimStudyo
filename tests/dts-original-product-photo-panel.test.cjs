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
 ['weighing-indicator','baykon-front-v115.png'],
 ['load-cell','kobastar-sb2-v112.webp'],
 ['converter-temperature','ordel-top-v115.png'],
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

test('BAYKON TX11 reference photo is shown in the right panel without changing native live terminals or introducing fake scene alpha',()=>{
 const d=library.find(x=>x.id==='weighing-indicator');assert.ok(d);
 assert.equal(d.instrument,'tx11');
 const raw=fs.readFileSync(path.join(__dirname,'../dist/assets/products/baykon-front-v115.png'));
 assert.equal(raw.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(raw.readUInt32BE(16),1024);assert.equal(raw.readUInt32BE(20),1536);
 assert.equal(raw[25],2,'existing producer photo is RGB, not alpha (scene remains REVIEW)');
 const pinsBefore=JSON.stringify(d.pins),sizeBefore=[d.w,d.h];
 const row=Brief.model(d,{id:'TX11-1',ref:'B1'});
 assert.equal(row.originalPhoto,'assets/products/baykon-front-v115.png');
 assert.equal(row.totalPins,12);assert.equal(row.terminals.length,8);
 const markup=Brief.markup(row);
 assert.match(markup,/<img src="assets\/products\/baykon-front-v115\.png"/);
 assert.doesNotMatch(Brief.markup({...row,originalPhoto:'javascript:alert(1)'}),/<img/);
 assert.deepEqual([d.w,d.h],sizeBefore);assert.equal(JSON.stringify(d.pins),pinsBefore);
 const material=require('../dist/materials-v115.js').markup(d,{id:'TX11-1'});
 assert.match(material,/baykon-front-v115\.png/);
 assert.doesNotMatch(material,/baykon-front-transparent\.webp/);
});

test('Kobastar SB2 real reference image appears in right panel while opaque perspective scene asset stays REVIEW',()=>{
 const d=library.find(x=>x.id==='load-cell');assert.ok(d);
 assert.equal(d.brand,'Kobastar');assert.match(d.model,/SB2/);
 const original=fs.readFileSync(path.join(__dirname,'../dist/assets/products/kobastar-sb2-v112.webp'));
 assert.equal(original.toString('ascii',0,4),'RIFF');
 assert.equal(original.toString('ascii',8,12),'WEBP');
 assert.equal(original.toString('ascii',12,16),'VP8 '); // existing RGB source, not alpha
 const pinsBefore=JSON.stringify(d.pins),sizeBefore=[d.w,d.h];
 const row=Brief.model(d,{id:'SB2-1',ref:'LC1'});
 assert.equal(row.originalPhoto,'assets/products/kobastar-sb2-v112.webp');
 assert.equal(row.totalPins,4);
 assert.deepEqual(Array.from(row.terminals,x=>x.id),['EX+','EX−','SIG+','SIG−']);
 assert.match(Brief.markup(row),/<img src="assets\/products\/kobastar-sb2-v112\.webp"/);
 assert.doesNotMatch(Brief.markup({...row,originalPhoto:'data:image/svg+xml;base64,abc'}),/<img/);
 assert.deepEqual([d.w,d.h],sizeBefore);assert.equal(JSON.stringify(d.pins),pinsBefore);
 const scene=require('../dist/materials.js').markup(d,{id:'SB2-1'});
 assert.match(scene,/assets\/products\/kobastar-sb2-v112\.webp/);
 assert.match(scene,/<image[^>]*x="0" y="20" width="240" height="120" preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(scene,/kobastar-sb2-transparent|top-orthographic/);
});

test('Kobastar scene photo is contained and centered for narrow historical frames without changing terminal coordinates',()=>{
 const d=library.find(x=>x.id==='load-cell');
 const M=require('../dist/materials.js');
 const before=JSON.stringify(d.pins);
 const s=M.markup({...d,w:160,h:60},{id:'SB2-small'});
 assert.match(s,/x="20" y="0" width="120" height="60" preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(s,/preserveAspectRatio="none"|kobastar-sb2-transparent/);
 assert.equal(JSON.stringify(d.pins),before);
});

test('ORDEL keeps original info photo while workspace rendering stays on transparent alpha asset and native terminals remain intact',()=>{
 const Material=require('../dist/materials-v115.js');
 const d=library.find(x=>x.id==='converter-temperature');assert.ok(d);
 const item=Brief.model(d,{id:'ORD1',ref:'B1'});
 assert.equal(item.originalPhoto,'assets/products/ordel-top-v115.png');
 assert.equal(item.totalPins,6);
 assert.equal(item.terminals.length,6);
 const html=Brief.markup(item);
 assert.match(html,/<img src="assets\/products\/ordel-top-v115\.png"/);
 const svg=Material.markup(d,{id:'ordel-runtime'});
 assert.match(svg,/assets\/products\/ordel-top-transparent\.webp/);
 assert.doesNotMatch(svg,/ordel-top-v115\.png/);
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
