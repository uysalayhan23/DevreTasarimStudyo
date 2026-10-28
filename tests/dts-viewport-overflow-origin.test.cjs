'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const V=require('../dist/viewport.js');
test('nonfinite viewport origin still yields finite anchored zoom',()=>{
 assert.deepEqual(V.zoomAt({x:NaN,y:Infinity,zoom:1},2,{x:40,y:20}),{x:-40,y:-20,zoom:2});
});
test('overflowing pan delta cannot create infinite position',()=>{
 assert.deepEqual(V.panFrom({x:1e308,y:10,zoom:1},1e308,0),{x:1e308,y:10,zoom:1});
});
test('normal anchored zoom remains unchanged',()=>{
 assert.deepEqual(V.zoomAt({x:0,y:0,zoom:1},2,{x:50,y:50}),{x:-50,y:-50,zoom:2});
});
test('normal movement remains unchanged',()=>{
 assert.deepEqual(V.panFrom({x:10,y:10,zoom:1},5,6),{x:15,y:16,zoom:1});
});
