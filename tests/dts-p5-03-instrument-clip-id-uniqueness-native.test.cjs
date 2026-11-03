'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Materials=require('../dist/materials-v115.js');
const Physical=require('../dist/physical-metadata.js');
const WAZ5={id:'converter-pressure',kind:'instrument',instrument:'waz5',w:35,h:184.8};
const TX11={id:'weighing-indicator',kind:'instrument',instrument:'tx11',w:140,h:540};
const HMT={id:'converter-temperature',kind:'instrument',instrument:'hmt',w:90,h:90};
const clipId=svg=>{const match=svg.match(/<clipPath id="([^"]+)"/);assert.ok(match,'the actual SVG silhouette clip must exist');return match[1];};
const clipRef=svg=>{const match=svg.match(/clip-path="url\(#([^\)]+)\)"/);assert.ok(match,'the actual photo must reference its own SVG clip');return match[1];};
const render=(d,id)=>Materials.markup(d,{id});
test('P5-03: visually distinct WAZ5 and TX11 must not share clipPath IDs for distinct imported component IDs',()=>{
 const wz=render(WAZ5,'cabinet:1'),tx=render(TX11,'cabinet_1');
 assert.notEqual(clipId(wz),clipId(tx),'otherwise the second clipped product inherits the first product silhouette');
 assert.equal(clipRef(wz),clipId(wz));assert.equal(clipRef(tx),clipId(tx));
});
test('P5-03: ASCII punctuation and Turkish Unicode ID escapes remain injective',()=>{
 const ids=['a:b','a_b','a.b','a.3a.b','çıkış:1','çıkış_1','ölçüm 1','ölçüm_1','🚦:1','_:1'];
 const clips=ids.map(id=>clipId(render(WAZ5,id)));
 assert.equal(new Set(clips).size,ids.length);
 assert.ok(clips.every(x=>/^instrument-[a-zA-Z0-9_.-]+-body$/.test(x)));
});
test('P5-03: unchanged simple IDs keep existing clip references and do not regress legacy tests',()=>{
 assert.equal(clipId(render(WAZ5,'waz5-verification')),'instrument-waz5-verification-body');
 assert.equal(clipId(render(HMT,'ordel-verification')),'instrument-ordel-verification');
});
test('P5-03: source images preserve native ratio; no perspective, stretch or mask changes',()=>{
 const wz=render(WAZ5,'cabinet:1'),tx=render(TX11,'cabinet_1');
 assert.match(wz,/weid-front-v115\.png/);assert.match(tx,/baykon-front-v115\.png/);
 assert.match(wz,/preserveAspectRatio="xMidYMid meet"/);
 assert.match(tx,/preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(wz,/preserveAspectRatio="none"/);
 assert.match(wz,/<rect class="waz5-physical-envelope" x="0" y="0" width="35" height="184\.8"/);
});
test('P5-03: verified WAZ5 physical mm record remains unchanged and panel geometry stays REVIEW',()=>{
 const p=Physical.get(WAZ5);
 assert.equal(p.widthMm,17.5);assert.equal(p.heightMm,92.4);assert.equal(p.depthMm,112.4);
 assert.equal(Physical.panelEligibility(WAZ5).eligible,false);
});
