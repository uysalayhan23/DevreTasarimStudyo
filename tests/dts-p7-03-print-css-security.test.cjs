'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Print=require('../dist/project-print.js');
function svg(markup,nodes=[],attrs={}){
 return {outerHTML:markup,querySelectorAll(){return nodes},
  getAttribute(k){return Object.prototype.hasOwnProperty.call(attrs,k)?attrs[k]:null},
  getAttributeNS(){return null}};
}
function el(tag,attrs={}){
 return {tagName:tag,getAttribute(k){return Object.prototype.hasOwnProperty.call(attrs,k)?attrs[k]:null},
  getAttributeNS(){return null}};
}
test('P7-03 blocks external CSS import in PDF',()=>{
 assert.equal(Print.safeResources(svg('<svg><style>@import "https://bad.invalid/x.css"</style></svg>')).ok,false);
});
test('P7-03 blocks remote CSS paint URL',()=>{
 assert.equal(Print.safeResources(svg('<svg><path fill="url(https://bad.invalid/p.svg)"/></svg>')).ok,false);
});
test('P7-03 blocks escaped CSS import',()=>{
 assert.equal(Print.safeResources(svg('<svg><style>@\\69mport "https://bad.invalid/x.css"</style></svg>')).ok,false);
});
test('P7-03 blocks numeric-entity external CSS reference',()=>{
 assert.equal(Print.safeResources(svg('<svg><path fill="url(&#x68;ttps://bad.invalid/x.svg)"/></svg>')).ok,false);
});
test('P7-03 allows local SVG paint references',()=>{
 assert.equal(Print.safeResources(svg('<svg><path fill="url(#gradient)"/></svg>')).ok,true);
});
test('P7-03 allows self-contained ordinary SVG',()=>{
 assert.equal(Print.safeResources(svg('<svg><path fill="#ffffff"/></svg>')).ok,true);
});
test('P7-03 keeps packaged offline raster images printable',()=>{
 assert.equal(Print.safeResources(svg('<svg><image href="assets/plc/cpu.png"/></svg>',
  [el('image',{href:'assets/plc/cpu.png'})])).ok,true);
});
test('P7-03 still blocks remote raster images',()=>{
 assert.equal(Print.safeResources(svg('<svg><image href="https://bad.invalid/a.png"/></svg>',
  [el('image',{href:'https://bad.invalid/a.png'})])).ok,false);
});
test('P7-03 blocks xml:base on root before resolving packaged assets',()=>{
 assert.equal(Print.safeResources(svg('<svg xml:base="https://bad.invalid/"><image href="assets/a.png"/></svg>',
  [el('image',{href:'assets/a.png'})],{'xml:base':'https://bad.invalid/'})).ok,false);
});
test('P7-03 blocks xml:base on descendant',()=>{
 assert.equal(Print.safeResources(svg('<svg><g xml:base="https://bad.invalid/"/></svg>',
  [el('g',{'xml:base':'https://bad.invalid/'})])).ok,false);
});
test('P7-03 rejects SVG scripts',()=>{
 assert.equal(Print.safeResources(svg('<svg><script/></svg>',[el('script')])).ok,false);
});
test('P7-03 print preparation does not append unsafe SVG',()=>{
 let appended=0;const duplicate=svg('<svg><style>@import "https://bad.invalid/x.css"</style></svg>');
 const source={cloneNode(){return duplicate}};
 const doc={body:{appendChild(){appended++}},createElement(){return{}},getElementById(){return null}};
 const scene={getBBox(){return{x:0,y:0,width:100,height:100}}};
 assert.equal(Print.prepare(doc,source,scene,'Test').ok,false);
 assert.equal(appended,0);
});
