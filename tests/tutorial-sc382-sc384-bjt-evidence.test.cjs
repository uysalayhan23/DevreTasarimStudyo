'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),copy=x=>structuredClone(x);
const get=id=>L.byId['electronic-switching-outline-'+id];
const q=p=>p.components.find(c=>c.id==='q1');
const at=(rows,t)=>rows.find(x=>x.t===t);
function trace(p,times,enabled){
 const s=p.components.find(c=>c.id==='s1'),c=p.components.find(c=>c.id==='c1'),rows=[];
 for(const t of times){
  s.state=enabled(t);
  const r=Native.solve(p,defs,{now:t});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'unstable at '+t);
  rows.push({t,on:!!q(p)._active,vc:c?._capacitorVoltage});
 }
 return rows;
}
test('SC382 cutoff and SC383 switching respond to S1 and real broken-base negative',()=>{
 for(const id of ['022','023']){
  const l=get(id),p=copy(l.project),original=JSON.stringify(l.project);
  assert.equal(l.kind,'wiring');assert.equal(p.wires.length,8);
  assert.deepEqual(p.components.filter(c=>['bd139-npn','resistor','push-no'].includes(c.typeId)).map(c=>c.typeId),
   ['push-no','resistor','bd139-npn','resistor']);
  const times=[0,100,200,300],enabled=t=>t>=100&&t<300;
  const positive=trace(p,times,enabled);
  assert.deepEqual(positive.map(x=>x.on),[false,true,true,false],l.id);
  const bad=copy(l.project);
  bad.wires=bad.wires.filter(w=>!(w.to.c==='q1'&&w.to.p==='B'));
  assert.ok(bad.wires.length<p.wires.length);
  assert.deepEqual(trace(bad,times,enabled).map(x=>x.on),[false,false,false,false],l.id+' open base');
  assert.equal(JSON.stringify(l.project),original,l.id+' original unchanged');
  assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
  assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
  assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 }
});
test('SC384 capacitor delays the native Q1 transition; cable and capacitor faults differ',()=>{
 const l=get('024'),p=copy(l.project),original=JSON.stringify(l.project);
 assert.equal(p.wires.length,12);assert.equal(p.components.find(c=>c.id==='c1').capacitance,.001);
 const times=Array.from({length:24},(_,i)=>i*250),enabled=t=>t>=250&&t<2250;
 const normal=trace(p,times,enabled);
 assert.equal(at(normal,0).on,false);assert.equal(at(normal,1000).on,false);
 assert.equal(at(normal,1500).on,true);assert.equal(at(normal,2250).on,true);
 assert.equal(at(normal,5750).on,false);
 assert.ok(at(normal,1500).vc>at(normal,1000).vc);
 assert.ok(at(normal,5750).vc<at(normal,2250).vc);
 const open=copy(l.project);
 open.wires=open.wires.filter(w=>!(w.to.c==='q1'&&w.to.p==='B'));
 assert.ok(trace(open,times,enabled).every(x=>!x.on),'broken base must never energize');
 const noCap=copy(l.project);
 noCap.components=noCap.components.filter(c=>c.id!=='c1');
 noCap.wires=noCap.wires.filter(w=>w.from.c!=='c1'&&w.to.c!=='c1');
 const direct=trace(noCap,times,enabled);
 assert.equal(at(direct,250).on,true);assert.equal(at(direct,2250).on,false);
 assert.equal(JSON.stringify(l.project),original,'canonical preserved');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 assert.match(l.explanation,/1500 ms/);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
});
test('1655 lessons, protected SC379/380 and false-acceptance limits remain',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons[378].id,'motor-direct-power-outline-019');
 assert.equal(L.lessons[379].id,'motor-direct-power-outline-020');
 for(const id of ['022','023','024']){
  const lesson=get(id);
  for(const key of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.equal(lesson.pedagogyReview[key],false);
  assert.ok(lesson.quiz&&Array.isArray(lesson.quiz.options)&&lesson.quiz.answer===0);
 }
});
