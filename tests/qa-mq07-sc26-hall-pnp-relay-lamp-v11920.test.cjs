'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js'),Sensors=require('../dist/sensors.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-07'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
function sample(options={}){
 const p=clone(lesson.project),g=part(p,'g1'),s=part(p,'s1');
 if('dist' in options)s.sensing.distance=options.dist;
 if('target' in options)s.sensing.target=options.target;
 if('offset' in options)s.sensing.offset=options.offset;
 if('voltage' in options)g.dcVoltage=options.voltage;
 if('stale' in options)s.state=options.stale;
 if(options.cut)p.wires=p.wires.filter(w=>![w.from,w.to].some(e=>e.c==='s1'&&e.p===options.cut));
 if(options.openLoad)p.wires=p.wires.filter(w=>!(w.from.c==='ka1'&&w.to.c==='h1'));
 const result=Simulation.solve(p,defs,{now:1000});
 assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating);
 return {p,result,hall:+!!s._closed,coil:+!!part(p,'k1')._active,contact:+!!part(p,'ka1')._closed,lamp:+!!part(p,'h1')._active};
}
test('SC26 five real catalog parts, seven canonical wired terminals and magnetic target',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.components.length,5);
 assert.equal(lesson.project.wires.length,7);assert.equal(lesson.steps.length,7);
 assert.equal(part(lesson.project,'g1').typeId,'arduino-bench-supply');
 assert.equal(part(lesson.project,'g1').dcVoltage,24);
 assert.equal(part(lesson.project,'s1').outputType,'PNP');
 assert.equal(part(lesson.project,'s1').sensing.target,'magnet');
 assert.equal(part(lesson.project,'s1').sensing.range,10);
 for(const [a,ap,b,bp] of [['g1','P','s1','BN'],['g1','M','s1','BU'],
 ['s1','BK','k1','A1'],['k1','A2','g1','M'],['g1','P','ka1','13'],
 ['ka1','14','h1','X1'],['h1','X2','g1','M']]){
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  assert.ok(defs[part(lesson.project,a).typeId].pins.some(p=>p.id===ap));
  assert.ok(defs[part(lesson.project,b).typeId].pins.some(p=>p.id===bp));
 }
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
});
test('SC26 Hall magnetic target is detectable in UI but plastic rejected',()=>{
 const d=defs['sensor-hall'],s=clone(part(lesson.project,'s1'));
 assert.equal(Sensors.supported(d),true);
 assert.equal(Sensors.detect(s,d).detected,false);
 s.sensing.distance=5;assert.equal(Sensors.detect(s,d).detected,true);
 const xml=Sensors.markup(s,d);
 assert.match(xml,/data-hall-magnet-icon/);
 s.sensing.target='plastic';assert.equal(Sensors.detect(s,d).detected,false);
});
test('SC26 12 actual solver cases: PNP relay/NO lamp, open wires and source failures',()=>{
 const rows=[
  [{dist:20},[0,0,0]],
  [{dist:5},[1,1,1]],
  [{dist:10},[1,1,1]],
  [{dist:11,stale:true},[0,0,0]],
  [{dist:5,target:'plastic',stale:true},[0,0,0]],
  [{dist:5,offset:8},[0,0,0]],
  [{dist:5,cut:'BN'},[0,0,0]],
  [{dist:5,cut:'BU'},[0,0,0]],
  [{dist:5,cut:'BK'},[1,0,0]],
  [{dist:5,voltage:0},[0,0,0]],
  [{dist:5,voltage:12},[0,0,0]],
  [{dist:5,openLoad:true},[1,1,0]]
 ];
 for(const [opts,expected] of rows){const s=sample(opts);
  assert.deepEqual([s.hall,s.coil,s.lamp],expected,JSON.stringify(opts));
  assert.equal(s.contact,s.coil,'NO contact follows K1');
 }
});
test('SC26 live distance transitions and historical no-target state fallback',()=>{
 const p=clone(lesson.project),s=part(p,'s1');
 for(const [distance,expected] of [[20,0],[5,1],[18,0],[7,1],[20,0]]){
  s.sensing.distance=distance;
  const r=Simulation.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  assert.equal(+!!part(p,'k1')._active,expected);
  assert.equal(+!!part(p,'h1')._active,expected);
 }
 s.sensing={target:'none'};s.state=true;
 Simulation.solve(p,defs,{now:1000});
 assert.equal(part(p,'h1')._active,true);
});
test('SC11 through SC25 stable IDs, terminal scene counts, physical QA stays REVIEW',()=>{
 for(let i=11;i<=19;i++)assert.ok(L.byId['electronic-switching-src-'+i]?.project);
 const counts=[[1,13,19],[2,13,19],[3,6,6],[4,3,5],[5,3,5],[6,3,5]];
 for(const [n,parts,wires] of counts){
  const sc=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.equal(sc.project.components.length,parts);
  assert.equal(sc.project.wires.length,wires);
  assert.equal(sc.pedagogyReview.physicalAcceptance,false);
 }
 assert.equal(lesson.pedagogyReview.mq07HallMagnetic.manufacturerCalibrationVerified,false);
});
