'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const C=QA.curriculum(),defs=QA.catalog();
const issues=[
 'BRAKE_REFERENCE_NATIVE_PENDING_01','BRAKE_REFERENCE_NATIVE_PENDING_02',
 'MISSING_STAR_DC_BRAKE','MISSING_DELTA_DC_BRAKE',
 'BRAKE_REFERENCE_NATIVE_PENDING_05','MISSING_STAR_DELTA_BRAKE_TRANSFER',
 'MISSING_AUTOMATIC_BRAKE','MISSING_TIMED_BRAKE'
];
const lesson=n=>C.byId['motor-braking-src-'+String(n).padStart(2,'0')];
function solve(p,t,start,stop){const c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 c.start.state=start;c.stop.state=stop;
 const result=S.solve(p,defs,{now:t});
 assert.equal(result.stable,true,'stable '+t);
 assert.equal(!!result.blocked,false);
 assert.equal(!!result.shortCircuit,false);
 assert.equal(!!result.oscillating,false);
 return c;
}
for(let i=1;i<=8;i++)test('SC'+(155+i)+' true brake catalog and source acceptance limits',()=>{
 const l=lesson(i);assert.ok(l);
 const reference=[1,2,5].includes(i),p=l.project;
 assert.equal(l.kind,reference?'quiz':'wiring');
 assert.equal(p.wires.length,reference?0:38);
 assert.equal(l.pedagogyReview.titleTopologyIssue,issues[i-1]);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 for(const k of ['brakingAcceptance','physicalAcceptance',
  'windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(l.pedagogyReview[k],false);
 assert.match(l.explanation,/frenleme süreci|frenleme işlemi|Frenleme süreci/);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 const types=p.components.map(c=>c.typeId);
 if(reference){
  assert.equal(p.referenceOnly,true);
  if(i===1||i===2)assert.ok(types.includes('tutorial-mechanical-brake'));
  if(i===5)assert.ok(types.includes('supply-dc-plus')&&types.includes('resistor')&&types.includes('meter-ammeter'));
 }else{
  assert.ok(types.includes('motor-y-d'));
  assert.ok(types.includes('coil-delay-on'));
  assert.ok(types.includes('supply-3p'));
  assert.ok(!types.includes('tutorial-mechanical-brake'));
 }
 for(const component of p.components)assert.ok(defs[component.typeId],component.typeId);
});
for(const n of [3,4,6,7,8])test('SC'+(155+n)+' original Y-Delta demo is not a braking result',()=>{
 const p=structuredClone(lesson(n).project);
 let c=solve(p,0,false,false);assert.equal(c.motor._motorConnection,'incomplete');
 c=solve(p,100,true,false);assert.equal(c.motor._motorConnection,'star');
 assert.equal(!!c.motor._active,true);
 c=solve(p,200,false,false);assert.equal(c.motor._motorConnection,'star');
 c=solve(p,4100,false,false);assert.equal(c.motor._motorConnection,'delta');
 assert.equal(!!c.coilStar._active&&!!c.coilDelta._active,false);
 c=solve(p,4400,false,true);assert.equal(c.motor._motorConnection,'incomplete');
 assert.equal(!!c.motor._active,false);
});
