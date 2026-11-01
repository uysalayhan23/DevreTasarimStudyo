'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

const project=version=>({projectId:'p1',name:'Test',version,components:[],wires:[]});
function harness(){
 const actions=[];
 const env={
  Blob:class {constructor(data){this.text=data.join('')}},
  URL:{createObjectURL(blob){actions.push({kind:'blob',data:blob.text});return 'blob:offline'},revokeObjectURL(){}},
  document:{createElement(){return{click(){actions.push({kind:'click'})}}}},
  setTimeout(){}
 };
 const storage={getItem(){return null},setItem(){},removeItem(){}};
 return {actions,download:Projects.create({storage,indexedDB:null,env}).download};
}
test('P0-04 direct export rejects versions that cannot be reopened before any side effect',()=>{
 for(const version of [4,999,'invalid',6.5,Infinity]){
  const {actions,download}=harness();
  assert.throws(()=>download(project(version)),/şema sürümü/);
  assert.deepEqual(actions,[]);
 }
});
test('P0-04 direct export still writes compatible versions',()=>{
 for(const version of [5,6,7]){
  const {actions,download}=harness();
  assert.deepEqual(download(project(version)),{download:true,name:'Test.odsdevre'});
  assert.equal(actions.filter(x=>x.kind==='click').length,1);
  assert.equal(JSON.parse(actions.find(x=>x.kind==='blob').data).version,version);
 }
});
test('P0-04 malformed project cannot create a downloadable blob',()=>{
 const {actions,download}=harness();
 assert.throws(()=>download({name:'Corrupted',version:7,components:{},wires:[]}));
 assert.deepEqual(actions,[]);
});
test('P0-04 direct export preserves project identity and valid data',()=>{
 const {actions,download}=harness();
 download({...project(7),components:[{id:'r1',typeId:'resistor',x:20,y:40}]});
 const saved=JSON.parse(actions.find(x=>x.kind==='blob').data);
 assert.equal(saved.projectId,'p1');
 assert.equal(saved.name,'Test');
 assert.equal(saved.components[0].typeId,'resistor');
});
