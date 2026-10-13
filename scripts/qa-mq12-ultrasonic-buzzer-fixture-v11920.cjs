'use strict';
// Native solver, CLONE-ONLY electrical fixture; physical model & canonical lesson remain REVIEW.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const ID='sensor-analog-apps-outline-089';
function run({L=QA.curriculum(),defs=QA.catalog(),solver=Native}={}){
 const lesson=L.lessons.find(x=>x.id===ID);if(!lesson)throw Error('Canonical ultrasonic lesson missing');
 const original=JSON.stringify(lesson.project);
 const origSensor=lesson.project.components.find(x=>x.id==='s1');
 const origLoad=lesson.project.components.find(x=>x.id==='h1');
 if(!origSensor||!origLoad)throw Error('Sensor or load not found');
 const results=[];
 for(const [sensorType,wireMapping] of [['ultrasonic-switch',true],['sensor-ultrasonic-nc',true],['ultrasonic-switch',false]]){
  const project=structuredClone(lesson.project);
  const sensor=project.components.find(x=>x.id==='s1'),load=project.components.find(x=>x.id==='h1');
  sensor.typeId=sensorType;
  load.typeId='buzzer';load.label='Fixture only — ultrasonic buzzer';
  sensor.sensing={target:'metal',range:400,distance:1000,offset:0};
  if(wireMapping){for(const wire of project.wires){for(const end of [wire.from,wire.to]){
    if(end.c==='h1'){
     if(end.p==='X1')end.p='1';
     else if(end.p==='X2')end.p='2';
    }
   }}}
  const values=[];
  for(const [now,distance] of [[0,1000],[400,150],[850,1000]]){
   sensor.sensing.distance=distance;
   const r=solver.solve(project,defs,{now});
   values.push({now,distance,stable:!!r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,
    buzzerActive:!!load._active,relayActive:!!project.components.find(x=>x.id==='k1')._active});
  }
  results.push({sensorType,wireMapping,observedBuzzer:values.map(x=>x.buzzerActive),observedRelay:values.map(x=>x.relayActive),
    stable:values.every(x=>x.stable),phases:values,physicalAccepted:false});
 }
 const meta=defs.buzzer;
 return {scope:'CLONE_ONLY_NONCANONICAL_ULTRASONIC_BUZZER',lessonId:ID,lessonTitle:lesson.title,
  canonicalSensorType:origSensor.typeId,canonicalLoadType:origLoad.typeId,
  canonicalUnchanged:JSON.stringify(lesson.project)===original,
  originalSourcePins:['BN','BU','BK'],originalLoadPins:['X1','X2'],
  fixtureLoadType:'buzzer',fixtureLoadPins:['1','2'],buzzerElectricalRatingVerified:!!meta?.ratedVoltage,
  exactUltrasonicManufacturerModelVerified:false,syntheticPhysicalTargetOnly:true,
  results,physicalAccepted:false,fullAcceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run};
