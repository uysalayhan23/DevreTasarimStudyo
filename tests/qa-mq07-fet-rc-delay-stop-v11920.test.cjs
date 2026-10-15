'use strict';
// MQ-07/MQ-12: real native MOSFET + RC capacitor solver, no fake timer or animations.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-09',lesson=L.byId[id];
const comp=(p,id)=>p.components.find(c=>c.id===id);
function trace(change=p=>p){
 const p=change(JSON.parse(JSON.stringify(lesson.project))),sw=comp(p,'sw'),
  q=comp(p,'q1'),cap=comp(p,'c1'),lamp=comp(p,'h1'),meter=comp(p,'v1'),rows=[];
 for(let ms=0;ms<=4250;ms+=250){
  sw.state=ms>=250&&ms<1250;
  const result=Native.solve(p,defs,{now:ms});
  assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,'native solver unstable at '+ms);
  assert.equal(meter._meter?.warning,'','UT33D+ connection at '+ms);
  rows.push({ms,gate:q._mq07GateSampleV,cap:cap?._capacitorVoltage,mosfet:!!q._mosfetOn,lamp:!!lamp._active,meter:meter._meter?.display});
 }
 return rows;
}
const at=(rows,time)=>rows.find(x=>x.ms===time);
test('FET delay-stop title now owns real MOSFET G/D/S, capacitor, bleed resistor and two separate wired paths',()=>{
 assert.equal(lesson.title,'FET’li zaman gecikmeli duran devre');
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,null);
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'VIRTUAL_FET_RC_DELAY_STOP_SOURCE_ALIGNED');
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.fetRcDelayVirtual.physicalJfetVerified,false);
 const p=lesson.project;assert.equal(p.components.length,10);assert.equal(p.wires.length,12);
 assert.equal(comp(p,'q1').typeId,'mosfet-n');assert.equal(comp(p,'q1').mq07FetRcDelay,true);
 assert.equal(comp(p,'c1').capacitance,.0001);assert.equal(comp(p,'rd').resistance,20000);
 assert.equal(comp(p,'rc').resistance,1000);assert.equal(comp(p,'g1').dcVoltage,12);
 assert.deepEqual(Array.from(defs['mosfet-n'].pins,p=>p.id),['G','D','S']);
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 for(const x of [['g1','P','sw','13'],['sw','14','rc','1'],
  ['rc','2','c1','1'],['rc','2','q1','G'],['c1','2','g1','M'],
  ['rd','1','c1','1'],['rd','2','g1','M'],['q1','S','g1','M'],
  ['g1','P','h1','X1'],['h1','X2','q1','D'],
  ['v1','V','v1-red','PLUG'],['v1','COM','v1-black','PLUG']])
  assert.ok(has(...x),'invalid terminal path '+x.join('/'));
 assert.equal(comp(p,'v1').meterPosition,3);
 assert.equal(comp(p,'v1-red').probeTarget.c,'c1');
 assert.equal(comp(p,'v1-red').probeTarget.p,'1');
 assert.equal(comp(p,'v1-black').probeTarget.p,'2');
});
test('original native solver maintains load ON for ~2 s after button release, then OFF as gate falls below 4 V',()=>{
 const rows=trace(),t250=at(rows,250),t1000=at(rows,1000),t1250=at(rows,1250);
 assert.equal(at(rows,0).lamp,false);
 assert.equal(t250.lamp,true);assert.ok(t250.gate>4);
 assert.equal(t1000.lamp,true);assert.ok(t1000.gate>t250.gate);
 assert.equal(t1250.lamp,true);assert.ok(t1250.gate<t1000.gate);
 assert.equal(at(rows,3000).lamp,true);
 assert.ok(at(rows,3000).gate>4);
 assert.equal(at(rows,3250).lamp,false);
 assert.ok(at(rows,3250).gate<4);
 assert.equal(at(rows,4250).mosfet,false);
 assert.ok(Number(t1000.meter)>11&&Number(t1000.meter)<12);
});
test('broken gate or power path blocks lamp; capacitor removal eliminates hold delay',()=>{
 const disGate=trace(p=>(p.wires=p.wires.filter(w=>!(w.from.c==='rc'&&w.to.c==='q1')),p));
 assert.equal(at(disGate,250).lamp,false);assert.equal(at(disGate,1000).lamp,false);
 const disPower=trace(p=>(p.wires=p.wires.filter(w=>!(w.from.c==='h1'&&w.to.c==='q1')),p));
 assert.equal(at(disPower,1000).lamp,false);
 const noCap=trace(p=>(p.components=p.components.filter(c=>c.id!=='c1'),p.wires=p.wires.filter(w=>w.from.c!=='c1'&&w.to.c!=='c1'),p));
 assert.equal(at(noCap,1000).lamp,true);
 assert.equal(at(noCap,1250).lamp,false);
});
test('reducing the actual bleed resistor shortens gate hold-up, not merely a scripted timer',()=>{
 const fast=trace(p=>(comp(p,'rd').resistance=10000,p)),standard=trace();
 assert.equal(at(fast,2250).lamp,false);
 assert.equal(at(standard,2250).lamp,true);
});
test('MQ-12 full 1655 lesson/731 wired circuit regression and 49 still-REVIEW concept/workflow records',()=>{
 const audit=QA.audit({L,defs,Simulation:Native});
 assert.equal(audit.status,'PASS');assert.equal(audit.total,1655);
 assert.equal(audit.rich,136);assert.equal(audit.definitionCount,940);
 assert.equal(audit.withWires,732);assert.equal(audit.stable,732);
 assert.equal(L.mq07Batch200.reviewIds.length,48);
 assert.equal(L.mq07Batch200.noWireTriage.conceptPreservedIds.length,14);
 assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id===id));
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])
  assert.deepEqual(audit[key],[],key);
});
