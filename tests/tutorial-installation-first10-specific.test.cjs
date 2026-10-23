'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
test('SC112-121: ten unique installation lessons retain source circuits',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const ids=Array.from({length:10},(_,i)=>'installation-systems-src-'+String(i+1).padStart(2,'0'));
 const before=new Map(ids.map(id=>[id,JSON.stringify({project:L.byId[id]?.project,steps:L.byId[id]?.steps})]));
 vm.runInNewContext(read('tutorial-installation-first10-specific.js'),{window:{DTSTutorialLessons:L}});
 const questions=new Set();
 for(const id of ids){
  const l=L.byId[id];assert.ok(l,id);
  assert.equal(JSON.stringify({project:l.project,steps:l.steps}),before.get(id),'canonical changes '+id);
  assert.equal(l.beginnerSteps.length,3);assert.equal(l.quiz.options.length,3);assert.equal(l.quiz.answer,0);
  assert.ok(!questions.has(l.quiz.question));questions.add(l.quiz.question);
  assert.match(l.explanation,/gerçek sahada doğrulanmış bir kablolu uygulama değildir/);
  assert.equal(l.pedagogyReview.visualAcceptance,false);
  assert.equal(l.pedagogyReview.simulationAcceptance,false);
 }
 assert.equal(questions.size,10);
 const mode=read('tutorial-mode.js');
 assert.ok(mode.indexOf('tutorial-installation-first10-specific.js?v=')>mode.indexOf('tutorial-grounding-first10-specific.js?v='));
});
