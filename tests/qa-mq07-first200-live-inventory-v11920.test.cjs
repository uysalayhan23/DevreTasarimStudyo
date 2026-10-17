'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Inventory=require('../scripts/qa-mq07-first200-live-inventory-v11920.cjs');
const L=QA.curriculum(),definitions=QA.catalog();

test('SC001-SC200 inventory names all canonical lessons without implying acceptance',()=>{
 const report=Inventory.audit({L,defs:definitions});
 assert.equal(report.scope.start,1);
 assert.equal(report.scope.end,200);
 assert.equal(report.scope.read,200);
 assert.equal(report.scope.distinctIds,200);
 assert.equal(report.rows[0].id,'button-led-1');
 assert.equal(report.rows[199].id,'oscillator-filter-apps-src-19');
 assert.equal(report.acceptance.first200,'REVIEW');
 assert.equal(report.acceptance.nativeNode,'NOT_RUN');
 assert.equal(report.acceptance.windowsVisual,'NOT_RUN');
 assert.equal(report.acceptance.physicalManufacturer,'NOT_ACCEPTED');
 assert.equal(report.summary.earlyReviewRowsWithinBatch,report.earlyReviewSnapshot.count);
 assert.ok(report.rows.every(x=>typeof x.id==='string'&&Array.isArray(x.issues)));
});

test('all 51 historical first-200 no-wire entries are traceable without auto-acceptance',()=>{
 const r=Inventory.audit({L,defs:definitions}),history=r.historicalNoWireTriage;
 assert.equal(history.originalCount,51);
 assert.equal(history.matchedLiveLessons,51);
 assert.equal(history.oldConceptPreserve,14);
 assert.equal(history.oldApplicationCandidates,37);
 assert.equal(history.applicationsWithWiresNow+history.applicationsWithoutWiresNow,37);
 const related=r.rows.filter(row=>row.historicalNoWire);
 assert.equal(new Set(related.map(row=>row.id)).size,51);
 for(const row of related){
  assert.equal(row.historicalNoWire.scope,'HISTORICAL_REFERENCE_ONLY');
  assert.equal(row.historicalNoWire.wireCountNow,row.wireCount);
  assert.equal(row.physicalAcceptance,false,'No old reference accepted as physical: '+row.id);
  assert.equal(row.independentPedagogicalAcceptance,false,'No independent review assumed: '+row.id);
 }
 // Repaired applications can acquire wires; that is evidence of a graph,
 // NOT proof of functional behavior or physical product acceptance.
 assert.equal(r.acceptance.first200,'REVIEW');
 assert.equal(r.acceptance.windowsVisual,'NOT_RUN');
});

test('SC124 actual UNO and OLED materials match the two unconnected source components',()=>{
 const report=Inventory.audit({L,defs:definitions});
 const row=report.rows.find(x=>x.id==='microcontroller-apps-src-15');
 assert.ok(row,'SC124 not found');
 assert.equal(row.kind,'quiz');
 assert.equal(row.componentCount,2);
 assert.equal(row.wireCount,0);
 assert.equal(row.materialCount,2);
 assert.deepEqual(row.issues,[]);
 assert.equal(row.physicalAcceptance,false);
 assert.equal(row.windowsVisualAcceptance,false);
 assert.equal(row.independentPedagogicalAcceptance,false);
});

test('motor and PLC review ledger keeps canonical SC order and unresolved title topology',()=>{
 const report=Inventory.audit({L,defs:definitions});
 const scope=report.motorPlcReview;
 assert.equal(scope.acceptance,'REVIEW_NATIVE_AND_WINDOWS_PENDING');
 assert.ok(scope.inspected>0);
 assert.equal(scope.withWires+scope.unwiredReference,scope.inspected);
 assert.equal(scope.titleIssueCount,scope.issues.filter(x=>x.titleIssue).length);
 assert.ok(scope.structuralIssueCount<=scope.issues.length);
 assert.deepEqual(Array.from(report.rows,r=>r.scNumber),Array.from({length:200},(_,i)=>i+1));
 for(const [scene,id,reason] of [
  [194,'plc-hardware-programming-src-13','MISSING_SECOND_START_STOP_STATION'],
  [195,'plc-hardware-programming-src-14','MISSING_REVERSE_MOTOR_CONTACTOR']
 ]){
  const row=report.rows[scene-1],candidate=scope.issues.find(r=>r.scNumber===scene);
  assert.ok(candidate,'Unresolved PLC title mismatch missing from live ledger: SC'+scene);
  assert.equal(row.id,id);
  assert.equal(candidate.id,id);
  assert.equal(candidate.titleIssue,reason);
  assert.equal(candidate.titleStatus,'REVIEW');
  assert.equal(candidate.wireCount,18);
  assert.equal(candidate.physicalAcceptance,false);
  assert.equal(candidate.windowsVisualAcceptance,false);
  assert.equal(candidate.independentPedagogicalAcceptance,false);
 }
 assert.equal(report.acceptance.first200,'REVIEW');
 assert.equal(report.acceptance.nativeNode,'NOT_RUN');
});

test('first-200 inventory catches stale learner-facing material labels on correct catalog IDs',()=>{
 const lesson={
  id:'fixture-plc-label',title:'Synthetic review sample',topicId:'plc-hardware-programming',
  kind:'quiz',pedagogyReview:{physicalAcceptance:false},
  project:{components:[{id:'plc',typeId:'real-plc',label:'S7-1211C DC/DC/DC'}],wires:[]},
  materials:[{componentId:'plc',typeId:'real-plc',label:'Wrong PLC model',why:'Correct product explanation but misleading label.'}]
 };
 const catalog={'real-plc':{pins:[{id:'L+'},{id:'M'}]}};
 const issue=Inventory.inspectLesson(lesson,catalog).issues;
 assert.ok(issue.some(x=>x.code==='MATERIAL_LABEL_MISMATCH'&&x.componentId==='plc'));
 assert.ok(!issue.some(x=>x.code==='MATERIAL_TYPE_MISMATCH'),
  'Stale label must be detected even if the type is correct');
 const fixed=structuredClone(lesson);
 fixed.materials[0].label=fixed.project.components[0].label;
 assert.ok(!Inventory.inspectLesson(fixed,catalog).issues.some(x=>x.code==='MATERIAL_LABEL_MISMATCH'));
});

test('inventory catches missing material, stale type, unknown terminal and invented acceptance',()=>{
 const lesson={id:'fixture-review',title:'Synthetic read-only fixture',topicId:'fixture',
  kind:'quiz',pedagogyReview:{physicalAcceptance:false},project:{
   components:[{id:'board',typeId:'fixture-part'}],
   wires:[{from:{c:'board',p:'A'},to:{c:'board',p:'UNSUPPORTED'}}]
  },materials:[{componentId:'board',typeId:'wrong-type',label:'Test',why:'The explanation must match the source component.'}]
 };
 const inspected=Inventory.inspectLesson(lesson,{'fixture-part':{pins:[{id:'A'}]}});
 const codes=inspected.issues.map(i=>i.code);
 assert.ok(codes.includes('MATERIAL_TYPE_MISMATCH'));
 assert.ok(codes.includes('INVALID_TERMINAL'));
 assert.equal(inspected.physicalAcceptance,false);
 const missing={...lesson,project:{...lesson.project,wires:[]},materials:[]};
 const absent=Inventory.inspectLesson(missing,{'fixture-part':{pins:[{id:'A'}]}});
 assert.ok(absent.issues.some(i=>i.code==='MISSING_MATERIAL_ROW'));
 assert.equal(absent.contentClass,'QUIZ_OR_REFERENCE');
});
