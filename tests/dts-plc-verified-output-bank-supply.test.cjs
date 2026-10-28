'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const PLC=require('../dist/plc-runtime.js'),Ladder=require('../dist/ladder-runtime.js');
const pins=[
 {id:'X10:1',label:'L+',signalType:'POWER'},
 {id:'X10:2',label:'M',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
];
const model={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
function output(cpu,bank,input){
 const c={plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()};
 const net={voltage(_c,a,b){
  if(a==='X10:1'&&b==='X10:2')return cpu?24:0;
  if(a==='X12:1'&&b==='X12:2')return bank;
  if(a==='X10:7'&&b==='X10:6')return input?24:0;
  return 0;
 }};
 return PLC.evaluate(c,model,net,100).outputs['X12:3'];
}
test('verified CPU output energizes with proper CPU and 3L+ bank supplies',()=>assert.equal(output(true,24,true),true));
test('disconnected 3L+ bank cannot energize a Q output',()=>assert.equal(output(true,0,true),false));
test('reversed 3L+ bank polarity cannot energize a Q output',()=>assert.equal(output(true,-24,true),false));
test('CPU supply loss cannot energize a Q output',()=>assert.equal(output(false,24,true),false));
test('open DI cannot energize a Q output with healthy supplies',()=>assert.equal(output(true,24,false),false));
