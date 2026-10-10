'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Material=require('../dist/materials-v115.js');
const Physical=require('../dist/physical-metadata.js');
const image=(name)=>fs.readFileSync(path.join(__dirname,'../dist/assets/products',name));
function pngHeader(bytes){
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(bytes.subarray(12,16).toString(),'IHDR');
 return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),colorType:bytes[25]};
}
test('ORDEL top photograph is not falsely declared an alpha-transparent asset',()=>{
 const meta=pngHeader(image('ordel-top-v115.png'));
 assert.deepEqual(meta,{width:1254,height:1254,colorType:2},'RGB photo requires mask, not alpha claim');
 const svg=Material.markup({id:'ordel-hmt',instrument:'hmt',w:90,h:90},{id:'ordel-verification'});
 assert.match(svg,/ordel-top-v115\.png/);
 assert.match(svg,/clip-path="url\(#instrument-ordel-verification\)"/);
 assert.match(svg,/<clipPath id="instrument-ordel-verification"/);
});
test('Weidmuller WAZ5 1024x1536 RGB source remains explicitly silhouette-clipped',()=>{
 const meta=pngHeader(image('weid-front-v115.png'));
 assert.deepEqual(meta,{width:1024,height:1536,colorType:2},'RGB photo requires mask, not alpha claim');
 const d={id:'converter-pressure',instrument:'waz5',w:35,h:184.8};
 const svg=Material.markup(d,{id:'waz5-verification'});
 assert.match(svg,/weid-front-v115\.png/);
 assert.match(svg,/clip-path="url\(#instrument-waz5-verification-body\)"/);
 assert.match(svg,/preserveAspectRatio="xMidYMid meet"/);
 assert.doesNotMatch(svg,/preserveAspectRatio="none"/);
 const physical=Physical.get(d);
 assert.ok(physical);assert.equal(physical.widthMm,17.5);assert.equal(physical.heightMm,92.4);
 assert.equal(Physical.panelEligibility(d).eligible,false,'unverified panel geometry stays blocked');
});
