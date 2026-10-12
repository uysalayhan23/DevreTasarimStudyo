'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-transitions-v11920.cjs');
const L={lessons:[{id:'virtual-switch-fixture',project:{
 components:[{id:'sw',typeId:'switch',state:false},{id:'h',typeId:'lamp'}],
 wires:[{from:{c:'sw',p:'13'},to:{c:'h',p:'X1'}}]}}]};
const defs={switch:{kind:'switch-no'},lamp:{kind:'lamp'}};
test('stateful QA observes actual OFF -> ON -> OFF changes on the same virtual project',()=>{
 const solver={solve(p){const sw=p.components.find(c=>c.id==='sw'),h=p.components.find(c=>c.id==='h');
  h._active=sw.state;h._powered=sw.state;
  return {blocked:false,shortCircuit:false,stable:true,oscillating:false};}};
 const report=QA.run({L,defs,solver});
 assert.equal(report.controls,1);
 assert.equal(report.transitions,3);
 assert.equal(report.changedOutputs,1);
 assert.equal(report.returnedOutputs,1);
 assert.equal(report.failed.length,0);
 assert.equal(report.status,'FAIL','small fixture must never count as full 1655 PASS');
});
test('stateful QA fails closed when a later state produces an electrical short or oscillation',()=>{
 const solver={solve(p){const state=p.components.find(c=>c.id==='sw').state;
  return {blocked:false,shortCircuit:state,stable:!state,oscillating:state};}};
 const report=QA.run({L,defs,solver});
 assert.equal(report.controls,1);
 assert.equal(report.transitions,3);
 assert.equal(report.failed.length,1);
 assert.equal(report.oscillating.length,1);
 assert.equal(report.status,'FAIL');
});
