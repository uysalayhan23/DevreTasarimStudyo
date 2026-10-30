'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const PNG=require('../dist/project-png.js');
const PDF=require('../dist/project-print.js');

function xmlSvg(xml){
  return {nodeType:1,outerHTML:xml,querySelectorAll(){return []},getAttribute(){return null},getAttributeNS(){return null}};
}
const unsafe=[
  ['image-set URL string','<svg><style>svg{background-image:image-set("https://bad.example/ext.png" 1x)}</style></svg>'],
  ['webkit image-set','<svg style="background-image:-webkit-image-set(\'https://bad.example/ext.png\' 1x)"></svg>'],
  ['CSS image()','<svg><style>svg{background-image:image("https://bad.example/a.png")}</style></svg>'],
  ['escaped image-set','<svg><style>svg{background-image:image-\\73 et("https://bad.example/a.png" 1x)}</style></svg>'],
  ['numeric XML entities','<svg><style>svg{background-image:&#105;mage-set("https://bad.example/a.png" 1x)}</style></svg>'],
];
for(const [name,xml] of unsafe){
 test('P0-01 PNG rejects '+name,()=>assert.equal(PNG.cssCheck(xml).ok,false));
 test('P0-01 PDF rejects '+name,()=>assert.equal(PDF.safeResources(xmlSvg(xml)).ok,false));
}
test('P0-01 local gradient and pattern URLs remain permitted in PNG and PDF',()=>{
 const xml='<svg fill="url(#g)" stroke="url(\'#grid-1\')"><defs><linearGradient id="g"/></defs></svg>';
 assert.equal(PNG.cssCheck(xml).ok,true);
 assert.equal(PDF.safeResources(xmlSvg(xml)).ok,true);
});
test('P0-01 ordinary SVG text/attributes remain supported',()=>{
 const xml='<svg><text>Merhaba — seçim, etiket, kablo bağlantısı</text></svg>';
 assert.equal(PNG.cssCheck(xml).ok,true);
 assert.equal(PDF.safeResources(xmlSvg(xml)).ok,true);
});
