'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
function fixture(){const L=QA.curriculum(),ctx={window:{DTSTutorialLessons:L}};
 for(const file of ['tutorial-oscillator-source-batch-z.js','tutorial-oscillator-filter-truth-batch-aa.js'])vm.runInNewContext(read(file),ctx,{filename:file});
 return {L,ctx};}
const ids=Array.from({length:20},(_,i)=>'oscillator-filter-apps-src-'+String(i+2).padStart(2,'0'));
test('SC183-202: 20 unique everyday stories; electrical graph, lesson steps and acceptance never changed',()=>{
 const {L,ctx}=fixture();
 const previous=new Map(ids.map(id=>{const l=L.byId[id];return[id,{project:JSON.stringify(l.project),steps:JSON.stringify(l.steps),review:JSON.stringify(l.pedagogyReview),quiz:JSON.stringify(l.quiz),explanation:l.explanation,count:l.beginnerSteps?.length||0}]}));
 vm.runInNewContext(read('tutorial-sc183-sc202-stories.js'),ctx);
 const stories=new Set();for(const id of ids){const l=L.byId[id],old=previous.get(id);
  assert.equal(l.sc183To202Story,'20261024-sc183-sc202-1');assert.equal(JSON.stringify(l.project),old.project,id+' canonical graph');
  assert.equal(JSON.stringify(l.steps),old.steps,id+' steps');assert.equal(JSON.stringify(l.pedagogyReview),old.review,id+' acceptance');
  assert.equal(l.beginnerSteps.length,old.count+1,id+' beginner step');assert.ok(l.explanation.endsWith(old.explanation),id);
  const story=l.beginnerSteps[0];assert.match(story,/^Günlük örnek: /);assert.ok(!stories.has(story),'repeated story '+id);stories.add(story);
  if(id==='oscillator-filter-apps-src-15'){
   assert.notEqual(JSON.stringify(l.quiz),old.quiz);assert.match(l.quiz.question,/NE555 PWM/);assert.equal(l.quiz.answer,0);
  }else assert.equal(JSON.stringify(l.quiz),old.quiz,'protected quiz changed '+id);
  assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
 }
 assert.equal(stories.size,20);
 for(const i of [2,3,4,5,11,12]){const l=L.byId['oscillator-filter-apps-src-'+String(i).padStart(2,'0')];assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);assert.equal(l.project.wires.length,0);}
 for(const i of [20,21]){const l=L.byId['oscillator-filter-apps-src-'+i];assert.match(l.title,/pasif/);assert.equal(l.pedagogyReview.nativeDynamicAcceptance===true,false);}
 vm.runInNewContext(read('tutorial-sc183-sc202-stories.js'),ctx);
 assert.equal(L.byId[ids[0]].beginnerSteps.length,previous.get(ids[0]).count+1,'idempotence');
});
test('SC183-202 overlay loads after accepted oscillator quiz and passive-filter truth modules',()=>{
 const s=read('tutorial-mode.js');
 const q=s.indexOf('tutorial-oscillator-source-batch-z.js?v='),t=s.indexOf('tutorial-oscillator-filter-truth-batch-aa.js?v='),n=s.indexOf('tutorial-sc183-sc202-stories.js?v=');
 assert.ok(q>=0&&t>q&&n>t,'source truth must load before independent examples');
});
