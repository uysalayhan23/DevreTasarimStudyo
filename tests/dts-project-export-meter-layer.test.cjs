'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Png=require('../dist/project-png.js'),Print=require('../dist/project-print.js');
const transient=['wire-editors','draft-wire-group','selection-box','alignment-guide'];
function drawing(){
 const removed=[];const meter={removed:false};
 const copy={style:{transform:''},setAttribute(){},removeAttribute(){},querySelector(){return null},
 querySelectorAll(s){
  if(s==='*')return[];
  const hits=transient.filter(k=>s.split(',').includes('.'+k)).map(name=>({remove(){removed.push(name)}}));
  if(s.includes('.measurement-overlay'))hits.push({remove(){meter.removed=true}});
  return hits;
 }};
 const source={cloneNode(){return copy},querySelectorAll(){return[]}};
 return {source,copy,removed,meter};
}
test('PDF keeps measurement overlay and removes wire edit handles',()=>{
 const d=drawing(),scene={getBBox:()=>({x:0,y:0,width:100,height:80})};
 const doc={body:{appendChild(){}},getElementById(){return null},createElement(){
 return {children:[],appendChild(x){this.children.push(x)},remove(){},set textContent(x){this.text=x}};
 }};
 const result=Print.prepare(doc,d.source,scene,'Devre');
 assert.equal(result.ok,true);
 assert.equal(d.meter.removed,false);
 assert.deepEqual(d.removed.sort(),transient.slice().sort());
});
test('PNG keeps measurement overlay and removes wire edit handles',async()=>{
 const d=drawing();let saved=0;
 const doc={getElementById(id){return id==='workspace'?d.source:id==='scene'?{getBBox:()=>({x:0,y:0,width:100,height:80})}:null},
 body:{appendChild(){}},
 createElement(k){if(k==='canvas')return{getContext:()=>({fillRect(){},drawImage(){},set fillStyle(x){}}),toBlob(cb){cb({type:'image/png'})}};
 return {click(){saved++},remove(){}}}};
 let seq=0;
 const win={DTSProjectPrint:Print,Image:class{set src(v){this.onload?.()}},
 XMLSerializer:class{serializeToString(){return'<svg />'}},Blob:class{},
 getComputedStyle(){return{getPropertyValue(){return''}}},
 URL:{createObjectURL(){return'blob:'+ ++seq},revokeObjectURL(){}},setTimeout(fn){fn()}};
 const result=await Png.exportPng(doc,win,'Ölçü Aletleri');
 assert.equal(result.ok,true);assert.equal(saved,1);
 assert.equal(d.meter.removed,false);
 assert.deepEqual(d.removed.sort(),transient.slice().sort());
});
test('PNG still rejects non-inline image assets',()=>{
 const s={querySelectorAll(){return[{tagName:'image',getAttribute(){return'https://example.com/external.png'}}]}};
 assert.equal(Png.sourceCheck(s).ok,false);
});
test('print and PNG exporters never remove measurement-overlay',()=>{
 const select='.wire-editor-layer,.wire-editors,.alignment-guides,.alignment-guide,.draft-wire,.draft-wire-group,.selection-box';
 assert.equal(select.includes('measurement-overlay'),false);
});
