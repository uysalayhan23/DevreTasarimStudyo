const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createApp}=require('./helpers/offline-dom.cjs');
const Projects=require('../dist/project-store.js'),P=require('../dist/panel.js');
const plain=x=>JSON.parse(JSON.stringify(x));
const node=(a,id)=>a.$('#scene').querySelector('[data-id="'+id+'"]');
const down=(a,n,extra={})=>{n.emit('pointerdown',{clientX:350,clientY:300,...extra});a.window.emit('pointerup',{buttons:0,clientX:350,clientY:300,...extra})};
const example=mode=>require('../dist/project-store.js').editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler',({control:'01_Kumanda_Muhurleme',building:'02_Tesisat_Vavien',panel:'03_Egitim_Panosu'}[mode])+'.odsdevre'))));
test('first launch opens dashboard, announces Yakub and safety; dismissal preference is independent from live-edit warnings',async()=>{
  const a=createApp({dashboard:true});await a.ready;
  assert.equal(a.window.DTSStudio.isHome,true);assert.equal(a.$('#dashboard').hidden,false);assert.equal(a.$('#safetyModal').hidden,false);
  assert.match(a.$('#safetyBody').textContent,/YAKUB UYSAL/);assert.equal(a.document.querySelectorAll('[data-new-mode]').length,4);assert.equal(a.document.querySelectorAll('[data-open-tutorial]').length,1);
  a.document.emit('keydown',{key:'Escape'});assert.equal(a.$('#safetyModal').hidden,false);
  a.$('#safetyDismiss').checked=true;a.$('#safetyAcknowledge').click();assert.equal(a.storage.get('dts-opening-warning'),'off');assert.equal(a.$('#showOpeningWarning').checked,false);
  a.$('#replayOpeningWarning').click();assert.equal(a.$('#safetyModal').hidden,false);a.$('#safetyAcknowledge').click();
  a.$('#showOpeningWarning').checked=true;a.$('#showOpeningWarning').emit('change');assert.equal(a.storage.get('dts-opening-warning'),'on');
  const b=createApp({dashboard:true,settings:{'dts-opening-warning':'off'}});await b.ready;assert.equal(b.$('#safetyModal').hidden,true);assert.equal(b.$('#dashboard').hidden,false);
});
test('dashboard creates each design mode, preserves drafts and returns home without deleting projects',async()=>{
  const a=createApp({dashboard:true,settings:{'dts-opening-warning':'off'}});await a.ready;
  for(const mode of ['control','building','panel']){
    a.$('[data-new-mode="'+mode+'"]').click();a.$('#newProjectName').value='Yakub '+mode;await a.$('#modalConfirm').onclick();
    assert.equal(a.window.DTSStudio.isHome,false);assert.equal(a.save().workspaceMode,mode);assert.equal(a.$('#viewport').hidden,mode==='panel');assert.equal(a.$('#panelWorkspace').hidden,mode!=='panel');assert.equal(a.$('#simulateBtn').disabled,mode==='panel');
    if(mode==='panel')a.$('#panelAddRail').click();else a.drop(mode==='building'?'ceiling-light':'coil-contactor',400,300);
    await a.window.DTSStudio.home();assert.equal(a.window.DTSStudio.isHome,true);
  }
  assert.equal(a.window.DTSStudio.store.list().length,3);assert.equal(a.document.querySelectorAll('[data-project-source="draft"]').length,3);
  const control=a.window.DTSStudio.store.list().find(p=>p.workspaceMode==='control');const saved=await a.window.DTSStudio.store.get(control.id);assert.equal(saved.components[0].typeId,'coil-contactor');
  a.window.DTSStudio.load(saved);assert.equal(a.save().name,'Yakub control');assert.equal(a.$('#simulateBtn').disabled,false);
});
test('favorites persist, alphabetize and respect design mode; PLC brands never appear in electrical tab',()=>{
  const a=createApp(),E=a.window.DTSEditor;
  for(const id of ['push-no','coil-contactor','lamp-green'])a.$('[data-favorite="'+id+'"]').click();
  a.$('#libraryGroupFilter').value='favorites';a.$('#libraryGroupFilter').emit('change');const names=a.document.querySelectorAll('.component-card strong').map(n=>n.textContent);assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b,'tr',{sensitivity:'base',numeric:true})));
  assert.equal(a.$('#libraryGroupFilter').querySelector('option').value,'favorites');assert.equal(a.$('#brandFilters').hidden,true);assert.equal(a.$('#brandFilters').children.length,0);
  a.$('[data-cat="plc"]').click();assert.equal(a.$('#brandFilters').hidden,false);assert.ok(a.$('[data-brand="Siemens"]'));assert.ok(a.$('[data-brand="Omron"]'));
  a.$('[data-cat="electrical"]').click();assert.equal(a.$('#brandFilters').hidden,true);assert.equal(a.$('#seriesFilterRow').hidden,true);
  E.create('building','Bina');assert.equal(a.$('[data-type="wall-vavien"]')!==null,true);assert.equal(a.$('[data-type="socket-power"]')!==null,true);assert.equal(a.$('[data-cat="plc"]'),null);
  E.create('control','Kumanda');assert.equal(a.$('[data-type="wall-vavien"]'),null);assert.equal(a.$('[data-type="socket-power"]'),null);assert.ok(a.$('[data-type="coil-contactor"]'));
  const fresh=createApp({settings:{'dts-favorites':a.storage.get('dts-favorites')}});fresh.$('#libraryGroupFilter').value='favorites';fresh.$('#libraryGroupFilter').emit('change');assert.equal(fresh.document.querySelectorAll('.component-card').length,3);
});
test('structural edits stay live during simulation and conductor touches show a non-blocking warning',()=>{
  const a=createApp({project:example('control')}),E=a.window.DTSEditor;
  a.$('#simulateBtn').click();assert.equal(E.running,true);
  const before=a.save().components.length;a.drop('lamp-green',900,500);assert.equal(E.running,true);assert.equal(a.save().components.length,before+1);assert.equal(a.$('#safetyModal').hidden,true);
  const source=node(a,'source');down(a,source.querySelector('[data-port="L"]'));assert.equal(E.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.match(a.$('#statusText').textContent,/canlı uygulanıyor/i);a.document.emit('keydown',{key:'Escape'});
  down(a,source.querySelector('.body'));a.document.emit('keydown',{key:'Delete'});assert.equal(E.running,true);assert.equal(a.save().components.some(c=>c.id==='source'),false);
});
test('normal start/stop interaction still animates before current flows and latching holds after release',()=>{
  const a=createApp({project:example('control'),appearance:'material'});a.$('#simulateBtn').click();assert.equal(a.window.DTSEditor.running,true);const start=node(a,'start');start.emit('pointerdown',{clientX:400,clientY:400});
  assert.equal(a.$('#safetyModal').hidden,true);assert.equal(a.save().components.find(c=>c.id==='start')._pressed,true);assert.equal(a.save().components.find(c=>c.id==='start').state,false);
  a.tick(16);a.tick(16);a.tick(90);assert.equal(a.save().components.find(c=>c.id==='start').state,true);a.window.emit('pointerup',{buttons:0});a.tick(150);
  assert.equal(a.save().components.find(c=>c.id==='start').state,false);assert.ok(a.save().components.some(c=>c.typeId==='coil-contactor'&&c._active));assert.equal(a.$('#safetyModal').hidden,true);
});
test('400% zoom keeps wire geometry byte-identical',()=>{
  const a=createApp({project:example('building')}),routes=()=>a.document.querySelectorAll('.wire').map(n=>n.getAttribute('d'));
  const before=routes();for(let i=0;i<40;i++)a.$('#zoomIn').click();assert.equal(a.$('#zoomLabel').textContent,'400%');assert.deepEqual(routes(),before);
  a.$('#viewport').emit('wheel',{deltaY:1500});assert.deepEqual(routes(),before);
});
test('panel interface moves mounted devices with their rail, opens/closes the door, saves and reloads the same layout',()=>{
  const a=createApp({project:example('panel'),appearance:'material'});assert.equal(a.$('#simulateBtn').disabled,true);a.$('[data-panel-view="plate"]').click();
  let p=a.save().panel;const r=p.rails[0],item=p.items.find(i=>i.railId===r.id),m=P.matrix(p,a.window.DTSPanelEditor.camera,'plate',20),q=P.project(m,r.x+5,r.y);
  a.$('[data-panel-id="'+r.id+'"]').emit('pointerdown',{clientX:q.x,clientY:q.y});a.window.emit('pointermove',{clientX:q.x,clientY:q.y+25*a.window.DTSPanelEditor.camera.scale});a.window.emit('pointerup',{buttons:0});
  p=a.save().panel;assert.equal(p.rails[0].y,r.y+25);assert.equal(p.items.find(i=>i.id===item.id).y,item.y+25);
  a.$('#undoBtn').click();assert.equal(a.save().panel.rails[0].y,r.y);a.$('#redoBtn').click();assert.equal(a.save().panel.rails[0].y,r.y+25);
  a.$('#panelToggleDoor').click();a.tick(1);a.tick(500);assert.equal(a.save().panel.doorAngle,0);a.$('#panelToggleDoor').click();a.tick(1);a.tick(500);assert.equal(a.save().panel.doorAngle,105);
  const saved=plain(a.save());a.window.DTSStudio.load(saved);assert.deepEqual(a.save().panel,saved.panel);
  a.$('[data-panel-view="plate"]').click();down(a,a.$('[data-panel-id="'+r.id+'"]'));a.document.emit('keydown',{key:'Delete'});p=a.save().panel;assert.equal(p.rails.length,2);assert.equal(p.items.find(i=>i.id===item.id).mount,'plate');assert.equal(p.items.find(i=>i.id===item.id).railId,undefined);
});


test('junction-aware wire dragging moves the junction only when branches stay straight, otherwise extends the dragged cable',()=>{
  const a=createApp({project:example('control')}),before=plain(a.save()),wire=before.wires.find(w=>w.id==='w3'),junction=before.junctions.find(j=>j.id==='feed');
  assert.ok(wire&&junction);down(a,a.$('[data-wire="'+wire.id+'"]'));
  const handle=a.document.querySelectorAll('[data-wire-segment]').find(n=>n.dataset.wireSegment==='0');assert.ok(handle,'junction-adjacent segment handle exists');
  const worldX=Number(handle.getAttribute('x'))+5,worldY=Number(handle.getAttribute('y'))+5,clientX=worldX+24,clientY=worldY+24,axis=handle.dataset.wireAxis;
  handle.emit('pointerdown',{clientX,clientY});a.window.emit('pointermove',{clientX:clientX+(axis==='vertical'?20:0),clientY:clientY+(axis==='horizontal'?20:0)});a.window.emit('pointerup',{buttons:0,clientX:clientX+(axis==='vertical'?20:0),clientY:clientY+(axis==='horizontal'?20:0)});
  const after=a.save(),afterJ=after.junctions.find(j=>j.id==='feed'),edited=after.wires.find(w=>w.id==='w3');
  const attachedBefore=before.wires.filter(w=>w.from.j==='feed'||w.to.j==='feed').length,attachedAfter=after.wires.filter(w=>w.from.j==='feed'||w.to.j==='feed').length;assert.equal(attachedAfter,attachedBefore);
  // feed has another branch leaving in the same horizontal direction, so an up/down drag must keep the junction and extend only w3.
  if(axis==='horizontal'){assert.deepEqual(afterJ,junction);assert.ok(edited.points.length>wire.points.length)}
  else assert.ok(afterJ.x===junction.x||afterJ.x===junction.x+20);
  a.$('#undoBtn').click();assert.deepEqual(a.save().junctions.find(j=>j.id==='feed'),junction);assert.deepEqual(a.save().wires.find(w=>w.id==='w3'),wire);
});



test('ohmmeter and instrumentation sensor are hidden from the library while their definitions remain load-compatible',()=>{
  const a=createApp(),E=a.window.DTSEditor,norm=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ç/g,'c').replace(/\s+/g,' ').trim();
  const requestedHidden=Object.values(E.byId).filter(d=>d.kind==='meter-ohm'||/\bohm\s*metre\b|\bohmmetre\b|\benstrumantasyon\s+sensoru\b/.test(norm(d.name)));
  assert.ok(requestedHidden.some(d=>d.kind==='meter-ohm'||/ohm/.test(norm(d.name))),'ohmmeter definition exists');
  assert.ok(requestedHidden.some(d=>/enstrumantasyon\s+sensoru/.test(norm(d.name))),'instrumentation sensor definition exists');
  for(const d of requestedHidden)assert.equal(E.library.some(x=>x.id===d.id),false,d.name+' is hidden from the library');
});


test('circuit edits auto-save the browser draft and tab close warns while the file copy is dirty',()=>{
  const a=createApp({project:example('control')}),before=a.save().components.length;
  a.drop('lamp-green',900,500);assert.equal(a.window.DTSStudio.hasUnsavedFileChanges,true);
  a.tick(400);const draft=JSON.parse(a.storage.get('ods-project'));assert.equal(draft.components.length,before+1);
  const closing=a.window.emit('beforeunload');assert.equal(closing.defaultPrevented,true);assert.equal(closing.returnValue,'');
  const flushed=JSON.parse(a.storage.get('ods-project'));assert.equal(flushed.components.length,before+1);
  a.window.DTSStudio.markClean();assert.equal(a.window.emit('beforeunload').defaultPrevented,undefined);
});
