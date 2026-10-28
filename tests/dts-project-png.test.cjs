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

test('successful download keeps PNG Blob URL valid until browser can start saving it',async()=>{
 const Print=require('../dist/project-print.js');
 let seq=0,downloaded=0,delayed=null;const revoked=[];
 const image={style:{transform:''},setAttribute(){},removeAttribute(){},querySelector(){return null},querySelectorAll(){return []}};
 const source={cloneNode:()=>image,querySelectorAll(){return[]}};
 const scene={getBBox:()=>({x:0,y:0,width:100,height:70})};
 const doc={getElementById:id=>id==='workspace'?source:id==='scene'?scene:null,
  body:{appendChild(){}},createElement:k=>k==='canvas'?{getContext(){return{fillRect(){},drawImage(){},set fillStyle(v){}}},toBlob(cb){cb({type:'image/png'})}}:
  {click(){downloaded++},remove(){}}};
 const win={DTSProjectPrint:Print,Image:class{set src(v){this.onload?.()}},
  XMLSerializer:class{serializeToString(){return'<svg/>'}},
  Blob:class{},getComputedStyle(){return{getPropertyValue(){return''}}},
  URL:{createObjectURL(){return 'blob:test'+(++seq)},revokeObjectURL(u){revoked.push(u)}},
  setTimeout(fn,ms){delayed=fn;assert.equal(ms,1200)}
 };
 const result=await Png.exportPng(doc,win,'Test');
 assert.equal(result.ok,true);assert.equal(downloaded,1);
 assert.deepEqual(revoked,['blob:test1']);
 assert.equal(typeof delayed,'function');
 delayed();assert.deepEqual(revoked,['blob:test1','blob:test2']);
});

test('rejects SVG feImage filter sources rather than silently exporting incomplete art',()=>{
 for(const href of ['https://example.invalid/filter.png','assets/filter.png','data:image/png;base64,AAAA']){
  assert.equal(Png.sourceCheck(svg([el('feImage',href)])).ok,false);
 }
 assert.equal(Png.sourceCheck(svg([el('use','#local')])).ok,true);
});
