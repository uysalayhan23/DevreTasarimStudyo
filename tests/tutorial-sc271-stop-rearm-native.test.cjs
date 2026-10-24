'use strict';
// SC271: project-only virtual K0 STOP/rearm guard, not mechanical or 3D approval.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const before=new Map(L.lessons.map(l=>[l.id,JSON.stringify(l.project)]));
const w={window:{DTSTutorialLessons:L}};
for(const f of ['tutorial-sc263-sc282-stories.js','tutorial-sc263-on-delay-repair.js','tutorial-sc271-stop-rearm.js'])
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist',f),'utf8'),w,{filename:f});
const l=L.byId['motor-direct-power-src-17'],clone=x=>structuredClone(x),get=(p,id)=>p.components.find(c=>c.id===id);
function run(p,now,expected){const r=Native.solve(p,defs,{now});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'SC271 failed '+now+': '+(r.reason||''));
 assert.equal(!!get(p,'motor')._active,expected,'motor '+now);
 assert.ok(!(get(p,'coilF')._active&&get(p,'coilR')._active),'forward and reverse contactors must not coexist');}
test('SC271 only: 27 real components, 47 catalog wires, other graphs unchanged',()=>{
 assert.equal(l.sc271StopRearm,'k0-armed-auto-return-v1');
 assert.equal(l.project.components.length,27);assert.equal(l.project.wires.length,47);
 assert.equal(l.steps.length,47);assert.equal(l.materials.length,27);
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.notEqual(l.pedagogyReview.nativeDynamicAcceptance,true);
 for(const other of L.lessons)if(other.id!==l.id)
  assert.equal(JSON.stringify(other.project),before.get(other.id),'protected lesson changed: '+other.id);
 for(const w of l.project.wires)for(const ep of [w.from,w.to]){
  const c=get(l.project,ep.c),d=defs[c?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===ep.p),'missing catalog pin '+ep.c+'/'+ep.p);
 }
});
test('SC271: LS1 returns in reverse; STOP clears K0; no self-start on release',()=>{
 const p=clone(l.project);
 run(p,1000,false);
 get(p,'startF').state=true;run(p,1100,true);
 assert.equal(!!get(p,'armCoil')._active,true);
 get(p,'startF').state=false;run(p,1200,true);
 get(p,'ls1').state=true;run(p,1300,true);
 assert.equal(!!get(p,'coilR')._active,true);
 get(p,'stop').state=true;run(p,1400,false);
 assert.equal(!!get(p,'armCoil')._active,false);
 get(p,'stop').state=false;run(p,1500,false);
 run(p,1600,false);
 get(p,'ls1').state=false;run(p,1700,false);
 run(p,1800,false);
 get(p,'startF').state=true;run(p,1900,true);
});
test('SC271: STOP/rearm must also prevent automatic restart after reversed limit',()=>{
 const p=clone(l.project);
 get(p,'startR').state=true;run(p,1100,true);
 get(p,'startR').state=false;run(p,1200,true);
 get(p,'ls2').state=true;run(p,1300,true);
 assert.equal(!!get(p,'coilF')._active,true);
 get(p,'stop').state=true;run(p,1400,false);
 get(p,'stop').state=false;run(p,1500,false);
});
