'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const traces=[{id:'R1',active:true,value:true,pathStates:[true]}];
test('powered PLC displays actual live paths',()=>{
 const row=E.monitorRows(p,p,traces,true,'dts-ladder-v1',true)[0];
 assert.equal(row.active,true);assert.deepEqual(row.pathStates,[true]);assert.equal(row.value,true);
});
test('unpowered PLC does not replay stale green paths or coil values',()=>{
 const row=E.monitorRows(p,p,traces,true,'dts-ladder-v1',false)[0];
 assert.equal(row.active,false);assert.equal(row.value,null);assert.equal(row.pathStates,null);
});
test('unknown PLC supply does not display stale paths',()=>{
 const row=E.monitorRows(p,p,traces,true,'dts-ladder-v1',undefined)[0];
 assert.equal(row.active,false);assert.equal(row.pathStates,null);
});
test('stopped and unsaved draft remain non-live',()=>{
 assert.equal(E.monitorRows(p,p,traces,false,'dts-ladder-v1',true)[0].pathStates,null);
 assert.equal(E.monitorRows(p,{...p,rungs:[]},traces,true,'dts-ladder-v1',true)[0].value,null);
});
