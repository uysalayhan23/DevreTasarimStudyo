'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {run}=require('../scripts/qa-mq12-review-diagnostics-v11920.cjs');
const L=QA.curriculum(),before=JSON.stringify(L.lessons);
const report=run({L});
test('native 722 lesson classification, 2052 controlled phases, and 72 unresolved reviews stay fail-closed',()=>{
 assert.equal(report.sourceLessons,1655);assert.equal(report.wiredLessons,722);
 assert.deepEqual(report.originalClassification,{CONTROLLED:456,UNSUPPORTED_ACTUATOR:67,PASSIVE_STABILITY_ONLY:199,MISSING_DEFINITIONS:0});
 assert.deepEqual(report.originalStability,{phases:2052,pass:2052,fail:0});
 assert.deepEqual(report.originalResponse,{PASS:391,REVIEW:65,NOT_APPLICABLE:266});
 assert.deepEqual(report.originalRestoration,{PASS:384,REVIEW:72,NOT_APPLICABLE:266});
 assert.equal(report.reviewLessonCount,72);assert.equal(report.fullAcceptance,'REVIEW');
 assert.equal(JSON.stringify(L.lessons),before,'canonical scenes untouched');
});
test('35 missing-target sensors respond only to temporary virtual material fixtures',()=>{
 assert.equal(report.summary.sensorMissingTarget,35);
 assert.equal(report.summary.sensorFixturesStable,35);
 assert.equal(report.summary.sensorFixturesDetectedOffOnOff,35);
 assert.equal(report.summary.sensorFixturesCausal,34);
 assert.equal(report.summary.sensorFixturesRestored,35);
 assert.ok(report.sensor.every(x=>x.accepted===false&&x.scenario==='SYNTHETIC_FIXTURE_NOT_CANONICAL'));
 assert.equal(report.sensor.find(x=>x.id==='dual-dc-2').causal,false);
});
test('31 unresponsive lessons are not falsely blamed on missing meter connections',()=>{
 assert.equal(report.summary.noDownstreamResponse,31);
 assert.equal(report.summary.noDownstreamWithValidProbeTargets,30);
 assert.equal(report.summary.noDownstreamWithBjt,30);
 assert.ok(report.noDownstream.every(x=>!x.accepted));
});
test('reactive restoration remains REVIEW even if 3 of 7 settle in longer virtual steps',()=>{
 assert.equal(report.summary.reactiveReview,7);
 assert.equal(report.summary.reactiveStable,7);
 assert.equal(report.summary.reactiveRestoredBy10s,3);
 assert.ok(report.reactive.every(x=>!x.accepted));
});
