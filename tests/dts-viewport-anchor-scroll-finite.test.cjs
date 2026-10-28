'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const V=require('../dist/viewport.js');
test('NaN zoom anchor does not poison the new viewport',()=>assert.deepEqual(V.zoomAt({x:0,y:0,zoom:1},2,{x:NaN,y:20}),{x:0,y:-20,zoom:2}));
test('infinite scroll offset does not poison world coordinates',()=>assert.deepEqual(V.clientToWorld({x:0,y:0,zoom:1},{clientX:100,clientY:100},{left:0,top:0},{x:Infinity,y:NaN}),{x:100,y:100}));
test('normal scroll offset still affects world coordinates',()=>assert.deepEqual(V.clientToWorld({x:0,y:0,zoom:1},{clientX:100,clientY:100},{left:10,top:20},{x:5,y:7}),{x:95,y:87}));
