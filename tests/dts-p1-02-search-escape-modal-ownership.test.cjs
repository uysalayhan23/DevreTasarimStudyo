'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const UX=require('../dist/library-search-ux.js');
function fixture(value='motor'){
 const handlers={},inputHandlers={},classes=new Set(),overlays={},env={};
 let dispatches=0,blurs=0,focuses=0;
 const input={tagName:'INPUT',dataset:{},value,addEventListener(type,fn){inputHandlers[type]=fn},focus(){focuses++;doc.activeElement=input},select(){},blur(){blurs++;doc.activeElement=null},dispatchEvent(e){assert.equal(e.type,'input');dispatches++}};
 const doc={activeElement:input,body:{classList:{contains:k=>classes.has(k),remove:k=>classes.delete(k)}},defaultView:{Event:class{constructor(type){this.type=type}}},getElementById:id=>id==='searchInput'?input:overlays[id]??null,addEventListener(type,fn){handlers[type]=fn}};
 assert.equal(UX.init(doc,env),true);
 function key(options={}){let prevented=0,stopped=0;inputHandlers.keydown({key:'Escape',defaultPrevented:false,preventDefault(){prevented++},stopPropagation(){stopped++},...options});return {prevented,stopped}}
 return {input,doc,env,classes,overlays,key,handlers,get dispatches(){return dispatches},get blurs(){return blurs},get focuses(){return focuses}};
}
for(const id of ['modal','arduinoIdeModal','hc05GuideModal','safetyModal','dtsLadderOverlay','dtsTerminalDraftOverlay']){
 test(`P1-02 ${id} owns Escape even if search retained focus`,()=>{const f=fixture();f.overlays[id]={hidden:false};assert.deepEqual(f.key(),{prevented:0,stopped:0});assert.equal(f.input.value,'motor');assert.equal(f.dispatches,0);assert.equal(f.blurs,0)});
}
test('P1-02 dashboard owns Escape while search retains focus',()=>{const f=fixture();f.classes.add('dashboard-open');assert.deepEqual(f.key(),{prevented:0,stopped:0});assert.equal(f.input.value,'motor')});
test('P1-02 studio safety owns Escape while search retains focus',()=>{const f=fixture();f.env.DTSStudio={safety:{visible:true}};assert.deepEqual(f.key(),{prevented:0,stopped:0});assert.equal(f.input.value,'motor')});
test('P1-02 ordinary Escape clears query',()=>{const f=fixture();assert.deepEqual(f.key(),{prevented:1,stopped:1});assert.equal(f.input.value,'');assert.equal(f.dispatches,1)});
test('P1-02 empty query Escape blurs',()=>{const f=fixture('');assert.deepEqual(f.key(),{prevented:1,stopped:1});assert.equal(f.blurs,1)});
test('P1-02 consumed Escape remains untouched',()=>{const f=fixture();assert.deepEqual(f.key({defaultPrevented:true}),{prevented:0,stopped:0});assert.equal(f.input.value,'motor')});
test('P1-02 Ctrl+K blocked while modal visible',()=>{const f=fixture();f.overlays.modal={hidden:false};let prevented=0;f.handlers.keydown({key:'k',ctrlKey:true,preventDefault(){prevented++}});assert.equal(prevented,0);assert.equal(f.focuses,0)});
test('P1-02 Ctrl+K allowed in normal workspace',()=>{const f=fixture();f.doc.activeElement={tagName:'BUTTON'};let prevented=0;f.handlers.keydown({key:'k',ctrlKey:true,preventDefault(){prevented++}});assert.equal(prevented,1);assert.equal(f.focuses,1)});
