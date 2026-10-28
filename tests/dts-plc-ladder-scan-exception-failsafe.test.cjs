'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8');
function runtime(ladder){
 const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,require(){return ladder}});
 return module.exports;
}
test('unexpected Ladder scan exception clears stale output, traces and memory',()=>{
 const plc=runtime({scan(){throw Error('scanner fault')}});
 const c={plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank(),_dtsLadderTraces:[{active:true}],_dtsLadderMemory:{values:{Q1:true}}};
 const result=plc.program(c,[{value:true}],[{id:'DO1'}],0);
 assert.equal(result.outputs.DO1,false);
 assert.deepEqual(Array.from(c._dtsLadderTraces),[]);
 assert.equal(c._dtsLadderMemory,undefined);
 assert.match(c._dtsLadderError,/tamamlanamadı/);
});
test('valid Ladder scan still energizes its assigned output',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()};
 const result=runtime(Ladder).program(c,[{value:true}],[{id:'DO1'}],0);
 assert.equal(result.outputs.DO1,true);
 assert.equal(c._dtsLadderError,undefined);
});
test('invalid Ladder program fails closed without stale output',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:{version:1,rungs:[]},_dtsLadderMemory:{values:{Q1:true}}};
 const result=runtime(Ladder).program(c,[{value:true}],[{id:'DO1'}],0);
 assert.equal(result.outputs.DO1,false);
 assert.equal(c._dtsLadderMemory,undefined);
 assert.equal(typeof c._dtsLadderError,'string');
});
