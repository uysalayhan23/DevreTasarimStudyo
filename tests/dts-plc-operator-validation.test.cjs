'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const O=require('../dist/plc-operator.js'),M=require('../dist/ladder-monitor.js');
const definition={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {signalType:'POWER',id:'X10:6',label:'1M'},
 {signalType:'POWER',id:'X12:1',label:'3L+'},
 {signalType:'POWER',id:'X12:2',label:'3M'},
 ...Array.from({length:6},(_,i)=>({signalType:'DI',id:'X10:'+(7+i)})),
 ...Array.from({length:4},(_,i)=>({signalType:'DO',id:'X12:'+(3+i)}))
]};
const projectOf=program=>({components:[{id:'cpu',typeId:definition.id,plcProgram:'dts-ladder-v1',
 ladderProgram:program,_plcRuntime:{powered:true,program:'dts-ladder-v1',
 inputs:{'X10:7':true},outputs:{'X12:3':true}}}]});
const defs={[definition.id]:definition};
const valid={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
test('valid saved CPU program shows live inputs and outputs',()=>{
 const s=O.state(projectOf(valid),defs,true,'cpu');
 assert.equal(s.info.live,true);assert.equal(s.info.outputs[0].value,true);
 assert.equal(s.info.inputs[0].value,true);
});
test('invalid Ladder program never displays stale 0/1 data as live',()=>{
 const s=O.state(projectOf({version:1,rungs:[]}),defs,true,'cpu');
 assert.equal(s.info.live,false);assert.equal(s.info.outputs[0].value,null);
 assert.equal(s.info.inputs[0].value,null);
 assert.match(s.info.message,/doğrulanamadı/);
});
test('program referencing an absent PLC input is not live',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I7'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const s=O.state(projectOf(p),defs,true,'cpu');
 assert.equal(s.info.live,false);assert.equal(s.info.inputs[0].value,null);
 assert.match(s.info.message,/giriş sınırı/);
});
test('failed native runtime scan masks live readings on otherwise valid saved program',()=>{
 const project=projectOf(valid);
 project.components[0]._dtsLadderError='Native scan hatası';
 const s=O.state(project,defs,true,'cpu');
 assert.equal(s.info.live,false);assert.equal(s.info.outputs[0].value,null);
 assert.match(s.info.message,/Native scan hatası/);
});
test('stopped or powerless PLC remains unknown, never forced active',()=>{
 const project=projectOf(valid);
 assert.equal(O.state(project,defs,false,'cpu').info.outputs[0].value,null);
 project.components[0]._plcRuntime.powered=false;
 assert.equal(O.state(project,defs,true,'cpu').info.outputs[0].value,null);
});
test('error text is HTML escaped and does not inject script into operator UI',()=>{
 const project=projectOf(valid);project.components[0]._dtsLadderError='<script>alert(1)</script>';
 const html=O.markup(O.state(project,defs,true,'cpu'));
 assert.doesNotMatch(html,/<script>/);assert.match(html,/&lt;script&gt;/);
});
test('bare monitor snapshot also refuses a native scan error',()=>{
 const c=projectOf(valid).components[0],d=definition;
 c._dtsLadderError='invalid';
 assert.equal(M.snapshot(c,d,true,true).live,false);
 assert.equal(M.snapshot(c,d,true,true).outputs[0].value,null);
});
