'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const base=()=>({id:'CPU-A',typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()});
const tweak=(h,ref)=>{const draft=h.current();draft.rungs[0].coil.ref=ref;assert.equal(h.push(draft),true)};
test('negative: switching CPU-A -> CPU-B -> CPU-A never resurrects old Q2 draft',()=>{
 const p={},c=base(),sessions=E.createDraftSessions();
 const first=sessions.forComponent(p,c,c.ladderProgram);tweak(first,'Q2');
 c.id='CPU-B';const b=sessions.forComponent(p,c,c.ladderProgram);
 assert.equal(b.current().rungs[0].coil.ref,'Q1');
 c.id='CPU-A';const back=sessions.forComponent(p,c,c.ladderProgram);
 assert.notEqual(back,first);
 assert.equal(back.current().rungs[0].coil.ref,'Q1');
 assert.equal(back.canUndo(),false);
 assert.equal(c.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('negative: repeated A->B->A loops never revive old stale Undo history',()=>{
 const p={},c=base(),sessions=E.createDraftSessions();
 const first=sessions.forComponent(p,c,c.ladderProgram);tweak(first,'Q2');
 for(let i=0;i<3;i++){
  c.id='CPU-B';const b=sessions.forComponent(p,c,c.ladderProgram);
  assert.equal(b.current().rungs[0].coil.ref,'Q1');
  c.id='CPU-A';const a=sessions.forComponent(p,c,c.ladderProgram);
  assert.equal(a.current().rungs[0].coil.ref,'Q1');assert.equal(a.canUndo(),false);
 }
});
test('positive: same ID preserves its own unsaved draft and Undo Redo',()=>{
 const p={},c=base(),s=E.createDraftSessions(),first=s.forComponent(p,c,c.ladderProgram);
 tweak(first,'Q2');assert.equal(s.forComponent(p,c,c.ladderProgram),first);
 assert.equal(first.undo().rungs[0].coil.ref,'Q1');assert.equal(first.redo().rungs[0].coil.ref,'Q2');
});
test('positive: two independent PLC instances cannot erase one another sessions',()=>{
 const p={},c1=base(),c2={...base(),id:'CPU-B'},s=E.createDraftSessions();
 const h1=s.forComponent(p,c1,c1.ladderProgram);tweak(h1,'Q2');
 const h2=s.forComponent(p,c2,c2.ladderProgram);tweak(h2,'Q3');
 assert.equal(s.forComponent(p,c1,c1.ladderProgram).current().rungs[0].coil.ref,'Q2');
 assert.equal(s.forComponent(p,c2,c2.ladderProgram).current().rungs[0].coil.ref,'Q3');
});
test('positive: different projects maintain separate draft sessions',()=>{
 const a={},b={},c=base(),s=E.createDraftSessions();
 const one=s.forComponent(a,c,c.ladderProgram);tweak(one,'Q2');
 const two=s.forComponent(b,c,c.ladderProgram);
 assert.equal(two.current().rungs[0].coil.ref,'Q1');
 assert.notEqual(one,two);
});
test('positive: existing mode/type invalidation stays active',()=>{
 const p={},c=base(),s=E.createDraftSessions();
 const one=s.forComponent(p,c,c.ladderProgram);tweak(one,'Q2');
 c.plcProgram='mirror';const two=s.forComponent(p,c,c.ladderProgram);
 assert.notEqual(two,one);assert.equal(two.current().rungs[0].coil.ref,'Q1');
 c.typeId='supported-alias';const three=s.forComponent(p,c,c.ladderProgram);
 assert.notEqual(three,two);assert.equal(three.current().rungs[0].coil.ref,'Q1');
});
test('positive: changed saved program resets draft and leaves save baseline unchanged',()=>{
 const p={},c=base(),s=E.createDraftSessions(),old=s.forComponent(p,c,c.ladderProgram);
 tweak(old,'Q2');c.ladderProgram=L.blank();c.ladderProgram.rungs[0].coil.ref='Q3';
 const fresh=s.forComponent(p,c,c.ladderProgram);
 assert.notEqual(fresh,old);assert.equal(fresh.current().rungs[0].coil.ref,'Q3');
 assert.equal(fresh.canUndo(),false);
});
test('positive: project reloaded as new object uses clean history',()=>{
 const c=base(),s=E.createDraftSessions(),p1={},p2={};
 const old=s.forComponent(p1,c,c.ladderProgram);tweak(old,'Q2');
 const fresh=s.forComponent(p2,c,c.ladderProgram);
 assert.equal(fresh.current().rungs[0].coil.ref,'Q1');assert.equal(fresh.canUndo(),false);
});
