'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const E=require('../dist/ladder-editor.js'),L=require('../dist/ladder-runtime.js');
test('Only virtual PLC with DI and DO is selectable',()=>{
const editor={getProject:()=>({components:[{id:'plc',typeId:'p'},{id:'lamp',typeId:'l'}]}),byId:{p:{isPLC:true,pins:[{signalType:'DI',id:'X1'},{signalType:'DI',id:'X2'},{signalType:'DO',id:'Y1'}]},l:{}}};
assert.deepEqual(E.supported(editor).map(x=>x.id),['plc']);
});
test('Starter seal-in has two paths and one normally closed STOP in each',()=>{
const p=E.starter(),r=p.rungs[0];
assert.equal(r.paths.length,2);assert.ok(r.paths.every(a=>a.some(c=>c.type==='NC'&&c.ref==='I2')));
assert.equal(L.validate(p,{inputCount:2,outputCount:1}).ok,true);
});
