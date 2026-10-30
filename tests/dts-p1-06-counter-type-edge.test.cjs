'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const program=(type='CTU',preset=3)=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'C1',preset}}]});
const run=(p,m,I1,now,I2=false)=>Ladder.scan(p,{I1,I2},m,now,limits);
test('CTU to CTD: held input does not invent a falling count',()=>{
 const p=program('CTU'),m={};run(p,m,true,0);assert.equal(m.blocks.C1.count,1);
 p.rungs[0].coil.type='CTD';const r=run(p,m,true,1);
 assert.equal(r.ok,true);assert.equal(m.blocks.C1.count,3);assert.equal(r.traces[0].count,3);
});
test('CTD to CTU: held input does not invent a rising count',()=>{
 const p=program('CTD'),m={};run(p,m,true,0);assert.equal(m.blocks.C1.count,2);
 p.rungs[0].coil.type='CTU';run(p,m,true,1);assert.equal(m.blocks.C1.count,0);
});
test('CTD stays at preset during a held input after type switch',()=>{
 const p=program('CTU'),m={};run(p,m,true,0);p.rungs[0].coil.type='CTD';
 run(p,m,true,1);run(p,m,true,2);assert.equal(m.blocks.C1.count,3);
});
test('CTD decrements exactly once after a real release and rising edge',()=>{
 const p=program('CTU'),m={};run(p,m,true,0);p.rungs[0].coil.type='CTD';
 run(p,m,true,1);run(p,m,false,2);run(p,m,true,3);run(p,m,true,4);
 assert.equal(m.blocks.C1.count,2);
});
test('CTU increments exactly once after a real release and rising edge',()=>{
 const p=program('CTD'),m={};run(p,m,true,0);p.rungs[0].coil.type='CTU';
 run(p,m,true,1);run(p,m,false,2);run(p,m,true,3);run(p,m,true,4);
 assert.equal(m.blocks.C1.count,1);
});
test('type switch with low input resets counter without a phantom edge',()=>{
 const p=program('CTU'),m={};run(p,m,true,0);run(p,m,false,1);
 p.rungs[0].coil.type='CTD';run(p,m,false,2);assert.equal(m.blocks.C1.count,3);
 run(p,m,true,3);assert.equal(m.blocks.C1.count,2);
});
test('fresh CTU/CTD still accept a real initial high edge',()=>{
 for(const [type,count] of [['CTU',1],['CTD',2]]){
  const p=program(type),m={};const r=run(p,m,true,0);
  assert.equal(r.ok,true);assert.equal(m.blocks.C1.count,count);
 }
});
test('changing preset while held does not generate a count',()=>{
 const p=program('CTU'),m={};run(p,m,true,0);p.rungs[0].coil.preset=5;
 run(p,m,true,1);assert.equal(m.blocks.C1.count,0);
 run(p,m,false,2);run(p,m,true,3);assert.equal(m.blocks.C1.count,1);
});
test('counter RESET still has priority over a simultaneous count pulse',()=>{
 const p=program('CTU'),m={};
 p.rungs.push({id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'C1'}});
 const r=run(p,m,true,0,true);assert.equal(r.ok,true);assert.equal(m.blocks.C1.count,0);
});
test('duplicate counter owner is rejected without changing memory',()=>{
 const p=program('CTU'),m={};
 p.rungs.push({id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'CTD',ref:'C1',preset:3}});
 const r=run(p,m,true,0);assert.equal(r.ok,false);assert.equal(Object.keys(m).length,0);
});
