'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const read=file=>fs.readFileSync(path.join(__dirname,'../dist',file),'utf8');
function setup(){
 const source=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const ctx={window:{DTSTutorialLessons:source}};
 for(const f of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js'])vm.runInNewContext(read(f),ctx);
 const w={window:{}};
 for(const f of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(f),w);
 return {L:ctx.window.DTSTutorialLessons,defs:Object.fromEntries(w.window.DTSDesignLibrary.extend(w.window.COMPONENT_LIBRARY).map(d=>[d.id,d]))};
}
const ids=['measurement-workshop-outline-035','measurement-workshop-outline-036','measurement-workshop-outline-037','measurement-workshop-src-09','measurement-workshop-outline-023','measurement-workshop-outline-024'];
test('45 measurement lessons retained, six specialized C lessons have distinct learning aims',()=>{
 const {L}=setup(),rows=L.lessons.filter(x=>x.topicId==='measurement-workshop');
 assert.equal(rows.length,45);
 assert.equal(rows.filter(x=>x.designStandard==='rich-reference-v1').length,27,'24 rich lessons before C; three tachometer labs newly rich, power trio specialized; 18 remain');
 assert.equal(rows.filter(x=>x.pedagogyReview?.version==='v1.19.20-measure-batch-c').length,6);
 const questions=new Set();for(const id of ids){const x=L.byId[id];assert.equal(x.designStandard,'rich-reference-v1');assert.ok(x.measurementUpgrade?.task?.length>45);assert.ok(x.learningGoal?.length>50);assert.equal(x.measurementUpgrade.options.length,3);questions.add(x.measurementUpgrade.question);assert.ok(x.project.components.length>=3);for(const step of x.steps)assert.ok(x.project.wires.some(w=>JSON.stringify(w.from)===JSON.stringify(step.from)&&JSON.stringify(w.to)===JSON.stringify(step.to)),id+' fabricated wire')}
 assert.equal(questions.size,6);
 for(const id of ['measurement-workshop-src-06','measurement-workshop-src-07'])assert.equal(L.byId[id].measurementUpgrade,undefined,'canonical source untouched');
});
test('energy lessons compute P Q S PF and frequency from numerical simulation',()=>{
 const {L,defs}=setup();for(const id of ids.slice(0,3)){
  const p=L.byId[id].project,z=p.components.find(c=>c.id==='z1'),ea=p.components.find(c=>c.id==='ea1');
  for(const [character,pf,power,q] of [['resistive',1,230,0],['inductive',.8,184,138],['capacitive',.8,184,-138]]){
   z.loadCharacter=character;z.powerFactor=pf;ea._energyWh=0;delete ea._energyAnalyzerLast;
   const result=Simulation.solve(p,defs,{now:1000});assert.equal(result.stable,true);assert.equal(result.blocked,false);assert.equal(result.shortCircuit,false);
   const m=ea._energyAnalyzer;assert.equal(m.warning,'');assert.equal(m.loadCharacter,character);
   assert.ok(Math.abs(m.voltageV-230)<.02);assert.ok(Math.abs(m.currentA-1)<.002);assert.ok(Math.abs(m.activePowerW-power)<.1);assert.ok(Math.abs(m.reactivePowerVar-q)<.1);assert.ok(Math.abs(m.apparentPowerVA-230)<.02);assert.ok(Math.abs(m.powerFactor-pf)<.001);assert.equal(m.frequencyHz,50);
  }
 }
});
test('energy accumulated over one virtual hour is based on actual simulated watts',()=>{
 const {L,defs}=setup(),p=L.byId['measurement-workshop-outline-036'].project,ea=p.components.find(c=>c.id==='ea1');
 Simulation.solve(p,defs,{now:1000});assert.equal(ea._energyAnalyzer.energyWh,0);
 Simulation.solve(p,defs,{now:3601000});assert.ok(Math.abs(ea._energyAnalyzer.energyWh-230)<.1);
 assert.ok(Math.abs(ea._energyAnalyzer.energyWh/1000-.23)<.001);
});
test('tachometer readings derive from active motor; never invent a disconnected RPM',()=>{
 const {L,defs}=setup();for(const id of ids.slice(3)){
  const p=L.byId[id].project,m=p.components.find(c=>c.id==='m1'),t=p.components.find(c=>c.id==='t1');
  assert.equal(t.tachometerTargetId,'m1');assert.equal(p.tutorialExplore.type,'tachometer-simulation-rich');
  assert.equal(p.wires.length,4);assert.equal(p.wires.some(w=>w.from.c==='t1'||w.to.c==='t1'),false,'optical tachometer has no electrical terminal connection');
  for(const rpm of [750,1500,3000]){m.motorRatedRpm=rpm;const res=Simulation.solve(p,defs,{now:1200});assert.equal(res.stable,true);assert.equal(res.shortCircuit,false);assert.equal(m._active,true);assert.equal(m._motorRPM,rpm)}
  p.wires=[];Simulation.solve(p,defs,{now:2000});assert.equal(m._active,false);assert.equal(m._motorRPM,undefined);
 }
});
test('tachometer target identity and motor power are mandatory for a reading',()=>{
 const {L,defs}=setup(),p=L.byId['measurement-workshop-src-09'].project,m=p.components.find(c=>c.id==='m1'),t=p.components.find(c=>c.id==='t1');
 Simulation.solve(p,defs,{now:1000});
 const valid=()=>t.tachometerTargetId===m.id&&m._active&&Number.isFinite(m._motorRPM);
 assert.equal(valid(),true);t.tachometerTargetId='wrong-motor';assert.equal(valid(),false);
 t.tachometerTargetId='m1';p.wires=[];Simulation.solve(p,defs,{now:1100});assert.equal(valid(),false);
});
test('RPM controls stay within floating teaching coach, preserving workspace and caches',()=>{
 const s=read('tutorial-mode.js'),css=read('tutorial.css'),html=read('index.html'),boot=read('tutorial-bootstrap.js');
 assert.match(s,/tutorial-measurement-batch-c\.js\?v=1\.19\.20-batch-c1/);
 assert.match(s,/data-measurement-tacho-rpm/);assert.match(s,/motor\._motorRPM/);assert.match(s,/root\.CCSSimulation\?\.solve\?\.\(project/);
 assert.match(s,/measurementUpgradeCard\(l,s,project\)\+noteHtml/);
 assert.match(boot,/tutorial-mode\.js\?v=20261011-topic-review-m1/);
 assert.match(html,/tutorial\.css\?rev=20261010-measure-batch-d2/);
 assert.match(html,/tutorial-bootstrap\.js\?rev=20261011-topic-review-m1/);
 const rules=css.slice(css.lastIndexOf('/* MQ-07 simulation-derived energy and tachometer learning')).split(/\n\/\* /)[0];
 assert.match(rules,/#tutorialCoach \.measurement-tacho-observation/);
 const selectors=[...rules.replace(/^\/\*[\s\S]*?\*\//,'').matchAll(/(?:^|\})\s*([^{}]+)\{/g)].map(m=>m[1].trim());
 assert.ok(selectors.length>0&&selectors.every(x=>x.startsWith('#tutorialCoach ')),'measurement styles must remain inside the floating coach');
 assert.doesNotMatch(rules,/#viewport|\.workspace-wrap|#propertiesPanel/);
});
