'use strict';
// MQ-12 sequential virtual electrical regression. Does not certify real hardware
// or assume that every pedagogical project has a user-operable control.
const fs=require('node:fs'),path=require('node:path');
const Core=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const clone=x=>JSON.parse(JSON.stringify(x));
const ROOT=path.resolve(__dirname,'..');
function controlCandidates(project,defs){
 return project.components.filter(c=>{
  const d=defs[c.typeId];if(!d)return false;
  const kind=String(d.kind||'');
  const type=String(c.typeId||'');
  if(/^(switch-no|switch-nc|switch-both|selector3|selector4|sensor|detector)$/.test(kind))return true;
  return /^push-(no|nc)$/.test(type)||/^wall-(switch|vavien|commutator|intermediate)$/.test(type);
 }).slice(0,3);
}
function observable(project,controlled){
 return JSON.stringify(project.components.filter(c=>!controlled.has(c.id)).map(c=>[
  c.id,!!c._active,!!c._lampActive,!!c._powered,
  Number.isFinite(Number(c._currentValue))?Math.round(Number(c._currentValue)*1e5)/1e5:null,
  Number.isFinite(Number(c._motorRPM))?Math.round(Number(c._motorRPM)*10)/10:null
 ]));
}
function audit({L=Core.curriculum(),defs=Core.catalog(),engine=Simulation}={}){
 const report={qa:'MQ-12 native virtual sequential-state electrical coverage',
  expected:1655,total:L.lessons.length,wired:0,referenceOnly:0,
  projectsWithControls:0,projectsWithoutControls:0,controlsExercised:0,
  solves:0,observableChanges:0,noObservableChanges:0,
  faults:[],unstable:[],oscillating:[],errors:[],nonresponsiveExamples:[],
  note:'State transitions are source simulator probes. Sensor physical detection, motor dynamics, physical product behavior and every lesson learning outcome need independent tests.'};
 for(const lesson of L.lessons){
  const source=lesson.project;if(!source?.wires?.length){report.referenceOnly++;continue}
  report.wired++;
  const p=clone(source),controls=controlCandidates(p,defs),controlled=new Set(controls.map(c=>c.id));
  if(controls.length)report.projectsWithControls++;else report.projectsWithoutControls++;
  const run=(phase,now)=>{
   try{
    const output=engine.solve(p,defs,{now});
    report.solves++;
    if(output.blocked||output.shortCircuit)report.faults.push({id:lesson.id,phase,blocked:!!output.blocked,shortCircuit:!!output.shortCircuit});
    if(!output.stable){(output.oscillating?report.oscillating:report.unstable).push({id:lesson.id,phase});}
    return observable(p,controlled);
   }catch(err){
    report.errors.push({id:lesson.id,phase,error:String(err).slice(0,200)});
    return null;
   }
  };
  let previous=run('initial',0);
  if(previous===null)continue;
  let t=0;
  for(const c of controls){
   c.state=true;
   t+=250;
   const active=run(c.id+':on',t);
   c.state=false;
   t+=250;
   const released=run(c.id+':off',t);
   report.controlsExercised++;
   if(active!==null&&released!==null){
    if(active!==previous||released!==active)report.observableChanges++;
    else {
     report.noObservableChanges++;
     if(report.nonresponsiveExamples.length<50)report.nonresponsiveExamples.push({id:lesson.id,control:c.id,typeId:c.typeId});
    }
   }
   if(released!==null)previous=released;
  }
 }
 report.coverage=report.total===report.expected&&report.wired+report.referenceOnly===report.total;
 report.status=report.coverage&&!report.errors.length&&!report.faults.length&&!report.unstable.length&&!report.oscillating.length
   ?'SOURCE_SEQUENCES_CHECKED_BEHAVIOR_ACCEPTANCE_OPEN':'FAIL_OR_INCOMPLETE';
 return report;
}
function main(){
 const report=audit(),dir=path.join(ROOT,'build');fs.mkdirSync(dir,{recursive:true});
 const f=path.join(dir,'qa-tutorial-sequential-report.json');
 fs.writeFileSync(f,JSON.stringify(report,null,2)+'\n');
 process.stdout.write(JSON.stringify({file:f,total:report.total,wired:report.wired,controls:report.controlsExercised,
  solves:report.solves,changed:report.observableChanges,notChanged:report.noObservableChanges,
  faults:report.faults.length,unstable:report.unstable.length,oscillating:report.oscillating.length,errors:report.errors.length,status:report.status})+'\n');
 if(report.status==='FAIL_OR_INCOMPLETE')process.exitCode=1;
 return report;
}
if(require.main===module)main();
module.exports={audit,main,controlCandidates,observable};
