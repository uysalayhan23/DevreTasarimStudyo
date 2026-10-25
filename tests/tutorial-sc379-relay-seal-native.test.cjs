'use strict';
// SC379 virtual relay only; visual/hardware acceptance must remain REVIEW.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),baseline=new Map(L.lessons.map(l=>[l.id,JSON.stringify(l.project)]));
const ctx={window:{DTSTutorialLessons:L}},script=fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc379-relay-seal.js'),'utf8');
vm.runInNewContext(script,ctx,{filename:'tutorial-sc379-relay-seal.js'});
const l=L.byId['motor-direct-power-outline-019'],clone=x=>structuredClone(x),get=(p,id)=>p.components.find(c=>c.id===id);
function run(p,now,expected){const r=Native.solve(p,defs,{now});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'unstable at '+now+' '+(r.reason||''));
 assert.equal(!!get(p,'coil')._active,expected,'relay at '+now);
 assert.equal(!!get(p,'lamp')._active,expected,'lamp at '+now);
}
test('SC379 only: true relay source, 7 catalog components and 9 guided wires',()=>{
 assert.equal(l.sc379RelaySeal,'24v-relay-k1-no-hold-v1');
 assert.equal(l.kind,'wiring');assert.equal(l.project.components.length,7);
 assert.equal(l.project.wires.length,9);assert.equal(l.steps.length,9);
 assert.ok(!l.project.components.some(c=>['motor-3p','main-contact','coil-contactor'].includes(c.typeId)));
 assert.equal(l.pedagogyReview?.titleTopologyStatus,'REVIEW');
 assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
 for(const x of L.lessons)if(x.id!==l.id)
  assert.equal(JSON.stringify(x.project),baseline.get(x.id),'protected graph changed '+x.id);
 for(const w of l.project.wires)for(const e of [w.from,w.to]){
  const d=defs[get(l.project,e.c)?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===e.p),'catalog pin missing '+e.c+'/'+e.p);
 }
});
test('SC379 relay seal-in START, release, STOP, no self restart',()=>{
 const p=clone(l.project);run(p,1000,false);
 get(p,'start').state=true;run(p,1100,true);
 get(p,'start').state=false;run(p,1200,true);run(p,2000,true);
 get(p,'stop').state=true;run(p,2100,false);
 get(p,'stop').state=false;run(p,2200,false);
 get(p,'start').state=true;run(p,2300,true);
});
test('SC379 missing K1/A2 return disables both relay and H1 safely',()=>{
 const p=clone(l.project);
 p.wires=p.wires.filter(w=>!(w.from?.c==='coil'&&w.from?.p==='A2'&&w.to?.c==='g'&&w.to?.p==='M'));
 assert.equal(p.wires.length,8);
 get(p,'start').state=true;run(p,1100,false);
});
test('SC379 loading overlay twice is idempotent',()=>{
 const before=JSON.stringify(l.project);vm.runInNewContext(script,ctx);
 assert.equal(JSON.stringify(l.project),before);
});
