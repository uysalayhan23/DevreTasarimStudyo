'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),copy=x=>JSON.parse(JSON.stringify(x));
for(const suf of ['040','043'])test('SC390/393 '+suf+' actual wired 1N4148+C sine source and fail-closed RC',()=>{
 const src=L.byId['electronic-component-basics-outline-'+suf],p=src.project;
 assert.equal(src.kind,'wiring');assert.equal(p.wires.length,7);
 assert.equal(src.pedagogyReview.nativeClamperSineStepTargetedPass,true);
 for(const flag of ['nativeDynamicAcceptance','waveformAcceptance','frequencyResponseAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])assert.equal(src.pedagogyReview[flag],false);
 const q=copy(p),m=q.components.find(c=>c.id==='v1'),result=[];
 for(let now=0;now<=500;now++){
  const status=Simulation.solve(q,defs,{now});assert.ok(status.stable&&!status.blocked&&!status.shortCircuit);
  const reading=m._nativeClamperShift;assert.ok(reading,suf+' '+now);
  assert.ok(Math.abs(m._voltageValue-reading.outputV)<1e-5);
  if(now>=400)result.push(reading);
 }
 const min=Math.min(...result.map(x=>x.outputV)),max=Math.max(...result.map(x=>x.outputV)),avgIn=result.reduce((a,x)=>a+x.inputV,0)/result.length,avgOut=result.reduce((a,x)=>a+x.outputV,0)/result.length;
 assert.ok(min<-.5&&min>-.8&&max>2.5&&max<4&&avgIn>1.9&&avgIn<2.1&&avgOut<avgIn-.35);
 for(const fault of ['diode','reverse','c','load','meter','amplitude','frequency','disabled']){
  const bad=copy(p),g=id=>bad.components.find(c=>c.id===id);
  if(fault==='diode')bad.wires=bad.wires.filter(w=>!(w.from.c==='c1'&&w.to.c==='d1'));
  if(fault==='reverse')bad.wires=bad.wires.map(w=>({...w,to:w.to.c==='d1'?{...w.to,p:w.to.p==='A'?'K':'A'}:w.to,from:w.from.c==='d1'?{...w.from,p:w.from.p==='A'?'K':'A'}:w.from}));
  if(fault==='c')g('c1').capacitance=100e-6;
  if(fault==='load')bad.wires=bad.wires.filter(w=>w.from.c!=='r1');
  if(fault==='meter')bad.wires=bad.wires.filter(w=>w.from.c!=='v1');
  if(fault==='amplitude')g('fg1').generatorAmplitude=8;
  if(fault==='frequency')g('fg1').generatorFrequency=100;
  if(fault==='disabled')g('fg1').generatorEnabled=false;
  Simulation.solve(bad,defs,{now:0});assert.equal(g('v1')._nativeClamperShift,undefined);
 }
});
