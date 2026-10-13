'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Sensor=require('../scripts/qa-mq12-sensor-polarity-v11920.cjs');
const Reactive=require('../scripts/qa-mq12-reactive-time-constants-v11920.cjs');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const curriculum=QA.curriculum(),before=JSON.stringify(curriculum.lessons);
const sensor=Sensor.run({L:curriculum}),reactive=Reactive.run({L:curriculum});
test('35 unconfigured sensors stay REVIEW with no synthetic auto-fix',()=>{
 assert.equal(sensor.sourceTotal,1655);assert.equal(sensor.missingTargetRows,35);
 assert.ok(sensor.rows.every(x=>x.missingTarget&&!x.accepted));
 assert.equal(sensor.fullAcceptance,'REVIEW');
});
test('dual-dc-2 now uses the sinking NPN product; 35 physical stimuli still await review',()=>{
 assert.deepEqual(sensor.polarityMismatch.map(x=>x.id),[]);
 assert.equal(sensor.rows.find(x=>x.id==='dual-dc-2').requiredOutput,'NPN');
 assert.equal(sensor.rows.find(x=>x.id==='dual-dc-2').declaredOutput,'NPN');
 assert.equal(sensor.rows.find(x=>x.id==='pnp-npn-1').physicalMismatch,false);
 assert.equal(sensor.rows.find(x=>x.id==='pnp-npn-2').physicalMismatch,false);
});
test('sensor title and genuine component conflicts remain flagged without replacing lesson content',()=>{
 assert.deepEqual(sensor.titlePolarityMismatch.map(x=>x.id),[]);
 assert.equal(sensor.topicMismatch.length,8);
 assert.ok(sensor.topicMismatch.some(x=>x.id==='sensor-analog-apps-outline-089'));
 assert.ok(sensor.topicMismatch.some(x=>x.id==='sensor-analog-apps-outline-085'));
});
test('four RC lessons retain capacitor voltage due to long 10 MOhm meter discharge time',()=>{
 assert.equal(reactive.capacitors,4);
 for(const x of reactive.lessons.filter(x=>x.kind==='capacitor')){
  assert.equal(x.nominalChargingOrLRTauS,1);
  assert.equal(x.highImpedanceMeterDischargeTauS,1000);
  assert.ok(x.measuredOffTauS>999&&x.measuredOffTauS<1002);
  assert.ok(x.readingAfter10s>7&&x.readingAfter10s<x.releaseReading);
  assert.equal(x.restoration,'REVIEW');
 }
});
test('three RL native cases settle by 10s; all 707 phases stable and canonicals unchanged',()=>{
 assert.equal(reactive.inductors,3);assert.equal(reactive.nativePhases,707);
 for(const x of reactive.lessons.filter(x=>x.kind==='reactor')){
  assert.equal(x.nominalChargingOrLRTauS,.02);
  assert.ok(Math.abs(x.readingAfter10s)<.1);
 }
 assert.ok(reactive.lessons.every(x=>x.canonicalUnchanged));
 assert.equal(JSON.stringify(curriculum.lessons),before);
 assert.equal(reactive.fullAcceptance,'REVIEW');
});
