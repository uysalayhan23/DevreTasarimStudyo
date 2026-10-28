'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=()=>({projectId:'p1',name:'Y',version:7,workspaceMode:'control',components:[],wires:[]});
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}};
function indexedDBWith(getResult,fail=false){
  return {open(){const request={};Promise.resolve().then(()=>{
    request.result={transaction(){
      if(fail)throw Error('IndexedDB unavailable');
      const tx={objectStore(){return {get(){const req={};Promise.resolve().then(()=>{req.result=getResult;req.onsuccess();tx.oncomplete()});return req}}}};
      return tx;
    }};request.onsuccess();
  });return request}};
}
test('invalid primitive and array wire endpoints rejected; valid endpoints retained',()=>{
  for(const from of ['component-id',['component-id']])assert.throws(()=>Projects.parse(JSON.stringify({...project(),wires:[{from,to:{c:'b',p:'1'}}]})),/geçerli/);
  assert.equal(Projects.parse(JSON.stringify({...project(),wires:[{from:{c:'a',p:'1'},to:{c:'b',p:'1'}}]})).wires.length,1);
});
test('malformed draft index entries cannot break dashboard listing',()=>{
  const storage=memory();storage.setItem('dts-project-index',JSON.stringify([null,{},7,{id:'p1',name:'Valid'},{id:2,name:'Legacy'}]));
  const rows=Projects.create({storage,indexedDB:null,env:{}}).list();assert.equal(rows.length,2);assert.equal(rows[0].id,'p1');assert.equal(rows[1].id,2);
});
test('failed IndexedDB draft write falls back to localStorage',async()=>{
  const storage=memory(),store=Projects.create({storage,indexedDB:indexedDBWith(null,true),env:{}});
  await store.put(project());assert.equal(JSON.parse(storage.getItem('dts-project:p1')).name,'Y');assert.equal(store.list().length,1);
});
test('failed IndexedDB draft read recovers localStorage backup',async()=>{
  const storage=memory();storage.setItem('dts-project:p1',JSON.stringify(project()));
  const store=Projects.create({storage,indexedDB:indexedDBWith(null,true),env:{}});
  assert.equal((await store.get('p1')).name,'Y');
});
test('corrupt IndexedDB row recovers valid localStorage backup',async()=>{
  const storage=memory();storage.setItem('dts-project:p1',JSON.stringify(project()));
  const store=Projects.create({storage,indexedDB:indexedDBWith({invalid:true}),env:{}});
  assert.equal((await store.get('p1')).projectId,'p1');
});
test('corrupt IndexedDB without backup reports error rather than silently losing project',async()=>{
  const store=Projects.create({storage:memory(),indexedDB:indexedDBWith({invalid:true}),env:{}});
  await assert.rejects(store.get('p1'),/geçerli/);
});
test('corrupt cached folder rows are ignored without hiding valid row',async()=>{
  const storage=memory(),directory={name:'Devreler',queryPermission:async()=> 'prompt'};
  storage.setItem('dts-folder-index',JSON.stringify({folderName:'Devreler',entries:[null,{},7,{key:'p.odsdevre',name:'p.odsdevre',project:{projectId:'p1',name:'Y'}}]}));
  const store=Projects.create({storage,indexedDB:indexedDBWith(directory),env:{}});
  assert.equal(await store.restoreFolder(),false);
  const result=await store.scan();assert.equal(result.permissionNeeded,true);assert.equal(result.entries.length,1);assert.equal(result.entries[0].key,'p.odsdevre');
});
test('valid JSON project remains readable',()=>assert.equal(Projects.parse(JSON.stringify(project())).components.length,0));
