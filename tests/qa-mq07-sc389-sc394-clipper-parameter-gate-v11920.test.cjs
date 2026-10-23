'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
for(const suf of ['039','042'])test('SC389/394 '+suf+' source exact native DC clipper and fail-closed values',()=>{
 const l=L.byId['electronic-component-basics-outline-'+suf],p=l.project;
 assert.equal(p.wires.length,12);assert.equal(l.pedagogyReview.exactWiredClipperParameterGateTargetedPass,true);
 for(const flag of ['nativeDynamicAcceptance','waveformAcceptance','physicalAcceptance','windowsVisualAcceptance'])assert.equal(l.pedagogyReview[flag],false);
 const tested=[];for(const pct of [0,10,25,40,50,60,70,90,100]){
  const graph=clone(p);graph.components.find(c=>c.id==='rv').potentiometer=pct;
  const sol=Sim.solve(graph,defs,{now:0});assert.ok(sol.stable&&!sol.blocked&&!sol.shortCircuit);
  const flag=graph.components.find(c=>c.id==='v1')._nativeClipperDc;
  assert.ok(flag,'Missing actual DC clipper '+suf+'/'+pct);tested.push(flag);
 }
 assert.equal(tested[0].diodeForward,true);assert.equal(tested.at(-1).diodeForward,false);
 assert.ok(tested[0].outputV>12&&tested[0].outputV<14);
 for(const fault of ['supply','series','load','reference','pot','reverse','meter']){
  const graph=clone(p),get=id=>graph.components.find(c=>c.id===id);
  if(fault==='supply')get('g1').dcVoltage=12;
  if(fault==='series')get('rin').resistance=2200;
  if(fault==='load')get('load').resistance=10;
  if(fault==='reference')get('ref1').resistance=10000;
  if(fault==='pot')get('rv').potMax=100000;
  if(fault==='reverse')graph.wires=graph.wires.map(w=>w.from?.c==='d1'?{...w,from:{...w.from,p:'A'}}:w.to?.c==='d1'?{...w,to:{...w.to,p:'A'}}:w);
  if(fault==='meter')graph.wires=graph.wires.filter(w=>w.from.c!=='v1');
  Sim.solve(graph,defs,{now:0});assert.equal(get('v1')._nativeClipperDc,undefined,fault);
 }
});
