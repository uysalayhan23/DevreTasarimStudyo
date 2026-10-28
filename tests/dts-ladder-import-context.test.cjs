'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),IO=require('../dist/ladder-program-io.js');
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const good={inputCount:6,outputCount:4};
test('an import is only applicable to the exact same open PLC and project instance',()=>{
 const project={components:[]},plc={id:'original'};
 assert.equal(E.importContextMatches(plc,plc,project,project,true),true);
 assert.equal(E.importContextMatches(plc,{id:'other'},project,project,true),false);
 assert.equal(E.importContextMatches(plc,plc,project,{components:[]},true),false);
 assert.equal(E.importContextMatches(plc,plc,project,project,false),false);
 assert.equal(E.importContextMatches(null,plc,project,project,true),false);
});
test('file data remains an independent validated draft until PLC save',()=>{
 const saved=structuredClone(program),raw=IO.serialize(saved,good,'Example');
 const imported=IO.parse(raw,good);
 imported.rungs[0].coil.ref='Q2';
 assert.equal(saved.rungs[0].coil.ref,'Q1');
 assert.equal(IO.parse(raw,good).rungs[0].coil.ref,'Q1');
});
test('invalid native pin bounds never get imported',()=>{
 const data=IO.serialize(program,good);
 assert.throws(()=>IO.parse(data,{inputCount:0,outputCount:0}),/Ladder/);
});
