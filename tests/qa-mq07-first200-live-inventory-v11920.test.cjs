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
  [194,'plc-hardware-programming-src-13','TWO_STATION_NATIVE_PENDING'],
  [195,'plc-hardware-programming-src-14','MISSING_REVERSE_MOTOR_CONTACTOR']
 ]){
  const row=report.rows[scene-1],candidate=scope.issues.find(r=>r.scNumber===scene);
  assert.ok(candidate,'Unresolved PLC title mismatch missing from live ledger: SC'+scene);
  assert.equal(row.id,id);
  assert.equal(candidate.id,id);
  assert.equal(candidate.titleIssue,reason);
  assert.equal(candidate.titleStatus,'REVIEW');
  assert.equal(candidate.wireCount,scene===194?22:18);
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

test('probeTarget virtual terminal and junction inventory catches contacts that native prepare would silently delete',()=>{
 const target={
  id:'fixture-probe',topicId:'measurement-workshop',title:'Synthetic probe scope',
  kind:'wiring',pedagogyReview:{physicalAcceptance:false},
  project:{
   components:[
    {id:'pr',typeId:'probe-red',label:'PR'},
    {id:'r1',typeId:'resistor',label:'R1'}
   ],
   junctions:[{id:'j1'}],
   wires:[{id:'w1',from:{c:'r1',p:'1'},to:{j:'j1'}}]
  },
  materials:[
   {componentId:'pr',typeId:'probe-red',label:'PR',why:'Native virtual contact to existing signal terminal'},
   {componentId:'r1',typeId:'resistor',label:'R1',why:'A physically real catalog resistor with two pins'}
  ]
 };
 const defs={
  'probe-red':{probeColor:'red',pins:[{id:'PLUG'},{id:'TIP'}]},
  resistor:{pins:[{id:'1'},{id:'2'}]}
 };
 const broken=x=>Inventory.inspectLesson(x,defs).issues.filter(i=>i.code==='INVALID_PROBE_TARGET');
 const make=contact=>{const p=structuredClone(target);p.project.components[0].probeTarget=contact;return p;};
 for(const good of [{c:'r1',p:'1'},{j:'j1'},{w:'w1'}])
  assert.deepEqual(broken(make(good)),[],'Valid native contact '+JSON.stringify(good));
 for(const bad of [{c:'r1',p:'99'},{c:'missing',p:'1'},{j:'missing'},{w:'missing'}])
  assert.equal(broken(make(bad)).length,1,'Invalid native contact not detected '+JSON.stringify(bad));
 const lead=make({w:'w2'});
 lead.project.components.push({id:'meter',typeId:'meter-multimeter',label:'M'});
 lead.materials.push({componentId:'meter',typeId:'meter-multimeter',label:'M',why:'Native multimeter probe connection'});
 defs['meter-multimeter']={kind:'multimeter',pins:[{id:'V'}]};
 lead.project.wires.push({id:'w2',from:{c:'meter',p:'V'},to:{c:'pr',p:'PLUG'}});
 assert.equal(broken(lead).length,1,'Floating measurement cable is not a valid probe contact');
 const nonProbe=make({c:'r1',p:'1'});
 nonProbe.project.components[1].probeTarget={c:'r1',p:'1'};
 assert.ok(Inventory.inspectLesson(nonProbe,defs).issues.some(i=>
  i.code==='PROBE_TARGET_ON_NON_PROBE'&&i.componentId==='r1'));
});

test('existing SC36/SC38 virtual measurement probes refer only to real catalog pins',()=>{
 for(const id of ['opamp-apps-src-01','opamp-apps-src-03']){
  const row=Inventory.inspectLesson(L.byId[id],definitions);
  assert.ok(!row.issues.some(issue=>
   issue.code==='INVALID_PROBE_TARGET'||issue.code==='PROBE_TARGET_ON_NON_PROBE'),
   'Source output probe contact not catalog-valid: '+id);
 }
});

test('first-200 graph inventory flags duplicate source wire and junction IDs as ambiguous probe targets',()=>{
 const original={
  id:'fixture-duplicate-contact-ids',title:'Synthetic ID collision',topicId:'measurement-workshop',
  kind:'wiring',pedagogyReview:{physicalAcceptance:false},
  project:{
   components:[{id:'pr',typeId:'probe',label:'PR'},{id:'r1',typeId:'resistor',label:'R1'}],
   junctions:[{id:'j1'},{id:'j1'}],
   wires:[
    {id:'w1',from:{c:'r1',p:'1'},to:{j:'j1'}},
    {id:'w1',from:{c:'r1',p:'2'},to:{j:'j1'}}
   ]
  },
  materials:[
   {componentId:'pr',typeId:'probe',label:'PR',why:'Sanal kırmızı ölçüm probunun temas noktasıdır.'},
   {componentId:'r1',typeId:'resistor',label:'R1',why:'İki fiziksel terminale sahip direnç örneğidir.'}
  ]
 };
 const defs={
  probe:{probeColor:'red',pins:[{id:'PLUG'},{id:'TIP'}]},
  resistor:{pins:[{id:'1'},{id:'2'}]}
 };
 const issues=p=>Inventory.inspectLesson(p,defs).issues;
 const wire=structuredClone(original);
 wire.project.components[0].probeTarget={w:'w1'};
 let findings=issues(wire);
 assert.ok(findings.some(x=>x.code==='DUPLICATE_WIRE_ID'&&x.wireId==='w1'));
 assert.ok(findings.some(x=>x.code==='AMBIGUOUS_PROBE_WIRE_TARGET'&&x.componentId==='pr'));
 assert.ok(!findings.some(x=>x.code==='INVALID_PROBE_TARGET'),
  'Both colliding wires have physically valid endpoints; ambiguity is distinct');
 const junction=structuredClone(original);
 junction.project.components[0].probeTarget={j:'j1'};
 findings=issues(junction);
 assert.ok(findings.some(x=>x.code==='DUPLICATE_JUNCTION_ID'&&x.junctionId==='j1'));
 assert.ok(findings.some(x=>x.code==='AMBIGUOUS_PROBE_JUNCTION_TARGET'&&x.componentId==='pr'));
 const unique=structuredClone(original);
 unique.project.junctions[1].id='j2';
 unique.project.wires[1].id='w2';
 unique.project.wires[1].to.j='j2';
 unique.project.components[0].probeTarget={w:'w2'};
 assert.deepEqual(issues(unique),[],
  'Distinct junction/wire IDs and catalog-valid endpoints must not be rejected');
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

 // Both identity mismatches used to pass the first-200 inventory because it
 // stringified pin and junction IDs. The real 1655 QA and Leads.resolve use
 // strict source/catalog identity, so a numeric 1 is not the pin text '1'.
 const typed={
  id:'fixture-strict-identities',title:'Strict terminal/junction fixture',
  topicId:'fixture',kind:'wiring',
  project:{
   components:[{id:'r',typeId:'strict-resistor',label:'R1'}],
   junctions:[{id:1}],
   wires:[{id:'w1',from:{c:'r',p:1},to:{j:'1'}}]
  },
  materials:[{componentId:'r',typeId:'strict-resistor',label:'R1',
   why:'One physical resistor and a junction for strict-ID regression'}]
 };
 const typedDefs={'strict-resistor':{pins:[{id:'1'},{id:'2'}]}};
 const before=Inventory.inspectLesson(typed,typedDefs).issues;
 assert.ok(before.some(i=>i.code==='INVALID_TERMINAL'&&i.pin===1),
  'Numeric terminal incorrectly aliases the real string pin ID');
 assert.ok(before.some(i=>i.code==='UNKNOWN_JUNCTION'),
  'String junction incorrectly aliases a numeric project junction ID');
 const corrected=structuredClone(typed);
 corrected.project.wires[0].from.p='1';
 corrected.project.wires[0].to.j=1;
 assert.deepEqual(Inventory.inspectLesson(corrected,typedDefs).issues,[],
  'Real source/catalog pin and junction identities must remain valid');
 // Material componentId also belongs to the native, type-sensitive ID
 // namespace. Numeric 1 and string '1' are DIFFERENT actual components:
 // String(componentId) formerly produced a fake duplicate material row.
 const mixed={
  id:'fixture-two-distinct-id-types',title:'Type-sensitive material IDs',
  topicId:'fixture',kind:'quiz',
  project:{components:[
   {id:1,typeId:'fixture-part',label:'N1'},
   {id:'1',typeId:'fixture-part',label:'T1'}
  ],wires:[]},
  materials:[
   {componentId:1,typeId:'fixture-part',label:'N1',why:'Numeric-ID component with its own role'},
   {componentId:'1',typeId:'fixture-part',label:'T1',why:'String-ID component with its own role'}
  ]
 };
 const materialDefs={'fixture-part':{pins:[{id:'A'}]}};
 assert.deepEqual(Inventory.inspectLesson(mixed,materialDefs).issues,[],
  'Different real component ID types must not look like duplicate materials');
 const duplicate=structuredClone(mixed);
 duplicate.materials[1].componentId=1;
 const badMaterials=Inventory.inspectLesson(duplicate,materialDefs).issues;
 assert.ok(badMaterials.some(i=>i.code==='DUPLICATE_MATERIAL_ROW'),
  'Repeated true material ID must still be rejected');
 assert.ok(badMaterials.some(i=>i.code==='MISSING_MATERIAL_ROW'&&i.componentId==='1'),
  'Unmatched string-ID component must still be reported');
 // This test formerly mentioned "invented acceptance" but never injected
 // a false acceptance claim. A review-tagged title must fail closed even
 // if its original circuit product and terminal identities stay unchanged.
 const forged={...lesson,pedagogyReview:{
  titleTopologyStatus:'REVIEW',
  titleTopologyIssue:'MISSING_REQUIRED_SECOND_MOTOR',
  physicalAcceptance:true,
  windowsVisualAcceptance:true,
  independentPedagogicalAcceptance:true
 }};
 const open=Inventory.inspectLesson(forged,{'fixture-part':{pins:[{id:'A'}]}});
 const contradiction=open.issues.find(i=>i.code==='OPEN_TITLE_WITH_ACCEPTANCE');
 assert.ok(contradiction,'Invented acceptance for a known title mismatch escaped QA');
 assert.deepEqual(Array.from(contradiction.fields),[
  'physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'
 ]);
 const unchanged={...forged,pedagogyReview:{
  ...forged.pedagogyReview,
  physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false
 }};
 assert.ok(!Inventory.inspectLesson(unchanged,{'fixture-part':{pins:[{id:'A'}]}})
  .issues.some(i=>i.code==='OPEN_TITLE_WITH_ACCEPTANCE'),
  'Explicitly unaccepted title review must not produce a false positive');
});
