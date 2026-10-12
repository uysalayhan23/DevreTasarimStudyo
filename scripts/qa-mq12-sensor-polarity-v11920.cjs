'use strict';
// Read-only audit. Wire polarity is assessed only for direct BK -> lamp connections.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Profiles=require('./qa-mq12-control-profiles-v11920.cjs');
const mismatchTopics=[['piezo',/piezo/i],['temperature',/sıcaklık|termal|\bısı\b/i],['pressure',/basınç/i],['weight',/ağırlık/i],['ultrasonic',/ultrasonik/i],['chemical',/kimyasal/i]];
function run({L=QA.curriculum(),defs=QA.catalog()}={}){
 const rows=[];
 for(const l of L.lessons){if(!l.project?.wires?.length)continue;
  const c=Profiles.choice(l.project),d=defs[c?.typeId];
  if(!c||!['proximity','autonics-pr12-npn'].includes(c.typeId)||c.sensing?.target&&c.sensing.target!=='none')continue;
  const declared=c.sensorOutput||c.outputType||d?.outputType||'PNP';
  const titlePolarity=/\bNPN\b/i.test(l.title||'')&&!/\bPNP\b/i.test(l.title||'')?'NPN':/\bPNP\b/i.test(l.title||'')&&!/\bNPN\b/i.test(l.title||'')?'PNP':null;
  const conflicts=mismatchTopics.filter(([name,regex])=>regex.test(l.title||'')&&(d.sensorPrinciple==='inductive')).map(([name])=>name);
  const bk=l.project.wires.filter(w=>(w.from.c===c.id&&w.from.p==='BK')||(w.to.c===c.id&&w.to.p==='BK'));
  const candidates=[];
  for(const wire of bk){const other=wire.from.c===c.id?wire.to:wire.from;
   const load=l.project.components.find(x=>x.id===other.c);
   if(!load||defs[load.typeId]?.kind!=='lamp')continue;
   const otherPin=other.p==='X1'?'X2':other.p==='X2'?'X1':null;if(!otherPin)continue;
   const feeds=l.project.wires.filter(w=>w.from.c===load.id&&w.from.p===otherPin||w.to.c===load.id&&w.to.p===otherPin);
   for(const f of feeds){const end=f.from.c===load.id?f.to:f.from;
    const power=l.project.components.find(x=>x.id===end.c);
    if(!power||!['supply-dc-plus','arduino-bench-supply'].includes(power.typeId))continue;
    if(end.p==='P')candidates.push('NPN');if(end.p==='M')candidates.push('PNP');
   }
  }
  const expected=[...new Set(candidates)],physicalMismatch=expected.length===1&&expected[0]!==declared;
  rows.push({id:l.id,title:l.title,principle:d?.sensorPrinciple,declaredOutput:declared,requiredOutput:expected.length===1?expected[0]:null,physicalMismatch,titlePolarityMismatch:!!titlePolarity&&titlePolarity!==declared,topicMismatch:conflicts,missingTarget:true,accepted:false});
 }
 return {sourceTotal:L.lessons.length,missingTargetRows:rows.length,polarityMismatch:rows.filter(x=>x.physicalMismatch),titlePolarityMismatch:rows.filter(x=>x.titlePolarityMismatch),topicMismatch:rows.filter(x=>x.topicMismatch.length),rows,fullAcceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run};
