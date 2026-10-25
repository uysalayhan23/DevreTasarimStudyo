'use strict';
// Historical all-quiz fixture updated to the current real source topology.
// Real terminalized lessons stay wired; unsupported reference cards stay reference-only.
// Structural/native initial smoke is not physical, visual, or independent acceptance.
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();

const rows=[["electronic-switching-outline-051",7,"SOURCE_WIRED_TRIAC_TRIGGER_RUNTIME_PENDING",null],["electronic-switching-outline-052",0,"REVIEW","NO_TRIAC_MULTIMETER_HEALTH_MEASUREMENT"],["electronic-switching-outline-053",0,"REVIEW","NO_TRIAC_MULTIMETER_PIN_IDENTIFICATION"],["electronic-switching-outline-054",7,"SOURCE_WIRED_DC_TRIAC_HOLDING_PENDING",null],["electronic-switching-outline-055",7,"SOURCE_WIRED_ISOLATED_TRIAC_DIMMER_RMS_PENDING",null],["electronic-switching-outline-056",0,"REVIEW","NO_OPTOCOUPLER_FAMILY_REFERENCE"],["electronic-switching-outline-057",7,"SOURCE_WIRED_TLP521_OPTICAL_FUNCTION_PENDING",null],["electronic-switching-outline-058",0,"REVIEW","NO_OPTOCOUPLER_VARIETY_RUNTIME"],["electronic-switching-outline-059",0,"REVIEW","NO_TLP521_HEALTH_PROBE_RESULT"],["electronic-switching-outline-060",14,"SOURCE_WIRED_OPTO_TRIAC_FLASHER_PENDING",null],["sensor-analog-apps-outline-023",0,"REVIEW","NO_SENSOR_TRANSDUCER_IO_EVIDENCE"],["sensor-analog-apps-outline-024",0,"REVIEW","NO_SENSOR_CHARACTERISTIC_MEASUREMENT"],["sensor-analog-apps-outline-025",0,"REVIEW","NO_SENSOR_TYPE_RUNTIME_COMPARISON"],["electronic-component-basics-outline-023",0,"REVIEW","NO_SENSOR_USAGE_DOMAIN_EVIDENCE"]];
function verify(l,row){
 const [id,wires,status,issue]=row, p=l?.project, wired=wires>0;
 assert.ok(p,id+' project missing');
 assert.equal(l.kind,wired?'wiring':'quiz',id+' kind');
 assert.equal(p.referenceOnly===true,!wired,id+' referenceOnly');
 assert.equal(p.wires.length,wires,id+' topology count');
 assert.equal(l.steps.length,wires,id+' terminal lesson steps');
 assert.equal(l.pedagogyReview.mq07TriacOptoScope,'SC294_SC307');
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
test('DC triac and isolated opto flasher sources remain separately scoped and physically pending',()=>{
 const a=L.byId['electronic-switching-outline-054'],b=L.byId['electronic-switching-outline-060'];
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