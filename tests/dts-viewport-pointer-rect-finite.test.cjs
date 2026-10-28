'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const V=require('../dist/viewport.js');
test('invalid bounding rectangle position cannot corrupt world coordinates',()=>assert.deepEqual(V.clientToWorld({x:0,y:0,zoom:1},{clientX:100,clientY:100},{left:Infinity,top:0},{x:0,y:0}),{x:100,y:100}));
test('missing or nonfinite pointer coordinates use safe rect origin',()=>assert.deepEqual(V.clientToWorld({x:0,y:0,zoom:1},{clientX:NaN,clientY:Infinity},{left:10,top:20},{x:0,y:0}),{x:0,y:0}));
test('normal pointer positions retain offsets',()=>assert.deepEqual(V.clientToWorld({x:0,y:0,zoom:1},{clientX:100,clientY:100},{left:10,top:20},{x:5,y:7}),{x:95,y:87}));
