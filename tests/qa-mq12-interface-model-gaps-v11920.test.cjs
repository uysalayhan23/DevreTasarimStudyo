'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {run}=require('../scripts/qa-mq12-interface-model-gaps-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog(),original=JSON.stringify(L.lessons),r=run({L,defs}),f=r.findings;
test('eight topic records distinguish passive piezo sources from 24 V switch power',()=>{
 assert.equal(r.sourceLessons,1655);assert.equal(r.wiredLessons,730);
 assert.equal(r.rows.length,8);assert.equal(JSON.stringify(L.lessons),original);
 assert.ok(r.rows.every(x=>!x.physicallyApproved));
 const piezo=r.rows.find(x=>x.id==='sensor-analog-apps-src-08');
 assert.equal(piezo.placedSensor,'tutorial-piezo');
 assert.equal(piezo.canonicalVoltage,null);
 assert.equal(piezo.sourceModelAligned,true);
 assert.ok(piezo.reviewReasons.includes('NO_24V_BENCH_SUPPLY_IN_SOURCE'));
 assert.ok(f.supply24VCount>=1&&f.supply24VCount<8);
});
test('wenglor U1KT003 has configurable NPN/PNP and NO/NC; avoid false load qualification',()=>{
 assert.equal(r.manufacturers.ultrasonic.outputLimitMA,100);
 assert.deepEqual(r.manufacturers.ultrasonic.switchModes,['NO','NC']);
 assert.deepEqual(r.manufacturers.ultrasonic.outputModes,['PNP','NPN']);
 assert.ok(f.ultrasonicSupplyCompatible);
 assert.ok(f.buzzerMaxCurrentBelowSensorSwitchLimit);
 assert.equal(f.relayCoilCurrentVerified,false);
 assert.equal(f.catalogBuzzerRatedVoltageVerified,false);
 assert.equal(f.exactManufacturerTerminalsCatalogMapped,false);
});
test('Schneider XB5KSB is a concrete 24 V candidate but not a confirmed 1/2 catalogue footprint',()=>{
 assert.equal(r.manufacturers.buzzer.ratedVoltage,24);
 assert.equal(r.manufacturers.buzzer.maxCurrentMA,28);
 assert.equal(r.manufacturers.buzzer.terminalsVerifiedAsCatalogBuzzer,false);
 const row=r.rows.find(x=>x.id==='sensor-analog-apps-outline-089');
 assert.deepEqual(Array.from(row.candidates.find(x=>x.typeId==='buzzer').pins),['1','2']);
 assert.ok(!row.physicallyApproved);
});
test('Kobastar load-cell bridge behavior is modeled in mV but requires differential interface',()=>{
 assert.equal(r.manufacturers.loadCell.recommendedExcitation,10);
 assert.equal(r.manufacturers.loadCell.maxExcitation,15);
 assert.equal(f.loadCell10VFullScaleMv,20);
 assert.equal(f.loadCell10VHalfScaleMv,10);
 const row=r.rows.find(x=>x.id==='sensor-analog-apps-outline-048');
 assert.equal(row.candidates[0].modelStatus,'MEASURED_BRIDGE_MV_MODEL_PRESENT');
 assert.deepEqual(Array.from(row.candidates[0].pins),['EX+','EX−','SIG+','SIG−']);
});
test('NTC/PT100 thermal transfer models exist but threshold-to-relay approval is missing',()=>{
 assert.ok(f.ntc25Ohm>f.ntc35Ohm);
 assert.ok(f.pt100_25Ohm<f.pt100_35Ohm);
 assert.equal(f.ntc25Ohm,10000);
 assert.ok(Math.abs(f.pt100_25Ohm-109.735)<.002);
 assert.ok(r.rows.find(x=>x.id==='sensor-analog-apps-outline-085').candidates.some(x=>x.modelStatus==='THERMAL_RESISTANCE_MODEL_PRESENT'));
});
test('MQ-2 and piezo generic 5 V fallback cannot masquerade as physical signal model',()=>{
 assert.equal(r.manufacturers.mq2.ratedVoltage,5);
 assert.equal(f.mq2GenericFallbackV,5);
 assert.equal(f.piezoGenericFallbackV,5);
 assert.equal(f.genericFallbackIsValidPhysicalPiezoOrMQ2Model,false);
 assert.equal(r.rows.find(x=>x.id==='sensor-analog-apps-outline-138').candidates[0].modelStatus,'ARDUINO_ANALOG_STUB_NO_GAS_CONCENTRATION_MODEL');
 assert.equal(r.overallAcceptance,'REVIEW');
});

test('unconfigured sensor stimuli remain individually traceable and seven reactive gates stay open',()=>{
 // 35 was the 2026-10-13 historical baseline; the current native Windows
 // source scan found 30 on 2026-10-17. This is NOT five verified repairs.
 assert.equal(r.unconfiguredSensorLessons,30);
 assert.equal(r.unconfiguredSensorLessonIds.length,r.unconfiguredSensorLessons);
 assert.equal(new Set(r.unconfiguredSensorLessonIds).size,r.unconfiguredSensorLessons);
 assert.deepEqual(r.unconfiguredSensorLessonIds,[...r.unconfiguredSensorLessonIds].sort());
 for(const id of r.unconfiguredSensorLessonIds){
  const lesson=L.byId[id];assert.ok(lesson?.project?.wires?.length,id);
  assert.ok(lesson.project.components.some(c=>
   ['proximity','autonics-pr12-npn'].includes(c.typeId)&&!c.sensing?.target),id);
 }
 assert.equal(r.reactiveRestorationCases,7);
 assert.equal(r.overallAcceptance,'REVIEW');
 assert.ok(r.rows.every(x=>x.physicallyApproved===false));
 assert.equal(r.findings.allEightPhysicalApproved,false);
});
test('ultrasonic 35 V injected fixture fails upper manufacturer voltage limit without canonical edit',()=>{
 const altered=structuredClone(L);
 altered.lessons.find(x=>x.id==='sensor-analog-apps-outline-089').project.components.find(x=>x.typeId==='arduino-bench-supply').dcVoltage=35;
 const candidate=run({L:altered,defs});
 assert.equal(candidate.findings.ultrasonicSupplyCompatible,false);
 assert.equal(candidate.overallAcceptance,'REVIEW');
 assert.equal(JSON.stringify(L.lessons),original);
});
