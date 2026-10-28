'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js');
function fixture(x=2390){const c={id:'D',typeId:'x',x:100,y:100,labelPositions:{name:{x,y:200}}};return S.beginMove({components:[c],wires:[],junctions:[]},['D'],{x:{w:40,h:40}})}
test('right-side custom label is part of movement bounds',()=>assert.equal(S.constrain(fixture(),100,0,10,2400,1500).x,10));
test('device can still move away from right boundary',()=>assert.equal(S.constrain(fixture(),-20,0,10,2400,1500).x,-20));
test('custom label expands group boundary',()=>assert.equal(fixture().right,2390));
test('regular selection without custom label retains movement range',()=>{
 const c={id:'D',typeId:'x',x:100,y:100};
 const plan=S.beginMove({components:[c],wires:[],junctions:[]},['D'],{x:{w:40,h:40}});
 assert.equal(S.constrain(plan,100,0,10,2400,1500).x,100);
});
