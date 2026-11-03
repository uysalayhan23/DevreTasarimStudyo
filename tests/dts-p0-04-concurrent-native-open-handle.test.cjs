'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const defer=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject};};
const project=name=>({version:7,projectId:'same-project-id',name,components:[],wires:[],workspaceMode:'control'});
function fixture(){
 const selected=[],written=[];
 function makeFile(name,gate){
   let contents=JSON.stringify(project(name)),stamp=10;
   const handle={name:name+'.odsdevre',queryPermission:async()=> 'granted',
      async getFile(){return {size:Buffer.byteLength(contents),lastModified:stamp,text:async()=>{if(gate)await gate.promise;return contents}};},
      async createWritable(){return {write:async text=>{written.push(name);contents=text;},close:async()=>{stamp++},abort:async()=>{}}}
   };return handle;
 }
 const storage=new Map(),st={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)};
 const store=Store.create({storage:st,indexedDB:null,env:{showOpenFilePicker:()=>{const d=defer();selected.push(d);return d.promise;}}});
 return {store,selected,written,makeFile};
}
test('P0-04 older picker resolution cannot replace the newer open-file save handle',async()=>{
 const x=fixture(),a=x.makeFile('A'),b=x.makeFile('B');
 const older=x.store.openFile(),newer=x.store.openFile();
 x.selected[1].resolve([b]);const newResult=await newer;assert.equal(newResult.project.name,'B');
 x.selected[0].resolve([a]);const oldResult=await older;
 assert.equal(oldResult.cancelled,true,'superseded earlier picker must not reopen a file');
 await x.store.save(newResult.project);
 assert.deepEqual(x.written,['B'],'saving newest project must never write the old file');
});
test('P0-04 older slow file text read cannot overwrite newer file handle',async()=>{
 const x=fixture(),slow=defer(),a=x.makeFile('A',slow),b=x.makeFile('B');
 const older=x.store.openFile();x.selected[0].resolve([a]);
 // Let older read wait for text.
 for(let i=0;i<6;i++)await Promise.resolve();
 const newer=x.store.openFile();x.selected[1].resolve([b]);const newResult=await newer;
 slow.resolve();const oldResult=await older;
 assert.equal(oldResult.cancelled,true);
 await x.store.save(newResult.project);
 assert.deepEqual(x.written,['B']);
});
test('P0-04 valid single file open still remembers its handle for save',async()=>{
 const x=fixture(),b=x.makeFile('B');const pending=x.store.openFile();x.selected[0].resolve([b]);
 const opened=await pending;assert.equal(opened.project.name,'B');
 await x.store.save(opened.project);assert.deepEqual(x.written,['B']);
});
test('P0-04 second picker cancellation keeps previous selection from resurrecting',async()=>{
 const x=fixture(),a=x.makeFile('A');const old=x.store.openFile(),current=x.store.openFile();
 const cancelled=Error('cancelled');cancelled.name='AbortError';x.selected[1].reject(cancelled);
 assert.deepEqual(await current,{cancelled:true});
 x.selected[0].resolve([a]);assert.equal((await old).cancelled,true);
 assert.deepEqual(x.written,[]);
});
test('P0-04 successful sequential file open still updates latest save handle',async()=>{
 const x=fixture(),a=x.makeFile('A'),b=x.makeFile('B');
 const old=x.store.openFile();x.selected[0].resolve([a]);await old;
 const current=x.store.openFile();x.selected[1].resolve([b]);const result=await current;
 await x.store.save(result.project);assert.deepEqual(x.written,['B']);
});
