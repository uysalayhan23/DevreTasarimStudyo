'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["01","NO_VFD_ARCHITECTURE_PARAMETER_EVIDENCE",["sinamics-v20-1p","motor-3p"]],["02","NO_VFD_START_STOP_WIRING",["sinamics-v20-1p","motor-3p","push-no","push-nc"]],["03","NO_VFD_REVERSE_CONTROL_WIRING",["sinamics-v20-1p","motor-3p","push-no","push-nc"]],["04","NO_VFD_POT_ANALOG_REFERENCE",["sinamics-v20-1p","motor-3p","potentiometer"]],["05","NO_MAINTAINED_DIRECTION_SELECTOR",["sinamics-v20-1p","motor-3p","push-no","push-nc"]],["06","NO_VFD_COMBINED_IO_CONTROL",["sinamics-v20-1p","motor-3p","potentiometer","push-no","push-nc"]],["07","NO_PLC_VFD_COMMAND_CHANNEL",["plc-hw-6es7211-1ae40-0xb0","sinamics-v20-1p","motor-3p"]],["08","NO_VFD_NAMEPLATE_PARAMETER_WRITE",["sinamics-v20-1p","motor-3p"]],["09","NO_PLC_SERVO_CONNECTION",["plc-hw-6es7211-1ae40-0xb0","hcfa-sv-x2ea040a-a","hcfa-sv-x2mh040a-n2ln"]],["10","NO_SERVO_PARAMETER_MOTION_VERIFICATION",["plc-hw-6es7211-1ae40-0xb0","hcfa-sv-x2ea040a-a","hcfa-sv-x2mh040a-n2ln"]]];
for(const [suffix,reason,types] of rows)test('SC'+(203+Number(suffix))+' VFD/servo reference acceptance is blocked',()=>{
 const lesson=L.byId['vfd-servo-control-src-'+suffix],p=lesson?.project;
 assert.ok(lesson);assert.equal(lesson.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);
 assert.deepEqual(Array.from(p.components,c=>c.typeId),types);
 for(const type of types)assert.ok(defs[type],type+' catalog missing');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,reason);
 assert.equal(lesson.pedagogyReview.mq07DriveScope,'SC204_SC213');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW');
 for(const key of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','driveRuntimeAcceptance','manufacturerParameterAcceptance'])
  assert.equal(lesson.pedagogyReview[key],false);
 assert.equal(lesson.powerSteps.length,0);assert.match(lesson.powerExplanation,/kablolanmamıştır/);
 assert.ok(lesson.beginnerSteps.some(x=>x.includes('PASS verme')));
 assert.ok(lesson.quiz&&Array.isArray(lesson.quiz.options));
 assert.ok(Number.isInteger(lesson.quiz.answer)&&lesson.quiz.answer>=0&&lesson.quiz.answer<lesson.quiz.options.length);
});
test('1655 lesson and eleven original sensor quiz regressions',()=>{
 assert.equal(L.lessons.length,1655);
 const pos=L.lessons.findIndex(l=>l.id==='vfd-servo-control-src-01');
 assert.ok(pos>=0);assert.equal(L.lessons[pos-1].id,'plc-hardware-programming-src-22');
 for(let n=1;n<=10;n++)assert.equal(L.lessons[pos+n-1].id,'vfd-servo-control-src-'+String(n).padStart(2,'0'));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14]){
  const s=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.ok(s.quiz);assert.equal(s.topicReview?.sourceQuestionPreserved,true);
 }
});
