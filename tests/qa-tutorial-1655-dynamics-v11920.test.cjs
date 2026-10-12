'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-dynamics-v11920.cjs');
test('MQ-05 virtual behavior: every actual wired lesson has native baseline and controls are toggled',()=>{
 const result=QA.main();
 assert.equal(result.total,1655);
 assert.equal(result.referenceOnly+result.wired,1655);
 assert.ok(result.wired>=700,'Expected hundreds of actual wired lessons');
 assert.equal(result.initialStates,result.wired);
 assert.ok(result.toggledStates>=100,'Dynamic OFF/ON coverage is missing');
 assert.ok(result.toggledStates>=result.interactiveDevices*2);
 assert.equal(result.missingDefs.length,0,JSON.stringify(result.missingDefs.slice(0,8)));
 assert.equal(result.failures.length,0,JSON.stringify(result.failures.slice(0,12)));
 assert.equal(result.status,'PASS');
});
test('MQ-05 contract explicitly treats reference-only theory as not electrically simulated',()=>{
 const fs=require('node:fs'),path=require('node:path');
 const s=fs.readFileSync(path.resolve(__dirname,'../scripts/qa-tutorial-1655-dynamics-v11920.cjs'),'utf8');
 assert.match(s,/if\(!p\?\.wires\?\.length\)\{report\.referenceOnly\+\+;continue\}/);
 assert.match(s,/Simulation\.solve\(after,defs/);
 assert.doesNotMatch(s,/gh workflow run|workflow_dispatch|github\.com\/actions/);
});
