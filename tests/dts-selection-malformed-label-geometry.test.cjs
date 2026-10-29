'use strict';
// P3-02: imported/legacy labels must not break group movement or attached routes.
const {test}=require('node:test'),assert=require('node:assert/strict');
const Selection=require('../dist/selection.js');
function fixture(labels){
 const c={id:'D',typeId:'part',x:100,y:100,labelPositions:labels};
 const w={id:'W',from:{c:'D',p:'1'},to:{c:'D',p:'2'},points:[{x:110,y:110}]};
 const other={id:'O',typeId:'part',x:200,y:100,labelPositions:{name:{x:210,y:100}}};
 const project={components:[c,other],wires:[w],junctions:[]};
 return {c,w,other,plan:Selection.beginMove(project,['D'],{part:{w:20,h:20}})};
}
test('P3-02 null imported label does not crash movement',()=>{
 const f=fixture({name:{x:115,y:90},note:null});
 Selection.applyMove(f.plan,{x:20,y:10});
 assert.deepEqual(f.c.labelPositions,{name:{x:135,y:100},note:null});
 assert.deepEqual(f.w.points,[{x:130,y:120}]);
 Selection.restore(f.plan);
 assert.deepEqual(f.c.labelPositions,{name:{x:115,y:90},note:null});
 assert.deepEqual(f.w.points,[{x:110,y:110}]);
});
test('P3-02 malformed string label is not converted into invalid geometry',()=>{
 const f=fixture({name:{x:115,y:90},note:'legacy'});
 Selection.applyMove(f.plan,{x:20,y:10});
 assert.equal(f.c.labelPositions.note,'legacy');
 assert.deepEqual(f.c.labelPositions.name,{x:135,y:100});
});
test('P3-02 valid custom label metadata survives move and restore',()=>{
 const f=fixture({name:{x:115,y:90,angle:45,locked:true}});
 Selection.applyMove(f.plan,{x:20,y:10});
 assert.deepEqual(f.c.labelPositions.name,{x:135,y:100,angle:45,locked:true});
 Selection.restore(f.plan);
 assert.deepEqual(f.c.labelPositions.name,{x:115,y:90,angle:45,locked:true});
});
test('P3-02 negative movement preserves attached route and custom label',()=>{
 const f=fixture({name:{x:115,y:90},note:null});
 Selection.applyMove(f.plan,{x:-20,y:-10});
 assert.deepEqual(f.w.points,[{x:90,y:100}]);
 assert.deepEqual(f.c.labelPositions.name,{x:95,y:80});
});
test('P3-02 moving selected group does not mutate unrelated labels',()=>{
 const f=fixture({name:{x:115,y:90},note:null}),before=JSON.stringify(f.other);
 Selection.applyMove(f.plan,{x:20,y:10});
 assert.equal(JSON.stringify(f.other),before);
});
