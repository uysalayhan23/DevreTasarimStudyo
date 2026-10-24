'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),ids=L.lessons.slice(242,262).map(l=>l.id),snapshots=new Map(ids.map(id=>[id,structuredClone(L.byId[id])]));
const src=fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc243-sc262-specific.js'),'utf8');
const ctx={window:{DTSTutorialLessons:L}};
vm.runInNewContext(src,ctx);
test('SC243-262: exactly 13 concepts and 7 original motor identities, no false physical acceptance',()=>{
 assert.equal(ids.length,20);assert.equal(new Set(ids).size,20);
 const texts=new Set();for(let i=0;i<ids.length;i++){
  const id=ids[i],l=L.byId[id],old=snapshots.get(id);assert.equal(l.sc243Sc262StoryVersion,'20261024-sc243-sc262-1');
  assert.ok(l.explanation.endsWith(old.explanation));assert.equal(l.beginnerSteps.length,old.beginnerSteps.length+1);assert.ok(!texts.has(l.beginnerSteps[0]));texts.add(l.beginnerSteps[0]);
  assert.equal(JSON.stringify(l.quiz),JSON.stringify(old.quiz));assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
  if(i<13){assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);assert.equal(l.project.wires.length,0);assert.equal(l.steps.length,0);}
  else{assert.equal(l.kind,'wiring');assert.ok(l.project.wires.length>0);assert.equal(l.steps.length,l.project.wires.length);}
  if(i!==19){assert.equal(JSON.stringify(l.project),JSON.stringify(old.project),'canonical topology changed '+id);assert.equal(JSON.stringify(l.pedagogyReview),JSON.stringify(old.pedagogyReview),'review modified '+id);}
 }
 assert.equal(texts.size,20);
 vm.runInNewContext(src,ctx);assert.equal(L.byId[ids[0]].beginnerSteps.length,snapshots.get(ids[0]).beginnerSteps.length+1);
});
test('SC262: correct 3-pole packet, catalogue contact pins, ON/OFF and negative open-wire native',()=>{
 const l=L.byId['motor-direct-power-src-08'],p=l.project;
 assert.equal(JSON.stringify(p.components.map(c=>c.typeId)),JSON.stringify(['supply-3p','packet-switch-3p','motor-3p']));assert.equal(p.wires.length,7);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');assert.equal(l.pedagogyReview.physicalAcceptance,false);
 const parts=new Map(p.components.map(c=>[c.id,c]));
 for(const w of p.wires)for(const e of [w.from,w.to]){const c=parts.get(e.c),d=defs[c?.typeId];assert.ok(d?.pins.some(z=>z.id===e.p));}
 for(const [enabled,broken,expected] of [[false,null,false],[true,null,true],[true,'sc262-packet-1',false],[true,'sc262-packet-4',false],[true,'sc262-packet-6',false]]){
  const copy=structuredClone(p);copy.components.find(c=>c.id==='sw').state=enabled;
  if(broken)copy.wires=copy.wires.filter(w=>w.id!==broken);
  const result=Sim.solve(copy,defs,{now:1000});assert.equal(result.blocked,false);assert.equal(result.shortCircuit,false);assert.equal(result.stable,true);
  assert.equal(copy.components.find(c=>c.id==='motor')._active,expected,'motor for '+enabled+'/'+broken);
 }
});
test('SC257: simultaneous forward/reverse remains REVIEW, never counted as safe/native PASS',()=>{
 const l=L.byId['motor-direct-power-src-03'];assert.equal(l.pedagogyReview.titleTopologyIssue,'PHASE_REVERSAL_NATIVE_PENDING');
 const p=structuredClone(l.project);p.components.find(c=>c.id==='startF').state=true;p.components.find(c=>c.id==='startR').state=true;
 const r=Sim.solve(p,defs,{now:1000});assert.equal(r.stable,false);assert.notEqual(l.pedagogyReview.physicalAcceptance,true);
});

test('SC257–261: native start + interrupted contactor-control path negative cases',()=>{
 for(const seq of [257,258,259,260,261]){
  const orig=snapshots.get(ids[seq-243]).project;
  const on=structuredClone(orig),start=on.components.find(c=>c.id==='start'||c.id==='startF');
  assert.ok(start);start.state=true;
  let result=Sim.solve(on,defs,{now:500});assert.ok(result.stable&&!result.blocked&&!result.shortCircuit);
  assert.equal(on.components.find(c=>c.id==='motor')._active,true,'start should drive '+seq);
  const broken=structuredClone(orig);broken.components.find(c=>c.id===start.id).state=true;
  broken.wires=broken.wires.filter(w=>!['coil','coilF'].includes(w.to.c)&&!['coil','coilF'].includes(w.from.c));
  result=Sim.solve(broken,defs,{now:500});assert.ok(result.stable&&!result.blocked&&!result.shortCircuit);
  assert.equal(!!broken.components.find(c=>c.id==='motor')._active,false,'control interruption must stop '+seq);
 }
});
