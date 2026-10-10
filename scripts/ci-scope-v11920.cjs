#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const cp=require('node:child_process');

const ZERO=/^0{40}$/;
const SHA=/^[0-9a-f]{40}$/;

function isFastDoc(path){
  return path.startsWith('docs/') || (/^V1\.19\.20_.*\.md$/).test(path);
}
function changedFiles(base,head){
  const out=cp.execFileSync('git',['diff','--name-only','--diff-filter=ACMRD',base,head],{encoding:'utf8'});
  return out.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
}
function classifyPaths(changed){
  if(!Array.isArray(changed)||!changed.length)return {full:true,docsOnly:false,reason:'empty-diff',changed:Array.isArray(changed)?changed:[]};
  const docsOnly=changed.every(isFastDoc);
  return {full:!docsOnly,docsOnly,reason:docsOnly?'docs-only':'runtime-or-quality-change',changed};
}
function classify({eventName,base,head}){
  if(eventName==='workflow_dispatch')return {full:true,docsOnly:false,reason:'manual-dispatch',changed:[]};
  if(!SHA.test(head||''))return {full:true,docsOnly:false,reason:'missing-head',changed:[]};
  if(!SHA.test(base||'')||ZERO.test(base||''))return {full:true,docsOnly:false,reason:'missing-base',changed:[]};
  let changed;
  try{changed=changedFiles(base,head)}
  catch{return {full:true,docsOnly:false,reason:'diff-unavailable',changed:[]}}
  return classifyPaths(changed);
}
function writeOutputs(result){
  const target=process.env.GITHUB_OUTPUT;
  if(!target)return;
  fs.appendFileSync(target,[
    'full='+(result.full?'true':'false'),
    'docs_only='+(result.docsOnly?'true':'false'),
    'reason='+result.reason,
    'changed_count='+result.changed.length
  ].join('\n')+'\n');
}
function main(){
  const eventName=process.env.DTS_EVENT_NAME||process.env.GITHUB_EVENT_NAME||'';
  const head=process.env.DTS_HEAD_SHA||process.env.GITHUB_SHA||'';
  const base=eventName==='pull_request'
    ?(process.env.DTS_BASE_SHA||'')
    :(process.env.DTS_BEFORE_SHA||'');
  const result=classify({eventName,base,head});
  console.log('[CI-SCOPE]',JSON.stringify(result,null,2));
  writeOutputs(result);
  return result;
}
if(require.main===module)main();
module.exports={isFastDoc,changedFiles,classifyPaths,classify};
