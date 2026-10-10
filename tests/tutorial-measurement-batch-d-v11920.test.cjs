'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const read=name=>fs.readFileSync(path.join(__dirname,'../dist',name),'utf8');
const previous=['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js','tutorial-measurement-batch-c.js'];
const ids=['src-08','outline-038','src-10','outline-017','outline-018','outline-019','outline-020','outline-021','outline-022','outline-025','outline-026','outline-027','outline-028','outline-029','outline-030','outline-039','outline-040','outline-041'].map(s=>'measurement-workshop-'+s);
function setup(){
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const root={window:{DTSTutorialLessons:L}};
 for(const file of [...previous,'tutorial-measurement-batch-d.js'])vm.runInNewContext(read(file),root);
 const w={window:{}};
 for(const file of ['library.js','clamp-meter.js','installation-v118.js','design-library.js','electronics-library-v119.js','electronics-ics-v11920.js','arduino-library.js','dold-library.js','hcfa-library.js','tutorial-components.js'])vm.runInNewContext(read(file),w);
 const byId=Object.fromEntries(w.window.DTSDesignLibrary.extend(w.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
 return {L,model:root.window.DTSMeasurementWorkbench,byId};
}
test('full 45-item measurement curriculum is represented with 18 unique new rich lessons',()=>{
 const {L}=setup(),rows=L.lessons.filter(l=>l.topicId==='measurement-workshop');
 assert.equal(rows.length,45);assert.equal(rows.filter(l=>l.designStandard==='rich-reference-v1').length,45);
 assert.equal(rows.filter(l=>l.pedagogyReview?.version==='v1.19.20-measure-batch-d').length,18);
 const titles=new Set(),questions=new Set();
 for(const id of ids){const l=L.byId[id];assert.equal(l.designStandard,'rich-reference-v1');assert.ok(l.measurementUpgrade?.heading?.length>10);assert.ok(l.learningGoal?.length>40);assert.ok(l.measurementUpgrade?.task?.length>35);assert.equal(l.quiz.answer,0);titles.add(l.measurementUpgrade.heading);questions.add(l.measurementUpgrade.question);
  for(const step of l.steps)assert.ok(l.project.wires.some(w=>JSON.stringify(w.from)===JSON.stringify(step.from)&&JSON.stringify(w.to)===JSON.stringify(step.to)),id+' fabricated wiring');}
 assert.equal(titles.size,18);assert.equal(questions.size,18);
 for(const id of ['measurement-workshop-src-01','measurement-workshop-src-02','measurement-workshop-src-03','measurement-workshop-src-06'])assert.equal(L.byId[id].pedagogyReview?.version==='v1.19.20-measure-batch-d',false,'accepted sources must not be changed');
});
test('real electrical labs remain genuine: 24 V voltage, 24 mA current, and R=1kΩ',()=>{
 const {L,byId}=setup();
 for(const [id,expected,mode] of [['outline-017',24,'DCV'],['outline-028',24,'DCV'],['outline-030',.024,'DCA']]){
  const p=L.byId['measurement-workshop-'+id].project,res=Simulation.solve(p,byId,{now:1000}),m=p.components.find(c=>c.typeId==='unit-ut33d-plus');
  assert.equal(res.stable,true);assert.equal(res.shortCircuit,false);assert.equal(res.blocked,false);assert.ok(m?._meter);
  assert.equal(m._meter.mode,mode);assert.ok(Math.abs(m._meter.value-expected)<(mode==='DCV'?.1:.002));
 }
});
test('virtual energy-meter indices are backed by the actual analyzer watt-hours and elapsed time',()=>{
 const {L,model,byId}=setup(),l=L.byId['measurement-workshop-src-08'],p=l.project;
 for(const [i,target] of [[0,0],[1,57.5],[2,115],[3,230]]){
  const d=model.choose(l,p,i,Simulation.solve,byId);
  assert.ok(d);const ea=p.components.find(c=>c.typeId==='energy-analyzer-1p');
  assert.ok(Math.abs(ea._energyAnalyzer.energyWh-target)<.2,'energy Wh from model');
  assert.match(d.label,/Wh/);assert.match(d.caveat,/model/);
 }
});
test('PNP proximity sensor reports model supply/contact, not imaginary meter volts',()=>{
 const {L,model,byId}=setup(),l=L.byId['measurement-workshop-src-10'],p=l.project,s=p.components.find(c=>c.typeId==='proximity');
 for(const [idx,active] of [[0,false],[1,true],[2,false]]){
  const result=model.choose(l,p,idx,Simulation.solve,byId);
  assert.equal(s._sensorSupply,'ok');assert.equal(!!s._contactStates.output,active);
  assert.match(result.label,/PNP BK çıkışı:/);assert.doesNotMatch(result.label,/BK.*24\.00 V/);
 }
});
test('independent virtual scenarios preserve correct dimensional conversions and formulas',()=>{
 const {L,model}=setup();
 const select=(n,i)=>{const l=L.byId['measurement-workshop-outline-'+n];return model.choose(l,l.project,i)};
 assert.match(select('018',1).label,/75 mm/);assert.match(select('019',1).label,/25,60 mm/);
 assert.match(select('020',1).label,/8,50 mm/);assert.match(select('021',1).label,/6,78 mm/);
 assert.match(select('022',1).label,/25.00 lx/);
 assert.match(select('025',1).label,/80.0 dB SPL/);
 assert.match(select('026',1).label,/77.0 °F/);
 const impedance=select('041',1);
 assert.match(impedance.label,/XL=/);assert.match(impedance.label,/XC=/);assert.match(impedance.label,/\|Z\|=/);
 assert.match(impedance.caveat,/teorik/);
});
test('all conceptual lessons have model-source warnings and never impersonate live instrument calibration',()=>{
 const {L,model}=setup();
 for(const id of ids){
  const l=L.byId[id];assert.ok(l.pedagogyReview?.source);
  if(l.measurementUpgrade.workbench){
   const d=model.display(l,l.project);assert.ok(d.choices.length>=3);assert.ok(d.caveat.length>20);
   assert.equal(model.choose(l,l.project,-1),null,'invalid preset rejected');
   assert.equal(model.choose(l,l.project,999),null,'out-of-range preset rejected');
  }
 }
});
test('shared lesson coach, micro-hints, UI footprints and asset revisions stay connected',()=>{
 const mode=read('tutorial-mode.js'),bootstrap=read('tutorial-bootstrap.js'),html=read('index.html'),css=read('tutorial.css');
 assert.match(mode,/tutorial-measurement-batch-d\.js\?v=1\.19\.20-batch-d1/);
 assert.match(mode,/DTSMeasurementWorkbench\?\.display/);assert.match(mode,/DTSMeasurementWorkbench\?\.choose/);
 assert.match(mode,/data-measurement-workbench-index/);
 assert.match(mode,/DTSTutorialMicroHints\?\.sync/);
 assert.match(bootstrap,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-d1/);
 assert.match(html,/tutorial\.css\?rev=20261010-measure-batch-d1/);
 assert.match(html,/tutorial-bootstrap\.js\?rev=20261010-measure-batch-d1/);
 const rules=css.slice(css.lastIndexOf('/* MQ-07 accessible virtual measurement exercises'));
 assert.match(rules,/#tutorialCoach \.measurement-workbench-panel/);
 assert.doesNotMatch(rules,/#viewport|\.workspace-wrap|#propertiesPanel|(?:^|[;{])\s*(?:width|height|left|right|position|top|bottom|resize)\s*:/);
});
