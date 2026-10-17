'use strict';
// Read-only MQ-07 SC001..SC200 final-curriculum inventory.
// An inventory is not independent teaching, Windows visual, or physical acceptance.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const HistoricNoWire=require('../evidence/mq07_51_no_wire_triage_20261015.json');

function inspectLesson(lesson,definitions={},earlyReviewReason=null,historicalTriage=null){
 const p=lesson.project||{},parts=Array.isArray(p.components)?p.components:[],
  wires=Array.isArray(p.wires)?p.wires:[],
  materials=Array.isArray(lesson.materials)?lesson.materials:[],
  junctions=new Set((p.junctions||[]).map(x=>String(x.id))),
  components=new Map(parts.map(x=>[x.id,x])),
  issues=[];
 if(!lesson.project||!Array.isArray(p.components)||!Array.isArray(p.wires))
  issues.push({code:'MISSING_PROJECT_GRAPH'});
 if(components.size!==parts.length)issues.push({code:'DUPLICATE_COMPONENT_ID'});
 const seen=new Set();
 for(const m of materials){
  const component=components.get(m.componentId),key=String(m.componentId);
  if(seen.has(key))issues.push({code:'DUPLICATE_MATERIAL_ROW',componentId:m.componentId});
  seen.add(key);
  if(!component)issues.push({code:'ORPHAN_MATERIAL_ROW',componentId:m.componentId});
  else if(m.typeId!==component.typeId)issues.push({code:'MATERIAL_TYPE_MISMATCH',componentId:component.id});
  if(!m.label||typeof m.why!=='string'||m.why.trim().length<16)
   issues.push({code:'MISSING_MATERIAL_EXPLANATION',componentId:m.componentId});
 }
 for(const c of parts){
  if(!seen.has(String(c.id)))issues.push({code:'MISSING_MATERIAL_ROW',componentId:c.id});
  if(!definitions[c.typeId])issues.push({code:'UNKNOWN_COMPONENT_TYPE',componentId:c.id,typeId:c.typeId});
 }
 for(const [i,w] of wires.entries())for(const side of ['from','to']){
  const end=w[side];
  if(end?.j!==undefined){
   if(!junctions.has(String(end.j)))issues.push({code:'UNKNOWN_JUNCTION',wire:i,side});
  }else{
   const component=components.get(end?.c),def=definitions[component?.typeId];
   if(!component||!def?.pins?.some(pin=>String(pin.id)===String(end?.p)))
    issues.push({code:'INVALID_TERMINAL',wire:i,side,componentId:end?.c,pin:end?.p});
  }
 }
 const review=lesson.pedagogyReview||{};
 return {
  id:lesson.id,title:lesson.title,topicId:lesson.topicId,kind:lesson.kind,
  designStandard:lesson.designStandard||null,
  componentCount:parts.length,wireCount:wires.length,materialCount:materials.length,
  earlyReviewReason:earlyReviewReason||null,
  // Historical triage is not final curriculum truth or simulated acceptance.
  // Keep its classification and original wire count next to today's live state.
  historicalNoWire:historicalTriage?{
   class:historicalTriage.classification,
   wireCountThen:historicalTriage.wiresBefore,
   wireCountNow:wires.length,
   sourceKindThen:historicalTriage.sourceKind,
   scope:'HISTORICAL_REFERENCE_ONLY'
  }:null,
  currentTitleIssue:review.titleTopologyIssue||null,
  physicalAcceptance:review.physicalAcceptance===true,
  windowsVisualAcceptance:review.windowsVisualAcceptance===true,
  independentPedagogicalAcceptance:review.independentPedagogicalAcceptance===true,
  contentClass:lesson.designStandard==='rich-reference-v1'?'PROTECTED_RICH':
   lesson.kind==='quiz'?'QUIZ_OR_REFERENCE':
   wires.length?'WIRED_SCENE':'UNWIRED_REVIEW',
  issues
 };
}
function audit({L,defs}={}){
 const curriculum=L||QA.curriculum(),definitions=defs||QA.catalog();
 const first200=curriculum.lessons.slice(0,200),early=curriculum.mq07Batch200?.reviewIds||[];
 const earlyById=new Map(early.map(x=>[x.id,x.reason]));
 const historical=HistoricNoWire.entries||[];
 const historyById=new Map(historical.map(e=>[e.id,e]));
 const rows=first200.map(l=>inspectLesson(l,definitions,earlyById.get(l.id),historyById.get(l.id)));
 const byClass={};
 for(const row of rows)byClass[row.contentClass]=(byClass[row.contentClass]||0)+1;
 const ids=rows.map(r=>r.id),unique=new Set(ids);
 const related=rows.filter(r=>r.historicalNoWire);
 const historicalConcept=related.filter(r=>r.historicalNoWire.class==='CONCEPT_PRESERVE');
 const historicalApplication=related.filter(r=>r.historicalNoWire.class==='APPLICATION_REPAIR_QUEUE');
 return {
  qa:'MQ-07 SC001-SC200 live source inventory',
  scope:{start:1,end:200,read:rows.length,distinctIds:unique.size,expected:200},
  earlyReviewSnapshot:{count:early.length,note:'Earlier phase snapshot; not all final unaccepted lessons or all defects'},
  historicalNoWireTriage:{
   originalCount:historical.length,matchedLiveLessons:related.length,
   oldConceptPreserve:historicalConcept.length,oldApplicationCandidates:historicalApplication.length,
   applicationsWithWiresNow:historicalApplication.filter(r=>r.wireCount>0).length,
   applicationsWithoutWiresNow:historicalApplication.filter(r=>r.wireCount===0).length,
   preservedConceptsStillUnwired:historicalConcept.filter(r=>r.wireCount===0&&r.kind==='quiz').length,
   note:'Historical 51-list is a triage set, not a live fix-count or acceptance decision'
  },
  summary:{byClass,structuralIssueLessons:rows.filter(r=>r.issues.length).length,
   structuralIssues:rows.reduce((n,r)=>n+r.issues.length,0),
   currentTitleReviewLessons:rows.filter(r=>r.currentTitleIssue).length,
   earlyReviewRowsWithinBatch:rows.filter(r=>r.earlyReviewReason).length},
  acceptance:{first200:'REVIEW',nativeNode:'NOT_RUN',windowsVisual:'NOT_RUN',
   independentPedagogy:'NOT_RUN',physicalManufacturer:'NOT_ACCEPTED'},
  rows
 };
}
if(require.main===module){
 const result=audit();
 if(process.argv.includes('--summary')){
  const {rows,...summary}=result;
  process.stdout.write(JSON.stringify({...summary,structuralIssuesByLesson:rows
   .filter(row=>row.issues.length).map(row=>({id:row.id,issues:row.issues}))},null,2)+'\n');
 }else process.stdout.write(JSON.stringify(result,null,2)+'\n');
}
module.exports={inspectLesson,audit};
