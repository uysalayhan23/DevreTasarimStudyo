'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const defs=QA.catalog();
const clone=x=>JSON.parse(JSON.stringify(x));

function makeCircuit(){
 const c=(id,typeId,extra={})=>({id,typeId,x:0,y:0,...extra});
 const w=(a,p,b,q)=>({from:{c:a,p},to:{c:b,p:q},color:'#d14343',role:'CONTROL',size:'1.5 mm²'});
 return {components:[
  c('g1','arduino-bench-supply',{dcVoltage:12}),
  c('pwm1','virtual-pwm-generator-v1',{dutyPercent:50,frequencyHz:1000}),
  c('h1','standard-light',{resistance:120})
 ],wires:[
  w('g1','P','pwm1','V+'),w('pwm1','GND','g1','M'),
  w('pwm1','OUT','h1','X1'),w('h1','X2','g1','M')
 ],junctions:[]};
}
function sample(p,now){
 const result=Solver.solve(p,defs,{now});
 const pwm=p.components.find(c=>c.id==='pwm1');
 const light=p.components.find(c=>c.id==='h1');
 assert.equal(result.blocked,false);
 assert.equal(result.shortCircuit,false);
 assert.equal(result.stable,true);
 return {high:!!pwm._pwmHigh,supply:!!pwm._pwmSupplyValid,on:!!light._active};
}
test('PWM1 has only electrical V+, GND, OUT pins, not a mechanical SHAFT',()=>{
 const d=defs['virtual-pwm-generator-v1'];
 assert.equal(d.kind,'pwm-generator');
 assert.deepEqual(d.pins.map(p=>p.id).sort(),['GND','OUT','V+']);
 assert.ok(d.pins.every(p=>!p.mechanical&&p.signalType!=='MECH'));
});
test('native PWM1 OUT drives a connected load at 0, 50 and 100 percent duty',()=>{
 const p=makeCircuit(),pwm=p.components.find(c=>c.id==='pwm1');
 assert.deepEqual(sample(p,0),{high:true,supply:true,on:true});
 assert.deepEqual(sample(p,.75),{high:false,supply:true,on:false});
 pwm.dutyPercent=0;
 assert.deepEqual(sample(p,0),{high:false,supply:true,on:false});
 pwm.dutyPercent=100;
 assert.deepEqual(sample(p,.75),{high:true,supply:true,on:true});
});
test('a disconnected PWM1 V+, GND or OUT does not energize the load',()=>{
 for(const [a,b] of [['g1','pwm1'],['pwm1','g1'],['pwm1','h1']]){
  const p=makeCircuit();
  p.components.find(c=>c.id==='pwm1').dutyPercent=100;
  p.wires=p.wires.filter(w=>!(w.from.c===a&&w.to.c===b));
  const state=sample(p,0);
  assert.equal(state.on,false,a+'>'+b);
  if(b!=='h1')assert.equal(state.supply,false);
 }
});
