'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const reasons=["NO_PANEL_WIRING_SCHEMATIC","NO_DIN_RAIL_DUCT_LAYOUT","NO_BUTTON_LAMP_MOUNTING_CIRCUIT","NO_MCB_RCD_INSTALLED_TEST","NO_MOTOR_PROTECTION_SWITCH_SELECTION","NO_FERRULE_CRIMP_LABEL_VALIDATION","NO_TERMINAL_CONDUCTOR_CONNECTION","NO_INSULATION_MEASUREMENT_EVIDENCE","NO_ELEVATOR_CONTROL_TOPOLOGY","NO_INDUSTRIAL_METER_TERMINAL_WIRING","NO_CT_SECONDARY_METER_WIRING","NO_DISTRIBUTION_SINGLE_LINE_SCHEMATIC","NO_TWELVE_STAGE_COMPENSATION_SYSTEM","NO_TRANSFORMER_PROTECTION_COORDINATION"];
for(let n=1;n<=14;n++)test('SC'+(213+n)+' panel reference and safety acceptance lock',()=>{
 const id='panel-power-systems-src-'+String(n).padStart(2,'0'),l=L.byId[id],p=l?.project;
 assert.ok(l);assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);
 assert.equal(l.pedagogyReview.mq07PanelScope,'SC214_SC227');
 assert.equal(l.pedagogyReview.titleTopologyIssue,reasons[n-1]);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 for(const k of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','panelEngineeringAcceptance','electricalSafetyAcceptance'])
  assert.equal(l.pedagogyReview[k],false);
 assert.equal(l.steps.length,0);
 assert.equal(l.materials.length,p.components.length);
 for(const x of p.components)assert.ok(defs[x.typeId],x.typeId);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 assert.ok(l.quiz&&Array.isArray(l.quiz.options));
});
for(const [n,types] of [[4,['mcb-1p','rcd-2p']],[11,['meter-combined-ct','current-transformer']]])
 test('SC'+(213+n)+' replaces unrelated DC meter with canonical catalog reference',()=>{
 const id='panel-power-systems-src-'+String(n).padStart(2,'0'),l=L.byId[id];
 assert.deepEqual(Array.from(l.project.components,x=>x.typeId),types);
 assert.equal(l.project.projectId,'tutorial-session-source-'+id);
 assert.deepEqual(Array.from(l.pedagogyReview.componentIds),types);
});
test('all lessons and 11 preserved sensor quizzes remain',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='panel-power-systems-src-01');
 assert.ok(i>0);
 for(let n=1;n<=14;n++)assert.equal(L.lessons[i+n-1].id,'panel-power-systems-src-'+String(n).padStart(2,'0'));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const l=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.ok(l.quiz);assert.equal(l.topicReview?.sourceQuestionPreserved,true);
 }
});
