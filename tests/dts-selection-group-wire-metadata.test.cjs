'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const S=require('../dist/selection.js');
function fixture(){
 const a={id:'a',typeId:'part',x:40,y:50},b={id:'b',typeId:'part',x:140,y:50};
 const wire={id:'w',from:{c:'a',p:'1'},to:{c:'b',p:'1'},points:[
  {x:80,y:60,surface:'plate',z:15,manual:true},
  {x:100,y:65,surface:'door',label:'branch'}]};
 return {a,b,wire,project:{components:[a,b],junctions:[],wires:[wire]}};
}
test('P3-02 manual wire waypoint surfaces and metadata follow both selected devices',()=>{
 const f=fixture(),plan=S.beginMove(f.project,['a','b'],{part:{w:20,h:20}});
 S.applyMove(plan,{x:20,y:10});
 assert.deepEqual(f.wire.points,[
  {x:100,y:70,surface:'plate',z:15,manual:true},
  {x:120,y:75,surface:'door',label:'branch'}]);
 assert.equal(f.a.x,60);assert.equal(f.b.x,160);
});
test('P3-02 repeated drags use original waypoint positions, not accumulated transforms',()=>{
 const f=fixture(),plan=S.beginMove(f.project,['a','b'],{part:{w:20,h:20}});
 S.applyMove(plan,{x:20,y:10});S.applyMove(plan,{x:30,y:15});
 assert.equal(f.wire.points[0].x,110);assert.equal(f.wire.points[0].y,75);
 assert.equal(f.wire.points[0].surface,'plate');assert.equal(f.wire.points[0].z,15);
});
test('P3-02 Escape restores original cable routing and metadata exactly',()=>{
 const f=fixture(),before=structuredClone(f.project),plan=S.beginMove(f.project,['a','b'],{part:{w:20,h:20}});
 S.applyMove(plan,{x:40,y:20});S.restore(plan);
 assert.deepEqual(f.project,before);
});
test('P3-02 external wire branches retain their original position and metadata',()=>{
 const f=fixture(),external={id:'out',typeId:'part',x:300,y:50};
 f.project.components.push(external);
 const branch={id:'branch',from:{c:'a',p:'2'},to:{c:'out',p:'1'},points:[{x:200,y:90,surface:'door'}]};
 f.project.wires.push(branch);
 const original=structuredClone(branch);
 S.applyMove(S.beginMove(f.project,['a','b'],{part:{w:20,h:20}}),{x:50,y:20});
 assert.deepEqual(branch,original);
});
