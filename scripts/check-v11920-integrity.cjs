#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const crypto=require('node:crypto');
const cp=require('node:child_process');

const PROTECTED=[
  'scripts/check-v11920-lock.cjs',
  'scripts/check-v11920-integrity.cjs',
  'scripts/ci-scope-v11920.cjs',
  'scripts/check-docs-fast-v11920.cjs',
  'scripts/quality-gates-v11920.cjs',
  'scripts/browser-visual-v11920.cjs',
  'tests/browser-visual-golden-v11920.json',
  '.github/workflows/check.yml'
];

function sha256(data){
  return crypto.createHash('sha256').update(data).digest('hex');
}
function normalize(path,data){
  if(path!=='.github/workflows/check.yml')return data;
  return Buffer.from(data.toString('utf8').replace(
    /DTS_LOCK_BASELINE_COMMIT:\s*(?:BOOTSTRAP|[0-9a-f]{40})/g,
    'DTS_LOCK_BASELINE_COMMIT: <PINNED_BASELINE>'
  ));
}
function baselineBuffer(commit,path){
  return cp.execFileSync('git',['show',commit+':'+path],{encoding:null,maxBuffer:8*1024*1024});
}
function verifyCommit(commit){
  cp.execFileSync('git',['rev-parse','--verify',commit+'^{commit}'],{stdio:'ignore'});
  cp.execFileSync('git',['merge-base','--is-ancestor',commit,'HEAD'],{stdio:'ignore'});
}
function run(){
  const baseline=String(process.env.DTS_LOCK_BASELINE_COMMIT||'').trim();
  if(baseline==='BOOTSTRAP'){
    console.warn('[LOCK-INTEGRITY] BOOTSTRAP modu: baseline sonraki committe pinlenecek.');
    return {bootstrap:true};
  }
  if(!/^[0-9a-f]{40}$/.test(baseline)){
    throw new Error('DTS_LOCK_BASELINE_COMMIT 40 haneli commit SHA olmalıdır.');
  }
  verifyCommit(baseline);
  const failures=[];
  for(const path of PROTECTED){
    if(!fs.existsSync(path)){failures.push(path+': current file missing');continue}
    const current=normalize(path,fs.readFileSync(path));
    let base;
    try{base=normalize(path,baselineBuffer(baseline,path))}
    catch(e){failures.push(path+': baseline file missing');continue}
    const a=sha256(current),b=sha256(base);
    if(a!==b)failures.push(path+': current '+a+' != baseline '+b);
    else console.log('[LOCK-INTEGRITY] OK',path,a);
  }
  const workflow=fs.readFileSync('.github/workflows/check.yml','utf8');
  for(const token of [
    'fetch-depth: 0',
    'persist-credentials: false',
    'node scripts/check-v11920-integrity.cjs',
    'node scripts/check-v11920-lock.cjs',
    'permissions:',
    'contents: read'
  ])if(!workflow.includes(token))failures.push('workflow token missing: '+token);
  if(failures.length){
    for(const failure of failures)console.error('[LOCK-INTEGRITY]',failure);
    process.exitCode=1;
    return {ok:false,failures};
  }
  console.log('[LOCK-INTEGRITY] immutable baseline commit:',baseline);
  return {ok:true,baseline};
}
if(require.main===module){
  try{run()}catch(e){console.error('[LOCK-INTEGRITY]',e.message);process.exit(1)}
}
module.exports={PROTECTED,sha256,normalize,run};
