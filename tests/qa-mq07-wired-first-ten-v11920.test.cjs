'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const expected=[["installation-grounding-src-01",["g1/PE>x1/1","x1/2>e1/PE"]],["installation-grounding-src-02",["g1/PE>b1/1","b1/4>x1/1","x1/2>s1/PE","b1/5>e1/PE"]],["installation-systems-src-02",["g1/L>s/1","g1/L>s/3","s/2>h1/X1","s/4>h2/X1","h1/X2>g1/N","h2/X2>g1/N"]],["installation-systems-src-03",["g1/L>s1/11","s1/12>s2/12","s1/14>s2/14","s2/11>h/X1","h/X2>g1/N"]],["installation-systems-src-04",["g1/L>s1/11","s1/12>sx/1","s1/14>sx/3","sx/2>s2/12","sx/4>s2/14","s2/11>h/X1","h/X2>g1/N"]],["installation-systems-src-05",["tr/S1>b0/13","b0/14>z/1","z/2>tr/S2"]],["installation-systems-src-06",["tr/S1>b0/13","b0/14>z/1","tr/S1>b1/13","b1/14>z/1","tr/S1>b2/13","b2/14>z/1","z/2>tr/S2"]],["installation-systems-src-08",["g1/L>j1/1","j1/2>h1/X1","g1/N>j2/3","j2/4>h1/X2"]],["installation-systems-src-09",["g1/L>bt/1","bt/2>f1/1","f1/2>r1/1","r1/2>g1/N"]],["installation-systems-src-10",["f1/a>a1/a","f1/b>a1/b","a1/a>t1/a","a1/b>t1/b"]]];
const issues={};
const wire=w=>w.from.c+'/'+w.from.p+'>'+w.to.c+'/'+w.to.p;

test('MQ-07 ten actual wired lessons have causal technical narratives, not template text',()=>{
 const L=QA.curriculum();
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 assert.equal(L.lessons.filter(x=>x.practiceGuide?.pedagogicalAcceptance===false).length,1519);
 for(const [id,wires] of expected){
  const l=L.byId[id];
  assert.ok(l,'Missing '+id);
  assert.equal(l.designStandard==='rich-reference-v1',false,id+' existing accepted content must stay untouched');
  assert.deepEqual(l.project.wires.map(wire),wires,id+' canonical wiring must not change');
  assert.equal(l.pedagogyReview?.semanticPilot,'MQ07_WIRED_FIRST10_20261014',id);
  assert.ok(l.summary.length>100&&l.explanation.length>450,id+' needs concrete explanation');
  assert.ok(l.learningGoal.length>65&&l.beginnerSteps.length>=5,id+' needs student tasks');
  assert.ok(!/Gerçek bağlantı adımları:|elemanları arasındaki \\d+ gerçek terminal bağlantısını/.test(l.summary+' '+l.explanation),id+' template text still present');
  assert.ok(l.materials.every(x=>x.why&&x.why.length>20),id+' material purposes cannot be empty');
  assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false,id+' independent teacher acceptance open');
  assert.equal(l.pedagogyReview.windowsVisualAcceptance,false,id+' Windows acceptance open');
  assert.equal(l.pedagogyReview.titleTopologyStatus,issues[id]?'REVIEW':'SOURCE_ALIGNED',id);
 }
});
test('three-position lighting and locked transformer bells are repaired in virtual lessons',()=>{
 const L=QA.curriculum();
 const intermediate=L.byId['installation-systems-src-04'],bell=L.byId['installation-systems-src-06'];
 assert.equal(intermediate.project.components.filter(c=>c.typeId==='wall-intermediate').length,1);
 assert.equal(intermediate.project.components.filter(c=>c.typeId==='wall-vavien').length,2);
 assert.equal(intermediate.pedagogyReview.titleTopologyIssue,null);
 assert.equal(bell.project.components.filter(c=>c.typeId==='bell-push').length,3);
 assert.equal(bell.project.components.filter(c=>c.typeId==='bell-transformer').length,1);
 assert.equal(bell.pedagogyReview.titleTopologyIssue,null);
 assert.equal(intermediate.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(bell.pedagogyReview.independentPedagogicalAcceptance,false);
});

