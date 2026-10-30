'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

function base(){
 return {
  version:7,name:'Kablo',workspaceMode:'control',
  components:[{id:'A',typeId:'resistor',x:0,y:0},{id:'B',typeId:'resistor',x:20,y:20}],
  junctions:[{id:'J',x:0,y:10}],
  wires:[{id:'w1',from:{c:'A',p:'1'},to:{c:'B',p:'2'},points:[{x:10,y:20}]}]
 };
}
function read(endpoint,side='from'){
 const p=base();p.wires[0][side]=endpoint;
 return Projects.parse(JSON.stringify(p));
}
for(const [label,endpoint] of [
 ['ordinary terminal',{c:'A',p:'1'}],
 ['junction',{j:'J'}],
 ['legacy numeric component ID',{c:1,p:'1'}],
 ['legacy numeric junction ID',{j:2}]
])test('P0-04 accepts '+label,()=>assert.ok(read(endpoint)));

for(const [label,endpoint] of [
 ['empty object',{}],
 ['missing pin',{c:'A'}],
 ['blank pin',{c:'A',p:' '}],
 ['blank component',{c:'',p:'1'}],
 ['blank junction',{j:''}],
 ['ambiguous component and junction',{c:'A',p:'1',j:'J'}],
 ['unbound point',{point:{x:2,y:3}}],
 ['array',['A','1']],
 ['text','A']
])for(const side of ['from','to'])
 test('P0-04 rejects '+label+' at '+side,
   ()=>assert.throws(()=>read(endpoint,side),/kablo uç|geçerli/));

test('P0-04 preserves terminal-to-junction wiring and manual routing points',()=>{
 const p=base();p.wires[0].to={j:'J'};
 const q=Projects.parse(JSON.stringify(p));
 assert.deepEqual(q.wires[0].to,{j:'J'});
 assert.deepEqual(q.wires[0].points,[{x:10,y:20}]);
});
