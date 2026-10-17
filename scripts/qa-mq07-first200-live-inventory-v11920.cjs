'use strict';
// Read-only MQ-07 SC001..SC200 final-curriculum inventory.
// An inventory is not independent teaching, Windows visual, or physical acceptance.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const HistoricNoWire=require('../evidence/mq07_51_no_wire_triage_20261015.json');

function inspectLesson(lesson,definitions={},earlyReviewReason=null,historicalTriage=null){
 const p=lesson.project||{},parts=Array.isArray(p.components)?p.components:[],
  wires=Array.isArray(p.wires)?p.wires:[],
  materials=Array.isArray(lesson.materials)?lesson.materials:[],
  junctions=new Set((p.junctions||[]).map(x=>x.id)),
  components=new Map(parts.map(x=>[x.id,x])),
  issues=[];
 if(!lesson.project||!Array.isArray(p.components)||!Array.isArray(p.wires))
  issues.push({code:'MISSING_PROJECT_GRAPH'});
 if(components.size!==parts.length)issues.push({code:'DUPLICATE_COMPONENT_ID'});
 // Native wire/junction contacts are ID-based. Duplicate IDs turn an
 // otherwise catalog-valid virtual probe target into an ambiguous route.
 const duplicateWireIds=new Set(),wireIds=new Set();
 for(const wire of wires){
  if(wire.id==null||wire.id==='')continue;
  if(wireIds.has(wire.id)){
   duplicateWireIds.add(wire.id);
   issues.push({code:'DUPLICATE_WIRE_ID',wireId:wire.id});
  }
  wireIds.add(wire.id);
 }
 const duplicateJunctionIds=new Set(),junctionIds=new Set();
 for(const junction of p.junctions||[]){
  if(junction.id==null||junction.id==='')continue;
  if(junctionIds.has(junction.id)){
   duplicateJunctionIds.add(junction.id);
   issues.push({code:'DUPLICATE_JUNCTION_ID',junctionId:junction.id});
  }
  junctionIds.add(junction.id);
 }
 const seen=new Set();
 for(const m of materials){
  const component=components.get(m.componentId),key=m.componentId;
  if(seen.has(key))issues.push({code:'DUPLICATE_MATERIAL_ROW',componentId:m.componentId});
  seen.add(key);
  if(!component)issues.push({code:'ORPHAN_MATERIAL_ROW',componentId:m.componentId});
  else{
   if(m.typeId!==component.typeId)issues.push({code:'MATERIAL_TYPE_MISMATCH',componentId:component.id});
   // A stale learner-facing label can misidentify a correct physical product.
   // This is exactly the SC114 ADC0804 mismatch that type-only QA missed.
   const displayed=String(component.label||component.ref||'').trim();
   if(displayed&&String(m.label||'').trim()!==displayed)
    issues.push({code:'MATERIAL_LABEL_MISMATCH',componentId:component.id,componentLabel:displayed,materialLabel:String(m.label||'').trim()});
  }
  if(!m.label||typeof m.why!=='string'||m.why.trim().length<16)
   issues.push({code:'MISSING_MATERIAL_EXPLANATION',componentId:m.componentId});
 }
 for(const c of parts){
  if(!seen.has(c.id))issues.push({code:'MISSING_MATERIAL_ROW',componentId:c.id});
  if(!definitions[c.typeId])issues.push({code:'UNKNOWN_COMPONENT_TYPE',componentId:c.id,typeId:c.typeId});
 }
 for(const [i,w] of wires.entries())for(const side of ['from','to']){
  const end=w[side];
  if(end?.j!==undefined){
   if(!junctions.has(end.j))issues.push({code:'UNKNOWN_JUNCTION',wire:i,side});
  }else{
   const component=components.get(end?.c),def=definitions[component?.typeId];
   if(!component||!def?.pins?.some(pin=>pin.id===end?.p))
    issues.push({code:'INVALID_TERMINAL',wire:i,side,componentId:end?.c,pin:end?.p});
  }
 }
 // Unlike physical wires, a movable probe contact is not listed in
 // project.wires. Leads.resolve() silently rejects invalid contacts and
 // Leads.prepare() removes them; inspect the source BEFORE that happens.
 // Mirror native Leads.resolve's strict IDs and pin equality, including
 // wire-ID and junction contacts (not just direct component terminals).
 for(const c of parts){
  if(c.probeTarget==null)continue;
  const def=definitions[c.typeId],target=c.probeTarget;
  if(!def?.probeColor){
   issues.push({code:'PROBE_TARGET_ON_NON_PROBE',componentId:c.id});
   continue;
  }
  let exists=false;
  if(target?.w){
   const wire=wires.find(x=>x.id===target.w);
   const from=wire?.from,to=wire?.to;
   // Equivalent to probe-leads.js info(): only a probe PLUG or a
   // multimeter/clamp jack makes this a floating measurement lead.
   const isProbeLead=[from,to].some(e=>{
    const other=components.get(e?.c),d=definitions[other?.typeId];
    return (!!d?.probeColor&&e?.p==='PLUG')||
     (d?.kind==='multimeter'&&['COM','V','10A'].includes(e?.p))||
     (d?.kind==='clamp-meter'&&['COM','V'].includes(e?.p));
   });
   exists=!!wire&&!isProbeLead;
  }else if(target?.j){
   exists=(p.junctions||[]).some(j=>j.id===target.j);
  }else{
   const part=components.get(target?.c),partDef=definitions[part?.typeId];
   exists=!!partDef?.pins?.some(pin=>pin.id===target?.p);
  }
  if(target?.w&&duplicateWireIds.has(target.w))
   issues.push({code:'AMBIGUOUS_PROBE_WIRE_TARGET',componentId:c.id,wireId:target.w});
  if(target?.j&&duplicateJunctionIds.has(target.j))
   issues.push({code:'AMBIGUOUS_PROBE_JUNCTION_TARGET',componentId:c.id,junctionId:target.j});
  if(!exists)issues.push({code:'INVALID_PROBE_TARGET',componentId:c.id,target});
 }
 const review=lesson.pedagogyReview||{};
 // A known title/topology mismatch is not a physical, Windows, or
 // independent-pedagogy acceptance, even if a later overlay accidentally
 // flips a boolean. Protect actual reviewed lessons only, not locked golden
 // samples that have no outstanding title defect.
 if(review.titleTopologyIssue||review.titleTopologyStatus==='REVIEW'){
  const unsupported=['physicalAcceptance','windowsVisualAcceptance',
   'independentPedagogicalAcceptance'].filter(k=>review[k]===true);
  if(unsupported.length)
   issues.push({code:'OPEN_TITLE_WITH_ACCEPTANCE',fields:unsupported,
    reason:review.titleTopologyIssue||'REVIEW'});
  // Motor/PLC scope flags describe *the missing function itself*. The
  // generic physical/Windows/independent gate above cannot catch a forged
  // multi-motor, braking, special-motor or advanced-PLC PASS while all
  // three generic gates remain false. Only inspect documented scopes.
  const scoped={
   SC156_SC163:'brakingAcceptance',
   SC164_SC171:'specialMotorAcceptance',
   SC172_SC181:'multiMotorAcceptance'
  };
  const field=scoped[review.mq07MotorScope]||
   (review.mq07PlcScope==='SC182_SC200'?'plcAdvancedLogicAcceptance':null);
  if(field&&review[field]===true)
   issues.push({code:'OPEN_TITLE_WITH_UNVERIFIED_FUNCTION',
    field,reason:review.titleTopologyIssue||'REVIEW'});
 }
 return {
  id:lesson.id,title:lesson.title,topicId:lesson.topicId,kind:lesson.kind,
  currentTitleStatus:review.titleTopologyStatus||null,
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
 const rows=first200.map((l,i)=>({
  ...inspectLesson(l,definitions,earlyById.get(l.id),historyById.get(l.id)),
  scNumber:i+1
 }));
 const byClass={};
 for(const row of rows)byClass[row.contentClass]=(byClass[row.contentClass]||0)+1;
 const ids=rows.map(r=>r.id),unique=new Set(ids);
 const related=rows.filter(r=>r.historicalNoWire);
 // Live per-ID, not historical fixed-count, classification. Motor/PLC title
 // scope must remain visible even when all terminals and wires are valid.
 const motorPlc=rows.filter(r=>/^motor-/.test(r.topicId||'')||r.topicId==='plc-hardware-programming');
 const motorPlcTitleIssues=motorPlc.filter(r=>r.currentTitleIssue);
 const motorPlcStructuralIssues=motorPlc.filter(r=>r.issues.length);
 const motorPlcReview={
  inspected:motorPlc.length,
  withWires:motorPlc.filter(r=>r.wireCount>0).length,
  unwiredReference:motorPlc.filter(r=>!r.wireCount).length,
  titleIssueCount:motorPlcTitleIssues.length,
  structuralIssueCount:motorPlcStructuralIssues.length,
  issues:motorPlc.filter(r=>r.currentTitleIssue||r.issues.length).map(r=>({
   scNumber:r.scNumber,id:r.id,title:r.title,topicId:r.topicId,
   kind:r.kind,wireCount:r.wireCount,
   titleIssue:r.currentTitleIssue,titleStatus:r.currentTitleStatus,
   structuralIssues:r.issues,
   physicalAcceptance:r.physicalAcceptance,
   windowsVisualAcceptance:r.windowsVisualAcceptance,
   independentPedagogicalAcceptance:r.independentPedagogicalAcceptance
  })),
  acceptance:'REVIEW_NATIVE_AND_WINDOWS_PENDING'
 };
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
  motorPlcReview,
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
