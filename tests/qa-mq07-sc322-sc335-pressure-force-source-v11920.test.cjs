'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[["038","REED_ARDUINO_OUTLINE_NATIVE_UNVERIFIED",5,["arduino-bench-supply","arduino-reed","arduino-uno"]],["039","HALL_RELAY_OUTLINE_NATIVE_UNVERIFIED",7,["arduino-bench-supply","sensor-hall","coil-relay","contact-no","lamp-green"]],["040","NO_PRESSURE_TRANSDUCER_WIRING",0,["capacitor","resistor","tutorial-piezo","load-cell"]],["041","NO_CAPACITIVE_PRESSURE_SENSOR_MODEL",0,["capacitor","tutorial-concept"]],["042","NO_RESISTIVE_FORCE_SENSOR_MODEL",0,["resistor","tutorial-concept"]],["043","NO_PIEZORESISTIVE_PRESSURE_BRIDGE",0,["resistor","tutorial-concept"]],["044","NO_PIEZOELECTRIC_PRESSURE_CALIBRATION",0,["tutorial-piezo"]],["045","NO_STRAIN_GAUGE_ELEMENT_CALIBRATION",0,["load-cell","tutorial-concept"]],["046","NO_LOAD_CELL_MVV_WIRING",0,["load-cell","weighing-indicator"]],["047","PIEZO_IMPULSE_OUTLINE_NATIVE_UNVERIFIED",4,["tutorial-piezo","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"]],["048","LOAD_CELL_TX11_OUTLINE_NATIVE_UNVERIFIED",6,["arduino-bench-supply","load-cell","weighing-indicator"]],["049","OPTICAL_RELAY_OUTLINE_NATIVE_UNVERIFIED",7,["arduino-bench-supply","sensor-through-beam","coil-relay","contact-no","lamp-green"]],["050","NO_LDR_VOLTAGE_DIVIDER_WIRING",0,["ldr-gl5528"]],["electronic-component-basics-outline-028","NO_PHOTODIODE_BIAS_READOUT",0,["bpw34-photodiode","photoeye"]]];
for(const [suffix,reason,wires,types] of cases)test('SC322–335 '+suffix+' pressure/force source boundary',()=>{
 const id=suffix.startsWith('electronic-')?suffix:'sensor-analog-apps-outline-'+suffix;
 const l=L.byId[id],p=l?.project;assert.ok(l,id);
 assert.equal(p.wires.length,wires);
 assert.deepEqual(Array.from(p.components,c=>c.typeId),types);
 for(const type of types)assert.ok(defs[type],type+' missing catalogue');
 assert.equal(l.pedagogyReview.mq07PressureScope,'SC322_SC335');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.titleTopologyIssue,reason);
 for(const key of ['nativeDynamicAcceptance','physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance','sensorCalibrationAcceptance'])
  assert.equal(l.pedagogyReview[key],false,key);
 assert.equal(l.kind,wires?'wiring':'quiz');
 if(wires===0)assert.equal(p.referenceOnly,true);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 assert.ok(l.quiz&&l.quiz.options.length>1);
});
for(const [id,golden,wires,types] of [
 ['sensor-analog-apps-outline-047','sensor-analog-apps-src-08',4,['tutorial-piezo','resistor','unit-ut33d-plus','test-probe-red','test-probe-black']],
 ['sensor-analog-apps-outline-048','sensor-analog-apps-src-09',6,['arduino-bench-supply','load-cell','weighing-indicator']]
])test('source-cloned application '+id+' retains real canonical terminals',()=>{
 const a=L.byId[id],g=L.byId[golden];
 assert.equal(a.project.wires.length,wires);assert.equal(a.steps.length,wires);
 assert.deepEqual(Array.from(a.project.components,c=>c.typeId),types);
 assert.equal(a.pedagogyReview.sourceTopologyReusedFrom,golden);
 assert.deepEqual(Array.from(a.project.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]),
  Array.from(g.project.wires,w=>[w.from.c,w.from.p,w.to.c,w.to.p]));
 for(const c of a.project.components)assert.ok(defs[c.typeId],c.typeId);
 for(const w of a.project.wires){
  for(const e of [w.from,w.to]){
   const c=a.project.components.find(c=>c.id===e.c);assert.ok(c,e.c);
   assert.ok(defs[c.typeId].pins.some(p=>p.id===e.p),e.c+'/'+e.p);
  }
 }
});
test('outline piezo native impulse values are stable and same electrical readout',()=>{
 const p=structuredClone(L.byId['sensor-analog-apps-outline-047'].project),pz=p.components.find(c=>c.id==='pz'),meter=p.components.find(c=>c.id==='v1');
 const values=[];
 for(const now of [0,1000,1150,2000,3000]){
  if(now===1000)pz.piezoTapAt=1000;
  const result=Native.solve(p,defs,{now});
  assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating);
  assert.equal(meter._meter?.warning,'');
  values.push(pz._piezoMv);
 }
 assert.equal(values[0],0);assert.ok(Math.abs(values[1]-100)<.001);
 assert.ok(values[2]>50&&values[2]<51);assert.ok(values[3]>0&&values[3]<2);
 assert.equal(values[4],0);
});
test('outline load cell native TX11 differential reading follows 0, 500, 1000 kg',()=>{
 for(const mass of [0,500,1000]){
  const p=structuredClone(L.byId['sensor-analog-apps-outline-048'].project);
  const cell=p.components.find(c=>c.id==='lc'),ind=p.components.find(c=>c.id==='tx');
  cell.loadWeight=mass;
  const r=Native.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
  assert.equal(ind._instrument.error,'');assert.equal(ind._instrument.on,true);
  assert.ok(Math.abs(ind._instrument.weight-mass)<.000001);
  assert.ok(Math.abs(ind._instrument.input-10*mass/1000)<.000001);
 }
});
test('original 1655 IDs and quiz texts; SC255 native rejection and 11 special sensor quizzes persist',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='sensor-analog-apps-outline-038');
 assert.ok(i>0);
 assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),
  cases.map(([suffix])=>suffix.startsWith('electronic-')?suffix:'sensor-analog-apps-outline-'+suffix));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
 assert.equal(L.byId['electronic-switching-outline-024'].pedagogyReview.nativeDynamicAcceptance,false);
});
