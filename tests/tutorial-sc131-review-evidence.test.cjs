'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-08';
const original=L.byId[id],before=JSON.stringify({project:original.project,steps:original.steps,review:original.pedagogyReview});
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-next50-guidance.js'),'utf8'),{window:{DTSTutorialLessons:L}});
test('SC131 explains unverified native hysteresis without modifying 19-wire two-BD139 canonical graph',()=>{
 const l=L.byId[id];assert.equal(l.project.wires.length,19);
 assert.equal(l.project.components.filter(x=>x.typeId==='bd139-npn').length,2);
 assert.equal(JSON.stringify({project:l.project,steps:l.steps,review:l.pedagogyReview}),before);
 assert.equal(l.pedagogyReview.nativeHysteresisAcceptance,false);
 assert.equal(l.learningSupport.nativeAcceptanceRequired,true);
 assert.equal(l.learningSupport.nonWorkingDiagramWarning,true);
 assert.match(l.explanation,/çözücü kararsız kaldı/);
 assert.match(l.explanation,/gerçek histerezis henüz doğrulanmadı/);
});
test('SC131 fresh increasing/decreasing native sweeps contain unstable transition points, cannot be accepted',()=>{
 const ascending=[0,10,20,30,40,50,60,70,80,90,100],descending=[100,90,80,70,60,50,40,30,20,10,0];
 for(const points of [ascending,descending]){
  const p=structuredClone(original.project),states=[];
  for(const [i,pct] of points.entries()){
   p.components.find(x=>x.id==='rv1').potentiometer=pct;
   const result=Sim.solve(p,defs,{now:i*100});
   states.push({pct,unstable:!result.stable||result.oscillating||result.blocked});
  }
  assert.ok(states.some(x=>x.unstable),'Native transition instability must not be silently accepted');
 }
});
