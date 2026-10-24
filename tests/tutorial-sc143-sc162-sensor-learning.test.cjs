'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
const ids=Array.from({length:20},(_,i)=>'sensor-analog-apps-src-'+String(i+1).padStart(2,'0'));
const quizRepaired=new Set([1,11,12,15,16,17,18,19,20]);
test('SC143-162: 20 lesson-specific stories and 9 formerly generic quiz repairs',()=>{
 const L=QA.curriculum();
 vm.runInNewContext(read('tutorial-next50-guidance.js'),{window:{DTSTutorialLessons:L}});
 const original=new Map(ids.map(id=>[id,JSON.stringify({project:L.byId[id].project,steps:L.byId[id].steps,kind:L.byId[id].kind,review:L.byId[id].pedagogyReview,quiz:L.byId[id].quiz,goal:L.byId[id].learningGoal})]));
 const old=new Map(ids.map(id=>[id,{question:L.byId[id].quiz.question,steps:L.byId[id].beginnerSteps.length,explanation:L.byId[id].explanation}]));
 const ctx={window:{DTSTutorialLessons:L}};
 vm.runInNewContext(read('tutorial-sensor-first20-stories.js'),ctx);
 const stories=new Set(),questions=new Set();let replaced=0;
 for(let i=0;i<20;i++){
  const id=ids[i],l=L.byId[id],b=old.get(id),prev=JSON.parse(original.get(id));
  assert.equal(l.sensorStoryVersion,'20261024-sensor-first20-story1');
  assert.equal(JSON.stringify({project:l.project,steps:l.steps,kind:l.kind,review:l.pedagogyReview,goal:l.learningGoal}),JSON.stringify({project:prev.project,steps:prev.steps,kind:prev.kind,review:prev.review,goal:prev.goal}),'protected graph or native acceptance changed: '+id);
  assert.equal(l.beginnerSteps.length,b.steps+1,id);
  assert.ok(l.explanation.endsWith(b.explanation),'previous technical explanation lost '+id);
  const story=l.beginnerSteps[0];assert.ok(story.startsWith('Önce günlük örneği düşün: '),id);assert.ok(!stories.has(story),'duplicate '+id);stories.add(story);
  assert.equal(l.quiz.answer,0);assert.equal(l.quiz.options.length,3);assert.ok(!questions.has(l.quiz.question));questions.add(l.quiz.question);
  if(quizRepaired.has(i+1)){
   assert.notEqual(l.quiz.question,b.question,'generic quiz not replaced '+id);replaced++;
  }else assert.deepEqual(JSON.parse(JSON.stringify(l.quiz)),prev.quiz,'accepted quiz changed '+id);
  if([15,17,18,19].includes(i+1)){
   assert.equal(l.kind,'quiz');assert.equal(!!l.project.referenceOnly,true);
   assert.equal(l.learningSupport.nonWorkingDiagramWarning,true);
  }
  assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
 }
 assert.equal(stories.size,20);assert.equal(replaced,9);
 vm.runInNewContext(read('tutorial-sensor-first20-stories.js'),ctx);
 assert.equal(L.byId[ids[0]].beginnerSteps.length,old.get(ids[0]).steps+1,'double application');
});
test('SC143-162: sensor overlay loads after global guidance in tutorial UI',()=>{
 const loader=read('tutorial-mode.js');
 const a=loader.indexOf('tutorial-next50-guidance.js?v=');
 const b=loader.indexOf('tutorial-sensor-first20-stories.js?v=');
 assert.ok(a>=0&&b>a,'sensor teaching module must load after established acceptance flags');
});
