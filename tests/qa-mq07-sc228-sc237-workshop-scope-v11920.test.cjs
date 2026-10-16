'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["01","NO_WORKSHOP_HAZARD_ASSESSMENT","tutorial-ppe"],["02","NO_PPE_SUITABILITY_VERIFICATION","tutorial-ppe"],["03","NO_DIMENSION_MEASUREMENT_EVIDENCE","tutorial-hand-tools"],["04","NO_CUTTING_VISE_PROCESS_VERIFICATION","tutorial-hand-tools"],["05","NO_DRILLING_FASTENER_PROCESS_VERIFICATION","tutorial-hand-tools"],["06","NO_SURFACE_BENDING_PROCESS_VERIFICATION","tutorial-hand-tools"],["07","NO_SOLDER_JOINT_QUALITY_TEST","tutorial-soldering,tutorial-soldering"],["08","NO_CONDUCTOR_SPLICE_SOLDER_JOINT","tutorial-conductor-cable,tutorial-soldering"],["09","NO_PERFORATED_BOARD_SOLDER_VERIFICATION","tutorial-pcb,tutorial-soldering"],["10","NO_PCB_PREPARATION_INSPECTION_EVIDENCE","tutorial-pcb,tutorial-soldering"]];
for(const [suffix,reason,partSpec] of rows)test('SC'+(227+Number(suffix))+' workshop concept and safety review',()=>{
 const id='workshop-safety-mechanics-src-'+suffix,lesson=L.byId[id],p=lesson?.project;
 assert.ok(lesson);assert.equal(lesson.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);
 const expected=partSpec.split(',');
 assert.deepEqual(Array.from(p.components,x=>x.typeId),expected);
 for(const type of expected)assert.ok(defs[type],type);
 assert.equal(lesson.pedagogyReview.mq07WorkshopScope,'SC228_SC237');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,reason);
 for(const key of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','workshopProcessAcceptance','toolSafetyAcceptance'])
  assert.equal(lesson.pedagogyReview[key],false);
 assert.equal(lesson.steps.length,0);
 assert.match(lesson.safety,/yetişkin gözetimi/);
 assert.ok(lesson.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(lesson.quiz&&Array.isArray(lesson.quiz.options));
});
test('SC235 now depicts conductor and soldering, retaining original test item',()=>{
 const lesson=L.byId['workshop-safety-mechanics-src-08'];
 assert.deepEqual(Array.from(lesson.project.components,c=>c.typeId),['tutorial-conductor-cable','tutorial-soldering']);
 assert.deepEqual(Array.from(lesson.pedagogyReview.componentIds),['tutorial-conductor-cable','tutorial-soldering']);
 assert.equal(lesson.materials.length,2);
});
test('1655 lessons, 11 sensor source-specific quizzes and protected MCB/CT panel cards remain',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='workshop-safety-mechanics-src-01');
 assert.ok(i>0);
 for(let n=1;n<=10;n++)assert.equal(L.lessons[i+n-1].id,'workshop-safety-mechanics-src-'+String(n).padStart(2,'0'));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const s=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.ok(s.quiz);assert.equal(s.topicReview?.sourceQuestionPreserved,true);
 }
 assert.deepEqual(Array.from(L.byId['panel-power-systems-src-04'].project.components,x=>x.typeId),['mcb-1p','rcd-2p']);
 assert.deepEqual(Array.from(L.byId['panel-power-systems-src-11'].project.components,x=>x.typeId),['meter-combined-ct','current-transformer']);
});
