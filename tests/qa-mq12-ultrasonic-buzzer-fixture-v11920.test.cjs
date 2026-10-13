'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {run}=require('../scripts/qa-mq12-ultrasonic-buzzer-fixture-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),before=JSON.stringify(L.lessons);
const r=run({L,defs});
test('ultrasonic buzzer original is a lamp with X1/X2 terminals, not an approved buzzer',()=>{
 assert.equal(r.canonicalSensorType,'proximity');assert.equal(r.canonicalLoadType,'lamp-green');
 assert.deepEqual(r.originalLoadPins,['X1','X2']);assert.deepEqual(r.fixtureLoadPins,['1','2']);
});
test('NO sensor and correctly remapped buzzer are OFF ON OFF, stable',()=>{
 const x=r.results.find(v=>v.sensorType==='ultrasonic-switch'&&v.wireMapping);
 assert.deepEqual(x.observedBuzzer,[false,true,false]);assert.deepEqual(x.observedRelay,[false,true,false]);
 assert.ok(x.stable);assert.ok(x.phases.every(p=>p.stable));
});
test('NC ultrasonic candidate demonstrates inverted buzzer actuation, not equivalent',()=>{
 const x=r.results.find(v=>v.sensorType==='sensor-ultrasonic-nc'&&v.wireMapping);
 assert.deepEqual(x.observedBuzzer,[true,false,true]);assert.ok(x.stable);
});
test('replacing lamp with buzzer but forgetting X1/X2 -> 1/2 leaves buzzer silent',()=>{
 const x=r.results.find(v=>v.sensorType==='ultrasonic-switch'&&!v.wireMapping);
 assert.deepEqual(x.observedBuzzer,[false,false,false]);
 assert.deepEqual(x.observedRelay,[false,true,false]);assert.ok(x.stable);
});
test('synthetic target and unverified manufacturer/rating stay REVIEW, canonical graph immutable',()=>{
 assert.equal(r.exactUltrasonicManufacturerModelVerified,false);
 assert.equal(r.buzzerElectricalRatingVerified,false);
 assert.equal(r.syntheticPhysicalTargetOnly,true);
 assert.equal(r.physicalAccepted,false);assert.equal(r.fullAcceptance,'REVIEW');
 assert.ok(r.results.every(x=>x.physicalAccepted===false));
 assert.equal(r.canonicalUnchanged,true);assert.equal(JSON.stringify(L.lessons),before);
 assert.equal(L.lessons.filter(x=>x.project?.wires?.length).length,722);
});
