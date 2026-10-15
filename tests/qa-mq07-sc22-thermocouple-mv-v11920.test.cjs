'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Sim=require('../dist/simulation.js'),Thermal=require('../dist/thermal.js');
const L=QA.curriculum(),defs=QA.catalog(),l=L.byId['sensor-analog-apps-src-03'],part=(p,id)=>p.components.find(c=>c.id===id);
function measure(t,reverseMeter=false,reverseSensor=false,openSensor=false){
 const p=JSON.parse(JSON.stringify(l.project));part(p,'tc').temperature=t;
 if(reverseMeter){part(p,'v1-red').probeTarget.p='−';part(p,'v1-black').probeTarget.p='+'}
 if(reverseSensor)for(const w of p.wires.filter(w=>w.from.c==='tc'))w.to.p=w.to.p==='9'?'10':'9';
 if(openSensor)p.wires=p.wires.filter(w=>!(w.from.c==='tc'&&w.to.c==='ctl'&&w.to.p==='9'));
 const result=Sim.solve(p,defs,{now:1000});
 assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating);
 return {ctl:part(p,'ctl')._controller,meter:part(p,'v1')._meter};
}
test('SC22 target contains only six canonical parts and six correctly connected wires',()=>{
 assert.equal(l.kind,'wiring');assert.equal(l.project.components.length,6);
 assert.equal(l.project.wires.length,6);assert.equal(l.steps.length,6);
 assert.equal(part(l.project,'v1').meterPosition,1);
 for(const [a,ap,b,bp] of [['tc','+','ctl','9'],['tc','−','ctl','10'],['g1','L','ctl','11'],
  ['g1','N','ctl','12'],['v1','V','v1-red','PLUG'],['v1','COM','v1-black','PLUG']])
  assert.ok(l.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
 assert.equal(part(l.project,'v1-red').mq07ThermocoupleMeterProbe,true);
 assert.equal(part(l.project,'ctl').instrumentSettings.displayOnly,'on');
});
test('SC22 native 25/100/200C comparison: NIST K-type mV and ET4420 PV',()=>{
 for(const t of [25,100,200]){const s=measure(t);
  assert.equal(s.ctl.error,'');assert.equal(s.ctl.displayOnly,true);
  assert.ok(Math.abs(s.ctl.pv-t)<.01);
  assert.equal(s.meter.mode,'DCV');assert.equal(s.meter.range,.2);
  assert.equal(s.meter.warning,'');
  assert.ok(Math.abs(s.meter.value*1000-Thermal.mv(t,25,'K'))<.0001);
 }
});
test('SC22 probe polarity sign, controller reversed/open faults',()=>{
 const rev=measure(100,true);assert.ok(rev.meter.value<0);
 assert.ok(Math.abs(rev.meter.value*1000+Thermal.mv(100,25,'K'))<.0001);
 for(const row of [measure(100,false,true),measure(100,false,false,true)]){
  assert.ok(row.ctl.error);assert.equal(row.ctl.main,false);assert.equal(row.ctl.ssr,false);
 }
});
test('SC22 cannot claim physical PASS and SC11-SC21 canonical lessons persist',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.byId['sensor-analog-apps-src-01'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-02'].project.components.length,13);
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 for(const k of ['physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance'])
  assert.equal(l.pedagogyReview[k],false);
});
