'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-16',lesson=L.byId[id];
test('SC16 manufacturer BTA16 DC virtual teaching circuit preserves calibrated acceptance boundaries',()=>{
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.wires.length,7);
 const d=lesson.project.components.find(c=>c.id==='q1');
 assert.equal(d.typeId,'bta16-600b-triac');assert.equal(defs[d.typeId].kind,'triac');
 for(const pin of ['G','MT1','MT2'])assert.ok(defs[d.typeId].pins.some(p=>p.id===pin));
 const edges=lesson.project.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join(':'));
 for(const e of ['g1:P:sp:21','sp:22:h1:X1','h1:X2:q1:MT2','q1:MT1:g1:M'])assert.ok(edges.includes(e),e);
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW_LOW_VOLTAGE_DC_TRIAC_HOLDING');
 assert.equal(lesson.pedagogyReview.virtualDcBehavior.acBidirectionalVerified,false);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.manufacturerCalibrationVerified,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});
