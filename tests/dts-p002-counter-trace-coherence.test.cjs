'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const outputPins=Array.from({length:4},(_,i)=>({id:'X12:'+(i+3)}));
const inputs=(on,reset=false)=>Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),value:i===0?on:i===1?reset:false}));
const rung=(id,type,ref,contact='I1',preset=2)=>({id,paths:[[{type:'NO',ref:contact}]],coil:{type,ref,...(['CTU','CTD'].includes(type)?{preset}:{})}});
const program=type=>({version:1,rungs:[rung('C',type,'C1'),rung('Q','OUT','Q1','C1')]});
function withScan(scan){
 const mod={exports:{}};
 const source=fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8');
 vm.runInNewContext(source,{module:mod,require:()=>({...Ladder,scan})},{filename:'plc-runtime.js'});
 return mod.exports;
}
function run(api,pg,ins,now=100,c=null){
 c ||= {plcProgram:'dts-ladder-v1',ladderProgram:pg};
 const result=api.program(c,ins,outputPins,now);
 return {c,result,q:result.outputs['X12:3']};
}
function forgedScan(source,input,memory,now,limits){
 const r=Ladder.scan(source,input,memory,now,limits);
 assert.equal(r.ok,true);
 r.memory.values.C1=true;r.memory.values.Q1=true;
 r.traces[0].value=true;
 r.traces[1].pathStates=[true];r.traces[1].active=true;r.traces[1].value=true;
 r.outputs.Q1=true;
 return r;
}
for(const type of ['CTU','CTD']){
 test(`positive: ${type} native edges preserve a legitimate Q1 transition`,()=>{
  const pg=program(type),c={plcProgram:'dts-ladder-v1',ladderProgram:pg};
  const actual=[false,true,false,true].map((on,i)=>run(PLC,pg,inputs(on),i*100,c).q);
  assert.deepEqual(actual,[false,false,false,true]);
  assert.equal(c._dtsLadderError,undefined);
 });
 test(`negative: ${type} impossible successful scan cannot energize Q1`,()=>{
  const {c,q}=run(withScan(forgedScan),program(type),inputs(true));
  assert.equal(q,false);assert.ok(c._dtsLadderError);
  assert.equal(c._dtsLadderTraces.length,0);
  assert.equal(c._dtsLadderMemory,undefined);
 });
 test(`negative: ${type} nonnumeric count is rejected`,()=>{
  const scan=(...args)=>{const r=forgedScan(...args);r.traces[0].count=NaN;return r;};
  const {c,q}=run(withScan(scan),program(type),inputs(true));
  assert.equal(q,false);assert.ok(c._dtsLadderError);
 });
 test(`negative: ${type} forged trace count must match real counter state`,()=>{
  const scan=(...args)=>{
   const r=forgedScan(...args);
   r.traces[0].count=type==='CTU'?2:0;
   return r;
  };
  const {c,q}=run(withScan(scan),program(type),inputs(true));
  assert.equal(q,false);assert.ok(c._dtsLadderError);
  assert.equal(c._dtsLadderTraces.length,0);
 });
 test(`positive: ${type} simultaneous RESET keeps Q1 off`,()=>{
  const pg={version:1,rungs:[rung('C',type,'C1'),rung('R','RESET','C1','I2'),rung('Q','OUT','Q1','C1')]};
  const {c,q}=run(PLC,pg,inputs(true,true));
  assert.equal(q,false);assert.equal(c._dtsLadderError,undefined);
 });
}

test('negative: coherent forged counter count and memory cannot energize Q1 on first edge',()=>{
 const scan=(...args)=>{
  const r=forgedScan(...args);
  r.traces[0].count=2;
  r.memory.blocks.C1.count=2;
  return r;
 };
 const {c,q}=run(withScan(scan),program('CTU'),inputs(true));
 assert.equal(q,false);assert.ok(c._dtsLadderError);
 assert.equal(c._dtsLadderTraces.length,0);
});
