'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const D=require('../dist/component-terminal-draft.js');
const device={id:'push-no',name:'Başlat',w:72,h:92,pins:[
{id:'13',label:'13',x:0,y:46,side:'left'},{id:'14',label:'14',x:72,y:46,side:'right'}]};
test('only the newest pending terminal import may update a draft',()=>{
 const draft=D.fromCatalog(device);
 assert.equal(D.importContextMatches(2,2,device,device,draft,draft,true),true);
 assert.equal(D.importContextMatches(1,2,device,device,draft,draft,true),false);
});
test('import cannot overwrite user edit, source change, dialog close or reset',()=>{
 const draft=D.fromCatalog(device),edited=D.move(draft,'13',1,45);
 assert.equal(D.importContextMatches(2,2,device,device,draft,edited,true),false);
 assert.equal(D.importContextMatches(2,2,device,{...device},draft,draft,true),false);
 assert.equal(D.importContextMatches(2,2,device,device,draft,draft,false),false);
 assert.equal(D.importContextMatches(2,2,device,device,draft,D.fromCatalog(device),true),false);
});
test('uninitialized or mismatched tokens cannot pass',()=>{
 const draft=D.fromCatalog(device);
 for(const token of [-1,0,1.5,null,Number.MAX_SAFE_INTEGER+1])
  assert.equal(D.importContextMatches(token,token,device,device,draft,draft,true),false);
 assert.equal(D.importContextMatches(3,4,device,device,draft,draft,true),false);
});
test('valid separate terminal draft keeps catalogue unchanged',()=>{
 const draft=D.fromCatalog(device);
 const imported=D.parseImport(D.exportDraft(draft),device);
 assert.deepEqual(imported,draft);
 assert.equal(D.acceptance(imported,device).catalog,'HOLD');
 assert.equal(device.pins[0].x,0);
});
