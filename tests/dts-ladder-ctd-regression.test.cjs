'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const lim={inputCount:2,outputCount:2};
const ctd={version:1,rungs:[
 {id:'down',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'CTD',ref:'C1',preset:2}},
 {id:'lamp',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q1'}}
]};
test('CTD starts at preset, counts two rising edges, then enables output',()=>{
 const m={};
 const at=(now,input)=>L.scan(ctd,{I1:input},m,now,lim);
 let s=at(0,false);assert.equal(s.outputs.Q1,false);assert.equal(s.traces[0].count,2);
 s=at(1,true);assert.equal(s.outputs.Q1,false);assert.equal(s.traces[0].count,1);
 s=at(1,true);assert.equal(s.traces[0].count,1,'same solver timestamp must not double count');
 at(2,false);s=at(3,true);assert.equal(s.outputs.Q1,true);assert.equal(s.traces[0].count,0);
});
test('CTD reset reloads preset on next scan',()=>{
 const p=structuredClone(ctd);p.rungs.unshift({id:'reset',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'C1'}});
 const m={};L.scan(p,{I1:true},m,0,lim);L.scan(p,{I1:false},m,1,lim);
 const s=L.scan(p,{I1:false,I2:true},m,2,lim);
 assert.equal(s.outputs.Q1,false);assert.equal(s.traces[1].count,2);
});
test('General output coils cannot overwrite timer or counter state',()=>{
 for(const type of ['OUT','SET'])for(const ref of ['T1','C1']){
  const p={version:1,rungs:[{id:'bad',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref}}]};
  assert.equal(L.validate(p,lim).ok,false,`${type} ${ref} should fail closed`);
  assert.equal(L.scan(p,{I1:true},{},0,lim).ok,false);
 }
});

test('RESET on counter remains a valid explicit reset instruction',()=>{
 const p={version:1,rungs:[{id:'reset',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'RESET',ref:'C1'}}]};
 assert.equal(L.validate(p,lim).ok,true);
});
