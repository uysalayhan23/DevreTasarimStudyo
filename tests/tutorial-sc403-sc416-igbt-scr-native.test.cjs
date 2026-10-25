'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>structuredClone(x);
const l=id=>L.byId[id],p=(o,k)=>o.components.find(c=>c.id===k);
const solve=(o,t)=>{const r=Native.solve(o,defs,{now:t});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'unstable '+t);return r};
function cut(o,a,b){const before=o.wires.length;o.wires=o.wires.filter(w=>!(w.from.c===a&&w.to.c===b));assert.equal(o.wires.length,before-1,'missing '+a+'>'+b)}
test('SC403/407 native PWM high/low and open terminal negatives',()=>{
 for(const id of ['electronic-switching-outline-036','electronic-component-basics-outline-021']){
  const o=clone(l(id).project),original=JSON.stringify(l(id).project);
  for(const [d,t,on] of [[0,0,false],[100,.1,true],[50,.25,true],[50,.75,false],[0,1,false]]){
   p(o,'pwm1').dutyPercent=d;solve(o,t);
   assert.equal(!!p(o,'pwm1')._pwmHigh,on,id+' source');
   assert.equal(!!p(o,'h1')._active,on,id+' load');
  }
  for(const [a,b] of [['pwm1','rg'],['rg','q1'],['q1','g1'],['h1','q1'],['g1','pwm1']]){
   const broken=clone(l(id).project);cut(broken,a,b);p(broken,'pwm1').dutyPercent=100;
   solve(broken,.1);assert.equal(!!p(broken,'h1')._active,false,id+' broken '+a+'/'+b);
  }
  assert.equal(JSON.stringify(l(id).project),original,'canonical immutable');
 }
});
test('SC404/405 native IGBT gate and separately removable power',()=>{
 for(const id of ['electronic-component-basics-outline-018','electronic-component-basics-outline-019']){
  const o=clone(l(id).project),g=p(o,'s'),power=p(o,'sp');
  g.state=false;if(power)power.state=true;solve(o,0);assert.equal(!!p(o,'h1')._active,false);
  g.state=true;solve(o,250);assert.equal(!!p(o,'q')._igbtOn,true);assert.equal(!!p(o,'h1')._active,true);
  if(power){power.state=false;solve(o,500);assert.equal(!!p(o,'q')._igbtOn,true);assert.equal(!!p(o,'h1')._active,false)}
  const broken=clone(l(id).project);p(broken,'s').state=true;cut(broken,'s','q');solve(broken,750);
  assert.equal(!!p(broken,'h1')._active,false);
 }
});
test('SC408/410/411/416 native SCR latch, open gate and open anode',()=>{
 for(const id of ['electronic-switching-outline-037','electronic-switching-outline-039','electronic-switching-outline-040','electronic-switching-outline-044']){
  const o=clone(l(id).project),sw=p(o,'sw');
  sw.state=false;solve(o,0);assert.equal(!!p(o,'h1')._active,false);
  sw.state=true;solve(o,250);assert.equal(!!p(o,'h1')._active,true);
  sw.state=false;solve(o,500);assert.equal(!!p(o,'h1')._active,true);
  const bg=clone(l(id).project);cut(bg,'rg','q1');p(bg,'sw').state=true;solve(bg,250);
  assert.equal(!!p(bg,'h1')._active,false,'open gate '+id);
  const ba=clone(l(id).project);cut(ba,'h1','q1');p(ba,'sw').state=true;solve(ba,250);
  assert.equal(!!p(ba,'h1')._active,false,'open anode '+id);
 }
});
test('specific questions with original 1655 lesson count and no false acceptance',()=>{
 assert.equal(L.lessons.length,1655);
 for(const id of ['electronic-switching-outline-036','electronic-switching-outline-037','electronic-switching-outline-039','electronic-switching-outline-040','electronic-switching-outline-044']){
  const v=l(id);assert.equal(v.kind,'wiring');assert.equal(v.quiz.answer,0);assert.equal(v.quiz.options.length,3);
  assert.equal(v.beginnerSteps.length,5);assert.ok(v.beginnerSteps.some(x=>x.includes('PASS')));
  for(const k of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.notEqual(v.pedagogyReview[k],true);
 }
 for(const id of ['electronic-component-basics-outline-020','electronic-switching-outline-027'])
  assert.equal(l(id).pedagogyReview.titleTopologyStatus,'REVIEW');
});
