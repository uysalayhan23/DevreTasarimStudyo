'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Conductors=require('../dist/conductors.js');
const project=()=>({components:[{id:'a',typeId:'a'},{id:'b',typeId:'b'}],junctions:[],wires:[]});
const ends=[{c:'a',p:'1'},{c:'b',p:'1'}];
const catalog=()=>({a:{id:'a',kind:'terminal',pins:[{id:'1'}]},b:{id:'b',kind:'terminal',pins:[{id:'1'}]}});
test('malformed catalog pins object is rejected without crashing',()=>{
 const d=catalog();d.a.pins={bad:true};assert.equal(Conductors.check(project(),d,...ends).ok,false);
});
test('valid catalog pin arrays still allow connection',()=>assert.equal(Conductors.check(project(),catalog(),...ends).ok,true));
test('missing terminal is rejected',()=>{
 const d=catalog();d.a.pins=[];assert.equal(Conductors.check(project(),d,...ends).ok,false);
});
