'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const program=()=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q2'}}
]});
test('removing an actual Network keeps source untouched and valid',()=>{
 const original=program(),next=E.removeNetwork(original,1,limits);
 assert.equal(next.ok,true);assert.deepEqual(next.program.rungs.map(r=>r.id),['R1']);
 assert.equal(original.rungs.length,2);assert.equal(L.validate(next.program,limits).ok,true);
});
test('malformed Network indexes cannot silently delete Network 0',()=>{
 const original=program(),before=JSON.stringify(original);
 for(const index of [NaN,null,-1,2,1.5,'0',undefined]){
  assert.equal(E.removeNetwork(original,index,limits).ok,false);
 }
 assert.equal(JSON.stringify(original),before);
});
test('last Network cannot be removed',()=>{
 const single=E.removeNetwork(program(),1,limits).program;
 assert.equal(E.removeNetwork(single,0,limits).ok,false);
});
test('removing a parallel path keeps other paths and valid output',()=>{
 const original=program(),next=E.removeParallelPath(original,0,1,limits);
 assert.equal(next.ok,true);assert.equal(next.program.rungs[0].paths.length,1);
 assert.equal(original.rungs[0].paths.length,2);
 assert.equal(L.validate(next.program,limits).ok,true);
});
test('invalid and last parallel path indexes fail closed',()=>{
 const original=program(),before=JSON.stringify(original);
 for(const [r,p] of [[NaN,0],[0,NaN],[-1,0],[0,-1],[0,2],[2,0],['0',0],[0,'1']]){
  assert.equal(E.removeParallelPath(original,r,p,limits).ok,false);
 }
 assert.equal(E.removeParallelPath(original,1,0,limits).ok,false);
 assert.equal(JSON.stringify(original),before);
});
test('hidden Network descendants and inert/aria-hidden ancestors are excluded',()=>{
 const control=(hidden)=>({disabled:false,hidden:false,tabIndex:0,
  getAttribute:()=>null,closest:()=>hidden?{}:null,focus(){}});
 assert.equal(E.focusableControl(control(false)),true);
 assert.equal(E.focusableControl(control(true)),false);
});
test('Shift Tab wraps to last visible control, not collapsed Network input',()=>{
 const doc={activeElement:null},control=(id,hidden)=>({id,disabled:false,hidden:false,tabIndex:0,
  getAttribute:()=>null,closest:()=>hidden?{}:null,focus(){doc.activeElement=this;}});
 const first=control('first',false),last=control('last',false),collapsed=control('collapsed',true);
 const controls=[first,last,collapsed],dialog={querySelectorAll:()=>controls,
  contains:x=>controls.includes(x),focus(){doc.activeElement=this;}};
 first.focus();const e={key:'Tab',shiftKey:true,preventDefault(){}};
 assert.equal(E.trapModalTab(e,dialog,doc),true);assert.equal(doc.activeElement,last);
});
test('Tab from previously focused hidden element returns to visible first control',()=>{
 const doc={activeElement:null},control=(id,hidden)=>({id,disabled:false,hidden:false,tabIndex:0,
  getAttribute:()=>null,closest:()=>hidden?{}:null,focus(){doc.activeElement=this;}});
 const first=control('first',false),hidden=control('hidden',true),controls=[first,hidden];
 const dialog={querySelectorAll:()=>controls,contains:x=>controls.includes(x),focus(){doc.activeElement=this;}};
 hidden.focus();const e={key:'Tab',shiftKey:false,preventDefault(){}};
 assert.equal(E.trapModalTab(e,dialog,doc),true);assert.equal(doc.activeElement,first);
});
