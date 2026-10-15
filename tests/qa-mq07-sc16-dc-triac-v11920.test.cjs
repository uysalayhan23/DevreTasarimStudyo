'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-16';
const lesson=L.byId[id],clone=x=>JSON.parse(JSON.stringify(x));
test('SC16 actual component and canonical gate/MT1/MT2 pins, wired lesson',()=>{
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.wires.length,6);
 assert.equal(defs['mq07-triac-virtual'].kind,'triac');
 for(const pin of ['G','MT1','MT2'])assert.ok(defs['mq07-triac-virtual'].pins.some(p=>p.id===pin));
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
test('SC16 native solver OFF ON OFF and gate-open negative case',()=>{
 const p=clone(lesson.project),sw=p.components.find(c=>c.id==='sw'),lamp=p.components.find(c=>c.id==='h1');
 for(const on of [false,true,false]){
  sw.state=on;const r=Native.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.shortCircuit&&!r.blocked);
  assert.equal(!!lamp._active,on);
 }
 p.wires=p.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));
 sw.state=true;const r=Native.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.shortCircuit);assert.equal(!!lamp._active,false);
});
