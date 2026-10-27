'use strict';
// Original DTS Simulation.solve + 703 catalogue: prove physical load vs PLC logic are distinct.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const defs=QA.catalog(),typeId='plc-hw-6es7211-1ae40-0xb0',d=defs[typeId];
const program={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
const tuples=[
 ['g','P','plc','X10:1'],['g','M','plc','X10:2'],['g','M','plc','X10:6'],
 ['g','P','plc','X12:1'],['g','M','plc','X12:2'],
 ['plc','X12:3','lamp','X1'],['lamp','X2','g','M'],['g','P','plc','X10:7']
];
function build(disconnected=[]){
 const components=[{id:'g',typeId:'supply-dc-plus'},{id:'plc',typeId,plcProgram:'dts-ladder-v1',
   ladderProgram:structuredClone(program)},{id:'lamp',typeId:'lamp-green'}];
 const wires=tuples.filter((_,i)=>!disconnected.includes(i)).map(([a,ap,b,bp],i)=>({
  id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp},points:[]
 }));
 return {components,wires,junctions:[],colorRoles:{}};
}
const cases=[
 {title:'correct full wiring energizes output and lamp',cut:[],input:true,output:true,lamp:true,powered:true},
 {title:'I1 missing returns PLC output LOW and lamp OFF',cut:[7],input:false,output:false,lamp:false,powered:true},
 {title:'PLC L+ missing disables output',cut:[0],input:false,output:false,lamp:false,powered:false},
 {title:'PLC M missing disables output',cut:[1],input:false,output:false,lamp:false,powered:false},
 {title:'output bank DC+ missing de-energizes lamp',cut:[3],input:true,output:true,lamp:false,powered:true},
 {title:'Q1 wire missing de-energizes lamp but retains logical Q1',cut:[5],input:true,output:true,lamp:false,powered:true},
 {title:'lamp return missing de-energizes lamp but retains logical Q1',cut:[6],input:true,output:true,lamp:false,powered:true}
];
test('native-verified selectable Siemens CPU 1211C pins and Ladder source',()=>{
 assert.ok(d,'missing real 703 catalogue PLC');
 assert.notEqual(d.superseded,true,'native model must not be superseded');
 assert.equal(d.pins.filter(p=>p.signalType==='DI').length,6);
 assert.equal(d.pins.filter(p=>p.signalType==='DO').length,4);
 for(const [a,ap,b,bp] of tuples)for(const [id,p] of [[a,ap],[b,bp]]){
  const def=defs[id==='plc'?typeId:id==='g'?'supply-dc-plus':'lamp-green'];
  assert.ok(def.pins.some(x=>x.id===p),'unknown actual catalogue terminal '+id+'/'+p);
 }
});
for(const c of cases)test(c.title,()=>{
 const p=build(c.cut),solved=Native.solve(p,defs,{now:1500});
 assert.equal(solved.blocked,false);assert.equal(solved.shortCircuit,false);
 assert.equal(!!solved.stable,true,'original solver must settle');
 const logic=p.components.find(x=>x.id==='plc')._plcRuntime,load=p.components.find(x=>x.id==='lamp');
 assert.equal(!!logic.powered,c.powered,'CPU DC source');
 assert.equal(!!logic.inputs['X10:7'],c.input,'PLC DI1');
 assert.equal(!!logic.outputs['X12:3'],c.output,'PLC Q1 memory value');
 assert.equal(!!load._active,c.lamp,'physical energy at load');
});
