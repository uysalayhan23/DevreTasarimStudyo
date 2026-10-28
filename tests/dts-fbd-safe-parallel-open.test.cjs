'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const c=(ref='I2',type='NO')=>({type,ref});
const prog=(coil={type:'OUT',ref:'Q1'})=>({version:1,rungs:[{id:'R1',paths:[[c()]],coil}]});
test('new parallel OR path cannot energize Q1 when unrelated I1 is true',()=>{
 const p=prog();assert.equal(L.scan(p,{I1:true,I2:false},{},0,limits).outputs.Q1,false);
 const result=F.editStructure(p,'add-path','0:0',limits);
 assert.equal(result.ok,true);assert.deepEqual(result.program.rungs[0].paths,[[c()],[]]);
 assert.equal(L.validate(result.program,limits).ok,true);
 assert.equal(L.scan(result.program,{I1:true,I2:false},{},1,limits).outputs.Q1,false);
});
test('existing active output remains active until user modifies the new empty branch',()=>{
 const p=prog(),x=F.editStructure(p,'add-path','0:0',limits);
 assert.equal(L.scan(p,{I2:true},{},0,limits).outputs.Q1,true);
 assert.equal(L.scan(x.program,{I2:true},{},1,limits).outputs.Q1,true);
 assert.equal(p.rungs[0].paths.length,1);
});
test('user can explicitly add first contact to empty parallel branch',()=>{
 const p=prog(),a=F.editStructure(p,'add-path','0:0',limits);
 const b=F.editStructure(a.program,'add-contact','0:1:0',limits);
 assert.equal(b.ok,true);assert.deepEqual(b.program.rungs[0].paths[1],[c('I1')]);
 assert.equal(L.scan(b.program,{I1:false,I2:false},{},0,limits).outputs.Q1,false);
 assert.equal(L.scan(b.program,{I1:true,I2:false},{},1,limits).outputs.Q1,true);
});
test('new empty OR path cannot accidentally SET a Q or M latch',()=>{
 for(const ref of ['Q1','M1']){
  const p=prog({type:'SET',ref}),x=F.editStructure(p,'add-path','0:0',limits);
  const m={};const r=L.scan(x.program,{I1:true,I2:false},m,0,limits);
  assert.equal(r.ok,true);assert.equal(!!m.values[ref],false);
 }
});
test('no physical PLC inputs: new path is empty, first explicitly added contact uses M1',()=>{
 const limits0={inputCount:0,outputCount:0};
 const p={version:1,rungs:[{id:'R1',paths:[[c('M2')]],coil:{type:'OUT',ref:'M3'}}]};
 const a=F.editStructure(p,'add-path','0:0',limits0);
 assert.equal(a.ok,true);assert.deepEqual(a.program.rungs[0].paths[1],[]);
 const b=F.editStructure(a.program,'add-contact','0:1:0',limits0);
 assert.equal(b.ok,true);assert.equal(b.program.rungs[0].paths[1][0].ref,'M1');
});
test('rendered FBD shows open branch, and offers + Seri insertion',()=>{
 const x=F.editStructure(prog(),'add-path','0:0',limits);
 const html=F.render(x.program.rungs[0],{index:0,limits});
 assert.match(html,/BOŞ KONTAK · devre açık/);
 assert.match(html,/data-fbd-structure="add-contact" data-fbd-position="0:1:0"/);
});
test('8 parallel path maximum and last path protection still apply',()=>{
 const p=prog();p.rungs[0].paths=Array.from({length:8},()=>[c('I2')]);
 assert.equal(F.editStructure(p,'add-path','0:0',limits).ok,false);
 const single=prog();assert.equal(F.editStructure(single,'remove-path','0:0',limits).ok,false);
});
