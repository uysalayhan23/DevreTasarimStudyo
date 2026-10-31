'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const Projects = require('../dist/project-store.js');

function fixture({metadataFailure=false,pickerForeign=false}={}){
  const project={projectId:'p-1',name:'Kayıt',components:[],wires:[]};
  let content=JSON.stringify(project),stamp=10,reads=0,writes=0,pickers=0;
  const handle={
    name:'original.odsdevre',
    async getFile(){
      reads++;
      if(metadataFailure&&reads===3)throw Error('metadata unavailable after write');
      return {size:content.length,lastModified:stamp,async text(){return content}};
    },
    async createWritable(){
      return {async write(value){content=String(value)},async close(){stamp++;writes++},async abort(){}};
    }
  };
  const foreign={
    name:'other.odsdevre',
    async getFile(){
      const text=JSON.stringify({projectId:'other',name:'Başka',components:[],wires:[]});
      return {size:text.length,lastModified:10,async text(){return text}};
    },
    async createWritable(){throw Error('Foreign file must not be overwritten')}
  };
  const data=new Map();
  const storage={
    getItem:key=>data.get(key)??null,
    setItem:(key,value)=>data.set(key,String(value)),
    removeItem:key=>data.delete(key)
  };
  const env={async showSaveFilePicker(){pickers++;return pickerForeign?foreign:handle}};
  const store=Projects.create({storage,indexedDB:null,env});
  return {project,store,handle,stats:()=>({reads,writes,pickers}),touch:()=>{stamp+=100}};
}

test('P0-04: successful disk write survives missing post-write metadata',async()=>{
  const f=fixture({metadataFailure:true});
  await f.store.remember(f.project,f.handle,10);
  const first=await f.store.save(f.project);
  assert.equal(first.saved,true);
  assert.equal(first.cacheWarning,true);
  assert.equal(f.stats().writes,1);
});

test('P0-04: metadata failure invalidates stale guard and reopens picker safely',async()=>{
  const f=fixture({metadataFailure:true});
  await f.store.remember(f.project,f.handle,10);
  await f.store.save(f.project);
  const second=await f.store.save(f.project);
  assert.equal(second.saved,true);
  assert.equal(f.stats().pickers,1);
  assert.equal(f.stats().writes,2);
});

test('P0-04: valid fresh metadata retains the remembered handle',async()=>{
  const f=fixture();
  await f.store.remember(f.project,f.handle,10);
  await f.store.save(f.project);
  const second=await f.store.save(f.project);
  assert.equal(second.saved,true);
  assert.equal(f.stats().pickers,0);
  assert.equal(f.stats().writes,2);
});

test('P0-04: external modification still blocks overwrite',async()=>{
  const f=fixture();
  await f.store.remember(f.project,f.handle,10);
  await f.store.save(f.project);
  f.touch();
  await assert.rejects(f.store.save(f.project),/başka bir uygulamada değişmiş/);
  assert.equal(f.stats().writes,1);
});

test('P0-04: picker after metadata failure cannot overwrite another project',async()=>{
  const f=fixture({metadataFailure:true,pickerForeign:true});
  await f.store.remember(f.project,f.handle,10);
  await f.store.save(f.project);
  await assert.rejects(f.store.save(f.project),/başka bir projeye ait/);
  assert.equal(f.stats().writes,1);
  assert.equal(f.stats().pickers,1);
});

test('P0-04: protected template remains read-only',async()=>{
  const f=fixture();
  const protectedProject={...f.project,defaultTemplate:{id:'golden',readOnly:true}};
  await assert.rejects(f.store.save(protectedProject),/Hazır örnek korunuyor/);
  assert.equal(f.stats().writes,0);
});