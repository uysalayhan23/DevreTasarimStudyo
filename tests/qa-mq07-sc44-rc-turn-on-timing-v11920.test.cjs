'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Simulation=require('../dist/simulation.js');
test('SC44 RC timed turn-on with native 250 ms simulation steps',()=>{
 const lesson=QA.curriculum().byId['opamp-apps-src-09'],defs=QA.catalog();
 const p=JSON.parse(JSON.stringify(lesson.project));
 const btn=p.components.find(c=>c.id==='s1'),cap=p.components.find(c=>c.id==='c1'),meter=p.components.find(c=>c.id==='v1');
 assert.equal(lesson.pedagogyReview.dynamicTimingAccepted,false);
 btn.state=true;
 let firstHigh=null,earlyLow=false,stable=true;
 for(let now=0;now<=12000;now+=250){
  const result=Simulation.solve(p,defs,{now});
  if(!result.stable||result.shortCircuit||result.blocked){stable=false;break}
  const out=meter._voltageValue;
  if(now===2000)earlyLow=out<1;
  if(out>20&&firstHigh===null)firstHigh=now;
 }
 assert.ok(stable);assert.ok(earlyLow);
 assert.ok(firstHigh>=6500&&firstHigh<=9500,'on delay '+firstHigh);
 assert.ok(cap._capacitorVoltage>12);
});
