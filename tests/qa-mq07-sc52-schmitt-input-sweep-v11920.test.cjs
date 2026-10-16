'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
test('SC52 Schmitt threshold source DC sweep switches output, no hysteresis acceptance',()=>{
 const l=QA.curriculum().byId['opamp-apps-src-17'],defs=QA.catalog();
 assert.match(l.title,/schmitt/i);
 const values=[];
 for(const pct of [0,10,25,50,75,90,100]){
  const p=structuredClone(l.project);
  p.components.find(c=>c.id==='in').potentiometer=pct;
  const state=Simulation.solve(p,defs,{now:0});
  assert.ok(state.stable&&!state.blocked&&!state.shortCircuit);
  const meter=p.components.find(c=>c.id==='v1')._meter;
  assert.ok(Number.isFinite(meter.value)&&!meter.warning);
  values.push(meter.value);
 }
 for(const v of values.slice(0,3))assert.ok(v>20&&v<24);
 for(const v of values.slice(3))assert.ok(v>=0&&v<1);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});