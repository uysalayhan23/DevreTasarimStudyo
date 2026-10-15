'use strict';
// MQ-12 RC/BJT original numeric solver exercise, no mocked relay timeouts.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const ids=['electronic-switching-src-06','electronic-switching-src-07'];
function scenario(id){
 const l=L.byId[id],p=JSON.parse(JSON.stringify(l.project));
 const s=p.components.find(c=>c.id==='s1'),q=p.components.find(c=>c.id==='q1'),
  cap=p.components.find(c=>c.id==='c1'),m=p.components.find(c=>c.id==='v1'),out=[];
 for(let t=0;t<=7500;t+=250){
  s.state=t>=250&&t<2250;
  const r=Native.solve(p,defs,{now:t});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,id+' unstable at '+t);
  assert.equal(m._meter?.warning,'',id+' voltmeter at '+t);
  out.push({t,on:!!q._active,vc:cap._capacitorVoltage,meter:m._meter});
 }
 return out;
}
test('MQ-07 RC charge/discharge circuits have actual capacitor and real BD139 pins, no mock timer relay',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.mq07Batch200.reviewIds.length,51);
 assert.equal(defs.capacitor.kind,'capacitor');
 assert.equal(defs['bd139-npn'].kind,'bjt-npn');
 for(const id of ids){
  const lesson=L.byId[id],parts=lesson.project.components,ws=lesson.project.wires;
  assert.equal(lesson.pedagogyReview.titleTopologyStatus,'VIRTUAL_RC_SOURCE_ALIGNED');
  assert.equal(lesson.pedagogyReview.titleTopologyIssue,null);
  assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
  assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
  assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
  assert.equal(lesson.pedagogyReview.mq07RcTiming.nativeSolverRequired,true);
  assert.equal(ws.length,12);
  assert.equal(parts.length,10);
  assert.ok(parts.some(x=>x.id==='c1'&&x.typeId==='capacitor'));
  assert.ok(parts.some(x=>x.id==='q1'&&x.typeId==='bd139-npn'));
  assert.ok(!parts.some(x=>/timer|delay-on|delay-off/.test(x.typeId)));
  const has=(a,ap,b,bp)=>ws.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
  assert.ok(has('rb','2','c1','1')&&has('rb','2','q1','B'));
  assert.ok(has('rp','1','c1','1')&&has('rp','2','g1','M'));
  assert.ok(has('c1','2','g1','M')&&has('q1','E','g1','M'));
  assert.ok(has('v1','V','v1-red','PLUG')&&has('v1','COM','v1-black','PLUG'));
  assert.equal(parts.find(x=>x.id==='v1-red').probeTarget.p,'1');
  assert.equal(parts.find(x=>x.id==='v1-black').probeTarget.p,'2');
  assert.equal(parts.find(x=>x.id==='v1').meterPosition,3);
 }
});
test('MQ-12 ON-delay: C1 charges gradually and Q1 remains OFF until 1500 ms',()=>{
 const x=scenario(ids[0]);const at=t=>x.find(y=>y.t===t);
 assert.equal(at(0).on,false);
 assert.equal(at(1000).on,false);
 assert.equal(at(1250).on,false);
 assert.equal(at(1500).on,true);
 assert.ok(at(1000).vc>at(500).vc&&at(1500).vc>at(1000).vc);
 assert.equal(at(2000).on,true);
 assert.equal(at(2250).on,true);
 assert.equal(at(5750).on,false);
 assert.ok(at(5750).vc<at(2250).vc);
 assert.equal(at(2000).meter.unit,'V');
});
test('MQ-12 OFF-delay: press energizes Q1; releasing S1 retains ON until capacitive discharge',()=>{
 const x=scenario(ids[1]);const at=t=>x.find(y=>y.t===t);
 assert.equal(at(0).on,false);
 assert.equal(at(250).on,true);
 assert.equal(at(2000).on,true);
 assert.equal(at(2250).on,true);
 assert.equal(at(3000).on,true);
 assert.equal(at(3250).on,false);
 assert.ok(at(2250).vc>at(3000).vc&&at(3000).vc>at(3250).vc);
 assert.ok(at(2000).vc>15&&at(2000).vc<20);
 assert.equal(at(2000).meter.warning,'');
});
test('MQ-12 all 1655 lessons and 729 startup native solver circuits preserve source integrity',()=>{
 const r=QA.audit({L,defs,Simulation:Native});
 assert.equal(r.status,'PASS');assert.equal(r.total,1655);
 assert.equal(r.rich,136);assert.equal(r.withWires,729);assert.equal(r.stable,729);
 assert.equal(r.definitionCount,940);
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])
  assert.deepEqual(r[key],[],key);
});
