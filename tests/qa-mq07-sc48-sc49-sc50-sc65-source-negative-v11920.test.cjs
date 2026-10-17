'use strict';
// Native Node 22+ source/topology and *negative fixture* QA.
// This does NOT establish real time-domain or physical LM358 behavior.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const clone=x=>JSON.parse(JSON.stringify(x));
const has=(p,a,ap,b,bp)=>p.wires.some(w=>
 (w.from?.c===a&&w.from.p===ap&&w.to?.c===b&&w.to.p===bp)||
 (w.from?.c===b&&w.from.p===bp&&w.to?.c===a&&w.to.p===ap));
function edge(p,a,ap,b,bp){
 assert.ok(has(p,a,ap,b,bp),'Missing exact physical link '+a+'/'+ap+' ↔ '+b+'/'+bp);
}
function item(p,id,type){
 const c=p.components.find(c=>c.id===id);
 assert.ok(c,'Missing component '+id);
 assert.equal(c.typeId,type,id+' catalog product substitution');
 assert.ok(defs[c.typeId],id+' missing catalog definition');
 return c;
}
function verifiedSourceOnly(lesson){
 assert.ok(lesson&&lesson.project,'Canonical lesson missing');
 const p=lesson.project;
 assert.equal(lesson.kind,'wiring');
 assert.ok(p.wires.length,'Circuit must not silently become a theory card');
 assert.equal(p.components.length,lesson.materials.length,'Material/component count');
 const ids=new Set();
 for(const c of p.components){
  assert.ok(!ids.has(c.id),'Duplicate component '+c.id);
  ids.add(c.id);
  const m=lesson.materials.find(m=>m.componentId===c.id);
  assert.ok(m,'Material missing for '+c.id);
  assert.equal(m.typeId,c.typeId,'Material type mismatch '+c.id);
  assert.ok(defs[c.typeId],'No actual catalog definition for '+c.typeId);
 }
 for(const w of p.wires)for(const e of [w.from,w.to]){
  const c=p.components.find(c=>c.id===e.c);
  assert.ok(c,'Orphan wire component '+e.c);
  assert.ok(defs[c.typeId].pins.some(pin=>pin.id===e.p),'Invalid physical pin '+e.c+'/'+e.p);
 }
 item(p,'u1','lm358p-dip8');
 const pins=new Set(defs['lm358p-dip8'].pins.map(x=>x.id));
 for(const pin of ['1','2','3','4','8'])assert.ok(pins.has(pin),'LM358P pin absent '+pin);
 edge(p,'g1','P','u1','8');
 edge(p,'g1','M','u1','4');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.windowsVisualAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
}
function validateDelay(lesson,charge,bleed){
 verifiedSourceOnly(lesson);
 const p=lesson.project;
 assert.equal(item(p,'rch','resistor').resistance,charge,'RC charge resistor drift');
 assert.equal(item(p,'rd','resistor').resistance,bleed,'RC discharge resistor drift');
 assert.equal(item(p,'c1','capacitor').capacitance,0.0001,'RC capacitor drift');
 item(p,'s1','push-no');
 assert.equal(item(p,'ref1','resistor').resistance,10000);
 assert.equal(item(p,'ref2','resistor').resistance,10000);
 for(const [a,ap,b,bp] of [
  ['g1','P','s1','13'],['s1','14','rch','1'],
  ['rch','2','c1','1'],['c1','2','g1','M'],
  ['rch','2','rd','1'],['rd','2','g1','M'],
  ['rch','2','u1','3'],
  ['g1','P','ref1','1'],['ref1','2','ref2','1'],
  ['ref2','2','g1','M'],['ref1','2','u1','2'],
  ['u1','1','v1','1'],['v1','2','g1','M']
 ])edge(p,a,ap,b,bp);
 assert.equal(lesson.pedagogyReview.dynamicTimingAccepted,false,'Unverified delay acceptance');
}
function validateRectifier(lesson){
 verifiedSourceOnly(lesson);
 const p=lesson.project;
 item(p,'rv1','potentiometer');
 item(p,'d1','1n4148-do35');
 item(p,'r5','resistor');
 for(const pin of ['A','K'])assert.ok(defs['1n4148-do35'].pins.some(x=>x.id===pin));
 for(const [a,ap,b,bp] of [
  ['rv1','2','u1','3'],['u1','1','d1','A'],
  ['d1','K','u1','2'],['d1','K','r5','1'],
  ['r5','2','r3','2'],['d1','K','v1','1'],
  ['v1','2','r3','2'],['g1','P','r3','1'],
  ['r3','2','r4','1'],['r4','2','g1','M']
 ])edge(p,a,ap,b,bp);
 assert.equal(item(p,'r3','resistor').resistance,10000);
 assert.equal(item(p,'r4','resistor').resistance,10000);
 assert.equal(lesson.pedagogyReview.dcTransferAccepted,false,'Unverified DC transfer acceptance');
 assert.equal(lesson.pedagogyReview.acWaveformAcceptance,false,'Unverified AC rectification acceptance');
}
function validateSchmitt(lesson){
 verifiedSourceOnly(lesson);
 const p=lesson.project;
 item(p,'in','potentiometer');
 assert.equal(item(p,'r1','resistor').resistance,10000);
 assert.equal(item(p,'r2','resistor').resistance,47000);
 for(const [a,ap,b,bp] of [
  ['in','2','r1','1'],['r1','2','u1','3'],
  ['u1','1','r2','1'],['r2','2','u1','3'],
  ['ref1','2','u1','2'],
  ['g1','P','ref1','1'],['ref1','2','ref2','1'],
  ['ref2','2','g1','M']
 ])edge(p,a,ap,b,bp);
 assert.ok(!has(p,'in','2','u1','3'),'Potentiometer bypasses hysteresis input resistor');
 assert.equal(lesson.pedagogyReview.dynamicHysteresisAccepted,false,'Unverified hysteresis acceptance');
}
function remove(p,a,ap,b,bp){
 const i=p.wires.findIndex(w=>
 (w.from?.c===a&&w.from.p===ap&&w.to?.c===b&&w.to.p===bp)||
 (w.from?.c===b&&w.from.p===bp&&w.to?.c===a&&w.to.p===ap));
 assert.ok(i>=0,'Fixture link not found');
 p.wires.splice(i,1);
}

