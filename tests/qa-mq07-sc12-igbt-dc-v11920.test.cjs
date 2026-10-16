'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-12'];
const clone=x=>JSON.parse(JSON.stringify(x));
test('SC12 current PWM IGBT G/C/E circuit has nine canonical connections',()=>{
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.wires.length,9);
 assert.equal(defs['fga25n120antd-igbt'].kind,'igbt-n');
 for(const pin of ['G','C','E'])assert.ok(defs['fga25n120antd-igbt'].pins.some(p=>p.id===pin));
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
test('SC12 current IGBT electrical PWM cycle OFF ON OFF and broken gate fails closed',()=>{
 const p=clone(lesson.project),pwm=p.components.find(c=>c.id==='pwm1');
 for(const duty of [0,100,0]){
  pwm.dutyPercent=duty;
  const out=Native.solveSc12DimmerCycle(p,defs,{now:1000});
  assert.ok(out.result.stable&&!out.result.shortCircuit&&!out.result.blocked);
  assert.equal(out.normalizedBrightnessPct,duty);
 }
 const broken=clone(lesson.project);
 broken.components.find(c=>c.id==='pwm1').dutyPercent=100;
 broken.wires=broken.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));
 const out=Native.solveSc12DimmerCycle(broken,defs,{now:2000});
 assert.equal(out.normalizedBrightnessPct,0);
});
