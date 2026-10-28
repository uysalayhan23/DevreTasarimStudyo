'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),Projects=require('../dist/project-store.js');
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const project=()=>({name:'Kendi devrem',projectId:'my-project',components:[],wires:[]});
function fileHandle(initial,name='devrem.odsdevre'){
 let data=JSON.stringify(initial),writes=0,modified=1;
 const handle={kind:'file',name,
  getFile:async()=>({text:async()=>data,lastModified:modified,size:data.length}),
  createWritable:async()=>({write:async value=>{data=value;writes++;modified++},close:async()=>{},abort:async()=>{}}),
  isSameEntry:async other=>other===handle,
  get writes(){return writes},get project(){return JSON.parse(data)}};
 return handle;
}
const storeWith=picker=>Projects.create({storage:storage(),indexedDB:null,env:{showSaveFilePicker:picker}});
test('Save As refuses its own editable source file without writing',async()=>{
 const p=project(),source=fileHandle(p),store=storeWith(async()=>source);
 await store.remember(p,source,1);
 await assert.rejects(store.save(p,{saveAs:true}),/Farklı Kaydet.*özgün/);
 assert.equal(source.writes,0);assert.equal(source.project.projectId,p.projectId);
});
test('Save As writes a different file with a new project ID',async()=>{
 const p=project(),source=fileHandle(p),dest=fileHandle(project(),'kopya.odsdevre'),store=storeWith(async()=>dest);
 await store.remember(p,source,1);
 const result=await store.save(p,{saveAs:true});
 assert.equal(result.saved,true);assert.equal(dest.writes,1);assert.equal(source.writes,0);
 assert.notEqual(dest.project.projectId,p.projectId);assert.equal(source.project.projectId,p.projectId);
});
test('Normal Save still writes its own editable source',async()=>{
 const p=project(),source=fileHandle(p),store=storeWith(async()=>source);
 await store.remember(p,source,1);p.name='Yeni ad';
 const result=await store.save(p);
 assert.equal(result.saved,true);assert.equal(source.writes,1);assert.equal(source.project.name,'Yeni ad');
});
test('Protected source cannot be overwritten and remains protected',async()=>{
 const p={...project(),defaultTemplate:{id:'starter:sample',readOnly:true}},source=fileHandle(p),store=storeWith(async()=>source);
 await store.remember(p,source,1);
 await assert.rejects(store.save(p,{saveAs:true}),/korunan bir hazır örnek|Özgün örneğin/);
 assert.equal(source.writes,0);assert.equal(Projects.isProtected(p),true);
});
test('Protected target file cannot be replaced by Save As',async()=>{
 const p=project(),target=fileHandle({...project(),defaultTemplate:{id:'starter:other',readOnly:true}}),store=storeWith(async()=>target);
 await assert.rejects(store.save(p,{saveAs:true}),/korunan bir hazır örnek/);
 assert.equal(target.writes,0);
});
test('Cancelled Save As leaves source unchanged',async()=>{
 const p=project(),source=fileHandle(p),store=storeWith(async()=>{throw Object.assign(Error('cancel'),{name:'AbortError'})});
 await store.remember(p,source,1);
 const result=await store.save(p,{saveAs:true});
 assert.equal(result.cancelled,true);assert.equal(source.writes,0);
});
test('Same-entry alias cannot bypass Save As source protection',async()=>{
 const p=project(),source=fileHandle(p),alias=fileHandle(p,'alias.odsdevre'),store=storeWith(async()=>alias);
 alias.isSameEntry=async other=>other===source;
 await store.remember(p,source,1);
 await assert.rejects(store.save(p,{saveAs:true}),/Farklı Kaydet.*özgün/);
 assert.equal(source.writes,0);assert.equal(alias.writes,0);
});
