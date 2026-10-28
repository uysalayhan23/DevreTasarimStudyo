'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const UX=require('../dist/library-search-ux.js');
function fixture({overlay=false,collapsed=true,simulation=true}={}){
 const classes=new Set([...(collapsed?['library-collapsed']:[]),...(simulation?['dts-sim-focus']:[])]);
 const listeners={},inputListeners={},events=[];
 const body={classList:{contains:k=>classes.has(k),remove:k=>{classes.delete(k)},add:k=>classes.add(k)}};
 const input={dataset:{},tagName:'INPUT',value:'',addEventListener(k,fn){inputListeners[k]=fn},
  focus(){doc.activeElement=input;events.push('focus')},select(){events.push('select')},blur(){doc.activeElement=null},dispatchEvent(){}};
 const modal={hidden:true},ladder={hidden:!overlay};
 const doc={body,activeElement:null,getElementById(k){return {searchInput:input,modal,dtsLadderOverlay:ladder}[k]||null},
  addEventListener(k,fn){listeners[k]=fn}};
 assert.equal(UX.init(doc,{}),true);
 function shortcut(options={}){let prevented=false;listeners.keydown({key:'k',ctrlKey:true,metaKey:false,altKey:false,...options,
  preventDefault(){prevented=true}});return prevented}
 return {classes,doc,input,events,modal,ladder,shortcut,inputListeners};
}
test('P1-02 Ctrl+K reveals a collapsed library before focusing search',()=>{
 const f=fixture();assert.equal(f.shortcut(),true);
 assert.equal(f.classes.has('library-collapsed'),false);assert.equal(f.doc.activeElement,f.input);
});
test('P1-02 Ctrl+K never steals focus from an open Ladder dialog',()=>{
 const f=fixture({overlay:true});f.doc.activeElement={tagName:'BUTTON'};
 assert.equal(f.shortcut(),false);assert.equal(f.classes.has('library-collapsed'),true);
 assert.equal(f.doc.activeElement.tagName,'BUTTON');
});
test('P1-02 other text fields retain Ctrl+K and panel state',()=>{
 const f=fixture();f.doc.activeElement={tagName:'TEXTAREA'};
 assert.equal(f.shortcut(),false);assert.equal(f.classes.has('library-collapsed'),true);
});
test('P1-02 ordinary expanded search remains focused and existing query selected',()=>{
 const f=fixture({collapsed:false,simulation:false});f.input.value='motor';
 assert.equal(f.shortcut(),true);assert.deepEqual(f.events,['focus','select']);
});
test('P1-02 blocked dashboard does not reopen the library',()=>{
 const f=fixture();f.classes.add('dashboard-open');
 assert.equal(f.shortcut(),false);assert.equal(f.classes.has('library-collapsed'),true);
});
test('P1-02 sim-focus CSS allows expanded library at desktop and compact widths',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../dist/studio.css'),'utf8');
 assert.match(css,/body\.dts-sim-focus:not\(\.dts-full-mode\):not\(\.library-collapsed\) \.app-shell\{grid-template-columns:292px/);
 assert.match(css,/@media\(max-width:600px\)\{\s*body\.dts-sim-focus:not\(\.dts-full-mode\):not\(\.library-collapsed\)/);
});
