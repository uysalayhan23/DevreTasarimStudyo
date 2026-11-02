'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const inputPins=Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),value:false}));
const outputPins=Array.from({length:4},(_,i)=>({id:'X12:'+(i+3)}));
const limits={inputCount:6,outputCount:4};
const inputBits=Object.fromEntries(inputPins.map((p,i)=>['I'+(i+1),p.value]));
const program={version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'M1'}},
 {id:'R2',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'Q1'}}
]};
function forgedPLC(scan){
 const mod={exports:{}};
 const src=fs.readFileSync(require.resolve('../dist/plc-runtime.js'),'utf8');
 vm.runInNewContext(src,{module:mod,require:()=>({...Ladder,scan})},{filename:'plc-runtime.js'});
 return mod.exports;
}
function run(api,prog=program,ins=inputPins,existing={}){
 const c={plcProgram:'dts-ladder-v1',ladderProgram:prog,...existing};
 const result=api.program(c,ins,outputPins,0);
 return {c,result};
}
function falseMScan(){
 const r=Ladder.scan(program,inputBits,{},0,limits);
 assert.equal(r.ok,true);
 assert.equal(r.outputs.Q1,false);
 r.memory.values.M1=true;
 r.memory.values.Q1=true;
 r.outputs.Q1=true;
 r.traces[0].value=true; // inactive SET falsely invents M1 latch
 r.traces[1].pathStates=[true];r.traces[1].active=true;r.traces[1].value=true;
 return r;
}
test('negative: inactive SET M1 cannot invent a latch and energize Q1 via forged successful scan',()=>{
 const {c,result}=run(forgedPLC(()=>falseMScan()));
 assert.equal(result.outputs['X12:3'],false,'fault must fail closed');
 assert.match(c._dtsLadderError,/geçersiz|doğrulanamadı/i);
 assert.equal(c._dtsLadderTraces.length,0);
 assert.equal(c._dtsLadderMemory,undefined);
});
test('negative: inconsistent active SET M1 trace cannot be trusted',()=>{
 const r=Ladder.scan(program,{...inputBits,I1:true},{},0,limits);
 r.traces[0].value=false;
 const ins=inputPins.map((p,i)=>({...p,value:i===0}));
 const {c,result}=run(forgedPLC(()=>r),program,ins);
 assert.equal(result.outputs['X12:3'],false);
 assert.ok(c._dtsLadderError);
});
test('positive: native inactive SET M1 starts LOW, Q1 stays LOW',()=>{
 const {c,result}=run(PLC);
 assert.equal(result.outputs['X12:3'],false);
 assert.equal(c._dtsLadderMemory.values.M1,undefined);
 assert.equal(c._dtsLadderError,undefined);
});
test('positive: native SET M1 turns Q1 on, retains valid latch after I1 release',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program};
 const ins=inputPins.map((p,i)=>({...p,value:i===0}));
 const first=PLC.program(c,ins,outputPins,0);
 assert.equal(first.outputs['X12:3'],true);
 const next=PLC.program(c,inputPins,outputPins,100);
 assert.equal(next.outputs['X12:3'],true);
 assert.equal(c._dtsLadderError,undefined);
});
test('positive: native RESET M1 clears a previously set latch and Q1',()=>{
 const prog={version:1,rungs:[...program.rungs.slice(0,1),
  {id:'RR',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'M1'}},program.rungs[1]]};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:prog};
 const ins=inputPins.map((p,i)=>({...p,value:i===0}));
 assert.equal(PLC.program(c,ins,outputPins,0).outputs['X12:3'],true);
 const reset=inputPins.map((p,i)=>({...p,value:i===1}));
 assert.equal(PLC.program(c,reset,outputPins,100).outputs['X12:3'],false);
 assert.equal(c._dtsLadderError,undefined);
});
test('positive: independent RESET-only M1 with pre-existing memory stays supported',()=>{
 const prog={version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'M1'}},
  {id:'R2',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:prog,
  _dtsLadderMemory:{values:{M1:true},blocks:{}}};
 assert.equal(PLC.program(c,inputPins,outputPins,0).outputs['X12:3'],true);
 assert.equal(c._dtsLadderError,undefined);
});
