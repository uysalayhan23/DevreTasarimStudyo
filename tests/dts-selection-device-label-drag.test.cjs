'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Selection=require('../dist/selection.js');
function fixture(){const device={id:'D1',typeId:'test',x:100,y:100,labelPositions:{name:{x:115,y:90}}};const second={id:'D2',typeId:'test',x:200,y:100};return {device,second,project:{components:[device,second],wires:[],junctions:[]}}}
test('custom label follows translated component',()=>{const f=fixture(),plan=Selection.beginMove(f.project,['D1'],{test:{w:40,h:20}});Selection.applyMove(plan,{x:20,y:10});assert.deepEqual(f.device.labelPositions.name,{x:135,y:100});});
test('moving selected item does not move unrelated labels',()=>{const f=fixture(),plan=Selection.beginMove(f.project,['D1'],{test:{w:40,h:20}});Selection.applyMove(plan,{x:20,y:10});assert.equal(f.second.x,200);});
test('multiple drag updates are based on original position',()=>{const f=fixture(),plan=Selection.beginMove(f.project,['D1'],{test:{w:40,h:20}});Selection.applyMove(plan,{x:20,y:10});Selection.applyMove(plan,{x:30,y:10});assert.equal(f.device.labelPositions.name.x,145);});
test('cancel restores both device and custom label',()=>{const f=fixture(),plan=Selection.beginMove(f.project,['D1'],{test:{w:40,h:20}});Selection.applyMove(plan,{x:20,y:10});Selection.restore(plan);assert.equal(f.device.x,100);assert.deepEqual(f.device.labelPositions.name,{x:115,y:90});});
