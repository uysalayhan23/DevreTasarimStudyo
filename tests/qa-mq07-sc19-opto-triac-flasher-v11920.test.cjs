'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['electronic-switching-src-19'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
const sample=(p,now)=>Native.solveSc19OptoTriacCycle(p,defs,{now});
test('SC19 uses actual optotriac, BTA16 and a wired, isolated virtual flasher',()=>{
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project;
 assert.equal(p.wires.length,14);
 assert.equal(p.components.length,10);
 assert.equal(part(p,'u1').typeId,'moc3021-opto-triac');
 assert.equal(part(p,'q1').typeId,'bta16-600b-triac');
 assert.equal(part(p,'t1').typeId,'virtual-opto-flasher-timer-v1');
 assert.equal(part(p,'ac1').typeId,'virtual-isolated-ac-12v');
 assert.deepEqual(Array.from(defs['moc3021-opto-triac'].pins,p=>p.id),['1','2','4','6']);
 assert.deepEqual(Array.from(defs['bta16-600b-triac'].pins,p=>p.id),['MT1','MT2','G']);
 assert.deepEqual(Array.from(defs['virtual-opto-flasher-timer-v1'].pins,p=>p.id),['V+','GND','OUT']);
 assert.ok(defs['moc3021-opto-triac'].pins.every(pin=>pin.mechanical!==true));
 for(const wire of p.wires)for(const end of [wire.from,wire.to]){
  const component=part(p,end.c);
  assert.ok(component,end.c);
  assert.ok(defs[component.typeId].pins.some(x=>x.id===end.p),end.c+'/'+end.p);
 }
 assert.equal(lesson.pedagogyReview.virtualOptoTriac.softwareIsolationOnly,true);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});

test('SC19 timer ON drives LED and both AC half-waves; natural zero crossings release TRIAC',()=>{
 const p=clone(lesson.project);
 for(const [ms,half,positive] of [[5,'positive',true],[15,'negative',false],
    [125,'positive',true],[135,'negative',false]]){
  const x=sample(p,ms);
  assert.equal(x.verified,true);
  assert.equal(x.result.stable,true);
  assert.equal(x.result.shortCircuit,false);
  assert.equal(x.isolated,true);
  assert.equal(x.ledOn,true);
  assert.equal(x.half,half);
  assert.equal(x.triacConducting,true);
  assert.equal(x.loadV>0,positive);
  assert.equal(x.currentA>0,positive);
  assert.ok(x.rmsV>9);
 }
 for(const ms of [0,10,20,30]){
  const z=sample(p,ms);
  assert.equal(z.triacConducting,false);
  assert.equal(z.loadV,0);
  assert.equal(z.zeroCrossing,true);
 }
});
test('SC19 flashing timer has OFF state and a new ON pulse; RMS is waveform-derived',()=>{
 const p=clone(lesson.project);
 const high=sample(p,125),low=sample(p,300),again=sample(p,625);
 assert.equal(high.ledOn,true);assert.ok(high.rmsV>9);
 assert.equal(low.ledOn,false);assert.equal(low.rmsV,0);
 assert.equal(low.triacConducting,false);
 assert.equal(again.ledOn,true);assert.ok(again.rmsV>9);
 part(p,'t1').dutyPercent=0;
 assert.equal(sample(p,125).rmsV,0);
 part(p,'t1').dutyPercent=100;
 assert.ok(sample(p,300).rmsV>9);
 part(p,'t1').frequencyHz=1;
 part(p,'t1').dutyPercent=50;
 assert.equal(sample(p,600).rmsV,0);
 assert.ok(sample(p,125).rmsV>9);
});
test('SC19 on-state TRIAC holds until zero crossing if LED switches OFF midway through a half-wave',()=>{
 const p=clone(lesson.project);
 part(p,'t1').dutyPercent=47; // 235 ms switch-off, during negative half 230–240 ms
 const afterOff=sample(p,237);
 assert.equal(afterOff.ledOn,false);
 assert.equal(afterOff.half,'negative');
 assert.equal(afterOff.triacConducting,true,'main current persists until zero');
 assert.ok(afterOff.loadV<0);
 const afterCross=sample(p,245);
 assert.equal(afterCross.triacConducting,false);
});
test('SC19 breaks in each of fourteen electrical connections fail closed',()=>{
 for(let i=0;i<lesson.project.wires.length;i++){
  const p=clone(lesson.project);
  const wire=p.wires.splice(i,1)[0];
  const x=sample(p,125);
  assert.equal(x.verified,false,'wire '+wire.from.c+'/'+wire.from.p);
  assert.equal(x.rmsV,0);
  assert.equal(part(p,'h1')._active,false);
 }
});
test('SC19 direct or resistor-mediated DC/AC bridging invalidates isolation',()=>{
 for(const [from,to] of [
  [{c:'g1',p:'M'},{c:'ac1',p:'RET'}],
  [{c:'g1',p:'P'},{c:'u1',p:'6'}],
  [{c:'rin',p:'1'},{c:'rdrive',p:'1'}]
 ]){
  const p=clone(lesson.project);
  p.wires.push({from,to,role:'SIGNAL'});
  const x=sample(p,125);
  assert.equal(x.isolated,false);
  assert.equal(x.verified,false);
  assert.equal(x.rmsV,0);
 }
});
test('SC19 invalid, disabled or insufficient LED/gate drive remains OFF',()=>{
 const invalid=[
  p=>part(p,'g1').dcVoltage=230,
  p=>part(p,'t1').frequencyHz='2',
  p=>part(p,'t1').dutyPercent=-1,
  p=>part(p,'ac1').rmsVoltage=230,
  p=>part(p,'ac1').sourceEnabled=false,
  p=>part(p,'t1').timerEnabled=false,
  p=>part(p,'q1').mq07VirtualHoldingCurrentA=-1,
  p=>part(p,'rin').resistance=0,
  p=>part(p,'rref').resistance=0
 ];
 for(const mutate of invalid){
  const p=clone(lesson.project);mutate(p);
  const x=sample(p,125);
  assert.equal(x.verified,false);
  assert.equal(x.rmsV,0);
 }
 const noLed=clone(lesson.project);
 part(noLed,'rin').resistance=100000;
 assert.equal(sample(noLed,125).rmsV,0,'insufficient LED current');
 const noGate=clone(lesson.project);
 part(noGate,'rdrive').resistance=100000;
 assert.equal(sample(noGate,125).rmsV,0,'insufficient output trigger current');
});
test('SC19 STOP clears all transient optical and load waveform fields',()=>{
 const p=clone(lesson.project);
 sample(p,125);
 assert.ok(part(p,'h1')._sc19Wave.length>0);
 Native.clear(p);
 assert.equal(part(p,'h1')._sc19RmsV,undefined);
 assert.equal(part(p,'q1')._sc19Conducting,undefined);
 assert.equal(part(p,'u1')._sc19Isolated,undefined);
 assert.equal(part(p,'t1')._sc19TimerHigh,undefined);
});
test('SC19 has dedicated orthographic component faces without motor shafts',()=>{
 const Materials=require('../dist/materials.js');
 for(const id of ['moc3021-opto-triac','virtual-opto-flasher-timer-v1']){
  const html=Materials.markup(defs[id],{id});
  assert.ok(html.length>300);
  assert.ok(!/SHAFT|motion-indicator/i.test(html));
  assert.ok(html.includes(id==='moc3021-opto-triac'?'MOC3021':'LED FLASH TIMER'));
 }
});
