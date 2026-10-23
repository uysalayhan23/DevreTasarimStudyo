'use strict';
// Offline, read-only evidence gate. Never mutates lessons, status or acceptance.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const progress=JSON.parse(fs.readFileSync(path.join(root,'LESSON_PROGRESS.json'),'utf8'));
const lines=fs.readFileSync(path.join(root,'LESSON_EVIDENCE.jsonl'),'utf8').split(/\r?\n/).filter(Boolean);
const evidence=lines.map((line,i)=>{try{return JSON.parse(line);}catch(e){throw Error('Evidence JSONL line '+(i+1)+': '+e.message);}});
assert.equal(progress.schemaVersion,1);
assert.equal(progress.curriculumTotal,1686);
assert.ok(Number.isInteger(progress.historicalReportedSequentialCompleted));
assert.ok(Array.isArray(progress.records));
assert.ok(Number.isInteger(progress.nextSequentialLesson));
const ids=new Set(),completed=new Set();
for(const r of progress.records){
 assert.ok(typeof r.lessonId==='string'&&r.lessonId.length,'lessonId required');
 assert.ok(!ids.has(r.lessonId),'duplicate '+r.lessonId);ids.add(r.lessonId);
 assert.ok(['UNVERIFIED','IN_PROGRESS','BLOCKED','REVIEW','COMPLETE'].includes(r.status),'invalid status: '+r.lessonId);
 if(r.status!=='COMPLETE')continue;
 assert.ok(typeof r.sourcePath==='string'&&r.sourcePath.length,'missing source: '+r.lessonId);
 assert.match(r.sourceBlobSha||'',/^[0-9a-f]{40}$/,'source SHA missing: '+r.lessonId);
 const matches=evidence.filter(e=>e.type==='lesson-acceptance'&&e.lessonId===r.lessonId&&e.sourceBlobSha===r.sourceBlobSha&&e.status==='COMPLETE');
 assert.ok(matches.length,'COMPLETE without matching evidence: '+r.lessonId);
 const valid=matches.some(e=>e.technicalPass===true&&e.pedagogyPass===true&&e.positiveNativePass===true&&e.negativeNativePass===true&&e.requiredVisualPass===true&&e.locksPreserved===true&&e.deliveryVerified===true&&e.blockersResolved===true&&/^[0-9a-f]{40}$/.test(e.headSha||''));
 assert.ok(valid,'Incomplete mandatory gates: '+r.lessonId);
 completed.add(r.lessonId);
}
assert.equal(progress.verifiedCompleteCount,completed.size,'verified COMPLETE count mismatch');
for(const e of evidence){
 if(e.type!=='repair-attempt')continue;
 assert.ok(typeof e.lessonId==='string'&&e.lessonId,'repair-attempt needs lessonId');
 assert.ok(Number.isInteger(e.attempt)&&e.attempt>=1&&e.attempt<=3,'max three meaningful repair approaches');
 assert.ok(typeof e.hypothesis==='string'&&e.hypothesis.trim(),'new hypothesis required');
 assert.ok(typeof e.outcome==='string'&&e.outcome.trim(),'outcome required');
}
console.log('LESSON_ACCEPTANCE_GATE_PASS lessons='+completed.size+' historical='+progress.historicalReportedSequentialCompleted+'/'+progress.curriculumTotal+' records='+progress.records.length+' evidence='+evidence.length);
