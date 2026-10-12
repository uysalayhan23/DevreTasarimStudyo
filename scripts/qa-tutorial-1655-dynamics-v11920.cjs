'use strict';
// Independent MQ-05 native electrical behavior coverage of canonical virtual lessons.
// No physical equipment or energized wiring is required.
const fs=require('node:fs'),path=require('node:path');
const StaticQA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const ROOT=path.resolve(__dirname,'..');
const clone=v=>JSON.parse(JSON.stringify(v));
const interactive=new Set(['switch-no','switch-nc','switch-both','switch-multi','sensor','detector']);
const activeStates=[false,true];
function run(){
 const L=StaticQA.curriculum(),defs=StaticQA.catalog();
 const report={qa:'MQ-05 tutorial virtual input-state dynamic smoke audit',total:L.lessons.length,
  referenceOnly:0,wired:0,initialStates:0,interactiveDevices:0,toggledStates:0,changedOutputs:0,
  scenarios:[],missingDefs:[],failures:[],oscillating:[],
  note:'Finite OFF/ON state smoke checks on selected virtual controls. Does not prove physical product behavior, safety compliance or complete teaching quality.'};
 const record=(lesson,project,scenario)=>{
  const key=lesson.id,after=clone(project);
  try{
   const result=Simulation.solve(after,defs,{now:scenario.active?300:0});
   const outputs=after.components.filter(c=>['lamp','led','buzzer','coil','contactor3','motor','motor3','relay-protection'].includes(defs[c.typeId]?.kind))
    .map(c=>({id:c.id,active:!!c._active,powered:!!c._powered,current:Number.isFinite(Number(c._currentValue))?Number(c._currentValue):null}));
   const row={id:key,component:scenario.component||null,state:scenario.active,blocked:!!result.blocked,
    shortCircuit:!!result.shortCircuit,stable:!!result.stable,oscillating:!!result.oscillating,outputs};
   if(row.blocked||row.shortCircuit||(!row.stable&&!row.oscillating))report.failures.push({id:key,component:scenario.component,state:scenario.active,blocked:row.blocked,shortCircuit:row.shortCircuit,stable:row.stable});
   if(row.oscillating)report.oscillating.push({id:key,component:scenario.component,state:scenario.active});
   return row;
  }catch(e){
   report.failures.push({id:key,component:scenario.component,state:scenario.active,error:String(e).slice(0,300)});
   return {id:key,error:String(e).slice(0,300)};
  }
 };
 for(const lesson of L.lessons){
  const p=lesson.project;
  if(!p?.wires?.length){report.referenceOnly++;continue}
  report.wired++;
  const absent=[...new Set(p.components.filter(c=>!defs[c.typeId]).map(c=>c.typeId))];
  if(absent.length){report.missingDefs.push({id:lesson.id,types:absent});continue}
  const baseline=record(lesson,p,{active:false,component:null});
  report.initialStates++;
  const controls=p.components.filter(c=>interactive.has(defs[c.typeId]?.kind)&&typeof c.state==='boolean').slice(0,3);
  report.interactiveDevices+=controls.length;
  for(const control of controls){
   for(const active of activeStates){
    const scenario=clone(p),current=scenario.components.find(c=>c.id===control.id);
    current.state=active;
    const observed=record(lesson,scenario,{active,component:control.id});
    report.toggledStates++;
    if(observed.outputs&&baseline.outputs&&JSON.stringify(observed.outputs)!==JSON.stringify(baseline.outputs))
     report.changedOutputs++;
   }
  }
  if(report.scenarios.length<40)report.scenarios.push({id:lesson.id,controlCount:controls.length,baseline:baseline.outputs||[],baselineShort:baseline.shortCircuit});
 }
 report.status=report.total===1655&&report.referenceOnly===933&&report.wired===722&&report.missingDefs.length===0&&report.failures.length===0&&report.oscillating.length===0&&report.initialStates===report.wired&&report.interactiveDevices>=500&&report.toggledStates>=1000&&report.changedOutputs>=100?'PASS':'FAIL';
 return report;
}
function main(){
 const report=run(),file=path.join(ROOT,'build','qa-tutorial-1655-dynamics-report.json');
 fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
 process.stdout.write(JSON.stringify({file,status:report.status,wired:report.wired,
  initial:report.initialStates,toggled:report.toggledStates,failures:report.failures.length,
  oscillating:report.oscillating.length,changedOutputs:report.changedOutputs})+'\n');
 if(report.status!=='PASS')process.exitCode=1;
 return report;
}
if(require.main===module)main();
module.exports={run,main};
