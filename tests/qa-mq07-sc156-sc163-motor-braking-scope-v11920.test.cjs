'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const C=QA.curriculum(),defs=QA.catalog();
const issues=Array.from({length:8},(_,i)=>
 'BRAKE_REFERENCE_NATIVE_PENDING_'+String(i+1).padStart(2,'0'));
const lesson=n=>C.byId['motor-braking-src-'+String(n).padStart(2,'0')];
for(let i=1;i<=8;i++)test('SC'+(155+i)+' true brake catalog and source acceptance limits',()=>{
 const l=lesson(i);assert.ok(l);
 const p=l.project;
 assert.equal(l.kind,'quiz');
 assert.equal(p.wires.length,0);
 assert.equal(l.pedagogyReview.titleTopologyIssue,issues[i-1]);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 for(const k of ['brakingAcceptance','physicalAcceptance',
  'windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(l.pedagogyReview[k],false);
 assert.match(l.explanation,/frenleme süreci|frenleme işlemi|Frenleme süreci/);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 const types=p.components.map(c=>c.typeId);
 assert.equal(p.referenceOnly,true);
 assert.equal(l.steps.length,0);
 if([1,2,7,8].includes(i))assert.ok(types.includes('tutorial-mechanical-brake'));
 if([3,4,5,6].includes(i))assert.ok(types.includes('supply-dc-plus'));
 if(i===5)assert.ok(types.includes('resistor')&&types.includes('meter-ammeter'));
 if([6,7,8].includes(i))assert.ok(types.includes('coil-delay-on')||
  types.includes('coil-contactor'));
 assert.equal(l.pedagogyReview.brakingAcceptance,false);
 for(const component of p.components)assert.ok(defs[component.typeId],component.typeId);
});
for(const n of [3,4,6,7,8])test('SC'+(155+n)+' brake reference must never pretend to simulate braking',()=>{
 const l=lesson(n),p=l.project;
 assert.equal(l.kind,'quiz');
 assert.equal(p.wires.length,0);
 assert.equal(p.referenceOnly,true);
 assert.equal(l.pedagogyReview.brakingAcceptance,false);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.ok(l.quiz&&l.quiz.options?.length===3);
 assert.match(l.quiz.why,/fren|sargı|motor|kalkış|zaman/i);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
});
