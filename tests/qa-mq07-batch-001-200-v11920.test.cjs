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

test('all known unbuilt first-200 circuits remain REVIEW, not false pedagogy acceptance',()=>{
 assert.equal(batch.reviewIds.length,55);
 assert.equal(batch.reviewIds.some(x=>['opamp-apps-src-11','opamp-apps-src-12'].includes(x.id)),false,'two-input source topology now repaired');
 assert.ok(batch.reviewIds.some(x=>x.id==='sensor-analog-apps-src-11'&&x.reason==='MISSING_DIMMER_POWER_STAGE'));
 assert.equal(batch.reviewIds.some(x=>x.id==='opamp-apps-src-07'),false);
 assert.equal(semanticAudit({L}).fullPedagogicalAcceptance,false);
 assert.equal(semanticAudit({L}).fullWindowsVisualAcceptance,false);
});
