'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Labels=require('../dist/labels.js');
test('P7-04 saved invalid annotation keys are removed without touching valid pinned labels',()=>{
 const c=JSON.parse('{"labelPositions":{"__proto__":{"x":1,"y":2},"constructor":{"x":3,"y":4},"prototype":{"x":1,"y":1},"":{"x":7,"y":8},"pin:A1":{"x":20,"y":30},"note":{"x":4,"y":5}}}');
 Labels.sanitize(c);
 assert.deepEqual(Object.keys(c.labelPositions),['pin:A1','note']);
 assert.deepEqual(c.labelPositions['pin:A1'],{x:20,y:30});
 assert.equal(Object.hasOwn(c.labelPositions,'__proto__'),false);
});
test('P7-04 malformed coordinates are removed as before',()=>{
 const c={labelPositions:{name:{x:10,y:20},bad:{x:NaN,y:3},far:{x:Infinity,y:0}}};
 Labels.sanitize(c);
 assert.deepEqual(Object.keys(c.labelPositions),['name']);
});
test('P7-04 a whitespace annotation identity does not survive import sanitization',()=>{
 const c={labelPositions:{'   ':{x:1,y:2},'pin:A2':{x:3,y:4}}};
 Labels.sanitize(c);
 assert.deepEqual(Object.keys(c.labelPositions),['pin:A2']);
});
test('P7-04 legitimate saved note drag and reset remain functional',()=>{
 const c={labelPositions:{note:{x:4,y:5},'pin:A1':{x:20,y:30}}};
 Labels.sanitize(c);
 const drag=Labels.begin(c,'note',{x:0,y:0},{x:0,y:0},1);
 Labels.move(c,drag,{x:10,y:20});
 assert.deepEqual(c.labelPositions.note,{x:14,y:25});
 Labels.reset(c,'note');assert.equal(c.labelPositions.note,undefined);
 assert.deepEqual(c.labelPositions['pin:A1'],{x:20,y:30});
});
test('P7-04 interactive prototype label keys remain rejected',()=>{
 const c={labelPositions:{name:{x:1,y:2}}};
 const drag={key:'__proto__',anchor:{x:1,y:2},client:{x:0,y:0},zoom:1};
 Labels.move(c,drag,{x:3,y:3});
 assert.equal(Object.hasOwn(c.labelPositions,'__proto__'),false);
});
