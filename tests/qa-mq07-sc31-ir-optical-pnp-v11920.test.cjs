'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const Sensors=require('../dist/sensors.js');

const L=QA.curriculum();
const defs=QA.catalog();
const lesson=L.byId['sensor-analog-apps-src-12'];
const clone=v=>JSON.parse(JSON.stringify(v));
const find=(p,id)=>p.components.find(c=>c.id===id);
const asInt=v=>Number(!!v);

function sample(settings={}){
 const p=clone(lesson.project),s=find(p,'s1');
 if('distance' in settings)s.sensing.distance=settings.distance;
 if('offset' in settings)s.sensing.offset=settings.offset;
 if('target' in settings)s.sensing.target=settings.target;
 if('stale' in settings)s.state=settings.stale;
 if('cut' in settings)p.wires=p.wires.filter(w=>![w.from,w.to].some(z=>z.c==='s1'&&z.p===settings.cut));
 if(settings.openLoad)p.wires=p.wires.filter(w=>!(w.from.c==='ka1'&&w.to.c==='h1'));
 const result=Solver.solve(p,defs,{now:1000});
 assert.ok(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating,JSON.stringify(settings));
 return {p,result,output:[asInt(find(p,'s1')._closed),asInt(find(p,'k1')._active),asInt(find(p,'h1')._active)]};
}

test('SC31 real source and terminal identities: virtual optoelectronic PNP, K1 NO, 24V lamp',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(lesson.kind,'wiring');assert.equal(lesson.project.components.length,5);
 assert.equal(lesson.project.wires.length,7);assert.equal(lesson.steps.length,7);
 assert.equal(find(lesson.project,'s1').typeId,'sensor-through-beam');
 assert.equal(find(lesson.project,'s1').outputType,'PNP');
 assert.equal(lesson.pedagogyReview.titleTopologyStatus,'VIRTUAL_OPTICAL_SOURCE_ALIGNED');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.separateTransmitterReceiverVerified,false);
 assert.equal(defs['sensor-through-beam'].sensorPrinciple,'optical');
 assert.equal(Sensors.supported(defs['sensor-through-beam']),true);
 const expected=[
  ['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],
  ['k1','A2','g1','M'],['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']
 ];
 for(const [a,ap,b,bp] of expected){
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  assert.ok(defs[find(lesson.project,a).typeId].pins.some(x=>x.id===ap));
  assert.ok(defs[find(lesson.project,b).typeId].pins.some(x=>x.id===bp));
 }
});
test('SC31 optical detect threshold, plastic opaque target, stale state ignored',()=>{
 for(const [params,want] of [
  [{distance:80},[0,0,0]],
  [{distance:2},[1,1,1]],
  [{distance:40},[1,1,1]],
  [{distance:41,stale:true},[0,0,0]],
  [{distance:2,target:'liquid',stale:true},[0,0,0]],
  [{distance:2,offset:9},[0,0,0]]
 ])assert.deepEqual(sample(params).output,want,JSON.stringify(params));
});
test('SC31 source/return/signal wire loss and load separation',()=>{
 for(const [params,want] of [
  [{distance:2,cut:'BN'},[0,0,0]],
  [{distance:2,cut:'BU'},[0,0,0]],
  [{distance:2,cut:'BK'},[1,0,0]],
  [{distance:2,openLoad:true},[1,1,0]]
 ])assert.deepEqual(sample(params).output,want,JSON.stringify(params));
});
test('SC31 same-session far / near / far transitions remain dynamic and stable',()=>{
 const p=clone(lesson.project);
 for(const [distance,want] of [[80,0],[2,1],[75,0],[10,1],[80,0]]){
  find(p,'s1').sensing.distance=distance;
  const r=Solver.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  assert.equal(asInt(find(p,'k1')._active),want);
  assert.equal(asInt(find(p,'h1')._active),want);
 }
});
test('SC11-SC30 canonical lesson counts and nonphysical acceptance remain unchanged',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 const scenes=[[1,13,19],[2,13,19],[3,6,6],[4,3,5],[5,3,5],[6,3,5],
  [7,5,7],[8,5,4],[9,3,6],[10,13,19],[11,5,7]];
 for(const [n,count,wires]of scenes){
  const x=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.equal(x.project.components.length,count);
  assert.equal(x.project.wires.length,wires);
  assert.equal(x.pedagogyReview.physicalAcceptance,false);
 }
});
