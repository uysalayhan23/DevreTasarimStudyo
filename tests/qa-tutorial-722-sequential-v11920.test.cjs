'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {audit,main}=require('../scripts/qa-tutorial-722-sequential-v11920.cjs');

test('native 722 wiring lessons solve all three consecutive phases without faults',()=>{
 const r=main();
 assert.equal(r.lessonCount,1655);
 assert.equal(r.withWires,722);
 for(const k of ['checkedInitial','checkedChanged','checkedRestored',
   'stableInitial','stableChanged','stableRestored'])assert.equal(r[k],722,k);
 assert.equal(r.stabilityStatus,'PASS');
 assert.equal(r.missingDefinitions.length,0);
 assert.equal(r.failures.length,0);
 assert.equal(r.controls+r.noControl+r.missingDefinitionLessons.length,722);
 assert.equal(r.classificationCoverage,'722/722');
 assert.equal(r.classificationComplete,true);
 assert.equal(r.actuationCoverage,r.controls+'/722');
 assert.equal(r.restorationChecked,r.controls);
 assert.equal(r.restorationFailures.length,0);
 assert.equal(r.restorationStatus,'PASS');
 assert.equal(r.restorationCoverage,r.restorationChecked+'/'+r.controls);
 assert.ok(['PASS','REVIEW'].includes(r.responseStatus));
 assert.ok(r.controls>=400);
 // A contact changing its own state is not proof of downstream load activity.
 // The source audit reports unresponsive controls explicitly for independent review.
 assert.equal(r.observedOutputChanges+r.unresponsiveControls.length,r.controls);
 assert.ok(r.observedOutputChanges>=0&&r.observedOutputChanges<=r.controls);
 assert.equal(r.behaviorCoverage,r.observedOutputChanges+'/'+r.controls);
 assert.equal(r.behaviorStatus,
  r.classificationComplete&&r.stabilityStatus==='PASS'&&r.responseStatus==='PASS'&&r.restorationStatus==='PASS'&&r.noControl===0?'PASS':'REVIEW');
});
test('sequential gate refuses a short introduced by virtual control transition',()=>{
 let phase=0;
 const L={lessons:[{id:'fixture',project:{components:[
  {id:'g1',typeId:'supply-dc-plus'}, {id:'s1',typeId:'push-no',state:false}
 ],wires:[{from:{c:'g1',p:'P'},to:{c:'s1',p:'13'}}]}}]};
 const defs={'supply-dc-plus':{},'push-no':{}};
 const solver={solve(){return ++phase===2?
  {stable:true,shortCircuit:true,blocked:false,oscillating:false}:
  {stable:true,shortCircuit:false,blocked:false,oscillating:false}}};
 const result=audit({L,defs,solver});
 assert.equal(result.checkedInitial,1);
 assert.equal(result.checkedChanged,1);
 assert.equal(result.checkedRestored,1);
 assert.equal(result.failures.length,1);
 assert.equal(result.failures[0].phase,'Changed');
 assert.equal(result.stabilityStatus,'FAIL');
});


test('virtual PNP sensor target near/far actually drives UT33D+ 0 V / 24 V / 0 V',()=>{
 const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
 const Simulation=require('../dist/simulation.js');
 const lessons=QA.curriculum(),definitions=QA.catalog();
 const raw=lessons.byId['measurement-workshop-src-10'].project;
 const project=structuredClone(raw),s=project.components.find(c=>c.id==='s1'),
  meter=project.components.find(c=>c.id==='mm');
 const before=JSON.stringify(raw);
 const volts=[];
 for(const distance of [10,2,10]){
  s.sensing.distance=distance;
  const result=Simulation.solve(project,definitions,{now:volts.length*400});
  assert.equal(result.stable,true);
  assert.equal(result.shortCircuit,false);
  assert.equal(result.blocked,false);
  volts.push(meter._meter.value);
 }
 assert.ok(Math.abs(volts[0])<.1);
 assert.ok(Math.abs(volts[1]-24)<.1);
 assert.ok(Math.abs(volts[2])<.1);
 assert.equal(JSON.stringify(raw),before,'canonical lesson must remain untouched');
});

