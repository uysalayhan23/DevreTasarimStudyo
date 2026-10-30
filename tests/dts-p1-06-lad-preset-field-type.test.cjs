'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const LAD=require('../dist/ladder-editor.js');
const FBD=require('../dist/fbd-view.js');
const limits={inputCount:2,outputCount:2};
const program=(type,ref,extra={})=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref,...extra}}
]});
const cases=[
 ['OUT Q1', 'OUT','Q1',{},'presetMs','500'],
 ['SET M1', 'SET','M1',{},'preset','3'],
 ['RESET Q1', 'RESET','Q1',{},'presetMs','200'],
 ['NOP', 'NOP','',{},'preset','3'],
 ['TON T1', 'TON','T1',{presetMs:1000},'preset','3'],
 ['TOF T1', 'TOF','T1',{presetMs:1000},'preset','3'],
 ['TP T1', 'TP','T1',{presetMs:1000},'preset','3'],
 ['CTU C1', 'CTU','C1',{preset:2},'presetMs','500'],
 ['CTD C1', 'CTD','C1',{preset:2},'presetMs','500']
];
for(const [name,type,ref,extra,field,value] of cases){
 test('LAD rejects mismatched '+field+' on '+name+' without mutation',()=>{
  const before=program(type,ref,extra),snapshot=JSON.stringify(before);
  const result=LAD.editLadderField(before,field,0,0,0,value,limits);
  assert.equal(result.ok,false);
  assert.equal(JSON.stringify(before),snapshot);
  assert.equal(Ladder.validate(before,limits).ok,true);
  assert.equal(FBD.editCoil(before,0,{[field]:Number(value)},limits).ok,false);
 });
}
for(const [type,ref,extra,field,value] of [
 ['TON','T1',{presetMs:1000},'presetMs','500'],
 ['TOF','T1',{presetMs:1000},'presetMs','500'],
 ['TP','T1',{presetMs:1000},'presetMs','500'],
 ['CTU','C1',{preset:2},'preset','3'],
 ['CTD','C1',{preset:2},'preset','3']
]){
 test('LAD accepts valid '+type+' '+field+' with native validation',()=>{
  const original=program(type,ref,extra),before=JSON.stringify(original);
  const result=LAD.editLadderField(original,field,0,0,0,value,limits);
  assert.equal(result.ok,true,result.error);
  assert.equal(result.program.rungs[0].coil[field],Number(value));
  assert.equal(Ladder.validate(result.program,limits).ok,true);
  assert.equal(JSON.stringify(original),before);
 });
}
test('valid TON edit follows real native scan timing',()=>{
 const edited=LAD.editLadderField(program('TON','T1',{presetMs:100}),'presetMs',0,0,0,'50',limits);
 assert.equal(edited.ok,true);
 const memory={};
 assert.equal(Ladder.scan(edited.program,{I1:true},memory,0,limits).memory.values.T1,false);
 assert.equal(Ladder.scan(edited.program,{I1:true},memory,49,limits).memory.values.T1,false);
 assert.equal(Ladder.scan(edited.program,{I1:true},memory,50,limits).memory.values.T1,true);
});
test('valid CTD edit follows real native edge-counting',()=>{
 const edited=LAD.editLadderField(program('CTD','C1',{preset:2}),'preset',0,0,0,'3',limits);
 assert.equal(edited.ok,true);
 const memory={};
 assert.equal(Ladder.scan(edited.program,{I1:false},memory,0,limits).traces[0].count,3);
 assert.equal(Ladder.scan(edited.program,{I1:true},memory,1,limits).traces[0].count,2);
 assert.equal(Ladder.scan(edited.program,{I1:true},memory,2,limits).traces[0].count,2);
});
test('invalid numeric value remains rejected for correct block kind',()=>{
 const p=program('TON','T1',{presetMs:100}),before=JSON.stringify(p);
 assert.equal(LAD.editLadderField(p,'presetMs',0,0,0,'0',limits).ok,false);
 assert.equal(JSON.stringify(p),before);
});
test('invalid Network index cannot mutate valid timer',()=>{
 const p=program('TON','T1',{presetMs:100}),before=JSON.stringify(p);
 assert.equal(LAD.editLadderField(p,'presetMs',-1,0,0,'500',limits).ok,false);
 assert.equal(JSON.stringify(p),before);
});
