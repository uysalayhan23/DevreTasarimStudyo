'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const base=()=>({version:7,name:'Pano.odsdevre',projectId:'id-pano',workspaceMode:'control',components:[],wires:[]});
const storage=()=>{const cache=new Map();return {getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)}};
for(const [name,expected] of [
 ['Pano.odsdevre','Pano.odsdevre'],
 ['Pano.ODSDEVRE','Pano.odsdevre'],
 ['Pano.odsdevre ','Pano.odsdevre'],
 ['Çalışma Planı.odsdevre','Çalışma Planı.odsdevre'],
 ['.odsdevre','Yeni Proje.odsdevre'],
 ['CON.odsdevre','_CON.odsdevre'],
 ['aux.ODSDEVRE','_aux.odsdevre'],
 ['Proje.odsdevre.odsdevre','Proje.odsdevre'] // Avoid repeated suffixes from legacy project titles.
])test('P1-12: filename '+name+' has exactly one intended export suffix',()=>{
 assert.equal(Store.filename(name),expected);
});
test('P1-12: plain project title keeps previous file name',()=>assert.equal(Store.filename('Pano-01'),'Pano-01.odsdevre'));
test('P1-12: other extensions in project names are not removed',()=>assert.equal(Store.filename('Pano.pdf'),'Pano.pdf.odsdevre'));
test('P1-12: direct download button uses corrected file name',()=>{
 let filename;
 const env={Blob:class {constructor(parts){this.parts=parts}},URL:{createObjectURL:()=> 'blob:download',revokeObjectURL(){}},document:{createElement:()=>({click(){filename=this.download}})},setTimeout() {}};
 const manager=Store.create({storage:storage(),indexedDB:null,env});
 const result=manager.download(base());
 assert.equal(result.name,'Pano.odsdevre');assert.equal(filename,'Pano.odsdevre');
});
test('P1-12: Save As dialog suggests corrected file name before writing',async()=>{
 let suggestion=null;let written=null;
 const handle={name:'Pano.odsdevre',getFile:async()=>({size:0,lastModified:1}),createWritable:async()=>({write:async text=>{written=text},close:async()=>{}})};
 const env={showSaveFilePicker:async options=>{suggestion=options.suggestedName;return handle}};
 const manager=Store.create({storage:storage(),indexedDB:null,env});
 const result=await manager.save(base(),{saveAs:true});
 assert.equal(suggestion,'Pano.odsdevre');assert.equal(result.saved,true);assert.ok(written.includes('projectId'));
});
