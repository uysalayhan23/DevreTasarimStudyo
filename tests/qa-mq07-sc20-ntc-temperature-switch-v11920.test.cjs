'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js'),L=QA.curriculum(),defs=QA.catalog();
const lesson=L.byId['sensor-analog-apps-src-01'],part=(p,id)=>p.components.find(c=>c.id===id);
function sample(temperature,cut){
 const p=JSON.parse(JSON.stringify(lesson.project));part(p,'s1').temperature=temperature;
 if(cut)p.wires=p.wires.filter(w=>!cut(w));
 const r=Native.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
 return {h:part(p,'h1'),q:part(p,'q1'),u:part(p,'u1')};
}
test('SC20 target real component pins, wired load and no physical acceptance',()=>{
 assert.equal(lesson.project.components.length,13);
 assert.equal(lesson.project.wires.length,19);
 assert.equal(lesson.steps.length,19);
 assert.equal(part(lesson.project,'q1').typeId,'irf540n-mosfet');
 assert.deepEqual(Array.from(defs['irf540n-mosfet'].pins.map(p=>p.id)),['G','D','S']);
 for(const k of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(lesson.pedagogyReview[k],false);
});
test('SC20 native 15/35/15 Celsius load transition',()=>{
 const a=sample(15),b=sample(35),c=sample(15);
 assert.ok(!a.h._active&&a.u._opampChannels['1'].output<1);
 assert.ok(b.h._active&&b.u._opampChannels['1'].output>20);
 assert.ok(b.h._currentValue>.09&&b.h._currentValue<.11);
 assert.ok(b.q._mq07NtcGateV>8&&b.q._mq07NtcGateV<15);
 assert.ok(!c.h._active);
});
test('SC20 unplug gate or supply disables lamp',()=>{
 for(const cut of [w=>w.from.c==='rg'&&w.to.c==='q1',w=>w.from.c==='h1'&&w.to.c==='q1',w=>w.from.c==='g1'&&w.to.c==='h1']){
  const x=sample(35,cut);assert.ok(!x.h._active&&!(x.h._currentValue>1e-4));
 }
});
test('SC11 to SC19 and original NTC comparator remain present',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 assert.ok(L.byId['opamp-apps-src-08'].project.components.some(c=>c.typeId==='sensor-ntc'));
 assert.equal(L.lessons.length,1655);
});
