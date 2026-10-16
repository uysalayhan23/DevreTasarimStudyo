'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const curriculum=QA.curriculum(),catalog=QA.catalog();
const refs=[
  [62,'oscillator-filter-apps-src-10',/Kenetleyici/i,['arduino-diode-1n4148','capacitor','resistor']],
  [63,'oscillator-filter-apps-src-11',/Miller/i,['lm358p-dip8','resistor','capacitor']],
  [64,'oscillator-filter-apps-src-12',/Boot strap/i,['arduino-bd139','resistor','capacitor']],
  [66,'oscillator-filter-apps-src-14',/555 osilatör/i,['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u']],
  [67,'oscillator-filter-apps-src-15',/555 PWM/i,['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u']],
  [68,'oscillator-filter-apps-src-16',/555 tek kararlı/i,['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u']],
  [69,'oscillator-filter-apps-src-17',/555 çift kararlı/i,['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u']],
  [70,'oscillator-filter-apps-src-18',/Alçak geçiren aktif filtre/i,['lm358p-dip8','resistor','capacitor']],
  [71,'oscillator-filter-apps-src-19',/Yüksek geçiren aktif filtre/i,['lm358p-dip8','resistor','capacitor']]
];
for(const [number,id,title,parts] of refs){
  test('SC'+number+' is reference-only and does not claim a wired simulation',()=>{
    const lesson=curriculum.byId[id];assert.ok(lesson,id);assert.match(lesson.title,title);
    assert.equal(lesson.kind,'quiz');assert.equal(lesson.project.wires.length,0);
    assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
    for(const type of parts){assert.ok(lesson.project.components.some(c=>c.typeId===type),type);assert.ok(catalog[type],type);}
    assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
  });
}
test('SC65 wired LM358 Schmitt responds to DC input sweep while hysteresis remains unaccepted',()=>{
  const lesson=curriculum.byId['oscillator-filter-apps-src-13'];assert.match(lesson.title,/Schmitt Trigger/i);
  assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.wires.length,14);
  const edges=new Set(lesson.project.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join(':')));
  for(const edge of ['in:2:r1:1','r1:2:u1:3','u1:1:r2:1','r2:2:u1:3','ref1:2:u1:2'])assert.ok(edges.has(edge),edge);
  const p=structuredClone(lesson.project),meter=p.components.find(c=>c.id==='v1');
  const readings=[];
  let now=0;
  for(const percent of [20,30,40,60,40,30,20]){
    p.components.find(c=>c.id==='in').potentiometer=percent;
    const s=Simulation.solve(p,catalog,{now:now+=250});
    assert.ok(s.stable&&!s.blocked&&!s.shortCircuit,'SC65 at '+percent);
    assert.ok(Number.isFinite(meter._voltageValue),'SC65 output at '+percent);
    readings.push(meter._voltageValue);
  }
  assert.ok(readings[0]>20&&readings[1]>20&&readings[2]<1&&readings[3]<1);
  assert.ok(readings[4]<1&&readings[5]>20&&readings[6]>20);
  assert.equal(lesson.pedagogyReview.dynamicHysteresisAccepted,false);
  assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
