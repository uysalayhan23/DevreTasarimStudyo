'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Arduino=require('../dist/arduino-runtime.js'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-05'];
const part=(p,id)=>p.components.find(c=>c.id===id);
function sample(t,opts={}){
 const p=JSON.parse(JSON.stringify(lesson.project)),s=part(p,'s1');
 s.arduinoValue=t;
 if(Object.hasOwn(opts,'supplyV'))part(p,'ps').dcVoltage=opts.supplyV;
 if(opts.openPin)p.wires=p.wires.filter(w=>![w.from,w.to].some(e=>e.c==='s1'&&e.p===opts.openPin));
 const r=Sim.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
 for(let i=0;i<15;i++)Arduino.tick(p,defs,{now:5*i});
 assert.equal(part(p,'u1')._arduinoError||'','');
 return {p,r,s,u:part(p,'u1'),adc:part(p,'u1')._arduinoRuntime.vars.adc,
  volts:part(p,'u1')._arduinoRuntime.vars.voltage,
  tempC:part(p,'u1')._arduinoRuntime.vars.tempC};
}
test('SC24 existing 5 actual catalog terminal paths unchanged, only LM35 opts into the voltage model',()=>{
 assert.equal(L.lessons.length,1655);assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.components.length,3);assert.equal(lesson.project.wires.length,5);
 assert.equal(lesson.steps.length,5);assert.equal(part(lesson.project,'ps').dcVoltage,5);
 assert.equal(part(lesson.project,'s1').mq07Lm35Model,true);
 assert.match(part(lesson.project,'u1').arduinoSketch,/analogRead\(A0\)/);
 for(const [a,ap,b,bp] of [
 ['ps','P','s1','VCC'],['ps','M','s1','GND'],['ps','P','u1','5V'],
 ['ps','M','u1','GND'],['s1','AO','u1','A0']]){
   assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
   assert.ok(defs[part(lesson.project,a).typeId].pins.some(pin=>pin.id===ap));
   assert.ok(defs[part(lesson.project,b).typeId].pins.some(pin=>pin.id===bp));
 }
 for(const key of ['physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance'])
   assert.equal(lesson.pedagogyReview[key],false);
});
test('SC24 native Arduino A0 10-bit analogRead at 0,25,50,100,125 C',()=>{
 for(const t of [0,25,50,100,125]){const x=sample(t),want=Math.round(t*.01/5*1023);
  assert.equal(x.adc,want);assert.equal(x.s._mq07Lm35SupplyOk,true);
  assert.equal(x.s._mq07Lm35OutputV,t*.01);
  assert.equal(x.s._mq07Lm35AnalogV,t*.01);
  assert.ok(Math.abs(x.tempC-t)<.3);
 }
});
test('SC24 missing supply, ground, signal, or invalid source voltage fails closed',()=>{
 for(const options of [{openPin:'VCC'},{openPin:'GND'},{openPin:'AO'},{supplyV:0},{supplyV:4}]){
  const x=sample(25,options);
  assert.equal(x.adc,0);assert.equal(x.tempC,0);
  if(options.openPin!=='AO'){
    assert.equal(x.s._mq07Lm35OutputV,0);
    assert.equal(x.s._mq07Lm35SupplyOk,false);
  }
 }
});
test('SC11-SC23 and other Arduino sensors retain canonical acceptance states',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 for(let n=1;n<=4;n++)assert.ok(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')]?.project);
 assert.equal(L.byId['sensor-analog-apps-src-01'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-02'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-03'].project.components.length,6);
 assert.equal(L.byId['sensor-analog-apps-src-04'].project.components.length,3);
});
