'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {audit,main}=require('../scripts/qa-tutorial-722-sequential-v11920.cjs');

test('native 722 wiring lessons solve all three consecutive phases without faults',()=>{
 const r=main();
 assert.equal(r.lessonCount,1655);
 assert.equal(r.withWires,722);
 for(const k of ['checkedInitial','checkedChanged','checkedRestored',
   'stableInitial','stableChanged','stableRestored'])assert.equal(r[k],722,k);
 assert.equal(r.stabilityStatus,'PASS');
 assert.equal(r.missingDefinitions.length,0);
 assert.equal(r.failures.length,0);
 assert.equal(r.controls+r.noControl,722);
 assert.ok(r.controls>=400);
 assert.ok(r.observedOutputChanges>=450);
 // The PNP target-driven sensor must be actuated by virtual target distance,
 // not by toggling a disabled manual button state.
 assert.equal(r.controls,456);
 assert.equal(r.observedOutputChanges,456);
 assert.deepEqual(r.unresponsiveControls,[]);
 assert.equal(r.behaviorStatus,'PASS');
});
test('sequential gate refuses a short introduced by virtual control transition',()=>{
 let phase=0;
 const L={lessons:[{id:'fixture',project:{components:[
  {id:'g1',typeId:'supply-dc-plus'}, {id:'s1',typeId:'push-no',state:false}
 ],wires:[{from:{c:'g1',p:'P'},to:{c:'s1',p:'13'}}]}}]};
 const defs={'supply-dc-plus':{},'push-no':{}};
 const solver={solve(){return ++phase===2?
  {stable:true,shortCircuit:true,blocked:false,oscillating:false}:
  {stable:true,shortCircuit:false,blocked:false,oscillating:false}}};
 const result=audit({L,defs,solver});
 assert.equal(result.checkedInitial,1);
 assert.equal(result.checkedChanged,1);
 assert.equal(result.checkedRestored,1);
 assert.equal(result.failures.length,1);
 assert.equal(result.failures[0].phase,'Changed');
 assert.equal(result.stabilityStatus,'FAIL');
});


test('virtual PNP sensor target near/far actually drives UT33D+ 0 V / 24 V / 0 V',()=>{
 const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
 const Simulation=require('../dist/simulation.js');
 const lessons=QA.curriculum(),definitions=QA.catalog();
 const raw=lessons.byId['measurement-workshop-src-10'].project;
 const project=structuredClone(raw),s=project.components.find(c=>c.id==='s1'),
  meter=project.components.find(c=>c.id==='mm');
 const before=JSON.stringify(raw);
 const volts=[];
 for(const distance of [10,2,10]){
  s.sensing.distance=distance;
  const result=Simulation.solve(project,definitions,{now:volts.length*400});
  assert.equal(result.stable,true);
  assert.equal(result.shortCircuit,false);
  assert.equal(result.blocked,false);
  volts.push(meter._meter.value);
 }
 assert.ok(Math.abs(volts[0])<.1);
 assert.ok(Math.abs(volts[1]-24)<.1);
 assert.ok(Math.abs(volts[2])<.1);
 assert.equal(JSON.stringify(raw),before,'canonical lesson must remain untouched');
});
