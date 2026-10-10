const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Projects=require('../dist/project-store.js');
const {createApp}=require('./helpers/offline-dom.cjs');
const raw=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler',name+'.odsdevre')));
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
const blank=()=>({name:'Boş',projectId:'new',components:[],wires:[]});
function handle(p=blank()){let data=JSON.stringify(p),writes=0;return {kind:'file',name:'Kopyam.odsdevre',getFile:async()=>({text:async()=>data,lastModified:1,size:data.length}),createWritable:async()=>({write:async s=>{data=s;writes++},close:async()=>{}}),get writes(){return writes},get project(){return JSON.parse(data)}};}
test('protected originals cannot be saved or overwritten; only a successful Save As yields an editable new identity',async()=>{
 const p=raw('01_Kumanda_Muhurleme'),original=JSON.stringify(p),source=handle(p);let destination=source;const store=Projects.create({storage:memory(),env:{showSaveFilePicker:async()=>destination}});
 assert.equal(Projects.isProtected(p),true);await store.put(p);assert.equal(store.list().length,0);await assert.rejects(store.save(p),/Farklı Kaydet/);await assert.rejects(store.save(p,{saveAs:true}),/örnek|Örnek/);assert.equal(source.writes,0);
 destination=handle();const result=await store.save(p,{saveAs:true});assert.equal(result.saved,true);assert.equal(Projects.isProtected(result.project),false);assert.notEqual(result.project.projectId,p.projectId);assert.equal(result.project.sourceExample,p.defaultTemplate.id);assert.equal(JSON.stringify(p),original);
 destination=source;await assert.rejects(store.save(result.project,{saveAs:true}),/örnek|Örnek/);assert.equal(source.writes,0);
});
test('cancel, disk error and download fallback leave the active default protected',async()=>{
 const p=raw('01_Kumanda_Muhurleme');const cancelled=Projects.create({storage:memory(),env:{showSaveFilePicker:async()=>{throw Object.assign(Error(),{name:'AbortError'})}}});assert.equal((await cancelled.save(p,{saveAs:true})).cancelled,true);
 const bad=handle();bad.createWritable=async()=>{throw Error('Disk dolu')};await assert.rejects(Projects.create({storage:memory(),env:{showSaveFilePicker:async()=>bad}}).save(p,{saveAs:true}),/Disk dolu/);
 let download=false;const fallback=Projects.create({storage:memory(),env:{Blob,URL:{createObjectURL:()=> 'blob:copy',revokeObjectURL(){}},setTimeout:fn=>fn(),document:{createElement:()=>({click(){download=true}})}}});const result=await fallback.save(p,{saveAs:true});assert.equal(download,true);assert.equal(result.requiresOpen,true);assert.equal(Projects.isProtected(result.project),false);assert.equal(Projects.isProtected(p),true);
});
test('default UI blocks structural and property edits, restores simulated states, and unlocks only the saved copy',async()=>{
 let cancel=true;const out=handle(),a=createApp({project:raw('01_Kumanda_Muhurleme'),environment:{showSaveFilePicker:async()=>{if(cancel)throw Object.assign(Error(),{name:'AbortError'});return out}}}),E=a.window.DTSEditor;await a.ready;
 const before=Projects.clean(a.save()),select=()=>a.$('#scene [data-id="source"] .body').emit('pointerdown',{clientX:180,clientY:100});assert.equal(a.$('#exampleProtection').hidden,false);select();
 for(const action of [()=>a.drop('lamp-green',900,500),()=>a.$('#deleteBtn').click(),()=>a.$('#rotateBtn').click(),()=>{a.$('#propLabel').value='Değiştirme';a.$('#propLabel').emit('change')},()=>{a.$('#propNote').value='Not değişikliği';a.$('#propNote').emit('input')},()=>a.$('#renameSheet').click()]){action();assert.equal(a.$('#modalTitle').textContent,'Hazır örnek korunuyor');a.$('#modalCancel').click();assert.deepEqual(Projects.clean(a.save()),before);}
 a.$('#simulateBtn').click();const start=a.$('#scene [data-id="start"]');start.emit('pointerdown',{pointerId:1});a.tick(16);a.tick(16);a.tick(100);a.window.emit('pointerup',{pointerId:1});a.tick(150);assert.equal(E.running,true);E.stop();assert.deepEqual(Projects.clean(a.save()),before);
 await a.window.DTSStudio.save(true);assert.equal(a.window.DTSStudio.isProtected,true);assert.equal(a.$('#exampleProtection').hidden,false);cancel=false;await a.window.DTSStudio.save(true);assert.equal(a.window.DTSStudio.isProtected,false);assert.equal(a.$('#exampleProtection').hidden,true);assert.notEqual(a.save().projectId,before.projectId);a.drop('lamp-green',900,500);assert.equal(a.save().components.length,before.components.length+1);assert.equal(out.project.components.length,before.components.length);
});
test('bundled panel and starter definitions remain protected; camera inspection does not unlock editing',async()=>{
 const a=createApp({project:raw('03_Egitim_Panosu')});await a.ready;const before=JSON.stringify(a.save().panel);a.$('#panelAddRail').click();a.$('#modalCancel').click();assert.equal(JSON.stringify(a.save().panel),before);a.$('[data-panel-view="plate"]').click();assert.equal(JSON.stringify(a.save().panel),before);assert.equal(a.window.DTSStudio.isProtected,true);for(const p of Object.values(a.window.DTSStarterProjects)){assert.equal(Projects.isProtected(p),true);assert.equal(Object.isFrozen(p),true);}
});
