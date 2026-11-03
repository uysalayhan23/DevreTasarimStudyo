'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const outputPins=Array.from({length:4},(_,i)=>({id:'X12:'+(i+3)}));
const inputPins=Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),value:i===0}));
const rung=(id,type,ref,contact,preset=2)=>({id,paths:[[{type:'NO',ref:contact}]],coil:{type,ref,...(['CTU','CTD'].includes(type)?{preset}:{})}});
function program(type){return {version:1,rungs:[rung('count',type,'C1','I1'),rung('lamp','OUT','Q1','C1')]};}
function withScan(scan){
 const module={exports:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8'),
  {module,require:()=>({...Ladder,scan})},{filename:'plc-runtime.js'});
 return module.exports;
}
for(const type of ['CTU','CTD']){
 test(`P0-02 negative: ${type} false C1 memory bit cannot energize Q1`,()=>{
  const fake=(source,inputs,memory,now,limits)=>{
   const result=Ladder.scan(source,inputs,memory,now,limits);
   assert.equal(result.ok,true);
   assert.equal(result.traces[0].value,false);
   // Keep the genuine count and counter trace; forge only the C1 memory bit
   // and its downstream path/output. This previously bypassed the count guard.
   result.memory.values.C1=true;
   result.memory.values.Q1=true;
   result.traces[1].pathStates=[true];
   result.traces[1].active=true;
   result.traces[1].value=true;
   result.outputs.Q1=true;
   return result;
  };
  const c={plcProgram:'dts-ladder-v1',ladderProgram:program(type)};
  const result=withScan(fake).program(c,inputPins,outputPins,100);
  assert.equal(result.outputs['X12:3'],false);
  assert.match(c._dtsLadderError,/geçersiz/i);
  assert.deepEqual(Array.from(c._dtsLadderTraces),[]);
  assert.equal(c._dtsLadderMemory,undefined);
 });
 test(`P0-02 positive: ${type} real count preserves Q1 output and live trace`,()=>{
  const c={plcProgram:'dts-ladder-v1',ladderProgram:program(type)};
  const inputs=on=>inputPins.map((p,i)=>({...p,value:i===0?on:false}));
  const values=[false,true,false,true].map((on,i)=>PLC.program(c,inputs(on),outputPins,100+i*100).outputs['X12:3']);
  assert.deepEqual(values,[false,false,false,true]);
  assert.equal(c._dtsLadderError,undefined);
  assert.equal(c._dtsLadderTraces.length,2);
 });
}
