'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Modes=require('../dist/workspace-modes.js');
const ids=['modal','arduinoIdeModal','hc05GuideModal','safetyModal','dtsLadderOverlay','dtsTerminalDraftOverlay'];
function fixture(open=null){
 const classes=new Set(),events={},overlays=Object.fromEntries(ids.map(id=>[id,{hidden:id!==open}]));
 let nativeRequests=0,nativeExits=0;
 let panel={libraryCollapsed:false,propertiesVisible:true};
 const button={addEventListener(type,fn){events['button:'+type]=fn},setAttribute(){}};
 const sim={disabled:false,classList:{contains(){return false}}};
 const doc={fullscreenElement:null,
  body:{classList:{contains:id=>classes.has(id),toggle(id,enabled){if(enabled)classes.add(id);else classes.delete(id)}}},
  documentElement:{requestFullscreen(){nativeRequests++;return Promise.resolve()}},
  exitFullscreen(){nativeExits++;this.fullscreenElement=null;return Promise.resolve()},
  getElementById(id){return id==='dtsFullModeBtn'?button:id==='simulateBtn'?sim:overlays[id]||null},
  addEventListener(type,fn){events[type]=fn}};
 const api=Modes.create(doc,{DTSStudio:{safety:{visible:false}}},
  {getState:()=>({...panel}),setState:next=>{panel={...next}}});
 return {api,doc,overlays,classes,panel:()=>panel,nativeRequests:()=>nativeRequests,nativeExits:()=>nativeExits};
}
for(const id of ids){
 test('P1-01 cannot enter CSS/native fullscreen while '+id+' is open',()=>{
  const f=fixture(id);
  assert.equal(f.api.toggleFull(),false);
  assert.equal(f.api.getState().full,false);
  assert.equal(f.classes.has('dts-full-mode'),false);
  assert.equal(f.nativeRequests(),0);
  assert.deepEqual(f.panel(),{libraryCollapsed:false,propertiesVisible:true});
 });
 test('P1-01 can always exit fullscreen if '+id+' opens later',()=>{
  const f=fixture();assert.equal(f.api.toggleFull(),true);
  f.overlays[id].hidden=false;
  assert.equal(f.api.toggleFull(),true);
  assert.equal(f.api.getState().full,false);
  assert.deepEqual(f.panel(),{libraryCollapsed:false,propertiesVisible:true});
 });
}
test('P1-01 normal fullscreen entry remains available with all dialogs hidden',()=>{
 const f=fixture();assert.equal(f.api.toggleFull(),true);
 assert.equal(f.nativeRequests(),1);
 assert.equal(f.api.getState().full,true);
 assert.equal(f.classes.has('dts-full-mode'),true);
});
test('P1-01 dashboard still blocks fullscreen entry',()=>{
 const f=fixture();f.classes.add('dashboard-open');
 assert.equal(f.api.toggleFull(),false);assert.equal(f.nativeRequests(),0);
});
test('P1-01 simulation panel preferences remain unchanged by blocked entry',()=>{
 const f=fixture('dtsLadderOverlay');f.api.setRunning(true);
 assert.deepEqual(f.panel(),{libraryCollapsed:true,propertiesVisible:true});
 assert.equal(f.api.toggleFull(),false);
 assert.deepEqual(f.panel(),{libraryCollapsed:true,propertiesVisible:true});
 f.api.setRunning(false);
 assert.deepEqual(f.panel(),{libraryCollapsed:false,propertiesVisible:true});
});
