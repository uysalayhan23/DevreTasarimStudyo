'use strict';
// Source parity for SC164–171 after correcting seven misleading 3-phase
// surrogate demos. Native operation is deferred to first-200 batch QA.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const S=require('../dist/simulation.js');
const L=QA.curriculum(),defs=QA.catalog();
const issues=[
 'SINGLE_PHASE_AUX_WINDING_NATIVE_PENDING',
 'SINGLE_PHASE_AUX_WINDING_NATIVE_PENDING',
 'MISSING_SINGLE_PHASE_AUX_REVERSAL',
 'MISSING_SYNCHRONOUS_MOTOR_MODEL',
 'MISSING_AUX_STARTER_MOTOR',
 'MISSING_INDUCTION_START_OF_SYNCHRONOUS',
 'NO_WIRED_CIRCUIT',
 'MISSING_PERMANENT_MAGNET_SYNCHRONOUS'
];
const lesson=n=>L.byId['motor-special-src-'+String(n).padStart(2,'0')];
const actualTypes={
 3:['supply-1p','motor-1p','capacitor'],
 4:['supply-3p','tutorial-synchronous-motor'],
 5:['tutorial-synchronous-motor','motor-3p'],
 6:['supply-3p','tutorial-synchronous-motor'],
 7:['vfd','tutorial-synchronous-motor'],
 8:['hcfa-sv-x2ea040a-a','hcfa-sv-x2mh040a-n2ln']
};
for(let n=1;n<=8;n++)test('SC'+(163+n)+' actual motor products and honest supported-source scope',()=>{
 const item=lesson(n);assert.ok(item,'lesson '+n);
 const p=item.project,live=n===1||n===2;
 assert.equal(item.kind,live?'wiring':'quiz');
 assert.equal(p.wires.length,live?(n===1?8:10):0);
 assert.equal(item.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(item.pedagogyReview.titleTopologyIssue,issues[n-1]);
 for(const name of ['specialMotorAcceptance','physicalAcceptance',
  'windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.equal(item.pedagogyReview[name],false);
 assert.ok(item.beginnerSteps.some(x=>x.includes('PASS verme')));
 const types=p.components.map(x=>x.typeId);
 if(live){
  assert.ok(types.includes('supply-1p'));
  assert.ok(types.includes('motor-1p'));
  assert.ok(!types.includes('motor-3p'));
  assert.equal(types.filter(x=>x==='coil-contactor').length,1);
  assert.equal(types.includes('contact-no'),n===2);
  const motor=p.components.find(x=>x.typeId==='motor-1p');
  for(const terminal of ['U','N','PE'])assert.ok(p.wires.some(w=>
   (w.from.c===motor.id&&w.from.p===terminal)||
   (w.to.c===motor.id&&w.to.p===terminal)));
  assert.match(item.explanation,/Z1\/Z2|yardımcı sargı/);
 }else{
  assert.deepEqual(types,actualTypes[n]);
  assert.equal(p.referenceOnly,true);
 }
 for(const c of p.components)assert.ok(defs[c.typeId],'Unknown motor catalog '+c.typeId);
 const by=new Map(p.components.map(c=>[c.id,c]));
 for(const w of p.wires)for(const terminal of [w.from,w.to]){
  const part=by.get(terminal.c);
  assert.ok(part,'Orphan terminal component '+terminal.c);
  assert.ok(defs[part.typeId].pins.some(pin=>pin.id===terminal.p),
   'Not a catalog terminal '+terminal.c+'/'+terminal.p);
 }
});
for(const n of [1,2])test('SC'+(163+n)+' single phase K1 command path is catalog-wired, without auxiliary winding acceptance',()=>{
 const item=lesson(n),p=structuredClone(item.project),c=Object.fromEntries(p.components.map(x=>[x.id,x]));
 assert.equal(c.motor.typeId,'motor-1p');
 assert.equal(c.main.ref,'K1');
 assert.equal(c.coil.ref,'K1');
 assert.equal(item.pedagogyReview.specialMotorAcceptance,false);
 // The operating conditions below are intended candidate checks. This
 // suite has NOT been run on native Node/Windows in the current commit.
 const seq=[[0,false,false,false],[100,true,false,true],
  [200,false,false,n===2],[300,false,true,false]];
 for(const [now,start,stop,coil] of seq){
  c.start.state=start;c.stop.state=stop;
  const out=S.solve(p,defs,{now});
  assert.equal(out.stable,true,'One-phase contactor nonconvergent '+now);
  assert.equal(!!out.blocked,false);
  assert.equal(!!out.shortCircuit,false);
  assert.equal(!!c.coil._active,coil,'K1 command/hold '+now);
 }
});
test('SC170 synchronous/VFD card remains only an unenergized reference',()=>{
 const item=lesson(7);
 assert.equal(item.project.wires.length,0);
 assert.ok(item.project.components.some(c=>c.typeId==='tutorial-synchronous-motor'));
 assert.equal(item.pedagogyReview.specialMotorAcceptance,false);
});
