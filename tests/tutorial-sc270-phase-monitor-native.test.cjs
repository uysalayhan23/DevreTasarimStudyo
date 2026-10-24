'use strict';
// SC270: native phase-monitor start, sealing and failure regression; virtual model only.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['motor-direct-power-src-16'];
const clone=v=>structuredClone(v),component=(p,id)=>p.components.find(c=>c.id===id);
function solve(p,now,expected){const r=Native.solve(p,defs,{now});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'SC270 native solution invalid at '+now+' '+(r.reason||''));
 assert.equal(!!component(p,'motor')._active,expected,'SC270 motor state at '+now);
 return r;
}
test('SC270: original catalog pin graph and review/visual locks protected',()=>{
 assert.ok(lesson&&lesson.kind==='wiring');
 const p=lesson.project;assert.equal(p.components.length,8);assert.equal(p.wires.length,18);
 assert.equal(lesson.steps.length,p.wires.length);
 assert.equal(lesson.pedagogyReview?.titleTopologyIssue,'PHASE_MONITOR_NATIVE_PENDING');
 assert.notEqual(lesson.pedagogyReview?.physicalAcceptance,true);
 for(const w of p.wires)for(const e of [w.from,w.to]){
  const c=component(p,e.c),d=defs[c?.typeId];
  assert.ok(d?.pins.some(pin=>pin.id===e.p),'unknown native pin '+e.c+'/'+e.p);
 }
});
test('SC270: START released keeps K1 seal-in; STOP resets without self restart',()=>{
 const p=clone(lesson.project);
 solve(p,1000,false);
 component(p,'start').state=true;solve(p,1100,true);
 component(p,'start').state=false;solve(p,1200,true);solve(p,1300,true);
 assert.equal(!!component(p,'coil')._active,true);
 assert.equal(component(p,'phaseMonitor')._contactStates.no,true);
 component(p,'stop').state=true;solve(p,1400,false);
 component(p,'stop').state=false;solve(p,1500,false);
 component(p,'start').state=true;solve(p,1600,true);
 component(p,'start').state=false;solve(p,1700,true);
});
test('SC270: phase loss drops K1; restoration alone cannot restart',()=>{
 const p=clone(lesson.project);
 component(p,'start').state=true;solve(p,1100,true);
 component(p,'start').state=false;solve(p,1200,true);
 const removed=p.wires.filter(w=>w.to?.c==='phaseMonitor'&&w.to?.p==='L2');
 assert.equal(removed.length,1);p.wires=p.wires.filter(w=>!removed.includes(w));
 solve(p,1300,false);
 assert.equal(component(p,'phaseMonitor')._phaseFault,'Faz eksik');
 p.wires.push(...removed);solve(p,1400,false);
 component(p,'start').state=true;solve(p,1500,true);
});
test('SC270: reversed phase monitor input prevents motor start',()=>{
 const p=clone(lesson.project);
 const phases=p.wires.filter(w=>w.to?.c==='phaseMonitor'&&['L2','L3'].includes(w.to?.p));
 assert.equal(phases.length,2);
 for(const w of phases)w.to.p=w.to.p==='L2'?'L3':'L2';
 component(p,'start').state=true;solve(p,1100,false);
 assert.equal(component(p,'phaseMonitor')._phaseFault,'Faz sırası ters');
});
