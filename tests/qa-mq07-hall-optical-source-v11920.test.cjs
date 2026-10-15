'use strict';
// New real 24 V *virtual* lesson circuits; never a physical-installation recipe.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Sim=require('../dist/simulation.js');
const Bell=require('../scripts/qa-bell-transformer-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[['sensor-analog-apps-src-20','sensor-hall'],['sensor-analog-apps-src-22','sensor-through-beam']];
const edges=[['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],['k1','A2','g1','M'],['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']];
test('Hall and optical first-200 lessons now have verified 5-element, 7-wire scenes',()=>{
 assert.equal(L.mq07Batch200.reviewIds.length,51);
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(l=>l.designStandard==='rich-reference-v1').length,136);
 for(const [id,typ] of cases){
  const l=L.byId[id],p=l.project;
  assert.equal(l.kind,'wiring');assert.equal(p.components.length,5);
  assert.equal(p.wires.length,7);
  assert.equal(p.components.find(c=>c.id==='s1').typeId,typ);
  for(const [ac,ap,bc,bp] of edges)
   assert.ok(p.wires.some(w=>w.from?.c===ac&&w.from?.p===ap&&w.to?.c===bc&&w.to?.p===bp),id+': '+ac+'/'+ap+' -> '+bc+'/'+bp);
  assert.ok(l.explanation.includes('24 V DC'));
  assert.ok(l.explanation.includes('K1/13'));
  assert.ok(l.beginnerSteps.length>=5);
  assert.equal(l.pedagogyReview.mq07CircuitMatch,'SOURCE_ALIGNED');
  assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
  assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id===id));
 }
});
test('original solver: Hall/optical OFF -> ON -> OFF on same project object',()=>{
 for(const [id] of cases){
  const p=JSON.parse(JSON.stringify(L.byId[id].project)),s=p.components.find(c=>c.id==='s1');
  for(let i=0;i<3;i++){
   const on=i===1;
   s.state=on;s.sensing.distance=on?s.sensing.range/2:s.sensing.range*2;
   const r=Sim.solve(p,defs,{now:i*400});
   assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,id+' phase '+i);
   assert.equal(!!p.components.find(c=>c.id==='k1')._active,on,id+' coil '+i);
   assert.equal(!!p.components.find(c=>c.id==='h1')._active,on,id+' lamp '+i);
  }
 }
});
test('all 1655 original source lessons remain electrically consistent',()=>{
 const r=QA.audit({L,defs,Simulation:Sim});
 assert.equal(r.total,1655);assert.equal(r.rich,136);
 assert.equal(r.withWires,729);assert.equal(r.stable,729);
 assert.equal(r.definitionCount,940);
 assert.equal(r.virtualPracticeGuides,1519);
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])
  assert.equal(r[key].length,0,key);
});
test('BELL_TRANSFORMER_V1 transformer-only virtual model survives new lessons',()=>{
 const b=Bell.audit({L,defs,solver:Sim});
 assert.equal(b.status,'PASS');assert.equal(b.count,15);
 assert.equal(b.phaseChecks,38);assert.equal(b.phasePasses,38);
 assert.deepEqual(b.issues,[]);
});
