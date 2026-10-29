'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Wiring=require('../dist/panel-wiring.js');
const definition={id:'generic',w:80,h:70,pins:[{id:'1',label:'A1',x:0,y:0,side:'top'}]};
const item={id:'item',x:20,y:10,w:80,h:70};
test('missing item depth produces a finite front panel terminal coordinate',()=>{
 const p=Wiring.ports(item,definition);
 assert.equal(p.length,1);assert.equal(p[0].z,20);assert.equal(p[0].x,20);assert.equal(p[0].y,10);
});
test('valid item depth remains electrically and geometrically unchanged',()=>{
 const p=Wiring.ports({...item,depth:48},definition);
 assert.equal(p[0].z,68);assert.equal(p[0].p,'1');
});
test('invalid terminal records do not break valid panel terminals',()=>{
 const p=Wiring.ports(item,{...definition,pins:[null,{id:'',x:1,y:2},...definition.pins]});
 assert.equal(p.length,1);assert.equal(p[0].p,'1');
});
test('missing terminal list returns an empty port set',()=>assert.deepEqual(Wiring.ports(item,{...definition,pins:null}),[]));
