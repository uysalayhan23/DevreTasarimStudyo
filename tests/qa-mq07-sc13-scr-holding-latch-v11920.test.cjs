'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const lessons=QA.curriculum(),byId=QA.catalog(),lesson=lessons.byId['electronic-switching-src-13'];
const clone=value=>JSON.parse(JSON.stringify(value));
const c=(p,id)=>p.components.find(x=>x.id===id);
const frame=(p,trigger)=>{c(p,'sw').state=trigger;const result=Simulation.solve(p,byId,{now:1000});
 assert.equal(result.stable,true);assert.equal(result.blocked,false);assert.equal(result.shortCircuit,false);
 return {lamp:!!c(p,'h1')._active,scr:!!c(p,'q1')._thyristorOn,latched:!!c(p,'q1')._scrLatched,
  gate:Number(c(p,'q1')._scrGateVoltage),current:Number(c(p,'q1')._scrHoldingCurrentA)}};
const withoutWire=(p,a,ap,b,bp)=>p.wires=p.wires.filter(w=>!(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));

test('SC13 contains TYN612RG gate, anode and cathode with genuine 6-wire circuit',()=>{
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project,q=c(p,'q1'),d=byId[q.typeId];
 assert.equal(q.typeId,'tyn612rg-scr');
 assert.equal(q.mq07ScrHoldLesson,true);
 assert.equal(d.kind,'scr');assert.equal(p.wires.length,6);
 assert.ok(d.holdingCurrent>0,'holding threshold must be an explicit component property');
 for(const k of ['K','A','G'])assert.ok(d.pins.some(pin=>pin.id===k));
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});

test('SC13 DC SCR conducts after a short gate pulse and stays on after release',()=>{
 const p=clone(lesson.project);
 const off=frame(p,false);
 assert.equal(off.lamp,false);assert.equal(off.latched,false);
 const pulse=frame(p,true);
 assert.equal(pulse.scr,true);assert.equal(pulse.lamp,true);assert.equal(pulse.latched,true);
 assert.ok(pulse.gate>=.7);
 assert.ok(pulse.current>=byId[c(p,'q1').typeId].holdingCurrent);
 const release=frame(p,false);
 assert.equal(release.gate,0);
 assert.equal(release.lamp,true);
 assert.equal(release.scr,true);
 assert.equal(release.latched,true);
});

test('SC13 gate disconnect does not stop an already latched SCR',()=>{
 const p=clone(lesson.project);frame(p,true);frame(p,false);
 withoutWire(p,'rg','2','q1','G');
 const state=frame(p,false);
 assert.equal(state.lamp,true);assert.equal(state.latched,true);
});

test('SC13 interruption of anode/cathode power releases latch; rewiring needs new gate pulse',()=>{
 for(const [a,ap,b,bp] of [
  ['g1','P','h1','X1'],['h1','X2','q1','A'],['q1','K','g1','M']
 ]){
  const p=clone(lesson.project);frame(p,true);frame(p,false);
  const saved=clone(p.wires);
  withoutWire(p,a,ap,b,bp);
  const interrupted=frame(p,false);
  assert.equal(interrupted.lamp,false,a+'/'+ap+'→'+b+'/'+bp);
  assert.equal(interrupted.latched,false);
  p.wires=saved;
  const reconnected=frame(p,false);
  assert.equal(reconnected.lamp,false,'no auto-restart after '+a+'/'+ap);
  const triggered=frame(p,true);
  assert.equal(triggered.lamp,true);
 }
});

test('SC13 fresh gate/open-power failure and STOP reset fail closed',()=>{
 const p=clone(lesson.project);
 withoutWire(p,'rg','2','q1','G');
 assert.equal(frame(p,true).lamp,false);
 assert.equal(frame(p,true).latched,false);
 const p2=clone(lesson.project);frame(p2,true);frame(p2,false);
 Simulation.clear(p2);
 assert.equal(c(p2,'q1')._scrLatched,undefined);
 assert.equal(frame(p2,false).lamp,false);
});
