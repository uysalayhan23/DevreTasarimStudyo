const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cp=require('node:child_process');
const Integrity=require('../scripts/check-v11920-integrity.cjs');

const workflowPath='.github/workflows/check.yml';
const workflow=fs.readFileSync(workflowPath,'utf8');
const match=workflow.match(/DTS_LOCK_BASELINE_COMMIT:\s*([0-9a-f]{40})/);
assert.ok(match,'workflow must pin a 40-char immutable baseline commit');
const baseline=match[1];

function show(path){
  return cp.execFileSync('git',['show',baseline+':'+path],{encoding:null,maxBuffer:8*1024*1024});
}
function digest(path,data){
  return Integrity.sha256(Integrity.normalize(path,Buffer.isBuffer(data)?data:Buffer.from(data)));
}

test('WP-017 pinned baseline matches every protected lock-control file',()=>{
  assert.match(baseline,/^[0-9a-f]{40}$/);
  cp.execFileSync('git',['merge-base','--is-ancestor',baseline,'HEAD']);
  for(const path of Integrity.PROTECTED){
    const current=fs.readFileSync(path);
    assert.equal(digest(path,current),digest(path,show(path)),path);
  }
});

test('WP-017 workflow keeps read-only credentials and invokes integrity before legacy lock',()=>{
  assert.match(workflow,/permissions:\s*\n\s*contents:\s*read/);
  assert.match(workflow,/persist-credentials:\s*false/);
  assert.match(workflow,/fetch-depth:\s*0/);
  const integrity=workflow.indexOf('node scripts/check-v11920-integrity.cjs');
  const legacy=workflow.indexOf('node scripts/check-v11920-lock.cjs');
  assert.ok(integrity>=0&&legacy>integrity);
});

test('workflow baseline self-reference is normalized but other mutations are detected',()=>{
  const baselineBytes=show(workflowPath);
  const changedPin=Buffer.from(workflow.replace(
    /DTS_LOCK_BASELINE_COMMIT:\s*[0-9a-f]{40}/,
    'DTS_LOCK_BASELINE_COMMIT: 0000000000000000000000000000000000000000'
  ));
  assert.equal(digest(workflowPath,changedPin),digest(workflowPath,baselineBytes));
  const mutated=Buffer.from(workflow.replace('contents: read','contents: write'));
  assert.notEqual(digest(workflowPath,mutated),digest(workflowPath,baselineBytes));
});

test('integrity checker itself treats protected-file mutation as a different digest',()=>{
  const path='scripts/check-v11920-integrity.cjs';
  const current=fs.readFileSync(path);
  const mutated=Buffer.concat([current,Buffer.from('\n// mutation probe\n')]);
  assert.notEqual(digest(path,mutated),digest(path,show(path)));
});
