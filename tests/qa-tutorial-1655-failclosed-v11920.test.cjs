'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {audit}=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const component=(id,typeId)=>({id,typeId});
const pin=(c,p)=>({c,p});
const wire=(from,to)=>({id:'w1',from,to});
function check(project,defs){
 const L={lessons:[{id:'fixture-lesson',designStandard:'source-review',project,steps:[]}]};
 const Simulation={solve(){return {blocked:false,stable:true,oscillating:false,shortCircuit:false}}};
 return audit({L,defs,Simulation});
}
test('MQ-12 rejects unknown materials on no-wire theory/reference boards',()=>{
 const p={components:[component('ghost','never-in-library')],wires:[]};
 const result=check(p,{});
 assert.equal(result.referenceOnly,1);
 assert.equal(result.withWires,0);
 assert.equal(result.componentsChecked,1);
 assert.equal(result.missingDefinitions.length,1);
 assert.equal(result.missingDefinitions[0].ids[0],'never-in-library');
 assert.equal(result.status,'FAIL');
});
test('MQ-12 verifies both ends of every physical guided connection',()=>{
 const defs={resistor:{id:'resistor',pins:[{id:'1'},{id:'2'}]}};
 const p={components:[component('a','resistor')],wires:[wire(pin('a','1'),pin('a','BAD'))]};
 const result=check(p,defs);
 assert.equal(result.withWires,1);
 assert.equal(result.wireEndpointsChecked,2);
 assert.equal(result.invalidWireEndpoints.length,1);
 assert.equal(result.invalidWireEndpoints[0].endpoint.p,'BAD');
 assert.equal(result.status,'FAIL');
});
test('MQ-12 checks junction identities without treating junctions as component pins',()=>{
 const defs={resistor:{id:'resistor',pins:[{id:'1'},{id:'2'}]}};
 const bad={components:[component('a','resistor')],junctions:[],wires:[wire(pin('a','1'),{j:'j1'})]};
 const failure=check(bad,defs);
 assert.equal(failure.invalidWireEndpoints.length,1);
 assert.equal(failure.status,'FAIL');
 const good={...bad,junctions:[{id:'j1',x:0,y:0}]};
 const ok=check(good,defs);
 assert.equal(ok.invalidWireEndpoints.length,0);
 assert.equal(ok.missingDefinitions.length,0);
 assert.equal(ok.tested,1);
});


test('MQ-12 rejects fake guided steps on theory-only reference lessons',()=>{
 const p={components:[component('a','resistor')],wires:[]};
 const result=audit({L:{lessons:[{id:'bad-reference',project:p,steps:[{from:pin('a','1'),to:pin('a','2')}]}]},
  defs:{resistor:{id:'resistor',pins:[{id:'1'},{id:'2'}]}},
  Simulation:{solve(){throw Error('Reference-only course must not run the solver');}}});
 assert.equal(result.referenceOnly,1);
 assert.equal(result.invalidGuidedSteps.length,1);
 assert.equal(result.status,'FAIL');
});
