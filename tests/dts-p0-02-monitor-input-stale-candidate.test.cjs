'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),M=require('../dist/ladder-monitor.js');
const pins=[{id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
const p=(mixed=false)=>({version:1,rungs:[{id:'R1',paths:[mixed?[{type:'NO',ref:'I1'},{type:'NO',ref:'M1'}]:[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]});
function snap(scanInput,hardwareInput,mixed=false,withMemory=true){
 const program=p(mixed),s=L.scan(program,{I1:scanInput},{values:{M1:true}},100,{inputCount:6,outputCount:4});
 assert.equal(s.ok,true);
 const state={powered:true,program:'dts-ladder-v1',
  inputs:Object.fromEntries(pins.filter(x=>x.signalType==='DI').map(x=>[x.id,x.id==='X10:7'&&hardwareInput])),
  outputs:Object.fromEntries(pins.filter(x=>x.signalType==='DO').map(x=>[x.id,x.id==='X12:3'&&s.outputs.Q1]))};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program,_plcRuntime:state,_dtsLadderTraces:s.traces};
 if(withMemory)c._dtsLadderMemory=s.memory;
 return M.snapshot(c,d,true,true);
}
test('stale high input trace cannot be advertised as live',()=>assert.equal(snap(true,false).live,false));
test('stale low input trace cannot be advertised as live',()=>assert.equal(snap(false,true).live,false));
test('mixed I/M stale high trace cannot be advertised as live',()=>assert.equal(snap(true,false,true).live,false));
test('matching input and output telemetry remains live',()=>{for(const x of [false,true])assert.equal(snap(x,x).live,true)});
test('missing memory still rejects stale pure I path',()=>{
 assert.equal(snap(true,false,false,false).live,false);
 assert.equal(snap(false,true,false,false).live,false);
});
test('missing memory still rejects energized mixed I/M path with open I',()=>{
 assert.equal(snap(true,false,true,false).live,false);
});
