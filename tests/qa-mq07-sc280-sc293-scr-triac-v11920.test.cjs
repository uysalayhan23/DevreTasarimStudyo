'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const expected=[["electronic-switching-outline-038","SCR_CONSTRUCTION_REFERENCE_ONLY",null],["electronic-switching-outline-039","NO_SCR_LATCHING_RUNTIME",null],["electronic-switching-outline-040","NO_SCR_TRIGGER_METHOD_RUNTIME",["tyn612rg-scr","push-no","resistor"]],["electronic-switching-outline-041","INTRO_SWITCHING_FAMILY_REFERENCE_ONLY",["bd139-npn","tyn612rg-scr","bta16-600b-triac"]],["electronic-component-basics-outline-022","SAFETY_SIGNS_VISUAL_NOT_VERIFIED",null],["electronic-switching-outline-042","NO_SCR_COMMUTATION_STOP_RUNTIME",["tyn612rg-scr","push-nc","standard-light"]],["electronic-switching-outline-043","NO_SCR_AKG_IDENTIFICATION_TEST",["tyn612rg-scr","unit-ut33d-plus"]],["electronic-switching-outline-044","NO_SCR_DC_LATCH_PRACTICE",["tyn612rg-scr","arduino-bench-supply","push-no","resistor","standard-light"]],["electronic-switching-outline-045","NO_SCR_STOP_AND_RETRIGGER_PRACTICE",["tyn612rg-scr","push-nc","standard-light"]],["electronic-switching-outline-046","NO_ISOLATED_AC_SCR_TRIGGER_RUNTIME",["virtual-isolated-ac-12v","tyn612rg-scr","virtual-ac-scr-trigger-v1","standard-light"]],["electronic-switching-outline-047","NO_TRIAC_SWITCHING_RUNTIME",null],["electronic-switching-outline-048","NO_DIAC_BREAKOVER_MEASUREMENT",null],["electronic-switching-outline-049","NO_TRIAC_PACKAGE_PIN_VALIDATION",null],["electronic-switching-outline-050","NO_TRIAC_BIDIRECTIONAL_RUNTIME",null]];
for(const [id,issue,corrected] of expected)test(id+' source-only SCR/triac lock',()=>{
 const l=L.byId[id],p=l?.project;assert.ok(l,id);
 assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);
 assert.equal(l.pedagogyReview.mq07ScrTriacScope,'SC280_SC293');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const flag of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','scrLatchAcceptance','triacAcRuntimeAcceptance','manufacturerPinAcceptance'])
  assert.equal(l.pedagogyReview[flag],false,flag);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId+' missing catalog');
 if(corrected)assert.deepEqual(Array.from(p.components,c=>c.typeId),corrected);
 assert.ok(l.quiz&&Array.isArray(l.quiz.options)&&l.quiz.options.length>1);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
});
test('SC289 isolated AC source replaces old DC source without fake live wires',()=>{
 const l=L.byId['electronic-switching-outline-046'];
 assert.deepEqual(Array.from(l.project.components,c=>c.typeId),
 ['virtual-isolated-ac-12v','tyn612rg-scr','virtual-ac-scr-trigger-v1','standard-light']);
 assert.equal(l.project.wires.length,0);
});
test('SC283 switching lesson covers BJT, SCR and triac families',()=>{
 const l=L.byId['electronic-switching-outline-041'];
 assert.deepEqual(Array.from(l.project.components,c=>c.typeId),['bd139-npn','tyn612rg-scr','bta16-600b-triac']);
});
test('1655 original quiz lessons and locked SC255 native acceptance remain',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='electronic-switching-outline-038');
 assert.ok(i>=0);assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),expected.map(x=>x[0]));
 const sc255=L.byId['electronic-switching-outline-024'];
 assert.equal(sc255.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(sc255.pedagogyReview.titleTopologyStatus,'REVIEW');
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
});
