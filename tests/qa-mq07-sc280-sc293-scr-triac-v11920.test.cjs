'use strict';
// Historical all-quiz fixture updated to the current real source topology.
// Real terminalized lessons stay wired; unsupported reference cards stay reference-only.
// Structural/native initial smoke is not physical, visual, or independent acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();

const rows=[["electronic-switching-outline-038",13,"SOURCE_WIRED_SCR_AKG_VIRTUAL_STRUCTURE",null],["electronic-switching-outline-039",6,"SOURCE_WIRED_DC_SCR_LATCH_MEASUREMENT_PENDING",null],["electronic-switching-outline-040",6,"SOURCE_WIRED_SCR_GATE_TRIGGER_PENDING",null],["electronic-switching-outline-041",0,"REVIEW","INTRO_SWITCHING_FAMILY_REFERENCE_ONLY"],["electronic-component-basics-outline-022",0,"REVIEW","SAFETY_SIGNS_VISUAL_NOT_VERIFIED"],["electronic-switching-outline-042",7,"SOURCE_WIRED_SCR_STOP_RETRIGGER_PENDING",null],["electronic-switching-outline-043",11,"SOURCE_WIRED_VIRTUAL_SCR_AKG_LATCH",null],["electronic-switching-outline-044",6,"SOURCE_WIRED_SCR_DC_PRACTICE_PENDING",null],["electronic-switching-outline-045",7,"SOURCE_WIRED_SCR_STOP_PRACTICE_PENDING",null],["electronic-switching-outline-046",7,"SOURCE_WIRED_ISOLATED_AC_SCR_WAVE_PENDING",null],["electronic-switching-outline-047",7,"SOURCE_WIRED_ISOLATED_AC_TRIAC_NATIVE_PENDING",null],["electronic-switching-outline-048",0,"REVIEW","NO_DIAC_BREAKOVER_MEASUREMENT"],["electronic-switching-outline-049",0,"REVIEW","NO_TRIAC_PACKAGE_PIN_VALIDATION"],["electronic-switching-outline-050",7,"SOURCE_WIRED_TRIAC_BIDIRECTIONAL_MEASUREMENT_PENDING",null]];
function verify(l,row){
 const [id,wires,status,issue]=row, p=l?.project, wired=wires>0;
 assert.ok(p,id+' project missing');
 assert.equal(l.kind,wired?'wiring':'quiz',id+' kind');
 assert.equal(p.referenceOnly===true,!wired,id+' referenceOnly');
 assert.equal(p.wires.length,wires,id+' topology count');
 assert.equal(l.steps.length,wires,id+' terminal lesson steps');
 assert.equal(l.pedagogyReview.mq07ScrTriacScope,'SC280_SC293');
 assert.equal(l.pedagogyReview.titleTopologyStatus,status,id+' status');
 assert.equal(l.pedagogyReview.titleTopologyIssue,issue,id+' issue');
 for(const c of p.components)assert.ok(defs[c.typeId],id+' catalog '+c.typeId);
 if(wired){
  for(const wire of p.wires)for(const end of [wire.from,wire.to]){
   const component=p.components.find(c=>c.id===end.c);
   assert.ok(component,id+' missing wire component '+end.c);
   assert.ok(defs[component.typeId].pins.some(pin=>pin.id===end.p),id+' invalid terminal '+end.c+'/'+end.p);
  }
 }else assert.ok(l.beginnerSteps.some(s=>s.includes('PASS verme')),id+' review warning');
 for(const flag of ['physicalAcceptance','windowsVisualAcceptance','independentPedagogicalAcceptance','nativeDynamicAcceptance','manufacturerPinAcceptance','scrLatchAcceptance','triacAcRuntimeAcceptance','isolationAcceptance','acPhaseRuntimeAcceptance','optoFlasherRuntimeAcceptance','sensorIoAcceptance'])
  assert.notEqual(l.pedagogyReview[flag],true,id+' '+flag+' no false pass');
 assert.ok(l.quiz?.options?.length>1,id+' quiz retained');
}
for(const row of rows)test(row[0]+' verified real wiring / quiz reference',()=>verify(L.byId[row[0]],row));
test('negative contract test: fake quiz, fake wiring, and broken terminal graph must be rejected',()=>{
 const wired=rows.find(x=>x[1]>0),ref=rows.find(x=>x[1]===0);
 const a=L.byId[wired[0]],b=L.byId[ref[0]];
 assert.throws(()=>verify({...a,kind:'quiz'},wired));
 assert.throws(()=>verify({...b,kind:'wiring'},ref));
 assert.throws(()=>verify({...a,project:{...a.project,wires:a.project.wires.slice(1)}},wired));
});
test('SCR and triac terminal sources remain separately scoped and physically pending',()=>{
 const a=L.byId['electronic-switching-outline-046'],b=L.byId['electronic-switching-outline-047'];
 assert.ok(a.project.wires.length>0&&b.project.wires.length>0);
 assert.equal(a.pedagogyReview.physicalAcceptance,false);
 assert.equal(b.pedagogyReview.physicalAcceptance,false);
 assert.notEqual(a.id,b.id);
});
test('1655 canonical lessons and exact source identity order unchanged',()=>{
 assert.equal(L.lessons.length,1655);
 const index=L.lessons.findIndex(x=>x.id===rows[0][0]);
 assert.ok(index>=0);
 assert.deepEqual(L.lessons.slice(index,index+rows.length).map(x=>x.id),rows.map(x=>x[0]));
});