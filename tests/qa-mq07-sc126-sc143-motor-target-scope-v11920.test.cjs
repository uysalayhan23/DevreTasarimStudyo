'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const exceptions={
 '01':'MOTOR_NAMEPLATE_REFERENCE_ONLY','02':'SIX_TERMINAL_STAR_DELTA_NATIVE_PENDING',
 '03':'PHASE_REVERSAL_NATIVE_PENDING','06':'JOG_RUN_SELECTOR_NATIVE_PENDING',
 '07':'TWO_STATION_NATIVE_PENDING','08':'PACKAGE_SWITCH_NATIVE_PENDING',
 '09':'ON_DELAY_MOTOR_CONTROL_NATIVE_PENDING','10':'OFF_DELAY_MOTOR_NATIVE_PENDING',
 '11':'VFD_SPEED_REFERENCE_ONLY','12':'SINGLE_BUTTON_PULSE_NATIVE_PENDING',
 '13':'THERMAL_PROTECTION_REPRESENTATIVE_NATIVE_PENDING','15':'THERMAL_OVERLOAD_NATIVE_PENDING',
 '16':'PHASE_MONITOR_NATIVE_PENDING','17':'LIMIT_AUTO_RETURN_NATIVE_PENDING',
 '18':'PLC_PROGRAM_NOT_VALIDATED'
};
const lesson=n=>L.byId['motor-direct-power-src-'+String(n).padStart(2,'0')];
const clone=n=>structuredClone(lesson(n).project);
function check(s,context){assert.equal(s.stable,true,context+' stable');assert.equal(!!s.blocked,false,context+' unblocked');assert.equal(!!s.shortCircuit,false,context+' no short');assert.equal(!!s.oscillating,false,context+' nonoscillating')}
for(let n=1;n<=18;n++)test('SC'+(125+n)+' motor title/physical circuit claims remain grounded',()=>{
 const l=lesson(n);assert.ok(l,'missing motor lesson');
 const reference=n===1||n===11;
 assert.equal(l.kind,reference?'quiz':'wiring');
 if(reference){
  assert.equal(l.project.referenceOnly,true);
  assert.equal(l.project.wires.length,0);
  assert.equal(l.quiz.answer,0);
 }else{
  assert.ok(l.project.components.some(c=>c.typeId===([2,8,9].includes(n)?'motor-y-d':'motor-3p')));
  assert.ok(l.project.wires.length>=([2,8].includes(n)?10:11));
 }
 for(const c of l.project.components)assert.ok(defs[c.typeId],c.typeId);
 if(!reference){const s=Solver.solve(clone(n),defs,{now:0});check(s,l.id);}
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
test('SC142 actual NC limits and KR1/KR2 contacts provide automatic opposite start',()=>{
 const p=clone(17),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 for(const [id,kind] of [['ls1','limit-nc'],['ls2','limit-nc'],
  ['senseF','coil-relay'],['senseR','coil-relay'],
  ['autoR','contact-nc'],['autoF','contact-nc'],
  ['passF','contact-no'],['passR','contact-no']])
  assert.equal(c[id]?.typeId,kind,'Missing catalog-backed auto return '+id);
 assert.equal(c.autoR.ref,c.senseF.ref);
 assert.equal(c.autoF.ref,c.senseR.ref);
 const has=(a,pin,b,to)=>p.wires.some(w=>
  w.from?.c===a&&w.from?.p===pin&&w.to?.c===b&&w.to?.p===to);
 for(const [a,ap,b,bp]of [
  ['ls1','22','senseF','A1'],['ls2','22','senseR','A1'],
  ['autoR','22','passR','13'],['autoF','22','passF','13']])
  assert.ok(has(a,ap,b,bp),'Missing automatic limit reversing route '+a+'/'+ap);
 assert.equal(lesson(17).pedagogyReview.titleTopologyIssue,'LIMIT_AUTO_RETURN_NATIVE_PENDING');
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

test('SC134 on-delay lesson has actual timer-driven star/delta winding and NC interlock',()=>{
 const p=lesson(9).project;
 assert.ok(p.wires.length>20);
 assert.ok(p.components.some(c=>c.typeId==='coil-delay-on'));
 assert.ok(p.components.some(c=>c.typeId==='motor-y-d'));
 for(const id of ['timer','coilStar','coilDelta','timerNO','timerNC'])
  assert.ok(p.components.some(c=>c.id===id),'Missing native timed control '+id);
 assert.equal(lesson(9).pedagogyReview.titleTopologyIssue,'ON_DELAY_MOTOR_CONTROL_NATIVE_PENDING');
});
test('SC138 scoped F1 thermal protection is real 3-pole plus K1 NC 95–96',()=>{
 const p=lesson(13).project;
 assert.equal(p.wires.length,17);
 assert.ok(p.components.some(c=>c.id==='fr'&&c.typeId==='overload'));
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&
  w.to.c===b&&w.to.p===bp);
 for(const [a,ap,b,bp] of [
  ['g1','L1','fr','95'],['fr','96','stop','21'],
  ['main','2','fr','1'],['fr','2','motor','U'],
  ['main','4','fr','3'],['fr','4','motor','V'],
  ['main','6','fr','5'],['fr','6','motor','W']
 ])assert.ok(has(a,ap,b,bp),'Missing protected motor terminal '+a+'/'+ap);
 assert.equal(lesson(13).pedagogyReview.titleTopologyIssue,
  'THERMAL_PROTECTION_REPRESENTATIVE_NATIVE_PENDING');
});

test('SC133 real six-terminal 0/Y/Delta package switch and SC135 delayed-release motor topology',()=>{
 const sw=lesson(8).project,off=lesson(10).project;
 assert.ok(sw.components.some(c=>c.id==='sw'));
 for(const pin of ['U1','V1','W1','U2','V2','W2'])
  assert.ok(sw.wires.some(w=>w.from?.c==='sw'&&w.from?.p===pin&&
   w.to?.c==='motor'&&w.to?.p===pin),'SC133 package pin '+pin);
 assert.ok(off.components.some(c=>c.id==='offKT'&&c.typeId==='coil-delay-off'&&c.delayValue===3));
 assert.ok(off.components.some(c=>c.id==='offNO'&&c.typeId==='contact-no'&&c.ref==='KT'));
 assert.ok(off.components.some(c=>c.id==='coilM'&&c.typeId==='coil-contactor'&&c.ref==='K1'));
});
test('SC137 one-button impulse and SC141 real phase monitor source remain title-specific',()=>{
 const one=lesson(12).project,phase=lesson(16).project;
 assert.equal(one.components.filter(c=>c.typeId==='push-no').length,1);
 assert.equal(one.components.filter(c=>c.typeId==='push-nc').length,0);
 assert.ok(one.components.some(c=>c.id==='impulse'&&c.typeId==='coil-pulse'));
 assert.ok(one.components.some(c=>c.id==='impulseNO'&&c.ref==='KP'));
 assert.ok(phase.components.some(c=>c.id==='phaseMonitor'&&c.typeId==='phase-sequence-relay'));
 for(const pin of ['L1','L2','L3','N','11'])
  assert.ok(phase.wires.some(w=>w.to?.c==='phaseMonitor'&&w.to?.p===pin));
 assert.ok(phase.wires.some(w=>w.from?.c==='phaseMonitor'&&w.from?.p==='14'&&
  w.to?.c==='stop'&&w.to?.p==='21'));
});
