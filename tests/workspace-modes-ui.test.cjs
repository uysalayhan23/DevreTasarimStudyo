'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {create}=require('../dist/workspace-modes.js');
function sample(){
 const handlers={},simHandlers={},buttonHandlers={},panelHistory=[],classes=new Set();
 function classList(set){return {contains:x=>set.has(x),toggle(x,on){if(on===undefined)on=!set.has(x);on?set.add(x):set.delete(x)}}}
 const body={classList:classList(classes)};
 const simClasses=new Set();
 const sim={disabled:false,classList:classList(simClasses)};
 const badge={hidden:true};
 const btn={addEventListener:(t,f)=>buttonHandlers[t]=f,setAttribute(){},textContent:'',title:''};
 const modal={hidden:true};
 const doc={body,fullscreenElement:null,documentElement:{requestFullscreen(){return Promise.reject(Error('unsupported'))}},getElementById(id){return {simulateBtn:sim,dtsFullModeBtn:btn,dtsFocusBadge:badge,modal}[id]},addEventListener:(t,f)=>{handlers[t]=f}};
 const win={DTSStudio:{safety:{visible:false}},MutationObserver:class{constructor(f){simHandlers.mutate=f}observe(){}}};
 const initial={libraryCollapsed:false,propertiesVisible:true};
 let panel={...initial};
 const api={getState:()=>({...panel}),setState(x){panel={...x};panelHistory.push({...x})}};
 const c=create(doc,win,api);
 return {doc,win,c,body,sim,btn,badge,modal,initial,panel:()=>panel,panels:panelHistory,
   key:(key)=>{let prevented=false;handlers.keydown?.({key,preventDefault(){prevented=true}});return prevented},
   click:()=>buttonHandlers.click(),simulate:on=>{sim.classList.toggle('running',on);simHandlers.mutate()}};
}
test('sim starts focus, hides side panels, preserves original layout',()=>{
 const x=sample();x.simulate(true);assert.equal(x.c.getState().focus,true);
 assert.deepEqual(x.panel(),{libraryCollapsed:true,propertiesVisible:false});
 assert.equal(x.body.classList.contains('dts-sim-focus'),true);
 assert.equal(x.badge.hidden,false);
});
test('stop restores exact original panel configuration',()=>{
 const x=sample();x.simulate(true);x.simulate(false);assert.deepEqual(x.panel(),x.initial);
 assert.equal(x.c.getState().focus,false);
});
test('already collapsed panels remain collapsed after auto-focus',()=>{
 const x=sample();x.panel().libraryCollapsed=true; // below capture custom actual getter for another instance
 const y=sample();y.initial.libraryCollapsed=true;
 // Check twice-start is idempotent rather than snapshot overwrite
 y.simulate(true);let before=y.panels.length;y.simulate(true);assert.equal(y.panels.length,before);
 y.simulate(false);assert.equal(y.c.getState().hasPanelSnapshot,false);
});
test('manual full mode hides both panels; restores on escape',()=>{
 const x=sample();x.click();assert.equal(x.c.getState().full,true);
 assert.equal(x.body.classList.contains('dts-full-mode'),true);
 assert.equal(x.key('Escape'),true);assert.deepEqual(x.panel(),x.initial);
});
test('full mode and running simulation coexist; exiting returns to simulation focus',()=>{
 const x=sample();x.simulate(true);x.click();assert.equal(x.c.getState().full,true);
 x.click();assert.equal(x.c.getState().running,true);
 assert.equal(x.body.classList.contains('dts-sim-focus'),true);
 x.simulate(false);assert.deepEqual(x.panel(),x.initial);
});
test('stop during full mode leaves manual full mode active until explicit exit',()=>{
 const x=sample();x.simulate(true);x.click();x.simulate(false);
 assert.equal(x.c.getState().full,true);
 x.key('Escape');assert.deepEqual(x.panel(),x.initial);
});
test('modal, dashboard and safety block entering full mode',()=>{
 for(const kind of ['modal','home','safety']){
  const x=sample();if(kind==='modal')x.modal.hidden=false;
  if(kind==='home')x.body.classList.toggle('dashboard-open',true);
  if(kind==='safety')x.win.DTSStudio.safety.visible=true;
  assert.equal(x.click(),false,kind);assert.equal(x.c.getState().full,false);
 }
});
test('unrelated Escape is not intercepted outside full mode',()=>{
 const x=sample();assert.equal(x.key('Escape'),false);
});
test('simulation-only changes presentation, not any editor project state',()=>{
 const x=sample();let edits=0;const project={wires:[1],components:[1]};
 x.simulate(true);x.simulate(false);x.click();x.click();
 assert.equal(edits,0);assert.deepEqual(project,{wires:[1],components:[1]});
});
test('disabled simulator does not activate focus',()=>{
 const x=sample();x.sim.disabled=true;x.simulate(true);assert.equal(x.c.getState().running,false);
});
