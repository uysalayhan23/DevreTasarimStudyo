'use strict';
// Real native Simulation.solve and physical 703 catalogue: swapped PLC pin order
// must not energize a lamp or remap an I/Q address.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js'),Ladder=require('../dist/ladder-runtime.js');
const defs=QA.catalog(),typeId='plc-hw-6es7211-1ae40-0xb0';
const tuples=[
 ['g','P','plc','X10:1'],['g','M','plc','X10:2'],['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],['g','M','plc','X12:2'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','g','M'],['g','P','plc','X10:7']
];
function project(){
 return {components:[
  {id:'g',typeId:'supply-dc-plus'},
  {id:'plc',typeId,plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()},
  {id:'lamp',typeId:'lamp-green'}
 ],wires:tuples.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]})),
 junctions:[],colorRoles:{}};
}
function swapped(a,b){
 const d=structuredClone(defs[typeId]),i=d.pins.findIndex(p=>p.id===a),j=d.pins.findIndex(p=>p.id===b);
 [d.pins[i],d.pins[j]]=[d.pins[j],d.pins[i]];
 return {...defs,[typeId]:d};
}
function solve(catalog){
 const p=project(),s=Native.solve(p,catalog,{now:1500});
 assert.equal(s.blocked,false);assert.equal(s.stable,true);
 return {cpu:p.components[1],lamp:p.components[2]};
}
test('real canonical PLC I1 energizes only Q1 and the wired lamp',()=>{
 const {cpu,lamp}=solve(defs);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],true);
 assert.equal(cpu._plcRuntime.outputs['X12:4'],false);
 assert.equal(lamp._active,true);
});
test('swapped input order fails closed in native solver',()=>{
 const {cpu,lamp}=solve(swapped('X10:7','X10:8'));
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(lamp._active,false);assert.ok(cpu._dtsLadderError);
});
test('swapped output order fails closed rather than powering Q2',()=>{
 const {cpu,lamp}=solve(swapped('X12:3','X12:4'));
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(cpu._plcRuntime.outputs['X12:4'],false);
 assert.equal(lamp._active,false);assert.ok(cpu._dtsLadderError);
});
