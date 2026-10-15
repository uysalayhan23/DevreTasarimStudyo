'use strict';
// MQ07: virtual, electrically simulated two-input op-amp lessons only.
// Neither independent pedagogy nor real Windows/physical hardware is accepted.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Bell=require('../scripts/qa-bell-transformer-v11920.cjs');
const Practice=require('../scripts/qa-tutorial-practice-1519-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const lessons=['opamp-apps-src-11','opamp-apps-src-12'];
test('two-input subtractor and summing lessons use two actual virtual controls, canonical terminals and child-readable steps',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(l=>l.designStandard==='rich-reference-v1').length,136);
 assert.equal(L.mq07Batch200.reviewIds.length,51);
 for(const id of lessons){
  const lesson=L.byId[id],p=lesson.project;
  assert.equal(lesson.kind,'wiring');
  assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id===id));
  assert.equal(p.components.filter(c=>c.typeId==='potentiometer').length,2);
  for(const inp of ['in','in2'])assert.ok(p.wires.some(w=>w.from?.c===inp&&w.from?.p==='2'),id+': '+inp);
  assert.ok(p.wires.some(w=>w.from?.c==='g1'&&w.to?.c==='u1'&&w.to?.p==='8'));
  assert.ok(p.wires.some(w=>w.from?.c==='g1'&&w.to?.c==='u1'&&w.to?.p==='4'));
  assert.equal(p.wires.length,id.endsWith('11')?19:18);
  assert.ok(lesson.explanation.length>900);
  assert.ok(lesson.beginnerSteps.length>=6);
  assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
  assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
  assert.ok(!lesson.designStandard);
 }
});
test('original electrical solver responds to BOTH independently adjusted virtual inputs',()=>{
 for(const id of lessons){
  const readings=[];
  for(const [a,b] of [[50,20],[50,50],[50,80],[20,50],[80,50]]){
   const p=JSON.parse(JSON.stringify(L.byId[id].project));
   p.components.find(c=>c.id==='in').potentiometer=a;
   p.components.find(c=>c.id==='in2').potentiometer=b;
   const q=Simulation.solve(p,defs,{now:1000});
   assert.ok(q.stable&&!q.blocked&&!q.shortCircuit&&!q.oscillating,id);
   const v=p.components.find(c=>c.id==='v1')._meter?.value;
   assert.ok(Number.isFinite(v),id+' missing analog voltmeter output');
   readings.push(v);
  }
  assert.ok(Math.abs(readings[0]-readings[2])>.2,id+' B input no output response');
  assert.ok(Math.abs(readings[3]-readings[4])>.2,id+' A input no output response');
 }
});
test('1655-source, locked bell transformer, and all 1519 generated guides remain consistent',()=>{
 const audit=QA.audit({L,defs,Simulation});
 assert.equal(audit.status,'PASS');assert.equal(audit.total,1655);
 assert.equal(audit.rich,136);assert.equal(audit.withWires,729);
 assert.equal(audit.stable,729);assert.equal(audit.definitionCount,940);
 assert.deepEqual(audit.errors,[]);assert.deepEqual(audit.invalidWireEndpoints,[]);
 const bell=Bell.audit({L,defs,solver:Simulation});
 assert.equal(bell.status,'PASS');assert.equal(bell.count,15);
 assert.equal(bell.phaseChecks,38);assert.equal(bell.phasePasses,38);
 const practice=Practice.audit({L});
 assert.equal(practice.sourceStatus,'PASS');assert.equal(practice.examined,1519);
 assert.equal(practice.wired,532);assert.equal(practice.referenceOnly,916);
 assert.equal(practice.referenceWithWires,71);assert.deepEqual(practice.issues,[]);
 assert.equal(L.byId['opamp-apps-src-11'].pedagogyReview.windowsVisualAcceptance,false);
});
