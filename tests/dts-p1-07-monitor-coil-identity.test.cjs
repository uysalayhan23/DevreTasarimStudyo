'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Monitor=require('../dist/ladder-monitor.js');
const Ladder=require('../dist/ladder-runtime.js');
const pins=[{id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},{id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},{id:'X12:2',label:'3M',signalType:'POWER'},...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
const device={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
function context(){const traces=Ladder.scan(program,{I1:true},{},0).traces;return {ladderProgram:program,plcProgram:'dts-ladder-v1',_dtsLadderTraces:traces,_plcRuntime:{powered:true,program:'dts-ladder-v1',inputs:Object.fromEntries(pins.filter(x=>x.signalType==='DI').map(p=>[p.id,false])),outputs:Object.fromEntries(pins.filter(x=>x.signalType==='DO').map(p=>[p.id,false]))}}}
test('valid native trace is live',()=>assert.equal(Monitor.snapshot(context(),device,true,true).live,true));
test('missing coil identity must not appear live',()=>{const c=context();delete c._dtsLadderTraces[0].coil;assert.equal(Monitor.snapshot(c,device,true,true).live,false)});
test('wrong coil identity must not appear live',()=>{const c=context();c._dtsLadderTraces[0].coil='Q2';assert.equal(Monitor.snapshot(c,device,true,true).live,false)});
test('unsaved draft cannot appear live',()=>assert.equal(Monitor.snapshot(context(),device,true,false).live,false));
test('scan fault cannot appear live',()=>assert.equal(Monitor.snapshot(context(),device,true,true,'SCAN_FAILED').live,false));
test('stale extra path cannot appear live',()=>{const c=context();c._dtsLadderTraces[0].pathStates.push(true);assert.equal(Monitor.snapshot(c,device,true,true).live,false)});
