'use strict';
// MQ-12: reproducible 722 wiring lessons / three consecutive native solver phases.
// Operates on clones; does not edit canonical projects, drive physical hardware, or mark pedagogy accepted.
const fs=require('node:fs'),path=require('node:path');
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const ROOT=path.resolve(__dirname,'..');
const toggles=new Set(['push-no','push-nc','wall-switch','wall-vavien','wall-commutator',
 'wall-intermediate','bell-push','bell-light-push','limit-nc','limit-no','switch-no',
 'switch-nc','proximity','autonics-pr12-npn']);
const clone=x=>JSON.parse(JSON.stringify(x));
// MQ-12: an operated pushbutton/sensor changing its OWN internal state is not
// evidence that a load, actuator or meter responded. Observe downstream sinks only.
const observedKinds=new Set(['lamp','led','buzzer','siren','flasher','coil','coil-valve',
 'relay-protection','contactor3','motor','motor3','motor-yd','motor-1p','meter-v','meter-a']);
const state=(p,defs)=>JSON.stringify(p.components.filter(c=>{
 const d=defs[c.typeId];return !!d&&(observedKinds.has(d.kind)||!!d.instrument||
  !!d.isPLC);
}).map(c=>[c.id,!!c._active,!!c._powered,
 Number(c._currentValue)||0,!!c._lampActive,c._spin||0,
 c._meter?.value??null,c._meter?.display??null,c._voltageValue??null]));
