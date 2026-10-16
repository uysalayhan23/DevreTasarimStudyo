'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const L=QA.curriculum(),catalog=QA.catalog();
const issues=['MISSING_SINGLE_PHASE_AUX_WINDING','MISSING_SINGLE_PHASE_START_RUN','MISSING_SINGLE_PHASE_AUX_REVERSAL','MISSING_SYNCHRONOUS_MOTOR_MODEL','MISSING_AUX_STARTER_MOTOR','MISSING_INDUCTION_START_OF_SYNCHRONOUS','NO_WIRED_CIRCUIT','MISSING_PERMANENT_MAGNET_SYNCHRONOUS'];
const lesson=n=>L.byId['motor-special-src-'+String(n).padStart(2,'0')];
function solve(project,now){const r=S.solve(project,catalog,{now});assert.equal(r.stable,true,'stable at '+now);assert.equal(!!r.blocked,false);assert.equal(!!r.shortCircuit,false);assert.equal(!!r.oscillating,false);return r}
for(let n=1;n<=8;n++)test('SC'+(163+n)+' special motor mismatch stays REVIEW and canonical pins stay valid',()=>{
 const l=lesson(n);assert.ok(l,'lesson '+n);const p=l.project,ref=n===7;
 assert.equal(l.kind,ref?'quiz':'wiring');assert.equal(p.wires.length,ref?0:30);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');assert.equal(l.pedagogyReview.titleTopologyIssue,issues[n-1]);
 assert.equal(l.pedagogyReview.specialMotorAcceptance,false);assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(l.explanation,/doğrulanmamıştır/);assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 for(const c of p.components)assert.ok(catalog[c.typeId],c.typeId);
 if(ref){assert.equal(p.components.length,2);assert.ok(p.components.some(c=>c.typeId==='vfd'));assert.ok(p.components.some(c=>c.typeId==='tutorial-synchronous-motor'));assert.equal(p.referenceOnly,true);}
 else{assert.ok(p.components.some(c=>c.typeId==='motor-3p'));assert.ok(!p.components.some(c=>c.typeId==='tutorial-synchronous-motor'));assert.ok(p.components.some(c=>c.typeId==='supply-3p'));assert.ok(!p.components.some(c=>/motor-1p|capacitor-start|auxiliary-motor/.test(c.typeId)));}
 const parts=new Map(p.components.map(c=>[c.id,c]));for(const w of p.wires)for(const terminal of [w.from,w.to]){const c=parts.get(terminal.c),def=catalog[c?.typeId];assert.ok(def?.pins?.some(pin=>pin.id===terminal.p),'real catalog pin '+terminal.c+'/'+terminal.p)}
});
for(const n of [1,2,3,4,5,6,8])test('SC'+(163+n)+' actual 3-phase forward/reverse contactor response is not mislabeled as special motor',()=>{
 const p=structuredClone(lesson(n).project),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 const seq=[[0,false,false,false,false,false,0],[100,true,false,false,true,false,1],[200,false,false,false,true,false,1],[300,false,false,true,false,false,0],[400,false,true,false,false,true,-1],[500,false,false,false,false,true,-1],[600,true,true,false,false,true,-1],[700,false,false,true,false,false,0]];
 for(const [now,forward,reverse,stop,F,R,spin] of seq){c.startF.state=forward;c.startR.state=reverse;c.stop.state=stop;solve(p,now);assert.equal(!!c.coilF._active,F,'forward coil '+now);assert.equal(!!c.coilR._active,R,'reverse coil '+now);assert.equal(Math.sign(c.motor._spin),spin,'three-phase motor spin '+now);assert.equal(!!c.coilF._active&&!!c.coilR._active,false,'mutual interlock '+now);assert.equal(!!c.motor._active,spin!==0,'motor active '+now);}
 assert.equal(c.motor.typeId,'motor-3p');
});
test('SC170 VFD/synchronous reference cannot be counted as a simulated drive',()=>{
 const p=structuredClone(lesson(7).project);assert.equal(p.wires.length,0);assert.equal(p.components.some(c=>c.typeId==='motor-3p'),false);solve(p,0);assert.equal(lesson(7).pedagogyReview.specialMotorAcceptance,false);
});
