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
 // Only this virtual measurement reference lacks physical probe contact in source.
 // It must NOT count as a confirmed sensor-output functional demonstration.
 assert.deepEqual(r.unresponsiveControls.map(x=>x.id),['measurement-workshop-src-10']);
 assert.equal(r.behaviorStatus,'REVIEW');
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
