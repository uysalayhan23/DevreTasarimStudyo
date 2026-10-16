'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const reasons={13:'MISSING_SECOND_START_STOP_STATION',14:'MISSING_REVERSE_MOTOR_CONTACTOR'};
const lesson=n=>L.byId['plc-hardware-programming-src-'+String(n).padStart(2,'0')];
for(let n=1;n<=19;n++)test('SC'+(181+n)+' actual PLC reference/topology scope matches lesson title',()=>{
 const l=lesson(n);assert.ok(l);const p=l.project,wired=[4,5,6,12,13,14].includes(n);
 assert.equal(l.kind,wired?'wiring':'quiz');assert.equal(p.wires.length,wired?18:0);
 assert.ok(p.components.some(c=>c.typeId==='plc-hw-6es7211-1ae40-0xb0'));
 for(const c of p.components)assert.ok(defs[c.typeId],c.typeId);
 const issue=reasons[n]||(wired?null:'NO_WIRED_CIRCUIT');
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 assert.equal(l.pedagogyReview.titleTopologyStatus,issue?'REVIEW':'SOURCE_ALIGNED');
 for(const prop of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','plcAdvancedLogicAcceptance'])assert.equal(l.pedagogyReview[prop],false);
 assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 const byId=Object.fromEntries(p.components.map(c=>[c.id,c]));
 for(const w of p.wires)for(const e of [w.from,w.to]){
  const part=byId[e.c];assert.ok(part,'unknown part '+e.c);
  assert.ok(defs[part.typeId]?.pins?.some(x=>x.id===e.p),e.c+'/'+e.p);
 }
 if(wired){
  assert.equal(p.components.filter(x=>x.typeId==='motor-3p').length,1);
  assert.equal(p.components.filter(x=>x.typeId==='coil-contactor').length,1);
  assert.equal(p.components.filter(x=>x.typeId==='push-no').length,1);
  assert.equal(p.components.filter(x=>x.typeId==='push-nc').length,1);
 }else{assert.match(l.explanation,/yoktur|bulunmaz|kablolanmamıştır|ölçülmez|yapılmamıştır|bağlanmamıştır|simüle edilmez|yürütülmez|oluşturulmamıştır/)}
});
for(const n of [4,5,6,12,13,14])test('SC'+(181+n)+' real PLC X10 input, X12 output, contactor and motor START/HOLD/STOP',()=>{
 const p=structuredClone(lesson(n).project),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const scenarios=[[0,false,false,false],[100,true,false,true],[200,false,false,true],[300,false,true,false],[400,false,false,false]];
 for(const [now,start,stop,running] of scenarios){
  c.start.state=start;c.stop.state=stop;
  const res=Solver.solve(p,defs,{now});
  assert.equal(res.stable,true);assert.equal(!!res.blocked,false);assert.equal(!!res.shortCircuit,false);
  const io=c.plc._plcRuntime;assert.equal(io.powered,true);
  assert.equal(io.inputs['X10:7'],start);assert.equal(io.inputs['X10:8'],!stop);
  assert.equal(io.outputs['X12:3'],running);
  assert.equal(io.program,'start-stop-latch');
  assert.equal(!!c.coil._active,running);assert.equal(!!c.motor._active,running);
 }
 assert.ok(p.wires.some(w=>w.from.c==='ac'&&w.from.p==='PE'&&w.to.c==='motor'&&w.to.p==='PE'));
});
test('SC195 reversing title cannot pass with only one contactor and start-stop program',()=>{
 const p=lesson(14).project;
 assert.equal(p.components.filter(c=>c.typeId==='coil-contactor').length,1);
 assert.ok(!p.components.some(c=>c.id==='coilR'));
 assert.equal(lesson(14).pedagogyReview.titleTopologyIssue,'MISSING_REVERSE_MOTOR_CONTACTOR');
});
test('SC194 two stations cannot pass with a single START and STOP',()=>{
 const p=lesson(13).project;
 assert.equal(p.components.filter(c=>c.typeId==='push-no').length,1);
 assert.equal(p.components.filter(c=>c.typeId==='push-nc').length,1);
 assert.equal(lesson(13).pedagogyReview.titleTopologyIssue,'MISSING_SECOND_START_STOP_STATION');
});
