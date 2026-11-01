'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Print=require('../dist/project-print.js');
const el=(tag,attrs={})=>({
 localName:tag,tagName:tag,
 attributes:Object.entries(attrs).map(([name,value])=>({name,value})),
 getAttribute:key=>Object.prototype.hasOwnProperty.call(attrs,key)?attrs[key]:null,
 getAttributeNS:()=>null
});
function svg(attrs={},children=[]){
 return {...el('svg',attrs),outerHTML:'<svg><path fill="#ccd"/></svg>',
  querySelectorAll:()=>children};
}
test('P0-01 blocks root SVG event handlers before PDF print',()=>{
 for(const attr of ['onload','onerror','onLoad']){
  assert.equal(Print.safeResources(svg({[attr]:'void(0)'})).ok,false,attr);
 }
});
test('P0-01 blocks nested SVG event handlers before PDF print',()=>{
 for(const attr of ['onclick','onbegin','onrepeat']){
  assert.equal(Print.safeResources(svg({},[el('path',{[attr]:'void(0)'})])).ok,false,attr);
 }
});
test('P0-01 PDF preparation never appends cloned SVG with event handler',()=>{
 for(const attrs of [{onload:'void(0)'},{onclick:'void(0)'}]){
  let appended=0;
  const copy=svg(attrs);
  const source={cloneNode:()=>copy};
  const doc={body:{appendChild(){appended++}}};
  const scene={getBBox:()=>({x:0,y:0,width:100,height:100})};
  assert.equal(Print.prepare(doc,source,scene,'Offline').ok,false);
  assert.equal(appended,0);
 }
});
test('P0-01 keeps safe offline photo, local paint and normal SVG printable',()=>{
 assert.equal(Print.safeResources(svg({},[el('image',{href:'assets/products/meter.webp'})])).ok,true);
 assert.equal(Print.safeResources(svg({},[el('use',{href:'#paint'})])).ok,true);
 assert.equal(Print.safeResources(svg({},[el('rect',{fill:'#ccd'})])).ok,true);
});
test('P0-01 keeps existing external-resource and XML base denials',()=>{
 assert.equal(Print.safeResources(svg({},[el('image',{href:'https://example.invalid/photo.png'})])).ok,false);
 assert.equal(Print.safeResources(svg({'xml:base':'https://example.invalid/'})).ok,false);
});
