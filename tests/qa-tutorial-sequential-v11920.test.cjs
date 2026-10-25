'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-sequential-v11920.cjs');
const Core=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
test('sequenced electrical QA probes genuine curriculum through native simulator',()=>{
 const report=QA.main();
 assert.equal(report.total,1655);
 assert.equal(report.wired,733);
 assert.equal(report.referenceOnly,922);
 assert.equal(report.scope.wiring,717);
 assert.equal(report.scope.explore,16);
 assert.equal(report.scope.referenceWithWires,68);
 assert.equal(report.scope.rawWireCount,801);
 assert.equal(report.scope.wiringGoal,722);
 assert.equal(report.scope.wiringGap,5);
 assert.equal(report.scope.wiringGoalStatus,'PENDING');
 assert.equal(report.coverage,true);
 assert.ok(report.projectsWithControls>0);
 assert.ok(report.controlsExercised>=report.projectsWithControls);
 assert.ok(report.solves>=report.wired+2*report.controlsExercised);
 assert.equal(report.errors.length,0,'native solver errors: '+JSON.stringify(report.errors.slice(0,8)));
 assert.equal(report.faults.length,0,'faults: '+JSON.stringify(report.faults.slice(0,8)));
 assert.equal(report.unstable.length,0,'unstable states: '+JSON.stringify(report.unstable.slice(0,8)));
 assert.equal(report.oscillating.length,0,'oscillating states: '+JSON.stringify(report.oscillating.slice(0,8)));
 assert.equal(report.status,'SOURCE_SEQUENCES_CHECKED_BEHAVIOR_ACCEPTANCE_OPEN','only source-state coverage can be claimed');

 // An electrical state probe does not certify pedagogical, physical or visual acceptance.
 assert.equal(report.status,'SOURCE_SEQUENCES_CHECKED_BEHAVIOR_ACCEPTANCE_OPEN');
});
test('sequential probes switch on then off without modifying source project',()=>{
 const p={components:[{id:'b',typeId:'switch',state:false},{id:'light',typeId:'lamp',state:false}],wires:[{from:{c:'b',p:'1'},to:{c:'light',p:'A'}}]};
 const L={lessons:[{id:'fixture',project:p}]};
 const defs={switch:{id:'switch',kind:'switch-no',pins:[{id:'1'},{id:'2'}]},lamp:{id:'lamp',kind:'lamp',pins:[{id:'A'},{id:'B'}]}};
 const states=[];
 const engine={solve(project){const c=project.components[0],light=project.components[1];states.push(!!c.state);light._active=!!c.state;return{blocked:false,shortCircuit:false,stable:true,oscillating:false};}};
 const original=JSON.stringify(p);
 const report=QA.audit({L,defs,engine});
 assert.deepEqual(states,[false,true,false]);
 assert.equal(report.wired,1);
 assert.equal(report.controlsExercised,1);
 assert.equal(report.observableChanges,1);
 assert.equal(report.faults.length,0);
 assert.equal(JSON.stringify(p),original,'user-owned source project modified');
 assert.equal(report.status,'FAIL_OR_INCOMPLETE','fixture never gets overall PASS');
});
test('faults and unstable states are recorded, not silently accepted',()=>{
 const L={lessons:[{id:'bad',project:{components:[{id:'b',typeId:'switch',state:false}],wires:[{from:{c:'b',p:'1'},to:{c:'b',p:'2'}}]}}]};
 const defs={switch:{kind:'switch-no'}};
 let n=0;const engine={solve(){n++;return{blocked:n===2,shortCircuit:n===3,stable:n!==2,oscillating:false}}};
 const report=QA.audit({L,defs,engine});
 assert.equal(report.solves,3);
 assert.equal(report.faults.length,2);
 assert.equal(report.unstable.length,1);
 assert.equal(report.status,'FAIL_OR_INCOMPLETE');
});


test('configured PNP sensor uses target distance instead of ineffective manual state',()=>{
 const source={components:[
  {id:'s',typeId:'proximity',state:false,sensing:{target:'metal',range:4,distance:10}},
  {id:'h',typeId:'lamp',state:false}
 ],wires:[{from:{c:'s',p:'BK'},to:{c:'h',p:'X1'}}]};
 const original=JSON.stringify(source),distances=[];
 const engine={solve(p){
  const sensor=p.components[0],lamp=p.components[1];
  distances.push(sensor.sensing.distance);
  lamp._active=sensor.sensing.distance<=4;
  return{blocked:false,shortCircuit:false,stable:true};
 }};
 const report=QA.audit({L:{lessons:[{id:'sensor',project:source}]},
  defs:{proximity:{kind:'sensor'},lamp:{kind:'lamp'}},engine});
 assert.deepEqual(distances,[10,2,10]);
 assert.equal(report.controlsExercised,1);
 assert.equal(report.observableChanges,1);
 assert.equal(report.errors.length,0);
 assert.equal(JSON.stringify(source),original);
});
