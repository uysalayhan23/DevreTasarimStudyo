'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js'),read=p=>fs.readFileSync(path.join(__dirname,'../dist',p),'utf8');
function load(){
 const ctx={window:{DTSTutorialLessons:JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')))}};
 for(const file of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js','tutorial-measurement-batch-d.js','tutorial-dc-batch-e.js'])vm.runInNewContext(read(file),ctx);
 const w={window:{}};
 for(const name of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(name),w);
 return {L:ctx.window.DTSTutorialLessons,defs:Object.fromEntries(w.window.DTSDesignLibrary.extend(w.window.COMPONENT_LIBRARY).map(d=>[d.id,d]))};
}
test('every DC-circuits lesson has own rich learning goal, all 45 measurement lessons remain rich',()=>{
 const {L}=load(),dc=L.lessons.filter(l=>l.topicId==='dc-circuits'),measurement=L.lessons.filter(l=>l.topicId==='measurement-workshop');
 assert.equal(dc.length,10);assert.equal(dc.filter(x=>x.designStandard==='rich-reference-v1').length,10);
 assert.equal(measurement.length,45);assert.equal(measurement.filter(x=>x.designStandard==='rich-reference-v1').length,45);
 const fresh=dc.filter(x=>x.pedagogyReview?.version==='v1.19.20-dc-batch-e');
 assert.equal(fresh.length,6);assert.equal(new Set(fresh.map(x=>x.measurementUpgrade.question)).size,6);
 for(const l of fresh){assert.ok(l.learningGoal.length>40&&l.measurementUpgrade.task.length>40);assert.equal(l.quiz.answer,0);
  for(const step of l.steps)assert.ok(l.project.wires.some(w=>JSON.stringify(w.from)===JSON.stringify(step.from)&&JSON.stringify(w.to)===JSON.stringify(step.to)),l.id+' invalid wire');
 }
});
test('physically modelled two-series strings in parallel produce actual 3 V and 30 mA, not fake meter text',()=>{
 const {L,defs}=load(),p=L.byId['dc-circuits-src-05'].project,parts=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const pairs=[['pg0','PACK-A',0],['pg1','PACK-A',1],['pg2','PACK-B',0],['pg3','PACK-B',1]];
 for(const [id,pack,index] of pairs){assert.equal(parts[id].seriesPackId,pack);assert.equal(parts[id].seriesIndex,index);assert.equal(parts[id].cellVoltage,1.5)}
 assert.equal(p.wires.filter(w=>!w.probeLead).length,6);
 assert.equal(parts['v1-red'].probeTarget.c,'pg0');assert.equal(parts['v1-black'].probeTarget.c,'pg1');
 assert.equal(parts.v1.meterPosition,3);assert.equal(parts.pg4.resistance,100);
 const result=Simulation.solve(p,defs,{now:1000});
 assert.equal(result.blocked,false);assert.equal(result.stable,true);assert.equal(result.shortCircuit,false);
 assert.ok(Math.abs(parts.pg4._voltageValue-3)<.01);assert.ok(Math.abs(parts.pg4._currentValue-.03)<.001);
 assert.equal(parts.v1._meter.mode,'DCV');assert.ok(Math.abs(parts.v1._meter.value-3)<.02);assert.equal(parts.v1._meter.warning,'');
});
test('other canonical DC source, series battery and parallel battery projects retain their live physics',()=>{
 const {L,defs}=load();
 for(const [n,expected] of [['03',3],['04',1.5]]){
  const p=L.byId['dc-circuits-src-'+n].project,res=Simulation.solve(p,defs,{now:1000});
  assert.equal(res.blocked,false);assert.equal(res.shortCircuit,false);
  const m=p.components.find(c=>c.typeId==='unit-ut33d-plus');assert.ok(m?._meter);
  assert.ok(Math.abs(m._meter.value-expected)<.05,n+' should really read '+expected+'V');
 }
});
test('new 2S2P project never replaces canonical earlier two-battery layers',()=>{
 const {L}=load(),base=L.byId['dc-circuits-src-03'].project,combo=L.byId['dc-circuits-src-05'].project;
 assert.equal(base.components.filter(c=>c.typeId==='tutorial-battery').length,2);
 assert.equal(combo.components.filter(c=>c.typeId==='tutorial-battery').length,4);
 assert.ok(combo.components.find(c=>c.id==='v1-red'));assert.ok(combo.components.find(c=>c.id==='v1-black'));
});
test('full tutorial loader, contextual micro explanations and readable coach are preserved',()=>{
 const mode=read('tutorial-mode.js'),boot=read('tutorial-bootstrap.js'),html=read('index.html'),css=read('tutorial.css');
 assert.match(mode,/tutorial-dc-batch-e\.js\?v=1\.19\.20-dc-batch-e1/);
 assert.match(mode,/tutorial-measurement-batch-d\.js\?v=1\.19\.20-batch-d2/);
 assert.match(boot,/tutorial-mode\.js\?v=20261012-practice-n1/);
 assert.match(html,/tutorial-bootstrap\.js\?rev=20261012-practice-n1/);
 assert.match(html,/tutorial\.css\?rev=20261010-measure-batch-d2/);
 assert.match(mode,/DTSTutorialMicroHints\?\.sync/);
 assert.match(mode,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.match(css,/#tutorialCoach\{font-size:13px;line-height:1\.5/);
});
