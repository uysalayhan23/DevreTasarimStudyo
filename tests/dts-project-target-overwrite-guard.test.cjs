'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),Projects=require('../dist/project-store.js');
const LIMIT=20*1024*1024;
const project=()=>({projectId:'p1',name:'Kendi devrem',version:7,components:[],wires:[]});
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
function fileHandle(initial,{size=initial.length,failRead=false}={}){
 let data=initial,writes=0,reads=0,modified=1;
 const handle={kind:'file',name:'test.odsdevre',
  getFile:async()=>({size,lastModified:modified,text:async()=>{reads++;if(failRead)throw Error('disk read failure');return data}}),
  createWritable:async()=>({write:async value=>{data=value;writes++;modified++},close:async()=>{},abort:async()=>{}}),
  isSameEntry:async other=>other===handle,
  get reads(){return reads},get writes(){return writes},get data(){return data}};
 return handle;
}
const store=picker=>Projects.create({storage:storage(),indexedDB:null,env:{showSaveFilePicker:picker}});
test('P0-04 Save As rejects malformed existing target without overwriting',async()=>{
 const h=fileHandle('{');await assert.rejects(store(async()=>h).save(project(),{saveAs:true}),/geçersiz veya okunamadı/);
 assert.equal(h.writes,0);assert.equal(h.data,'{');
});
test('P0-04 Save As rejects oversized existing target before reading',async()=>{
 const h=fileHandle('{}',{size:LIMIT+1});
 await assert.rejects(store(async()=>h).save(project(),{saveAs:true}),/20 MB/);
 assert.equal(h.reads,0);assert.equal(h.writes,0);
});
test('P0-04 Save As accepts genuinely empty newly created file',async()=>{
 const h=fileHandle('');const result=await store(async()=>h).save(project(),{saveAs:true});
 assert.equal(result.saved,true);assert.equal(h.writes,1);
});
test('P0-04 Save As still accepts valid editable existing target',async()=>{
 const h=fileHandle(JSON.stringify(project()));const result=await store(async()=>h).save(project(),{saveAs:true});
 assert.equal(result.saved,true);assert.equal(h.writes,1);
});
test('P0-04 Save As refuses existing non-project JSON',async()=>{
 const h=fileHandle('{"unrelated":true}');
 await assert.rejects(store(async()=>h).save(project(),{saveAs:true}),/geçersiz veya okunamadı/);
 assert.equal(h.writes,0);
});
test('P0-04 normal Save refuses malformed source without overwriting',async()=>{
 const p=project(),h=fileHandle('{'),s=store(async()=>h);
 await s.remember(p,h,1);
 await assert.rejects(s.save(p),/geçersiz veya okunamadı/);
 assert.equal(h.writes,0);
});
test('P0-04 Save As refuses unreadable target without overwriting',async()=>{
 const h=fileHandle('{}',{failRead:true});
 await assert.rejects(store(async()=>h).save(project(),{saveAs:true}),/disk read failure/);
 assert.equal(h.writes,0);
});
test('P0-04 Save As retains protected target guard',async()=>{
 const h=fileHandle(JSON.stringify({...project(),defaultTemplate:{id:'example',readOnly:true}}));
 await assert.rejects(store(async()=>h).save(project(),{saveAs:true}),/korunan bir hazır örnek/);
 assert.equal(h.writes,0);
});
