'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../dist/catalog.js');
test('null filters are treated as defaults',()=>assert.equal(typeof C.matches({id:'x',name:'x',kind:'coil'},null),'boolean'));
test('invalid cached classification falls back to source group',()=>assert.equal(C.matches({id:'x',name:'x',kind:'coil',classification:{group:'relays',areas:null}},{area:'control'}),true));
test('null section filters do not interrupt catalog',()=>assert.ok(Array.isArray(C.sections([{id:'x',name:'x',kind:'coil'}],null))));
test('contactor grouping retained',()=>assert.equal(C.classification({id:'x',name:'x',kind:'contactor3'}).group,'contactors'));
