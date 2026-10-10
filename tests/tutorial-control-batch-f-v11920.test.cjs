'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const read=n=>fs.readFileSync(path.join(__dirname,'../dist',n),'utf8');
const names=['button-led','button-relay','seal-in'];
function make(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js'))),ctx={window:{DTSTutorialLessons:L}};
 const modules=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js'];
 for(const f of modules)vm.runInNewContext(read(f),ctx);
 const originals=new Map(ctx.window.DTSTutorialLessons.lessons.filter(l=>names.includes(l.topicId)).map(l=>[l.id,JSON.stringify({components:l.project.components,wires:l.project.wires,steps:l.steps})]));
 vm.runInNewContext(read('tutorial-control-batch-f.js'),ctx);
 const lib={window:{}};for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(f),lib);
 const defs=Object.fromEntries(lib.window.DTSDesignLibrary.extend(lib.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
 return {L:ctx.window.DTSTutorialLessons,originals,defs};
}
test('curriculum stays 1,655 lessons with 45 measurement, 10 DC and 13 distinctive control lessons',()=>{
 const {L}=make(),selected=L.lessons.filter(l=>names.includes(l.topicId));
 assert.equal(L.lessons.length,1655);
 assert.equal(selected.length,13);
 assert.equal(selected.filter(l=>l.designStandard==='rich-reference-v1').length,13);
 assert.equal(L.lessons.filter(l=>l.designStandard==='rich-reference-v1').length,68);
 assert.equal(L.lessons.filter(l=>l.topicId==='measurement-workshop').length,45);
 assert.equal(L.lessons.filter(l=>l.topicId==='dc-circuits').length,10);
 assert.equal(new Set(selected.map(l=>l.measurementUpgrade.question)).size,13);
});
test('preserve all real terminal wires, components and guided steps byte-for-byte',()=>{
 const {L,originals}=make();
 for(const l of L.lessons.filter(x=>names.includes(x.topicId))){
  const current=JSON.stringify({components:l.project.components,wires:l.project.wires,steps:l.steps});
  assert.equal(current,originals.get(l.id),l.id+' canonical circuit unexpectedly changed');
  assert.ok(l.learningGoal.length>45&&l.measurementUpgrade.task.length>50);
  assert.equal(l.quiz.options.length,3);
  assert.equal(l.pedagogyReview.visualAcceptance,false);
  assert.ok(l.explanation.includes('yalnız yazılımın sanal devre'),l.id);
 }
});
test('NO and NC buttons drive simulated LED in opposite default states without shortcuts',()=>{
 const {L,defs}=make();
 for(const [id,states] of [['button-led-1',[false,true,false]],['button-led-2',[true,false,true]]]){
  const p=JSON.parse(JSON.stringify(L.byId[id].project));
  const b=p.components.find(c=>c.id==='b'),led=p.components.find(c=>c.id==='l');
  for(const [i,pressed] of [false,true,false].entries()){
   b.state=pressed;
   const result=Simulation.solve(p,defs,{now:1000});
   assert.equal(result.stable,true,id);assert.equal(result.blocked,false,id);
   assert.equal(result.shortCircuit,false,id);assert.equal(!!led._active,states[i],id+' button '+pressed);
  }
 }
});
test('button relay energizes only while NO button held; indicator follows NO auxiliary contact',()=>{
 const {L,defs}=make();
 for(const id of ['button-relay-1','button-relay-2']){
  const p=JSON.parse(JSON.stringify(L.byId[id].project)),b=p.components.find(c=>c.id==='b'),k=p.components.find(c=>c.id==='k'),lamp=p.components.find(c=>c.id==='h');
  for(const pressed of [false,true,false]){
   b.state=pressed;const res=Simulation.solve(p,defs,{now:1000});
   assert.equal(res.stable,true);assert.equal(res.shortCircuit,false);
   assert.equal(!!k._active,pressed,id+' coil');
   if(lamp)assert.equal(!!lamp._active,pressed,id+' indicator');
  }
 }
});
test('all four seal-in projects retain Start latch then release, and Stop safely breaks hold',()=>{
 const {L,defs}=make();
 for(let i=1;i<=4;i++){
  const id='seal-in-'+i,p=JSON.parse(JSON.stringify(L.byId[id].project));
  const start=p.components.find(c=>c.id==='start'),stop=p.components.find(c=>c.id==='stop'),coil=p.components.find(c=>c.id==='coil');
  for(const [a,b,expected] of [[false,false,false],[true,false,true],[false,false,true],[false,true,false]]){
   start.state=a;stop.state=b;const res=Simulation.solve(p,defs,{now:1100});
   assert.equal(res.stable,true,id);assert.equal(res.blocked,false,id);assert.equal(res.shortCircuit,false,id);
   assert.equal(!!coil._active,expected,id+' start='+a+' stop='+b);
  }
 }
});
test('loader, coach questions and micro descriptions remain wired, with no extra canvas panel',()=>{
 const mode=read('tutorial-mode.js'),boot=read('tutorial-bootstrap.js'),html=read('index.html');
 assert.match(mode,/tutorial-control-batch-f\.js\?v=1\.19\.20-control-batch-f1/);
 assert.match(mode,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.match(mode,/data-measurement-upgrade-answer/);
 assert.match(mode,/DTSTutorialMicroHints\?\.sync/);
 assert.match(boot,/tutorial-mode\.js\?v=1\.19\.20-timer-batch-g1/);
 assert.match(html,/tutorial-bootstrap\.js\?rev=20261010-timer-batch-g1/);
 assert.doesNotMatch(read('tutorial-control-batch-f.js'),/\.innerHTML|#viewport|#tutorialCoach/);
});
