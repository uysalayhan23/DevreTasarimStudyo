'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
// A minimal terminal fixture matching the supported CPU 1211C catalog gate.
// These are PLC.evaluate + real Ladder.scan checks, NOT a full Simulation.solve test.
const pin=(id,label,signalType,block)=>({id,label,signalType,block});
const cpu={
 id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,outputType:'PNP',
 pins:[
  pin('X10:1','L+','POWER','X10'),pin('X10:2','M','POWER','X10'),
  pin('X10:6','1M','POWER','X10'),pin('X12:1','3L+','POWER','X12'),
  pin('X12:2','3M','POWER','X12'),
  ...Array.from({length:6},(_,i)=>pin('X10:'+(i+7),'I'+(i+1),'DI','X10')),
  ...Array.from({length:4},(_,i)=>pin('X12:'+(i+3),'Q'+(i+1),'DO','X12'))
 ]
};
function run(diTo1M,diToCpuM,cpuPower=24){
 const c={id:'plc',plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()};
 const net={voltage:(_c,a,b)=>{
  if(a==='X10:1'&&b==='X10:2')return cpuPower;
  if(a==='X10:7'&&b==='X10:6')return diTo1M;
  if(a==='X10:7'&&b==='X10:2')return diToCpuM;
  if(a==='X12:1'&&b==='X12:2')return 24;
  return 0;
 }};
 return PLC.evaluate(c,cpu,net,100).outputs['X12:3'];
}
test('supported CPU 1211C input I1 uses dedicated X10:6 1M',()=>{
 assert.equal(Ladder.supportedPLC(cpu),true);
 assert.equal(PLC.inputAnchor(cpu,cpu.pins.find(p=>p.id==='X10:7')).id,'X10:6');
});
test('I1 with correct positive 1M reference drives virtual Q1',()=>{
 assert.equal(run(24,0),true);
});
test('broken 1M cannot borrow CPU M to energize Q1',()=>{
 assert.equal(run(0,24),false);
});
test('reversed DC input relative to 1M stays OFF',()=>{
 assert.equal(run(-24,-24),false);
});
test('zero DI voltage stays OFF',()=>{assert.equal(run(0,0),false)});
test('lost CPU power prevents a virtual output even with live DI',()=>{
 assert.equal(run(24,24,0),false);
});
test('legacy PLC polarity behavior remains untouched',()=>{
 const old={id:'legacy',pins:[pin('M','M','POWER','X'),pin('I','I','DI','X')]};
 assert.equal(PLC.inputState({},old,{voltage:()=>-1},old.pins[1]),true);
});
