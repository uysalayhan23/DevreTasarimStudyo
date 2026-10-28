'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:2,outputCount:1};
const program={version:1,rungs:[{id:'R1',
 paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}]],
 coil:{type:'OUT',ref:'Q1'}}]};
test('FBD reference choices respect actual input/output PLC pins',()=>{
 const refs=F.contactRefs(limits);
 assert.deepEqual(refs.slice(0,3),['I1','I2','Q1']);
 assert.equal(refs.includes('I3'),false);assert.equal(refs.includes('Q2'),false);
 assert.equal(refs.includes('M32'),true);assert.equal(refs.includes('T16'),true);
 assert.equal(refs.includes('C16'),true);assert.equal(refs.includes('I0'),false);
});
test('FBD changes NO/NC reference without mutating saved source',()=>{
 const changed=F.editContactRef(program,'0:0:0','M2',limits);
 assert.equal(changed.ok,true);
 assert.equal(changed.program.rungs[0].paths[0][0].ref,'M2');
 assert.equal(changed.program.rungs[0].paths[0][1].type,'NC');
 assert.equal(program.rungs[0].paths[0][0].ref,'I1');
 assert.equal(L.validate(changed.program,limits).ok,true);
});
test('FBD ref edit changes native output on the same Ladder evaluator',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const after=F.editContactRef(p,'0:0:0','I2',limits);
 assert.equal(after.ok,true);
 assert.equal(L.scan(p,{I1:true,I2:false},{},0,limits).outputs.Q1,true);
 assert.equal(L.scan(after.program,{I1:true,I2:false},{},0,limits).outputs.Q1,false);
 assert.equal(L.scan(after.program,{I1:false,I2:true},{},0,limits).outputs.Q1,true);
});
test('FBD disallows invalid hardware references and bad syntax without mutation',()=>{
 for(const ref of ['I3','Q2','I0','T17','M33','=',2,null]){
  assert.equal(F.editContactRef(program,'0:0:0',ref,limits).ok,false);
 }
 for(const position of ['0:0:3','0:1:0','-1:0:0','00:0:0','0:0:foo','999999999999999999:0:0'])
  assert.equal(F.editContactRef(program,position,'M1',limits).ok,false);
 assert.equal(program.rungs[0].paths[0][0].ref,'I1');
});
test('FBD render exposes selected reference and accessible selector for every contact',()=>{
 const html=F.render(program.rungs[0],{index:2,limits});
 assert.match(html,/data-fbd-contact-ref="2:0:0"/);
 assert.match(html,/data-fbd-contact-ref="2:0:1"/);
 assert.match(html,/aria-label="FBD 2\. kontak adresi"/);
 assert.match(html,/<option value="I1" selected>I1<\/option>/);
 assert.doesNotMatch(html,/<option value="I3"/);
});
test('FBD zero physical input uses M1 and permits NO/NC memory contacts',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'M2'}}]};
 const r=F.editContactRef(p,'0:0:0','M32',{inputCount:0,outputCount:0});
 assert.equal(r.ok,true);assert.equal(F.contactRefs({inputCount:0,outputCount:0}).includes('I1'),false);
 assert.equal(L.validate(r.program,{inputCount:0,outputCount:0}).ok,true);
});
