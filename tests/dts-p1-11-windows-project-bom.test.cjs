'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const Store=require('../dist/project-store.js');
const project=()=>({version:7,projectId:'P-WIN-1',name:'Pano eğitimi',workspaceMode:'panel',components:[],wires:[],panel:{width:600,height:800,depth:220,items:[],wires:[],rails:[],ducts:[]}});
const json=()=>JSON.stringify(project());
const bom=s=>'\uFEFF'+s;
test('P1-11 negative: Windows UTF-8 BOM .odsdevre is reopened with unmodified project fields',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dts-p-bom-'));
 try{const file=path.join(dir,'pano.odsdevre');fs.writeFileSync(file,bom(json()),'utf8');
  const bytes=fs.readFileSync(file);
  assert.equal(bytes.subarray(0,3).toString('hex'),'efbbbf');
  const a=Store.parse(bytes.toString('utf8')),b=Store.parse(json());
  assert.deepEqual(a,b);assert.equal(a.name,'Pano eğitimi');
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
test('P1-11 positive: normal export without BOM remains identical',()=>assert.deepEqual(Store.parse(json()),Store.parse(json())));
test('P1-11 positive: BOM and Windows CRLF reopen without changing panel geometry',()=>{
 const data=JSON.stringify(project(),null,2).replace(/\n/g,'\r\n');
 assert.deepEqual(Store.parse(bom(data)),Store.parse(data));
});
test('P1-11 negative: malformed JSON with a BOM still fails closed',()=>{
 assert.throws(()=>Store.parse(bom('{broken')));
});
test('P1-11 negative: two BOM markers are not silently accepted',()=>{
 assert.throws(()=>Store.parse(bom(bom(json()))));
});
test('P1-11 negative: embedded BOM after leading whitespace is not stripped',()=>{
 assert.throws(()=>Store.parse('  '+bom(json())));
});
test('P1-11 negative: foreign unsupported project version is not accepted even with BOM',()=>{
 const p=project();p.version=999;
 assert.throws(()=>Store.parse(bom(JSON.stringify(p))),/daha yeni/);
});
test('P1-11 negative: original 20 MB byte limit also applies when file has BOM',()=>{
 const input=bom(json()+' '.repeat(20*1024*1024));
 assert.throws(()=>Store.parse(input),/20 MB/);
});
test('P1-11 integration: folder scan retains healthy BOM project and isolates a corrupted file',async()=>{
 const files=[{name:'pano.odsdevre',size:Buffer.byteLength(bom(json())),lastModified:1,text:async()=>bom(json())},
 {name:'broken.odsdevre',size:8,lastModified:2,text:async()=>bom('{broken')}];
 const storage={getItem:()=>null,setItem(){},removeItem(){}};
 const store=Store.create({storage,indexedDB:null,env:{}});
 store.useFolderFiles(files);const scanned=await store.scan();
 assert.equal(scanned.entries.length,1);assert.equal(scanned.entries[0].project.projectId,'P-WIN-1');
 assert.equal(scanned.warnings.length,1);assert.match(scanned.warnings[0],/broken.odsdevre/);
});
