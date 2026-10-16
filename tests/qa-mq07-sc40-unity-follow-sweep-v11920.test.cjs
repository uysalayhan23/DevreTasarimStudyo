'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const lesson=QA.curriculum().byId['opamp-apps-src-05'],defs=QA.catalog();
const clone=x=>JSON.parse(JSON.stringify(x));
test('SC40 LM358 follower sweeps monotonically with bounded output',()=>{
 assert.ok(lesson,'SC40');
 const values=[];
 for(const pct of [0,20,50,80,100]){
  const p=clone(lesson.project);
  p.components.find(c=>c.id==='in').potentiometer=pct;
  const state=Simulation.solve(p,defs,{now:0});
  assert.ok(state.stable&&!state.blocked&&!state.shortCircuit,'solver '+pct);
  const meter=p.components.find(c=>c.id==='v1')._meter;
  assert.equal(meter.warning,'');assert.ok(Number.isFinite(meter.value));
  values.push(meter.value);
 }
 assert.ok(values[0]>21&&values[0]<23);
 assert.ok(values[4]>=0&&values[4]<.5);
 for(let i=1;i<values.length;i++)assert.ok(values[i]<values[i-1]-1,'decreasing at '+i);
});
