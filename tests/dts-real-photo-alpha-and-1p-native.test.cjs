'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const M115=require('../dist/materials-v115.js'),M113=require('../dist/materials-v113.js');
const Physical=require('../dist/physical-metadata.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const byId=Object.fromEntries(Array.from(ctx.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const fromAsset=file=>fs.readFileSync(path.join(__dirname,'../dist/assets/products',file));
function assertRealTransparentWebp(name){
 const b=fromAsset(name);assert.ok(b.length>3500&&b.length<100000,'reasonable real photo asset');
 assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
 assert.equal(b.toString('ascii',12,16),'VP8X');
 assert.ok(b[20]&16,'must contain alpha data');
}
test('WAZ5 real orthogonal photo now uses an actual transparent binary asset, not simulated SVG silhouette',()=>{
 const d=byId['converter-pressure'],art=M115.markup(d,{id:'waz5'});
 assert.deepEqual([d.w,d.h],[35,184.8]);
 assertRealTransparentWebp('waz5-front-transparent.webp');
 assert.match(art,/assets\/products\/waz5-front-transparent\.webp/);
 assert.match(art,/viewBox="0 0 160 949" preserveAspectRatio="xMidYMid meet"/);
 assert.match(art,/class="waz5-physical-envelope"/);
 assert.doesNotMatch(art,/weid-front-v115\.png|maskedPhoto|waz5-top-plan|preserveAspectRatio="none"/);
 assert.equal(d.pins.length,12);
 const p=Physical.get(d);assert.deepEqual([p.widthMm,p.heightMm,p.depthMm],[17.5,92.4,112.4]);
 assert.equal(p.visualSourceFile,'waz5-front-transparent.webp');
});
test('WAZ5 original photographic source preserved separately for product information',()=>{
 const original=fromAsset('weid-front-v115.png');
 assert.equal(original.toString('ascii',1,4),'PNG');
 assert.ok(original.length>500000);
});
test('ORDEL real top photo is transparent, includes full circular body and holes',()=>{
 const d=byId['converter-temperature'];assert.equal(d.instrument,'hmt');
 const a=M115.markup(d,{id:'ordel',instrumentSettings:{input:'PT100'}});
 assertRealTransparentWebp('ordel-top-transparent.webp');
 assert.match(a,/assets\/products\/ordel-top-transparent\.webp/);
 assert.match(a,/viewBox="0 0 480 480" preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(a,/ordel-top-v115\.png|clip-rule|waz5-top-plan/);
 const b=M115.markup(d,{id:'ordel-tc',instrumentSettings:{input:'TC'}});
 assert.match(b,/rotate\(90 120 120\)/);
 assert.deepEqual([d.w,d.h],[90,90]);
 const p=Physical.get(d);assert.equal(p.widthMm,45);assert.equal(p.heightMm,45);
});
test('Thermal-magnetic 1P correct real one-pole photo instead of generic wrong device silhouette',()=>{
 const d=byId['thermal-magnetic-1p'];assert.equal(d.kind,'thermal-magnetic');
 const before=JSON.stringify(d.pins);
 const closed=M113.markup(d,{id:'TM1',state:false});const on=M113.markup(d,{id:'TM1',state:true});
 for(const art of [closed,on]){
  assert.match(art,/assets\/products\/siemens-5sl6116-7-user-front-v11920\.webp/);
  assert.match(art,/preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(art,/siemens-3rv2011-user-front|motor-protection|preserveAspectRatio="none"/);
 }
 assert.match(on,/I ON/);
 assert.equal(JSON.stringify(d.pins),before);
 const img=fromAsset('siemens-5sl6116-7-user-front-v11920.webp');assert.equal(img.toString('ascii',8,12),'WEBP');
});
test('Siemens three-pole thermal-magnetic item uses the newly supplied photograph',()=>{
 const d=byId['thermal-magnetic'];const svg=M113.markup(d,{id:'TM3'});
 assert.match(svg,/siemens-sirius-3rv20-user-front-20261103\.webp/);
 assert.doesNotMatch(svg,/waz5-front-transparent|ordel-top-transparent/);
});
test('Other original meter, controller, and HT2 photos remain untouched',()=>{
 const d=byId['unit-ut33d-plus'];assert.match(M115.markup(d,{id:'UT1'}),/ut33d-front-transparent\.webp/);
 const hmt=byId['converter-temperature'];assert.ok(hmt.instrument==='hmt');
 assert.ok(fromAsset('ordel-top-v115.png').length>500000);
});
