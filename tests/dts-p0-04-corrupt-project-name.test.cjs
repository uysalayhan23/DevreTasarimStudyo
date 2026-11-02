'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');

function file(name,project){
  const json=JSON.stringify(project);
  return {name:name+'.odsdevre',size:Buffer.byteLength(json),lastModified:42,text:async()=>json};
}
function base(id,name){return {version:7,projectId:id,name,components:[],wires:[]};}
async function folder(name){
  const storage={getItem(){return null},setItem(){},removeItem(){}};
  const store=Store.create({storage,indexedDB:null,env:{}});
  const good=file('good',base('good','Sağlam'));
  const broken=file('bad',base('bad',name));
  store.useFolderFiles([good,broken]);
  return store.scan();
}
for(const [kind,value] of [['number',42],['array',[]],['object',{value:1}]]){
 test('P0-04 negative: '+kind+' project name cannot interrupt valid folder scan',async()=>{
   const scan=await folder(value);
   assert.deepEqual(scan.entries.map(e=>e.project.projectId),['good']);
   assert.equal(scan.warnings.length,1);
   assert.match(scan.warnings[0],/bad\.odsdevre/);
 });
 test('P0-04 negative: invalid '+kind+' name rejects direct project parse',()=>{
   assert.throws(()=>Store.parse(JSON.stringify(base('bad',value))),/Proje adı metin olmalıdır/);
 });
}
test('P0-04 positive: missing project name retains legacy filename fallback',async()=>{
 const scan=await folder(undefined);
 assert.equal(scan.entries.length,2);assert.equal(scan.warnings.length,0);
});
test('P0-04 positive: valid project names both remain visible',async()=>{
 const scan=await folder('Normal');
 assert.equal(scan.entries.length,2);assert.equal(scan.warnings.length,0);
});
test('P0-04 positive: null project name remains legacy-compatible',async()=>{
 const scan=await folder(null);
 assert.equal(scan.entries.length,2);assert.equal(scan.warnings.length,0);
});
