'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const clone=x=>JSON.parse(JSON.stringify(x));
const wired=(p,c,pin,d,q)=>p.wires.some(w=>w.from.c===c&&w.from.p===pin&&w.to.c===d&&w.to.p===q);
for(const [suf,n,diff] of [['035',21,true],['036',21,true],['037',20,false],['038',20,false]])test('SC366–369 '+suf+' native ideal two-input DC and fail-closed pin/feedback',()=>{
const lesson=L.byId['opamp-apps-outline-'+suf],p=lesson.project;
assert.equal(p.wires.length,n);assert.equal(lesson.steps.length,n);
assert.ok(wired(p,'u1','5','g1','M')&&wired(p,'u1','7','u1','6'));
assert.equal(lesson.pedagogyReview.nativeIdealTwoInputDcTargetedPass,true);
for(const flag of ['nativeDynamicAcceptance','physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])assert.equal(lesson.pedagogyReview[flag],false);
for(const [a,b] of [[50,50],[50,20],[50,80],[20,50],[80,50]]){
const q=clone(p);q.components.find(c=>c.id==='in').potentiometer=a;q.components.find(c=>c.id==='in2').potentiometer=b;
const result=Native.solve(q,defs,{now:1000});assert.ok(result.stable&&!result.blocked&&!result.shortCircuit);
const op=q.components.find(c=>c.id==='u1'),meter=q.components.find(c=>c.id==='v1'),m=op._nativeTwoInputDC;
assert.ok(m&&meter._nativeTwoInputDC,suf+' '+a+'/'+b);assert.equal(meter._meter.warning,'');assert.ok(Math.abs(meter._meter.value-m.outputV)<.05);
if(m.outputV>1&&m.outputV<21){const v=diff?m.referenceV+m.inputBV-m.inputAV:3*m.referenceV-m.inputAV-m.inputBV;assert.ok(Math.abs(v-m.outputV)<1.05);}}
for(const kind of ['feedback','spare','resistor','probe']){
const q=clone(p);if(kind==='feedback')q.wires=q.wires.filter(w=>!wired({wires:[w]},'r2','2','u1','2'));if(kind==='spare')q.wires=q.wires.filter(w=>!wired({wires:[w]},'u1','5','g1','M'));if(kind==='resistor')q.components.find(c=>c.id==='r2').resistance=47000;if(kind==='probe')q.components.find(c=>c.id==='v1-red').probeTarget={c:'u1',p:'7'};
Native.solve(q,defs,{now:1000});assert.equal(q.components.find(c=>c.id==='u1')._nativeTwoInputDC,undefined);}
});
