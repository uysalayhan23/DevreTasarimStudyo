'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../dist/materials-v115.js');
const Physical=require('../dist/physical-metadata.js');
const Twin=require('../dist/digital-twin.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),context);
const d=context.window.COMPONENT_LIBRARY.find(x=>x.id==='converter-pressure');
const art=()=>M.markup(d,{id:'WZ1'});
test('WAZ5 top plan is visibly code-generated, representative, flat and photo-free',()=>{
 const svg=art();
 assert.match(svg,/class="waz5-top-plan" data-view="orthographic-top" data-visual-match="representative"/);
 assert.match(svg,/class="waz5-physical-envelope" x="0" y="0" width="35" height="184\.8"/);
 assert.match(svg,/TEMSİLİ ÜSTTEN/);
 assert.doesNotMatch(svg,/<image|weid-front-v115|preserveAspectRatio="none"|skew\(|perspective|transform="rotate/);
});
test('every native WAZ5 terminal center remains visibly in the exact cable position',()=>{
 const svg=art();assert.equal(d.pins.length,12);
 const found=[...svg.matchAll(/data-waz5-terminal="(\d+)" cx="([^"]+)" cy="([^"]+)"/g)];
 assert.equal(found.length,12);
 for(const p of d.pins){
  const row=found.find(m=>m[1]===p.id);assert.ok(row,'missing '+p.id);
  assert.equal(Number(row[2]),p.x);assert.equal(Number(row[3]),p.y);
 }
});
test('WAZ5 dimensions remain verified, visual no longer falsely EXACT; panel stays blocked',()=>{
 assert.deepEqual([d.w,d.h],[35,184.8]);
 const r=Physical.get(d);assert.ok(r);assert.deepEqual([r.widthMm,r.heightMm,r.depthMm],[17.5,92.4,112.4]);
 assert.equal(r.visualMatchStatus,'representative');assert.equal(r.visualOrientationStatus,'orthographic-top');
 assert.equal(r.visualSourceStatus,'code-native-orthographic-plan');
 assert.equal(Physical.materialScaleAudit(d).status,'aspect-consistent');
 assert.equal(Physical.panelEligibility(d).eligible,false);
});
test('digital twin retains original front photograph as reference, not active runtime appearance',()=>{
 const twin=Twin.record(d);assert.ok(twin);
 assert.equal(twin.visual.matchQuality,'representative');
 assert.equal(twin.visual.runtimeFile,null);
 assert.equal(twin.visual.promotionReady,false);
 assert.equal(twin.panel.eligible,false);
});
test('other instruments and their overlays keep original image paths and interactivity',()=>{
 const ht2=M.markup({id:'gentek-ht2',instrument:'ht2',w:180,h:240},{id:'ht'});
 const et=M.markup({id:'temperature-controller',instrument:'et4420',w:240,h:240},{id:'et'});
 const ut=M.markup({id:'unit-ut33d-plus',kind:'multimeter',w:180,h:340},{id:'ut'});
 assert.match(ht2,/gentek-front-v115\.png/);
 assert.match(et,/enda-front-v115\.png/);
 assert.match(et,/data-instrument-key="up"/);
 assert.match(ut,/ut33d-front-transparent\.webp/);
});
