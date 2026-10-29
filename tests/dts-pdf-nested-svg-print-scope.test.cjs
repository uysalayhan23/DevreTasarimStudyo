'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Print=require('../dist/project-print.js');
const read=name=>fs.readFileSync(path.join(__dirname,'../dist',name),'utf8');
test('P7-03 PDF print stylesheet sizes only the outer artwork SVG',()=>{
 const css=read('studio.css');
 assert.match(css,/#dtsPrintSurface\s+\.dts-print-diagram\s*>\s*svg\s*\{/);
 assert.doesNotMatch(css,/#dtsPrintSurface\s+svg\s*\{/);
});
test('P7-03 root print SVG retains page fitting without overriding nested device sizes',()=>{
 const css=read('studio.css');
 const rule=css.match(/#dtsPrintSurface\s+\.dts-print-diagram\s*>\s*svg\s*\{([^}]*)\}/);
 assert.ok(rule);
 assert.match(rule[1],/width:100%!important/);
 assert.match(rule[1],/height:auto!important/);
 assert.match(rule[1],/max-height:158mm!important/);
 // The direct-child selector must not match an svg nested inside another svg.
 assert.ok(rule[0].includes('> svg'));
});
test('P7-03 nested SVG must keep its original attributes while preparing print copy',()=>{
 const inside={localName:'svg',attributes:{width:'35',height:'40'},
  getAttribute(n){return this.attributes[n]??null}};
 let content=null,original={tagName:'svg',cloneNode(){
  const clone={id:'',style:{},inner:inside,querySelectorAll:()=>[],
   setAttribute(){},removeAttribute(){},querySelector(){return null}};content=clone;return clone;
 }};
 const scene={getBBox:()=>({x:0,y:0,width:100,height:80})};
 const doc={body:{appendChild(){}},getElementById:()=>null,
  createElement:()=>({appendChild(){},remove(){},set textContent(v){this.text=v}})};
 const result=Print.prepare(doc,original,scene,'Nested device');
 assert.equal(result.ok,true);
 assert.equal(content.inner.getAttribute('width'),'35');
 assert.equal(content.inner.getAttribute('height'),'40');
});
test('P7-03 offline index loads refreshed print stylesheet',()=>{
 assert.match(read('index.html'),/studio\.css\?rev=20261029-print-nested-svg1/);
});
test('P7-03 PDF print source still rejects offsite svg content',()=>{
 const external={localName:'image',getAttribute:n=>n==='href'?'https://example.invalid/a.png':null};
 const svg={querySelectorAll:()=>[external]};
 assert.equal(Print.safeResources(svg).ok,false);
});
