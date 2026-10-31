'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(value='motor'){
 const handlers={},inputHandlers={},classes=new Set(['library-collapsed']);
 let dispatches=0,focuses=0,blurs=0;
 const input={tagName:'INPUT',dataset:{},value,
  addEventListener(type,fn){inputHandlers[type]=fn},
  focus(){focuses++;doc.activeElement=input},select(){},
  blur(){blurs++;doc.activeElement=null},
  dispatchEvent(e){assert.equal(e.type,'input');dispatches++}};
 const doc={activeElement:input,body:{classList:{contains:k=>classes.has(k),remove:k=>classes.delete(k)}},
  defaultView:{Event:class{constructor(type){this.type=type}}},
  getElementById:id=>id==='searchInput'?input:null,
  addEventListener(type,fn){handlers[type]=fn}};
 assert.equal(UX.init(doc,{}),true);
 function escape(options={}){
  let prevented=0,stopped=0;
  inputHandlers.keydown({key:'Escape',defaultPrevented:false,
   preventDefault(){prevented++},stopPropagation(){stopped++},...options});
  return {prevented,stopped};
 }
 return {input,doc,escape,handlers,classes,get dispatches(){return dispatches},get blurs(){return blurs},get focuses(){return focuses}};
}
test('P1-02 consumed Escape leaves an existing search query and focus intact',()=>{
 const f=fixture();assert.deepEqual(f.escape({defaultPrevented:true}),{prevented:0,stopped:0});
 assert.equal(f.input.value,'motor');assert.equal(f.dispatches,0);assert.equal(f.blurs,0);
 assert.equal(f.doc.activeElement,f.input);
});
test('P1-02 consumed Escape does not blur an empty search field',()=>{
 const f=fixture('');assert.deepEqual(f.escape({defaultPrevented:true}),{prevented:0,stopped:0});
 assert.equal(f.blurs,0);assert.equal(f.doc.activeElement,f.input);
});
test('P1-02 ordinary Escape clears query and emits one filter event',()=>{
 const f=fixture();assert.deepEqual(f.escape(),{prevented:1,stopped:1});
 assert.equal(f.input.value,'');assert.equal(f.dispatches,1);assert.equal(f.blurs,0);
});
test('P1-02 ordinary Escape blurs an already empty query',()=>{
 const f=fixture('');assert.deepEqual(f.escape(),{prevented:1,stopped:1});
 assert.equal(f.blurs,1);assert.equal(f.dispatches,0);
});
test('P1-02 IME Escape preserves the search value',()=>{
 const f=fixture();assert.deepEqual(f.escape({isComposing:true}),{prevented:0,stopped:0});
 assert.equal(f.input.value,'motor');assert.deepEqual(f.escape({keyCode:229}),{prevented:0,stopped:0});
 assert.equal(f.dispatches,0);
});
test('P1-02 non-Escape key leaves search untouched',()=>{
 const f=fixture();assert.deepEqual(f.escape({key:'Enter'}),{prevented:0,stopped:0});
 assert.equal(f.input.value,'motor');
});
test('P1-02 unclaimed Ctrl+K still reveals and focuses search',()=>{
 const f=fixture();f.doc.activeElement={tagName:'BUTTON'};let prevented=0;
 f.handlers.keydown({key:'k',ctrlKey:true,preventDefault(){prevented++}});
 assert.equal(prevented,1);assert.equal(f.focuses,1);assert.equal(f.classes.has('library-collapsed'),false);
});
