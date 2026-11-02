'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const L=require('../dist/ladder-runtime.js');
const M=require('../dist/ladder-monitor.js');
const E=require('../dist/ladder-editor.js');
const editorSource=fs.readFileSync(path.resolve(__dirname,'../dist/ladder-editor.js'),'utf8');
const cpu={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',signalType:'POWER',label:'1M'},
 {id:'X12:1',signalType:'POWER',label:'3L+'},{id:'X12:2',signalType:'POWER',label:'3M'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
assert.equal(L.supportedPLC(cpu),true);
function fixture({internal=true,input=true}={}) {
 const program={version:1,rungs:[{id:'R1',paths:[[
  {type:'NO',ref:'I1'},...(internal?[{type:'NO',ref:'M1'}]:[])
 ]],coil:{type:'OUT',ref:'Q1'}}]};
 const scan=L.scan(program,{I1:input},{values:{M1:true}},100,{inputCount:6,outputCount:4});
 assert.equal(scan.ok,true,scan.error);
 const c={id:'CPU-A',typeId:'cpu',plcProgram:'dts-ladder-v1',ladderProgram:program,
   _dtsLadderTraces:scan.traces,_dtsLadderMemory:scan.memory,
   _plcRuntime:{powered:true,program:'dts-ladder-v1',
    inputs:Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DI').map((p,i)=>[p.id,i===0?input:false])),
    outputs:Object.fromEntries(cpu.pins.filter(p=>p.signalType==='DO').map((p,i)=>[p.id,i===0?!!scan.outputs.Q1:false]))}};
 return {c,program};
}
function snapshot(v){return M.snapshot(v.c,cpu,true,true)}
function row(api,v,trust){return api.monitorRows(v.program,v.program,v.c._dtsLadderTraces,true,
 'dts-ladder-v1',v.c._plcRuntime.powered,v.c._dtsLadderError,
 'dts-ladder-v1',{inputCount:6,outputCount:4},trust)[0]}
for(const [name,damage] of [
 ['missing I1 sample',v=>delete v.c._dtsLadderMemory.values.I1],
 ['missing I6 sample',v=>delete v.c._dtsLadderMemory.values.I6],
 ['corrupt I2 sample',v=>v.c._dtsLadderMemory.values.I2='bad'],
 ['missing scan memory',v=>delete v.c._dtsLadderMemory],
 ['physical input disagreement',v=>v.c._plcRuntime.inputs['X10:7']=false],
 ['physical output disagreement',v=>v.c._plcRuntime.outputs['X12:3']=false],
 ['PLC power loss',v=>v.c._plcRuntime.powered=false],
 ['stale trace shape',v=>v.c._dtsLadderTraces=[]]
])test('P0-02 negative: '+name+' is never shown as live Network',()=>{
 const v=fixture();damage(v);const trust=snapshot(v).live;
 assert.equal(trust,false,'Original hardware-aware monitor must reject the scenario');
 const shown=row(E,v,trust);
 assert.equal(shown.active,false);
 assert.equal(shown.value,null);
 assert.equal(shown.pathStates,null);
});
test('P0-02 positive: complete native internal-memory trace remains live',()=>{
 const v=fixture();const trusted=snapshot(v).live;
 assert.equal(trusted,true);assert.equal(row(E,v,trusted).active,true);
});
test('P0-02 positive: physical-I-only legacy program without scan memory remains live',()=>{
 const v=fixture({internal:false});delete v.c._dtsLadderMemory;
 const trusted=snapshot(v).live;
 assert.equal(trusted,true);assert.equal(row(E,v,trusted).active,true);
});
test('P0-02 regression: render, timer and diagram must consume the same monitor snapshot',()=>{
 assert.match(editorSource,/const telemetry=Monitor\.snapshot\(active\.c,active\.d,editor\.running,live\);/);
 assert.match(editorSource,/const telemetry=Monitor\.snapshot\(active\.c,active\.d,editor\.running,liveSaved\);/);
 assert.equal((editorSource.match(/limits\(\),telemetry\.live\)/g)||[]).length,2);
 assert.equal((editorSource.match(/const (?:liveBits|bits)=telemetry\.live\?/g)||[]).length,2);
 assert.match(editorSource,/Monitor\.markup\(telemetry\)/);
 assert.match(editorSource,/const info=telemetry;/);
});
test('P0-03 regression: prior export context lock survives the P0-02 fix',()=>{
 assert.match(editorSource,/if\(type==='export-program'\)\{\s*if\(!canCommitDraft\(active,editor\)\)/);
});
