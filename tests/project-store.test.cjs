const test=require('node:test'),assert=require('node:assert/strict'),Projects=require('../dist/project-store.js');
const project=(name='Yakub')=>({projectId:'p1',name,version:7,workspaceMode:'control',components:[],wires:[]});
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}};
const missing=()=>Object.assign(Error('not found'),{name:'NotFoundError'});
function file(name,p=project()){
  let data=JSON.stringify(p),stamp=1,allowed=true,writes=0;
  const h={kind:'file',name,queryPermission:async()=>allowed?'granted':'prompt',requestPermission:async()=>allowed?'granted':'denied',getFile:async()=>({size:data.length,lastModified:stamp,text:async()=>data}),createWritable:async()=>{let pending;return {write:async s=>{writes++;pending=s},close:async()=>{data=pending;stamp++},abort:async()=>{pending=null}}},externalChange:p=>{data=JSON.stringify(p);stamp++},deny:()=>{allowed=false},get writes(){return writes},get data(){return JSON.parse(data)}};return h;
}
function directory(files){return {name:'Kaydedilen Projeler',kind:'directory',queryPermission:async()=> 'granted',requestPermission:async()=> 'granted',async *entries(){for(const [name,h] of files)yield [name,h]},async getFileHandle(name,{create=false}={}){if(files.has(name))return files.get(name);if(!create)throw missing();const h=file(name);files.set(name,h);return h}}}
test('folder scan lists only project files, opening reads current disk state and Save updates that exact file',async()=>{
  const a=file('Devrem.odsdevre'),files=new Map([[a.name,a],['notes.txt',file('notes.txt')]]),dir=directory(files),store=Projects.create({storage:storage(),env:{showDirectoryPicker:async()=>dir}});
  await store.chooseFolder();const scan=await store.scan();assert.equal(scan.entries.length,1);assert.equal(store.folderName,'Kaydedilen Projeler');
  a.externalChange({...project(),name:'Diskteki güncel ad'});const p=await store.readEntry(scan.entries[0]);assert.equal(p.name,'Diskteki güncel ad');p.name='Yeni ad';p._derived={bad:true};assert.equal((await store.save(p)).saved,true);assert.equal(a.data.name,'Yeni ad');assert.equal(a.data._derived,undefined);assert.equal(a.writes,1);
  assert.equal((await store.get('p1')).name,'Yeni ad');assert.equal(store.list().length,1);
});
test('denied file permission, external edits, save dialog cancel and write failure never report a successful save',async()=>{
  let handle=file('p.odsdevre');const env={showOpenFilePicker:async()=>[handle],showSaveFilePicker:async()=>{throw Object.assign(Error('cancel'),{name:'AbortError'})}},store=Projects.create({storage:storage(),env});
  let p=(await store.openFile()).project;handle.deny();await assert.rejects(store.save(p),/yazma izni/);assert.equal(handle.writes,0);
  handle=file('p.odsdevre');p=(await store.openFile()).project;handle.externalChange({...project(),name:'Başka uygulama'});await assert.rejects(store.save(p),/başka bir uygulamada/);assert.equal(handle.data.name,'Başka uygulama');assert.equal(handle.writes,0);
  assert.equal((await store.save(p,{saveAs:true})).cancelled,true);assert.equal(handle.writes,0);
  handle=file('p.odsdevre');p=(await store.openFile()).project;let aborted=false;handle.createWritable=async()=>({write:async()=>{throw Error('disk dolu')},close:async()=>{},abort:async()=>{aborted=true}});await assert.rejects(store.save(p),/disk dolu/);assert.equal(aborted,true);
});
test('new folder saves avoid existing filenames and Save As copies to the selected destination',async()=>{
  const existing=file('Yakub.odsdevre',{...project(),name:'Değerli eski proje'}),files=new Map([[existing.name,existing]]),destination=file('Diger.odsdevre'),env={showDirectoryPicker:async()=>directory(files),showSaveFilePicker:async()=>destination},store=Projects.create({storage:storage(),env});await store.chooseFolder();const p=project();
  const result=await store.save(p);assert.equal(result.name,'Yakub (2).odsdevre');assert.equal(existing.writes,0);assert.equal(existing.data.name,'Değerli eski proje');
  const savedCopy=(await store.save(p,{saveAs:true})).project;assert.notEqual(savedCopy.projectId,p.projectId);assert.equal(destination.data.name,'Yakub');savedCopy.name='Sonraki kayıt';await store.save(savedCopy);assert.equal(destination.data.name,'Sonraki kayıt');assert.equal(files.get('Yakub (2).odsdevre').data.name,'Yakub');
});
test('fallback folder selection is readable and unsupported save uses a downloadable project plus local draft',async()=>{
  const memory=storage();let downloads=0,downloadName;const env={Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},setTimeout:fn=>fn(),document:{createElement:()=>({click(){downloads++;downloadName=this.download}})}};
  const store=Projects.create({storage:memory,env});assert.equal((await store.chooseFolder()).fallback,true);assert.equal((await store.openFile()).fallback,true);
  store.useFolderFiles([{name:'p.odsdevre',webkitRelativePath:'Devreler/p.odsdevre',lastModified:3,text:async()=>JSON.stringify(project())}]);assert.equal(store.folderName,'Devreler');assert.equal((await store.scan()).entries.length,1);
  const p=project();assert.equal((await store.save(p)).download,true);assert.equal(downloads,1);assert.equal(downloadName,'Yakub.odsdevre');assert.equal((await store.get('p1')).name,'Yakub');
});
test('folder restore does not request permission automatically; explicit refresh can request it',async()=>{
  let permissions=0,allow=false;const dir=directory(new Map([['p.odsdevre',file('p.odsdevre')]]));dir.queryPermission=async()=>allow?'granted':'prompt';dir.requestPermission=async()=>{permissions++;allow=true;return 'granted'};
  const store=Projects.create({storage:storage(),env:{showDirectoryPicker:async()=>dir}});await store.chooseFolder();assert.equal((await store.scan()).permissionNeeded,true);assert.equal(permissions,0);assert.equal((await store.scan(true)).entries.length,1);assert.equal(permissions,1);
});
test('invalid JSON and storage quota failure are surfaced; internal simulation fields are excluded from exports',async()=>{
  for(const raw of ['{','{}','{"components":[{}],"wires":[]}'])assert.throws(()=>Projects.parse(raw));
  const store=Projects.create({storage:{getItem:()=>null,setItem:()=>{throw Error('quota')}},env:{}});await assert.rejects(store.put(project()),/quota/);
  const p={...project(),components:[{id:'a',typeId:'lamp-green',state:false,_active:true,labelPositions:{ref:{x:45,y:60}}}]};assert.equal(Projects.clean(p).components[0]._active,undefined);assert.deepEqual(Projects.clean(p).components[0].labelPositions,p.components[0].labelPositions);
});


