'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const reasons=['TWO_MOTOR_SEQUENTIAL_NATIVE_PENDING','MISSING_PERIODIC_TWO_MOTOR_CYCLE','MISSING_REVERSE_DELAYED_SEQUENCE','MISSING_DUAL_OVERLOAD_CHAIN','MISSING_LIMIT_REVERSE_CONTINUOUS','MISSING_TIMED_FORWARD_REVERSE','UNSPECIFIED_MOTOR_PROBLEM_1','UNSPECIFIED_MOTOR_PROBLEM_2','TWO_MOTOR_INDEPENDENT_NATIVE_PENDING','MISSING_CONVEYOR_CONDITIONAL_SEQUENCE'];
const lesson=n=>L.byId['motor-sequence-src-'+String(n).padStart(2,'0')];
function check(s,c){assert.equal(s.stable,true,c+' stable');assert.equal(!!s.blocked,false,c+' not blocked');assert.equal(!!s.shortCircuit,false,c+' no short');assert.equal(!!s.oscillating,false,c+' not oscillating');}
for(let n=1;n<=10;n++)test('SC'+(171+n)+' truthful topology and canonical terminal verification',()=>{
 const l=lesson(n);assert.ok(l);assert.equal(l.kind,'wiring');assert.equal(l.project.wires.length,n===1?23:n===9?26:13);
 const c=l.project.components;
 assert.equal(c.filter(x=>x.typeId==='motor-3p').length,n===1||n===9?2:1);
 assert.equal(c.filter(x=>x.typeId==='coil-contactor').length,n===1||n===9?2:1);
 assert.equal(c.filter(x=>x.typeId==='coil-delay-on').length,0);
 assert.equal(c.filter(x=>x.typeId==='overload').length,0);
 assert.equal(c.filter(x=>x.typeId==='limit-nc').length,0);
 assert.equal(c.filter(x=>x.typeId==='proximity').length,0);
 assert.equal(l.pedagogyReview.titleTopologyIssue,reasons[n-1]);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.multiMotorAcceptance,false);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(l.explanation,n===1||n===9?/iki motorun|iki ayrı motorun|M1 START\/STOP/:/çok motorlu/);
 const parts=new Map(c.map(x=>[x.id,x]));
 for(const w of l.project.wires)for(const ep of [w.from,w.to]){
  const p=parts.get(ep.c);assert.ok(p);assert.ok(defs[p.typeId]?.pins?.some(pin=>pin.id===ep.p),ep.c+'/'+ep.p);
 }
});
for(let n=1;n<=10;n++)test('SC'+(171+n)+' actual single-motor START hold STOP solver (not two motors)',()=>{
 const p=structuredClone(lesson(n).project),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 const expected=[[0,false,false,false],[100,true,false,true],[200,false,false,true],[300,false,true,false],[400,false,false,false]];
 for(const [now,start,stop,motor] of expected){
  c.start.state=start;c.stop.state=stop;
  check(S.solve(p,defs,{now}),'motor-sequence-'+n+' '+now);
  assert.equal(!!c.coil._active,motor,'contact coil '+now);
  assert.equal(!!c.motor._active,motor,'M1 '+now);
  assert.equal(c.motor._spin===0,!motor,'M1 rotation '+now);
  if(n===1)assert.equal(!!c.motor2._active,motor,
   'Sequential M2 must follow K1 after M1 activation at '+now);
  if(n===9)assert.equal(!!c.motor2._active,false,
   'Independent M2 may not start with S1 alone at '+now);
 }
});

test('SC172 dependent M2 power path is controlled by actual K1 NO',()=>{
 const p=lesson(1).project,by=Object.fromEntries(p.components.map(c=>[c.id,c]));
 assert.equal(p.components.filter(c=>c.typeId==='motor-3p').length,2);
 assert.equal(by.k1Permit.ref,'K1');
 assert.equal(by.coil2.ref,'K2');
 assert.equal(by.main2.ref,'K2');
 assert.ok(p.wires.some(w=>w.from.c==='k1Permit'&&w.from.p==='14'&&
  w.to.c==='coil2'&&w.to.p==='A1'));
 assert.equal(lesson(1).pedagogyReview.multiMotorAcceptance,false);
});
test('SC180 independently runs M2 without activating M1',()=>{
 const p=structuredClone(lesson(9).project),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 const trace=[
  [0,false,false,false,false],
  [100,true,false,false,true],
  [200,false,false,false,true],
  [300,false,true,false,false],
  [400,false,false,false,false]
 ];
 for(const [now,start,stop,m1,m2] of trace){
  c.start.state=false;c.stop.state=false;
  c.start2.state=start;c.stop2.state=stop;
  check(S.solve(p,defs,{now}),'SC180 independent '+now);
  assert.equal(!!c.motor._active,m1,'Uncommanded M1 '+now);
  assert.equal(!!c.motor2._active,m2,'Independent M2 '+now);
 }
 assert.equal(lesson(9).pedagogyReview.multiMotorAcceptance,false);
});
