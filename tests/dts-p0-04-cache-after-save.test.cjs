'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

// Real DTSProjects.create/save, with a fake browser file handle and local cache.
async function scenario({saveAs=false,storageFails=false,diskFails=false,existing=false,protectedProject=false,noPicker=false}={}){
  let raw=existing?JSON.stringify({version:7,projectId:'p',components:[],wires:[]}):'';
  let modified=1,writes=0,clicks=0,closed=false;
  const handle={
    name:'sample.odsdevre',
    getFile:async()=>({size:raw.length,lastModified:modified,text:async()=>raw}),
    createWritable:async()=>({
      write:async s=>{if(diskFails)throw Error('disk failed');raw=s;writes++},
      close:async()=>{modified++;closed=true},
      abort:async()=>{}
    })
  };
  const env={
    ...(noPicker?{}:{showSaveFilePicker:async()=>handle}),
    Blob:class{},document:{createElement:()=>({click(){clicks++}})},
    URL:{createObjectURL:()=>'/blob',revokeObjectURL(){}},setTimeout(){}
  };
  const storage={getItem:()=>null,setItem:()=>{if(storageFails)throw Error('quota exceeded')}};
  const store=Projects.create({storage,indexedDB:null,env});
  const project={
    version:7,projectId:'p',name:'Project',components:[],wires:[],junctions:[],
    ...(protectedProject?{defaultTemplate:{id:'starter:control',readOnly:true}}:{})
  };
  try{return {result:await store.save(project,{saveAs}),writes,closed,clicks}}
  catch(e){return {error:String(e),writes,closed,clicks}}
}

test('P0-04 confirmed disk save succeeds with healthy browser cache',async()=>{
  const r=await scenario();
  assert.equal(r.result.saved,true);assert.equal(r.result.cacheWarning,false);
  assert.equal(r.writes,1);assert.equal(r.closed,true);
});
test('P0-04 browser quota failure after disk close does not report disk save failure',async()=>{
  const r=await scenario({storageFails:true});
  assert.equal(r.result.saved,true);assert.equal(r.result.cacheWarning,true);
  assert.equal(r.writes,1);assert.equal(r.closed,true);
});
test('P7-04 Save As returns a confirmed editable copy with healthy cache',async()=>{
  const r=await scenario({saveAs:true});
  assert.equal(r.result.saved,true);assert.equal(r.result.cacheWarning,false);
  assert.notEqual(r.result.project.projectId,'p');
});
test('P7-04 Save As disk success survives browser quota failure',async()=>{
  const r=await scenario({saveAs:true,storageFails:true});
  assert.equal(r.result.saved,true);assert.equal(r.result.cacheWarning,true);
  assert.notEqual(r.result.project.projectId,'p');assert.equal(r.closed,true);
});
test('P0-04 disk write failure remains a real save failure',async()=>{
  const r=await scenario({diskFails:true});
  assert.match(r.error,/disk failed/);assert.equal(r.writes,0);
});
test('P0-03 protected example cannot be overwritten by normal Save',async()=>{
  const r=await scenario({protectedProject:true});
  assert.match(r.error,/Hazır örnek korunuyor/);assert.equal(r.writes,0);
});
test('P7-04 Save As cannot overwrite a nonempty project file',async()=>{
  const r=await scenario({saveAs:true,existing:true});
  assert.match(r.error,/mevcut bir proje dosyasının üzerine yazamaz/);
  assert.equal(r.writes,0);
});
test('P0-04 fallback download remains unconfirmed and warns if draft cache fails',async()=>{
  const r=await scenario({noPicker:true,storageFails:true});
  assert.equal(r.result.download,true);assert.equal(r.result.saved,undefined);
  assert.equal(r.result.cacheWarning,true);assert.equal(r.clicks,1);
});
test('P0-04 fallback download preserves its unconfirmed state with healthy cache',async()=>{
  const r=await scenario({noPicker:true});
  assert.equal(r.result.download,true);assert.equal(r.result.saved,undefined);
  assert.equal(r.result.cacheWarning,false);assert.equal(r.clicks,1);
});