test('selected button self-actuation is NOT accepted as downstream functional output',()=>{
 const L={lessons:[{id:'false-positive',project:{components:[
  {id:'b',typeId:'push-no',state:false},
  {id:'h',typeId:'lamp-green',state:false}
 ],wires:[{from:{c:'b',p:'13'},to:{c:'h',p:'X1'}}]}}]};
 const defs={'push-no':{kind:'switch-no'},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){
  p.components[0]._actuated=!!p.components[0].state;
  p.components[0]._active=!!p.components[0].state;
  p.components[1]._active=false;
  p.components[1]._powered=false;
  return{stable:true,blocked:false,shortCircuit:false,oscillating:false};
 }};
 const r=audit({L,defs,solver});
 assert.equal(r.checkedInitial,1);assert.equal(r.checkedChanged,1);assert.equal(r.checkedRestored,1);
 assert.equal(r.controls,1);assert.equal(r.observedOutputChanges,0);
 assert.equal(r.unresponsiveControls.length,1);
 assert.equal(r.behaviorStatus,'REVIEW');
});

test('restoration drift of a downstream lamp fails closed even when all phases solve stably',()=>{
 const L={lessons:[{id:'stuck-lamp',project:{components:[
  {id:'switch',typeId:'push-no',state:false},
  {id:'lamp',typeId:'lamp-green',state:false}
 ],wires:[{from:{c:'switch',p:'13'},to:{c:'lamp',p:'X1'}}]}}]};
 const defs={'push-no':{kind:'switch-no'},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){
  const sw=p.components[0],lamp=p.components[1];
  if(sw.state)lamp._active=true; // broken latch remains ON after switch release
  return {stable:true,shortCircuit:false,blocked:false,oscillating:false};
 }};
 const r=audit({L,defs,solver});
 assert.equal(r.restorationChecked,1);
 assert.equal(r.observedOutputChanges,1);
 assert.equal(r.restorationFailures.length,1);
 assert.equal(r.solverFailures.length,0,'stable solver must be reported separately');
 assert.equal(r.responseStatus,'PASS');
 assert.equal(r.restorationStatus,'REVIEW');
 assert.equal(r.restorationFailures[0].id,'stuck-lamp');
 assert.equal(r.stabilityStatus,'FAIL','single-lesson fixture does not meet full corpus gate');
 assert.equal(r.behaviorStatus,'REVIEW');
 assert.equal(r.restorationStatus,'REVIEW');
});
test('downstream lamp that returns to its initial output passes restoration check',()=>{
 const L={lessons:[{id:'reversible-lamp',project:{components:[
  {id:'switch',typeId:'push-no',state:false},
  {id:'lamp',typeId:'lamp-green',state:false}
 ],wires:[{from:{c:'switch',p:'13'},to:{c:'lamp',p:'X1'}}]}}]};
 const defs={'push-no':{kind:'switch-no'},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){
  p.components[1]._active=!!p.components[0].state;
  return {stable:true,shortCircuit:false,blocked:false,oscillating:false};
 }};
 const r=audit({L,defs,solver});
 assert.equal(r.restorationChecked,1);
 assert.equal(r.restorationFailures.length,0);
 assert.equal(r.observedOutputChanges,1);
 assert.equal(r.failures.length,0);
 assert.equal(r.stabilityStatus,'FAIL','small fixture cannot satisfy full 722 scope');
});

