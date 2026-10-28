'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q2'}}]};
test('adding LAD rung does not energize Q1 on I1 high',()=>{
 const a=E.addSafeRung(program,limits);assert.equal(a.ok,true);
 assert.deepEqual(a.program.rungs[1],{id:'R2',paths:[[]],coil:{type:'NOP',ref:''}});
 assert.equal(L.validate(a.program,limits).ok,true);
 assert.equal(L.scan(program,{I1:true,I2:false},{},0,limits).outputs.Q1,false);
 assert.equal(L.scan(a.program,{I1:true,I2:false},{},1,limits).outputs.Q1,false);
});
test('new LAD rung does not change an existing energized network',()=>{
 const a=E.addSafeRung(program,limits);
 assert.equal(L.scan(program,{I2:true},{},0,limits).outputs.Q2,true);
 assert.equal(L.scan(a.program,{I2:true},{},1,limits).outputs.Q2,true);
 assert.equal(program.rungs.length,1);
});
test('new rung works on PLC with zero physical I/O and can be programmed later',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'M2'}}]};
 const q=E.addSafeRung(p,{inputCount:0,outputCount:0});
 assert.equal(q.ok,true);assert.equal(L.validate(q.program,{inputCount:0,outputCount:0}).ok,true);
 assert.equal(q.program.rungs[1].coil.type,'NOP');
});
test('network IDs are unique; max 32 and invalid programs fail without mutation',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},{id:'R3',paths:[[]],coil:{type:'NOP',ref:''}}]};
 const q=E.addSafeRung(p,limits);assert.equal(q.ok,true);assert.equal(q.program.rungs[2].id,'R2');
 const full={version:1,rungs:Array.from({length:32},(_,i)=>({id:'R'+(i+1),paths:[[]],coil:{type:'NOP',ref:''}}))};
 assert.equal(E.addSafeRung(full,limits).ok,false);
 assert.equal(E.addSafeRung({version:1,rungs:[]},limits).ok,false);
 assert.equal(p.rungs.length,2);
});
test('adding LAD parallel path cannot energize Q2 when only I1 is high',()=>{
 const a=E.addSafeParallelPath(program,0,limits);
 assert.equal(a.ok,true);assert.deepEqual(a.program.rungs[0].paths[1],[]);
 assert.equal(L.scan(a.program,{I1:true,I2:false},{},0,limits).outputs.Q2,false);
 assert.equal(program.rungs[0].paths.length,1);
});
test('new parallel path can later receive a real contact to activate the output',()=>{
 const a=E.addSafeParallelPath(program,0,limits),b=F.editStructure(a.program,'add-contact','0:1:0',limits);
 assert.equal(b.ok,true);assert.equal(b.program.rungs[0].paths[1][0].ref,'I1');
 assert.equal(L.scan(b.program,{I1:true,I2:false},{},0,limits).outputs.Q2,true);
});
test('invalid network index and full parallel count are rejected',()=>{
 assert.equal(E.addSafeParallelPath(program,-1,limits).ok,false);
 assert.equal(E.addSafeParallelPath(program,99,limits).ok,false);
 const full=JSON.parse(JSON.stringify(program));full.rungs[0].paths=Array.from({length:8},()=>[{type:'NO',ref:'I2'}]);
 assert.equal(E.addSafeParallelPath(full,0,limits).ok,false);
});
test('Undo and Redo reverse safe rung and parallel additions without saved changes',()=>{
 const hist=E.createDraftHistory(program),newRung=E.addSafeRung(program,limits).program;
 hist.push(newRung);assert.equal(hist.undo().rungs.length,1);
 assert.equal(hist.redo().rungs.length,2);assert.equal(program.rungs.length,1);
});
test('real LAD button actions use both safe helpers',()=>{
 const code=require('node:fs').readFileSync(require('node:path').join(__dirname,'../dist/ladder-editor.js'),'utf8');
 assert.match(code,/if\(type==='add-rung'\)\{\s*const result=addSafeRung\(active\.draft,limits\(\)\)/);
 assert.match(code,/else if\(type==='add-path'\)\{\s*const result=addSafeParallelPath\(active\.draft,r,limits\(\)\)/);
});
