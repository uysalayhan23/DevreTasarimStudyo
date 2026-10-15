'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Runtime=require('../dist/arduino-runtime.js');
const Native=require('../dist/simulation.js');
const Library=require('../dist/arduino-library.js');
const L=QA.curriculum(),defs=QA.catalog(),l=L.byId['sensor-analog-apps-src-06'];
const find=(p,id)=>p.components.find(c=>c.id===id);
const clone=x=>JSON.parse(JSON.stringify(x));
function sample(mag,opts={}){
 const p=clone(l.project),s=find(p,'s1'),ps=find(p,'ps');
 s.reedMagnet=mag;
 if('stale' in opts)s.state=opts.stale;
 if('voltage' in opts)ps.dcVoltage=opts.voltage;
 if(opts.cut)p.wires=p.wires.filter(w=>![w.from,w.to].some(end=>end.c==='s1'&&end.p===opts.cut));
 const sim=Native.solve(p,defs,{now:1000});
 assert.ok(sim.stable&&!sim.blocked&&!sim.shortCircuit&&!sim.oscillating);
 for(let i=0;i<12;i++)Runtime.tick(p,defs,{now:i*5});
 const b=find(p,'u1');assert.equal(b._arduinoError||'','');
 return {p,s,b,D2:b._arduinoRuntime.vars.reed,sim};
}
test('SC25 keeps 3 canonical components and 5 terminal grounded wires, with isolated opt-in',()=>{
 assert.equal(L.lessons.length,1655);
 assert.equal(l.kind,'wiring');assert.equal(l.project.components.length,3);
 assert.equal(l.project.wires.length,5);assert.equal(l.steps.length,5);
 assert.equal(find(l.project,'s1').mq07ReedDigitalModel,true);
 assert.equal(find(l.project,'ps').dcVoltage,5);
 assert.match(find(l.project,'u1').arduinoSketch,/digitalRead\(2\)/);
 for(const [a,ap,b,bp] of [
 ['ps','P','s1','VCC'],['ps','M','s1','GND'],['ps','P','u1','5V'],
 ['ps','M','u1','GND'],['s1','DO','u1','D2']]){
  assert.ok(l.project.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp));
  assert.ok(defs[find(l.project,a).typeId].pins.some(x=>x.id===ap));
  assert.ok(defs[find(l.project,b).typeId].pins.some(x=>x.id===bp));
 }
 assert.equal(Library.components.find(x=>x.id==='arduino-reed').magnetControlled,true);
 for(const key of ['physicalAcceptance','independentPedagogicalAcceptance','windowsVisualAcceptance'])
  assert.equal(l.pedagogyReview[key],false);
});
test('SC25 magnet slider matches KY-021 art threshold at 65, irrespective of stale state',()=>{
 for(const [mag,expected,stale] of [[0,0,true],[60,0,false],[64,0,true],
  [65,1,false],[80,1,false],[100,1,false]]){
  const s=sample(mag,{stale});
  assert.equal(s.D2,expected,'UNO D2 at magnet '+mag);
  assert.equal(s.s._mq07ReedDO,expected);
  assert.equal(s.s._mq07ReedPowered,true);
  assert.equal(s.s._mq07ReedMagnetNear,mag>=65);
 }
});
test('SC25 open signal and 5V/GND, 0 or 4V source disable UNO D2 high',()=>{
 for(const opt of [{cut:'VCC'},{cut:'GND'},{cut:'DO'},{voltage:0},{voltage:4}]){
  const s=sample(80,opt);
  assert.equal(s.D2,0,JSON.stringify(opt));
  if(opt.cut!=='DO')assert.equal(s.s._mq07ReedPowered,false);
  if(opt.cut==='DO')assert.equal(s.s._mq07ReedDO,1);
 }
});
test('SC25 slider changes 0-80-20-100-0 are live, no frozen old state',()=>{
 const p=clone(l.project),s=find(p,'s1'),b=find(p,'u1');
 let now=100;
 for(const [mag,want] of [[0,0],[80,1],[20,0],[100,1],[0,0]]){
  s.reedMagnet=mag;
  for(let i=0;i<12;i++,now+=5)Runtime.tick(p,defs,{now});
  assert.equal(b._arduinoRuntime.vars.reed,want,'magnet='+mag);
 }
});
test('other historical Reed instances and SC11-SC24 accepted states are preserved',()=>{
 const p=clone(l.project),s=find(p,'s1');
 delete s.mq07ReedDigitalModel;s.state=true;s.reedMagnet=0;
 for(let i=0;i<12;i++)Runtime.tick(p,defs,{now:i*5});
 assert.equal(find(p,'u1')._arduinoRuntime.vars.reed,1);
 assert.equal(L.byId['sensor-analog-apps-src-01'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-02'].project.components.length,13);
 assert.equal(L.byId['sensor-analog-apps-src-03'].project.components.length,6);
 assert.equal(L.byId['sensor-analog-apps-src-04'].project.components.length,3);
 assert.equal(L.byId['sensor-analog-apps-src-05'].project.components.length,3);
 for(let n=11;n<=19;n++)assert.ok(L.byId['electronic-switching-src-'+n]?.project);
});
