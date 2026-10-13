'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const lesson=id=>{const l=L.lessons.find(v=>v.id===id);assert.ok(l,id);return l};
const observe=id=>{
 const l=lesson(id),original=JSON.stringify(l.project),p=structuredClone(l.project);
 const sensor=p.components.find(c=>c.id==='s'),lamp=p.components.find(c=>c.id==='h');
 sensor.sensing={target:'metal',range:8,distance:20,offset:0};
 const phases=[];
 for(const [now,dist] of [[0,20],[400,3],[850,20]]){
  sensor.sensing.distance=dist;const r=Solver.solve(p,defs,{now});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,id+' '+now);
  phases.push(!!lamp._active);
 }
 assert.equal(JSON.stringify(l.project),original,'canonical graph mutated');
 return phases;
};
test('dual-dc-2 uses native NPN sink compatible with preserved shared-ground wires',()=>{
 const p=lesson('dual-dc-2').project,device=p.components.find(c=>c.id==='s');
 assert.equal(device.typeId,'autonics-pr12-npn');
 assert.equal(defs[device.typeId].outputType,'NPN');
 assert.ok(p.wires.some(w=>w.from.c==='g1'&&w.from.p==='M'&&w.to.c==='g2'&&w.to.p==='M'));
 assert.ok(p.wires.some(w=>w.from.c==='h'&&w.from.p==='X2'&&w.to.c==='s'&&w.to.p==='BK'));
 assert.deepEqual(observe('dual-dc-2'),[false,true,false]);
});
test('open-collector-1 title now matches canonical PNP circuit, variant 2 remains NPN',()=>{
 const pnp=lesson('open-collector-1'),npn=lesson('open-collector-2');
 assert.match(pnp.title,/PNP/);assert.doesNotMatch(pnp.title,/NPN/);
 assert.equal(pnp.project.components.find(c=>c.id==='s').typeId,'proximity');
 assert.equal(npn.project.components.find(c=>c.id==='s').typeId,'autonics-pr12-npn');
 assert.ok(pnp.project.wires.some(w=>w.from.c==='s'&&w.from.p==='BK'&&w.to.c==='h'&&w.to.p==='X1'));
 assert.ok(npn.project.wires.some(w=>w.from.c==='h'&&w.from.p==='X2'&&w.to.c==='s'&&w.to.p==='BK'));
 assert.deepEqual(observe(pnp.id),[false,true,false]);assert.deepEqual(observe(npn.id),[false,true,false]);
});
test('physical sensing targets remain unconfigured pending separate canonical review',()=>{
 for(const id of ['dual-dc-2','open-collector-1','open-collector-2']){
  const sensor=lesson(id).project.components.find(c=>c.id==='s');
  assert.ok(!sensor.sensing?.target||sensor.sensing.target==='none',id);
 }
 assert.equal(L.lessons.length,1655);
 assert.equal(L.lessons.filter(l=>l.project?.wires?.length).length,722);
 assert.equal(Object.keys(defs).length,939);
});
