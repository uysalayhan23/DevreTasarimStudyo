'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {run}=require('../scripts/qa-mq12-small-batches-v11920.cjs');

test('first 10 canonical wired lessons use full native solver/catalog; retain latching review',()=>{
 const report=run({start:0,count:10});
 assert.equal(report.sourceTotal,1655);
 assert.equal(report.wiredTotal,722);
 assert.ok(report.definitionCount>=728,'full effective library required');
 assert.equal(report.classificationCoverage,'10/10');
 assert.equal(report.classificationComplete,true);
 assert.equal(report.stabilityCoverage,'10/10');
 assert.equal(report.stability.fail.length,0);
 assert.equal(report.classification.missingDefinitions.length,0);
 assert.equal(report.classification.controlled.length,8);
 assert.deepEqual(report.classification.unsupportedActuator.map(x=>x.id),['button-led-5','button-relay-4']);
 for(const id of ['button-led-1','button-led-2','seal-in-1'])
  assert.ok(report.response.pass.includes(id),id+' should respond');
 assert.equal(report.response.pass.length,8);
 assert.equal(report.restoration.pass.length,7);
 assert.deepEqual(report.restoration.review,['seal-in-1'],'START release retains the latch');
 assert.equal(report.fullAcceptance,'REVIEW');
});

test('four canonical seal-in circuits retain energy on START release and turn off on STOP',()=>{
 const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
 const solver=require('../dist/simulation.js');
 const L=QA.curriculum(),defs=QA.catalog();
 for(const id of ['seal-in-1','seal-in-2','seal-in-3','seal-in-4']){
  const lesson=L.lessons.find(l=>l.id===id);
  assert.ok(lesson,id+' canonical lesson exists');
  const original=JSON.stringify(lesson.project),p=structuredClone(lesson.project);
  const start=p.components.find(c=>c.id==='start');
  const stop=p.components.find(c=>c.id==='stop');
  const coil=p.components.find(c=>c.id==='coil');
  assert.ok(start&&stop&&coil,id+' START / STOP / coil');
  const values=[];
  for(const [at,startPressed,stopPressed] of [[0,false,false],[400,true,false],[850,false,false],[1200,false,true],[1500,false,false]]){
   start.state=startPressed;stop.state=stopPressed;
   const result=solver.solve(p,defs,{now:at});
   assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,id+' '+at+' stable');
   values.push(!!coil._active);
  }
  assert.deepEqual(values,[false,true,true,false,false],id+' OFF -> ON -> HOLD -> STOP -> OFF');
  assert.equal(JSON.stringify(lesson.project),original,id+' canonical graph unchanged');
 }
});
