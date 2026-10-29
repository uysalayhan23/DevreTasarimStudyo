'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(){
 const listeners={},classes=new Set(['library-collapsed']);
 const input={dataset:{},tagName:'INPUT',value:'motor',addEventListener(){},
  focus(){doc.activeElement=input},select(){input.selected=true}};
 const doc={activeElement:null,body:{classList:{contains:n=>classes.has(n),remove:n=>classes.delete(n)}},
  getElementById:n=>n==='searchInput'?input:n==='modal'?{hidden:true}:null,
  addEventListener:(name,handler)=>listeners[name]=handler};
 assert.equal(UX.init(doc,{DTSStudio:{}}),true);
 return {classes,doc,input,key(opts){let prevented=false;listeners.keydown({
  key:'k',ctrlKey:true,metaKey:false,altKey:false,...opts,
  preventDefault(){prevented=true}});return prevented}};
}
test('P1-02 Ctrl+K during IME composition does not steal focus',()=>{
 const f=fixture();
 assert.equal(f.key({isComposing:true}),false);assert.equal(f.doc.activeElement,null);
 assert.equal(f.classes.has('library-collapsed'),true);
});
test('P1-02 legacy composition keyCode 229 also retains the editing context',()=>{
 const f=fixture();assert.equal(f.key({keyCode:229}),false);
 assert.equal(f.classes.has('library-collapsed'),true);
});
test('P1-02 Ctrl+Shift+K is not intercepted by library search',()=>{
 const f=fixture();assert.equal(f.key({shiftKey:true}),false);
 assert.equal(f.doc.activeElement,null);
});
test('P1-02 unmodified Ctrl+K still expands library and selects existing query',()=>{
 const f=fixture();assert.equal(f.key({}),true);
 assert.equal(f.classes.has('library-collapsed'),false);
 assert.equal(f.doc.activeElement,f.input);assert.equal(f.input.selected,true);
});
