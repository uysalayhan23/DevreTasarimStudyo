'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const exceptions={
 '01':'DOL_SAMPLE_NOT_MOTOR_NAMEPLATE','02':'SIX_TERMINAL_STAR_DELTA_NATIVE_PENDING',
 '03':'PHASE_REVERSAL_NATIVE_PENDING','06':'JOG_RUN_SELECTOR_NATIVE_PENDING',
 '07':'TWO_STATION_NATIVE_PENDING','08':'MISSING_PACKAGE_SWITCH',
 '09':'MISSING_ON_DELAY_RELAY','10':'MISSING_OFF_DELAY_RELAY',
 '11':'MISSING_SPEED_CONTROL','12':'MISSING_SINGLE_BUTTON_TOGGLE',
 '13':'MISSING_PROTECTION_RELAY','15':'THERMAL_OVERLOAD_NATIVE_PENDING',
 '16':'MISSING_PHASE_MONITOR','17':'MISSING_AUTOMATIC_RETURN',
 '18':'PLC_PROGRAM_NOT_VALIDATED'
};
const lesson=n=>L.byId['motor-direct-power-src-'+String(n).padStart(2,'0')];
const clone=n=>structuredClone(lesson(n).project);
function check(s,context){assert.equal(s.stable,true,context+' stable');assert.equal(!!s.blocked,false,context+' unblocked');assert.equal(!!s.shortCircuit,false,context+' no short');assert.equal(!!s.oscillating,false,context+' nonoscillating')}
for(let n=1;n<=18;n++)test('SC'+(125+n)+' motor title/physical circuit claims remain grounded',()=>{
 const l=lesson(n);assert.ok(l,'missing motor lesson');assert.equal(l.kind,'wiring');
 assert.ok(l.project.components.some(c=>c.typeId=== (n===2?'motor-y-d':'motor-3p')));
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

test('SC127 uses six real U1/V1/W1/U2/V2/W2 winding pins via 0-star-delta package',()=>{
 const p=lesson(2).project;
 assert.ok(p.components.some(c=>c.typeId==='motor-y-d'));
 assert.ok(p.components.some(c=>c.id==='sw'));
 const wires=p.wires;
 for(const pin of ['U1','V1','W1','U2','V2','W2'])
  assert.ok(wires.some(w=>w.from.c==='sw'&&w.from.p===pin&&
   w.to.c==='motor'&&w.to.p===pin),'Missing winding terminal '+pin);
 assert.equal(lesson(2).pedagogyReview.titleTopologyIssue,'SIX_TERMINAL_STAR_DELTA_NATIVE_PENDING');
});
test('SC128 real reversing K1/K2 topology swaps phase order and interlocks contactors',()=>{
 const p=lesson(3).project;
 assert.equal(p.components.filter(c=>c.typeId==='coil-contactor').length,2);
 assert.equal(p.components.filter(c=>c.typeId==='main-contact').length,2);
 assert.ok(p.components.some(c=>c.id==='coilF'));
 assert.ok(p.components.some(c=>c.id==='coilR'));
 assert.equal(lesson(3).pedagogyReview.titleTopologyIssue,'PHASE_REVERSAL_NATIVE_PENDING');
});
test('SC132 two real NC STOPs are series and two NO STARTs share one K1 seal',()=>{
 const p=lesson(7).project;
 assert.equal(p.wires.length,16);
 assert.equal(p.components.filter(c=>c.typeId==='push-no').length,2);
 assert.equal(p.components.filter(c=>c.typeId==='push-nc').length,2);
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&
  w.to.c===b&&w.to.p===bp);
 for(const [a,ap,b,bp] of [
  ['stop','22','stop2','21'],['stop2','22','start','13'],
  ['stop2','22','start2','13'],['stop2','22','hold','13'],
  ['start2','14','coil','A1']
 ])assert.ok(has(a,ap,b,bp),'Missing second station cable '+a+'→'+b);
 assert.ok(!has('stop','22','hold','13'),'Old bypass defeats second STOP');
 assert.equal(lesson(7).pedagogyReview.titleTopologyIssue,'TWO_STATION_NATIVE_PENDING');
});

test('SC131 JOG RUN switch really gates K1 self-hold branch',()=>{
 const p=clone(6),parts=Object.fromEntries(p.components.map(c=>[c.id,c]));
 assert.equal(p.wires.length,14);
 assert.equal(parts.runMode.typeId,'selector-no');
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&
   w.to.c===b&&w.to.p===bp);
 assert.ok(has('hold','14','runMode','13'));
 assert.ok(has('runMode','14','coil','A1'));
 assert.ok(!has('hold','14','coil','A1'));
 const trace=[
  [0,false,false,false,false],
  [100,true,false,false,true],
  [200,false,false,false,false],
  [300,true,false,true,true],
  [400,false,false,true,true],
  [500,false,true,true,false]
 ];
 for(const[now,start,stop,run,motor]of trace){
  parts.start.state=start;parts.stop.state=stop;parts.runMode.state=run;
  check(Solver.solve(p,defs,{now}),'SC131 JOG RUN '+now);
  assert.equal(!!parts.motor._active,motor);
 }
});
test('SC140 F1 overload has 3 series poles and NC 95–96 in K1 trip control',()=>{
 const p=clone(15),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 assert.equal(p.wires.length,17);
 assert.equal(c.fr.typeId,'overload');
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&
  w.to.c===b&&w.to.p===bp);
 for(const [from,pin,to,terminal] of [
  ['g1','L1','fr','95'],['fr','96','stop','21'],
  ['main','2','fr','1'],['fr','2','motor','U'],
  ['main','4','fr','3'],['fr','4','motor','V'],
  ['main','6','fr','5'],['fr','6','motor','W']
 ])assert.ok(has(from,pin,to,terminal),'Termik terminal eksik '+from+'/'+pin);
 assert.ok(!has('g1','L1','stop','21'),'F1 95–96 bypass must be absent');
 const steps=[
  [0,false,false,false,false],
  [100,true,false,false,true],
  [200,false,false,false,true],
  [300,false,false,true,false],
  [400,false,false,false,false]
 ];
 for(const [now,start,stop,tripped,active]of steps){
  c.start.state=start;c.stop.state=stop;c.fr.state=tripped;
  check(Solver.solve(p,defs,{now}),'SC140 F1 '+now);
  assert.equal(!!c.motor._active,active);
 }
});
