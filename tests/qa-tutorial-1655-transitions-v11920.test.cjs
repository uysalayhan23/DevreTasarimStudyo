'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-transitions-v11920.cjs');
test('MQ-05 all 722 wired lessons survive sequential virtual controller actions',()=>{
 const report=QA.main();
 assert.equal(report.lessons,1655);
 assert.equal(report.wired,722);
 assert.equal(report.referenceOnly,933);
 assert.ok(report.controls>=500,'No meaningful controller coverage');
 assert.equal(report.transitions,report.controls*3);
 assert.ok(report.changedOutputs>=100,'Controls fail to affect observable output');
 assert.equal(report.failed.length,0,JSON.stringify(report.failed.slice(0,12)));
 assert.equal(report.oscillating.length,0);
 assert.equal(report.status,'PASS');
});
