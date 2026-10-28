'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const F=require('../dist/fbd-view.js'),T=require('../dist/ladder-toolbox.js'),D=require('../dist/ladder-diagram.js');
const limits={inputCount:6,outputCount:4};
const c=(type='NO',ref='I1')=>({type,ref});
const rung=(id,paths,coil)=>({id,paths,coil});
const pg=(...r)=>({version:1,rungs:r});
test('removing the last contact makes Q1 OFF, never an energized empty AND',()=>{
 const p=pg(rung('R1',[[c()]],{type:'OUT',ref:'Q1'})),mem={};
 assert.equal(L.scan(p,{I1:true},mem,0,limits).outputs.Q1,true);
 const result=E.removeContact(p,0,0,0,limits);
 assert.equal(result.ok,true);assert.deepEqual(result.program.rungs[0].paths,[[]]);
 assert.equal(L.validate(result.program,limits).ok,true);
 assert.equal(L.scan(result.program,{I1:true},mem,1,limits).outputs.Q1,false);
 assert.equal(p.rungs[0].paths[0].length,1);
});
test('blank contact path never SETs a Q or M output',()=>{
 for(const ref of ['Q1','M1']){
  const p=pg(rung('R1',[[]],{type:'SET',ref})),memory={};
  const scan=L.scan(p,{I1:true},memory,0,limits);
  assert.equal(scan.ok,true);assert.equal(scan.traces[0].active,false);assert.equal(!!memory.values[ref],false);
 }
});
test('contact toolbox can re-add deleted NO/NC to empty branch',()=>{
 const p=pg(rung('R1',[[]],{type:'OUT',ref:'Q1'}));
 const n=T.apply(p,'NC',{kind:'contact',r:0,p:0,i:0},limits);
 assert.equal(n.ok,true);assert.equal(n.program.rungs[0].paths[0][0].type,'NC');
 assert.equal(p.rungs[0].paths[0].length,0);
});
test('FBD last contact removal and re-add works with open path',()=>{
 const p=pg(rung('R1',[[c()]],{type:'OUT',ref:'Q1'}));
 const n=F.editStructure(p,'remove-contact','0:0:0',limits);
 assert.equal(n.ok,true);assert.deepEqual(n.program.rungs[0].paths,[[]]);
 assert.match(F.render(n.program.rungs[0]),/BOŞ KONTAK/);
 const n2=F.editStructure(n.program,'add-contact','0:0:0',limits);
 assert.equal(n2.ok,true);assert.equal(n2.program.rungs[0].paths[0].length,1);
});
test('LAD shows open gap in diagram, not conductive wire',()=>{
 const svg=D.render(rung('R1',[[]],{type:'OUT',ref:'Q1'}),{live:true,values:{I1:true},pathStates:[false]});
 assert.match(svg,/BOŞ · kontak ekle/);
 assert.doesNotMatch(svg,/x1="94" y1="80" x2="686" y2="80"/);
});
test('all output coil types can be cleared to address-free NOP',()=>{
 for(const coil of [{type:'OUT',ref:'Q1'},{type:'SET',ref:'M1'},{type:'RESET',ref:'T1'},
  {type:'TON',ref:'T1',presetMs:100},{type:'CTU',ref:'C1',preset:1}]){
  const p=pg(rung('R1',[[c()]],coil)),out=E.removeOutput(p,0,limits);
  assert.equal(out.ok,true);assert.deepEqual(out.program.rungs[0].coil,{type:'NOP',ref:''});
  assert.equal(L.validate(out.program,limits).ok,true);
 }
});
test('deleting SET M1 clears orphan latch and downstream Q1',()=>{
 const p=pg(rung('set',[[c()]],{type:'SET',ref:'M1'}),rung('out',[[c('NO','M1')]],{type:'OUT',ref:'Q1'}));
 const mem={};assert.equal(L.scan(p,{I1:true},mem,0,limits).outputs.Q1,true);
 const n=E.removeOutput(p,0,limits);
 assert.equal(L.scan(n.program,{I1:true},mem,1,limits).outputs.Q1,false);
 assert.equal(mem.values.M1,false);
});
test('legitimate M latch remains when its SET owner is still present',()=>{
 const p=pg(rung('set',[[c()]],{type:'SET',ref:'M1'}),rung('timer',[[c()]],{type:'TON',ref:'T1',presetMs:100}));
 const mem={};L.scan(p,{I1:true},mem,0,limits);
 const n=E.removeOutput(p,1,limits);L.scan(n.program,{I1:false},mem,1,limits);
 assert.equal(mem.values.M1,true);
});
test('out-of-range deletion and already-empty output are rejected',()=>{
 const p=pg(rung('R1',[[c()]],{type:'NOP',ref:''}));
 assert.equal(E.removeContact(p,0,0,2,limits).ok,false);
 assert.equal(E.removeContact(p,-1,0,0,limits).ok,false);
 assert.equal(E.removeOutput(p,0,limits).ok,false);
});
test('Undo and Redo restore deleted contact correctly',()=>{
 const p=pg(rung('R1',[[c()]],{type:'OUT',ref:'Q1'}));
 const removed=E.removeContact(p,0,0,0,limits).program;
 const history=E.createDraftHistory(p);history.push(removed);
 assert.deepEqual(history.undo().rungs[0].paths,[[c()]]);
 assert.deepEqual(history.redo().rungs[0].paths,[[]]);
});
