'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
test('SC45 native RC comparator turn-off after release at 250 ms steps',()=>{
 const lesson=QA.curriculum().byId['opamp-apps-src-10'];
 assert.ok(lesson,'SC45 must exist');
 const p=structuredClone(lesson.project),defs=QA.catalog();
 const btn=p.components.find(c=>c.id==='s1'),cap=p.components.find(c=>c.id==='c1'),meter=p.components.find(c=>c.id==='v1');
 let releaseVoltage=null,firstLow=null,highBeforeRelease=false;
 for(let now=0;now<=16000;now+=250){
  btn.state=now<2000;
  const result=Simulation.solve(p,defs,{now});
  assert.ok(result.stable&&!result.blocked&&!result.shortCircuit,'solver at '+now);
  const out=meter._voltageValue;
  assert.ok(Number.isFinite(out),'meter at '+now);
  if(now===1750)highBeforeRelease=out>20;
  if(now===2000)releaseVoltage=cap._capacitorVoltage;
  if(now>2000&&out<1&&firstLow===null)firstLow=now;
 }
 assert.ok(highBeforeRelease,'RC must charge and comparator go HIGH');
 assert.ok(releaseVoltage>20,'C1 charged before release');
 assert.ok(firstLow>=7500&&firstLow<=10000,'delayed LOW at '+firstLow);
 assert.ok(cap._capacitorVoltage<releaseVoltage,'C1 must discharge');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
