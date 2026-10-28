'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../dist/catalog.js');
test('null entry does not match',()=>assert.equal(C.matches(null),false));
test('null catalog entry is skipped',()=>assert.ok(Array.isArray(C.sections([null,{id:'x',name:'x',kind:'switch-no'}]))));
test('numeric brand labels sort safely',()=>assert.ok(Array.isArray(C.sections([{id:'x',name:'x',brand:1,kind:'switch-no'},{id:'y',name:'y',brand:2,kind:'switch-no'}]))));
test('missing catalog is empty',()=>assert.deepEqual(C.sections(null),[]));
test('existing contactors stay classified',()=>assert.equal(C.classification({id:'x',name:'x',kind:'contactor3'}).group,'contactors'));
