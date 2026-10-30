'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const T=require('../dist/ladder-toolbox.js');
const limits={inputCount:6,outputCount:4};
const create=()=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}],[{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'I3'}]],coil:{type:'OUT',ref:'Q2'}}
]});
const go=(p,tool,target)=>T.apply(p,tool,target,limits);

test('dedicated contact zone without a branch cannot alter the first parallel path',()=>{
 const source=create(),prior=JSON.stringify(source);
 const edited=go(source,'NO',{r:0,kind:'contact'});
 assert.equal(edited.ok,false);
 assert.equal(JSON.stringify(source),prior);
});
test('missing branch on the second network is rejected, not redirected to its first path',()=>{
 const source=create();
 const edited=go(source,'NC',{r:1,kind:'contact'});
 assert.equal(edited.ok,false);
 assert.equal(source.rungs[1].paths[0].length,1);
});
test('invalid explicit branch values are rejected without mutating the source',()=>{
 const source=create(),prior=JSON.stringify(source);
 for(const bad of [undefined,null,'',' ','00','1.0','-1','0x0',NaN,{},[],true]){
  const out=go(source,'NO',{r:0,p:bad,kind:'contact'});
  assert.equal(out.ok,false,'invalid path '+String(bad));
 }
 assert.equal(JSON.stringify(source),prior);
});
test('specific second branch receives the contact rather than the first branch',()=>{
 const source=create();
 const out=go(source,'NO',{r:0,p:1,kind:'contact'});
 assert.equal(out.ok,true);
 assert.deepEqual(out.program.rungs[0].paths.map(a=>a.length),[1,2]);
 assert.equal(L.validate(out.program,limits).ok,true);
 assert.deepEqual(source,create());
});
test('canonical dataset index string remains valid in a contact zone',()=>{
 const out=go(create(),'NO',{r:'0',p:'1',i:'0',kind:'contact'});
 assert.equal(out.ok,true);
 assert.equal(out.program.rungs[0].paths[1][0].type,'NO');
 assert.equal(out.program.rungs[0].paths[1][1].type,'NC');
});
test('whole-network drop retains its intentional default first branch',()=>{
 const out=go(create(),'NO',{r:0,kind:'network'});
 assert.equal(out.ok,true);
 assert.deepEqual(out.program.rungs[0].paths.map(a=>a.length),[2,1]);
});
test('normal + Seri button may append without an explicit insertion index',()=>{
 const out=go(create(),'NO',{r:0,p:1,kind:'contact'});
 assert.equal(out.ok,true);
 assert.equal(out.program.rungs[0].paths[1][1].type,'NO');
});
test('coil tool does not need a contact path index',()=>{
 const out=go(create(),'TON',{r:1,kind:'coil'});
 assert.equal(out.ok,true);
 assert.equal(out.program.rungs[1].coil.type,'TON');
 assert.equal(out.program.rungs[1].coil.ref,'T1');
});
test('safe rejection does not switch active Q outputs',()=>{
 const source=create();
 assert.equal(go(source,'NC',{r:0,kind:'contact'}).ok,false);
 const out=L.scan(source,{I1:false,I2:true,I3:false},{},100,limits);
 assert.equal(out.ok,true);
 assert.equal(out.outputs.Q1,false);
 assert.equal(out.outputs.Q2,false);
});
