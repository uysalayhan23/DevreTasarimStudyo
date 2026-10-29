'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const rung=(type='OUT',paths=[[{type:'NO',ref:'I1'}]])=>({
 id:'R1',paths,coil:type==='NOP'?{type,ref:''}:
 type==='TON'||type==='TOF'?{type,ref:'T1',presetMs:1000}:{type,ref:'Q1'}
});
const render=(r,pathStates,coilValue)=>F.render(r,{limits,live:true,pathStates,coilValue});
const coilOn=html=>/dts-fbd-coil dts-fbd-on/.test(html);
const pathOn=html=>/dts-fbd-line dts-fbd-on/.test(html);
test('P2-03 contradictory OUT trace cannot light the FBD coil',()=>{
 assert.equal(coilOn(render(rung(),[false],true)),false);
});
test('P2-03 NOP cannot show live output from stale true coil trace',()=>{
 const html=render(rung('NOP'),[true],true);
 assert.equal(coilOn(html),false);assert.equal(pathOn(html),false);
});
test('P2-03 empty parallel path cannot show energized from stale trace',()=>{
 assert.equal(pathOn(render(rung('OUT',[[]]),[true],true)),false);
});
test('P2-03 real Ladder OUT on shows matching FBD live coil',()=>{
 const r=rung(),t=L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0];
 assert.equal(t.value,true);assert.equal(coilOn(render(r,t.pathStates,t.value)),true);
});
test('P2-03 real Ladder OUT off remains off in FBD',()=>{
 const r=rung(),t=L.scan({version:1,rungs:[r]},{I1:false},{},10,limits).traces[0];
 assert.equal(t.value,false);assert.equal(coilOn(render(r,t.pathStates,t.value)),false);
});
test('P2-03 real NOP allows an active input path but never an output',()=>{
 const r=rung('NOP'),t=L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0];
 const html=render(r,t.pathStates,t.value);
 assert.equal(pathOn(html),true);assert.equal(coilOn(html),false);
});
test('P2-03 SET latch can stay energized with input path off',()=>{
 const r=rung('SET'),p={version:1,rungs:[r]},mem={};
 L.scan(p,{I1:true},mem,10,limits);
 const t=L.scan(p,{I1:false},mem,20,limits).traces[0];
 assert.equal(t.pathStates[0],false);assert.equal(t.value,true);
 assert.equal(coilOn(render(r,t.pathStates,t.value)),true);
});
test('P2-03 TON path can be on before delayed output energizes',()=>{
 const r=rung('TON'),t=L.scan({version:1,rungs:[r]},{I1:true},{},10,limits).traces[0];
 const html=render(r,t.pathStates,t.value);
 assert.equal(pathOn(html),true);assert.equal(coilOn(html),false);
});
test('P2-03 TOF output may stay energized after input path drops',()=>{
 const r=rung('TOF'),p={version:1,rungs:[r]},mem={};
 L.scan(p,{I1:true},mem,10,limits);
 const t=L.scan(p,{I1:false},mem,20,limits).traces[0];
 assert.equal(t.pathStates[0],false);assert.equal(t.value,true);
 assert.equal(coilOn(render(r,t.pathStates,t.value)),true);
});
test('P2-03 malformed trace type never lights an output',()=>{
 assert.equal(coilOn(render(rung(),['true'],true)),false);
});
