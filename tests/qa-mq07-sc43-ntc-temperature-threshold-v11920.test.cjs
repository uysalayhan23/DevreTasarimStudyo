'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const lesson=QA.curriculum().byId['opamp-apps-src-08'],defs=QA.catalog();
test('SC43 NTC LM358 temperature threshold LOW to HIGH using actual solver',()=>{
 assert.match(lesson.title,/NTC/i);
 const readings=[];
 for(const celsius of [0,10,20,25,30,40,60]){
  const p=structuredClone(lesson.project);
  const sensor=p.components.find(x=>x.id==='s1');
  sensor.temperatureC=celsius;
  sensor.temperature=celsius;
  const solved=Simulation.solve(p,defs,{now:0});
  assert.ok(solved.stable&&!solved.blocked&&!solved.shortCircuit,'solver at '+celsius);
  const meter=p.components.find(x=>x.id==='v1')._meter;
  assert.ok(Number.isFinite(meter?.value)&&!meter.warning,'voltmeter at '+celsius);
  readings.push(meter.value);
 }
 for(const v of readings.slice(0,4))assert.ok(v<1,'cold LOW');
 for(const v of readings.slice(4))assert.ok(v>20&&v<24,'hot HIGH');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
