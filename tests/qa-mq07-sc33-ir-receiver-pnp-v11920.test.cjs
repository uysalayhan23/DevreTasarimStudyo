'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js'),Sensors=require('../dist/sensors.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-14'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
function sample(opts={}){
 const p=clone(lesson.project),s=part(p,'s1'),g=part(p,'g1');
 if('distance' in opts)s.sensing.distance=opts.distance;
 if('target' in opts)s.sensing.target=opts.target;
 if('offset' in opts)s.sensing.offset=opts.offset;
 if('stale' in opts)s.state=opts.stale;
 if('voltage' in opts)g.dcVoltage=opts.voltage;
 if(opts.cut){const [id,pin]=opts.cut;
  p.wires=p.wires.filter(w=>![w.from,w.to].some(e=>e.c===id&&e.p===pin));
 }
 const result=Simulation.solve(p,defs,{now:1000});
 assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating);
 return {p,result,s,relay:part(p,'k1'),contact:part(p,'ka1'),lamp:part(p,'h1'),
  triplet:[+!!s._closed,+!!part(p,'k1')._active,+!!part(p,'h1')._active]};
}
test('SC33 actual five product models and seven PNP/relay/NO/lamp terminals are unchanged',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.components.length,5);
 assert.equal(lesson.project.wires.length,7);
 assert.equal(lesson.steps.length,7);
 assert.equal(part(lesson.project,'g1').dcVoltage,24);
 assert.equal(part(lesson.project,'s1').outputType,'PNP');
 assert.deepEqual(clone(part(lesson.project,'s1').sensing),{target:'plastic',range:40,
   distance:80,offset:0,face:'right',auto:false});
 for(const [a,ap,b,bp] of [
  ['g1','P','s1','BN'],['g1','M','s1','BU'],
  ['s1','BK','k1','A1'],['k1','A2','g1','M'],
  ['g1','P','ka1','13'],['ka1','14','h1','X1'],
  ['h1','X2','g1','M']]){
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&
    w.to.c===b&&w.to.p===bp));
  assert.ok(defs[part(lesson.project,a).typeId].pins.some(x=>x.id===ap));
  assert.ok(defs[part(lesson.project,b).typeId].pins.some(x=>x.id===bp));
 }
 assert.equal(defs['sensor-through-beam'].sensorPrinciple,'optical');
 assert.equal(Sensors.supported(defs['sensor-through-beam']),true);
 assert.equal(Sensors.detect(part(lesson.project,'s1'),defs['sensor-through-beam']).detected,false);
 const near=clone(part(lesson.project,'s1'));near.sensing.distance=2;
 assert.equal(Sensors.detect(near,defs['sensor-through-beam']).detected,true);
});
test('SC33 real source 13 PNP optical and load cases: distance, type, faults, voltage',()=>{
 const matrix=[
  [{distance:80},[0,0,0]],
  [{distance:2},[1,1,1]],
  [{distance:40},[1,1,1]],
  [{distance:41,stale:true},[0,0,0]],
  [{distance:2,target:'liquid'},[0,0,0]],
  [{distance:2,offset:7},[0,0,0]],
  [{distance:2,cut:['s1','BN']},[0,0,0]],
  [{distance:2,cut:['s1','BU']},[0,0,0]],
  [{distance:2,cut:['s1','BK']},[1,0,0]],
  [{distance:2,cut:['k1','A2']},[1,0,0]],
  [{distance:2,cut:['h1','X2']},[1,1,0]],
  [{distance:2,voltage:0},[0,0,0]],
  [{distance:2,voltage:12},[0,0,0]]
 ];
 for(const [opts,expected] of matrix){
  const r=sample(opts);
  assert.deepEqual(r.triplet,expected,JSON.stringify(opts));
  assert.equal(+!!r.contact._closed,expected[1],'K1 NO tracks relay');
 }
});
test('SC33 live optical target 80-2-75-10-80 mm follows source not stale state',()=>{
 const p=clone(lesson.project),s=part(p,'s1'),coil=part(p,'k1'),lamp=part(p,'h1');
 for(const [distance,expected] of [[80,0],[2,1],[75,0],[10,1],[80,0]]){
  s.sensing.distance=distance;s.state=!expected;
  const r=Simulation.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);
  assert.equal(+!!coil._active,expected,'coil distance='+distance);
  assert.equal(+!!lamp._active,expected,'lamp distance='+distance);
 }
});
test('SC11-SC32 curriculum IDs, historical physical REVIEW and future scene remain',()=>{
 for(let i=11;i<=19;i++)assert.ok(L.byId['electronic-switching-src-'+i]?.project);
 for(let i=1;i<=13;i++){
  const sc=L.byId['sensor-analog-apps-src-'+String(i).padStart(2,'0')];
  assert.ok(sc?.project,'SC'+(19+i));
  assert.equal(sc.pedagogyReview?.physicalAcceptance,false);
 }
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.mq07IrReceiver.fullNodeSuiteExecuted,false);
 assert.equal(lesson.pedagogyReview.mq07IrReceiver.physicalOpticalCalibrationVerified,false);
 assert.equal(L.byId['sensor-analog-apps-src-13'].project.wires.length,7);
 assert.equal(L.byId['sensor-analog-apps-src-15'].kind,'quiz');
});
