'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),M=require('../dist/ladder-monitor.js');
const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins:[
 {id:'X10:1',signalType:'POWER'},{id:'X10:2',signalType:'POWER'},
 {id:'X10:6',label:'1M',signalType:'POWER'},
 {id:'X12:1',label:'3L+',signalType:'POWER'},{id:'X12:2',label:'3M',signalType:'POWER'},
 ...Array.from({length:6},(_,i)=>({id:'X10:'+(i+7),signalType:'DI'})),
 ...Array.from({length:4},(_,i)=>({id:'X12:'+(i+3),signalType:'DO'}))]};
const program=L.blank();
function fixture(input=true){
 const inputBits=Object.fromEntries(Array.from({length:6},(_,i)=>['I'+(i+1),i===0&&input]));
 const scan=L.scan(program,inputBits,{},100,{inputCount:6,outputCount:4});
 assert.equal(scan.ok,true);
 const inputs=Object.fromEntries(d.pins.filter(p=>p.signalType==='DI').map((p,i)=>[p.id,inputBits['I'+(i+1)]]));
 const outputs=Object.fromEntries(d.pins.filter(p=>p.signalType==='DO').map((p,i)=>[p.id,scan.outputs['Q'+(i+1)]]));
 return {plcProgram:'dts-ladder-v1',ladderProgram:program,_dtsLadderTraces:scan.traces,
  _dtsLadderMemory:scan.memory,_plcRuntime:{powered:true,program:'dts-ladder-v1',inputs,outputs}};
}
test('P0-02 healthy native scan monitor is live',()=>{const c=fixture();assert.equal(M.snapshot(c,d,true,true).live,true)});
test('P0-02 Q memory differs from physical Q telemetry -> not live',()=>{const c=fixture();c._dtsLadderMemory.values.Q1=false;assert.equal(M.snapshot(c,d,true,true).live,false)});
test('P0-02 healthy deenergized scan remains live',()=>{const c=fixture(false);assert.equal(M.snapshot(c,d,true,true).live,true)});
test('P0-02 Q memory stale true with actual false -> not live',()=>{const c=fixture(false);c._dtsLadderMemory.values.Q1=true;assert.equal(M.snapshot(c,d,true,true).live,false)});
test('P0-02 Q memory missing despite native scan state -> not live',()=>{const c=fixture();delete c._dtsLadderMemory.values.Q1;assert.equal(M.snapshot(c,d,true,true).live,false)});
test('P0-02 no-memory legacy input-only telemetry remains supported',()=>{const c=fixture();delete c._dtsLadderMemory;assert.equal(M.snapshot(c,d,true,true).live,true)});
test('P0-02 genuine SET latch keeps Q high after I1 drops',()=>{
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}}]};
 const bits=Object.fromEntries(Array.from({length:6},(_,i)=>['I'+(i+1),i===0]));
 const memory={};L.scan(p,bits,memory,100,{inputCount:6,outputCount:4});bits.I1=false;
 const scan=L.scan(p,bits,memory,200,{inputCount:6,outputCount:4});assert.equal(scan.ok,true);assert.equal(scan.outputs.Q1,true);
 const c=fixture(false);c.ladderProgram=p;c._dtsLadderTraces=scan.traces;c._dtsLadderMemory=scan.memory;
 c._plcRuntime.outputs['X12:3']=true;
 assert.equal(M.snapshot(c,d,true,true).live,true);
});
