'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

const sample=(readOnly=false,id)=>({
  name:'Example',version:7,components:[],wires:[],junctions:[],
  ...(id===undefined?{}:{projectId:id}),
  ...(readOnly?{defaultTemplate:{id:'starter',readOnly:true}}:{})
});
function fixture(cancel=false){
  let written=null;
  const data=new Map();
  const handle={
    name:'copy.odsdevre',
    getFile:async()=>({size:written?written.length:0,lastModified:1,text:async()=>written}),
    createWritable:async()=>({write:async value=>{written=value},close:async()=>{},abort:async()=>{}})
  };
  const env={showSaveFilePicker:async()=>{
    if(cancel)throw Object.assign(Error('cancelled'),{name:'AbortError'});
    return handle;
  }};
  const storage={
    getItem:key=>data.get(key)||null,
    setItem:(key,value)=>data.set(key,String(value)),
    removeItem:key=>data.delete(key)
  };
  return {store:Projects.create({storage,indexedDB:null,env}),written:()=>written};
}
test('P0-04: cancelled Save As does not assign an ID to an idless editable source',async()=>{
  const project=sample(),{store}=fixture(true);
  assert.equal((await store.save(project,{saveAs:true})).cancelled,true);
  assert.equal(project.projectId,undefined);
});
test('P0-04: cancelled Save As leaves an idless protected example untouched',async()=>{
  const project=sample(true),{store}=fixture(true);
  assert.equal((await store.save(project,{saveAs:true})).cancelled,true);
  assert.equal(project.projectId,undefined);
  assert.equal(Projects.isProtected(project),true);
});
test('P0-04: successful Save As creates a new editable copy without changing an idless source',async()=>{
  const project=sample(),f=fixture();
  const result=await f.store.save(project,{saveAs:true});
  assert.equal(result.saved,true);
  assert.ok(result.project.projectId);
  assert.equal(project.projectId,undefined);
  assert.equal(JSON.parse(f.written()).projectId,result.project.projectId);
});
test('P0-04: protected example Save As preserves the source lock and produces a copy',async()=>{
  const project=sample(true),f=fixture();
  const result=await f.store.save(project,{saveAs:true});
  assert.equal(result.saved,true);
  assert.equal(project.projectId,undefined);
  assert.equal(Projects.isProtected(project),true);
  assert.equal(result.project.defaultTemplate,undefined);
  assert.equal(result.project.sourceExample,'starter');
});
test('P0-04: cancelled Save As preserves an existing project ID',async()=>{
  const project=sample(false,'original'),{store}=fixture(true);
  assert.equal((await store.save(project,{saveAs:true})).cancelled,true);
  assert.equal(project.projectId,'original');
});
test('P0-04: successful Save As never replaces an existing project ID',async()=>{
  const project=sample(false,'original'),{store}=fixture();
  const result=await store.save(project,{saveAs:true});
  assert.equal(result.saved,true);
  assert.equal(project.projectId,'original');
  assert.notEqual(result.project.projectId,'original');
});
test('P0-03: ordinary Save still refuses to overwrite a protected example',async()=>{
  const project=sample(true),{store}=fixture();
  await assert.rejects(()=>store.save(project),/Hazır örnek korunuyor/);
  assert.equal(project.projectId,undefined);
});
test('P0-04: ordinary Save still assigns the live project ID for new projects',async()=>{
  const project=sample(),{store}=fixture();
  const result=await store.save(project);
  assert.equal(result.saved,true);
  assert.ok(project.projectId);
  assert.equal(project.projectId,result.project.projectId);
});
