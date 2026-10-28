'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const T=require('../dist/ladder-toolbox.js'),L=require('../dist/ladder-runtime.js');
const lim={inputCount:6,outputCount:4};
const rung=(id,type,ref,settings={})=>({id,paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref,...settings}});
const pg=(...rungs)=>({version:1,rungs});
test('palette TON finds T2 when first owner uses T1',()=>{
 const p=pg(rung('a','TON','T1',{presetMs:100}),rung('b','NOP',''));
 const x=T.apply(p,'TON',{r:1,kind:'coil'},lim);
 assert.equal(x.ok,true);assert.equal(x.program.rungs[1].coil.ref,'T2');
 assert.equal(x.program.rungs[1].coil.presetMs,1000);
 assert.equal(L.validate(x.program,lim).ok,true);
 assert.equal(p.rungs[1].coil.type,'NOP');
});
test('palette CTD finds C2 when first owner uses C1',()=>{
 const p=pg(rung('a','CTU','C1',{preset:3}),rung('b','NOP',''));
 const x=T.apply(p,'CTD',{r:1,kind:'coil'},lim);
 assert.equal(x.ok,true);assert.equal(x.program.rungs[1].coil.ref,'C2');
});
test('timer type change preserves own free address and time',()=>{
 const p=pg(rung('a','TON','T3',{presetMs:1250}));
 const x=T.apply(p,'TOF',{r:0,kind:'coil'},lim);
 assert.equal(x.ok,true);assert.equal(x.program.rungs[0].coil.ref,'T3');
 assert.equal(x.program.rungs[0].coil.presetMs,1250);
});
test('counter type change preserves own address and target',()=>{
 const p=pg(rung('a','CTU','C4',{preset:12}));
 const x=T.apply(p,'CTD',{r:0,kind:'network'},lim);
 assert.equal(x.ok,true);assert.equal(x.program.rungs[0].coil.ref,'C4');
 assert.equal(x.program.rungs[0].coil.preset,12);
});
test('all T slots used returns error without modifying source',()=>{
 const p=pg(...Array.from({length:16},(_,i)=>rung('t'+i,'TON','T'+(i+1),{presetMs:100})),rung('new','NOP',''));
 assert.equal(L.validate(p,lim).ok,true);
 const x=T.apply(p,'TP',{r:16,kind:'coil'},lim);
 assert.equal(x.ok,false);assert.match(x.error,/Boş zamanlayıcı/);
 assert.equal(p.rungs[16].coil.type,'NOP');
});
test('all C slots used returns error without modifying source',()=>{
 const p=pg(...Array.from({length:16},(_,i)=>rung('c'+i,'CTU','C'+(i+1),{preset:1})),rung('new','NOP',''));
 assert.equal(T.apply(p,'CTD',{r:16,kind:'coil'},lim).ok,false);
 assert.equal(p.rungs[16].coil.ref,'');
});
test('regular OUT and NC tools remain operational',()=>{
 const p=pg(rung('a','NOP',''));
 const output=T.apply(p,'OUT',{r:0,kind:'coil'},lim);
 assert.equal(output.ok,true);assert.equal(output.program.rungs[0].coil.ref,'Q1');
 const contact=T.apply(p,'NC',{r:0,kind:'contact',p:0,i:1},lim);
 assert.equal(contact.ok,true);assert.equal(contact.program.rungs[0].paths[0][1].type,'NC');
 assert.equal(p.rungs[0].paths[0].length,1);
});
test('invalid position and placement safely rejected',()=>{
 const p=pg(rung('a','NOP',''));
 assert.equal(T.apply(p,'TON',{r:2,kind:'coil'},lim).ok,false);
 assert.equal(T.apply(p,'TON',{r:0,kind:'contact'},lim).ok,false);
});
