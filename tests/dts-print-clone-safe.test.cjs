'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../dist/project-print.js');
const rect={x:0,y:0,width:100,height:100};
const doc={createElement(){return {}},body:{}};
test('SVG clone exception returns controlled PDF print failure',()=>{const result=P.prepare(doc,{cloneNode(){throw Error('clone failed')}},{getBBox(){return rect}},'test');assert.equal(result.ok,false);});
test('invalid SVG clone does not reach DOM mutation',()=>{const result=P.prepare(doc,{cloneNode(){return {}}},{getBBox(){return rect}},'test');assert.equal(result.ok,false);});
test('ordinary print bounds remain valid',()=>assert.deepEqual(P.bounds(rect),{x:-60,y:-60,width:220,height:220}));
