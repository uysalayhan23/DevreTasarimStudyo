'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../dist/studio.js'),'utf8');
function slice(start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a);
 assert.ok(a>=0&&b>a,'required real studio handler is present: '+start);
 return source.slice(a,b);
}
const handlers=slice('function createProject(mode){','async function renderProjects(')
 +slice('async function open(){','async function save(')
 +slice("$('#fileInput').onchange=","$('#homeBtn').onclick=");
function deferred(){
 let resolve,reject;
 const promise=new Promise((yes,no)=>{resolve=yes;reject=no});
 return {promise,resolve,reject};
}
function fixture({deferPreserve=false}={}){
 let current=0,safetyVisible=false;
 const opens=[],preserves=[],loads=[],creates=[],toasts=[];
 const els={
  '#fileInput':{clicks:0,click(){this.clicks++}},
  '#modal':{hidden:true},'#modalTitle':{},'#modalBody':{},
  '#modalConfirm':{},'#modalCancel':{},
  '#newProjectName':{value:'Örnek',focus(){}}
 };
 const ctx={
  get safety(){return {visible:safetyVisible}},
  projectRequests:{begin:()=>++current,invalidate:()=>++current,isCurrent:t=>t===current},
  W:{normalize:x=>x},modeName:()=> 'Kumanda',esc:x=>x,$:s=>els[s],
  store:{openFile:()=>{const d=deferred();opens.push(d);return d.promise}},
  preserve:()=>{if(!deferPreserve)return Promise.resolve();const d=deferred();preserves.push(d);return d.promise},
  Projects:{parse:JSON.parse},
  load:p=>{loads.push(p);current++},
  E:{create:(mode,name)=>creates.push({mode,name}),getProject:()=>({}),setAppearance(){},toast:m=>toasts.push(m)},
  showEditor(){},markDirty(){},checkpoint:async()=>{}
 };
 vm.runInNewContext(handlers+'\nthis.__testHandlers={open,createProject};',ctx,{timeout:1000});
 return {api:ctx.__testHandlers,opens,preserves,loads,creates,toasts,els,
  invalidate:()=>++current,setSafety:value=>{safetyVisible=value}};
}
test('P0-04 newer native picker wins even when older picker finishes last',async()=>{
 const x=fixture(),first=x.api.open(),second=x.api.open();
 x.opens[1].resolve({project:{id:'new'}});await second;
 x.opens[0].resolve({project:{id:'old'}});await first;
 assert.deepEqual(x.loads.map(p=>p.id),['new']);
});
test('P0-04 an earlier picker cannot replace another selected project',async()=>{
 const x=fixture(),pending=x.api.open();x.invalidate();
 x.opens[0].resolve({project:{id:'old'}});await pending;
 assert.equal(x.loads.length,0);
});
test('P0-04 a newly visible safety warning cancels pending native open',async()=>{
 const x=fixture(),pending=x.api.open();x.setSafety(true);
 x.opens[0].resolve({project:{id:'old'}});await pending;
 assert.equal(x.loads.length,0);
});
test('P0-04 a stale picker error cannot display a misleading toast',async()=>{
 const x=fixture(),pending=x.api.open();x.invalidate();
 x.opens[0].reject(Error('old failure'));await pending;
 assert.equal(x.toasts.length,0);
});
test('P0-04 native picker fallback still opens local file input',async()=>{
 const x=fixture(),pending=x.api.open();x.opens[0].resolve({fallback:true});await pending;
 assert.equal(x.els['#fileInput'].clicks,1);
});
test('P0-04 cancelled native picker does not replace a project',async()=>{
 const x=fixture(),pending=x.api.open();x.opens[0].resolve({cancelled:true});await pending;
 assert.equal(x.loads.length,0);
});
test('P0-04 newer file input read wins after out-of-order completion',async()=>{
 const x=fixture(),a=deferred(),b=deferred();
 const ea={target:{files:[{text:()=>a.promise}],value:'a'}};
 const eb={target:{files:[{text:()=>b.promise}],value:'b'}};
 const first=x.els['#fileInput'].onchange(ea),second=x.els['#fileInput'].onchange(eb);
 b.resolve('{"id":"new"}');await second;
 a.resolve('{"id":"old"}');await first;
 assert.deepEqual(x.loads.map(p=>p.id),['new']);
 assert.equal(ea.target.value,'');assert.equal(eb.target.value,'');
});
test('P0-04 file input read cannot replace another selected project',async()=>{
 const x=fixture(),d=deferred(),e={target:{files:[{text:()=>d.promise}],value:'a'}};
 const pending=x.els['#fileInput'].onchange(e);x.invalidate();
 d.resolve('{"id":"old"}');await pending;
 assert.equal(x.loads.length,0);assert.equal(e.target.value,'');
});
test('P0-04 safety warning cancels pending file input read',async()=>{
 const x=fixture(),d=deferred(),e={target:{files:[{text:()=>d.promise}],value:'a'}};
 const pending=x.els['#fileInput'].onchange(e);x.setSafety(true);
 d.resolve('{"id":"old"}');await pending;
 assert.equal(x.loads.length,0);assert.equal(e.target.value,'');
});
test('P0-04 invalid current file reports error and resets input',async()=>{
 const x=fixture(),e={target:{files:[{text:async()=>'{broken'}],value:'a'}};
 await x.els['#fileInput'].onchange(e);
 assert.equal(x.toasts.length,1);assert.match(x.toasts[0],/Proje açılamadı/);
 assert.equal(e.target.value,'');
});
test('P0-04 stale new-project confirmation cannot overwrite later selection',async()=>{
 const x=fixture({deferPreserve:true});x.api.createProject('control');
 const pending=x.els['#modalConfirm'].onclick();x.invalidate();
 x.preserves[0].resolve();await pending;
 assert.equal(x.creates.length,0);
});
test('P0-04 new-project confirmation still creates a valid project',async()=>{
 const x=fixture();x.api.createProject('control');
 await x.els['#modalConfirm'].onclick();
 assert.equal(x.creates.length,1);assert.equal(x.creates[0].mode,'control');
});
test('P0-04 native picker rechecks selection after preserving old draft',async()=>{
 const x=fixture({deferPreserve:true}),pending=x.api.open();
 x.opens[0].resolve({project:{id:'old'}});
 await Promise.resolve();await Promise.resolve();
 assert.equal(x.preserves.length,1);
 x.invalidate();x.preserves[0].resolve();await pending;
 assert.equal(x.loads.length,0);
});
test('P0-04 file input rechecks selection after preserving old draft',async()=>{
 const x=fixture({deferPreserve:true});
 const e={target:{files:[{text:async()=> '{"id":"old"}'}],value:'a'}};
 const pending=x.els['#fileInput'].onchange(e);
 await Promise.resolve();await Promise.resolve();
 assert.equal(x.preserves.length,1);
 x.invalidate();x.preserves[0].resolve();await pending;
 assert.equal(x.loads.length,0);
});
test('P8-01 HTML revision refreshes offline studio handler',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.ok(html.includes('studio.js?rev=20261030-p0-open-race1'));
});
