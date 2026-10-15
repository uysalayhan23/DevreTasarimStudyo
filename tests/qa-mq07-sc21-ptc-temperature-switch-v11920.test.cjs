'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js'),L=QA.curriculum(),defs=QA.catalog();
const lesson=L.byId['sensor-analog-apps-src-02'],part=(p,id)=>p.components.find(x=>x.id===id);
function sample(temp,cut){
 const p=JSON.parse(JSON.stringify(lesson.project));part(p,'s1').temperature=temp;
 if(cut)p.wires=p.wires.filter(w=>!cut(w));
 const r=Native.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
 return {p,h:part(p,'h1'),q:part(p,'q1'),u:part(p,'u1')};
}
test('PTC SC21 has real LM358P, correct 2/3 polarity, IRF540N and 19 wires',()=>{
 assert.equal(lesson.project.components.length,13);
 assert.equal(lesson.project.wires.length,19);
 assert.equal(lesson.steps.length,19);
 assert.equal(part(lesson.project,'r1').resistance,2000);
 assert.equal(part(lesson.project,'q1').typeId,'irf540n-mosfet');
 for(const [a,ap,b,bp] of [['s1','2','u1','2'],['r2','2','u1','3'],['rg','2','q1','G'],['h1','X2','q1','D']])
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
 for(const k of ['physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance'])
  assert.equal(lesson.pedagogyReview[k],false);
});
test('PTC SC21 native 35-65-35 °C really switches 240 Ohm load',()=>{
 const a=sample(35),b=sample(65),c=sample(35);
 assert.ok(!a.h._active&&a.u._opampChannels['1'].diff<0);
 assert.ok(b.h._active&&b.u._opampChannels['1'].diff>1);
 assert.ok(b.h._currentValue>.09&&b.h._currentValue<.11);
 assert.ok(b.q._mq07PtcGateV>8&&b.q._mq07PtcGateV<15);
 assert.ok(!c.h._active);
});
test('PTC SC21 open gate and load lines fail closed',()=>{
 for(const cut of [w=>w.from.c==='rg'&&w.to.c==='q1',w=>w.from.c==='h1'&&w.to.c==='q1',w=>w.from.c==='g1'&&w.to.c==='h1']){
  const x=sample(65,cut);assert.ok(!x.h._active&&!(x.h._currentValue>1e-4));
 }
});
test('NTC SC20 and previous switching SC11-SC19 remain loaded',()=>{
 assert.equal(L.byId['sensor-analog-apps-src-01'].project.components.length,13);
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 assert.equal(L.lessons.length,1655);
});
