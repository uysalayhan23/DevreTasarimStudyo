'use strict';
// Fail closed for ALL current/future virtual bell lessons. No mains wiring is
// exposed to students; this is a simulated isolated secondary ONLY.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Simulation=require('../dist/simulation.js');
const clone=v=>JSON.parse(JSON.stringify(v));
function audit({L=QA.curriculum(),defs=QA.catalog(),solver=Simulation}={}){
 const found=[],issues=[],phases=[];
 const xform=defs['bell-transformer'];
 if(!xform||xform.kind!=='bell-transformer'||xform.defaultVoltage!==12||
   JSON.stringify(xform.pins.map(p=>p.id))!==JSON.stringify(['S1','S2']))
   issues.push({code:'BELL_TRANSFORMER_MODEL_MISSING_OR_WRONG'});
 for(const lesson of L.lessons||[]){
  const p=lesson.project;if(!p?.components?.some(c=>c.typeId==='bell-electronic'))continue;
  const id=lesson.id,components=p.components,buttons=components.filter(c=>['bell-push','bell-light-push'].includes(c.typeId)),
   trafos=components.filter(c=>c.typeId==='bell-transformer'),
   mains=components.filter(c=>['supply-1p','supply-3p'].includes(c.typeId)),
   bell=components.find(c=>c.typeId==='bell-electronic');
  found.push(id);
  if(trafos.length!==1)issues.push({id,code:'TRAFO_REQUIRED',actual:trafos.length});
  if(mains.length||p.wires.some(w=>components.some(c=>['supply-1p','supply-3p'].includes(c.typeId)&&
   (w.from?.c===c.id||w.to?.c===c.id))))issues.push({id,code:'DIRECT_MAINS_FORBIDDEN'});
  if(buttons.length<1)issues.push({id,code:'NO_BELL_BUTTON'});
  const trafo=trafos[0],wire=(a,ap,b,bp)=>p.wires.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
  if(trafo){
   if(!wire(bell.id,'2',trafo.id,'S2'))issues.push({id,code:'SECONDARY_RETURN_MISSING'});
   if(buttons.some(b=>!wire(trafo.id,'S1',b.id,'13')||!wire(b.id,'14',bell.id,'1')))
     issues.push({id,code:'SECONDARY_BUTTON_OR_LOAD_PATH_MISSING'});
  }
  if(issues.some(issue=>issue.id===id))continue;
  for(const [i,b] of [null,...buttons].entries()){
   const c=clone(p);if(b)c.components.find(x=>x.id===b.id).state=true;
   try{
    const r=solver.solve(c,defs,{now:1000+i*100}),z=c.components.find(x=>x.id===bell.id);
    const expected=!!b,actual=!!z._active;
    phases.push({id,control:b?.id||'OFF',stable:!!r.stable&&!r.blocked&&!r.shortCircuit&&!r.oscillating,expected,actual});
    if(r.blocked||r.shortCircuit||r.oscillating||!r.stable||actual!==expected)
      issues.push({id,code:'BELL_SOLVER_PHASE_MISMATCH',control:b?.id||'OFF'});
   }catch(e){issues.push({id,code:'BELL_SOLVER_EXCEPTION',message:String(e)})}
  }
  const powered=clone(p),tra=powered.components.find(x=>x.id===trafo.id);
  if(tra){tra.transformerEnabled=false;powered.components.find(x=>x.id===buttons[0].id).state=true;
   try{const state=solver.solve(powered,defs,{now:2300});
    if(state.blocked||powered.components.find(x=>x.id===bell.id)._active)issues.push({id,code:'TRANSFORMER_DISABLED_MUST_BE_OFF'});
   }catch(e){issues.push({id,code:'TRANSFORMER_OFF_EXCEPTION',message:String(e)})}
  }
 }
 return {gate:'BELL_TRANSFORMER_V1',status:issues.length?'FAIL':'PASS',count:found.length,lessonIds:found,phaseChecks:phases.length,phasePasses:phases.filter(x=>x.stable&&x.expected===x.actual).length,issues,windowsAcceptance:'NOT_RUN',physicalAcceptance:false,pedagogicalFinal:false};
}
if(require.main===module){const out=audit();console.log(JSON.stringify(out,null,2));if(out.status!=='PASS')process.exitCode=1}
module.exports={audit};
