'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["sensor-analog-apps-outline-026","NO_SENSOR_SELECTION_DATASHEET_EVIDENCE",0,["proximity","capacitive-detector","photoeye"]],["sensor-analog-apps-outline-027","NO_DIGITAL_ANALOG_SIGNAL_MEASUREMENT",0,["proximity","sensor-level-analog","arduino-lm35"]],["sensor-analog-apps-outline-028","NO_TEMPERATURE_APPLICATION_WIRING",0,["sensor-ntc","sensor-ptc","thermocouple","sensor-pt100","arduino-lm35"]],["electronic-component-basics-outline-024","NO_THERMISTOR_PROBE_SENSOR_CONTACT",2,["sensor-ntc","unit-ut33d-plus","test-probe-red","test-probe-black"]],["sensor-analog-apps-outline-029","NO_THERMOCOUPLE_MV_MEASUREMENT",0,["thermocouple"]],["electronic-component-basics-outline-025","NO_PT100_RTD_MEASUREMENT_CONNECTION",0,["sensor-pt100","unit-ut33d-plus"]],["electronic-component-basics-outline-026","NO_THERMOSTAT_CONTROL_RUNTIME",0,["tutorial-thermostat","sensor-ntc"]],["sensor-analog-apps-outline-030","NO_LM35_ANALOG_ADC_CONNECTION",0,["arduino-lm35","arduino-uno"]],["sensor-analog-apps-outline-031","NTC_COMPARATOR_OUTLINE_NATIVE_UNVERIFIED",12,["arduino-bench-supply","sensor-ntc","resistor","lm358p-dip8","resistor","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"]],["sensor-analog-apps-outline-032","PTC_COMPARATOR_OUTLINE_NATIVE_UNVERIFIED",12,["arduino-bench-supply","sensor-ptc","resistor","lm358p-dip8","resistor","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"]],["electronic-component-basics-outline-027","LM35_ARDUINO_OUTLINE_NATIVE_UNVERIFIED",5,["arduino-bench-supply","arduino-lm35","arduino-uno"]],["sensor-analog-apps-outline-035","HALL_RELAY_OUTLINE_DYNAMIC_UNVERIFIED",7,["arduino-bench-supply","sensor-hall","coil-relay","contact-no","lamp-green"]],["sensor-analog-apps-outline-036","NO_REED_SWITCH_RUNTIME",0,["arduino-reed"]],["sensor-analog-apps-outline-037","NO_HALL_OUTPUT_RUNTIME",0,["sensor-hall"]]];
for(const [id,reason,wires,types] of cases)test(id+' source materials and negative dynamic acceptance',()=>{
 const l=L.byId[id],p=l?.project;
 assert.ok(l);assert.equal(p.wires.length,wires);
 assert.deepEqual(Array.from(p.components,x=>x.typeId),types);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId+' missing catalog');
 assert.equal(l.pedagogyReview.mq07TemperatureScope,'SC308_SC321');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,reason);
 for(const k of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance',
  'independentPedagogicalAcceptance','sensorCalibrationAcceptance'])assert.equal(l.pedagogyReview[k],false,k);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(l.quiz&&l.quiz.options.length>1);
});
test('temperature unit source is no longer unrelated proximity relay control',()=>{
 const p=L.byId['sensor-analog-apps-outline-028'].project;
 assert.equal(p.wires.length,0);assert.equal(p.referenceOnly,true);
 assert.deepEqual(Array.from(p.components,c=>c.typeId),['sensor-ntc','sensor-ptc','thermocouple','sensor-pt100','arduino-lm35']);
});
test('sensor digital/analog, PT100 and LM35 reference cards use correct products',()=>{
 const expected={
  'sensor-analog-apps-outline-027':['proximity','sensor-level-analog','arduino-lm35'],
  'electronic-component-basics-outline-025':['sensor-pt100','unit-ut33d-plus'],
  'sensor-analog-apps-outline-030':['arduino-lm35','arduino-uno']
 };
 for(const [id,types] of Object.entries(expected)){
  const l=L.byId[id];
  assert.equal(l.kind,'quiz');assert.equal(l.project.wires.length,0);
  assert.deepEqual(Array.from(l.project.components,c=>c.typeId),types);
  assert.equal(l.materials.length,types.length);
  assert.deepEqual(Array.from(l.pedagogyReview.componentIds),types);
 }
});
test('three proven source lesson projects and native SC255 acceptance remain unchanged',()=>{
 for(const [id,n] of [['sensor-analog-apps-src-01',19],['sensor-analog-apps-src-02',19],
  ['sensor-analog-apps-src-03',6],['sensor-analog-apps-src-04',5],['sensor-analog-apps-src-05',5]])
  assert.equal(L.byId[id].project.wires.length,n,id);
 const sc255=L.byId['electronic-switching-outline-024'];
 assert.equal(sc255.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(sc255.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(sc255.project.wires.length,12);
});
test('1655 lessons and 11 special original sensor quizzes intact',()=>{
 assert.equal(L.lessons.length,1655);
 const first=L.lessons.findIndex(x=>x.id==='sensor-analog-apps-outline-026');
 assert.ok(first>0);
 assert.deepEqual(Array.from(L.lessons.slice(first,first+14),x=>x.id),cases.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
});
