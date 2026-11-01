'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const View=require('../dist/viewport.js');
test('zero current zoom does not produce invalid viewport coordinates',()=>{const x=View.zoomAt({x:0,y:0,zoom:0},2,{x:50,y:50});assert.deepEqual(x,{x:-50,y:-50,zoom:2});});
test('invalid requested zoom preserves view',()=>{const x=View.zoomAt({x:0,y:0,zoom:1},NaN,{x:50,y:50});assert.deepEqual(x,{x:0,y:0,zoom:1});});
test('valid viewport zoom retains anchor',()=>{const x=View.zoomAt({x:0,y:0,zoom:1},2,{x:50,y:50});assert.deepEqual(x,{x:-50,y:-50,zoom:2});});

test('viewport supports 8x zoom with stable anchor and caps above 8x',()=>{
  const view={x:10,y:20,zoom:2},anchor={x:110,y:120};
  const zoomed=View.zoomAt(view,8,anchor);
  assert.deepEqual(zoomed,{x:-290,y:-280,zoom:8});
  assert.deepEqual(View.toWorld(view,anchor),View.toWorld(zoomed,anchor));
  assert.equal(View.zoomAt(view,16,anchor).zoom,8);
});
