'use strict';
// MQ-07 lesson source integration regression; no real-world installation procedure.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Sensors=require('../dist/sensors.js');
const Bell=require('../scripts/qa-bell-transformer-v11920.cjs');
const cases=[
 {id:'sensor-analog-apps-src-13',type:'proximity',target:'metal',
  description:'virtual inductive PNP sensor → relay NO contact → lamp'},
 {id:'sensor-analog-apps-src-14',type:'sensor-through-beam',target:'reflector',
  description:'virtual IR beam sensor → relay NO contact → lamp'}
];
const L=QA.curriculum(),defs=QA.catalog(),copy=x=>JSON.parse(JSON.stringify(x));
function validateCircuit(l,model){
 const p=l.project,part=Object.fromEntries(p.components.map(c=>[c.id,c]));
 assert.equal(l.kind,'wiring');assert.equal(p.wires.length,7);
 assert.equal(part.s1.typeId,model);
 for(const [a,ap,b,bp] of [
 ['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],['k1','A2','g1','M'],
 ['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']]){
  assert.ok(p.wires.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp),l.id+': '+a+'/'+ap+' to '+b+'/'+bp);
 }
 for(const pin of ['P','M'])assert.ok(defs[part.g1.typeId].pins.some(x=>x.id===pin));
 for(const pin of ['BN','BU','BK'])assert.ok(defs[part.s1.typeId].pins.some(x=>x.id===pin));
 assert.match(l.explanation,/24 VDC/);
 assert.match(l.explanation,/A1\/A2/);assert.match(l.explanation,/13.?14/);
 assert.ok(l.beginnerSteps.length>=5);assert.ok(l.summary.length>100);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
}
test('two review lessons have real matched low-voltage sensor and relay wiring',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(x=>x.designStandard==='rich-reference-v1').length,136);
 // The original 47 was an older snapshot of the first-200-source review list.
 // 34 is the current observed list size; each record remains traceable and
 // a smaller list does not prove any physical or independent QA acceptance.
 const reviews=L.mq07Batch200.reviewIds;
 assert.equal(L.mq07Batch200.examined,200);
 assert.equal(reviews.length,34);
 assert.equal(new Set(reviews.map(x=>x.id)).size,reviews.length);
 for(const r of reviews){
  assert.ok(L.byId[r.id],r.id+' missing reviewed lesson');
  assert.ok(typeof r.reason==='string'&&r.reason.length>3,r.id+' missing review reason');
 }

 assert.equal(L.lessons.filter(x=>x.project.wires.length>0).length,730);
 for(const v of cases){const l=L.byId[v.id];assert.ok(l);validateCircuit(l,v.type);
  assert.ok(!L.mq07Batch200.reviewIds.some(x=>x.id===v.id));}
});
test('both low voltage scenarios switch relay and lamp OFF→ON→OFF using original solver',()=>{
 for(const v of cases){
  const lesson=L.byId[v.id];
  for(const [i,detected] of [false,true,false].entries()){
   const p=copy(lesson.project),sensor=p.components.find(x=>x.id==='s1');
   const definition=defs[sensor.typeId];
   assert.ok(Sensors.supported(definition),v.id+' unsupported physical principle');
   const original=Sensors.settings(sensor,definition);
   assert.ok(original.range>0,v.id+' sensor range unavailable');
   // Set a compatible material at real measured range, on a disposable
   // project clone. The sensor's manual switch state is deliberately the
   // opposite of detection: toggling .state alone must NOT bypass sensing.
   sensor.state=!detected;
   sensor.sensing={...original,target:v.target,auto:false,offset:0,
    distance:detected?original.range*.5:original.range*2};
   const sampled=Sensors.detect(sensor,definition);
   assert.equal(sampled.enabled,true,v.id+' target missing '+i);
   assert.equal(sampled.compatible,true,v.id+' target incompatible '+i);
   assert.equal(sampled.detected,detected,v.id+' sensed '+i);
   const result=Simulation.solve(p,defs,{now:[0,400,850][i]});
   assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,v.id+' phase '+i);
   const parts=Object.fromEntries(p.components.map(x=>[x.id,x]));
   // Read-only diagnostic details are printed ONLY on a failed assertion;
   // never bless a broken output by changing its expected state.
   const diagnostic=JSON.stringify({
    id:v.id,phase:i,expectedDetection:detected,manualState:parts.s1.state,
    sensorType:parts.s1.typeId,sensorOutput:parts.s1.outputType,
    catalogOutput:defs[parts.s1.typeId]?.outputType,
    sensorDetect:Sensors.detect(parts.s1,defs[parts.s1.typeId]),
    sensorRuntime:{active:parts.s1._active,actuated:parts.s1._actuated,
     closed:parts.s1._closed,powered:parts.s1._powered,
     contactStates:parts.s1._contactStates,supply:parts.s1._supplyState},
    sourceRuntime:{active:parts.g1._active,powered:parts.g1._powered},
    coilRuntime:{active:parts.k1._active,powered:parts.k1._powered},
    contactRuntime:{active:parts.ka1._active,closed:parts.ka1._closed,
     contactStates:parts.ka1._contactStates},
    lampRuntime:{active:parts.h1._active,powered:parts.h1._powered},
    solve:{stable:result.stable,blocked:result.blocked,
     shortCircuit:result.shortCircuit,oscillating:result.oscillating,reason:result.reason}
   });
   assert.equal(!!parts.k1._active,detected,v.id+' coil '+i+' | '+diagnostic);
   assert.equal(!!parts.h1._active,detected,v.id+' lamp '+i+' | '+diagnostic);
  }
 }
});
test('full source and locked transformer remain unchanged in acceptance scope',()=>{
 const r=QA.audit({L,defs,Simulation});
 assert.equal(r.status,'PASS');assert.equal(r.total,1655);assert.equal(r.withWires,730);
 assert.equal(r.rich,136);assert.equal(r.missingDefinitions.length,0);
 assert.equal(r.invalidWireEndpoints.length,0);
 const b=Bell.audit({L,defs,solver:Simulation});
 assert.equal(b.status,'PASS');assert.equal(b.count,15);
 assert.equal(b.phaseChecks,38);assert.equal(b.phasePasses,38);
});
