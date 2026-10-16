'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum();
const sensor=[
 ['02','Sanal PTC ısı kontrollü devrede 65 °C'],
 ['03','Sanal K termokupl 100 °C'],
 ['04','3 telli sanal PT100'],
 ['05','Sanal LM35 25 °C'],
 ['06','Sanal Reed sürgüsü 80'],
 ['07','Sanal 24 V Hall PNP sensörü'],
 ['08','SC27 Piezo sanal darbe'],
 ['09','Sanal 2 mV/V hassasiyetli'],
 ['10','Üst kolda LDR'],
 ['13','Sanal indüktif PNP sensör metal'],
 ['14','B1 optik hedefi algıladığı sırada']
];
for(const [suffix,phrase] of sensor)test('Preserve source-specific sensor question '+suffix+' and add nonphysical topic-review metadata',()=>{
 const l=L.byId['sensor-analog-apps-src-'+suffix];assert.ok(l);
 assert.ok(l.quiz.question.startsWith(phrase),l.quiz.question);
 assert.equal(l.quiz.answer,0);assert.equal(l.quiz.options.length,3);
 assert.ok(l.quiz.why.length>20);
 assert.equal(l.topicReview.version,'topic-review-m1');
 assert.equal(l.topicReview.scope,'source-specific-quiz-preserved');
 assert.equal(l.topicReview.sourceQuestionPreserved,true);
 assert.equal(l.topicReview.simulationAcceptance,false);
 assert.equal(l.topicReview.visualAcceptance,false);
 assert.equal(l.topicReview.sourceCircuitPreserved,true);
});
test('Exactly eleven originally non-generic quizzes preserved; full 1655 initial simulation accepted separately',()=>{
 const stats=L.topicReviewBatchM;
 assert.equal(stats.scanned,1519);assert.equal(stats.replaced,1508);
 assert.equal(stats.keptNonGeneric,11);assert.equal(stats.sourceSpecificPreserved,11);
 const report=QA.audit({L});
 assert.equal(report.total,1655);assert.equal(report.topicReviewed,1519);
 assert.equal(report.virtualPracticeGuides,1519);assert.equal(report.invalidWireEndpoints.length,0);
 assert.equal(report.missingDefinitions.length,0);assert.equal(report.errors.length,0);
 assert.equal(report.status,'PASS');
});
