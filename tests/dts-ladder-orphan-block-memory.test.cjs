'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const FBD=require('../dist/fbd-view.js');
const limits={inputCount:3,outputCount:3};
const rung=(id,type,ref,contact='I1',preset=10)=>({
 id,paths:[[{type:'NO',ref:contact}]],
 coil:{type,ref,...(['TON','TOF','TP'].includes(type)?{presetMs:preset}:
   ['CTU','CTD'].includes(type)?{preset}:{})}
});
const pg=(...rungs)=>({version:1,rungs});
test('removing TON clears ghost T1 contact and obsolete timing state',()=>{
 const timer=pg(rung('timer','TON','T1'),rung('load','OUT','Q1','T1'));
 const withoutTimer=pg(rung('load','OUT','Q1','T1')),memory={};
 assert.equal(L.scan(timer,{I1:true},memory,0,limits).outputs.Q1,false);
 assert.equal(L.scan(timer,{I1:true},memory,10,limits).outputs.Q1,true);
 assert.equal(L.scan(withoutTimer,{I1:false},memory,11,limits).outputs.Q1,false);
 assert.equal(memory.values.T1,false);
 assert.equal(memory.blocks.T1,undefined);
});
test('removing CTU clears ghost C1 contact and obsolete count state',()=>{
 const counter=pg(rung('counter','CTU','C1','I1',1),rung('load','OUT','Q1','C1'));
 const withoutCounter=pg(rung('load','OUT','Q1','C1')),memory={};
 L.scan(counter,{I1:false},memory,0,limits);
 assert.equal(L.scan(counter,{I1:true},memory,1,limits).outputs.Q1,true);
 assert.equal(L.scan(withoutCounter,{I1:false},memory,2,limits).outputs.Q1,false);
 assert.equal(memory.values.C1,false);
 assert.equal(memory.blocks.C1,undefined);
});
test('current TON and CTU owners preserve timing and counting across scans',()=>{
 const timer=pg(rung('timer','TON','T1'),rung('load','OUT','Q1','T1'));
 const tMem={};
 assert.equal(L.scan(timer,{I1:true},tMem,0,limits).outputs.Q1,false);
 assert.equal(L.scan(timer,{I1:true},tMem,9,limits).outputs.Q1,false);
 assert.equal(L.scan(timer,{I1:true},tMem,10,limits).outputs.Q1,true);
 const counter=pg(rung('counter','CTU','C1','I1',2),rung('load','OUT','Q1','C1'));
 const cMem={};
 L.scan(counter,{I1:false},cMem,0,limits);
 assert.equal(L.scan(counter,{I1:true},cMem,1,limits).outputs.Q1,false);
 L.scan(counter,{I1:false},cMem,2,limits);
 assert.equal(L.scan(counter,{I1:true},cMem,3,limits).outputs.Q1,true);
});
test('legacy orphan T/C bits are ignored on the first scan',()=>{
 const project=pg(rung('q1','OUT','Q1','T4'),rung('q2','OUT','Q2','C3'));
 const memory={values:{T4:true,C3:true},blocks:{T4:{start:1},C3:{count:7}}};
 const result=L.scan(project,{},memory,100,limits);
 assert.equal(result.ok,true);
 assert.equal(result.outputs.Q1,false);assert.equal(result.outputs.Q2,false);
 assert.equal(memory.blocks.T4,undefined);assert.equal(memory.blocks.C3,undefined);
});
test('M latch memory is not cleared when timer/counter owners disappear',()=>{
 const program=pg(rung('set','SET','M1'),rung('output','OUT','Q1','M1'));
 const memory={};
 assert.equal(L.scan(program,{I1:true},memory,0,limits).outputs.Q1,true);
 assert.equal(L.scan(program,{I1:false},memory,1,limits).outputs.Q1,true);
 assert.equal(memory.values.M1,true);
});
test('FBD CTU to inactive RESET draft cannot leave old C1 contact energized',()=>{
 const counter=pg(rung('count','CTU','C1','I1',1),rung('load','OUT','Q1','C1'));
 const memory={};
 L.scan(counter,{I1:false},memory,0,limits);
 assert.equal(L.scan(counter,{I1:true},memory,1,limits).outputs.Q1,true);
 const changed=FBD.editCoil(counter,0,{type:'RESET'},limits);
 assert.equal(changed.ok,true);
 assert.equal(counter.rungs[0].coil.type,'CTU');
 assert.equal(L.scan(changed.program,{I1:false},memory,2,limits).outputs.Q1,false);
 assert.equal(memory.blocks.C1,undefined);
});
