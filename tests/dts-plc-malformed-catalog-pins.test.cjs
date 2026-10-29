'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const PLC=require('../dist/plc-runtime.js');
const Ladder=require('../dist/ladder-runtime.js');
const pin=(id,signalType,label)=>({id,signalType,label:label||id});
test('P2-01 corrupt null pin entry never crashes valid DI enumeration',()=>{
 assert.deepEqual(PLC.pins({pins:[null,pin('I1','DI'),pin('Q1','DO')]},'DI').map(p=>p.id),['I1']);
});
test('P2-01 malformed non-array pin collection is not interpreted as a verified model',()=>{
 assert.deepEqual(PLC.pins({pins:{0:pin('I1','DI')}},'DI'),[]);
 assert.equal(PLC.supplyPair({pins:{0:pin('L','POWER')}}),null);
});
test('P2-01 missing pin identities are excluded from PLC I/O mapping',()=>{
 assert.deepEqual(PLC.pins({pins:[pin('','DO'),{signalType:'DO'},pin('Q1','DO')]},'DO').map(p=>p.id),['Q1']);
});
test('P2-01 malformed unsupported PLC catalog cannot energize stale Ladder output',()=>{
 const def={id:'broken-model',pins:[null,pin('L','POWER','L+'),pin('M','POWER','M'),pin('I1','DI'),pin('Q1','DO')]};
 const cpu={id:'plc',plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank(),
  _dtsLadderTraces:[{active:true}],_dtsLadderMemory:{values:{Q1:true}}};
 const state=PLC.evaluate(cpu,def,{voltage:()=>24,dcVoltage:()=>24},100);
 assert.equal(state.outputs.Q1,false);assert.deepEqual(cpu._dtsLadderTraces,[]);
 assert.equal(cpu._dtsLadderMemory,undefined);
});
test('P2-01 correct canonical PLC pins retain their original order and types',()=>{
 const def={pins:[pin('L','POWER','L+'),pin('M','POWER','M'),pin('I1','DI'),pin('I2','DI'),pin('Q1','DO')]};
 assert.deepEqual(PLC.pins(def,'DI').map(p=>p.id),['I1','I2']);
 assert.deepEqual(PLC.pins(def,'DO').map(p=>p.id),['Q1']);
 assert.equal(PLC.supplyPair(def).type,'dc');
});
