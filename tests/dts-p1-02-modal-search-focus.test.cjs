'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(open=null){
 const listeners={},classes=new Set(['library-collapsed']);
 let focusCount=0,preventCount=0;
 const input={dataset:{},tagName:'INPUT',value:'',addEventListener(){},focus(){focusCount++;doc.activeElement=input},select(){}};
 const overlays=Object.fromEntries(['modal','dtsLadderOverlay','dtsTerminalDraftOverlay','arduinoIdeModal','hc05GuideModal','safetyModal'].map(k=>[k,{hidden:k!==open}]));
 const doc={body:{classList:{contains:k=>classes.has(k),remove:k=>classes.delete(k)}},activeElement:{tagName:'BUTTON'},
  getElementById:k=>k==='searchInput'?input:overlays[k]||null,addEventListener:(k,fn)=>listeners[k]=fn};
 assert.equal(UX.init(doc,{}),true);
 const shortcut=extra=>listeners.keydown({key:'k',ctrlKey:true,metaKey:false,altKey:false,shiftKey:false,defaultPrevented:false,
  preventDefault(){preventCount++},...extra});
 return {shortcut,doc,input,classes,focus:()=>focusCount,prevented:()=>preventCount};
}
for(const id of ['arduinoIdeModal','hc05GuideModal','safetyModal','modal','dtsLadderOverlay','dtsTerminalDraftOverlay']){
 test('P1-02 Ctrl+K cannot steal focus from '+id,()=>{
  const f=fixture(id);f.shortcut();assert.equal(f.focus(),0);assert.equal(f.prevented(),0);
  assert.equal(f.doc.activeElement.tagName,'BUTTON');assert.equal(f.classes.has('library-collapsed'),true);
 });
}
test('P1-02 Ctrl+K still opens search outside overlays',()=>{
 const f=fixture();f.shortcut();assert.equal(f.focus(),1);assert.equal(f.prevented(),1);
 assert.equal(f.classes.has('library-collapsed'),false);
});
test('P1-02 Cmd+K also opens search outside overlays',()=>{
 const f=fixture();f.shortcut({ctrlKey:false,metaKey:true});assert.equal(f.focus(),1);
});
test('P1-02 shortcut does not steal text editor focus',()=>{
 const f=fixture();f.doc.activeElement={tagName:'TEXTAREA'};f.shortcut();assert.equal(f.focus(),0);
});
test('P1-02 modified shortcut does not steal focus',()=>{
 const f=fixture();f.shortcut({shiftKey:true});assert.equal(f.focus(),0);
});
