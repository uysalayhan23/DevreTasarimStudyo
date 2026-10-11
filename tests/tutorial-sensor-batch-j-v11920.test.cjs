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
 assert.ok(m.indexOf('tutorial-sensor-batch-j.js?v=1.19.20-sensor-batch-j2')>m.indexOf('tutorial-next-batch-i.js?v=1.19.20-next-batch-i1'));
 assert.doesNotMatch(j,/\.innerHTML|#viewport|\.push\(W\(/);
});


test('open collector lessons distinguish PNP/NPN and verify PNP pull-down metadata',()=>{
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
  assert.equal(lesson.measurementUpgrade.sourceCorrectionRequired,false);
 }
 assert.match(L.byId['open-collector-1'].learningGoal,/PNP/);
 assert.match(L.byId['open-collector-1'].learningGoal,/yoktur/);
 assert.match(L.byId['open-collector-2'].learningGoal,/NPN/);
 assert.match(L.byId['open-collector-2'].learningGoal,/R1/);
 const suspect=L.byId['open-collector-3'];
 assert.equal(suspect.project.components.find(c=>c.id==='s').typeId,'proximity');
 assert.ok(suspect.project.wires.some(w=>w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='r'&&w.to.p==='1'));
 assert.ok(suspect.project.wires.some(w=>w.from.c==='r'&&w.from.p==='2'&&w.to.c==='s'&&w.to.p==='BK'));
 assert.equal(suspect.project.components.find(c=>c.id==='r').resistance,10000);
 assert.equal(suspect.pedagogyReview.sourceStatus,'source-solver-checked-windows-acceptance-open');
 assert.equal(suspect.pedagogyReview.sourceSolverVerified,true);
 assert.match(suspect.measurementUpgrade.task,/10 kΩ/);
 assert.match(suspect.measurementUpgrade.task,/0 mA/);
 assert.match(L.byId['open-collector-4'].learningGoal,/paralel/);
});


test('physical topology audit: no open-collector lesson has passive resistor-fed H1 with sensor open',()=>{
 const L=require('../dist/tutorial-source-outline.js');
 // Graph includes real wires plus passive R1 and H1; NO current can travel through a
 // sensor's BK output here because that transistor is deliberately treated as open.
 // This is topology evidence, NOT an assertion of lamp brightness or solver current.
 function passiveFeed(project){
  const nodes=new Map(),name=(id,pin)=>id+':'+pin;
  function join(a,b){
   if(!nodes.has(a))nodes.set(a,new Set());
   if(!nodes.has(b))nodes.set(b,new Set());
   nodes.get(a).add(b);nodes.get(b).add(a);
  }
  for(const w of project.wires)join(name(w.from.c,w.from.p),name(w.to.c,w.to.p));
  if(project.components.some(c=>c.id==='r'&&c.typeId==='resistor'))join('r:1','r:2');
  if(project.components.some(c=>c.id==='h'&&c.typeId==='lamp-green'))join('h:X1','h:X2');
  const seen=new Set(['g1:P']),queue=['g1:P'];
  for(let i=0;i<queue.length;i++)for(const next of nodes.get(queue[i])||[])
   if(!seen.has(next)){seen.add(next);queue.push(next);}
  return seen.has('g1:M');
 }
 for(let n=1;n<=4;n++)assert.equal(
  passiveFeed(L.byId['open-collector-'+n].project),false,
  'unexpected resistor-fed lamp topology in open-collector-'+n
 );
});
