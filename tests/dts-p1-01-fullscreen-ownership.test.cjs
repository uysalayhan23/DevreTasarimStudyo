'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Modes=require('../dist/workspace-modes.js');
function fixture(){
 const classes=new Set(),events={};let exits=0;
 const panel={libraryCollapsed:false,propertiesVisible:true};
 const doc={fullscreenElement:null,body:{classList:{contains:n=>classes.has(n),toggle(n,on){on?classes.add(n):classes.delete(n)}}},
 documentElement:{requestFullscreen(){return Promise.resolve()}},exitFullscreen(){exits++;this.fullscreenElement=null;return Promise.resolve()},
 getElementById(id){if(id==='dtsFullModeBtn')return{addEventListener(n,cb){events[n]=cb},setAttribute(){}};
 if(id==='simulateBtn')return{disabled:false,classList:{contains:()=>false}};return null;},addEventListener(n,cb){events[n]=cb}};
 const mode=Modes.create(doc,{MutationObserver:null,DTSStudio:{}},{getState:()=>({...panel}),setState:x=>Object.assign(panel,x)});
 return{mode,doc,panel,exits:()=>exits,events};
}
test('does not exit another element fullscreen',()=>{const x=fixture();x.mode.toggleFull();x.doc.fullscreenElement={id:'video'};x.mode.toggleFull();assert.equal(x.exits(),0)});
test('exits own document fullscreen',()=>{const x=fixture();x.mode.toggleFull();x.doc.fullscreenElement=x.doc.documentElement;x.mode.toggleFull();assert.equal(x.exits(),1)});
test('no native fullscreen means no exit',()=>{const x=fixture();x.mode.toggleFull();x.mode.toggleFull();assert.equal(x.exits(),0)});
test('restores panel snapshot',()=>{const x=fixture();x.mode.toggleFull();x.mode.toggleFull();assert.deepEqual(x.panel,{libraryCollapsed:false,propertiesVisible:true})});
test('simulation focus survives fullscreen toggle',()=>{const x=fixture();x.mode.setRunning(true);x.mode.toggleFull();x.mode.toggleFull();assert.equal(x.mode.getState().running,true);assert.equal(x.panel.libraryCollapsed,true)});
test('native fullscreenchange exits CSS full mode',()=>{const x=fixture();x.mode.toggleFull();x.events.fullscreenchange();assert.equal(x.mode.getState().full,false)});
