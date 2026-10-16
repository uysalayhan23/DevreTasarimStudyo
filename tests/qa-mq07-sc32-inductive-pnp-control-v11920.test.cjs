'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js'),Sensors=require('../dist/sensors.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-13'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
function sample(o={}){
 const p=clone(lesson.project),s=part(p,'s1'),g=part(p,'g1');
 if('distance'in o)s.sensing.distance=o.distance;
 if('offset'in o)s.sensing.offset=o.offset;
 if('target'in o)s.sensing.target=o.target;
 if('stale'in o)s.state=o.stale;
 if('voltage'in o)g.dcVoltage=o.voltage;
 if(o.cut)p.wires=p.wires.filter(w=>![w.from,w.to].some(e=>e.c===o.cut[0]&&e.p===o.cut[1]));
 const solve=Native.solve(p,defs,{now:1000});
 assert.ok(solve.stable&&!solve.blocked&&!solve.shortCircuit&&!solve.oscillating);
 return {p,s,solve,b1:+!!s._closed,k1:+!!part(p,'k1')._active,kontakt:+!!part(p,'ka1')._closed,h1:+!!part(p,'h1')._active};
}
test('SC32 original five parts seven canonical wire terminals and PNP output maintained',()=>{
 assert.equal(L.lessons.length,1655);assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.components.length,5);assert.equal(lesson.project.wires.length,7);assert.equal(lesson.steps.length,7);
 assert.equal(part(lesson.project,'s1').outputType,'PNP');
 assert.equal(part(lesson.project,'g1').dcVoltage,24);
 assert.deepEqual(part(lesson.project,'s1').sensing,{target:'metal',range:4,distance:8,offset:0,face:'right',auto:false});
 for(const [a,pa,b,pb] of [
 ['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],
 ['k1','A2','g1','M'],['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']]){
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===pa&&w.to.c===b&&w.to.p===pb));
  assert.ok(defs[part(lesson.project,a).typeId].pins.some(p=>p.id===pa));
  assert.ok(defs[part(lesson.project,b).typeId].pins.some(p=>p.id===pb));
 }
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
});
test('SC32 true inductive metal target detection vs plastic and misalignment',()=>{
 const d=defs.proximity,s=part(lesson.project,'s1');
 assert.equal(d.sensorPrinciple,'inductive');assert.equal(Sensors.supported(d),true);
 assert.equal(Sensors.detect(s,d).detected,false);
 const p=clone(s);p.sensing.distance=2;
 assert.equal(Sensors.detect(p,d).detected,true);
 p.sensing.target='plastic';assert.equal(Sensors.detect(p,d).detected,false);
 p.sensing.target='metal';p.sensing.offset=8;assert.equal(Sensors.detect(p,d).detected,false);
});
test('SC32 fourteen targeted original-solver PNP relay NO load and failure scenarios',()=>{
 const cases=[
  [{distance:8},[0,0,0]],
  [{distance:2},[1,1,1]],
  [{distance:4},[1,1,1]],
  [{distance:5,stale:true},[0,0,0]],
  [{distance:2,target:'plastic',stale:true},[0,0,0]],
  [{distance:2,offset:8},[0,0,0]],
  [{distance:2,cut:['s1','BN']},[0,0,0]],
  [{distance:2,cut:['s1','BU']},[0,0,0]],
  [{distance:2,cut:['s1','BK']},[1,0,0]],
  [{distance:2,voltage:0},[0,0,0]],
  [{distance:2,voltage:12},[0,0,0]],
  [{distance:2,cut:['ka1','14']},[1,1,0]],
  [{distance:2,cut:['h1','X2']},[1,1,0]],
  [{distance:2,cut:['k1','A2']},[1,0,0]]
 ];
 for(const [args,expected] of cases){
  const out=sample(args);
  assert.deepEqual([out.b1,out.k1,out.h1],expected,JSON.stringify(args));
  assert.equal(out.kontakt,out.k1,'K1 contact must follow coil');
 }
});
test('SC32 live proximity target motion in same project, historical no-target fallback',()=>{
 const p=clone(lesson.project),s=part(p,'s1');
 for(const [distance,expected] of [[8,0],[2,1],[5,0],[4,1],[8,0],[0,1],[10,0],[3,1]]){
  s.sensing.distance=distance;const r=Native.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  assert.equal(+!!part(p,'k1')._active,expected);
  assert.equal(+!!part(p,'h1')._active,expected);
 }
 s.sensing.target='none';s.state=true;
 const r=Native.solve(p,defs,{now:1000});
 assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
 assert.equal(part(p,'h1')._active,true);
});
test('SC11-SC31 immutable history and review statuses remain',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 const counts=[[1,13,19],[2,13,19],[3,6,6],[4,3,5],[5,3,5],[6,3,5],[7,5,7],[8,5,4],[9,3,6],[10,13,19],[11,5,7],[12,5,7]];
 for(const [n,parts,wires] of counts){
  const l=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.equal(l.project.components.length,parts);
  assert.equal(l.project.wires.length,wires);
  assert.equal(l.pedagogyReview.physicalAcceptance,false);
 }
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.mq07SensorControl.manufacturerDetectionRangeVerified,false);
});
