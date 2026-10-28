'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const T=require('../dist/ladder-toolbox.js');
const E=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4};
const zero={inputCount:0,outputCount:1};
const empty=()=>({version:1,rungs:[{id:'R1',paths:[[]],coil:{type:'OUT',ref:'Q1'}}]});
test('palette rejects invalid program before accessing nested paths',()=>{
 for(const program of [{version:1,rungs:[null]},{version:1,rungs:[{id:'R1',paths:null,coil:{type:'NOP',ref:''}}]}]){
  const result=T.apply(program,'NO',{r:0,p:0,kind:'contact'},limits);
  assert.equal(result.ok,false);
 }
});
test('palette refuses coerced Network, path and insertion indices',()=>{
 for(const target of [
  {r:null,kind:'network'},{r:'0x0',kind:'network'},{r:false,kind:'network'},
  {r:0,p:true,kind:'contact'},{r:0,p:'0 ',kind:'contact'},
  {r:0,p:0,i:'1e0',kind:'contact'}
 ])assert.equal(T.apply(empty(),'NO',target,limits).ok,false,JSON.stringify(target));
});
test('canonical numeric and decimal-string positions still insert a contact',()=>{
 const p=empty(),before=JSON.stringify(p);
 const result=T.apply(p,'NC',{r:'0',p:'0',i:'0',kind:'contact'},limits);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[0].paths[0][0].type,'NC');
 assert.equal(JSON.stringify(p),before);
});
test('LAD + Seri uses M1 when no physical inputs and obeys native scan',()=>{
 const p=empty(),result=E.addSafeContact(p,0,0,zero);
 assert.equal(result.ok,true);assert.equal(result.program.rungs[0].paths[0][0].ref,'M1');
 assert.equal(L.scan(result.program,{}, {values:{M1:true}},0,zero).outputs.Q1,true);
 assert.equal(L.scan(result.program,{}, {values:{M1:false}},0,zero).outputs.Q1,false);
 assert.deepEqual(p,empty());
});
test('invalid LAD address edits fail without changing draft',()=>{
 const p=E.addSafeContact(empty(),0,0,zero).program,before=JSON.stringify(p);
 assert.equal(E.editLadderField(p,'contact-ref',0,0,0,'I1',zero).ok,false);
 assert.equal(E.editLadderField(p,'coil-ref',0,0,0,'Q2',zero).ok,false);
 assert.equal(E.editLadderField(p,'contact-type',0,9,0,'NC',zero).ok,false);
 assert.equal(JSON.stringify(p),before);
});
test('LAD time and counter presets reject empty, decimal and out-of-range values',()=>{
 const ton=T.apply(empty(),'TON',{r:0,kind:'coil'},limits).program;
 for(const bad of ['', '0', '1.5', '600001', '1e2'])
  assert.equal(E.editLadderField(ton,'presetMs',0,0,0,bad,limits).ok,false,bad);
 const valid=E.editLadderField(ton,'presetMs',0,0,0,'2000',limits);
 assert.equal(valid.ok,true);assert.equal(valid.program.rungs[0].coil.presetMs,2000);
 assert.equal(ton.rungs[0].coil.presetMs,1000);
});
test('valid LAD contact and coil type edits remain draft-only',()=>{
 const p=E.addSafeContact(empty(),0,0,zero).program,before=JSON.stringify(p);
 const changed=E.editLadderField(p,'contact-type',0,0,0,'NC',zero);
 assert.equal(changed.ok,true);
 assert.equal(L.scan(changed.program,{}, {values:{M1:false}},0,zero).outputs.Q1,true);
 const block=E.editLadderField(changed.program,'coil-type',0,0,0,'TON',zero);
 assert.equal(block.ok,true);assert.equal(block.program.rungs[0].coil.ref,'T1');
 assert.equal(L.validate(block.program,zero).ok,true);
 assert.equal(JSON.stringify(p),before);
});
