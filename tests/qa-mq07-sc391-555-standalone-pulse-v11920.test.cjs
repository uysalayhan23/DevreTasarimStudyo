'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
test('SC391: real terminal 5 V NE555 ideal astable and LED phase',()=>{
 const lesson=L.byId['electronic-component-basics-outline-041'],q=clone(lesson.project),u=q.components.find(c=>c.id==='u1'),led=q.components.find(c=>c.id==='h1');
 assert.equal(lesson.pedagogyReview.nativeStandaloneIdealNe555TargetedPass,true);
 for(const k of ['nativeDynamicAcceptance','waveformAcceptance','frequencyResponseAcceptance','physicalAcceptance','windowsVisualAcceptance'])assert.equal(lesson.pedagogyReview[k],false);
 assert.equal(q.wires.length,15);
 let hi=0,lo=0;
 for(const now of [0,100,700,780,1000,1400,1456,2000,2200,2950,3100]){
  const result=Sim.solve(q,defs,{now});assert.ok(result.stable&&!result.blocked);
  const n=u._nativePulse041;assert.ok(n,'No source-verified standalone 555 at '+now);
  assert.ok(Math.abs(n.frequencyHz-.686997638518554)<.0001);
  assert.ok(Math.abs(n.dutyPercent-52.38)<.05);
  assert.equal(n.ledOn,led._active);assert.equal(n.outHigh,n.ledOn);
  hi+=Number(n.outHigh);lo+=Number(!n.outHigh);
 }
 assert.ok(hi>0&&lo>0);
 for(const fault of ['reset','trigger','threshold','discharge','led','ctrl','resistor','cap','supply','reversedLed','groundReset','disabled']){
  const p=clone(lesson.project),part=id=>p.components.find(c=>c.id===id),u=part('u1');
  const wire={reset:'pgw44635',trigger:'pgw44640',threshold:'pgw44639',discharge:'pgw44637',led:'pgw44631',ctrl:'pgw44633'}[fault];
  if(wire)p.wires=p.wires.filter(w=>w.id!==wire);
  if(fault==='resistor')part('ra').resistance=2200;
  if(fault==='cap')part('c1').capacitance=1e-6;
  if(fault==='supply')part('g1').dcVoltage=4;
  if(fault==='reversedLed')p.wires=p.wires.map(w=>w.to?.c==='h1'?{...w,to:{...w.to,p:'K'}}:w);
  if(fault==='groundReset')p.wires=p.wires.map(w=>w.to?.c==='u1'&&w.to.p==='RESET'?{...w,from:{c:'g1',p:'M'}}:w);
  if(fault==='disabled')u.mq07Standalone555Astable=false;
  Sim.solve(p,defs,{now:0});assert.equal(u._nativePulse041,undefined,fault);
 }
});
test('SC392/393 conceptual Miller/Boot Strobe remain unwired REVIEW',()=>{
 for(const id of ['044','045']){const l=L.byId['electronic-component-basics-outline-'+id];assert.equal(l.kind,'quiz');assert.equal(l.project.wires.length,0);assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');}
});
