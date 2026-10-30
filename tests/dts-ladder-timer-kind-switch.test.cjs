'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const limits={inputCount:2,outputCount:2};
const program=type=>({version:1,rungs:[
 {id:'timer',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'T1',presetMs:100}},
 {id:'lamp',paths:[[{type:'NO',ref:'T1'}]],coil:{type:'OUT',ref:'Q1'}}
]});
function run(steps){
 const memory={};
 return steps.map(([type,now,on])=>{
  const result=L.scan(program(type),{I1:on},memory,now,limits);
  assert.equal(result.ok,true);
  return {q:result.outputs.Q1,kind:memory.blocks.T1?.kind};
 });
}
test('TON to inactive TOF clears old T1 output immediately',()=>{
 const r=run([['TON',0,true],['TON',100,true],['TOF',101,false],['TOF',200,false]]);
 assert.deepEqual(r.map(x=>x.q),[false,true,false,false]);
 assert.equal(r[2].kind,'TOF');
});
test('TP to inactive TOF cannot reuse an active pulse output',()=>{
 assert.deepEqual(run([['TP',0,true],['TOF',1,false]]).map(x=>x.q),[true,false]);
});
test('TOF to TON requires the new full on-delay',()=>{
 assert.deepEqual(run([['TOF',0,true],['TON',1,true],['TON',100,true],['TON',101,true]]).map(x=>x.q),
  [true,false,false,true]);
});
test('unchanged TON and TOF timing remain correct',()=>{
 assert.deepEqual(run([['TON',0,true],['TON',99,true],['TON',100,true],['TON',101,false]]).map(x=>x.q),
  [false,false,true,false]);
 assert.deepEqual(run([['TOF',0,true],['TOF',10,false],['TOF',109,false],['TOF',110,false]]).map(x=>x.q),
  [true,true,true,false]);
});
test('unchanged TP pulse does not retrigger while input stays high',()=>{
 assert.deepEqual(run([['TP',0,true],['TP',10,false],['TP',20,true],['TP',100,true],['TP',101,true]]).map(x=>x.q),
  [true,true,true,false,false]);
});
test('legacy TON state without kind marker is cleared on TOF switch',()=>{
 const memory={values:{T1:true},blocks:{T1:{start:0}}};
 const result=L.scan(program('TOF'),{I1:false},memory,200,limits);
 assert.equal(result.outputs.Q1,false);
 assert.equal(memory.blocks.T1.start,undefined);
 assert.equal(memory.blocks.T1.kind,'TOF');
});
test('invalid timer program remains blocked without physical outputs',()=>{
 const p=program('TOF');p.rungs[0].coil.ref='Q1';
 const r=L.scan(p,{I1:true},{},0,limits);
 assert.equal(r.ok,false);
 assert.deepEqual(r.outputs,{});
});
test('real catalogue CPU 1211C virtual PLC outputs drop after timer kind change',()=>{
 const d=QA.catalog()['plc-hw-6es7211-1ae40-0xb0'];
 assert.equal(L.supportedPLC(d),true);
 const c={id:'plc',plcProgram:'dts-ladder-v1',ladderProgram:program('TON')};
 const sp=PLC.supplyPair(d),di=d.pins.find(p=>p.signalType==='DI'),anchor=PLC.inputAnchor(d,di);
 let input=true,power=true,bankPower=true;
 const net={voltage:(_c,a,b)=>{
  if(a===sp.a.id&&b===sp.b.id)return power?24:0;
  if(a==='X12:1'&&b==='X12:2')return bankPower?24:0;
  if(a===di.id&&b===anchor.id)return input?24:0;
  return 0;
 }};
 const at=now=>PLC.evaluate(c,d,net,now);
 assert.equal(at(0).outputs['X12:3'],false);
 assert.equal(at(100).outputs['X12:3'],true);
 // The CPU 1211C has an independent output bank. Without its 3L+/3M
 // supply, a correct PLC must not energize any physical Q terminal.
 bankPower=false;
 assert.equal(at(100).outputs['X12:3'],false);
 bankPower=true;
 assert.equal(at(100).outputs['X12:3'],true);
 assert.equal(PLC.links(c,d).length,1);
 c.ladderProgram.rungs[0].coil.type='TOF';input=false;
 assert.equal(at(101).outputs['X12:3'],false);
 assert.equal(PLC.links(c,d).length,0);
 power=false;
 assert.equal(at(102).powered,false);
 assert.equal(c._dtsLadderMemory,undefined);
});
