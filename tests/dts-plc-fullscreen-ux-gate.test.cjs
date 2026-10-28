'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const L=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const Modes=require('../dist/workspace-modes.js');
const dir=path.resolve(__dirname,'../dist');
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',label:'L+',signalType:'POWER'},{id:'X10:2',label:'M',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
const byId={[d.id]:d,other:{...d,id:'other'},visual:{visualOnly:true}};
const plc={id:'P1',typeId:d.id};
const project=components=>({components});
const valid={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
test('verified CPU 1211C without Ladder is permitted in idle virtual simulation',()=>{
 const gate=PLC.simulationGate(project([plc]),byId);
 assert.equal(gate.blocked,false);assert.equal(gate.standby,true);
});
test('unprogrammed verified PLC never generates an implicit Q output',()=>{
 const net={voltage:()=>24},c={...plc};
 const state=PLC.evaluate(c,d,net,0);
 assert.equal(state.powered,true);assert.equal(state.program,'dts-ladder-idle');
 assert.ok(Object.values(state.outputs).every(v=>v===false));
 assert.deepEqual(c._dtsLadderTraces,[]);
});
test('saved native Ladder still computes virtual Q output',()=>{
 const c={...plc,plcProgram:'dts-ladder-v1',ladderProgram:valid};
 assert.equal(PLC.simulationGate(project([c]),byId).blocked,false);
 const state=PLC.evaluate(c,d,{voltage:()=>24},0);
 assert.equal(state.program,'dts-ladder-v1');assert.equal(state.outputs['X12:3'],true);
});
test('unsupported PLC, invalid Ladder and unverified modes stay guarded',()=>{
 const cases=[
  [{id:'P2',typeId:'other'}],
  [{id:'P2',typeId:'visual'}],
  [{...plc,plcProgram:'mirror'}],
  [{...plc,plcProgram:'dts-ladder-v1',ladderProgram:{version:1,rungs:[]}}]
 ];
 for(const components of cases)assert.equal(PLC.simulationGate(project(components),byId).blocked,true);
});
test('full-screen opens material library and restores previous preference',()=>{
 const classes=new Set(),button={setAttribute(){},addEventListener(){}};
 const sim={disabled:false,classList:{contains:()=>false}};
 const doc={body:{classList:{
  toggle:(n,v)=>v?classes.add(n):classes.delete(n),contains:n=>classes.has(n)
 }},getElementById:id=>id==='dtsFullModeBtn'?button:id==='simulateBtn'?sim:null,
 addEventListener(){},documentElement:{}};
 const win={MutationObserver:null,DTSStudio:{}};
 const preference={libraryCollapsed:true,propertiesVisible:true};
 const mode=Modes.create(doc,win,{getState:()=>({...preference}),
  setState:s=>Object.assign(preference,s)});
 mode.setFull(true);
 assert.equal(preference.libraryCollapsed,false);assert.equal(preference.propertiesVisible,false);
 mode.setFull(false);
 assert.deepEqual(preference,{libraryCollapsed:true,propertiesVisible:true});
 mode.setRunning(true);assert.equal(preference.libraryCollapsed,true);
 mode.setFull(true);assert.equal(preference.libraryCollapsed,false);
 mode.setFull(false);mode.setRunning(false);
 assert.deepEqual(preference,{libraryCollapsed:true,propertiesVisible:true});
});
test('HTML and CSS retain material library, dark button text and revised offline assets',()=>{
 const css=fs.readFileSync(path.join(dir,'studio.css'),'utf8');
 const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 assert.match(css,/body\.dts-full-mode \.library-panel\{display:flex!important/);
 assert.match(css,/-webkit-text-fill-color:#242c35!important/);
 assert.doesNotMatch(html,/PLC bulunan projede simülasyon kapalıdır/);
 for(const asset of ['verified-idle1','plc-gate1','full-library1','plc-full-library1'])
  assert.ok(html.includes(asset),asset);
});
test('app simulation button uses validated gate rather than blanket PLC lock',()=>{
 const source=fs.readFileSync(path.join(dir,'app.js'),'utf8');
 assert.ok(source.includes('window.DTSPLCRuntime?.simulationGate?.(project,byId)'));
 assert.ok(source.includes('els.simulate.disabled=gate.blocked'));
 assert.ok(!source.includes('els.simulate.disabled=hasPLC'));
});
