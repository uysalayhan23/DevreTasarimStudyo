'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const specs=[["electronic-component-basics-outline-040","CLAMPER_DIODE_CAP_BIAS_NOT_WIRED",null],["electronic-component-basics-outline-041","PULSE_GENERATOR_OSCILLATION_NOT_WIRED",null],["electronic-component-basics-outline-042","CLIPPER_DIODE_SIGNAL_NOT_WIRED",null],["electronic-component-basics-outline-043","CLAMPER_EXERCISE_NO_SHIFTED_WAVE",null],["electronic-component-basics-outline-044","MILLER_CAP_FEEDBACK_NOT_WIRED",null],["electronic-component-basics-outline-045","BOOTSTRAP_CAP_REFERENCE_NOT_WIRED",null],["electronic-component-basics-outline-046","SCHMITT_UPPER_LOWER_THRESHOLDS_UNWIRED",["lm358p-dip8","resistor","resistor","capacitor"]],["oscillator-filter-apps-outline-043","NE555_ASTABLE_FREQUENCY_UNWIRED",["arduino-ne555","resistor","resistor","capacitor"]],["oscillator-filter-apps-outline-044","NE555_PWM_DUTY_ADJUSTMENT_UNWIRED",["arduino-ne555","resistor","potentiometer","capacitor"]],["oscillator-filter-apps-outline-045","NE555_MONOSTABLE_TRIGGER_UNWIRED",["arduino-ne555","resistor","capacitor","push-no"]],["oscillator-filter-apps-outline-046","NE555_BISTABLE_SET_RESET_UNWIRED",["arduino-ne555","push-no","push-no","resistor"]],["oscillator-filter-apps-outline-047","FILTER_TOPOLOGY_RESPONSE_UNWIRED",null],["oscillator-filter-apps-outline-048","PASSIVE_FILTER_MUST_NOT_HAVE_OPAMP",["resistor","capacitor","reactor"]],["oscillator-filter-apps-outline-049","ACTIVE_FILTER_OPAMP_TRANSFER_UNWIRED",null]];
for(const [id,issue,parts] of specs)test('SC392–405 '+id+' no-wire source and fail-closed dynamic acceptance',()=>{
 const lesson=L.byId[id],p=lesson?.project;
 assert.ok(lesson,id);assert.equal(lesson.kind,'quiz');
 assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);assert.equal(lesson.steps.length,0);
 assert.equal(lesson.pedagogyReview.mq07PulseScope,'SC392_SC405');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,issue);
 for(const key of ['nativeDynamicAcceptance','frequencyResponseAcceptance','waveformAcceptance',
   'physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(lesson.pedagogyReview[key],false,key);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 if(parts){
  assert.deepEqual(Array.from(p.components,c=>c.typeId),parts);
  assert.deepEqual(Array.from(lesson.pedagogyReview.componentIds),parts);
  assert.equal(lesson.materials.length,parts.length);
 }
 assert.ok(lesson.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(lesson.quiz&&Array.isArray(lesson.quiz.options)&&lesson.quiz.options.length>=2);
});
test('SC399–402 NE555 lesson references differentiate oscillator, PWM, mono and bistable',()=>{
 const get=n=>L.byId['oscillator-filter-apps-outline-'+n].project.components.map(c=>c.typeId);
 assert.deepEqual(Array.from(get('043')),['arduino-ne555','resistor','resistor','capacitor']);
 assert.deepEqual(Array.from(get('044')),['arduino-ne555','resistor','potentiometer','capacitor']);
 assert.deepEqual(Array.from(get('045')),['arduino-ne555','resistor','capacitor','push-no']);
 assert.deepEqual(Array.from(get('046')),['arduino-ne555','push-no','push-no','resistor']);
 for(const n of ['043','044','045','046'])
  assert.equal(L.byId['oscillator-filter-apps-outline-'+n].project.wires.length,0);
});
test('SC404 passive card contains only RLC, SC405 active still depicts LM358',()=>{
 assert.deepEqual(Array.from(L.byId['oscillator-filter-apps-outline-048'].project.components,c=>c.typeId),
  ['resistor','capacitor','reactor']);
 assert.deepEqual(Array.from(L.byId['oscillator-filter-apps-outline-049'].project.components,c=>c.typeId),
  ['lm358p-dip8','resistor','capacitor']);
});
test('original 1655 source quizzes, 11 sensor questions, and native review gates persist',()=>{
 assert.equal(L.lessons.length,1655);
 const pos=L.lessons.findIndex(x=>x.id==='electronic-component-basics-outline-040');
 assert.ok(pos>0);
 assert.deepEqual(Array.from(L.lessons.slice(pos,pos+14),x=>x.id),specs.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const id='sensor-analog-apps-src-'+String(n).padStart(2,'0');
  assert.ok(L.byId[id].quiz);
  assert.equal(L.byId[id].topicReview?.sourceQuestionPreserved,true);
 }
 for(const id of ['electronic-switching-outline-024','opamp-apps-outline-044']){
  const l=L.byId[id];
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false,id);
  assert.equal(l.pedagogyReview.physicalAcceptance,false,id);
 }
});
