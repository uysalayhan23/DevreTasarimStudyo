'use strict';
// UI-only, Node 22+ isolated tests; does not load a project or native simulator.
const {test}=require('node:test'),assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(){
 const handlers={},inputs={},events=[];
 const input={dataset:{},value:'',tagName:'INPUT',focus(){doc.activeElement=input;events.push('focus')},
   select(){events.push('select')},blur(){doc.activeElement=null;events.push('blur')},
   dispatchEvent(e){events.push(e.type);return true},
   addEventListener(type,fn){inputs[type]=fn}};
 const modal={hidden:true};
 const doc={defaultView:{Event:class{constructor(type){this.type=type}}},
  activeElement:null,body:{classList:{contains:()=>false}},
  getElementById(id){return id==='searchInput'?input:id==='modal'?modal:null},
  addEventListener(type,fn){handlers[type]=fn}};
 const env={DTSStudio:{isHome:false,safety:{visible:false}}};
 function key(type,key,options={}){let prevented=false,stopped=false;
  const event={key,ctrlKey:false,metaKey:false,altKey:false,...options,
   preventDefault(){prevented=true},stopPropagation(){stopped=true}};
  (type==='global'?handlers.keydown:inputs.keydown)(event);
  return {prevented,stopped};
 }
 return {doc,input,modal,env,key,events};
}
test('Ctrl+K focuses library search without editing circuits',()=>{
 const f=fixture();assert.equal(UX.init(f.doc,f.env),true);
 const result=f.key('global','k',{ctrlKey:true});
 assert.equal(result.prevented,true);assert.equal(f.doc.activeElement,f.input);
});
test('Cmd+K selects existing query',()=>{
 const f=fixture();UX.init(f.doc,f.env);f.input.value='kontaktör';
 f.key('global','k',{metaKey:true});assert.ok(f.events.includes('select'));
});
test('Escape clears the search and fires existing input filtering',()=>{
 const f=fixture();UX.init(f.doc,f.env);f.input.value='motor';f.doc.activeElement=f.input;
 const result=f.key('search','Escape');
 assert.equal(f.input.value,'');assert.deepEqual(f.events,['input']);
 assert.equal(result.stopped,true);
});
test('Escape on empty query exits search',()=>{
 const f=fixture();UX.init(f.doc,f.env);f.doc.activeElement=f.input;
 f.key('search','Escape');assert.equal(f.doc.activeElement,null);
});
test('home dashboard, open modal and visible safety block shortcut',()=>{
 for(const kind of ['home','modal','safety']){
  const f=fixture();UX.init(f.doc,f.env);
  if(kind==='home')f.env.DTSStudio.isHome=true;
  if(kind==='modal')f.modal.hidden=false;
  if(kind==='safety')f.env.DTSStudio.safety.visible=true;
  assert.equal(f.key('global','k',{ctrlKey:true}).prevented,false,kind);
 }
});
test('other text inputs and modifier combinations keep original behavior',()=>{
 const f=fixture();UX.init(f.doc,f.env);
 f.doc.activeElement={tagName:'TEXTAREA'};
 assert.equal(f.key('global','k',{ctrlKey:true}).prevented,false);
 f.doc.activeElement=null;
 assert.equal(f.key('global','k',{ctrlKey:true,altKey:true}).prevented,false);
});
test('initialization is idempotent',()=>{
 const f=fixture();assert.equal(UX.init(f.doc,f.env),true);
 assert.equal(UX.init(f.doc,f.env),false);
});
