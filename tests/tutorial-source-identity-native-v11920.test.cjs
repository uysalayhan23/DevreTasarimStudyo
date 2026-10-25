'use strict';
// Targeted native acceptance evidence for the seven source-wired tutorials
// whose project identity was lost during the specialized circuit rebuild.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const curriculum=QA.curriculum(),catalog=QA.catalog();
const ids=["electronic-switching-src-03","electronic-switching-src-06","electronic-switching-src-07","electronic-switching-src-09","electronic-switching-src-10","electronic-switching-src-11","sensor-analog-apps-src-11"];
test('seven real wired projects retain their exact lesson session identity',()=>{
 for(const id of ids){
  const lesson=curriculum.byId[id],p=lesson?.project;
  assert.equal(lesson?.kind,'wiring',id);
  assert.equal(p?.projectId,'tutorial-session-source-'+id,id);
  assert.deepEqual(p.tutorialLesson,{id,topicId:lesson.topicId,phase:'demo',step:0,level:Number(id.slice(-2))},id);
  assert.ok(p.wires.length>0&&p.components.length>0,id);
 }
 assert.equal(curriculum.lessons.filter(l=>l.project?.tutorialLesson?.id!==l.id).length,0);
});
test('SC11 PWM MOSFET motor remains OFF/ON and rejects a broken gate or motor lead',()=>{
 const lesson=curriculum.byId['electronic-switching-src-11'],before=JSON.stringify(lesson.project);
 function probe(duty,open){
  const p=structuredClone(lesson.project);
  p.components.find(c=>c.id==='pwm1').dutyPercent=duty;
  if(open==='gate')p.wires=p.wires.filter(w=>!(w.from.c==='rg'&&w.from.p==='2'&&w.to.c==='q1'&&w.to.p==='G'));
  if(open==='motor')p.wires=p.wires.filter(w=>!(w.from.c==='m1'&&w.to.c==='q1'&&w.to.p==='D'));
  const result=Simulation.solve(p,catalog,{now:100});
  assert.equal(result.blocked,false);
  assert.equal(result.shortCircuit,false);
  assert.equal(result.stable,true);
  return !!p.components.find(c=>c.id==='m1')._active;
 }
 assert.equal(probe(0),false,'0% PWM means motor OFF');
 assert.equal(probe(100),true,'100% PWM means motor ON in the virtual model');
 assert.equal(probe(100,'gate'),false,'open gate drive keeps motor OFF');
 assert.equal(probe(100,'motor'),false,'open drain load keeps motor OFF');
 assert.equal(JSON.stringify(lesson.project),before,'test never mutates the curriculum');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});
