'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const D=require('../dist/ladder-diagram.js');
const rung={id:'R1',paths:[[{type:'NO',ref:'I1'},{type:'NC',ref:'I2'}],[{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q1'}};
test('network, twin rails and NC/contact geometry',()=>{
 const out=D.render(rung,{index:1});
 assert.match(out,/Network 2/);assert.match(out,/>L1</);assert.match(out,/>L2</);assert.match(out,/>NC</);
 assert.match(out,/dts-ladder-rails/);assert.doesNotMatch(out,/dts-ladder-wire-hot/);
});
test('green path derives only from true NO/NC values during live mode',()=>{
 assert.equal(D.pathState(rung.paths[0],{I1:true,I2:false}),true);
 assert.equal(D.pathState(rung.paths[0],{I1:true,I2:true}),false);
 assert.match(D.render(rung,{live:true,values:{I1:true,I2:false}}),/dts-ladder-wire-hot/);
 assert.doesNotMatch(D.render(rung,{live:false,values:{I1:true,I2:false}}),/dts-ladder-wire-hot/);
});
test('time and count blocks are drawn as IEC-like function blocks',()=>{
 for(const type of ['TON','TOF','TP','CTU','CTD']){
  const out=D.render({...rung,coil:{type,ref:type.startsWith('CT')?'C1':'T1',presetMs:250,preset:3}});
  assert.match(out,/dts-ladder-function-block/);assert.ok(out.includes('>'+type+'</text>'));
 }
});
test('untrusted rung identifiers are escaped before SVG markup',()=>{
 const out=D.render({...rung,id:'<script>evil()</script>',paths:[[{type:'NO',ref:'<svg/onload=bad()>'}]]});
 assert.doesNotMatch(out,/<script>/);assert.doesNotMatch(out,/<svg\/onload/);
});
