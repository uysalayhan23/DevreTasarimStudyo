'use strict';
// SC307: K0/KM forward permission, KT1/KT2 timing and STOP interlock, virtual only.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const original=new Map(L.lessons.map(l=>[l.id,JSON.stringify(l.project)]));
const ctx={window:{DTSTutorialLessons:L}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc307-master-guard.js'),'utf8'),ctx);
const lesson=L.byId['motor-sequence-src-07'],clone=v=>structuredClone(v);
const get=(p,id)=>p.components.find(c=>c.id===id);
function check(p,at,expected){
 const r=Native.solve(p,defs,{now:at});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'unstable at '+at+' '+(r.reason||''));
 const f=!!get(p,'coilF')._active,b=!!get(p,'coilR')._active,m=!!get(p,'motor')._active;
 assert.deepEqual([f,b,m],expected,'K1/K2/motor at '+at);
 assert.ok(!(f&&b),'forward and reverse simultaneously');
}
test('SC307 targeted graph: 19 components, 34 real terminal wires, protected neighbors',()=>{
 const p=lesson.project;assert.equal(p.components.length,19);assert.equal(p.wires.length,34);
 assert.equal(lesson.steps.length,34);assert.equal(lesson.materials.length,19);
 assert.equal(lesson.sc307MasterGuard,'km-no-forward-permission-v1');
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'TIMED_FORWARD_REVERSE_NATIVE_PENDING');
 assert.notEqual(lesson.pedagogyReview.physicalAcceptance,true);
 for(const l of L.lessons)if(l.id!==lesson.id)
  assert.equal(JSON.stringify(l.project),original.get(l.id),'protected graph modified: '+l.id);
 for(const w of p.wires)for(const e of [w.from,w.to]){
  const c=get(p,e.c),d=defs[c?.typeId];
  assert.ok(d?.pins?.some(pin=>pin.id===e.p),'missing catalog pin '+e.c+'/'+e.p);
 }
});
test('SC307 must not start before START or restart after STOP release',()=>{
 const p=clone(lesson.project);
 check(p,1000,[false,false,false]);
 get(p,'stop').state=true;check(p,1100,[false,false,false]);
 get(p,'stop').state=false;check(p,1200,[false,false,false]);
 get(p,'startF').state=true;check(p,1300,[true,false,true]);
 get(p,'startF').state=false;check(p,1400,[true,false,true]);
 get(p,'stop').state=true;check(p,1500,[false,false,false]);
 get(p,'stop').state=false;check(p,1600,[false,false,false]);
});
test('SC307: 3s forward, 1s neutral, reverse; manual STOP resets',()=>{
 const p=clone(lesson.project);
 check(p,1000,[false,false,false]);
 get(p,'startF').state=true;check(p,1100,[true,false,true]);
 get(p,'startF').state=false;check(p,1200,[true,false,true]);
 check(p,4099,[true,false,true]);
 check(p,4101,[false,false,false]);
 check(p,5099,[false,false,false]);
 check(p,5101,[false,true,true]);
 get(p,'stop').state=true;check(p,5200,[false,false,false]);
 get(p,'stop').state=false;check(p,5300,[false,false,false]);
 get(p,'startF').state=true;check(p,5400,[true,false,true]);
});
test('SC307: broken motor power prevents virtual motor running',()=>{
 const p=clone(lesson.project);p.wires=p.wires.filter(w=>!(w.to?.c==='motor'&&w.to?.p==='U'));
 get(p,'startF').state=true;
 check(p,1100,[true,false,false]);
});
