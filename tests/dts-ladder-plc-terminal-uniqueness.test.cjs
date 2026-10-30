'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const pins=[
 {id:'X10:1',signalType:'POWER'},
 {id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
];
const model=()=>({id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:JSON.parse(JSON.stringify(pins))});
test('verified CPU 1211C terminal layout remains supported',()=>assert.equal(Ladder.supportedPLC(model()),true));
test('duplicate DI terminal ID is rejected',()=>{
 const d=model();d.pins[4].id=d.pins[3].id;assert.equal(Ladder.supportedPLC(d),false);
});
test('duplicate DO terminal ID is rejected',()=>{
 const d=model();d.pins[10].id=d.pins[9].id;assert.equal(Ladder.supportedPLC(d),false);
});
test('duplicate power terminal ID is rejected',()=>{
 const d=model();d.pins[1].id=d.pins[0].id;assert.equal(Ladder.supportedPLC(d),false);
});
test('unnamed terminal is rejected',()=>{
 const d=model();delete d.pins[12].id;assert.equal(Ladder.supportedPLC(d),false);
});
test('different PLC part is not falsely accepted',()=>{
 const d=model();d.id='other-plc';assert.equal(Ladder.supportedPLC(d),false);
});
