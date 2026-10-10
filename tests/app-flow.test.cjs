const test=require('node:test'),assert=require('node:assert/strict');
const {createApp}=require('./helpers/offline-dom.cjs');
function scene(a,id){return a.$('#scene').querySelector('[data-id="'+id+'"]')}
function down(a,node,extra={}){node.emit('pointerdown',{clientX:400,clientY:300,...extra});a.window.emit('pointerup',{button:extra.button||0,buttons:0,clientX:400,clientY:300,...extra})}
function connect(a,c,p,d,q){down(a,scene(a,c).querySelector('[data-port="'+p+'"]'));down(a,scene(a,d).querySelector('[data-port="'+q+'"]'))}
test('actual app startup, drop focus, text editing, canvas focus and multi-select Delete',()=>{
  const a=createApp();const visible=a.window.DTSEditor.library.filter(d=>a.window.DTSWorkspaces.includes(d,'control')&&!d.superseded&&!d.tutorialOnly&&(!d.terminalCount||d.terminalCount===1)&&(!d.spliceOutputs||d.spliceOutputs===2)&&(!d.isPLC||['Siemens','Delta','Omron','GMTCNT'].includes(d.brand))&&a.window.CCSCatalog.matches(d,{category:'electrical'}));assert.equal(a.$('#componentLibrary').querySelectorAll('.component-card').length,visible.length);
  a.$('#propRef').focus();a.drop('lamp-green',300,300);assert.equal(a.document.activeElement,a.$('#viewport'));
  a.document.emit('keydown',{key:'Delete'});assert.equal(a.save().components.length,0);
  a.drop('lamp-green',300,300);a.drop('lamp-red',500,300);
  const p=a.save();a.$('#propRef').focus();a.document.emit('keydown',{key:'Delete'});assert.equal(a.save().components.length,2);
  down(a,scene(a,p.components[0].id).querySelector('.body'));assert.equal(a.document.activeElement,a.$('#viewport'));
  a.document.emit('keydown',{key:'Delete'});assert.equal(a.save().components.length,1);
  a.$('#undoBtn').click();assert.equal(a.save().components.length,2);
  a.$('#selectAllBtn').click();a.document.emit('keydown',{key:'Delete'});assert.equal(a.save().components.length,0);
});
test('drawing, branching, rejection and terminal reset through the application handlers',()=>{
  const a=createApp();a.drop('supply-3p',600,140);a.drop('lamp-green',300,500);a.drop('lamp-red',500,700);
  const [s,h,j]=a.save().components;connect(a,s.id,'N',h.id,'X2');connect(a,s.id,'L1',h.id,'X1');
  let p=a.save();assert.equal(p.wires[0].role,'N');assert.equal(p.wires[0].color,'#1e88e5');assert.equal(p.wires[1].role,'L1');
  connect(a,s.id,'L1',h.id,'X2');assert.ok(a.$('#toast').textContent.includes('doğrudan bağlanamaz'));assert.equal(a.save().wires.length,2);a.document.emit('keydown',{key:'Escape'});
  down(a,scene(a,j.id).querySelector('[data-port="X2"]'));down(a,a.$('[data-wire="'+p.wires[0].id+'"]'),{clientX:600,clientY:400});
  p=a.save();assert.equal(p.junctions.length,1);assert.equal(p.wires.length,4);assert.equal(p.components.find(c=>c.id===j.id)._terminalLines.X2.role,'N');
  const before=JSON.stringify([p.wires,p.junctions]);down(a,scene(a,s.id).querySelector('[data-port="L1"]'));down(a,a.$('[data-junction]'));p=a.save();assert.equal(JSON.stringify([p.wires,p.junctions]),before);a.document.emit('keydown',{key:'Escape'});
  const branch=p.wires.find(w=>w.from.c===j.id||w.to.c===j.id);down(a,a.$('[data-wire="'+branch.id+'"]'));a.document.emit('keydown',{key:'Delete'});
  assert.deepEqual(a.save().components.find(c=>c.id===j.id)._terminalLines,{});
  connect(a,s.id,'L2',j.id,'X2');assert.equal(a.save().components.find(c=>c.id===j.id)._terminalLines.X2.role,'L2');
});
test('right-click line settings update visible width by color and preserve net role when palette is reassigned',()=>{
  const a=createApp();a.drop('supply-3p',600,140);a.drop('lamp-green',300,500);const [s,h]=a.save().components;
  connect(a,s.id,'L1',h.id,'X1');connect(a,s.id,'N',h.id,'X2');let p=a.save();const w=p.wires.find(w=>w.role==='L1');
  down(a,a.$('[data-wire="'+w.id+'"]'),{button:2,buttons:2});assert.equal(a.$('#wireContextMenu').hidden,false);assert.equal(a.$('#contextWireRole').disabled,true);
  a.$('#contextWireSize').value='6 mm²';a.$('#applyWireContext').click();p=a.save();assert.equal(p.wires.find(x=>x.id===w.id).size,'6 mm²');assert.equal(p.wires.find(x=>x.role==='N').size,'1,5 mm²');
  assert.ok(a.$('[data-wire="'+w.id+'"]').getAttribute('style').includes('--wire-width:5px'));
  a.$('#wireRole').value='N';a.$('#wireRole').emit('change');assert.equal(a.save().colorRoles['#e53935'],'N');assert.equal(a.save().wires[0].role,'L1');assert.notEqual(a.save().wires[0].color,'#e53935');
});
test('3D sensor target can be added, dragged, removed, animated and resumed after tab visibility changes',()=>{
  const a=createApp({appearance:'material'});a.drop('proximity',300,300);const id=a.save().components[0].id;
  assert.equal(scene(a,id).querySelector('.sensor-target'),null);a.$('#propSensorTarget').value='metal';a.$('#propSensorTarget').emit('change');assert.ok(scene(a,id).querySelector('.sensor-target'));
  a.$('#propSensorRange').value=10;a.$('#propSensorRange').emit('change');a.$('#propSensorDistance').value=12;a.$('#propSensorDistance').emit('input');a.$('#propSensorDistance').emit('change');
  scene(a,id).querySelector('.sensor-target').emit('pointerdown',{clientX:500,clientY:350});a.window.emit('pointermove',{clientX:475,clientY:350});a.window.emit('pointerup',{buttons:0,clientX:475,clientY:350});
  assert.equal(a.save().components[0].sensing.distance,7);assert.equal(a.save().components[0].x,280);
  a.$('#propSensorAuto').checked=true;a.$('#propSensorAuto').emit('change');a.$('#simulateBtn').click();a.tick(50);a.tick(50);const old=a.save().components[0].sensing.distance;a.tick(50);assert.notEqual(a.save().components[0].sensing.distance,old);
  a.document.hidden=true;a.document.emit('visibilitychange');assert.equal(a.frames.size,0);const paused=a.save().components[0].sensing.distance;a.tick(200);assert.equal(a.save().components[0].sensing.distance,paused);
  a.document.hidden=false;a.document.emit('visibilitychange');a.tick(50);a.tick(50);assert.notEqual(a.save().components[0].sensing.distance,paused);
  a.$('#simulateBtn').click();assert.equal(a.frames.size,0);a.$('#propSensorTarget').value='none';a.$('#propSensorTarget').emit('change');assert.equal(scene(a,id).querySelector('.sensor-target'),null);
});


