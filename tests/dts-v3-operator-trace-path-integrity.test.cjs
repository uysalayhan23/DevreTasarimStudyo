'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../dist/ladder-monitor.js'),L=require('../dist/ladder-runtime.js');
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER',label:'L+'},{id:'X10:2',signalType:'POWER',label:'M'},
 {id:'X10:6',signalType:'POWER',label:'1M'},
 {id:'X12:1',signalType:'POWER',label:'3L+'},{id:'X12:2',signalType:'POWER',label:'3M'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}]};
function fixture(t){return {plcProgram:'dts-ladder-v1',ladderProgram:program,_dtsLadderTraces:[t],_plcRuntime:{powered:true,program:'dts-ladder-v1',inputs:Object.fromEntries(d.pins.filter(p=>p.signalType==='DI').map(p=>[p.id,p.id==='X10:7'])),outputs:Object.fromEntries(d.pins.filter(p=>p.signalType==='DO').map(p=>[p.id,p.id==='X12:3']))}}}
const trace={id:'R1',active:true,value:true,pathStates:[true,false]};
test('P2-04 canonical CPU and complete trace remain live',()=>{
 assert.equal(L.supportedPLC(d),true);
 const s=M.snapshot(fixture(trace),d,true,true);
 assert.equal(s.live,true);assert.equal(s.outputs[0].value,true);
});
test('P2-04 missing pathStates never advertises live IO',()=>{
 const s=M.snapshot(fixture({...trace,pathStates:undefined}),d,true,true);
 assert.equal(s.live,false);assert.equal(s.outputs[0].value,null);
});
test('P2-04 string path state never advertises live IO',()=>{
 assert.equal(M.snapshot(fixture({...trace,pathStates:['true',false]}),d,true,true).live,false);
});
test('P2-04 partial trace never advertises live IO',()=>{
 assert.equal(M.snapshot(fixture({...trace,pathStates:[true]}),d,true,true).live,false);
});
test('P2-04 inconsistent active state never advertises live IO',()=>{
 assert.equal(M.snapshot(fixture({...trace,active:false}),d,true,true).live,false);
});
test('P2-04 power off never advertises live IO',()=>{
 const c=fixture(trace);c._plcRuntime.powered=false;
 assert.equal(M.snapshot(c,d,true,true).live,false);
});
test('P2-04 stopped simulation never advertises live IO',()=>{
 assert.equal(M.snapshot(fixture(trace),d,false,true).live,false);
});
test('P2-04 wrong CPU terminal order never advertises live IO',()=>{
 const bad=structuredClone(d);[bad.pins[5],bad.pins[6]]=[bad.pins[6],bad.pins[5]];
 assert.equal(M.snapshot(fixture(trace),bad,true,true).live,false);
});
