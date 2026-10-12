'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const targeted=L.lessons.filter(l=>l.project.wires.length&&l.project.components.some(c=>['bjt-npn','bjt-pnp'].includes(defs[c.typeId]?.kind))&&l.project.components.some(c=>c.typeId==='push-no')&&l.project.components.some(c=>defs[c.typeId]?.kind==='multimeter'));
test('real 30 BJT circuits switch through base resistor: OFF-ON-OFF, meter returns, canonical immutable',()=>{
  assert.equal(targeted.length,30);
  for(const entry of targeted){
    const lesson=entry;assert.ok(lesson);
    const original=JSON.stringify(lesson.project),p=structuredClone(lesson.project);
    const transistor=p.components.find(c=>['bjt-npn','bjt-pnp'].includes(defs[c.typeId]?.kind));
    const sw=p.components.find(c=>c.typeId==='push-no');
    const meter=p.components.find(c=>defs[c.typeId]?.kind==='multimeter');
    assert.ok(transistor&&sw&&meter,entry.id);
    const v=[],on=[];
    for(let phase=0;phase<3;phase++){
      sw.state=phase===1;
      const s=Simulation.solve(p,defs,{now:[0,400,850][phase]});
      assert.ok(s.stable&&!s.blocked&&!s.shortCircuit&&!s.oscillating,entry.id+' stable phase '+phase);
      on.push(!!transistor._bjtOn);v.push(meter._meter?.value);
    }
    assert.deepEqual(on,[false,true,false],entry.id+' bias response');
    assert.ok(Math.abs(v[0]-v[1])>1,entry.id+' meter response');
    assert.ok(Math.abs(v[0]-v[2])<1e-6,entry.id+' meter restoration');
    assert.equal(JSON.stringify(lesson.project),original,entry.id+' canonical lesson unchanged');
  }
});
test('BJT without a connected base feed remains off, even with a nearby 24V source',()=>{
 const lesson=targeted[0],p=structuredClone(lesson.project);
 p.wires=p.wires.filter(w=>![w.from,w.to].some(r=>r.c==='q1'&&r.p==='B'));
 p.components.find(c=>c.id==='s1').state=true;
 const s=Simulation.solve(p,defs,{now:400});
 assert.ok(s.stable&&!s.shortCircuit&&!s.oscillating);
 assert.equal(!!p.components.find(c=>c.id==='q1')._bjtOn,false);
});
test('global real 722 wired lesson three-phase solver stability remains intact',()=>{
 let phases=0;
 for(const lesson of L.lessons.filter(x=>x.project?.wires?.length)){
  const p=structuredClone(lesson.project),sw=p.components.find(c=>['push-no','push-nc'].includes(c.typeId));
  for(let i=0;i<3;i++){
   if(sw)sw.state=i===1;
   const s=Simulation.solve(p,defs,{now:[0,400,850][i]});
   assert.ok(s.stable&&!s.shortCircuit&&!s.blocked&&!s.oscillating,lesson.id+' phase '+i);
   phases++;
  }
 }
 assert.equal(phases,2166);
});
