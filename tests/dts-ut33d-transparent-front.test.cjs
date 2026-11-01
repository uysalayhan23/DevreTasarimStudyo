'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Mat=require('../dist/materials-v115.js');
const d={id:'unit-ut33d-plus',kind:'multimeter',w:180,h:340};
const render=(c={})=>Mat.markup(d,c);
test('UT33D+ user photo is transparent WebP, not stretched or drawn over white background',()=>{
 const image=fs.readFileSync(path.join(__dirname,'../dist/assets/products/ut33d-front-transparent.webp'));
 assert.equal(image.subarray(0,4).toString(),'RIFF');
 assert.equal(image.subarray(8,12).toString(),'WEBP');
 assert.equal(image.subarray(12,16).toString(),'VP8X');
 assert.ok(image[20]&0x10,'WebP alpha bit must be set');
 const svg=render({id:'ut33d'});
 assert.match(svg,/ut33d-front-transparent\.webp/);
 assert.match(svg,/viewBox="0 0 285 508" preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(svg,/unit-v115\.jpg|<clipPath/);
});
test('UT33D+ live LCD and backlight remain active over the static photo',()=>{
 const lit=render({meterBacklight:true,_meter:{display:'12.34',unit:'V'}});
 const dim=render({meterBacklight:false,_meter:{display:'0.00',unit:'mV'}});
 assert.match(lit,/>12\.34<\/text>/);
 assert.match(lit,/>V<\/text>/);
 assert.match(lit,/fill="#d9efb4"/);
 assert.match(dim,/>0\.00<\/text>/);
 assert.match(dim,/>mV<\/text>/);
 assert.match(dim,/fill="#98b7a4"/);
 assert.match(lit,/<rect x="31" y="52" width="119" height="59"/);
});
test('UT33D+ dial keeps all 20 hit targets, position indicator and controls',()=>{
 const svg=render({meterPosition:7});
 const ids=[...svg.matchAll(/data-meter-position="(\d+)"/g)].map(x=>Number(x[1]));
 assert.deepEqual(ids,Array.from({length:20},(_,i)=>i));
 assert.match(svg,/rotate\(126 90 198\)/);
 assert.match(svg,/data-meter-action="hold"/);
 assert.match(svg,/data-meter-action="light"/);
});
test('WAZ5 material branch stays separate and maintains existing physical body envelope',()=>{
 const waz=Mat.markup({id:'converter-pressure',instrument:'waz5',w:35,h:184.8},{id:'regression'});
 assert.match(waz,/waz5-physical-envelope/);
 assert.match(waz,/weid-front-v115\.png/);
});
