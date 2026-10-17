'use strict';
// MQ-12 acceptance CANDIDATES: execute original, unmodified Simulation.solve.
// A green source-graph test is not a dynamic/Windows/manufacturer PASS.
// Run only in a later consolidated native Node/Windows batch; no CI/Actions.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const clone=x=>JSON.parse(JSON.stringify(x));
const part=(p,id)=>{const c=p.components.find(x=>x.id===id);assert.ok(c,'Missing '+id);return c};
const acceptedFalse=(id,field)=>{
 const l=L.byId[id];assert.ok(l,'Lesson not found '+id);
 assert.equal(l.pedagogyReview[field],false,'Do not silently accept '+id+'/'+field);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
 return clone(l.project);
};
function measure(p,now){
 const result=Simulation.solve(p,defs,{now});
 assert.equal(result.blocked,false,'Native solver blocked at '+now);
 assert.equal(result.shortCircuit,false,'Unexpected short at '+now);
 assert.equal(result.stable,true,'Native solver unstable at '+now);
 assert.equal(result.oscillating,false,'Native solver oscillating at '+now);
 const meter=part(p,'v1')._meter,opamp=part(p,'u1');
 assert.ok(meter,'V1 has no native meter result at '+now);
 assert.equal(meter.warning||'','', 'V1 warning at '+now+': '+meter.warning);
 assert.ok(Number.isFinite(meter.value),'V1 lacks numeric native reading at '+now);
 return {now,v:meter.value,opamp:opamp._opampChannels?.['1']?.output??null,
  cap:p.components.find(c=>c.id==='c1')?._capacitorVoltage??null,
  diode:p.components.find(c=>c.id==='d1')?._diodeForward??null};
}
const diagnostic=(t,key,obj)=>t.diagnostic(key+' '+JSON.stringify(obj));
function delaySequence(id){
 const p=acceptedFalse(id,'dynamicTimingAccepted'),s=part(p,'s1');
 s.state=false;
 const beginning=measure(p,0),charge=[];
 s.state=true;
 for(let frame=1;frame<=64;frame++)charge.push(measure(p,frame*250));
 s.state=false;
 const release=[];
 for(let frame=65;frame<=128;frame++)release.push(measure(p,frame*250));
 return {beginning,charge,release,project:p};
}
function evaluateDelay(t,id,mode){
 const q=delaySequence(id),cap=x=>x.cap;
 const values=[q.beginning,...q.charge,...q.release];
 assert.ok(values.every(x=>Number.isFinite(cap(x))),'Native capacitor state not finite');
 const first=q.beginning,lastCharge=q.charge.at(-1),lastRelease=q.release.at(-1);
 diagnostic(t,id,{start:first,chargeAt2s:q.charge[7],chargeAt8s:q.charge[31],
  chargeAt16s:lastCharge,releaseAt8s:q.release[31],releaseAt16s:lastRelease});
 assert.ok(first.cap>=-.25&&first.cap<2,'Initial RC capacitor must be discharged');
 assert.ok(lastCharge.cap>12,'RC did not charge above 12 V threshold in 16 s');
 assert.ok(lastCharge.cap>q.charge[7].cap+2,'RC charge lacks time dependence');
 assert.ok(lastRelease.cap<lastCharge.cap-1,'RC failed to discharge after button release');
 assert.ok(lastCharge.v>first.v+5,'LM358 output did not switch ON after charging');
 if(mode==='OFF'){
  assert.ok(lastRelease.cap<12,'SC49 RC did not fall back below threshold');
  assert.ok(lastRelease.v<lastCharge.v-5,'SC49 LM358 output did not switch OFF');
 }else{
  assert.ok(lastRelease.cap>12,'SC48 slow bleed should retain charge in first 16 s');
  assert.ok(lastRelease.v>first.v+5,'SC48 must not immediately lose output');
 }
}
test('SC48 original solver: sampled RC ON delay and retained output, no fake time PASS',t=>{
 evaluateDelay(t,'opamp-apps-src-09','ON');
});
test('SC49 original solver: sampled RC fast charge then OFF decay and output release',t=>{
 evaluateDelay(t,'opamp-apps-src-10','OFF');
});
test('SC48/49 negative control: open S1 never charges comparator timing node',t=>{
 for(const id of ['opamp-apps-src-09','opamp-apps-src-10']){
  const p=acceptedFalse(id,'dynamicTimingAccepted');
  part(p,'s1').state=false;
  let sample;
  for(let frame=0;frame<=64;frame++)sample=measure(p,frame*250);
  diagnostic(t,id+' unpressed',{at16s:sample});
  assert.ok(Number.isFinite(sample.cap)&&sample.cap<2,
   'Unpressed button produced false capacitor charging');
  assert.ok(sample.v<10,'Unpressed button produced false delayed-ON output');
 }
});
function rectifierAt(pct){
 const p=acceptedFalse('opamp-apps-src-15','dcTransferAccepted');
 part(p,'rv1').potentiometer=pct;
 const row=measure(p,0);
 return {pct,...row};
}
test('SC50 original solver: independent DC transfer sweep through 1N4148 feedback',t=>{
 const rows=[0,10,25,50,75,90,100].map(rectifierAt);
 diagnostic(t,'SC50 DC transfer',rows);
 assert.ok(rows.every(x=>Number.isFinite(x.v)),'Missing DC transfer samples');
 assert.ok(rows[0].v>rows[4].v+1,'DC rectifier did not distinguish input above/below Vref');
 assert.ok(rows[2].v>rows[4].v+1,'SC50 active and inactive half-wave states indistinguishable');
 assert.ok(Math.abs(rows[6].v)<2,'Below Vref, output is not near the reference');
 assert.equal(L.byId['opamp-apps-src-15'].pedagogyReview.acWaveformAcceptance,false);
 // Do not extrapolate these DC potentiometer points into a sinusoidal AC PASS.
});
const seq=(lo,hi,step)=>{const a=[];for(let p=lo;step<0?p>=hi:p<=hi;p+=step)a.push(p);return a};
function sweepSchmitt(withFeedback=true){
 const p=acceptedFalse('oscillator-filter-apps-src-13','dynamicHysteresisAccepted');
 if(!withFeedback){
  const i=p.wires.findIndex(w=>(w.from?.c==='r2'&&w.from.p==='2'&&w.to?.c==='u1'&&w.to.p==='3')||
   (w.to?.c==='r2'&&w.to.p==='2'&&w.from?.c==='u1'&&w.from.p==='3'));
  assert.ok(i>=0,'Missing feedback edge in negative fixture');
  p.wires.splice(i,1);
 }
 const sample=(percent,now)=>{part(p,'in').potentiometer=percent;return {pct:percent,...measure(p,now)}};
 const ascending=seq(100,0,-5).map((pct,i)=>sample(pct,i*250));
 const descending=seq(0,100,5).map((pct,i)=>sample(pct,(i+ascending.length)*250));
 const crossing=(points,rising)=>{
  for(let i=1;i<points.length;i++){
   if(rising&&points[i-1].v<11&&points[i].v>=11)return points[i].pct;
   if(!rising&&points[i-1].v>=11&&points[i].v<11)return points[i].pct;
  }return null;
 };
 return {up:crossing(ascending,true),down:crossing(descending,false),
  ascending,descending};
}
test('SC65 original solver: rising and falling hysteresis thresholds are distinct',t=>{
 const sweep=sweepSchmitt();
 diagnostic(t,'SC65 forward-reverse',sweep);
 assert.ok(sweep.ascending[0].v<10,'SC65 low-input state not low');
 assert.ok(sweep.ascending.at(-1).v>15,'SC65 high-input state not high');
 assert.ok(Number.isFinite(sweep.up),'No rising Schmitt threshold detected');
 assert.ok(Number.isFinite(sweep.down),'No falling Schmitt threshold detected');
 assert.ok(sweep.down>=sweep.up+5,'No distinct rising/falling hysteresis thresholds');
});
test('SC65 negative control: removing feedback eliminates distinct hysteresis',t=>{
 const sweep=sweepSchmitt(false);
 diagnostic(t,'SC65 no-positive-feedback',sweep);
 assert.ok(Number.isFinite(sweep.up)&&Number.isFinite(sweep.down),
  'Negative comparator control does not switch both directions');
 assert.ok(Math.abs(sweep.down-sweep.up)<=5,
  'Removing positive feedback still claims substantial hysteresis');
});
