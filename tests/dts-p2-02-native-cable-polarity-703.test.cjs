'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Ladder=require('../dist/ladder-runtime.js');
const catalog=QA.catalog();

const wires=[
 ['g','P','plc','X10:1'],
 ['g','M','plc','X10:2'],
 ['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],
 ['g','M','plc','X12:2'],
 ['plc','X12:3','lamp','X1'],
 ['lamp','X2','g','M'],
 ['g','P','plc','X10:7']
];

function project(connections=wires){
 return {
  components:[
   {id:'g',typeId:'supply-dc-plus'},
   {id:'plc',typeId:'plc-hw-6es7211-1ae40-0xb0',
    plcProgram:'dts-ladder-v1',ladderProgram:Ladder.blank()},
   {id:'lamp',typeId:'lamp-green'}
  ],
  wires:connections.map(([a,ap,b,bp],i)=>({
   id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]
  })),
  junctions:[],colorRoles:{}
 };
}
function solve(connections=wires){
 const p=project(connections);
 const result=Simulation.solve(p,catalog,{now:1500});
 assert.equal(result.blocked,false);
 assert.equal(result.stable,true);
 return {
  cpu:p.components[1],
  lamp:p.components[2]
 };
}
function changed(){
 return wires.map(w=>w.slice());
}
function assertOff(connections,label){
 const {lamp}=solve(connections);
 assert.equal(lamp._active,false,label);
}

test('P2-02 positive: complete circuit lights lamp',()=>{
 const {cpu,lamp}=solve();
 assert.equal(cpu._plcRuntime.powered,true);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],true);
 assert.equal(lamp._active,true);
});

for(let i=0;i<wires.length;i++){
 test('P2-02 negative: disconnected wire '+i,()=>{
  assertOff(wires.filter((_,j)=>j!==i),'wire '+i);
 });
}

test('P2-02 negative: I1 connected to I2',()=>{
 const x=changed();
 x[7][3]='X10:8';
 const {cpu,lamp}=solve(x);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(lamp._active,false);
});

test('P2-02 negative: Q1 load connected to Q2',()=>{
 const x=changed();
 x[5][1]='X12:4';
 assertOff(x,'Q2');
});

test('P2-02 negative: reversed CPU supply',()=>{
 const x=changed();
 x[0][1]='M';
 x[1][1]='P';
 const {cpu,lamp}=solve(x);
 assert.equal(cpu._plcRuntime.powered,false);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(lamp._active,false);
});

test('P2-02 negative: reversed output bank supply',()=>{
 const x=changed();
 x[3][1]='M';
 x[4][1]='P';
 const {cpu,lamp}=solve(x);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(lamp._active,false);
});

test('P2-02 negative: reversed I1 polarity',()=>{
 const x=changed();
 x[7][1]='M';
 const {cpu,lamp}=solve(x);
 assert.equal(cpu._plcRuntime.inputs['X10:7'],false);
 assert.equal(cpu._plcRuntime.outputs['X12:3'],false);
 assert.equal(lamp._active,false);
});