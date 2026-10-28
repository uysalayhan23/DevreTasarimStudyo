'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const D=require('../dist/ladder-diagram.js');
function wireOn(type,input,output){
 const rung={id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:type==='OUT'?'Q1':'T1',presetMs:100}};
 const svg=D.render(rung,{live:true,values:{I1:input},pathStates:[input],coilValue:output});
 const matches=[...svg.matchAll(/<line x1="(\d+)" y1="80" x2="929" y2="80" class="([^"]+)"\/>/g)];
 assert.equal(matches.length,1);
 return matches[0][2]==='dts-ladder-wire-hot';
}
test('TON pending keeps output wire inactive',()=>assert.equal(wireOn('TON',true,false),false));
test('TON complete activates output wire',()=>assert.equal(wireOn('TON',true,true),true));
test('TOF delayed output remains energized after input drops',()=>assert.equal(wireOn('TOF',false,true),true));
test('OUT draws actual on/off state',()=>{assert.equal(wireOn('OUT',true,true),true);assert.equal(wireOn('OUT',false,false),false)});
