'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
function fixture(){
 const doc={activeElement:null};
 const make=(id,opts={})=>({id,tabIndex:0,disabled:!!opts.disabled,hidden:!!opts.hidden,
  dataset:opts.dataset||{},getAttribute:()=>null,focus(){doc.activeElement=this;}});
 const first=make('first'),middle=make('middle'),last=make('last');
 const controls=[first,middle,last];
 const dialog={tabIndex:-1,focus(){doc.activeElement=this;},
  querySelectorAll:()=>controls,contains:el=>controls.includes(el)||el===dialog};
 const event=(shiftKey=false,key='Tab')=>({key,shiftKey,prevented:false,preventDefault(){this.prevented=true;}});
 return {doc,make,first,middle,last,controls,dialog,event};
}
test('focus identity survives a rerender and distinguishes rung controls',()=>{
 const a={dataset:{field:'contact-ref',r:'0',p:'1',c:'2'}};
 const b={dataset:{field:'contact-ref',r:'0',p:'1',c:'2'}};
 const c={dataset:{field:'contact-ref',r:'0',p:'0',c:'2'}};
 assert.equal(E.focusKey(a),E.focusKey(b));assert.notEqual(E.focusKey(a),E.focusKey(c));
 assert.equal(E.focusKey({id:'dtsLadderTarget'}),'id:dtsLadderTarget');
});
test('Tab wraps from last control to first',()=>{
 const f=fixture();f.last.focus();const e=f.event();
 assert.equal(E.trapModalTab(e,f.dialog,f.doc),true);assert.equal(e.prevented,true);assert.equal(f.doc.activeElement,f.first);
});
test('Shift+Tab wraps from first control to last',()=>{
 const f=fixture();f.first.focus();const e=f.event(true);
 assert.equal(E.trapModalTab(e,f.dialog,f.doc),true);assert.equal(f.doc.activeElement,f.last);
});
test('ordinary Tab within dialog keeps native focus movement',()=>{
 const f=fixture();f.middle.focus();const e=f.event();
 assert.equal(E.trapModalTab(e,f.dialog,f.doc),false);assert.equal(e.prevented,false);
});
test('focus outside or on dialog is safely redirected',()=>{
 const f=fixture();f.doc.activeElement={};let e=f.event();
 assert.equal(E.trapModalTab(e,f.dialog,f.doc),true);assert.equal(f.doc.activeElement,f.first);
 f.dialog.focus();e=f.event(true);assert.equal(E.trapModalTab(e,f.dialog,f.doc),true);assert.equal(f.doc.activeElement,f.last);
});
test('disabled and hidden controls cannot become tab targets',()=>{
 const f=fixture();f.first.disabled=true;f.last.hidden=true;f.middle.focus();
 const e=f.event();assert.equal(E.trapModalTab(e,f.dialog,f.doc),true);assert.equal(f.doc.activeElement,f.middle);
});
test('empty dialog traps Tab on dialog',()=>{
 const f=fixture();f.controls.length=0;const e=f.event();
 assert.equal(E.trapModalTab(e,f.dialog,f.doc),true);assert.equal(f.doc.activeElement,f.dialog);
});
test('non-Tab keys are not intercepted',()=>{
 const f=fixture();f.last.focus();const e=f.event(false,'Escape');
 assert.equal(E.trapModalTab(e,f.dialog,f.doc),false);assert.equal(e.prevented,false);
});
