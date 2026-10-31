'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function fixture({cacheFails=false}={}){
  const rows=new Map();let downloaded=null,clicks=0;
  const storage={
    getItem:k=>rows.get(k)??null,
    setItem(k,v){if(cacheFails&&k.startsWith('dts-project:'))throw Error('quota');rows.set(k,String(v));},
    removeItem:k=>rows.delete(k)
  };
  const env={
    Blob:class{constructor(parts){downloaded=parts.join('');}},
    URL:{createObjectURL:()=> 'blob:local',revokeObjectURL:()=>{}},
    document:{createElement:()=>({click(){clicks++;}})},setTimeout:()=>{}
  };
  return {store:Projects.create({storage,indexedDB:null,env}),rows,downloaded:()=>JSON.parse(downloaded),clicks:()=>clicks};
}
function project(){return {name:'Kayıt',components:[],wires:[]};}

// Deterministic distinct times expose a second timestamp assignment even in fast tests.
async function withClock(callback){
  const RealDate=global.Date;let tick=0;
  global.Date=class extends RealDate{
    constructor(...args){super(...(args.length?args:[1700000000000+(++tick)*1000]));}
    static now(){return 1700000000000+(++tick)*1000;}
  };
  try{return await callback();}finally{global.Date=RealDate;}
}
test('P0-04 download, cached draft and original share the same confirmed timestamp',async()=>withClock(async()=>{
  const f=fixture(),p=project(),r=await f.store.save(p);
  assert.equal(r.download,true);assert.equal(f.clicks(),1);assert.ok(p.projectId);
  const downloaded=f.downloaded(),draft=await f.store.get(p.projectId);
  assert.equal(downloaded.projectId,p.projectId);
  assert.equal(downloaded.updatedAt,draft.updatedAt,'offline draft must match the downloaded file');
  assert.equal(downloaded.updatedAt,r.project.updatedAt);
  assert.equal(downloaded.updatedAt,p.updatedAt,'successful draft save must publish the same timestamp');
}));
test('P0-04 existing ID is preserved and all fallback timestamps match',async()=>withClock(async()=>{
  const f=fixture(),p={...project(),projectId:'existing',updatedAt:'2000-01-01T00:00:00.000Z'};
  const r=await f.store.save(p);
  assert.equal(p.projectId,'existing');assert.equal(r.project.projectId,'existing');
  assert.equal(f.downloaded().updatedAt,(await f.store.get('existing')).updatedAt);
  assert.equal(p.updatedAt,f.downloaded().updatedAt);
}));
test('P0-04 failed fallback draft leaves caller ID and timestamp untouched',async()=>withClock(async()=>{
  const f=fixture({cacheFails:true}),p=project(),before=structuredClone(p);
  const r=await f.store.save(p);
  assert.equal(r.download,true);assert.equal(r.cacheWarning,true);assert.equal(f.clicks(),1);
  assert.deepEqual(p,before);
}));
test('P0-04 Save As download never modifies protected source',async()=>withClock(async()=>{
  const f=fixture(),p={...project(),projectId:'golden',updatedAt:'2020-01-01T00:00:00.000Z',defaultTemplate:{id:'demo',readOnly:true}};
  const before=structuredClone(p),r=await f.store.save(p,{saveAs:true});
  assert.equal(r.download,true);assert.equal(r.requiresOpen,true);
  assert.deepEqual(p,before);assert.notEqual(f.downloaded().projectId,p.projectId);
  assert.equal(f.downloaded().updatedAt,(await f.store.get(r.project.projectId)).updatedAt);
}));
test('P0-04 ordinary put continues to refresh its timestamp',async()=>withClock(async()=>{
  const f=fixture(),p={...project(),updatedAt:'2000-01-01T00:00:00.000Z'};
  const r=await f.store.put(p);
  assert.notEqual(r.updatedAt,'2000-01-01T00:00:00.000Z');
  assert.equal(p.updatedAt,r.updatedAt);
}));
