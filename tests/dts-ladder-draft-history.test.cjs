'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),L=require('../dist/ladder-runtime.js');
const base=()=>L.blank();
test('Ladder draft history isolates saved program and supports undo/redo',()=>{
 const saved=base(),h=E.createDraftHistory(saved);
 let d=h.current();d.rungs[0].coil.ref='Q2';assert.equal(h.push(d),true);
 d=h.current();d.rungs[0].paths[0][0].type='NC';h.push(d);
 assert.equal(saved.rungs[0].coil.ref,'Q1');
 assert.equal(h.undo().rungs[0].paths[0][0].type,'NO');
 assert.equal(h.undo().rungs[0].coil.ref,'Q1');
 assert.equal(h.redo().rungs[0].coil.ref,'Q2');
 assert.equal(h.redo().rungs[0].paths[0][0].type,'NC');
});
test('no-op edit does not add history and new branch clears redo',()=>{
 const h=E.createDraftHistory(base());assert.equal(h.push(h.current()),false);
 let d=h.current();d.rungs[0].coil.ref='Q2';h.push(d);h.undo();
 d=h.current();d.rungs[0].coil.ref='Q3';h.push(d);
 assert.equal(h.canRedo(),false);assert.equal(h.current().rungs[0].coil.ref,'Q3');
});
test('bounded history retains at most requested number of snapshots',()=>{
 const h=E.createDraftHistory(base(),3);
 for(let i=0;i<7;i++){const d=h.current();d.rungs[0].id='R'+(i+2);h.push(d)}
 let n=0;while(h.undo())n++;
 assert.equal(n,2);
});
test('switching PLC and closing modal preserves unsaved draft without touching saved circuit',()=>{
 const s=E.createDraftSessions(),project={},a={id:'a',ladderProgram:base()},b={id:'b',ladderProgram:base()};
 const h=s.forComponent(project,a,a.ladderProgram);
 const d=h.current();d.rungs[0].coil.ref='Q2';h.push(d);
 s.forComponent(project,b,b.ladderProgram);
 assert.equal(s.forComponent(project,a,a.ladderProgram).current().rungs[0].coil.ref,'Q2');
 assert.equal(a.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('new project, replaced PLC and changed saved baseline discard stale draft',()=>{
 const s=E.createDraftSessions(),p={},a={id:'a',ladderProgram:base()};
 const h=s.forComponent(p,a,a.ladderProgram),d=h.current();d.rungs[0].coil.ref='Q2';h.push(d);
 assert.equal(s.forComponent({},a,a.ladderProgram).current().rungs[0].coil.ref,'Q1');
 assert.equal(s.forComponent(p,{id:'a',ladderProgram:base()},base()).current().rungs[0].coil.ref,'Q1');
 a.ladderProgram=E.starter();
 assert.equal(s.forComponent(p,a,a.ladderProgram).current().rungs[0].paths.length,2);
});
test('saved Ladder program starts a fresh history',()=>{
 const s=E.createDraftSessions(),p={},a={id:'a',ladderProgram:base()};
 const h=s.forComponent(p,a,a.ladderProgram),d=h.current();d.rungs[0].coil.ref='Q2';h.push(d);
 a.ladderProgram=h.current();s.forget(p,a);
 assert.equal(s.forComponent(p,a,a.ladderProgram).canUndo(),false);
});
