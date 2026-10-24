'use strict';
// SC380 virtual selector position and real electrical NC contacts;
// not mechanical protection, Windows 3D, or hardware approval.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const snapshots=new Map(L.lessons.map(x=>[x.id,JSON.stringify(x.project)]));
const root={window:{DTSTutorialLessons:L}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc380-selector-interlock.js'),'utf8'),root);
const lesson=L.byId['motor-direct-power-outline-020'],clone=v=>structuredClone(v);
const c=(p,id)=>p.components.find(x=>x.id===id);
function solve(p,now,forward,reverse) {
 const r=Native.solve(p,defs,{now});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'SC380 native rejected '+now+': '+r.reason);
 assert.equal(!!c(p,'coil1')._active,forward,'K1 at '+now);
 assert.equal(!!c(p,'coil2')._active,reverse,'K2 at '+now);
 assert.ok(!(c(p,'coil1')._active&&c(p,'coil2')._active),'simultaneous K1 K2');
 assert.equal(!!c(p,'motor')._active,forward||reverse,'motor at '+now);
}
test('SC380: only one lesson changed, 9 real components, 20 catalog wires, REVIEW stays',()=>{
 assert.equal(lesson.sc380ElectricalInterlock,'selector-3-pos2-pin14-two-nc-v1');
 assert.equal(lesson.project.components.length,9);assert.equal(lesson.project.wires.length,20);
 assert.equal(lesson.steps.length,20);assert.equal(lesson.materials.length,9);
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'MECHANICAL_INTERLOCK_STILL_PENDING');
 assert.notEqual(lesson.pedagogyReview.physicalAcceptance,true);
 assert.notEqual(lesson.pedagogyReview.nativeDynamicAcceptance,true);
 for(const x of L.lessons)if(x.id!==lesson.id)
  assert.equal(JSON.stringify(x.project),snapshots.get(x.id),'other lesson changed '+x.id);
 for(const w of lesson.project.wires)for(const e of [w.from,w.to]){
  const d=defs[c(lesson.project,e.c)?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===e.p),'missing pin '+e.c+'/'+e.p);
 }
 assert.ok(lesson.project.wires.some(w=>w.from.c==='selector'&&w.from.p==='14'&&w.to.c==='lockF'));
 assert.ok(!lesson.project.wires.some(w=>w.from.c==='selector'&&w.from.p==='15'));
});
test('SC380: selector 0 OFF, 1 forward, 2 reverse, unused 3 OFF, return to OFF',()=>{
 const p=clone(lesson.project);
 for(const [now,pos,f,r] of [[1000,0,false,false],[1100,1,true,false],
 [1200,1,true,false],[1300,0,false,false],[1400,2,false,true],
 [1500,2,false,true],[1600,0,false,false],[1700,3,false,false],
 [1800,2,false,true],[1900,1,true,false],[2000,0,false,false]]){
  c(p,'selector').position=pos;solve(p,now,f,r);
 }
});
test('SC380: loss of motor phase or reverse coil wire blocks the output',()=>{
 for(const [target,pin,position] of [['motor','U',1],['coil2','A1',2]]){
  const p=clone(lesson.project),count=p.wires.length;
  p.wires=p.wires.filter(w=>!(w.to.c===target&&w.to.p===pin));
  assert.ok(p.wires.length<count,'target wire not present');
  c(p,'selector').position=position;
  const r=Native.solve(p,defs,{now:1100});
  assert.ok(r.stable&&!r.shortCircuit&&!r.blocked);
  assert.equal(!!c(p,'motor')._active,false);
 }
});
