'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),D=require('../dist/ladder-diagram.js'),E=require('../dist/ladder-editor.js'),P=require('../dist/plc-runtime.js'),M=require('../dist/ladder-monitor.js');
const limits={inputCount:2,outputCount:2};
const p={version:1,rungs:[{id:'before',paths:[[{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q2'}},{id:'after',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const draw=(r,s,t)=>D.render(r,{live:true,values:s.memory.values,pathStates:t.pathStates,coilValue:t.value});
test('scan-time trace cannot color a preceding rung from later Q changes',()=>{
 const s=L.scan(p,{I1:true},{},1,limits),row=E.monitorRows(p,p,s.traces,true,'dts-ladder-v1')[0];
 assert.equal(s.memory.values.Q1,true);assert.deepEqual(row.pathStates,[false]);
 assert.doesNotMatch(draw(p.rungs[0],s,s.traces[0]),/dts-ladder-wire-hot/);
});
test('true path and actual output remain green',()=>{
 const s=L.scan(p,{I1:true},{},1,limits),svg=draw(p.rungs[1],s,s.traces[1]);
 assert.match(svg,/dts-ladder-wire-hot/);assert.match(svg,/dts-ladder-path-on/);
});
test('TON input path may be hot while timer output is off',()=>{
 const x={version:1,rungs:[{id:'t',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TON',ref:'T1',presetMs:100}}]};
 const s=L.scan(x,{I1:true},{},0,limits),svg=draw(x.rungs[0],s,s.traces[0]);
 assert.match(svg,/dts-ladder-wire-hot/);assert.doesNotMatch(svg,/dts-ladder-function-block dts-ladder-path-on/);
});
test('RESET input cannot color cleared output coil',()=>{
 const x={version:1,rungs:[{id:'r',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'RESET',ref:'Q1'}}]};
 const s=L.scan(x,{I1:true},{},0,limits);
 assert.doesNotMatch(draw(x.rungs[0],s,s.traces[0]),/dts-ladder-coil-symbol dts-ladder-path-on/);
});
test('no solver trace or unsaved draft suppresses green',()=>{
 const s=L.scan(p,{I1:true},{},1,limits),row=E.monitorRows(p,p,[],true,'dts-ladder-v1')[0];
 assert.equal(row.pathStates,null);
 assert.doesNotMatch(D.render(p.rungs[0],{live:false,values:s.memory.values,pathStates:row.pathStates}),/dts-ladder-wire-hot/);
 const draft=structuredClone(p);draft.rungs[0].paths[0][0].type='NC';
 assert.equal(E.monitorRows(draft,p,s.traces,true,'dts-ladder-v1')[0].pathStates,null);
});
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',label:'L+',signalType:'POWER'},{id:'X10:2',label:'M',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
test('CPU power loss prevents scan and hides IO',()=>{
 const c={id:'plc',plcProgram:'dts-ladder-v1',ladderProgram:L.blank(),_dtsLadderMemory:{values:{Q1:true}},_dtsLadderTraces:[{id:'R1',active:true}]};
 const s=P.evaluate(c,d,{voltage:()=>0},500);
 assert.equal(s.powered,false);assert.equal(s.outputs['X12:3'],false);
 assert.equal(c._dtsLadderMemory,undefined);assert.deepEqual(c._dtsLadderTraces,[]);
 const m=M.snapshot(c,d,true,true);assert.equal(m.live,false);
 assert.equal(m.outputs[0].value,null);assert.match(m.message,/beslemesi yok/);
});
test('CPU power restoration starts fresh scan',()=>{
 const c={id:'plc',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()};
 P.evaluate(c,d,{voltage:()=>0},500);
 const s=P.evaluate(c,d,{voltage:()=>24},600);
 assert.equal(s.powered,true);assert.equal(s.outputs['X12:3'],true);
 assert.deepEqual(c._dtsLadderTraces[0].pathStates,[true]);
});
