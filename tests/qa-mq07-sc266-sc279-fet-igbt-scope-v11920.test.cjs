'use strict';
// Historical 14 quiz cards were later repaired selectively. Never revert real source wiring
// just to satisfy a stale quiz expectation; never promote the remaining concept card.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const rows=[
 ['electronic-switching-outline-029',19,'SOURCE_WIRED_NATIVE_FET_COMPARISON'],
 ['electronic-switching-outline-030',19,'SOURCE_WIRED_NATIVE_FET_COMPARISON'],
 ['electronic-switching-outline-031',9,'SOURCE_WIRED_J113_GDS_LOAD'],
 ['electronic-switching-outline-032',8,'SOURCE_REPAIRED_GDS_WIRED'],
 ['electronic-switching-outline-033',19,'SOURCE_WIRED_NATIVE_FET_COMPARISON'],
 ['electronic-switching-outline-034',12,'SOURCE_WIRED_FET_RC_DELAY_DYNAMIC_PENDING'],
 ['electronic-switching-outline-035',12,'SOURCE_WIRED_MOSFET_FUNCTION_TEST_DYNAMIC_PENDING'],
 ['motor-direct-power-outline-021',11,'SOURCE_WIRED_PWM_MOTOR_NATIVE_PENDING'],
 ['electronic-switching-outline-036',9,'SOURCE_WIRED_DC_IGBT_NATIVE_PENDING'],
 ['electronic-component-basics-outline-018',14,'SOURCE_WIRED_VIRTUAL_IGBT_CHARACTERISTICS'],
 ['electronic-component-basics-outline-019',15,'SOURCE_WIRED_IGBT_GATE_COLLECTOR_INDEPENDENT'],
 ['electronic-component-basics-outline-020',0,'REVIEW'],
 ['electronic-component-basics-outline-021',13,'SOURCE_WIRED_VIRTUAL_IGBT_DC_PWM_DIMMER'],
 ['electronic-switching-outline-037',6,'SOURCE_WIRED_DC_SCR_NATIVE_PENDING']
];
for(const [id,wires,status] of rows)test(id+' current FET/IGBT circuit vs concept scope',()=>{
 const l=L.byId[id],p=l?.project;assert.ok(l&&p,id);
 const wired=wires>0;
 assert.equal(l.kind,wired?'wiring':'quiz');
 assert.equal(p.referenceOnly===true,!wired);
 assert.equal(p.wires.length,wires);
 assert.equal(l.steps.length,wires);
 assert.equal(l.pedagogyReview.titleTopologyStatus,status);
 for(const c of p.components)assert.ok(defs[c.typeId],id+' missing '+c.typeId);
 if(wired){
  assert.ok(p.components.some(c=>/jfet|mosfet|igbt|scr|pwm/i.test(c.typeId)),id);
  for(const w of p.wires)for(const e of [w.from,w.to]){
   const component=p.components.find(c=>c.id===e.c),d=defs[component?.typeId];
   assert.ok(d?.pins?.some(pin=>pin.id===e.p),id+' '+e.c+'/'+e.p);
  }
 }else{
  assert.equal(l.pedagogyReview.titleTopologyIssue,'SINGLE_IGBT_NOT_FULL_DEVICE_VARIETY');
  assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')));
 }
 for(const k of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance'])
  assert.notEqual(l.pedagogyReview[k],true,id+' '+k);
 assert.equal(l.pedagogyReview.nativeDynamicAcceptance,false);
});
test('FET family, analog RC delay and PWM motor topics stay distinct even when terminalized',()=>{
 const types=id=>L.byId[id].project.components.map(c=>c.typeId);
 for(const id of ['electronic-switching-outline-030','electronic-switching-outline-033']){
  assert.ok(types(id).includes('j113-jfet')&&types(id).includes('irf540n-mosfet'));
 }
 assert.ok(types('electronic-switching-outline-034').includes('capacitor'));
 const motor=L.byId['motor-direct-power-outline-021'];
 assert.ok(types(motor.id).includes('virtual-pwm-generator-v1'));
 assert.ok(types(motor.id).includes('motor-dc'));
 assert.equal(motor.pedagogyReview.physicalAcceptance,false);
 const ac=L.byId['electronic-component-basics-outline-021'];
 assert.equal(ac.pedagogyReview.titleTopologyIssue,'AC_PHASE_DIMMER_RUNTIME_NOT_SUPPORTED');
});
test('source ordering, existing sensor review evidence and unmodified locked lessons persist',()=>{
 assert.equal(L.lessons.length,1655);
 const i=L.lessons.findIndex(x=>x.id==='electronic-switching-outline-029');
 assert.ok(i>0);assert.deepEqual(Array.from(L.lessons.slice(i,i+14),x=>x.id),rows.map(x=>x[0]));
 for(const n of [2,3,4,5,6,7,8,9,10,13,14])
  assert.equal(L.byId['sensor-analog-apps-src-'+String(n).padStart(2,'0')].topicReview?.sourceQuestionPreserved,true);
 assert.deepEqual(L.byId['panel-power-systems-src-04'].project.components.map(c=>c.typeId),['mcb-1p','rcd-2p']);
});
