'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const outputPins=[{id:'X12:3'}];
const inputPins=on=>[{id:'X10:7',value:on}];
const rung=(id,type,ref,contact,extra={})=>({id,paths:[[{type:'NO',ref:contact}]],coil:{type,ref,...extra}});
const program=type=>({version:1,rungs:[rung('timer',type,'T1','I1',{presetMs:1000}),rung('lamp','OUT','Q1','T1')]});
function withScan(scan){
 const module={exports:{}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8'),
  {module,require:()=>({...Ladder,scan})},{filename:'plc-runtime.js'});
 return module.exports;
}
for(const type of ['TON','TOF','TP']){
 test(`P0-02 negative ${type}: forged T1 success scan must fail closed`,()=>{
  const fake=(source,inputs,memory,now,limits)=>{
   const r=Ladder.scan(source,inputs,memory,now,limits);
   assert.equal(r.ok,true);
   assert.equal(r.traces[0].value,false);
   r.memory.values.T1=true;
   r.memory.values.Q1=true;
   r.traces[0].value=true;
   r.traces[1].pathStates=[true];r.traces[1].active=true;r.traces[1].value=true;
   r.outputs.Q1=true;
   return r;
  };
  const c={plcProgram:'dts-ladder-v1',ladderProgram:program(type)};
  const result=withScan(fake).program(c,inputPins(false),outputPins,100);
  assert.equal(result.outputs['X12:3'],false);
  assert.match(c._dtsLadderError,/geçersiz/i);
  assert.deepEqual(Array.from(c._dtsLadderTraces),[]);
  assert.equal(c._dtsLadderMemory,undefined);
 });
}
test('P0-02 negative: forged TON start and elapsed cannot create a matured timer',()=>{
 const fake=(source,inputs,memory,now,limits)=>{
  const r=Ladder.scan(source,inputs,memory,now,limits);
  assert.equal(r.traces[0].value,false);
  r.memory.blocks.T1.start=now-2000;
  r.memory.values.T1=true;r.memory.values.Q1=true;
  r.traces[0].value=true;r.traces[0].elapsedMs=1000;
  r.traces[1].pathStates=[true];r.traces[1].active=true;r.traces[1].value=true;
  r.outputs.Q1=true;return r;
 };
 const c={plcProgram:'dts-ladder-v1',ladderProgram:program('TON')};
 const r=withScan(fake).program(c,inputPins(true),outputPins,100);
 assert.equal(r.outputs['X12:3'],false);
 assert.match(c._dtsLadderError,/geçersiz/i);
});
for(const [type,steps,expected] of [
 ['TON',[[true,0],[true,500],[true,1000],[false,1100]],[false,false,true,false]],
 ['TOF',[[true,0],[false,100],[false,500],[false,1200]],[true,true,true,false]],
 ['TP', [[true,0],[true,500],[true,1001],[false,1100]],[true,true,false,false]]
]){
 test(`P0-02 positive ${type}: valid timing and Q trace remain live`,()=>{
  const c={plcProgram:'dts-ladder-v1',ladderProgram:program(type)};
  const got=steps.map(([on,now])=>PLC.program(c,inputPins(on),outputPins,now).outputs['X12:3']);
  assert.deepEqual(got,expected);
  assert.equal(c._dtsLadderError,undefined);
  assert.equal(c._dtsLadderTraces.length,2);
 });
}
test('P0-02 positive: active RESET after TON leaves physical Q safely off without false scan error',()=>{
 const p={version:1,rungs:[rung('timer','TON','T1','I1',{presetMs:1000}),rung('reset','RESET','T1','I2'),rung('lamp','OUT','Q1','T1')]};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p};
 const pins=[{id:'X10:7',value:true},{id:'X10:8',value:true}];
 const r=PLC.program(c,pins,outputPins,2000);
 assert.equal(r.outputs['X12:3'],false);
 assert.equal(c._dtsLadderError,undefined);
});
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const defs=QA.catalog();
const cpuType='plc-hw-6es7211-1ae40-0xb0';
const links=[['g','P','plc','X10:1'],['g','M','plc','X10:2'],['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],['g','M','plc','X12:2'],['plc','X12:3','lamp','X1'],
 ['lamp','X2','g','M'],['g','P','plc','X10:7']];
test('P0-02 native 703 catalog: TON Q1/lamp follow real wiring, elapsed time and DI disconnect',()=>{
 assert.equal(defs[cpuType].pins.filter(p=>p.signalType==='DO').length,4);
 const p={components:[{id:'g',typeId:'supply-dc-plus'},
  {id:'plc',typeId:cpuType,plcProgram:'dts-ladder-v1',ladderProgram:program('TON')},
  {id:'lamp',typeId:'lamp-green'}],
  wires:links.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]})),junctions:[],colorRoles:{}};
 const step=(now)=>{
  const s=Native.solve(p,defs,{now});assert.equal(s.blocked,false);assert.equal(s.stable,true);
  const cpu=p.components[1],lamp=p.components[2];
  assert.equal(cpu._dtsLadderError,undefined);
  return [cpu._plcRuntime.outputs['X12:3'],!!lamp._active];
 };
 assert.deepEqual(step(1000),[false,false]);
 assert.deepEqual(step(1500),[false,false]);
 assert.deepEqual(step(2000),[true,true]);
 const input=p.wires.splice(p.wires.findIndex(w=>w.to.c==='plc'&&w.to.p==='X10:7'),1)[0];
 assert.deepEqual(step(2100),[false,false]);
 p.wires.push(input);
 assert.deepEqual(step(2200),[false,false]);
 assert.deepEqual(step(3200),[true,true]);
});
