'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Simulation=require('../dist/simulation.js'),Ladder=require('../dist/ladder-runtime.js');
const old=global.window;global.window=global;require('../dist/library.js');
const catalog=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));global.window=old;
const limits={inputCount:6,outputCount:4};
const pulseProgram=(type='CTU',preset=3,reset=false)=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'C1',preset}},
 ...(reset?[{id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type:'RESET',ref:'C1'}}]:[]),
 {id:'RQ',paths:[[{type:'NO',ref:'C1'}]],coil:{type:'OUT',ref:'Q1'}}
]});
function circuit(type='CTU',preset=3,reset=false){
 const cpu={id:'plc',typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:pulseProgram(type,preset,reset)};
 const button={id:'s1',typeId:'push-no',state:false},resetButton={id:'s2',typeId:'push-no',state:false},lamp={id:'lamp',typeId:'lamp-red'};
 const parts=[{id:'ac',typeId:'supply-1p'},{id:'psu',typeId:'smps'},cpu,button,resetButton,lamp];
 const route=[['ac','L','psu','L'],['ac','N','psu','N'],['psu','P','plc','X10:1'],['psu','M','plc','X10:2'],['psu','M','plc','X10:6'],['psu','P','plc','X12:1'],['psu','M','plc','X12:2'],['psu','P','s1','13'],['s1','14','plc','X10:7'],['psu','P','s2','13'],['s2','14','plc','X10:8'],['plc','X12:3','lamp','X1'],['lamp','X2','psu','M']];
 const project={components:parts,wires:route.map(([a,ap,b,bp],i)=>({id:'w'+i,from:{c:a,p:ap},to:{c:b,p:bp}})),junctions:[]};
 let t=0;
 const step=(pressed=false,resetPressed=false)=>{
  button.state=pressed;resetButton.state=resetPressed;
  const result=Simulation.solve(project,catalog,{now:1000+t*10,reset:t===0});t++;
  return {result,count:cpu._dtsLadderTraces?.[0]?.count,output:cpu._plcRuntime?.outputs?.['X12:3'],powered:cpu._plcRuntime?.powered,lamp:lamp._active};
 };
 return {cpu,project,step};
}
test('CTU real SMPS + native solver retains count across release and reaches Q1 on third press',()=>{
 const {step}=circuit();
 const steps=[step(false),step(true),step(true),step(false),step(true),step(false),step(true)];
 assert.deepEqual(steps.map(x=>x.count),[0,1,1,1,2,2,3]);
 assert.deepEqual(steps.map(x=>x.output),[false,false,false,false,false,false,true]);
 assert.equal(steps.at(-1).lamp,true);
 for(const s of steps){assert.equal(s.powered,true);assert.equal(s.result.stable,true);assert.equal(s.result.oscillating,false)}
});
test('CTD real SMPS counts down only new edges; Q1 starts on zero',()=>{
 const {step}=circuit('CTD',2);
 const steps=[step(false),step(true),step(true),step(false),step(true)];
 assert.deepEqual(steps.map(x=>x.count),[2,1,1,1,0]);
 assert.deepEqual(steps.map(x=>x.output),[false,false,false,false,true]);
});
test('CTU explicit RESET input on I2 clears counter without a phantom output',()=>{
 const {step}=circuit('CTU',2,true);
 const steps=[step(false),step(true),step(false),step(true),step(false,true)];
 assert.deepEqual(steps.slice(0,4).map(x=>x.count),[0,1,1,2]);
 assert.equal(steps[3].output,true);assert.equal(steps[4].count,0); // RESET clears C1 and the next native network pass sees its reset state.
 assert.equal(steps[4].output,false);
});
test('real loss of AC mains clears counter, Q1 and old state',()=>{
 const {project,cpu,step}=circuit('CTU',2);
 step(false);step(true);step(false);step(true);
 assert.equal(cpu._dtsLadderMemory?.blocks?.C1?.count,2);
 const ac=project.wires.find(w=>w.from.c==='ac'&&w.from.p==='L');assert.ok(ac);
 project.wires=project.wires.filter(w=>w!==ac);
 const off=step(false);assert.equal(off.powered,false);assert.equal(off.output,false);assert.equal(off.lamp,false);
 assert.equal(cpu._dtsLadderMemory,undefined,'real power loss must erase old CTU state');
 project.wires.push(ac);
 const recovered=step(false);assert.equal(recovered.powered,true);assert.equal(recovered.count,0);assert.equal(recovered.output,false);
});
test('continuous high input across multiple independent solves must never add repeated edges',()=>{
 const {step}=circuit('CTU',3);
 const steps=[step(false),step(true),step(true),step(true),step(true)];
 assert.deepEqual(steps.map(x=>x.count),[0,1,1,1,1]);
});
test('native interpreter retains previous correct CTU/CTD edge contract',()=>{
 for(const type of ['CTU','CTD']){
  const p=pulseProgram(type,2),m={};
  const seq=[false,true,true,false,true].map((input,i)=>Ladder.scan(p,{I1:input},m,i,limits));
  assert.equal(seq.every(x=>x.ok),true);
  assert.deepEqual(seq.map(x=>x.traces[0].count),type==='CTU'?[0,1,1,1,2]:[2,1,1,1,0]);
 }
});
