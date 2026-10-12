'use strict';
// Read-only native MQ-12 runner. No Actions, browser or canonical graph mutation.
// node scripts/qa-mq12-small-batches-v11920.cjs [start=0] [count=10]
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const toggles=new Set(['push-no','push-nc','wall-switch','wall-vavien','wall-commutator','wall-intermediate','bell-push','bell-light-push','limit-nc','limit-no','switch-no','switch-nc','proximity','autonics-pr12-npn']);
const observable=new Set(['led','lamp','buzzer','siren','flasher','coil','motor','motor3','motor-yd','motor-1p','meter-v','meter-a']);
const signature=(p,defs)=>JSON.stringify(p.components.filter(c=>observable.has(defs[c.typeId]?.kind)||defs[c.typeId]?.instrument).map(c=>[c.id,!!c._active,!!c._powered,c._meter?.value??null,c._currentValue??null]));
function run({L=QA.curriculum(),defs=QA.catalog(),solver=Simulation,start=0,count=10}={}){
 const wired=L.lessons.filter(l=>l.project?.wires?.length);
 const selected=wired.slice(start,start+count);
 const report={start,count:selected.length,sourceTotal:L.lessons.length,wiredTotal:wired.length,definitionCount:Object.keys(defs).length,classification:{controlled:[],missingDefinitions:[],unsupportedActuator:[],passive:[]},stability:{pass:[],fail:[]},response:{pass:[],review:[]},restoration:{pass:[],review:[]}};
 for(const lesson of selected){
  const original=lesson.project,missing=[...new Set(original.components.map(c=>c.typeId).filter(id=>!defs[id]))];
  if(missing.length){report.classification.missingDefinitions.push({id:lesson.id,missing});continue}
  const p=JSON.parse(JSON.stringify(original)),ctrl=p.components.find(c=>toggles.has(c.typeId));
  if(!ctrl){const candidate=p.components.filter(c=>/switch|push|button|sensor|relay|timer|contactor|proximity|limit/i.test(c.typeId+' '+(defs[c.typeId]?.kind||''))).map(c=>c.typeId);
   report.classification[candidate.length?'unsupportedActuator':'passive'].push({id:lesson.id,candidate});}
  else report.classification.controlled.push(lesson.id);
  if(ctrl?.sensing?.target&&ctrl.sensing.target!=='none'&&!Number.isFinite(Number(ctrl.sensing.distance))){
   report.stability.fail.push({id:lesson.id,reason:'invalid sensing distance'});
   report.response.review.push(lesson.id);report.restoration.review.push(lesson.id);continue;}
  const sensing=ctrl?.sensing?.target&&ctrl.sensing.target!=='none';
  const originalDistance=sensing?Number(ctrl.sensing.distance):null;
  const range=sensing?Math.max(.1,Number(ctrl.sensing.range)||4):null;
  let states=[],phases=[],error=null;
  for(let i=0;i<3;i++){
   if(ctrl){if(sensing){if(i===1)ctrl.sensing.distance=originalDistance<=range?Math.max(2*range,originalDistance+range):range/2;if(i===2)ctrl.sensing.distance=originalDistance;}
    else ctrl.state=i===1?!ctrl.state:i===2?!ctrl.state:ctrl.state;}
   try{const r=solver.solve(p,defs,{now:[0,400,850][i]});phases.push(!!r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating);states.push(signature(p,defs));}
   catch(e){error=String(e);break}
  }
  const stableAll=!error&&phases.length===3&&phases.every(Boolean);
  if(!stableAll)report.stability.fail.push({id:lesson.id,phases,error});
  else report.stability.pass.push(lesson.id);
  if(!ctrl)continue;
  // Compare against a time-matched, unactuated control branch: timers and
  // autonomous outputs must never masquerade as a response to this switch.
  let controlEffect=false;
  if(stableAll&&states[0]!==states[1]){
   const baseline=JSON.parse(JSON.stringify(original));
   try{
    const b0=solver.solve(baseline,defs,{now:0});
    const b1=solver.solve(baseline,defs,{now:400});
    controlEffect=!!b0?.stable&&!!b1?.stable&&!b0.blocked&&!b1.blocked&&
     !b0.shortCircuit&&!b1.shortCircuit&&!b0.oscillating&&!b1.oscillating&&
     signature(baseline,defs)!==states[1];
   }catch(_){controlEffect=false;}
  }
  const response=stableAll&&states[0]!==states[1]&&controlEffect,restored=stableAll&&states[0]===states[2];
  report.response[response?'pass':'review'].push(lesson.id);
  report.restoration[restored?'pass':'review'].push(lesson.id);
 }
 // A small batch cannot grant full 722-lesson acceptance.
 report.classificationCoverage=(report.classification.controlled.length+report.classification.missingDefinitions.length+report.classification.unsupportedActuator.length+report.classification.passive.length)+'/'+selected.length;
 report.classificationComplete=selected.length>0&&report.classificationCoverage===selected.length+'/'+selected.length;
 report.stabilityCoverage=(report.stability.pass.length+report.stability.fail.length)+'/'+selected.filter(l=>!report.classification.missingDefinitions.some(x=>x.id===l.id)).length;
 report.responseCoverage=(report.response.pass.length+report.response.review.length)+'/'+report.classification.controlled.length;
 report.restorationCoverage=(report.restoration.pass.length+report.restoration.review.length)+'/'+report.classification.controlled.length;
 report.fullAcceptance='REVIEW';
 return report;
}
if(require.main===module){const start=Number(process.argv[2]||0),count=Number(process.argv[3]||10);
 if(!Number.isInteger(start)||start<0||!Number.isInteger(count)||count<1||count>50)throw Error('Invalid batch range');
 const result=run({start,count});process.stdout.write(JSON.stringify(result,null,2)+'\n');
 if(result.stability.fail.length||result.response.review.length||result.restoration.review.length||result.classification.missingDefinitions.length||result.classification.unsupportedActuator.length||result.classification.passive.length||!result.classificationComplete)process.exitCode=1;
}
module.exports={run};
