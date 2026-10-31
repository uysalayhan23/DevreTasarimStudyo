'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const M=require('../dist/ladder-monitor.js'),D=require('../dist/ladder-diagram.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=require('../dist/ladder-runtime.js');
const d=QA.catalog()['plc-hw-6es7211-1ae40-0xb0'];
const ladderProgram=L.blank();
const scan=L.scan(ladderProgram,{I1:true},{},100,{inputCount:6,outputCount:4});
const inputs=Object.fromEntries(d.pins.filter(x=>x.signalType==='DI').map((x,i)=>[x.id,i===0]));
const outputs=Object.fromEntries(d.pins.filter(x=>x.signalType==='DO').map((x,i)=>[x.id,i===0]));
const c={plcProgram:'dts-ladder-v1',ladderProgram,_dtsLadderTraces:scan.traces,_plcRuntime:{program:'dts-ladder-v1',powered:true,inputs,outputs}};
test('read-only I/O watch uses exact original terminal states',()=>{
 const s=M.snapshot(c,d,true,true);assert.equal(s.inputs[0].value,true);
 assert.equal(s.inputs[1].value,false);assert.equal(s.outputs[0].value,true);
 assert.match(M.markup(s),/X12:3/);
});
test('draft mismatch, stopped simulator and wrong program suppress live values',()=>{
 for(const s of [M.snapshot(c,d,true,false),M.snapshot(c,d,false,true),M.snapshot({...c,plcProgram:'mirror'},d,true,true)]){
  assert.equal(s.live,false);assert.equal(s.outputs[0].value,null);
 }
});
test('SVG network provides contact and coil editing targets for keyboard',()=>{
 const svg=D.render({id:'R1',paths:[[{type:'NC',ref:'I2'}]],coil:{type:'OUT',ref:'Q1'}},{index:2});
 assert.match(svg,/data-ladder-contact="2:0:0"/);assert.match(svg,/data-ladder-coil="2"/);
 assert.match(svg,/role="button"/);assert.match(svg,/tabindex="0"/);
});
