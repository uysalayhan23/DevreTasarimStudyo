'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Toolbox=require('../dist/ladder-toolbox.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
test('all ten palette instruments are recognized',()=>{
 assert.equal(Toolbox.tools.length,10);
 assert.ok(Toolbox.tools.some(t=>t.id==='NO'));
 assert.ok(Toolbox.tools.some(t=>t.id==='CTD'));
});
test('contact inserts without mutating saved program',()=>{
 const source=L.blank(),prior=JSON.stringify(source);
 const r=Toolbox.apply(source,'NC',{r:0,p:0,i:0,kind:'contact'},limits);
 assert.equal(r.ok,true);assert.equal(r.program.rungs[0].paths[0][0].type,'NC');
 assert.equal(JSON.stringify(source),prior);
});
test('coil, TON, TOF, TP, CTU and CTD remain valid',()=>{
 for(const kind of ['OUT','SET','RESET','TON','TOF','TP','CTU','CTD']){
  const r=Toolbox.apply(L.blank(),kind,{r:0,kind:'coil'},limits);
  assert.equal(r.ok,true,kind);
  assert.equal(L.validate(r.program,limits).ok,true,kind);
 }
});
test('mismatched drop, fake network and full path are fail-closed',()=>{
 const p=L.blank();assert.equal(Toolbox.apply(p,'NO',{r:0,kind:'coil'},limits).ok,false);
 assert.equal(Toolbox.apply(p,'TON',{r:0,kind:'contact',p:0},limits).ok,false);
 assert.equal(Toolbox.apply(p,'NO',{r:99,kind:'network'},limits).ok,false);
 p.rungs[0].paths[0]=Array.from({length:12},()=>({type:'NO',ref:'I1'}));
 assert.equal(Toolbox.apply(p,'NO',{r:0,kind:'network'},limits).ok,false);
});
