'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js');
function fixture(){const c={id:'A',typeId:'part',x:100,y:100};return {c,plan:S.beginMove({components:[c],wires:[],junctions:[]},['A'],{part:{w:20,h:20}})}}
test('infinite translation cannot corrupt component',()=>{const {c,plan}=fixture();S.applyMove(plan,{x:Infinity,y:0});assert.equal(c.x,100);});
test('NaN translation cannot corrupt component',()=>{const {c,plan}=fixture();S.applyMove(plan,{x:NaN,y:20});assert.equal(c.y,100);});
test('valid translation remains available',()=>{const {c,plan}=fixture();S.applyMove(plan,{x:20,y:10});assert.equal(c.x,120);assert.equal(c.y,110);});
