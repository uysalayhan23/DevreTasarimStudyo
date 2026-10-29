'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
function project(id='p1',protectedTemplate=false){
 return {version:7,projectId:id,name:'Test',components:[],wires:[],
  ...(protectedTemplate?{defaultTemplate:{id:'demo',readOnly:true}}:{})};
}
function fixture(target,{empty=false}={}){
 const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 let writes=0,lastModified=1;
 const handle={
  name:'chosen.odsdevre',
  queryPermission:async()=> 'granted',
  getFile:async()=>({size:empty?0:JSON.stringify(target).length,lastModified,
   text:async()=>JSON.stringify(target)}),
  createWritable:async()=>({write:async()=>{writes++},close:async()=>{lastModified++},abort:async()=>{}})
 };
 const env={showSaveFilePicker:async()=>handle};
 return {store:Projects.create({storage,indexedDB:null,env}),writes:()=>writes};
}
test('P7-04: Save As cannot overwrite an unremembered original with the same ID',async()=>{
 const f=fixture(project());await assert.rejects(f.store.save(project(),{saveAs:true}),/Farklı Kaydet mevcut/);
 assert.equal(f.writes(),0);
});
test('P7-04: Save As refuses a different editable project',async()=>{
 const f=fixture(project('other'));await assert.rejects(f.store.save(project(),{saveAs:true}),/başka bir projeye ait/);
 assert.equal(f.writes(),0);
});
test('P7-04: Save As refuses a protected example target',async()=>{
 const f=fixture(project('p1',true));await assert.rejects(f.store.save(project(),{saveAs:true}),/korunan bir hazır örnek/);
 assert.equal(f.writes(),0);
});
test('P7-04: Save As refuses a malformed existing target',async()=>{
 const f=fixture({garbage:1});await assert.rejects(f.store.save(project(),{saveAs:true}),/Hedef proje dosyası geçersiz/);
 assert.equal(f.writes(),0);
});
test('P7-04: Save As succeeds for a newly created empty target',async()=>{
 const f=fixture(project(),{empty:true});const out=await f.store.save(project(),{saveAs:true});
 assert.equal(out.saved,true);assert.equal(f.writes(),1);assert.notEqual(out.project.projectId,'p1');
});
test('P7-04: ordinary Save keeps writing its matching editable project',async()=>{
 const f=fixture(project());const out=await f.store.save(project(),{saveAs:false});
 assert.equal(out.saved,true);assert.equal(f.writes(),1);assert.equal(out.project.projectId,'p1');
});
