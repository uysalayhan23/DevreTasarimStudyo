'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');

test('SC048 TX11 virtual 4–20 mA has a closed 250 ohm receiver at every load',()=>{
 const L=QA.curriculum(),defs=QA.catalog();
 const lesson=L.byId['sensor-analog-apps-outline-048'];
 assert.ok(lesson);
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(lesson.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.manufacturerCalibrationVerified,false);
 const p=lesson.project;
 const load=p.components.find(c=>c.id==='rout');
 assert.equal(load?.typeId,'resistor');
 assert.equal(load.resistance,250);
 assert.equal(p.components.length,4);
 assert.equal(p.wires.length,8);
 assert.equal(lesson.steps.length,8);
 const edge=(a,ap,b,bp)=>p.wires.some(w=>
  w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 assert.ok(edge('tx','I','rout','1'));
 assert.ok(edge('rout','2','tx','G'));
 assert.deepEqual(Array.from(lesson.pedagogyReview.componentIds),
  Array.from(p.components,c=>c.typeId));
 for(const [weight,expected] of [[0,4],[500,12],[1000,20]]){
  const stateProject=structuredClone(p);
  stateProject.components.find(c=>c.id==='lc').loadWeight=weight;
  const solved=Native.solve(stateProject,defs,{now:1000});
  assert.ok(solved.stable&&!solved.blocked&&!solved.shortCircuit&&!solved.oscillating);
  const tx=stateProject.components.find(c=>c.id==='tx')._instrument;
  assert.equal(tx?.on,true);
  assert.equal(tx.output?.unit,'mA');
  assert.ok(Math.abs(tx.output.value-expected)<1e-6,
   'TX11 '+weight+' -> '+expected+'mA');
  assert.ok(!tx.loadWarning,'TX11 open loop at '+weight);
 }
});
