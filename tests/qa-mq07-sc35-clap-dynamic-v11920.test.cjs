'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const R=require('../dist/arduino-runtime.js'),Lib=require('../dist/arduino-library.js');
const defs=Object.fromEntries(Lib.components.map(x=>[x.id,x]));
const clone=x=>JSON.parse(JSON.stringify(x));
test('MQ07 SC35 real Arduino runtime sound threshold OFF ON OFF',()=>{
 const l=QA.curriculum().byId['sensor-analog-apps-src-16'],p=clone(l.project);
 const u=p.components.find(x=>x.id==='u1'),s=p.components.find(x=>x.id==='s1'),b=p.components.find(x=>x.id==='bz');
 assert.match(u.arduinoSketch,/digitalRead\(2\)/);
 assert.match(u.arduinoSketch,/digitalWrite\(9,/);
 const result=[];
 for(const [now,value] of [[0,120],[20,120],[40,800],[60,800],[80,120],[100,120]]){
  s.arduinoValue=value;R.tick(p,defs,{now});
  assert.equal(u._arduinoError||'','');
  result.push(!!b._active);
 }
 assert.deepEqual(result,[false,false,true,true,false,false]);
 assert.equal(l.pedagogyReview.mq07ClapCircuit.programExecutionVerified,true);
 assert.equal(l.pedagogyReview.mq07ClapCircuit.actualDbCalibrationVerified,false);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});
