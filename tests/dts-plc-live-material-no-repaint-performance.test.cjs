'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Front=require('../dist/plc-front.js');
const Materials=require('../dist/materials.js');
const Symbols=require('../dist/symbols.js');
const oldWindow=global.window;global.window=global;
require('../dist/library.js');
const byId=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));
global.window=oldWindow;
const d=byId['plc-hw-6es7211-1ae40-0xb0'];
function cpu(){return {id:'cpu1',typeId:d.id,ref:'CPU1',rotation:0,_active:true,
  _plcRuntime:{powered:true,inputs:{'X10:7':false,'X10:8':false},outputs:{'X12:3':false,'X12:4':false}}};}
function material(c){const html=Front.markup(d,c);const stored=html.match(/data-material="([^"]+)"/)?.[1],key=html.match(/data-plc-live-state="([^"]+)"/)?.[1];assert.ok(stored);assert.ok(key);return {html,node:{dataset:{material:stored,plcLiveState:key}}};}
test('canonical hardware and unchanged solver catalog are retained',()=>{
 assert.equal(global.COMPONENT_LIBRARY.length,703);
 assert.equal(d.io.DI,6);assert.equal(d.io.DO,4);assert.equal(d.plcFront.family,'siemens-s71200');
});
test('reproduces mismatch: native PLC front material is not the generic asset family',()=>{
 const c=cpu(),m=material(c);
 assert.equal(Materials.family(d,c),'plc-cpu');assert.equal(m.node.dataset.material,'plc-front-'+d.part);
 assert.notEqual(Materials.family(d,c),m.node.dataset.material);
});
test('material markup uses state signature and retains original live terminal data',()=>{
 const c=cpu(),m=material(c);assert.equal(m.node.dataset.plcLiveState,Front.liveStateKey(d,c));
 c._plcRuntime.inputs['X10:7']=true;c._plcRuntime.outputs['X12:3']=true;
 const updated=Front.markup(d,c);
 assert.notEqual(updated,m.html);assert.match(updated,/data-plc-live-state="[01]+"/);
 assert.match(updated, /data-plc-terminal="X10:7"[^>]*data-plc-live="1"/);
 assert.match(updated, /data-plc-terminal="X12:3"[^>]*data-plc-live="1"/);
});
test('steady simulated PLC: 1000 repaints skipped, preserving the same SVG',()=>{
 const c=cpu(),m=material(c);let repaints=0;
 for(let i=0;i<1000;i++)assert.equal(Front.reuseLiveMaterial(m.node,d,c,()=>{repaints++;return m.node}),true);
 assert.equal(repaints,0);
});
test('input change repaints exactly once, subsequent identical scans are cached',()=>{
 const c=cpu(),m=material(c);let repaints=0;
 c._plcRuntime.inputs['X10:7']=true;
 const redraw=()=>{repaints++;m.node={dataset:{material:'plc-front-'+d.part}};return m.node};
 assert.equal(Front.reuseLiveMaterial(m.node,d,c,redraw),true);
 assert.equal(repaints,1);assert.equal(m.node.dataset.plcLiveState,Front.liveStateKey(d,c));
 assert.equal(Front.reuseLiveMaterial(m.node,d,c,redraw),true);assert.equal(repaints,1);
});
test('output and power transitions each repaint once, without stale PLC lamps',()=>{
 const c=cpu(),m=material(c);let repaints=0;
 const redraw=()=>{repaints++;m.node={dataset:{material:'plc-front-'+d.part}};return m.node};
 c._plcRuntime.outputs['X12:3']=true;Front.reuseLiveMaterial(m.node,d,c,redraw);
 assert.equal(repaints,1);
 c._active=false;Front.reuseLiveMaterial(m.node,d,c,redraw);
 assert.equal(repaints,2);
 c._active=true;c._plcRuntime.outputs['X12:3']=false;
 Front.reuseLiveMaterial(m.node,d,c,redraw);assert.equal(repaints,3);
 Front.reuseLiveMaterial(m.node,d,c,redraw);assert.equal(repaints,3);
});
test('other devices and nonnative PLC front mismatch keep original render path',()=>{
 const c=cpu(),m=material(c);let paints=0;
 assert.equal(Front.reuseLiveMaterial({dataset:{material:'plc-front-OTHER'}},d,c,()=>{paints++}),false);
 assert.equal(Front.reuseLiveMaterial(m.node,{...d,plcFront:null},c,()=>{paints++}),false);
 assert.equal(Front.reuseLiveMaterial(null,d,c,()=>{paints++}),false);
 assert.equal(paints,0);
});
test('if refreshed layer cannot be found, the next scan retries safely',()=>{
 const c=cpu(),m=material(c);let repaints=0;
 c._plcRuntime.outputs['X12:3']=true;
 assert.equal(Front.reuseLiveMaterial(m.node,d,c,()=>{repaints++;return null}),true);
 assert.equal(Front.reuseLiveMaterial(m.node,d,c,()=>{repaints++;return null}),true);
 assert.equal(repaints,2);
});
test('native rendered geometry, pin count and hardware contract are unchanged',()=>{
 const c=cpu(),html=Symbols.markup(d,c,{mode:'material',norm:'IEC'});
 assert.equal((html.match(/class="port-group/g)||[]).length,d.pins.length);
 assert.equal((html.match(/data-plc-terminal=/g)||[]).length,d.materialPins.length);
 assert.match(html,/X10:1/);assert.match(html,/X12:3/);
});
test('steady scans are faster than previously unconditional PLC SVG generation',()=>{
 const c=cpu(),m=material(c),iters=500;
 // Functional performance gate: count heavy SVG rebuilds, not flaky wall clock timings.
 let heavy=0;for(let i=0;i<iters;i++)Front.reuseLiveMaterial(m.node,d,c,()=>{heavy++;Materials.markup(d,c);return m.node});
 assert.equal(heavy,0);
 assert.ok(Materials.markup(d,c).length>10000);
});
test('Omron PLC front also reuses unchanged SVG and refreshes on power transition',()=>{
 const model=byId['plc-hw-cp2e-n14dr-a'];
 assert.equal(model.plcFront.family,'omron-cp');
 const c={id:'omron1',typeId:model.id,ref:'CPU1',_active:false,_plcRuntime:{inputs:{},outputs:{}}};
 const html=Front.markup(model,c);
 const key=html.match(/data-plc-live-state="([^"]+)"/)?.[1];
 const node={dataset:{material:'plc-front-'+model.part,plcLiveState:key}};
 let repaints=0;
 Front.reuseLiveMaterial(node,model,c,()=>{repaints++;return node});assert.equal(repaints,0);
 c._active=true;
 Front.reuseLiveMaterial(node,model,c,()=>{repaints++;return node});
 assert.equal(repaints,1);
 assert.notEqual(Front.markup(model,c),html);
});
test('output signal order follows canonical material pins for Siemens CPU',()=>{
 const c=cpu();const key1=Front.liveStateKey(d,c);
 c._plcRuntime.outputs['X12:4']=true;
 const key2=Front.liveStateKey(d,c);
 assert.notEqual(key1,key2);
 c._plcRuntime.outputs['X12:4']=false;
 assert.equal(Front.liveStateKey(d,c),key1);
});
