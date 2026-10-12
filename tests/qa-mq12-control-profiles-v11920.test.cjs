'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Profiles=require('../scripts/qa-mq12-control-profiles-v11920.cjs');
const Native=require('../dist/simulation.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();

test('native curriculum / catalog and first ten preserve causal OFF ON OFF evidence',()=>{
 const r=Profiles.run({L,defs,solver:Native,start:0,count:10});
 assert.equal(r.sourceTotal,1655);assert.equal(r.wiredTotal,722);
 assert.equal(r.definitionCount,939);
 assert.deepEqual(r.classification,{CONTROLLED:8,UNSUPPORTED_ACTUATOR:2,PASSIVE_STABILITY_ONLY:0,MISSING_DEFINITIONS:0});
 assert.equal(r.stability.fail,0);assert.equal(r.stability.phases,26);
 assert.deepEqual(r.response,{PASS:8,REVIEW:0,NOT_APPLICABLE:2});
 assert.deepEqual(r.restoration,{PASS:8,REVIEW:0,NOT_APPLICABLE:2});
 assert.equal(r.lessons.find(x=>x.id==='seal-in-1').profile,'LATCH_START_STOP');
 assert.equal(r.lessons.find(x=>x.id==='button-led-5').classification,'UNSUPPORTED_ACTUATOR');
 assert.equal(r.fullAcceptance,'REVIEW');
});

test('unmodeled proximity stimulus must not become sensor PASS',()=>{
 const x=L.lessons.find(l=>l.id==='inductive-capacitive-1');
 const r=Profiles.run({L:{lessons:[x]},defs,solver:Native});
 assert.equal(r.classification.CONTROLLED,1);
 assert.equal(r.lessons[0].profile,'SENSOR_TOGGLE');
 assert.ok(r.lessons[0].reason.includes('SENSOR_STIMULUS_NOT_MODELED'));
 assert.equal(r.lessons[0].response,'REVIEW');assert.equal(r.lessons[0].restoration,'REVIEW');
});

test('forward/reverse START takes precedence over STOP without editing canonical circuit',()=>{
 const x=L.lessons.find(l=>l.id==='motor-forward-reverse-1');
 assert.equal(Profiles.choice(x.project).id,'startF');
 const before=JSON.stringify(x.project);
 const r=Profiles.run({L:{lessons:[x]},defs,solver:Native});
 assert.equal(r.classification.CONTROLLED,1);
 assert.equal(r.lessons[0].controlId,'startF');
 assert.equal(JSON.stringify(x.project),before);
});

test('control state changing without downstream causal output cannot receive response PASS',()=>{
 const f={lessons:[{id:'timer-drift',project:{components:[{id:'s',typeId:'push-no',state:false},{id:'l',typeId:'led'}],wires:[{from:{c:'s',p:'13'},to:{c:'l',p:'A'}}]}}]};
 const d={'push-no':{kind:'switch-no'},led:{kind:'led'}};
 const solver={solve(p,_d,{now}){p.components[1]._active=now>=400;return{stable:true};}};
 const r=Profiles.run({L:f,defs:d,solver});
 assert.equal(r.stability.fail,0);assert.equal(r.response.REVIEW,1);
 assert.equal(r.response.PASS,0);assert.equal(r.fullAcceptance,'REVIEW');
});

test('unsupported Arduino stays unaccepted; passive has no fabricated virtual actuation',()=>{
 const lessons=['button-led-5','timer-flipflop-1'].map(id=>L.lessons.find(l=>l.id===id));
 const r=Profiles.run({L:{lessons},defs,solver:Native});
 assert.equal(r.classification.UNSUPPORTED_ACTUATOR,1);
 assert.equal(r.classification.PASSIVE_STABILITY_ONLY,1);
 assert.equal(r.response.NOT_APPLICABLE,2);assert.equal(r.restoration.NOT_APPLICABLE,2);
 assert.equal(r.stability.phases,0);
});
