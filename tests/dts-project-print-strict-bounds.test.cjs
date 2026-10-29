'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Print=require('../dist/project-print.js');
test('P7-03 missing or coerced SVG crop coordinates cannot produce PDF print area',()=>{
 for(const x of [null,'',false,'20',undefined]){
  assert.equal(Print.bounds({x,y:0,width:100,height:80}),null);
 }
});
test('P7-03 missing, blank or string SVG dimensions cannot produce a crop',()=>{
 for(const width of [null,'',false,'100',undefined]){
  assert.equal(Print.bounds({x:0,y:0,width,height:80}),null);
 }
});
test('P7-03 native SVG numeric zeros and negative origins remain valid',()=>{
 assert.deepEqual(Print.bounds({x:0,y:0,width:100,height:80}),{x:-60,y:-60,width:220,height:200});
 assert.deepEqual(Print.bounds({x:-20,y:5,width:100,height:80},10),{x:-30,y:-5,width:120,height:100});
});
test('P7-03 finite fractional SVG crop retains precision',()=>{
 assert.deepEqual(Print.bounds({x:.25,y:.5,width:20.25,height:10.5},.5),
  {x:-.25,y:0,width:21.25,height:11.5});
});
test('P7-03 unsupported or degenerate geometry remains unavailable',()=>{
 assert.equal(Print.bounds({x:0,y:0,width:0,height:20}),null);
 assert.equal(Print.bounds({x:NaN,y:0,width:100,height:20}),null);
});
