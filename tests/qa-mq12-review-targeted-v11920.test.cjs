'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Profiles=require('../scripts/qa-mq12-control-profiles-v11920.cjs');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const one=id=>{const l=L.lessons.find(x=>x.id===id);assert.ok(l,'missing canonical lesson '+id);return l};
const inspect=id=>Profiles.run({L:{lessons:[one(id)]},defs,solver:Native}).lessons[0];

test('all 722 native classifications and profile stability remain complete; behavior acceptance remains REVIEW',()=>{
 const r=Profiles.run({L,defs,solver:Native});
 assert.equal(r.sourceTotal,1655);assert.equal(r.wiredTotal,722);assert.equal(r.definitionCount,939);
 assert.equal(r.classificationCoverage,'722/722');
 assert.deepEqual(r.classification,{CONTROLLED:456,UNSUPPORTED_ACTUATOR:67,PASSIVE_STABILITY_ONLY:199,MISSING_DEFINITIONS:0});
 assert.deepEqual(r.stability,{phases:2052,pass:2052,fail:0});
 assert.deepEqual(r.response,{PASS:391,REVIEW:65,NOT_APPLICABLE:266});
 assert.deepEqual(r.restoration,{PASS:384,REVIEW:72,NOT_APPLICABLE:266});
 assert.equal(r.lessons.filter(x=>x.response==='REVIEW'||x.restoration==='REVIEW').length,72);
 assert.equal(r.fullAcceptance,'REVIEW');
});
test('jog is not a seal-in latch; START release removes coil and motor power',()=>{
 const l=one('motor-direct-power-src-04'),snapshot=JSON.stringify(l.project),p=JSON.parse(snapshot);
 assert.equal(Profiles.isMomentaryJog(l,p,defs),true);
 const result=inspect(l.id);assert.equal(result.profile,'MOMENTARY_JOG');
 assert.equal(result.response,'PASS');assert.equal(result.restoration,'PASS');
 assert.deepEqual(result.phaseStable,[true,true,true]);
 const start=p.components.find(x=>x.id==='start'),stop=p.components.find(x=>x.id==='stop'),coil=p.components.find(x=>x.id==='coil'),motor=p.components.find(x=>x.id==='motor');
 const outputs=[];
 for(const [now,s,t] of [[0,false,false],[400,true,false],[850,false,false],[1200,false,true],[1500,false,false]]){
  start.state=s;stop.state=t;const x=Native.solve(p,defs,{now});
  assert.ok(x.stable&&!x.blocked&&!x.shortCircuit&&!x.oscillating);
  outputs.push([!!coil._active,!!motor._active]);
 }
 assert.deepEqual(outputs,[[false,false],[true,true],[false,false],[false,false],[false,false]]);
 assert.equal(JSON.stringify(l.project),snapshot);
 assert.equal(inspect('seal-in-1').profile,'LATCH_START_STOP');
});
test('meter-visible reactive response is causal but residual energy prevents restoration PASS',()=>{
 const x=inspect('electronic-component-basics-outline-012');
 assert.equal(x.profile,'DIRECT_TOGGLE');assert.equal(x.response,'PASS');assert.equal(x.restoration,'REVIEW');
 assert.ok(x.reason.includes('REACTIVE_STATE_NOT_SETTLED'));
 assert.ok(x.reason.includes('RELEASE_NOT_RESTORED'));
 assert.deepEqual(x.phaseStable,[true,true,true]);
});
test('physical target with meter reading is observed; missing sensor stimulus stays REVIEW',()=>{
 const sensed=one('measurement-workshop-src-10');
 assert.ok(sensed.project.components.find(c=>c.id==='s1').sensing?.target);
 const x=inspect(sensed.id);
 assert.equal(x.profile,'SENSOR_TOGGLE');assert.equal(x.response,'PASS');assert.equal(x.restoration,'PASS');
 const y=inspect('inductive-capacitive-1');
 assert.equal(y.response,'REVIEW');assert.equal(y.restoration,'REVIEW');
 assert.ok(y.reason.includes('SENSOR_STIMULUS_NOT_MODELED'));
});
test('time-only meter drift cannot earn causal response or restoration PASS',()=>{
 const f={lessons:[{id:'time-only',project:{components:[{id:'s',typeId:'push-no',state:false},{id:'m',typeId:'unit-ut33d-plus'}],wires:[{from:{c:'s',p:'13'},to:{c:'m',p:'COM'}}]}}]};
 const d={'push-no':{kind:'switch-no'},'unit-ut33d-plus':{kind:'multimeter'}};
 const fake={solve(p,_d,{now}){p.components[1]._meter={value:now>=400?24:0,display:now>=400?'24':'0'};return{stable:true}}};
 const x=Profiles.run({L:f,defs:d,solver:fake}).lessons[0];
 assert.equal(x.response,'REVIEW');assert.equal(x.restoration,'REVIEW');
});
