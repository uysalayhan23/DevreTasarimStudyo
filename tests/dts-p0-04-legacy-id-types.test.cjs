'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');

const base=()=>({version:5,components:[{id:'s',typeId:'supply-dc-plus'}],wires:[],junctions:[]});
const open=p=>Projects.parse(JSON.stringify(p));
const rejected=p=>assert.throws(()=>open(p),/geçersiz|geçerli|tekrarlanıyor|referansı/i);

test('modern project IDs and original input remain unchanged',()=>{
 const p=base(),snapshot=JSON.stringify(p),q=open(p);
 assert.equal(q.components[0].id,'s');assert.equal(JSON.stringify(p),snapshot);
});
test('legacy numeric component, junction, wire and endpoint IDs migrate together',()=>{
 const p={...base(),components:[{id:7,typeId:'resistor'}],junctions:[{id:8,x:0,y:0}],
  wires:[{id:9,from:{c:7,p:'1'},to:{j:8}}]};
 const q=open(p);
 assert.equal(q.components[0].id,'7');assert.equal(q.junctions[0].id,'8');
 assert.equal(q.wires[0].id,'9');assert.equal(q.wires[0].from.c,'7');
 assert.equal(q.wires[0].to.j,'8');
});
test('legacy zero ID remains a valid string identity',()=>{
 const q=open({...base(),components:[{id:0,typeId:'resistor'}]});
 assert.equal(q.components[0].id,'0');
});
test('mixed numeric/string component ID collision is rejected',()=>rejected({
 ...base(),components:[{id:7,typeId:'resistor'},{id:'7',typeId:'resistor'}]
}));
test('object component ID is rejected, never stringified',()=>rejected({
 ...base(),components:[{id:{name:'A'},typeId:'resistor'}]
}));
test('boolean component ID is rejected',()=>rejected({
 ...base(),components:[{id:true,typeId:'resistor'}]
}));
test('array junction ID is rejected',()=>rejected({
 ...base(),junctions:[{id:[1,2],x:0,y:0}]
}));
test('object wire ID is rejected',()=>rejected({
 ...base(),wires:[{id:{name:'w'},from:{c:'s',p:'P'},to:{c:'s',p:'M'}}]
}));
test('object component endpoint is rejected even when object component IDs match',()=>rejected({
 ...base(),components:[{id:{name:'A'},typeId:'resistor'}],
 wires:[{from:{c:{name:'A'},p:'1'},to:{c:{name:'A'},p:'2'}}]
}));
test('object junction endpoint is rejected even when junction IDs match',()=>rejected({
 ...base(),junctions:[{id:{name:'J'},x:0,y:0}],
 wires:[{from:{c:'s',p:'P'},to:{j:{name:'J'}}}]
}));
test('numeric legacy panel references remain compatible',()=>{
 const q=open({...base(),panel:{items:[{id:7},{id:8}],
 wires:[{from:{c:7,p:'1'},to:{c:8,p:'2'}}]}});
 assert.equal(q.panel.wires[0].from.c,'7');
 assert.equal(q.panel.wires[0].to.c,'8');
});
test('unnamed legacy wire remains supported',()=>{
 const q=open({...base(),wires:[{from:{c:'s',p:'P'},to:{c:'s',p:'M'}}]});
 assert.equal(q.wires.length,1);assert.equal(q.wires[0].id,undefined);
});
