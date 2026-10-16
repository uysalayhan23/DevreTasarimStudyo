'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
for(const [num,id] of [['SC48','opamp-apps-src-13'],['SC49','opamp-apps-src-14']]){
 test(num+' RC input-step diagnostic: stable, finite, physical acceptance remains open',()=>{
  const lesson=QA.curriculum().byId[id],p=structuredClone(lesson.project),defs=QA.catalog();
  const input=p.components.find(c=>c.id==='in'),meter=p.components.find(c=>c.id==='v1');
  const readings=[];
  for(let now=0;now<=3000;now+=250){
   input.potentiometer=now<1000?20:now<2000?80:20;
   const result=Simulation.solve(p,defs,{now});
   assert.ok(result.stable&&!result.blocked&&!result.shortCircuit,`${num} ${now}`);
   assert.ok(Number.isFinite(meter._meter?.value),`${num} meter ${now}`);
   readings.push(meter._meter.value);
  }
  assert.ok(Math.max(...readings)-Math.min(...readings)>1,`${num} must react to input step`);
  assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
  // A changing output does not prove the ideal derivative/integral transfer function.
 });
}
