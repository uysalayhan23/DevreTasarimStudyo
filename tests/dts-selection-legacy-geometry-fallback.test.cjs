'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js');
const fixture=()=>{const c={id:'D',typeId:'legacy-missing',x:100,y:100};return {c,project:{components:[c],wires:[],junctions:[]}}};
test('legacy object with missing catalog data can be selected',()=>{
 const {project}=fixture(),p=S.beginMove(project,['D'],{});
 assert.equal(p.left,100);assert.equal(p.right,100);
});
test('legacy object without geometry can be moved safely',()=>{
 const {c,project}=fixture(),p=S.beginMove(project,['D'],{});
 S.applyMove(p,{x:20,y:10});assert.deepEqual({x:c.x,y:c.y},{x:120,y:110});
});
test('cancel restores legacy object position',()=>{
 const {c,project}=fixture(),p=S.beginMove(project,['D'],{});
 S.applyMove(p,{x:20,y:10});S.restore(p);assert.equal(c.x,100);assert.equal(c.y,100);
});
