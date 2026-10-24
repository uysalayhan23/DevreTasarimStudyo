'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),clone=structuredClone;
const list=['sensor-analog-apps-src-21','sensor-analog-apps-src-22',...Array.from({length:17},(_,i)=>'opamp-apps-src-'+String(i+1).padStart(2,'0')),'oscillator-filter-apps-src-01'];
for(let i=0;i<list.length;i++)test('SC'+(163+i)+' canonical terminals, native and negative',()=>{
 const id=list[i],l=L.byId[id];assert.ok(l,id);
 if(i===0||i===19){assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);assert.equal(l.project.wires.length,0);assert.equal(l.steps.length,0);assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);return;}
 assert.equal(l.kind,'wiring');assert.ok(l.project.wires.length>0);assert.equal(l.steps.length,l.project.wires.length);
 const parts=new Map(l.project.components.map(c=>[c.id,c]));
 for(const w of l.project.wires){for(const end of [w.from,w.to]){const c=parts.get(end.c),d=defs[c?.typeId];assert.ok(d,'missing catalog '+end.c);assert.ok(d.pins.some(p=>p.id===end.p),id+' unknown '+end.c+'/'+end.p);}}
 const on=clone(l.project),r=Sim.solve(on,defs,{now:200});assert.equal(r.blocked,false);assert.equal(r.shortCircuit,false);assert.equal(r.stable,true);
 if(id==='sensor-analog-apps-src-22'){
  const sensed=clone(l.project),sensor=sensed.components.find(c=>c.id==='s1');sensor.state=true;sensor.sensing.distance=sensor.sensing.range/2;
  const onResult=Sim.solve(sensed,defs,{now:200});assert.ok(onResult.stable&&!onResult.blocked&&!onResult.shortCircuit);
  assert.equal(!!sensed.components.find(c=>c.id==='h1')._active,true);
  sensed.wires=sensed.wires.filter(w=>!(w.from.c==='s1'&&w.from.p==='BK'));
  const broken=Sim.solve(sensed,defs,{now:400});assert.ok(broken.stable&&!broken.shortCircuit);assert.equal(!!sensed.components.find(c=>c.id==='h1')._active,false);
 }else{
  const u=on.components.find(c=>c.typeId==='lm358p-dip8');assert.ok(u,id);
  assert.equal(u._opampPowered,true,id+' normal power');
  const cut=clone(l.project);cut.wires=cut.wires.filter(w=>!((w.from.c===u.id&&w.from.p==='8')||(w.to.c===u.id&&w.to.p==='8')));
  assert.ok(cut.wires.length<l.project.wires.length,'negative must remove physical V+ wire');
  if(id==='opamp-apps-src-15'){
   assert.throws(()=>Sim.solve(cut,defs,{now:200}),/Scoped LM358\/1N4148 rectifier topology changed/);
  }else{
   const out=Sim.solve(cut,defs,{now:200});assert.ok(out.stable&&!out.shortCircuit&&!out.blocked);
   assert.notEqual(!!cut.components.find(c=>c.id===u.id)._opampPowered,true,id+' unpowered must not simulate native PASS');
  }
 }
 assert.notEqual(l.pedagogyReview?.physicalAcceptance,true,'no real 3D acceptance');
});
