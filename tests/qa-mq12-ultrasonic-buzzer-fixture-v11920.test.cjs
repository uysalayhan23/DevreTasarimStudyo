'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {run}=require('../scripts/qa-mq12-ultrasonic-buzzer-fixture-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),before=JSON.stringify(L.lessons);
const r=run({L,defs});
test('canonical ultrasonic and buzzer are electrically terminal-matched but not physically accepted',()=>{
 assert.equal(r.canonicalSensorType,'ultrasonic-switch');assert.equal(r.canonicalLoadType,'buzzer');
 assert.deepEqual(r.originalSourcePins,['BN','BU','BK','WH']);assert.deepEqual(r.originalLoadPins,['1','2']);assert.deepEqual(r.fixtureLoadPins,['1','2']);
});
test('NO ultrasonic sensor and correctly wired buzzer are OFF ON OFF, stable',()=>{
 const x=r.results.find(v=>v.sensorType==='ultrasonic-switch'&&v.wireMapping);
 assert.deepEqual(x.observedBuzzer,[false,true,false]);assert.deepEqual(x.observedRelay,[false,true,false]);
 assert.ok(x.stable);assert.ok(x.phases.every(p=>p.stable));
});
test('NC ultrasonic candidate demonstrates inverted buzzer actuation, not equivalent',()=>{
 const x=r.results.find(v=>v.sensorType==='sensor-ultrasonic-nc'&&v.wireMapping);
 assert.deepEqual(x.observedBuzzer,[true,false,true]);assert.ok(x.stable);
});
test('historical X1/X2 buzzer miswiring leaves buzzer silent with active relay',()=>{
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
