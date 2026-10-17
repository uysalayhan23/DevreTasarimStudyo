'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const reasons={13:'TWO_STATION_NATIVE_PENDING',14:'MISSING_REVERSE_MOTOR_CONTACTOR'};
const lesson=n=>L.byId['plc-hardware-programming-src-'+String(n).padStart(2,'0')];
for(let n=1;n<=19;n++)test('SC'+(181+n)+' actual PLC reference/topology scope matches lesson title',()=>{
 const l=lesson(n);assert.ok(l);const p=l.project,wired=[4,5,6,12,13,14].includes(n);
 assert.equal(l.kind,wired?'wiring':'quiz');assert.equal(p.wires.length,wired?(n===13?22:18):0);
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
  assert.equal(p.components.filter(x=>x.typeId==='push-no').length,n===13?2:1);
  assert.equal(p.components.filter(x=>x.typeId==='push-nc').length,n===13?2:1);
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
  assert.equal(io.program,n===13?'two-station-start-stop':'start-stop-latch');
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
test('SC194 has two physical START/STOP stations with independent X10:7–10 PLC inputs',()=>{
 const p=lesson(13).project,c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 assert.equal(p.wires.length,22);
 assert.equal(p.components.filter(x=>x.typeId==='push-no').length,2);
 assert.equal(p.components.filter(x=>x.typeId==='push-nc').length,2);
 assert.equal(c.plc.plcProgram,'two-station-start-stop');
 for(const [from,to] of [
  [{c:'ps',p:'P'},{c:'start2',p:'13'}],
  [{c:'start2',p:'14'},{c:'plc',p:'X10:9'}],
  [{c:'ps',p:'P'},{c:'stop2',p:'21'}],
  [{c:'stop2',p:'22'},{c:'plc',p:'X10:10'}]
 ])assert.ok(p.wires.some(w=>JSON.stringify(w.from)===JSON.stringify(from)&&
   JSON.stringify(w.to)===JSON.stringify(to)),'Missing second station physical wire');
 assert.equal(lesson(13).pedagogyReview.titleTopologyIssue,'TWO_STATION_NATIVE_PENDING');
 assert.equal(lesson(13).pedagogyReview.plcAdvancedLogicAcceptance,false);
});
test('SC194 second START latches while either NC STOP has unconditional priority',()=>{
 const p=structuredClone(lesson(13).project),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 const scenarios=[
  [0,false,false,false,false,false], // idle, both NC STOP closed
  [100,false,false,true,false,true], // second START only
  [200,false,false,false,false,true], // retained after S2 release
  [300,false,true,false,false,false], // first STOP immediately drops
  [400,true,false,false,false,true], // first START alone
  [500,false,false,false,true,false], // second STOP immediately drops
  [600,false,false,false,false,false] // no unexpected restart
 ];
 for(const [now,start1,stop1,start2,stop2,running] of scenarios){
  c.start.state=start1;c.stop.state=stop1;
  c.start2.state=start2;c.stop2.state=stop2;
  const res=Solver.solve(p,defs,{now});
  assert.equal(res.stable,true,'SC194 numerical state did not settle at '+now);
  assert.equal(res.blocked,false);
  assert.equal(res.shortCircuit,false);
  const state=c.plc._plcRuntime;
  assert.equal(state.program,'two-station-start-stop');
  assert.equal(state.inputs['X10:7'],start1);
  assert.equal(state.inputs['X10:8'],!stop1);
  assert.equal(state.inputs['X10:9'],start2);
  assert.equal(state.inputs['X10:10'],!stop2);
  assert.equal(state.outputs['X12:3'],running);
  assert.equal(!!c.coil._active,running);
  assert.equal(!!c.motor._active,running);
 }
});
