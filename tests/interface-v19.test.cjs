const {test}=require('node:test'),assert=require('node:assert/strict');const {createApp}=require('./helpers/offline-dom.cjs');
test('auxiliary contact is automatically inserted and returns to its saved schematic location',()=>{
 const a=createApp();a.drop('coil-pulse',400,300);let p=a.save();assert.equal(p.components.length,2);const aux=p.components.find(c=>c.auxFor),initial=[aux.x,aux.y],id=aux.id;a.window.DTSEditor.setAppearance('material');p=a.save();assert.equal(p.components.find(c=>c.id===id).x,p.components[0].x);assert.equal(a.$('g.component[data-id="'+id+'"] .material-art'),null);a.window.DTSEditor.setAppearance('iec');p=a.save();assert.deepEqual([p.components.find(c=>c.id===id).x,p.components.find(c=>c.id===id).y],initial);
});
test('duplicating a relay gives it a new associated auxiliary contact',()=>{
 const a=createApp();a.drop('coil-pulse',400,300);a.$('#duplicateBtn').click();const p=a.save(),parents=p.components.filter(c=>c.typeId==='coil-pulse');assert.equal(parents.length,2);assert.equal(p.components.length,4);for(const parent of parents)assert.equal(p.components.filter(c=>c.auxFor===parent.id&&c.ref===parent.ref).length,1);
});
test('a pending sensor failure never removes parts from a subsequently opened project',()=>{
 const project={version:7,name:'Reverse',workspaceMode:'control',components:[{id:'s',typeId:'supply-dc-plus',x:100,y:100,ref:'G1'},{id:'b',typeId:'proximity',x:400,y:100,ref:'B1'}],wires:[{id:'w1',from:{c:'s',p:'P'},to:{c:'b',p:'BU'}},{id:'w2',from:{c:'s',p:'M'},to:{c:'b',p:'BN'}}],junctions:[]};
 const a=createApp({project,appearance:'material'});a.$('#simulateBtn').click();assert.ok(a.$('.sensor-burn'));const next={...project,name:'Other',wires:[]};a.window.DTSStudio.load(next);a.tick(1000);assert.equal(a.save().components.length,2);assert.equal(a.save().name,'Other');
});
test('analog mode and position persist; material level float is an interactive control',()=>{
 const a=createApp();a.drop('sensor-level-analog',400,300);a.$('#propAnalogPosition').value='50';a.$('#propAnalogPosition').emit('change');a.$('#propAnalogMode').value='voltage';a.$('#propAnalogMode').emit('change');assert.ok(a.$('#scene').textContent.includes('5.00 V'));a.window.DTSEditor.setAppearance('material');assert.ok(a.$('[data-analog-handle]'));const p=a.save();assert.equal(p.components[0].analogMode,'voltage');const b=createApp({project:p});assert.equal(b.save().components[0].analogPosition,50);
});
test('reverse supply shows failure then removes sensor and attached wires',()=>{
 const project={version:7,name:'Reverse sensor',workspaceMode:'control',components:[{id:'s',typeId:'supply-dc-plus',x:100,y:100,ref:'G1'},{id:'b',typeId:'proximity',x:400,y:100,ref:'B1'}],wires:[{id:'w1',from:{c:'s',p:'P'},to:{c:'b',p:'BU'}},{id:'w2',from:{c:'s',p:'M'},to:{c:'b',p:'BN'}}],junctions:[]};
 const a=createApp({project});a.$('#simulateBtn').click();assert.ok(a.$('.sensor-burn'));a.tick(1000);assert.equal(a.save().components.some(c=>c.id==='b'),false);assert.equal(a.save().wires.length,0);assert.equal(a.$('#modal').hidden,false);assert.ok(a.$('#modalBody').textContent.includes('SENSÖR BOZULDU'));
});
