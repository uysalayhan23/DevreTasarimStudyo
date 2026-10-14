'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),review=L.mq07Batch200.reviewIds;
const reasons={NO_WIRED_CIRCUIT:51,NO_RC_TIMING_EVIDENCE:2,TITLE_MISSING_REQUIRED_PART:1,MISSING_DIMMER_POWER_STAGE:1};
function browserContract(){
 const notices=[],w={DTSTutorialLessons:L,document:{readyState:'loading',addEventListener(){},querySelector(){return null}},
  DTSEditor:{stop(){notices.push('stop')},toast(message){notices.push(message)}}};
 const script=fs.readFileSync(path.join(__dirname,'..','dist','tutorial-mode.js'),'utf8');
 vm.runInNewContext(script,{window:w},{filename:'tutorial-mode.js'});
 assert.ok(w.DTSTutorialMode);
 return {api:w.DTSTutorialMode,notices};
}
test('MQ-07 review ledger has exactly 55 still-open title/topology defects',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(review.length,55);
 const counts={};for(const r of review){
  counts[r.reason]=(counts[r.reason]||0)+1;
  const l=L.byId[r.id];assert.ok(l,'missing '+r.id);
  assert.equal(l.pedagogyReview.titleTopologyIssue,r.reason,r.id);
  assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false,r.id);
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false,r.id);
 }
 assert.deepEqual(counts,reasons);
 const wrong=L.byId['sensor-analog-apps-src-08'];
 assert.ok(wrong.project.components.some(c=>c.typeId==='proximity'));
 assert.equal(wrong.project.components.some(c=>/piezo/.test(c.typeId)),false);
 for(const id of ['electronic-switching-src-06','electronic-switching-src-07']){
  assert.equal(L.byId[id].project.components.some(c=>/capacitor/.test(c.typeId)),false,id);
 }
});
test('reviewed wiring cannot be rebuilt or marked electrically completed by guided step',()=>{
 const {api,notices}=browserContract();
 for(const id of ['sensor-analog-apps-src-08','sensor-analog-apps-src-11','electronic-switching-src-06','electronic-switching-src-07']){
  const l=L.byId[id],p=JSON.parse(JSON.stringify(l.project)),wires=JSON.stringify(p.wires);
  p.tutorialLesson={id,phase:'rebuild',step:0,lastFeedback:''};
  assert.ok(p.wires.length>0,id);
  assert.equal(api.allowsGuidedWiring(p),false,id);
  api.startRebuild(p);
  assert.equal(JSON.stringify(p.wires),wires,id+' source graph was modified');
  assert.match(p.tutorialLesson.lastFeedback,/incelemesi açık/,id);
  assert.match(api.topologyReviewNotice(l),/DEVRE İNCELEMEDE/,id);
 }
 assert.equal(notices.includes('stop'),false,'guarded lesson tried starting rebuild');
});
test('review marker covers reference-only lessons without blocking verified exercises',()=>{
 const {api}=browserContract();
 assert.match(api.topologyReviewNotice(L.byId['installation-grounding-src-03']),/işlevsel kablolu deneyi yok/);
 assert.match(api.topologyReviewNotice(L.byId['sensor-analog-apps-src-08']),/endüktif yakınlık sensörü/);
 const healthy=L.byId['sensor-analog-apps-src-07'];
 assert.equal(api.topologyReviewNotice(healthy),'');
 const p=JSON.parse(JSON.stringify(healthy.project));p.tutorialLesson={id:healthy.id,phase:'rebuild',step:0};
 assert.equal(api.allowsGuidedWiring(p),true);
});
test('full original native solver keeps 1655 sources and 729 wired scenes structurally valid',()=>{
 const native=require('../dist/simulation.js');
 const r=QA.audit({L,defs:QA.catalog(),Simulation:native});
 assert.equal(r.total,1655);assert.equal(r.withWires,729);assert.equal(r.stable,729);
 assert.equal(r.status,'PASS');
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','shortCircuits','blocked','unstable','errors','duplicateIds'])
  assert.deepEqual(r[key],[],key);
});
