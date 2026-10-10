const {test}=require('node:test'),assert=require('node:assert/strict');
const {createApp}=require('./helpers/offline-dom.cjs');
test('color and motor bridge changes survive save, undo and reload',()=>{
 const a=createApp();a.drop('lamp-green',300,300);a.$('#propDeviceColor').value='#2244aa';a.$('#propDeviceColor').emit('change');assert.equal(a.save().components[0].deviceColor,'#2244aa');
 a.$('#undoBtn').click();assert.equal(a.save().components[0].deviceColor,undefined);
 a.drop('motor-y-d',600,400);a.$('#propMotorConnection').value='delta';a.$('#propMotorConnection').emit('change');
 const p=a.save();assert.equal(p.components.at(-1).motorConnection,'delta');
 const b=createApp({project:p});assert.equal(b.save().components.at(-1).motorConnection,'delta');
});
test('PLC library restricts brands and exposes documented S7-1200 channels with unique pins',()=>{
 const a=createApp(),lib=a.window.DTSEditor.library;
 const d=lib.find(d=>d.id==='plc-0-4-documented');assert.deepEqual(JSON.parse(JSON.stringify(d.io)),{DI:14,DO:10,AI:2,AO:2});
 assert.equal(new Set(d.pins.map(p=>p.id)).size,d.pins.length);assert.ok(d.pins.some(p=>p.label==='DI b.5-'));
 const s=lib.find(d=>d.id==='plc-0-0-documented');assert.equal(s.pins.filter(p=>p.signalType==='DI').length,6);assert.equal(s.pins.filter(p=>p.signalType==='DO').length,4);
 a.$('[data-cat="plc"]').click();const brands=a.$('#brandFilters').textContent;
 for(const name of ['Siemens','Delta','Omron','GMTCNT'])assert.ok(brands.includes(name));
 for(const name of ['Schneider','ABB','Mitsubishi','Allen-Bradley'])assert.ok(!brands.includes(name));
});
test('packet selector exposes a working contact table and persisted position',()=>{
 const a=createApp();a.drop('packet-star-delta',400,400);assert.equal(a.$('#packetSettings').hidden,false);
 a.$('#propPacketPosition').value='2';a.$('#propPacketPosition').emit('change');assert.equal(a.save().components[0].position,2);assert.ok(a.$('#packetTable').textContent.includes('3–4'));
});
