'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../dist/catalog.js');
test('frozen component can be prepared',()=>{const x=Object.freeze({id:'x',name:'X',kind:'coil'});const rows=C.prepare([x]);assert.equal(rows[0].classification.group,'relays');assert.equal(Object.hasOwn(x,'classification'),false);});
test('mutable component keeps identity',()=>{const x={id:'x',name:'X',kind:'contactor3'};assert.equal(C.prepare([x])[0],x);});
test('null entries are still omitted',()=>assert.equal(C.prepare([null,{id:'x',name:'X',kind:'coil'}]).length,1));
