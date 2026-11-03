'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const Materials=require('../dist/materials-v113.js');
const Assets=require('../dist/materials.js');
const Brief=require('../dist/component-brief.js');
const Physical=require('../dist/physical-metadata.js');
const Sim=require('../dist/simulation.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const defs=Object.fromEntries(Array.from(ctx.window.COMPONENT_LIBRARY,d=>[d.id,d]));
const product='siemens-sirius-3rv20-user-front-20261103.webp';
const photoPath=path.join(__dirname,'../dist/assets/products',product);
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');

test('user-upload Siemens SIRIUS 3RV20 is a real transparent photo with exact approved bytes',()=>{
 const bytes=fs.readFileSync(photoPath);
 assert.ok(bytes.length>12000&&bytes.length<100000);
 assert.equal(sha(bytes),'5e50e3af60cef15c681d0c4486004160d7792489c7d24c13f308d1218ff46fac');
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.toString('ascii',12,16),'VP8X');assert.ok(bytes[20]&0x10,'alpha channel');
 const w=1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16),h=1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16);
 assert.deepEqual([w,h],[298,643]);
});

test('three-pole 3RV20 photo replaces the wrong visual without distortion or fabricated SVG body',()=>{
 const d=defs['thermal-magnetic'];assert.ok(d);
 assert.deepEqual([d.w,d.h],[90,194]);
 const off=Materials.markup(d,{id:'tm3p',state:false}),on=Materials.markup(d,{id:'tm3p',state:true});
 for(const svg of [off,on]){
  assert.match(svg,/assets\/products\/siemens-sirius-3rv20-user-front-20261103\.webp/);
  assert.match(svg,/viewBox="0 0 298 643" preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(svg,/siemens-3rv2011-user-front|preserveAspectRatio="none"|waz5-top-plan/);
 }
 assert.match(on,/I ON/);assert.notEqual(off,on);
 assert.ok(Math.abs(298/643-45/97)<.002);
});

test('user photo is shown in original photograph panel for correct three-pole product',()=>{
 const item=Brief.model(defs['thermal-magnetic'],{id:'tm3p'});assert.ok(item);
 assert.equal(item.originalPhoto,'assets/products/'+product);
 const html=Brief.markup(item);
 assert.match(html,/class="dts-original-product-photo"/);
 assert.ok(html.includes('src="assets/products/'+product+'"'));
 assert.equal(Brief.model(defs['thermal-magnetic-1p'],{id:'tm1p'}).originalPhoto,null);
});

test('three-pole catalog terminals and manufacturer physical bounds remain unchanged; model photo is representative',()=>{
 const d=defs['thermal-magnetic'];
 assert.deepEqual(Array.from(d.pins,p=>p.id),['1','3','5','2','4','6','95','96']);
 const rec=Physical.get(d);assert.ok(rec);
 assert.deepEqual([rec.widthMm,rec.heightMm,rec.depthMm],[45,97,97]);
 assert.equal(rec.visualMatchStatus,'exact','independent exact CAD data stays accepted');
 assert.equal(rec.scenePhotoMatchStatus,'representative-model-family','3RV20 photo does not prove exact 3RV2011 submodel');
 assert.equal(rec.scenePhotoSourceFile,product);
 assert.equal(rec.scenePhotoOriginalSha256,'cb610e299dd5f3c69cfdb292f8ba9461ac8abc021a99f7fe8525e97499739175');
 assert.equal(Physical.get(d).scenePhotoSourceFile,product);
 assert.equal(require('node:crypto').createHash('sha256').update(fs.readFileSync(photoPath)).digest('hex'),'5e50e3af60cef15c681d0c4486004160d7792489c7d24c13f308d1218ff46fac');
 assert.equal(Physical.panelEligibility(d).eligible,true,'manufacturer CAD geometry remains independently verified');
 assert.ok(fs.existsSync(path.join(__dirname,'../dist/assets/products/siemens-3rv2011-user-front-v11920.webp')),'preserve original accepted source image');
});

test('single-pole 1P display and electrical terminals remain truly one-pole, not falsely labeled as 3RV20',()=>{
 const one=defs['thermal-magnetic-1p'];assert.ok(one);assert.equal(one.pins.length,2);
 assert.deepEqual(Array.from(one.pins,p=>p.id),['1','2']);
 for(const state of [false,true]){
  const svg=Materials.markup(one,{id:'tm1p',state});
  assert.match(svg,/siemens-5sl6116-7-user-front-v11920\.webp/);
  assert.doesNotMatch(svg,/sirius-3rv20|siemens-3rv2011-user-front/);
 }
 assert.equal(Assets.assets['siemens-3rv2011-user-front-v11920'].file,'assets/products/'+product);
});

test('electrical motor protection conducting pairs remain the original solver implementation',()=>{
 const p=defs['thermal-magnetic'];
 const off=Sim.conductingPairs({state:false},p,new Map(),new Set());
 const on=Sim.conductingPairs({state:true},p,new Map(),new Set());
 assert.ok(off.some(pair=>pair.includes('1')&&pair.includes('2')),'original protected pole 1-2');
 assert.ok(off.some(pair=>pair.includes('3')&&pair.includes('4')),'original protected pole 3-4');
 assert.ok(off.some(pair=>pair.includes('5')&&pair.includes('6')),'original protected pole 5-6');
 assert.equal(on.some(pair=>pair.includes('1')&&pair.includes('2')),false,'opening cuts pole');
});
