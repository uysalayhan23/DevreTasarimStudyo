'use strict';
// Read-only electrical consistency gate. Manufacturer ratings must not imply canonical acceptance.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const {ID_CANDIDATES}=require('./qa-mq12-sensor-model-compatibility-v11920.cjs');
const MFG={
 U1KT003:{brand:'wenglor',voltageMin:18,voltageMax:30,outputType:'PNP',outputs:2,maxOutputMilliamp:100,connectorPins:4,rangeMinMm:30,rangeMaxMm:400,source:'https://www.wenglor.com/en/Sensors/Ultrasonic-Sensors/Ultrasonic-Distance-Sensors/Distance-Sensor/p/U1KT003'},
 SB2:{brand:'Kobastar',pins:['EX+','EX−','SIG+','SIG−'],signalType:'mV/V',source:'https://kobastar.com/wp-content/uploads/2024/03/Datasheet-SB2.pdf'},
 MQ2:{supplyVoltage:5,pins:['VCC','AO','GND'],source:'https://www.olimex.com/Products/Components/Sensors/Gas/SNS-MQ2/'}
};
function run({L=QA.curriculum(),defs=QA.catalog()}={}){
 const rows=[];
 for(const [id,ids] of Object.entries(ID_CANDIDATES)){
  const lesson=L.lessons.find(x=>x.id===id);if(!lesson)throw Error('Missing lesson '+id);
  const supply=lesson.project.components.find(x=>x.typeId==='arduino-bench-supply');
  const sensor=lesson.project.components.find(x=>x.typeId==='proximity');
  if(!supply||!sensor)throw Error('Unexpected canonical template '+id);
  const actualVolts=Number(supply.dcVoltage??defs[supply.typeId]?.defaultVoltage);
  const tutorial24V=lesson.project.wires.some(w=>/\+24\s*V|\+24V/i.test((w.tutorialHint||'')+' '+(w.tutorialWhy||'')+' '+(w.role||'')));
  const terms=[...new Set(lesson.project.wires.flatMap(w=>[w.from,w.to]).filter(t=>t.c===sensor.id).map(t=>t.p))].sort();
  const candidates=ids.map(typeId=>{
   const def=defs[typeId];if(!def)throw Error('Candidate not in catalog '+typeId);
   const pins=(def.pins||[]).map(x=>x.id);
   const directPinCompatible=terms.every(p=>pins.includes(p));
   const isWenglor=typeId==='ultrasonic-switch';
   return {typeId,pins,directPinCompatible,dropInApproved:false,
    manufacturerEvidence:isWenglor?'U1KT003':typeId==='load-cell'?'SB2':typeId==='arduino-mq2'?'MQ2':null,
    manufacturerVoltageCompatible:isWenglor?actualVolts>=MFG.U1KT003.voltageMin&&actualVolts<=MFG.U1KT003.voltageMax:
      typeId==='arduino-mq2'?actualVolts===MFG.MQ2.supplyVoltage:null,
    requiresOutputOrSignalInterface:!directPinCompatible||typeId==='sensor-ultrasonic-nc'};
  });
  const blocks=['SENSOR_PHYSICAL_PRINCIPLE_UNPROVEN','CANONICAL_STIMULUS_UNDEFINED'];
  if(tutorial24V&&actualVolts!==24)blocks.push('TUTORIAL_24V_EFFECTIVE_SUPPLY_MISMATCH');
  if(id==='sensor-analog-apps-outline-089'){
   if(actualVolts<MFG.U1KT003.voltageMin||actualVolts>MFG.U1KT003.voltageMax)blocks.push('U1KT003_SUPPLY_OUT_OF_SPEC');
   if(!Number.isFinite(Number(defs.buzzer?.ratedVoltage)))blocks.push('BUZZER_RATED_VOLTAGE_MISSING');
   if(!Number.isFinite(Number(defs['coil-relay']?.coilCurrentMilliamp)))blocks.push('SENSOR_SWITCH_CURRENT_NOT_VERIFIED');
   blocks.push('BUZZER_TERMINAL_MAPPING_REQUIRED','ULTRASONIC_MANUFACTURER_OUTPUT_SETUP_UNVERIFIED');
  }
  if(id==='sensor-analog-apps-outline-048')blocks.push('LOAD_CELL_BRIDGE_AMPLIFIER_REQUIRED');
  if(id==='sensor-analog-apps-outline-138')blocks.push('MQ2_ANALOG_INTERFACE_AND_5V_REQUIRED');
  rows.push({id,sourceVoltage:actualVolts,claims24V:tutorial24V,connectedSensorPins:terms,candidates,blockers:blocks,accepted:false});
 }
 return {scope:'READ_ONLY_REAL_ELECTRICAL_INTERFACE',manufacturerEvidence:MFG,total:rows.length,sourceTotal:L.lessons.length,wiredTotal:L.lessons.filter(l=>l.project?.wires?.length).length,rows,
  mismatched24VSupplies:rows.filter(x=>x.blockers.includes('TUTORIAL_24V_EFFECTIVE_SUPPLY_MISMATCH')).length,
  manufacturerCompatibleUltrasonicSupply:rows.find(x=>x.id==='sensor-analog-apps-outline-089')?.candidates.some(x=>x.typeId==='ultrasonic-switch'&&x.manufacturerVoltageCompatible)||false,canonicalChanges:0,physicalAccepted:0,fullAcceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run,MFG};
