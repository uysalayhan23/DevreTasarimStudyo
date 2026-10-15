'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Devices=require('../dist/device-behavior.js');
const L=QA.curriculum(),defs=QA.catalog(),l=L.byId['sensor-analog-apps-src-09'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
const near=(v,w)=>assert.ok(Number.isFinite(v)&&Math.abs(v-w)<1e-7,'expected '+w+', got '+v);
function sample(weight,opts={}){
 const p=clone(l.project),cell=part(p,'lc'),indicator=part(p,'tx');
 cell.loadWeight=weight;
 if('voltage' in opts)part(p,'g1').dcVoltage=opts.voltage;
 if(opts.cut)p.wires=p.wires.filter(w=>![w.from,w.to].some(x=>x.c==='lc'&&x.p===opts.cut));
 if(opts.reverseSignal){
  const plus=p.wires.find(w=>w.from.c==='lc'&&w.from.p==='SIG+');
  const minus=p.wires.find(w=>w.from.c==='lc'&&w.from.p==='SIG−');
  [plus.to.p,minus.to.p]=[minus.to.p,plus.to.p];
 }
 const r=Simulation.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
 return {p,cell,indicator,r,read:indicator._instrument};
}
test('SC28 source-owned project uses actual 949-item catalog pins and TX11 differential terminals',()=>{
 assert.equal(L.lessons.length,1655);assert.equal(l.kind,'wiring');
 assert.equal(l.project.components.length,3);assert.equal(l.project.wires.length,6);
 assert.equal(l.steps.length,6);assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(part(l.project,'g1').dcVoltage,24);
 assert.equal(part(l.project,'lc').loadCapacity,1000);
 assert.equal(part(l.project,'tx').instrumentSettings.spanMv,10);
 assert.equal(defs['weighing-indicator'].instrument,'tx11');
 assert.equal(JSON.stringify(l.project.wires.map(w=>[w.from.c,w.from.p,w.to.c,w.to.p])),JSON.stringify([
  ['g1','P','tx','+'],['g1','M','tx','−'],['tx','EX+','lc','EX+'],
  ['tx','EX−','lc','EX−'],['lc','SIG+','tx','S+'],['lc','SIG−','tx','S−']
 ]));
 for(const w of l.project.wires){
  assert.ok(defs[part(l.project,w.from.c).typeId].pins.some(x=>x.id===w.from.p));
  assert.ok(defs[part(l.project,w.to.c).typeId].pins.some(x=>x.id===w.to.p));
 }
});
test('SC28 real electrical solver 5 V excitation and 2 mV/V bridge-equivalent at 0-1000 kg',()=>{
 for(const mass of [0,250,500,750,1000]){
  const x=sample(mass),mv=10*mass/1000;
  assert.equal(x.read.error,'');
  assert.equal(x.read.on,true);near(x.read.voltage[0].value,5);
  near(x.cell._loadExcitation,5);
  near(Devices.output(x.cell,defs['load-cell']).value,mv);
  near(x.read.input,mv);near(x.read.weight,mass);
  assert.equal(x.read.output.unit,'mA');
  near(x.read.output.value,4+16*mass/1000);
  // Current output has no connected load and must NOT be accepted here.
  assert.ok(x.read.loadWarning);
 }
});
test('SC28 missing any bridge excitation or signal lead fails rather than guessing a mass',()=>{
 for(const pin of ['EX+','EX−','SIG+','SIG−']){
  const x=sample(500,{cut:pin});
  assert.notEqual(x.read.error,'',pin);
  assert.equal(x.read.on,true);
 }
});
test('SC28 broken or reversed signal and missing indicator supply fail closed',()=>{
 for(const options of [{reverseSignal:true},{voltage:0},{voltage:5},{voltage:30}]){
  const x=sample(500,options);assert.notEqual(x.read.error,'',JSON.stringify(options));
  if('voltage' in options)assert.equal(x.read.on,false);
 }
});
test('SC28 0 to 1000 to 500 to zero mass remains repeatable without a stale reading',()=>{
 const p=clone(l.project),cell=part(p,'lc'),indicator=part(p,'tx');
 for(const mass of [0,1000,500,0]){
  cell.loadWeight=mass;
  const r=Simulation.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  assert.equal(indicator._instrument.error,'');
  near(indicator._instrument.weight,mass);
  near(indicator._instrument.input,10*mass/1000);
 }
});
test('SC11–SC27 locks and original historic no-wires finding remain traceable',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 const counts=[[1,13,19],[2,13,19],[3,6,6],[4,3,5],[5,3,5],[6,3,5],[7,5,7],[8,5,4]];
 for(const [n,parts,wires] of counts){
  const s=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.equal(s.project.components.length,parts);
  assert.equal(s.project.wires.length,wires);
  assert.equal(s.pedagogyReview.physicalAcceptance,false);
 }
 assert.ok(L.mq07Batch200.reviewIds.some(x=>x.id==='sensor-analog-apps-src-09'&&x.reason==='NO_WIRED_CIRCUIT'));
 assert.ok(!L.mq07Batch200.noWireTriage.conceptPreservedIds.includes('sensor-analog-apps-src-09'));
 assert.ok(L.mq07Batch200.noWireTriage.applicationRepairIds.includes('sensor-analog-apps-src-09'));
 assert.equal(l.pedagogyReview.mq07LoadCell.realBridgeCalibrationVerified,false);
 assert.equal(l.pedagogyReview.mq07LoadCell.fourToTwentyMilliampExternalLoadVerified,false);
});
