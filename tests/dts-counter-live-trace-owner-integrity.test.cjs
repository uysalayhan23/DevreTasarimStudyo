'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js'),M=require('../dist/ladder-monitor.js');
const lim={inputCount:6,outputCount:4};
const def=()=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'CTU',ref:'C1',preset:3}},
 {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'C1'}},
 {id:'R3',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q1'}}
]});
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'}, {id:'X10:2',signalType:'POWER'}, {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'}, {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(7+i),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(3+i),signalType:'DO'}))
]};
function state(p,traces){
 const inputs=Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DI').map(p=>[p.id,false]));
 const outputs=Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DO').map(p=>[p.id,false]));
 return {plcProgram:'dts-ladder-v1',ladderProgram:p,_dtsLadderTraces:traces,
  _plcRuntime:{powered:true,program:'dts-ladder-v1',inputs,outputs}};
}
const sample=(p=def(),input={I1:true,I2:false})=>L.scan(p,input,{},10,lim);
test('RESET rung must not claim to be a live counter or show count',()=>{
 const p=def(),t=sample(p).traces,r=E.monitorRows(p,p,t,true,'dts-ladder-v1',true);
 assert.equal(t[1].count,1,'native interpreter previously exposes the owned counter count on RESET trace');
 assert.equal(r[0].count,1);assert.equal(E.signalText(r[0]),'0 · Sayaç 1/3');
 assert.equal(r[1].type,'RESET');assert.equal(r[1].count,null);assert.equal(E.signalText(r[1]),'0');
});
test('RESET active must clear counter without borrowing C1 count readout',()=>{
 const p=def(),m={};L.scan(p,{I1:true,I2:false},m,1,lim);
 const s=L.scan(p,{I1:false,I2:true},m,2,lim),r=E.monitorRows(p,p,s.traces,true,'dts-ladder-v1',true);
 assert.equal(s.memory.blocks.C1.count,0);assert.equal(r[1].count,null);assert.equal(E.signalText(r[1]),'0');
});
test('counter trace from different coil address rejected as live Network',()=>{
 const p=def(),traces=sample(p).traces.map(t=>({...t}));
 traces[0].coil='C2';
 const view=E.monitorRows(p,p,traces,true,'dts-ladder-v1',true);
 assert.ok(view.every(x=>x.value===null&&x.pathStates===null), 'whole stale trace batch must not be displayed');
});
test('read-only I/O panel rejects mixed program revision with C2 trace',()=>{
 const p=def(),t=sample(p).traces.map(t=>({...t}));t[0].coil='C2';
 const info=M.snapshot(state(p,t),cpu,true,true);
 assert.equal(info.live,false);assert.ok(info.inputs.every(x=>x.value===null));assert.ok(info.outputs.every(x=>x.value===null));
});
test('native C1, RESET and Q1 telemetry stays valid; a valid count is displayed',()=>{
 const p=def(),s=sample(p),rows=E.monitorRows(p,p,s.traces,true,'dts-ladder-v1',true);
 assert.equal(s.ok,true);assert.equal(rows[0].count,1);assert.equal(E.signalText(rows[0]),'0 · Sayaç 1/3');
 assert.equal(rows[2].count,null);assert.equal(rows[2].value,false);
 assert.equal(M.snapshot(state(p,s.traces),cpu,true,true).live,true);
});
test('CTD counter count still displays preset-relative progress',()=>{
 const p=def();p.rungs[0].coil={type:'CTD',ref:'C1',preset:3};
 const s=sample(p),rows=E.monitorRows(p,p,s.traces,true,'dts-ladder-v1',true);
 assert.equal(rows[0].count,2);assert.equal(E.signalText(rows[0]),'0 · Sayaç 2/3');
});
test('old valid save and native program have separate copies on editor state',()=>{
 const p=def(),saved=structuredClone(p);assert.equal(L.validate(p,lim).ok,true);
 assert.deepEqual(E.createDraftHistory(saved).current(),p);
});
