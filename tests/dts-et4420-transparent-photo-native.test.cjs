'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const M=require('../dist/materials-v115.js'),Brief=require('../dist/component-brief.js'),Mat113=require('../dist/materials-v113.js');
const c={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),c);
const byId=Object.fromEntries(Array.from(c.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const asset=n=>fs.readFileSync(path.join(__dirname,'../dist/assets/products',n));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const d=byId['temperature-controller'];

test('ET4420 has real transparent front photograph, no baked white canvas or fake vector image',()=>{
 const s=M.markup(d,{id:'et1'});
 assert.match(s,/assets\/products\/enda-et4420-front-transparent\.webp/);
 assert.match(s,/viewBox="54 59 692 689" preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(s,/enda-front-v115\.png|<clipPath|preserveAspectRatio="none"|et4420-top-plan/);
});

test('new ET4420 alpha binary asset is valid and source-locked',()=>{
 const b=asset('enda-et4420-front-transparent.webp');
 assert.ok(b.length>10000&&b.length<150000);
 assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');
 assert.equal(b.toString('ascii',12,16),'VP8X');assert.ok(b[20]&16);
 assert.equal(hash(b),'a8801b9a7ed4e332f2fb27f27f4539980eff65017b144081aea5d6021fe5eb19');
});

test('original ENDA photo remains unmodified as right panel information reference',()=>{
 assert.equal(hash(asset('enda-front-v115.png')),'b562f7a9979b30b52201fca8742a0b2b214af73f95ef490ba0ab16ea8c7cebf3');
 const item=Brief.model(d,{id:'et1'});assert.equal(item.originalPhoto,'assets/products/enda-front-v115.png');
 assert.match(Brief.markup(item),/enda-front-v115\.png/);
});

test('all ET4420 live PV/SP overlays and four touch key targets remain present',()=>{
 assert.deepEqual([d.w,d.h],[96,96]);
 const original=JSON.stringify(d.pins);
 assert.equal(d.pins.length,14);
 const s=M.markup(d,{id:'et-active',_controller:{on:true,pv:25.3,sp:29.1,main:true,ssr:true},instrumentSettings:{decimal:'on'}});
 assert.match(s,/>25\.3<\/text>/);assert.match(s,/>29\.1<\/text>/);
 assert.match(s,/class="et4420-face-overlay" transform="scale\(0\.4 0\.4\)"/);
 for(const key of ['set','function','up','down'])assert.match(s,new RegExp('data-instrument-key="'+key+'"'));
 assert.equal(JSON.stringify(d.pins),original);
});

test('original 1P and 3RV20 photo renderings, HT2 alpha and UT33D interactive dial remain stable',()=>{
 const one=byId['thermal-magnetic-1p'],sirius=byId['thermal-magnetic'];
 assert.match(Mat113.markup(one,{id:'one'}),/siemens-5sl6116-7-user-front-v11920\.webp/);
 assert.match(Mat113.markup(sirius,{id:'three'}),/siemens-sirius-3rv20-user-front-20261103\.webp/);
 assert.match(M.markup(byId['sensor-temperature-humidity'],{id:'ht2'}),/gentek-ht2-front-transparent\.webp/);
 const meter=M.markup(byId['unit-ut33d-plus'],{id:'ut'});assert.match(meter,/ut33d-front-transparent\.webp/);
 assert.equal([...meter.matchAll(/data-meter-position="\d+"/g)].length,20);
});