function audit({L=QA.curriculum(),defs=QA.catalog(),solver=Simulation}={}){
 const report={qa:'MQ-12 native 722 lesson sequential stability',source:'current repo source',
  lessonCount:L.lessons.length,withWires:0,checkedInitial:0,checkedChanged:0,checkedRestored:0,
  stableInitial:0,stableChanged:0,stableRestored:0,controls:0,observedOutputChanges:0,
  noControl:0,noControlLessons:[],missingDefinitionLessons:[],unsupportedActuatorLessons:[],passiveLessons:[],unresponsiveControls:[],solverFailures:[],restorationChecked:0,restorationFailures:[],missingDefinitions:[],failures:[],
  scope:'Initial → one selected virtual control change or elapsed time → release/elapsed time. Not exhaustive dynamic or visual QA.'};
 for(const lesson of L.lessons){
  const raw=lesson.project;
  if(!raw||!Array.isArray(raw.wires)||!Array.isArray(raw.components)){
   report.failures.push({id:lesson.id,phase:'structure',reason:'missing graph'});continue;
  }
  if(!raw.wires.length)continue;
  report.withWires++;
  const missing=[...new Set(raw.components.map(c=>c.typeId).filter(id=>!defs[id]))];
  if(missing.length){
   const issue={id:lesson.id,types:missing,classification:'MISSING_DEFINITIONS'};
   report.missingDefinitions.push(issue);
   report.missingDefinitionLessons.push(issue);
   continue;
  }
  const p=clone(raw),control=p.components.find(c=>toggles.has(c.typeId));
  const sensing=control?.sensing&&control.sensing.target&&control.sensing.target!=='none';
  const initialDistance=sensing?Number(control.sensing.distance):null;
  const sensorRange=sensing?Math.max(.1,Number(control.sensing.range)||4):0;
  if(sensing&&!Number.isFinite(initialDistance)){
   report.failures.push({id:lesson.id,phase:'structure',reason:'Invalid or missing sensor distance; virtual actuation not verified'});
   continue;
  }
  if(control)report.controls++;
  else {
   report.noControl++;
   const candidates=p.components.filter(c=>{const d=defs[c.typeId]||{};
    return /switch|push|button|sensor|relay|timer|contactor|proximity|limit/i.test(c.typeId||'')||
     /switch|push|button|sensor|relay|timer|contactor|proximity|limit/i.test(d.kind||'');
   }).map(c=>c.typeId);
   const observable=p.components.filter(c=>{const d=defs[c.typeId];return d&&(observedKinds.has(d.kind)||d.instrument||d.isPLC)}).length;
   const detail={id:lesson.id,reason:candidates.length?'Unsupported or unselected virtual actuator':'No recognized virtual actuator',candidateTypes:[...new Set(candidates)],observableCount:observable,classification:candidates.length?'UNSUPPORTED_ACTUATOR':'PASSIVE_STABILITY_ONLY'};
   report.noControlLessons.push(detail);
   if(candidates.length)report.unsupportedActuatorLessons.push(detail);
   else report.passiveLessons.push(detail);
  }
  try{
   const phases=[{key:'Initial',time:0},{key:'Changed',time:400},{key:'Restored',time:850}];
   let originalState='';
   for(let i=0;i<phases.length;i++){
    if(i===1&&control){
     if(sensing)control.sensing.distance=initialDistance<=sensorRange?
      Math.max(sensorRange*2,initialDistance+sensorRange):sensorRange/2;
     else control.state=!control.state;
    }
    if(i===2&&control){
     if(sensing)control.sensing.distance=initialDistance;
     else control.state=!control.state;
    }
    const phase=phases[i],result=solver.solve(p,defs,{now:phase.time});
    report['checked'+phase.key]++;
    if(result.stable&&!result.blocked&&!result.shortCircuit&&!result.oscillating)
     report['stable'+phase.key]++;
    else {
      const fault={id:lesson.id,phase:phase.key,blocked:!!result.blocked,
       shortCircuit:!!result.shortCircuit,oscillating:!!result.oscillating,stable:!!result.stable,
       reason:result.reason||null};
      report.solverFailures.push(fault);
      report.failures.push(fault);
    }
    const signature=state(p,defs);
    if(i===0)originalState=signature;
    if(i===2&&control){
     report.restorationChecked++;
     if(signature!==originalState){
      const mismatch={id:lesson.id,phase:'Restored',reason:'Downstream observable outputs did not return to initial state'};
      report.restorationFailures.push(mismatch);
      report.failures.push(mismatch);
     }
    }
    if(i===1&&control){
     if(signature!==originalState)report.observedOutputChanges++;
     else report.unresponsiveControls.push({id:lesson.id,control:control.typeId,
      reason:'The selected virtual control caused no observable downstream load/actuator/meter change; own actuator state is deliberately excluded.'});
    }
   }
  }catch(e){report.failures.push({id:lesson.id,phase:'exception',message:String(e).slice(0,240)})}
 }
 report.stabilityStatus=report.lessonCount===1655&&report.withWires===722&&
  report.checkedInitial===722&&report.checkedChanged===722&&report.checkedRestored===722&&
  report.stableInitial===722&&report.stableChanged===722&&report.stableRestored===722&&
  !report.missingDefinitions.length&&!report.solverFailures.length&&
  !report.failures.some(f=>f.phase==='structure'||f.phase==='exception')?'PASS':'FAIL';
 report.classificationCoverage=(report.controls+report.noControl+report.missingDefinitionLessons.length)+'/'+report.withWires;
 report.classificationComplete=report.controls+report.noControl+report.missingDefinitionLessons.length===report.withWires;
 report.behaviorCoverage=report.controls?report.observedOutputChanges+'/'+report.controls:'0/0';
 report.actuationCoverage=report.controls+'/'+report.withWires;
 report.restorationCoverage=report.restorationChecked+'/'+report.controls;
 report.restorationStatus=report.controls>0&&report.restorationChecked===report.controls&&report.restorationFailures.length===0?'PASS':'REVIEW';
 report.responseStatus=report.controls>0&&report.unresponsiveControls.length===0&&report.observedOutputChanges===report.controls?'PASS':'REVIEW';
 // Unactuated lessons only prove three stable time samples, not OFF→ON→OFF behavior.
 report.behaviorStatus=report.classificationComplete&&report.stabilityStatus==='PASS'&&report.responseStatus==='PASS'&&report.restorationStatus==='PASS'&&report.noControl===0?'PASS':'REVIEW';
 return report;
}
function main(){
 const r=audit(),folder=path.join(ROOT,'build');
 fs.mkdirSync(folder,{recursive:true});
 const file=path.join(folder,'qa-tutorial-722-sequential-report.json');
 fs.writeFileSync(file,JSON.stringify(r,null,2)+'\n','utf8');
 console.log(JSON.stringify({file,stability:r.stabilityStatus,behavior:r.behaviorStatus,
  lessons:r.withWires,phases:r.checkedInitial+r.checkedChanged+r.checkedRestored,
  outputs:r.behaviorCoverage,classificationCoverage:r.classificationCoverage,classificationComplete:r.classificationComplete,actuationCoverage:r.actuationCoverage,noControl:r.noControl,noControlLessons:r.noControlLessons,missingDefinitionLessons:r.missingDefinitionLessons,unsupportedActuatorLessons:r.unsupportedActuatorLessons,passiveLessons:r.passiveLessons,solverFailures:r.solverFailures.length,responseStatus:r.responseStatus,restorationStatus:r.restorationStatus,restorationCoverage:r.restorationCoverage,restorationChecked:r.restorationChecked,restorationFailures:r.restorationFailures.length,failures:r.failures.length,unresponsive:r.unresponsiveControls}));
 // Fail closed: a stable solver is not proof that controls respond and return.
 if(r.behaviorStatus!=='PASS')process.exitCode=1;
 return r;
}
if(require.main===module)main();
module.exports={audit,main};
