'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
// Exercise the actual Dashboard save handler, not a reimplementation.
const source=fs.readFileSync(path.join(__dirname,'../dist/studio.js'),'utf8');
const start=source.indexOf('  async function save(saveAs=false){');
const end=source.indexOf("\n  $('#projectFolderInput')",start);
assert.ok(start>=0&&end>start,'Dashboard save handler must exist');
const handler=source.slice(start,end).trim();
async function scenario(result,{saveAs=false,storageFails=false,reject=false}={}){
  const state={clean:0,loaded:0,storage:0,toasts:[]};
  const project={version:7,projectId:'user-project',components:[],wires:[]};
  const button={disabled:false};
  const context={
    isHome:false,safety:{visible:false},protectedNotice:()=>false,
    protectedProject:()=>false,templateOriginal:null,
    Projects:{clean:p=>p},
    E:{getProject:()=>project,toast:m=>state.toasts.push(m)},
    $:()=>button,
    store:{save:async()=>{if(reject)throw Error('disk failure');return result}},
    markClean:()=>{state.clean++},load:()=>{state.loaded++},
    localStorage:{setItem:()=>{state.storage++;if(storageFails)throw Error('quota exceeded')}}
  };
  await vm.runInNewContext('('+handler+')',context)(saveAs);
  assert.equal(button.disabled,false);
  return state;
}
test('P0-04 download request does not clear unsaved-file warning',async()=>{
  const s=await scenario({download:true,project:{projectId:'user-project'}});
  assert.equal(s.clean,0);assert.equal(s.storage,1);
  assert.match(s.toasts.join(' '),/İndirme isteği/);
  assert.doesNotMatch(s.toasts.join(' '),/Dosya indirildi\./);
});
test('P7-04 Save As download does not unlock or clear current project',async()=>{
  const s=await scenario({download:true,requiresOpen:true},{saveAs:true});
  assert.equal(s.clean,0);assert.equal(s.loaded,0);assert.equal(s.storage,0);
  assert.match(s.toasts.join(' '),/Dosya Aç/);
});
test('P0-04 confirmed disk save clears dirty state',async()=>{
  const s=await scenario({saved:true,name:'my.odsdevre'});
  assert.equal(s.clean,1);assert.equal(s.loaded,0);assert.equal(s.storage,1);
});
test('P7-04 confirmed Save As loads copy and clears dirty state',async()=>{
  const s=await scenario({saved:true,name:'copy.odsdevre',project:{projectId:'copy'}},{saveAs:true});
  assert.equal(s.clean,1);assert.equal(s.loaded,1);assert.equal(s.storage,1);
});
test('P0-04 cancelled picker leaves dirty state intact',async()=>{
  const s=await scenario({cancelled:true});
  assert.equal(s.clean,0);assert.equal(s.storage,0);
});
test('P0-04 browser backup failure after disk save is not disk failure',async()=>{
  const s=await scenario({saved:true,name:'my.odsdevre'},{storageFails:true});
  assert.equal(s.clean,1);assert.equal(s.storage,1);
  assert.match(s.toasts.join(' '),/taslak yedeği güncellenemedi/);
  assert.doesNotMatch(s.toasts.join(' '),/Kaydedilemedi:/);
});
test('P0-04 failed disk save keeps dirty state',async()=>{
  const s=await scenario(null,{reject:true});
  assert.equal(s.clean,0);assert.equal(s.storage,0);
  assert.match(s.toasts.join(' '),/Kaydedilemedi: disk failure/);
});
test('P0-04 unknown save result fails closed',async()=>{
  const s=await scenario({});
  assert.equal(s.clean,0);
  assert.match(s.toasts.join(' '),/Kaydetme sonucu doğrulanamadı/);
});
