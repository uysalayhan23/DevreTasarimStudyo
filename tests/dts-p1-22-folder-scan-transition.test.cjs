'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const wait=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve}};
const project=(id)=>({version:7,projectId:id,name:id,workspaceMode:'control',components:[],wires:[]});
const file=(id)=>{const body=JSON.stringify(project(id));return {kind:'file',getFile:async()=>({size:Buffer.byteLength(body),lastModified:42,text:async()=>body})}};
const directory=(name,id,opts={})=>({name,
  ...(opts.queryPermission?{queryPermission:opts.queryPermission}:{}),
  async *entries(){opts.started?.resolve();if(opts.gate)await opts.gate.promise;yield [id+'.odsdevre',file(id)];}
});
function fixture(dirs){
 const map=new Map();const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
 const store=Store.create({storage,indexedDB:null,env:{showDirectoryPicker:async()=>{const v=dirs.shift();if(!v)throw Error('No folder');return v}}});
 return {store,map,folderIndex:()=>JSON.parse(map.get('dts-folder-index')||'null')};
}
test('P1-22 negative: old folder scan must never overwrite the newly chosen folder cache',async()=>{
 const started=wait(),gate=wait(),A=directory('Klasor A','A',{started,gate}),B=directory('Klasor B','B');
 const f=fixture([A,B]);await f.store.chooseFolder();
 const oldScan=f.store.scan();await started.promise;
 await f.store.chooseFolder();const newer=await f.store.scan();
 assert.deepEqual(newer.entries.map(e=>e.project.projectId),['B']);
 gate.resolve();await oldScan;
 assert.equal(f.folderIndex().folderName,'Klasor B');
 assert.deepEqual(f.folderIndex().entries.map(e=>e.project.projectId),['B'], 'Late A scan cannot poison B cached projects');
});
test('P1-22 negative: delayed permission rejection for old folder cannot mark current folder as permission-needed',async()=>{
 const permission=wait(),A=directory('Klasor A','A',{queryPermission:()=>permission.promise}),B=directory('Klasor B','B');
 const f=fixture([A,B]);await f.store.chooseFolder();const oldScan=f.store.scan();
 await f.store.chooseFolder();const now=await f.store.scan();assert.equal(now.permissionNeeded,false);
 permission.resolve('denied');await oldScan;
 assert.equal(f.store.permissionNeeded,false,'Current B permission state must not be overwritten by old A');
 assert.deepEqual(f.folderIndex().entries.map(e=>e.project.projectId),['B']);
});
test('P1-22 negative: stale read-only file scan must not poison a newly chosen writable folder',async()=>{
 const started=wait(),gate=wait(),B=directory('Klasor B','B');
 const f=fixture([B]);
 const body=JSON.stringify(project('ReadOnly'));
 const file={name:'ReadOnly.odsdevre',size:Buffer.byteLength(body),text:async()=>{started.resolve();await gate.promise;return body}};
 f.store.useFolderFiles([file]);const oldScan=f.store.scan();await started.promise;
 await f.store.chooseFolder();await f.store.scan();
 gate.resolve();await oldScan;
 assert.equal(f.folderIndex().folderName,'Klasor B');
 assert.deepEqual(f.folderIndex().entries.map(e=>e.project.projectId),['B']);
});
test('P1-22 positive: ordinary folder scan still lists and caches valid projects',async()=>{
 const f=fixture([directory('Projeler','C')]);await f.store.chooseFolder();const r=await f.store.scan();
 assert.equal(r.permissionNeeded,false);assert.deepEqual(r.entries.map(e=>e.project.projectId),['C']);
 assert.equal(f.folderIndex().folderName,'Projeler');
 assert.deepEqual(f.folderIndex().entries.map(e=>e.project.projectId),['C']);
});
test('P1-22 positive: denied current folder still reports permission request',async()=>{
 const f=fixture([directory('Projeler','C',{queryPermission:async()=> 'denied'})]);await f.store.chooseFolder();
 const r=await f.store.scan();assert.equal(r.permissionNeeded,true);assert.equal(f.store.permissionNeeded,true);
 assert.deepEqual(r.entries,[]);
});
test('P1-22 positive: folder re-selection publishes latest project cache without collision',async()=>{
 const f=fixture([directory('A','A'),directory('B','B')]);await f.store.chooseFolder();await f.store.scan();
 await f.store.chooseFolder();await f.store.scan();
 assert.deepEqual(f.folderIndex().entries.map(e=>e.project.projectId),['B']);
});
