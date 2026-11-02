'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8');
function runtime(scanner){
 const module={exports:{}};
 vm.runInNewContext(source,{module,exports:module.exports,require(){return scanner}});
 return module.exports;
}
const blank=Ladder.blank();
const trace={id:'R1',coil:'Q1',active:true,pathStates:[true],value:true};
const valid={ok:true,outputs:{Q1:true},memory:{values:{Q1:true}},traces:[trace]};
function scanWith(scan,program=blank){
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program,
  _dtsLadderMemory:{values:{Q1:true}},_dtsLadderTraces:[trace]};
 const result=runtime({scan(){return scan}}).program(c,[{value:true}],[{id:'DO1'}],100);
 return {c,result};
}
function rejected(scan,program){
 const {c,result}=scanWith(scan,program);
 assert.equal(result.outputs.DO1,false);
 assert.equal(c._dtsLadderMemory,undefined);
 assert.deepEqual(Array.from(c._dtsLadderTraces),[]);
 assert.match(c._dtsLadderError,/geçersiz/i);
}
test('P0-02 rejects Q energized with inactive OUT trace',()=>rejected({...valid,traces:[{...trace,active:false,pathStates:[false],value:false}]}));
test('P0-02 rejects Q energized with false OUT value',()=>rejected({...valid,traces:[{...trace,value:false}]}));
test('P0-02 rejects missing scan memory bits',()=>rejected({...valid,memory:{}}));
test('P0-02 rejects Q output differing from scan memory',()=>rejected({...valid,memory:{values:{Q1:false}}}));
test('P0-02 rejects nonboolean Q memory bit',()=>rejected({...valid,memory:{values:{Q1:'true'}}}));
test('P0-02 rejects forged energized NOP',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'NOP',ref:''}}]};
 rejected({...valid,traces:[{...trace,coil:'',value:true}]},p);
});
test('P0-02 rejects Q output when program has no Q writer',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TON',ref:'T1',presetMs:100}}]};
 rejected({...valid,traces:[{...trace,coil:'T1',value:false}]},p);
});
test('P0-02 accepts native OUT ON and OFF',()=>{
 for(const input of [true,false]){
  const c={plcProgram:'dts-ladder-v1',ladderProgram:blank};
  const x=runtime(Ladder).program(c,[{value:input}],[{id:'DO1'}],100);
  assert.equal(x.outputs.DO1,input);assert.equal(c._dtsLadderError,undefined);
 }
});
test('P0-02 accepts native SET latch after input release',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}}]};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p},plc=runtime(Ladder);
 assert.equal(plc.program(c,[{value:true}],[{id:'DO1'}],10).outputs.DO1,true);
 assert.equal(plc.program(c,[{value:false}],[{id:'DO1'}],20).outputs.DO1,true);
});
test('P0-02 accepts native SET then RESET with Q zero',()=>{
 const p={version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}},
  {id:'R2',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'RESET',ref:'Q1'}}]};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p};
 const x=runtime(Ladder).program(c,[{value:true}],[{id:'DO1'}],100);
 assert.equal(x.outputs.DO1,false);assert.equal(c._dtsLadderError,undefined);
});
test('P0-02 accepts native NOP and pending TON as Q zero',()=>{
 for(const coil of [{type:'NOP',ref:''},{type:'TON',ref:'T1',presetMs:100}]){
  const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil}]};
  const c={plcProgram:'dts-ladder-v1',ladderProgram:p};
  assert.equal(runtime(Ladder).program(c,[{value:true}],[{id:'DO1'}],100).outputs.DO1,false);
  assert.equal(c._dtsLadderError,undefined);
 }
});
test('P0-02 clears stale state on scanner exception',()=>{
 const c={plcProgram:'dts-ladder-v1',ladderProgram:blank,_dtsLadderMemory:{values:{Q1:true}},_dtsLadderTraces:[trace]};
 const x=runtime({scan(){throw Error('fault')}}).program(c,[{value:true}],[{id:'DO1'}],100);
 assert.equal(x.outputs.DO1,false);assert.equal(c._dtsLadderMemory,undefined);
 assert.deepEqual(Array.from(c._dtsLadderTraces),[]);
});
