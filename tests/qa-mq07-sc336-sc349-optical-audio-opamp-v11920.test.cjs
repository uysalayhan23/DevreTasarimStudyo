'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["electronic-switching-outline-061","NO_DISCRETE_PHOTOTRANSISTOR_OPTICAL_RUNTIME",0,["arduino-tlp521-1","resistor"]],["sensor-analog-apps-outline-051","LDR_DARK_COMPARATOR_NO_LOAD_DYNAMIC",12,["arduino-bench-supply","ldr-gl5528","resistor","lm358p-dip8","resistor","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"]],["sensor-analog-apps-outline-052","LDR_DC_DIMMER_OUTLINE_NATIVE_UNVERIFIED",7,["arduino-bench-supply","ldr-gl5528","resistor","mosfet-n","standard-light"]],["electronic-component-basics-outline-029","NO_IR_TX_RX_OPTICAL_LINK",0,["tutorial-ir-transmitter","tutorial-ir-receiver"]],["digital-logic-apps-outline-016","NO_COMMAND_TEST_CONTROL_WIRING",0,["arduino-bench-supply","push-no","push-nc","coil-relay","lamp-green"]],["electronic-component-basics-outline-030","NO_IR_RECEIVER_LOAD_CONTROL",0,["tutorial-ir-receiver","coil-relay","lamp-green"]],["sensor-analog-apps-outline-053","SOUND_SENSOR_ARDUINO_RUNTIME_UNVERIFIED",8,["arduino-bench-supply","arduino-sound-sensor","arduino-uno","arduino-buzzer"]],["electronic-component-basics-outline-031","NO_MIC_PREAMP_GAIN_WIRING",0,["electret-9767-mic","lm358p-dip8"]],["electronic-component-basics-outline-032","NO_SPEAKER_AMPLIFIER_OUTPUT_WIRING",0,["speaker-8ohm-1w","lm358p-dip8"]],["electronic-component-basics-outline-033","NO_CLAP_TRIGGER_RELAY_RUNTIME",0,["electret-9767-mic","arduino-sound-sensor","coil-relay"]],["opamp-apps-outline-018","NO_OPAMP_INPUT_OUTPUT_CHARACTERIZATION",0,["lm358p-dip8","resistor","capacitor"]],["electronic-component-basics-outline-034","NO_GENERAL_AMPLIFIER_GAIN_VERIFICATION",0,["lm358p-dip8","resistor","capacitor"]],["opamp-apps-outline-019","NO_LM358_INTERNAL_STRUCTURE_TEST",0,["lm358p-dip8","resistor","capacitor"]],["opamp-apps-outline-020","OPAMP_GAIN_OUTLINE_NATIVE_UNVERIFIED",14,["arduino-bench-supply","lm358p-dip8","potentiometer","resistor","resistor","unit-ut33d-plus","resistor","resistor","test-probe-red","test-probe-black"]]];
for(const [id,issue,wires,types] of cases)test(id+' optical/audio/opamp source acceptance',()=>{
 const l=L.byId[id],p=l?.project;
 assert.ok(l,id);assert.equal(p.wires.length,wires);
 assert.deepEqual(Array.from(p.components,c=>c.typeId),types);
 for(const type of types)assert.ok(defs[type],type);
 assert.equal(l.kind,wires?'wiring':'quiz');
 if(!wires)assert.equal(p.referenceOnly,true);
 assert.equal(l.pedagogyReview.mq07OpticalScope,'SC336_SC349');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const field of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','opticalCalibrationAcceptance','acPhaseAcceptance'])
  assert.equal(l.pedagogyReview[field],false,field);
 assert.ok(l.beginnerSteps.some(t=>t.includes('PASS verme')));
});
test('SC336 phototransistor reference and IR source cards are not fake BD139 or generic concept',()=>{
 assert.deepEqual(Array.from(L.byId['electronic-switching-outline-061'].project.components,c=>c.typeId),['arduino-tlp521-1','resistor']);
 assert.equal(L.byId['electronic-switching-outline-061'].steps.length,0);
 assert.deepEqual(Array.from(L.byId['electronic-component-basics-outline-029'].project.components,c=>c.typeId),['tutorial-ir-transmitter','tutorial-ir-receiver']);
 assert.deepEqual(Array.from(L.byId['electronic-component-basics-outline-030'].project.components,c=>c.typeId),['tutorial-ir-receiver','coil-relay','lamp-green']);
});
test('SC338 copies protected 7-wire DC-only LDR MOSFET dimmer including exact pin paths',()=>{
 const a=L.byId['sensor-analog-apps-outline-052'],g=L.byId['sensor-analog-apps-src-11'];
 assert.equal(a.kind,'wiring');assert.equal(a.steps.length,7);
 assert.equal(a.project.components.find(c=>c.id==='g1').dcVoltage,12);
 assert.equal(a.project.components.find(c=>c.id==='q1').typeId,'mosfet-n');
 assert.equal(a.pedagogyReview.sourceTopologyReusedFrom,'sensor-analog-apps-src-11');
 assert.deepEqual(Array.from(a.project.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]),
  Array.from(g.project.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]));
 assert.equal(a.pedagogyReview.acPhaseAcceptance,false);
});
test('SC337 comparator, SC342 sound link and SC349 opamp terminals remain unchanged',()=>{
 const a=L.byId['sensor-analog-apps-outline-051'],b=L.byId['sensor-analog-apps-outline-053'],c=L.byId['opamp-apps-outline-020'];
 assert.equal(a.project.wires.length,12);assert.equal(b.project.wires.length,8);
 assert.equal(c.project.wires.length,14);
 assert.ok(a.project.components.some(c=>c.typeId==='lm358p-dip8'));
 assert.ok(b.project.components.some(c=>c.typeId==='arduino-sound-sensor'));
 assert.ok(c.project.components.some(c=>c.typeId==='lm358p-dip8'));
});
test('native SC338 LDR lux sweep has measured, stable, monotonic dimming',()=>{
 const p=structuredClone(L.byId['sensor-analog-apps-outline-052'].project);
 const sensor=p.components.find(c=>c.id==='s1'),lamp=p.components.find(c=>c.id==='h1');
 const result=[];
 for(const lux of [.1,1,10,100,1000]){
  sensor.illuminationLux=lux;
  const r=Native.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'native LDR at '+lux);
  result.push({lux,brightness:lamp._dimmerBrightnessPct,power:lamp._dimmerPowerW});
 }
 for(let i=1;i<result.length;i++)
  assert.ok(result[i].brightness>=result[i-1].brightness,'lux brightness monotonic');
 assert.ok(result[0].brightness<.01);
 assert.ok(result[2].brightness>10&&result[2].brightness<15);
 assert.ok(result[4].brightness>95&&result[4].brightness<100);
 assert.ok(result[2].power<result[3].power&&result[3].power<result[4].power);
});
test('all 1655 original quiz IDs and SC255/SC331/SC332 native gaps are preserved',()=>{
 assert.equal(L.lessons.length,1655);
 const start=L.lessons.findIndex(l=>l.id==='electronic-switching-outline-061');
 assert.ok(start>0);
 assert.deepEqual(Array.from(L.lessons.slice(start,start+14),l=>l.id),cases.map(x=>x[0]));
 for(const id of ['electronic-switching-outline-024','sensor-analog-apps-outline-047','sensor-analog-apps-outline-048']){
  assert.equal(L.byId[id].pedagogyReview.nativeDynamicAcceptance,false,id);
  assert.equal(L.byId[id].pedagogyReview.titleTopologyStatus,'REVIEW',id);
 }
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
});
