'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../dist/project-print.js');
test('print bounds reject precision-collapsed huge coordinates',()=>assert.equal(P.bounds({x:1e308,y:0,width:100,height:100}),null));
test('print bounds preserve ordinary padding',()=>assert.deepEqual(P.bounds({x:10,y:10,width:100,height:50}),{x:-50,y:-50,width:220,height:170}));
test('print bounds reject nonfinite source coordinates',()=>assert.equal(P.bounds({x:Infinity,y:0,width:100,height:100}),null));
