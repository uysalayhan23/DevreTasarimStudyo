'use strict';
// SC462–467: observed native virtual readings, intact terminals and REVIEW guards.
// No full-curriculum QA, Windows/3D or physical device acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),copy=x=>structuredClone(x);
const get=sc=>L.lessons[sc-1],part=(p,id)=>p.components.find(c=>c.id===id);
const solver=(p,time=1000)=>{const r=Native.solve(p,defs,{now:time});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);return r;};
const cut=(p,a,b)=>{const old=p.wires.length;p.wires=p.wires.filter(w=>w.from.c!==a||w.to.c!==b);assert.equal(p.wires.length,old-1);};
const locks=sc=>{const l=get(sc);assert.equal(l.project.wires.length,l.steps.length);assert.equal(l.quiz.answer,0);
 for(const k of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])assert.notEqual(l.pedagogyReview[k],true);};
test('SC462 PNP through-beam detector: far-near-far, BK/BN negatives',()=>{
 const l=get(462),p=copy(l.project),observed=[];
 for(const distance of [80,2,80]){part(p,'s1').sensing.distance=distance;solver(p);observed.push([!!part(p,'k1')._active,!!part(p,'h1')._active]);}
 assert.deepEqual(observed,[[false,false],[true,true],[false,false]]);
 for(const edge of [['s1','k1'],['g1','s1']]){
  const p=copy(l.project);part(p,'s1').sensing.distance=2;cut(p,...edge);solver(p);
  assert.equal(!!part(p,'h1')._active,false);
 }
 assert.equal(l.project.components.length,5);locks(462);
});
test('SC463/466 LDR LM358P: dark ON, bright OFF, broken gate/load/IC supply fails closed',()=>{
 for(const sc of [463,466]){
  const l=get(sc),p=copy(l.project),states=[];
  for(const lux of [1,100,1]){part(p,'s1').illuminationLux=lux;solver(p);states.push(!!part(p,'h1')._active);}
  assert.deepEqual(states,[true,false,true]);
  for(const edge of [['rg','q1'],['h1','q1'],['g1','u1']]){
   const bad=copy(l.project);part(bad,'s1').illuminationLux=1;cut(bad,...edge);solver(bad);
   assert.equal(!!part(bad,'h1')._active,false,sc+'/'+edge.join('>'));
  }
  assert.equal(l.project.wires.length,19);locks(sc);
 }
});
test('SC465 real TLP521 isolated virtual LED and collector: OFF-ON-OFF, broken input/output',()=>{
 const l=get(465),p=copy(l.project),statuses=[];
 for(const state of [false,true,false]){part(p,'sg').state=state;const x=Native.solveSc18OptocouplerCycle(p,defs,{now:1000});assert.equal(x.verified,true);
  statuses.push([x.ledOn,x.transistorOn,x.collectorVoltageV]);}
 assert.deepEqual(statuses.map(x=>x.slice(0,2)),[[false,false],[true,true],[false,false]]);
 assert.ok(Math.abs(statuses[0][2]-5)<.0001&&Math.abs(statuses[1][2]-.2)<.0001);
 for(const edge of [['sg','rin'],['rout','u1']]){const bad=copy(l.project);part(bad,'sg').state=true;cut(bad,...edge);
  const x=Native.solveSc18OptocouplerCycle(bad,defs,{now:1000});assert.equal(x.verified,false);assert.equal(x.transistorOn,false);}
 assert.equal(l.project.components.length,6);locks(465);
});
test('SC467 12 V DC LDR dimmer sweeps brightness, gate and load cuts remove power; SC464 stays reference',()=>{
 const l=get(467),p=copy(l.project),brightness=[];
 for(const lux of [10,100,1000]){
  part(p,'s1').illuminationLux=lux;solver(p);
  brightness.push(part(p,'h1')._dimmerBrightnessPct);
 }
 assert.ok(brightness[0]>10&&brightness[0]<15);
 assert.ok(brightness[1]>65&&brightness[1]<75);
 assert.ok(brightness[2]>95&&brightness[2]<100);
 for(const edge of [['s1','q1'],['h1','q1']]){
  const bad=copy(l.project);part(bad,'s1').illuminationLux=1000;cut(bad,...edge);solver(bad);
  assert.ok(part(bad,'h1')._dimmerBrightnessPct<.1);
 }
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,'LDR_DC_DIMMER_OUTLINE_NATIVE_UNVERIFIED');
 const ref=get(464);assert.equal(ref.kind,'quiz');assert.equal(ref.project.wires.length,0);
 assert.equal(ref.project.referenceOnly,true);locks(467);
});
test('only verified teaching text changed; 1655 curriculum and acceptance untouched',()=>{
 assert.equal(L.lessons.length,1655);
 for(const sc of [462,463,465,467]){const l=get(sc);
  assert.ok(l.beginnerSteps.length>=5);assert.equal(l.quiz.options.length,3);
  assert.match(l.quiz.question,/\?/);locks(sc);
 }
 assert.equal(get(466).pedagogyReview.titleTopologyStatus,'SOURCE_WIRED_LDR_DARK_SWITCH_WITH_LOAD');
});
