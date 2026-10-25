'use strict';
// SC394/398 real catalog 3-terminal potentiometer to IRF540N gate.
// Ideal virtual threshold only: no actual device electrical/3D acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>structuredClone(x);
const lessons=['electronic-switching-outline-028','electronic-switching-outline-032'];
function run(project,pct,expected){
 const pot=project.components.find(c=>c.id==='pot');
 const fet=project.components.find(c=>c.id==='q');
 pot.potentiometer=pct;
 const r=Native.solve(project,defs,{now:1000+pct});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'unstable at '+pct+'%: '+(r.reason||''));
 assert.equal(!!fet._mosfetOn,expected,'MOSFET state '+pct+'%');
}
test('SC394/398: protected source exactly five catalog parts and eight wires',()=>{
 for(const id of lessons){
  const l=L.byId[id],p=l.project;
  assert.equal(l.kind,'wiring');assert.equal(p.components.length,5);
  assert.equal(p.wires.length,8);assert.equal(l.steps.length,8);
  assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
  assert.notEqual(l.pedagogyReview?.nativeDynamicAcceptance,true);
  for(const w of p.wires)for(const e of [w.from,w.to]){
   const c=p.components.find(c=>c.id===e.c),d=defs[c?.typeId];
   assert.ok(d?.pins.some(pin=>pin.id===e.p),'unknown catalog pin '+e.c+'/'+e.p);
  }
  assert.equal(p.components.find(c=>c.id==='q').typeId,'irf540n-mosfet');
 }
});
for(const id of lessons){
 test(id+': sweep 0→10→20→50→100→0 with native nodal gate',()=>{
  const p=clone(L.byId[id].project);
  for(const [pct,expected] of [[0,false],[10,false],[20,true],[50,true],[100,true],[0,false]])
   run(p,pct,expected);
 });
 test(id+': open gate cable prevents switching',()=>{
  const p=clone(L.byId[id].project),before=p.wires.length;
  p.wires=p.wires.filter(w=>!(w.from?.c==='pot'&&w.to?.c==='q'&&w.to?.p==='G'));
  assert.equal(p.wires.length,before-1);
  run(p,100,false);
 });
 test(id+': disconnected potentiometer supply prevents switching',()=>{
  const p=clone(L.byId[id].project),before=p.wires.length;
  p.wires=p.wires.filter(w=>!(w.from?.c==='g'&&w.to?.c==='pot'&&w.to?.p==='3'));
  assert.equal(p.wires.length,before-1);
  run(p,100,false);
 });
}
