'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js');
const L=require('../dist/ladder-runtime.js');
const IO=require('../dist/ladder-program-io.js');
const limits={inputCount:6,outputCount:4};
const pins=[...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))];
const editor={byId:{cpu:{id:'cpu',pins}}};
const component=ladderProgram=>({id:'c1',typeId:'cpu',plcProgram:'dts-ladder-v1',ladderProgram});
function safe(program){
 const c=component(program),before=JSON.stringify(c);
 const state=E.stateFor(c,editor),draft=state.draft;
 assert.equal(state.recoveryWarning,true);
 assert.equal(JSON.stringify(c),before,'inspect must not rewrite original saved program');
 assert.equal(L.validate(draft,limits).ok,true,'safe draft is native-valid');
 assert.equal(draft.rungs.length,1);
 assert.deepEqual(draft.rungs[0].paths,[[]]);
 assert.deepEqual(draft.rungs[0].coil,{type:'NOP',ref:''});
 const scan=L.scan(draft,{I1:true,I2:true},{values:{Q1:true,M1:true}},0,limits);
 assert.equal(scan.ok,true);
 assert.equal(scan.outputs.Q1,false);
 assert.equal(scan.outputs.Q2,false);
}
test('P0-03 corrupt saved ladder with no networks must never synthesize an energized Q1 writer',()=>safe({version:1,rungs:[]}));
test('P0-03 saved ladder with illegal Q5 output must initialize to address-free NOP',()=>safe({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q5'}}]}));
test('P0-03 saved ladder with duplicate Q1 writer must initialize to address-free NOP',()=>safe({version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},{id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}}]}));
test('P0-03 missing saved ladder when mode claims applied Ladder must not energize Q1',()=>safe(null));
test('P0-03 native-valid saved Ladder preserves contacts and coil without modification',()=>{
 const valid=L.blank(),c=component(valid),draft=E.stateFor(c,editor).draft;
 assert.deepEqual(draft,valid);assert.notStrictEqual(draft,valid);
 const scan=L.scan(draft,{I1:true},{},0,limits);assert.equal(scan.outputs.Q1,true);
});
test('P0-03 new PLC without stored Ladder retains existing explicit starter workflow',()=>{
 const c={id:'c1',typeId:'cpu'};
 assert.deepEqual(E.stateFor(c,editor).draft,L.blank());
});

test('P0-03 invalid applied program cannot be started before a valid explicit save',()=>{
 const c=component({version:1,rungs:[]}),draft=E.stateFor(c,editor).draft;
 assert.equal(E.canStartLadder(c,draft,false,{disabled:false}),false);
 assert.equal(E.canStartLadder(c,draft,false,{disabled:true}),false);
});
test('P0-03 safe recovery draft roundtrips through canonical DTS program import without a writer',()=>{
 const invalid={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q5'}}]};
 const recovery=E.stateFor(component(invalid),editor).draft;
 const parsed=IO.parse(IO.serialize(recovery,limits,'Kurtarılan taslak'),limits);
 assert.deepEqual(parsed,recovery);
 assert.deepEqual(parsed.rungs[0].coil,{type:'NOP',ref:''});
 assert.equal(L.scan(parsed,{I1:true},{values:{Q1:true}},1,limits).outputs.Q1,false);
});
