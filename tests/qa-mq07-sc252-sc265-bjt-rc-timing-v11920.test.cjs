'use strict';
// Original SC252–265 topology audit, revised for individually repaired canonical sources.
// KEEP unaccepted Schmitt concept boards as quizzes; do not demote wired BJT/RC/timer scenes.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[
 ['electronic-switching-outline-021',8,'REVIEW','BJT_SWITCH_RUNTIME_PENDING'],
 ['electronic-switching-outline-022',8,'REVIEW','BJT_CUTOFF_RUNTIME_PENDING'],
 ['electronic-switching-outline-023',8,'REVIEW','BJT_SATURATION_RUNTIME_PENDING'],
 ['electronic-switching-outline-024',12,'REVIEW','RC_BJT_ON_DELAY_NATIVE_PENDING'],
 ['electronic-component-basics-outline-012',8,'SOURCE_REPAIRED_NATIVE_RC_CHARGE_DISCHARGE',null],
 ['electronic-component-basics-outline-013',6,'SOURCE_REPAIRED_NATIVE_TIMER',null],
 ['electronic-component-basics-outline-014',6,'SOURCE_REPAIRED_NATIVE_TIMER',null],
 ['electronic-component-basics-outline-015',0,'REVIEW','NO_SCHMITT_HYSTERESIS_NETWORK'],
 ['electronic-switching-outline-025',8,'REVIEW','BJT_SWITCH_PRACTICE_TRACE_PENDING'],
 ['electronic-switching-outline-026',9,'SOURCE_REPAIRED_NATIVE_BJT_POT',null],
 ['electronic-component-basics-outline-016',10,'SOURCE_REPAIRED_NATIVE_TIMER_PRACTICE',null],
 ['electronic-component-basics-outline-017',10,'SOURCE_REPAIRED_NATIVE_TIMER_PRACTICE',null],
 ['electronic-switching-outline-027',0,'REVIEW','NO_TRANSISTOR_SCHMITT_FEEDBACK'],
 ['electronic-switching-outline-028',8,'SOURCE_REPAIRED_NATIVE_DYNAMIC_PENDING',null]
];
for(const [id,wires,status,issue] of rows)test(id+' source graph, REVIEW and physical acceptance gates stay coherent',()=>{
 const l=L.byId[id],p=l?.project;assert.ok(l&&p,id);
 assert.equal(l.kind,wires?'wiring':'quiz');
 assert.equal(p.referenceOnly===true,!wires);
 assert.equal(p.wires.length,wires);assert.equal(l.steps.length,wires);
 assert.equal(l.pedagogyReview.titleTopologyStatus,status);
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 for(const c of p.components)assert.ok(defs[c.typeId],id+' '+c.typeId);
 if(wires){
  for(const wire of p.wires)for(const e of [wire.from,wire.to]){
   const c=p.components.find(x=>x.id===e.c),d=defs[c?.typeId];
   assert.ok(d?.pins?.some(pin=>pin.id===e.p),id+' '+e.c+'/'+e.p);
  }
 }else assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 if(status==='REVIEW'){
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
  assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 }
 for(const k of ['physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance'])
  assert.notEqual(l.pedagogyReview[k],true,id+' '+k);
});
test('SC255 real RC/BJT 47k–10k–1000uF topology is still 12 terminal wires',()=>{
 const l=L.byId['electronic-switching-outline-024'],p=l.project;
 assert.equal(p.wires.length,12);
 assert.equal(p.components.find(x=>x.id==='rb').resistance,47000);
 assert.equal(p.components.find(x=>x.id==='rp').resistance,10000);
 assert.equal(p.components.find(x=>x.id==='c1').capacitance,.001);
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 for(const x of [['rb','2','c1','1'],['rb','2','q1','B'],['rp','1','c1','1'],['rp','2','g1','M'],['c1','2','g1','M']])assert.ok(has(...x));
});
test('SC261 now has a wired 3-terminal potentiometer, SC264 Schmitt remains no-wire REVIEW',()=>{
 const p=L.byId['electronic-switching-outline-026'],s=L.byId['electronic-switching-outline-027'];
 assert.equal(p.kind,'wiring');assert.equal(p.project.wires.length,9);
 assert.ok(p.project.components.some(c=>c.typeId==='potentiometer'));
 assert.equal(p.pedagogyReview.physicalAcceptance,false);
 assert.equal(s.kind,'quiz');assert.equal(s.project.referenceOnly,true);
 assert.equal(s.project.wires.length,0);assert.equal(s.steps.length,0);
 assert.deepEqual(s.project.components.map(c=>c.typeId),['bd139-npn','bd139-npn','resistor']);
});
test('SC256 10k × 100uF source has real 100k discharge return and native scope separate from physical',()=>{
 const l=L.byId['electronic-component-basics-outline-012'],p=l.project;
 assert.equal(p.wires.length,8);
 assert.equal(p.components.find(c=>c.id==='r1').resistance,10000);
 assert.equal(p.components.find(c=>c.id==='c1').capacitance,.0001);
 assert.equal(p.components.find(c=>c.id==='rd').resistance,100000);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});
test('SC255 actual native RC/BJT transitions: 1500ms ON, 5750ms OFF, no fake timer',()=>{
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
 const cut=structuredClone(L.byId['electronic-switching-outline-024'].project);
 cut.wires=cut.wires.filter(w=>!(w.to.c==='q1'&&w.to.p==='B'));
 for(let t=0;t<=2000;t+=250){
  cut.components.find(c=>c.id==='s1').state=t>0;
  const result=Native.solve(cut,defs,{now:t});
  assert.ok(result.stable&&!result.shortCircuit);
  assert.equal(!!cut.components.find(c=>c.id==='q1')._active,false);
 }
});
test('all 1655 lesson order and eleven protected sensor questions remain intact',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='electronic-switching-outline-021');
 assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),rows.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
});
