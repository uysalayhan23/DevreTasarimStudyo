'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const rung=(id,input,kind,out)=>({id,paths:[[{type:'NO',ref:input}]],coil:{type:kind,ref:out}});
const program=(...rungs)=>({version:1,rungs});
test('unwritten physical Q outputs cannot retain previous program energization',()=>{
 const old=program(rung('R1','I1','OUT','Q1'));
 const fresh=program(rung('R2','I2','OUT','Q2'));
 const memory={};
 assert.equal(L.scan(old,{I1:true},memory,1,limits).outputs.Q1,true);
 const result=L.scan(fresh,{I2:false},memory,2,limits);
 assert.equal(result.ok,true);
 assert.equal(result.outputs.Q1,false,'Q1 was removed from program and must not remain ON');
 assert.equal(result.memory.values.Q1,false,'removed Q1 must not feed stale internal contacts');
 assert.equal(result.outputs.Q2,false);
});
test('SET coil retains its assigned Q latch across scans, other Q outputs remain OFF',()=>{
 const p=program(rung('R1','I1','SET','Q1'));
 const memory={};
 assert.equal(L.scan(p,{I1:true},memory,1,limits).outputs.Q1,true);
 const later=L.scan(p,{I1:false},memory,2,limits);
 assert.equal(later.outputs.Q1,true);
 assert.deepEqual([later.outputs.Q2,later.outputs.Q3,later.outputs.Q4],[false,false,false]);
});
test('unwritten Q contact is false after removing its driving rung',()=>{
 const memory={};
 L.scan(program(rung('R1','I1','OUT','Q1')),{I1:true},memory,1,limits);
 const p=program(rung('R2','Q1','OUT','Q2'));
 const result=L.scan(p,{},memory,2,limits);
 assert.equal(result.outputs.Q1,false);
 assert.equal(result.outputs.Q2,false,'Q1 NO contact must not read stale true');
});
test('invalid rung remains blocked with no energized physical outputs',()=>{
 const p=program(rung('R1','I7','OUT','Q1'));
 const r=L.scan(p,{I7:true},{},0,limits);
 assert.equal(r.ok,false);assert.deepEqual(r.outputs,{});
});
