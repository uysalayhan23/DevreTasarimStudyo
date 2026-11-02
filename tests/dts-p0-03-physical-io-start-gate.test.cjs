'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js'),Editor=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4},enabled={disabled:false};
const program=(input,output)=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:input}]],coil:{type:'OUT',ref:output}}]});
const saved=p=>({plcProgram:'dts-ladder-v1',ladderProgram:p});
const gate=(p,hardware=limits)=>Editor.canStartLadder(saved(p),structuredClone(p),false,enabled,hardware);
test('P0-03: saved Q5 cannot start on actual four-output CPU',()=>{
 const p=program('I1','Q5');assert.equal(Ladder.validate(p).ok,true);
 assert.equal(Ladder.validate(p,limits).ok,false);
 assert.equal(gate(p),false);
});
test('P0-03: saved I7 cannot start on actual six-input CPU',()=>{
 const p=program('I7','Q1');assert.equal(Ladder.validate(p).ok,true);
 assert.equal(Ladder.validate(p,limits).ok,false);
 assert.equal(gate(p),false);
});
test('P0-03: hardware lower bound and upper bound guard',()=>{
 for(const [hardware,good,bad] of [
  [{inputCount:1,outputCount:1},program('I1','Q1'),program('I2','Q1')],
  [{inputCount:6,outputCount:4},program('I6','Q4'),program('I6','Q5')],
  [{inputCount:0,outputCount:0},null,program('I1','Q1')]]){
  if(good)assert.equal(gate(good,hardware),true);
  assert.equal(gate(bad,hardware),false);
 }
});
test('P0-03: valid physical CPU program and disconnected NOP still start',()=>{
 assert.equal(gate(program('I6','Q4')),true);
 const noop={version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]};
 assert.equal(gate(noop),true);
});
test('P0-03: mismatched draft and native simulator disabled still block',()=>{
 const p=program('I1','Q1');let draft=structuredClone(p);draft.rungs[0].coil.ref='Q2';
 assert.equal(Editor.canStartLadder(saved(p),draft,false,enabled,limits),false);
 assert.equal(Editor.canStartLadder(saved(p),p,false,{disabled:true},limits),false);
 assert.equal(Editor.canStartLadder({...saved(p),plcProgram:'mirror'},p,false,enabled,limits),false);
});
test('P0-03: stop remains possible when already running even if program is invalid',()=>{
 const invalid=program('I1','Q5');
 assert.equal(Editor.canStartLadder(saved(invalid),invalid,true,{disabled:true},limits),true);
});
test('P0-03: all three native UI start-control sites supply actual PLC limits',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../dist/ladder-editor.js'),'utf8');
 const calls=src.match(/canStartLadder\(active\.c,active\.draft,editor\.running,(?:doc\.getElementById\('simulateBtn'\)|nativeSim|sim),limits\(\)\)/g)||[];
 assert.equal(calls.length,3);
});
