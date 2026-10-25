'use strict';
// SC389/SC394–402: native virtual positives and broken-terminal negatives.
// Neither ideal transistor state nor a virtual lamp/motor means physical acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>structuredClone(x);
const part=(p,id)=>p.components.find(c=>c.id===id),lesson=id=>L.byId[id];
const solve=(p,now=1000)=>{const r=Native.solve(p,defs,{now});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'native unstable');return r;};
const remove=(p,from,to)=>{const count=p.wires.length;p.wires=p.wires.filter(w=>!(w.from.c===from&&w.to.c===to));assert.ok(count>p.wires.length,from+'>'+to+' must exist');};
test('SC389 practice is responsive only with actual BD139 base connection',()=>{
 const l=lesson('electronic-switching-outline-025'),p=clone(l.project),original=JSON.stringify(l.project);
 let states=[];
 for(const [t,on] of [[0,false],[100,true],[200,false]]){part(p,'s1').state=on;solve(p,t);states.push(!!part(p,'q1')._active)}
 assert.deepEqual(states,[false,true,false]);
 const broken=clone(l.project);part(broken,'s1').state=true;remove(broken,'rb','q1');solve(broken,100);assert.equal(!!part(broken,'q1')._active,false);
 assert.equal(JSON.stringify(l.project),original);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
});
test('SC394/398 real pot-gate links agree with question and negative guidance',()=>{
 for(const id of ['electronic-switching-outline-028','electronic-switching-outline-032']){
  const l=lesson(id),p=clone(l.project),original=JSON.stringify(l.project);
  part(p,'pot').potentiometer=0;solve(p,0);assert.equal(!!part(p,'q')._active,false);
  part(p,'pot').potentiometer=100;solve(p,100);assert.equal(!!part(p,'q')._active,true);
  const broken=clone(l.project);part(broken,'pot').potentiometer=100;remove(broken,'pot','q');solve(broken,100);assert.equal(!!part(broken,'q')._active,false);
  assert.equal(JSON.stringify(l.project),original);
  assert.notEqual(l.pedagogyReview.nativeDynamicAcceptance,true);
 }
});
test('SC395/396/397/399 JFET and MOSFET loads respond independently and to broken paths',()=>{
 for(const id of ['electronic-switching-outline-029','electronic-switching-outline-030','electronic-switching-outline-033']){
  const p=clone(lesson(id).project);
  part(p,'sj').state=true;solve(p);assert.equal(!!part(p,'hj')._active,true);assert.equal(!!part(p,'hm')._active,false);
  part(p,'sj').state=false;part(p,'sm').state=true;solve(p);
  assert.equal(!!part(p,'hj')._active,false);assert.equal(!!part(p,'hm')._active,true);
  const broken=clone(lesson(id).project);
  part(broken,'sj').state=true;part(broken,'sm').state=true;remove(broken,'sm','qm');solve(broken);
  assert.equal(!!part(broken,'hj')._active,true);assert.equal(!!part(broken,'hm')._active,false);
 }
 const j=clone(lesson('electronic-switching-outline-031').project);
 part(j,'sj').state=true;solve(j);assert.equal(!!part(j,'hj')._active,true);
 remove(j,'hj','qj');solve(j);assert.equal(!!part(j,'hj')._active,false);
});
test('SC400 real RC discharge holds then releases virtual lamp; missing capacitor or gate removes behavior',()=>{
 const l=lesson('electronic-switching-outline-034'),p=clone(l.project),history=[];
 for(let ms=0;ms<=4250;ms+=250){
  part(p,'sw').state=ms>=250&&ms<1250;solve(p,ms);
  history.push({ms,lit:!!part(p,'h1')._active,cap:part(p,'c1')._capacitorVoltage});
 }
 const at=ms=>history.find(x=>x.ms===ms);
 assert.equal(at(0).lit,false);assert.equal(at(250).lit,true);
 assert.equal(at(3000).lit,true);assert.equal(at(3250).lit,false);
 assert.ok(at(1250).cap>at(250).cap&&at(3250).cap<at(1250).cap);
 const noCap=clone(l.project);noCap.components=noCap.components.filter(c=>c.id!=='c1');noCap.wires=noCap.wires.filter(w=>w.from.c!=='c1'&&w.to.c!=='c1');
 let offAtRelease;
 for(let ms=0;ms<=1250;ms+=250){part(noCap,'sw').state=ms>=250&&ms<1250;solve(noCap,ms);if(ms===1250)offAtRelease=!!part(noCap,'h1')._active}
 assert.equal(offAtRelease,false);
 const open=clone(l.project);remove(open,'rc','q1');part(open,'sw').state=true;solve(open,1000);assert.equal(!!part(open,'h1')._active,false);
});
test('SC401 function differs from physical product diagnosis: open gate vs open load',()=>{
 const l=lesson('electronic-switching-outline-035'),p=clone(l.project);
 part(p,'sw').state=false;solve(p);assert.equal(!!part(p,'h1')._active,false);
 part(p,'sw').state=true;solve(p);
 assert.equal(!!part(p,'h1')._active,true);assert.ok(part(p,'vg')._meter.value>11);
 const openGate=clone(l.project);part(openGate,'sw').state=true;remove(openGate,'rg','q1');solve(openGate);assert.equal(!!part(openGate,'h1')._active,false);
 const openLoad=clone(l.project);part(openLoad,'sw').state=true;remove(openLoad,'h1','q1');solve(openLoad);
 assert.equal(!!part(openLoad,'h1')._active,false);assert.ok(part(openLoad,'vg')._meter.value>11);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});
test('SC402 PWM virtual motor responds to valid command and fails closed on broken signal',()=>{
 const l=lesson('motor-direct-power-outline-021'),p=clone(l.project);
 part(p,'pwm1').dutyPercent=0;solve(p,0);assert.equal(!!part(p,'m1')._active,false);
 part(p,'pwm1').dutyPercent=100;solve(p,0.1);assert.equal(!!part(p,'m1')._active,true);
 part(p,'pwm1').dutyPercent=0;solve(p,1);assert.equal(!!part(p,'m1')._active,false);
 for(const edge of [['pwm1','rg'],['g1','pwm1'],['m1','q1']]){
  const bad=clone(l.project);part(bad,'pwm1').dutyPercent=100;remove(bad,...edge);solve(bad,1000);
  assert.equal(!!part(bad,'m1')._active,false,edge.join('>'));
 }
 assert.equal(part(p,'m1')._motorRPM,undefined);
});
test('protected learner statuses, question validity and 1655 count remain',()=>{
 assert.equal(L.lessons.length,1655);
 const ids=['electronic-switching-outline-025','electronic-switching-outline-028','electronic-switching-outline-032','electronic-switching-outline-034','electronic-switching-outline-035','motor-direct-power-outline-021'];
 for(const id of ids){
  const l=lesson(id);assert.equal(l.quiz.answer,0);assert.equal(l.quiz.options.length,3);
  assert.ok(l.beginnerSteps.length>=4);assert.ok(!l.project.referenceOnly);
  for(const k of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.notEqual(l.pedagogyReview[k],true);
 }
 for(const id of ['electronic-component-basics-outline-015','electronic-switching-outline-027'])
  assert.equal(lesson(id).pedagogyReview.titleTopologyStatus,'REVIEW');
});
