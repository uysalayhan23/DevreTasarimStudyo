'use strict';
// SC305 real scoped limit-switch graph, K0 STOP interlock, no mechanical acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const before=new Map(L.lessons.map(l=>[l.id,JSON.stringify(l.project)]));
const root={window:{DTSTutorialLessons:L}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc305-stop-rearm.js'),'utf8'),root);
const lesson=L.byId['motor-sequence-src-05'],clone=v=>structuredClone(v);
const get=(p,id)=>p.components.find(c=>c.id===id);
function check(p,now,expected){
 const r=Native.solve(p,defs,{now});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'SC305 unstable '+now+' '+(r.reason||''));
 assert.equal(!!get(p,'motor')._active,expected,'SC305 motor at '+now);
 assert.ok(!(get(p,'coilF')._active&&get(p,'coilR')._active),'simultaneous forward/reverse K1/K2');
}
test('SC305 is the only changed graph, 27 parts and 47 real catalog wires',()=>{
 const p=lesson.project;
 assert.equal(p.components.length,27);assert.equal(p.wires.length,47);
 assert.equal(lesson.steps.length,47);assert.equal(lesson.materials.length,27);
 assert.equal(lesson.sc305StopRearm,'k0-armed-auto-return-v1');
 assert.notEqual(lesson.pedagogyReview.physicalAcceptance,true);
 assert.notEqual(lesson.pedagogyReview.nativeDynamicAcceptance,true);
 for(const l of L.lessons)if(l.id!==lesson.id)
  assert.equal(JSON.stringify(l.project),before.get(l.id),'protected graph changed: '+l.id);
 for(const w of p.wires)for(const end of [w.from,w.to]){
  const c=get(p,end.c),d=defs[c?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===end.p),'missing pin '+end.c+'/'+end.p);
 }
});
test('SC305: LS1 causes reverse, STOP cannot rearm without new manual START',()=>{
 const p=clone(lesson.project);
 check(p,1000,false);
 get(p,'startF').state=true;check(p,1100,true);
 get(p,'startF').state=false;check(p,1200,true);
 get(p,'ls1').state=true;check(p,1300,true);
 assert.equal(!!get(p,'coilR')._active,true);
 get(p,'stop').state=true;check(p,1400,false);
 assert.equal(!!get(p,'armCoil')._active,false);
 get(p,'stop').state=false;check(p,1500,false);
 check(p,1600,false);
 get(p,'ls1').state=false;check(p,1700,false);
 get(p,'startF').state=true;check(p,1800,true);
});
test('SC305: reverse START, LS2 forward, then STOP does not auto-restart',()=>{
 const p=clone(lesson.project);
 get(p,'startR').state=true;check(p,1100,true);
 get(p,'startR').state=false;check(p,1200,true);
 get(p,'ls2').state=true;check(p,1300,true);
 assert.equal(!!get(p,'coilF')._active,true);
 get(p,'stop').state=true;check(p,1400,false);
 get(p,'stop').state=false;check(p,1500,false);
 check(p,1600,false);
});
test('SC305: no auto-start when both limit switches are active at idle',()=>{
 const p=clone(lesson.project);
 get(p,'ls1').state=true;get(p,'ls2').state=true;
 check(p,1000,false);check(p,1100,false);
});
test('SC305: broken motor U conductor drops motor without solver short',()=>{
 const p=clone(lesson.project);
 p.wires=p.wires.filter(w=>!(w.to?.c==='motor'&&w.to?.p==='U'));
 get(p,'startF').state=true;check(p,1100,false);
});
