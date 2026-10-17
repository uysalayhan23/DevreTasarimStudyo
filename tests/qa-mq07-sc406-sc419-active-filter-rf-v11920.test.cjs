'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["oscillator-filter-apps-outline-050","ACTIVE_LOWPASS_CUTOFF_UNWIRED",null],["oscillator-filter-apps-outline-051","ACTIVE_HIGHPASS_CUTOFF_UNWIRED",["capacitor","resistor","lm358p-dip8","resistor"]],["oscillator-filter-apps-outline-052","ACTIVE_BANDPASS_TWO_CUTOFFS_UNWIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor"]],["oscillator-filter-apps-outline-053","ACTIVE_BANDSTOP_NOTCH_UNWIRED",["lm358p-dip8","resistor","resistor","resistor","capacitor","capacitor","capacitor"]],["oscillator-filter-apps-outline-054","MODULATION_DEMODULATION_RF_CHAIN_UNWIRED",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"]],["electronic-component-basics-outline-047","AM_MODULATION_DEMODULATION_UNWIRED",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"]],["electronic-component-basics-outline-048","FM_MODULATION_DEMODULATION_UNWIRED",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"]],["electronic-component-basics-outline-049","RF_TRANSMITTER_SIGNAL_PATH_UNWIRED",null],["electronic-component-basics-outline-050","AM_TRANSMITTER_MODULATOR_UNWIRED",null],["oscillator-filter-apps-outline-055","FM_TRANSMITTER_DEVIATION_UNWIRED",null],["oscillator-filter-apps-outline-056","FM_TRANSMITTER_EXERCISE_UNWIRED",null],["electronic-component-basics-outline-051","RF_RECEIVER_TUNING_UNWIRED",null],["electronic-component-basics-outline-052","AM_RECEIVER_DEMODULATOR_UNWIRED",null],["oscillator-filter-apps-outline-057","FM_RECEIVER_DISCRIMINATOR_UNWIRED",null]];
for(const [id,issue,parts] of cases)test('SC406–419 '+id+' fail-closed topology and RF/active-filter limits',()=>{
 const l=L.byId[id],p=l?.project;
 assert.ok(l);assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);
 assert.equal(p.wires.length,0);assert.equal(l.steps.length,0);
 assert.equal(l.pedagogyReview.mq07ActiveRfScope,'SC406_SC419');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const k of ['nativeDynamicAcceptance','frequencyResponseAcceptance','modulationRuntimeAcceptance',
   'physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(l.pedagogyReview[k],false,k);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 if(parts){
  assert.deepEqual(Array.from(p.components,c=>c.typeId),parts);
  assert.deepEqual(Array.from(l.pedagogyReview.componentIds),parts);
  assert.equal(l.materials.length,parts.length);
 }
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(l.quiz&&Array.isArray(l.quiz.options)&&l.quiz.options.length>1);
});
test('four active-filter exercises differ by LP/HP/BP/BS reference topology',()=>{
 const types=n=>Array.from(L.byId['oscillator-filter-apps-outline-'+n].project.components,c=>c.typeId);
 assert.deepEqual(types('050'),['lm358p-dip8','resistor','capacitor']);
 assert.deepEqual(types('051'),['capacitor','resistor','lm358p-dip8','resistor']);
 assert.deepEqual(types('052'),['lm358p-dip8','resistor','capacitor','resistor','capacitor']);
 assert.deepEqual(types('053'),['lm358p-dip8','resistor','resistor','resistor','capacitor','capacitor','capacitor']);
});
test('modulation overview and AM/FM lessons depict transmitter, receiver and source references',()=>{
 for(const id of ['oscillator-filter-apps-outline-054','electronic-component-basics-outline-047','electronic-component-basics-outline-048']){
  const types=Array.from(L.byId[id].project.components,c=>c.typeId);
  assert.deepEqual(types,['tutorial-rf-transmitter','tutorial-rf-receiver','arduino-signal-generator']);
 }
});
test('all 1655 lessons, 11 protected sensor quizzes and previous acceptance gates persist',()=>{
 assert.equal(L.lessons.length,1655);
 const idx=L.lessons.findIndex(x=>x.id==='oscillator-filter-apps-outline-050');
 assert.deepEqual(Array.from(L.lessons.slice(idx,idx+14),x=>x.id),cases.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
 for(const id of ['electronic-switching-outline-024','electronic-component-basics-outline-046',
   'oscillator-filter-apps-outline-043','oscillator-filter-apps-outline-044']){
  assert.equal(L.byId[id].pedagogyReview.nativeDynamicAcceptance,false,id);
 }
});
