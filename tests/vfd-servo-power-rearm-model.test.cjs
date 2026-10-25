'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const V=require('../dist/v20.js'),H=require('../dist/hcfa-x2e.js');
// Scoped virtual drive-model regression; not a physical/3D acceptance test.
test('V20: panel and DI RUN held across supply failure require a fresh command',()=>{
 for(const panel of [true,false]){
  const c={};V.create(c);assert.equal(V.set(c,'P1040',50).ok,true);
  if(panel)V.action(c,'run');else{V.set(c,'P0700',2);V.set(c,'P0701',1)}
  const tick=(ms,voltage,command=true)=>V.tick(c,{voltage,di:[!panel&&command,false,false,false],ai:[0,0],motorConnected:true},ms);
  tick(0,230);assert.equal(tick(5000,230).hz,25);
  assert.equal(tick(6000,0).running,false);
  tick(7000,0,false); // release during blackout does not rearm.
  const held=tick(8000,230);assert.equal(held.running,false);assert.equal(held.powerRearmRequired,true);
  assert.equal(tick(9000,230).hz,0);
  if(panel)V.action(c,'stop');
  assert.equal(tick(10000,230,false).powerRearmRequired,false);
  if(panel)V.action(c,'run');
  assert.equal(tick(11000,230).hz,5);
 }
});
test('HCFA X2E: panel and DI Servo ON held across blackout cannot restart',()=>{
 for(const panel of [true,false]){
  const c={};H.config(c);H.set(c,'P00.01',1);H.set(c,'P03.03',600);
  if(panel)H.action(c,'servo');
  const tick=(ms,voltage,command=true)=>H.tick(c,{
   voltage,di:[!panel&&command,false,false,false,false,false,false,false],
   motorCompatible:true,motorConnected:true,encoderConnected:true},ms);
  tick(0,230);assert.equal(tick(1000,230).rpm,600);
  assert.equal(tick(2000,0).servoOn,false);
  tick(3000,0,false);
  const held=tick(4000,230);assert.equal(held.servoOn,false);assert.equal(held.rpm,0);
  assert.equal(held.powerRearmRequired,true);
  if(panel)H.action(c,'servo');
  assert.equal(tick(5000,230,false).powerRearmRequired,false);
  if(panel)H.action(c,'servo');
  assert.equal(tick(6000,230).rpm,600);
 }
});
test('uninterrupted V20 and HCFA normal START/STOP remain functional',()=>{
 const v={};V.create(v);V.set(v,'P1040',50);V.action(v,'run');
 const vt=ms=>V.tick(v,{voltage:230,di:[],ai:[0,0],motorConnected:true},ms);
 vt(0);assert.equal(vt(10000).hz,50);
 V.action(v,'stop');assert.equal(vt(20000).hz,0);
 V.action(v,'run');assert.equal(vt(25000).hz,25);
 const h={};H.config(h);H.set(h,'P00.01',1);H.set(h,'P03.03',600);H.action(h,'servo');
 const ht=ms=>H.tick(h,{voltage:230,di:[],motorCompatible:true,motorConnected:true,encoderConnected:true},ms);
 ht(0);assert.equal(ht(1000).rpm,600);
 H.action(h,'servo');assert.equal(ht(2000).servoOn,false);
 H.action(h,'servo');assert.equal(ht(3000).servoOn,true);
});
