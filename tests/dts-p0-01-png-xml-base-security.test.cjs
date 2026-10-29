'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const PNG=require('../dist/project-png.js');
const XML='http://www.w3.org/XML/1998/namespace';
function node(tag,base=null,{namespaced=false,href=null}={}){
 return {localName:tag,
  getAttribute:name=>name==='xml:base'&&!namespaced?base:name==='href'?href:null,
  getAttributeNS:(ns,name)=>ns===XML&&name==='base'&&namespaced?base:null};
}
function svg(root,nodes=[]){return {...root,querySelectorAll:selector=>selector==='*'?nodes:nodes.filter(n=>n.localName==='use'||n.localName==='image')}}

test('P0-01 PNG rejects external xml:base on SVG root before exporting local href',()=>{
 const scene=svg(node('svg','https://example.invalid/sprite.svg'),[node('use',null,{href:'#local'})]);
 assert.equal(PNG.sourceCheck(scene).ok,false);
});
test('P0-01 PNG rejects nested xml:base even if references otherwise appear local',()=>{
 const scene=svg(node('svg'),[node('g','https://example.invalid/assets/'),node('use',null,{href:'#local'})]);
 assert.equal(PNG.sourceCheck(scene).ok,false);
});
test('P0-01 PNG rejects XML-namespaced base on the root and descendant',()=>{
 for(const scene of [
  svg(node('svg','https://example.invalid/',{namespaced:true}),[node('use',null,{href:'#local'})]),
  svg(node('svg'),[node('g','https://example.invalid/',{namespaced:true}),node('use',null,{href:'#local'})])
 ])assert.equal(PNG.sourceCheck(scene).ok,false);
});
test('P0-01 PNG allows same-document SVG references when xml:base is absent',()=>{
 const scene=svg(node('svg'),[node('g'),node('use',null,{href:'#local'})]);
 assert.equal(PNG.sourceCheck(scene).ok,true);
 assert.equal(PNG.cssCheck('<svg><path fill="url(#paint)"/></svg>').ok,true);
});
test('P0-01 PNG still rejects remote reference without xml:base',()=>{
 const scene=svg(node('svg'),[node('use',null,{href:'https://example.invalid/a.svg#x'})]);
 assert.equal(PNG.sourceCheck(scene).ok,false);
});
