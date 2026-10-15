'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
for(const [id,wires] of [['electronic-switching-src-13',6],['electronic-switching-src-14',7]]){
 test(id+' has functional SCR A/K/G component with native wire endpoints',()=>{
  const l=L.byId[id],p=l.project,s=p.components.find(c=>c.id==='q1');
  assert.equal(l.kind,'wiring');assert.equal(p.wires.length,wires);
  assert.equal(s.typeId,'mq07-scr-virtual');
  assert.equal(defs[s.typeId].kind,'scr');
  for(const w of p.wires)for(const ep of [w.from,w.to]){
   const c=p.components.find(c=>c.id===ep.c);assert.ok(c,ep.c);
   assert.ok(defs[c.typeId].pins.some(x=>x.id===ep.p),ep.c+'/'+ep.p);
  }
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
 });
}
test('SC14 native solver gate ON versus anode STOP open scenario',()=>{
 const lesson=L.byId['electronic-switching-src-14'],p=clone(lesson.project);
 const gate=p.components.find(c=>c.id==='sg'),stop=p.components.find(c=>c.id==='sp'),lamp=p.components.find(c=>c.id==='h1');
 gate.state=true;stop.state=false;
 const on=Native.solve(p,defs,{now:1000});
 assert.ok(on.stable&&!on.shortCircuit&&!on.blocked);
 assert.equal(!!lamp._active,true);
 stop.state=true;
 const off=Native.solve(p,defs,{now:2000});
 assert.ok(off.stable&&!off.shortCircuit&&!off.blocked);
 assert.equal(!!lamp._active,false);
});
