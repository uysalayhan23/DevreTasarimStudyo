'use strict';
// MQ-12 regression: original 24 V DC relay/DPDT motor polarity solver;
// intentional quiz preservation and explicit fail-closed broken-wire tests.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-03';
const lesson=L.byId[id],clone=x=>JSON.parse(JSON.stringify(x));
const get=(p,k)=>p.components.find(c=>c.id===k);
test('MQ-07 51-reference triage has exactly 14 preserved quizzes and 36 pending applications',()=>{
 const t=L.mq07Batch200.noWireTriage;
 assert.equal(t.originalTotal,51);
 assert.equal(t.conceptPreservedIds.length,14);
 assert.equal(t.applicationRepairIds.length,36);
 assert.deepEqual(t.repairedVirtualIds,[id]);
 assert.equal(L.mq07Batch200.reviewIds.length,50);
 assert.equal(L.mq07Batch200.reviewIds.every(x=>x.reason==='NO_WIRED_CIRCUIT'),true);
 const protectedSet=new Set(t.conceptPreservedIds);
 const pendingSet=new Set(t.applicationRepairIds);
 for(const cid of protectedSet){
  const x=L.byId[cid];assert.ok(x,'missing concept '+cid);
  assert.equal(x.kind,'quiz',cid);assert.equal(x.project.wires.length,0,cid);
  assert.ok(L.mq07Batch200.reviewIds.some(r=>r.id===cid),'no false acceptance '+cid);
  assert.equal(x.pedagogyReview.independentPedagogicalAcceptance,false);
 }
 for(const aid of pendingSet){
  const x=L.byId[aid];assert.ok(x,'missing application '+aid);
  assert.equal(x.kind,'quiz',aid);
  assert.ok(L.mq07Batch200.reviewIds.some(r=>r.id===aid),'no false acceptance '+aid);
 }
 assert.ok(!protectedSet.has(id)&&!pendingSet.has(id));
});
test('repaired motor lesson uses common K1 coil and physically separate two changeover polarities',()=>{
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,null);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.project.components.length,6);
 assert.equal(lesson.project.wires.length,9);
 assert.equal(get(lesson.project,'g1').dcVoltage,24);
 assert.equal(get(lesson.project,'ka').ref,'K1');
 assert.equal(get(lesson.project,'kb').ref,'K1');
 assert.equal(get(lesson.project,'k1').ref,'K1');
 assert.deepEqual(defs['contact-both'].pins.map(p=>p.id),['11','13','21']);
 assert.deepEqual(defs['motor-dc'].pins.slice(0,2).map(p=>p.id),['+','−']);
 const has=(a,ap,b,bp)=>lesson.project.wires.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
 const links=[
 ['g1','P','sw','13'],['sw','14','k1','A1'],['k1','A2','g1','M'],
 ['g1','P','ka','21'],['g1','P','kb','13'],['g1','M','ka','13'],['g1','M','kb','21'],
 ['ka','11','m1','+'],['kb','11','m1','−']
 ];for(const wire of links)assert.ok(has(...wire),wire.join('/'));
});
test('MQ-12 real native DC motor solver reverses 5 times without short/oscillation',()=>{
 const p=clone(lesson.project),button=get(p,'sw'),motor=get(p,'m1'),coil=get(p,'k1'),trace=[];
 for(const [i,pressed] of [false,true,false,true,false].entries()){
  button.state=pressed;const r=Native.solve(p,defs,{now:i*1000});
  assert.ok(r.stable&&!r.shortCircuit&&!r.blocked&&!r.oscillating,'native relay at '+i);
  assert.equal(motor._active,true);assert.equal(coil._active,pressed);
  assert.equal(motor._spin,pressed?-1:1);
  trace.push(motor._spin);
 }
 assert.deepEqual(trace,[1,-1,1,-1,1]);
});
test('MQ-12 broken motor return, coil control and wrong relay reference do not fake reverse',()=>{
 for(const what of ['motorOpen','coilOpen','wrongRef']){
  const p=clone(lesson.project),button=get(p,'sw'),motor=get(p,'m1');
  button.state=true;
  if(what==='motorOpen')p.wires=p.wires.filter(w=>!(w.to.c==='m1'&&w.to.p==='−'));
  if(what==='coilOpen')p.wires=p.wires.filter(w=>!(w.to.c==='k1'&&w.to.p==='A1'));
  if(what==='wrongRef')get(p,'kb').ref='K2';
  const r=Native.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.shortCircuit&&!r.blocked&&!r.oscillating,what);
  if(what==='coilOpen'){assert.equal(motor._active,true);assert.equal(motor._spin,1)}
  else{assert.equal(motor._active,false);assert.equal(motor._spin,0)}
 }
});
test('MQ-12 original full source audit validates 1655 and 730 wired, preserving 136 golden rich',()=>{
 const a=QA.audit({L,defs,Simulation:Native});
 assert.equal(a.status,'PASS');
 assert.equal(a.total,1655);assert.equal(a.rich,136);
 assert.equal(a.withWires,730);assert.equal(a.stable,730);
 assert.equal(a.definitionCount,940);
 assert.equal(a.componentsChecked,7278);
 assert.equal(a.wireEndpointsChecked,16624);
 for(const k of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])assert.deepEqual(a[k],[],k);
});
