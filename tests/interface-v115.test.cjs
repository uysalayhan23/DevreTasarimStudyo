const {test}=require('node:test'),assert=require('node:assert/strict'),{createApp}=require('./helpers/offline-dom.cjs');
function down(a,node,x=300,y=300){node.emit('pointerdown',{clientX:x,clientY:y});a.window.emit('pointerup',{buttons:0,clientX:x,clientY:y})}
const scene=(a,id)=>a.$('#scene [data-id="'+id+'"]');
test('new instruments expose actual settings, persist values and share photo with palette',()=>{
 const a=createApp({appearance:'material'});a.drop('converter-pressure',350,220);let c=a.save().components[0];assert(a.$('[data-instrument-param="inputValue"]'));const input=a.$('[data-instrument-param="inputValue"]');input.type='number';input.min='0';input.max='10';input.value='7.5';input.emit('change');assert.equal(a.save().components[0].instrumentSettings.inputValue,7.5);assert(scene(a,c.id).innerHTML.includes('weid-front-v115.png'));
 a.drop('temperature-controller',700,300);assert(a.$('[data-instrument-param="pb"]'));assert(a.$('[data-instrument-param="a1Type"]'));assert(a.$('[data-instrument-param="securityCode"]'));
 a.drop('thermocouple',900,500);assert(a.$('[data-thermal-param="thermocoupleType"]'));assert.equal(Number(a.$('#propTemperature').max),1372);
});
test('terminal count selector preserves wired ports and prevents deleting an occupied row',()=>{
 const a=createApp();a.drop('terminal-2',300,300);const select=a.$('[data-terminal-count]');select.value='3';select.emit('change');const c=a.save().components[0];assert.equal(c.typeId,'terminal-2-array-3');assert.equal(scene(a,c.id).querySelectorAll('.port-group').length,6);
 a.drop('supply-1p',600,200);const p=a.window.DTSEditor.getProject(),s=p.components[1];p.wires.push({id:'keep',from:{c:s.id,p:'L'},to:{c:c.id,p:'5'}});a.window.DTSEditor.render();down(a,scene(a,c.id).querySelector('.body'));const reduce=a.$('[data-terminal-count]');reduce.value='1';reduce.emit('change');assert.equal(a.save().components[0].typeId,'terminal-2-array-3');assert.match(a.$('#toast').textContent,/Kablolu/);
});
test('live probe dragging attaches, measures, detaches, cancels and keeps its cable',()=>{
 const a=createApp({appearance:'material'});a.drop('supply-dc-plus',800,300);a.drop('unit-ut33d-plus',300,220);const p=a.window.DTSEditor.getProject(),[s,m,black,red]=p.components;m.meterPosition=4;black.probeTarget={c:s.id,p:'M'};
 const B=a.window.DTSEditor.byId,S=a.window.CCSSymbols,A=a.window.DTSAssemblies,port=(c,id)=>{const d=A.definition(B[c.typeId],c,'material'),q=S.rotatedPoint(d.pins.find(p=>p.id===id),d,c.rotation||0);return {x:c.x+q.x,y:c.y+q.y}};
 a.window.DTSEditor.render();a.$('#simulateBtn').click();assert.equal(a.window.DTSEditor.running,true);const tip=port(red,'TIP'),dest=port(s,'P'),origin={x:red.x,y:red.y};scene(a,red.id).querySelector('.body').emit('pointerdown',{clientX:400,clientY:400});a.window.emit('pointermove',{clientX:400+dest.x-tip.x,clientY:400+dest.y-tip.y});a.window.emit('pointerup',{buttons:0});assert.deepEqual(JSON.parse(JSON.stringify(red.probeTarget)),{c:s.id,p:'P'});assert.equal(m._meter.value,24);assert.equal(a.window.DTSEditor.running,true);assert.equal(p.wires.length,2);
 scene(a,red.id).querySelector('.body').emit('pointerdown',{clientX:400,clientY:400});a.window.emit('pointermove',{clientX:550,clientY:550});a.window.emit('pointercancel');assert.equal(red.probeTarget.p,'P');assert.equal(m._meter.value,24);
 scene(a,red.id).querySelector('.body').emit('pointerdown',{clientX:400,clientY:400});a.window.emit('pointermove',{clientX:580,clientY:580});a.window.emit('pointerup',{buttons:0});assert.equal(red.probeTarget,undefined);assert.equal(m._meter.value,0);assert.equal(p.wires.length,2);
});
test('ET4420 front keys respect the control lock and set-point bounds',()=>{
 const a=createApp({appearance:'material'});a.drop('temperature-controller',500,250);const c=a.window.DTSEditor.getProject().components[0];c.instrumentSettings={set:100,setLow:99,setHigh:101,lock_control:'no'};a.window.DTSEditor.render();
 down(a,scene(a,c.id).querySelector('[data-instrument-key="up"]'));assert.equal(c.instrumentSettings.set,100);assert.match(a.$('#toast').textContent,/kilitli/);
 c.instrumentSettings.lock_control='yes';down(a,scene(a,c.id).querySelector('[data-instrument-key="up"]'));assert.equal(c.instrumentSettings.set,101);down(a,scene(a,c.id).querySelector('[data-instrument-key="up"]'));assert.equal(c.instrumentSettings.set,101);
});
