'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Selection=require('../dist/selection.js');
const wide={left:-20,right:2420,top:0,bottom:100};
test('oversized group can move toward left visible edge',()=>{
 assert.equal(Selection.constrain(wide,-20,0,10,2400,1500).x,-20);
});
test('oversized group can move toward right visible edge',()=>{
 assert.equal(Selection.constrain(wide,20,0,10,2400,1500).x,20);
});
test('oversized group cannot move beyond both visible edges',()=>{
 assert.equal(Selection.constrain(wide,100,0,10,2400,1500).x,20);
 assert.equal(Selection.constrain(wide,-100,0,10,2400,1500).x,-20);
});
test('normal small group remains within bounds',()=>{
 const plan={left:100,right:200,top:20,bottom:120};
 assert.equal(Selection.constrain(plan,-200,0,10,2400,1500).x,-100);
});
test('oversized height can move within visible vertical edges',()=>{
 const plan={left:0,right:200,top:-20,bottom:1520};
 assert.equal(Selection.constrain(plan,0,20,10,2400,1500).y,20);
});
test('grid snapping remains applied',()=>{
 const plan={left:100,right:200,top:100,bottom:200};
 assert.equal(Selection.constrain(plan,17,0,10,2400,1500).x,20);
});
