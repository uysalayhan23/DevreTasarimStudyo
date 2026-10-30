'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const Toolbox=require('../dist/ladder-toolbox.js');
const lim={inputCount:6,outputCount:4};
const sample=()=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}],[{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'I3'}]],coil:{type:'OUT',ref:'Q2'}}
]});
const edit=(tool,target,program=sample())=>Toolbox.apply(program,tool,target,lim);
test('P1-03 explicit null insertion index is rejected on contact zone',()=>{
 const p=sample(),snap=structuredClone(p);
 const x=edit('NC',{r:0,p:1,i:null,kind:'contact'},p);
 assert.equal(x.ok,false);
 assert.deepEqual(p,snap);
});
test('P1-03 explicit null insertion index is rejected on whole Network',()=>{
 const p=sample(),snap=structuredClone(p);
 const x=edit('NO',{r:0,i:null,kind:'network'},p);
 assert.equal(x.ok,false);
 assert.deepEqual(p,snap);
});
test('P1-03 omitted insertion index still appends to selected parallel branch',()=>{
 const p=sample(),x=edit('NO',{r:0,p:1,kind:'contact'},p);
 assert.equal(x.ok,true);
 assert.deepEqual(x.program.rungs[0].paths.map(path=>path.length),[1,2]);
 assert.equal(x.program.rungs[0].paths[1][1].type,'NO');
 assert.deepEqual(p,sample());
});
test('P1-03 explicit undefined insertion index preserves + Seri append semantics',()=>{
 const x=edit('NC',{r:1,p:0,i:undefined,kind:'contact'});
 assert.equal(x.ok,true);
 assert.deepEqual(x.program.rungs[1].paths[0].map(c=>c.type),['NO','NC']);
});
test('P1-03 canonical zero inserts before original contact in the exact branch',()=>{
 const x=edit('NC',{r:0,p:1,i:'0',kind:'contact'});
 assert.equal(x.ok,true);
 assert.deepEqual(x.program.rungs[0].paths.map(p=>p.map(c=>c.type)),[['NO'],['NC','NC']]);
 assert.equal(Ladder.validate(x.program,lim).ok,true);
});
test('P1-03 canonical numeric index 1 inserts after original contact',()=>{
 const x=edit('NO',{r:0,p:1,i:1,kind:'contact'});
 assert.equal(x.ok,true);
 assert.deepEqual(x.program.rungs[0].paths[1].map(c=>c.type),['NC','NO']);
});
test('P1-03 invalid explicit indices all reject without modifying the source',()=>{
 const p=sample(),snap=structuredClone(p);
 for(const i of ['', '00', '1.0', '1e0','-1','0x0',NaN,Infinity,-1,1.5,false,true,{},[],9007199254740992]){
  const x=edit('NO',{r:0,p:0,i,kind:'contact'},p);
  assert.equal(x.ok,false,'Index was accepted: '+String(i));
 }
 assert.deepEqual(p,snap);
});
test('P1-03 blank branch still rejected, and whole Network defaults to branch 0',()=>{
 const p=sample();
 const bad=edit('NO',{r:0,kind:'contact'},p);
 assert.equal(bad.ok,false);
 const ok=edit('NO',{r:0,kind:'network'},p);
 assert.equal(ok.ok,true);
 assert.deepEqual(ok.program.rungs[0].paths.map(a=>a.length),[2,1]);
 assert.deepEqual(p,sample());
});
test('P1-03 12-contact limit rejects append and leaves saved program unchanged',()=>{
 const p=sample();p.rungs[0].paths[1]=Array.from({length:12},()=>({type:'NO',ref:'I2'}));
 const snap=structuredClone(p);
 assert.equal(Ladder.validate(p,lim).ok,true);
 const x=edit('NO',{r:0,p:1,kind:'contact'},p);
 assert.equal(x.ok,false);
 assert.deepEqual(p,snap);
});
test('P1-03 rejected insertion cannot energize any Q output or alter native scan',()=>{
 const p=sample(),copy=structuredClone(p);
 const a=Ladder.scan(p,{I1:false,I2:true,I3:false},{},100,lim);
 const invalid=edit('NO',{r:0,p:1,i:null,kind:'contact'},p);
 const b=Ladder.scan(p,{I1:false,I2:true,I3:false},{},100,lim);
 assert.equal(invalid.ok,false);
 assert.deepEqual(a.outputs,b.outputs);
 assert.equal(a.outputs.Q1,false);
 assert.equal(a.outputs.Q2,false);
 assert.deepEqual(p,copy);
});
