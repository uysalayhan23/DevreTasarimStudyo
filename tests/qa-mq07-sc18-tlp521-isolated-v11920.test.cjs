'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js'),Arduino=require('../dist/arduino-library.js');
const curriculum=QA.curriculum(),defs=QA.catalog();
const lesson=curriculum.byId['electronic-switching-src-18'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
const sample=(p,on=false)=>{part(p,'sg').state=on;return Simulation.solveSc18OptocouplerCycle(p,defs,{now:1000})};
const broken=(p,edge)=>{p.wires=p.wires.filter(w=>!(w.from.c===edge.from.c&&w.from.p===edge.from.p&&
 w.to.c===edge.to.c&&w.to.p===edge.to.p))};
test('SC18 TLP521-1 has isolated input and output, correct physical DIP-4 pins and 7 wires',()=>{
 assert.equal(lesson.kind,'wiring');
 const p=lesson.project;assert.equal(p.wires.length,7);assert.equal(p.components.length,6);
 const d=defs['arduino-tlp521-1'];assert.equal(d.arduinoRole,'opto');
 assert.equal(part(p,'u1').typeId,'arduino-tlp521-1');
 assert.deepEqual(Array.from(d.pins,x=>x.id),['1','2','4','3']);
 assert.deepEqual(Array.from(d.pins,x=>x.physicalPin),[1,2,4,3]);
 assert.equal(d.realPackage.type,'PDIP');
 assert.equal(d.realPackage.orthographic,true);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.virtualOpto.physicalIsolationTested,false);
 for(const w of p.wires)for(const point of [w.from,w.to]){
  const comp=part(p,point.c);assert.ok(comp,point.c);
  assert.ok(defs[comp.typeId],comp.typeId);
  assert.ok(defs[comp.typeId].pins.some(pin=>pin.id===point.p),point.c+'/'+point.p);
 }
});
test('SC18 TLP521-1 catalog front labels LED A/K, transistor E/C, not a motor',()=>{
 const d=defs['arduino-tlp521-1'],front=Arduino.art(d,{id:'u1'});
 assert.ok(typeof front==='string'&&front.length>150);
 assert.match(front,/TLP521/i);
 assert.match(front,/orthographic/);
 assert.ok(!/SHAFT|motion-indicator/i.test(front));
});
test('SC18 LED input OFF → ON → OFF switches photo transistor on independent output supply',()=>{
 const p=clone(lesson.project);
 let x=sample(p,false);
 assert.equal(x.verified,true);assert.equal(x.isolated,true);
 assert.equal(x.ledOn,false);assert.equal(x.transistorOn,false);
 assert.equal(x.ledCurrentA,0);assert.equal(x.collectorCurrentA,0);
 assert.equal(x.collectorVoltageV,5);
 x=sample(p,true);
 assert.equal(x.verified,true);assert.equal(x.ledOn,true);assert.equal(x.transistorOn,true);
 assert.ok(Math.abs(x.ledCurrentA-.0038)<1e-10);
 assert.ok(x.collectorCurrentA>0&&x.collectorCurrentA<.0038);
 assert.ok(Math.abs(x.collectorVoltageV-.2)<1e-9);
 x=sample(p,false);
 assert.equal(x.ledOn,false);assert.equal(x.transistorOn,false);
 assert.equal(x.collectorVoltageV,5);
});
test('SC18 varying illustrative virtual CTR changes collector current; it is not calibrated',()=>{
 const p=clone(lesson.project),currents=[];
 for(const ctr of [.1,.25,.5,1]){
  part(p,'u1').mq07VirtualCtr=ctr;
  const x=sample(p,true);
  assert.equal(x.verified,true);
  currents.push(x.collectorCurrentA);
 }
 assert.ok(currents[0]<currents[1]);assert.ok(currents[1]<currents[2]);
 assert.ok(currents[2]<=currents[3]);
 assert.equal(lesson.pedagogyReview.virtualOpto.manufacturerCtrCalibrated,false);
});
test('SC18 seven disconnected LED or output wires fail closed',()=>{
 for(const wire of lesson.project.wires){
  const p=clone(lesson.project);
  broken(p,wire);const x=sample(p,true);
  assert.equal(x.verified,false,wire.from.c+'/'+wire.from.p);
  assert.equal(x.transistorOn,false);
  assert.equal(x.collectorCurrentA,0);
 }
});
test('SC18 direct galvanic bridges between input and output are rejected',()=>{
 for(const bridge of [
  {from:{c:'g1',p:'M'},to:{c:'g2',p:'M'}},
  {from:{c:'g1',p:'P'},to:{c:'g2',p:'P'}},
  {from:{c:'u1',p:'1'},to:{c:'u1',p:'4'}}
 ]){
  const p=clone(lesson.project);p.wires.push(bridge);
  const x=sample(p,true);
  assert.equal(x.isolated,false);
  assert.equal(x.verified,false);
  assert.equal(x.collectorCurrentA,0);
 }
});
test('SC18 invalid, nonnumeric or unsupported virtual source/CTR values fail closed',()=>{
 const invalid=[
  p=>part(p,'g1').dcVoltage=230,
  p=>part(p,'g2').dcVoltage='5',
  p=>part(p,'rin').resistance=0,
  p=>part(p,'rout').resistance=0,
  p=>part(p,'u1').mq07VirtualCtr=-1,
  p=>part(p,'u1').mq07VirtualLedDropV=9,
  p=>part(p,'u1').mq07VirtualVceSatV=-1
 ];
 for(const apply of invalid){
  const p=clone(lesson.project);apply(p);
  const x=sample(p,true);
  assert.equal(x.verified,false);
  assert.equal(x.collectorCurrentA,0);
 }
});
test('SC18 STOP clears opto current and isolation transient state',()=>{
 const p=clone(lesson.project);
 assert.equal(sample(p,true).transistorOn,true);
 Simulation.clear(p);
 for(const key of ['_sc18LedCurrentA','_sc18CollectorCurrentA','_sc18CollectorVoltageV',
  '_sc18LedOn','_sc18TransistorOn','_sc18Isolated']){
  assert.equal(part(p,'u1')[key],undefined,key);
 }
 assert.equal(sample(p,false).transistorOn,false);
});
test('SC11–SC17 completed teaching contracts remain reachable',()=>{
 for(let n=11;n<=17;n++){
  const l=curriculum.byId['electronic-switching-src-'+n];
  assert.ok(l,'SC'+n);
  assert.equal(l.kind,'wiring','SC'+n);
  assert.ok(l.project.wires.length>0,'SC'+n);
 }
 assert.equal(part(curriculum.byId['electronic-switching-src-11'].project,'pwm1').typeId,'virtual-pwm-generator-v1');
 assert.equal(part(curriculum.byId['electronic-switching-src-12'].project,'q1').typeId,'fga25n120antd-igbt');
 assert.equal(part(curriculum.byId['electronic-switching-src-17'].project,'q1').typeId,'bta16-600b-triac');
});