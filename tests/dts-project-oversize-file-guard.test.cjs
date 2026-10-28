'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),Projects=require('../dist/project-store.js');
const LIMIT=20*1024*1024;
const project=()=>({projectId:'p1',name:'Normal',version:7,components:[],wires:[]});
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
function mockFile(size,body=JSON.stringify(project())){let reads=0;return {file:{size,lastModified:1,async text(){reads++;return body}},get reads(){return reads}}}
const handle=file=>({kind:'file',name:'test.odsdevre',getFile:async()=>file});
const store=env=>Projects.create({storage:storage(),indexedDB:null,env});
test('P0-04 oversized picker file is rejected before text allocation',async()=>{
 const f=mockFile(LIMIT+1),s=store({showOpenFilePicker:async()=>[handle(f.file)]});
 await assert.rejects(s.openFile(),/20 MB/);assert.equal(f.reads,0);
});
test('P0-04 oversized readEntry is rejected before text allocation',async()=>{
 const f=mockFile(LIMIT+1),s=store({});
 await assert.rejects(s.readEntry({handle:handle(f.file)}),/20 MB/);assert.equal(f.reads,0);
});
test('P0-04 oversized directory scan skips file without reading it',async()=>{
 const f=mockFile(LIMIT+1),dir={name:'Projeler',async *entries(){yield ['test.odsdevre',handle(f.file)]}};
 const s=store({showDirectoryPicker:async()=>dir});await s.chooseFolder();const result=await s.scan();
 assert.equal(result.entries.length,0);assert.equal(result.warnings.length,1);
 assert.match(result.warnings[0],/20 MB/);assert.equal(f.reads,0);
});
test('P0-04 oversized fallback folder scan skips file without reading it',async()=>{
 const f=mockFile(LIMIT+1),s=store({});s.useFolderFiles([{name:'test.odsdevre',...f.file}]);
 const result=await s.scan();assert.equal(result.entries.length,0);assert.equal(result.warnings.length,1);
 assert.match(result.warnings[0],/20 MB/);assert.equal(f.reads,0);
});
test('P0-04 valid small files still open and scan',async()=>{
 const f=mockFile(100),s=store({showOpenFilePicker:async()=>[handle(f.file)]});
 assert.equal((await s.openFile()).project.name,'Normal');assert.equal(f.reads,1);
 const entry=mockFile(100);assert.equal((await store({}).readEntry({handle:handle(entry.file)})).name,'Normal');assert.equal(entry.reads,1);
 const fallback=mockFile(100),scanStore=store({});
 scanStore.useFolderFiles([{name:'test.odsdevre',...fallback.file}]);
 assert.equal((await scanStore.scan()).entries.length,1);assert.equal(fallback.reads,1);
});
test('P0-04 exactly-at-limit metadata remains permitted',async()=>{
 const f=mockFile(LIMIT),s=store({showOpenFilePicker:async()=>[handle(f.file)]});
 assert.equal((await s.openFile()).project.name,'Normal');assert.equal(f.reads,1);
});
test('P0-04 malformed small JSON is still rejected',async()=>{
 const f=mockFile(1,'{'),s=store({showOpenFilePicker:async()=>[handle(f.file)]});
 await assert.rejects(s.openFile(),SyntaxError);assert.equal(f.reads,1);
});
