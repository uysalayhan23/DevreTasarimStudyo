'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const read=file=>fs.readFileSync(path.join(__dirname,'../dist',file),'utf8');
function load(){
 require('../dist/tutorial-lessons.js');
 const t={window:{DTSTutorialLessons:require('../dist/tutorial-source-outline.js')}};
 vm.runInNewContext(read('tutorial-pedagogy.js'),t);
 vm.runInNewContext(read('tutorial-measurement-batch-a.js'),t);
 const env={window:{}};
 for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(f),env);
 return {L:t.window.DTSTutorialLessons,defs:Object.fromEntries(env.window.DTSDesignLibrary.extend(env.window.COMPONENT_LIBRARY).map(d=>[d.id,d]))};
}
const numbers=['011','012','013','014','015','031','032','042','043'];
const isVoltage=id=>!['015','032','043'].includes(id.slice(-3));
test('measurement workshop remains 45 lessons and first nine generic topics are personalized rich practice',()=>{
 const {L}=load(),rows=L.lessons.filter(x=>x.topicId==='measurement-workshop');
 assert.equal(rows.length,45);assert.equal(rows.filter(x=>x.measurementUpgrade).length,9);
 const seen=new Set();
 for(const n of numbers){
  const id='measurement-workshop-outline-'+n,x=L.byId[id],u=x.measurementUpgrade;
  assert.ok(u,id);assert.equal(x.kind,'wiring');
  assert.equal(x.pedagogyReview.canonicalLabSource,isVoltage(id)?'measurement-workshop-src-01':'measurement-workshop-src-02');
  assert.equal(x.designStandard,'rich-reference-v1');
  assert.ok(u.heading.length>10&&u.goal.length>30&&u.task.length>30);
  assert.ok(u.options.length===3&&u.question.length>15);seen.add(u.question);
  assert.ok(x.project.components.some(c=>c.typeId==='unit-ut33d-plus'));
  assert.ok(x.project.components.some(c=>c.typeId==='test-probe-red'));
  assert.ok(x.project.components.some(c=>c.typeId==='test-probe-black'));
  assert.ok(x.project.components.some(c=>c.typeId==='arduino-bench-supply'));
  assert.ok(x.steps.length>=1);
  const keys=new Set(x.project.wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p])));
  for(const s of x.steps)assert.ok(keys.has(JSON.stringify([s.from.c,s.from.p,s.to.c,s.to.p])),id+' guide matches physical wire');
  assert.equal(x.project.tutorialLesson.id,id);
 }
 assert.equal(seen.size,9,'each lesson must contain a distinct question');
 for(const id of ['measurement-workshop-src-01','measurement-workshop-src-02','measurement-workshop-src-03'])assert.equal(L.byId[id].measurementUpgrade,undefined,'golden lab is unchanged');
});
test('nine lab variants retain actual live measurement values, never fabricated static readouts',()=>{
 const {L,defs}=load();
 for(const n of numbers){
  const id='measurement-workshop-outline-'+n,p=L.byId[id].project,meter=p.components.find(c=>c.typeId==='unit-ut33d-plus');
  const res=Simulation.solve(p,defs,{now:0});
  assert.equal(res.stable,true,id);assert.equal(res.blocked,false,id);assert.equal(res.shortCircuit,false,id);
  assert.ok(meter._meter,id+' working UNI-T meter');
  if(isVoltage(id)){assert.equal(meter._meter.mode,'DCV');assert.ok(Math.abs(meter._meter.value-24)<.05,id+' expected +24 V')}
  else {assert.equal(meter._meter.mode,'DCA');assert.ok(Math.abs(meter._meter.value-.024)<.001,id+' expected +24 mA')}
 }
});
test('rich floating note, working answer feedback and guided rebuild are wired only to measurement variants',()=>{
 const m=read('tutorial-mode.js'),css=read('tutorial.css');
 assert.match(m,/tutorial-measurement-batch-a\.js\?v=1\.19\.20-batch-a1/);
 assert.match(m,/function measurementUpgradeCard\(l,session,project\)/);
 assert.match(m,/measurementUpgradeCard\(l,s,project\)\+noteHtml\(l,s,project\)/);
 assert.match(m,/data-measurement-upgrade-answer/);
 assert.match(m,/measurementFeedback=answer===0/);
 assert.match(m,/l\.measurementUpgrade&&l\.project\?\.tutorialExplore\?\.type==='voltage-measurement-rich'/);
 assert.match(m,/l\.measurementUpgrade&&l\.project\?\.tutorialExplore\?\.type==='current-measurement-rich'/);
 const only=css.slice(css.lastIndexOf('/* MQ-07 measurement subtopic specialization'));
 assert.match(only,/#tutorialCoach \.measurement-upgrade-card/);
 assert.match(only,/#tutorialCoach \.measurement-upgrade-answers button/);
 assert.doesNotMatch(only,/#viewport|\.workspace-wrap|#tutorialCoach\s*\{|(?:^|[;{])\s*(?:left|right|top|bottom|position|resize)\s*:/);
});