test('legacy project shapes are normalized before validation and opening',()=>{
 const panel=Projects.parse(JSON.stringify({name:'Eski pano',workspaceMode:'pano',panel:{rails:[],items:[],wires:[]}}));
 assert.equal(panel.workspaceMode,'panel');assert.deepEqual(panel.components,[]);assert.deepEqual(panel.wires,[]);assert.deepEqual(panel.junctions,[]);
 const numeric=Projects.parse(JSON.stringify({name:'Eski kumanda',workspaceMode:'kumanda',components:[{id:1,type:'resistor',x:10,y:20}],wires:[{id:7,from:{c:1,p:'1'},to:{c:1,p:'2'}}]}));
 assert.equal(numeric.workspaceMode,'control');assert.equal(numeric.components[0].id,'1');assert.equal(numeric.components[0].typeId,'resistor');assert.equal(numeric.wires[0].id,'7');assert.equal(numeric.wires[0].from.c,'1');
});

test('last folder project cards remain available while permission is pending and click-time permission can reopen them',async()=>{
 const memory=storage(),a=file('Eski.odsdevre',{...project('Eski Projem'),projectId:'old1'});
 let allow=true,requests=0;const files=new Map([[a.name,a]]),dir=directory(files);
 dir.queryPermission=async()=>allow?'granted':'prompt';dir.requestPermission=async()=>{requests++;allow=true;return 'granted'};
 const store=Projects.create({storage:memory,env:{showDirectoryPicker:async()=>dir}});
 await store.chooseFolder();const first=await store.scan();assert.equal(first.entries.length,1);
 allow=false;const pending=await store.scan();assert.equal(pending.permissionNeeded,true);assert.equal(pending.entries.length,1);assert.equal(pending.entries[0].cached,true);assert.equal(pending.entries[0].project.name,'Eski Projem');
 const reopened=await store.readEntry(pending.entries[0],true);assert.equal(reopened.name,'Eski Projem');assert.equal(requests,1);
});
