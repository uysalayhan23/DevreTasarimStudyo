'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-13'];
test('SC13 contains an electrically functional SCR, not a diagram-only symbol',()=>{
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.wires.length,6);
 const scr=lesson.project.components.find(c=>c.id==='q1');
 assert.equal(scr.typeId,'mq07-scr-virtual');
 assert.equal(defs[scr.typeId].kind,'scr');
 assert.deepEqual(defs[scr.typeId].pins.map(p=>p.id),['G','A','K']);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
test('SC13 original native solver DC gate OFF and ON; open A path fails closed',()=>{
 const clone=x=>JSON.parse(JSON.stringify(x));
 for(const on of [false,true,false]){
  const p=clone(lesson.project);p.components.find(c=>c.id==='sw').state=on;
  const r=Native.solve(p,defs,{now:1000});
  assert.equal(r.stable,true);assert.equal(r.shortCircuit,false);
  assert.equal(!!p.components.find(c=>c.id==='q1')._thyristorOn,on);
  assert.equal(!!p.components.find(c=>c.id==='h1')._active,on);
 }
 const p=clone(lesson.project);p.components.find(c=>c.id==='sw').state=true;
 p.wires=p.wires.filter(w=>!(w.from.c==='h1'&&w.to.c==='q1'));
 const r=Native.solve(p,defs,{now:1000});
 assert.equal(r.stable,true);assert.equal(!!p.components.find(c=>c.id==='h1')._active,false);
});
