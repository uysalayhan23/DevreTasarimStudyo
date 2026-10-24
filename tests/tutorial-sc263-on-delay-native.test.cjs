'use strict';
// Targeted SC263 virtual time and broken-phase tests; no 3D/hardware acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),baseline=new Map(L.lessons.map(l=>[l.id,JSON.stringify(l.project)]));
const ctx={window:{DTSTutorialLessons:L}};
for(const f of ['tutorial-sc263-sc282-stories.js','tutorial-sc263-on-delay-repair.js'])
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist',f),'utf8'),ctx,{filename:f});
const lesson=L.byId['motor-direct-power-src-09'],clone=x=>structuredClone(x);
const component=(p,id)=>p.components.find(c=>c.id===id);
function solve(p,now,expected){const r=Native.solve(p,defs,{now});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'invalid virtual solution at '+now+' '+(r.reason||''));
 assert.equal(!!component(p,'motor')._active,expected,'motor at '+now);}
test('SC263 only changed: timed K0/KT1/K1 circuit, 19 real catalog wires',()=>{
 assert.equal(lesson.sc263OnDelayMotor,'on-delay-3s-k0-kt1-k1-v1');
 assert.equal(lesson.project.components.length,11);assert.equal(lesson.project.wires.length,19);
 assert.equal(lesson.steps.length,19);assert.equal(lesson.materials.length,11);
 assert.ok(!lesson.project.components.some(c=>['coilStar','coilDelta'].includes(c.id)));
 assert.equal(component(lesson.project,'kt').typeId,'coil-delay-on');
 assert.equal(component(lesson.project,'kt').delayValue,3);
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.notEqual(lesson.pedagogyReview.nativeDynamicAcceptance,true);
 for(const l of L.lessons)if(l.id!=='motor-direct-power-src-09')
  assert.equal(JSON.stringify(l.project),baseline.get(l.id),'other circuit changed: '+l.id);
 for(const w of lesson.project.wires)for(const e of [w.from,w.to]){
  const c=component(lesson.project,e.c),d=defs[c?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===e.p),'unknown catalog terminal '+e.c+'/'+e.p);
 }
});
test('SC263 native: START, seal, 3-second timer and stable stop',()=>{
 const p=clone(lesson.project);solve(p,1000,false);
 component(p,'start').state=true;solve(p,1100,true);
 component(p,'start').state=false;solve(p,1200,true);
 solve(p,4099,true);solve(p,4101,false);solve(p,4400,false);
 assert.equal(!!component(p,'kt')._timing?.output,true);
});
test('SC263 native: manual STOP resets, no restart until START',()=>{
 const p=clone(lesson.project);component(p,'start').state=true;solve(p,1100,true);
 component(p,'start').state=false;solve(p,1200,true);
 component(p,'stop').state=true;solve(p,1300,false);
 component(p,'stop').state=false;solve(p,1400,false);
 component(p,'start').state=true;solve(p,1500,true);
});
test('SC263 native: interrupted motor phase blocks running without fault',()=>{
 const p=clone(lesson.project);
 p.wires=p.wires.filter(w=>!(w.to.c==='motor'&&w.to.p==='U'));
 component(p,'start').state=true;solve(p,1100,false);
});
