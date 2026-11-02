'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Modes=require('../dist/workspace-modes.js');
function fixture(){
 const classes=new Set(),events={},calls=[];let exits=0;
 const doc={fullscreenElement:null,
  body:{classList:{contains:k=>classes.has(k),toggle(k,on){if(on)classes.add(k);else classes.delete(k)}}},
  documentElement:{requestFullscreen(){return new Promise((resolve,reject)=>{calls.push({resolve(){doc.fullscreenElement=doc.documentElement;resolve()},reject(){reject(Error('old fullscreen blocked'))}})})}},
  exitFullscreen(){exits++;this.fullscreenElement=null;return Promise.resolve()},
  getElementById(id){if(id==='dtsFullModeBtn')return {addEventListener(){},setAttribute(){}};if(id==='simulateBtn')return {disabled:false,classList:{contains:()=>false}};return null},
  addEventListener(type,fn){events[type]=fn}};
 let panels={libraryCollapsed:false,propertiesVisible:true};
 const api=Modes.create(doc,{MutationObserver:null,DTSStudio:{}},{getState:()=>({...panels}),setState:v=>panels={...v}});
 return {doc,api,calls,events,exits:()=>exits,panels:()=>panels};
}
test('negative: rejection from an old fullscreen request cannot disable exit of newer session',async()=>{
 const x=fixture();
 assert.equal(x.api.toggleFull(),true);
 assert.equal(x.calls.length,1);
 assert.equal(x.api.toggleFull(),true); // User exits before first browser request settles
 assert.equal(x.api.toggleFull(),true); // Immediately reenter
 assert.equal(x.calls.length,2);
 x.calls[1].resolve();await Promise.resolve();
 assert.equal(x.doc.fullscreenElement,x.doc.documentElement);
 x.calls[0].reject();await Promise.resolve(); // late first rejection
 assert.equal(x.api.toggleFull(),true);
 assert.equal(x.exits(),1,'second native fullscreen must close despite late first rejection');
 assert.equal(x.doc.fullscreenElement,null);
 assert.equal(x.api.getState().full,false);
 assert.deepEqual(x.panels(),{libraryCollapsed:false,propertiesVisible:true});
});
test('positive: current fullscreen rejection still preserves CSS-only full page',async()=>{
 const x=fixture();x.api.toggleFull();x.calls[0].reject();await Promise.resolve();
 assert.equal(x.api.getState().full,true);assert.equal(x.exits(),0);
 x.api.toggleFull();assert.equal(x.api.getState().full,false);
});
test('positive: delayed first request completion while already out must close browser full',async()=>{
 const x=fixture();x.api.toggleFull();x.api.toggleFull();
 x.calls[0].resolve();await Promise.resolve();
 assert.equal(x.exits(),1);assert.equal(x.api.getState().full,false);
});
test('positive: newer native fullscreen exits normally',async()=>{
 const x=fixture();x.api.toggleFull();x.calls[0].resolve();await Promise.resolve();
 x.api.toggleFull();assert.equal(x.exits(),1);
});
test('negative: stale rejection must not prevent fullscreenchange from leaving CSS full',async()=>{
 const x=fixture();x.api.toggleFull();x.api.toggleFull();x.api.toggleFull();
 x.calls[1].resolve();await Promise.resolve();x.calls[0].reject();await Promise.resolve();
 x.doc.fullscreenElement=null;x.events.fullscreenchange();
 assert.equal(x.api.getState().full,false);
});
