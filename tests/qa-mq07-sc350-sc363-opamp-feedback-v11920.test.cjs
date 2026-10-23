'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["opamp-apps-outline-021",null,14],["opamp-apps-outline-022","INVERTING_DEMO_NOT_COMPLETE_OPAMP_APPLICATIONS",14],["opamp-apps-outline-023","INVERTING_GAIN_NATIVE_PENDING",16],["opamp-apps-outline-024","INVERTING_AC_RESPONSE_NATIVE_PENDING",15],["opamp-apps-outline-025","INVERTING_DC_RESPONSE_NATIVE_PENDING",16],["opamp-apps-outline-026","NONINVERTING_GAIN_NATIVE_PENDING",14],["opamp-apps-outline-027","NONINVERTING_AC_RESPONSE_NATIVE_PENDING",10],["opamp-apps-outline-028","NONINVERTING_DC_RESPONSE_NATIVE_PENDING",14],["opamp-apps-outline-029","VOLTAGE_FOLLOWER_NATIVE_PENDING",8],["opamp-apps-outline-030","FOLLOWER_PRACTICE_NATIVE_PENDING",8],["opamp-apps-outline-031","COMPARATOR_THRESHOLD_NATIVE_PENDING",13],["opamp-apps-outline-032","COMPARATOR_PRACTICE_NATIVE_PENDING",13],["sensor-analog-apps-outline-054","LDR_COMPARATOR_LUX_NATIVE_PENDING",14],["sensor-analog-apps-outline-055",null,16]];
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
test('SC360–363 second LM358 channel is safely grounded and negatively fed back',()=>{
 for(const [id,count] of [
  ['opamp-apps-outline-031',13],['opamp-apps-outline-032',13],
  ['sensor-analog-apps-outline-054',14],['sensor-analog-apps-outline-055',16]]){
  const l=L.byId[id],p=l.project;
  assert.equal(p.wires.length,count,id);
  assert.equal(l.steps.length,count,id);
  assert.ok(edge(p,'u1','5','g1','M')&&edge(p,'u1','7','u1','6'),id);
  assert.equal(l.pedagogyReview.mq07SpareLm358B,'PIN5_GND_PIN7_PIN6_OUTLINE_WIRED');
  assert.equal(l.pedagogyReview.nativeSpareChannelAcceptance,false);
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
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
  assert.ok(edge(a,'u1','5','g1','M')&&edge(a,'u1','7','u1','6'));
  assert.equal(L.byId[id].pedagogyReview.nativeDynamicAcceptance,false);
 }
 const p=L.byId['sensor-analog-apps-outline-055'].project;
 assert.equal(p.components.length,10);assert.equal(p.wires.length,16);
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

test('Four corrected LM358 DC gain lessons close B and preserve native-vs-hardware gates',()=>{
 for(const [suffix,count] of [['023',16],['025',16],['026',14],['028',14]]){
  const l=L.byId['opamp-apps-outline-'+suffix],p=l.project;
  assert.equal(p.wires.length,count);assert.equal(l.steps.length,count);
  assert.ok(edge(p,'u1','5','g1','M')&&edge(p,'u1','7','u1','6'));
  assert.equal(l.pedagogyReview.nativeIdealOpampDcTargetedPass,true);
  for(const key of ['nativeDynamicAcceptance','physicalAcceptance','feedbackGainAcceptance',
    'windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.equal(l.pedagogyReview[key],false);
  const values=[];
  for(const pct of [10,25,40,55,70,85]){
   const q=structuredClone(p);
   q.components.find(c=>c.id==='in').potentiometer=pct;
   const state=Native.solve(q,defs,{now:1000}),amp=q.components.find(c=>c.id==='u1'),
     meter=q.components.find(c=>c.id==='v1'),result=amp._nativeOpampGainDc;
   assert.ok(state.stable&&!state.shortCircuit&&!state.blocked,suffix+' '+pct);
   assert.ok(result&&meter._nativeOpampGainDc,suffix+' '+pct);
   assert.equal(meter._meter.warning,'');
   assert.ok(Math.abs(meter._meter.value-result.outputV)<.05);
   if(result.linearRange){
    const expected=['023','025'].includes(suffix)?
     result.referenceV-4.7*(result.inputV-result.referenceV):5.7*result.inputV;
    assert.ok(Math.abs(expected-result.outputV)<.15,suffix+' '+pct);
   }
   values.push(result.outputV);
  }
  if(['023','025'].includes(suffix))assert.ok(values.at(-1)>values[0]+15);
  else assert.ok(values[0]>values.at(-1)+15);
  const broken=structuredClone(p);
  broken.wires=broken.wires.filter(w=>!(w.from.c==='r2'&&w.from.p==='2'&&
   w.to.c==='u1'&&w.to.p==='2'));
  Native.solve(broken,defs,{now:1000});
  assert.equal(broken.components.find(c=>c.id==='u1')._nativeOpampGainDc,undefined);
 }
});


test('SC024 LM358P spare channel: native positive/negative DC sweep without false AC acceptance',()=>{
 const l=L.byId['opamp-apps-outline-024'],original=l.project;
 const copy=x=>JSON.parse(JSON.stringify(x));
 const edge=(p,a,ap,b,bp)=>p.wires.some(w=>
  [w.from.c,w.from.p,w.to.c,w.to.p].join('/')===[a,ap,b,bp].join('/')||
  [w.to.c,w.to.p,w.from.c,w.from.p].join('/')===[a,ap,b,bp].join('/'));
 const terminated=p=>edge(p,'u1','5','g1','M')&&edge(p,'u1','7','u1','6');
 assert.equal(original.wires.length,15);
 assert.equal(l.steps.length,15);
 assert.equal(terminated(original),true);
 assert.equal(l.pedagogyReview.unusedLm358BTopologyRepaired,true);
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(l.pedagogyReview.feedbackGainAcceptance,false);
 const p=copy(original);
 for(const [step,volts] of [0,1,2.5,4,5].entries()){
  p.components.find(c=>c.id==='in')._signalVoltage=volts;
  const s=Native.solve(p,defs,{now:step*5});
  assert.ok(s.stable&&!s.blocked&&!s.shortCircuit);
  const channels=p.components.find(c=>c.id==='u1')._opampChannels;
  assert.ok(Number.isFinite(channels?.['1']?.output));
  assert.ok(Number.isFinite(channels?.['7']?.output));
  assert.ok(channels['7'].output>=0&&channels['7'].output<.5,
   'B channel must remain close to 0 V');
 }
 const wrong=copy(original);
 wrong.wires.find(w=>w.from.c==='u1'&&w.from.p==='5').to.p='P';
 assert.equal(terminated(wrong),false);
 const sample=Native.solve(wrong,defs,{now:0});
 assert.ok(sample.stable&&!sample.shortCircuit&&!sample.blocked);
 assert.ok(wrong.components.find(c=>c.id==='u1')._opampChannels['7'].output>20,
  'wrong +24 V B input must be detected');
 for(const ending of ['5','7']){
  const open=copy(original);
  open.wires=open.wires.filter(w=>!(w.from.c==='u1'&&w.from.p===ending));
  assert.equal(terminated(open),false,'open channel termination must be rejected');
 }
 assert.equal(l.pedagogyReview.titleTopologyIssue,'INVERTING_AC_RESPONSE_NATIVE_PENDING');
});


test('SC024 tuned 20 Hz LM358P sine native gain: positive and negative feedback/bias/source cases',()=>{
 const Arduino=require('../dist/arduino-runtime.js');
 const l=L.byId['opamp-apps-outline-024'],original=l.project;
 assert.equal(original.wires.length,15);
 assert.equal(l.steps.length,15);
 assert.equal(l.pedagogyReview.sc024NativeSineTargetedPass,true);
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(l.pedagogyReview.feedbackGainAcceptance,false);
 const C=p=>JSON.parse(JSON.stringify(p));
 const part=(p,id)=>p.components.find(c=>c.id===id);
 const wire=(p,a,ap,b,bp)=>p.wires.some(w=>
  (w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp)||
  (w.from.c===b&&w.from.p===bp&&w.to.c===a&&w.to.p===ap));
 const goodSource=p=>part(p,'ref1')?.resistance===43000&&
  part(p,'ref2')?.resistance===10000&&part(p,'r1')?.resistance===10000&&
  part(p,'r2')?.resistance===47000&&part(p,'in')?.generatorEnabled===true&&
  part(p,'in')?.generatorWaveform==='sine'&&part(p,'in')?.generatorFrequency===20&&
  part(p,'in')?.generatorAmplitude===2&&part(p,'in')?.generatorOffset===1.5&&
  wire(p,'u1','5','g1','M')&&wire(p,'u1','7','u1','6')&&
  wire(p,'r2','2','u1','2')&&wire(p,'ref1','2','u1','3');
 assert.equal(goodSource(original),true);
 const sample=p=>{
  const samples=[];
  for(const t of [0,12.5,25,37.5,50]){
   Arduino.tick(p,defs,{now:t});
   const s=Native.solve(p,defs,{now:t});
   assert.ok(s.stable&&!s.blocked&&!s.shortCircuit);
   const a=part(p,'u1')._opampChannels?.['1']?.output;
   const b=part(p,'u1')._opampChannels?.['7']?.output;
   const input=part(p,'in')._signalVoltage;
   assert.ok(Number.isFinite(a)&&Number.isFinite(b)&&Number.isFinite(input));
   samples.push({time:t,input,a,b});
  }
  return samples;
 };
 const ok=sample(C(original));
 assert.ok(ok.every(x=>x.b>=0&&x.b<.5),'B spare channel must remain near 0 V');
 assert.ok(ok.every(x=>x.a>8&&x.a<21),'No A-channel clipping at authored sine extrema');
 assert.ok(Math.abs(ok[1].input-3.5)<1e-6&&Math.abs(ok[3].input-1.5)<1e-6);
 assert.ok(ok[1].a>=9&&ok[1].a<13,'High input must give low output');
 assert.ok(ok[3].a>16&&ok[3].a<20,'Low input must give high output');
 assert.ok(ok[3].a-ok[1].a>6,'Native inverted AC swing absent');
 const old=C(original);part(old,'ref1').resistance=10000;
 assert.equal(goodSource(old),false);
 const stale=sample(old);assert.ok(Math.max(...stale.map(x=>x.a))-Math.min(...stale.map(x=>x.a))<.1,
  'Old 12 V bias should reproduce the saturated defect');
 const disabled=C(original);part(disabled,'in').generatorEnabled=false;
 assert.equal(goodSource(disabled),false);
 const off=sample(disabled);assert.ok(Math.max(...off.map(x=>x.a))-Math.min(...off.map(x=>x.a))<.1);
 const opened=C(original);opened.wires=opened.wires.filter(w=>
  !(w.from.c==='r2'&&w.from.p==='2'&&w.to.c==='u1'&&w.to.p==='2'));
 assert.equal(goodSource(opened),false);
 const broken=sample(opened);assert.ok(Math.max(...broken.map(x=>x.a))-Math.min(...broken.map(x=>x.a))<.1);
 const wrongB=C(original);wrongB.wires.find(w=>w.from.c==='u1'&&w.from.p==='5').to.p='P';
 assert.equal(goodSource(wrongB),false);
 const wrong=sample(wrongB);assert.ok(wrong[0].b>20,'Wrong B+ input is not grounded spare');
 assert.equal(l.pedagogyReview.titleTopologyIssue,'INVERTING_AC_RESPONSE_NATIVE_PENDING');
});


test('SC024 20 Hz UNI-T DCV instantaneous native sample and negative meter/frequency controls',()=>{
 const Arduino=require('../dist/arduino-runtime.js');
 const l=L.byId['opamp-apps-outline-024'],source=l.project;
 const clone=p=>JSON.parse(JSON.stringify(p));
 const get=(p,id)=>p.components.find(c=>c.id===id);
 const correctProbes=p=>get(p,'v1-red')?.probeTarget?.c==='u1'&&
  get(p,'v1-red')?.probeTarget?.p==='1'&&
  get(p,'v1-black')?.probeTarget?.c==='g1'&&
  get(p,'v1-black')?.probeTarget?.p==='M';
 assert.equal(source.wires.length,15);
 assert.equal(l.steps.length,15);
 assert.equal(get(source,'v1').meterPosition,4);
 assert.equal(get(source,'in').generatorFrequency,20);
 assert.equal(l.pedagogyReview.sc024MeterDcSampleTargetedPass,true);
 assert.equal(l.pedagogyReview.sc024GeneratorPeriodMs,50);
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 assert.equal(l.pedagogyReview.feedbackGainAcceptance,false);
 assert.equal(correctProbes(source),true);
 const trace=(p,times)=>{
  const sampled=[];
  for(const now of times){
   Arduino.tick(p,defs,{now});
   const state=Native.solve(p,defs,{now});
   assert.ok(state.stable&&!state.blocked&&!state.shortCircuit);
   const generator=get(p,'in'),u1=get(p,'u1'),meter=get(p,'v1')._meter;
   assert.ok(Number.isFinite(generator._signalVoltage)&&
    Number.isFinite(u1._opampChannels?.['1']?.output)&&
    Number.isFinite(u1._opampChannels?.['7']?.output));
   sampled.push({now,input:generator._signalVoltage,output:u1._opampChannels['1'].output,
    spare:u1._opampChannels['7'].output,reading:meter.value,warning:meter.warning,
    display:meter.display,mode:meter.mode});
  }
  return sampled;
 };
 const times=[0,12.5,25,37.5,50,62.5],good=trace(clone(source),times);
 const near=(a,b,tol=.05)=>Math.abs(a-b)<=tol;
 for(const s of good){
  assert.equal(s.mode,'DCV');assert.equal(s.warning,'');
  assert.ok(!s.display.includes('OL'));
  assert.ok(near(s.output,s.reading),'UT33D+ should show an instantaneous output sample');
  assert.ok(s.spare>=0&&s.spare<.5);
 }
 assert.ok(near(good[0].input,good[4].input)&&
  near(good[1].input,good[5].input)&&
  near(good[1].output,good[5].output),
  '20 Hz sine must repeat after 50 ms');
 assert.ok(good[1].input-good[3].input>1.9&&good[3].output-good[1].output>6,
  'LM358P A channel must invert the positive and negative sine peaks');
 const wrongRange=clone(source);get(wrongRange,'v1').meterPosition=6;
 const ol=trace(wrongRange,times);
 assert.ok(ol.every(x=>x.display==='OL'&&x.warning.includes('AC/DC')),
  'Old ACV position must reproduce the warning, not a fake RMS reading');
 const wrongFrequency=clone(source);get(wrongFrequency,'in').generatorFrequency=40;
 const shifted=trace(wrongFrequency,times);
 assert.ok(Math.abs(shifted[1].input-good[1].input)>.5,
  '40 Hz negative control must not pass the 20 Hz time checkpoint');
 const off=clone(source);get(off,'in').generatorEnabled=false;
 const zero=trace(off,times);
 assert.ok(Math.max(...zero.map(x=>x.output))-Math.min(...zero.map(x=>x.output))<.1,
  'Disabled generator must not produce a 20 Hz output');
 const lostProbe=clone(source);delete get(lostProbe,'v1-red').probeTarget;
 assert.equal(correctProbes(lostProbe),false,
  'Open red probe is a separate unresolved meter-contact warning issue');
 assert.equal(l.pedagogyReview.titleTopologyIssue,'INVERTING_AC_RESPONSE_NATIVE_PENDING');
});


test('SC024 UNI-T disconnected probe must fail closed, not read false 0 V',()=>{
 const Arduino=require('../dist/arduino-runtime.js'),lesson=L.byId['opamp-apps-outline-024'];
 const clone=x=>JSON.parse(JSON.stringify(x)),source=lesson.project,part=(p,id)=>p.components.find(c=>c.id===id);
 assert.equal(source.wires.length,15);assert.equal(lesson.steps.length,15);
 assert.equal(lesson.pedagogyReview.sc024ProbeContactTargetedPass,true);
 assert.equal(lesson.pedagogyReview.nativeDynamicAcceptance,false);
 const read=(p,now=12.5)=>{
  Arduino.tick(p,defs,{now});const s=Native.solve(p,defs,{now});
  assert.ok(s.stable&&!s.blocked&&!s.shortCircuit);
  return part(p,'v1')._meter;
 };
 const ok=read(clone(source));
 assert.equal(ok.warning,'');assert.notEqual(ok.display,'OL');
 assert.ok(ok.value>10&&ok.value<20);
 for(const id of ['v1-red','v1-black']){
  const p=clone(source);delete part(p,id).probeTarget;
  const m=read(p);assert.equal(m.display,'OL');assert.equal(m.value,null);
  assert.match(m.warning,/temas/);
 }
 const badPin=clone(source);part(badPin,'v1-red').probeTarget={c:'u1',p:'NOT_A_REAL_PIN'};
 assert.equal(read(badPin).display,'OL');
 const orphan=clone(source);orphan.junctions=[{id:'orphan'}];
 part(orphan,'v1-red').probeTarget={j:'orphan'};
 assert.equal(read(orphan).display,'OL');
 const other=clone(source);part(other,'v1-red').probeTarget={c:'g1',p:'P'};
 const supply=read(other);assert.equal(supply.warning,'');
 assert.ok(Math.abs(supply.value-24)<.1);
 const hold=clone(source);read(hold,0);part(hold,'v1').meterHold=true;
 delete part(hold,'v1-red').probeTarget;
 const stale=read(hold);assert.equal(stale.display,'OL');assert.equal(stale.value,null);
 const missingWire=clone(source);
 missingWire.wires=missingWire.wires.filter(w=>!(w.from.c==='v1'&&w.from.p==='V'));
 const missing=read(missingWire);assert.equal(missing.display,'OL');assert.match(missing.warning,/yuvaları/);
 const off=clone(source);part(off,'v1').meterPosition=0;assert.equal(read(off).display,'');
});
