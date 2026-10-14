'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-practice-1519-v11920.cjs');
const Curriculum=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const fs=require('node:fs'),path=require('node:path');
const mode=()=>fs.readFileSync(path.resolve(__dirname,'../dist/tutorial-mode.js'),'utf8');

test('1519 non-rich practice guides have 2085 source-backed terminal examples and safe UI text',()=>{
 const report=QA.main();
 assert.equal(report.total,1655);
 assert.equal(report.rich,136);
 assert.equal(report.examined,1519);
 assert.equal(report.wired,532);
 assert.equal(report.referenceOnly,916);
 assert.equal(report.referenceWithWires,71);
 assert.ok(report.checkableObservations>=2000);
 assert.equal(report.issues.length,0);
 assert.equal(report.guiContract.passed,true);
 assert.equal(report.sourceStatus,'PASS');
});
test('pedagogy audit rejects a fabricated wiring step and unescaped teaching markup',()=>{
 const L=Curriculum.curriculum();
 const lesson=L.lessons.find(x=>x.practiceGuide?.method==='virtual-circuit-check');
 assert.ok(lesson);
 lesson.practiceGuide.steps.unshift('Sanal bağlantı incelemesi: FAKE / 4 → FAKE / 8. Kasıtlı yanlış bağlantı.');
 const wrong=QA.audit({L,modeSource:mode()});
 assert.equal(wrong.sourceStatus,'FAIL');
 assert.ok(wrong.issues.some(x=>x.id===lesson.id&&x.code==='not-canonical-terminal-link'));
 const missingEscape=QA.audit({L,modeSource:mode().replace('esc(l.practiceGuide.heading)','l.practiceGuide.heading')});
 assert.equal(missingEscape.guiContract.passed,false);
 assert.equal(missingEscape.sourceStatus,'FAIL');
});
