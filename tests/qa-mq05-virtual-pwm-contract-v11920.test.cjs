'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {evaluate}=require('../dist/mq05-virtual-pwm-contract.js');
const base={dutyPercent:50,frequencyHz:1000,nowMs:0,supplyV:12,connected:true,gatePathIntact:true,powerPathIntact:true,mosfetChannelClosed:true};
function check(change){return evaluate({...base,...change})}
test('duty 0/50/100: deterministic gate timing with no invented RPM',()=>{
 for(const duty of [0,50,100]){
  const start=check({dutyPercent:duty,nowMs:0});
  const later=check({dutyPercent:duty,nowMs:.75});
  assert.equal(start.valid,true);
  assert.equal(start.gateHigh,duty!==0);
  assert.equal(later.gateHigh,duty===100);
  assert.equal(start.speedRpm,null);
  assert.equal(start.averageAppliedV,null);
  assert.equal(start.idealDutyAverageV,12*duty/100);
 }
});
test('PWM repeats with period and preserves deterministic phase',()=>{
 assert.equal(check({nowMs:.25}).gateHigh,true);
 assert.equal(check({nowMs:1.25}).gateHigh,true);
 assert.equal(check({nowMs:.75}).gateHigh,false);
 assert.equal(check({nowMs:1.75}).gateHigh,false);
});
test('open gate or motor power path must fail closed',()=>{
 for(const changes of [{connected:false},{gatePathIntact:false},{powerPathIntact:false}]){
  const v=check(changes);assert.equal(v.valid,false);assert.equal(v.reason,'OPEN_PATH');assert.equal(v.motorEnabled,false);
 }
});
test('invalid duty/frequency/time/supply never produces a speed',()=>{
 for(const changes of [{dutyPercent:-1},{dutyPercent:101},{dutyPercent:NaN},{frequencyHz:0},{frequencyHz:-10},{nowMs:-1},{supplyV:0}]){
  const v=check(changes);assert.equal(v.valid,false);assert.equal(v.speedRpm,null);
 }
});
test('gate command alone cannot claim a conducting MOSFET or physical motor speed',()=>{
 const v=check({mosfetChannelClosed:false});
 assert.equal(v.valid,true);assert.equal(v.gateHigh,true);assert.equal(v.motorEnabled,false);
 assert.equal(v.speedRpm,null);assert.equal(v.physicalAcceptance,false);
});
