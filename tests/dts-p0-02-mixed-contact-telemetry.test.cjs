'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Ladder=require('../dist/ladder-runtime.js');
const PLC=require('../dist/plc-runtime.js');
const Monitor=require('../dist/ladder-monitor.js');
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},{id:'X12:1',label:'3L+',signalType:'POWER'},
 {id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
const di=d.pins.filter(p=>p.signalType==='DI'),doPins=d.pins.filter(p=>p.signalType==='DO');
const program=(paths,coil={type:'OUT',ref:'Q1'})=>({version:1,rungs:[{id:'R1',paths,coil}]});
const inputs=(i1=true,i2=false)=>di.map((p,i)=>({id:p.id,value:i===0?i1:i===1?i2:false}));
const runtime=(i1,q1)=>({powered:true,program:'dts-ladder-v1',
 inputs:Object.fromEntries(di.map((p,i)=>[p.id,i===0?i1:false])),
 outputs:Object.fromEntries(doPins.map((p,i)=>[p.id,i===0?q1:false]))});
function setup(paths,values,overrides={}){
 const p=program(paths);
 const result=Ladder.scan(p,{I1:true},{values},100,{inputCount:6,outputCount:4});
 assert.equal(result.ok,true);
 const trace={...result.traces[0],...overrides};
 const fake={...result,traces:[trace],outputs:{...result.outputs,Q1:trace.value},
  memory:{...result.memory,values:{...result.memory.values,Q1:trace.value}}};
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p,_dtsLadderTraces:fake.traces,
  _dtsLadderMemory:fake.memory,_plcRuntime:runtime(true,trace.value)};
 return {p,result,fake,c};
}
function coreWithForgedScan(x){
 // Load the actual PLC source in a separate native Node V8 context with one
 // controlled faulty scan response; never mutate the frozen Ladder API.
 const sandbox={module:{exports:{}},require(name){
  if(name==='./ladder-runtime.js')return {...Ladder,scan:()=>x.fake};
  throw Error('Unexpected dependency: '+name);
 }};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/plc-runtime.js'),'utf8'),sandbox);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:x.p};
 const out=sandbox.module.exports.program(c,inputs(),doPins,100);
 return {out,c};
}

test('negative: mixed NO I1 + NO M1 false cannot forge live Q1',()=>{
 const x=setup([[{type:'NO',ref:'I1'},{type:'NO',ref:'M1'}]],{M1:false},{active:true,pathStates:[true],value:true});
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,false);
 const y=coreWithForgedScan(x);assert.equal(y.out.outputs[doPins[0].id],false);
 assert.match(y.c._dtsLadderError,/geçersiz/i);
 assert.equal(y.c._dtsLadderTraces.length,0);
});
test('negative: mixed NO I1 + NC M1 with M1 true cannot forge live Q1',()=>{
 const x=setup([[{type:'NO',ref:'I1'},{type:'NC',ref:'M1'}]],{M1:true},{active:true,pathStates:[true],value:true});
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,false);
 const y=coreWithForgedScan(x);assert.equal(y.out.outputs[doPins[0].id],false);
 assert.ok(y.c._dtsLadderError);
});
test('negative: pure NO M1 false cannot forge live Q1',()=>{
 const x=setup([[{type:'NO',ref:'M1'}]],{M1:false},{active:true,pathStates:[true],value:true});
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,false);
 assert.ok(coreWithForgedScan(x).c._dtsLadderError);
});
test('negative: fully conducting I1 + M1 cannot be displayed as stale false path',()=>{
 const x=setup([[{type:'NO',ref:'I1'},{type:'NO',ref:'M1'}]],{M1:true},{active:false,pathStates:[false],value:false});
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,false);
 assert.ok(coreWithForgedScan(x).c._dtsLadderError);
});
test('positive: genuine M1 false produces safe Q1=0 and live monitor',()=>{
 const x=setup([[{type:'NO',ref:'I1'},{type:'NO',ref:'M1'}]],{M1:false});
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,true);
 assert.equal(x.result.outputs.Q1,false);
});
test('positive: genuine M1 true produces Q1=1 and live monitor',()=>{
 const x=setup([[{type:'NO',ref:'I1'},{type:'NO',ref:'M1'}]],{M1:true});
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,true);
 assert.equal(x.result.outputs.Q1,true);
});
test('positive: later M1 writer must not invalidate earlier scan-time contact',()=>{
 const p={version:1,rungs:[
  {id:'R1',paths:[[{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'Q1'}},
  {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'OUT',ref:'M1'}}]};
 const scan=Ladder.scan(p,{I1:false,I2:false},{values:{M1:true}},100,{inputCount:6,outputCount:4});
 assert.equal(scan.ok,true);assert.deepEqual(scan.traces.map(t=>t.pathStates),[[true],[false]]);
 assert.equal(scan.memory.values.M1,false);assert.equal(scan.outputs.Q1,true);
 const c={plcProgram:'dts-ladder-v1',ladderProgram:p,_dtsLadderMemory:scan.memory,
  _dtsLadderTraces:scan.traces,_plcRuntime:runtime(false,true)};
 assert.equal(Monitor.snapshot(c,d,true,true).live,true);
});
test('positive: stopped, unpowered, unsaved states remain non-live',()=>{
 const x=setup([[{type:'NO',ref:'I1'}]],{});
 assert.equal(Monitor.snapshot(x.c,d,false,true).live,false);
 assert.equal(Monitor.snapshot(x.c,d,true,false).live,false);
 x.c._plcRuntime.powered=false;
 assert.equal(Monitor.snapshot(x.c,d,true,true).live,false);
});
test('positive: valid SET/RESET and TON scan outputs retain native behavior',()=>{
 for(const coil of [{type:'SET',ref:'Q1'},{type:'RESET',ref:'Q1'},{type:'TON',ref:'T1',presetMs:100}]){
  const p=program([[{type:'NO',ref:'I1'}]],coil);
  const r=Ladder.scan(p,{I1:true},{},100,{inputCount:6,outputCount:4});
  assert.equal(r.ok,true);assert.equal(r.traces.length,1);
 }
});
