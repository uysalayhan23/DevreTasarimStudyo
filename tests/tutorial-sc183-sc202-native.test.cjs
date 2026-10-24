'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Sim=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),noWires=new Set([2,3,4,5,11,12]);
const lesson=i=>L.byId['oscillator-filter-apps-src-'+String(i).padStart(2,'0')];
for(let i=2;i<=21;i++)test('SC'+(181+i)+' oscillator '+(noWires.has(i)?'reference-only':'real native/terminal')+' contract',()=>{
 const l=lesson(i);assert.ok(l,'missing '+i);const p=structuredClone(l.project);
 if(noWires.has(i)){
  assert.equal(l.kind,'quiz');assert.equal(p.referenceOnly,true);assert.equal(p.wires.length,0);assert.equal(l.steps.length,0);
  assert.equal(l.pedagogyReview?.physicalAcceptance,false);return;
 }
 assert.equal(l.kind,'wiring');assert.ok(p.wires.length>0);assert.equal(l.steps.length,p.wires.length);
 const parts=new Map(p.components.map(c=>[c.id,c]));
 for(const wire of p.wires)for(const e of [wire.from,wire.to]){
  const c=parts.get(e.c),d=defs[c?.typeId];assert.ok(d,'missing product '+e.c);
  const pin=d.pins.find(z=>z.id===e.p);assert.ok(pin,'invalid catalog terminal '+e.c+'/'+e.p);
  assert.ok(Number.isFinite(pin.x)&&Number.isFinite(pin.y));
  assert.ok(pin.x>=0&&pin.x<=d.w&&pin.y>=0&&pin.y<=d.h,'physical cable hotspot out of material footprint '+c.typeId+'/'+e.p);
 }
 const r=Sim.solve(p,defs,{now:200});assert.equal(r.blocked,false);assert.equal(r.shortCircuit,false);assert.equal(r.stable,true);
 assert.notEqual(l.pedagogyReview?.physicalAcceptance,true,'no browser/3D acceptance');
 // A cut on the real source line must never create a short or spuriously accepted circuit.
 const cut=structuredClone(l.project);
 const first=cut.wires.find(w=>['P','OUT'].includes(w.from.p))||cut.wires[0];
 cut.wires=cut.wires.filter(w=>w.id!==first.id);
 assert.equal(cut.wires.length,p.wires.length-1);
 let negative;try{negative=Sim.solve(cut,defs,{now:200});}catch(e){assert.match(e.message,/topology|connection|source/i);return;}
 assert.equal(negative.shortCircuit,false,'open source cable cannot be an electrical short');
 if(i===6){
  assert.equal(p.components.find(c=>c.id==='q2')._active,true);
  assert.equal(!!cut.components.find(c=>c.id==='q2')._active,false,'open Q1 collector supply must release Q2 stable state');
 }
 if([7,8,9,14,15].includes(i)){
  const before=p.components.filter(c=>c._active===true).length,after=cut.components.filter(c=>c._active===true).length;
  assert.ok(after<before,'open supply must reduce active path '+i);
 }
 if([13,18,19].includes(i)){
  const a=p.components.find(c=>c.id==='u1'),b=cut.components.find(c=>c.id==='u1');
  assert.equal(a._opampPowered,true);assert.notEqual(b._opampPowered,true,'LM358 pin 8 cut must remove native power');
 }
 if([20,21].includes(i))assert.equal(p.components.some(c=>/opamp|mosfet|bjt|transistor/i.test(c.typeId)),false,'passive network cannot advertise op-amp gain');
});
test('SC189 two-BD139 astable native timeline switches alternately, without claiming a physical frequency measurement',()=>{
 const p=structuredClone(lesson(8).project),states=[];
 for(const now of [0,800,1400]){const result=Sim.solve(p,defs,{now});assert.ok(result.stable&&!result.shortCircuit);states.push(!!p.components.find(c=>c.id==='q1')._active);}
 assert.deepEqual(states,[true,false,true]);
 assert.notEqual(lesson(8).pedagogyReview.nativeDynamicAcceptance,true);
});