test('stable solver does not excuse failing OFF restoration of a downstream meter',()=>{
 const L={lessons:[{id:'meter-drift',project:{components:[{id:'sw',typeId:'push-no',state:false},{id:'meter',typeId:'meter-v'}],wires:[{from:{c:'sw',p:'13'},to:{c:'meter',p:'V'}}]}}]};
 const defs={'push-no':{kind:'switch-no'},'meter-v':{kind:'meter-v'}};
 let calls=0;
 const solver={solve(p){p.components[1]._meter={value:[0,24,12][calls++]};return {stable:true,blocked:false,shortCircuit:false,oscillating:false};}};
 const r=audit({L,defs,solver});
 assert.equal(r.stableInitial,1);assert.equal(r.stableChanged,1);assert.equal(r.stableRestored,1);
 assert.equal(r.restorationChecked,1);assert.equal(r.restorationFailures.length,1);
 assert.equal(r.solverFailures.length,0);assert.equal(r.responseStatus,'PASS');
 assert.equal(r.restorationStatus,'REVIEW');
 assert.equal(r.failures[0].phase,'Restored');assert.equal(r.stabilityStatus,'FAIL');
});
test('passive circuit does not falsely count as actuated restoration',()=>{
 const L={lessons:[{id:'passive',project:{components:[{id:'a',typeId:'supply-dc-plus'},{id:'lamp',typeId:'lamp-green'}],wires:[{from:{c:'a',p:'P'},to:{c:'lamp',p:'X1'}}]}}]};
 const defs={'supply-dc-plus':{},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){p.components[1]._active=true;return {stable:true,blocked:false,shortCircuit:false,oscillating:false};}};
 const r=audit({L,defs,solver});
 assert.equal(r.noControl,1);assert.equal(r.controls,0);
 assert.deepEqual(r.noControlLessons.map(x=>x.id),['passive']);
 assert.deepEqual(r.passiveLessons.map(x=>x.id),['passive']);
 assert.equal(r.noControlLessons[0].classification,'PASSIVE_STABILITY_ONLY');
 assert.equal(r.noControlLessons[0].observableCount,1);
 assert.equal(r.restorationChecked,0);assert.equal(r.observedOutputChanges,0);
 assert.equal(r.restorationCoverage,'0/0');
 assert.equal(r.responseStatus,'REVIEW');
 assert.equal(r.actuationCoverage,'0/1');
 assert.equal(r.behaviorStatus,'REVIEW');
});

test('stable unactuated lessons cannot be promoted to full sequential behavior acceptance',()=>{
 const L={lessons:[{id:'actuated',project:{components:[{id:'sw',typeId:'push-no',state:false},{id:'bulb',typeId:'lamp-green'}],wires:[{from:{c:'sw',p:'13'},to:{c:'bulb',p:'X1'}}]}},
 {id:'passive',project:{components:[{id:'supply',typeId:'supply-dc-plus'},{id:'bulb',typeId:'lamp-green'}],wires:[{from:{c:'supply',p:'P'},to:{c:'bulb',p:'X1'}}]}}]};
 const defs={'push-no':{kind:'switch-no'},'supply-dc-plus':{},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){p.components[1]._active=!!p.components[0].state;return{stable:true,blocked:false,shortCircuit:false,oscillating:false};}};
 const r=audit({L,defs,solver});
 assert.equal(r.controls,1);assert.equal(r.noControl,1);
 assert.deepEqual(r.noControlLessons.map(x=>x.id),['passive']);
 assert.equal(r.responseStatus,'PASS');assert.equal(r.restorationStatus,'PASS');
 assert.equal(r.actuationCoverage,'1/2');assert.equal(r.behaviorStatus,'REVIEW');
});

