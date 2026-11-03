'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const Mat115=require('../dist/materials-v115.js');
const Mat113=require('../dist/materials-v113.js');
const Brief=require('../dist/component-brief.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8'),ctx);
const defs=Object.fromEntries(Array.from(ctx.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const asset=file=>fs.readFileSync(path.join(__dirname,'../dist/assets/products',file));
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
const d=defs['sensor-temperature-humidity'];

test('HT2 real front-on photograph is used in scene with native alpha, no baked checkerboard or drawn replacement',()=>{
 assert.ok(d);assert.equal(d.instrument,'ht2');
 const s=Mat115.markup(d,{id:'ht2-1'});
 assert.match(s,/gentek-ht2-front-transparent\.webp/);
 assert.match(s,/<image href="assets\/products\/gentek-ht2-front-transparent\.webp" width="800" height="800"\/>/);
 assert.doesNotMatch(s,/gentek-front-v115\.png|<clipPath|ht2-top-plan|preserveAspectRatio="none"/);
 assert.match(s,/viewBox="134 60 534 686" preserveAspectRatio="xMidYMid meet"/);
});

test('HT2 uploaded asset is a genuine transparent, hash-locked WebP',()=>{
 const bytes=asset('gentek-ht2-front-transparent.webp');
 assert.ok(bytes.length>12000&&bytes.length<150000);
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.toString('ascii',12,16),'VP8X');assert.ok(bytes[20]&16,'must have alpha channel');
 assert.equal(sha256(bytes),'ed4619c516775ca4b4b6092f5db9c949f3e781ef3a7dda63bc0de89a36dbab90');
});

test('Original Gentek photo remains byte-identical for right hand reference panel',()=>{
 const source=asset('gentek-front-v115.png');
 assert.equal(sha256(source),'4308c879c31316fdd4ee70b698655e57adac79f0e5b12bb49540f48c3c27ae0e');
 const info=Brief.model(d,{id:'ht2-card'});
 assert.equal(info.originalPhoto,'assets/products/gentek-front-v115.png');
 assert.match(Brief.markup(info),/gentek-front-v115\.png/);
});

test('HT2 terminals and physical scene envelope unchanged; active readings still visible',()=>{
 assert.deepEqual([d.w,d.h],[180,240]);
 assert.deepEqual(Array.from(d.pins,p=>[p.id,p.x,p.y]),[['+',20,0],['−',60,0],['T',100,0],['RH',140,0]]);
 const c={id:'ht2-live',_instrument:{on:true,temperature:24.5,humidity:61.2}};
 const s=Mat115.markup(d,c);
 assert.match(s,/>24\.5<\/text>/);assert.match(s,/>61\.2<\/text>/);
 assert.match(s,/data-material="ht2-front"/);
});

test('1P Siemens photo and the user 3-pole 3RV20 photo stay unchanged',()=>{
 const one=defs['thermal-magnetic-1p'],three=defs['thermal-magnetic'];
 assert.equal(one.pins.length,2);assert.equal(three.pins.length,8);
 assert.match(Mat113.markup(one,{id:'F1'}),/siemens-5sl6116-7-user-front-v11920\.webp/);
 assert.match(Mat113.markup(three,{id:'F3'}),/siemens-sirius-3rv20-user-front-20261103\.webp/);
 assert.equal(sha256(asset('siemens-sirius-3rv20-user-front-20261103.webp')),'5e50e3af60cef15c681d0c4486004160d7792489c7d24c13f308d1218ff46fac');
});

test('UT33D and ET4420 original photos, click targets and overlays are untouched',()=>{
 const meter=Mat115.markup(defs['unit-ut33d-plus'],{id:'UT'});
 const et=Mat115.markup(defs['temperature-controller'],{id:'ET'});
 assert.match(meter,/ut33d-front-transparent\.webp/);
 assert.equal([...meter.matchAll(/data-meter-position="\d+"/g)].length,20);
 assert.match(et,/enda-front-v115\.png/);
 for(const button of ['set','function','up','down'])assert.ok(et.includes('data-instrument-key="'+button+'"'));
});
