'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),id='electronic-switching-src-11';
test('SC11 educator controls call original solver and never invent RPM',()=>{
 const p=JSON.parse(JSON.stringify(L.byId[id].project));
 p.tutorialLesson={id,phase:'demo',step:0,lastFeedback:''};
 let renders=0,solves=0;
 const w={DTSTutorialLessons:L,CCSSimulation:{...Native,solve(...args){solves++;return Native.solve(...args)}},
  document:{readyState:'loading',addEventListener(){},querySelector(){return null}},
  DTSEditor:{byId:defs,getProject(){return p},render(){renders++}}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','dist','tutorial-mode.js'),'utf8'),{window:w},{filename:'tutorial-mode.js'});
 for(const duty of [0,50,100]){
  assert.equal(w.DTSTutorialMode.setSc11PwmDuty(p,String(duty)),true);
  assert.equal(p.components.find(c=>c.id==='pwm1').dutyPercent,duty);
  assert.match(p.tutorialLesson.lastFeedback,/RPM hesaplanmadı/);
  assert.equal(p.components.find(c=>c.id==='m1')._motorRPM,undefined);
 }
 assert.equal(solves,9);assert.equal(renders,3);
 assert.equal(w.DTSTutorialMode.setSc11PwmDuty(p,'invalid'),false);
});
