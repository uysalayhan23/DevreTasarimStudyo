'use strict';
// Real product catalog and original PLC.evaluate/Ladder.scan; full Simulation.solve is separate.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const PLC=require('../dist/plc-runtime.js'),Ladder=require('../dist/ladder-runtime.js');
const defs=QA.catalog(),id='plc-hw-6es7211-1ae40-0xb0',model=defs[id];
function evaluate(cpu=24,bank=24,di=24,diToM=0){
 const c={plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()};
 const net={voltage(_c,a,b){
  if(a==='X10:1'&&b==='X10:2')return cpu;
  if(a==='X12:1'&&b==='X12:2')return bank;
  if(a==='X10:7'&&b==='X10:6')return di;
  if(a==='X10:7'&&b==='X10:2')return diToM;
  return 0;
 }};
 const state=PLC.evaluate(c,model,net,1000);
 return {state,links:PLC.links(c,model)};
}
function check(cpu,bank,di,powered,output,diToM=0){
 const {state,links}=evaluate(cpu,bank,di,diToM);
 assert.equal(state.powered,powered);
 assert.equal(state.outputs['X12:3'],output);
 assert.equal(state.outputs['X12:4'],false);
 assert.equal(links.length,output?1:0);
}
test('canonical CPU 1211C model is in real catalog and Ladder is supported',()=>{
 assert.ok(model);assert.equal(Ladder.supportedPLC(model),true);
});
test('correct positive supply, output bank and DI energize only Q1',()=>check(24,24,24,true,true));
test('lost CPU supply fails closed',()=>check(0,24,24,false,false));
test('reversed CPU supply fails closed despite live DI and output bank',()=>check(-24,24,24,false,false));
test('nonfinite CPU supply cannot energize Q1',()=>check(Infinity,24,24,false,false));
test('reversed output bank cannot energize Q1',()=>check(24,-24,24,true,false));
test('nonfinite output bank cannot energize Q1',()=>check(24,Infinity,24,true,false));
test('reversed DI cannot energize Q1',()=>check(24,24,-24,true,false));
test('nonfinite DI cannot energize Q1',()=>check(24,24,Infinity,true,false));
test('DI cannot borrow CPU M if dedicated 1M reference is disconnected',()=>check(24,24,0,true,false,24));
test('legacy PLC does not probe nonexistent verified output bank',()=>{
 const old={id:'legacy',isPLC:true,outputType:'PNP',pins:[
  {id:'P',label:'L+',signalType:'POWER'}, {id:'M',label:'M',signalType:'POWER'},
  {id:'I',label:'I',signalType:'DI'}, {id:'Q',label:'Q',signalType:'DO'}
 ]};
 const c={plcProgram:'mirror'};
 const net={voltage(_c,a,b){
  if(a==='X12:1')throw Error('legacy PLC has no verified output bank');
  return a==='P'&&b==='M'?-24:a==='I'&&b==='M'?24:0;
 }};
 const state=PLC.evaluate(c,old,net,100);
 assert.equal(state.powered,true);assert.equal(state.outputs.Q,true);
});
