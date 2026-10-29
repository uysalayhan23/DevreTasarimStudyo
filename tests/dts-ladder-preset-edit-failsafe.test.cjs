'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),PLC=require('../dist/plc-runtime.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const lim={inputCount:2,outputCount:2};
const program=(type,preset)=>({version:1,rungs:[
 {id:'block',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:type.startsWith('CT')?'C1':'T1',...(type.startsWith('CT')?{preset}:{presetMs:preset})}},
 {id:'output',paths:[[{type:'NO',ref:type.startsWith('CT')?'C1':'T1'}]],coil:{type:'OUT',ref:'Q1'}}
]});
const scan=(p,mem,time,on)=>{const r=L.scan(p,{I1:on},mem,time,lim);assert.equal(r.ok,true,r.error);return r};
test('TON preset edit restarts delay instead of using old elapsed time',()=>{
 const mem={};scan(program('TON',100),mem,0,true);
 assert.equal(scan(program('TON',20),mem,30,true).outputs.Q1,false);
 assert.equal(scan(program('TON',20),mem,49,true).outputs.Q1,false);
 assert.equal(scan(program('TON',20),mem,50,true).outputs.Q1,true);
});
test('expired TOF cannot turn on just because its preset increases',()=>{
 const mem={};scan(program('TOF',100),mem,0,true);scan(program('TOF',100),mem,10,false);
 assert.equal(scan(program('TOF',100),mem,200,false).outputs.Q1,false);
 assert.equal(scan(program('TOF',500),mem,201,false).outputs.Q1,false);
 assert.equal(scan(program('TOF',500),mem,202,false).outputs.Q1,false);
});
test('TP preset edit with held input cannot retrigger a pulse',()=>{
 const mem={};assert.equal(scan(program('TP',100),mem,0,true).outputs.Q1,true);
 assert.equal(scan(program('TP',200),mem,20,true).outputs.Q1,false);
 assert.equal(scan(program('TP',200),mem,21,true).outputs.Q1,false);
 scan(program('TP',200),mem,22,false);
 assert.equal(scan(program('TP',200),mem,23,true).outputs.Q1,true);
});
test('CTU target edit resets old reached count and output',()=>{
 const mem={};scan(program('CTU',2),mem,0,true);scan(program('CTU',2),mem,1,false);
 assert.equal(scan(program('CTU',2),mem,2,true).outputs.Q1,true);
 const r=scan(program('CTU',3),mem,3,false);
 assert.equal(r.outputs.Q1,false);assert.equal(r.traces[0].count,0);
});
test('CTD target edit reloads the new count without counting held input',()=>{
 const mem={};scan(program('CTD',3),mem,0,false);scan(program('CTD',3),mem,1,true);
 const r=scan(program('CTD',5),mem,2,true);
 assert.equal(r.outputs.Q1,false);assert.equal(r.traces[0].count,5);
 scan(program('CTD',5),mem,3,false);
 assert.equal(scan(program('CTD',5),mem,4,true).traces[0].count,4);
});
test('unchanged presets retain ordinary TON and CTD state',()=>{
 const mem={};scan(program('TON',100),mem,0,true);
 assert.equal(scan(program('TON',100),mem,99,true).outputs.Q1,false);
 assert.equal(scan(program('TON',100),mem,100,true).outputs.Q1,true);
 const counter={};scan(program('CTD',2),counter,0,false);
 assert.equal(scan(program('CTD',2),counter,1,true).traces[0].count,1);
 assert.equal(scan(program('CTD',2),counter,2,true).traces[0].count,1);
});
test('actual catalogue CPU 1211C maps edited TON through native PLC program to DO pin',()=>{
 const d=QA.catalog()['plc-hw-6es7211-1ae40-0xb0'];
 assert.equal(L.supportedPLC(d),true);
 const outputs=d.pins.filter(p=>p.signalType==='DO'),input=d.pins.find(p=>p.signalType==='DI');
 assert.equal(outputs.length,4);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program('TON',100)};
 const at=now=>PLC.program(c,[{id:input.id,value:true}],outputs,now).outputs[outputs[0].id];
 assert.equal(at(0),false);
 c.ladderProgram.rungs[0].coil.presetMs=20;
 assert.equal(at(30),false);
 assert.equal(at(50),true);
});
