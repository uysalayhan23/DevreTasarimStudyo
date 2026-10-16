'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const lesson=QA.curriculum().byId['opamp-apps-src-12'];
const defs=QA.catalog();
function sample(a,b){
 const p=structuredClone(lesson.project);
 p.components.find(c=>c.id==='in').potentiometer=a;
 p.components.find(c=>c.id==='in2').potentiometer=b;
 const state=Simulation.solve(p,defs,{now:0});
 assert.ok(state.stable&&!state.blocked&&!state.shortCircuit,'solver '+a+','+b);
 const meter=p.components.find(c=>c.id==='v1')._meter;
 assert.ok(Number.isFinite(meter.value)&&!meter.warning);
 return meter.value;
}
test('SC47 LM358 two-input summing circuit responds to either input',()=>{
 assert.match(lesson.title,/toplayıcı/i);
 const lo=sample(10,10),left=sample(90,10),right=sample(10,90),hi=sample(90,90);
 assert.ok(lo>=0&&lo<1,'both low');
 assert.ok(left>9&&left<13,'input A high');
 assert.ok(right>9&&right<13,'input B high');
 assert.ok(Math.abs(left-right)<0.1,'symmetric inputs');
 assert.ok(hi>20&&hi<23,'both high, supply limited');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
