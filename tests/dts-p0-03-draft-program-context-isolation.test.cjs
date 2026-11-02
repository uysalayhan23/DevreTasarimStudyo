'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),L=require('../dist/ladder-runtime.js');
const fixture=()=>({project:{},component:{id:'cpu1',typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()}});
const edit=(h,ref)=>{const p=h.current();p.rungs[0].coil.ref=ref;assert.equal(h.push(p),true)};

test('P0-03 switching a PLC program mode invalidates an unsaved Ladder draft',()=>{
 const {project,component}=fixture(),sessions=E.createDraftSessions();
 const h=sessions.forComponent(project,component,component.ladderProgram);edit(h,'Q2');
 component.plcProgram='mirror';
 const next=sessions.forComponent(project,component,component.ladderProgram);
 assert.notEqual(next,h);assert.equal(next.current().rungs[0].coil.ref,'Q1');
 assert.equal(next.canUndo(),false);assert.equal(component.ladderProgram.rungs[0].coil.ref,'Q1');
});
test('P0-03 returning to Ladder mode does not resurrect a draft from a prior program mode',()=>{
 const {project,component}=fixture(),sessions=E.createDraftSessions();
 const first=sessions.forComponent(project,component,component.ladderProgram);edit(first,'Q2');
 component.plcProgram='mirror';sessions.forComponent(project,component,component.ladderProgram);
 component.plcProgram='dts-ladder-v1';
 const next=sessions.forComponent(project,component,component.ladderProgram);
 assert.equal(next.current().rungs[0].coil.ref,'Q1');assert.equal(next.canUndo(),false);
});
test('P0-03 changing hardware type invalidates draft when same component object is reused',()=>{
 const {project,component}=fixture(),sessions=E.createDraftSessions();
 const h=sessions.forComponent(project,component,component.ladderProgram);edit(h,'Q2');
 component.typeId='plc-other-supported-hardware';
 const next=sessions.forComponent(project,component,component.ladderProgram);
 assert.notEqual(next,h);assert.equal(next.current().rungs[0].coil.ref,'Q1');
 assert.equal(next.canRedo(),false);
});
test('P0-03 same PLC type/mode/saved baseline preserves unsaved edit and history',()=>{
 const {project,component}=fixture(),sessions=E.createDraftSessions();
 const h=sessions.forComponent(project,component,component.ladderProgram);edit(h,'Q2');
 const again=sessions.forComponent(project,component,component.ladderProgram);
 assert.equal(again,h);assert.equal(again.current().rungs[0].coil.ref,'Q2');
 assert.equal(again.undo().rungs[0].coil.ref,'Q1');
 assert.equal(again.redo().rungs[0].coil.ref,'Q2');
});
test('P0-03 saved baseline changes reset draft and never change saved program implicitly',()=>{
 const {project,component}=fixture(),sessions=E.createDraftSessions();
 const h=sessions.forComponent(project,component,component.ladderProgram);edit(h,'Q2');
 const original=component.ladderProgram;
 component.ladderProgram=L.blank();component.ladderProgram.rungs[0].coil.ref='Q3';
 const newHistory=sessions.forComponent(project,component,component.ladderProgram);
 assert.equal(newHistory.current().rungs[0].coil.ref,'Q3');
 assert.equal(original.rungs[0].coil.ref,'Q1');assert.equal(newHistory.canUndo(),false);
});
test('P0-03 project and replaced PLC instances remain independent',()=>{
 const {project,component}=fixture(),sessions=E.createDraftSessions();
 const h=sessions.forComponent(project,component,component.ladderProgram);edit(h,'Q2');
 assert.equal(sessions.forComponent({},component,component.ladderProgram).current().rungs[0].coil.ref,'Q1');
 const replacement={...component};
 assert.equal(sessions.forComponent(project,replacement,replacement.ladderProgram).current().rungs[0].coil.ref,'Q1');
});
test('P0-03 legacy PLCs with no explicit type/mode still preserve their draft',()=>{
 const project={},component={id:'old',ladderProgram:L.blank()},s=E.createDraftSessions();
 const h=s.forComponent(project,component,component.ladderProgram);edit(h,'Q2');
 assert.equal(s.forComponent(project,component,component.ladderProgram),h);
});
