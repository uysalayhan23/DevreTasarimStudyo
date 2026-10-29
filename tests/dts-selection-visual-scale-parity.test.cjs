'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Select=require('../dist/selection.js');
const part={w:80,h:40};
const component=scale=>({id:'c',typeId:'part',x:100,y:50,rotation:0,materialScale:scale});
test('P3-02 high materialScale selection matches SVG maximum factor 3',()=>{
 assert.deepEqual(Select.bounds(component(20),part),{left:100,right:340,top:50,bottom:170});
});
test('P3-02 low materialScale selection matches SVG minimum factor 0.25',()=>{
 assert.deepEqual(Select.bounds(component(.05),part),{left:100,right:120,top:50,bottom:60});
});
test('P3-02 negative or nonfinite scaling cannot reverse selection bounds',()=>{
 for(const s of [-2,NaN,Infinity,null]){
  const rect=Select.bounds(component(s),part);
  assert.deepEqual(rect,{left:100,right:180,top:50,bottom:90});
 }
});
test('P3-02 valid 90-degree rotation still follows scaled drawing geometry',()=>{
 assert.deepEqual(Select.bounds({...component(20),rotation:90},part),
  {left:160,right:280,top:-10,bottom:230});
});
test('P3-02 ordinary scale 1 remains unchanged',()=>{
 assert.deepEqual(Select.bounds(component(1),part),
  {left:100,right:180,top:50,bottom:90});
});
test('P3-02 selection box uses visual scale when picking items',()=>{
 const project=[component(20)];
 assert.deepEqual(Select.inBox(project,{part},{x:335,y:90},{x:338,y:100}),['c']);
 assert.deepEqual(Select.inBox(project,{part},{x:345,y:90},{x:348,y:100}),[]);
});
test('P3-02 group drag clamp uses the visual bounds instead of phantom extent',()=>{
 const p={components:[component(20)],wires:[],junctions:[]};
 const plan=Select.beginMove(p,['c'],{part});
 assert.equal(plan.right,340);
 assert.equal(plan.bottom,170);
 const before=JSON.stringify(p);Select.applyMove(plan,{x:30,y:10});
 assert.equal(p.components[0].x,130);Select.restore(plan);assert.equal(JSON.stringify(p),before);
});
