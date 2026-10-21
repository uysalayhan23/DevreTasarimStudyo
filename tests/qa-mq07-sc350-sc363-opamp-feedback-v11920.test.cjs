'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["opamp-apps-outline-021",null,14],["opamp-apps-outline-022","INVERTING_DEMO_NOT_COMPLETE_OPAMP_APPLICATIONS",14],["opamp-apps-outline-023","INVERTING_GAIN_NATIVE_PENDING",14],["opamp-apps-outline-024","INVERTING_AC_RESPONSE_NATIVE_PENDING",13],["opamp-apps-outline-025","INVERTING_DC_RESPONSE_NATIVE_PENDING",14],["opamp-apps-outline-026","NONINVERTING_GAIN_NATIVE_PENDING",12],["opamp-apps-outline-027","NONINVERTING_AC_RESPONSE_NATIVE_PENDING",10],["opamp-apps-outline-028","NONINVERTING_DC_RESPONSE_NATIVE_PENDING",12],["opamp-apps-outline-029","VOLTAGE_FOLLOWER_NATIVE_PENDING",8],["opamp-apps-outline-030","FOLLOWER_PRACTICE_NATIVE_PENDING",8],["opamp-apps-outline-031","COMPARATOR_THRESHOLD_NATIVE_PENDING",11],["opamp-apps-outline-032","COMPARATOR_PRACTICE_NATIVE_PENDING",11],["sensor-analog-apps-outline-054","LDR_COMPARATOR_LUX_NATIVE_PENDING",12],["sensor-analog-apps-outline-055",null,14]];
const edge=(p,a,ap,b,bp)=>p.wires.some(w=>(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp)||
 (w.from.c===b&&w.from.p===bp&&w.to.c===a&&w.to.p===ap));
