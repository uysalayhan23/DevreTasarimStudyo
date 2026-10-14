'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {inventory,execute,REQUIRED,RUNNERS}=require('../scripts/qa-mq12-complete-local-suite-v11920.cjs');
test('full MQ12 regression inventory is explicit and contains the native/physical gates',()=>{
 assert.ok(REQUIRED.length>=19);
 assert.ok(REQUIRED.includes('tests/qa-mq12-review-diagnostics-v11920.test.cjs'));
 assert.ok(REQUIRED.includes('tests/qa-mq12-sonic-headroom-v11920.test.cjs'));
 assert.ok(RUNNERS.includes('scripts/qa-mq12-analog-decision-guard-v11920.cjs'));
});
test('missing source files cannot be promoted to complete or passing',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'mq12-integrity-'));
 try{
  const q=inventory(root);assert.ok(q.missingTests.length>0);
  assert.equal(q.complete,false);assert.equal(q.availableTests,0);
  const result=execute(root);assert.equal(result.status,'INCOMPLETE');
  assert.equal(result.executed,false);assert.equal(result.passed,null);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('inventory separates absent test source from absent runner source',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'mq12-one-'));
 try{
  const t='tests/example.test.cjs',s='scripts/example.cjs';
  fs.mkdirSync(path.dirname(path.join(root,t)),{recursive:true});
  fs.writeFileSync(path.join(root,t),'module.exports=1;\n');
  const q=inventory(root,[t],[s]);assert.equal(q.availableTests,1);
  assert.deepEqual(q.missingTests,[]);assert.deepEqual(q.missingRunners,[s]);
  assert.equal(q.complete,false);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('CLI --check fails on missing sources and never describes source presence as test PASS',()=>{
 const cp=require('node:child_process');
 const root=path.resolve(__dirname,'..');
 const cli=path.join(root,'scripts','qa-mq12-complete-local-suite-v11920.cjs');
 const result=cp.spawnSync(process.execPath,[cli,'--check'],{cwd:root,encoding:'utf8'});
 assert.ok(result.stdout,JSON.stringify({stderr:result.stderr}));
 const report=JSON.parse(result.stdout);
 const expected=inventory(root);
 assert.equal(result.status,expected.complete?0:1);
 assert.equal(report.complete,expected.complete);
 assert.equal(report.status,expected.complete?'SOURCES_PRESENT_UNTESTED':'INCOMPLETE');
 assert.equal(report.executed,false);
 assert.equal(report.passed,null);
});
