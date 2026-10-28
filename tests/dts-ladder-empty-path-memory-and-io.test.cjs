'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),F=require('../dist/fbd-view.js');
const E=require('../dist/ladder-editor.js'),IO=require('../dist/ladder-program-io.js');
const lim={inputCount:6,outputCount:4};
const rung=(id,paths,coil)=>({id,paths,coil}),pg=(...rungs)=>({version:1,rungs});
const contact=(ref='I1')=>({type:'NO',ref});
test('independent seeded M7 remains untouched when NOP path scans',()=>{
 const p=pg(rung('n',[[]],{type:'NOP',ref:''}));
 const mem={values:{M7:true}};
 assert.equal(L.scan(p,{I1:true},mem,0,lim).ok,true);
 assert.equal(mem.values.M7,true);
});
test('removing OUT M1 clears its old bit and derived Q1',()=>{
 const p=pg(rung('m',[[contact()]],{type:'OUT',ref:'M1'}),rung('q',[[contact('M1')]],{type:'OUT',ref:'Q1'}));
 const mem={values:{M7:true}};
 assert.equal(L.scan(p,{I1:true},mem,0,lim).outputs.Q1,true);
 const removed=E.removeOutput(p,0,lim);
 assert.equal(removed.ok,true);
 assert.equal(L.scan(removed.program,{I1:true},mem,1,lim).outputs.Q1,false);
 assert.equal(mem.values.M1,false);assert.equal(mem.values.M7,true);
});
test('removing SET M1 clears stale latch despite remaining RESET M1',()=>{
 const p=pg(rung('set',[[contact()]],{type:'SET',ref:'M1'}),rung('reset',[[contact('I2')]],{type:'RESET',ref:'M1'}),rung('q',[[contact('M1')]],{type:'OUT',ref:'Q1'}));
 const mem={};assert.equal(L.scan(p,{I1:true,I2:false},mem,0,lim).outputs.Q1,true);
 const x=E.removeOutput(p,0,lim);
 assert.equal(L.scan(x.program,{I1:false,I2:false},mem,1,lim).outputs.Q1,false);
});
test('SET M1 latch survives removing an unrelated timer',()=>{
 const p=pg(rung('set',[[contact()]],{type:'SET',ref:'M1'}),rung('t',[[contact()]],{type:'TON',ref:'T1',presetMs:100}));
 const mem={};L.scan(p,{I1:true},mem,0,lim);
 const x=E.removeOutput(p,1,lim);
 L.scan(x.program,{I1:false},mem,1,lim);
 assert.equal(mem.values.M1,true);
});
test('FBD empty path displays open gate rather than PASS',()=>{
 const html=F.render(rung('x',[[]],{type:'NOP',ref:''}),{index:0,limits:lim});
 assert.match(html,/BOŞ KONTAK/);assert.match(html,/>AÇIK</);
});
test('FBD empty contact is re-addable, output is removable',()=>{
 const p=pg(rung('x',[[]],{type:'OUT',ref:'Q1'}));
 const html=F.render(p.rungs[0],{index:0,limits:lim});
 assert.match(html,/data-action="remove-output"/);
 const add=F.editStructure(p,'add-contact','0:0:0',lim);
 assert.equal(add.ok,true);assert.equal(add.program.rungs[0].paths[0].length,1);
});
test('.dtsladder empty path and NOP roundtrip safely',()=>{
 const p=pg(rung('x',[[]],{type:'NOP',ref:''}));
 const raw=IO.serialize(p,lim,'Açık Network');
 assert.deepEqual(IO.parse(raw,lim),p);
});
test('invalid .dtsladder payload cannot replace draft',()=>{
 const p=pg(rung('x',[[contact()]],{type:'OUT',ref:'Q1'}));
 const raw=IO.serialize(p,lim);
 assert.throws(()=>IO.parse(raw.replace('dts-ladder-project','siemens-lsc'),lim));
 assert.throws(()=>IO.parse('not JSON',lim));
});
test('empty path never SETs output on scan',()=>{
 const p=pg(rung('x',[[]],{type:'SET',ref:'Q1'}));
 const result=L.scan(p,{I1:true},{},0,lim);
 assert.equal(result.traces[0].active,false);assert.equal(result.outputs.Q1,false);
});
