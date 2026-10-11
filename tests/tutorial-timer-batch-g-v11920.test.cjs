'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
const rows=[['timer-flipflop-1',1,1],['timer-flipflop-2',.5,1.5],['timer-flipflop-3',1.5,.5],['timer-flipflop-4',1,1]];
function load(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 const files=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js','tutorial-control-batch-f.js'];
 for(const f of files)vm.runInNewContext(read(f),ctx);
 const original=new Map(rows.map(([id])=>{const l=L.byId[id];return [id,JSON.stringify({wires:l.project.wires,steps:l.steps})]}));
 vm.runInNewContext(read('tutorial-timer-batch-g.js'),ctx);
 const lib={window:{}};for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(f),lib);
 const defs=Object.fromEntries(lib.window.DTSDesignLibrary.extend(lib.window.COMPONENT_LIBRARY).map(x=>[x.id,x]));
 return {L:ctx.window.DTSTutorialLessons,original,defs};
}
test('all 72 rich lessons retain source, and 4 flasher lessons have independent learning objectives',()=>{
 const {L}=load();
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(l=>l.designStandard==='rich-reference-v1').length,72);
 assert.equal(new Set(rows.map(([id])=>L.byId[id].measurementUpgrade.question)).size,4);
 for(const [id,on,off] of rows){const lesson=L.byId[id],t=lesson.project.components.find(c=>c.id==='t');
  assert.equal(t.flashOn,on);assert.equal(t.flashOff,off);assert.equal(lesson.designStandard,'rich-reference-v1');
  assert.ok(lesson.learningGoal.length>40);assert.equal(lesson.pedagogyReview.visualAcceptance,false);}
});
test('all original four flasher wiring graphs and student terminal steps are preserved',()=>{
 const {L,original}=load();
 for(const [id] of rows){const l=L.byId[id];assert.equal(JSON.stringify({wires:l.project.wires,steps:l.steps}),original.get(id),id+' original wires changed');assert.equal(l.steps.length,8)}
});
test('real timing model drives complementary green/red lights through 1/1 and asymmetric intervals',()=>{
 const {L,defs}=load();
 for(const [id,on,off] of rows){
  const p=JSON.parse(JSON.stringify(L.byId[id].project)),green=p.components.find(c=>c.id==='g'),red=p.components.find(c=>c.id==='r');
  for(const now of [0,200,600,1200,1600,2100,2700]){
   const x=Simulation.solve(p,defs,{now});
   assert.equal(x.stable,true,id+' '+now);assert.equal(x.shortCircuit,false,id+' '+now);
   assert.equal(x.blocked,false,id+' '+now);
   const expected=((now/1000)%(on+off))<on;
   assert.equal(!!green._active,expected,id+' green '+now);
   assert.equal(!!red._active,!expected,id+' red '+now);
  }
 }
});
test('current floating teacher loads timed courses and micro hints without an extra canvas panel',()=>{
 const m=read('tutorial-mode.js'),b=read('tutorial-bootstrap.js'),html=read('index.html');
 assert.match(m,/tutorial-timer-batch-g\.js\?v=1\.19\.20-timer-batch-g1/);
 assert.match(m,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.match(m,/DTSTutorialMicroHints\?\.sync/);
 assert.match(b,/tutorial-mode\.js\?v=20261011-topic-review-m1/);
 assert.match(html,/tutorial-bootstrap\.js\?rev=20261011-topic-review-m1/);
 assert.doesNotMatch(read('tutorial-timer-batch-g.js'),/#viewport|innerHTML|document\.createElement/);
});
