'use strict';
// Read-only evidence for unresolved native-control QA. Fixture outcomes are NEVER acceptance PASS.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Native=require('../dist/simulation.js');
const Profiles=require('./qa-mq12-control-profiles-v11920.cjs');
const Sensors=require('../dist/sensors.js');
const ProbeLeads=require('../dist/probe-leads.js');
const clone=x=>JSON.parse(JSON.stringify(x));
const stable=r=>!!r?.stable&&!r?.blocked&&!r?.shortCircuit&&!r?.oscillating;
function run({L=QA.curriculum(),defs=QA.catalog(),solver=Native}={}){
 const audit=Profiles.run({L,defs,solver});
 const byId=new Map(L.lessons.map(l=>[l.id,l]));
 const review=audit.lessons.filter(x=>x.response==='REVIEW'||x.restoration==='REVIEW');
 const sensor=[],noDownstream=[],reactive=[];
 for(const entry of review){
  const lesson=byId.get(entry.id),p=lesson.project;
  if(entry.reason.includes('SENSOR_STIMULUS_NOT_MODELED')){
   const stimulus=clone(p),ctrl=Profiles.choice(stimulus),d=defs[ctrl.typeId];
   const principle=d.sensorPrinciple;
   const target=principle==='inductive'?'metal':principle==='capacitive'?'plastic':principle==='optical'?'reflector':principle==='ultrasonic'?'metal':null;
   if(!Sensors.supported(d)||!target){sensor.push({id:entry.id,status:'NO_SUPPORTED_FIXTURE'});continue}
   const setting=Sensors.settings(ctrl,d),original=clone(stimulus),baselineControl=original.components.find(c=>c.id===ctrl.id);
   ctrl.sensing={target,range:setting.range,distance:setting.range*1.8,offset:0};baselineControl.sensing=clone(ctrl.sensing);
   const phases=[],baseline=[];
   for(const t of [0,400,850]){
    if(t===400)ctrl.sensing.distance=setting.range*.5;
    if(t===850)ctrl.sensing.distance=setting.range*1.8;
    phases.push({stable:stable(solver.solve(stimulus,defs,{now:t})),detect:Sensors.detect(ctrl,d).detected,signature:Profiles.signature(stimulus,defs)});
    baseline.push({stable:stable(solver.solve(original,defs,{now:t})),signature:Profiles.signature(original,defs)});
   }
   sensor.push({id:entry.id,kind:principle,virtualMaterial:target,scenario:'SYNTHETIC_FIXTURE_NOT_CANONICAL',stable:phases.every(s=>s.stable)&&baseline.every(s=>s.stable),detectorOffOnOff:!phases[0].detect&&phases[1].detect&&!phases[2].detect,causal:phases[1].signature!==phases[0].signature&&phases[1].signature!==baseline[1].signature,restored:phases[2].signature===baseline[2].signature,accepted:false});
  }
  if(entry.reason.includes('NO_DOWNSTREAM_RESPONSE')){
   const probes=p.components.filter(c=>defs[c.typeId]?.probeColor);
   const resolved=probes.filter(c=>c.probeTarget&&ProbeLeads.resolve(p,defs,c.probeTarget)).length;
   const bjts=p.components.filter(c=>['bjt-npn','bjt-pnp'].includes(defs[c.typeId]?.kind));
   noDownstream.push({id:entry.id,probes:probes.length,validProbeTargets:resolved,bjtCount:bjts.length,causalResponse:false,accepted:false});
  }
  if(entry.reason.includes('REACTIVE_STATE_NOT_SETTLED')){
   const act=clone(p),base=clone(p),ctrl=Profiles.choice(act);const marks=[];
   for(const t of [0,400,850,1500,3000,10000]){
    ctrl.state=t===400?!p.components.find(c=>c.id===ctrl.id).state:p.components.find(c=>c.id===ctrl.id).state;
    const sr=solver.solve(act,defs,{now:t}),br=solver.solve(base,defs,{now:t});
    marks.push({t,stable:stable(sr)&&stable(br),matchesBaseline:Profiles.signature(act,defs)===Profiles.signature(base,defs)});
   }
   reactive.push({id:entry.id,scheduleMs:marks.map(m=>m.t),allStable:marks.every(m=>m.stable),returnedAtOrAfterRelease:marks.slice(2).find(m=>m.matchesBaseline)?.t??null,restoredWithin10s:marks.at(-1).matchesBaseline,accepted:false});
  }
 }
 const count=(arr,key)=>arr.filter(x=>x[key]).length;
 return {scope:'READ_ONLY_REVIEW_DIAGNOSTICS',sourceLessons:L.lessons.length,wiredLessons:audit.wiredTotal,originalClassification:audit.classification,originalStability:audit.stability,originalResponse:audit.response,originalRestoration:audit.restoration,fullAcceptance:'REVIEW',reviewLessonCount:review.length,summary:{sensorMissingTarget:sensor.length,sensorFixturesStable:count(sensor,'stable'),sensorFixturesDetectedOffOnOff:count(sensor,'detectorOffOnOff'),sensorFixturesCausal:count(sensor,'causal'),sensorFixturesRestored:count(sensor,'restored'),noDownstreamResponse:noDownstream.length,noDownstreamWithValidProbeTargets:noDownstream.filter(x=>x.probes>0&&x.validProbeTargets===x.probes).length,noDownstreamWithBjt:noDownstream.filter(x=>x.bjtCount>0).length,reactiveReview:reactive.length,reactiveStable:count(reactive,'allStable'),reactiveRestoredBy10s:count(reactive,'restoredWithin10s')},sensor,noDownstream,reactive};
}
if(require.main===module){const fs=require('node:fs'),path=require('node:path');const result=run(),file=path.resolve(__dirname,'../build/qa-mq12-review-diagnostics-v11920.json');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({file,summary:result.summary,fullAcceptance:result.fullAcceptance},null,2));}
module.exports={run};
