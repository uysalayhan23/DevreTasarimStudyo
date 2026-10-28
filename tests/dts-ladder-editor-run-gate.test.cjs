'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const {canStartLadder}=require('../dist/ladder-editor.js');
const c={plcProgram:'dts-ladder-v1',ladderProgram:{version:1,rungs:[{id:'R',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]}};
test('saved Ladder starts through enabled native simulation button',()=>{
 assert.equal(canStartLadder(c,structuredClone(c.ladderProgram),false,{disabled:false}),true);
});
test('draft changes, other program, disabled simulator and missing simulator block start',()=>{
 assert.equal(canStartLadder(c,{version:1,rungs:[]},false,{disabled:false}),false);
 assert.equal(canStartLadder({...c,plcProgram:'mirror'},c.ladderProgram,false,{disabled:false}),false);
 assert.equal(canStartLadder(c,c.ladderProgram,false,{disabled:true}),false);
 assert.equal(canStartLadder(c,c.ladderProgram,false,null),false);
});
test('running program exposes stop action',()=>assert.equal(canStartLadder(c,c.ladderProgram,true,{disabled:true}),true));
