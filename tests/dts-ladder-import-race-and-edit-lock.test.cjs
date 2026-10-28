'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),IO=require('../dist/ladder-program-io.js');
const lim={inputCount:6,outputCount:4};
const p={version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]};
test('old import completion is rejected after a newer file selection',()=>{
 const project={},plc={id:'plc'};
 assert.equal(E.importContextMatches(plc,plc,project,project,true,1,2),false);
 assert.equal(E.importContextMatches(plc,plc,project,project,true,2,2),true);
});
test('closing or switching PLC invalidates pending import',()=>{
 const project={},plc={id:'plc'};
 assert.equal(E.importContextMatches(plc,plc,project,project,false,3,3),false);
 assert.equal(E.importContextMatches(plc,{id:'new'},project,project,true,3,3),false);
 assert.equal(E.importContextMatches(plc,plc,project,{},true,3,3),false);
});
test('legacy 5-argument import context contract remains valid',()=>{
 const project={},plc={id:'plc'};
 assert.equal(E.importContextMatches(plc,plc,project,project,true),true);
 assert.equal(E.importContextMatches(plc,plc,project,project,false),false);
});
test('non-numeric and mismatched import tokens cannot apply',()=>{
 const project={},plc={id:'plc'};
 assert.equal(E.importContextMatches(plc,plc,project,project,true,'1','1'),false);
 assert.equal(E.importContextMatches(plc,plc,project,project,true,-1,0),false);
});
test('empty path NOP file is valid and independent of saved program',()=>{
 const raw=IO.serialize(p,lim,'Açık Network'),draft=IO.parse(raw,lim);
 assert.deepEqual(draft,p);
 draft.rungs[0].paths[0].push({type:'NO',ref:'I1'});
 assert.equal(p.rungs[0].paths[0].length,0);
});
test('invalid and foreign file formats are rejected',()=>{
 assert.throws(()=>IO.parse('{}',lim));
 assert.throws(()=>IO.parse('not JSON',lim));
 assert.throws(()=>IO.parse('a'.repeat(IO.maxBytes+1),lim));
});
test('Undo Redo history survives imported draft changes',()=>{
 const h=E.createDraftHistory(p);
 const changed=IO.parse(IO.serialize(p,lim),lim);
 changed.rungs[0].coil={type:'OUT',ref:'Q1'};
 h.push(changed);
 assert.equal(h.undo().rungs[0].coil.type,'NOP');
 assert.equal(h.redo().rungs[0].coil.type,'OUT');
});
