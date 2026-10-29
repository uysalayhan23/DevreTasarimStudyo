'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const rung=()=>({id:'R1',paths:[[{type:'NO',ref:'I1'}],[{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}});
test('P2-03 malformed FBD path fails closed without throwing or controls',()=>{
 const html=F.render({...rung(),paths:[null]},{limits,live:true,pathStates:[true],coilValue:true});
 assert.match(html,/geçersiz taslak/);assert.doesNotMatch(html,/dts-fbd-on|data-fbd-coil-field/);
});
test('P2-03 invalid output address cannot be presented as live FBD',()=>{
 const html=F.render({...rung(),coil:{type:'OUT',ref:'Q9'}},{limits,live:true,pathStates:[true,true],coilValue:true});
 assert.match(html,/geçersiz taslak/);assert.doesNotMatch(html,/dts-fbd-on/);
});
test('P2-03 nonboolean path trace cannot energize FBD',()=>{
 const html=F.render(rung(),{limits,live:true,pathStates:[true,'true'],coilValue:true});
 assert.doesNotMatch(html,/dts-fbd-on/);
});
test('P2-03 partial path trace cannot energize FBD',()=>{
 const html=F.render(rung(),{limits,live:true,pathStates:[true],coilValue:true});
 assert.doesNotMatch(html,/dts-fbd-on/);
});
test('P2-03 nonboolean coil trace cannot energize FBD',()=>{
 const html=F.render(rung(),{limits,live:true,pathStates:[true,false],coilValue:'true'});
 assert.doesNotMatch(html,/dts-fbd-on/);
});
test('P2-03 actual native LAD true scan agrees with FBD live display',()=>{
 const r=rung(),trace=L.scan({version:1,rungs:[r]},{I1:true,I2:true},{},10,limits).traces[0];
 assert.equal(trace.value,true);
 assert.match(F.render(r,{limits,live:true,pathStates:trace.pathStates,coilValue:trace.value}),/dts-fbd-on/);
});
test('P2-03 actual native LAD false scan agrees with FBD live display',()=>{
 const r=rung(),trace=L.scan({version:1,rungs:[r]},{I1:false,I2:true},{},10,limits).traces[0];
 assert.equal(trace.value,false);
 assert.doesNotMatch(F.render(r,{limits,live:true,pathStates:trace.pathStates,coilValue:trace.value}),/dts-fbd-on/);
});
test('P2-03 valid FBD remains editable without modifying source',()=>{
 const r=rung(),before=JSON.stringify(r);
 assert.match(F.render(r,{limits}),/data-fbd-contact-ref="0:0:0"/);
 assert.equal(JSON.stringify(r),before);
});
