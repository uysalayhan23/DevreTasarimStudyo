'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Png=require('../dist/project-png.js');
function svg(tag,href,legacy){
 const el={localName:tag,getAttribute(k){return k===(legacy?'xlink:href':'href')?href:null}};
 return {querySelectorAll(){return [el]}};
}
test('PNG rejects external textPath reference',()=>assert.equal(Png.sourceCheck(svg('textPath','https://example.invalid/remote.svg#path')).ok,false));
test('PNG rejects external gradient reference',()=>assert.equal(Png.sourceCheck(svg('linearGradient','https://example.invalid/remote.svg#paint')).ok,false));
test('PNG rejects external xlink:href on paint server',()=>assert.equal(Png.sourceCheck(svg('radialGradient','https://example.invalid/remote.svg#paint',true)).ok,false));
test('PNG permits local paint-server reference',()=>assert.equal(Png.sourceCheck(svg('linearGradient','#paint')).ok,true));
test('PNG permits embedded raster image',()=>assert.equal(Png.sourceCheck(svg('image','data:image/png;base64,AAAA')).ok,true));
test('PNG still rejects external raster image',()=>assert.equal(Png.sourceCheck(svg('image','https://example.invalid/remote.png')).ok,false));
test('PNG permits local symbol use',()=>assert.equal(Png.sourceCheck(svg('use','#symbol')).ok,true));
