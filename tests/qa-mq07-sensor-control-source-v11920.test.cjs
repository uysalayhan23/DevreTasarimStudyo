'use strict';
// MQ-07 lesson source integration regression; no real-world installation procedure.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Bell=require('../scripts/qa-bell-transformer-v11920.cjs');
const cases=[{"id":"sensor-analog-apps-src-13","type":"proximity","description":"virtual inductive PNP sensor → relay NO contact → lamp"},{"id":"sensor-analog-apps-src-14","type":"sensor-through-beam","description":"virtual IR beam sensor → relay NO contact → lamp"}];
const L=QA.curriculum(),defs=QA.catalog(),copy=x=>JSON.parse(JSON.stringify(x));
function validateCircuit(l,model){
 const p=l.project,part=Object.fromEntries(p.components.map(c=>[c.id,c]));
 assert.equal(l.kind,'wiring');assert.equal(p.wires.length,7);
 assert.equal(part.s1.typeId,model);
 for(const [a,ap,b,bp] of [
 ['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],['k1','A2','g1','M'],
 ['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']]){
  assert.ok(p.wires.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp),l.id+': '+a+'/'+ap+' to '+b+'/'+bp);
 }
 for(const pin of ['P','M'])assert.ok(defs[part.g1.typeId].pins.some(x=>x.id===pin));
 for(const pin of ['BN','BU','BK'])assert.ok(defs[part.s1.typeId].pins.some(x=>x.id===pin));
 assert.match(l.explanation,/24 VDC/);
 assert.match(l.explanation,/A1\/A2/);assert.match(l.explanation,/13.?14/);
 assert.ok(l.beginnerSteps.length>=5);assert.ok(l.summary.length>100);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
}
test('two review lessons have real matched low-voltage sensor and relay wiring',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 assert.equal(L.mq07Batch200.reviewIds.length,49);
 assert.equal(L.lessons.filter(x=>x.project.wires.length>0).length,730);
 for(const v of cases){const l=L.byId[v.id];assert.ok(l);validateCircuit(l,v.type);
  assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id===v.id));}
});
test('both low voltage scenarios switch relay and lamp OFF→ON→OFF using original solver',()=>{
 for(const v of cases){
  const lesson=L.byId[v.id];
  for(const [i,state] of [false,true,false].entries()){
   const p=copy(lesson.project);p.components.find(x=>x.id==='s1').state=state;
   const result=Simulation.solve(p,defs,{now:[0,400,850][i]});
   assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,v.id+' phase '+i);
   assert.equal(!!p.components.find(x=>x.id==='k1')._active,state,v.id+' coil '+i);
   assert.equal(!!p.components.find(x=>x.id==='h1')._active,state,v.id+' lamp '+i);
  }
 }
});
test('full source and locked transformer remain unchanged in acceptance scope',()=>{
 const r=QA.audit({L,defs,Simulation});
 assert.equal(r.status,'PASS');assert.equal(r.total,1655);assert.equal(r.withWires,731);
 assert.equal(r.rich,136);assert.equal(r.missingDefinitions.length,0);
 assert.equal(r.invalidWireEndpoints.length,0);
 const b=Bell.audit({L,defs,solver:Simulation});
 assert.equal(b.status,'PASS');assert.equal(b.count,15);
 assert.equal(b.phaseChecks,38);assert.equal(b.phasePasses,38);
});
