'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),review=L.mq07Batch200.reviewIds;
const reasons={NO_WIRED_CIRCUIT:47};
function browserContract(){
 const notices=[],w={DTSTutorialLessons:L,document:{readyState:'loading',addEventListener(){},querySelector(){return null}},
  DTSEditor:{stop(){notices.push('stop')},toast(message){notices.push(message)}}};
 const script=fs.readFileSync(path.join(__dirname,'..','dist','tutorial-mode.js'),'utf8');
 vm.runInNewContext(script,{window:w},{filename:'tutorial-mode.js'});
 assert.ok(w.DTSTutorialMode);
 return {api:w.DTSTutorialMode,notices};
}
test('MQ-07 review ledger has exactly 47 still-open title/topology defects',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(review.length,47);
 const counts={};for(const r of review){
  counts[r.reason]=(counts[r.reason]||0)+1;
  const l=L.byId[r.id];assert.ok(l,'missing '+r.id);
  assert.equal(l.pedagogyReview.titleTopologyIssue,r.reason,r.id);
  assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false,r.id);
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false,r.id);
 }
 assert.deepEqual(counts,reasons);
 const repaired=L.byId['sensor-analog-apps-src-08'];
 assert.equal(repaired.project.components.some(c=>c.typeId==='proximity'),false);
 assert.ok(repaired.project.components.some(c=>c.typeId==='tutorial-piezo'));
 assert.equal(repaired.pedagogyReview.titleTopologyIssue,null);
 for(const id of ['electronic-switching-src-06','electronic-switching-src-07']){
  assert.equal(L.byId[id].project.components.some(c=>c.typeId==='capacitor'),true,id);
  assert.equal(L.byId[id].pedagogyReview.titleTopologyIssue,null,id);
 }
});
test('remaining review-only lesson cannot be accidentally accepted as functional wiring',()=>{
 const {api,notices}=browserContract();
 const r=review.find(x=>x.reason==='NO_WIRED_CIRCUIT'&&L.byId[x.id].project.wires.length>0);
 assert.ok(r,'expected one probe/reference-only wired review');
 const l=L.byId[r.id],p=JSON.parse(JSON.stringify(l.project)),wires=JSON.stringify(p.wires);
 p.tutorialLesson={id:l.id,phase:'rebuild',step:0,lastFeedback:''};
 assert.equal(api.allowsGuidedWiring(p),false);
 api.startRebuild(p);
 assert.equal(JSON.stringify(p.wires),wires);
 assert.match(p.tutorialLesson.lastFeedback,/incelemesi açık/);
 assert.match(api.topologyReviewNotice(l),/DEVRE İNCELEMEDE/);
 assert.equal(notices.includes('stop'),false);
});
test('review marker covers reference-only lessons without blocking verified exercises',()=>{
 const {api}=browserContract();
 assert.match(api.topologyReviewNotice(L.byId['installation-grounding-src-03']),/korunmuş bir kavramsal/);
 assert.equal(api.topologyReviewNotice(L.byId['sensor-analog-apps-src-08']),'');
 const healthy=L.byId['sensor-analog-apps-src-07'];
 assert.equal(api.topologyReviewNotice(healthy),'');
 const dimmer=L.byId['sensor-analog-apps-src-11'];
 assert.equal(api.topologyReviewNotice(dimmer),'');
 assert.ok(dimmer.project.components.some(c=>c.typeId==='mosfet-n'&&c.virtualLdrDimmer));
 const pDim=JSON.parse(JSON.stringify(dimmer.project));pDim.tutorialLesson={id:dimmer.id,phase:'rebuild',step:0};
 assert.equal(api.allowsGuidedWiring(pDim),true);
 for(const id of ['electronic-switching-src-06','electronic-switching-src-07']){
  assert.equal(api.topologyReviewNotice(L.byId[id]),'');
  const rc=JSON.parse(JSON.stringify(L.byId[id].project));rc.tutorialLesson={id,phase:'rebuild',step:0};
  assert.equal(api.allowsGuidedWiring(rc),true,id);
 }
 const p=JSON.parse(JSON.stringify(healthy.project));p.tutorialLesson={id:healthy.id,phase:'rebuild',step:0};
 assert.equal(api.allowsGuidedWiring(p),true);
});
test('full original native solver keeps 1655 sources and 731 wired scenes structurally valid',()=>{
 const native=require('../dist/simulation.js');
 const r=QA.audit({L,defs:QA.catalog(),Simulation:native});
 assert.equal(r.total,1655);assert.equal(r.withWires,733);assert.equal(r.stable,733);
 assert.equal(r.status,'PASS');
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','shortCircuits','blocked','unstable','errors','duplicateIds'])
  assert.deepEqual(r[key],[],key);
});
