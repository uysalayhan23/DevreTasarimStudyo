'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.join(__dirname,'../dist'),read=n=>fs.readFileSync(path.join(dist,n),'utf8');
test('SC082–101: each source lesson has a distinct specific quiz without canonical rewiring',()=>{
 const base=require('../dist/tutorial-source-outline.js');
 const L=JSON.parse(JSON.stringify(base)),ids=Array.from({length:20},(_,i)=>(i<10?'dc-circuits':'measurement-workshop')+'-src-'+String(i%10+1).padStart(2,'0'));
 const before=new Map(ids.map(id=>[id,JSON.stringify({project:L.byId[id]?.project,steps:L.byId[id]?.steps})]));
 const ctx={window:{DTSTutorialLessons:L}};
 vm.runInNewContext(read('tutorial-source-first20-specific.js'),ctx,{filename:'tutorial-source-first20-specific.js'});
 const seen=new Set();
 for(const id of ids){
  const l=L.byId[id];assert.ok(l,'missing '+id);
  assert.equal(JSON.stringify({project:l.project,steps:l.steps}),before.get(id),'canonical topology mutated '+id);
  assert.ok(l.explanation.length>60,'too short '+id);
  assert.equal(l.beginnerSteps.length,3,'missing guided steps '+id);
  assert.ok(l.beginnerSteps[0].startsWith('Örneği düşün:'),'missing scenario '+id);
  assert.ok(l.learningGoal.length>20,'missing specific goal '+id);
  assert.match(l.explanation,/konuya özel kablolu deney olarak doğrulanmış değildir/,'unverified diagram must not be represented as working '+id);
  assert.equal(l.quiz.answer,0);
  assert.equal(l.quiz.options.length,3);
  assert.ok(!seen.has(l.quiz.question),'duplicate questions '+id);seen.add(l.quiz.question);
  assert.equal(l.pedagogyReview.sourceOutlineConceptual,true);
  assert.equal(l.pedagogyReview.simulationAcceptance,false);
  assert.equal(l.pedagogyReview.visualAcceptance,false);
 }
 vm.runInNewContext(read('tutorial-source-first20-specific.js'),ctx);
 assert.equal(seen.size,20);
 const mode=read('tutorial-mode.js');
 assert.ok(mode.indexOf('tutorial-source-first20-specific.js?v=')>mode.indexOf('tutorial-curriculum.js?v='),'source-specific overlay must load after curriculum');
});
