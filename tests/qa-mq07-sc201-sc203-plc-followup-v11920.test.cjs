'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const get=n=>L.byId['plc-hardware-programming-src-'+String(n).padStart(2,'0')];
const rows=[
 [20,false,'NO_ANALOG_IO_WIRING',['plc-0-10','plc-0-12','sensor-level-analog']],
 [21,true,'MISSING_TIMED_STOP_PROGRAM',['motor-3p','coil-contactor','push-no','push-nc']],
 [22,false,'NO_PLC_VFD_CONTROL_WIRING',['sinamics-v20-1p']]
];
for(const [n,wired,issue,types] of rows)test('SC'+(181+n)+' real source topology and explicit unaccepted scope',()=>{
 const lesson=get(n),p=lesson?.project;
 assert.ok(lesson);assert.equal(lesson.kind,wired?'wiring':'quiz');
 assert.equal(p.wires.length,wired?18:0);
 assert.ok(p.components.some(c=>c.typeId==='plc-hw-6es7211-1ae40-0xb0'));
 for(const type of types)assert.ok(p.components.some(c=>c.typeId===type),type);
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 assert.equal(lesson.pedagogyReview.mq07PlcScope,'SC201_SC203');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,issue);
 for(const key of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','plcAdvancedLogicAcceptance'])
  assert.equal(lesson.pedagogyReview[key],false,key);
 assert.ok(lesson.beginnerSteps.some(s=>s.includes('PASS verme')));
 if(!wired){
  assert.ok(lesson.project.components.every(c=>!c._plcRuntime));
  assert.match(lesson.explanation,/yoktur|bulunmaz|simüle edilmez/);
 }else{
  const byId=Object.fromEntries(p.components.map(c=>[c.id,c]));
  for(const w of p.wires)for(const end of [w.from,w.to]){
   const part=byId[end.c];assert.ok(part,end.c);
   assert.ok(defs[part.typeId]?.pins?.some(pin=>pin.id===end.p),end.c+'/'+end.p);
  }
 }
});
test('SC202 STOP drops output immediately, not a verified delayed-stop or TON/TOF lesson',()=>{
 const p=structuredClone(get(21).project),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 for(const [now,start,stop,running] of [[0,false,false,false],[100,true,false,true],[200,false,false,true],[300,false,true,false],[5000,false,true,false]]){
  c.start.state=start;c.stop.state=stop;
  const res=Solver.solve(p,defs,{now});
  assert.equal(res.stable,true);
  assert.equal(!!res.blocked,false);
  assert.equal(!!res.shortCircuit,false);
  assert.equal(c.plc._plcRuntime.program,'start-stop-latch');
  assert.equal(c.plc._plcRuntime.outputs['X12:3'],running);
  assert.equal(!!c.coil._active,running);
  assert.equal(!!c.motor._active,running);
 }
 assert.ok(!p.components.some(c=>/timer|ton|tof/i.test(c.typeId)));
});
