'use strict';
// Preserve validated source-circuit repairs; FM and eko still remain non-wired concepts.
// Names "active filter" do not make a passive RC tutorial into an accepted active design.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),catalog=QA.catalog();
const rows=[
 ['Bant geçiren aktif filtre',8,'wiring','capacitor'],
 ['Bant durduran aktif filtre',11,'wiring','capacitor'],
 ['FM verici',0,'quiz','tutorial-rf-transmitter'],
 ['FM alıcı',0,'quiz','tutorial-rf-receiver'],
 ['Ön yükselteç',18,'wiring','lm358p-dip8'],
 ['Mikser',24,'wiring','lm358p-dip8'],
 ['Bas-tiz kontrol',15,'wiring','potentiometer'],
 ['Eko',0,'quiz','capacitor'],
 ['VU metre',10,'wiring','1n4148-do35'],
 ['14 W ses yükselteci',31,'wiring','tda2030-pentawatt5'],
 ['100 W ses yükselteci',40,'wiring','tda7293-multiwatt15v']
];
for(let i=0;i<rows.length;i++)test('SC'+(72+i)+' source topology accurately distinguishes wired and reference scope',()=>{
 const [title,n,kind,key]=rows[i],id='oscillator-filter-apps-src-'+String(i+20),l=L.byId[id],p=l?.project;
 assert.ok(l&&p,id);assert.equal(l.title,title);assert.equal(l.kind,kind);
 assert.equal(p.wires.length,n);assert.ok(p.components.some(c=>c.typeId===key),id+' component '+key);
 for(const c of p.components)assert.ok(catalog[c.typeId],c.typeId);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.notEqual(l.pedagogyReview.independentPedagogicalAcceptance,true);
 if(kind==='quiz'){
  assert.equal(p.referenceOnly,true);assert.equal(l.steps.length,0);
  assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
  assert.equal(l.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
  assert.ok(l.beginnerSteps.some(s=>/PASS verme|PASS sonucuna varma|elektriksel PASS/.test(s)));
 }else{
  assert.notEqual(p.referenceOnly,true);assert.equal(l.steps.length,n);
  assert.notEqual(l.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
  assert.notEqual(l.pedagogyReview.nativeDynamicAcceptance,true);
  assert.ok(l.explanation?.length>30);
 }
});
test('the two audio power lessons use actual TDA2030 and TDA7293 catalog devices, not LM358 power substitutes',()=>{
 for(const [id,type,wires] of [['oscillator-filter-apps-src-29','tda2030-pentawatt5',31],['oscillator-filter-apps-src-30','tda7293-multiwatt15v',40]]){
  const l=L.byId[id];assert.equal(l.project.wires.length,wires);
  assert.ok(l.project.components.some(c=>c.typeId===type));
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
 }
});
