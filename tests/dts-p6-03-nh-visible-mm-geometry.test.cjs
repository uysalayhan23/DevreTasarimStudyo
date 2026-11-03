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
test('3NP1133 uses top-down orthographic plan without stretched or front photographic art',()=>{
 for(const state of [false,true]){
  const art=Material.markup(d,{id:'s3',state});
  assert.match(art,/width="211\.6" height="404" viewBox="27 0 126 240" preserveAspectRatio="xMidYMid meet"/);
  assert.match(art,/data-view="top-orthographic"/);
  assert.match(art,/data-visual-match="representative"/);
  assert.match(art,/TEMSİLİ · ÜSTTEN/);
  assert.doesNotMatch(art,/nh-holder-front-v111\.png|preserveAspectRatio="none"|scale\(1 0\.32\)|rotate\(|skew|perspective/);
 }
});
test('other material branches are not wrapped with physical NH geometry',()=>{
 const art=Material.markup({id:'siren',w:180,h:240},{id:'siren'});
 assert.doesNotMatch(art,/viewBox="27 0 126 240"/);
});
