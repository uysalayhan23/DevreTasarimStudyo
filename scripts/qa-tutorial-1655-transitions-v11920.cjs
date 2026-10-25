'use strict';
// MQ-05 transient OFF -> ON -> OFF regression using the original native engine.
// This checks virtual state continuity, not physical device certification.
const fs=require('node:fs'),path=require('node:path');
const Static=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const Scope=require('./tutorial-lesson-scope-v11920.cjs');
const clone=v=>JSON.parse(JSON.stringify(v));
const inputKinds=new Set(['switch-no','switch-nc','switch-both','switch-multi','sensor','detector']);
const outputKinds=new Set(['lamp','led','buzzer','coil','contactor3','motor','motor3','relay-protection']);
function run({L=Static.curriculum(),defs=Static.catalog(),solver=Simulation}={}){
 const scope=Scope.summarize(L.lessons);
 const report={name:'MQ-05 native virtual stateful transitions OFF-ON-OFF',scope,rawWireCount:scope.rawWireCount,
  lessons:L.lessons.length,referenceOnly:0,wired:0,controls:0,transitions:0,
  changedOutputs:0,returnedOutputs:0,sustainedOutputs:0,failed:[],oscillating:[],
  note:'Stateful virtual engine smoke test; a latched output may legitimately remain ON after releasing the input. No physical/Windows acceptance implied.'};
 for(const lesson of L.lessons){
  const p=lesson.project;
  if(!Scope.isCircuitLesson(lesson)){report.referenceOnly++;continue}
  report.wired++;
  const inputs=p.components.filter(c=>inputKinds.has(defs[c.typeId]?.kind)&&typeof c.state==='boolean').slice(0,2);
  for(const component of inputs){
   const project=clone(p),control=project.components.find(c=>c.id===component.id);
   const snapshots=[];
   for(const [i,on] of [false,true,false].entries()){
    control.state=on;
    const state={id:lesson.id,control:control.id,stage:i,input:on};
    try{
     const result=solver.solve(project,defs,{now:i*300});
     state.blocked=!!result.blocked;
     state.shortCircuit=!!result.shortCircuit;
     state.stable=!!result.stable;
     state.oscillating=!!result.oscillating;
     state.outputs=project.components.filter(c=>outputKinds.has(defs[c.typeId]?.kind))
      .map(c=>({id:c.id,active:!!c._active,powered:!!c._powered,
        current:Number.isFinite(Number(c._currentValue))?Number(c._currentValue):null}));
     if(state.blocked||state.shortCircuit||!state.stable){
      const row={id:state.id,control:state.control,stage:state.stage,blocked:state.blocked,shortCircuit:state.shortCircuit,stable:state.stable};
      if(state.oscillating)report.oscillating.push(row);
      report.failed.push(row);
     }
    }catch(e){report.failed.push({id:lesson.id,control:control.id,stage:i,error:String(e).slice(0,200)})}
    snapshots.push(state);report.transitions++;
   }
   report.controls++;
   if(snapshots.every(x=>x.outputs)){
    const a=JSON.stringify(snapshots[0].outputs),b=JSON.stringify(snapshots[1].outputs),c=JSON.stringify(snapshots[2].outputs);
    if(a!==b)report.changedOutputs++;
    if(a===c)report.returnedOutputs++;
    else report.sustainedOutputs++; // report-only: intentionally latched relays allowed
   }
  }
 }
 report.status=report.lessons===1655&&report.wired===scope.simulatable&&report.referenceOnly===scope.referenceWithWires+scope.referenceWithoutWires&&
  report.controls>=500&&report.transitions===report.controls*3&&
  report.changedOutputs>=100&&report.failed.length===0&&report.oscillating.length===0?'PASS':'FAIL';
 return report;
}
function main(){
 const report=run(),file=path.join(__dirname,'../build/qa-tutorial-1655-transitions-report.json');
 fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
 process.stdout.write(JSON.stringify({file,status:report.status,wired:report.wired,controls:report.controls,
  transitions:report.transitions,changedOutputs:report.changedOutputs,
  returned:report.returnedOutputs,sustained:report.sustainedOutputs,failed:report.failed.length})+'\n');
 if(report.status!=='PASS')process.exitCode=1;
 return report;
}
if(require.main===module)main();
module.exports={run,main};
