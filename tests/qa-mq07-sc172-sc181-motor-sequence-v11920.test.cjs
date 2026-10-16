'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const reasons=['MISSING_SECOND_MOTOR_SEQUENCING','MISSING_PERIODIC_TWO_MOTOR_CYCLE','MISSING_REVERSE_DELAYED_SEQUENCE','MISSING_DUAL_OVERLOAD_CHAIN','MISSING_LIMIT_REVERSE_CONTINUOUS','MISSING_TIMED_FORWARD_REVERSE','UNSPECIFIED_MOTOR_PROBLEM_1','UNSPECIFIED_MOTOR_PROBLEM_2','MISSING_INDEPENDENT_TWO_MOTOR_CONTROL','MISSING_CONVEYOR_CONDITIONAL_SEQUENCE'];
const lesson=n=>L.byId['motor-sequence-src-'+String(n).padStart(2,'0')];
function check(s,c){assert.equal(s.stable,true,c+' stable');assert.equal(!!s.blocked,false,c+' not blocked');assert.equal(!!s.shortCircuit,false,c+' no short');assert.equal(!!s.oscillating,false,c+' not oscillating');}
for(let n=1;n<=10;n++)test('SC'+(171+n)+' truthful topology and canonical terminal verification',()=>{
 const l=lesson(n);assert.ok(l);assert.equal(l.kind,'wiring');assert.equal(l.project.wires.length,13);
 const c=l.project.components;
 assert.equal(c.filter(x=>x.typeId==='motor-3p').length,1);
 assert.equal(c.filter(x=>x.typeId==='coil-contactor').length,1);
 assert.equal(c.filter(x=>x.typeId==='coil-delay-on').length,0);
 assert.equal(c.filter(x=>x.typeId==='overload').length,0);
 assert.equal(c.filter(x=>x.typeId==='limit-nc').length,0);
 assert.equal(c.filter(x=>x.typeId==='proximity').length,0);
 assert.equal(l.pedagogyReview.titleTopologyIssue,reasons[n-1]);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.multiMotorAcceptance,false);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(l.explanation,/çok motorlu/);
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
  assert.equal(!!c.motor._active,motor,'only M1 '+now);
  assert.equal(c.motor._spin===0,!motor,'motor rotation '+now);
 }
});
