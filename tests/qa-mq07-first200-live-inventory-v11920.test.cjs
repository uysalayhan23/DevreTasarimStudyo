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
