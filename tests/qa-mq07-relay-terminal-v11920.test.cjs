'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const {audit:bellAudit}=require('../scripts/qa-bell-transformer-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),p=L.byId['electronic-switching-src-01'].project;
test('MQ07 relay terminal tutorial is wired with 24 V NO and NC paths',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 assert.equal(L.mq07Batch200.reviewIds.length,55);
 assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id==='electronic-switching-src-01'));
 assert.equal(L.byId['electronic-switching-src-01'].kind,'wiring');
 assert.deepEqual(p.components.map(c=>c.typeId),['arduino-bench-supply','push-no','coil-relay','lamp-green','contact-no','contact-nc','lamp-red']);
 assert.equal(p.wires.length,9);
 assert.ok(p.wires.some(w=>w.from.c==='b'&&w.from.p==='14'&&w.to.c==='k'&&w.to.p==='A1'));
 assert.ok(p.wires.some(w=>w.from.c==='nc'&&w.from.p==='22'&&w.to.c==='h2'&&w.to.p==='X1'));
 assert.match(L.byId['electronic-switching-src-01'].explanation,/A1.A2|A1\/A2/);
 assert.equal(L.byId['electronic-switching-src-01'].pedagogyReview.independentPedagogicalAcceptance,false);
});
test('MQ05 original solver returns green and red opposite OFF→ON→OFF with no fault',()=>{
 const phases=[false,true,false].map((on,i)=>{
  const pr=JSON.parse(JSON.stringify(p));pr.components.find(c=>c.id==='b').state=on;
  const state=Simulation.solve(pr,defs,{now:[0,400,850][i]});
  assert.ok(state.stable&&!state.blocked&&!state.shortCircuit&&!state.oscillating);
  return {coil:!!pr.components.find(c=>c.id==='k')._active,green:!!pr.components.find(c=>c.id==='h')._active,red:!!pr.components.find(c=>c.id==='h2')._active};
 });
 assert.deepEqual(phases,[{coil:false,green:false,red:true},{coil:true,green:true,red:false},{coil:false,green:false,red:true}]);
});
test('MQ12 entire 1655 curriculum graph and mandatory bell transformer continue to pass',()=>{
 const g=QA.audit({L,defs,Simulation});
 assert.equal(g.status,'PASS');
 const b=bellAudit({L,defs,solver:Simulation});
 assert.equal(b.status,'PASS');assert.equal(b.count,15);assert.equal(b.phasePasses,38);
});
