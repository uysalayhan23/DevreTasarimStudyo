#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {pngSize}=require('./browser-visual-hl-v11920.cjs');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'build','mq05-browser'),REPORT=path.join(OUT,'report.json');
const hash=buf=>crypto.createHash('sha256').update(buf).digest('hex');
const stages=['seal_in','probes_and_multimeter','ut200a','ac_dc_flow'];
function fail(message){throw Error(message)}
function main(){
 if(!fs.existsSync(REPORT))fail('Real MQ-05 Chromium report absent');
 const bytes=fs.readFileSync(REPORT),report=JSON.parse(bytes);
 if(report.status!=='PASS'||report.failure||report.exceptions?.length)fail('Chromium did not finish cleanly');
 if(Object.keys(report.tests||{}).length!==4||stages.some(name=>report.tests[name]!=='PASS'))
  fail('One or more browser simulation stages missing/failed');
 const coverage=report.coverage||{};
 if(!(coverage.seal_in?.start_pressed&&coverage.seal_in?.start_released_latched&&coverage.seal_in?.stop_deenergizes&&coverage.seal_in?.real_mouse_events&&
  coverage.probes?.free_then_attached&&coverage.probes?.real_pointer_drag&&coverage.probes?.wires_unchanged&&
  coverage.multimeter?.dc_24v&&coverage.multimeter?.red_black_physical_probes&&
  coverage.ut200a?.ac_1a&&coverage.ut200a?.noninvasive&&
  coverage.flow?.dc_reverse&&coverage.flow?.rendered_reverse&&coverage.flow?.ac_in_seal_in))
  fail('MQ-05 functional coverage fields missing');
 if(!Array.isArray(report.screenshots)||report.screenshots.length<8)
  fail('Missing live browser screenshot evidence');
 const seen=new Set(),files=[];
 for(const e of report.screenshots){
  if(!/^([a-z0-9-]+)\.png$/.test(path.basename(e.file||'')))fail('Invalid screenshot entry');
  const abs=path.resolve(ROOT,e.file);
  if(!abs.startsWith(OUT+path.sep)||seen.has(abs)||!fs.existsSync(abs))fail('Duplicate/missing/outside PNG: '+e.file);
  seen.add(abs);
  const b=fs.readFileSync(abs),dim=pngSize(b),digest=hash(b);
  if(b.length<10000||b.length!==e.bytes||digest!==e.sha256||dim.width!==e.width||dim.height!==e.height||dim.width!==1440||dim.height!==1000)
   fail('Screenshot PNG bytes/CRC/size/SHA-256 invalid: '+e.file);
  files.push({file:e.file,sha256:digest,bytes:b.length,width:dim.width,height:dim.height});
 }
 files.sort((a,b)=>a.file.localeCompare(b.file,'en'));
 const result={status:'PASS',real_chromium:true,stages,steps:4,images:files.length,report_sha256:hash(bytes),verified_at:new Date().toISOString(),files,coverage};
 fs.writeFileSync(path.join(OUT,'verification.json'),JSON.stringify(result,null,2)+'\n');
 fs.writeFileSync(path.join(OUT,'checksums.sha256'),files.map(x=>x.sha256+'  '+x.file).join('\n')+'\n');
 console.log('PASS: 4 real Chromium simulation stages / '+files.length+' PNG / SHA-256');
}
if(require.main===module)try{main()}catch(e){
 fs.mkdirSync(OUT,{recursive:true});
 fs.writeFileSync(path.join(OUT,'verification.failure.json'),JSON.stringify({status:'FAIL',message:e.message,at:new Date().toISOString()},null,2)+'\n');
 console.error('MQ-05 verification FAIL: '+(e.stack||e));process.exitCode=1;
}
module.exports={main,stages};
