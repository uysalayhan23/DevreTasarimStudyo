'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
test('SC53 Colpitts is a reference card, not a simulated oscillator',()=>{
 const l=QA.curriculum().byId['oscillator-filter-apps-src-01'];
 assert.match(l.title,/Colpitts/i);
 assert.equal(l.kind,'quiz');
 assert.equal(l.project.wires.length,0);
 for(const type of ['reactor','capacitor'])assert.ok(l.project.components.some(c=>c.typeId===type));
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});
