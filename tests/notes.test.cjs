const test=require('node:test'),assert=require('node:assert/strict');
const {createApp}=require('./helpers/offline-dom.cjs');
const note=a=>a.$('[data-note-owner]')?.querySelector('[data-label-key="note"]');
const body=a=>a.$('#scene').querySelector('g.component');
const wires=a=>a.document.querySelectorAll('.wire').map(w=>w.getAttribute('d'));
test('note appears while typing, is drawn above all components, hides without deletion and restores its independent position',()=>{
  const a=createApp();a.drop('coil-contactor',300,300);const id=a.save().components[0].id;
  a.$('#propNote').value='Beslemeyi kontrol et\nK1 kontaktörü';a.$('#propNote').emit('input');
  assert.ok(note(a));assert.match(note(a).textContent,/K1 kontaktörü/);assert.equal(a.$('#propNote').value,'Beslemeyi kontrol et\nK1 kontaktörü');assert.equal(a.save().components[0].note,a.$('#propNote').value);
  assert.equal(a.$('#scene').children.at(-1).getAttribute('class'),'note-overlay-layer');
  const before=a.save().components[0],start={x:Number(note(a).dataset.baseX),y:Number(note(a).dataset.baseY)};
  note(a).querySelector('text').emit('pointerdown',{clientX:400,clientY:500});a.window.emit('pointermove',{clientX:480,clientY:470});a.window.emit('pointerup',{buttons:0,clientX:480,clientY:470});
  let c=a.save().components[0];assert.deepEqual(c.labelPositions.note,{x:start.x+80,y:start.y-30});assert.equal(c.x,before.x);assert.equal(c.y,before.y);
  const position=c.labelPositions.note;a.$('#propShowNote').checked=false;a.$('#propShowNote').emit('change');assert.equal(note(a),undefined);assert.equal(a.save().components[0].note,c.note);
  a.$('#propNote').value+='\nGizliyken eklenen satır';a.$('#propNote').emit('input');assert.equal(note(a),undefined);
  a.$('#propShowNote').checked=true;a.$('#propShowNote').emit('change');assert.match(note(a).textContent,/Gizliyken eklenen/);assert.deepEqual(a.save().components[0].labelPositions.note,position);
  a.drop('lamp-green',300,440);assert.equal(a.$('#scene').children.at(-1).getAttribute('class'),'note-overlay-layer');assert.equal(a.$('[data-note-owner="'+id+'"]').querySelector('[data-label-key="note"]')!==null,true);
  const saved=a.save();a.window.DTSStudio.load(saved);assert.deepEqual(a.save().components[0].labelPositions.note,position);assert.match(note(a).textContent,/K1 kontaktörü/);
});
test('a note edits as one undo operation and stays positioned in every norm, 3D mode, rotation and zoom',()=>{
  const a=createApp();a.drop('lamp-green',300,300);
  for(const value of ['M','Mo','Motor 1']){a.$('#propNote').value=value;a.$('#propNote').emit('input')}a.$('#propNote').emit('change');
  a.$('#undoBtn').click();assert.equal(a.save().components[0].note,'');assert.equal(note(a),undefined);a.$('#redoBtn').click();assert.equal(note(a).textContent,'Motor 1');
  for(const norm of ['TSE','IEC','ANSI']){a.$('#symbolNorm').value=norm;a.$('#symbolNorm').emit('change');assert.ok(note(a))}
  a.$('#symbolMode').value='material';a.$('#symbolMode').emit('change');assert.ok(note(a));
  // Select the note, then rotate the owning device through its properties.
  note(a).emit('pointerdown',{clientX:400,clientY:500});a.window.emit('pointerup',{buttons:0});a.$('#rotateBtn').click();
  assert.equal(a.save().components[0].rotation,90);assert.ok(!note(a).getAttribute('transform').includes('rotate'));
  a.$('#zoomIn').click();const base={x:Number(note(a).dataset.baseX),y:Number(note(a).dataset.baseY)};
  note(a).emit('pointerdown',{clientX:400,clientY:500});a.window.emit('pointermove',{clientX:510,clientY:555});a.window.emit('pointerup',{buttons:0});
  assert.deepEqual(a.save().components[0].labelPositions.note,{x:base.x+100,y:base.y+50});
  const label=note(a);label.focus();label.emit('keydown',{key:'ArrowLeft',shiftKey:true});assert.equal(a.save().components[0].labelPositions.note.x,base.x+90);
  a.$('#propNote').value='';a.$('#propNote').emit('input');assert.equal(note(a),undefined);
});
test('live note editing keeps current flowing, wire routes unchanged and energy indicators disappear on stop',()=>{
  for(const appearance of ['iec','material']){
    const a=createApp({appearance,project:{name:'Not denemesi',components:[{id:'s',typeId:'supply-1p',x:200,y:100,ref:'X1'},{id:'h',typeId:'lamp-green',x:400,y:400,ref:'H1'}],wires:[{id:'w1',from:{c:'s',p:'L'},to:{c:'h',p:'X1'},color:'#e53935',role:'L1',size:'1,5 mm²'},{id:'w2',from:{c:'h',p:'X2'},to:{c:'s',p:'N'},color:'#1e88e5',role:'N',size:'1,5 mm²'}]}});
    a.$('#scene').querySelector('[data-id="h"]').querySelector('.body').emit('pointerdown',{clientX:400,clientY:400});a.window.emit('pointerup',{buttons:0});
    a.$('#simulateBtn').click();assert.equal(a.window.DTSEditor.running,true);const old=wires(a);assert.ok(a.document.querySelectorAll('.wire.energized').length);assert.ok(a.document.querySelectorAll('.port.energized').length);
    a.$('#propNote').value='Lamba enerjili';a.$('#propNote').emit('input');assert.equal(a.window.DTSEditor.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.equal(note(a).textContent,'Lamba enerjili');assert.deepEqual(wires(a),old);
    a.$('#propShowNote').checked=false;a.$('#propShowNote').emit('change');a.$('#propShowNote').checked=true;a.$('#propShowNote').emit('change');assert.deepEqual(wires(a),old);
    a.$('#simulateBtn').click();assert.equal(a.document.querySelectorAll('.wire.energized').length,0);assert.equal(a.document.querySelectorAll('.port.energized').length,0);assert.equal(note(a).textContent,'Lamba enerjili');
  }
});
