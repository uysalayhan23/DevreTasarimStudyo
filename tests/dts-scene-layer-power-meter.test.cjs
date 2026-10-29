'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/scene-layer-order.js');
test('power meter renders with measurement instruments',()=>assert.equal(L.measurementDevice({kind:'power-meter'}),true));
test('normal lamp remains in ordinary component layer',()=>assert.equal(L.measurementDevice({kind:'lamp'}),false));
test('power meter and multimeter share top measurement layer',()=>{const defs={p:{kind:'power-meter'},b:{kind:'lamp'},m:{kind:'multimeter'}};const z=L.split([{id:'b',typeId:'b'},{id:'p',typeId:'p'},{id:'m',typeId:'m'}],defs);assert.deepEqual(z.ordinary.map(x=>x.id),['b']);assert.deepEqual(z.measuring.map(x=>x.id),['p','m']);});
