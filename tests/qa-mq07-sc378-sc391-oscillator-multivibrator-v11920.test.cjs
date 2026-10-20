'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["oscillator-filter-apps-outline-031","LC_TANK_NO_OSCILLATION_RUNTIME",["arduino-bd139","reactor","capacitor"]],["oscillator-filter-apps-outline-032","CRYSTAL_DRIVE_LOAD_CAPACITOR_NOT_VERIFIED",null],["oscillator-filter-apps-outline-033","RC_OSCILLATION_FEEDBACK_NOT_WIRED",null],["oscillator-filter-apps-outline-034","MULTIVIBRATOR_MODES_NOT_DISTINGUISHED",null],["oscillator-filter-apps-outline-035","COLPITTS_CAPACITIVE_DIVIDER_NOT_WIRED",["arduino-bd139","reactor","capacitor","capacitor"]],["oscillator-filter-apps-outline-036","HARTLEY_TAPPED_INDUCTOR_NOT_VERIFIED",["arduino-bd139","reactor","reactor","capacitor"]],["oscillator-filter-apps-outline-037","CRYSTAL_OSCILLATION_NOT_WIRED",null],["oscillator-filter-apps-outline-038","RC_PHASE_SHIFT_THREE_STAGES_NOT_WIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor","resistor","capacitor"]],["oscillator-filter-apps-outline-039","WIEN_BRIDGE_GAIN_CONTROL_NOT_WIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor"]],["oscillator-filter-apps-outline-040","MONOSTABLE_TRIGGER_PULSE_RUNTIME_ABSENT",["bd139-npn","bd139-npn","resistor","capacitor"]],["oscillator-filter-apps-outline-041","BISTABLE_CROSS_COUPLED_STATES_ABSENT",["bd139-npn","bd139-npn","resistor","resistor"]],["oscillator-filter-apps-outline-042","ASTABLE_CROSS_COUPLED_RC_RUNTIME_ABSENT",["bd139-npn","bd139-npn","resistor","resistor","capacitor","capacitor"]],["electronic-component-basics-outline-038","PULSE_CIRCUITS_CONCEPT_ONLY",null],["electronic-component-basics-outline-039","CLIPPER_DIODE_PATH_NOT_WIRED",null]];
const modern={
 'oscillator-filter-apps-outline-040':{source:'oscillator-filter-apps-src-06',wires:21,flag:'mq07StandaloneBjtMonostable',scope:'SC378_SC391',status:'SOURCE_WIRED_MONOSTABLE_NATIVE_IDEAL'},
 'oscillator-filter-apps-outline-041':{source:'oscillator-filter-apps-src-07',wires:20,flag:'mq07StandaloneBjtBistable',scope:'SC378_SC391',status:'SOURCE_WIRED_BISTABLE_NATIVE_IDEAL'},
 'oscillator-filter-apps-outline-042':{source:'oscillator-filter-apps-src-08',wires:14,flag:'mq07StandaloneBjtAstable',scope:'SC378_SC391',status:'SOURCE_WIRED_CROSS_RC_NATIVE_IDEAL'},
 'electronic-component-basics-outline-038':{source:'oscillator-filter-apps-src-14',wires:15,scope:'SC390_SC400',status:'SOURCE_WIRED_555_PULSE_EXAMPLE_FREQUENCY_PENDING'},
 'electronic-component-basics-outline-039':{source:'oscillator-filter-apps-src-09',wires:12,scope:'SC390_SC400',status:'SOURCE_WIRED_CLIPPER_WAVE_PENDING'}
};
for(const [id,issue,expectedParts] of rows)test('SC378–391 '+id+' source/review acceptance',()=>{
 const l=L.byId[id],p=l?.project;assert.ok(l);
 if(modern[id]){
  const expected=modern[id],originalSource=L.byId[expected.source];
  assert.ok(originalSource?.project,expected.source);
  assert.equal(l.kind,'wiring');assert.notEqual(p.referenceOnly,true);
  assert.equal(p.wires.length,expected.wires);
  assert.equal(l.steps.length,expected.wires);
  assert.equal(originalSource.project.wires.length,expected.wires);
  if(expected.flag)assert.equal(p.components.filter(c=>c[expected.flag]===true).length,2);
  assert.deepEqual(Array.from(p.components,c=>c.typeId),Array.from(originalSource.project.components,c=>c.typeId));
  assert.deepEqual(Array.from(p.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]),Array.from(originalSource.project.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]));
  assert.equal(l.pedagogyReview[expected.scope==='SC390_SC400'?'mq07PulseScope':'mq07OscillatorScope'],expected.scope);
  assert.equal(l.pedagogyReview.sourceReusedFrom,expected.source);
  assert.equal(l.pedagogyReview.titleTopologyStatus,expected.status);
  assert.equal(l.pedagogyReview.titleTopologyIssue,null);
  for(const key of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.equal(l.pedagogyReview[key],false,key);
  for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
  return;
 }
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
test('SC386–388 source-wired models keep opt-in flags and unverified acceptance gates',()=>{
 for(const [id,expected] of Object.entries(modern)){
  if(!expected.flag)continue;
  const l=L.byId[id];assert.ok(l);
  assert.equal(l.kind,'wiring');
  assert.equal(l.project.wires.length,expected.wires);
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
 }
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
