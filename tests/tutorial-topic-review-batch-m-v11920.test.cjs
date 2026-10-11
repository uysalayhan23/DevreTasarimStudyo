'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=n=>fs.readFileSync(path.resolve(__dirname,'../dist',n),'utf8');
function loaded(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const ctx={window:{DTSTutorialLessons:L}};
 for(const n of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js','tutorial-next-batch-i.js','tutorial-sensor-batch-j.js','tutorial-motor-batch-k.js','tutorial-dual-dc-batch-l.js'])
  vm.runInNewContext(read(n),ctx,{filename:n});
 return {L,ctx};
}
test('Batch M replaces generic repeated quiz questions in exactly 1519 non-rich lessons',()=>{
 const {L,ctx}=loaded();
 const before=new Map(L.lessons.map(l=>[l.id,JSON.stringify(l.project)]));
 const accepted=L.lessons.filter(l=>l.designStandard==='rich-reference-v1'),acceptedBefore=accepted.map(l=>JSON.stringify(l));
 vm.runInNewContext(read('tutorial-topic-review-batch-m.js'),ctx);
 const s=L.topicReviewBatchM;
 assert.equal(L.lessons.length,1655);
 assert.equal(s.scanned,1519);
 assert.equal(s.replaced,1519);
 assert.equal(s.richUntouched,136);
 assert.equal(s.keptNonGeneric,0);
 assert.equal(s.missingRules.length,0);
 for(const l of L.lessons){
  assert.equal(JSON.stringify(l.project),before.get(l.id),'canonical graph changed '+l.id);
  if(l.designStandard==='rich-reference-v1')assert.equal(l.topicReview,undefined);
  else{
   assert.equal(l.topicReview.version,'topic-review-m1');
   assert.equal(l.topicReview.visualAcceptance,false);
   assert.equal(l.topicReview.simulationAcceptance,false);
   assert.match(l.quiz.question,/konusunda hangi (temel )?teknik ilke doğrudur/);
   assert.equal(l.quiz.options.length,3);
   assert.equal(l.quiz.answer,0);
   assert.ok(l.quiz.options.every(o=>typeof o==='string'&&o.length>=18),l.id);
  }
 }
 assert.deepEqual(accepted.map(l=>JSON.stringify(l)),acceptedBefore);
 assert.ok(new Set(L.lessons.filter(l=>l.topicReview).map(l=>l.quiz.question)).size>=1500);
});
test('Batch M does not claim rich or physical acceptance and remains idempotent',()=>{
 const {L,ctx}=loaded();
 vm.runInNewContext(read('tutorial-topic-review-batch-m.js'),ctx);
 const first=L.lessons.map(l=>JSON.stringify(l.quiz));
 vm.runInNewContext(read('tutorial-topic-review-batch-m.js'),ctx);
 assert.deepEqual(L.lessons.map(l=>JSON.stringify(l.quiz)),first);
 assert.equal(L.lessons.filter(l=>l.designStandard==='rich-reference-v1').length,136);
 assert.match(read('tutorial-mode.js'),/tutorial-topic-review-batch-m\.js\?v=/);
});
