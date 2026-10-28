'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Labels=require('../dist/labels.js');
const fixture=()=>({labelPositions:{name:{x:10,y:10}}});
test('invalid pointer coordinates do not corrupt custom label position',()=>{
 const c=fixture(),drag=Labels.begin(c,'name',{x:10,y:10},{x:20,y:20},1);
 assert.deepEqual(Labels.move(c,drag,{x:NaN,y:40}),{x:10,y:10});
 assert.deepEqual(c.labelPositions.name,{x:10,y:10});
});
test('normal drag updates label from fixed anchor',()=>{
 const c=fixture(),drag=Labels.begin(c,'name',{x:10,y:10},{x:20,y:20},1);
 assert.deepEqual(Labels.move(c,drag,{x:30,y:40}),{x:20,y:30});
});
test('invalid drag zoom preserves last valid label',()=>{
 const c=fixture(),drag=Labels.begin(c,'name',{x:10,y:10},{x:20,y:20},1);drag.zoom=Infinity;
 assert.deepEqual(Labels.move(c,drag,{x:30,y:40}),{x:10,y:10});
});
