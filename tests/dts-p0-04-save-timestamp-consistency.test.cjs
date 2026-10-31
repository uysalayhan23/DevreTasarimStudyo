'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function project(){return {name:'Kayit testi',components:[],wires:[]};}
function fixture({initial=null,cancel=false,writeFails=false,metadataFails=false,cacheFails=false}={}){
  const cache=new Map();
  const storage={
    getItem:k=>cache.get(k)||null,
    setItem:(k,v)=>{if(cacheFails)throw Error('cache failed');cache.set(k,v)},
    removeItem:k=>cache.delete(k)
  };
  let disk=initial?JSON.stringify(initial):'',lastModified=100,closed=false;
  const handle={
    name:'test.odsdevre',
    async getFile(){
      if(metadataFails&&closed)throw Error('metadata failed');
      return {size:disk.length,lastModified,async text(){return disk}};
    },
    async createWritable(){
      return {
        async write(text){if(writeFails)throw Error('write failed');disk=text},
        async close(){closed=true;lastModified++},
        async abort(){}
      };
    }
  };
  const env={
    async showSaveFilePicker(){
      if(cancel){const error=Error('cancelled');error.name='AbortError';throw error;}
      return handle;
    }
  };
  return {
    store:Projects.create({storage,indexedDB:null,env}),handle,cache,
    disk:()=>JSON.parse(disk||'null'),
    touch:()=>{lastModified++}
  };
}

test('new project: disk, draft cache, memory and return have the same timestamp',async()=>{
  const p=project(),f=fixture(),result=await f.store.save(p),disk=f.disk();
  assert.equal(result.saved,true);
  assert.ok(p.projectId);
  assert.equal(p.updatedAt,disk.updatedAt);
  assert.equal(result.project.updatedAt,disk.updatedAt);
  assert.equal(JSON.parse(f.cache.get('dts-project:'+p.projectId)).updatedAt,disk.updatedAt);
});
test('existing project: successful save publishes its new timestamp',async()=>{
  const p={...project(),projectId:'old-1',updatedAt:'2001-01-01T00:00:00.000Z'};
  const f=fixture({initial:p});
  await f.store.remember(p,f.handle,100);
  const result=await f.store.save(p);
  assert.equal(result.saved,true);
  assert.equal(p.updatedAt,f.disk().updatedAt);
  assert.notEqual(p.updatedAt,'2001-01-01T00:00:00.000Z');
});
test('Save As leaves the protected original untouched',async()=>{
  const p={...project(),projectId:'template',updatedAt:'2020-01-01',defaultTemplate:{id:'demo',readOnly:true}};
  const before=JSON.parse(JSON.stringify(p)),f=fixture();
  const result=await f.store.save(p,{saveAs:true});
  assert.equal(result.saved,true);
  assert.deepEqual(p,before);
  assert.equal(result.project.updatedAt,f.disk().updatedAt);
  assert.equal(f.disk().defaultTemplate,undefined);
});
test('cancelled picker does not publish ID or timestamp',async()=>{
  const p=project(),before=JSON.parse(JSON.stringify(p)),f=fixture({cancel:true});
  assert.equal((await f.store.save(p)).cancelled,true);
  assert.deepEqual(p,before);
});
test('failed disk write does not publish ID or timestamp',async()=>{
  const p=project(),before=JSON.parse(JSON.stringify(p)),f=fixture({writeFails:true});
  await assert.rejects(()=>f.store.save(p),/write failed/);
  assert.deepEqual(p,before);
});
test('post-write metadata failure still publishes confirmed disk timestamp',async()=>{
  const p=project(),f=fixture({metadataFails:true}),result=await f.store.save(p);
  assert.equal(result.saved,true);
  assert.equal(result.cacheWarning,true);
  assert.equal(p.updatedAt,f.disk().updatedAt);
});
test('post-write cache failure still publishes confirmed disk timestamp',async()=>{
  const p=project(),f=fixture({cacheFails:true}),result=await f.store.save(p);
  assert.equal(result.saved,true);
  assert.equal(result.cacheWarning,true);
  assert.equal(p.updatedAt,f.disk().updatedAt);
});
test('ordinary draft put still refreshes timestamp',async()=>{
  const p={...project(),projectId:'draft-1',updatedAt:'2001-01-01T00:00:00.000Z'},f=fixture();
  const saved=await f.store.put(p);
  assert.notEqual(saved.updatedAt,'2001-01-01T00:00:00.000Z');
  assert.equal(p.updatedAt,saved.updatedAt);
});
test('Save As refuses to overwrite an existing project',async()=>{
  const p={...project(),projectId:'a'},f=fixture({initial:{...project(),projectId:'b'}});
  await assert.rejects(()=>f.store.save(p,{saveAs:true}),/mevcut bir proje/);
  assert.equal(p.updatedAt,undefined);
  assert.equal(f.disk().projectId,'b');
});
test('external file modification blocks save without changing timestamp',async()=>{
  const p={...project(),projectId:'a',updatedAt:'2020-01-01'},before=JSON.parse(JSON.stringify(p));
  const f=fixture({initial:p});
  await f.store.remember(p,f.handle,100);
  f.touch();
  await assert.rejects(()=>f.store.save(p),/başka bir uygulamada değişmiş/);
  assert.deepEqual(p,before);
});
