'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const fixture=JSON.parse(fs.readFileSync(path.resolve(__dirname,'fixtures/tutorial_native_solver_golden_v11920.json'),'utf8'));
const kinds=new Set(['switch-no','switch-nc','switch-both','switch-multi','sensor','detector']);
const clone=v=>JSON.parse(JSON.stringify(v));
test('90 golden projects correspond to canonical 1655 lessons, without project drift',()=>{
 const L=QA.curriculum();
 assert.equal(L.lessons.length,1655);
 assert.equal(fixture.records.length,90);
 const seen=new Set();
 for(const entry of fixture.records){
  assert.ok(!seen.has(entry.id),'Duplicate fixture '+entry.id);seen.add(entry.id);
  const original=L.byId[entry.id];
  assert.ok(original,'Missing canonical lesson '+entry.id);
  assert.equal(JSON.stringify(original.project),JSON.stringify(entry.project),'Golden source changed: '+entry.id);
  assert.ok(entry.project.wires.length>0,'Golden must have a physical virtual circuit '+entry.id);
 }
 assert.ok(new Set(fixture.records.map(x=>x.topicId)).size>=14,'Insufficient topic diversity');
});
test('native simulation is stable across 90 baseline and at least 250 source control states',()=>{
 const catalog=QA.catalog();
 let baselines=0,toggled=0;
 for(const {id,project:template} of fixture.records){
  const evaluate=(scenario,label)=>{
   const p=clone(scenario),result=Simulation.solve(p,catalog,{now:300});
   assert.equal(result.blocked,false,id+':'+label+' blocked');
   assert.equal(result.shortCircuit,false,id+':'+label+' short circuit');
   assert.equal(result.stable,true,id+':'+label+' unstable');
  };
  evaluate(template,'baseline');baselines++;
  const controls=template.components.filter(c=>kinds.has(catalog[c.typeId]?.kind)&&typeof c.state==='boolean').slice(0,2);
  for(const control of controls)for(const state of [false,true]){
   const p=clone(template);p.components.find(c=>c.id===control.id).state=state;
   evaluate(p,control.id+'='+state);
   toggled++;
  }
 }
 assert.equal(baselines,90);
 assert.ok(toggled>=250,'Expected at least 250 physically modelled virtual input-state checks, got '+toggled);
});
