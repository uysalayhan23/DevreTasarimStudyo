'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
test('SC54 Hartley oscillator is honestly classified as a reference-only lesson',()=>{
 const l=QA.curriculum().byId['oscillator-filter-apps-src-02'];
 assert.match(l.title,/Hartley/i);
 assert.equal(l.kind,'quiz');
 assert.equal(l.project.wires.length,0);
 for(const type of ['reactor','capacitor','arduino-bd139'])assert.ok(l.project.components.some(c=>c.typeId===type));
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});