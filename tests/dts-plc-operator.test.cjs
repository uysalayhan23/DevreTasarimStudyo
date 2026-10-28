'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const O=require('../dist/plc-operator.js');
const plc={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {signalType:'POWER',id:'X10:6',label:'1M'},
 {signalType:'POWER',id:'X12:1',label:'3L+'},
 {signalType:'POWER',id:'X12:2',label:'3M'},
 ...Array.from({length:6},(_,i)=>({signalType:'DI',id:'X10:'+(7+i)})),
 ...Array.from({length:4},(_,i)=>({signalType:'DO',id:'X12:'+(3+i)}))
]};
const c={id:'virtual',typeId:plc.id,plcProgram:'dts-ladder-v1',ladderProgram:{version:1,rungs:[]},
 _plcRuntime:{powered:true,program:'dts-ladder-v1',inputs:{'X10:7':true},outputs:{'X12:3':true}}};
const definitions={[plc.id]:plc,unverified:{...plc,id:'unverified'}};
test('operator panel selects only native verified CPU model',()=>{
 assert.equal(O.supportedDevices({components:[c,{id:'other',typeId:'unverified'}]},definitions).length,1);
});
test('native live IO, stopped, powerless, and unrelated program are distinct',()=>{
 const project={components:[c]};
 assert.equal(O.state(project,definitions,true,'virtual').info.outputs[0].value,true);
 assert.equal(O.state(project,definitions,false,'virtual').info.outputs[0].value,null);
 assert.equal(O.state({components:[{...c,plcProgram:'mirror'}]},definitions,true,'virtual').info.outputs[0].value,null);
 assert.equal(O.state({components:[{...c,_plcRuntime:{powered:false,program:'dts-ladder-v1'}}]},definitions,true,'virtual').info.outputs[0].value,null);
});
test('missing PLC is reported honestly; escaped labels cannot inject HTML',()=>{
 assert.equal(O.state({components:[]},definitions,false,null).info,null);
 const html=O.markup({selection:null,choices:[],status:'<script>bad()</script>',info:null});
 assert.doesNotMatch(html,/<script>/);
});
