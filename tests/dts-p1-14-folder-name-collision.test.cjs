'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');
const project=name=>({version:7,name,projectId:'P14',workspaceMode:'control',components:[],wires:[]});
function fixture(existing=[]){
  const files=new Map(existing.map(name=>[name,{text:'ORIGINAL FILE',stamp:7}]));
  const tried=[];const storageMap=new Map();
  const storage={getItem:key=>storageMap.get(key)||null,setItem:(key,v)=>storageMap.set(key,String(v)),removeItem:key=>storageMap.delete(key)};
  const dir={name:'DTS Projeler',async getFileHandle(name,options={}){
    tried.push({name,create:!!options.create});
    if(tried.length>12)throw Error('Tekrarlanan dosya adı kontrolü: olası sonsuz döngü');
    if(!files.has(name)){
      if(!options.create)throw Object.assign(Error('file not found'),{name:'NotFoundError'});
      files.set(name,{text:'',stamp:1});
    }
    const item=files.get(name);
    return {name,async getFile(){return {size:Buffer.byteLength(item.text),lastModified:item.stamp,text:async()=>item.text}},async createWritable(){return {async write(s){item.text=String(s)},async close(){item.stamp++},async abort(){}}}};
  }};
  const env={showDirectoryPicker:async()=>dir};
  const store=Store.create({storage,indexedDB:null,env});
  return {store,files,tried};
}
async function saveToFolder(name,existing){const f=fixture(existing);await f.store.chooseFolder();const result=await f.store.save(project(name));return {...f,result};}

test('P1-14: saved .odsdevre title receives suffix before extension when name exists',async()=>{
  const f=await saveToFolder('Pano.odsdevre',['Pano.odsdevre']);
  assert.equal(f.result.saved,true);
  assert.equal(f.result.name,'Pano (2).odsdevre');
  assert.equal(f.files.get('Pano.odsdevre').text,'ORIGINAL FILE');
  assert.equal(JSON.parse(f.files.get('Pano (2).odsdevre').text).name,'Pano.odsdevre');
});
test('P1-14: generated (2) exists; choose (3) without overwriting',async()=>{
  const f=await saveToFolder('Pano.odsdevre',['Pano.odsdevre','Pano (2).odsdevre']);
  assert.equal(f.result.name,'Pano (3).odsdevre');
  assert.equal(f.files.get('Pano (2).odsdevre').text,'ORIGINAL FILE');
});
test('P1-14: 100-character title terminates and saves distinct (2) file',async()=>{
  const title='A'.repeat(100),f=await saveToFolder(title,[title+'.odsdevre']);
  assert.equal(f.result.saved,true);
  assert.equal(f.result.name,'A'.repeat(96)+' (2).odsdevre');
  assert.equal(f.files.get(title+'.odsdevre').text,'ORIGINAL FILE');
});
test('P1-14: 100-character title with occupied (2) picks (3)',async()=>{
  const title='A'.repeat(100),f=await saveToFolder(title,[title+'.odsdevre','A'.repeat(96)+' (2).odsdevre']);
  assert.equal(f.result.name,'A'.repeat(96)+' (3).odsdevre');
});
test('P1-14: no collision preserves exact legacy filename',async()=>{
  const f=await saveToFolder('Pano.odsdevre',[]);
  assert.equal(f.result.name,'Pano.odsdevre');
});
test('P1-14: name without extension still gets normal numbered suffix',async()=>{
  const f=await saveToFolder('Pano',['Pano.odsdevre']);
  assert.equal(f.result.name,'Pano (2).odsdevre');
});
test('P1-14: reserved Windows name remains escaped on collision',async()=>{
  const f=await saveToFolder('CON.odsdevre',['_CON.odsdevre']);
  assert.equal(f.result.name,'_CON (2).odsdevre');
});
test('P1-14: case-insensitive source suffix is not repeated in numbered copies',async()=>{
  const f=await saveToFolder('Pano.ODSDEVRE',['Pano.odsdevre']);
  assert.equal(f.result.name,'Pano (2).odsdevre');
});
