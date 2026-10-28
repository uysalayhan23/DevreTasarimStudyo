'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const FBD=require('../dist/fbd-view.js');
const inputs=Array.from({length:6},(_,i)=>({id:'X10:'+(i+7)}));
const outputs=Array.from({length:4},(_,i)=>({id:'X12:'+(i+3)}));
const names=()=>E.contactChoices(inputs,outputs).map(x=>x.ref);
const program=ref=>({version:1,rungs:[{
 id:'R1',paths:[[{type:'NO',ref}]],coil:{type:'OUT',ref:'Q1'}
}]});
test('LAD includes the full native M1-M32 T1-T16 C1-C16 contact range',()=>{
 const refs=names();
 assert.equal(refs.length,6+4+32+16+16);
 assert.equal(new Set(refs).size,refs.length);
 for(const prefix of ['M','T','C']){
  const max=prefix==='M'?32:16;
  for(let i=1;i<=max;i++)assert.ok(refs.includes(prefix+i),prefix+i);
 }
});
test('imported high-address contacts stay selectable in LAD and FBD',()=>{
 for(const ref of ['M9','M32','T5','T16','C5','C16']){
  assert.equal(L.validate(program(ref),{inputCount:6,outputCount:4}).ok,true);
  assert.ok(names().includes(ref));
  assert.equal(FBD.toggleContact(program(ref),'0:0:0',{inputCount:6,outputCount:4}).ok,true);
 }
});
test('physical PLC input and output choices remain bounded by actual pins',()=>{
 const refs=names();
 for(const ref of ['I1','I6','Q1','Q4'])assert.ok(refs.includes(ref));
 for(const ref of ['I7','Q5'])assert.equal(refs.includes(ref),false);
 assert.equal(E.contactChoices([],[]).some(x=>/^[IQ]/.test(x.ref)),false);
});
test('terminal-aware input and output labels are preserved',()=>{
 const choices=E.contactChoices(inputs,outputs);
 assert.equal(choices.find(x=>x.ref==='I6').label,'I6 · X10:12');
 assert.equal(choices.find(x=>x.ref==='Q4').label,'Q4 · X12:6');
});
test('LAD coil outputs remain identical to FBD supported addresses',()=>{
 const items=E.contactChoices(inputs,outputs);
 for(const type of ['OUT','SET','RESET','TON','TOF','TP','CTU','CTD']){
  const actual=E.coilSelectOptions(type,{outputCount:4},items).map(x=>x.value);
  assert.deepEqual(actual,FBD.refsFor(type,{outputCount:4}));
 }
});
