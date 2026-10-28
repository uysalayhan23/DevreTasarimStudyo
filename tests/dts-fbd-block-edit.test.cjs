'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const original={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const edit=(p,field,value)=>F.editCoil(p,0,{[field]:value},limits);
test('FBD OUT to SET retains a safe independent draft; LAD scan latches',()=>{
 const result=edit(original,'type','SET');assert.equal(result.ok,true);
 assert.equal(original.rungs[0].coil.type,'OUT');
 const mem={};assert.equal(L.scan(result.program,{I1:true},mem,1,limits).outputs.Q1,true);
 assert.equal(L.scan(result.program,{I1:false},mem,2,limits).outputs.Q1,true);
 assert.equal(L.scan(original,{I1:false},{},2,limits).outputs.Q1,false);
});
test('FBD time block edits preserve equivalence with Ladder TON logic',()=>{
 let result=edit(original,'type','TON');assert.equal(result.ok,true);
 assert.equal(result.program.rungs[0].coil.ref,'T1');
 result=edit(result.program,'presetMs',250);assert.equal(result.ok,true);
 const program=structuredClone(result.program);
 program.rungs.push({id:'R2',paths:[[{type:'NO',ref:'T1'}]],coil:{type:'OUT',ref:'Q1'}});
 const m={};assert.equal(L.scan(program,{I1:true},m,0,limits).outputs.Q1,false);
 assert.equal(L.scan(program,{I1:true},m,250,limits).outputs.Q1,true);
 assert.match(F.render(result.program.rungs[0],{limits}),/data-fbd-coil-field="presetMs"/);
});
test('FBD counter block editing and invalid preset are separate',()=>{
 const c=edit(original,'type','CTU');assert.equal(c.ok,true);
 assert.equal(c.program.rungs[0].coil.ref,'C1');
 const t=edit(c.program,'preset',2);assert.equal(t.ok,true);
 assert.equal(edit(t.program,'preset',0).ok,false);
 assert.equal(edit(t.program,'preset',2.5).ok,false);
 const m={};const p=structuredClone(t.program);
 p.rungs.push({id:'R2',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q1'}});
 L.scan(p,{I1:true},m,1,limits);L.scan(p,{I1:false},m,2,limits);
 assert.equal(L.scan(p,{I1:true},m,3,limits).outputs.Q1,true);
});
test('FBD address and type editing rejects unsupported hardware or command',()=>{
 assert.equal(edit(original,'ref','Q5').ok,false);
 assert.equal(edit(original,'ref','T1').ok,false);
 assert.equal(edit(original,'type','arbitrary').ok,false);
 assert.equal(F.editCoil(original,-1,{ref:'Q1'},limits).ok,false);
 assert.equal(F.editCoil(original,9,{ref:'Q1'},limits).ok,false);
 assert.equal(F.editCoil(original,0,{ref:'Q2',type:'TON'},limits).ok,false);
 assert.equal(edit(original,'presetMs',100).ok,false);
 assert.equal(F.editCoil(original,0,{'__proto__':'bad'},limits).ok,false);
 assert.equal(original.rungs[0].coil.ref,'Q1');
});
test('direct FBD controls keep selected type, actual PLC output bounds and access labels',()=>{
 const out=F.render(original.rungs[0],{index:0,limits});
 assert.match(out,/data-fbd-coil-field="type"/);
 assert.match(out,/data-fbd-coil-field="ref"/);
 assert.match(out,/aria-label="FBD çıkış komutu"/);
 assert.doesNotMatch(out,/<option value="Q5"/);
 assert.deepEqual(F.refsFor('CTD',limits).slice(0,2),['C1','C2']);
 assert.equal(F.refsFor('unknown',limits).length,0);
});
