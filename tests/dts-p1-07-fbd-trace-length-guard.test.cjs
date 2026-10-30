'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const FBD=require('../dist/fbd-view.js');
const rung=(paths=[[{type:'NO',ref:'I1'}]],coil={type:'OUT',ref:'Q1'})=>({id:'R1',paths,coil});
const draw=(r,trace,coilValue,live=true)=>FBD.render(r,{live,pathStates:trace,coilValue,limits:{inputCount:1,outputCount:1}});
const energized=html=>html.includes('dts-fbd-on');

test('extra false trace is rejected without crashing',()=>{
 const html=assert.doesNotThrow(()=>draw(rung(),[true,false],true));
 assert.equal(energized(draw(rung(),[true,false],true)),false);
});
test('extra true trace is rejected without crashing',()=>{
 assert.doesNotThrow(()=>draw(rung(),[true,true],true));
 assert.equal(energized(draw(rung(),[true,true],true)),false);
});
test('short trace cannot light a rung',()=>{
 assert.equal(energized(draw(rung(),[],true)),false);
});
test('matching active trace lights the rung and coil',()=>{
 assert.equal(energized(draw(rung(),[true],true)),true);
});
test('matching inactive trace stays off',()=>{
 assert.equal(energized(draw(rung(),[false],false)),false);
});
test('OUT trace inconsistent with its input is rejected',()=>{
 assert.equal(energized(draw(rung(),[true],false)),false);
});
test('nonboolean trace is rejected',()=>{
 assert.equal(energized(draw(rung(),['true'],true)),false);
});
test('empty contact path cannot be energized by stale trace',()=>{
 assert.equal(energized(draw(rung([[]]),[true],true)),false);
});
test('NOP cannot light its output from stale trace',()=>{
 assert.equal(energized(draw(rung(undefined,{type:'NOP',ref:''}),[true],true)),false);
});
