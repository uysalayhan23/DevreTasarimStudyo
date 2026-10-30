'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(){
 const listeners={},inputListeners={},classes=new Set(['library-collapsed']);
 const classList={contains:x=>classes.has(x),remove:x=>classes.delete(x)};
 const input={tagName:'INPUT',dataset:{},value:'',focus(){doc.activeElement=input},select(){this.selected=true},
  blur(){doc.activeElement=null},addEventListener(k,fn){inputListeners[k]=fn},
  dispatchEvent(){this.dispatched=true}};
 const modal={hidden:true};
 const doc={activeElement:null,body:{classList},defaultView:{Event:class{constructor(type){this.type=type}}},
  getElementById(id){return id==='searchInput'?input:id==='modal'?modal:null},
  addEventListener(k,fn){listeners[k]=fn}};
 const env={DTSStudio:{isHome:false,safety:{visible:false}}};
 UX.init(doc,env);
 function press(options={}){let count=0;const e={key:'k',ctrlKey:true,metaKey:false,altKey:false,shiftKey:false,
  isComposing:false,defaultPrevented:false,preventDefault(){count++},...options};listeners.keydown(e);
  return {prevented:count,focus:doc.activeElement===input,collapsed:classes.has('library-collapsed')};}
 return {doc,input,modal,env,press,classes,inputListeners};
}
test('previously consumed Ctrl+K is not hijacked and leaves the library collapsed',()=>{
 const f=fixture(),result=f.press({defaultPrevented:true});
 assert.deepEqual(result,{prevented:0,focus:false,collapsed:true});
});
test('unclaimed Ctrl+K opens the collapsed library and focuses search',()=>{
 const f=fixture();assert.deepEqual(f.press(),{prevented:1,focus:true,collapsed:false});
});
test('unclaimed Cmd+K also opens search',()=>{
 const f=fixture();assert.deepEqual(f.press({ctrlKey:false,metaKey:true}),{prevented:1,focus:true,collapsed:false});
});
test('Ctrl+K in an editor text field leaves typing focus unchanged',()=>{
 const f=fixture(),editor={tagName:'TEXTAREA'};f.doc.activeElement=editor;
 assert.deepEqual(f.press(),{prevented:0,focus:false,collapsed:true});assert.equal(f.doc.activeElement,editor);
});
test('modal prevents shortcut and keeps collapsed state',()=>{
 const f=fixture();f.modal.hidden=false;
 assert.deepEqual(f.press(),{prevented:0,focus:false,collapsed:true});
});
test('Alt+Ctrl+K is not intercepted',()=>{
 const f=fixture();assert.deepEqual(f.press({altKey:true}),{prevented:0,focus:false,collapsed:true});
});
test('Escape clears query with a filter event without modifying circuits',()=>{
 const f=fixture();f.press();f.input.value='motor';let prevented=0,stopped=0;
 f.inputListeners.keydown({key:'Escape',preventDefault(){prevented++},stopPropagation(){stopped++}});
 assert.equal(f.input.value,'');assert.equal(f.input.dispatched,true);
 assert.equal(prevented,1);assert.equal(stopped,1);
});
