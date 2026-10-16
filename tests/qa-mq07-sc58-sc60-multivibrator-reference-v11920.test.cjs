'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
for(const [num,id,term] of [['SC58','oscillator-filter-apps-src-06','tek kararlı'],['SC59','oscillator-filter-apps-src-07','çift kararlı'],['SC60','oscillator-filter-apps-src-08','kararsız']])test(num+' multivibrator reference status',()=>{
 const lesson=L.byId[id];assert.ok(lesson);assert.ok(lesson.title.toLocaleLowerCase('tr-TR').includes(term));
 assert.equal(lesson.kind,'quiz');assert.equal(lesson.project.wires.length,0);
 for(const type of ['arduino-bd139','arduino-resistor-1k','arduino-capacitor-100u']){assert.ok(lesson.project.components.some(c=>c.typeId===type));assert.ok(defs[type])}
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
