'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const E=require('../dist/ladder-editor.js'),L=require('../dist/ladder-runtime.js');
const verified={id:'plc-hw-6es7211-1ae40-0xb0',name:'CPU 1211C DC/DC/DC',isPLC:true,pins:[
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))
]};
test('Only native-verified hardware PLC appears in Ladder selection',()=>{
 const editor={getProject:()=>({components:[{id:'plc',typeId:verified.id},{id:'unverified',typeId:'other'},{id:'lamp',typeId:'l'}]}),
 byId:{[verified.id]:verified,other:{...verified,id:'other'},l:{isPLC:false}}};
 assert.deepEqual(E.supported(editor).map(x=>x.id),['plc']);
});
test('Starter has two seal-in paths and NC STOP in both paths',()=>{
 const p=E.starter(),r=p.rungs[0];
 assert.equal(r.paths.length,2);
 assert.ok(r.paths.every(path=>path.some(c=>c.type==='NC'&&c.ref==='I2')));
 assert.equal(L.validate(p,{inputCount:6,outputCount:4}).ok,true);
});
