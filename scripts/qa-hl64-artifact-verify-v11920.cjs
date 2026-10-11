#!/usr/bin/env node
'use strict';

// Run only after browser-visual-hl-v11920.cjs exits successfully.
// Re-validate the saved JSON and *actual* PNG bytes before claiming acceptance.
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {verifyHLArtifactCoverage,verifyReportArtifacts}=require('./browser-visual-hl-v11920.cjs');

const ROOT=path.resolve(__dirname,'..');
const OUTPUT=path.join(ROOT,'build','browser-visual-hl');
const REPORT=path.join(OUTPUT,'report.json');
const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');

function screenshotEntries(value,items=[]){
 if(!value||typeof value!=='object')return items;
 if(Object.prototype.hasOwnProperty.call(value,'file')){
  items.push(value);
  return items;
 }
 for(const item of Object.values(value))screenshotEntries(item,items);
 return items;
}

function main(){
 if(!fs.existsSync(REPORT))throw Error('report.json missing; real Chromium H-L acceptance did not finish');
 const report=JSON.parse(fs.readFileSync(REPORT,'utf8'));
 if(report.failure||report.navigationFailure)throw Error('Chromium reported a failure: '+JSON.stringify(report.failure||report.navigationFailure));
 if(!Array.isArray(report.exceptions)||report.exceptions.length)throw Error('Missing/failed browser runtime exception report');
 const coverage=verifyHLArtifactCoverage(report);
 const integrity=verifyReportArtifacts(report);
 if(coverage.expectedTotal!==100||integrity.files!==100||
  report.artifactIntegrity?.verified!==true||report.artifactIntegrity.files!==100)
  throw Error('100 screenshots not actually accepted by saved Chromium report');
 if(report.states.hlLessons.checked!==64)throw Error('64 H-L lessons not completed');
 const entries=screenshotEntries(report.states);
 if(entries.length!==100)throw Error('Screenshot entry count differs from 100');
 const seen=new Set(),files=[];
 for(const record of entries){
  const filename=record.file;
  if(seen.has(filename))throw Error('Duplicate screenshot: '+filename);
  seen.add(filename);
  const absolute=path.resolve(ROOT,filename);
  if(!absolute.startsWith(OUTPUT+path.sep))throw Error('Screenshot path escaped output: '+filename);
  const bytes=fs.readFileSync(absolute);
  const hash=sha256(bytes);
  if(hash!==record.sha256||bytes.length!==record.bytes)
   throw Error('Screenshot changed since Chromium report: '+filename);
  files.push({file:filename,sha256:hash,bytes:bytes.length,width:record.width,height:record.height});
 }
 files.sort((a,b)=>a.file.localeCompare(b.file,'en'));
 const result={
  status:'PASS',
  verified_at:new Date().toISOString(),
  actual_chromium_run:true,
  lessons:coverage.lessons,
  screenshots:files.length,
  categories:coverage,
  report_sha256:sha256(fs.readFileSync(REPORT)),
  browser:report.browser,
  files
 };
 fs.writeFileSync(path.join(OUTPUT,'verification.json'),JSON.stringify(result,null,2)+'\n','utf8');
 fs.writeFileSync(path.join(OUTPUT,'checksums.sha256'),
  files.map(x=>x.sha256+'  '+x.file).join('\n')+'\n','utf8');
 process.stdout.write('PASS: 64 H-L lessons / 100 PNG files / saved JSON / SHA-256\n');
}

if(require.main===module){
 try{main()}
 catch(err){
  fs.mkdirSync(OUTPUT,{recursive:true});
  fs.writeFileSync(path.join(OUTPUT,'verification.failure.json'),
   JSON.stringify({status:'FAIL',message:String(err.message||err),timestamp:new Date().toISOString()},null,2)+'\n');
  console.error('QA H-L verification FAIL:',err.stack||err.message);
  process.exitCode=1;
 }
}
module.exports={main,screenshotEntries};
