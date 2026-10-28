'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Monitor=require('../dist/ladder-monitor.js');
const pins=[{id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},{id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(7+i),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(3+i),signalType:'DO'}))];
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
const inputs=Object.fromEntries(pins.filter(p=>p.signalType==='DI').map(p=>[p.id,false]));
const outputs=Object.fromEntries(pins.filter(p=>p.signalType==='DO').map(p=>[p.id,false]));
const state={powered:true,program:'dts-ladder-v1',inputs,outputs};
const snapshot=(model,runtime)=>Monitor.snapshot({plcProgram:'dts-ladder-v1',_plcRuntime:runtime},model,true,true);
test('complete verified I/O telemetry is live',()=>{const s=snapshot(d,state);assert.equal(s.live,true);assert.equal(s.inputs[0].value,false);});
test('unsupported PLC does not display live telemetry',()=>assert.equal(snapshot({...d,id:'unsupported'},state).live,false));
test('missing digital input telemetry is unknown, not fabricated zero',()=>{const s=snapshot(d,{...state,inputs:{}});assert.equal(s.live,false);assert.equal(s.inputs[0].value,null);});
test('missing digital output telemetry is unknown, not fabricated zero',()=>{const s=snapshot(d,{...state,outputs:{}});assert.equal(s.live,false);assert.equal(s.outputs[0].value,null);});
test('null input telemetry prevents a live indication',()=>assert.equal(snapshot(d,{...state,inputs:{...inputs,'X10:7':null}}).live,false));
test('missing runtime prevents live display',()=>assert.equal(snapshot(d,null).live,false));
