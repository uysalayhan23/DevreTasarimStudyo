'use strict';
// SC460 piezo outline UI + SC461 native 250-ohm TX11 output loop.
// All assertions are virtual; REVIEW, calibration, Windows/3D and hardware remain open.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
const by=id=>L.byId[id],get=(p,id)=>p.components.find(c=>c.id===id);
const piezo='sensor-analog-apps-outline-047',tx11='sensor-analog-apps-outline-048';
function sample(p,now){const r=Native.solve(p,defs,{now});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,'native solve '+now);return r}
function near(actual,expected,tol=0.00002){assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<tol,actual+' ≉ '+expected)}
test('SC460 same real +/minus piezo/1 MOhm/UT33D+ graph and unchanged REVIEW',()=>{
 const l=by(piezo),p=l.project;
 assert.equal(p.components.length,5);assert.equal(p.wires.length,4);assert.equal(l.steps.length,4);
 assert.equal(get(p,'pz').typeId,'tutorial-piezo');assert.equal(get(p,'pz').mq07PiezoTapUi,true);
 assert.equal(get(p,'r1').resistance,1000000);assert.equal(get(p,'v1').meterPosition,1);
 assert.deepEqual({...get(p,'v1-red').probeTarget},{c:'pz',p:'+'});
 assert.deepEqual({...get(p,'v1-black').probeTarget},{c:'pz',p:'−'});
 assert.equal(l.pedagogyReview.sourceTopologyReusedFrom,'sensor-analog-apps-src-08');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
});
test('SC460 native 100 mV impulse decays and reversed/open probe fails',()=>{
 for(const [elapsed,expected] of [[0,.1],[150,.1*Math.exp(-150/220)],[1000,.1*Math.exp(-1000/220)],[1601,0]]){
  const p=clone(by(piezo).project);get(p,'pz').piezoTapAt=1000;
  sample(p,1000+elapsed);near(get(p,'v1')._meter.value,expected,.0000001);
 }
 const reverse=clone(by(piezo).project);get(reverse,'pz').piezoTapAt=1000;
 get(reverse,'v1-red').probeTarget.p='−';get(reverse,'v1-black').probeTarget.p='+';
 sample(reverse,1000);near(get(reverse,'v1')._meter.value,-.1);
 for(const cut of ['v1-red','v1-black']){
  const p=clone(by(piezo).project);get(p,'pz').piezoTapAt=1000;
  p.wires=p.wires.filter(w=>w.to.c!==cut);sample(p,1000);
  assert.equal(get(p,'v1')._meter.display,'OL');
 }
});
test('SC460 source-aligned virtual lesson panel uses actual native solver, fake lesson stays denied',()=>{
 const document={readyState:'loading',addEventListener(){},querySelector(){return null}};
 let renders=0;const w={document,DTSTutorialLessons:L,
  DTSEditor:{byId:defs,render(){renders++}},CCSSimulation:Native};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-mode.js'),'utf8'),
   {window:w},{filename:'tutorial-mode.js'});
 const p=clone(by(piezo).project);
 for(const [time,expectedMv] of [[0,100],[150,100*Math.exp(-150/220)],[1000,100*Math.exp(-1000/220)]]){
  assert.equal(w.DTSTutorialMode.setPiezoVirtualSample(p,time),true,'sample '+time);
  near(get(p,'pz')._piezoMv,expectedMv,.0000001);
 }
 assert.equal(renders,3);
 const fake=clone(p);fake.tutorialLesson.id='sensor-analog-apps-outline-044';
 assert.equal(w.DTSTutorialMode.setPiezoVirtualSample(fake,0),false);
 assert.match(p.tutorialLesson.lastFeedback,/Üretici verisi değildir/);
});
test('SC461 TX11 0–1000 kg controls native 4–20 mA in 250 ohm load',()=>{
 const l=by(tx11);assert.equal(l.project.components.length,4);
 assert.equal(l.project.wires.length,8);assert.equal(l.steps.length,8);
 assert.equal(get(l.project,'rout').resistance,250);
 for(const mass of [0,250,500,750,1000]){
  const p=clone(l.project);get(p,'lc').loadWeight=mass;sample(p,1000);
  const reading=get(p,'tx')._instrument,load=get(p,'rout');
  assert.equal(reading.error,'');near(reading.weight,mass);
  near(reading.input,10*mass/1000);
  near(reading.output.value,4+16*mass/1000);
  near(load._currentValue,(4+16*mass/1000)/1000);
  near(load._voltageValue,(4+16*mass/1000)*.25);
 }
});
test('SC461 each missing excitation or differential signal wire produces error',()=>{
 for(const pin of ['EX+','EX−','SIG+','SIG−']){
  const p=clone(by(tx11).project);
  p.wires=p.wires.filter(w=>![w.from,w.to].some(e=>e.c==='lc'&&e.p===pin));
  sample(p,1000);assert.ok(get(p,'tx')._instrument.error,pin);
 }
});
test('1655 lessons and both REVIEW/calibration locks retained; no changed graphs',()=>{
 assert.equal(L.lessons.length,1655);
 for(const id of [piezo,tx11]){
  const l=by(id),review=l.pedagogyReview;
  assert.equal(review.titleTopologyStatus,'REVIEW');
  for(const key of ['nativeDynamicAcceptance','sensorCalibrationAcceptance','physicalAcceptance',
     'windowsVisualAcceptance','independentPedagogicalAcceptance'])
   assert.equal(review[key],false,id+' '+key);
  assert.equal(l.beginnerSteps.length,5);
  assert.equal(l.quiz.answer,0);assert.equal(l.quiz.options.length,3);
  assert.ok(l.beginnerSteps.at(-1).includes('PASS verme'));
 }
});
