const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),{createApp}=require('./helpers/offline-dom.cjs');
const copy=v=>JSON.parse(JSON.stringify(v)),scene=(a,id)=>a.$('#scene [data-id="'+id+'"]'),wireNode=(a,id)=>a.$('#scene [data-wire="'+id+'"]');
function down(a,node,extra={}){node.emit('pointerdown',{clientX:300,clientY:300,...extra});a.window.emit('pointerup',{clientX:300,clientY:300,buttons:0,button:extra.button||0})}
function port(a,c,p){const d=a.window.DTSAssemblies.definition(a.window.DTSEditor.byId[c.typeId],c,'material'),q=a.window.CCSSymbols.rotatedPoint(d.pins.find(q=>q.id===p),d,c.rotation||0);return {x:c.x+q.x*(c.materialScale||1),y:c.y+q.y*(c.materialScale||1)}}
function fixture(){
 const ctx={window:{DTSStarterProjects:{}}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/starter-v115.js'),'utf8'),ctx);const p=copy(ctx.window.DTSStarterProjects.tx115),old=p.components.find(c=>c.typeId==='meter-ammeter').id;
 p.components=p.components.filter(c=>c.id!==old);p.wires=p.wires.filter(w=>w.from.c!==old&&w.to.c!==old);const tx=p.components.find(c=>c.typeId==='weighing-indicator');
 p.components.push({id:'x',typeId:'terminal-2-array-3',x:1000,y:400},{id:'m',typeId:'unit-ut33d-plus',x:150,y:550,meterPosition:10},{id:'probe-r',typeId:'test-probe-red',probeFor:'m',x:500,y:650,probeTarget:{w:'iout',t:.55}},{id:'k',typeId:'test-probe-black',probeFor:'m',x:500,y:850,probeTarget:{w:'ground',t:.6}});
 for(const [id,pin,to] of [['iout','I','1'],['vout','V','3'],['ground','G','5']])p.wires.push({id,from:{c:tx.id,p:pin},to:{c:'x',p:to}});
 p.wires.push({id:'redlead',from:{c:'m',p:'V'},to:{c:'probe-r',p:'PLUG'}},{id:'blacklead',from:{c:'m',p:'COM'},to:{c:'k',p:'PLUG'}});return p;
}
test('TX11 selector, live wire probes and wires above the photo work together',()=>{
 const a=createApp({project:fixture(),appearance:'material'}),p=a.window.DTSEditor.getProject(),tx=p.components.find(c=>c.typeId==='weighing-indicator'),cell=p.components.find(c=>c.typeId==='load-cell'),m=p.components.find(c=>c.id==='m'),r=p.components.find(c=>c.id==='probe-r');
 const layer=a.$('.terminal-wire-overlay'),components=a.$('#scene').children;assert(layer);assert.ok(components.indexOf(layer)>components.indexOf(scene(a,tx.id)));assert.ok(layer.querySelectorAll('[data-terminal-overlay="'+tx.id+'"]').length>=7);
 const underlying=wireNode(a,'vout').querySelector('.wire').getAttribute('d'),top=a.$('[data-terminal-overlay="'+tx.id+'"][data-wire="vout"] .wire');assert.equal(top.getAttribute('d'),underlying);assert.match(top.parentNode.getAttribute('clip-path'),/tx-terminal-clip/);
 a.$('#simulateBtn').click();assert.equal(m._meter.unit,'mA');assert.equal(m._meter.display,'8.000');
 down(a,scene(a,tx.id).querySelector('.body'));a.$('#safetyAcknowledge').click();const select=a.$('[data-instrument-param="output"]');select.value='0-10V';select.emit('change');assert.equal(tx.instrumentSettings.output,'0-10V');
 down(a,scene(a,m.id).querySelector('.body'));let range=a.$('[data-thermal-param="meterPosition"]');range.value='3';range.emit('change');if(!a.window.DTSEditor.running)a.$('#simulateBtn').click();
 const start=port(a,r,'TIP'),dest=port(a,p.components.find(c=>c.id==='x'),'3');scene(a,r.id).querySelector('.body').emit('pointerdown',{clientX:400,clientY:400});a.window.emit('pointermove',{clientX:400+dest.x-start.x,clientY:400+dest.y-start.y});a.window.emit('pointerup',{buttons:0});
 assert.equal(m._meter.value,2.5);assert.equal(m._meter.unit,'V');assert.deepEqual(copy(tx._instrument.outputPins),['V','G']);assert.match(scene(a,tx.id).textContent,/V \(\+\) \/ G/);
 for(const [kg,v] of [[0,0],[500,5],[1000,10]]){cell.loadWeight=kg;a.window.DTSEditor.render(true);assert.equal(m._meter.value,v)}
 assert.equal(a.$('[data-terminal-overlay="'+tx.id+'"][data-wire="vout"] .wire').getAttribute('stroke'),p.wires.find(w=>w.id==='vout').color);
 const reopened=createApp({project:a.save(),appearance:'material'});assert.equal(reopened.save().components.find(c=>c.id===tx.id).instrumentSettings.output,'0-10V');assert(reopened.$('.terminal-wire-overlay'));
});
test('20-color sidebar and voltage labels persist while EX/SIG colors remain free',()=>{
 const a=createApp({project:fixture(),appearance:'material'}),p=a.window.DTSEditor.getProject();assert.equal(a.$('#colorPalette').querySelectorAll('[data-color]').length,20);
 a.$('[data-color="#ffffff"]').click();a.$('#wireRole').value='SIGNAL';a.$('#wireRole').emit('change');a.$('#wireVoltage').value='0–10 V DC';a.$('#wireVoltage').emit('change');assert.equal(p.colorRoles['#ffffff'],'SIGNAL');assert.equal(p.colorVoltages['#ffffff'],'0–10 V DC');
 const tx=p.components.find(c=>c.typeId==='weighing-indicator'),w=p.wires.find(w=>w.freeColor&&[w.from,w.to].some(r=>r.c===tx.id&&r.p==='EX+'));
 down(a,wireNode(a,w.id),{button:2,buttons:2});assert.equal(a.$('#contextWireRole').value,'FREE');const color=a.$('#contextWireColor');assert.ok(!color.querySelector('[value="#1e88e5"]').disabled);color.value='#1e88e5';a.$('#applyWireContext').click();assert.equal(w.color,'#1e88e5');assert.equal(w.freeColor,true);
 const restored=createApp({project:a.save(),appearance:'material'});restored.$('[data-color="#ffffff"]').click();assert.equal(restored.$('#wireVoltage').value,'0–10 V DC');assert.equal(restored.save().wires.find(x=>x.id===w.id).color,'#1e88e5');
});
test('red jack dropdown moves the existing lead and range changes clear hold and rescale',()=>{
 const a=createApp({appearance:'material'});a.drop('unit-ut33d-plus',350,200);const p=a.window.DTSEditor.getProject(),m=p.components[0],r=p.components.find(c=>c.typeId==='test-probe-red'),red=p.wires.find(w=>w.to.c===r.id);
 for(const [c,pin]of [[m,'10A'],[r,'PLUG']])down(a,scene(a,c.id).querySelector('[data-port="'+pin+'"]'));assert.equal(p.wires.length,2);assert.equal(red.from.p,'V');assert.match(a.$('#toast').textContent,/zaten|aynı anda/);a.document.emit('keydown',{key:'Escape'});
 down(a,scene(a,m.id).querySelector('.body'));const jack=a.$('[data-meter-jack]');jack.value='10A';jack.emit('change');assert.equal(red.from.p,'10A');assert.equal(p.wires.length,2);assert.equal(m._redProbeJack,'10A');
 a.$('[data-meter-jack]').value='V';a.$('[data-meter-jack]').emit('change');assert.equal(red.from.p,'V');m.meterHold=true;const range=a.$('[data-thermal-param="meterPosition"]');range.value='1';range.emit('change');assert.equal(m.meterPosition,1);assert.equal(m.meterHold,false);a.$('#simulateBtn').click();assert.equal(m._meter.unit,'mV');assert.match(scene(a,m.id).textContent,/mV/);
});
