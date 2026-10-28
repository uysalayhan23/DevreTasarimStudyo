'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../dist/catalog.js');
test('missing catalog returns empty prepared list',()=>assert.deepEqual(C.prepare(null),[]));
test('null draft rows are filtered during preparation',()=>assert.equal(C.prepare([null,{id:'a',name:'A',kind:'coil'}]).length,1));
test('invalid cached group cannot hide an existing relay',()=>{const row={id:'x',name:'X',kind:'coil',classification:{group:'unknown',areas:['control']}};assert.equal(C.sections([row],{area:'control'}).find(x=>x.id==='relays').items.length,1);});
test('existing contactor group preserved',()=>assert.equal(C.classification({id:'c',name:'Contactor',kind:'contactor3'}).group,'contactors'));
