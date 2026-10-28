'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const base={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
test('FBD series edits same native LAD AND scan without changing source',()=>{
 const saved=structuredClone(base),x=F.editStructure(base,'add-contact','0:0:0',limits);
 assert.equal(x.ok,true);assert.deepEqual(base,saved);x.program.rungs[0].paths[0][1].ref='I2';
 assert.equal(L.scan(x.program,{I1:true,I2:false},{},0,limits).outputs.Q1,false);
 assert.equal(L.scan(x.program,{I1:true,I2:true},{},0,limits).outputs.Q1,true);
});
test('FBD parallel branch is the same LAD OR condition',()=>{
 const x=F.editStructure(base,'add-path','0:0',limits);
 assert.equal(x.ok,true);x.program.rungs[0].paths[1][0].ref='I3';
 assert.equal(L.scan(x.program,{I1:false,I3:true},{},0,limits).outputs.Q1,true);
 assert.equal(L.scan(x.program,{I1:false,I3:false},{},0,limits).outputs.Q1,false);
});
test('removing intermediate contact and branch preserves coil identity',()=>{
 const s=F.editStructure(base,'add-contact','0:0:0',limits);
 const p=F.editStructure(s.program,'add-path','0:0',limits);
 const rm=F.editStructure(p.program,'remove-contact','0:0:1',limits);
 assert.equal(rm.ok,true);assert.equal(rm.program.rungs[0].paths[0].length,1);
 const rp=F.editStructure(rm.program,'remove-path','0:1',limits);
 assert.equal(rp.ok,true);assert.equal(rp.program.rungs[0].paths.length,1);
 assert.equal(rp.program.rungs[0].coil.ref,'Q1');
});
test('bad indices, last path removal and unsupported commands fail closed',()=>{
 for(const [op,pos] of [['remove-contact','0:0:3'],['remove-path','0:0'],['add-path','0:6'],['add-contact','0:0:6'],['add-path','00:0'],['other','0:0']])
  assert.equal(F.editStructure(base,op,pos,limits).ok,false,op+pos);
});
test('12 series and 8 parallel limits are enforced',()=>{
 const many=structuredClone(base);many.rungs[0].paths[0]=Array.from({length:12},()=>({type:'NO',ref:'I1'}));
 assert.equal(F.editStructure(many,'add-contact','0:0:0',limits).ok,false);
 const branches=structuredClone(base);branches.rungs[0].paths=Array.from({length:8},()=>[{type:'NO',ref:'I1'}]);
 assert.equal(F.editStructure(branches,'add-path','0:0',limits).ok,false);
});
test('invalid native I/O and CPU without physical inputs do not invent I1',()=>{
 assert.equal(F.editStructure(base,'add-path','0:0',{inputCount:0,outputCount:0}).ok,false);
 const p={version:1,rungs:[{id:'M',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'M2'}}]};
 assert.equal(F.editStructure(p,'add-path','0:0',{inputCount:0,outputCount:0}).program.rungs[0].paths[1][0].ref,'M1');
});
test('FBD displays keyboard buttons for structural AND/OR edits',()=>{
 const x=F.editStructure(base,'add-path','0:0',limits);
 const html=F.render(x.program.rungs[0],{index:0,limits});
 for(const op of ['add-contact','remove-contact','add-path','remove-path'])assert.match(html,new RegExp('data-fbd-structure="'+op+'"'));
});

test('last contact may be deleted without powering a coil, then re-added',()=>{
 const deleted=F.editStructure(base,'remove-contact','0:0:0',limits);
 assert.equal(deleted.ok,true);assert.deepEqual(deleted.program.rungs[0].paths,[[]]);
 assert.equal(L.scan(deleted.program,{I1:true},{},0,limits).outputs.Q1,false);
 const restored=F.editStructure(deleted.program,'add-contact','0:0:0',limits);
 assert.equal(restored.ok,true);assert.equal(restored.program.rungs[0].paths[0].length,1);
});
