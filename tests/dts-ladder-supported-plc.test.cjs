'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const L=require('../dist/ladder-runtime.js'),P=require('../dist/plc-runtime.js');
const verified={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
test('hardware guard permits only native verified terminal layout',()=>{
 assert.equal(L.supportedPLC(verified),true);
 assert.equal(L.supportedPLC({...verified,id:'unknown-plc'}),false);
 assert.equal(L.supportedPLC({...verified,pins:verified.pins.filter(p=>p.id!=='X12:1')}),false);
 for(const id of ['X12:2','X10:7','X12:3'])assert.equal(L.supportedPLC({...verified,pins:verified.pins.filter(p=>p.id!==id)}),false,id);
 assert.equal(L.supportedPLC({...verified,pins:verified.pins.map(p=>p.id==='X12:2'?{...p,label:'3L+'}:p)}),false,'3M bank mismatch');
});
test('verified PLC output follows a real mapped input',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const s=P.evaluate(c,verified,{voltage:()=>true},1000);
 assert.equal(s.outputs['X12:3'],true);assert.equal(s.program,'dts-ladder-v1');
});
test('unverified PLC returns all false, not a simulated control',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const s=P.evaluate(c,{...verified,id:'unknown-plc'},{voltage:()=>true},1000);
 assert.equal(s.outputs['X12:3'],false);assert.ok(c._dtsLadderError);
});
