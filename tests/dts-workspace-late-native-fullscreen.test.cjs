'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Modes=require('../dist/workspace-modes.js');
function fixture(){
 const classes=new Set(),listeners={};let resolveRequest, rejectRequest,exits=0;
 const doc={fullscreenElement:null,body:{classList:{contains:n=>classes.has(n),toggle(n,on){on?classes.add(n):classes.delete(n)}}},
  documentElement:{requestFullscreen(){return new Promise((r,j)=>{resolveRequest=r;rejectRequest=j})}},
  exitFullscreen(){exits++;this.fullscreenElement=null;return Promise.resolve()},
  getElementById(id){if(id==='dtsFullModeBtn')return{addEventListener(){},setAttribute(){}};
   if(id==='simulateBtn')return{disabled:false,classList:{contains:()=>false}};return null;},
  addEventListener(n,cb){listeners[n]=cb}};
 const panel={libraryCollapsed:false,propertiesVisible:true};
 const api=Modes.create(doc,{MutationObserver:null,DTSStudio:{}},{getState:()=>({...panel}),setState:v=>Object.assign(panel,v)});
 return {doc,api,resolve:()=>resolveRequest(),reject:()=>rejectRequest(Error('blocked')),
  exits:()=>exits,panel,listeners};
}
test('late native fullscreen request is exited after user returns to standard mode',async()=>{
 const x=fixture();x.api.toggleFull();x.api.toggleFull();
 x.doc.fullscreenElement=x.doc.documentElement;x.resolve();await Promise.resolve();
 assert.equal(x.exits(),1);assert.equal(x.api.getState().full,false);
 assert.equal(x.panel.libraryCollapsed,false);
});
test('completed fullscreen request stays active while the user remains in full mode',async()=>{
 const x=fixture();x.api.toggleFull();x.doc.fullscreenElement=x.doc.documentElement;
 x.resolve();await Promise.resolve();assert.equal(x.exits(),0);assert.equal(x.api.getState().full,true);
});
test('a delayed response never exits a different element fullscreen',async()=>{
 const x=fixture();x.api.toggleFull();x.api.toggleFull();x.doc.fullscreenElement={id:'other'};
 x.resolve();await Promise.resolve();assert.equal(x.exits(),0);
});
test('browser fullscreen rejection preserves CSS-only fallback',async()=>{
 const x=fixture();x.api.toggleFull();x.reject();await Promise.resolve();
 assert.equal(x.api.getState().full,true);assert.equal(x.exits(),0);
});
