'use strict';
// MQ-12: original native LDR/GL5528 numeric resistance, MOSFET linear educational
// power stage and lamp I/V/P; no mocked dimmer results or synthetic PASS.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='sensor-analog-apps-src-11',lesson=L.byId[id];
const fresh=()=>JSON.parse(JSON.stringify(lesson.project));
const comp=(p,id)=>p.components.find(c=>c.id===id);
function step(p,lux){
 comp(p,'s1').illuminationLux=lux;
 const r=Native.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.shortCircuit&&!r.blocked&&!r.oscillating,'solver at '+lux+' lux');
 const lamp=comp(p,'h1'),q=comp(p,'q1'),ldr=comp(p,'s1');
 return {lux,gate:q._dimmerGateV,brightness:lamp._dimmerBrightnessPct,
  power:lamp._dimmerPowerW,current:lamp._dimmerCurrentA,ldrOhm:ldr._ldrResistance};
}
test('MQ-07 12V LDR dimmer has an independent electrically wired MOSFET power path',()=>{
 assert.equal(lesson.title,'LDR kontrollü dimmer');
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,null);
 assert.equal(lesson.pedagogyReview.ldrVirtualDimmer.acPhaseControl,false);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.project.components.length,5);
 assert.equal(lesson.project.wires.length,7);
 const g=comp(lesson.project,'g1'),q=comp(lesson.project,'q1'),lamp=comp(lesson.project,'h1');
 assert.equal(g.dcVoltage,12);
 assert.equal(q.typeId,'mosfet-n');
 assert.equal(q.virtualLdrDimmer,true);
 assert.equal(lamp.virtualLdrLamp,true);
 assert.equal(lamp.lampRatedVoltage,12);
 assert.equal(lesson.project.components.some(c=>/lm358/.test(c.typeId)),false);
 const has=(a,ap,b,bp)=>lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 for(const x of [['g1','P','s1','1'],['s1','2','r1','1'],['r1','2','g1','M'],
  ['s1','2','q1','G'],['g1','P','h1','X1'],['h1','X2','q1','D'],['q1','S','g1','M']])
  assert.ok(has(...x),x.join('/'));
 assert.deepEqual(defs['mosfet-n'].pins.map(p=>p.id),['G','D','S']);
 assert.deepEqual(defs['standard-light'].pins.map(p=>p.id),['X1','X2']);
});
test('MQ-12 original numeric solver computes monotonic lux to actual load power (not binary ON/OFF)',()=>{
 const p=fresh(),data=[.1,1,10,100,1000].map(lux=>step(p,lux));
 for(let i=1;i<data.length;i++){
  assert.ok(data[i].ldrOhm<data[i-1].ldrOhm,'LDR resistance must fall with lux');
  assert.ok(data[i].brightness>=data[i-1].brightness,'lamp brightness must not fall with lux');
 }
 assert.ok(data[0].brightness<.01);
 assert.ok(data[2].brightness>10&&data[2].brightness<15,'10 lux moderate dim');
 assert.ok(data[3].brightness>65&&data[3].brightness<75,'100 lux continuously dimmed');
 assert.ok(data[4].brightness>95&&data[4].brightness<100,'1000 lux near full');
 assert.ok(data[2].power<data[3].power&&data[3].power<data[4].power,'lamp power truly changes');
 assert.ok(data[2].gate>2&&data[3].gate>data[2].gate&&data[4].gate>data[3].gate);
 assert.ok(Math.abs(data[3].power-data[3].current*comp(p,'h1')._voltageValue)<1e-5);
});
test('disconnecting real control/gate or power wire fails electrically closed',()=>{
 let p=fresh();p.wires=p.wires.filter(w=>!(w.from.c==='s1'&&w.to.c==='q1'));
 const withoutGate=step(p,1000);assert.ok(withoutGate.brightness<.1);
 p=fresh();p.wires=p.wires.filter(w=>!(w.from.c==='h1'&&w.to.c==='q1'));
 const withoutPower=step(p,1000);assert.ok(withoutPower.brightness<.1);
});
test('MQ-12 1655 lessons / 730 wired / 940 definitions native solver source regression',()=>{
 const a=QA.audit({L,defs,Simulation:Native});
 assert.equal(a.status,'PASS');assert.equal(a.total,1655);
 assert.equal(a.rich,136);assert.equal(a.definitionCount,940);
 assert.equal(a.withWires,730);assert.equal(a.stable,730);
 assert.equal(L.mq07Batch200.reviewIds.length,50);
 assert.equal(L.mq07Batch200.reviewIds.some(x=>x.id===id),false);
 for(const k of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])
  assert.deepEqual(a[k],[],k);
});
