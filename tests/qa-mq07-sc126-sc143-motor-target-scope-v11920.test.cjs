'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const exceptions={
 '01':'DOL_SAMPLE_NOT_MOTOR_NAMEPLATE','02':'MISSING_SIX_TERMINAL_STAR_DELTA',
 '03':'MISSING_PHASE_SEQUENCE_CHANGE','06':'MISSING_JOG_RUN_SELECTOR',
 '07':'MISSING_SECOND_CONTROL_STATION','08':'MISSING_PACKAGE_SWITCH',
 '09':'MISSING_ON_DELAY_RELAY','10':'MISSING_OFF_DELAY_RELAY',
 '11':'MISSING_SPEED_CONTROL','12':'MISSING_SINGLE_BUTTON_TOGGLE',
 '13':'MISSING_PROTECTION_RELAY','15':'MISSING_OVERLOAD_RELAY',
 '16':'MISSING_PHASE_MONITOR','17':'MISSING_AUTOMATIC_RETURN',
 '18':'PLC_PROGRAM_NOT_VALIDATED'
};
const lesson=n=>L.byId['motor-direct-power-src-'+String(n).padStart(2,'0')];
const clone=n=>structuredClone(lesson(n).project);
function check(s,context){assert.equal(s.stable,true,context+' stable');assert.equal(!!s.blocked,false,context+' unblocked');assert.equal(!!s.shortCircuit,false,context+' no short');assert.equal(!!s.oscillating,false,context+' nonoscillating')}
for(let n=1;n<=18;n++)test('SC'+(125+n)+' motor title/physical circuit claims remain grounded',()=>{
 const l=lesson(n);assert.ok(l,'missing motor lesson');assert.equal(l.kind,'wiring');
 assert.ok(l.project.components.some(c=>c.typeId==='motor-3p'));
 assert.ok(l.project.wires.length>=11);
 for(const c of l.project.components)assert.ok(defs[c.typeId],c.typeId);
 const s=Solver.solve(clone(n),defs,{now:0});check(s,l.id);
 const issue=exceptions[String(n).padStart(2,'0')]||null;
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 assert.equal(l.pedagogyReview.titleTopologyStatus,issue?'REVIEW':'SOURCE_ALIGNED');
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(l.explanation,/Fiziksel motor, gerçek şebeke veya güvenlik uygunluğu/);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
});
test('SC129 jog: START release de-energizes coil/motor rather than latching',()=>{
 const p=clone(4),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const observed=[];
 for(const [now,start,stop] of [[0,false,false],[300,true,false],[600,false,false],[900,false,true]]){
  c.start.state=start;c.stop.state=stop;check(Solver.solve(p,defs,{now}),'jog '+now);
  observed.push([!!c.coil._active,!!c.motor._active]);
 }
 assert.deepEqual(observed,[[false,false],[true,true],[false,false],[false,false]]);
 assert.equal(p.components.some(c=>c.id==='hold'),false);
});
test('SC130 DOL seal-in holds after START release and STOP clears power',()=>{
 const p=clone(5),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const observed=[];
 for(const [now,start,stop] of [[0,false,false],[300,true,false],[600,false,false],[900,false,true],[1200,false,false]]){
  c.start.state=start;c.stop.state=stop;check(Solver.solve(p,defs,{now}),'DOL '+now);
  observed.push([!!c.coil._active,!!c.motor._active]);
 }
 assert.deepEqual(observed,[[false,false],[true,true],[true,true],[false,false],[false,false]]);
 assert.ok(p.components.some(c=>c.id==='hold'&&c.typeId==='contact-no'));
});
test('SC139 reversing contactors do not overlap and motor reverses direction after STOP',()=>{
 const p=clone(14),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const phases=[[0,false,false,false],[300,true,false,false],[600,false,false,false],[900,false,false,true],[1200,false,true,false],[1500,false,false,false]];
 const seen=[];
 for(const [now,f,r,stop] of phases){
  c.startF.state=f;c.startR.state=r;c.stop.state=stop;
  check(Solver.solve(p,defs,{now}),'reverse '+now);
  assert.equal(!!c.coilF._active&&!!c.coilR._active,false,'no simultaneous opposite coils');
  seen.push([!!c.coilF._active,!!c.coilR._active,Math.sign(c.motor._spin)]);
 }
 assert.deepEqual(seen,[[false,false,0],[true,false,1],[true,false,1],[false,false,0],[false,true,-1],[false,true,-1]]);
});
test('SC142 limit NC trips corresponding coil; it does not auto-return',()=>{
 const p=clone(17),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 c.startF.state=true;check(Solver.solve(p,defs,{now:0}),'limit start');assert.ok(c.coilF._active);
 c.startF.state=false;check(Solver.solve(p,defs,{now:100}),'limit hold');assert.ok(c.coilF._active);
 c.ls1.state=true;check(Solver.solve(p,defs,{now:200}),'limit trip');assert.equal(!!c.coilF._active,false);assert.equal(!!c.coilR._active,false);assert.equal(!!c.motor._active,false);
 c.ls1.state=false;check(Solver.solve(p,defs,{now:300}),'limit released');assert.equal(!!c.motor._active,false);
});
