'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Mat=require('../dist/materials-v111.js');
const d={id:'nh-fuse-holder',w:211.6,h:404};
const render=c=>Mat.markup(d,{id:'nh-1',...c});
test('3NP1133 no longer displays the mismatched front product photo as an overhead plan',()=>{
 const svg=render();
 assert.match(svg,/class="nh-top-plan" data-view="top-orthographic" data-visual-match="representative"/);
 assert.doesNotMatch(svg,/nh-holder-front-v111\.png|<image|perspective|skew\(|scale\(1 0\.32\)/);
 assert.match(svg,/TEMSİLİ · ÜSTTEN/);
});
test('all 6 overhead terminal positions are visible at original diagram coordinates',()=>{
 const svg=render();
 assert.equal((svg.match(/data-nh-pole="[123]"/g)||[]).length,3);
 for(const x of [40,90,140]){
  assert.match(svg,new RegExp('M'+x+' 0V28M'+x+' 211V240'));
  assert.match(svg,new RegExp('cx="'+x+'" cy="14"'));
  assert.match(svg,new RegExp('cx="'+x+'" cy="226"'));
 }
});
test('opening the cover changes only a face-on layer, never the frame or terminal traces',()=>{
 const closed=render({state:false}),opened=render({state:true});
 assert.match(closed,/class="nh-lid"/);assert.doesNotMatch(opened,/class="nh-lid"/);
 assert.match(opened,/KAPAK AÇIK/);
 for(const s of [closed,opened]){
  assert.match(s,/x="27" y="2" width="126" height="236"/);
  assert.equal((s.match(/data-nh-pole=/g)||[]).length,3);
  assert.doesNotMatch(s,/transform="rotate|scale\(0\.7 1\)|preserveAspectRatio="none"/);
 }
});
test('installed fuses are shown as three independent top-view slots only when present',()=>{
 const all=render({state:true,nhFuses:[true,true,true]}),none=render({state:true,nhFuses:[false,false,false]});
 assert.equal((all.match(/>NH<\/text>/g)||[]).length,3);
 assert.doesNotMatch(none,/>NH<\/text>/);
});
test('other product markup is not converted to 3NP overhead plan',()=>{
 for(const type of ['packet-star-delta','nh-fuse','siren']){
  const svg=Mat.markup({id:type,w:180,h:240},{id:'other'});
  assert.doesNotMatch(svg,/nh-top-plan|data-view="top-orthographic"/);
 }
});
