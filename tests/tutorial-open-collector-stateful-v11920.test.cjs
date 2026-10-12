'use strict';
// Native source-backed sequential sensor regression; never use mock solver.
const test=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/tutorial-lessons.js');
const Simulation=require('../dist/simulation.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const clone=x=>JSON.parse(JSON.stringify(x));
test('four open-collector variants recover after OFF-ON-OFF without stale current or short',()=>{
 const defs=QA.catalog();
 for(let n=1;n<=4;n++){
  const p=clone(L.byId['open-collector-'+n].project);
  const sensor=p.components.find(c=>c.id==='s'),lamp=p.components.find(c=>c.id==='h');
  assert.ok(sensor&&lamp,'missing physical virtual parts for '+n);
  const states=[];
  for(const [i,on] of [false,true,false].entries()){
   sensor.state=on;
   const solved=Simulation.solve(p,defs,{now:i*300});
   assert.equal(solved.blocked,false,'blocked '+n+'/'+i);
   assert.equal(solved.shortCircuit,false,'short circuit '+n+'/'+i);
   assert.equal(solved.stable,true,'unstable '+n+'/'+i);
   assert.equal(solved.oscillating,false,'oscillating '+n+'/'+i);
   states.push({active:!!lamp._active,current:Number(lamp._currentValue)||0});
  }
  assert.deepEqual(states.map(s=>s.active),[false,true,false],'sensor output did not recover '+n);
  if(n===3||n===4){
   assert.ok(Math.abs(states[0].current)<1e-6,'nonzero OFF lamp current '+n);
   assert.ok(Math.abs(states[1].current-.024)<.003,'expected model ON current 24mA '+n);
   assert.ok(Math.abs(states[2].current)<1e-6,'nonzero released lamp current '+n);
  }
 }
});
