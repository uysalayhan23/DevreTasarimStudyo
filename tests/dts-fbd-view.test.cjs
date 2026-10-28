'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const rung={id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'I3'}]],coil:{type:'OUT',ref:'Q1'}};
test('same Ladder V1 network is represented by AND OR NOT blocks',()=>{
 const x=F.render(rung,{index:2});
 assert.match(x,/FBD Network 3/);assert.match(x,/NOT I2/);assert.match(x,/>AND</);assert.match(x,/>OR</);
 assert.match(x,/data-ladder-contact="2:0:0"/);assert.match(x,/data-ladder-coil="2"/);
});
test('green is never inferred from unrelated program states',()=>{
 const p={version:1,rungs:[rung]};
 for(const bits of [{I1:true,I2:false},{I1:false,I3:true},{I1:true,I2:true}]){
  const trace=L.scan(p,bits,{},1,{inputCount:6,outputCount:4}).traces[0];
  const s=F.render(rung,{live:true,pathStates:trace.pathStates,coilValue:trace.value});
  assert.equal(s.includes('dts-fbd-on'),trace.active);
 }
 assert.doesNotMatch(F.render(rung,{live:false,pathStates:[true,true],coilValue:true}),/dts-fbd-on/);
});
