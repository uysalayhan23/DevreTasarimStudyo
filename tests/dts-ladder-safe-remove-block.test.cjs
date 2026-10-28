'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),F=require('../dist/fbd-view.js');
const D=require('../dist/ladder-diagram.js'),E=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,type,ref,contact,settings={})=>({id,paths:[[{type:'NO',ref:contact}]],coil:{type,ref,...settings}});
const pg=(...rungs)=>({version:1,rungs});
const timer=pg(rung('t','TON','T1','I1',{presetMs:100}),rung('out','OUT','Q1','T1'));
test('TON removal extinguishes stale timer and derived physical Q output',()=>{
 const memory={};L.scan(timer,{I1:true},memory,0,limits);
 assert.equal(L.scan(timer,{I1:true},memory,100,limits).outputs.Q1,true);
 const removed=E.removeFunctionBlock(timer,0,limits);
 assert.equal(removed.ok,true);assert.equal(removed.program.rungs[0].coil.type,'NOP');
 assert.equal(removed.program.rungs[0].coil.ref,'');
 assert.equal(timer.rungs[0].coil.type,'TON');
 const result=L.scan(removed.program,{I1:true},memory,110,limits);
 assert.equal(result.outputs.Q1,false);assert.equal(result.memory.values.T1,false);
 assert.equal(result.memory.blocks.T1,undefined);
 assert.equal(result.traces[0].active,true);assert.equal(result.traces[0].value,false);
});
test('CTU removal extinguishes stale C1 and derived physical Q2',()=>{
 const p=pg(rung('c','CTU','C1','I1',{preset:1}),rung('out','OUT','Q2','C1'));
 const memory={};L.scan(p,{I1:false},memory,0,limits);
 assert.equal(L.scan(p,{I1:true},memory,1,limits).outputs.Q2,true);
 const removed=E.removeFunctionBlock(p,0,limits);
 assert.equal(removed.ok,true);
 assert.equal(L.scan(removed.program,{I1:true},memory,2,limits).outputs.Q2,false);
 assert.equal(memory.blocks.C1,undefined);
});
test('one Network can have an address-free output with no Q/M assignment',()=>{
 const p=pg(rung('one','TON','T1','I1',{presetMs:100}));
 const removed=E.removeFunctionBlock(p,0,limits);
 assert.equal(removed.ok,true);assert.equal(L.validate(removed.program,limits).ok,true);
 const memory={values:{M7:true}};
 const result=L.scan(removed.program,{I1:true},memory,20,limits);
 assert.equal(result.ok,true);assert.equal(result.traces[0].value,false);
 assert.equal(memory.values.M7,true);assert.equal(result.outputs.Q1,false);
});
test('reject malformed NOP, invalid position and unrelated OUT removal',()=>{
 for(const coil of [{type:'NOP',ref:'Q1'},{type:'NOP',ref:'',preset:1}])
  assert.equal(L.validate(pg({id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil}),limits).ok,false);
 assert.equal(E.removeFunctionBlock(pg(rung('q','OUT','Q1','I1')),0,limits).ok,false);
 assert.equal(E.removeFunctionBlock(timer,20,limits).ok,false);
});
test('LAD diagram and FBD visual show disconnected output',()=>{
 const removed=E.removeFunctionBlock(timer,0,limits);
 const svg=D.render(removed.program.rungs[0],{live:true,values:{I1:true},pathStates:[true],coilValue:false});
 assert.match(svg,/Çıkış yok/);assert.doesNotMatch(svg,/x2="929" y2="80"/);
 assert.match(F.render(removed.program.rungs[0]),/çıkış yok/);
});
test('FBD edit reverses NOP to valid timer without silent output write',()=>{
 const removed=E.removeFunctionBlock(timer,0,limits);
 const revived=F.editCoil(removed.program,0,{type:'TON'},limits);
 assert.equal(revived.ok,true);assert.equal(revived.program.rungs[0].coil.ref,'T1');
 assert.equal(L.validate(revived.program,limits).ok,true);
});
test('undo and redo reliably restore timer and NOP',()=>{
 const empty=E.removeFunctionBlock(timer,0,limits).program;
 const hist=E.createDraftHistory(timer);assert.equal(hist.push(empty),true);
 assert.equal(hist.undo().rungs[0].coil.type,'TON');
 assert.equal(hist.redo().rungs[0].coil.type,'NOP');
});
