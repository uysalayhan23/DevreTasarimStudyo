'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Simulation=require('../dist/simulation.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const ids=['installation-systems-src-08','installation-systems-outline-069'];
const clone=v=>JSON.parse(JSON.stringify(v));
test('both virtual building junction courses have distinct phase and neutral splices',()=>{
 const L=QA.curriculum(),defs=QA.catalog();
 const box=defs['building-junction'];
 assert.equal(box.kind,'splice','Do not alter all library junctions to conceal the wiring short');
 for(const id of ids){
  const lesson=L.byId[id],project=lesson.project;
  assert.ok(lesson,id+' absent');
  assert.equal(project.components.filter(c=>c.typeId==='building-junction').length,2);
  assert.equal(project.wires.length,4);
  assert.equal(lesson.steps.length,project.wires.length);
  const phase=project.components.find(c=>c.id==='j1'),neutral=project.components.find(c=>c.id==='j2');
  assert.equal(phase.typeId,'building-junction');
  assert.equal(neutral.typeId,'building-junction');
  assert.notEqual(phase.id,neutral.id);
  assert.ok(Math.abs(phase.y-neutral.y)>=box.h,'Independent electrical splices must not overlap visually');
  assert.ok(project.wires.some(w=>w.from.c==='g1'&&w.from.p==='L'&&w.to.c==='j1'));
  assert.ok(project.wires.some(w=>w.from.c==='j1'&&w.to.c==='h1'&&w.to.p==='X1'));
  assert.ok(project.wires.some(w=>w.from.c==='g1'&&w.from.p==='N'&&w.to.c==='j2'));
  assert.ok(project.wires.some(w=>w.from.c==='j2'&&w.to.c==='h1'&&w.to.p==='X2'));
  assert.ok(!project.wires.some(w=>['L','N'].includes(w.from.p)&&w.from.c==='g1'&&w.to.c==='j3'));
  const out=Simulation.solve(clone(project),defs,{now:0});
  assert.equal(out.blocked,false,id+' blocked');
  assert.equal(out.shortCircuit,false,id+' short circuit');
  assert.equal(out.stable,true,id+' unstable');
 }
});
test('historical single-junction 230 V fault remains detectable and cannot be accepted',()=>{
 const L=QA.curriculum(),defs=QA.catalog(),project=clone(L.byId[ids[0]].project);
 project.wires.find(w=>w.from.c==='g1'&&w.from.p==='N').to.c='j1';
 project.wires.find(w=>w.to.c==='h1'&&w.to.p==='X2').from.c='j1';
 const result=Simulation.solve(project,defs,{now:0});
 assert.equal(result.shortCircuit,true,'Regression should detect the previous L/N common-junction error');
});
