'use strict';
// Targeted virtual-only SCR/TRIAC/opto tests; no physical or visual acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>structuredClone(x);
const by=id=>L.byId[id],part=(p,id)=>p.components.find(c=>c.id===id);
const sample=(p,kind,deg)=>Native[kind](p,defs,{now:deg/(part(p,'ac1').frequencyHz*.36)});
const isolatedIds=['electronic-switching-outline-047','electronic-switching-outline-050','electronic-switching-outline-051','electronic-switching-outline-055'];
test('SC418 virtual SCR positive half only, open gate and invalid phase fail closed',()=>{
 const l=by('electronic-switching-outline-046'),p=clone(l.project),method='solveSc15AcCycle';
 assert.equal(p.wires.length,7);
 assert.equal(sample(p,method,45).loadV,0);
 const pos=sample(p,method,90);assert.equal(pos.verified,true);assert.ok(pos.loadV>0);
 assert.ok(sample(p,method,120).loadV>0);
 assert.equal(sample(p,method,270).loadV,0);
 const cut=clone(l.project);cut.wires=cut.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));
 const bad=sample(cut,method,90);assert.equal(bad.verified,false);assert.equal(bad.rmsV,0);
 const invalid=clone(l.project);part(invalid,'trg1').triggerAngleDeg=200;
 assert.equal(sample(invalid,method,90).verified,false);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'SOURCE_WIRED_ISOLATED_AC_SCR_WAVE_PENDING');
 assert.match(l.quiz.question,/SCR/);assert.match(l.beginnerSteps.at(-1),/PASS (verme|sayma)/);
});
test('SC419/422/423/427 TRIAC signed halves, RMS ordering, broken gate and invalid angle',()=>{
 for(const id of isolatedIds){
  const l=by(id),p=clone(l.project),method='solveSc17TriacDimmerCycle',original=JSON.stringify(l.project);
  assert.equal(p.wires.length,7);
  const positive=sample(p,method,90),negative=sample(p,method,270);
  assert.equal(positive.verified,true);assert.ok(positive.loadV>0);
  assert.equal(negative.verified,true);assert.ok(negative.loadV<0);
  assert.equal(sample(p,method,180).loadV,0);
  const early=clone(l.project);part(early,'trg1').triggerAngleDeg=45;
  const late=clone(l.project);part(late,'trg1').triggerAngleDeg=135;
  assert.ok(sample(early,method,90).rmsV>sample(late,method,90).rmsV);
  const cut=clone(l.project);cut.wires=cut.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));
  const fault=sample(cut,method,90);assert.equal(fault.verified,false);assert.equal(fault.rmsV,0);
  const invalid=clone(l.project);part(invalid,'trg1').triggerAngleDeg=200;
  assert.equal(sample(invalid,method,90).verified,false);
  assert.equal(JSON.stringify(l.project),original,id+' canonical unchanged');
  assert.match(l.beginnerSteps.at(-1),/PASS (verme|sayma)/);
 }
});
test('SC429 separate TLP521 input LED controls optically coupled virtual output only',()=>{
 const l=by('electronic-switching-outline-057'),p=clone(l.project);
 assert.equal(p.wires.length,7);
 const states=[];
 for(const pressed of [false,true,false]){
  part(p,'sg').state=pressed;
  const r=Native.solveSc18OptocouplerCycle(p,defs,{now:1000});
  assert.equal(r.verified,true);assert.equal(r.isolated,true);
  states.push([r.ledOn,r.transistorOn,r.collectorVoltageV]);
 }
 assert.deepEqual(states.map(s=>s.slice(0,2)),[[false,false],[true,true],[false,false]]);
 assert.ok(states[1][2]<1&&states[0][2]>4.9);
 const cut=clone(l.project);part(cut,'sg').state=true;
 cut.wires=cut.wires.filter(w=>!(w.from.c==='rin'&&w.to.c==='u1'));
 const r=Native.solveSc18OptocouplerCycle(cut,defs,{now:1000});
 assert.equal(r.verified,false);assert.equal(r.transistorOn,false);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'SOURCE_WIRED_TLP521_OPTICAL_FUNCTION_PENDING');
});
test('SC432 MOC3021 isolated flasher supports both half cycles and broken gate',()=>{
 const l=by('electronic-switching-outline-060'),p=clone(l.project);
 assert.equal(p.wires.length,14);
 const plus=Native.solveSc19OptoTriacCycle(p,defs,{now:125});
 assert.equal(plus.verified,true);assert.equal(plus.isolated,true);
 assert.equal(plus.ledOn,true);assert.ok(plus.loadV>0&&plus.rmsV>0);
 const minus=Native.solveSc19OptoTriacCycle(p,defs,{now:135});
 assert.ok(minus.loadV<0&&minus.triacConducting);
 const off=Native.solveSc19OptoTriacCycle(p,defs,{now:300});
 assert.equal(off.ledOn,false);assert.equal(off.rmsV,0);
 const cut=clone(l.project);cut.wires=cut.wires.filter(w=>!(w.from.c==='u1'&&w.to.c==='rg'));
 const r=Native.solveSc19OptoTriacCycle(cut,defs,{now:125});
 assert.equal(r.verified,false);assert.equal(r.rmsV,0);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'SOURCE_WIRED_OPTO_TRIAC_FLASHER_PENDING');
});
test('1655 protected lesson IDs, REVIEW concepts and unaccepted physical/visual states',()=>{
 assert.equal(L.lessons.length,1655);
 const ids=['electronic-switching-outline-046',...isolatedIds,'electronic-switching-outline-057','electronic-switching-outline-060'];
 for(const id of ids){
  const l=by(id);assert.equal(l.kind,'wiring');assert.equal(l.quiz.answer,0);
  assert.equal(l.quiz.options.length,3);assert.ok(l.beginnerSteps.length>=5);
  assert.match(l.beginnerSteps.at(-1),/PASS (verme|sayma)/);
  for(const k of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.notEqual(l.pedagogyReview[k],true);
 }
 for(const id of ['electronic-switching-outline-048','electronic-switching-outline-049','electronic-switching-outline-052','electronic-switching-outline-053'])
  assert.equal(by(id).pedagogyReview.titleTopologyStatus,'REVIEW');
});
