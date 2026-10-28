'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const L=require('../dist/ladder-runtime.js');
const moduleBox={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/ladder-editor.js'),'utf8'),{
 module:moduleBox,exports:moduleBox.exports,
 require(name){return name==='./ladder-runtime.js'?L:{}}
});
const E=moduleBox.exports;
function program(type,ref,extra={}){
 return {version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref,...extra}}]};
}
for(const type of ['TON','TOF','TP']){
 test(type+' network copy keeps original and creates address-free NOP',()=>{
  const original=program(type,'T1',{presetMs:100}),result=E.editNetworkOrder(original,'copy',0);
  assert.equal(result.ok,true);
  assert.equal(original.rungs.length,1);
  assert.equal(result.program.rungs[0].coil.type,type);
  assert.deepEqual(JSON.parse(JSON.stringify(result.program.rungs[1].coil)),{type:'NOP',ref:''});
  assert.equal(L.validate(result.program).ok,true);
 });
}
for(const type of ['CTU','CTD']){
 test(type+' network copy does not duplicate counter writer',()=>{
  const result=E.editNetworkOrder(program(type,'C1',{preset:2}),'copy',0);
  assert.equal(result.ok,true);
  assert.equal(result.program.rungs[1].coil.type,'NOP');
  assert.equal(L.validate(result.program).ok,true);
 });
}
test('copied network with NOP never energizes a new output',()=>{
 const result=E.editNetworkOrder(program('OUT','Q1'),'copy',0);
 assert.equal(result.ok,true);
 const scanned=L.scan(result.program,{I1:true});
 assert.equal(scanned.ok,true);
 assert.equal(scanned.outputs.Q1,true);
 assert.equal(result.program.rungs[1].coil.type,'NOP');
});
