'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
test('SC46 LM358 subtraction lesson input pot drives bounded output',()=>{
 const l=QA.curriculum().byId['opamp-apps-src-11'],defs=QA.catalog();
 assert.match(l.title,/çıkarıcı/i);
 let previous=-Infinity;
 for(const pct of [10,30,50,70,90]){
  const p=structuredClone(l.project);
  p.components.find(c=>c.id==='in').potentiometer=pct;
  const state=Simulation.solve(p,defs,{now:0});
  assert.ok(state.stable&&!state.shortCircuit&&!state.blocked);
  const reading=p.components.find(c=>c.id==='v1')._meter;
  assert.ok(Number.isFinite(reading.value)&&!reading.warning);
  assert.ok(reading.value>previous+1,'increasing input sweep at '+pct);
  previous=reading.value;
 }
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});
