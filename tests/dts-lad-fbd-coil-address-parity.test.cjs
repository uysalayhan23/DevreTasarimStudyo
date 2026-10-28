'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
test('LAD and FBD list exactly the same valid output addresses',()=>{
 for(const type of ['OUT','SET','RESET','TON','TOF','TP','CTU','CTD']){
  const lad=E.coilSelectOptions(type,limits,[{ref:'Q1',label:'Q1 · Native'}]).map(x=>x.value);
  assert.deepEqual(lad,F.refsFor(type,limits),type);
 }
});
test('RESET can target Timer and Counter in both views without losing the address',()=>{
 for(const ref of ['T1','C1','M16']){
  assert.ok(E.coilSelectOptions('RESET',limits).some(x=>x.value===ref),ref);
  const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'RESET',ref}}]};
  assert.equal(L.validate(p,limits).ok,true);
  assert.equal(F.editCoil(p,0,{ref},limits).ok,true);
 }
});
test('LAD blocks unavailable physical Q outputs while preserving M/T/C ranges',()=>{
 assert.equal(E.coilSelectOptions('OUT',limits).some(x=>x.value==='Q5'),false);
 assert.equal(E.coilSelectOptions('OUT',limits).some(x=>x.value==='M32'),true);
 assert.equal(E.coilSelectOptions('TON',limits).some(x=>x.value==='T16'),true);
 assert.equal(E.coilSelectOptions('CTU',limits).some(x=>x.value==='C16'),true);
 assert.equal(E.coilSelectOptions('SET',limits).some(x=>x.value==='C1'),false);
});
test('real terminal labels remain attached to known mapped Q contacts',()=>{
 const list=E.coilSelectOptions('OUT',limits,[{ref:'Q1',label:'Q1 · Output 1'}]);
 assert.equal(list.find(x=>x.value==='Q1').label,'Q1 · Output 1');
});
