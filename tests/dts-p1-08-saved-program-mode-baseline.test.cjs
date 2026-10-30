'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const E=require('../dist/ladder-editor.js');const L=require('../dist/ladder-runtime.js');
const pins=[{id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},{id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},{id:'X12:2',label:'3M',signalType:'POWER'},...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
function setup(){const c={id:'plc',typeId:'type',plcProgram:'dts-ladder-v1',ladderProgram:L.blank()},project={components:[c]};const editor={getProject:()=>project,byId:{type:{id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins}}};return {c,project,editor,active:E.stateFor(c,editor)}}
test('unchanged saved mode and program commit allowed',()=>{const x=setup();assert.equal(E.canCommitDraft(x.active,x.editor),true)});
test('changed saved PLC mode must reject stale draft',()=>{const x=setup();x.c.plcProgram='other-program';assert.equal(E.canCommitDraft(x.active,x.editor),false)});
test('changed saved program rejects stale draft',()=>{const x=setup();x.c.ladderProgram=L.blank();x.c.ladderProgram.rungs[0].coil.ref='Q2';assert.equal(E.canCommitDraft(x.active,x.editor),false)});
test('removed component rejects draft',()=>{const x=setup();x.project.components=[];assert.equal(E.canCommitDraft(x.active,x.editor),false)});
