'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const Guide=require('../dist/ladder-timer-guide.js');
const limits={inputCount:6,outputCount:4};
const program=(type,pt=100)=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'T1',presetMs:pt}}]});
function steps(kind,items,pt=100){
 const p=program(kind,pt),mem={},records=[];
 for(const [now,IN,expected] of items){
  const o=L.scan(p,{I1:IN},mem,now,limits);
  assert.equal(o.ok,true,'valid native scan at '+now+' ms');
  const bit=o.memory.values.T1;
  assert.equal(bit,expected,kind+' at '+now+' ms, IN='+IN);
  records.push({now,IN,bit,elapsed:o.traces[0].elapsedMs});
 }
 return records;
}
test('TON requires a continuous input until exact PT threshold',()=>{
 const t=steps('TON',[[0,false,false],[10,true,false],[109,true,false],[110,true,true],[115,false,false]]);
 assert.equal(t[2].elapsed,99);assert.equal(t[3].elapsed,100);
 assert.equal(t[4].elapsed,null);
});
test('TON cancels partial time and restarts after an interruption',()=>{
 const t=steps('TON',[[0,false,false],[10,true,false],[70,false,false],[80,true,false],[179,true,false],[180,true,true]]);
 assert.equal(t[3].elapsed,0);
});
test('TOF activates immediately and switches off exactly at PT after falling input',()=>{
 const t=steps('TOF',[[0,false,false],[10,true,true],[20,false,true],[119,false,true],[120,false,false]]);
 assert.equal(t[2].elapsed,0);assert.equal(t[3].elapsed,99);assert.equal(t[4].elapsed,100);
});
test('TOF cancels pending off delay and restarts after another falling edge',()=>{
 steps('TOF',[[0,false,false],[10,true,true],[20,false,true],[40,true,true],[50,false,true],[149,false,true],[150,false,false]]);
});
test('TP emits one fixed pulse even if input falls early',()=>{
 const t=steps('TP',[[0,false,false],[10,true,true],[20,false,true],[40,true,true],[109,true,true],[110,true,false]]);
 assert.equal(t[2].elapsed,10);assert.equal(t[4].elapsed,99);
});
test('TP never retriggers while held high, and a fresh falling/rising edge starts it again',()=>{
 steps('TP',[[0,false,false],[10,true,true],[110,true,false],[115,true,false],[120,false,false],[130,true,true],[229,true,true],[230,true,false]]);
});
test('TP clock rewind never creates a new pulse while the button remains pressed',()=>{
 steps('TP',[[0,false,false],[100,true,true],[120,true,true],[20,true,false],[25,true,false],[30,false,false],[40,true,true],[140,true,false]]);
});
test('TON virtual clock rewind invalidates old elapsed time',()=>{
 steps('TON',[[0,false,false],[100,true,false],[120,true,false],[10,true,false],[109,true,false],[110,true,true]]);
});
test('TOF virtual clock rewind cannot preserve an obsolete energized output',()=>{
 steps('TOF',[[0,false,false],[100,true,true],[120,false,true],[20,false,false],[40,false,false]]);
});
test('TP pulse ends exactly at PT and ignores new edges during a pulse',()=>{
 steps('TP',[[0,false,false],[1,true,true],[30,false,true],[50,true,true],[100,true,true],[101,true,false],[150,true,false],[160,false,false],[170,true,true]]);
});
test('changing TP preset cancels the old running pulse until a fresh input edge',()=>{
 const p=program('TP',100),mem={};
 for(const [now,IN,expected] of [[0,false,false],[10,true,true],[20,true,true]]){
  const o=L.scan(p,{I1:IN},mem,now,limits);assert.equal(o.memory.values.T1,expected);
 }
 p.rungs[0].coil.presetMs=200;
 for(const [now,IN,expected] of [[30,true,false],[50,true,false],[60,false,false],[70,true,true],[269,true,true],[270,true,false]]){
  const o=L.scan(p,{I1:IN},mem,now,limits);assert.equal(o.memory.values.T1,expected,'PT changed at '+now);
 }
});
test('invalid timer preset values and duplicate timer-address owners fail validation',()=>{
 for(const type of ['TON','TOF','TP'])for(const pt of [0,-1,600001,1.5,NaN]){
  assert.equal(L.validate(program(type,pt),limits).ok,false,type+' invalid PT '+pt);
 }
 const p=program('TON');p.rungs.push({id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'TP',ref:'T1',presetMs:100}});
 assert.equal(L.validate(p,limits).ok,false);
});
test('removed timer no longer keeps an old T contact or physical Q active',()=>{
 const p=program('TON',10);
 p.rungs.push({id:'R2',paths:[[{type:'NO',ref:'T1'}]],coil:{type:'OUT',ref:'Q1'}});
 const mem={};let o=L.scan(p,{I1:true},mem,0,limits);assert.equal(o.outputs.Q1,false);
 o=L.scan(p,{I1:true},mem,10,limits);assert.equal(o.outputs.Q1,true);
 p.rungs[0].coil={type:'NOP',ref:''};
 o=L.scan(p,{I1:true},mem,11,limits);assert.equal(o.ok,true);assert.equal(o.outputs.Q1,false);
 assert.equal(o.memory.values.T1,false);
});
test('invalid simulation clock refuses a successful scan',()=>{
 for(const type of ['TON','TOF','TP']){
  const o=L.scan(program(type),{I1:true},{},NaN,limits);
  assert.equal(o.ok,false);assert.deepEqual(o.outputs,{});
 }
});
test('three Turkish explanations describe all key timing conditions',()=>{
 for(const type of ['TON','TOF','TP']){
  const html=Guide.markup({type,ref:'T1',presetMs:2000});
  assert.match(html,new RegExp('data-timer-guide="'+type+'"'));
  assert.match(html,/2000 ms/);assert.match(html,/Önemli koşul/);assert.match(html,/Zaman akışı/);
  assert.match(html,/fiziksel PLC onayı değildir/);
 }
 assert.equal(Guide.markup({type:'OUT',ref:'Q1'}),'');
 assert.equal(Guide.describe('TON',0).ms,null);
});
