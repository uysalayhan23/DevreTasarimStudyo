'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {run,MFG}=require('../scripts/qa-mq12-sensor-electrical-contract-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),before=JSON.stringify(L.lessons),report=run({L,defs});
test('all eight sensor lessons distinguish passive piezo from a claimed 24V source',()=>{
 assert.equal(report.total,8);assert.equal(report.sourceTotal,1655);
 assert.ok(report.rows.every(x=>!x.accepted&&x.blockers.includes('SENSOR_PHYSICAL_PRINCIPLE_UNPROVEN')));
 const piezo=report.rows.find(x=>x.id==='sensor-analog-apps-src-08');
 assert.equal(piezo.canonicalSensorType,'tutorial-piezo');
 assert.equal(piezo.sourceVoltage,null);
 assert.equal(piezo.sourceModelAligned,true);
 assert.equal(piezo.accepted,false);
 for(const row of report.rows){
  if(row.claims24V&&row.sourceVoltage!==24)
   assert.ok(row.blockers.includes('TUTORIAL_24V_EFFECTIVE_SUPPLY_MISMATCH'),row.id);
  if(row.claims24V&&row.sourceVoltage===null)
   assert.ok(row.blockers.includes('CLAIMED_24V_SOURCE_MISSING'),row.id);
 }
});
test('U1KT003 accepts canonical 24V but its switching load and buzzer ratings stay unverified',()=>{
 assert.equal(MFG.U1KT003.voltageMin,18);assert.equal(MFG.U1KT003.voltageMax,30);
 assert.equal(MFG.U1KT003.outputType,'PNP');assert.equal(MFG.U1KT003.maxOutputMilliamp,100);
 assert.equal(MFG.U1KT003.connectorPins,4);
 const row=report.rows.find(x=>x.id==='sensor-analog-apps-outline-089');
 const u=row.candidates.find(x=>x.typeId==='ultrasonic-switch');
 assert.equal(u.pins.join(','),'BN,BU,BK,WH');assert.equal(u.manufacturerVoltageCompatible,true);
 assert.equal(report.manufacturerCompatibleUltrasonicSupply,true);
 assert.ok(!row.blockers.includes('U1KT003_SUPPLY_OUT_OF_SPEC'));
 assert.ok(row.blockers.includes('SENSOR_SWITCH_CURRENT_NOT_VERIFIED'));
 assert.ok(row.blockers.includes('BUZZER_RATED_VOLTAGE_MISSING'));
});
test('loadcell bridge and MQ2 5V interface cannot be silently substituted for 24V PNP switch',()=>{
 assert.equal(MFG.SB2.pins.join(','),'EX+,EX−,SIG+,SIG−');
 assert.equal(MFG.MQ2.supplyVoltage,5);
 const weight=report.rows.find(x=>x.id==='sensor-analog-apps-outline-048');
 const chem=report.rows.find(x=>x.id==='sensor-analog-apps-outline-138');
 assert.ok(weight.blockers.includes('LOAD_CELL_BRIDGE_AMPLIFIER_REQUIRED'));
 assert.ok(chem.blockers.includes('MQ2_ANALOG_INTERFACE_AND_5V_REQUIRED'));
 assert.ok(weight.candidates.every(x=>!x.dropInApproved));assert.ok(chem.candidates.every(x=>!x.dropInApproved));
});
test('report never mutates locked canonical lessons or grants physical PASS',()=>{
 assert.equal(report.sourceTotal,1655);assert.equal(report.wiredTotal,730);
 assert.equal(report.canonicalChanges,0);assert.equal(report.physicalAccepted,0);
 assert.ok(report.rows.every(x=>!x.accepted));assert.equal(report.fullAcceptance,'REVIEW');
 assert.equal(JSON.stringify(L.lessons),before);
});
