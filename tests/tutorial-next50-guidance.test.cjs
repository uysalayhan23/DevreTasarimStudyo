'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,'../dist',f),'utf8');
test('SC122-171: fifty ordered lesson identities receive guidance without circuit rewiring',()=>{
 const L=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
 const before=new Map(Object.entries(L.byId).map(([id,l])=>[id,JSON.stringify({project:l.project,steps:l.steps,quiz:l.quiz,pedagogyReview:l.pedagogyReview})]));
 vm.runInNewContext(read('tutorial-next50-guidance.js'),{window:{DTSTutorialLessons:L}});
 const seen=Object.values(L.byId).filter(l=>l.learningSupport?.version==='20261023-next50-guidance1');
 assert.equal(seen.length,50);
 for(const l of seen){
  assert.equal(JSON.stringify({project:l.project,steps:l.steps,quiz:l.quiz,pedagogyReview:l.pedagogyReview}),before.get(l.id),'protected lesson mutated '+l.id);
  assert.equal(l.learningSupport.questions.length,3);
  assert.equal(l.learningSupport.sourceCircuitPreserved,true);
  assert.ok(l.learningSupport.focus===l.title);
  assert.equal(l.learningSupport.visualAcceptanceRequired,l.pedagogyReview?.visualAcceptance!==true);
  assert.equal(l.learningSupport.nativeAcceptanceRequired,l.pedagogyReview?.simulationAcceptance!==true);
 }
 // Mixed acceptance statuses must remain independent: visual PASS does not imply native PASS.
 const original=read('tutorial-next50-guidance.js');
 const ids=Array.from(new Set(seen.map(l=>l.id)));
 for(const [visual,native] of [[true,false],[false,true],[true,true],[false,false]]){
  const copy=JSON.parse(JSON.stringify(require('../dist/tutorial-source-outline.js')));
  const chosen=copy.byId[ids[0]];
  chosen.pedagogyReview={...chosen.pedagogyReview,visualAcceptance:visual,simulationAcceptance:native};
  vm.runInNewContext(original,{window:{DTSTutorialLessons:copy}});
  assert.equal(chosen.learningSupport.visualAcceptanceRequired,!visual,'visual flag was coupled to native');
  assert.equal(chosen.learningSupport.nativeAcceptanceRequired,!native,'native flag was coupled to visual');
 }
 const loader=read('tutorial-mode.js');
 assert.ok(loader.indexOf('tutorial-next50-guidance.js?v=')>loader.indexOf('tutorial-installation-first10-specific.js?v='));
});
