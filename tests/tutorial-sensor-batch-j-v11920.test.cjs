'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,'../dist',n),'utf8');
test('Batch J preserves 16 source sensor graphs, guided terminal steps, and 120 rich lessons',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 const chain=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js','tutorial-next-batch-i.js'];
 for(const x of chain)vm.runInNewContext(read(x),ctx);
 const names=['pnp-npn','inductive-capacitive','source-sink','open-collector'];
 const ids=names.flatMap(t=>[1,2,3,4].map(i=>t+'-'+i));
 const before=ids.map(id=>JSON.stringify({components:L.byId[id].project.components,wires:L.byId[id].project.wires,steps:L.byId[id].steps}));
 vm.runInNewContext(read('tutorial-sensor-batch-j.js'),ctx);
 assert.equal(L.lessons.length,1655);assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,120);
 ids.forEach((id,i)=>{const x=L.byId[id];assert.equal(JSON.stringify({components:x.project.components,wires:x.project.wires,steps:x.steps}),before[i],id);assert.equal(x.pedagogyReview.visualAcceptance,false);assert.equal(x.pedagogyReview.simulationAcceptance,false);assert.equal(x.measurementUpgrade.options.length,3);});
});
test('Batch J is loaded after Batch I and does not edit viewport or wiring',()=>{
 const m=read('tutorial-mode.js'),j=read('tutorial-sensor-batch-j.js');
 assert.ok(m.indexOf('tutorial-sensor-batch-j.js?v=1.19.20-sensor-batch-j1')>m.indexOf('tutorial-next-batch-i.js?v=1.19.20-next-batch-i1'));
 assert.doesNotMatch(j,/\.innerHTML|#viewport|\.push\(W\(/);
});


test('open collector lessons distinguish PNP/NPN and flag resistor-fed PNP indicator',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const ctx={window:{DTSTutorialLessons:L}};
 for(const file of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js','tutorial-timer-batch-g.js','tutorial-installation-batch-h.js','tutorial-next-batch-i.js'])
  vm.runInNewContext(read(file),ctx);
 const before=[1,2,3,4].map(n=>JSON.stringify(L.byId['open-collector-'+n].project));
 vm.runInNewContext(read('tutorial-sensor-batch-j.js'),ctx);
 for(let n=1;n<=4;n++){
  const lesson=L.byId['open-collector-'+n],p=lesson.project;
  assert.equal(JSON.stringify(p),before[n-1],'canonical project changed '+n);
  assert.equal(p.components.some(c=>c.id==='r'&&c.typeId==='resistor'),n>=3);
  assert.equal(lesson.pedagogyReview.visualAcceptance,false);
  assert.equal(lesson.pedagogyReview.simulationAcceptance,false);
  assert.equal(lesson.quiz.options.length,3);
  assert.equal(lesson.measurementUpgrade.sourceCorrectionRequired,n===3);
 }
 assert.match(L.byId['open-collector-1'].learningGoal,/PNP/);
 assert.match(L.byId['open-collector-1'].learningGoal,/yoktur/);
 assert.match(L.byId['open-collector-2'].learningGoal,/NPN/);
 assert.match(L.byId['open-collector-2'].learningGoal,/R1/);
 const suspect=L.byId['open-collector-3'];
 assert.equal(suspect.project.components.find(c=>c.id==='s').typeId,'proximity');
 assert.ok(suspect.project.wires.some(w=>w.from.c==='g1'&&w.from.p==='P'&&w.to.c==='r'&&w.to.p==='1'));
 assert.ok(suspect.project.wires.some(w=>w.from.c==='r'&&w.from.p==='2'&&w.to.c==='s'&&w.to.p==='BK'));
 assert.equal(suspect.pedagogyReview.sourceStatus,'canonical-graph-physical-review-required');
 assert.match(suspect.measurementUpgrade.task,/sensörden bağımsız/);
 assert.match(L.byId['open-collector-4'].learningGoal,/paralel/);
});
