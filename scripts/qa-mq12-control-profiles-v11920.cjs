'use strict';
// MQ-12 virtual actuation profiles. Native solver, clone-only canonical circuit QA.
// This is not physical-device, teaching/UI or all-possible-state acceptance.
const fs=require('node:fs'),path=require('node:path');
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const Legacy=require('./qa-tutorial-722-sequential-v11920.cjs');
const toggles=new Set(['push-no','push-nc','wall-switch','wall-vavien','wall-commutator','wall-intermediate','bell-push','bell-light-push','limit-nc','limit-no','switch-no','switch-nc','proximity','autonics-pr12-npn']);
const sensorTypes=new Set(['proximity','autonics-pr12-npn']);
const observedKinds=new Set(['lamp','led','buzzer','siren','flasher','coil','coil-valve','relay-protection','contactor3','motor','motor3','motor-yd','motor-1p','meter-v','meter-a']);
const clone=x=>JSON.parse(JSON.stringify(x));
const stable=r=>!!r&&!!r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating;
const signature=(p,defs)=>JSON.stringify(p.components.filter(c=>{
 const d=defs[c.typeId];return !!d&&(observedKinds.has(d.kind)||!!d.instrument||!!d.isPLC);
}).map(c=>[c.id,!!c._active,!!c._powered,Number(c._currentValue)||0,!!c._lampActive,c._spin||0,c._meter?.value??null,c._meter?.display??null,c._voltageValue??null]));
function choice(p){
 const c=p.components.filter(x=>toggles.has(x.typeId));
 return c.find(x=>/^start(?:[-_a-z\d]*)$/i.test(x.id||'')&&x.typeId==='push-no')||
  c.find(x=>x.typeId==='push-no')||c.find(x=>/^start/i.test(x.id||''))||c[0]||null;
}
const isSensor=c=>!!c&&sensorTypes.has(c.typeId);
function changeControl(c,on,original){
 if(!c)return;
 if(isSensor(c)&&c.sensing?.target&&c.sensing.target!=='none'){
  const distance=Number(original.sensing.distance),range=Number(c.sensing.range)||4;
  if(!Number.isFinite(distance))throw Error('INVALID_SENSOR_DISTANCE');
  c.sensing.distance=on?(distance<=range?Math.max(range*2,distance+range):range/2):distance;
 }else c.state=on?!original.state:original.state;
}
function execute(p,defs,solver,clock){
 const r=solver.solve(p,defs,{now:clock});return{ok:stable(r),sig:signature(p,defs),fault:!stable(r)?{blocked:!!r?.blocked,shortCircuit:!!r?.shortCircuit,oscillating:!!r?.oscillating,stable:!!r?.stable}:null};
}
function classify(p,defs){
 const missing=[...new Set(p.components.map(c=>c.typeId).filter(type=>!defs[type]))];
 if(missing.length)return{category:'MISSING_DEFINITIONS',missing};
 const ctrl=choice(p);if(ctrl)return{category:'CONTROLLED',controlId:ctrl.id,controlType:ctrl.typeId};
 const candidate=[...new Set(p.components.filter(c=>/switch|push|button|sensor|relay|timer|contactor|proximity|limit/i.test(c.typeId+' '+(defs[c.typeId]?.kind||''))).map(c=>c.typeId))];
 return{category:candidate.length?'UNSUPPORTED_ACTUATOR':'PASSIVE_STABILITY_ONLY',candidate};
}
function run({L=QA.curriculum(),defs=QA.catalog(),solver=Solver,legacy=false,start=0,count=Infinity}={}){
 const wiredAll=L.lessons.filter(l=>l.project?.wires?.length);const wired=wiredAll.slice(start,start+count);
 const report={qa:'MQ-12 native profile-aware read-only control QA',sourceTotal:L.lessons.length,wiredTotal:wiredAll.length,batchStart:start,batchCount:wired.length,definitionCount:Object.keys(defs).length,
 classification:{CONTROLLED:0,UNSUPPORTED_ACTUATOR:0,PASSIVE_STABILITY_ONLY:0,MISSING_DEFINITIONS:0},
 stability:{phases:0,pass:0,fail:0},response:{PASS:0,REVIEW:0,NOT_APPLICABLE:0},restoration:{PASS:0,REVIEW:0,NOT_APPLICABLE:0},
 profiles:{LATCH_START_STOP:0,SENSOR_TOGGLE:0,DIRECT_TOGGLE:0,UNSUPPORTED:0,PASSIVE:0,MISSING:0},reasons:{},lessons:[],originalStability:null,fullAcceptance:'REVIEW'};
 const reason=(key)=>{report.reasons[key]=(report.reasons[key]||0)+1};
 for(const l of wired){const p=clone(l.project),cl=classify(p,defs),out={id:l.id,classification:cl.category,profile:null,response:'NOT_APPLICABLE',restoration:'NOT_APPLICABLE',reason:[],phases:[],controlId:cl.controlId||null};report.classification[cl.category]++;
  if(cl.category==='MISSING_DEFINITIONS'){out.profile='MISSING';out.reason.push('MISSING_DEFINITIONS');out.types=cl.missing;report.profiles.MISSING++;}
  else{
   const ctrl=choice(p),stop=ctrl&&p.components.find(c=>/^stop(?:[-_a-z\d]*)$/i.test(c.id||'')&&c.typeId==='push-nc');
   const latch=ctrl?.typeId==='push-no'&&/^start/i.test(ctrl.id||'')&&!!stop;
   out.profile=!ctrl?cl.category==='PASSIVE_STABILITY_ONLY'?'PASSIVE':'UNSUPPORTED':latch?'LATCH_START_STOP':isSensor(ctrl)?'SENSOR_TOGGLE':'DIRECT_TOGGLE';report.profiles[out.profile]++;
   // Unsupported and passive lessons have no credible control stimulus.
   // Independent 722 x 3-phase stability audit covers those graphs.
   if(!ctrl){out.reason.push(cl.category==='UNSUPPORTED_ACTUATOR'?'UNSUPPORTED_ACTUATOR':'PASSIVE_STABILITY_ONLY');
    for(const x of out.reason)reason(x);
    report.response.NOT_APPLICABLE++;report.restoration.NOT_APPLICABLE++;
    out.phaseStable=[];out.phaseValues=[];delete out.phases;report.lessons.push(out);continue;
   }
   const timings=latch?[0,400,850,1200,1500]:[0,400,850];
   // Compare against an unactuated time-matched baseline to reject timer-only drift.
   const base=clone(l.project),baseline=[];
   try{
    for(const t of timings)baseline.push(execute(base,defs,solver,t));
    for(let i=0;i<timings.length;i++){
     if(ctrl){const c=p.components.find(x=>x.id===ctrl.id),original=l.project.components.find(x=>x.id===ctrl.id);
      if(i===1)changeControl(c,true,original);
      if(i===2)changeControl(c,false,original);
      if(latch&&i===3){const stopState=p.components.find(x=>x.id===stop.id);changeControl(stopState,true,l.project.components.find(x=>x.id===stop.id));}
      if(latch&&i===4){const stopState=p.components.find(x=>x.id===stop.id);changeControl(stopState,false,l.project.components.find(x=>x.id===stop.id));}
     }
     const stage=execute(p,defs,solver,timings[i]);out.phases.push(stage);report.stability.phases++;
     if(stage.ok)report.stability.pass++;else {report.stability.fail++;out.reason.push('UNSTABLE_PHASE');}
    }
    if(ctrl){const allStable=out.phases.every(x=>x.ok)&&baseline.every(x=>x.ok);
     const hasSinks=JSON.parse(out.phases[0].sig).length>0;
     const changed=out.phases[1].sig!==out.phases[0].sig;
     const causal=changed&&out.phases[1].sig!==baseline[1].sig;
     out.response=allStable&&hasSinks&&causal?'PASS':'REVIEW';
     if(!hasSinks)out.reason.push('NO_OBSERVABLE_SINK');
     if(!causal)out.reason.push(changed?'TIME_ONLY_OR_NO_CAUSAL_EFFECT':'NO_DOWNSTREAM_RESPONSE');
     const last=out.phases.length-1;
     const restored=out.phases[last].sig===baseline[last].sig;
     const latchHold=latch&&out.phases[2].sig===out.phases[1].sig&&out.phases[2].sig!==baseline[2].sig;
     out.restoration=allStable&&hasSinks&&restored&&(!latch||latchHold)?'PASS':'REVIEW';
     if(latch&&!latchHold)out.reason.push('LATCH_HOLD_UNVERIFIED');
     if(!restored)out.reason.push(latch?'STOP_RELEASE_NOT_RESTORED':'RELEASE_NOT_RESTORED');
     if(isSensor(ctrl)&&!ctrl.sensing?.target){out.reason.push('SENSOR_STIMULUS_NOT_MODELED');out.response='REVIEW';out.restoration='REVIEW';}
     if(!allStable)out.reason.push('SOLVER_UNSTABLE');
    }
   }catch(e){out.reason.push('EXCEPTION_'+String(e).slice(0,90));out.response=ctrl?'REVIEW':'NOT_APPLICABLE';out.restoration=ctrl?'REVIEW':'NOT_APPLICABLE';}
  }
  for(const x of out.reason)reason(x);
  report.response[out.response]++;report.restoration[out.restoration]++;
  out.phaseStable=out.phases.map(x=>x.ok);out.phaseValues=out.phases.map(x=>x.sig);delete out.phases;
  report.lessons.push(out);
 }
 report.classificationCoverage=Object.values(report.classification).reduce((a,b)=>a+b,0)+'/'+wired.length;
 report.stabilityStatus=report.stability.fail?'FAIL':report.lessons.every(x=>x.phaseStable.length>=3)?'PASS':'REVIEW';
 if(legacy){const r=Legacy.audit({L,defs,solver});report.originalStability={checked:[r.checkedInitial,r.checkedChanged,r.checkedRestored],stable:[r.stableInitial,r.stableChanged,r.stableRestored],status:r.stabilityStatus,classification:r.classificationCoverage};}
 return report;
}
if(require.main===module){const start=Number(process.argv[2]||0),count=Number(process.argv[3]||10);const report=run({start,count});const output=path.join(__dirname,'..','build','qa-mq12-control-profiles-report-'+start+'-'+count+'.json');fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({file:output,sourceTotal:report.sourceTotal,wiredTotal:report.wiredTotal,definitions:report.definitionCount,classification:report.classification,stability:report.stability,stabilityStatus:report.stabilityStatus,originalStability:report.originalStability,response:report.response,restoration:report.restoration,profiles:report.profiles,reasons:report.reasons,fullAcceptance:report.fullAcceptance}));if(report.stability.fail||(report.originalStability&&report.originalStability.status!=='PASS'))process.exitCode=1;}
module.exports={run,classify,choice,signature};
