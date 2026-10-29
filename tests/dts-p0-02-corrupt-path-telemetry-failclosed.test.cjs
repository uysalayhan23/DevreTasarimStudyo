'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4};
const program=L.blank();
const good=(input=true)=>L.scan(program,{I1:input},{},0,limits).traces[0];
const status=(p,traces)=>E.monitorRows(p,p,traces,true,'dts-ladder-v1',true);
function expectUnknown(traces,p=program){const rows=status(p,traces);for(const r of rows){assert.equal(r.active,false);assert.equal(r.value,null);assert.equal(r.pathStates,null);assert.equal(r.status,'Sinyal bekleniyor')}}
test('P0-02 reject missing native path-state telemetry',()=>expectUnknown([{...good(),pathStates:undefined}]));
test('P0-02 reject truncated branch-state telemetry',()=>expectUnknown([{...good(),pathStates:[]}]));
test('P0-02 reject nonboolean branch-state telemetry',()=>expectUnknown([{...good(),pathStates:['true']}]));
test('P0-02 reject false ACTIVE when no branch conducts',()=>expectUnknown([{...good(false),active:true}]));
test('P0-02 reject false INACTIVE when a branch conducts',()=>expectUnknown([{...good(true),active:false}]));
test('P0-02 reject whole partial telemetry batch when second rung is malformed',()=>{
 const p={version:1,rungs:[{...program.rungs[0]},{id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q2'}}]};
 const traces=L.scan(p,{I1:true,I2:false},{},0,limits).traces;
 expectUnknown([traces[0],{...traces[1],pathStates:null}],p);
});
test('P0-02 genuine native energized rung remains ACTIVE',()=>{const row=status(program,[good(true)])[0];assert.equal(row.status,'AKTİF');assert.equal(row.active,true);assert.equal(row.value,true);assert.deepEqual(row.pathStates,[true])});
test('P0-02 genuine native deenergized rung remains Pasif',()=>{const row=status(program,[good(false)])[0];assert.equal(row.status,'Pasif');assert.equal(row.active,false);assert.equal(row.value,false);assert.deepEqual(row.pathStates,[false])});
test('P0-02 native TON may have active input path while output still off',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TON',ref:'T1',presetMs:100}}]};
 const trace=L.scan(p,{I1:true},{},0,limits).traces[0],row=status(p,[trace])[0];
 assert.equal(trace.active,true);assert.equal(trace.value,false);assert.equal(row.active,true);assert.equal(row.value,false);assert.deepEqual(row.pathStates,[true]);
});
test('P0-02 native parallel branches use OR truth for ACTIVE',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const trace=L.scan(p,{I1:false,I2:true},{},0,limits).traces[0],row=status(p,[trace])[0];
 assert.equal(row.active,true);assert.deepEqual(row.pathStates,[false,true]);
});
test('P0-02 scan failure still suppresses otherwise valid live trace',()=>{
 const row=E.monitorRows(program,program,[good(true)],true,'dts-ladder-v1',true,'Native failure')[0];
 assert.equal(row.value,null);assert.equal(row.active,false);assert.equal(row.status,'PLC taraması başarısız');
});
