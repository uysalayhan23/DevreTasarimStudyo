'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const d=ctx.window.COMPONENT_LIBRARY.find(x=>x.id==='nh-fuse-holder');
const Material=require('../dist/materials-v111.js');
test('3NP1133 true 2 scene units/mm dimensions and all wired terminal coordinates',()=>{
 assert.deepEqual([d.w,d.h],[211.6,404]);
 assert.deepEqual(Array.from(d.pins,p=>p.id),['1','2','3','4','5','6']);
 for(let i=0;i<6;i++){
  assert.ok(Math.abs(d.pins[i].x-((40+Math.floor(i/2)*50-27)*(211.6/126)))<1e-8);
  assert.equal(d.pins[i].y,i%2?404:0);
 }
});
test('3NP1133 photo preserved and rendered with proportional crop not nonuniform squeezing',()=>{
 for(const state of [false,true]){
  const art=Material.markup(d,{id:'s3',state});
  assert.match(art,/width="211\.6" height="404" viewBox="27 0 126 240" preserveAspectRatio="xMidYMid meet"/);
  assert.match(art,/nh-holder-front-v111\.png/);
  assert.match(art,/TEMSİLİ GÖRSEL/);
  assert.doesNotMatch(art,/scale\(0\.7 1\)/);
 }
});
test('other material branches are not wrapped with physical NH geometry',()=>{
 const art=Material.markup({id:'siren',w:180,h:240},{id:'siren'});
 assert.doesNotMatch(art,/viewBox="27 0 126 240"/);
});
