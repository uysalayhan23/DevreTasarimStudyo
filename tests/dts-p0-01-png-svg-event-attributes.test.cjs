'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const PNG=require('../dist/project-png.js');
const el=(name,attrs={})=>({
 localName:name,tagName:name,
 attributes:Object.entries(attrs).map(([name,value])=>({name,value})),
 getAttribute:key=>Object.prototype.hasOwnProperty.call(attrs,key)?attrs[key]:null,
 getAttributeNS:()=>null
});
const svg=(attrs={},children=[])=>({
 ...el('svg',attrs),
 querySelectorAll:()=>children
});
test('P0-01 PNG rejects root SVG event attributes',()=>{
 for(const attr of ['onload','onerror','onLoad']){
  assert.equal(PNG.sourceCheck(svg({[attr]:'void(0)'})).ok,false,attr);
 }
});
test('P0-01 PNG rejects nested SVG event attributes',()=>{
 for(const attr of ['onclick','onClick','onbegin']){
  assert.equal(PNG.sourceCheck(svg({},[el('path',{[attr]:'void(0)'})])).ok,false,attr);
 }
});
test('P0-01 PNG keeps normal art, local use and embedded raster images',()=>{
 assert.equal(PNG.sourceCheck(svg({},[el('rect',{fill:'#abc'})])).ok,true);
 assert.equal(PNG.sourceCheck(svg({},[el('use',{href:'#paint'})])).ok,true);
 assert.equal(PNG.sourceCheck(svg({},[el('image',{href:'data:image/png;base64,AAAA'})])).ok,true);
});
test('P0-01 PNG still rejects external images and executable SVG',()=>{
 assert.equal(PNG.sourceCheck(svg({},[el('image',{href:'https://example.invalid/x.png'})])).ok,false);
 assert.equal(PNG.sourceCheck(svg({},[el('script')])).ok,false);
 assert.equal(PNG.sourceCheck(svg({'xml:base':'https://example.invalid/'})).ok,false);
});
