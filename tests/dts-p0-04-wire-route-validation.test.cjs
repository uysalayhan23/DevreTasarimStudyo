'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');

function project(){
 return {
   version:7,workspaceMode:'control',name:'P0-04 route integrity',
   components:[{id:'A',typeId:'resistor',x:0,y:0},{id:'B',typeId:'resistor',x:100,y:0}],
   junctions:[],wires:[{id:'W',from:{c:'A',p:'1'},to:{c:'B',p:'2'}}]
 };
}
function parseWith(field,value){
 const p=project();
 if(field!==null)p.wires[0][field]=value;
 return Store.parse(JSON.stringify(p));
}
test('P0-04 legacy wire without route array can reopen',()=>assert.equal(parseWith(null,null).wires.length,1));
test('P0-04 null and empty route arrays remain compatible',()=>{
 assert.ok(parseWith('points',null));
 assert.ok(parseWith('points',[]));
 assert.ok(parseWith('fixedPoints',null));
});
test('P0-04 valid manual and fixed routes remain compatible',()=>{
 assert.deepEqual(parseWith('points',[{x:10,y:20},{x:30,y:40}]).wires[0].points,
                  [{x:10,y:20},{x:30,y:40}]);
 assert.deepEqual(parseWith('fixedPoints',[{x:10,y:20}]).wires[0].fixedPoints,[{x:10,y:20}]);
});
test('P0-04 malformed text and object routes cannot crash renderer',()=>{
 for(const field of ['points','fixedPoints']){
   assert.throws(()=>parseWith(field,'bad'));
   assert.throws(()=>parseWith(field,{x:3,y:5}));
 }
});
test('P0-04 reject invalid route point structures before SVG routing',()=>{
 for(const field of ['points','fixedPoints']){
   for(const value of [[null],[[1,2]],[{x:2}],[{x:'2',y:3}]]){
     assert.throws(()=>parseWith(field,value));
   }
 }
});
test('P0-04 reject nonfinite in-memory coordinate without coercion',()=>{
 const p=project();p.wires[0].points=[{x:Infinity,y:0}];
 assert.throws(()=>Store.validate(p));
 p.wires[0].points=[{x:NaN,y:0}];
 assert.throws(()=>Store.validate(p));
});
