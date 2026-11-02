'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const path=require('node:path');
const ladderPath=path.resolve(__dirname,'../dist/ladder-runtime.js');
const plcPath=path.resolve(__dirname,'../dist/plc-runtime.js');
const original=require(ladderPath);
const q=[{id:'X12:3'}];
const r=(kind,contact='I1')=>({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:contact}]],coil:{type:kind,ref:'Q1'}}]});
function withScan(fake,fn){
 const cache=require.cache[ladderPath];const saved=cache.exports;
 cache.exports={...original,scan:fake};delete require.cache[plcPath];
 try{return fn(require(plcPath));}finally{cache.exports=saved;delete require.cache[plcPath];}
}
function forged(program,inputs,newQ){
 const active=!!inputs[0].value;
 return {ok:true,outputs:{Q1:newQ},memory:{values:{I1:active,Q1:newQ},blocks:{},lastTime:100},traces:[{id:'R1',coil:'Q1',active,pathStates:[active],value:newQ}]};
}
for(const kind of ['SET','RESET']){
 test('negative: '+kind+' inactive cannot fabricate Q1=1 from Q1=0',()=>{
  const program=r(kind);const inputs=[{id:'X10:7',value:false}];
  withScan(()=>forged(program,inputs,true),plc=>{
   const c={plcProgram:'dts-ladder-v1',ladderProgram:program,_dtsLadderMemory:{values:{I1:false,Q1:false}}};
   const out=plc.program(c,inputs,q,100);
   assert.equal(out.outputs['X12:3'],false,'Q1 must fail closed');
   assert.equal(c._dtsLadderTraces.length,0);
   assert.equal(c._dtsLadderMemory,undefined);
  });
 });
}
test('negative: RESET active cannot claim Q1=1',()=>{
 const program=r('RESET'),inputs=[{id:'X10:7',value:true}];
 withScan(()=>forged(program,inputs,true),plc=>{
  const c={plcProgram:'dts-ladder-v1',ladderProgram:program,_dtsLadderMemory:{values:{I1:true,Q1:true}}};
  assert.equal(plc.program(c,inputs,q,100).outputs['X12:3'],false);
 });
});
test('positive: genuine SET latch and RESET stay functional',()=>{
 const plc=require(plcPath),c={plcProgram:'dts-ladder-v1',ladderProgram:r('SET')};
 const inp=x=>[{id:'X10:7',value:x}];
 assert.equal(plc.program(c,inp(false),q,1).outputs['X12:3'],false);
 assert.equal(plc.program(c,inp(true),q,2).outputs['X12:3'],true);
 assert.equal(plc.program(c,inp(false),q,3).outputs['X12:3'],true);
 c.ladderProgram=r('RESET');
 assert.equal(plc.program(c,inp(true),q,4).outputs['X12:3'],false);
 assert.equal(c._dtsLadderError,undefined);
});

test('positive: OUT tracks input; NC path and removed NOP never energize Q',()=>{
 const plc=require(plcPath),c={plcProgram:'dts-ladder-v1',ladderProgram:r('OUT')};
 const inp=x=>[{id:'X10:7',value:x}];
 assert.equal(plc.program(c,inp(false),q,1).outputs['X12:3'],false);
 assert.equal(plc.program(c,inp(true),q,2).outputs['X12:3'],true);
 assert.equal(plc.program(c,inp(false),q,3).outputs['X12:3'],false);
 c.ladderProgram={version:1,rungs:[{id:'R1',paths:[[{type:'NC',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 assert.equal(plc.program(c,inp(false),q,4).outputs['X12:3'],true);
 assert.equal(plc.program(c,inp(true),q,5).outputs['X12:3'],false);
 c.ladderProgram={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'NOP',ref:''}}]};
 assert.equal(plc.program(c,inp(true),q,6).outputs['X12:3'],false);
 assert.equal(c._dtsLadderError,undefined);
});
test('positive: two rung SET/RESET network order stays intact',()=>{
 const plc=require(plcPath),c={plcProgram:'dts-ladder-v1',ladderProgram:{version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}},
  {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'Q1'}}
 ]}};
 const inp=(a,b)=>[{id:'X10:7',value:a},{id:'X10:8',value:b}];
 assert.equal(plc.program(c,inp(true,false),q,1).outputs['X12:3'],true);
 assert.equal(plc.program(c,inp(false,false),q,2).outputs['X12:3'],true);
 assert.equal(plc.program(c,inp(false,true),q,3).outputs['X12:3'],false);
 assert.equal(plc.program(c,inp(true,true),q,4).outputs['X12:3'],false);
 assert.equal(c._dtsLadderError,undefined);
});
