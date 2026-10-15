'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Behavior=require('../dist/device-behavior.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-08'];
const clone=v=>JSON.parse(JSON.stringify(v)),part=(p,id)=>p.components.find(x=>x.id===id);
function sample(afterMs,opts={}){
 const project=clone(lesson.project),pz=part(project,'pz');
 pz.piezoTapAt=opts.noTap?null:1000;
 pz.piezoTapMv=Object.hasOwn(opts,'amplitude')?opts.amplitude:100;
 if(opts.reverse){part(project,'v1-red').probeTarget.p='−';part(project,'v1-black').probeTarget.p='+'}
 if(opts.disconnectCable)project.wires=project.wires.filter(w=>w.to.c!==(opts.disconnectCable==='red'?'v1-red':'v1-black'));
 if(opts.disconnectTarget)delete part(project,opts.disconnectTarget==='red'?'v1-red':'v1-black').probeTarget;
 const result=Simulation.solve(project,defs,{now:1000+afterMs});
 assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating);
 return {project,pz,meter:part(project,'v1')._meter,result};
}
test('SC27 canonical Piezo 5 parts, 4 wires, 4 steps and virtual UI opt-in',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.components.length,5);
 assert.equal(lesson.project.wires.length,4);
 assert.equal(lesson.steps.length,4);
 assert.equal(part(lesson.project,'pz').typeId,'tutorial-piezo');
 assert.equal(part(lesson.project,'pz').mq07PiezoTapUi,true);
 assert.equal(part(lesson.project,'v1').meterPosition,1);
 assert.equal(part(lesson.project,'r1').resistance,1000000);
 for(const [a,ap,b,bp] of [['pz','+','r1','1'],['r1','2','pz','−'],
   ['v1','V','v1-red','PLUG'],['v1','COM','v1-black','PLUG']]){
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  assert.ok(defs[part(lesson.project,a).typeId].pins.some(pin=>pin.id===ap));
  assert.ok(defs[part(lesson.project,b).typeId].pins.some(pin=>pin.id===bp));
 }
});
test('SC27 actual transient Piezo voltage follows native decay and then zero',()=>{
 for(const ms of [0,150,220,500,1000,1601]){
  const {pz,meter}=sample(ms),expected=ms>1600?0:100*Math.exp(-ms/220);
  assert.ok(Math.abs(pz._piezoMv-expected)<1e-7);
  assert.equal(meter.mode,'DCV');assert.equal(meter.range,.2);assert.equal(meter.warning,'');
  assert.ok(Math.abs(meter.value*1000-expected)<1e-7);
 }
 const withoutTap=sample(100,{noTap:true});assert.equal(withoutTap.meter.value,0);
 assert.equal(Behavior.piezoPulse({piezoTapAt:1000,piezoTapMv:100},2601).transient,false);
});
test('SC27 polarity and broken probe terminals fail closed in actual meter circuit',()=>{
 const reversed=sample(0,{reverse:true});assert.ok(Math.abs(reversed.meter.value+.1)<1e-8);
 for(const which of ['red','black']){
  const noCable=sample(0,{disconnectCable:which});
  assert.equal(noCable.meter.display,'OL');
  const openContact=sample(0,{disconnectTarget:which});
  assert.equal(openContact.meter.value,0);
 }
});
test('SC27 original UI source has lesson-specific impulse control and ticking condition',()=>{
 const app=fs.readFileSync(path.resolve(__dirname,'../dist/app.js'),'utf8');
 const symbols=fs.readFileSync(path.resolve(__dirname,'../dist/symbols.js'),'utf8');
 assert.match(symbols,/data-piezo-tap="1"/);
 assert.match(symbols,/c\.mq07PiezoTapUi===true/);
 assert.match(app,/project\.tutorialLesson\?\.id!=='sensor-analog-apps-src-08'/);
 assert.match(app,/c\.piezoTapAt=performance\.now\(\)/);
 assert.match(app,/result\.timed\|\|arduinoFrame\.active\|\|piezoDecayActive/);
 assert.match(app,/now-c\.piezoTapAt<=1600/);
});
test('SC11-SC26 constraints and physical REVIEW acceptance untouched',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 const counts=[[1,13,19],[2,13,19],[3,6,6],[4,3,5],[5,3,5],[6,3,5],[7,5,7]];
 for(const [n,parts,wires] of counts){
  const l=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.equal(l.project.components.length,parts);assert.equal(l.project.wires.length,wires);
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
 }
 for(const key of ['physicalAcceptance','manufacturerCalibrationVerified','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(lesson.pedagogyReview[key],false);
});
