'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
for(const [n,id,name,parts] of [
 ['SC55','oscillator-filter-apps-src-03',/kristal osilatör/i,['hc49-4mhz-crystal','arduino-bd139','arduino-capacitor-100n']],
 ['SC56','oscillator-filter-apps-src-04',/RC faz kaymalı osilatör/i,['lm358p-dip8','resistor','capacitor']],
 ['SC57','oscillator-filter-apps-src-05',/Wien köprü osilatörü/i,['lm358p-dip8','resistor','capacitor']]
])test(n+' oscillator reference card does not claim a wired, physically tested oscillator',()=>{
 const lesson=L.byId[id];assert.ok(lesson,n);assert.match(lesson.title,name);
 assert.equal(lesson.kind,'quiz');assert.equal(lesson.project.wires.length,0);
 for(const type of parts){assert.ok(lesson.project.components.some(c=>c.typeId===type),n+' '+type);assert.ok(defs[type],type)}
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
});
