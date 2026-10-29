'use strict';
// Reproduces a user-observed, powered SMPS -> CPU 1211C -> LAD -> Q1 lamp circuit.
// Use the application's genuine 703-item catalog and original Simulation.solve.
const {test}=require('node:test'),assert=require('node:assert/strict');
const Native=require('../dist/simulation.js'),Ladder=require('../dist/ladder-runtime.js');
const oldWindow=global.window;
global.window=global;
require('../dist/library.js');
const catalog=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));
global.window=oldWindow;
const plcType='plc-hw-6es7211-1ae40-0xb0';
const connect=[
 ['ac','L','psu','L'],['ac','N','psu','N'],
 ['psu','P','plc','X10:1'],['psu','M','plc','X10:2'],
 ['psu','P','plc','X10:4'],['psu','M','plc','X10:5'],['psu','M','plc','X10:6'],
 ['psu','P','plc','X12:1'],['psu','M','plc','X12:2'],
 ['psu','P','s1','13'],['s1','14','plc','X10:7'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','psu','M']
];
function prepare(changes={}){
 const c={id:'plc',typeId:plcType,plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()};
 const b={id:'s1',typeId:'push-no',state:!!changes.pressed};
 const lamp={id:'lamp',typeId:'lamp-red'};
 const components=[{id:'ac',typeId:'supply-1p'}, {id:'psu',typeId:'smps'}, c, b,lamp];
 let pairs=connect.filter(row=>!(changes.cut&&row[0]===changes.cut[0]&&row[1]===changes.cut[1]&&row[2]===changes.cut[2]&&row[3]===changes.cut[3])).map(row=>row.slice());
 if(changes.reverseCPU)pairs=pairs.map(row=>row[2]==='plc'&&row[3]==='X10:1'?[...row.slice(0,3),'X10:2']:row[2]==='plc'&&row[3]==='X10:2'?[...row.slice(0,3),'X10:1']:row);
 if(changes.reverseBank)pairs=pairs.map(row=>row[2]==='plc'&&row[3]==='X12:1'?[...row.slice(0,3),'X12:2']:row[2]==='plc'&&row[3]==='X12:2'?[...row.slice(0,3),'X12:1']:row);
 if(changes.reverseDI)pairs=pairs.map(row=>row[2]==='plc'&&row[3]==='X10:7'?[...row.slice(0,3),'X10:6']:row);
 if(changes.noProgram){delete c.plcProgram;delete c.ladderProgram}
 const project={components,wires:pairs.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]})),junctions:[],colorRoles:{}};
 return {project,c,b,lamp};
}
function solve(change={}){
 const data=prepare(change),out=Native.solve(data.project,catalog,{now:1000,reset:true});
 assert.equal(out.blocked,false);assert.equal(out.stable,true);return {...data,out};
}
test('SMPS/native catalog: CPU 1211C and a 230 VAC/24 VDC supply exist',()=>{
 assert.equal(global.COMPONENT_LIBRARY.length,703);
 assert.equal(catalog.smps.kind,'power24');assert.equal(Ladder.supportedPLC(catalog[plcType]),true);
});
test('SMPS ON but button OFF: PLC powered; Ladder Q1 output remains low',()=>{
 const {c,lamp}=solve();assert.equal(c._plcRuntime.powered,true);assert.equal(c._plcRuntime.inputs['X10:7'],false);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
test('SMPS ON and button ON: PLC powers and saved LAD drives Q1 lamp',()=>{
 const {c,lamp}=solve({pressed:true});assert.equal(c._plcRuntime.powered,true);assert.equal(c._plcRuntime.inputs['X10:7'],true);
 assert.equal(c._plcRuntime.outputs['X12:3'],true);assert.equal(lamp._active,true);
 assert.equal(c._dtsLadderTraces.length,1);assert.equal(c._dtsLadderTraces[0].active,true);
});
test('SMPS serial scan: button release deenergizes Q1 and lamp',()=>{
 const {project,c,b,lamp}=prepare({pressed:false});
 for(const [pressed,expected,now] of [[false,false,1000],[true,true,1100],[false,false,1200]]){
  b.state=pressed;const r=Native.solve(project,catalog,{now,reset:now===1000});
  assert.equal(r.stable,true);assert.equal(c._plcRuntime.powered,true);
  assert.equal(c._plcRuntime.outputs['X12:3'],expected);assert.equal(lamp._active,expected);
 }
});
test('SMPS AC L cut: no virtual CPU backplane or phantom Q',()=>{
 const {c,lamp}=solve({pressed:true,cut:['ac','L','psu','L']});assert.equal(c._plcRuntime.powered,false);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
test('SMPS AC N cut: no virtual CPU backplane or phantom Q',()=>{
 const {c,lamp}=solve({pressed:true,cut:['ac','N','psu','N']});assert.equal(c._plcRuntime.powered,false);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
test('SMPS CPU positive feed cut: fail closed',()=>{
 const {c}=solve({pressed:true,cut:['psu','P','plc','X10:1']});assert.equal(c._plcRuntime.powered,false);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);
});
test('SMPS CPU M feed cut: fail closed',()=>{
 const {c}=solve({pressed:true,cut:['psu','M','plc','X10:2']});assert.equal(c._plcRuntime.powered,false);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);
});
test('SMPS reversed CPU supply: fail closed',()=>{
 const {c,lamp}=solve({pressed:true,reverseCPU:true});assert.equal(c._plcRuntime.powered,false);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
test('SMPS reversed output supply: powered CPU cannot energize Q1 lamp',()=>{
 const {c,lamp}=solve({pressed:true,reverseBank:true});assert.equal(c._plcRuntime.powered,true);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
test('SMPS open dedicated input common: powered CPU does not read I1',()=>{
 const {c,lamp}=solve({pressed:true,cut:['psu','M','plc','X10:6']});assert.equal(c._plcRuntime.powered,true);
 assert.equal(c._plcRuntime.inputs['X10:7'],false);assert.equal(lamp._active,false);
});
test('SMPS open Q bank supply: powered CPU cannot energize lamp',()=>{
 const {c,lamp}=solve({pressed:true,cut:['psu','P','plc','X12:1']});assert.equal(c._plcRuntime.powered,true);
 assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
test('SMPS powered but no saved LAD: CPU idle, Q1/lamp OFF',()=>{
 const {c,lamp}=solve({pressed:true,noProgram:true});assert.equal(c._plcRuntime.powered,true);
 assert.equal(c._plcRuntime.program,'dts-ladder-idle');assert.equal(c._plcRuntime.outputs['X12:3'],false);assert.equal(lamp._active,false);
});
