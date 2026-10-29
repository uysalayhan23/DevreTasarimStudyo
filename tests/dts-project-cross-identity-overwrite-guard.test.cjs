'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

const project=(projectId,name)=>({projectId,name,version:7,workspaceMode:'control',components:[],wires:[]});
function fileHandle(initial){
  let data=initial,writes=0,modified=1;
  const handle={name:'existing.odsdevre',kind:'file',
    getFile:async()=>({size:Buffer.byteLength(data),lastModified:modified,text:async()=>data}),
    createWritable:async()=>({write:async text=>{data=String(text);writes++;modified++},close:async()=>{},abort:async()=>{}}),
    isSameEntry:async other=>other===handle,
    get data(){return data},get writes(){return writes}};
  return handle;
}
const store=handle=>Projects.create({storage:{getItem:()=>null,setItem(){}},indexedDB:null,env:{showSaveFilePicker:async()=>handle}});

test('P0-04 Save As must never overwrite a different valid project identity',async()=>{
  const source=project('a','A'),target=project('b','B'),saved=JSON.stringify(target),handle=fileHandle(saved);
  await assert.rejects(store(handle).save(source,{saveAs:true}),/başka bir projeye ait/);
  assert.equal(handle.writes,0);assert.equal(handle.data,saved);
});
test('P0-04 normal Save must reject a valid target whose identity changed since opening',async()=>{
  const source=project('a','A'),target=project('b','B'),saved=JSON.stringify(target),handle=fileHandle(saved),instance=store(handle);
  await instance.remember(source,handle,1);
  await assert.rejects(instance.save(source),/başka bir projeye ait/);
  assert.equal(handle.writes,0);assert.equal(handle.data,saved);
});
test('P0-04 Save As accepts a valid different file that belongs to the SAME source identity',async()=>{
  const source=project('a','A'),handle=fileHandle(JSON.stringify(project('a','Old A')));
  const result=await store(handle).save(source,{saveAs:true});
  assert.equal(result.saved,true);assert.equal(handle.writes,1);
  assert.notEqual(JSON.parse(handle.data).projectId,'a');
});
test('P0-04 Save As accepts a genuinely empty target',async()=>{
  const handle=fileHandle('');const result=await store(handle).save(project('a','A'),{saveAs:true});
  assert.equal(result.saved,true);assert.equal(handle.writes,1);
});
test('P0-04 ordinary Save keeps legacy files without projectId editable',async()=>{
  const source=project('a','A'),target={version:7,workspaceMode:'control',name:'Legacy',components:[],wires:[]};
  const handle=fileHandle(JSON.stringify(target)),instance=store(handle);
  await instance.remember(source,handle,1);
  const result=await instance.save(source);
  assert.equal(result.saved,true);assert.equal(JSON.parse(handle.data).projectId,'a');
});
