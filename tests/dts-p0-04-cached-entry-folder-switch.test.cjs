'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const wait=()=>{let resolve;const promise=new Promise(r=>{resolve=r});return {promise,resolve}};
const project=id=>({version:7,projectId:id,name:id,workspaceMode:'control',components:[],wires:[]});
const handle=id=>({name:'same.odsdevre',getFile:async()=>({size:100,lastModified:123,text:async()=>JSON.stringify(project(id))})});
function fixture({stallA=false,handleGate=null,textGate=null,sameName=false}={}){
 const started=wait(),gate=wait(),picked=[],seen=[];
 const A={name:'Old',queryPermission:async()=>{started.resolve();return stallA?await gate.promise:'granted'},getFileHandle:async()=>{seen.push('A');if(handleGate){handleGate.started.resolve();await handleGate.gate.promise;}return textGate?{name:'same.odsdevre',getFile:async()=>({size:100,lastModified:123,text:async()=>{textGate.started.resolve();await textGate.gate.promise;return JSON.stringify(project('A'))}})}:handle('A')}};
 const B={name:sameName?'Old':'New',queryPermission:async()=> 'granted',getFileHandle:async()=>{seen.push('B');return handle('B')}};
 const storage={getItem:()=>null,setItem(){},removeItem(){}};
 const store=Store.create({storage,indexedDB:null,env:{showDirectoryPicker:async()=>picked.shift()}});
 return {store,A,B,picked,started,gate,seen};
}
const entry={cached:true,name:'same.odsdevre',project:{projectId:'A',name:'Old'}};
test('P0-04 negative: stale cached entry cannot load another folder with the same filename',async()=>{
 const x=fixture({stallA:true});x.picked.push(x.A,x.B);
 await x.store.chooseFolder();const pending=x.store.readEntry(entry);await x.started.promise;
 await x.store.chooseFolder();x.gate.resolve('granted');
 await assert.rejects(pending,/klasör|seçim|değiş/i);
 assert.deepEqual(x.seen,[],'neither stale A nor unrelated B file may be opened');
 assert.equal(x.store.folderName,'New');
});
test('P0-04 positive: cached folder entry still opens within its own folder',async()=>{
 const x=fixture();x.picked.push(x.A);await x.store.chooseFolder();
 const actual=await x.store.readEntry(entry);assert.equal(actual.projectId,'A');
 assert.deepEqual(x.seen,['A']);
});
test('P0-04 positive: direct file handle still opens without any folder',async()=>{
 const x=fixture();const direct={name:'direct.odsdevre',handle:handle('DIRECT')};
 const actual=await x.store.readEntry(direct);assert.equal(actual.projectId,'DIRECT');
});
test('P0-04 negative: cached item without a selected folder is not mistaken for saved project',async()=>{
 const x=fixture();await assert.rejects(x.store.readEntry(entry),/proje|geçersiz|klasör|liste|dts/i);
});

test('P0-04 negative: folder selection during delayed getFileHandle cannot return stale project',async()=>{
 const handleGate={started:wait(),gate:wait()},x=fixture({handleGate});x.picked.push(x.A,x.B);
 await x.store.chooseFolder();const pending=x.store.readEntry(entry);await handleGate.started.promise;
 await x.store.chooseFolder();handleGate.gate.resolve();
 await assert.rejects(pending,/klasör|değiş/i);
 assert.deepEqual(x.seen,['A']);
 assert.equal(x.store.folderName,'New');
});
test('P0-04 negative: selection while file text read awaits cannot load old folder',async()=>{
 const textGate={started:wait(),gate:wait()},x=fixture({textGate});x.picked.push(x.A,x.B);
 await x.store.chooseFolder();const pending=x.store.readEntry(entry);await textGate.started.promise;
 await x.store.chooseFolder();textGate.gate.resolve();
 await assert.rejects(pending,/klasör|değiş/i);
 assert.deepEqual(x.seen,['A']);
});
test('P0-04 negative: two different folder handles with the same name remain distinct',async()=>{
 const x=fixture({stallA:true,sameName:true});x.picked.push(x.A,x.B);
 await x.store.chooseFolder();const pending=x.store.readEntry(entry);await x.started.promise;
 await x.store.chooseFolder();x.gate.resolve('granted');
 await assert.rejects(pending,/klasör|değiş/i);
 assert.deepEqual(x.seen,[]);
 assert.equal(x.store.folderName,'Old');
});
