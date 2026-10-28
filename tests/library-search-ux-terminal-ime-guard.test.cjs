'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(){
 const classes=new Set(['library-collapsed']),handlers={},inputHandlers={};
 const terminal={hidden:false},modal={hidden:true},ladder={hidden:true};
 const input={dataset:{},tagName:'INPUT',value:'motor',addEventListener(k,fn){inputHandlers[k]=fn},
  focus(){doc.activeElement=input},select(){},blur(){doc.activeElement=null},
  dispatchEvent(e){input.lastEvent=e.type}};
 const doc={body:{classList:{contains:k=>classes.has(k),remove:k=>classes.delete(k)}},
  defaultView:{Event:class{constructor(type){this.type=type}}},activeElement:null,
  getElementById(k){return {searchInput:input,modal,dtsLadderOverlay:ladder,dtsTerminalDraftOverlay:terminal}[k]||null},
  addEventListener(k,fn){handlers[k]=fn}};
 assert.equal(UX.init(doc,{}),true);
 function shortcut(){let prevented=false;handlers.keydown({key:'k',ctrlKey:true,metaKey:false,altKey:false,
  preventDefault(){prevented=true}});return prevented}
 function escape(options={}){let prevented=false;inputHandlers.keydown({key:'Escape',preventDefault(){prevented=true},
  stopPropagation(){},...options});return prevented}
 return {classes,terminal,doc,input,shortcut,escape};
}
test('Ctrl+K never escapes an open terminal-design modal or expands the library',()=>{
 const f=fixture();f.doc.activeElement={tagName:'BUTTON'};
 assert.equal(f.shortcut(),false);assert.equal(f.classes.has('library-collapsed'),true);
 assert.equal(f.doc.activeElement.tagName,'BUTTON');
});
test('Ctrl+K resumes normal search when terminal-design modal closes',()=>{
 const f=fixture();f.terminal.hidden=true;
 assert.equal(f.shortcut(),true);assert.equal(f.classes.has('library-collapsed'),false);
 assert.equal(f.doc.activeElement,f.input);
});
test('Escape during IME composition keeps text and does not intercept key',()=>{
 const f=fixture();assert.equal(f.escape({isComposing:true}),false);
 assert.equal(f.input.value,'motor');assert.equal(f.input.lastEvent,undefined);
 assert.equal(f.escape({keyCode:229}),false);assert.equal(f.input.value,'motor');
});
test('ordinary Escape still clears query and notifies existing search filter',()=>{
 const f=fixture();assert.equal(f.escape(),true);
 assert.equal(f.input.value,'');assert.equal(f.input.lastEvent,'input');
});
