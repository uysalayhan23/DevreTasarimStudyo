'use strict';
// Source contract fixtures only; does not run the full 1655 curriculum.
const {test}=require('node:test'),assert=require('node:assert/strict');
const Scope=require('../scripts/tutorial-lesson-scope-v11920.cjs');
const Sequential=require('../scripts/qa-tutorial-sequential-v11920.cjs');
const Phases=require('../scripts/qa-tutorial-722-sequential-v11920.cjs');
const fixture=()=>({lessons:[
 {id:'wired',kind:'wiring',project:{components:[{id:'s',typeId:'push-no',state:false},{id:'h',typeId:'lamp-green'}],wires:[{from:{c:'s',p:'13'},to:{c:'h',p:'X1'}}]}},
 {id:'probe-only',kind:'quiz',project:{referenceOnly:true,components:[{id:'v',typeId:'unit-ut33d-plus'},{id:'pr',typeId:'test-probe-red'}],wires:[{from:{c:'v',p:'V'},to:{c:'pr',p:'PLUG'}}]}},
 {id:'explore',kind:'explore',project:{components:[{id:'g',typeId:'supply-dc-plus'},{id:'lamp',typeId:'lamp-green'}],wires:[{from:{c:'g',p:'P'},to:{c:'lamp',p:'X1'}}]}}
]});
const defs={'push-no':{kind:'switch-no'},'lamp-green':{kind:'lamp'},'supply-dc-plus':{kind:'source'},'unit-ut33d-plus':{kind:'multimeter'},'test-probe-red':{kind:'probe'}};
function engine(){let probes=0;return{get probes(){return probes},solve(p){
 if(p.components.some(c=>c.id==='v'))probes++;
 const sw=p.components.find(c=>c.id==='s'),load=p.components.find(c=>c.id==='h'||c.id==='lamp');
 if(load)load._active=sw?!!sw.state:true;
 return{stable:true,blocked:false,shortCircuit:false,oscillating:false};
}}}
test('wiring + explore are simulatable; quiz probe is only a reference',()=>{
 const x=fixture(),original=JSON.stringify(x),s=Scope.summarize(x.lessons);
 assert.equal(s.simulatable,2);assert.equal(s.wiring,1);assert.equal(s.explore,1);
 assert.equal(s.referenceWithWires,1);assert.equal(s.rawWireCount,3);
 assert.equal(s.wiringGoal,722);assert.equal(s.wiringGap,721);
 assert.equal(s.wiringGoalStatus,'PENDING');assert.equal(JSON.stringify(x),original);
});
test('negative: sequential simulation skips probe-only quiz and preserves source',()=>{
 const x=fixture(),original=JSON.stringify(x),e=engine(),r=Sequential.audit({L:x,defs,engine:e});
 assert.equal(r.wired,2);assert.equal(r.referenceOnly,1);
 assert.equal(r.scope.wiring,1);assert.equal(r.scope.explore,1);assert.equal(r.scope.referenceWithWires,1);
 assert.equal(r.solves,4);assert.equal(e.probes,0);
 assert.equal(r.status,'FAIL_OR_INCOMPLETE');assert.equal(JSON.stringify(x),original);
});
test('three-phase scope remains structured; small fixtures never receive acceptance',()=>{
 const e=engine(),r=Phases.audit({L:fixture(),defs,solver:e});
 assert.equal(r.scope.wiring,1);assert.equal(r.scope.explore,1);
 assert.equal(r.scope.referenceWithWires,1);assert.equal(r.scope.rawWireCount,3);
 assert.equal(r.withWires,2);assert.equal(r.checkedInitial,2);
 assert.equal(r.checkedChanged,2);assert.equal(r.checkedRestored,2);
 assert.equal(r.controls,1);assert.equal(r.noControl,1);assert.equal(e.probes,0);
 assert.equal(r.stabilityStatus,'FAIL');assert.equal(r.behaviorStatus,'REVIEW');
 assert.equal(typeof r.phaseScope,'string');
});
test('negative: referenceOnly also overrides an incorrect wiring label',()=>{
 const x=fixture();x.lessons[0].project.referenceOnly=true;
 const e=engine(),r=Sequential.audit({L:x,defs,engine:e});
 assert.equal(r.wired,1);assert.equal(r.referenceOnly,2);
 assert.equal(r.scope.wiring,0);assert.equal(r.scope.explore,1);
 assert.equal(e.probes,0);assert.equal(r.status,'FAIL_OR_INCOMPLETE');
});
