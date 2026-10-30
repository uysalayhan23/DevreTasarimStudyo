'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const program=type=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'T1',presetMs:100}}]});
for(const initial of ['TON','TOF'])test(initial+' to TP held input needs genuine rising edge',()=>{
 const p=program(initial),m={};Ladder.scan(p,{I1:true},m,0);Ladder.scan(p,{I1:true},m,150);p.rungs[0].coil.type='TP';
 assert.equal(Ladder.scan(p,{I1:true},m,160).traces[0].value,false);
 assert.equal(Ladder.scan(p,{I1:false},m,170).traces[0].value,false);
 assert.equal(Ladder.scan(p,{I1:true},m,180).traces[0].value,true);
});
test('TP normal pulse and re-trigger',()=>{const p=program('TP'),m={};assert.equal(Ladder.scan(p,{I1:true},m,0).traces[0].value,true);assert.equal(Ladder.scan(p,{I1:true},m,101).traces[0].value,false);assert.equal(Ladder.scan(p,{I1:true},m,110).traces[0].value,false);Ladder.scan(p,{I1:false},m,120);assert.equal(Ladder.scan(p,{I1:true},m,130).traces[0].value,true)});
test('TON threshold and changed preset',()=>{const p=program('TON'),m={};Ladder.scan(p,{I1:true},m,0);assert.equal(Ladder.scan(p,{I1:true},m,100).traces[0].value,true);p.rungs[0].coil.presetMs=200;assert.equal(Ladder.scan(p,{I1:true},m,110).traces[0].value,false)});
