'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Scope=require('../scripts/tutorial-lesson-scope-v11920.cjs');
const fixture=[
 {id:'wired',kind:'wiring',project:{wires:[{from:{c:'a',p:'1'},to:{c:'b',p:'2'}}]}},
 {id:'probe',kind:'quiz',project:{referenceOnly:true,wires:[{from:{c:'v',p:'V'},to:{c:'red',p:'PLUG'}}]}},
 {id:'explore',kind:'explore',project:{wires:[{from:{c:'g',p:'P'},to:{c:'meter',p:'1'}}]}},
 {id:'card',kind:'quiz',project:{referenceOnly:true,wires:[]}}
];
test('positive: real wiring and measurement explore belong to native scope; 722 is a distinct goal',()=>{
 const r=Scope.summarize(fixture);
 assert.equal(r.total,4);assert.equal(r.simulatable,2);
 assert.equal(r.wiring,1);assert.equal(r.explore,1);
 assert.equal(r.wiringGoal,722);assert.equal(r.wiringGap,721);
 assert.equal(r.wiringGoalStatus,'PENDING');
 assert.equal(Scope.isCircuitLesson(fixture[0]),true);
 assert.equal(Scope.isCircuitLesson(fixture[2]),true);
});
test('negative: quiz with a wired voltmeter/probe remains reference-only, not a working circuit',()=>{
 const r=Scope.summarize(fixture);
 assert.equal(r.rawWireCount,3);assert.equal(r.referenceWithWires,1);
 assert.equal(r.referenceWithoutWires,1);assert.equal(r.simulatable,2);
 assert.equal(Scope.isCircuitLesson(fixture[1]),false);
 assert.equal(Scope.isCircuitLesson(fixture[3]),false);
 const copied=JSON.parse(JSON.stringify(fixture));
 assert.deepEqual(fixture,copied,'classification never mutates the canonical graph');
});
test('negative: referenceOnly flag overrides wiring label and missing project fails closed',()=>{
 assert.equal(Scope.isCircuitLesson({kind:'wiring',project:{referenceOnly:true,wires:[{}]}}),false);
 assert.equal(Scope.isCircuitLesson({kind:'wiring',project:{wires:[]}}),false);
 assert.equal(Scope.isCircuitLesson({kind:'wiring'}),false);
 assert.equal(Scope.summarize([{kind:'wiring',project:{referenceOnly:true,wires:[{}]}}]).simulatable,0);
});
