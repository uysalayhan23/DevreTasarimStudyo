'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'../dist',name),'utf8');
test('SC102-111: grounding pedagogy is specific and canonical wiring unchanged',()=>{
 const base=require('../dist/tutorial-source-outline.js');
 const ids=Array.from({length:10},(_,i)=>'installation-grounding-src-'+String(i+1).padStart(2,'0'));
 const before=new Map(ids.map(id=>[id,JSON.stringify({project:base.byId[id]?.project,steps:base.byId[id]?.steps})]));
 const L=JSON.parse(JSON.stringify(base)),ctx={window:{DTSTutorialLessons:L}};
 vm.runInNewContext(read('tutorial-grounding-first10-specific.js'),ctx);
 const questions=new Set();
 for(const id of ids){
  const l=L.byId[id];assert.ok(l,id);
  assert.equal(JSON.stringify({project:l.project,steps:l.steps}),before.get(id),'canonical graph changed '+id);
  assert.equal(l.beginnerSteps.length,3);
  assert.equal(l.quiz.options.length,3);
  assert.equal(l.quiz.answer,0);
  assert.ok(!questions.has(l.quiz.question),'duplicate question '+id);questions.add(l.quiz.question);
  assert.match(l.explanation,/gerçek saha bağlantısı değildir/);
  assert.equal(l.pedagogyReview.sourceOutlineConceptual,true);
  assert.equal(l.pedagogyReview.simulationAcceptance,false);
  assert.equal(l.pedagogyReview.visualAcceptance,false);
 }
 assert.equal(questions.size,10);
 const loader=read('tutorial-mode.js');
 assert.ok(loader.indexOf('tutorial-grounding-first10-specific.js?v=')>loader.indexOf('tutorial-source-first20-specific.js?v='));
});