for(const [id,reason,wires] of cases)test(id+' opamp physical pin and negative-acceptance contract',()=>{
 const l=L.byId[id],p=l?.project;assert.ok(l);
 assert.equal(p.wires.length,wires);assert.equal(l.kind,wires?'wiring':'quiz');
 assert.equal(l.pedagogyReview.mq07OpampScope,id==='opamp-apps-outline-021'?'SC350_SC377':'SC350_SC363');
 assert.equal(l.pedagogyReview.titleTopologyIssue,reason);
 assert.equal(l.pedagogyReview.titleTopologyStatus,id==='opamp-apps-outline-021'?'SOURCE_WIRED_NEGATIVE_FEEDBACK_GAIN_PENDING':id==='sensor-analog-apps-outline-055'?'VIRTUAL_NTC_REFERENCE_SIGNAL_OPEN_BIAS':'REVIEW');
 for(const k of ['nativeDynamicAcceptance','feedbackGainAcceptance',
  'physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(l.pedagogyReview[k],false,k);
 const manufacturerFlag=id==='opamp-apps-outline-021'?'manufacturerDeviceAcceptance':'manufacturerLimitsAcceptance';
 assert.equal(l.pedagogyReview[manufacturerFlag],false,manufacturerFlag);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 if(!wires){assert.equal(p.referenceOnly,true);assert.equal(l.steps.length,0)}
 else{
  const op=p.components.find(c=>c.typeId==='lm358p-dip8');
  assert.ok(op);for(const pin of ['1','2','3','4','8']){
   const wired=p.wires.some(w=>(w.from.c===op.id&&w.from.p===pin)||(w.to.c===op.id&&w.to.p===pin));
   const prob=p.components.some(c=>c.probeTarget?.c===op.id&&c.probeTarget?.p===pin);
   assert.ok(wired||prob,id+' pin '+pin);
  }
  assert.ok(edge(p,'g1','P',op.id,'8')&&edge(p,'g1','M',op.id,'4'));
  assert.ok(p.components.some(c=>c.typeId==='unit-ut33d-plus'));
 }
});
test('SC350 source-based negative-feedback circuit keeps gain acceptance open',()=>{
 const l=L.byId['opamp-apps-outline-021'],p=l.project,b=L.byId['opamp-apps-src-02'].project;
 assert.equal(l.kind,'wiring');assert.equal(p.wires.length,14);assert.equal(l.steps.length,14);
 assert.equal(l.pedagogyReview.sourceReusedFrom,'opamp-apps-src-02');
 assert.deepEqual(Array.from(p.components,c=>c.typeId),Array.from(b.components,c=>c.typeId));
 assert.deepEqual(Array.from(p.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]),
  Array.from(b.wires.slice(0,14),w=>[w.from.c,w.from.p,w.to.c,w.to.p]));
 assert.equal(p.components.find(c=>c.id==='r1').resistance,10000);
 assert.equal(p.components.find(c=>c.id==='r2').resistance,47000);
 assert.ok(edge(p,'u1','1','r2','1')&&edge(p,'r2','2','u1','2'));
 assert.ok(edge(p,'r1','2','u1','2')&&edge(p,'ref1','2','u1','3'));
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(l.pedagogyReview.feedbackGainAcceptance,false);
});

test('SC351–SC354 inverting resistor feedback really closes from OUT 1 to IN- 2',()=>{
 for(const n of ['022','023','024','025']){
  const p=L.byId['opamp-apps-outline-'+n].project;
  assert.ok(edge(p,'u1','1','r2','1')&&edge(p,'r2','2','u1','2'));
  assert.ok(edge(p,'r1','2','u1','2')&&edge(p,'ref1','2','u1','3'));
  assert.equal(p.components.find(c=>c.id==='r1').resistance,10000);
  assert.equal(p.components.find(c=>c.id==='r2').resistance,47000);
 }
});
test('SC355–SC357 noninverting input on 3 and resistor feedback on 2',()=>{
 for(const n of ['026','027','028']){
  const p=L.byId['opamp-apps-outline-'+n].project;
  assert.ok(edge(p,'u1','1','r2','1')&&edge(p,'r2','2','u1','2'));
  assert.ok(edge(p,'u1','2','r1','1')&&edge(p,'r1','2','g1','M'));
  assert.ok(p.wires.some(w=>w.to.c==='u1'&&w.to.p==='3'));
 }
});
test('SC358–359 direct output-to-minus feedback is a follower',()=>{
 for(const n of ['029','030']){
  const p=L.byId['opamp-apps-outline-'+n].project;
  assert.ok(edge(p,'u1','1','u1','2')&&edge(p,'in','2','u1','3'));
 }
});
test('SC360–361 comparator uses virtual probeTarget at output and reference at pin2',()=>{
 for(const n of ['031','032']){
  const p=L.byId['opamp-apps-outline-'+n].project;
  assert.ok(edge(p,'ref1','2','u1','2')&&edge(p,'in','2','u1','3'));
  assert.ok(p.components.some(c=>c.probeTarget?.c==='u1'&&c.probeTarget?.p==='1'));
 }
});
test('SC362/363 retain source comparator branches and NTC-specific added bias',()=>{
 for(const [id,gold] of [['sensor-analog-apps-outline-054','opamp-apps-src-07'],
  ['sensor-analog-apps-outline-055','opamp-apps-src-08']]){
  const a=L.byId[id].project,b=L.byId[gold].project;
  assert.deepEqual(Array.from(a.components.slice(0,b.components.length),c=>c.typeId),
   Array.from(b.components,c=>c.typeId));
  assert.deepEqual(Array.from(a.wires.slice(0,12),w=>[w.from.c,w.from.p,w.to.c,w.to.p]),
   Array.from(b.wires.slice(0,12),w=>[w.from.c,w.from.p,w.to.c,w.to.p]));
  assert.ok(edge(b,'u1','5','g1','M')&&edge(b,'u1','7','u1','6'));
  assert.equal(L.byId[id].pedagogyReview.nativeDynamicAcceptance,false);
 }
 const p=L.byId['sensor-analog-apps-outline-055'].project;
 assert.equal(p.components.length,10);assert.equal(p.wires.length,14);
 assert.equal(p.components.find(c=>c.id==='rb')?.resistance,100000);
 assert.ok(edge(p,'g1','P','rb','1')&&edge(p,'rb','2','u1','2'));
 assert.equal(L.byId['sensor-analog-apps-outline-055'].pedagogyReview.titleTopologyStatus,'VIRTUAL_NTC_REFERENCE_SIGNAL_OPEN_BIAS');
});

test('1655 ids, 11 source-specific sensor questions and SC255/331/332/338 native open flags',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(l=>l.id==='opamp-apps-outline-021');
 assert.deepEqual(Array.from(L.lessons.slice(i,i+14),l=>l.id),cases.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
 for(const id of ['electronic-switching-outline-024','sensor-analog-apps-outline-047',
 'sensor-analog-apps-outline-048','sensor-analog-apps-outline-052']){
  const p=L.byId[id]?.pedagogyReview;
  assert.equal(p?.titleTopologyStatus,'REVIEW');assert.equal(p?.nativeDynamicAcceptance,false);
 }
});
test('SC350–377 material metadata names the actual circuit components without accepting REVIEW',()=>{
 const first=L.lessons.findIndex(l=>l.id==='opamp-apps-outline-021');
 assert.ok(first>=0);
 const items=L.lessons.slice(first,first+28);
 assert.equal(items.length,28);assert.equal(items.at(-1).id,'opamp-apps-outline-044');
 for(const lesson of items){
  assert.deepEqual(Array.from(lesson.pedagogyReview.componentIds),
   Array.from(lesson.project.components,c=>c.typeId),lesson.id);
  if(lesson.pedagogyReview.titleTopologyStatus==='REVIEW')
   assert.equal(lesson.pedagogyReview.nativeDynamicAcceptance,false,lesson.id);
 }
});
test('NATIVE ONLY: SC362/363 comparator real solve lux and temperature sweep',()=>{
 for(const [id,attr,values] of [
  ['sensor-analog-apps-outline-054','illuminationLux',[0,10,100,1000]],
  ['sensor-analog-apps-outline-055','temperatureC',[0,20,30,60]]]){
  const read=[];
  for(const x of values){
   const p=structuredClone(L.byId[id].project),s=p.components.find(c=>c.id==='s1');
   s[attr]=x;if(attr==='temperatureC')s.temperature=x;
   const solver=Native.solve(p,defs,{now:0});
   assert.ok(solver.stable&&!solver.shortCircuit&&!solver.blocked);
   const m=p.components.find(c=>c.id==='v1')._meter;
   assert.ok(Number.isFinite(m?.value)&&!m.warning);read.push(m.value);
  }
  assert.ok(read.some(x=>x<1)&&read.some(x=>x>20),id);
 }
});

test('SC355/357 series input feed makes noninverting DC sweep measurable without changing protected review',()=>{
 for(const id of ['opamp-apps-outline-026','opamp-apps-outline-028']){
  const l=L.byId[id],p=l.project,rs=p.components.find(c=>c.id==='rs');
  assert.equal(rs?.typeId,'resistor');assert.equal(rs.resistance,47000);
  assert.equal(p.wires.length,12);assert.equal(l.steps.length,12);
  assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
  assert.ok(edge(p,'g1','P','rs','1')&&edge(p,'in','1','rs','2'));
  const result=[];
  for(const pct of [10,25,40,55,70,85]){
   const q=structuredClone(p);q.components.find(c=>c.id==='in').potentiometer=pct;
   const state=Native.solve(q,defs,{now:1000});
   assert.ok(state.stable&&!state.blocked&&!state.shortCircuit&&!state.oscillating,id);
   const v=q.components.find(c=>c.id==='v1')._meter;
   assert.ok(Number.isFinite(v?.value)&&!v.warning,id+' pct='+pct);
   result.push(v.value);
  }
  assert.ok(result[0]-result.at(-1)>12,id+' input remains rail-clipped');
  for(let i=1;i<result.length;i++)assert.ok(result[i-1]>result[i],id+' sweep order');
 }
});
