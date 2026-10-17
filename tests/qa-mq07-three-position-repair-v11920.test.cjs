'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const {audit:bellAudit}=require('../scripts/qa-bell-transformer-v11920.cjs');
const clone=o=>JSON.parse(JSON.stringify(o));
const projection=p=>Array.from(p.wires,w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p);
test('MQ07 001-200: third-point lighting is a real canonical 7-wire 3-control circuit',()=>{
 const L=QA.curriculum(),d=L.byId['installation-systems-src-04'],original=L.byId['intermediate-1'];
 assert.deepEqual(projection(d.project),projection(original.project));
 assert.deepEqual(Array.from(d.project.components,c=>c.typeId),Array.from(original.project.components,c=>c.typeId));
 assert.equal(d.project.components.filter(c=>c.typeId==='wall-vavien').length,2);
 assert.equal(d.project.components.filter(c=>c.typeId==='wall-intermediate').length,1);
 assert.ok(!d.explanation.includes('ara vaviyen henüz bulunmadığından'));
 assert.match(d.explanation,/S2\/1.*S2\/3|S2\/3.*S2\/1/);
 assert.equal(d.pedagogyReview.titleTopologyIssue,null);
 assert.equal(d.pedagogyReview.windowsVisualAcceptance,false);
});
test('MQ05 first-200 repaired lesson: all 8 virtual switch configurations stable and each switch changes H1',()=>{
 const QAData=QA.curriculum(),defs=QA.catalog(),prj=QAData.byId['installation-systems-src-04'].project;
 const cases=[];
 for(let mask=0;mask<8;mask++){
  const p=clone(prj);
  for(const [j,id] of ['s1','sx','s2'].entries())p.components.find(c=>c.id===id).state=!!(mask&(1<<j));
  const o=Simulation.solve(p,defs,{now:800});
  assert.ok(o.stable&&!o.blocked&&!o.shortCircuit&&!o.oscillating,'phase '+mask);
  cases[mask]=!!p.components.find(c=>c.id==='h')._active;
 }
 for(let mask=0;mask<8;mask++)for(const bit of [1,2,4])
  assert.notEqual(cases[mask],cases[mask^bit],'toggle '+bit+' at phase '+mask);
});
test('bell lock remains mandatory for 15 canonical lessons, no mains teaching accepted',()=>{
 const r=bellAudit();
 assert.equal(r.status,'PASS',JSON.stringify(r.issues));
 assert.equal(r.count,15);
 assert.equal(r.phaseChecks,r.phasePasses);
 assert.equal(r.physicalAcceptance,false);
});
