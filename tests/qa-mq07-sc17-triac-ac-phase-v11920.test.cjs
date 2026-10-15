'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Sim=require('../dist/simulation.js'),Materials=require('../dist/materials.js');
const curriculum=QA.curriculum(),defs=QA.catalog();
const lesson=curriculum.byId['electronic-switching-src-17'];
const clone=o=>JSON.parse(JSON.stringify(o)),component=(p,id)=>p.components.find(c=>c.id===id);
const sample=(p,deg)=>Sim.solveSc17TriacDimmerCycle(p,defs,{
 now:deg/(Number(component(p,'ac1').frequencyHz)*.36)});
test('SC17 has real ST BTA16 and only low-voltage isolated virtual AC source',()=>{
 assert.equal(lesson.kind,'wiring');const p=lesson.project;
 assert.equal(p.wires.length,7);assert.equal(p.components.length,5);
 assert.equal(component(p,'q1').typeId,'bta16-600b-triac');
 assert.equal(component(p,'ac1').typeId,'virtual-isolated-ac-12v');
 assert.equal(component(p,'trg1').typeId,'virtual-ac-triac-trigger-v1');
 assert.equal(component(p,'rg').typeId,'resistor');
 assert.equal(component(p,'h1').typeId,'standard-light');
 const triac=defs['bta16-600b-triac'];
 assert.equal(triac.kind,'triac');
 assert.deepEqual(Array.from(triac.pins,x=>x.id),['MT1','MT2','G']);
 assert.deepEqual(Array.from(triac.pins,x=>x.physicalPin),[1,2,3]);
 assert.equal(triac.realPackage.type,'TO-220AB Insulated');
 assert.equal(triac.manufacturerGeometryAccepted,false);
 assert.deepEqual(Array.from(defs['virtual-ac-triac-trigger-v1'].pins,p=>p.id),['AC','RET','OUT']);
 assert.equal(defs['virtual-ac-triac-trigger-v1'].kind,'ac-triac-trigger');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 for(const w of p.wires)for(const end of [w.from,w.to]){
  const c=component(p,end.c);
  assert.ok(c,end.c);assert.ok(defs[c.typeId],c.typeId);
  assert.ok(defs[c.typeId].pins.some(x=>x.id===end.p),end.c+'/'+end.p);
 }
});
test('BTA16 insulated front and bipolar driver have no motor shaft',()=>{
 const triac=Materials.markup(defs['bta16-600b-triac'],{id:'q1'});
 const driver=Materials.markup(defs['virtual-ac-triac-trigger-v1'],{id:'trg1',triggerAngleDeg:90});
 assert.match(triac,/data-real-package="TO-220AB-INSULATED"/);
 assert.match(triac,/data-front-view="orthographic"/);
 for(const pin of ['MT1','MT2','G'])assert.ok(triac.includes('>'+pin+'</text>'));
 assert.match(driver,/TRIAC PHASE DRIVER/);
 assert.ok(!/SHAFT|motion-indicator/i.test(triac+driver));
});
test('SC17 fires positive 90° half, maintains conduction, resets on AC zero crossing',()=>{
 const p=clone(lesson.project);
 for(const deg of [0,30,89]){
  const x=sample(p,deg);assert.equal(x.verified,true);assert.equal(x.conducting,false);
  assert.equal(x.loadV,0);
 }
 const fired=sample(p,90);
 assert.equal(fired.half,'positive');assert.equal(fired.gateV,5);
 assert.ok(fired.loadV>0);assert.ok(fired.currentA>0);
 const held=sample(p,130);
 assert.equal(held.gateV,0);assert.ok(held.loadV>0);
 for(const deg of [179,180,225,269]){
  const x=sample(p,deg);assert.equal(x.conducting,false);assert.equal(x.loadV,0);
 }
 assert.equal(sample(p,180).zeroCrossing,true);
});
test('SC17 fires negative 270° half with reversed gate and current signs',()=>{
 const p=clone(lesson.project);
 for(const deg of [181,225,269])assert.equal(sample(p,deg).loadV,0);
 const on=sample(p,270);
 assert.equal(on.half,'negative');assert.equal(on.gateV,-5);
 assert.ok(on.loadV<0);assert.ok(on.currentA<0);
 const held=sample(p,315);
 assert.equal(held.gateV,0);assert.ok(held.loadV<0);
 assert.equal(sample(p,359).loadV,0);
 assert.equal(sample(p,360).zeroCrossing,true);
 const again=sample(p,450);assert.equal(again.gateV,5);assert.ok(again.loadV>0);
});
test('SC17 RMS comes from signed 360° waveform and decreases with phase angle',()=>{
 const p=clone(lesson.project),values=[];
 for(const angle of [0,45,90,135,170]){
  component(p,'trg1').triggerAngleDeg=angle;
  const r=sample(p,90);
  assert.equal(r.verified,true);
  assert.equal(r.result.stable,true);assert.equal(r.result.shortCircuit,false);
  values.push(r.rmsV);
 }
 for(let i=1;i<values.length;i++)assert.ok(values[i]<values[i-1],'non-monotonic phase dimmer: '+i);
 assert.ok(values[0]>10&&values[0]<=12);
 assert.equal(values[4],0,'late trigger cannot meet virtual holding threshold');
 component(p,'trg1').triggerAngleDeg=90;sample(p,90);
 const wave=component(p,'h1')._sc17Wave;
 assert.equal(wave.length,36);
 assert.ok(wave.some(x=>x.loadV>0));
 assert.ok(wave.some(x=>x.loadV<0));
 assert.ok(wave.some(x=>x.gateV>0));
 assert.ok(wave.some(x=>x.gateV<0));
 const signedRms=Math.sqrt(wave.reduce((sum,x)=>sum+x.loadV*x.loadV,0)/wave.length);
 assert.ok(Math.abs(signedRms-component(p,'h1')._sc17RmsV)<0.4,'stored waveform approximately matches finer RMS');
});
test('SC17 broken AC, gate reference, resistor, MT1 or MT2 wire fails closed',()=>{
 const wires=lesson.project.wires;
 assert.equal(wires.length,7);
 for(const target of wires){
  const p=clone(lesson.project);
  p.wires=p.wires.filter(w=>!(w.from.c===target.from.c&&w.from.p===target.from.p&&
    w.to.c===target.to.c&&w.to.p===target.to.p));
  const r=sample(p,90);
  assert.equal(r.verified,false,target.from.c+'/'+target.from.p+' → '+target.to.c+'/'+target.to.p);
  assert.equal(r.rmsV,0);assert.equal(r.loadV,0);
  assert.equal(component(p,'h1')._active,false);
 }
});
test('SC17 unsafe, invalid or disabled virtual settings fail closed',()=>{
 const invalid=[
  p=>component(p,'ac1').sourceEnabled=false,
  p=>component(p,'trg1').triggerEnabled=false,
  p=>component(p,'ac1').rmsVoltage=230,
  p=>component(p,'ac1').rmsVoltage='12',
  p=>component(p,'ac1').frequencyHz=0,
  p=>component(p,'trg1').triggerAngleDeg=-1,
  p=>component(p,'trg1').triggerAngleDeg='90',
  p=>component(p,'trg1').pulseWidthDeg=0,
  p=>component(p,'h1').resistance=0,
  p=>component(p,'rg').resistance=0,
  p=>component(p,'q1').mq07VirtualHoldingCurrentA=-1
 ];
 for(const bad of invalid){
  const p=clone(lesson.project);bad(p);
  const r=sample(p,90);
  assert.equal(r.verified,false);assert.equal(r.rmsV,0);
  assert.equal(component(p,'h1')._active,false);
 }
});
test('SC17 STOP clears phase, signed current, output RMS and wave cache',()=>{
 const p=clone(lesson.project);sample(p,270);
 assert.ok(component(p,'h1')._sc17Wave.length);
 Sim.clear(p);
 assert.equal(component(p,'q1')._sc17CurrentA,undefined);
 assert.equal(component(p,'h1')._sc17RmsV,undefined);
 assert.equal(component(p,'trg1')._sc17Wave,undefined);
});
test('SC11 through SC16 remain named and have their specialized lesson contracts',()=>{
 for(const n of [11,12,13,14,15,16]){
  const l=curriculum.byId['electronic-switching-src-'+n];
  assert.ok(l,'missing predecessor SC'+n);
  assert.equal(l.kind,'wiring');
  assert.ok(l.project.wires.length>0,'unwired predecessor SC'+n);
 }
 assert.equal(component(curriculum.byId['electronic-switching-src-11'].project,'pwm1').typeId,'virtual-pwm-generator-v1');
 assert.equal(component(curriculum.byId['electronic-switching-src-12'].project,'q1').typeId,'fga25n120antd-igbt');
 assert.equal(component(curriculum.byId['electronic-switching-src-16'].project,'q1').typeId,'bta16-600b-triac');
});
