'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Png=require('../dist/project-png.js');
function svg(nodes=[]){return {querySelectorAll(){return nodes}}}
function el(tag,href){return {tagName:tag,getAttribute:k=>k==='href'?href:''}}
test('rejects unsafe external image, HTML and remote-use references',()=>{
 for(const x of [el('image','assets/plc/front.png'),el('foreignObject',''),el('use','https://outside/file.svg#icon')])
  assert.equal(Png.sourceCheck(svg([x])).ok,false);
 assert.equal(Png.sourceCheck(null).ok,false);
});
test('allows SVG paths and embedded base64 images only',()=>{
 assert.equal(Png.sourceCheck(svg()).ok,true);
 assert.equal(Png.sourceCheck(svg([el('image','data:image/png;base64,AAAA')])).ok,true);
 assert.equal(Png.sourceCheck(svg([el('use','#local')])).ok,true);
});
test('caps output dimensions, avoiding unsafe memory pressure',()=>{
 assert.deepEqual(Png.dimension({width:500,height:100}),{width:1000,height:200});
 assert.equal(Png.dimension({width:15000,height:100}),null);
 assert.equal(Png.dimension({width:6000,height:4000}),null);
 assert.equal(Png.dimension({width:0,height:100}),null);
});
test('unsupported browser declines without touching the model',async()=>{
 const result=await Png.exportPng({},{});assert.equal(result.ok,false);
});
