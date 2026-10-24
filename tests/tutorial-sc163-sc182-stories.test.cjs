'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
const list=['sensor-analog-apps-src-21','sensor-analog-apps-src-22',...Array.from({length:17},(_,i)=>'opamp-apps-src-'+String(i+1).padStart(2,'0')),'oscillator-filter-apps-src-01'];
const quizChanges=new Set(['sensor-analog-apps-src-21','sensor-analog-apps-src-22','oscillator-filter-apps-src-01']);
test('SC163-182: 20 distinct narratives and all canonical/native PASS locks unchanged',()=>{
 const L=QA.curriculum(),ctx={window:{DTSTutorialLessons:L}};
 vm.runInNewContext(read('tutorial-opamp-source-batch-y.js'),ctx);
 const originals=new Map(list.map(id=>[id,{graph:JSON.stringify(L.byId[id].project),steps:JSON.stringify(L.byId[id].steps),review:JSON.stringify(L.byId[id].pedagogyReview),quiz:JSON.stringify(L.byId[id].quiz),intro:L.byId[id].explanation,stepCount:L.byId[id].beginnerSteps.length}]));
 vm.runInNewContext(read('tutorial-sc163-sc182-stories.js'),ctx);
 const stories=new Set(),questions=new Set();
 for(const id of list){
  const l=L.byId[id],b=originals.get(id);assert.equal(l.sc163To182Story,'20261024-sc163-sc182-1');
  assert.equal(JSON.stringify(l.project),b.graph,id+' project changed');assert.equal(JSON.stringify(l.steps),b.steps,id+' native guided steps changed');
  assert.equal(JSON.stringify(l.pedagogyReview),b.review,id+' status changed');assert.equal(l.beginnerSteps.length,b.stepCount+1,id+' story missing');
  assert.ok(l.explanation.endsWith(b.intro),id+' technical narrative lost');
  const story=l.beginnerSteps[0];assert.match(story,/^Günlük örnek: /);assert.ok(!stories.has(story),'duplicate story');stories.add(story);
  assert.equal(l.quiz.options.length,3);assert.equal(l.quiz.answer,0);assert.ok(!questions.has(l.quiz.question),'quiz duplicate '+id);questions.add(l.quiz.question);
  if(quizChanges.has(id))assert.notEqual(JSON.stringify(l.quiz),b.quiz,id+' question remained generic');
  else assert.equal(JSON.stringify(l.quiz),b.quiz,id+' protected quiz changed');
 }
 assert.equal(stories.size,20);assert.equal(questions.size,20);
 vm.runInNewContext(read('tutorial-sc163-sc182-stories.js'),ctx);
 assert.equal(L.byId[list[0]].beginnerSteps.length,originals.get(list[0]).stepCount+1,'overlay repeated');
});
test('SC163-182 stories loaded after source-specific technical quizzes',()=>{
 const loader=read('tutorial-mode.js');const before=loader.indexOf('tutorial-opamp-source-batch-y.js?v='),after=loader.indexOf('tutorial-sc163-sc182-stories.js?v=');
 assert.ok(before>=0&&after>before,'source-specific opamp teaching must be kept before 20-lesson narratives');
});
