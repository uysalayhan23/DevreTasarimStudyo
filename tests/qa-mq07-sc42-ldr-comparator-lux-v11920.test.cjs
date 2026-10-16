'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const lesson=QA.curriculum().byId['opamp-apps-src-07'];
const defs=QA.catalog();
test('SC42 LDR LM358 virtual lux threshold LOW to HIGH',()=>{
 assert.match(lesson.title,/LDR/i);
 const readings=[];
 for(const lux of [0,1,10,100,1000,10000]){
  const p=JSON.parse(JSON.stringify(lesson.project));
  p.components.find(c=>c.id==='s1').illuminationLux=lux;
  const state=Simulation.solve(p,defs,{now:0});
  assert.ok(state.stable&&!state.blocked&&!state.shortCircuit,'solver lux='+lux);
  const meter=p.components.find(c=>c.id==='v1')._meter;
  assert.ok(Number.isFinite(meter?.value),'meter lux='+lux);
  assert.ok(!meter.warning,'meter warning lux='+lux);
  readings.push(meter.value);
 }
 for(const v of readings.slice(0,3))assert.ok(v>=0&&v<1,'LOW threshold');
 for(const v of readings.slice(3))assert.ok(v>20&&v<24,'HIGH threshold');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
