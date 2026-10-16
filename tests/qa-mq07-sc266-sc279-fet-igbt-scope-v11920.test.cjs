'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["electronic-switching-outline-029","SINGLE_JFET_NOT_ALL_FET_FAMILIES",["j113-jfet","resistor"]],["electronic-switching-outline-030","FET_VARIETIES_REFERENCE_ONLY",["j113-jfet","irf540n-mosfet"]],["electronic-switching-outline-031","JFET_TERMINALS_NOT_MEASURED",["j113-jfet","resistor"]],["electronic-switching-outline-032","MOSFET_TERMINALS_NOT_MEASURED",["irf540n-mosfet","resistor"]],["electronic-switching-outline-033","NO_JFET_MOSFET_HEALTH_TEST",["j113-jfet","irf540n-mosfet"]],["electronic-switching-outline-034","NO_FET_RC_DELAY_RUNTIME",["j113-jfet","resistor","capacitor"]],["electronic-switching-outline-035","NO_MOSFET_HEALTH_EXERCISE",["irf540n-mosfet","resistor"]],["motor-direct-power-outline-021","NO_MOSFET_PWM_MOTOR_SPEED_RUNTIME",["irf540n-mosfet","virtual-pwm-generator-v1","motor-dc"]],["electronic-switching-outline-036","NO_IGBT_SWITCHING_RUNTIME",["fga25n120antd-igbt","resistor"]],["electronic-component-basics-outline-018","NO_IGBT_CHARACTERISTIC_MEASUREMENT",["fga25n120antd-igbt","resistor"]],["electronic-component-basics-outline-019","NO_IGBT_INTERNAL_STRUCTURE_MEASUREMENT",["fga25n120antd-igbt","resistor"]],["electronic-component-basics-outline-020","SINGLE_IGBT_NOT_FULL_DEVICE_VARIETY",["fga25n120antd-igbt","resistor"]],["electronic-component-basics-outline-021","NO_AC_IGBT_DIMMER_RUNTIME",["fga25n120antd-igbt","supply-1p","standard-light"]],["electronic-switching-outline-037","NO_SCR_TRIGGER_LATCH_CIRCUIT",["tyn612rg-scr","arduino-bench-supply","resistor"]]];
for(const [id,issue,parts] of rows)test(id+' source-only FET/IGBT acceptance',()=>{
 const l=L.byId[id],p=l?.project;
 assert.ok(l);assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);
 assert.deepEqual(Array.from(p.components,c=>c.typeId),parts);
 for(const type of parts)assert.ok(defs[type],type);
 assert.equal(l.pedagogyReview.mq07FetIgbtScope,'SC266_SC279');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const k of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','nativeDynamicAcceptance','manufacturerDeviceAcceptance'])
  assert.equal(l.pedagogyReview[k],false,k);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(l.quiz&&Array.isArray(l.quiz.options)&&l.quiz.options.length>1);
 assert.equal(l.steps.length,0);
 assert.equal(l.materials.length,p.components.length);
});
test('SC267/SC270 distinguish J113 and IRF540N, SC271 RC storage and SC273 PWM concept',()=>{
 const types=id=>Array.from(L.byId[id].project.components,c=>c.typeId);
 assert.deepEqual(types('electronic-switching-outline-030'),['j113-jfet','irf540n-mosfet']);
 assert.deepEqual(types('electronic-switching-outline-033'),['j113-jfet','irf540n-mosfet']);
 assert.deepEqual(types('electronic-switching-outline-034'),['j113-jfet','resistor','capacitor']);
 assert.deepEqual(types('motor-direct-power-outline-021'),['irf540n-mosfet','virtual-pwm-generator-v1','motor-dc']);
});
test('SC273 and SC278 do not claim live PWM motor or mains IGBT dimmer acceptance',()=>{
 for(const id of ['motor-direct-power-outline-021','electronic-component-basics-outline-021']){
  const l=L.byId[id];assert.equal(l.project.wires.length,0);
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
 }
});
test('all 1655 original quizzes, eleven protected sensor questions and previous fixes persist',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='electronic-switching-outline-029');
 assert.ok(i>0);assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),rows.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
 assert.deepEqual(Array.from(L.byId['electronic-switching-outline-024'].project.components,c=>c.typeId).filter(x=>x==='capacitor'),['capacitor']);
 assert.deepEqual(Array.from(L.byId['panel-power-systems-src-04'].project.components,c=>c.typeId),['mcb-1p','rcd-2p']);
 assert.deepEqual(Array.from(L.byId['workshop-safety-mechanics-src-08'].project.components,c=>c.typeId),['tutorial-conductor-cable','tutorial-soldering']);
});
