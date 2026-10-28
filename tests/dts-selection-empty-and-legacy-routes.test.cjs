'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js');
test('empty selection has finite bounds and no movement',()=>{
 const plan=S.beginMove({components:[],wires:[],junctions:[]},[],{});
 assert.equal(plan.empty,true);assert.deepEqual(S.constrain(plan,100,50),{x:0,y:0});
});
test('legacy null route does not crash group selection',()=>{
 const c={id:'D',typeId:'test',x:10,y:10},w={id:'W',from:{c:'D',p:'1'},to:{c:'D',p:'2'},points:null};
 const plan=S.beginMove({components:[c],wires:[w],junctions:[]},['D'],{test:{w:20,h:20}});
 assert.equal(plan.wires.length,1);
 S.applyMove(plan,{x:10,y:10});assert.deepEqual(w.points,[]);
 S.restore(plan);assert.equal(w.points,undefined);assert.equal(c.x,10);
});
test('valid preexisting routing points still restore',()=>{
 const c={id:'D',typeId:'test',x:10,y:10},w={id:'W',from:{c:'D',p:'1'},to:{c:'D',p:'2'},points:[{x:10,y:20}]};
 const plan=S.beginMove({components:[c],wires:[w],junctions:[]},['D'],{test:{w:20,h:20}});
 S.applyMove(plan,{x:10,y:10});assert.deepEqual(w.points,[{x:20,y:30}]);
 S.restore(plan);assert.deepEqual(w.points,[{x:10,y:20}]);
});
