'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const T=require('../dist/ladder-toolbox.js');
const FBD=require('../dist/fbd-view.js');
const fs=require('node:fs');
const path=require('node:path');
const lim={inputCount:6,outputCount:4};
const program=()=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q2'}}
]});
const parsed=E.parseUiIndex;
test('P1-03 accepts only canonical nonnegative dataset indices',()=>{
 for(const value of ['0','1','15','31','9007199254740991'])
  assert.equal(parsed(value),Number(value));
 for(const value of ['',' ',' 0','0 ','01','1e0','1.0','+1','-1','0x10','Infinity','9007199254740992',null,undefined,0,{},[]])
  assert.equal(Number.isNaN(parsed(value)),true,'unexpected acceptance of '+String(value));
});
test('P1-03 previously blank Network position cannot mutate first Network',()=>{
 const p=program(),baseline=JSON.stringify(p);
 const result=T.apply(p,'NO',{r:parsed(''),p:parsed('0'),kind:'contact'},lim);
 assert.equal(result.ok,false);
 assert.equal(JSON.stringify(p),baseline);
 assert.equal(E.editNetworkOrder(p,'copy',parsed(''),lim).ok,false);
 assert.equal(E.removeNetwork(p,parsed(''),lim).ok,false);
});
test('P1-03 blank parallel path cannot silently select path zero',()=>{
 const p=program(),snap=JSON.stringify(p);
 const result=T.apply(p,'NC',{r:parsed('1'),p:parsed(''),kind:'contact'},lim);
 assert.equal(result.ok,false);
 assert.equal(JSON.stringify(p),snap);
 assert.equal(E.removeParallelPath(p,parsed('1'),parsed(''),lim).ok,false);
});
test('P1-03 blank insert position cannot insert at series start',()=>{
 const p=program(),snap=JSON.stringify(p);
 const result=T.apply(p,'NO',{r:parsed('1'),p:parsed('0'),i:parsed(''),kind:'contact'},lim);
 assert.equal(result.ok,false);
 assert.equal(JSON.stringify(p),snap);
});
test('P1-03 normal drag to second Network still inserts the intended contact',()=>{
 const p=program();
 const result=T.apply(p,'NO',{r:parsed('1'),p:parsed('0'),kind:'contact'},lim);
 assert.equal(result.ok,true);
 assert.equal(result.program.rungs[0].paths[0].length,1);
 assert.equal(result.program.rungs[1].paths[0].length,2);
 assert.equal(L.validate(result.program,lim).ok,true);
 assert.equal(p.rungs[1].paths[0].length,1);
});
test('P1-03 normal selected insert position works; Undo and Redo are isolated',()=>{
 const p=program(),h=E.createDraftHistory(p);
 const result=T.apply(h.current(),'NC',{r:parsed('1'),p:parsed('0'),i:parsed('0'),kind:'contact'},lim);
 assert.equal(result.ok,true);h.push(result.program);
 assert.equal(h.current().rungs[1].paths[0][0].type,'NC');
 assert.deepEqual(h.undo(),p);
 assert.equal(h.redo().rungs[1].paths[0][0].type,'NC');
 assert.deepEqual(p,program());
});
test('P1-03 malformed inputs cannot change a LAD operand or FBD coil',()=>{
 const p=program(),snap=JSON.stringify(p);
 assert.equal(E.editLadderField(p,'contact-ref',parsed(''),parsed('0'),parsed('0'),'I3',lim).ok,false);
 assert.equal(E.editLadderField(p,'contact-ref',parsed('1'),parsed(''),parsed('0'),'I3',lim).ok,false);
 assert.equal(FBD.editCoil(p,parsed(''),{type:'SET'},lim).ok,false);
 assert.equal(JSON.stringify(p),snap);
});
test('P1-03 safe Network copy cannot duplicate an OUT writer',()=>{
 const p=program();
 const result=E.editNetworkOrder(p,'copy',parsed('0'),lim);
 assert.equal(result.ok,true);
 assert.equal(result.program.rungs.length,3);
 assert.equal(result.program.rungs[1].coil.type,'NOP');
 assert.equal(result.program.rungs[1].coil.ref,'');
 assert.equal(L.validate(result.program,lim).ok,true);
 const out=L.scan(result.program,{I1:true,I2:false},{},100,lim);
 assert.equal(out.ok,true);
 assert.equal(out.outputs.Q1,true);
 assert.equal(out.outputs.Q2,false);
 assert.deepEqual(p,program());
});
test('P1-03 inserting a parallel path cannot energize any output by itself',()=>{
 const p=program();
 const added=FBD.editStructure(p,'add-path','1:0',lim);
 assert.equal(added.ok,true);
 assert.deepEqual(added.program.rungs[1].paths[1],[]);
 assert.equal(L.validate(added.program,lim).ok,true);
 const out=L.scan(added.program,{I1:false,I2:false},{},100,lim);
 assert.equal(out.outputs.Q1,false);
 assert.equal(out.outputs.Q2,false);
});
test('P1-03 all relevant UI entry points preserve raw index validation',()=>{
 const code=fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8');
 for(const anchor of [
  'r:parseUiIndex(zone.dataset.r)',
  'target.p=parseUiIndex(zone.dataset.p)',
  'target.i=parseUiIndex(zone.dataset.i)',
  'r=parseUiIndex(button.dataset.r)',
  'FBDView.editCoil(active.draft,parseUiIndex(r)',
  'editLadderField(active.draft,field,parseUiIndex(r),parseUiIndex(p),parseUiIndex(c)'
 ])assert.ok(code.includes(anchor),anchor);
});
