'use strict';
// Read-only manufacturer/interface gap inventory; virtual model output is NOT hardware acceptance.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Device=require('../dist/device-behavior.js');
const TOPICS={
 'sensor-analog-apps-src-08':['tutorial-piezo'],
 'sensor-analog-apps-outline-047':['tutorial-piezo'],
 'sensor-analog-apps-outline-048':['load-cell'],
 'sensor-analog-apps-outline-085':['sensor-ntc','sensor-pt100','arduino-lm35'],
 'sensor-analog-apps-outline-089':['ultrasonic-switch','buzzer'],
 'sensor-analog-apps-outline-105':['sensor-pt100','temperature-controller'],
 'sensor-analog-apps-outline-121':['sensor-ntc','sensor-ptc'],
 'sensor-analog-apps-outline-138':['arduino-mq2']
};
const REACTIVE_IDS=['electronic-component-basics-outline-012','electronic-component-basics-outline-106','electronic-component-basics-outline-126','electronic-component-basics-outline-130','workshop-safety-mechanics-outline-049','workshop-safety-mechanics-outline-127','workshop-safety-mechanics-outline-130'];
const MANUFACTURERS={
 ultrasonic:{model:'wenglor U1KT003',voltageMin:18,voltageMax:30,outputLimitMA:100,outputs:2,outputModes:['PNP','NPN'],switchModes:['NO','NC'],connector:'M12-4',source:'https://www.wenglor.com/en/Sensors/Ultrasonic-Sensors/Ultrasonic-Distance-Sensors/Distance-Sensor/p/U1KT003'},
 buzzer:{model:'Schneider Electric XB5KSB',ratedVoltage:24,voltageTolerance:0.1,maxCurrentMA:28,terminalsVerifiedAsCatalogBuzzer:false,source:'https://iportal.se.com/Contents/docs/SQD-XB5KSB.PDF'},
 loadCell:{model:'Kobastar SB2',recommendedExcitation:10,maxExcitation:15,sensitivityMvPerVolt:2,terminals:['EX+','EX−','SIG+','SIG−'],source:'https://kobastar.com/wp-content/uploads/2024/03/Datasheet-SB2.pdf'},
 mq2:{model:'Olimex SNS-MQ2',ratedVoltage:5,outputs:['AO','DO'],source:'https://www.olimex.com/Products/Components/Sensors/Gas/SNS-MQ2/'}
};
function run({L=QA.curriculum(),defs=QA.catalog()}={}){
 const rows=[];
 for(const [id,models] of Object.entries(TOPICS)){
  const l=L.lessons.find(x=>x.id===id);if(!l)throw Error('Missing lesson '+id);
  // A repaired passive piezo / measured bridge need not contain a 24 V PNP source.
  const placed=l.project.components.find(x=>x.typeId==='proximity')||
    l.project.components.find(x=>models.includes(x.typeId))||null;
  const supply=l.project.components.find(x=>x.typeId==='arduino-bench-supply')||null;
  const candidates=models.map(typeId=>{
   const d=defs[typeId];if(!d)throw Error('Unknown catalog candidate '+typeId);
   const status= typeId==='load-cell'?'MEASURED_BRIDGE_MV_MODEL_PRESENT':
    ['sensor-ntc','sensor-pt100','sensor-ptc'].includes(typeId)?'THERMAL_RESISTANCE_MODEL_PRESENT':
    typeId==='tutorial-piezo'?'VIRTUAL_PIEZO_TRANSIENT_UNCALIBRATED':
    typeId==='arduino-mq2'?'ARDUINO_ANALOG_STUB_NO_GAS_CONCENTRATION_MODEL':
    typeId==='arduino-lm35'?'ARDUINO_TEMPERATURE_INPUT_REQUIRES_ADC_GATE':
    typeId==='buzzer'?'VIRTUAL_BUZZER_NO_VERIFIED_PRODUCT_TERMINALS':
    typeId==='ultrasonic-switch'?'VIRTUAL_SWITCH_MANUFACTURER_MAPPING_PENDING':
    'INSTRUMENT_OR_PHYSICAL_INTERFACE_GATE_PENDING';
   return {typeId,pins:d.pins.map(p=>p.id),kind:d.kind,modelStatus:status,physicallyApproved:false};
  });
  rows.push({id,title:l.title,canonicalVoltage:supply?.dcVoltage??null,
   placedSensor:placed?.typeId||null,sourceModelAligned:!!placed&&placed.typeId!=='proximity',
   hasPhysicalTarget:!!placed?.sensing?.target,candidates,physicallyApproved:false,
   reviewReasons:[...(!placed?['CANONICAL_SOURCE_SENSOR_UNRESOLVED']:[]),
    ...(!supply?['NO_24V_BENCH_SUPPLY_IN_SOURCE']:[]),'PHYSICAL_INTERFACE_UNVERIFIED']});
 }
 const loadCellFullScale=Device.output({_loadExcitation:10,loadWeight:1000,loadCapacity:1000},defs['load-cell']);
 const loadCellHalfScale=Device.output({_loadExcitation:10,loadWeight:500,loadCapacity:1000},defs['load-cell']);
 const ntc25=Device.output({temperature:25},defs['sensor-ntc']);
 const ntc35=Device.output({temperature:35},defs['sensor-ntc']);
 const pt100_25=Device.output({temperature:25},defs['sensor-pt100']);
 const pt100_35=Device.output({temperature:35},defs['sensor-pt100']);
 const piezoFallback=Device.output({},defs['tutorial-piezo']);
 const mq2Fallback=Device.output({},defs['arduino-mq2']);
 // Keep an auditable list; a changing count does NOT establish that any lesson was repaired.
 const unconfiguredSensorLessonIds=L.lessons.filter(l=>l.project?.wires?.length&&
  l.project.components.some(c=>['proximity','autonics-pr12-npn'].includes(c.typeId)&&!c.sensing?.target))
  .map(l=>l.id).sort();
 return {scope:'READ_ONLY_NONCANONICAL_MANUFACTURER_MODEL_GATES',sourceLessons:L.lessons.length,wiredLessons:L.lessons.filter(l=>l.project?.wires?.length).length,
  unconfiguredSensorLessons:unconfiguredSensorLessonIds.length,unconfiguredSensorLessonIds,
  reactiveRestorationCases:REACTIVE_IDS.filter(id=>L.lessons.some(l=>l.id===id&&l.project?.wires?.length)).length,
  manufacturers:MANUFACTURERS,rows,findings:{
    supply24VCount:rows.filter(x=>x.canonicalVoltage===24).length,
    ultrasonicSupplyCompatible:rows.find(x=>x.id==='sensor-analog-apps-outline-089').canonicalVoltage>=MANUFACTURERS.ultrasonic.voltageMin&&rows.find(x=>x.id==='sensor-analog-apps-outline-089').canonicalVoltage<=MANUFACTURERS.ultrasonic.voltageMax,
    buzzerMaxCurrentBelowSensorSwitchLimit:MANUFACTURERS.buzzer.maxCurrentMA<MANUFACTURERS.ultrasonic.outputLimitMA,
    relayCoilCurrentVerified:Number.isFinite(Number(defs['coil-relay']?.coilCurrentMilliamp)),
    catalogBuzzerRatedVoltageVerified:Number.isFinite(Number(defs.buzzer?.ratedVoltage)),
    loadCell10VFullScaleMv:loadCellFullScale.value,loadCell10VHalfScaleMv:loadCellHalfScale.value,
    ntc25Ohm:ntc25.value,ntc35Ohm:ntc35.value,pt100_25Ohm:pt100_25.value,pt100_35Ohm:pt100_35.value,
    piezoGenericFallbackV:piezoFallback.value,mq2GenericFallbackV:mq2Fallback.value,
    genericFallbackIsValidPhysicalPiezoOrMQ2Model:false,
    exactManufacturerTerminalsCatalogMapped:false,
    allEightPhysicalApproved:false
  },overallAcceptance:'REVIEW'};
}
if(require.main===module){const fs=require('node:fs'),path=require('node:path');const r=run(),dest=path.resolve(__dirname,'../build/qa-mq12-interface-model-gaps.json');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({file:dest,findings:r.findings,overallAcceptance:r.overallAcceptance},null,2));}
module.exports={run,TOPICS,MANUFACTURERS};
