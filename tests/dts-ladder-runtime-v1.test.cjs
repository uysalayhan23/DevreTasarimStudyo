'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const L=require('../dist/ladder-runtime.js'),P=require('../dist/plc-runtime.js');
const lim={inputCount:3,outputCount:2};
test('NO/NC contacts and OR parallel paths',()=>{
 const p={version:1,rungs:[{id:'r1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'I3'}]],coil:{type:'OUT',ref:'Q1'}}]};
 assert.equal(L.validate(p,lim).ok,true);
 assert.equal(L.scan(p,{I1:true,I2:false},{},0,lim).outputs.Q1,true);
 assert.equal(L.scan(p,{I1:true,I2:true},{},0,lim).outputs.Q1,false);
 assert.equal(L.scan(p,{I3:true},{},0,lim).outputs.Q1,true);
});
test('TON uses virtual simulation timestamps; release resets',()=>{
 const p={version:1,rungs:[{id:'t',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TON',ref:'T1',presetMs:300}},{id:'q',paths:[[{type:'NO',ref:'T1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const m={};assert.equal(L.scan(p,{I1:true},m,100,lim).outputs.Q1,false);
 assert.equal(L.scan(p,{I1:true},m,400,lim).outputs.Q1,true);
 assert.equal(L.scan(p,{I1:false},m,401,lim).outputs.Q1,false);
});
test('SET/RESET retains state but clear removes the memory',()=>{
 const p={version:1,rungs:[{id:'s',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}},{id:'r',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'Q1'}}]};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p};
 const di=(a,b)=>[{id:'a',value:a},{id:'b',value:b}],q=[{id:'Q-physical'}];
 assert.equal(P.program(c,di(true,false),q,0).outputs['Q-physical'],true);
 assert.equal(P.program(c,di(false,false),q,1).outputs['Q-physical'],true);
 assert.equal(P.program(c,di(false,true),q,2).outputs['Q-physical'],false);
 P.clear(c);assert.equal(c._dtsLadderMemory,undefined);
});
test('unmapped hardware inputs and malformed programs are blocked',()=>{
 const p={version:1,rungs:[{id:'r',paths:[[{type:'NO',ref:'I10'}]],coil:{type:'OUT',ref:'Q1'}}]};
 assert.equal(L.validate(p,lim).ok,false);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p};
 assert.equal(P.program(c,[{id:'a',value:true}],[{id:'q'}],0).outputs.q,false);
 assert.ok(c._dtsLadderError);
});
