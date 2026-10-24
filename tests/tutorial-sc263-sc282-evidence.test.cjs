'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),ids=L.lessons.slice(262,282).map(l=>l.id),snapshots=new Map(ids.map(id=>[id,structuredClone(L.byId[id])]));
const script=fs.readFileSync(path.join(__dirname,'../dist/tutorial-sc263-sc282-stories.js'),'utf8'),ctx={window:{DTSTutorialLessons:L}};
vm.runInNewContext(script,ctx);
const wired=n=>n!==265&&n<=275;
const setup=n=>{const p=structuredClone(L.lessons[n-1].project),start=p.components.find(c=>c.id==='start'||c.id==='startF');if(start)start.state=true;const sw=p.components.find(c=>c.id==='sw');if(sw)sw.position=1;return p;};
test('SC263-282: exactly 20 unique examples, 12 wired circuits, 8 concept cards; canonical projects immutable',()=>{
 assert.equal(ids.length,20);assert.equal(new Set(ids).size,20);
 const originals=new Set();let wiredCount=0,concepts=0;
 for(let i=0;i<20;i++){
  const id=ids[i],l=L.byId[id],old=snapshots.get(id),n=i+263;
  assert.equal(l.sc263Sc282Story,'20261024-sc263-sc282-1',id);
  assert.equal(JSON.stringify(l.project),JSON.stringify(old.project),'protected graph changed '+id);
  assert.equal(JSON.stringify(l.steps),JSON.stringify(old.steps),'guided steps changed '+id);
  assert.equal(JSON.stringify(l.quiz),JSON.stringify(old.quiz),'quiz changed '+id);
  assert.equal(JSON.stringify(l.pedagogyReview),JSON.stringify(old.pedagogyReview),'review changed '+id);
  assert.equal(l.beginnerSteps.length,old.beginnerSteps.length+1);assert.ok(l.explanation.endsWith(old.explanation));
  assert.ok(!originals.has(l.beginnerSteps[0]));originals.add(l.beginnerSteps[0]);
  assert.notEqual(l.pedagogyReview?.physicalAcceptance,true);
  if(wired(n)){wiredCount++;assert.equal(l.kind,'wiring');assert.ok(l.project.wires.length>0);assert.equal(l.steps.length,l.project.wires.length);}
  else{concepts++;assert.equal(l.kind,'quiz');assert.equal(l.project.referenceOnly,true);assert.equal(l.project.wires.length,0);assert.equal(l.steps.length,0);}
 }
 assert.equal(wiredCount,12);assert.equal(concepts,8);
 vm.runInNewContext(script,ctx);
 assert.equal(L.byId[ids[0]].beginnerSteps.length,snapshots.get(ids[0]).beginnerSteps.length+1,'repeat overlay');
});
test('SC263-282: catalog pin identities & cable hotspots physically within symbolic component bounds',()=>{
 let endpoints=0;
 for(let n=263;n<=282;n++){
  if(!wired(n))continue;
  const p=L.lessons[n-1].project,parts=new Map(p.components.map(c=>[c.id,c]));
  for(const w of p.wires)for(const e of [w.from,w.to]){
   const c=parts.get(e.c),d=defs[c?.typeId];assert.ok(d,'unknown component '+n+'/'+e.c);
   const pin=d.pins.find(pin=>pin.id===e.p);assert.ok(pin,'catalog pin absent '+n+'/'+e.c+'/'+e.p);
   assert.ok(pin.x>=0&&pin.x<=d.w&&pin.y>=0&&pin.y<=d.h,'cable hotspot outside material '+n+'/'+e.c+'/'+e.p);
   endpoints++;
  }
 }
 assert.ok(endpoints>450,'insufficient canonical graph coverage: '+endpoints);
});
test('SC263-264, SC266-275: positive virtual start; interrupted motor power drops out without short circuit',()=>{
 for(let n=263;n<=275;n++){
  if(!wired(n))continue;
  const running=setup(n),r=Native.solve(running,defs,{now:1000}),motor=running.components.find(c=>c.id==='motor');
  assert.ok(r.stable&&!r.blocked&&!r.shortCircuit,'initial native '+n);
  assert.equal(motor._active,true,'motor must respond to start/packet position '+n);
  const cut=setup(n),before=cut.wires.length;
  cut.wires=cut.wires.filter(w=>!(w.to.c==='motor'&&['U','U1'].includes(w.to.p)));
  assert.ok(cut.wires.length<before,'no U/U1 power wire removed '+n);
  const negative=Native.solve(cut,defs,{now:1000});
  assert.ok(negative.stable&&!negative.blocked&&!negative.shortCircuit,'open cable invalid '+n);
  assert.equal(!!cut.components.find(c=>c.id==='motor')._active,false,'broken motor power still energized '+n);
 }
});
test('SC273 three-position packet: 0 OFF, Y ON, Δ ON in scoped virtual model',()=>{
 const l=L.byId['motor-start-speed-src-01'];
 for(const [position,active] of [[0,false],[1,true],[2,true]]){
  const p=structuredClone(l.project);p.components.find(c=>c.id==='sw').position=position;
  const r=Native.solve(p,defs,{now:1000});assert.ok(r.stable&&!r.shortCircuit);
  assert.equal(!!p.components.find(c=>c.id==='motor')._active,active);
 }
});
test('SC263 mismatch disclosed; timing, phase, overcurrent and PLC approvals remain pending',()=>{
 const l=L.byId['motor-direct-power-src-09'];
 assert.equal(l.learningSupport.topicTopologyMismatchReview,'ON_DELAY_STOP_USES_STAR_DELTA_SOURCE_PENDING');
 assert.equal(l.learningSupport.nonWorkingDiagramWarning,true);
 assert.equal(l.learningSupport.nativeAcceptanceRequired,true);
 assert.ok(l.project.components.some(c=>c.id==='coilStar'));assert.ok(l.project.components.some(c=>c.id==='coilDelta'));
 for(const n of [263,264,266,267,269,270,271,272,274,275]){
  const review=L.lessons[n-1].pedagogyReview;
  assert.notEqual(review.physicalAcceptance,true);
  assert.notEqual(review.nativeDynamicAcceptance,true);
 }
});
