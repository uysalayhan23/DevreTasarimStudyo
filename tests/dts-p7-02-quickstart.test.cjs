'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../dist/studio.js'),'utf8');
const start=source.indexOf('async function openStarter(id){');
const end=source.indexOf("$('#saveExampleCopy').onclick",start);
assert.ok(start>=0&&end>start,'Quick Start and example handler are present');
const snippet=source.slice(start,end);
function setup(){
 let current=0,home=true,visible=false,notices=0;
 const loaded=[],toasts=[],waiting=[],buttons={quickStartProject:{},exampleA:{dataset:{example:'control'}},exampleB:{dataset:{example:'building'}},missing:{dataset:{example:'missing'}},prototype:{dataset:{example:'__proto__'}}};
 const context={
   safety:{get visible(){return visible}},get isHome(){return home},
   projectRequests:{begin:()=>++current,isCurrent:t=>t===current,invalidate:()=>{current++}},
   preserve:()=>new Promise(resolve=>waiting.push(resolve)),
   window:{DTSStarterProjects:{control:{id:'control',defaultTemplate:{readOnly:true}},building:{id:'building',defaultTemplate:{readOnly:true}}}},
   Projects:{clean:p=>JSON.parse(JSON.stringify(p))},
   load:p=>{loaded.push(p);current++},protectedNotice:()=>{notices++},E:{toast:m=>toasts.push(m)},
   $:s=>buttons[s.slice(1)],document:{querySelectorAll:()=>[buttons.exampleA,buttons.exampleB,buttons.missing,buttons.prototype]}
 };
 vm.runInNewContext(snippet,context);
 return {buttons,waiting,loaded,toasts,get notices(){return notices},setHome:v=>home=v,setSafety:v=>visible=v};
}
test('Quick Start loads a protected control example only after preserving',async()=>{
 const x=setup(),p=x.buttons.quickStartProject.onclick();assert.equal(x.loaded.length,0);
 x.waiting.shift()();await p;assert.equal(x.loaded[0].id,'control');assert.equal(x.loaded[0].defaultTemplate.readOnly,true);assert.equal(x.notices,1);
});
test('latest example selection wins when earlier preservation finishes last',async()=>{
 const x=setup(),a=x.buttons.exampleA.onclick(),b=x.buttons.exampleB.onclick();
 x.waiting.pop()();await b;x.waiting.shift()();await a;
 assert.deepEqual(x.loaded.map(p=>p.id),['building']);assert.equal(x.notices,1);
});
test('dashboard exit and safety warning cancel pending Quick Start',async()=>{
 const x=setup(),p=x.buttons.quickStartProject.onclick();x.setHome(false);x.waiting.shift()();await p;
 assert.equal(x.loaded.length,0);
 const y=setup(),q=y.buttons.quickStartProject.onclick();y.setSafety(true);y.waiting.shift()();await q;assert.equal(y.loaded.length,0);
});
test('missing or prototype-named example fails closed',async()=>{
 const x=setup(),p=x.buttons.missing.onclick();x.waiting.shift()();await p;
 assert.equal(x.loaded.length,0);assert.deepEqual(x.toasts,['Hazır örnek bulunamadı.']);
 const y=setup(),q=y.buttons.prototype.onclick();y.waiting.shift()();await q;assert.equal(y.loaded.length,0);assert.deepEqual(y.toasts,['Hazır örnek bulunamadı.']);
});
test('Dashboard retains four workshop cards and an explicit Quick Start button',()=>{
 const html=fs.readFileSync(require('node:path').join(__dirname,'../dist/index.html'),'utf8');
 for(const mode of ['control','building','panel','arduino'])assert.ok(html.includes('data-new-mode="'+mode+'"'));
 assert.ok(html.includes('id="quickStartProject"'));
 assert.ok(source.includes('freeze(p)')&&source.includes('readOnly:true'));
});
