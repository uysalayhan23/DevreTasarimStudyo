const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createApp}=require('./helpers/offline-dom.cjs');
const example=name=>require('../dist/project-store.js').editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../',name)))),down=(a,n,extra={})=>{assert.ok(n);n.emit('pointerdown',{clientX:300,clientY:300,...extra});a.window.emit('pointerup',{buttons:0,...extra})},component=(a,id)=>a.$('#scene [data-id="'+id+'"]');
test('ACS800 connection artwork stays above its body after rotation, live updates and label selection',()=>{
 const project=example('Ornekler/ACS800_R5_Panel_ve_Yon_v1.17.odsdevre'),a=createApp({project,appearance:'material'}),E=a.window.DTSEditor,p=E.getProject(),drive=p.components.find(c=>c.typeId==='abb-acs800-r5');
 const check=()=>{const layer=a.$('.terminal-wire-overlay');assert.ok(layer);assert.ok(a.$('#scene').children.indexOf(layer)>a.$('#scene').children.indexOf(component(a,drive.id)));
  for(const w of p.wires.filter(w=>w.from.c===drive.id||w.to.c===drive.id)){const top=a.$('[data-terminal-overlay="'+drive.id+'"][data-wire="'+w.id+'"]'),base=a.$('#scene [data-wire="'+w.id+'"]');assert.ok(top);assert.equal(top.querySelector('.wire').getAttribute('d'),base.querySelector('.wire').getAttribute('d'));assert.equal(top.querySelector('.wire').getAttribute('stroke'),w.color);assert.match(top.querySelector('.wire-hit').getAttribute('clip-path'),/-hit\)/);}
 };
 check();const endpoints=JSON.stringify(p.wires.map(w=>[w.from,w.to]));for(const rotation of [90,180,270,0]){drive.rotation=rotation;drive.materialScale=.8;E.render();check()}assert.equal(JSON.stringify(p.wires.map(w=>[w.from,w.to])),endpoints);
 const label=component(a,drive.id).querySelector('[data-label-key="ref"]');if(label){down(a,label);check()}
 a.$('#simulateBtn').click();E.render(true);check();assert.equal(E.running,true);const port=component(a,drive.id).querySelector('[data-port="X21:3"]');down(a,port);assert.equal(E.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.match(a.$('#statusText').textContent,/canlı uygulanıyor/i);
 const reopened=createApp({project:a.save(),appearance:'material'});assert.ok(reopened.$('[data-terminal-overlay="'+drive.id+'"]'));reopened.window.DTSEditor.setAppearance('iec');assert.equal(reopened.$('.terminal-wire-overlay'),null);
});
test('panel cable color applies immediately from the toolbar and sidebar, with independent styles and undo/save',()=>{
 const a=createApp({project:example('Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'),appearance:'material'});a.$('[data-panel-view="plate"]').click();
 const item=ref=>a.save().panel.items.find(i=>i.ref===ref),pin=(ref,id)=>a.$('[data-panel-owner="'+item(ref).id+'"][data-panel-terminal="'+id+'"]');
 down(a,pin('Q1','2'));down(a,pin('K1','1'));const first=a.save().panel.wires[0],ends=JSON.stringify([first.from,first.to]);
 a.$('#panelWireColor').value='#ffffff';a.$('#panelWireColor').emit('change');assert.equal(a.save().panel.wires[0].color,'#ffffff');assert.equal(a.save().panel.wires[0].role,first.role);assert.equal(a.$('#panelSelectedWireColor').value,'#ffffff');
 a.$('#panelSelectedWireColor').value='#808080';a.$('#panelSelectedWireColor').emit('change');assert.equal(a.save().panel.wires[0].color,'#808080');
 a.$('#panelWireCustom').value='#ec4899';a.$('#panelWireCustom').emit('change');assert.equal(a.save().panel.wires[0].color,'#ec4899');assert.equal(a.$('#panelWireColor').value,'#ec4899');
 a.$('#undoBtn').click();assert.equal(a.save().panel.wires[0].color,'#808080');a.$('#redoBtn').click();assert.equal(a.save().panel.wires[0].color,'#ec4899');
 down(a,pin('K1','1'));down(a,pin('K2','A1'));const second=a.save().panel.wires[1];a.$('#panelWireColor').value='#1e88e5';a.$('#panelWireColor').emit('change');assert.equal(a.save().panel.wires[0].color,'#ec4899');assert.equal(a.save().panel.wires[1].color,'#1e88e5');
 down(a,a.$('[data-panel-id="'+item('K1').id+'"]'));const entry=a.$('[data-panel-select-wire="'+first.id+'"]');assert.ok(entry);entry.click();assert.equal(a.$('#panelWireCustom').value,'#ec4899');assert.match(a.$('#panelWireColorLabel').textContent,/Seçili/);
 assert.equal(JSON.stringify([a.save().panel.wires[0].from,a.save().panel.wires[0].to]),ends);const saved=a.save();a.window.DTSStudio.load(saved);assert.deepEqual(a.save().panel.wires.map(w=>[w.id,w.color,w.role]),saved.panel.wires.map(w=>[w.id,w.color,w.role]));assert.equal(a.save().panel.wires[1].id,second.id);
});
