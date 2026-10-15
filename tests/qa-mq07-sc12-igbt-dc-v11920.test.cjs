'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-12'],clone=x=>JSON.parse(JSON.stringify(x));
test('SC12 native IGBT G/C/E circuit has eight canonical connections',()=>{
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.wires.length,8);
 assert.equal(defs['mq07-igbt-virtual'].kind,'igbt-n');
 for(const pin of ['G','C','E'])assert.ok(defs['mq07-igbt-virtual'].pins.some(p=>p.id===pin));
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
test('SC12 native DC electrical solver OFF ON OFF and open gate',()=>{
 const p=clone(lesson.project),sw=p.components.find(c=>c.id==='sw'),lamp=p.components.find(c=>c.id==='h1');
 for(const on of [false,true,false]){
  sw.state=on;const r=Native.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.shortCircuit&&!r.blocked);
  assert.equal(!!lamp._active,on);
 }
 p.wires=p.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));sw.state=true;
 const r=Native.solve(p,defs,{now:2000});
 assert.ok(r.stable&&!r.shortCircuit);assert.equal(!!lamp._active,false);
});
