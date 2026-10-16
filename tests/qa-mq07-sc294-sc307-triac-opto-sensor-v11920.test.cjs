'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["electronic-switching-outline-051","NO_TRIAC_TRIGGER_REFERENCE_RUNTIME",["bta16-600b-triac","virtual-isolated-ac-12v","virtual-ac-triac-trigger-v1"]],["electronic-switching-outline-052","NO_TRIAC_MULTIMETER_HEALTH_MEASUREMENT",["bta16-600b-triac","unit-ut33d-plus"]],["electronic-switching-outline-053","NO_TRIAC_MULTIMETER_PIN_IDENTIFICATION",["bta16-600b-triac","unit-ut33d-plus"]],["electronic-switching-outline-054","NO_TRIAC_DC_LATCH_APPLICATION",["bta16-600b-triac","arduino-bench-supply","push-no","resistor","standard-light"]],["electronic-switching-outline-055","NO_ISOLATED_AC_TRIAC_DIMMER_RUNTIME",["virtual-isolated-ac-12v","bta16-600b-triac","virtual-ac-triac-trigger-v1","standard-light"]],["electronic-switching-outline-056","NO_OPTOCOUPLER_FAMILY_REFERENCE",["arduino-tlp521-1","moc3021-opto-triac"]],["electronic-switching-outline-057","NO_OPTOCOUPLER_ISOLATION_FUNCTION_TEST",["arduino-tlp521-1","resistor"]],["electronic-switching-outline-058","NO_OPTOCOUPLER_VARIETY_RUNTIME",["arduino-tlp521-1","moc3021-opto-triac"]],["electronic-switching-outline-059","NO_TLP521_HEALTH_PROBE_RESULT",["arduino-tlp521-1","unit-ut33d-plus"]],["electronic-switching-outline-060","NO_OPTO_TRIAC_FLASHER_RUNTIME",["moc3021-opto-triac","bta16-600b-triac","virtual-opto-flasher-timer-v1","virtual-isolated-ac-12v","standard-light"]],["sensor-analog-apps-outline-023","NO_SENSOR_TRANSDUCER_IO_EVIDENCE",null],["sensor-analog-apps-outline-024","NO_SENSOR_CHARACTERISTIC_MEASUREMENT",null],["sensor-analog-apps-outline-025","NO_SENSOR_TYPE_RUNTIME_COMPARISON",null],["electronic-component-basics-outline-023","NO_SENSOR_USAGE_DOMAIN_EVIDENCE",["proximity","photoeye","sensor-level-analog"]]];
for(const [id,issue,changedTypes] of cases)test(id+' honest triac/opto/sensor source scope',()=>{
 const l=L.byId[id],p=l?.project;
 assert.ok(l);assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);
 assert.equal(l.pedagogyReview.mq07TriacOptoScope,'SC294_SC307');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const flag of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','isolationAcceptance','acPhaseRuntimeAcceptance','optoFlasherRuntimeAcceptance','sensorIoAcceptance'])
  assert.equal(l.pedagogyReview[flag],false);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 if(changedTypes){
  assert.deepEqual(Array.from(p.components,c=>c.typeId),changedTypes);
  assert.deepEqual(Array.from(l.pedagogyReview.componentIds),changedTypes);
  assert.equal(l.materials.length,changedTypes.length);
 }
 assert.ok(l.quiz&&l.quiz.options.length>1);
});
test('SC297 DC and SC298 AC references remain distinct, no false dimmer acceptance',()=>{
 const parts=id=>L.byId[id].project.components.map(c=>c.typeId);
 assert.ok(parts('electronic-switching-outline-054').includes('arduino-bench-supply'));
 assert.ok(!parts('electronic-switching-outline-054').includes('supply-1p'));
 assert.ok(parts('electronic-switching-outline-055').includes('virtual-isolated-ac-12v'));
});
test('SC299–303 have relevant opto family rather than power-triac-only cards',()=>{
 const parts=id=>L.byId[id].project.components.map(c=>c.typeId);
 for(const n of [56,57,58,59])assert.ok(parts('electronic-switching-outline-'+n).includes('arduino-tlp521-1'));
 assert.ok(parts('electronic-switching-outline-060').includes('moc3021-opto-triac'));
 assert.ok(parts('electronic-switching-outline-060').includes('virtual-opto-flasher-timer-v1'));
});
test('1655 original quizzes, 11 sensor-specific questions and SC255 acceptance restriction remain',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='electronic-switching-outline-051');
 assert.ok(i>0);
 assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),cases.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
 const s=L.byId['electronic-switching-outline-024'];
 assert.equal(s.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(s.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(s.project.wires.length,12);
});
