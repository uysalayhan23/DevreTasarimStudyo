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

const healthyTrace={id:'R1',active:true,pathStates:[true],coil:'Q1',value:true};
const healthyScan={ok:true,outputs:{Q1:true},memory:{values:{Q1:true}},traces:[healthyTrace]};
for(const [name,scan] of [
 ['missing output map',{...healthyScan,outputs:undefined}],
 ['missing trace list',{...healthyScan,traces:undefined}],
 ['nonboolean Q value',{...healthyScan,outputs:{Q1:'true'}}],
 ['stale Network ID',{...healthyScan,traces:[{...healthyTrace,id:'OLD'}]}],
 ['invalid path trace',{...healthyScan,traces:[{...healthyTrace,pathStates:[]}]}],
 ['contradictory path activity',{...healthyScan,traces:[{...healthyTrace,active:false}]}],
 ['missing memory',{...healthyScan,memory:undefined}]
]){
 test('success-shaped malformed scan fails closed: '+name,()=>{
  const plc=runtime({scan(){return scan}});
  const c={plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank(),
   _dtsLadderTraces:[healthyTrace],_dtsLadderMemory:{values:{Q1:true}}};
  const result=plc.program(c,[{value:true}],[{id:'DO1'}],0);
  assert.equal(result.outputs.DO1,false);
  assert.deepEqual(Array.from(c._dtsLadderTraces),[]);
  assert.equal(c._dtsLadderMemory,undefined);
  assert.match(c._dtsLadderError,/geçersiz/i);
 });
}
