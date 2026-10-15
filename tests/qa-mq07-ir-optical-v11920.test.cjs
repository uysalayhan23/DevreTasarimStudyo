'use strict';
// MQ-07: virtual low-voltage IR teaching circuit; NOT manufacturer-grade hardware acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const Bell=require('../scripts/qa-bell-transformer-v11920.cjs');
const Practice=require('../scripts/qa-tutorial-practice-1519-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),id='sensor-analog-apps-src-12';
test('IR optics lesson has real virtual sender/receiver sensing, coil contact lamp and grounded pedagogy',()=>{
 const l=L.byId[id],p=l.project;
 assert.equal(l.kind,'wiring');assert.equal(p.wires.length,7);
 assert.ok(p.components.some(c=>c.typeId==='sensor-through-beam'));
 assert.ok(!p.components.some(c=>c.typeId==='proximity'||c.typeId==='capacitive-detector'));
 assert.ok(p.wires.some(w=>w.from?.c==='s1'&&w.from?.p==='BK'&&w.to?.c==='k1'&&w.to?.p==='A1'));
 assert.ok(p.wires.some(w=>w.from?.c==='ka1'&&w.from?.p==='14'&&w.to?.c==='h1'&&w.to?.p==='X1'));
 assert.ok(l.explanation.includes('B1/BN')&&l.explanation.includes('K1/13')&&l.explanation.includes('80 mm'));
 assert.ok(l.beginnerSteps.length>=6);
 assert.equal(l.pedagogyReview.separateTransmitterReceiverVerified,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
 assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id===id));
});
test('actual source solver produces optical OFF→ON→OFF with true relay and lamp response',()=>{
 const observed=[];
 for(const distance of [80,2,80]){
  const p=JSON.parse(JSON.stringify(L.byId[id].project));
  p.components.find(c=>c.id==='s1').sensing.distance=distance;
  const r=S.solve(p,defs,{now:1000+observed.length*400});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
  observed.push([!!p.components.find(c=>c.id==='k1')._active,!!p.components.find(c=>c.id==='h1')._active]);
 }
 assert.deepEqual(observed,[[false,false],[true,true],[false,false]]);
});
test('unchanged bell-transformer lock, 1655-source and practice-guide regressions remain valid',()=>{
 const r=QA.audit({L,defs,Simulation:S});
 assert.equal(r.status,'PASS');assert.equal(r.total,1655);assert.equal(r.withWires,730);
 assert.equal(r.stable,730);assert.equal(r.definitionCount,940);assert.equal(r.rich,136);
 assert.deepEqual(r.errors,[]);assert.deepEqual(r.invalidWireEndpoints,[]);
 const bell=Bell.audit({L,defs,solver:S});
 assert.equal(bell.status,'PASS');assert.equal(bell.count,15);
 assert.equal(bell.phaseChecks,38);assert.equal(bell.phasePasses,38);
 const practice=Practice.audit({L});
 assert.equal(practice.sourceStatus,'PASS');assert.equal(practice.examined,1519);
 assert.equal(practice.wired,532);assert.equal(practice.referenceOnly,916);
 assert.equal(practice.referenceWithWires,71);assert.deepEqual(practice.issues,[]);
 assert.equal(L.mq07Batch200.reviewIds.length,50);
});
test('old direct-phase virtual bells are rejected instead of silently bypassing transformer',()=>{
 const sample=JSON.parse(JSON.stringify(L.byId['bells-1']));
 sample.project.components.find(c=>c.typeId==='bell-transformer').typeId='supply-1p';
 const checked=Bell.audit({L:{lessons:[sample]},defs,solver:S});
 assert.equal(checked.status,'FAIL');
 assert.ok(checked.issues.some(x=>x.code==='DIRECT_MAINS_FORBIDDEN'));
});
