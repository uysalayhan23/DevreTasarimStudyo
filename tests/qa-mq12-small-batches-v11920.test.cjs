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
