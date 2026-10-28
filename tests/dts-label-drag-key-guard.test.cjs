'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Labels=require('../dist/labels.js');
const base=()=>({labelPositions:{name:{x:1,y:2}}});
const drag=key=>({key,anchor:{x:1,y:2},client:{x:0,y:0},zoom:1});
test('undefined annotation key does not add phantom label',()=>{const c=base();Labels.move(c,drag(undefined),{x:3,y:3});assert.equal(Object.hasOwn(c.labelPositions,'undefined'),false);});
test('empty annotation key is rejected',()=>{const c=base();Labels.move(c,drag(''),{x:3,y:3});assert.equal(Object.hasOwn(c.labelPositions,''),false);});
test('prototype annotation key is rejected',()=>{const c=base();Labels.move(c,drag('__proto__'),{x:3,y:3});assert.equal(Object.hasOwn(c.labelPositions,'__proto__'),false);});
test('valid annotation key keeps normal drag behavior',()=>{const c=base();Labels.move(c,drag('name'),{x:3,y:3});assert.deepEqual(c.labelPositions.name,{x:4,y:5});});
