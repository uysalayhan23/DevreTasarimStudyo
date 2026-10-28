'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const t=[{id:'R1',active:true,value:true,pathStates:[true]}];
const row=(powered,running=true,saved=p)=>E.monitorRows(p,saved,t,running,'dts-ladder-v1',powered)[0];
test('powerless PLC reports supply absence without displaying stale signals',()=>{
 const x=row(false);assert.equal(x.status,'PLC beslemesi yok');
 assert.equal(x.value,null);assert.equal(E.signalText(x),'—');
});
test('valid powered PLC retains live signal and correct active description',()=>{
 const x=row(true);assert.equal(x.status,'AKTİF');assert.equal(x.value,true);
});
test('simulation stopped and draft mismatch are not mislabeled as supply fault',()=>{
 assert.equal(row(false,false).status,'Simülasyon kapalı');
 const changed={...p,rungs:[]};
 assert.equal(row(true,true,changed).status,'Taslak izlenmiyor · kayıtlı program farklı');
});
test('unknown power is not falsely labeled as a valid live PLC',()=>{
 const x=row(undefined);assert.equal(x.status,'PLC beslemesi yok');
 assert.equal(x.value,null);
});
