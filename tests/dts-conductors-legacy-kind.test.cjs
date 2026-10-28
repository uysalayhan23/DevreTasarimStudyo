'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Conductors=require('../dist/conductors.js');
test('legacy component without kind does not crash conductor source mapping',()=>assert.deepEqual(Conductors.sourceLines({id:'c'},{id:'legacy',pins:[]}),[]));
test('DC supply terminals remain mapped',()=>assert.equal(Conductors.sourceLines({id:'c'},{id:'dc',kind:'supply-dc',pins:[]}).length,2));
test('AC supply mapping remains valid',()=>assert.equal(Conductors.sourceLines({id:'c'},{id:'ac',kind:'supply',pins:[{id:'L'},{id:'N'}]}).length,2));
test('power24 mapping remains valid',()=>assert.equal(Conductors.sourceLines({id:'c'},{id:'p',kind:'power24',pins:[]}).length,2));
