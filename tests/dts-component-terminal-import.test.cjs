'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const T=require('../dist/component-terminal-draft.js');
const catalog={id:'test-switch',name:'Eğitim anahtarı',w:80,h:90,pins:[
 {id:'13',label:'13',x:0,y:44,side:'left'},
 {id:'14',label:'14',x:80,y:44,side:'right'}
]};
const source=()=>T.fromCatalog(catalog);
test('import exact matching exported draft as independent geometry',()=>{
 const orig=source(),changed=T.move(orig,'13',0,50),text=T.exportDraft(changed);
 const result=T.parseImport(text,catalog);
 assert.deepEqual(result.pins[0],{id:'13',label:'13',side:'left',x:0,y:50});
 assert.equal(catalog.pins[0].y,44);assert.equal(orig.pins[0].y,44);
 result.pins[0].y=60;assert.equal(changed.pins[0].y,50);
});
test('reject cross-component source, body changes, altered identity and side',()=>{
 const valid=source();
 for(const apply of [
  d=>{d.sourceId='another-component'},
  d=>{d.w=81},
  d=>{d.h=91},
  d=>{d.name='Altered'},
  d=>{d.pins[0].id='renamed'},
  d=>{d.pins[0].label='new'},
  d=>{d.pins[0].side='right'},
  d=>{d.pins.pop()}
 ]){
  const next=structuredClone(valid);apply(next);
  assert.throws(()=>T.parseImport(JSON.stringify(next),catalog));
 }
});
test('invalid files, missing pins, duplicate ids and excessive size fail closed',()=>{
 for(const s of ['bad-json','{}','[]','null',JSON.stringify({...source(),version:2}),'x'.repeat(T.maxImportBytes+1)])
  assert.throws(()=>T.parseImport(s,catalog));
 const dup=source();dup.pins[1].id=dup.pins[0].id;
 assert.throws(()=>T.parseImport(JSON.stringify(dup),catalog));
 const outside=source();outside.pins[0].x=-1;
 assert.throws(()=>T.parseImport(JSON.stringify(outside),catalog));
});
test('unknown metadata is not imported into an executable component object',()=>{
 const data=source();data.behavior={alwaysOn:true};data.pins[0].script='<script>';
 const parsed=T.parseImport(JSON.stringify(data),catalog);
 assert.equal(Object.hasOwn(parsed,'behavior'),false);
 assert.equal(Object.hasOwn(parsed.pins[0],'script'),false);
});
test('distinct immutable evidence gates hold catalogue, 3D and native acceptance',()=>{
 const base=T.acceptance(source(),catalog);
 assert.equal(base.file,'PASS');assert.equal(base.identity,'PASS');assert.equal(base.preview,'PASS');
 assert.equal(base.catalog,'HOLD');assert.equal(base.threeD,'HOLD');assert.equal(base.native,'HOLD');
 assert.equal(base.geometry,'UNCHANGED');
 const moved=T.acceptance(T.move(source(),'13',0,49),catalog);
 assert.deepEqual(moved.movedTerminals,['13']);assert.equal(moved.geometry,'REVIEW');
 assert.equal(catalog.pins[0].y,44);
});
