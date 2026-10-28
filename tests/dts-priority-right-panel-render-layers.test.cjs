'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Order=require('../dist/scene-layer-order.js');
const Modes=require('../dist/workspace-modes.js');
const root=path.join(__dirname,'..','dist');
test('normal PLC and sensors are underneath all regular cables',()=>{
 const c=[{typeId:'plc'},{typeId:'sensor'},{typeId:'multi'}];
 const byId={plc:{kind:'plc'},sensor:{kind:'sensor'},multi:{kind:'multimeter'}};
 const layers=Order.split(c,byId,()=>false);
 assert.deepEqual(layers.ordinary,c.slice(0,2));assert.deepEqual(layers.measuring,c.slice(2));
});
test('meters, clamp, scope, floating probes all belong above wires',()=>{
 const kind=['multimeter','clamp-meter','oscilloscope','ammeter','voltmeter','energy-analyzer','probe'];
 const byId=Object.fromEntries(kind.map(k=>[k,{kind:k,probeColor:k==='probe'?'red':undefined}]));
 const components=kind.map(typeId=>({typeId}));
 assert.equal(Order.split(components,byId,d=>d.kind==='probe').measuring.length,components.length);
 assert.equal(Order.measurementDevice({kind:'sensor'}),false);
});
test('visual render paints devices before ordinary wires and measuring instruments last',()=>{
 const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
 const normal=source.indexOf('layers.ordinary.forEach(c=>renderComponent(c));');
 const wires=source.indexOf('project.wires.filter(w=>!w.probeLead).forEach((w,i)=>renderWire(w,i));');
 const overlay=source.indexOf('renderMeasurementOverlay();');
 assert.ok(normal>=0&&wires>normal&&overlay>wires);
 const probe=source.indexOf('for(const w of project.wires.filter(w=>w.probeLead))');
 const meter=source.indexOf('for(const c of measuring)');
 assert.ok(probe>=0&&meter>probe);
});
test('properties panel can be toggled during fullscreen and simulation; defaults restore',()=>{
 const classes=new Set(),button={setAttribute(){},addEventListener(){}};
 const sim={disabled:false,classList:{contains:()=>false}};
 const doc={body:{classList:{
  toggle:(n,v)=>v?classes.add(n):classes.delete(n),contains:n=>classes.has(n)
 }},getElementById:id=>id==='dtsFullModeBtn'?button:id==='simulateBtn'?sim:null,
 addEventListener(){},documentElement:{}};
 const state={libraryCollapsed:true,propertiesVisible:true};
 const mode=Modes.create(doc,{MutationObserver:null,DTSStudio:{}},{
  getState:()=>({...state}),setState:s=>Object.assign(state,s)});
 mode.setFull(true);
 assert.equal(state.libraryCollapsed,false);
 assert.equal(state.propertiesVisible,true);
 state.propertiesVisible=false;
 mode.setRunning(true);
 assert.equal(state.propertiesVisible,false);
 state.propertiesVisible=true;
 mode.setFull(false);
 assert.equal(state.propertiesVisible,true);
 mode.setRunning(false);
 assert.deepEqual(state,{libraryCollapsed:true,propertiesVisible:true});
});
test('right panel and cable controls retain usable CSS in all modes',()=>{
 const css=fs.readFileSync(path.join(root,'studio.css'),'utf8');
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(css,/body\.dts-full-mode \.properties-panel,body\.dts-sim-focus \.properties-panel\{display:flex!important/);
 assert.match(css,/body\.dts-full-mode #openProperties:not\(\[hidden\]\)/);
 for(const id of ['propertiesPanel','openProperties','closeProperties','wireRole','wireVoltage','wireSize'])assert.ok(html.includes('id="'+id+'"'));
 assert.ok(html.indexOf('scene-layer-order.js?rev')<html.indexOf('app.js?rev'));
});
