'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["oscillator-filter-apps-outline-031","LC_TANK_NO_OSCILLATION_RUNTIME",["arduino-bd139","reactor","capacitor"]],["oscillator-filter-apps-outline-032","CRYSTAL_DRIVE_LOAD_CAPACITOR_NOT_VERIFIED",null],["oscillator-filter-apps-outline-033","RC_OSCILLATION_FEEDBACK_NOT_WIRED",null],["oscillator-filter-apps-outline-034","MULTIVIBRATOR_MODES_NOT_DISTINGUISHED",null],["oscillator-filter-apps-outline-035","COLPITTS_CAPACITIVE_DIVIDER_NOT_WIRED",["arduino-bd139","reactor","capacitor","capacitor"]],["oscillator-filter-apps-outline-036","HARTLEY_TAPPED_INDUCTOR_NOT_VERIFIED",["arduino-bd139","reactor","reactor","capacitor"]],["oscillator-filter-apps-outline-037","CRYSTAL_OSCILLATION_NOT_WIRED",null],["oscillator-filter-apps-outline-038","RC_PHASE_SHIFT_THREE_STAGES_NOT_WIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor","resistor","capacitor"]],["oscillator-filter-apps-outline-039","WIEN_BRIDGE_GAIN_CONTROL_NOT_WIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor"]],["oscillator-filter-apps-outline-040","MONOSTABLE_TRIGGER_PULSE_RUNTIME_ABSENT",["bd139-npn","bd139-npn","resistor","capacitor"]],["oscillator-filter-apps-outline-041","BISTABLE_CROSS_COUPLED_STATES_ABSENT",["bd139-npn","bd139-npn","resistor","resistor"]],["oscillator-filter-apps-outline-042","ASTABLE_CROSS_COUPLED_RC_RUNTIME_ABSENT",["bd139-npn","bd139-npn","resistor","resistor","capacitor","capacitor"]],["electronic-component-basics-outline-038","PULSE_CIRCUITS_CONCEPT_ONLY",null],["electronic-component-basics-outline-039","CLIPPER_DIODE_PATH_NOT_WIRED",null]];
for(const [id,issue,expectedParts] of rows)test('SC378–391 '+id+' source/review acceptance',()=>{
 const l=L.byId[id],p=l?.project;assert.ok(l);
 assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);
 assert.equal(p.wires.length,0);assert.equal(l.steps.length,0);
 assert.equal(l.pedagogyReview.mq07OscillatorScope,'SC378_SC391');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const key of ['oscillationAcceptance','nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(l.pedagogyReview[key],false,key);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 if(expectedParts){
  assert.deepEqual(Array.from(p.components,c=>c.typeId),expectedParts);
  assert.deepEqual(Array.from(l.pedagogyReview.componentIds),expectedParts);
 }
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(l.quiz&&Array.isArray(l.quiz.options));
});
test('SC388–390 do not expose unchanged 8-wire instantaneous switch as multivibrator dynamics',()=>{
 for(const n of [40,41,42]){
  const id='oscillator-filter-apps-outline-'+String(n).padStart(3,'0'),l=L.byId[id];
  assert.equal(l.project.wires.length,0);
  assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 }
 assert.deepEqual(Array.from(L.byId['oscillator-filter-apps-outline-042'].project.components,c=>c.typeId),
  ['bd139-npn','bd139-npn','resistor','resistor','capacitor','capacitor']);
});
test('all 1655 source lessons and eleven original sensor quizzes remain',()=>{
 assert.equal(L.lessons.length,1655);
 const first=L.lessons.findIndex(x=>x.id==='oscillator-filter-apps-outline-031');
 assert.ok(first>0);
 assert.deepEqual(Array.from(L.lessons.slice(first,first+14),x=>x.id),rows.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const l=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.ok(l.quiz);assert.equal(l.topicReview?.sourceQuestionPreserved,true);
 }
});
test('prior SC255 and other native acceptance review gates are not implicitly accepted',()=>{
 for(const id of ['electronic-switching-outline-024','electronic-switching-src-06','opamp-apps-outline-044']){
  const l=L.byId[id];assert.ok(l);
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
 }
 assert.equal(L.byId['electronic-switching-outline-024'].pedagogyReview.nativeDynamicAcceptance,false);
});