test('SC48/SC49 real RC, comparator, DIP-8 and material graphs retain native-pending status',()=>{
 validateDelay(L.byId['opamp-apps-src-09'],100000,1000000);
 validateDelay(L.byId['opamp-apps-src-10'],1000,100000);
});
test('SC48/SC49 negative fixtures reject missing RC paths, wrong thresholds and fake timing acceptance',()=>{
 for(const [id,charge,bleed] of [
  ['opamp-apps-src-09',100000,1000000],
  ['opamp-apps-src-10',1000,100000]
 ]){
  const lesson=L.byId[id];
  const make=()=>clone(lesson);
  let bad=make();remove(bad.project,'rch','2','c1','1');
  assert.throws(()=>validateDelay(bad,charge,bleed),/Missing exact physical link/);
  bad=make();remove(bad.project,'rd','2','g1','M');
  assert.throws(()=>validateDelay(bad,charge,bleed),/Missing exact physical link/);
  bad=make();bad.project.components.find(c=>c.id==='c1').capacitance=0;
  assert.throws(()=>validateDelay(bad,charge,bleed),/RC capacitor drift/);
  bad=make();bad.project.components.find(c=>c.id==='ref1').resistance=22000;
  assert.throws(()=>validateDelay(bad,charge,bleed));
  bad=make();bad.pedagogyReview.dynamicTimingAccepted=true;
  assert.throws(()=>validateDelay(bad,charge,bleed),/Unverified delay acceptance/);
 }
});
test('SC50 real A/K diode feedback and 12 V reference are only DC-transfer candidates',()=>{
 validateRectifier(L.byId['opamp-apps-src-15']);
});
test('SC50 negative fixtures reject open/reversed diode feedback and premature acceptance',()=>{
 const lesson=L.byId['opamp-apps-src-15'],make=()=>clone(lesson);
 let bad=make();remove(bad.project,'d1','K','u1','2');
 assert.throws(()=>validateRectifier(bad),/Missing exact physical link/);
 bad=make();bad.project.wires.find(w=>w.from?.c==='u1'&&w.to?.c==='d1').to.p='K';
 assert.throws(()=>validateRectifier(bad),/Missing exact physical link/);
 bad=make();bad.pedagogyReview.dcTransferAccepted=true;
 assert.throws(()=>validateRectifier(bad),/Unverified DC transfer acceptance/);
 bad=make();bad.pedagogyReview.acWaveformAcceptance=true;
 assert.throws(()=>validateRectifier(bad),/Unverified AC rectification acceptance/);
});
test('SC65 Schmitt has series input plus positive feedback, but no dynamic hysteresis acceptance',()=>{
 validateSchmitt(L.byId['oscillator-filter-apps-src-13']);
});
test('SC65 negative fixtures reject absent feedback, input bypass and false hysteresis acceptance',()=>{
 const lesson=L.byId['oscillator-filter-apps-src-13'],make=()=>clone(lesson);
 let bad=make();remove(bad.project,'r2','2','u1','3');
 assert.throws(()=>validateSchmitt(bad),/Missing exact physical link/);
 bad=make();bad.project.wires.push({from:{c:'in',p:'2'},to:{c:'u1',p:'3'}});
 assert.throws(()=>validateSchmitt(bad),/bypasses hysteresis input resistor/);
 bad=make();bad.project.components.find(c=>c.id==='r2').resistance=0;
 assert.throws(()=>validateSchmitt(bad));
 bad=make();bad.pedagogyReview.dynamicHysteresisAccepted=true;
 assert.throws(()=>validateSchmitt(bad),/Unverified hysteresis acceptance/);
});
