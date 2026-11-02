'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const component=(id='CPU-A')=>({id,typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()});
const edit=(history,ref)=>{const next=history.current();next.rungs[0].coil.ref=ref;assert.equal(history.push(next),true)};

test('P0-03 negative: returning project A after A→B→A must not revive abandoned Q2 draft',()=>{
 const c=component(),a={},b={},sessions=E.createDraftSessions();
 const previous=sessions.forComponent(a,c,c.ladderProgram);edit(previous,'Q2');
 const inB=sessions.forComponent(b,c,c.ladderProgram);assert.equal(inB.current().rungs[0].coil.ref,'Q1');
 const returned=sessions.forComponent(a,c,c.ladderProgram);
 assert.notEqual(returned,previous,'old project session must be retired on project change');
 assert.equal(returned.current().rungs[0].coil.ref,'Q1');
 assert.equal(returned.canUndo(),false);
 assert.equal(c.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('P0-03 negative: repeated project A↔B moves never resurrect stale Undo/Redo',()=>{
 const c=component(),a={},b={},sessions=E.createDraftSessions();
 const old=sessions.forComponent(a,c,c.ladderProgram);edit(old,'Q2');
 for(let i=0;i<4;i++){
  const other=sessions.forComponent(b,c,c.ladderProgram);
  assert.equal(other.current().rungs[0].coil.ref,'Q1');
  const returned=sessions.forComponent(a,c,c.ladderProgram);
  assert.equal(returned.current().rungs[0].coil.ref,'Q1');
  assert.equal(returned.canUndo(),false);assert.equal(returned.canRedo(),false);
 }
});
test('P0-03 positive: same project and same PLC still preserve legal Undo/Redo history',()=>{
 const c=component(),p={},s=E.createDraftSessions(),h=s.forComponent(p,c,c.ladderProgram);
 edit(h,'Q2');assert.equal(s.forComponent(p,c,c.ladderProgram),h);
 assert.equal(h.undo().rungs[0].coil.ref,'Q1');
 assert.equal(h.redo().rungs[0].coil.ref,'Q2');
});
test('P0-03 positive: another PLC moving project must not delete stationary PLC draft',()=>{
 const a={},b={},fixed=component('FIXED'),moving=component('MOVING'),s=E.createDraftSessions();
 const kept=s.forComponent(a,fixed,fixed.ladderProgram);edit(kept,'Q2');
 s.forComponent(a,moving,moving.ladderProgram);
 s.forComponent(b,moving,moving.ladderProgram);
 assert.equal(s.forComponent(a,fixed,fixed.ladderProgram),kept);
 assert.equal(kept.current().rungs[0].coil.ref,'Q2');
});
test('P0-03 positive: separate projects with distinct components do not cross-delete',()=>{
 const a={},b={},c1=component('CPU1'),c2=component('CPU2'),s=E.createDraftSessions();
 const h1=s.forComponent(a,c1,c1.ladderProgram),h2=s.forComponent(b,c2,c2.ladderProgram);
 edit(h1,'Q2');edit(h2,'Q3');
 assert.equal(s.forComponent(a,c1,c1.ladderProgram).current().rungs[0].coil.ref,'Q2');
 assert.equal(s.forComponent(b,c2,c2.ladderProgram).current().rungs[0].coil.ref,'Q3');
});
test('P0-03 positive: ID rotation protection still blocks old ID draft after project switch',()=>{
 const a={},b={},c=component(),s=E.createDraftSessions();
 const old=s.forComponent(a,c,c.ladderProgram);edit(old,'Q2');
 c.id='CPU-B';s.forComponent(a,c,c.ladderProgram);
 s.forComponent(b,c,c.ladderProgram);c.id='CPU-A';
 const fresh=s.forComponent(a,c,c.ladderProgram);
 assert.equal(fresh.current().rungs[0].coil.ref,'Q1');assert.equal(fresh.canUndo(),false);
});
test('P0-03 positive: saved program change still discards prior draft',()=>{
 const c=component(),p={},s=E.createDraftSessions(),h=s.forComponent(p,c,c.ladderProgram);
 edit(h,'Q2');c.ladderProgram=L.blank();c.ladderProgram.rungs[0].coil.ref='Q4';
 const fresh=s.forComponent(p,c,c.ladderProgram);
 assert.equal(fresh.current().rungs[0].coil.ref,'Q4');assert.equal(fresh.canUndo(),false);
});
test('P0-03 positive: NOP draft remains output-free and native Ladder program is untouched',()=>{
 const c=component(),a={},b={},s=E.createDraftSessions();
 const h=s.forComponent(a,c,c.ladderProgram);
 const p=h.current();p.rungs[0].coil={type:'NOP',ref:''};assert.equal(L.validate(p).ok,true);
 h.push(p);s.forComponent(b,c,c.ladderProgram);
 const restored=s.forComponent(a,c,c.ladderProgram);
 assert.equal(restored.current().rungs[0].coil.type,'OUT');
 assert.equal(c.ladderProgram.rungs[0].coil.ref,'Q1');
});
