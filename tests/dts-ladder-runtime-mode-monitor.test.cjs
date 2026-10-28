'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const traces=[{id:'R1',active:true,value:true,pathStates:[true]}];
const row=(running,powered,error,runtimeMode)=>E.monitorRows(program,program,traces,running,'dts-ladder-v1',powered,error,runtimeMode)[0];
test('live verified Ladder runtime displays network signal',()=>{
 const r=row(true,true,null,'dts-ladder-v1');assert.equal(r.active,true);assert.equal(r.value,true);
});
test('stale runtime in legacy mode never displays Ladder signals',()=>{
 const r=row(true,true,null,'start-stop-latch');assert.equal(r.active,false);assert.equal(r.value,null);assert.equal(r.pathStates,null);
});
test('scan failure hides old timer and output states',()=>{
 const r=row(true,true,'Ladder validation failed','dts-ladder-v1');assert.equal(r.active,false);assert.equal(r.value,null);
});
test('unpowered PLC never displays a live network',()=>{
 const r=row(true,false,null,'dts-ladder-v1');assert.equal(r.active,false);assert.equal(r.value,null);
});
test('stopped simulation never advertises stale network',()=>{
 const r=row(false,true,null,'dts-ladder-v1');assert.equal(r.active,false);assert.equal(r.value,null);
});
