'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');

test('MQ-07 SC35 clap lesson keeps original graph but disclaims unverified program execution',()=>{
 const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-16'];
 assert.equal(L.lessons.length,1655);
 assert.ok(lesson);
 assert.match(lesson.title,/alkışla çalışan/i);
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.components.length,4);
 assert.equal(lesson.project.wires.length,8);
 const expected=[['ps','arduino-bench-supply'],['s1','arduino-sound-sensor'],
  ['u1','arduino-uno'],['bz','arduino-buzzer']];
 for(const [id,type] of expected){
  const part=lesson.project.components.find(c=>c.id===id);
  assert.equal(part?.typeId,type);
  assert.ok(defs[type],`Missing catalog type: ${type}`);
 }
 const actual=lesson.project.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p].join(':'));
 for(const route of ['s1:DO:u1:D2','u1:D9:bz:SIG','ps:P:s1:VCC','ps:M:s1:GND'])
  assert.ok(actual.includes(route),route);
 assert.equal(lesson.pedagogyReview.mq07ClapCircuit.programExecutionVerified,false);
 assert.equal(lesson.pedagogyReview.mq07ClapCircuit.automaticClapResponseVerified,false);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.match(lesson.explanation,/program/i);
});
