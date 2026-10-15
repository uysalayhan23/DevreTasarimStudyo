'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-16';
const lesson=L.byId[id];

test('SC16 uses the manufacturer BTA16 identity but does not claim a working AC circuit',()=>{
 assert.equal(lesson.kind,'quiz');
 assert.equal(lesson.project.referenceOnly,true);
 assert.equal(lesson.project.wires.length,0);
 const device=lesson.project.components.find(c=>c.id==='q1');
 assert.ok(device);
 assert.equal(device.typeId,'bta16-600b-triac');
 assert.equal(lesson.pedagogyReview.catalogProductId,'bta16-600b-triac');
 assert.equal(defs[device.typeId].kind,'triac');
 for(const pin of ['G','MT1','MT2'])
  assert.ok(defs[device.typeId].pins.some(p=>p.id===pin),pin);
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW_REAL_BTA16_AC_DRIVE_UNAVAILABLE');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.manufacturerCalibrationVerified,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.ok(L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'));
});
