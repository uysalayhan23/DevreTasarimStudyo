const {test}=require('node:test'),assert=require('node:assert/strict'),{createApp}=require('./helpers/offline-dom.cjs'),V=require('../dist/v20.js');
function project(){const v={id:'v',typeId:V.id,x:450,y:240,ref:'U1'};V.create(v);V.set(v,'P1040',25);return {name:'V20 çalışma',workspaceMode:'control',components:[{id:'g',typeId:'supply-1p',x:180,y:100,ref:'G1'},v,{id:'m',typeId:'motor-3p',x:900,y:400,ref:'M1',motorConnection:'delta'}],wires:[['g','L','v','L1'],['g','N','v','N'],['v','U','m','U'],['v','V','m','V'],['v','W','m','W']].map(([a,b,c,d],i)=>({id:'w'+i,from:{c:a,p:b},to:{c,p:d}})),junctions:[]};}
const down=(a,node)=>{node.emit('pointerdown',{clientX:450,clientY:350});a.window.emit('pointerup',{buttons:0});};
const comp=(a,id)=>a.$('#scene g.component[data-id="'+id+'"]');
const body=(a,id)=>a.$('#scene [data-component-backdrop="'+id+'"] .body')||comp(a,id)?.querySelector('.body');
test('sidebar parameter window works live in both views; bodies stay selectable, terminals/wires warn without stopping',()=>{
 for(const appearance of ['iec','material']){
  const a=createApp({project:project(),appearance}),E=a.window.DTSEditor;a.$('#simulateBtn').click();
  for(const id of ['g','m','v']){down(a,body(a,id));assert.equal(E.running,true,id);assert.equal(a.$('#safetyModal').hidden,true);}
  a.$('#v20Parameters').click();assert.equal(a.$('#v20Modal').hidden,false);assert.equal(E.running,true);assert.match(a.$('#v20Content').textContent,/HAZIR/);
  a.$('[data-v20-command="run"]').click();a.tick(5000);assert.equal(E.getProject().components.find(c=>c.id==='v')._v20.hz,25);assert.match(a.$('[data-v20-live]').textContent,/ÇALIŞIYOR/);assert.equal(E.getProject().components.find(c=>c.id==='m')._spin,1);
  a.$('[data-v20-tab="parameters"]').click();a.$('#v20Search').value='P1120';a.$('#v20Search').emit('input');const value=a.$('[data-v20-param="P1120"]');value.value='2';value.emit('change');assert.equal(E.getProject().components.find(c=>c.id==='v').v20.params.P1120,2);assert.equal(E.running,true);
  a.$('#v20Search').value='P0700';a.$('#v20Search').emit('input');const source=a.$('[data-v20-param="P0700"]');source.value='2';source.emit('change');assert.equal(source.value,'1');assert.equal(a.$('#v20Error').hidden,false);
  a.$('#v20Close').click();assert.equal(a.$('#v20Modal').hidden,true);down(a,comp(a,'v').querySelector('[data-v20-action="stop"]'));a.tick(10000);assert.equal(E.running,true);
  const topology=E.getProject().wires.length;down(a,comp(a,'v').querySelector('[data-port="8"]'));assert.equal(E.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.equal(E.getProject().wires.length,topology);assert.match(a.$('#statusText').textContent,/canlı uygulanıyor/i);
  down(a,a.$('[data-wire="w0"]'));assert.equal(E.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.match(a.$('#statusText').textContent,/canlı uygulanıyor/i);
 }
});
test('new V20 BOP buttons, parameter shortcut and keyboard action share the same controller',()=>{
 const a=createApp({project:project()}),E=a.window.DTSEditor;a.$('#simulateBtn').click();down(a,comp(a,'v').querySelector('[data-v20-action="run"]'));a.tick(5000);assert.equal(E.getProject().components.find(c=>c.id==='v')._v20.hz,25);
 comp(a,'v').querySelector('[data-v20-action="reverse"]').emit('keydown',{key:'Enter'});a.tick(10000);assert.equal(E.getProject().components.find(c=>c.id==='v')._v20.hz,-25);
 down(a,comp(a,'v').querySelector('[data-v20-action="params"]'));assert.equal(a.$('#v20Modal').hidden,false);a.$('#v20Close').emit('keydown',{key:'Escape'});assert.equal(a.$('#v20Modal').hidden,true);assert.equal(E.running,true);
});


test('material V20 renders the canonical front photo at verified physical size without a synthetic BOP overlay',()=>{
  const material=createApp({project:project(),appearance:'material'}),E=material.window.DTSEditor;
  const definition=material.window.DTSPhysicalMetadata.materialDefinition(E.byId[V.id]);
  assert.equal(definition.w,181.6);
  assert.equal(definition.h,321.8);
  const node=comp(material,'v');
  const backdrop=material.$('#scene [data-component-backdrop="v"]');
  assert.ok(backdrop);
  assert.match(backdrop.innerHTML,/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2\.webp/);
  assert.equal(node.querySelector('.v20-bop'),null);
  assert.ok(node.querySelector('.v20-photo-controls'));
  for(const key of ['stop','run','params','display','up','down'])assert.ok(node.querySelector('[data-v20-action="'+key+'"]'),key);
  for(const pin of ['PE','L1','N','13','13b','14','14b','12','15','16','1','2','3','4','5','6','7','8','9','10','11','17','18','19','U','V','W','DC-','DC+','PE2'])assert.ok(node.querySelector('[data-port="'+pin+'"]'),pin);

  const iec=createApp({project:project(),appearance:'iec'});
  assert.ok(comp(iec,'v').querySelector('.v20-bop'));
  assert.equal(comp(iec,'v').querySelector('.v20-photo-controls'),null);
});

test('material V20 body is below wires while terminals and controls remain above wires',()=>{
  const a=createApp({project:project(),appearance:'material'}),scene=a.$('#scene');
  const backdrop=scene.querySelector('[data-component-backdrop="v"]');
  const wire=scene.querySelector('[data-wire="w0"]');
  const overlay=scene.querySelector('g.component[data-id="v"]');
  assert.ok(backdrop);
  assert.ok(wire);
  assert.ok(overlay);
  const children=[...scene.children];
  assert.ok(children.indexOf(backdrop)<children.indexOf(wire));
  assert.ok(children.indexOf(wire)<children.indexOf(overlay));
  assert.equal(backdrop.dataset.id,'v');
  assert.ok(backdrop.querySelector('.body'));
  assert.equal(backdrop.querySelector('.v20-photo-controls'),null);
  assert.ok(overlay.querySelector('.v20-photo-controls'));
  assert.ok(overlay.querySelector('[data-port="L1"]'));
  assert.equal(overlay.querySelector('.material-layer'),null);
});

test('Physical.get exposes the V20 wireOverBody contract used by the renderer',()=>{
  const a=createApp({project:project(),appearance:'material'}),E=a.window.DTSEditor;
  const d=E.byId[V.id];
  const physical=a.window.DTSPhysicalMetadata.get(d);
  assert.ok(physical);
  assert.equal(physical.wireOverBody,true);
  assert.ok(a.$('#scene').querySelector('[data-component-backdrop="v"]'));
});
