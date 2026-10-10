'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js'),Arduino=require('../dist/arduino-runtime.js');
const read=name=>fs.readFileSync(path.join(__dirname,'../dist',name),'utf8');
function setup(){
 const ctx={window:{DTSTutorialLessons:require('../dist/tutorial-source-outline.js')}};
 for(const f of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js'])vm.runInNewContext(read(f),ctx);
 const win={window:{}};
 for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(f),win);
 const byId=Object.fromEntries(win.window.DTSDesignLibrary.extend(win.window.COMPONENT_LIBRARY).map(x=>[x.id,x]));
 return {L:ctx.window.DTSTutorialLessons,byId};
}
const names=['016','033','034','044','045'];
test('measurement workshop retains 45 lessons and batch B contains five distinct student exercises',()=>{
 const {L}=setup(),rows=L.lessons.filter(x=>x.topicId==='measurement-workshop');
 assert.equal(rows.length,45);
 const questions=new Set();
 for(const n of names){const x=L.byId['measurement-workshop-outline-'+n],u=x.measurementUpgrade;
  assert.ok(u,x.id);assert.equal(x.designStandard,'rich-reference-v1');assert.ok(x.learningGoal?.length>35);
  assert.ok(u.goal.length>45&&u.task.length>40&&u.question.length>18);assert.equal(u.options.length,3);
  questions.add(u.question);assert.ok(x.project.components.length>=2);assert.ok(x.project.wires.length>=2);
  for(const s of x.steps)assert.ok(x.project.wires.some(w=>JSON.stringify(w.from)===JSON.stringify(s.from)&&JSON.stringify(w.to)===JSON.stringify(s.to)),x.id+' invalid terminal');
 }
 assert.equal(questions.size,5);
 for(const id of ['measurement-workshop-src-04','measurement-workshop-src-05','measurement-workshop-src-06','measurement-workshop-src-07'])assert.equal(L.byId[id].measurementUpgrade,undefined,'canonical source untouched');
});
test('three oscilloscope laboratories simulate correct triggered frequencies, sampled trace and amplitude',()=>{
 const {L,byId}=setup();
 for(const n of ['016','044','045']){
  const p=L.byId['measurement-workshop-outline-'+n].project,fg=p.components.find(c=>c.id==='fg'),osc=p.components.find(c=>c.id==='osc');
  assert.equal(p.workspaceMode,'arduino');assert.equal(p.tutorialExplore.type,'scope-waveform-rich');
  assert.equal(fg.typeId,'arduino-signal-generator');assert.equal(osc.typeId,'arduino-oscilloscope');
  const wires=new Set(p.wires.map(w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p));
  assert.ok(wires.has('fg/OUT>osc/CH1'));assert.ok(wires.has('fg/GND>osc/GND'));
  for(const [hz,spanMs] of [[50,100],[1000,10],[10000,2]]){
   fg.generatorFrequency=hz;osc.scopeTimeMs=spanMs;
   const result=Arduino.tick(p,byId,{now:123456});
   assert.equal(result.errors.length,0);
   assert.equal(osc._scopeGrounded,true);assert.equal(osc._scopeTriggered,true);
   assert.ok(Math.abs(osc._scopeStats1.freq-hz)<.01,'measured '+hz+' Hz');
   assert.ok(Math.abs(osc._scopeStats1.vpp-5)<.02,'measured 5 Vpp');
   assert.ok(osc._scopeTrace1.length>=240,'waveform samples');
  }
 }
});
test('removing oscilloscope GND produces no valid waveform rather than a fabricated measurement',()=>{
 const {L,byId}=setup(),p=L.byId['measurement-workshop-outline-045'].project,osc=p.components.find(c=>c.id==='osc');
 p.wires=p.wires.filter(w=>w.to.p!=='GND');Arduino.tick(p,byId,{now:123456});
 assert.equal(osc._scopeGrounded,false);assert.equal(osc._scopeStats1.vpp,0);assert.equal(osc._scopeTriggered,false);
});
test('clamp and frequency lessons retain live UNI-T measurements',()=>{
 const {L,byId}=setup();
 for(const n of ['033','034']){const p=L.byId['measurement-workshop-outline-'+n].project,res=Simulation.solve(p,byId,{now:0});
  assert.equal(res.stable,true);assert.equal(res.blocked,false);assert.equal(res.shortCircuit,false);
  if(n==='033'){assert.equal(p.tutorialExplore.type,'clamp-current-measurement-rich');const m=p.components.find(c=>c.typeId==='unit-ut200a');assert.equal(m._clamp.warning,'');assert.ok(Math.abs(m._clamp.value-1)<.02)}
  else{assert.equal(p.tutorialExplore.type,'frequency-measurement-rich');const m=p.components.find(c=>c.typeId==='unit-ut61e-plus');assert.ok(Math.abs(m._meter.value-1000)<.1)}
 }
});
test('scope presets are wired to real Arduino runtime and occupy only the existing floating tutor',()=>{
 const mode=read('tutorial-mode.js'),css=read('tutorial.css'),boot=read('tutorial-bootstrap.js'),html=read('index.html');
 assert.match(mode,/tutorial-measurement-batch-b\.js\?v=1\.19\.20-batch-b1/);
 assert.match(mode,/data-measurement-scope-hz/);assert.match(mode,/root\.DTSArduino\?\.tick\?\.\(project/);
 assert.match(mode,/function measurementUpgradeCard\(l,session,project\)/);
 assert.match(mode,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.match(boot,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-d2/);
 assert.match(html,/tutorial\.css\?rev=20261010-measure-batch-d2/);
 const rules=css.slice(css.lastIndexOf('/* MQ-07 scope learning controls'));
 assert.match(rules,/#tutorialCoach \.measurement-scope-observation/);
 assert.doesNotMatch(rules,/#viewport|\.workspace-wrap|#propertiesPanel|(?:^|[;{])\s*(?:width|height|left|right|position|top|bottom)\s*:/);
});
