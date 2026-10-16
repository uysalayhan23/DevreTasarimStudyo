'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const C=QA.curriculum(),defs=QA.catalog();
const issues=['BRAKE_OVERVIEW_YDELTA_SUBSTITUTE','MISSING_MECHANICAL_BRAKE',
 'MISSING_STAR_DC_BRAKE','MISSING_DELTA_DC_BRAKE','MISSING_DC_INJECTION_CALC',
 'MISSING_STAR_DELTA_BRAKE_TRANSFER','MISSING_AUTOMATIC_BRAKE','MISSING_TIMED_BRAKE'];
function lesson(i){return C.byId['motor-braking-src-'+String(i).padStart(2,'0')];}
function solve(p,t,start,stop){const c=Object.fromEntries(p.components.map(x=>[x.id,x]));c.start.state=start;c.stop.state=stop;
 const r=S.solve(p,defs,{now:t});assert.equal(r.stable,true,'stable at '+t);
 assert.equal(!!r.blocked,false,'not blocked at '+t);assert.equal(!!r.shortCircuit,false,'no electrical short at '+t);
 assert.equal(!!r.oscillating,false,'no oscillation at '+t);return c;}
for(let i=1;i<=8;i++)test('SC'+(155+i)+' braking mismatch explicitly REVIEW, canonical start-stop Y-Delta preserved',()=>{
 const l=lesson(i);assert.ok(l);assert.equal(l.kind,'wiring');assert.equal(l.project.wires.length,38);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');assert.equal(l.pedagogyReview.titleTopologyIssue,issues[i-1]);
 assert.equal(l.pedagogyReview.brakingAcceptance,false);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false);
 assert.match(l.explanation,/yıldız–üçgen/);assert.match(l.explanation,/frenleme (süreci|modeli|performansı).*doğrulanmamıştır/i);
 assert.ok(l.beginnerSteps.some(x=>x.includes('PASS verme')));
 const products=l.project.components.map(x=>x.typeId);
 assert.ok(products.includes('motor-y-d'));assert.ok(products.includes('coil-delay-on'));assert.ok(products.includes('supply-3p'));
 assert.ok(!products.includes('supply-dc-plus'));assert.ok(!products.includes('tutorial-mechanical-brake'));
 for(const component of l.project.components)assert.ok(defs[component.typeId],component.typeId);
});
for(let i=1;i<=8;i++)test('SC'+(155+i)+' live solver demonstrates only Y-Delta startup and STOP, no braking circuit',()=>{
 const p=structuredClone(lesson(i).project);
 let c=solve(p,0,false,false);assert.equal(c.motor._motorConnection,'incomplete');assert.equal(!!c.motor._active,false);
 c=solve(p,100,true,false);assert.equal(c.motor._motorConnection,'star');assert.equal(!!c.motor._active,true);
 c=solve(p,200,false,false);assert.equal(c.motor._motorConnection,'star');assert.equal(!!c.motor._active,true);
 c=solve(p,4100,false,false);assert.equal(c.motor._motorConnection,'delta');assert.equal(!!c.motor._active,true);
 assert.equal(!!c.coilStar._active&&!!c.coilDelta._active,false,'mutual contactor exclusion');
 c=solve(p,4400,false,true);assert.equal(c.motor._motorConnection,'incomplete');assert.equal(!!c.motor._active,false);
 assert.equal(!!c.coilStar._active,false);assert.equal(!!c.coilDelta._active,false);
 c=solve(p,4700,false,false);assert.equal(!!c.motor._active,false);
});
