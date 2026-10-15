'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),scene=L.byId['electronic-switching-src-11'];
const clone=p=>JSON.parse(JSON.stringify(p));
const part=(p,id)=>p.components.find(c=>c.id===id);
function evaluate(duty,now=1000,edit=()=>{}){
 const p=clone(scene.project);part(p,'pwm1').dutyPercent=duty;edit(p);
 return {p,out:Native.solveSc11Cycle(p,defs,{now})};
}
test('SC11 samples 1 kHz ON/OFF using native solver, not 50 ms display alias',()=>{
 for(const [duty,target] of [[0,0],[25,25],[50,50],[82,82],[100,100]]){
  const {p,out}=evaluate(duty,1000.3);
  assert.equal(out.result.stable,true,'native stable at duty '+duty);
  assert.equal(out.result.shortCircuit,false);
  assert.equal(out.valid,true,'native phase validity '+duty);
  assert.equal(out.driveTargetPercent,target,'validated drive % '+duty);
  assert.equal(part(p,'m1')._sc11DriveTargetPercent,target);
  assert.equal(part(p,'m1')._motorRPM,undefined,'no invented RPM');
  assert.ok(Number.isFinite(part(p,'m1')._sc11SpeedPercent));
 }
});
test('SC11 phase-weighted VGS comes from connected virtual DCV probes, not duty label',()=>{
 const v=[0,50,100].map(d=>{
  const {p,out}=evaluate(d);
  const vg=part(p,'vg');
  assert.equal(vg._meter?.mode,'DCV');
  assert.equal(out.vgsDcAverage,part(p,'m1')._sc11VgsMean);
  assert.equal(vg._meter.value,out.vgsDcAverage);
  return out.vgsDcAverage;
 });
 assert.ok(v.every(Number.isFinite),'actual native numeric DCV values');
 assert.ok(v[0]>=-0.1&&v[0]<1,'OFF gate near zero');
 assert.ok(v[2]>v[1]&&v[1]>v[0],'phase averaged G-S voltage follows duty');
 const {p,out}=evaluate(50,1000,q=>{q.wires=q.wires.filter(w=>w.from.c!=='vg'&&w.to.c!=='vg')});
 assert.equal(out.vgsDcAverage,null,'missing DMM lead is never silently estimated');
 const held=evaluate(50,1000,q=>{part(q,'vg').meterHold=true});
 assert.equal(held.out.vgsDcAverage,null,'HOLD must never be treated as a fresh two-phase measurement');
});
test('SC11 motor is fail-closed for broken control/power paths',()=>{
 for(const [a,b] of [['rg','q1'],['m1','q1'],['g1','m1'],['g1','pwm1'],['pwm1','rg'],['pwm1','g1']]){
  const {p,out}=evaluate(100,1000,q=>{q.wires=q.wires.filter(w=>!(w.from.c===a&&w.to.c===b))});
  assert.equal(out.driveTargetPercent,0,a+'>'+b);
  assert.equal(part(p,'m1')._motorRPM,undefined);
 }
});
test('SC11 normalized visual inertia increases with duty then decays without phantom RPM',()=>{
 const p=clone(scene.project),pwm=part(p,'pwm1'),m=part(p,'m1');
 pwm.dutyPercent=0;Native.solveSc11Cycle(p,defs,{now:1000});
 pwm.dutyPercent=100;Native.solveSc11Cycle(p,defs,{now:1050});
 const s1=m._sc11SpeedPercent;assert.ok(s1>0&&s1<100);
 Native.solveSc11Cycle(p,defs,{now:1100});
 const s2=m._sc11SpeedPercent;assert.ok(s2>s1);
 pwm.dutyPercent=0;Native.solveSc11Cycle(p,defs,{now:1150});
 assert.ok(m._sc11SpeedPercent<s2&&m._sc11SpeedPercent>0);
 assert.equal(m._motorRPM,undefined);
});
test('invalid native PWM frequency never produces drive or synthetic meter average',()=>{
 for(const frequencyHz of [null,-1,0,'1000',NaN]){
  const {p,out}=evaluate(100,1000,q=>{part(q,'pwm1').frequencyHz=frequencyHz});
  assert.equal(out.driveTargetPercent,0);
  assert.equal(out.vgsDcAverage,null);
  assert.equal(part(p,'m1')._motorRPM,undefined);
 }
});
