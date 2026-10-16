'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[["electronic-switching-outline-021","BJT_SWITCH_RUNTIME_PENDING",8],["electronic-switching-outline-022","BJT_CUTOFF_RUNTIME_PENDING",8],["electronic-switching-outline-023","BJT_SATURATION_RUNTIME_PENDING",8],["electronic-switching-outline-024","RC_BJT_ON_DELAY_NATIVE_PENDING",12],["electronic-component-basics-outline-012","RC_CHARGE_DISCHARGE_TRACE_PENDING",6],["electronic-component-basics-outline-013","NO_OFF_DELAY_RUNTIME",0],["electronic-component-basics-outline-014","NO_ON_DELAY_RUNTIME",0],["electronic-component-basics-outline-015","NO_SCHMITT_HYSTERESIS_NETWORK",0],["electronic-switching-outline-025","BJT_SWITCH_PRACTICE_TRACE_PENDING",8],["electronic-switching-outline-026","NO_POTENTIOMETER_SWITCHING_WIRING",0],["electronic-component-basics-outline-016","NO_ON_DELAY_PRACTICE_RUNTIME",0],["electronic-component-basics-outline-017","NO_OFF_DELAY_PRACTICE_RUNTIME",0],["electronic-switching-outline-027","NO_TRANSISTOR_SCHMITT_FEEDBACK",0],["electronic-switching-outline-028","NO_FET_MOSFET_DRIVE_WIRING",0]];
for(const [id,reason,expected] of rows)test(id+' BJT RC source and negative-acceptance lock',()=>{
 const l=L.byId[id];assert.ok(l);assert.equal(l.project.wires.length,expected);
 assert.equal(l.pedagogyReview.mq07BjtRcScope,'SC252_SC265');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,reason);
 for(const k of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(l.pedagogyReview[k],false);
 for(const c of l.project.components)assert.ok(defs[c.typeId],c.typeId);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
});
test('SC255 real RC/BJT topology has 12 wires, capacitor, charge and bleed resistors',()=>{
 const l=L.byId['electronic-switching-outline-024'],p=l.project;
 assert.equal(l.kind,'wiring');assert.equal(l.steps.length,12);
 assert.equal(p.components.find(x=>x.id==='rb').resistance,47000);
 assert.equal(p.components.find(x=>x.id==='rp').resistance,10000);
 assert.equal(p.components.find(x=>x.id==='c1').capacitance,.001);
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 for(const x of [['rb','2','c1','1'],['rb','2','q1','B'],['rp','1','c1','1'],['rp','2','g1','M'],['c1','2','g1','M']])assert.ok(has(...x));
});
test('SC261 and SC264 no longer fake live pot and Schmitt output',()=>{
 for(const id of ['electronic-switching-outline-026','electronic-switching-outline-027']){
  const l=L.byId[id];assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);
  assert.equal(l.project.wires.length,0);assert.equal(l.steps.length,0);
 }
 assert.deepEqual(Array.from(L.byId['electronic-switching-outline-026'].project.components,c=>c.typeId),['bd139-npn','potentiometer','resistor']);
 assert.deepEqual(Array.from(L.byId['electronic-switching-outline-027'].project.components,c=>c.typeId),['bd139-npn','bd139-npn','resistor']);
});
test('SC256 10k*100uF RC source has 1-second nominal tau',()=>{
 const p=L.byId['electronic-component-basics-outline-012'].project;
 assert.equal(p.wires.length,6);assert.equal(p.components.find(c=>c.id==='r1').resistance,10000);
 assert.equal(p.components.find(c=>c.id==='c1').capacitance,.0001);
});
test('SC255 real native solver tests delayed BJT transition and capacitor response',()=>{
 const p=structuredClone(L.byId['electronic-switching-outline-024'].project);
 const s=p.components.find(c=>c.id==='s1'),c=p.components.find(c=>c.id==='c1'),q=p.components.find(c=>c.id==='q1'),trace=[];
 for(let t=0;t<=5750;t+=250){
  s.state=t>=250&&t<2250;
  const result=Native.solve(p,defs,{now:t});
  assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,'unstable '+t);
  trace.push({t,v:c._capacitorVoltage,on:!!q._active});
 }
 const at=t=>trace.find(x=>x.t===t);
 assert.equal(at(0).on,false);assert.equal(at(1000).on,false);
 assert.equal(at(1500).on,true);assert.equal(at(5750).on,false);
 assert.ok(at(1500).v>at(1000).v);assert.ok(at(5750).v<at(2250).v);
});
test('all 1655 lessons and 11 original sensor questions retained',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='electronic-switching-outline-021');
 assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),rows.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
});
