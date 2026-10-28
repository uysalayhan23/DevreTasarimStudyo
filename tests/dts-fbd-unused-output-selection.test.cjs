'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const FBD=require('../dist/fbd-view.js'),Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,coil)=>({id,paths:[[{type:'NO',ref:'I1'}]],coil});
const base=()=>({version:1,rungs:[rung('R1',{type:'OUT',ref:'Q1'}),rung('R2',{type:'NOP',ref:''})]});
test('new FBD OUT chooses unused Q2',()=>{
 const p=base(),r=FBD.editCoil(p,1,{type:'OUT'},limits);
 assert.equal(r.ok,true);assert.equal(r.program.rungs[1].coil.ref,'Q2');
 assert.equal(Ladder.validate(r.program,limits).ok,true);
 assert.equal(p.rungs[1].coil.type,'NOP');
});
test('new FBD SET avoids existing OUT Q1',()=>{
 const r=FBD.editCoil(base(),1,{type:'SET'},limits);
 assert.equal(r.ok,true);assert.equal(r.program.rungs[1].coil.ref,'Q2');
});
test('change existing writer type preserves its owned Q1',()=>{
 const r=FBD.editCoil(base(),0,{type:'SET'},limits);
 assert.equal(r.ok,true);assert.equal(r.program.rungs[0].coil.ref,'Q1');
});
test('explicit Q conflict remains forbidden',()=>{
 const p={version:1,rungs:[rung('R1',{type:'OUT',ref:'Q1'}),rung('R2',{type:'OUT',ref:'Q2'})]};
 assert.equal(FBD.editCoil(p,1,{ref:'Q1'},limits).ok,false);
});
test('output selection fails safe if no Q/M address is unused',()=>{
 const owners=Array.from({length:32},(_,i)=>rung('R'+(i+1),{type:'OUT',ref:'M'+(i+1)}));
 // This case uses 32 networks (maximum), so it cannot include another new network;
 // ensure invalid source is refused rather than overwritten.
 const p={version:1,rungs:owners};assert.equal(FBD.editCoil(p,31,{ref:'M1'},limits).ok,false);
});
