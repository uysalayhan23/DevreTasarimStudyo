'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["electronic-component-basics-outline-001","NO_FAULT_METHOD_MEASUREMENT",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"]],["electronic-component-basics-outline-002","NO_FAULT_DETECTION_SCENARIO",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"]],["electronic-component-basics-outline-003","NO_PREINSPECTION_TEST_EVIDENCE",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"]],["electronic-component-basics-outline-004","NO_COMPONENT_TEST_SCENARIO",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"]],["electronic-component-basics-outline-005","NO_FAULT_REPAIR_CONFIRMATION",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"]],["electronic-switching-outline-020","NO_RELAY_SWITCHING_CIRCUIT",0,["coil-relay","contact-both","arduino-diode-1n4007"]],["electronic-component-basics-outline-006","NO_RELAY_MECHANICAL_VERIFICATION",0,["coil-relay","contact-both"]],["electronic-component-basics-outline-007","NO_RELAY_NAMEPLATE_RATING_EVIDENCE",0,["coil-relay","contact-both"]],["electronic-component-basics-outline-008","NO_RELAY_OPERATION_RUNTIME",0,["coil-relay","contact-both"]],["electronic-component-basics-outline-009","NO_RELAY_FLYBACK_PROTECTION_CIRCUIT",0,["1n4007-do41","coil-relay"]],["electronic-component-basics-outline-010","NO_RELAY_FAULT_DIAGNOSIS",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"]],["electronic-component-basics-outline-011","NO_RELAY_PIN_IDENTIFICATION_MEASUREMENT",0,["coil-relay","contact-both"]],["motor-direct-power-outline-019","CONTACTOR_SEAL_IN_NOT_STANDALONE_RELAY",13,["supply-3p","push-nc","push-no","coil-contactor","main-contact","motor-3p","contact-no"]],["motor-direct-power-outline-020","MISSING_MOTOR_REVERSAL_CONTACTOR_INTERLOCK",13,["supply-3p","push-nc","push-no","coil-contactor","main-contact","motor-3p","contact-no"]]];
for(const [id,reason,wires,types] of rows)test('SC238–251 '+id+' source-topology and fail-closed review',()=>{
 const l=L.byId[id],p=l?.project;
 assert.ok(l);assert.equal(p.wires.length,wires);
 assert.equal(l.kind,wires===13?'wiring':'quiz');
 assert.deepEqual(Array.from(p.components,x=>x.typeId),types);
 for(const type of types)assert.ok(defs[type],type+' not in catalog');
 if(wires!==13)assert.equal(p.referenceOnly,true);
 assert.equal(l.pedagogyReview.mq07FaultRelayScope,'SC238_SC251');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,reason);
 for(const field of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','faultDiagnosisAcceptance','relayDynamicsAcceptance','motorReversalAcceptance'])
  assert.equal(l.pedagogyReview[field],false,field);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(l.quiz&&Array.isArray(l.quiz.options));
});
test('SC247 protection diode reference shows diode and coil instead of two diodes',()=>{
 const l=L.byId['electronic-component-basics-outline-009'];
 assert.deepEqual(Array.from(l.project.components,x=>x.typeId),['1n4007-do41','coil-relay']);
 assert.equal(l.project.wires.length,0);
 assert.deepEqual(Array.from(l.pedagogyReview.componentIds),['1n4007-do41','coil-relay']);
 assert.equal(l.materials.length,2);
});
test('SC250 and SC251 retain separate 13-wire original contactor graphs; no invented second reversing branch',()=>{
 for(const id of ['motor-direct-power-outline-019','motor-direct-power-outline-020']){
  const l=L.byId[id],c=l.project.components;
  assert.equal(l.kind,'wiring');assert.equal(l.project.wires.length,13);
  assert.equal(c.filter(x=>x.typeId==='coil-contactor').length,1);
  assert.equal(c.filter(x=>x.typeId==='main-contact').length,1);
  assert.equal(c.filter(x=>x.typeId==='motor-3p').length,1);
 }
 assert.equal(L.byId['motor-direct-power-outline-020'].pedagogyReview.titleTopologyIssue,
  'MISSING_MOTOR_REVERSAL_CONTACTOR_INTERLOCK');
});
test('1655 lesson IDs, original sensor quizzes, and SC217/SC224/SC235 fixes persist',()=>{
 assert.equal(L.lessons.length,1655);
 const first=L.lessons.findIndex(x=>x.id==='electronic-component-basics-outline-001');
 assert.ok(first>0);
 const ids=rows.map(x=>x[0]);
 assert.deepEqual(Array.from(L.lessons.slice(first,first+14),x=>x.id),ids);
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const l=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.ok(l.quiz);assert.equal(l.topicReview?.sourceQuestionPreserved,true);
 }
 const expect={
  'panel-power-systems-src-04':['mcb-1p','rcd-2p'],
  'panel-power-systems-src-11':['meter-combined-ct','current-transformer'],
  'workshop-safety-mechanics-src-08':['tutorial-conductor-cable','tutorial-soldering']
 };
 for(const [id,types] of Object.entries(expect))
  assert.deepEqual(Array.from(L.byId[id].project.components,c=>c.typeId),types);
});