test('unrecognized switch remains a separately listed candidate rather than receiving actuation PASS',()=>{
 const L={lessons:[{id:'unrecognized-switch',project:{components:[{id:'sw',typeId:'custom-switch',state:false},{id:'lamp',typeId:'lamp-green'}],wires:[{from:{c:'sw',p:'1'},to:{c:'lamp',p:'X1'}}]}}]};
 const defs={'custom-switch':{kind:'switch-no'},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){p.components[1]._active=false;return{stable:true,shortCircuit:false,blocked:false,oscillating:false};}};
 const r=audit({L,defs,solver});
 assert.equal(r.noControl,1);
 assert.equal(r.noControlLessons[0].classification,'UNSUPPORTED_ACTUATOR');
 assert.deepEqual(r.unsupportedActuatorLessons.map(x=>x.id),['unrecognized-switch']);
 assert.deepEqual(r.noControlLessons[0].candidateTypes,['custom-switch']);
 assert.equal(r.noControlLessons[0].observableCount,1);
 assert.equal(r.behaviorStatus,'REVIEW');
});

test('catalog kind identifies obscure actuator labels rather than treating them as passive',()=>{
 const L={lessons:[{id:'opaque-actuator',project:{components:[
  {id:'control',typeId:'vendor-k42',state:false},{id:'lamp',typeId:'lamp-green'}
 ],wires:[{from:{c:'control',p:'1'},to:{c:'lamp',p:'X1'}}]}}]};
 const defs={'vendor-k42':{kind:'switch-no'},'lamp-green':{kind:'lamp'}};
 const solver={solve(p){p.components[1]._active=false;return{stable:true,shortCircuit:false,blocked:false,oscillating:false};}};
 const r=audit({L,defs,solver});
 assert.deepEqual(r.unsupportedActuatorLessons.map(x=>x.id),['opaque-actuator']);
 assert.deepEqual(r.passiveLessons,[]);
 assert.deepEqual(r.unsupportedActuatorLessons[0].candidateTypes,['vendor-k42']);
 assert.equal(r.behaviorStatus,'REVIEW');
});

test('missing catalog definitions are blocked and never counted as passive',()=>{
 const L={lessons:[{id:'undefined-control',project:{components:[
  {id:'sw',typeId:'unknown-device'},{id:'lamp',typeId:'lamp-green'}
 ],wires:[{from:{c:'sw',p:'1'},to:{c:'lamp',p:'X1'}}]}}]};
 const defs={'lamp-green':{kind:'lamp'}};
 const solver={solve(){throw Error('must not solve missing definition');}};
 const r=audit({L,defs,solver});
 assert.equal(r.withWires,1);
 assert.equal(r.controls,0);
 assert.equal(r.noControl,0);
 assert.equal(r.missingDefinitionLessons.length,1);
 assert.equal(r.missingDefinitionLessons[0].classification,'MISSING_DEFINITIONS');
 assert.deepEqual(r.missingDefinitionLessons[0].types,['unknown-device']);
 assert.equal(r.stabilityStatus,'FAIL');
 assert.equal(r.behaviorStatus,'REVIEW');
});

test('classification coverage accounts separately for missing, unsupported, passive and controlled lessons',()=>{
 const types=['missing-device','vendor-switch','dc-source','push-no'];
 const defs={'vendor-switch':{kind:'switch-no'},'dc-source':{},'push-no':{kind:'switch-no'},'lamp-green':{kind:'lamp'}};
 const L={lessons:types.map((type,i)=>({id:'class-'+i,project:{components:[
  {id:'s',typeId:type,state:false},{id:'l',typeId:'lamp-green'}
 ],wires:[{from:{c:'s',p:'1'},to:{c:'l',p:'X1'}}]}}))};
 const solver={solve(p){p.components[1]._active=!!p.components[0].state;return{
  stable:true,blocked:false,shortCircuit:false,oscillating:false};}};
 const r=audit({L,defs,solver});
 assert.equal(r.classificationCoverage,'4/4');
 assert.equal(r.classificationComplete,true);
 assert.equal(r.missingDefinitionLessons.length,1);
 assert.equal(r.unsupportedActuatorLessons.length,1);
 assert.equal(r.passiveLessons.length,1);
 assert.equal(r.controls,1);
 assert.equal(r.behaviorStatus,'REVIEW');
});
