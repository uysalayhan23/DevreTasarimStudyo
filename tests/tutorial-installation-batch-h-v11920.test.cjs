'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,'../dist',n),'utf8');
const topics=['commutator','two-way','intermediate','bells'];
const ids=topics.flatMap(t=>[1,2,3,4].map(i=>t+'-'+i));
function curriculum(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 for(const n of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js'])vm.runInNewContext(read(n),ctx);
 const before=new Map(ids.map(id=>[id,JSON.stringify({components:L.byId[id].project.components,wires:L.byId[id].project.wires,steps:L.byId[id].steps})]));
 vm.runInNewContext(read('tutorial-installation-batch-h.js'),ctx);
 return {L,before};
}
test('Batch H 16/16 lessons and full 88/1655 code coverage',()=>{
 const {L}=curriculum();
 assert.equal(L.lessons.length,1655);
 assert.equal(ids.length,16);
 assert.equal(L.lessons.filter(l=>l.designStandard==='rich-reference-v1').length,88);
 for(const id of ids){
  const l=L.byId[id];assert.equal(l.designStandard,'rich-reference-v1',id);
  assert.equal(l.pedagogyReview.visualAcceptance,false,id);
  assert.equal(l.pedagogyReview.simulationAcceptance,false,id);
  assert.ok(l.measurementUpgrade.task.length>60,id);
  assert.equal(l.measurementUpgrade.options.length,3,id);
  assert.equal(l.quiz.answer,0,id);
 }
});
test('Batch H does not alter canonical components, wires, steps or terminal identity',()=>{
 const {L,before}=curriculum();
 for(const id of ids){
  const l=L.byId[id];
  assert.equal(JSON.stringify({components:l.project.components,wires:l.project.wires,steps:l.steps}),before.get(id),id);
  const components=new Set(l.project.components.map(c=>c.id));
  const terminalPairs=new Set(l.project.wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p])));
  assert.equal(l.steps.length,l.project.wires.length,id);
  for(const w of l.project.wires){assert.ok(components.has(w.from.c)&&components.has(w.to.c),id);}
  for(const s of l.steps){assert.ok(terminalPairs.has(JSON.stringify([s.from.c,s.from.p,s.to.c,s.to.p])),id);}
 }
});
test('source switch and button circuits retain expected distinct wiring',()=>{
 const {L}=curriculum();
 for(const id of ids){
  const l=L.byId[id],n=Number(id.split('-').at(-1)),topic=l.topicId,p=l.project;
  const expected=topic==='commutator'?6:topic==='two-way'?5:topic==='intermediate'?7:(2*Math.min(3,n)+1+(n===4?2:0));
  assert.equal(p.wires.length,expected,id);
  if(topic==='bells')assert.equal(p.components.filter(c=>c.typeId==='bell-push').length,Math.min(3,n),id);
  if(topic==='intermediate')assert.equal(p.components.filter(c=>c.typeId==='wall-intermediate').length,1,id);
 }
});
test('tutorial loader loads Batch H after canonical Batch G',()=>{
 const m=read('tutorial-mode.js'),h=read('tutorial-installation-batch-h.js'),a=m.indexOf("tutorial-timer-batch-g.js?v=1.19.20-timer-batch-g1"),b=m.indexOf("tutorial-installation-batch-h.js?v=1.19.20-installation-batch-h1");
 assert.ok(a>=0&&b>a);
 assert.match(m,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.doesNotMatch(h,/\.innerHTML|#viewport|#tutorialCoach|\.push\(W\(/);
});


test('fourth bell lesson recognizes B4 as fourth NO push without inventing a light circuit',()=>{
 const {L,before}=curriculum(),lesson=L.byId['bells-4'],p=lesson.project;
 assert.equal(p.components.filter(c=>['bell-push','bell-light-push'].includes(c.typeId)).length,4);
 assert.equal(p.components.find(c=>c.id==='bl')?.typeId,'bell-light-push');
 assert.equal(p.wires.filter(w=>w.from.c==='bl'||w.to.c==='bl').length,2);
 assert.equal(p.wires.length,9);
 assert.equal(JSON.stringify({components:p.components,wires:p.wires,steps:lesson.steps}),before.get('bells-4'));
 assert.match(lesson.measurementUpgrade.task,/B1, B2, B3 ve B4/);
 assert.match(lesson.measurementUpgrade.task,/simüle edilmez/);
 assert.match(lesson.learningGoal,/ayrı.*ışık devresi modellenmemiştir/);
 assert.equal(lesson.measurementUpgrade.illuminatedButtonModelled,false);
 assert.match(lesson.quiz.question,/B4/);
 assert.match(lesson.quiz.options[0],/13\/14 NO/);
});
