'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
for(const s of ['039','040','041','042'])test('SC370-373 '+s+' real LM358P RC step and fail-closed pins',()=>{
 const p=L.byId['opamp-apps-outline-'+s].project,diff=s==='039'||s==='040';
 assert.equal(p.wires.length,16);assert.equal(L.byId['opamp-apps-outline-'+s].pedagogyReview.nativeIdealRcStepTargetedPass,true);
 assert.equal(L.byId['opamp-apps-outline-'+s].pedagogyReview.nativeDynamicAcceptance,false);
 const connected=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 assert.ok(connected('u1','5','g1','M')&&connected('u1','7','u1','6'));
 const q=clone(p),pot=q.components.find(c=>c.id==='in'),out=[],meter=q.components.find(c=>c.id==='v1'),amp=q.components.find(c=>c.id==='u1');
 for(let t=0;t<=100;t++){pot.potentiometer=t<10?50:diff?55:49;
 const solved=Native.solve(q,defs,{now:t});assert.ok(solved.stable&&!solved.blocked&&!solved.shortCircuit);
 const info=amp._nativeRcStep;assert.ok(info,s+'/'+t);assert.equal(meter._meter.warning,'');assert.ok(Math.abs(meter._meter.value-info.outputV)<.05);out.push(info.outputV);}
 if(diff){assert.ok(out[10]>out[9]+2);assert.ok(out[20]<out[10]-2);assert.ok(Math.abs(out[30]-12)<.2);}else{assert.ok(out[30]<out[20]-.08);assert.ok(out[80]<out[50]-.3);}
 for(const fault of ['feedback','idle','cap','probe','r']){
 const z=clone(p);if(fault==='feedback')z.wires=z.wires.filter(w=>!(w.from.c==='u1'&&w.from.p==='1'));
 if(fault==='idle')z.wires=z.wires.filter(w=>!(w.from.c==='u1'&&w.from.p==='5'));
 if(fault==='cap')z.components.find(c=>c.id==='c1').capacitance=.0001;
 if(fault==='probe')z.components.find(c=>c.id==='v1-red').probeTarget={c:'u1',p:'7'};
 if(fault==='r')z.components.find(c=>c.id=== (diff?'r2':'r1')).resistance=22000;
 Native.solve(z,defs,{now:0});assert.equal(z.components.find(c=>c.id==='u1')._nativeRcStep,undefined);}
});
