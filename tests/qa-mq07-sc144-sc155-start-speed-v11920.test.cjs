'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const C=QA.curriculum(),defs=QA.catalog();
const id=n=>'motor-start-speed-src-'+String(n).padStart(2,'0');
const lesson=n=>C.byId[id(n)];
const clone=n=>structuredClone(lesson(n).project);
const check=(r,context)=>{assert.equal(r.stable,true,context);assert.equal(!!r.blocked,false,context+' blocked');assert.equal(!!r.shortCircuit,false,context+' short');assert.equal(!!r.oscillating,false,context+' oscillation');};
const issues={4:'NO_WIRED_CIRCUIT',5:'NO_WIRED_CIRCUIT',6:'RESISTOR_START_MODEL_NOT_AVAILABLE',7:'NO_WIRED_CIRCUIT',8:'NO_WIRED_CIRCUIT',9:'NO_WIRED_CIRCUIT',10:'NO_WIRED_CIRCUIT',11:'STARTING_CURRENT_MODEL_NOT_AVAILABLE',12:'STAR_DELTA_TIME_SELECTION_NATIVE_PENDING'};
for(let n=1;n<=12;n++)test('SC'+(143+n)+' starting/speed lesson truthfulness and catalogue topology',()=>{
 const l=lesson(n);assert.ok(l,id(n));const ref=[4,5,6,7,8,9,10,11].includes(n);
 assert.equal(l.kind,ref?'quiz':'wiring');assert.equal(l.project.wires.length===0,ref);
 for(const c of l.project.components)assert.ok(defs[c.typeId],c.typeId);
 const issue=issues[n]||null;
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue);
 assert.equal(l.pedagogyReview.titleTopologyStatus,issue?'REVIEW':'SOURCE_ALIGNED');
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(l.explanation,/fiziksel motor güvenliği/);
 if(!ref)check(Solver.solve(clone(n),defs,{now:0}),id(n));
 else assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
});
test('SC144 packet 0 -> star -> delta -> 0 changes real motor winding connection without short',()=>{
 const p=clone(1),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const states=[[0,'incomplete',false],[1,'star',true],[2,'delta',true],[0,'incomplete',false]];
 let now=0;
 for(const [position,mode,active] of states){c.sw.position=position;check(Solver.solve(p,defs,{now:now+=150}),'packet '+position);assert.equal(c.motor._motorConnection,mode);assert.equal(!!c.motor._active,active);}
 const has=(a,pa,b,pb)=>p.wires.some(w=>w.from.c===a&&w.from.p===pa&&w.to.c===b&&w.to.p===pb);
 for(const pin of ['U1','V1','W1','U2','V2','W2'])assert.ok(has('sw',pin,'motor',pin),pin);
 assert.ok(has('g1','PE','motor','PE'));
});
for(const n of [2,3])test('SC'+(143+n)+' timed star-to-delta transitions with mutual NC lock and STOP',()=>{
 const p=clone(n),c=Object.fromEntries(p.components.map(c=>[c.id,c]));
 const threshold=100+c.timer.delayValue*1000,steps=[[0,false,false,'incomplete'],[100,true,false,'star'],[150,false,false,'star'],[threshold-10,false,false,'star'],[threshold+10,false,false,'delta'],[threshold+200,false,false,'delta'],[threshold+400,false,true,'incomplete']];
 for(const [now,start,stop,mode] of steps){c.start.state=start;c.stop.state=stop;check(Solver.solve(p,defs,{now}),id(n)+' '+now);
  assert.equal(c.motor._motorConnection,mode,'mode '+now);assert.equal(!!c.coilStar._active&&!!c.coilDelta._active,false,'K2/K3 overlap '+now);
  if(mode==='star'){assert.equal(!!c.coilStar._active,true);assert.equal(!!c.coilDelta._active,false);}
  if(mode==='delta'){assert.equal(!!c.coilStar._active,false);assert.equal(!!c.coilDelta._active,true);}
  if(mode==='incomplete')assert.equal(!!c.motor._active,false);
 }
 const has=(a,pa,b,pb)=>p.wires.some(w=>w.from.c===a&&w.from.p===pa&&w.to.c===b&&w.to.p===pb);
 for(const [a,pa,b,pb] of [['timerNC','22','lockDelta','21'],['lockDelta','22','coilStar','A1'],['timerNO','14','lockStar','21'],['lockStar','22','coilDelta','A1'],['g1','PE','motor','PE']])assert.ok(has(a,pa,b,pb));
});
test('SC149 power resistors are physically correct catalog references without fake starter simulation',()=>{
 const l=lesson(6),p=l.project;
 assert.equal(l.kind,'quiz');assert.equal(p.wires.length,0);assert.equal(p.referenceOnly,true);
 assert.equal(p.components.filter(c=>c.typeId==='resistor').length,3);
 assert.ok(p.components.some(c=>c.typeId==='main-contact'));
 assert.ok(p.components.some(c=>c.typeId==='motor-3p'));
 assert.equal(l.pedagogyReview.titleTopologyIssue,'RESISTOR_START_MODEL_NOT_AVAILABLE');
});
test('SC154 has an honest current-measurement parts reference, not fake motor startup data',()=>{
 const l=lesson(11),p=l.project;
 assert.equal(l.kind,'quiz');assert.equal(p.wires.length,0);assert.ok(p.referenceOnly);
 assert.ok(p.components.some(c=>c.typeId==='meter-ammeter'));
 assert.ok(p.components.some(c=>c.typeId==='overload'));
 assert.ok(p.components.some(c=>c.typeId==='motor-3p'));
 assert.equal(l.pedagogyReview.titleTopologyIssue,'STARTING_CURRENT_MODEL_NOT_AVAILABLE');
});
test('SC155 has a real six-terminal timed star-delta path rather than unrelated reversing',()=>{
 const l=lesson(12),p=l.project;
 assert.equal(l.kind,'wiring');assert.ok(p.wires.length>20);
 assert.ok(p.components.some(c=>c.typeId==='motor-y-d'));
 assert.ok(p.components.some(c=>c.typeId==='coil-delay-on'));
 assert.ok(p.components.some(c=>c.id==='coilStar'));
 assert.ok(p.components.some(c=>c.id==='coilDelta'));
 assert.equal(l.pedagogyReview.titleTopologyIssue,'STAR_DELTA_TIME_SELECTION_NATIVE_PENDING');
});
