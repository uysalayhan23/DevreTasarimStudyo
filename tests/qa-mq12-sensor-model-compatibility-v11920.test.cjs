'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Audit=require('../scripts/qa-mq12-sensor-model-compatibility-v11920.cjs');
const L=QA.curriculum(),D=QA.catalog(),snapshot=JSON.stringify(L.lessons),r=Audit.run({L,defs:D});
test('all eight sensor source records preserve model provenance and fail-closed physical review',()=>{
 assert.equal(r.rows.length,8);
 assert.equal(r.topicMismatchCount+r.virtualSourceAlignedCount,8);
 assert.equal(r.physicalAccepted,0);assert.equal(r.fullAcceptance,'REVIEW');
 assert.ok(r.rows.every(x=>!x.accepted&&x.candidates.length));
 assert.ok(r.rows.filter(x=>!x.sourceModelAligned).every(x=>x.placedPrinciple==='inductive'));
 assert.ok(r.rows.every(x=>x.candidates.every(c=>!c.canAutoReplace)));
 const piezo=r.rows.find(x=>x.id==='sensor-analog-apps-src-08');
 assert.equal(piezo.placedTypeId,'tutorial-piezo');
 assert.equal(piezo.sourceModelAligned,true);
 assert.ok(piezo.reviewReasons.includes('VIRTUAL_SOURCE_MODEL_PRESENT_PHYSICAL_ACCEPTANCE_PENDING'));
});
test('piezo, load cell, thermal and chemical candidates require different physical terminals or model',()=>{
 for(const id of ['sensor-analog-apps-src-08','sensor-analog-apps-outline-047','sensor-analog-apps-outline-048','sensor-analog-apps-outline-085','sensor-analog-apps-outline-105','sensor-analog-apps-outline-121','sensor-analog-apps-outline-138']){
  const row=r.rows.find(x=>x.id===id);assert.ok(row,id);
  assert.ok(row.candidates.every(x=>!x.canAutoReplace),id);
  if(row.sourceModelAligned){
   assert.ok(row.candidates.some(x=>x.typeId===row.placedTypeId&&x.connectedPinsSupported),id);
   assert.ok(row.reviewReasons.includes('VIRTUAL_SOURCE_MODEL_PRESENT_PHYSICAL_ACCEPTANCE_PENDING'),id);
  }else{
   assert.ok(row.candidates.every(x=>!x.nativeDigitalSensor&&x.connectedPinsSupported===false),id);
   assert.ok(row.reviewReasons.includes('NON_DROP_IN_TERMINAL_MAPPING'),id);
  }
 }
});
test('ultrasonic 4-pin NO-compatible switch differs from 3-pin NC output',()=>{
 const [NO,NC]=r.ultrasonicFixture;
 assert.equal(NO.typeId,'ultrasonic-switch');assert.equal(NC.typeId,'sensor-ultrasonic-nc');
 assert.ok([...NO.phases,...NC.phases].every(p=>p.stable));
 assert.deepEqual(NO.phases.map(p=>p.lampOn),[false,true,false]);
 assert.deepEqual(NC.phases.map(p=>p.lampOn),[true,false,true]);
 assert.ok(r.rows.find(x=>x.id==='sensor-analog-apps-outline-089').reviewReasons.includes('TITLE_LOAD_KIND_MISMATCH'));
 assert.ok(!r.rows.find(x=>x.id==='sensor-analog-apps-outline-089').containsBuzzer);
});
test('catalog and canonical lessons remain unchanged after synthetic test',()=>{
 assert.equal(L.lessons.length,1655);assert.equal(r.wiredLessons,730);
 assert.equal(Object.keys(D).length,949);
 assert.equal(JSON.stringify(L.lessons),snapshot);
});
