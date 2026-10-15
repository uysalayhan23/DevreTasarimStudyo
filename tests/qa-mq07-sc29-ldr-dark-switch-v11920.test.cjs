'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),lesson=L.byId['sensor-analog-apps-src-10'];
const clone=x=>JSON.parse(JSON.stringify(x)),part=(p,id)=>p.components.find(c=>c.id===id);
function run(lux,opts={}){
 const p=clone(lesson.project);
 part(p,'s1').illuminationLux=lux;
 if('voltage' in opts)part(p,'g1').dcVoltage=opts.voltage;
 if(opts.cut){const [id,pin]=opts.cut;p.wires=p.wires.filter(w=>![w.from,w.to].some(e=>e.c===id&&e.p===pin))}
 const r=Simulation.solve(p,defs,{now:1000});
 assert.equal(r.blocked,false);assert.equal(r.shortCircuit,false);
 assert.equal(r.stable,true);assert.equal(r.oscillating,false);
 const l=part(p,'h1'),q=part(p,'q1'),u=part(p,'u1'),s=part(p,'s1');
 return {p,l,q,u,s,light:!!l._active,current:Number(l._currentValue)||0,
  gate:Number(q._mq07LdrGateV)||0,resistance:Number(s._ldrResistance)};
}
test('SC29 actual catalog terminal geometry and dark-trigger output polarity',()=>{
 assert.equal(L.lessons.length,1655);assert.equal(lesson.kind,'wiring');
 assert.equal(lesson.project.components.length,13);assert.equal(lesson.project.wires.length,19);
 assert.equal(lesson.steps.length,19);assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(part(lesson.project,'q1').typeId,'irf540n-mosfet');
 assert.equal(part(lesson.project,'q1').mq07LdrDarkSwitch,true);
 assert.equal(part(lesson.project,'h1').resistance,240);
 assert.equal(part(lesson.project,'g1').dcVoltage,24);
 for(const [a,ap,b,bp] of [
  ['s1','2','u1','2'],['r2','2','u1','3'],['u1','1','rg','1'],
  ['rg','2','rp','1'],['rg','2','q1','G'],['rp','2','g1','M'],
  ['g1','P','h1','X1'],['h1','X2','q1','D'],['q1','S','g1','M']
 ]){
  assert.ok(lesson.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  const ca=part(lesson.project,a),cb=part(lesson.project,b);
  assert.ok(defs[ca.typeId].pins.some(pin=>pin.id===ap));
  assert.ok(defs[cb.typeId].pins.some(pin=>pin.id===bp));
 }
});
test('SC29 real solver dark 0.1-10 lux ON at ~100mA and 30-1000 lux OFF',()=>{
 const rows=[[.1,true],[1,true],[5,true],[10,true],[30,false],[50,false],[100,false],[1000,false]];
 for(const [lux,on] of rows){
  const r=run(lux);
  assert.equal(r.light,on,'lux='+lux);
  assert.equal(!!r.q._mosfetOn,on,'gate switch, lux='+lux);
  if(on){assert.ok(r.gate>10&&r.gate<12);assert.ok(Math.abs(r.current-.1)<.00001)}
  else{assert.ok(r.gate<.1);assert.ok(r.current<.00001)}
 }
});
test('SC29 loaded loop fails closed on missing virtual source / gate / lamp / LM358 power',()=>{
 for(const opts of [{voltage:0},{cut:['q1','G']},{cut:['h1','X2']},{cut:['u1','8']}]){
  const r=run(1,opts);
  assert.equal(r.light,false,JSON.stringify(opts));
  assert.ok(r.current<.00001);
 }
});
test('SC29 monotonic real LDR resistance and dynamic 100->1->100 lux recomputation',()=>{
 const p=clone(lesson.project),s=part(p,'s1'),h=part(p,'h1');
 const obs=[];
 for(const lux of [100,1,100]){
  s.illuminationLux=lux;
  const r=Simulation.solve(p,defs,{now:1000});
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  obs.push(!!h._active);
 }
 assert.deepEqual(obs,[false,true,false]);
 assert.ok(run(1).resistance>run(100).resistance);
});
test('SC11-SC28 canonical source and no physical/manufacturer acceptance',()=>{
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
 for(const [n,parts,wires] of [[1,13,19],[2,13,19],[3,6,6],[4,3,5],[5,3,5],[6,3,5],[7,5,7],[8,5,4],[9,3,6]]){
  const sc=L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')];
  assert.equal(sc.project.components.length,parts);
  assert.equal(sc.project.wires.length,wires);
  assert.equal(sc.pedagogyReview.physicalAcceptance,false);
 }
 assert.equal(L.byId['sensor-analog-apps-src-11'].pedagogyReview.titleTopologyStatus,
  'VIRTUAL_DC_LINEAR_DIMMER_SOURCE_ALIGNED');
 assert.equal(lesson.pedagogyReview.mq07LdrDark.manufacturerIlluminanceCalibrationVerified,false);
});
