'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {run}=require('../scripts/qa-mq12-small-batches-v11920.cjs');
const L={lessons:[{id:'switch-led',project:{components:[{id:'sw',typeId:'push-no',state:false},{id:'led',typeId:'led'}],wires:[{from:{c:'sw',p:'13'},to:{c:'led',p:'A'}}]}}]};
const defs={'push-no':{kind:'switch-no'},led:{kind:'led'}};
const solveFor=mode=>({solve(project,_defs,{now}){project.components[1]._active=mode==='switch'?!!project.components[0].state:now>=400;return{stable:true,blocked:false,shortCircuit:false,oscillating:false};}});
test('actuated lamp responds and restores while complete acceptance remains REVIEW',()=>{
 const r=run({L,defs,solver:solveFor('switch')});
 assert.deepEqual(r.response.pass,['switch-led']);
 assert.deepEqual(r.restoration.pass,['switch-led']);
 assert.equal(r.classificationCoverage,'1/1');
 assert.equal(r.stabilityCoverage,'1/1');
 assert.equal(r.fullAcceptance,'REVIEW');
});
test('time-only drift cannot count as actuator response',()=>{
 const r=run({L,defs,solver:solveFor('time')});
 assert.deepEqual(r.stability.pass,['switch-led']);
 assert.deepEqual(r.response.pass,[]);
 assert.deepEqual(r.response.review,['switch-led']);
 assert.deepEqual(r.restoration.review,['switch-led']);
 assert.equal(r.fullAcceptance,'REVIEW');
});

test('unsupported catalog actuator remains separate from passive and cannot earn response PASS',()=>{
 const sample={lessons:[{id:'vendor-actuator',project:{components:[
  {id:'act',typeId:'vendor-k42',state:false},{id:'lamp',typeId:'led'}
 ],wires:[{from:{c:'act',p:'1'},to:{c:'lamp',p:'A'}}]}}]};
 const r=run({L:sample,defs:{'vendor-k42':{kind:'switch-no'},led:{kind:'led'}},
  solver:{solve(p,_d,{now}){p.components[1]._active=now>=400;return{stable:true};}}});
 assert.equal(r.classification.unsupportedActuator.length,1);
 assert.equal(r.classification.passive.length,0);
 assert.equal(r.response.pass.length,0);
 assert.equal(r.fullAcceptance,'REVIEW');
});
test('passive circuit is stability-only, without simulated actuation acceptance',()=>{
 const sample={lessons:[{id:'passive-source',project:{components:[
  {id:'power',typeId:'supply-dc-plus'},{id:'lamp',typeId:'led'}
 ],wires:[{from:{c:'power',p:'P'},to:{c:'lamp',p:'A'}}]}}]};
 const r=run({L:sample,defs:{'supply-dc-plus':{kind:'supply'},led:{kind:'led'}},
  solver:{solve(p){p.components[1]._active=true;return{stable:true};}}});
 assert.equal(r.classification.passive.length,1);
 assert.equal(r.classification.unsupportedActuator.length,0);
 assert.equal(r.stabilityCoverage,'1/1');
 assert.equal(r.responseCoverage,'0/0');
 assert.equal(r.fullAcceptance,'REVIEW');
});

test('empty batch must not claim complete classification or full acceptance',()=>{
 const r=run({L,defs,solver:solveFor('switch'),start:1,count:10});
 assert.equal(r.count,0);
 assert.equal(r.classificationCoverage,'0/0');
 assert.equal(r.classificationComplete,false);
 assert.equal(r.fullAcceptance,'REVIEW');
});
