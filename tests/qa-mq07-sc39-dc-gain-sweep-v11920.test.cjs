'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
function value(pct){const p=clone(L.byId['opamp-apps-src-04'].project);p.components.find(c=>c.id==='in').potentiometer=pct;const solved=Simulation.solve(p,defs,{now:0});assert.ok(solved.stable&&!solved.blocked&&!solved.shortCircuit);const v=p.components.find(c=>c.id==='v1')._meter?.value;assert.ok(Number.isFinite(v));return v}
test('MQ07 SC39 DC non-inverting amplifier exits upper saturation during full-range potentiometer sweep',()=>{
 const a=value(80),b=value(85),c=value(90),d=value(95),e=value(100);
 assert.ok(a>21&&a<23);
 assert.ok(b<a-1&&c<b-1&&d<c-1&&e<d-1);
 assert.ok(e>=0&&e<0.5);
});
