'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {assess,Sensor,Sounder}=require('../scripts/qa-mq12-sonic-headroom-v11920.cjs');
test('at canonical 24V, nominal sounder minimum is 21.6V and drop-bound lower limit is 21.5V',()=>{
 const r=assess(24);
 assert.equal(r.minSounderV,21.6);
 assert.equal(r.guaranteedLowerBoundV,21.5);
 assert.ok(Math.abs(r.voltageMarginV+0.1)<1e-10);
 assert.equal(r.worstCaseSounderVoltageGuaranteed,false);
});
test('the apparent 28mA vs 100mA current headroom does not approve voltage and relay loading',()=>{
 const r=assess(24);assert.equal(Sensor.switchLimitMA,100);assert.equal(Sounder.maximumCurrentMA,28);
 assert.equal(r.currentLimitSufficient,true);assert.equal(r.extraRelayCoilCurrentVerified,false);
 assert.equal(r.physicallyApproved,false);
});
test('manufacturer supply boundaries and changed voltages are checked separately',()=>{
 assert.equal(assess(17).withinSensorSupply,false);
 assert.equal(assess(31).withinSensorSupply,false);
 assert.equal(assess(25).worstCaseSounderVoltageGuaranteed,true);
 assert.equal(assess(25).physicallyApproved,false);
});
test('physical terminal mapping and product acceptance remain REVIEW in every case',()=>{
 for(const v of [18,21,24,25,30]){
  const r=assess(v);assert.equal(r.actualWiringTerminalsVerified,false);
  assert.equal(r.physicallyApproved,false);assert.equal(r.acceptance,'REVIEW');
 }
});
