'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Print=require('../dist/project-print.js');
test('print bounds include negative coordinates and margin',()=>{
 assert.deepEqual(Print.bounds({x:-20,y:10,width:200,height:120}),{x:-80,y:-50,width:320,height:240});
 assert.deepEqual(Print.bounds({x:0,y:0,width:2,height:3},10),{x:-10,y:-10,width:22,height:23});
});
test('bad or empty geometry is rejected',()=>{
 for(const bounds of [null,{x:0,y:0,width:0,height:90},{x:0,y:0,width:Infinity,height:90},{x:0,y:0,width:30000,height:90}])
  assert.equal(Print.bounds(bounds),null);
 assert.equal(Print.prepare({},null,null).ok,false);
});
test('a print copy has an independent camera and correct SVG crop',()=>{
 const svg={style:{transform:'translate(9px,5px) scale(2)'},cloneNode(){
  return {style:{transform:this.style.transform},setAttribute(k,v){this[k]=v},removeAttribute(){},
    querySelector(){return null},querySelectorAll(){return []}};
 }};
 const scene={getBBox:()=>({x:3,y:4,width:100,height:80})},body={appendChild(){}};
 const doc={body,getElementById(){return null},createElement(){return {
  children:[],appendChild(c){this.children.push(c)},remove(){},set textContent(value){this.text=value}};
 }};
 const p=Print.prepare(doc,svg,scene,'Test');
 assert.equal(p.ok,true);assert.equal(svg.style.transform,'translate(9px,5px) scale(2)');
 assert.equal(p.node.children[2].children[0].style.transform,'none');
 assert.equal(p.node.children[2].children[0].viewBox,'-57 -56 220 200');
});
test('unsupported browser and failed print are safely handled',()=>{
 assert.equal(Print.printScene({},{}).ok,false);
 let removed=0;const svg={cloneNode(){return {style:{},setAttribute(){},removeAttribute(){},querySelector(){return null},querySelectorAll(){return []}}}};
 const scene={getBBox:()=>({x:0,y:0,width:80,height:50})};
 const doc={body:{appendChild(){}},getElementById(id){return id==='workspace'?svg:id==='scene'?scene:null},createElement(){
  return {appendChild(){},remove(){removed++},set textContent(v){this.text=v}};
 }};
 let cb;const win={print(){throw Error('no printer')},addEventListener(k,f){cb=f},removeEventListener(){}};
 assert.equal(Print.printScene(doc,win,'Devre').ok,false);
 assert.equal(removed,1);cb();assert.equal(removed,1);
});
