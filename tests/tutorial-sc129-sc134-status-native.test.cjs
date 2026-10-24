'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs'),Native=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog(),copy=x=>JSON.parse(JSON.stringify(x));
const part=(p,id)=>p.components.find(x=>x.id===id),id=i=>'electronic-switching-src-'+String(i).padStart(2,'0');
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../dist/tutorial-next50-guidance.js'),'utf8'),{window:{DTSTutorialLessons:L}});
test('SC129–134: BJT-RC, Schmitt, FET, MOSFET and PWM are not stand-in NE555 projects',()=>{
 const expected=[['06',['bd139-npn','capacitor']],['07',['bd139-npn','capacitor']],['08',['bd139-npn','bd139-npn']],['09',['mosfet-n','capacitor']],['10',['irf540n-mosfet']],['11',['irf540n-mosfet','virtual-pwm-generator-v1','motor-dc']]];
 for(const [idx,types] of expected){const l=L.byId['electronic-switching-src-'+idx];assert.ok(l);for(const type of types)assert.ok(l.project.components.some(c=>c.typeId===type),idx+' missing '+type);assert.equal(l.kind,'wiring');}
});
test('SC129–130: native RC charge with open BJT base wire fails closed',()=>{
 for(const idx of [6,7]){
  const l=L.byId[id(idx)],p=copy(l.project);assert.ok(!p.components.some(c=>/ne555/i.test(c.typeId)));
  part(p,'s1').state=true;
  const on=Native.solve(p,defs,{now:1000});assert.ok(on.stable&&!on.blocked&&!on.shortCircuit);
  assert.ok(part(p,'c1')._capacitorVoltage>0);
  const broken=copy(l.project);part(broken,'s1').state=true;
  broken.wires=broken.wires.filter(w=>!(w.from.c==='rb'&&w.to.c==='q1'));
  const r=Native.solve(broken,defs,{now:1000});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  assert.equal(!!part(broken,'q1')._bjtOn,false,'broken BJT base drive must fail closed');
 }
});
test('SC131: Schmitt two-threshold behavior stays REVIEW until proven stable',()=>{
 const l=L.byId[id(8)];assert.equal(l.pedagogyReview.nativeHysteresisAcceptance,false);
 assert.equal(l.learningSupport.nonWorkingDiagramWarning,true);
 assert.equal(l.learningSupport.nativeAcceptanceRequired,true);
 assert.equal(l.learningSupport.nativeReviewReason,'BJT_SCHMITT_HYSTERESIS_NATIVE_PENDING');
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
});
test('SC132–134: native FET/MOSFET negative gate and PWM motor power paths',()=>{
 for(const idx of [9,10]){
  const lesson=L.byId[id(idx)],p=copy(lesson.project);part(p,'sw').state=true;
  const first=Native.solve(p,defs,{now:250});assert.ok(first.stable&&!first.blocked&&!first.shortCircuit);
  const cut=copy(lesson.project);part(cut,'sw').state=true;
  cut.wires=cut.wires.filter(w=>!(w.to.c==='q1'&&w.to.p==='G'));
  const r=Native.solve(cut,defs,{now:250});assert.ok(r.stable&&!r.blocked&&!r.shortCircuit);
  assert.equal(!!part(cut,'h1')._active,false,'missing G should keep load off '+idx);
 }
 const lesson=L.byId[id(11)];
 for(const [duty,on] of [[0,false],[50,true],[100,true]]){
  const p=copy(lesson.project);part(p,'pwm1').dutyPercent=duty;
  const result=Native.solve(p,defs,{now:0});assert.ok(result.stable&&!result.blocked&&!result.shortCircuit);
  assert.equal(!!part(p,'m1')._active,on,'duty '+duty);
 }
 const cut=copy(lesson.project);part(cut,'pwm1').dutyPercent=100;
 cut.wires=cut.wires.filter(w=>!(w.from.c==='rg'&&w.to.c==='q1'));
 const result=Native.solve(cut,defs,{now:0});assert.ok(result.stable&&!result.blocked&&!result.shortCircuit);
 assert.equal(!!part(cut,'m1')._active,false);
});
