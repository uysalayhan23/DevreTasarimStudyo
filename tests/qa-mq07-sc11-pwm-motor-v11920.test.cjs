'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-11',lesson=L.byId[id];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
function frame(project,duty,now){
 part(project,'pwm1').dutyPercent=duty;
 const result=Native.solve(project,defs,{now});
 return {result,pwmHigh:!!part(project,'pwm1')._pwmHigh,mosfet:!!part(project,'q1')._mosfetOn,
  motor:!!part(project,'m1')._active,direction:part(project,'m1')._spin};
}
test('SC11 has canonical motor and G/D/S wired terminals, no fake RPM claims',()=>{
 assert.equal(lesson.kind,'wiring');
 assert.equal(part(lesson.project,'q1').typeId,'irf540n-mosfet');
 assert.equal(part(lesson.project,'m1').typeId,'motor-dc');
 assert.equal(part(lesson.project,'pwm1').typeId,'virtual-pwm-generator-v1');
 assert.equal(part(lesson.project,'sw'),undefined);
 for(const pin of ['V+','GND','OUT'])assert.ok(defs['virtual-pwm-generator-v1'].pins.some(p=>p.id===pin));
 assert.equal(lesson.pedagogyReview.mq05PwmVirtual.realRpmModel,false);
 const names=lesson.project.wires.map(w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p);
 for(const wire of ['g1/P>pwm1/V+','pwm1/GND>g1/M','pwm1/OUT>rg/1','rg/2>q1/G','q1/S>g1/M','g1/P>m1/+','m1/−>q1/D'])assert.ok(names.includes(wire),wire);
});
test('native solver handles PWM OFF/ON phases and no fabricated motor RPM',()=>{
 const p=clone(lesson.project);
 for(const [duty,time,on] of [[0,0,false],[50,0,true],[50,.75,false],[100,.75,true],[0,1,false]]){
  const x=frame(p,duty,time);
  assert.equal(x.result.stable,true);
  assert.equal(x.result.blocked,false);
  assert.equal(x.result.shortCircuit,false);
  assert.equal(x.pwmHigh,on);
  assert.equal(x.mosfet,on);
  assert.equal(x.motor,on);
  assert.equal(part(p,'m1')._motorRPM,undefined);
 }
});
test('broken G, D or motor path fails motor drive, not animation-only',()=>{
 for(const edge of [['rg','q1'],['m1','q1'],['g1','m1'],['g1','pwm1'],['pwm1','rg']]){
  const p=clone(lesson.project);
  p.wires=p.wires.filter(w=>!(w.from.c===edge[0]&&w.to.c===edge[1]));
  const x=frame(p,100,0);
  assert.equal(x.result.stable,true);
  assert.equal(x.motor,false);
 }
});
test('invalid duty commands stay OFF in native solver',()=>{
 for(const duty of [-1,101,NaN]){
  const p=clone(lesson.project);const x=frame(p,duty,0);
  assert.equal(x.pwmHigh,false);
  assert.equal(x.motor,false);
 }
});
test('whole original curriculum and catalog remain available',()=>{
 const a=QA.audit({L,defs,Simulation:Native});
 assert.equal(a.total,1655);
 assert.equal(a.definitionCount,941);
 assert.equal(a.withWires,733);
 assert.equal(a.stable,733);
 assert.equal(L.mq07Batch200.reviewIds.length,47);
 for(const k of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','shortCircuits','blocked','unstable','errors','duplicateIds'])assert.deepEqual(a[k],[],k);
});
