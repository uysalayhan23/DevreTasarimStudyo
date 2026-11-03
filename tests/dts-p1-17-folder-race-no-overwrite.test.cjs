'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const project=(name='Pano')=>({version:7,name,projectId:'p-shared-id',workspaceMode:'control',components:[],wires:[]});
function setup({race=false,occupied=false,differentId=false,invalid=false}={}){
 const name='Pano.odsdevre';
 let collided=false,writeCount=0;
 const occupant=project('Önceden Kaydedilen Proje');
 if(differentId)occupant.projectId='different-project';
 const old=invalid?'{bad json':JSON.stringify(occupant);
 const records=new Map(occupied?[[name,old]]:[]);
 const handleFor=filename=>({name:filename,async getFile(){const text=records.get(filename)||'';return {size:Buffer.byteLength(text),lastModified:100,text:async()=>text}},
  async createWritable(){return {async write(text){writeCount++;records.set(filename,String(text))},async close(){},async abort(){}}},
  async isSameEntry(other){return other?.name===filename}});
 const directory={name:'DTS files',async getFileHandle(filename,{create=false}={}){
   if(!create&&race&&filename===name&&!collided){collided=true;records.set(filename,old);
    throw Object.assign(Error('NotFoundError at time of probe'),{name:'NotFoundError'});
   }
   if(!records.has(filename)){
     if(!create)throw Object.assign(Error('NotFoundError'),{name:'NotFoundError'});
     records.set(filename,'');
   }
   return handleFor(filename);
  },async removeEntry(filename){records.delete(filename)}};
 const local=new Map();const storage={getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,String(v)),removeItem:k=>local.delete(k)};
 const store=Store.create({storage,indexedDB:null,env:{showDirectoryPicker:async()=>directory}});
 return {store,records,get writes(){return writeCount},old,original:project(),name,setup:async()=>store.chooseFolder()};
}
test('P1-17 negative: a file created by another tab after a free-name check is never overwritten even if its project ID matches',async()=>{
 const x=setup({race:true});await x.setup();
 await assert.rejects(()=>x.store.save(x.original),/üzerine yazılmadı|yeniden kaydedin|başka bir dosya/);
 assert.equal(x.records.get(x.name),x.old,'Previous content must be retained byte-for-byte');
 assert.equal(x.writes,0,'No disk writes after the collision');
});
test('P1-17 negative: the same race never overwrites an unparseable competing file',async()=>{
 const x=setup({race:true,invalid:true});await x.setup();
 await assert.rejects(()=>x.store.save(x.original));
 assert.equal(x.records.get(x.name),x.old);assert.equal(x.writes,0);
});
test('P1-17 negative: different-project collision remains blocked',async()=>{
 const x=setup({race:true,differentId:true});await x.setup();
 await assert.rejects(()=>x.store.save(x.original));
 assert.equal(x.records.get(x.name),x.old);assert.equal(x.writes,0);
});
test('P1-17 positive: genuinely new file in chosen folder saves successfully',async()=>{
 const x=setup();await x.setup();const result=await x.store.save(x.original);
 assert.equal(result.saved,true);assert.equal(result.name,x.name);assert.equal(x.writes,1);
 assert.equal(JSON.parse(x.records.get(x.name)).projectId,'p-shared-id');
});
test('P1-17 positive: occupied filename discovered during initial probe uses a unique suffix',async()=>{
 const x=setup({occupied:true});await x.setup();const result=await x.store.save(x.original);
 assert.equal(result.name,'Pano (2).odsdevre');assert.equal(x.records.get(x.name),x.old);
 assert.equal(x.writes,1);
});
test('P1-17 positive: second ordinary save to the remembered handle updates that project',async()=>{
 const x=setup();await x.setup();await x.store.save(x.original);
 const modified=x.original;modified.name='Yeni Pano';const result=await x.store.save(modified);
 assert.equal(result.saved,true);assert.equal(x.writes,2);
 assert.equal(result.name,x.name);assert.equal(JSON.parse(x.records.get(x.name)).name,'Yeni Pano');
});
