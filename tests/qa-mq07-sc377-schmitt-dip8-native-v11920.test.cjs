'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=x=>JSON.parse(JSON.stringify(x));
test('SC377 native DIP8 Schmitt maintains two DC thresholds and past state',()=>{
 const l=L.byId['opamp-apps-outline-044'],p=l.project;
 assert.equal(l.pedagogyReview.realDip8IdealDcSchmittTargetedPass,true);
 for(const k of ['physicalAcceptance','nativeDynamicAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])assert.equal(l.pedagogyReview[k],false);
 const q=clone(p),u=q.components.find(c=>c.id==='u1'),pot=q.components.find(c=>c.id==='in');
 let rise=null,fall=null,last=false;
 for(let i=0;i<202;i++){
  const setting=i<=100?100-i:i-101;pot.potentiometer=setting;
  const res=Native.solve(q,defs,{now:i*10});assert.ok(res.stable&&!res.blocked&&!res.shortCircuit);
  const mark=u._nativeDip8Schmitt;assert.ok(mark,'missing scoped Schmitt '+i);
  const meter=q.components.find(c=>c.id==='v1');assert.ok(meter._nativeDip8Schmitt);
  assert.ok(Math.abs(meter._meter.value-mark.outputV)<.1);
  if(i>0&&mark.high&&!last&&!rise)rise=setting;
  if(i>100&&!mark.high&&last&&!fall)fall=setting;
  last=mark.high;
 }
 assert.ok(rise!==null&&fall!==null&&fall-rise>=10);
 for(const start of [0,100]){const testGraph=clone(p),pt=testGraph.components.find(c=>c.id==='in');pt.potentiometer=start;Native.solve(testGraph,defs,{now:0});pt.potentiometer=50;Native.solve(testGraph,defs,{now:10});assert.equal(testGraph.components.find(c=>c.id==='u1')._nativeDip8Schmitt.high,start===0);}
 for(const fault of ['feedback','pin3','spare','resistor','probe','meter','source']){const bad=clone(p),get=id=>bad.components.find(c=>c.id===id);
 if(fault==='feedback')bad.wires=bad.wires.filter(w=>!(w.from.c==='u1'&&w.from.p==='1'));
 if(fault==='pin3')bad.wires=bad.wires.filter(w=>!(w.from.c==='r1'&&w.from.p==='2'));
 if(fault==='spare')bad.wires=bad.wires.filter(w=>!(w.from.c==='u1'&&w.from.p==='5'));
 if(fault==='resistor')get('r2').resistance=10000;
 if(fault==='probe')get('v1-red').probeTarget={c:'u1',p:'7'};
 if(fault==='meter')get('v1').meterPosition=5;
 if(fault==='source')get('g1').dcVoltage=12;
 Native.solve(bad,defs,{now:0});assert.equal(get('u1')._nativeDip8Schmitt,undefined);
 }
});
