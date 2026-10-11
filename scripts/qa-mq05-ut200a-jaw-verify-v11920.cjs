#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {pngSize}=require('./browser-visual-hl-v11920.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'build','mq05-ut200a-browser');
const REPORT=path.join(OUT,'report.json'),hash=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const EXPECTED=['jaw-before-drag','jaw-open-over-live-wire','jaw-snapped-closed','jaw-current-ac-1a'];
function validate(report){
 if(report.status!=='PASS'||report.failure||report.exceptions?.length)throw Error('Real Chromium jaw run failed');
 const c=report.coverage||{},s=report.states||{};
 if(!(c.real_pointer_drag&&c.opened_before_snap&&c.opened_visual_evidence&&c.snapped_to_w1&&
 c.closed_after_release&&c.ac_current_1a&&c.noninvasive_two_wires&&c.range_switched_via_ui))
  throw Error('Missing real UT200A physical jaw coverage');
 if(!(s.before?.clampedWireId===null&&s.before?.visualState==='closed'&&
   s.opened?.jawOpen&&s.opened?.candidate?.wireId==='w1'&&s.opened?.visualState==='open'&&s.opened?.visibleOpenMark&&
   s.opened?.clampedWireId===null&&s.snapped?.clampedWireId==='w1'&&s.snapped?.visualState==='closed'&&!s.snapped?.jawOpen&&
   s.snapped?.distanceToWirePixels<=18&&s.measured?.clamp?.unit==='A'&&
   Math.abs(Number(s.measured?.clamp?.value)-1)<.04&&s.measured?.clamp?.warning===''&&
   s.measured?.wireCount===2&&s.measured?.projectRunning))
  throw Error('UT200A jaw state/snap/current evidence inconsistent');
 if(!Array.isArray(report.screenshots)||report.screenshots.length!==4||
   report.screenshots.some((item,i)=>item.step!==EXPECTED[i]))
  throw Error('Expected exactly four ordered real screenshots');
 const files=[];
 for(const item of report.screenshots){
  const abs=path.resolve(ROOT,item.file||'');
  if(!abs.startsWith(OUT+path.sep)||abs!==path.join(OUT,item.step+'.png')||!fs.existsSync(abs))
   throw Error('UT200A PNG file missing/outside expected output');
  const bytes=fs.readFileSync(abs),dim=pngSize(bytes),sha256=hash(bytes);
  if(bytes.length<=10000||item.bytes!==bytes.length||item.sha256!==sha256||
     dim.width!==1440||dim.height!==1000||item.width!==dim.width||item.height!==dim.height)
   throw Error('UT200A PNG CRC/IDAT/dimensions/hash mismatch: '+item.file);
  files.push({file:item.file,sha256,bytes:bytes.length,...dim});
 }
 if(new Set(files.map(v=>v.sha256)).size!==4)
  throw Error('UT200A four images must provide distinct physical interaction evidence');
 return {status:'PASS',steps:4,files,coverage:c};
}
function main(){
 if(!fs.existsSync(REPORT))throw Error('Real UT200A Chromium report.json not found');
 const bytes=fs.readFileSync(REPORT),report=JSON.parse(bytes),result=validate(report);
 const output={...result,report_sha256:hash(bytes),verified_at:new Date().toISOString(),
   real_chromium:true};
 fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(output,null,2)+'\n');
 fs.writeFileSync(path.join(OUT,'checksums.sha256'),output.files.map(x=>x.sha256+'  '+x.file).join('\n')+'\n');
 console.log('PASS: real UT200A open jaw, snapped closed, AC 1A, 4 PNG CRC/IDAT/SHA-256');
}
if(require.main===module)try{main()}catch(e){
 fs.mkdirSync(OUT,{recursive:true});
 fs.writeFileSync(path.join(OUT,'verification.failure.json'),JSON.stringify({status:'FAIL',message:e.message,time:new Date().toISOString()},null,2)+'\n');
 console.error('UT200A-JAW verifier FAILED:',e.stack||e);process.exitCode=1;
}
module.exports={validate,main};
