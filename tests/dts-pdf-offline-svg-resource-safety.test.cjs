'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Print=require('../dist/project-print.js');
const node=(tag,href)=>({localName:tag,getAttribute:key=>key==='href'?href:null});
const svg=(children=[])=>({querySelectorAll:()=>children,style:{},setAttribute(){},removeAttribute(){},querySelector(){return null}});
function documentWithClone(children){
 let appended=0;
 const duplicate=svg(children);
 const source={cloneNode:()=>duplicate};
 const doc={body:{appendChild(){appended++}},getElementById:()=>null,
  createElement:()=>({appendChild(){},remove(){},set textContent(v){this.label=v}})};
 const scene={getBBox:()=>({x:0,y:0,width:100,height:100})};
 return {source,doc,scene,appended:()=>appended};
}
test('P0-01 PDF rejects external network product images before DOM insertion',()=>{
 for(const href of ['https://example.invalid/p.png','http://example.invalid/p.jpg','//example.invalid/p.webp']){
  const f=documentWithClone([node('image',href)]);
  const res=Print.prepare(f.doc,f.source,f.scene,'test');
  assert.equal(res.ok,false);assert.equal(f.appended(),0);
 }
});
test('P0-01 PDF rejects unsafe file protocol, traversal and external use references',()=>{
 for(const href of ['file:///C:/secret.png','assets/../private.png','../products/photo.jpg']){
  assert.equal(Print.safeResources(svg([node('image',href)])).ok,false);
 }
 assert.equal(Print.safeResources(svg([node('use','https://example.invalid/icon.svg#id')])).ok,false);
});
test('P0-01 PDF rejects executable SVG and foreignObject content',()=>{
 for(const tag of ['script','foreignObject','feImage','animate','animateMotion','set']){
  assert.equal(Print.safeResources(svg([node(tag,null)])).ok,false);
 }
});
test('P0-01 packaged offline catalog photos still print without network access',()=>{
 const f=documentWithClone([node('image','assets/products/sensor-photo.jpg')]);
 const res=Print.prepare(f.doc,f.source,f.scene,'Local');
 assert.equal(res.ok,true);assert.equal(f.appended(),1);
});
test('P0-01 embedded raster images and same-document SVG references remain printable',()=>{
 const embedded=node('image','data:image/png;base64,AAAA'),local=node('use','#clip');
 assert.equal(Print.safeResources(svg([embedded,local])).ok,true);
});
test('P0-01 remote CSS-style svg+xml image data does not pass as safe local raster',()=>{
 const bad=node('image','data:image/svg+xml;base64,AAAA');
 assert.equal(Print.safeResources(svg([bad])).ok,false);
});
test('P0-01 absent or malformed print resource inspection fails closed',()=>{
 assert.equal(Print.safeResources(null).ok,false);
 assert.equal(Print.safeResources({querySelectorAll(){throw Error('selector failure')}}).ok,false);
});
