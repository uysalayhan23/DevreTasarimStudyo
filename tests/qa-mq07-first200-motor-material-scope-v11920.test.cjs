'use strict';
// MQ-12 source-only SC126–181 audit. Do not infer physical or dynamic PASS.
// Requires a later consolidated native Windows/Node execution.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const Inventory=require('../scripts/qa-mq07-first200-live-inventory-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const groups=[
 ['motor-direct-power',126,143],
 ['motor-start-speed',144,155],
 ['motor-braking',156,163],
 ['motor-special',164,171],
 ['motor-sequence',172,181]
];
const ids=(topic,start,end)=>Array.from({length:end-start+1},(_,i)=>({
 sc:start+i,id:topic+'-src-'+String(i+1).padStart(2,'0')
}));
const lesson=id=>{const l=L.byId[id];assert.ok(l,'Missing curriculum '+id);return l};
function topologyAndMaterials(sc,id){
 const l=lesson(id),p=l.project;
 assert.equal(L.lessons[sc-1].id,id,'Canonical scene order '+sc);
 assert.ok(p&&Array.isArray(p.components)&&Array.isArray(p.wires));
 assert.equal(p.components.length,l.materials.length,'Motor material count '+id);
 const parts=new Map(p.components.map(c=>[c.id,c]));
 assert.equal(parts.size,p.components.length,'Duplicate motor component ID '+id);
 const ids=new Set();
 for(const m of l.materials){
  assert.ok(!ids.has(m.componentId),'Duplicate material '+id+'/'+m.componentId);
  ids.add(m.componentId);
  const c=parts.get(m.componentId);
  assert.ok(c,'Material without real source component '+id+'/'+m.componentId);
  assert.equal(m.typeId,c.typeId,'Wrong material type '+id+'/'+m.componentId);
  assert.equal(m.label,c.label||c.ref,'Wrong learner-facing label '+id+'/'+m.componentId);
  assert.ok(typeof m.why==='string'&&m.why.trim().length>=16,'Missing role '+id+'/'+m.componentId);
  assert.ok(defs[c.typeId],'Unknown product '+id+'/'+c.typeId);
 }
 for(const w of p.wires)for(const ep of [w.from,w.to]){
  const c=parts.get(ep.c);
  assert.ok(c,'Orphan motor wire '+id+'/'+ep.c);
  assert.ok(defs[c.typeId]?.pins?.some(x=>String(x.id)===String(ep.p)),
   'Noncatalog physical motor terminal '+id+'/'+ep.c+'/'+ep.p);
 }
 assert.equal(l.pedagogyReview.physicalAcceptance,false,'No physical acceptance '+id);
 assert.equal(l.pedagogyReview.windowsVisualAcceptance,false,'No Windows QA acceptance '+id);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false,'No independent pedagogical acceptance '+id);
 return l;
}
test('SC126–181 final live motor material identity, label, physical terminal graph and acceptance gates',()=>{
 const report=Inventory.audit({L,defs});
 for(const [topic,start,end] of groups)for(const {sc,id} of ids(topic,start,end)){
  const l=topologyAndMaterials(sc,id);
  const current=report.rows[sc-1];
  assert.equal(current.id,id);
  assert.equal(current.scNumber,sc);
  assert.equal(current.currentTitleIssue,l.pedagogyReview.titleTopologyIssue||null);
  assert.equal(current.physicalAcceptance,false);
  assert.equal(current.windowsVisualAcceptance,false);
  assert.equal(current.independentPedagogicalAcceptance,false);
 }
 assert.equal(report.acceptance.first200,'REVIEW');
 assert.equal(report.acceptance.nativeNode,'NOT_RUN');
});
function motorRole(sc,id,typeId,expectedDescription){
 const l=topologyAndMaterials(sc,id);
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.ok(l.pedagogyReview.titleTopologyIssue,'Unresolved title issue silently cleared '+id);
 const motors=l.project.components.filter(c=>c.typeId===typeId);
 assert.equal(motors.length,1,'Exactly one existing target motor '+id);
 const m=l.materials.find(m=>m.componentId===motors[0].id);
 assert.ok(m,'Missing existing motor role '+id);
 assert.match(m.why,expectedDescription,'Actual motor category not explained '+id);
 assert.match(m.why,/Başlıkta geçen ek işlev.*doğrulanmadığı/i,
  'False title-specific motor acceptance in material panel '+id);
 assert.match(m.why,/PASS değildir/i);
 return {l,m};
}
test('SC156–163 all eight brake topics use honest unwired catalog references',()=>{
 for(const {sc,id} of ids('motor-braking',156,163)){
  const l=topologyAndMaterials(sc,id),types=l.project.components.map(c=>c.typeId);
  assert.equal(l.pedagogyReview.brakingAcceptance,false);
  assert.equal(l.kind,'quiz');
  assert.equal(l.project.wires.length,0);
  assert.equal(l.project.referenceOnly,true);
  assert.equal(l.steps.length,0);
  if([156,157,162,163].includes(sc))assert.ok(types.includes('tutorial-mechanical-brake'));
  if([158,159,160,161].includes(sc))assert.ok(types.includes('supply-dc-plus'));
  assert.match(l.explanation,/frenleme süreci/i);
  assert.equal(l.pedagogyReview.titleTopologyIssue,
   'BRAKE_REFERENCE_NATIVE_PENDING_'+String(sc-155).padStart(2,'0'));
  if([158,159,161,162,163].includes(sc)){
   assert.equal(l.quiz.options.length,3);
   assert.ok(l.quiz.why.length>20);
  }
 }
});
test('SC164–171 correct one-phase wired motor and synchronous product references replace 3-phase surrogates',()=>{
 for(const {sc,id} of ids('motor-special',164,171)){
  const l=topologyAndMaterials(sc,id);
  assert.equal(l.pedagogyReview.specialMotorAcceptance,false);
  assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
  if(sc===164||sc===165){
   assert.equal(l.kind,'wiring');
   assert.equal(l.project.wires.length,sc===164?8:10);
   assert.equal(l.project.components.filter(c=>c.typeId==='motor-1p').length,1);
   assert.ok(l.project.components.some(c=>c.typeId==='supply-1p'));
   assert.ok(!l.project.components.some(c=>c.typeId==='motor-3p'));
  }else{
   assert.equal(l.kind,'quiz');
   assert.equal(l.project.wires.length,0);
   assert.equal(l.project.referenceOnly,true);
   assert.ok(l.project.components.some(c=>
    ['motor-1p','tutorial-synchronous-motor','hcfa-sv-x2mh040a-n2ln'].includes(c.typeId)));
  }
 }
});
test('SC172–181 material rows agree with six wired motor topologies and remaining DOL reviews',()=>{
 const two=new Set([172,173,174,175,177,180,181]);
 const scope={
  172:'TWO_MOTOR_SEQUENTIAL_NATIVE_PENDING',
  173:'TWO_MOTOR_PERIODIC_M2_NATIVE_PENDING',
  174:'TWO_MOTOR_ALTERNATING_TIMER_NATIVE_PENDING',
  175:'TWO_MOTOR_DUAL_THERMAL_NATIVE_PENDING',
  176:'LIMIT_AUTO_REVERSE_SOURCE_NATIVE_PENDING',
  177:'TWO_MOTOR_DELAYED_REVERSE_NATIVE_PENDING',
  178:'TIMED_FORWARD_REVERSE_NATIVE_PENDING',
  180:'TWO_MOTOR_INDEPENDENT_NATIVE_PENDING',
  181:'TWO_MOTOR_CONVEYOR_SENSOR_NATIVE_PENDING'
 };
 for(const {sc,id} of ids('motor-sequence',172,181)){
  const l=topologyAndMaterials(sc,id),real=two.has(sc);
  assert.equal(l.pedagogyReview.multiMotorAcceptance,false);
  assert.equal(l.project.components.filter(c=>c.typeId==='motor-3p').length,real?2:1);
  assert.equal(l.project.components.filter(c=>c.typeId==='coil-contactor').length,
   sc===174?3:real||sc===176||sc===178?2:1);
  if(real){
   const second=l.project.components.find(c=>c.id==='motor2');
   assert.ok(second&&second.ref==='M2');
   const material=l.materials.find(m=>m.componentId===second.id);
   assert.ok(material&&material.typeId==='motor-3p');
   assert.equal(material.label,second.label);
  }else if(sc===176){
   assert.equal(l.project.components.filter(c=>c.typeId==='limit-nc').length,2);
   assert.equal(l.project.components.filter(c=>c.typeId==='coil-relay').length,2);
   assert.ok(l.materials.some(x=>x.componentId==='ls1'));
   assert.ok(l.materials.some(x=>x.componentId==='ls2'));
  }else if(sc===178){
   assert.equal(l.project.components.filter(c=>c.typeId==='motor-3p').length,1);
   assert.equal(l.project.components.filter(c=>c.typeId==='coil-delay-on').length,2);
   assert.ok(l.materials.some(m=>m.componentId==='ktForward'));
   assert.ok(l.materials.some(m=>m.componentId==='ktNeutral'));
  }else{
   const {m}=motorRole(sc,id,'motor-3p',/tek motorlu DOL/);
   assert.match(m.why,/tek motorlu DOL/);
  }
  if(scope[sc])assert.equal(l.pedagogyReview.titleTopologyIssue,scope[sc]);
 }
});
test('negative fixture: stale motor label and invented motor scope acceptance remain detectable',()=>{
 const l=structuredClone(lesson('motor-sequence-src-01')),motor=l.project.components.find(c=>c.typeId==='motor-3p');
 const material=l.materials.find(m=>m.componentId===motor.id);
 material.label='İki motorlu sıralı kumanda';
 const bad=Inventory.inspectLesson(l,defs);
 assert.ok(bad.issues.some(i=>i.code==='MATERIAL_LABEL_MISMATCH'&&i.componentId===motor.id));
 assert.equal(l.pedagogyReview.multiMotorAcceptance,false);
 // The former fixture only checked that true != false; that tautology
 // never asked Inventory to reject forged function acceptance.
 for(const [id,field] of [
  ['motor-braking-src-01','brakingAcceptance'],
  ['motor-special-src-01','specialMotorAcceptance'],
  ['motor-sequence-src-01','multiMotorAcceptance'],
  ['plc-hardware-programming-src-13','plcAdvancedLogicAcceptance'],
  ['plc-hardware-programming-src-14','plcAdvancedLogicAcceptance']
 ]){
  const original=lesson(id);
  assert.ok(original.pedagogyReview.titleTopologyIssue,id+' must remain REVIEW');
  assert.equal(original.pedagogyReview[field],false,id+' function already accepted');
  const forged=structuredClone(original);
  forged.pedagogyReview[field]=true;
  const issues=Inventory.inspectLesson(forged,defs).issues;
  assert.ok(issues.some(issue=>
   issue.code==='OPEN_TITLE_WITH_UNVERIFIED_FUNCTION'&&issue.field===field),
   id+' forged '+field+' escaped source review');
  assert.ok(!Inventory.inspectLesson(original,defs).issues.some(issue=>
   issue.code==='OPEN_TITLE_WITH_UNVERIFIED_FUNCTION'),
   id+' review falsely rejects an unaccepted function');
 }
 // Original circuit content stays untouched and remains partial review.
 assert.equal(Inventory.audit({L,defs}).acceptance.first200,'REVIEW');
});
