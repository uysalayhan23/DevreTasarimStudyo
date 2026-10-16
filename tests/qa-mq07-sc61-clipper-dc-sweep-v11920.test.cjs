'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
test('SC61 clipping circuit DC potentiometer sweep remains stable and bounded',()=>{
 const l=QA.curriculum().byId['oscillator-filter-apps-src-09'],defs=QA.catalog();
 assert.match(l.title,/kırpıcı/i);
 const readings=[];
 for(const pct of [0,20,50,80,100]){
  const p=structuredClone(l.project);
  p.components.find(c=>c.id==='rv').potentiometer=pct;
  const state=Simulation.solve(p,defs,{now:0});
  assert.ok(state.stable&&!state.blocked&&!state.shortCircuit);
  const voltage=p.components.find(c=>c.id==='v1')._voltageValue;
  assert.ok(Number.isFinite(voltage)&&voltage>=0&&voltage<24);
  readings.push(voltage);
 }
 assert.ok(readings[0]>12&&readings[4]<.01);
 for(let i=1;i<readings.length;i++)assert.ok(readings[i]<readings[i-1]);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});