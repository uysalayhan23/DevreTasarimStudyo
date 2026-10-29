'use strict';
// Actual product catalog + original native Simulation.solve / Ladder.scan.
const {test}=require('node:test'),assert=require('node:assert/strict');
const Simulation=require('../dist/simulation.js'),Ladder=require('../dist/ladder-runtime.js');
const originalWindow=global.window;global.window=global;
require('../dist/library.js');
const catalog=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));
global.window=originalWindow;
const program=()=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q2'}}
]});
function scene({pressed=true,short=null,second=true,bankReverse=false}={}){
 const plc={id:'plc',typeId:'plc-hw-6es7211-1ae40-0xb0',plcProgram:'dts-ladder-v1',ladderProgram:program()};
 const button={id:'push',typeId:'push-no',state:pressed};
 const lamp1={id:'lamp1',typeId:'lamp-red'};
 const lamp2={id:'lamp2',typeId:'lamp-red'};
 const components=[{id:'ac',typeId:'supply-1p'},{id:'smps',typeId:'smps'},plc,button,lamp1,...(second?[lamp2]:[])];
 const wires=[['ac','L','smps','L'],['ac','N','smps','N'],['smps','P','plc','X10:1'],['smps','M','plc','X10:2'],['smps','M','plc','X10:6'],
  ['smps',bankReverse?'M':'P','plc','X12:1'],['smps',bankReverse?'P':'M','plc','X12:2'],
  ['smps','P','push','13'],['push','14','plc','X10:7'],
  ['plc','X12:3','lamp1','X1'],['lamp1','X2','smps','M']];
 if(second)wires.push(['plc','X12:4','lamp2','X1'],['lamp2','X2','smps','M']);
 if(short)wires.push(['plc',short.output,'plc',short.target]);
 const project={components,wires:wires.map(([c,p,d,q],i)=>({id:'w'+i,from:{c,p},to:{c:d,p:q}})),junctions:[]};
 return {project,plc,button,lamp1,lamp2};
}
function tick(config){const data=scene(config);const result=Simulation.solve(data.project,catalog,{now:1000,reset:true});return {...data,result};}
function assertHealthy(r){assert.equal(r.result.blocked,false);assert.equal(r.result.stable,true,'native network must reach fixed point');assert.equal(r.result.oscillating,false);assert.equal(r.plc._plcRuntime.powered,true)}
test('verified CPU and 703 catalog preserve the proper I/O contract',()=>{assert.equal(global.COMPONENT_LIBRARY.length,703);assert.ok(Ladder.supportedPLC(catalog['plc-hw-6es7211-1ae40-0xb0']));});
test('normal Q1/Q2 output bank stays powered and both lamps energize',()=>{const r=tick();assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],true);assert.equal(r.plc._plcRuntime.outputs['X12:4'],true);assert.equal(r.lamp1._active,true);assert.equal(r.lamp2._active,true)});
test('open inputs do not create spurious output shorts',()=>{const r=tick({pressed:false});assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],false);assert.equal(r.plc._plcRuntime.outputs['X12:4'],false)});
test('hard short Q1->3M fails closed without oscillating',()=>{const r=tick({short:{output:'X12:3',target:'X12:2'}});assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],false);assert.equal(r.plc._plcRuntime.outputs['X12:4'],true);assert.equal(r.lamp1._active,false);assert.equal(r.lamp2._active,true)});
test('hard short Q2->3M isolates only Q2, keeping healthy Q1 active',()=>{const r=tick({short:{output:'X12:4',target:'X12:2'}});assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],true);assert.equal(r.plc._plcRuntime.outputs['X12:4'],false);assert.equal(r.lamp1._active,true);assert.equal(r.lamp2._active,false)});
test('hard short Q1->CPU M also fails closed when M shares SMPS return',()=>{const r=tick({short:{output:'X12:3',target:'X10:2'}});assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],false);assert.equal(r.lamp1._active,false)});
test('healthy Q1 with no secondary lamp does not falsely detect return short',()=>{const r=tick({second:false});assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],true);assert.equal(r.lamp1._active,true)});
test('reversed bank remains fail closed',()=>{const r=tick({bankReverse:true});assert.equal(r.result.blocked,false);assert.equal(r.plc._plcRuntime.outputs['X12:3'],false);assert.equal(r.lamp1._active,false)});
test('shorted output can be disconnected and then resume with healthy wiring',()=>{
 const r=tick({short:{output:'X12:3',target:'X12:2'}});
 assertHealthy(r);assert.equal(r.plc._plcRuntime.outputs['X12:3'],false);
 r.project.wires=r.project.wires.filter(w=>w.id!=='w'+(r.project.wires.length-1));
 const next=Simulation.solve(r.project,catalog,{now:1100,reset:false});
 assert.equal(next.stable,true);assert.equal(next.oscillating,false);assert.equal(r.plc._plcRuntime.outputs['X12:3'],true);assert.equal(r.lamp1._active,true);
});
