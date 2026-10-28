'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),IO=require('../dist/ladder-program-io.js');
const p={version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'NOP',ref:''}}]},plc={id:'P1'},project={},limits={inputCount:6,outputCount:4};
test('import accepts unchanged target, token and current draft',()=>{
 const snap=JSON.stringify(p);
 assert.equal(E.importContextMatches(plc,plc,project,project,true,3,3,snap,p),true);
});
test('import refuses a draft changed while its File.text was pending',()=>{
 const snap=JSON.stringify(p),changed=JSON.parse(snap);
 changed.rungs[0].paths[0].push({type:'NO',ref:'I1'});
 assert.equal(E.importContextMatches(plc,plc,project,project,true,3,3,snap,changed),false);
});
test('import still rejects new file token, closed editor and changed project',()=>{
 const snap=JSON.stringify(p);
 assert.equal(E.importContextMatches(plc,plc,project,project,true,2,3,snap,p),false);
 assert.equal(E.importContextMatches(plc,plc,project,project,false,3,3,snap,p),false);
 assert.equal(E.importContextMatches(plc,plc,project,{},true,3,3,snap,p),false);
});
test('previous five and seven argument guards still work',()=>{
 assert.equal(E.importContextMatches(plc,plc,project,project,true),true);
 assert.equal(E.importContextMatches(plc,plc,project,project,true,3,3),true);
});
test('valid empty .dtsladder source imports and exports without energizing output',()=>{
 assert.deepEqual(IO.parse(IO.serialize(p,limits),limits),p);
});
