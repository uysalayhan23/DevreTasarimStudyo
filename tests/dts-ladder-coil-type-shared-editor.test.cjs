'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const LAD=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const FBD=require('../dist/fbd-view.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,type,ref)=>({id,paths:[[{type:'NO',ref:'I1'}]],coil:{
 type,ref,...(['TON','TOF','TP'].includes(type)?{presetMs:100}:['CTU','CTD'].includes(type)?{preset:3}:{})
}});
const pg=(...rungs)=>({version:1,rungs});
test('LAD change OUT to TON finds free T2 when T1 occupied',()=>{
 const initial=pg(rung('a','TON','T1'),rung('b','OUT','Q1'));
 const result=LAD.changeCoilType(initial,1,'TON',limits);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.ref,'T2');
 assert.equal(L.validate(result.program,limits).ok,true);
 assert.equal(initial.rungs[1].coil.ref,'Q1');
});
test('LAD change OUT to CTU finds C2 when C1 occupied',()=>{
 const initial=pg(rung('a','CTD','C1'),rung('b','OUT','Q1'));
 const result=LAD.changeCoilType(initial,1,'CTU',limits);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.ref,'C2');
});
test('type editing preserves compatible existing T/C addresses',()=>{
 const p=pg(rung('t','TON','T3'),rung('c','CTU','C2'));
 assert.equal(LAD.changeCoilType(p,0,'TOF',limits).program.rungs[0].coil.ref,'T3');
 assert.equal(LAD.changeCoilType(p,1,'CTD',limits).program.rungs[1].coil.ref,'C2');
});
test('LAD and FBD type changes produce exactly equivalent drafts',()=>{
 const p=pg(rung('t','TON','T1'),rung('out','OUT','Q1'));
 assert.deepEqual(LAD.changeCoilType(p,1,'TP',limits),FBD.editCoil(p,1,{type:'TP'},limits));
});
test('LAD rejects exhausted timer resources without mutating project',()=>{
 const p=pg(...Array.from({length:16},(_,i)=>rung('R'+i,'TON','T'+(i+1))),rung('out','OUT','Q1'));
 assert.equal(L.validate(p,limits).ok,true);
 const r=LAD.changeCoilType(p,16,'TOF',limits);
 assert.equal(r.ok,false);assert.equal(p.rungs[16].coil.ref,'Q1');
});
test('LAD rejects unknown coil type without mutating original',()=>{
 const p=pg(rung('a','OUT','Q1'));
 const r=LAD.changeCoilType(p,0,'INVALID',limits);
 assert.equal(r.ok,false);assert.equal(p.rungs[0].coil.type,'OUT');
});
test('LAD ordinary OUT/SET changes remain valid',()=>{
 const p=pg(rung('a','OUT','Q1'));
 const r=LAD.changeCoilType(p,0,'SET',limits);
 assert.equal(r.ok,true);assert.equal(r.program.rungs[0].coil.ref,'Q1');
});
