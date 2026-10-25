'use strict';
// SC395–397/399: native FET comparison and honest virtual-only learner guidance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>structuredClone(x);
const get=id=>L.byId[id],part=(p,id)=>p.components.find(c=>c.id===id);
function solve(p,t){const r=Native.solve(p,defs,{now:t});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'native solver unstable at '+t);return r}
const rows=[
 ['electronic-switching-outline-029','SOURCE_WIRED_NATIVE_FET_COMPARISON',12,19],
 ['electronic-switching-outline-030','SOURCE_WIRED_NATIVE_FET_COMPARISON',12,19],
 ['electronic-switching-outline-031','SOURCE_WIRED_J113_GDS_LOAD',6,9],
 ['electronic-switching-outline-033','SOURCE_WIRED_NATIVE_FET_COMPARISON',12,19]
];
test('comparison lessons respond independently; broken MOSFET gate cannot fake H2',()=>{
 for(const [id,_,parts,wires] of rows.filter(r=>r[2]===12)){
  const lesson=get(id),p=clone(lesson.project),original=JSON.stringify(lesson.project);
  assert.equal(p.components.length,parts);assert.equal(p.wires.length,wires);
  assert.ok(p.wires.some(w=>w.from.c==='qj'&&w.from.p==='G'&&w.to.c==='qj'&&w.to.p==='S'));
  assert.ok(p.wires.some(w=>w.from.c==='sm'&&w.to.c==='qm'&&w.to.p==='G'));
  part(p,'sj').state=false;part(p,'sm').state=false;solve(p,0);
  assert.equal(!!part(p,'hj')._active,false);assert.equal(!!part(p,'hm')._active,false);
  part(p,'sj').state=true;solve(p,250);
  assert.equal(!!part(p,'hj')._active,true);assert.equal(!!part(p,'hm')._active,false);
  part(p,'sj').state=false;part(p,'sm').state=true;solve(p,500);
  assert.equal(!!part(p,'hj')._active,false);assert.equal(!!part(p,'hm')._active,true);
  const cut=clone(lesson.project);
  part(cut,'sj').state=true;part(cut,'sm').state=true;
  cut.wires=cut.wires.filter(w=>!(w.from.c==='sm'&&w.to.c==='qm'&&w.to.p==='G'));
  assert.equal(cut.wires.length,wires-1);solve(cut,750);
  assert.equal(!!part(cut,'hj')._active,true);assert.equal(!!part(cut,'hm')._active,false);
  assert.equal(JSON.stringify(lesson.project),original,'canonical graph remains intact');
 }
});
test('SC397 J113 gate-source connection is distinct from S1 load switch',()=>{
 const lesson=get('electronic-switching-outline-031'),p=clone(lesson.project);
 assert.ok(p.wires.some(w=>w.from.c==='qj'&&w.from.p==='G'&&w.to.c==='qj'&&w.to.p==='S'));
 part(p,'sj').state=false;solve(p,0);assert.equal(!!part(p,'hj')._active,false);
 part(p,'sj').state=true;solve(p,250);assert.equal(!!part(p,'hj')._active,true);
 const cut=clone(lesson.project);part(cut,'sj').state=true;
 cut.wires=cut.wires.filter(w=>!(w.from.c==='hj'&&w.to.c==='qj'));
 assert.equal(cut.wires.length,8);solve(cut,500);assert.equal(!!part(cut,'hj')._active,false);
});
test('source-specific questions and REVIEW/physical locks are unchanged by pedagogy',()=>{
 assert.equal(L.lessons.length,1655);
 for(const [id,status,parts,wires] of rows){
  const l=get(id);
  assert.equal(l.project.components.length,parts);assert.equal(l.project.wires.length,wires);
  assert.equal(l.pedagogyReview.titleTopologyStatus,status);
  for(const k of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.notEqual(l.pedagogyReview[k],true);
  assert.equal(l.quiz.answer,0);assert.equal(l.quiz.options.length,3);
  assert.ok(l.beginnerSteps.length>=5);
  assert.ok(l.explanation.includes('fiziksel')||l.explanation.includes('Fiziksel'));
  assert.ok(l.beginnerSteps.at(-1).includes('PASS')||l.beginnerSteps.at(-1).includes('fiziksel'));
 }
 for(const id of ['electronic-component-basics-outline-015','electronic-switching-outline-027'])
  assert.equal(get(id).pedagogyReview.titleTopologyStatus,'REVIEW');
});
