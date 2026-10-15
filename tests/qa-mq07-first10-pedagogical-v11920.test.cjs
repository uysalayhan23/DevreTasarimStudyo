'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const Depth=require('../scripts/qa-tutorial-pedagogical-depth-v11920.cjs');
const IDS=[
'installation-grounding-src-01','installation-grounding-src-02',
	'installation-systems-src-02','installation-systems-src-03',
	'installation-systems-src-04','installation-systems-src-05',
	'installation-systems-src-06','installation-systems-src-08',
	'installation-systems-src-09','installation-systems-src-10'];
const REVIEW=[];
const template=/Gerçek bağlantı adımları:|Bu derste yalnız “|elemanları arasındaki \d+ gerçek terminal bağlantısını/;
test('MQ-07 first 10 source-specific wired lessons, no invented acceptance',()=>{
 const L=QA.curriculum();
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 assert.deepEqual(IDS.map(id=>L.byId[id]?.id),IDS);
 assert.deepEqual(IDS.filter(id=>L.byId[id]?.pedagogyReview?.titleTopologyIssue),REVIEW);
 assert.ok(IDS.every(id=>L.byId[id].pedagogyReview.independentPedagogicalAcceptance===false));
 for(const id of IDS){
  const l=L.byId[id];
  assert.ok(l&&l.kind==='wiring'&&l.project.wires.length>0,id+' canonical wired');
  assert.ok(l.designStandard!=='rich-reference-v1',id+' was not locked rich');
  assert.ok(l.summary.length>100&&l.explanation.length>=400,id+' meaningful narrative');
  assert.ok(!template.test(l.summary+' '+l.explanation),id+' generic copy');
  assert.ok(l.beginnerSteps.length>=5&&l.beginnerSteps.every(s=>s.length>25),id+' 5 guided questions');
  assert.ok(l.materials.length&&l.materials.every(m=>m.why&&!m.why.includes('Bu eleman ders başlığındaki gerçek işlevi doğrudan')),id+' physical roles');
  assert.equal(l.practiceGuide.pedagogicalAcceptance,false,id+' independent acceptance open');
  assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false,id);
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false,id);
 }
 const state=Depth.audit({L});
 assert.equal(state.lessons,1655);assert.equal(state.rich,136);
 assert.equal(state.pedagogyPending,1519);
 assert.equal(state.status,'REVIEW');
});
test('MQ-07 three-position and transformer bell repairs are real graph changes, not mistaken copy',()=>{
 const L=QA.curriculum();
 const v=L.byId['installation-systems-src-04'];
 assert.equal(v.project.components.filter(c=>c.typeId==='wall-intermediate').length,1);
 assert.equal(v.project.components.filter(c=>c.typeId==='wall-vavien').length,2);
 assert.equal(v.project.wires.length,7);
 assert.equal(v.pedagogyReview.mq07CircuitMatch,'SOURCE_ALIGNED');
 assert.match(v.explanation,/S2\/1|S2\/3/);
 const bell=L.byId['installation-systems-src-06'];
 assert.equal(bell.project.components.filter(c=>c.typeId==='bell-push').length,3);
 assert.equal(bell.project.components.filter(c=>c.typeId==='bell-transformer').length,1);
 assert.equal(bell.project.components.some(c=>c.typeId==='supply-1p'),false);
 assert.equal(bell.pedagogyReview.mq07CircuitMatch,'SOURCE_ALIGNED');
 assert.match(bell.explanation,/B2 ve B3/);
 assert.equal(v.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(bell.pedagogyReview.independentPedagogicalAcceptance,false);
});

test('MQ-05 first 10 dynamic simulations separate responsive vs passive circuits',()=>{
 const L=QA.curriculum(),catalog=QA.catalog();
 const expected=['installation-systems-src-02','installation-systems-src-03',
  'installation-systems-src-04','installation-systems-src-05','installation-systems-src-06'];
 const triggers=new Set(['wall-commutator','wall-vavien','bell-push']);
 const output=new Set(['ceiling-light','lampholder-e27','bell-electronic']);
 for(const id of IDS){
  const l=L.byId[id],original=JSON.stringify(l.project);
  const project=JSON.parse(original);
  const control=project.components.find(c=>triggers.has(c.typeId));
  const results=[];
  for(const [now,state] of [[0,false],[400,true],[850,false]]){
   if(control)control.state=state;
   const solved=Native.solve(project,catalog,{now});
   assert.ok(solved.stable&&!solved.blocked&&!solved.shortCircuit&&!solved.oscillating,id+' solver stable');
   results.push(JSON.stringify(project.components.filter(c=>output.has(c.typeId)).map(c=>[c.id,!!c._active,!!c._powered])));
  }
  assert.equal(results[0],results[2],id+' state restoration');
  if(expected.includes(id)){assert.ok(control,id+' has virtual control');assert.notEqual(results[0],results[1],id+' load responds');}
  else assert.equal(control,undefined,id+' passive/reference cannot claim response');
  assert.equal(JSON.stringify(l.project),original,id+' canonical graph unchanged');
 }
});
test('MQ-12 1655 source solver topology stays intact; no missing terminals',()=>{
 const L=QA.curriculum(),defs=QA.catalog(),result=QA.audit({L,defs,Simulation:Native});
 assert.equal(result.total,1655);assert.equal(result.withWires,730);
 assert.equal(result.stable,730);assert.equal(result.status,'PASS');
 assert.deepEqual(result.missingDefinitions,[]);
 assert.deepEqual(result.invalidWireEndpoints,[]);
 assert.deepEqual(result.shortCircuits,[]);
 assert.deepEqual(result.blocked,[]);
 assert.deepEqual(result.errors,[]);
});
