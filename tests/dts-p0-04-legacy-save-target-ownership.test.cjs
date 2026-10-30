'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const project=()=>({version:7,projectId:'mine',name:'Benim projem',components:[],wires:[]});
const legacy=()=>({version:7,name:'Başkasının eski projesi',components:[],wires:[]});
async function attempt({target=legacy(),empty=false,remember=false,saveAs=false}={}){
  let raw=empty?'':JSON.stringify(target),writes=0,after=raw;
  const handle={name:'legacy.odsdevre',
    queryPermission:async()=> 'granted',
    getFile:async()=>({size:after.length,text:async()=>after,lastModified:1}),
    createWritable:async()=>({write:async s=>{writes++;after=s},close:async()=>{},abort:async()=>{}})
  };
  const cache=new Map();
  const storage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
  const store=Projects.create({storage,indexedDB:null,env:{showSaveFilePicker:async()=>handle}});
  if(remember)await store.remember(project(),handle,1);
  let result,error;
  try{result=await store.save(project(),{saveAs})}catch(e){error=e}
  return {writes,before:raw,after,result,error};
}
test('P0-04 foreign ID-less legacy file cannot be overwritten through picker',async()=>{
  const x=await attempt();assert.equal(x.writes,0);assert.equal(x.after,x.before);
  assert.match(x.error?.message||'',/sahipliği doğrulanamadı/);
});
test('P0-04 remembered ID-less original can still be saved',async()=>{
  const x=await attempt({remember:true});assert.equal(x.writes,1);assert.equal(x.result.saved,true);
});
test('P0-04 empty new file remains writable',async()=>{
  const x=await attempt({empty:true});assert.equal(x.writes,1);
});
test('P0-04 matching ID target remains writable',async()=>{
  const x=await attempt({target:project()});assert.equal(x.writes,1);
});
test('P0-04 other project ID remains protected',async()=>{
  const x=await attempt({target:{...project(),projectId:'other'}});assert.equal(x.writes,0);assert.equal(x.after,x.before);
});
test('P0-04 protected template remains protected',async()=>{
  const x=await attempt({target:{...project(),defaultTemplate:{id:'golden',readOnly:true}}});
  assert.equal(x.writes,0);assert.equal(x.after,x.before);
});
test('P0-04 Save As never overwrites existing legacy file',async()=>{
  const x=await attempt({saveAs:true});assert.equal(x.writes,0);assert.equal(x.after,x.before);
});
test('P0-04 malformed target never gets overwritten',async()=>{
  const x=await attempt({target:{...project(),components:'bad'}});assert.equal(x.writes,0);assert.equal(x.after,x.before);
});