test('material physical normalization warns about legacy overlaps on startup and 3D view switch without moving devices',()=>{
  const legacyProject={
    version:7,workspaceMode:'control',name:'Malzeme oran kontrolü',symbolNorm:'IEC',
    components:[
      {id:'s18',typeId:'mcb-3p',ref:'S18',x:560,y:470,rotation:0,label:'Otomatik Sigorta'},
      {id:'s19',typeId:'mcb-2p',ref:'S19',x:660,y:470,rotation:0,label:'Otomatik Sigorta'}
    ],
    wires:[],junctions:[]
  };

  const material=createApp({project:legacyProject,appearance:'material'});
  assert.match(material.$('#toast').textContent,/1 malzeme çakışması/i);
  assert.deepEqual(material.save().components.map(c=>[c.id,c.x,c.y]),[['s18',560,470],['s19',660,470]]);

  const iec=createApp({project:legacyProject,appearance:'iec'});
  assert.doesNotMatch(iec.$('#toast').textContent,/malzeme çakışması/i);
  iec.$('#symbolMode').value='material';
  iec.$('#symbolMode').emit('change');
  assert.match(iec.$('#toast').textContent,/1 malzeme çakışması/i);
  assert.deepEqual(iec.save().components.map(c=>[c.id,c.x,c.y]),[['s18',560,470],['s19',660,470]]);
});
