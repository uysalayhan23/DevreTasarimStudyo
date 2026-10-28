'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const rung={id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'I3'}]],coil:{type:'OUT',ref:'Q1'}};
test('same Ladder V1 network is represented by AND OR NOT blocks',()=>{
 const x=F.render(rung,{index:2});
 assert.match(x,/FBD Network 3/);assert.match(x,/NOT I2/);assert.match(x,/>AND</);assert.match(x,/>OR</);
 assert.match(x,/data-ladder-contact="2:0:0"/);assert.match(x,/data-ladder-coil="2"/);
});
test('green is never inferred from unrelated program states',()=>{
 const p={version:1,rungs:[rung]};
 for(const bits of [{I1:true,I2:false},{I1:false,I3:true},{I1:true,I2:true}]){
  const trace=L.scan(p,bits,{},1,{inputCount:6,outputCount:4}).traces[0];
  const s=F.render(rung,{live:true,pathStates:trace.pathStates,coilValue:trace.value});
  assert.equal(s.includes('dts-fbd-on'),trace.active);
 }
 assert.doesNotMatch(F.render(rung,{live:false,pathStates:[true,true],coilValue:true}),/dts-fbd-on/);
});

test('FBD contact polarity edits an independent draft and changes actual Ladder output',()=>{
 const source={version:1,rungs:[structuredClone(rung)]},before=JSON.stringify(source),limits={inputCount:6,outputCount:4};
 const off=L.scan(source,{I1:true,I2:true,I3:false},{},10,limits).outputs.Q1;
 assert.equal(off,false);
 const edit=F.toggleContact(source,'0:0:1',limits);
 assert.equal(edit.ok,true);assert.equal(edit.program.rungs[0].paths[0][1].type,'NO');
 assert.equal(JSON.stringify(source),before,'saved project remains unchanged');
 assert.equal(L.scan(edit.program,{I1:true,I2:true,I3:false},{},10,limits).outputs.Q1,true);
 const restored=F.toggleContact(edit.program,'0:0:1',limits);
 assert.equal(restored.ok,true);
 assert.deepEqual(restored.program,source);
});
test('FBD editing rejects bad indices, invalid addresses and invalid PLC input bounds',()=>{
 const p={version:1,rungs:[structuredClone(rung)]},saved=JSON.stringify(p);
 for(const id of ['0:0:7','0:7:0','4:0:0','-1:0:0','0:0:abc','01:0:0','0:0:0:0']){
  const out=F.toggleContact(p,id,{inputCount:6,outputCount:4});
  assert.equal(out.ok,false,id);
 }
 assert.equal(F.toggleContact(p,'0:0:0',{inputCount:1,outputCount:4}).ok,false);
 assert.equal(F.toggleContact({version:1,rungs:[]},'0:0:0').ok,false);
 assert.equal(JSON.stringify(p),saved,'no rejected edit may mutate the source');
});
test('FBD presents separate keyboard-accessible NO/NC edit buttons',()=>{
 const svg=F.render(rung,{index:1});
 assert.match(svg,/data-fbd-toggle-contact="1:0:1"/);
 assert.match(svg,/NO → NC/);
 assert.match(svg,/NC → NO/);
 assert.match(svg,/aria-label="I2 kontağını normalde açık yap"/);
});
