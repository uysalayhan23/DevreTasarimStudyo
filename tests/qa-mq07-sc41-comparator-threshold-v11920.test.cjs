'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const lesson=QA.curriculum().byId['opamp-apps-src-06'],defs=QA.catalog();
const clone=x=>JSON.parse(JSON.stringify(x));
test('SC41 LM358 comparator changes state around 12 V divider threshold',()=>{
 assert.match(lesson.title,/karşılaştırıcı/i);
 const outputs=[];
 for(const pct of [0,25,50,75,100]){
  const p=clone(lesson.project);
  p.components.find(c=>c.id==='in').potentiometer=pct;
  const solved=Simulation.solve(p,defs,{now:0});
  assert.ok(solved.stable&&!solved.shortCircuit&&!solved.blocked);
  const m=p.components.find(c=>c.id==='v1')._meter;
  assert.ok(!m.warning&&Number.isFinite(m.value),'meter pct='+pct);
  outputs.push(m.value);
 }
 assert.ok(outputs[0]>20&&outputs[1]>20,'upper output');
 assert.ok(outputs[3]<1&&outputs[4]<1,'lower output');
 assert.ok(outputs[1]-outputs[3]>15,'comparator threshold transition');
});
