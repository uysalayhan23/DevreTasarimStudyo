'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const V=require('../dist/viewport.js');
test('zero zoom never makes world coordinate infinite',()=>assert.deepEqual(V.toWorld({x:0,y:0,zoom:0},{x:30,y:20}),{x:30,y:20}));
test('NaN pan delta does not corrupt position',()=>assert.deepEqual(V.panFrom({x:10,y:10,zoom:1},NaN,20),{x:10,y:30,zoom:1}));
test('normal pan maintains displacement',()=>assert.deepEqual(V.panFrom({x:10,y:10,zoom:1},20,30),{x:30,y:40,zoom:1}));
