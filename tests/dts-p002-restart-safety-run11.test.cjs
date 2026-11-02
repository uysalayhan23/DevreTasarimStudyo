'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const Ladder=require('../dist/ladder-runtime.js');
const Monitor=require('../dist/ladder-monitor.js');
const defs=QA.catalog(),typeId='plc-hw-6es7211-1ae40-0xb0',model=defs[typeId];
const base=[
 ['g','P','plc','X10:1'],['g','M','plc','X10:2'],['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],['g','M','plc','X12:2'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','g','M'],['g','P','plc','X10:7']
];
function project(program=Ladder.blank()){
 return {components:[{id:'g',typeId:'supply-dc-plus'},
  {id:'plc',typeId,plcProgram:'dts-ladder-v1',ladderProgram:program},
  {id:'lamp',typeId:'lamp-green'}],
  wires:base.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]})),junctions:[],colorRoles:{}};
}
function step(p,now){const s=Native.solve(p,defs,{now});assert.equal(s.blocked,false);assert.equal(s.stable,true);const c=p.components[1];return {c,load:p.components[2],live:Monitor.snapshot(c,model,true,true)};}
test('normal powered scan -> CPU power cut -> healthy restore',()=>{
 const p=project();let s=step(p,1000);assert.equal(s.c._plcRuntime.outputs['X12:3'],true);assert.equal(s.live.live,true);
 const cut=p.wires.splice(p.wires.findIndex(w=>w.to.c==='plc'&&w.to.p==='X10:1'),1)[0];
 s=step(p,1100);assert.equal(s.c._plcRuntime.powered,false);assert.equal(s.c._plcRuntime.outputs['X12:3'],false);assert.equal(s.live.live,false);assert.equal(s.c._dtsLadderMemory,undefined);assert.deepEqual(s.c._dtsLadderTraces,[]);
 p.wires.push(cut);s=step(p,1200);assert.equal(s.c._plcRuntime.powered,true);assert.equal(s.c._plcRuntime.outputs['X12:3'],true);assert.equal(s.live.live,true);
});
test('SET latch must not survive CPU power loss',()=>{
 const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}}]};
 const p=project(program);let s=step(p,1000);assert.equal(s.c._plcRuntime.outputs['X12:3'],true);
 const cut=p.wires.splice(p.wires.findIndex(w=>w.to.c==='plc'&&w.to.p==='X10:1'),1)[0];s=step(p,1100);assert.equal(s.live.live,false);
 const di=p.wires.splice(p.wires.findIndex(w=>w.to.c==='plc'&&w.to.p==='X10:7'),1)[0];p.wires.push(cut);
 s=step(p,1200);assert.equal(s.c._plcRuntime.outputs['X12:3'],false);assert.equal(s.live.live,true);
});
test('invalid Ladder after prior scan cannot reuse stale traces',()=>{
 const p=project();let s=step(p,1000);assert.equal(s.live.live,true);
 s.c.ladderProgram={version:1,rungs:[]};s=step(p,1100);assert.equal(s.c._plcRuntime.outputs['X12:3'],false);assert.equal(s.live.live,false);
});
test('fresh inactive SET Q1 is a valid zero, not a malformed scan',()=>{
 const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'SET',ref:'Q1'}}]};
 const bits=Object.fromEntries(Array.from({length:6},(_,i)=>['I'+(i+1),false]));
 const r=Ladder.scan(program,bits,{},100,{inputCount:6,outputCount:4});
 assert.equal(r.ok,true);assert.equal(r.outputs.Q1,false);
 assert.equal(r.memory.values.Q1,false);assert.equal(r.traces[0].value,false);
 const p=project(program);p.wires=p.wires.filter(w=>!(w.to.c==='plc'&&w.to.p==='X10:7'));
 const s=step(p,100);assert.equal(s.c._dtsLadderError,undefined);
 assert.equal(s.live.live,true);assert.equal(s.c._plcRuntime.outputs['X12:3'],false);
});
