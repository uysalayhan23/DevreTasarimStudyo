'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Monitor=require('../dist/ladder-monitor.js');
const Ladder=require('../dist/ladder-runtime.js');
const defs=QA.catalog(),type='plc-hw-6es7211-1ae40-0xb0';
const lines=[
 ['g','P','plc','X10:1'],['g','M','plc','X10:2'],['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],['g','M','plc','X12:2'],['g','P','plc','X10:7'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','g','M']
];
function build(mode='dts-ladder-v1'){
 const plc={id:'plc',typeId:type,plcProgram:mode,ladderProgram:Ladder.blank()};
 const lamp={id:'lamp',typeId:'lamp-green'};
 const project={components:[{id:'g',typeId:'supply-dc-plus'},plc,lamp],wires:lines.map(([a,b,c,d],i)=>({id:'w'+i,from:{c:a,p:b},to:{c,p:d},points:[]})),junctions:[],colorRoles:{}};
 return {project,plc,lamp,run:time=>Simulation.solve(project,defs,{now:time})};
}
test('valid saved Ladder: powered Q1 and lamp, original native scan trace and monitor live',()=>{
 const x=build(); const r=x.run(1000);assert.equal(r.blocked,false);assert.equal(r.stable,true);
 assert.equal(x.plc._plcRuntime?.outputs?.['X12:3'],true);assert.equal(x.lamp._active,true);
 assert.equal(x.plc._dtsLadderTraces?.length,1);
 assert.equal(Monitor.snapshot(x.plc,defs[type],true,true).live,true);
});
test('malformed program clears native output, lamp and stale trace',()=>{
 const x=build();x.run(1000);assert.equal(x.lamp._active,true);
 x.plc.ladderProgram.rungs[0].coil.ref='Q99';x.run(1100);
 assert.equal(x.plc._plcRuntime.outputs['X12:3'],false);assert.equal(x.lamp._active,false);
 assert.deepEqual(x.plc._dtsLadderTraces,[]);assert.equal(x.plc._dtsLadderMemory,undefined);
 assert.equal(Monitor.snapshot(x.plc,defs[type],true,true).live,false);
});
test('a legacy mode cannot drive validated CPU1211C (negative safety gate)',()=>{
 const x=build('mirror'); const r=x.run(1200);
 assert.equal(r.blocked,false); assert.equal(x.plc._plcRuntime.outputs['X12:3'],false);
 assert.equal(x.lamp._active,false);
 assert.equal(Monitor.snapshot(x.plc,defs[type],true,true).live,false);
});
test('switching from a running Ladder scan to unsupported mirror clears old Q, memory and trace',()=>{
 const x=build();x.run(1000);assert.equal(x.plc._plcRuntime.outputs['X12:3'],true);
 x.plc.plcProgram='mirror';x.run(1100);
 assert.equal(x.plc._plcRuntime.outputs['X12:3'],false);
 assert.equal(x.lamp._active,false);
 assert.equal(x.plc._dtsLadderMemory,undefined);
 assert.deepEqual(x.plc._dtsLadderTraces,[]);
 assert.equal(Monitor.snapshot(x.plc,defs[type],true,true).live,false);
});
test('verified CPU with no program safely idles without energizing a lamp',()=>{
 const x=build();x.run(1000);
 delete x.plc.plcProgram;delete x.plc.ladderProgram;x.run(1100);
 assert.equal(x.plc._plcRuntime.powered,true);
 assert.equal(x.plc._plcRuntime.outputs['X12:3'],false);
 assert.equal(x.lamp._active,false);
 assert.equal(x.plc._dtsLadderMemory,undefined);
 assert.deepEqual(x.plc._dtsLadderTraces,[]);
});
test('verified CPU rejects wrong terminal catalogue with no saved program',()=>{
 const x=build();const changed=structuredClone(defs[type]);changed.pins=changed.pins.filter(p=>p.id!=='X12:4');
 const d={...defs,[type]:changed};delete x.plc.plcProgram;delete x.plc.ladderProgram;
 const r=Simulation.solve(x.project,d,{now:1200});
 assert.equal(r.blocked,false);
 assert.equal(x.plc._plcRuntime.outputs['X12:3'],false);
 assert.equal(x.lamp._active,false);
});
test('unsupported arbitrary mode also fails closed for verified CPU',()=>{
 const x=build('not-input');x.run(1200);
 assert.equal(x.plc._plcRuntime.outputs['X12:3'],false);
 assert.equal(x.lamp._active,false);
});
test('legacy PLC preserves its previously supported mirror behavior',()=>{
 const P=require('../dist/plc-runtime.js');
 const d={id:'legacy',isPLC:true,outputType:'PNP',pins:[
  {id:'P',label:'L+',signalType:'POWER'}, {id:'M',label:'M',signalType:'POWER'},
  {id:'I',signalType:'DI'}, {id:'Q',signalType:'DO'}]};
 const c={id:'old',plcProgram:'mirror'};
 const state=P.evaluate(c,d,{voltage:()=>true},1100);
 assert.equal(state.powered,true);
 assert.equal(state.outputs.Q,true);
});
