'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const lesson=id=>{const l=L.lessons.find(x=>x.id===id);assert.ok(l,id);return l};
test('dual-dc-2 requires sink-type NPN output; canonical PNP sensor remains REVIEW',()=>{
 const original=lesson('dual-dc-2'),before=JSON.stringify(original.project),out={};
 for(const mode of ['PNP','NPN']){
  const p=structuredClone(original.project),s=p.components.find(c=>c.id==='s'),lamp=p.components.find(c=>c.id==='h');
  if(mode==='NPN')s.sensorOutput='NPN';
  s.sensing={target:'metal',distance:20,range:8,offset:0};out[mode]=[];
  for(const [now,distance] of [[0,20],[400,3],[850,20]]){
   s.sensing.distance=distance;
   const r=Simulation.solve(p,defs,{now});
   assert.ok(r.stable&&!r.shortCircuit&&!r.blocked&&!r.oscillating,mode);
   out[mode].push(!!lamp._active);
  }
 }
 assert.deepEqual(out.PNP,[false,false,false]);
 assert.deepEqual(out.NPN,[false,true,false]);
 assert.equal(JSON.stringify(original.project),before,'canonical lesson unchanged');
});
test('seven real reactive lessons remain stable, four capacitors retain charge without discharge path',()=>{
 const capacitors=['electronic-component-basics-outline-012','electronic-component-basics-outline-106','electronic-component-basics-outline-126','electronic-component-basics-outline-130'];
 const inductors=['workshop-safety-mechanics-outline-049','workshop-safety-mechanics-outline-127','workshop-safety-mechanics-outline-130'];
 for(const id of [...capacitors,...inductors]){
  const l=lesson(id),original=JSON.stringify(l.project),p=structuredClone(l.project),sw=p.components.find(c=>c.typeId==='push-no'),meter=p.components.find(c=>defs[c.typeId]?.kind==='multimeter');
  assert.ok(sw&&meter,id);
  for(let t=0;t<=10000;t+=100){
   sw.state=t>0&&t<=400;
   const r=Simulation.solve(p,defs,{now:t});
   assert.ok(r.stable&&!r.shortCircuit&&!r.oscillating&&!r.blocked,id+' '+t);
  }
  const value=Number(meter._meter?.value);
  if(capacitors.includes(id))assert.ok(value>7,id+' retained capacitor voltage '+value);
  else assert.ok(Math.abs(value)<.1,id+' inductor settled '+value);
  assert.equal(JSON.stringify(l.project),original,id+' original unchanged');
 }
});
