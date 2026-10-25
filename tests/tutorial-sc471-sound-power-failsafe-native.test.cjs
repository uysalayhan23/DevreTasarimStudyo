'use strict';
// SC471 uses the actual Arduino sketch and D2/D9 graph; no mocked sensor/buzzer.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Arduino=require('../dist/arduino-runtime.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=p=>JSON.parse(JSON.stringify(p));
const lesson=L.byId['sensor-analog-apps-outline-053'],part=(p,id)=>p.components.find(c=>c.id===id);
const expected=[false,false,true,true,false,false];
function trace(edit=()=>{},value=(now)=>now>=40&&now<80?800:120){
 const p=clone(lesson.project);edit(p);const out=[];
 for(let now=0;now<=100;now+=20){
  part(p,'s1').arduinoValue=value(now);Arduino.tick(p,defs,{now});
  assert.equal(part(p,'u1')._arduinoError||'','','sketch error at '+now);
  out.push(!!part(p,'bz')._active);
 }
 return {p,out};
}
function remove(p,a,ap,b,bp){
 const n=p.wires.length;
 p.wires=p.wires.filter(w=>!(w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
 assert.equal(p.wires.length,n-1,'expected exact wire '+a+'/'+ap+'>'+b+'/'+bp);
}
test('SC471 actual sensor D2 input and Arduino D9 buzzer respond OFF ON OFF',()=>{
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.wires.length,8);
 assert.match(part(lesson.project,'u1').arduinoSketch,/digitalRead\(2\)/);
 assert.match(part(lesson.project,'u1').arduinoSketch,/digitalWrite\(9,/);
 const {p,out}=trace();assert.deepEqual(out,expected);
 assert.equal(part(p,'s1')._sc471SoundPowered,true);
 assert.notEqual(lesson.pedagogyReview.physicalAcceptance,true);
 assert.notEqual(lesson.pedagogyReview.windowsVisualAcceptance,true);
});
test('SC471 VCC and common GND broken: injected loud sensor cannot drive buzzer',()=>{
 for(const [a,ap,b,bp] of [['ps','P','s1','VCC'],['ps','M','s1','GND']]){
  const {p,out}=trace(p=>remove(p,a,ap,b,bp));
  assert.deepEqual(out,[false,false,false,false,false,false],a+' missing');
  assert.equal(part(p,'s1')._sc471SoundPowered,false);
 }
});
test('SC471 wrong 12 V supply and invalid sensor sample both fail closed',()=>{
 const wrong=trace(p=>{part(p,'ps').dcVoltage=12});
 assert.deepEqual(wrong.out,[false,false,false,false,false,false]);
 assert.equal(part(wrong.p,'s1')._sc471SoundPowered,false);
 const invalid=trace(()=>{},()=>NaN);
 assert.deepEqual(invalid.out,[false,false,false,false,false,false]);
});
test('SC471 independently broken DO→D2 and D9→SIG cannot sound buzzer',()=>{
 for(const [a,ap,b,bp] of [['s1','DO','u1','D2'],['u1','D9','bz','SIG']]){
  const {out}=trace(p=>remove(p,a,ap,b,bp));
  assert.deepEqual(out,[false,false,false,false,false,false],a+'>'+b);
 }
});
test('SC468–470 reference boards and SC478–482 physical acceptance gates stay untouched',()=>{
 assert.equal(L.lessons.length,1655);
 for(const index of [467,468,469]){
  const l=L.lessons[index];assert.equal(l.kind,'quiz');assert.equal(l.project.wires.length,0);
  assert.equal(l.project.referenceOnly,true);
 }
 for(const index of [477,478,479,480,481]){
  const l=L.lessons[index];assert.equal(l.kind,'wiring');
  assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
  assert.notEqual(l.pedagogyReview?.windowsVisualAcceptance,true);
 }
});