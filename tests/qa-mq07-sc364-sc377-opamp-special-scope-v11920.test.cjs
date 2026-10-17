'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["033","NO_OPAMP_ON_DELAY_STORAGE",14],["034","NO_OPAMP_OFF_DELAY_STORAGE",14],["035","NO_SUBTRACTOR_TWO_INDEPENDENT_INPUTS",14],["036","NO_SUBTRACTOR_PRACTICE_TWO_INPUTS",14],["037","NO_SUMMER_INDEPENDENT_INPUT_BRANCHES",14],["038","NO_SUMMER_PRACTICE_INPUT_BRANCHES",14],["039","DIFFERENTIATOR_NATIVE_AC_RESPONSE_PENDING",14],["040","DIFFERENTIATOR_PRACTICE_NATIVE_PENDING",14],["041","INTEGRATOR_NATIVE_RAMP_PENDING",14],["042","INTEGRATOR_PRACTICE_NATIVE_PENDING",14],["component-035","RECTIFIER_BRIDGE_REFERENCE_ONLY",0],["043","NO_PRECISION_HALF_WAVE_DIODE_PATH",14],["component-036","NO_INSTRUMENTATION_AMPLIFIER_TOPOLOGY",0],["044","SCHMITT_HYSTERESIS_SWEEP_NATIVE_PENDING",14]];

for(const [suffix,issue,wires] of rows)test('SC364–377 '+suffix+' topology and fail-closed acceptance',()=>{
 const id=suffix.startsWith('component-')?'electronic-component-basics-outline-'+suffix.slice(10):'opamp-apps-outline-'+suffix;
 const lesson=L.byId[id],p=lesson?.project;assert.ok(lesson,id);
 const expected=(['033','034','035','036','037','038','043'].includes(suffix)?0:wires);
 assert.equal(p.wires.length,expected);
 assert.equal(lesson.kind,expected?'wiring':'quiz');
 assert.equal(lesson.pedagogyReview.mq07SpecialOpampScope,'SC364_SC377');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,issue);
 for(const flag of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(lesson.pedagogyReview[flag],false);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 assert.ok(lesson.beginnerSteps.some(t=>t.includes('PASS verme')));
});
test('seven generic inverting circuits no longer claim unrelated delay/sum/subtract/rectifier function',()=>{
 for(const i of ['033','034','035','036','037','038','043']){
  const l=L.byId['opamp-apps-outline-'+i];
  assert.equal(l.project.referenceOnly,true);assert.equal(l.project.wires.length,0);
  assert.equal(l.steps.length,0);assert.ok(!l.project.components.some(c=>c.typeId==='arduino-bench-supply'));
 }
 assert.deepEqual(Array.from(L.byId['opamp-apps-outline-043'].project.components,c=>c.typeId),['lm358p-dip8','1n4007-do41','resistor']);
});
test('SC370–373 preserve actual differentiated/integrating LM358P feedback pins',()=>{
 for(const i of ['039','040']){
  const l=L.byId['opamp-apps-outline-'+i],p=l.project;
  assert.equal(p.wires.length,14);
  assert.ok(p.wires.some(w=>w.from.c==='in'&&w.from.p==='2'&&w.to.c==='c1'&&w.to.p==='1'));
  assert.ok(p.wires.some(w=>w.from.c==='c1'&&w.from.p==='2'&&w.to.c==='u1'&&w.to.p==='2'));
  assert.ok(p.wires.some(w=>w.from.c==='u1'&&w.from.p==='1'&&w.to.c==='r2'&&w.to.p==='1'));
 }
 for(const i of ['041','042']){
  const l=L.byId['opamp-apps-outline-'+i],p=l.project;
  assert.equal(p.wires.length,14);
  assert.ok(p.wires.some(w=>w.from.c==='u1'&&w.from.p==='1'&&w.to.c==='c1'&&w.to.p==='1'));
  assert.ok(p.wires.some(w=>w.from.c==='c1'&&w.from.p==='2'&&w.to.c==='u1'&&w.to.p==='2'));
 }
});
test('SC377 Schmitt positive feedback is LM358 pin 1 to pin 3, not negative pin 2',()=>{
 const l=L.byId['opamp-apps-outline-044'],p=l.project;
 assert.equal(p.wires.length,14);
 assert.ok(p.wires.some(w=>w.from.c==='u1'&&w.from.p==='1'&&w.to.c==='r2'&&w.to.p==='1'));
 assert.ok(p.wires.some(w=>w.from.c==='r2'&&w.from.p==='2'&&w.to.c==='u1'&&w.to.p==='3'));
 assert.ok(p.wires.some(w=>w.from.c==='ref1'&&w.to.c==='u1'&&w.to.p==='2'));
});
test('1655 original lessons, 11 protected sensor quizzes and SC255/331/332/338 native gates remain',()=>{
 assert.equal(L.lessons.length,1655);
 const ids=rows.map(r=>r[0].startsWith('component-')?'electronic-component-basics-outline-'+r[0].slice(10):'opamp-apps-outline-'+r[0]);
 const start=L.lessons.findIndex(x=>x.id===ids[0]);assert.ok(start>=0);
 assert.deepEqual(Array.from(L.lessons.slice(start,start+14),x=>x.id),ids);
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const l=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.ok(l.quiz);assert.equal(l.topicReview?.sourceQuestionPreserved,true);
 }
 for(const id of ['electronic-switching-outline-024','sensor-analog-apps-outline-047','sensor-analog-apps-outline-048','sensor-analog-apps-outline-052']){
  const l=L.byId[id];assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 }
});
