'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Print=require('../dist/project-print.js');
function setup(){
 let removed=false,printed=false;
 const node=()=>({style:{},setAttribute(){},removeAttribute(){},remove(){removed=true},appendChild(){},querySelector(){return null},querySelectorAll(){return []}});
 const svg={cloneNode:node},scene={getBBox(){return {x:0,y:0,width:100,height:100}}};
 const doc={body:{appendChild(){}},createElement:node,getElementById(k){return k==='workspace'?svg:k==='scene'?scene:null}};
 return {doc,removed:()=>removed,print:()=>{printed=true},printed:()=>printed};
}
test('DOM access failure is a controlled print error',()=>{
 const result=Print.printScene({getElementById(){throw Error('broken DOM')}},{print(){}},'test');
 assert.equal(result.ok,false);
});
test('afterprint listener failure cleans staged drawing without printing',()=>{
 const x=setup(),result=Print.printScene(x.doc,{print:x.print,addEventListener(){throw Error('blocked')}},'test');
 assert.equal(result.ok,false);assert.equal(x.removed(),true);assert.equal(x.printed(),false);
});
test('normal printable drawing retains successful print path',()=>{
 const x=setup(),result=Print.printScene(x.doc,{print:x.print,addEventListener(){}},'test');
 assert.equal(result.ok,true);assert.equal(x.printed(),true);
});
