'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),M=require('../dist/ladder-monitor.js');
const pins=[{id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
const p=(kind='OUT',path=true)=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:kind,ref:'Q1'}}]});
const snapshot=(program,input,output,options={})=>{
 const scanned=L.scan(program,{I1:input},{},100,{inputCount:6,outputCount:4});
 assert.equal(scanned.ok,true);
 const state={powered:true,program:'dts-ladder-v1',
  inputs:Object.fromEntries(pins.filter(x=>x.signalType==='DI').map(x=>[x.id,x.id==='X10:7'&&input])),
  outputs:Object.fromEntries(pins.filter(x=>x.signalType==='DO').map(x=>[x.id,x.id==='X12:3'&&output]))};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program,_plcRuntime:state,_dtsLadderTraces:scanned.traces,...options};
 return M.snapshot(c,d,true,true);
};
test('P0-02 rejects forged Q1=1 when native OUT trace is off',()=>{
 const x=snapshot(p(),false,true);
 assert.equal(x.live,false);assert.equal(x.outputs[0].value,null);assert.equal(x.inputs[0].value,null);
});
test('P0-02 rejects stale Q1=0 when native OUT trace is on',()=>{
 const x=snapshot(p(),true,false);
 assert.equal(x.live,false);assert.equal(x.outputs[0].value,null);
});
test('P0-02 keeps native ON/OFF output trace and telemetry in agreement',()=>{
 for(const state of [false,true]){
  const x=snapshot(p(),state,state);
  assert.equal(x.live,true);assert.equal(x.outputs[0].value,state);
 }
});
test('P0-02 unwritten Q2 cannot show a forged live output',()=>{
 const program=p();const x=snapshot(program,false,false,{});
 assert.equal(x.live,true);
 const pinsOut=pins.filter(x=>x.signalType==='DO');
 const scanned=L.scan(program,{I1:false},{},100,{inputCount:6,outputCount:4});
 const state={powered:true,program:'dts-ladder-v1',
  inputs:Object.fromEntries(pins.filter(x=>x.signalType==='DI').map(x=>[x.id,false])),
  outputs:Object.fromEntries(pinsOut.map(x=>[x.id,x.id==='X12:4']))};
 const wrong=M.snapshot({plcProgram:'dts-ladder-v1',ladderProgram:program,_dtsLadderTraces:scanned.traces,_plcRuntime:state},d,true,true);
 assert.equal(wrong.live,false);
});
test('P0-02 genuine SET latch and RESET values remain live',()=>{
 for(const [kind,input,output] of [['SET',true,true],['SET',false,false],['RESET',true,false]]){
  const x=snapshot(p(kind),input,output);assert.equal(x.live,true,kind);
 }
});
test('P0-02 error, saved mismatch and stopped monitor continue failing closed',()=>{
 const program=p();let scanned=L.scan(program,{I1:true},{},100,{inputCount:6,outputCount:4});
 const state={powered:true,program:'dts-ladder-v1',inputs:Object.fromEntries(pins.filter(x=>x.signalType==='DI').map(x=>[x.id,false])),outputs:Object.fromEntries(pins.filter(x=>x.signalType==='DO').map(x=>[x.id,false]))};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program,_plcRuntime:state,_dtsLadderTraces:scanned.traces,_dtsLadderError:'scan fault'};
 assert.equal(M.snapshot(c,d,true,true).live,false);
 delete c._dtsLadderError;
 assert.equal(M.snapshot(c,d,true,false).live,false);
 assert.equal(M.snapshot(c,d,false,true).live,false);
});
