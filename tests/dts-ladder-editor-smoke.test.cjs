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

test('Live Ladder monitor shows actual saved rung trace and counter',()=>{
 const p=L.blank(),rows=E.monitorRows(p,p,[{id:'R1',active:true,value:true,count:3}],true,'dts-ladder-v1');
 assert.equal(rows[0].status,'AKTİF');assert.equal(rows[0].active,true);
 assert.equal(E.signalText(rows[0]),'1 · Sayaç 3');
});
test('Unsaved Ladder draft never shows misleading saved-program trace',()=>{
 const p=L.blank(),draft=JSON.parse(JSON.stringify(p));draft.rungs[0].paths[0][0].type='NC';
 const rows=E.monitorRows(draft,p,[{id:'R1',active:true,value:true}],true,'dts-ladder-v1');
 assert.equal(rows[0].value,null);assert.equal(rows[0].active,false);
 assert.match(rows[0].status,/Taslak izlenmiyor/);
});
test('Stopped simulation hides stale Ladder signal and count',()=>{
 const p=L.blank(),rows=E.monitorRows(p,p,[{id:'R1',active:true,value:true,count:9}],false,'dts-ladder-v1');
 assert.equal(rows[0].status,'Simülasyon kapalı');
 assert.equal(rows[0].count,null);assert.equal(E.signalText(rows[0]),'—');
});
test('Live Ladder monitor does not invent signals before solver trace',()=>{
 const p=L.blank(),rows=E.monitorRows(p,p,[],true,'dts-ladder-v1');
 assert.equal(rows[0].status,'Sinyal bekleniyor');assert.equal(rows[0].value,null);
});

// A stopped but saved Ladder must remain startable after the modal refresh timer.
test('saved Ladder start gate remains enabled while stopped',()=>{
 const saved=L.blank(),plc={plcProgram:'dts-ladder-v1',ladderProgram:saved};
 assert.equal(E.canStartLadder(plc,structuredClone(saved),false,{disabled:false}),true);
 assert.equal(E.canStartLadder(plc,saved,true,{disabled:false}),true);
});
test('unsaved, foreign, locked and missing simulator cannot start',()=>{
 const saved=L.blank(),draft=structuredClone(saved),plc={plcProgram:'dts-ladder-v1',ladderProgram:saved};
 draft.rungs[0].coil.ref='Q2';
 assert.equal(E.canStartLadder(plc,draft,false,{disabled:false}),false);
 assert.equal(E.canStartLadder(plc,saved,false,{disabled:true}),false);
 assert.equal(E.canStartLadder(plc,saved,false,null),false);
 assert.equal(E.canStartLadder({...plc,plcProgram:'other'},saved,false,{disabled:false}),false);
 assert.equal(E.canStartLadder({...plc,ladderProgram:null},saved,false,{disabled:false}),false);
});
