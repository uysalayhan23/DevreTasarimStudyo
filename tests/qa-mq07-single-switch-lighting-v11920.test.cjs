'use strict';
// Exact canonical-source virtual circuit QA: no physical mains installation instructions.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const {audit:bellAudit}=require('../scripts/qa-bell-transformer-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const l=L.byId['installation-systems-src-01'];
const copied=p=>JSON.parse(JSON.stringify(p));
test('MQ07 single light is a real four-wire, correctly named virtual circuit',()=>{
 assert.ok(l&&l.kind==='wiring'&&!l.project.referenceOnly);
 assert.deepEqual(l.project.components.map(c=>c.typeId),['supply-1p','mcb-1p','wall-switch','ceiling-light']);
 assert.deepEqual(l.project.wires.map(w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p),
  ['pg0/L>pg1/1','pg1/2>pg2/13','pg2/14>pg3/X1','pg3/X2>pg0/N']);
 assert.equal(l.pedagogyReview.titleTopologyIssue,null);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
 assert.ok(l.explanation.includes('Kayıtlı şemadan izlenecek bağlantılar:'));
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 assert.equal(L.mq07Batch200.reviewIds.length,49);
});
test('MQ05 virtual open/close/isolated lighting behavior is real solver, not a text-only claim',()=>{
 const seen=[];
 for(const opened of [false,true])for(const closed of [false,true]){
  const p=copied(l.project);
  p.components.find(x=>x.id==='pg1').state=opened;
  p.components.find(x=>x.id==='pg2').state=closed;
  const z=Simulation.solve(p,defs,{now:1200});
  assert.ok(z.stable&&!z.blocked&&!z.shortCircuit&&!z.oscillating);
  seen.push(!!p.components.find(x=>x.id==='pg3')._active);
 }
 assert.deepEqual(seen,[false,true,false,false]);
});
test('MQ12 bell transformer lock still rejects unsafe direct mains and preserves simulator outputs',()=>{
 const result=bellAudit({L,defs,solver:Simulation});
 assert.equal(result.status,'PASS');
 assert.equal(result.count,15);
 assert.equal(result.phaseChecks,38);
 assert.equal(result.phasePasses,38);
 assert.deepEqual(result.issues,[]);
});
