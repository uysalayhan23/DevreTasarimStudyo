'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Toolbox=require('../dist/ladder-toolbox.js'),L=require('../dist/ladder-runtime.js');
const lim={inputCount:6,outputCount:4};
const rung=(id,type,ref,contact='I1')=>({id,paths:[[{type:'NO',ref:contact}]],coil:{type,ref}});
const program=(...rungs)=>({version:1,rungs});
test('second OUT palette coil uses free Q2 and native scan evaluates both independently',()=>{
 const source=program(rung('a','OUT','Q1'),rung('b','NOP','','I2'));
 const old=JSON.stringify(source);
 const result=Toolbox.apply(source,'OUT',{r:1,kind:'coil'},lim);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.ref,'Q2');
 assert.equal(L.validate(result.program,lim).ok,true);
 const on=L.scan(result.program,{I1:true,I2:false},{},0,lim);
 assert.equal(on.outputs.Q1,true);assert.equal(on.outputs.Q2,false);
 const off=L.scan(result.program,{I1:false,I2:true},{},0,lim);
 assert.equal(off.outputs.Q1,false);assert.equal(off.outputs.Q2,true);
 assert.equal(JSON.stringify(source),old);
});
test('SET palette does not reuse another network OUT address',()=>{
 const result=Toolbox.apply(program(rung('a','OUT','Q1'),rung('b','NOP','')),'SET',{r:1,kind:'coil'},lim);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.ref,'Q2');
});
test('switching existing OUT to SET retains its own free Q address',()=>{
 const result=Toolbox.apply(program(rung('a','OUT','Q3')),'SET',{r:0,kind:'coil'},lim);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[0].coil.ref,'Q3');
});
test('zero-output virtual PLC allocates a free M address',()=>{
 const limits={inputCount:6,outputCount:0};
 const result=Toolbox.apply(program(rung('a','OUT','M1'),rung('b','NOP','')),'OUT',{r:1,kind:'coil'},limits);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.ref,'M2');
 assert.equal(L.validate(result.program,limits).ok,true);
});
test('all Q slots occupied fails closed without changing the source',()=>{
 const source=program(rung('a','OUT','Q1'),rung('b','SET','Q2'),rung('c','NOP',''));
 const original=JSON.stringify(source);
 const result=Toolbox.apply(source,'OUT',{r:2,kind:'coil'},{inputCount:6,outputCount:2});
 assert.equal(result.ok,false);assert.match(result.error,/Boş PLC çıkış adresi/);
 assert.equal(JSON.stringify(source),original);
});
test('RESET remains a separate command and cannot become an OUT writer implicitly',()=>{
 const result=Toolbox.apply(program(rung('a','OUT','Q1'),rung('b','NOP','')),'RESET',{r:1,kind:'coil'},lim);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[1].coil.type,'RESET');
 assert.equal(L.validate(result.program,lim).ok,true);
});
