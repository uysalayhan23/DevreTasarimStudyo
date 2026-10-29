'use strict';
// Native PLC evaluator and the real 703-entry catalogue: a reordered pin list
// must never remap I1 or energize a different physical Q terminal.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Ladder=require('../dist/ladder-runtime.js'),PLC=require('../dist/plc-runtime.js');
const catalog=QA.catalog(),id='plc-hw-6es7211-1ae40-0xb0',def=catalog[id];
const copy=x=>structuredClone(x);
const swap=(d,a,b)=>{
 const next=copy(d),i=next.pins.findIndex(p=>p.id===a),j=next.pins.findIndex(p=>p.id===b);
 [next.pins[i],next.pins[j]]=[next.pins[j],next.pins[i]];
 return next;
};
const net={voltage(c,a,b){
 return (a==='X10:1'&&b==='X10:2')||(a==='X10:7'&&b==='X10:6')||
  (a==='X12:1'&&b==='X12:2')?24:0;
}};
const plc=()=>({plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()});
test('canonical selectable CPU 1211C retains its exact six DI and four DO order',()=>{
 assert.ok(def);assert.equal(Ladder.supportedPLC(def),true);
 assert.deepEqual(def.pins.filter(p=>p.signalType==='DI').map(p=>p.id),
  ['X10:7','X10:8','X10:9','X10:10','X10:11','X10:12']);
 assert.deepEqual(def.pins.filter(p=>p.signalType==='DO').map(p=>p.id),
  ['X12:3','X12:4','X12:5','X12:6']);
});
test('native evaluator maps real I1 to real Q1 only',()=>{
 const result=PLC.evaluate(plc(),def,net,1000);
 assert.equal(result.outputs['X12:3'],true);assert.equal(result.outputs['X12:4'],false);
});
test('swapped DI array fails closed instead of silently moving I1',()=>{
 const wrong=swap(def,'X10:7','X10:8');
 assert.equal(Ladder.supportedPLC(wrong),false);
 assert.equal(PLC.evaluate(plc(),wrong,net,1000).outputs['X12:3'],false);
});
test('swapped DO array fails closed instead of energizing physical Q2',()=>{
 const wrong=swap(def,'X12:3','X12:4');
 assert.equal(Ladder.supportedPLC(wrong),false);
 const result=PLC.evaluate(plc(),wrong,net,1000);
 assert.equal(result.outputs['X12:3'],false);assert.equal(result.outputs['X12:4'],false);
});
test('renamed DI or DO pin cannot retain the verified native model gate',()=>{
 for(const [id,replacement] of [['X10:8','X10:18'],['X12:4','X12:14']]){
  const wrong=copy(def);wrong.pins.find(p=>p.id===id).id=replacement;
  assert.equal(Ladder.supportedPLC(wrong),false);
 }
});
test('simulation start gate rejects changed terminal ordering',()=>{
 const wrong=swap(def,'X12:3','X12:4');
 const project={components:[{id:'plc',typeId:id,...plc()}]};
 assert.equal(PLC.simulationGate(project,{[id]:wrong}).blocked,true);
 assert.equal(PLC.simulationGate(project,{[id]:def}).blocked,false);
});
