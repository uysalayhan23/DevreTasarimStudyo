'use strict';
// MQ-07 fail-closed heuristic inventory, NOT approval of pedagogy or browser UI.
// This module only reads canonical curriculum and never changes the lessons.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const P='Bu eleman ders başlığındaki gerçek işlevi doğrudan göstermek için seçildi';
function audit({L=QA.curriculum()}={}){
 const issues={
  genericSummary:[],genericExplanation:[],repeatedOpening:[],
  genericMaterialPurpose:[],wiredNtcWithoutSensor:[]
 };
 let rich=0,pedagogyPending=0;
 for(const lesson of L.lessons||[]){
  const id=String(lesson.id||''),summary=String(lesson.summary||''),
   explanation=String(lesson.explanation||''),
   title=String(lesson.title||'').toLocaleLowerCase('tr-TR');
  const comps=lesson.project?.components||[];
  if(lesson.designStandard==='rich-reference-v1')rich++;
  else if(lesson.practiceGuide?.pedagogicalAcceptance===false)pedagogyPending++;
  if(/elemanları arasındaki \d+ gerçek terminal bağlantısını/.test(summary))issues.genericSummary.push(id);
  if(/Gerçek bağlantı adımları:|Bu derste yalnız “/.test(explanation))issues.genericExplanation.push(id);
  if(summary.length>50&&explanation.length>50&&summary.slice(0,50)===explanation.slice(0,50))
   issues.repeatedOpening.push(id);
  if((lesson.materials||[]).some(m=>String(m.why||'').includes(P)))issues.genericMaterialPurpose.push(id);
  if(lesson.kind==='wiring'&&/ntc/.test(title)&&!comps.some(c=>c.typeId==='sensor-ntc'))
   issues.wiredNtcWithoutSensor.push(id);
 }
 const counts=Object.fromEntries(Object.entries(issues).map(([key,ids])=>[key,ids.length]));
 return {
  gate:'MQ07_PEDAGOGICAL_SEMANTIC_DEPTH_SOURCE_INVENTORY',
  status:'REVIEW',
  sourceOnly:true,executed:true,
  fullPedagogicalAcceptance:false,fullWindowsVisualAcceptance:false,
  lessons:L.lessons?.length||0,rich,pedagogyPending,
  counts,issues,
  note:'Overlapping heuristic categories are NOT a total count of bad lessons. Their absence would not prove independent pedagogy or actual Windows visual quality. Hardware title mismatch check currently targets wired NTC lessons; other device families need separate physical and terminal checks.'
 };
}
if(require.main===module){
 const r=audit();
 console.log(JSON.stringify(r,null,2));
}
module.exports={audit};
