'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const conflictingIds=['sensor-analog-apps-src-08','sensor-analog-apps-outline-047','sensor-analog-apps-outline-048','sensor-analog-apps-outline-085','sensor-analog-apps-outline-089','sensor-analog-apps-outline-105','sensor-analog-apps-outline-121','sensor-analog-apps-outline-138'];
const capacitorIds=['electronic-component-basics-outline-012','electronic-component-basics-outline-106','electronic-component-basics-outline-126','electronic-component-basics-outline-130'];
const inductorIds=['workshop-safety-mechanics-outline-049','workshop-safety-mechanics-outline-127','workshop-safety-mechanics-outline-130'];
test('all 35 sensor-lessons remain without defined physical sensing targets',()=>{
 const rows=L.lessons.filter(l=>l.project?.wires?.length&&l.project.components.some(c=>['proximity','autonics-pr12-npn'].includes(c.typeId)&&!c.sensing?.target));
 assert.equal(rows.length,35);
 assert.ok(rows.some(l=>l.id==='dual-dc-2'));
 assert.ok(rows.some(l=>l.id==='open-collector-1'));
});
test('eight inductive sensor placeholders for other physical topics require specialist approval',()=>{
 const actual=conflictingIds.map(id=>L.lessons.find(l=>l.id===id));assert.ok(actual.every(Boolean));
 for(const l of actual){
  const c=l.project.components.find(x=>x.typeId==='proximity');
  assert.ok(c,l.id+' missing placed inductive template');
  assert.equal(defs[c.typeId].sensorPrinciple,'inductive');
 }
 assert.equal(actual.length,8);
});
test('seven canonical RC/RL lessons: 707 stable phases and no fabricated restoration',()=>{
 let count=0;
 for(const id of [...capacitorIds,...inductorIds]){
  const l=L.lessons.find(x=>x.id===id);assert.ok(l,id);
  const snapshot=JSON.stringify(l.project),p=structuredClone(l.project);
  const sw=p.components.find(c=>c.typeId==='push-no');
  const meter=p.components.find(c=>defs[c.typeId]?.kind==='multimeter');
  const r=p.components.find(c=>defs[c.typeId]?.kind==='resistor');
  const reactive=p.components.find(c=>['capacitor','reactor'].includes(defs[c.typeId]?.kind));
  assert.ok(sw&&meter&&r&&reactive,id);
  for(let t=0;t<=10000;t+=100){
   sw.state=t>0&&t<=400;const result=Sim.solve(p,defs,{now:t});
   assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,id+' '+t);
   count++;
  }
  const v=Number(meter._meter?.value);
  if(capacitorIds.includes(id)){
   assert.equal(r.resistance*reactive.capacitance,1,id+' RC seconds');
   assert.ok(v>7,id+' retained capacitor voltage');
  }else{
   assert.equal(reactive.inductance/r.resistance,.02,id+' L/R seconds');
   assert.ok(Math.abs(v)<.1,id+' inductor settled');
  }
  assert.equal(JSON.stringify(l.project),snapshot,id+' canonical changed');
 }
 assert.equal(count,707);
});

test('35 native sensor circuits: virtual state does not prove a real target',()=>{
 const Sensor=require('../dist/sensors.js');
 let missingTargets=0,stablePhases=0;
 for(const lesson of L.lessons.filter(l=>l.project?.wires?.length)){
  const original=lesson.project.components.find(c=>['proximity','autonics-pr12-npn'].includes(c.typeId)&&!c.sensing?.target);
  if(!original)continue;
  missingTargets++;
  const source=JSON.stringify(lesson.project),project=structuredClone(lesson.project);
  const control=project.components.find(c=>c.id===original.id);
  for(const [now,state] of [[0,false],[400,true],[850,false]]){
   control.state=state;
   assert.equal(Sensor.detect(control,defs[control.typeId]).enabled,false,
    lesson.id+' has no physically configured target');
   const r=Sim.solve(project,defs,{now});stablePhases++;
   assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,
    lesson.id+' '+now+' must be solver-stable without physical acceptance');
  }
  assert.equal(JSON.stringify(lesson.project),source,lesson.id+' canonical graph mutated');
 }
 assert.equal(missingTargets,35);
 assert.equal(stablePhases,105);
 // This regression verifies that synthetic state toggles do NOT close sensor QA.
});
