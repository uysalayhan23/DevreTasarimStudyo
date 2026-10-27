'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const L=require('../dist/ladder-runtime.js'),P=require('../dist/plc-runtime.js');
const verified={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'I'+i,signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'Q'+i,signalType:'DO'}))
]};
test('hardware guard permits only native verified terminal layout',()=>{
 assert.equal(L.supportedPLC(verified),true);
 assert.equal(L.supportedPLC({...verified,id:'unknown-plc'}),false);
 assert.equal(L.supportedPLC({...verified,pins:verified.pins.filter(p=>p.id!=='X12:1')}),false);
});
test('verified PLC output follows a real mapped input',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const s=P.evaluate(c,verified,{voltage:()=>true},1000);
 assert.equal(s.outputs.Q0,true);assert.equal(s.program,'dts-ladder-v1');
});
test('unverified PLC returns all false, not a simulated control',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 const s=P.evaluate(c,{...verified,id:'unknown-plc'},{voltage:()=>true},1000);
 assert.equal(s.outputs.Q0,false);assert.ok(c._dtsLadderError);
});
