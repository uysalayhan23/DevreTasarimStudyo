'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=()=>({projectId:'p-safe',name:'Yeni Kayıt',components:[],wires:[]});
const missing=()=>Object.assign(Error('missing'),{name:'NotFoundError'});
function fixture({failure='write',alterAfterFailure=null,identity=true,remove=true,existing=false}={}){
  const files=new Map(),removed=[],storageData=new Map();let writes=0,aborts=0,created=0,clock=100;
  function makeFile(name,contents='',stamp=100){
    const h={kind:'file',name,
      async queryPermission(){return 'granted'},
      async getFile(){return {size:Buffer.byteLength(contents),lastModified:stamp,async text(){return contents}}},
      async createWritable(){
        if(failure==='createWritable')throw Error('writable failed');
        return {
          async write(value){writes++;if(failure==='write'){if(alterAfterFailure==='nonempty'){contents='other user data';stamp++}if(alterAfterFailure==='empty-touched')stamp++;throw Error('disk full')}this.pending=value},
          async close(){if(failure==='close')throw Error('close failed');contents=this.pending;stamp++},
          async abort(){aborts++}
        }
      }
    };
    if(identity)h.isSameEntry=async other=>identity==='mismatch'?false:h===other;
    return h;
  }
  if(existing)files.set('Yeni Kayıt.odsdevre',makeFile('Yeni Kayıt.odsdevre',JSON.stringify({projectId:'foreign',name:'Foreign',components:[],wires:[]})));
  const dir={name:'Projeler',kind:'directory',async queryPermission(){return 'granted'},async getFileHandle(name,{create=false}={}){
    if(files.has(name))return files.get(name);
    if(!create)throw missing();
    const h=makeFile(name);files.set(name,h);created++;return h;
  }};
  if(remove)dir.removeEntry=async name=>{removed.push(name);files.delete(name)};
  const storage={getItem:k=>storageData.get(k)||null,setItem:(k,v)=>storageData.set(k,String(v)),removeItem:k=>storageData.delete(k)};
  const store=Projects.create({storage,indexedDB:null,env:{showDirectoryPicker:async()=>dir}});
  return {store,files,removed,stats:()=>({writes,aborts,created}),dir,makeFile};
}
async function attempt(f){await f.store.chooseFolder();return f.store.save(project())}
for(const failure of ['write','close','createWritable']){
  test('P0-04 fresh empty folder file is safely rolled back after '+failure,async()=>{
    const f=fixture({failure});await assert.rejects(attempt(f),/disk full|close failed|writable failed/);
    assert.equal(f.files.size,0,'failed new file must not remain as an empty .odsdevre');
    assert.deepEqual(f.removed,['Yeni Kayıt.odsdevre']);
  });
}
test('P0-04 failed write must never remove file with new non-empty user data',async()=>{
  const f=fixture({alterAfterFailure:'nonempty'});await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);assert.deepEqual(f.removed,[]);
});
test('P0-04 changed empty file timestamp blocks cleanup',async()=>{
  const f=fixture({alterAfterFailure:'empty-touched'});await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);assert.deepEqual(f.removed,[]);
});
test('P0-04 absent same-entry capability fails closed',async()=>{
  const f=fixture({identity:false});await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);assert.deepEqual(f.removed,[]);
});
test('P0-04 absent directory removal capability fails closed',async()=>{
  const f=fixture({remove:false});await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);assert.deepEqual(f.removed,[]);
});
test('P0-04 preexisting project is not removed after overwrite rejection',async()=>{
  const f=fixture({existing:true});await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);assert.deepEqual(f.removed,['Yeni Kayıt (2).odsdevre']);
  assert.ok(f.files.has('Yeni Kayıt.odsdevre'));
});
test('P0-04 successful folder save keeps the new project file',async()=>{
  const f=fixture({failure:null});const r=await attempt(f);
  assert.equal(r.saved,true);assert.equal(f.files.size,1);assert.deepEqual(f.removed,[]);
  const saved=await f.files.get('Yeni Kayıt.odsdevre').getFile();assert.equal(JSON.parse(await saved.text()).projectId,'p-safe');
});

test('P0-04 entry identity mismatch preserves the file',async()=>{
  const f=fixture({identity:'mismatch'});await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);assert.deepEqual(f.removed,[]);
});
test('P0-04 cleanup failure preserves original disk write error',async()=>{
  const f=fixture();f.dir.removeEntry=async()=>{throw Error('cleanup denied')};
  await assert.rejects(attempt(f),/disk full/);
  assert.equal(f.files.size,1);
});
