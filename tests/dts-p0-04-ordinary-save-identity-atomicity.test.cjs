'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=id=>({name:'Test',version:7,components:[],wires:[],junctions:[],...(id===undefined?{}:{projectId:id})});
function fixture(mode='ok',failCache=false){
  const db=new Map();let content='',writes=0,downloads=0,stamp=1;
  const storage={getItem:k=>db.get(k)??null,setItem(k,v){if(failCache&&k.startsWith('dts-project:'))throw Error('quota');db.set(k,String(v))},removeItem:k=>db.delete(k)};
  const handle={name:'new.odsdevre',
    async getFile(){const text=mode==='foreign'?JSON.stringify(project('other')):content;return {size:text.length,lastModified:stamp,text:async()=>text}},
    async createWritable(){return {async write(v){if(mode==='writeFail')throw Error('disk fail');content=String(v);writes++},async close(){stamp++},async abort(){}}}
  };
  const env={async showSaveFilePicker(){if(mode==='cancel')throw Object.assign(Error('cancelled'),{name:'AbortError'});if(mode==='pickerFail')throw Error('picker fail');return handle}};
  if(mode==='download'){delete env.showSaveFilePicker;env.Blob=class{constructor(parts){this.parts=parts}};env.URL={createObjectURL:()=> 'blob:local',revokeObjectURL:()=>{}};env.document={createElement:()=>({click(){downloads++}})};env.setTimeout=()=>{}}
  return {store:Projects.create({storage,indexedDB:null,env}),state:()=>({content,writes,downloads})};
}
for(const mode of ['cancel','pickerFail','foreign','writeFail']){
  test('P0-04 failed ordinary save '+mode+' leaves original ID untouched',async()=>{
    const p=project(),f=fixture(mode);
    if(mode==='cancel')assert.equal((await f.store.save(p)).cancelled,true);
    else await assert.rejects(f.store.save(p),mode==='pickerFail'?/picker fail/:mode==='foreign'?/başka bir projeye ait/:/disk fail/);
    assert.equal(p.projectId,undefined);assert.equal(p.updatedAt,undefined);assert.equal(f.state().writes,0);
  });
}
test('P0-04 successful disk save publishes ID and can reopen draft',async()=>{
  const p=project(),f=fixture(),r=await f.store.save(p);
  assert.equal(r.saved,true);assert.ok(p.projectId);assert.equal(p.projectId,r.project.projectId);
  assert.equal(JSON.parse(f.state().content).projectId,p.projectId);
  assert.equal((await f.store.get(p.projectId)).projectId,p.projectId);
});
test('P0-04 Save As does not change original ID',async()=>{
  const p=project('original'),r=await fixture().store.save(p,{saveAs:true});
  assert.equal(r.saved,true);assert.equal(p.projectId,'original');assert.notEqual(r.project.projectId,'original');
});
test('P0-04 cancelled ordinary save preserves existing ID',async()=>{
  const p=project('original'),r=await fixture('cancel').store.save(p);
  assert.equal(r.cancelled,true);assert.equal(p.projectId,'original');
});
test('P0-04 numeric legacy zero ID stays zero',async()=>{
  const p=project(0),r=await fixture().store.save(p);
  assert.equal(r.saved,true);assert.equal(p.projectId,0);assert.equal(r.project.projectId,0);
});
test('P0-04 protected example remains read-only',async()=>{
  const p={...project(),defaultTemplate:{id:'starter',readOnly:true}},f=fixture();
  await assert.rejects(f.store.save(p),/Hazır örnek korunuyor/);assert.equal(p.projectId,undefined);assert.equal(f.state().writes,0);
});
test('P0-04 offline download plus persisted draft publishes ID',async()=>{
  const p=project(),f=fixture('download'),r=await f.store.save(p);
  assert.equal(r.download,true);assert.equal(f.state().downloads,1);assert.ok(p.projectId);assert.equal(p.projectId,r.project.projectId);
});
test('P0-04 offline download with failed draft cache leaves ID unchanged',async()=>{
  const p=project(),r=await fixture('download',true).store.save(p);
  assert.equal(r.download,true);assert.equal(r.cacheWarning,true);assert.equal(p.projectId,undefined);
});
test('P0-04 successful disk save publishes ID despite draft cache failure',async()=>{
  const p=project(),r=await fixture('ok',true).store.save(p);
  assert.equal(r.saved,true);assert.equal(r.cacheWarning,true);assert.equal(p.projectId,r.project.projectId);
});
