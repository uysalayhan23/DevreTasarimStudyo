'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const V=require('../dist/viewport.js');
test('nonfinite world point falls back to view origin',()=>assert.deepEqual(V.toWorld({x:10,y:20,zoom:1},{x:Infinity,y:30}),{x:0,y:10}));
test('nonfinite viewport origin does not contaminate world coordinates',()=>assert.deepEqual(V.toWorld({x:NaN,y:20,zoom:1},{x:10,y:30}),{x:10,y:10}));
test('nonfinite start pan coordinate does not contaminate movement',()=>assert.deepEqual(V.panFrom({x:Infinity,y:0,zoom:1},10,10),{x:10,y:10,zoom:1}));
test('finite world transformation remains unchanged',()=>assert.deepEqual(V.toWorld({x:10,y:20,zoom:2},{x:30,y:40}),{x:10,y:10}));
