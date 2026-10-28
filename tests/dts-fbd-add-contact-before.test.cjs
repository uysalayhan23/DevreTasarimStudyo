'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const F=require('../dist/fbd-view.js'),L=require('../dist/ladder-runtime.js');
const lim={inputCount:6,outputCount:4},mk=(ref,type='NO')=>({type,ref});
const pg=paths=>({version:1,rungs:[{id:'R1',paths,coil:{type:'OUT',ref:'Q1'}}]});
test('prepending inserts a contact before the first existing one',()=>{
 const p=pg([[mk('I2')]]),result=F.editStructure(p,'add-contact-before','0:0:0',lim);
 assert.equal(result.ok,true);
 assert.deepEqual(result.program.rungs[0].paths[0].map(x=>x.ref),['I1','I2']);
 assert.equal(p.rungs[0].paths[0].length,1);
 assert.equal(L.scan(result.program,{I1:true,I2:false},{},0,lim).outputs.Q1,false);
 assert.equal(L.scan(result.program,{I1:true,I2:true},{},0,lim).outputs.Q1,true);
});
test('prepending before middle contact preserves later order and NC polarity',()=>{
 const p=pg([[mk('I2','NC'),mk('I3'),mk('I4')]]),
  out=F.editStructure(p,'add-contact-before','0:0:1',lim);
 assert.equal(out.ok,true);
 assert.deepEqual(out.program.rungs[0].paths[0].map(c=>c.ref),['I2','I1','I3','I4']);
 assert.equal(out.program.rungs[0].paths[0][0].type,'NC');
});
test('empty path allows prepending at index zero but stays OPEN until valid input',()=>{
 const p=pg([[]]),out=F.editStructure(p,'add-contact-before','0:0:0',lim);
 assert.equal(out.ok,true);
 assert.equal(L.scan(p,{I1:true},{},0,lim).outputs.Q1,false);
 assert.equal(out.program.rungs[0].paths[0][0].ref,'I1');
});
test('out-of-range, unsupported position or full 12-contact path fail safely',()=>{
 const p=pg([[mk('I1')]]),many=pg([Array.from({length:12},()=>mk('I1'))]);
 for(const pos of ['0:0:1','0:0:999','00:0:0','0:3:0'])
  assert.equal(F.editStructure(p,'add-contact-before',pos,lim).ok,false);
 assert.equal(F.editStructure(many,'add-contact-before','0:0:0',lim).ok,false);
 assert.equal(many.rungs[0].paths[0].length,12);
});
test('no-physical-input PLC uses valid M contact, not a fictional I1',()=>{
 const p={version:1,rungs:[{id:'R',paths:[[{type:'NO',ref:'M2'}]],coil:{type:'OUT',ref:'M3'}}]};
 const out=F.editStructure(p,'add-contact-before','0:0:0',{inputCount:0,outputCount:0});
 assert.equal(out.ok,true);
 assert.equal(out.program.rungs[0].paths[0][0].ref,'M1');
});
test('FBD UI provides an accessible add-before button per contact',()=>{
 const p=pg([[mk('I1'),mk('I2')]]),html=F.render(p.rungs[0],{index:3,limits:lim});
 assert.match(html,/data-fbd-structure="add-contact-before" data-fbd-position="3:0:0"/);
 assert.match(html,/data-fbd-structure="add-contact-before" data-fbd-position="3:0:1"/);
 assert.match(html,/aria-label="I2 kontağının önüne yeni kontak ekle"/);
});
