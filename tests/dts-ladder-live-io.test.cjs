'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const M=require('../dist/ladder-monitor.js'),D=require('../dist/ladder-diagram.js');
const d={pins:[{signalType:'DI',id:'X10:7'},{signalType:'DI',id:'X10:8'},{signalType:'DO',id:'X12:3'}]};
const c={plcProgram:'dts-ladder-v1',_plcRuntime:{program:'dts-ladder-v1',powered:true,inputs:{'X10:7':true,'X10:8':false},outputs:{'X12:3':true}}};
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
