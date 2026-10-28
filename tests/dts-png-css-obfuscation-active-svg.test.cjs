'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const PNG=require('../dist/project-png.js');
const css=xml=>PNG.cssCheck(xml).ok;
const el=(tag,href,localName)=>({tagName:tag,localName,getAttribute:k=>k==='href'?href:null});
const source=e=>PNG.sourceCheck({querySelectorAll:()=>[e]}).ok;
test('escaped CSS URL cannot bypass offline resource rejection',()=>{
 assert.equal(css(String.raw`<svg><style>rect{fill:u\72l(https://invalid.example/x.png)}</style></svg>`),false);
});
test('escaped @import cannot load remote stylesheet',()=>{
 assert.equal(css(String.raw`<svg><style>@\69mport "https://invalid.example/a.css";</style></svg>`),false);
});
test('CSS comment-split URL is rejected',()=>{
 assert.equal(css('<svg><style>rect{fill:u/**/rl(https://invalid.example/x.png)}</style></svg>'),false);
});
test('same-document SVG paint server remains allowed',()=>{
 assert.equal(css('<svg><rect style="fill:url(#paint1)"/></svg>'),true);
 assert.equal(css('<svg><rect style="fill:url(&quot;#paint1&quot;)"/></svg>'),true);
});
test('ordinary external CSS URL is rejected',()=>{
 assert.equal(css('<svg><rect style="fill:url(https://invalid.example/x.png)"/></svg>'),false);
});
test('prefixed SVG image cannot bypass href validation',()=>{
 assert.equal(source(el('svg:image','https://invalid.example/x.png','image')),false);
 assert.equal(source(el('svg:image','data:image/png;base64,AA==','image')),true);
});
test('SVG animation and script are not exported as static PNG',()=>{
 for(const tag of ['animate','animateMotion','animateTransform','set','script'])
  assert.equal(source(el(tag,null,tag)),false,tag);
});
test('local SVG use is allowed, external use rejected',()=>{
 assert.equal(source(el('use','#paint1','use')),true);
 assert.equal(source(el('use','https://invalid.example/a.svg','use')),false);
});
