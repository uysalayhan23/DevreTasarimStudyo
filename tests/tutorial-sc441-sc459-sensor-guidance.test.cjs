'use strict';
// Target-only native virtual sensor measurement and broken-terminal regression.
// Physical calibration, Windows/3D visuals, and safety acceptance remain pending.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js'),Arduino=require('../dist/arduino-runtime.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
const idList=['sensor-analog-apps-outline-029','electronic-component-basics-outline-025',
 'sensor-analog-apps-outline-030','sensor-analog-apps-outline-036','sensor-analog-apps-outline-046'];
const part=(p,id)=>p.components.find(c=>c.id===id);
function examine(id,update=()=>{},remove=null){
 const p=clone(L.byId[id].project);update(p);
 if(remove){const [id,pin]=remove;p.wires=p.wires.filter(w=>!(w.from.c===id&&w.from.p===pin))}
 const out=Native.solve(p,defs,{now:1000});
 assert.ok(out.stable&&!out.blocked&&!out.shortCircuit&&!out.oscillating,id+' native stable');
 if(id.includes('outline-030')||id.includes('outline-036'))
  for(let t=0;t<90;t+=5)Arduino.tick(p,defs,{now:t});
 return p;
}
test('SC441 K type mV changes with hot junction; open sensor is rejected',()=>{
 const id=idList[0];
 const a=examine(id,p=>part(p,'tc').temperature=25);
 const b=examine(id,p=>part(p,'tc').temperature=100);
 const c=examine(id,p=>part(p,'tc').temperature=200);
 assert.equal(part(a,'ctl')._controller.pv,25);
 assert.equal(part(b,'ctl')._controller.pv,100);
 assert.equal(part(c,'ctl')._controller.pv,200);
 assert.ok(Math.abs(part(b,'v1')._meter.value*1000-3.095987864)<.00001);
 const broken=examine(id,p=>part(p,'tc').temperature=100,['tc','+']);
 assert.ok(part(broken,'ctl')._controller.error);
});
test('SC442 PT100 virtual PV matches temperature and missing third wire fails',()=>{
 const id=idList[1];for(const temperature of [0,25,100]){
  const p=examine(id,p=>part(p,'pt').temperature=temperature);
  assert.equal(part(p,'ctl')._controller.pv,temperature);
 }
 const broken=examine(id,p=>part(p,'pt').temperature=100,['pt','B2']);
 assert.ok(part(broken,'ctl')._controller.error);
});
test('SC444 LM35 ADC numeric conversion and disconnected A0',()=>{
 const id=idList[2];
 for(const [temp,adc] of [[0,0],[25,51],[50,102],[100,205]]){
  const p=examine(id,p=>part(p,'s1').arduinoValue=temp);
  assert.equal(part(p,'u1')._arduinoRuntime.vars.adc,adc);
 }
 const broken=examine(id,p=>part(p,'s1').arduinoValue=50,['s1','AO']);
 assert.equal(part(broken,'u1')._arduinoRuntime.vars.adc,0);
});
test('SC449 Reed real D2 numeric transition and disconnected DO',()=>{
 const id=idList[3];for(const [mag,expected] of [[0,0],[64,0],[65,1],[80,1]]){
  const p=examine(id,p=>part(p,'s1').reedMagnet=mag);
  assert.equal(part(p,'u1')._arduinoRuntime.vars.reed,expected);
 }
 const broken=examine(id,p=>part(p,'s1').reedMagnet=80,['s1','DO']);
 assert.equal(part(broken,'u1')._arduinoRuntime.vars.reed,0);
});
test('SC459 TX11 differential load conversion and missing SIG+ fail closed',()=>{
 const id=idList[4];for(const kg of [0,250,500,1000]){
  const p=examine(id,p=>part(p,'lc').loadWeight=kg);
  assert.equal(part(p,'tx')._instrument.error,'');
  assert.equal(part(p,'tx')._instrument.weight,kg);
 }
 const broken=examine(id,p=>part(p,'lc').loadWeight=500,['lc','SIG+']);
 assert.ok(part(broken,'tx')._instrument.error);
});
test('no false COMPLETE: source wiring and review/physical calibration locks remain',()=>{
 assert.equal(L.lessons.length,1655);
 for(const id of idList){
  const l=L.byId[id],review=l.pedagogyReview;
  assert.equal(l.kind,'wiring');assert.equal(l.quiz.answer,0);
  assert.equal(l.quiz.options.length,3);assert.ok(l.beginnerSteps.length===5);
  assert.ok(l.beginnerSteps.at(-1).includes('PASS'));
  for(const k of ['nativeDynamicAcceptance','sensorCalibrationAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.notEqual(review[k],true,id+' '+k);
 }
 for(const id of ['sensor-analog-apps-outline-023','sensor-analog-apps-outline-024'])
  assert.equal(L.byId[id].pedagogyReview.titleTopologyStatus,'REVIEW');
});
