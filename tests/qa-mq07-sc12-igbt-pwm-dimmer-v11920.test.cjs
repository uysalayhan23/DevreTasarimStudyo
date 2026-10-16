'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-12'];
const clone=x=>JSON.parse(JSON.stringify(x));
const comp=(p,id)=>p.components.find(c=>c.id===id);
const phase=(p,duty)=>{comp(p,'pwm1').dutyPercent=duty;return Native.solveSc12DimmerCycle(p,defs,{now:1000})};

test('SC12 contains IGBT, standalone electrical PWM and real DC load, not S1',()=>{
 assert.equal(lesson.kind,'wiring');
 assert.equal(comp(lesson.project,'pwm1').typeId,'virtual-pwm-generator-v1');
 assert.equal(comp(lesson.project,'q1').typeId,'fga25n120antd-igbt');
 assert.equal(comp(lesson.project,'h1').typeId,'standard-light');
 assert.equal(comp(lesson.project,'sw'),undefined);
 assert.deepEqual(Array.from(defs['fga25n120antd-igbt'].pins.map(p=>p.id)),['G','C','E']);
 const names=lesson.project.wires.map(w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p);
 for(const edge of ['g1/P>pwm1/V+','pwm1/GND>g1/M','pwm1/OUT>rg/1','rg/2>q1/G','q1/E>g1/M','g1/P>h1/X1','h1/X2>q1/C'])assert.ok(names.includes(edge),edge);
 assert.equal(lesson.pedagogyReview.igbtVirtual.realAcDimmer,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});
test('SC12 PWM modulates actual IGBT conduction and normalized lamp ON time',()=>{
 const p=clone(lesson.project);
 for(const duty of [0,25,50,75,100]){
  const r=phase(p,duty);
  assert.equal(r.result.stable,true,'solver duty '+duty);
  assert.equal(r.result.shortCircuit,false);
  assert.equal(r.result.blocked,false);
  assert.equal(r.verified,true);
  assert.equal(r.normalizedBrightnessPct,duty);
  assert.equal(comp(p,'h1')._sc12BrightnessPct,duty);
  assert.equal(r.highDrive,duty>0);
  assert.equal(r.lowDrive,duty===100);
 }
});
test('SC12 fails closed on broken PWM supply/reference, OUT, gate, collector or emitter path',()=>{
 const bad=[
  ['g1','P','pwm1','V+'],['pwm1','GND','g1','M'],
  ['pwm1','OUT','rg','1'],['rg','2','q1','G'],
  ['h1','X2','q1','C'],['q1','E','g1','M']
 ];
 for(const [a,ap,b,bp] of bad){
  const p=clone(lesson.project);
  p.wires=p.wires.filter(w=>!(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  const r=phase(p,100);
  assert.equal(r.normalizedBrightnessPct,0,a+'/'+ap+' > '+b+'/'+bp);
  assert.equal(r.highDrive,false);
  assert.equal(comp(p,'h1')._sc12BrightnessPct,0);
 }
});
test('SC12 is not mistaken for full AC phase-angle dimmer acceptance',()=>{
 const p=clone(lesson.project),result=Native.solveSc12DimmerCycle(p,defs,{now:1000});
 assert.equal(result.sampled,true);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.manufacturerCalibrationVerified,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
});
