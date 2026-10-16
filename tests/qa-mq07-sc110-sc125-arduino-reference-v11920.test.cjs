'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(), defs=QA.catalog();
const evidence={
 '01':['pinMode','digitalWrite','220 Ω'],
 '02':['digitalRead','INPUT_PULLUP','debounce'],
 '03':['analog gerilim bölücü','ek direnç'],
 '04':['TRIG','ECHO','/ 2'],
 '05':['analogRead','0–1023','ADC0804 harici 8-bit'],
 '06':['analogWrite','0–255','PWM'],
 '07':['L298N','ortak GND','motor beslemesi'],
 '08':['servo','güç/GND/sinyal'],
 '09':['CD4511','ortak katotlu','akım sınırlama'],
 '10':['SDA=A4','SCL=A5','OLED örneği'],
 '11':['DHT11','I2C sensörü değildir'],
 '12':['HX711','dara','kalibrasyon'],
 '13':['KY-040','A/B faz'],
 '14':['HC-05','TX↔RX','RX lojik seviye'],
 '15':['SDA=A4','SCL=A5','OLED modül'],
 '16':['LM35','10 mV/°C','ADC referansı']
};
for(const [suffix,strings] of Object.entries(evidence))test('SC'+(109+Number(suffix))+' factual Arduino reference, no false executable acceptance',()=>{
  const id='microcontroller-apps-src-'+suffix,l=L.byId[id];
  assert.ok(l,id); assert.equal(l.kind,'quiz'); assert.equal(l.project.referenceOnly,true);
  assert.equal(l.project.wires.length,0);assert.equal(l.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
  assert.equal(l.pedagogyReview.physicalAcceptance,false);assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
  assert.match(l.explanation,/çalışan Arduino programı veya ölçülmüş çıktı yoktur/);
  for(const needle of strings)assert.ok(l.explanation.includes(needle),id+' missing '+needle);
  for(const component of l.project.components)assert.ok(defs[component.typeId],component.typeId);
  assert.ok(l.beginnerSteps.some(x=>x.includes('elektriksel PASS verme')));
});
test('SC114 correctly labels ADC0804 as separate physical chip, not UNO built-in ADC',()=>{
 const l=L.byId['microcontroller-apps-src-05'];
 const chip=l.project.components.find(x=>x.typeId==='adc0804lcn');
 assert.ok(chip);assert.match(chip.label,/harici ADC/);assert.match(chip.label,/UNO dahili ADC değildir/);
});
test('SC124 visually includes an I2C peripheral without inventing power/data wires',()=>{
 const l=L.byId['microcontroller-apps-src-15'];
 assert.equal(l.project.components.map(c=>c.typeId).join(','),'arduino-uno,arduino-oled-i2c');
 assert.equal(l.project.wires.length,0);assert.equal(l.pedagogyReview.terminalGrounded,false);
});
