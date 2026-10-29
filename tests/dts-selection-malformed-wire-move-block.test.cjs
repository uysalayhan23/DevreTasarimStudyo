'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js');
function scenario(point){
 const a={id:'a',typeId:'part',x:50,y:50},b={id:'b',typeId:'part',x:150,y:50};
 return {components:[a,b],junctions:[],wires:[{id:'w',from:{c:'a',p:'1'},to:{c:'b',p:'1'},points:[point]}]};
}
const byId={part:{w:20,h:20}};
test('P3-02 legacy string waypoint stops entire group drag without data loss',()=>{
 const p=scenario({x:'20',y:25,surface:'plate'}),before=JSON.stringify(p);
 const plan=S.beginMove(p,['a','b'],byId);
 assert.equal(plan.invalidWireGeometry,true);assert.deepEqual(S.constrain(plan,20,10),{x:0,y:0});
 S.applyMove(plan,{x:20,y:10});assert.equal(JSON.stringify(p),before);
});
test('P3-02 null or nonfinite waypoint prevents partial movement',()=>{
 for(const x of [null,NaN,Infinity]){
  const p=scenario({x,y:25}),before=JSON.stringify(p),plan=S.beginMove(p,['a','b'],byId);
  assert.equal(plan.invalidWireGeometry,true);
  S.applyMove(plan,{x:20,y:10});assert.equal(JSON.stringify(p),before);
 }
});
test('P3-02 valid waypoint with numeric coordinates still translates',()=>{
 const p=scenario({x:20,y:25,surface:'door',metadata:'manual'}),plan=S.beginMove(p,['a','b'],byId);
 assert.equal(!!plan.invalidWireGeometry,false);
 S.applyMove(plan,{x:20,y:10});
 assert.deepEqual(p.wires[0].points,[{x:40,y:35,surface:'door',metadata:'manual'}]);
 assert.equal(p.components[0].x,70);
});
test('P3-02 valid drag cancellation restores original geometry and wire metadata',()=>{
 const p=scenario({x:20,y:25,surface:'plate'}),original=JSON.stringify(p),plan=S.beginMove(p,['a','b'],byId);
 S.applyMove(plan,{x:30,y:10});S.restore(plan);
 assert.equal(JSON.stringify(p),original);
});
