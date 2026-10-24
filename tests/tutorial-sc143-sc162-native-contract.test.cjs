'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const curriculum=QA.curriculum(),defs=QA.catalog();
const theory=new Set([15,17,18,19]);
for(let i=1;i<=20;i++)test('SC'+(142+i)+' sensor '+(theory.has(i)?'concept status':'canonical wiring and native initial')+' contract',()=>{
 const id='sensor-analog-apps-src-'+String(i).padStart(2,'0'),l=curriculum.byId[id];
 assert.ok(l,'missing '+id);
 assert.equal(l.pedagogyReview?.physicalAcceptance===true,false,'no real 3D visual acceptance');
 if(theory.has(i)){
  assert.equal(l.kind,'quiz');assert.equal(!!l.project.referenceOnly,true);
  assert.equal(l.pedagogyReview?.titleTopologyIssue,'NO_WIRED_CIRCUIT');
  return;
 }
 assert.equal(l.kind,'wiring');assert.ok(l.project.wires.length>0);
 const parts=new Map(l.project.components.map(c=>[c.id,c]));
 for(const w of l.project.wires)for(const end of [w.from,w.to]){
  const c=parts.get(end.c),d=defs[c?.typeId];assert.ok(d,'missing definition '+end.c);
  assert.ok(d.pins.some(p=>p.id===end.p),'unknown terminal '+end.c+'/'+end.p);
 }
 const p=structuredClone(l.project),r=Native.solve(p,defs,{now:200});
 assert.equal(r.blocked,false,'blocked '+id);assert.equal(r.shortCircuit,false,'short '+id);
 assert.equal(r.stable,true,'unstable '+id);
});
