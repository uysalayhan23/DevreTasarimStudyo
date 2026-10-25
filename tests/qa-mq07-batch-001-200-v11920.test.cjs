'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const {audit:semanticAudit}=require('../scripts/qa-tutorial-pedagogical-depth-v11920.cjs');
const L=QA.curriculum(),batch=L.mq07Batch200;

test('MQ07 001-200 scoped content is rewritten in actual curriculum without touching locked rich and earlier pilot',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 assert.equal(batch.examined,200);
 assert.equal(batch.richProtected,101);
 assert.equal(batch.earlierProtected,11);
 assert.equal(batch.enrichedWired,32);
 assert.equal(batch.enrichedReference,56);
 assert.equal(batch.updatedIds.length,88);
 assert.equal(L.lessons[0].id,'button-led-1');
 assert.equal(L.lessons[199].id,'oscillator-filter-apps-src-19');
 assert.equal(batch.updatedIds.filter(x=>L.byId[x].designStandard==='rich-reference-v1').length,0);
});

test('88 new lessons have topic-specific causal content, real terminal steps and honest reference-only review',()=>{
 for(const id of batch.updatedIds){
  const l=L.byId[id],wired=l.project.wires.length&&l.kind!=='quiz'&&!l.project.referenceOnly;
  assert.ok(l.summary.length>85,id+' incomplete purpose');
  assert.ok(l.explanation.length>160,id+' incomplete mechanism');
  assert.ok(l.learningGoal.length>50,id+' missing goal');
  assert.ok(l.beginnerSteps.length>=4,id+' missing activity');
  assert.ok(!/Gerçek bağlantı adımları:|Bu derste yalnız “/.test(l.explanation),id+' generic text');
  assert.equal(l.pedagogyReview.mq07Batch,'001_200');
  assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
  if(l.pedagogyReview.sensor24vV1){
   assert.equal(l.project.wires.length,7);
   assert.match(l.explanation,/B1/);
   assert.match(l.explanation,/K1\/13/);
  }else if(!wired){
   assert.equal(l.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
   assert.match(l.explanation,/Devre çizimi ve fiziksel sonuç bu sayfada doğrulanmış değildir/);
  }else{
   assert.ok(l.explanation.length>160,id+' missing causal description');
   const any=l.project.wires.find(w=>w.from?.c&&w.to?.c&&String(w.role||'')!=='MEASURE');
   assert.ok(any,id+' no functional wire');
  }
 }
});

test('LDR comparator contains real photo-resistor graph instead of mislabeled potentiometer',()=>{
 const l=L.byId['opamp-apps-src-07'],p=l.project;
 assert.ok(p.components.some(c=>c.typeId==='ldr-gl5528'));
 assert.ok(!p.components.some(c=>c.typeId==='potentiometer'));
 assert.ok(p.wires.some(w=>w.from?.c==='s1'&&w.to?.c==='u1'&&w.to?.p==='3'));
 assert.ok(p.wires.some(w=>w.from?.c==='r2'&&w.to?.c==='u1'&&w.to?.p==='2'));
 assert.ok(p.wires.some(w=>w.from?.c==='g1'&&w.from.p==='P'&&w.to?.c==='u1'&&w.to.p==='8'));
 assert.ok(p.wires.some(w=>w.from?.c==='g1'&&w.from.p==='M'&&w.to?.c==='u1'&&w.to.p==='4'));
 assert.equal(p.wires.length,12);
 const defs=QA.catalog(),check=Simulation.solve(JSON.parse(JSON.stringify(p)),defs,{now:0});
 assert.equal(check.stable,true);
 assert.ok(!check.blocked&&!check.shortCircuit&&!check.oscillating);
});

test('SC07-SC08 grounding and insulation measurement references never masquerade as working meters',()=>{
 const defs=QA.catalog();
 const scenarios=[
  ['installation-grounding-src-07',['tutorial-earth-tester','ground'],/Topraklama direnci ölçer/i,/Ω/],
  ['installation-grounding-src-08',['tutorial-insulation-tester','terminal-2','ground'],/Yalıtkanlık direnci ölçer/i,/MΩ/]
 ];
 for(const [id,expectedTypes,deviceName,unit] of scenarios){
  const lesson=L.byId[id];
  assert.ok(lesson,id+' lesson missing');
  assert.equal(lesson.kind,'quiz',id+' cannot be promoted to working wiring');
  assert.equal(lesson.project.wires.length,0,id+' cannot invent measurements');
  assert.deepEqual(Array.from(lesson.project.components,c=>c.typeId),expectedTypes,id+' real references changed');
  assert.equal(lesson.materials.length,expectedTypes.length,id+' material count');
  for(let i=0;i<expectedTypes.length;i++){
   const c=lesson.project.components[i],m=lesson.materials[i];
   assert.equal(m.componentId,c.id,id+' material component');
   assert.equal(m.typeId,c.typeId,id+' material type');
   assert.ok(m.label&&m.why?.length>45,id+' component role missing '+i);
   assert.ok(defs[c.typeId],id+' unknown component '+c.typeId);
  }
  assert.match(lesson.summary,deviceName,id+' summary detached from device');
  assert.match(lesson.explanation,deviceName,id+' explanation detached from device');
  assert.match(lesson.learningGoal,deviceName,id+' learning goal detached from device');
  assert.match(lesson.explanation,unit,id+' missing explicit measurement limitation');
  assert.match(lesson.materials[0].why,unit,id+' meter role invents measurement');
  assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
  assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
  assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
  assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 }
 assert.equal(defs['tutorial-earth-tester'].pins.length,0,'SC07 display-only earth tester gained unverified terminals');
 assert.deepEqual(Array.from(defs['tutorial-insulation-tester'].pins,p=>p.id),['L','E']);
});

test('SC10 RCD material roles match unwired reference and never claim overcurrent or measured trip',()=>{
 const lesson=L.byId['installation-grounding-src-10'];
 assert.ok(lesson,'SC10 lesson missing');
 const p=lesson.project;
 const expected=['supply-1p','rcd-2p','socket-power','ground'];
 assert.equal(lesson.kind,'quiz');
 assert.equal(p.referenceOnly,true);
 assert.equal(p.wires.length,0,'SC10 cannot invent an energized RCD circuit');
 assert.deepEqual(Array.from(p.components,c=>c.typeId),expected);
 assert.equal(lesson.materials.length,expected.length);
 for(let i=0;i<expected.length;i++){
  assert.equal(lesson.materials[i].componentId,p.components[i].id);
  assert.equal(lesson.materials[i].typeId,expected[i]);
 }
 assert.match(lesson.materials[1].why,/faz ile nötrden geçen akımların farkını/);
 assert.match(lesson.materials[1].why,/aşırı akım veya kısa devre koruma cihazı değildir/);
 assert.match(lesson.materials[1].why,/açma eşiği, süresi veya gerçek akım farkı simüle edilmez/);
 assert.match(lesson.materials[2].why,/kablolanmış değildir/);
 assert.match(lesson.materials[3].why,/PE sürekliliği ölçülmez/);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
});

test('SC36 and SC38 ACV probe descriptions cannot certify mixed-source AC gain',()=>{
 const defs=QA.catalog();
 const Meter=require('../dist/multimeter.js');
 for(const id of ['opamp-apps-src-01','opamp-apps-src-03']){
  const lesson=L.byId[id],p=lesson?.project;
  assert.ok(lesson&&p,id+' source lesson missing');
  assert.equal(lesson.kind,'wiring');
  assert.ok(p.wires.length>0,id+' original graph missing');
  assert.ok(p.components.some(c=>c.id==='in'&&c.typeId==='arduino-signal-generator'),id+' AC signal source missing');
  assert.ok(p.components.some(c=>c.id==='g1'&&c.typeId==='supply-dc-plus'),id+' DC op-amp supply missing');
  const m=p.components.find(c=>c.id==='v1');
  assert.ok(m&&m.typeId==='unit-ut33d-plus',id+' actual UT33D+ meter missing');
  assert.deepEqual(Array.from(Meter.setting(m,defs[m.typeId])),['ACV',600]);
  const red=p.components.find(c=>c.id==='v1-red'),black=p.components.find(c=>c.id==='v1-black');
  assert.equal(red?.probeTarget?.c,'u1',id+' output probe target');
  assert.ok(['OUT','1'].includes(red.probeTarget.p),id+' output pin identifier');
  assert.equal(black?.probeTarget?.c,'g1',id+' common reference target');
  assert.equal(black.probeTarget.p,'M');
  const material=lesson.materials.find(row=>row.componentId===m.id);
  assert.ok(material&&material.typeId===m.typeId,id+' meter material identity mismatch');
  assert.match(material.why,/ACV 600 V/);
  assert.match(material.why,/OL/);
  assert.match(lesson.explanation,/karışık AC\/DC kaynak uyarısı ve OL gösterebilir/);
  assert.match(lesson.explanation,/dinamik solver kanıtına kadar REVIEW/);
  assert.ok(lesson.beginnerSteps.some(s=>s.includes('OL')&&s.includes('kazanç ölçümü')));
  assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
  assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
  assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 }
});

test('SC114 external ADC0804 physical label and learner material must agree',()=>{
 const lesson=L.byId['microcontroller-apps-src-05'];
 assert.ok(lesson,'Missing SC114 source lesson');
 assert.equal(lesson.kind,'quiz');
 assert.equal(lesson.project.wires.length,0,'SC114 is an unwired reference, not a measured ADC');
 const external=lesson.project.components.find(c=>c.typeId==='adc0804lcn');
 assert.ok(external,'SC114 external ADC0804 missing');
 assert.match(external.label,/ADC0804/);
 assert.match(external.label,/harici ADC/);
 assert.doesNotMatch(external.label,/^UNO içindeki ADC işlevi$/);
 const material=lesson.materials.find(m=>m.componentId===external.id);
 assert.ok(material,'SC114 external ADC learner material missing');
 assert.equal(material.typeId,external.typeId);
 assert.equal(material.label,external.label,'SC114 physical and material labels diverged');
 assert.match(material.why,/harici 8-bit/);
 assert.match(material.why,/dahili 10-bit/);
 assert.match(material.why,/kurulmadığından/);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
});

test('SC124 I2C reference material list includes UNO and actual OLED without invented wiring',()=>{
 const lesson=L.byId['microcontroller-apps-src-15'];
 assert.ok(lesson,'Missing SC124 curriculum record');
 assert.equal(lesson.kind,'quiz');
 assert.equal(lesson.project.wires.length,0,'SC124 must not invent active I2C wiring');
 assert.equal(lesson.project.components.length,2,'SC124 board must retain UNO and OLED');
 assert.equal(lesson.materials.length,lesson.project.components.length,'SC124 materials must follow parts');
 const expected=['arduino-uno','arduino-oled-i2c'];
 assert.equal(lesson.project.components.map(c=>c.typeId).join(','),expected.join(','));
 for(let i=0;i<expected.length;i++){
  const c=lesson.project.components[i],material=lesson.materials[i];
  assert.equal(material.componentId,c.id,'SC124 material must identify its real component');
  assert.equal(material.typeId,c.typeId,'SC124 material type must match source');
  assert.ok(material.label&&material.why?.length>40,'SC124 material explanation missing');
 }
 assert.match(lesson.materials[1].why,/I2C/);
 assert.match(lesson.materials[1].why,/SDA\/SCL/);
 assert.match(lesson.materials[1].why,/bağlı değildir/);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
});

test('remaining first-200 source reviews stay traceable, never silently accepted',()=>{
 // The old hardcoded 47 was a dated interim inventory. After later source
 // corrections, the early batch ledger and final lesson states may differ.
 // Keep strict per-ID ownership, nonempty issue reasons and fail-closed gates.
 const reviewIds=batch.reviewIds;
 const validReasons=new Set([
  'NO_WIRED_CIRCUIT','TITLE_MISSING_REQUIRED_PART',
  'MISSING_REQUIRED_SECOND_INPUT','MISSING_DIMMER_POWER_STAGE',
  'NO_RC_TIMING_EVIDENCE'
 ]);
 const updatedIds=new Set(batch.updatedIds);
 assert.ok(reviewIds.length>0,'Batch still has unaccepted technical review records');
 assert.equal(new Set(reviewIds.map(x=>x.id)).size,reviewIds.length,'Duplicate technical review ID');
 for(const row of reviewIds){
  assert.ok(updatedIds.has(row.id),'Review ID outside 001-200 scoped updates: '+row.id);
  assert.ok(L.byId[row.id],'Missing review lesson: '+row.id);
  assert.ok(validReasons.has(row.reason),'Unclassified review issue: '+row.id+' '+row.reason);
  assert.notEqual(L.byId[row.id].pedagogyReview?.physicalAcceptance,true,'Physical review incorrectly accepted: '+row.id);
 }
 assert.equal(batch.reviewIds.some(x=>['opamp-apps-src-11','opamp-apps-src-12'].includes(x.id)),false,'two-input source topology now repaired');
 assert.equal(batch.reviewIds.some(x=>x.id==='sensor-analog-apps-src-11'),false);
 assert.ok(L.byId['sensor-analog-apps-src-11'].project.components.some(c=>c.virtualLdrDimmer));
 assert.equal(batch.reviewIds.some(x=>x.id==='opamp-apps-src-07'),false);
 assert.equal(semanticAudit({L}).fullPedagogicalAcceptance,false);
 assert.equal(semanticAudit({L}).fullWindowsVisualAcceptance,false);
});


test('SC083–SC125 source quiz questions follow 43 distinct device topics, without native PASS',()=>{
 const groups=[['digital-logic-apps',15],['digital-sequential-apps',12],['microcontroller-apps',16]];
 const questions=new Set();
 for(const [topic,count] of groups)for(let i=1;i<=count;i++){
  const id=topic+'-src-'+String(i).padStart(2,'0'),lesson=L.byId[id];
  assert.ok(lesson,'Missing topic-specific quiz '+id);
  assert.equal(lesson.kind,'quiz',id+' must remain reference-only');
  assert.equal(lesson.project?.wires?.length,0,id+' cannot invent terminal wiring');
  assert.equal(lesson.project?.referenceOnly,true,id+' cannot silently become working circuit');
  const q=lesson.quiz;
  assert.ok(q&&typeof q.question==='string'&&q.question.length>26,id+' generic quiz question');
  assert.equal(q.answer,0,id+' source evidence answer index');
  assert.ok(Array.isArray(q.options)&&q.options.length===3,id+' choice count');
  // Binary logic levels 0 and 1 are complete answers, not empty quiz choices.
  assert.ok(q.options.every(x=>typeof x==='string'&&
   (x.trim().length>2||/^[01]$/.test(x.trim()))),id+' empty choice');
  assert.ok(typeof q.why==='string'&&q.why.length>45,id+' unexplained answer');
  assert.ok(!questions.has(q.question),id+' duplicate quiz question');
  assert.doesNotMatch(q.question,/Bu derste ekrandaki malzemeler neden özellikle seçildi|Bu derste incelenen eleman türü hangisidir/i,id+' generic topic check');
  questions.add(q.question);
  assert.equal(lesson.pedagogyReview?.physicalAcceptance,false,id+' false physical PASS');
  assert.equal(lesson.pedagogyReview?.windowsVisualAcceptance,false,id+' false Windows PASS');
  assert.equal(lesson.pedagogyReview?.independentPedagogicalAcceptance,false,id+' false independent PASS');
 }
 assert.equal(questions.size,43);
 assert.match(L.byId['digital-logic-apps-src-04'].quiz.question,/BUFFER|OE/);
 assert.match(L.byId['digital-sequential-apps-src-11'].quiz.question,/ADC0804/);
 assert.match(L.byId['microcontroller-apps-src-05'].quiz.question,/ADC0804/);
 assert.match(L.byId['microcontroller-apps-src-15'].quiz.question,/I²C/);
});
