'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const Toolbox=require('../dist/ladder-toolbox.js');
const limits={inputCount:4,outputCount:4};
const row=(id,type,ref)=>({id,paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref}});
const program=(...rows)=>({version:1,rungs:rows});
function applyAndCheck(source,tool,index=0,io=limits){
 const before=JSON.stringify(source),result=Toolbox.apply(source,tool,{kind:'coil',r:index},io);
 assert.equal(JSON.stringify(source),before,'draft input remains immutable');
 assert.equal(result.ok,true,result.error);
 assert.equal(Ladder.validate(result.program,io).ok,true);
 return result.program;
}
for(const [type,tool] of [['OUT','SET'],['SET','OUT'],['OUT','OUT'],['SET','SET']]){
 test('palette '+type+' to '+tool+' keeps existing M7 with physical Q available',()=>{
  const result=applyAndCheck(program(row('R1',type,'M7')),tool);
  assert.deepEqual(result.rungs[0].coil,{type:tool,ref:'M7'});
 });
}
test('RESET M7 to SET keeps M7 when no other writer owns it',()=>{
 const result=applyAndCheck(program(row('R1','RESET','M7')),'SET');
 assert.deepEqual(result.rungs[0].coil,{type:'SET',ref:'M7'});
});
test('RESET M7 to OUT cannot steal an existing M7 writer',()=>{
 const result=applyAndCheck(program(row('R1','OUT','M7'),row('R2','RESET','M7')),'OUT',1);
 assert.deepEqual(result.rungs[0].coil,{type:'OUT',ref:'M7'});
 assert.deepEqual(result.rungs[1].coil,{type:'OUT',ref:'Q1'});
});
test('existing Q2 remains Q2 on SET replacement',()=>{
 const result=applyAndCheck(program(row('R1','OUT','Q2')),'SET');
 assert.deepEqual(result.rungs[0].coil,{type:'SET',ref:'Q2'});
});
test('new NOP still defaults to free physical Q',()=>{
 const result=applyAndCheck(program(row('R1','NOP','')),'OUT');
 assert.deepEqual(result.rungs[0].coil,{type:'OUT',ref:'Q1'});
});
test('PLC without physical outputs keeps existing M7',()=>{
 const io={inputCount:4,outputCount:0};
 const result=applyAndCheck(program(row('R1','OUT','M7')),'SET',0,io);
 assert.deepEqual(result.rungs[0].coil,{type:'SET',ref:'M7'});
});
test('new NOP without physical outputs gets M1',()=>{
 const io={inputCount:4,outputCount:0};
 const result=applyAndCheck(program(row('R1','NOP','')),'SET',0,io);
 assert.deepEqual(result.rungs[0].coil,{type:'SET',ref:'M1'});
});
test('invalid target cannot change existing M writer',()=>{
 const original=program(row('R1','OUT','M7')),before=JSON.stringify(original);
 assert.equal(Toolbox.apply(original,'SET',{kind:'coil',r:null},limits).ok,false);
 assert.equal(JSON.stringify(original),before);
});
test('existing Q output owner cannot be stolen',()=>{
 const result=applyAndCheck(program(row('R1','OUT','Q1'),row('R2','RESET','Q1')),'SET',1);
 assert.deepEqual(result.rungs[1].coil,{type:'SET',ref:'Q2'});
});
