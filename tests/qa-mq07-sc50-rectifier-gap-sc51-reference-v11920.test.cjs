'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
test('SC50 existing precision half-wave rectifier solver deficit is reproduced, not accepted',()=>{
 const lesson=QA.curriculum().byId['opamp-apps-src-15'],defs=QA.catalog();
 assert.equal(lesson.kind,'wiring');
 assert.ok(lesson.project.components.some(x=>x.typeId==='lm358p-dip8'));
 assert.ok(lesson.project.components.some(x=>x.typeId==='1n4148-do35'));
 for(const pct of [0,25,50,75,100]){
  const p=structuredClone(lesson.project);
  p.components.find(x=>x.id==='rv1').potentiometer=pct;
  const result=Simulation.solve(p,defs,{now:0});
  assert.ok(result.stable&&!result.blocked&&!result.shortCircuit);
  assert.equal(p.components.find(x=>x.id==='v1')._voltageValue,0,'current missing rectification at '+pct);
 }
 assert.equal(lesson.pedagogyReview.dcTransferAccepted,false);
 assert.equal(lesson.pedagogyReview.acWaveformAcceptance,false);
});
test('SC51 instrumentation amplifier stays reference-only without inventing complete topology',()=>{
 const lesson=QA.curriculum().byId['opamp-apps-src-16'];
 assert.equal(lesson.kind,'quiz');
 assert.equal(lesson.project.wires.length,0);
 assert.ok(lesson.project.components.some(x=>x.typeId==='lm358p-dip8'));
});
