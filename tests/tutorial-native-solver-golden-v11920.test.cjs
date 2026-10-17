'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Simulation=require('../dist/simulation.js');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const fixture=JSON.parse(fs.readFileSync(path.resolve(__dirname,'fixtures/tutorial_native_solver_golden_v11920.json'),'utf8'));
const kinds=new Set(['switch-no','switch-nc','switch-both','switch-multi','sensor','detector']);
const clone=v=>JSON.parse(JSON.stringify(v));

// The W() factory in tutorial-pedagogy.js allocates pgw IDs from a mutable
// sequence counter. These are not terminal identities. Preserve all wire
// endpoints, metadata, component geometry and stable (non-pgw) IDs exactly.
function normalizeGeneratedWireIds(project,id){
 const ids=project.wires.map(w=>w.id);
 assert.ok(ids.every(x=>typeof x==='string'&&x.length>0),'Missing wire ID: '+id);
 assert.equal(new Set(ids).size,ids.length,'Duplicate wire ID: '+id);
 for(const wire of project.wires)if(/^pgw[0-9]+$/.test(wire.id))wire.id='pgw:generated';
}

// Explicit, narrowly scoped overlays only. Never regenerate or overwrite
// the immutable golden JSON from the current curriculum.
function verifyProtectedGolden(entry,current){
 const id=entry.id,baseline=clone(entry.project),actual=clone(current);
 if(id==='sensor-analog-apps-src-03'){
  const ids=actual.components.map(c=>c.id);
  assert.deepEqual(ids,['tc','ctl','g1','v1','v1-red','v1-black'],'Unexpected thermocouple components');
  assert.equal(actual.wires.length,6,'Unexpected thermocouple wires');
  const [tc,ctl,,meter,red,black]=actual.components;
  assert.deepEqual([tc.temperature,tc.coldJunction,tc.thermocoupleType],[100,25,'K']);
  assert.deepEqual(ctl.instrumentSettings,{input:'K',supply:'UV',displayOnly:'on',set:150,filter:1});
  assert.deepEqual([meter.typeId,meter.ref,meter.x,meter.y,meter.meterPosition],['unit-ut33d-plus','V1',1000,155,1]);
  assert.deepEqual([red.typeId,red.x,red.y,red.probeTarget,red.mq07ThermocoupleMeterProbe],
   ['test-probe-red',920,380,{c:'tc',p:'+'},true]);
  assert.deepEqual([black.typeId,black.x,black.y,black.probeTarget,black.mq07ThermocoupleMeterProbe],
   ['test-probe-black',1180,380,{c:'tc',p:'−'},true]);
  assert.deepEqual(actual.wires.slice(4).map(w=>({
   from:w.from,to:w.to,role:w.role,color:w.color,size:w.size,
   hint:w.tutorialHint,why:w.tutorialWhy
  })),[
   {from:{c:'v1',p:'V'},to:{c:'v1-red',p:'PLUG'},role:'MEASURE',color:'#e53935',size:'1.5',
    hint:'V1/VΩmA → kırmızı sanal prob',why:'DCV 200 mV gerilim ölçümü için VΩmA giriş kablosu.'},
   {from:{c:'v1',p:'COM'},to:{c:'v1-black',p:'PLUG'},role:'MEASURE',color:'#111827',size:'1.5',
    hint:'V1/COM → siyah sanal prob',why:'Termokupl soğuk ucu karşılaştırma COM giriş kablosu.'}
  ]);
  // The historical TC graph must remain unchanged beneath its virtual meter.
  delete tc.temperature;delete tc.coldJunction;delete tc.thermocoupleType;
  delete ctl.instrumentSettings;
  actual.components=actual.components.slice(0,3);
  actual.wires=actual.wires.slice(0,4);
 }else if(id==='sensor-analog-apps-src-04'){
  assert.deepEqual(actual.components.map(c=>c.id),['pt','ctl','g1']);
  assert.equal(actual.wires.length,5,'Unexpected PT100 wires');
  const [pt,ctl]=actual.components;
  assert.equal(pt.temperature,25);
  assert.equal(ctl.mq07Pt100ThreeWireInput,true);
  assert.deepEqual(ctl.instrumentSettings,{input:'PT100',supply:'UV',displayOnly:'on',set:150,filter:1});
  const corrected=[
   ['A','10','PT100 tek uç → sanal TIC1/10','Üç telli sanal RTD ölçümündeki tek taraf ucudur.'],
   ['B1','8','PT100 B1 → sanal TIC1/8','Ortak tarafın ilk ayrı sanal ölçüm telidir.'],
   ['B2','9','PT100 B2 → sanal TIC1/9','Ortak tarafın ikinci ayrı sanal ölçüm telidir.']
  ];
  for(let i=0;i<3;i++){
   const w=actual.wires[i],[pin,target,hint,why]=corrected[i];
   assert.equal(w.from.c,'pt');assert.equal(w.from.p,pin);
   assert.equal(w.to.c,'ctl');assert.equal(w.to.p,target);
   assert.equal(w.tutorialHint,hint);assert.equal(w.tutorialWhy,why);
   // Restore *only* the explicitly audited PT100 overlay fields for the
   // strict historical topology/geometry comparison below.
   w.to.p=baseline.wires[i].to.p;
   w.tutorialHint=baseline.wires[i].tutorialHint;
   w.tutorialWhy=baseline.wires[i].tutorialWhy;
  }
  delete pt.temperature;delete ctl.mq07Pt100ThreeWireInput;delete ctl.instrumentSettings;
 }
 normalizeGeneratedWireIds(actual,id);
 normalizeGeneratedWireIds(baseline,id);
 assert.equal(JSON.stringify(actual),JSON.stringify(baseline),
  'Golden topology/geometry/source changed: '+id);
}
test('90 golden projects preserve original graphs with audited TC/PT100 overlays',()=>{
 const L=QA.curriculum();
 assert.equal(L.lessons.length,1655);
 assert.equal(fixture.records.length,90);
 const seen=new Set();
 for(const entry of fixture.records){
  assert.ok(!seen.has(entry.id),'Duplicate fixture '+entry.id);seen.add(entry.id);
  const original=L.byId[entry.id];
  assert.ok(original,'Missing canonical lesson '+entry.id);
  verifyProtectedGolden(entry,original.project);
  assert.ok(entry.project.wires.length>0,'Golden must have a physical virtual circuit '+entry.id);
 }
 assert.ok(new Set(fixture.records.map(x=>x.topicId)).size>=14,'Insufficient topic diversity');
});
test('native simulation is stable across 90 baseline and at least 250 source control states',()=>{
 const catalog=QA.catalog();
 let baselines=0,toggled=0;
 for(const {id,project:template} of fixture.records){
  const evaluate=(scenario,label)=>{
   const p=clone(scenario),result=Simulation.solve(p,catalog,{now:300});
   assert.equal(result.blocked,false,id+':'+label+' blocked');
   assert.equal(result.shortCircuit,false,id+':'+label+' short circuit');
   assert.equal(result.stable,true,id+':'+label+' unstable');
  };
  evaluate(template,'baseline');baselines++;
  const controls=template.components.filter(c=>kinds.has(catalog[c.typeId]?.kind)&&typeof c.state==='boolean').slice(0,2);
  for(const control of controls)for(const state of [false,true]){
   const p=clone(template);p.components.find(c=>c.id===control.id).state=state;
   evaluate(p,control.id+'='+state);
   toggled++;
  }
 }
 assert.equal(baselines,90);
 assert.ok(toggled>=250,'Expected at least 250 physically modelled virtual input-state checks, got '+toggled);
});
