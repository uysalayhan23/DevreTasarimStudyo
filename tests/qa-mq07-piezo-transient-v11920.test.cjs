'use strict';
// Native source/solver evidence. No mocks and no manufacturer-calibrated physical assertion.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js'),Devices=require('../dist/device-behavior.js');
const L=QA.curriculum(),defs=QA.catalog(),id='sensor-analog-apps-src-08',lesson=L.byId[id];
test('MQ07 piezo real two-terminal virtual scene replaces inductive PNP, no false physical acceptance',()=>{
 assert.equal(L.lessons.length,1655);assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,null);
 assert.equal(lesson.pedagogyReview.manufacturerCalibrationVerified,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.project.components.length,5);assert.equal(lesson.project.wires.length,4);
 const c=lesson.project.components;
 assert.ok(c.some(x=>x.typeId==='tutorial-piezo'));
 assert.ok(!c.some(x=>/proximity|coil-relay|contact-no/.test(x.typeId)));
 assert.equal(defs['tutorial-piezo'].kind,'piezo');
 assert.deepEqual(Array.from(defs['tutorial-piezo'].pins,p=>p.id),['+','−']);
 const has=(a,ap,b,bp)=>lesson.project.wires.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
 assert.ok(has('pz','+','r1','1')&&has('r1','2','pz','−'));
 assert.ok(has('v1','V','v1-red','PLUG')&&has('v1','COM','v1-black','PLUG'));
 assert.equal(c.find(x=>x.id==='v1').meterPosition,1);
 assert.equal(c.find(x=>x.id==='v1-red').probeTarget.p,'+');
 assert.equal(c.find(x=>x.id==='v1-black').probeTarget.p,'−');
});
test('MQ12 original native solve reads 0, 100, 50.6, 1.06, 0 mV at five virtual instants',()=>{
 const p=JSON.parse(JSON.stringify(lesson.project)),sensor=p.components.find(c=>c.id==='pz'),meter=p.components.find(c=>c.id==='v1');
 const observed=[];
 for(const now of [0,1000,1150,2000,3000]){
  if(now===1000)sensor.piezoTapAt=1000;
  const r=Native.solve(p,defs,{now});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'native solve at '+now);
  assert.equal(meter._meter?.warning,'','UT33D+ wiring at '+now);
  observed.push([sensor._piezoMv,meter._meter?.value,meter._meter?.unit]);
 }
 assert.equal(observed[0][0],0);
 assert.ok(Math.abs(observed[1][0]-100)<1e-6);
 assert.ok(observed[2][0]>50&&observed[2][0]<51);
 assert.ok(observed[3][0]>0&&observed[3][0]<2);
 assert.equal(observed[4][0],0);
 assert.equal(observed[1][2],'mV');
 assert.ok(Math.abs(observed[1][1]-.1)<.0001);
 assert.equal(Devices.piezoPulse({piezoTapAt:null},0).valueMv,0);
});
test('MQ12 full original 1655 curriculum and 731 wired startup native solve stay consistent',()=>{
 const r=QA.audit({L,defs,Simulation:Native});
 assert.equal(r.total,1655);assert.equal(r.withWires,731);assert.equal(r.stable,731);
 assert.equal(r.rich,136);assert.equal(r.status,'PASS');
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])
  assert.deepEqual(r[key],[],key);
 assert.equal(L.mq07Batch200.reviewIds.length,49);
 assert.equal(L.mq07Batch200.reviewIds.some(x=>x.id===id),false);
});
