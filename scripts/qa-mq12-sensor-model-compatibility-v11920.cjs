'use strict';
// MQ-12 physical-model compatibility audit. Read-only; never auto-replace a canonical asset.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const ID_CANDIDATES={
 'sensor-analog-apps-src-08':['tutorial-piezo'],
 'sensor-analog-apps-outline-047':['tutorial-piezo'],
 'sensor-analog-apps-outline-048':['load-cell','load-cell-excitation'],
 'sensor-analog-apps-outline-085':['sensor-ntc','sensor-pt100','arduino-lm35'],
 'sensor-analog-apps-outline-089':['ultrasonic-switch','sensor-ultrasonic-nc','sensor-ultrasonic-analog'],
 'sensor-analog-apps-outline-105':['sensor-pt100','sensor-ptc','temperature-controller'],
 'sensor-analog-apps-outline-121':['sensor-ntc','sensor-ptc'],
 'sensor-analog-apps-outline-138':['arduino-mq2']
};
const clone=v=>JSON.parse(JSON.stringify(v));
const stable=r=>!!r?.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating;
function run({L=QA.curriculum(),defs=QA.catalog(),solver=Solver}={}){
 const rows=[];
 for(const [id,names] of Object.entries(ID_CANDIDATES)){
  const lesson=L.lessons.find(x=>x.id===id);
  if(!lesson)throw Error('Missing canonical lesson '+id);
  const placed=lesson.project.components.find(c=>c.typeId==='proximity')||lesson.project.components.find(c=>names.includes(c.typeId));
  if(!placed)throw Error('Unknown sensor model for '+id);
  const sourceModelAligned=placed.typeId!=='proximity';
  const connectedPins=[...new Set(lesson.project.wires.flatMap(w=>[w.from,w.to]).filter(x=>x.c===placed.id).map(x=>x.p))].sort();
  const proposed=names.map(typeId=>{
   const def=defs[typeId];if(!def)throw Error('Missing real catalog candidate '+typeId);
   const pins=(def.pins||[]).map(x=>x.id);
   return {typeId,name:def.name||def.label||typeId,kind:def.kind,sensorPrinciple:def.sensorPrinciple||null,outputType:def.outputType||null,pins,
    connectedPinsSupported:connectedPins.every(x=>pins.includes(x)),exactPinSet:pins.length===connectedPins.length&&connectedPins.every(x=>pins.includes(x)),
    nativeDigitalSensor:def.kind==='sensor'&&def.sensorPrinciple!== 'inductive',canAutoReplace:false};
  });
  const loadKinds=lesson.project.components.map(x=>defs[x.typeId]?.kind).filter(Boolean);
  rows.push({id,title:lesson.title,placedTypeId:placed.typeId,placedPrinciple:defs[placed.typeId]?.sensorPrinciple,
   connectedPins,loadKinds,mentionsBuzzer:/buzzer/i.test(lesson.title||''),containsBuzzer:loadKinds.includes('buzzer'),candidates:proposed,
   sourceModelAligned,accepted:false,reviewReasons:[sourceModelAligned?'VIRTUAL_SOURCE_MODEL_PRESENT_PHYSICAL_ACCEPTANCE_PENDING':'LESSON_SENSOR_PRINCIPLE_MISMATCH',...(proposed.every(x=>!x.exactPinSet)?['NON_DROP_IN_TERMINAL_MAPPING']:[]),...(/buzzer/i.test(lesson.title||'')&&!loadKinds.includes('buzzer')?['TITLE_LOAD_KIND_MISMATCH']:[])]});
 }
 const ultrasound=L.lessons.find(l=>l.id==='sensor-analog-apps-outline-089');
 const fixture=[];
 for(const typeId of ['ultrasonic-switch','sensor-ultrasonic-nc']){
  const graph=clone(ultrasound.project),c=graph.components.find(x=>x.id==='s1'),lamp=graph.components.find(x=>x.id==='h1');
  c.typeId=typeId;c.sensing={target:'metal',range:400,distance:1000,offset:0};
  const phases=[];
  for(const [now,distance] of [[0,1000],[400,150],[850,1000]]){
   c.sensing.distance=distance;
   const r=solver.solve(graph,defs,{now});
   phases.push({now,distance,stable:stable(r),lampOn:!!lamp._active});
  }
  fixture.push({typeId,scenario:'NONCANONICAL_SYNTHETIC_TARGET',phases,accepted:false});
 }
 return {scope:'READ_ONLY_EIGHT_MODEL_COMPATIBILITY',sourceLessons:L.lessons.length,wiredLessons:L.lessons.filter(x=>x.project?.wires?.length).length,
  candidatesFromCatalogOnly:true,rows,topicMismatchCount:rows.filter(x=>!x.sourceModelAligned).length,
  virtualSourceAlignedCount:rows.filter(x=>x.sourceModelAligned).length,
  physicalAccepted:0,ultrasonicFixture:fixture,fullAcceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run,ID_CANDIDATES};
