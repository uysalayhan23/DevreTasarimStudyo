'use strict';
// Real native solver, read-only canonical lessons. Not a physical time calibration.
const QA=require('./qa-tutorial-1655-simulation-v11920.cjs');
const Solver=require('../dist/simulation.js');
const CAP_IDS=['electronic-component-basics-outline-012','electronic-component-basics-outline-106','electronic-component-basics-outline-126','electronic-component-basics-outline-130'];
const IND_IDS=['workshop-safety-mechanics-outline-049','workshop-safety-mechanics-outline-127','workshop-safety-mechanics-outline-130'];
function run({L=QA.curriculum(),defs=QA.catalog(),solver=Solver}={}){
 const lessons=[];
 for(const id of [...CAP_IDS,...IND_IDS]){
  const l=L.lessons.find(x=>x.id===id);if(!l)throw Error('missing canonical '+id);
  const before=JSON.stringify(l.project),p=structuredClone(l.project);
  const sw=p.components.find(c=>c.typeId==='push-no'),r=p.components.find(c=>defs[c.typeId]?.kind==='resistor');
  const reactive=p.components.find(c=>['capacitor','reactor'].includes(defs[c.typeId]?.kind));
  const meter=p.components.find(c=>defs[c.typeId]?.kind==='multimeter');
  if(!sw||!r||!reactive||!meter)throw Error('missing R + C/L + meter '+id);
  const kind=defs[reactive.typeId].kind,nominal=kind==='capacitor'?r.resistance*reactive.capacitance:reactive.inductance/r.resistance;
  const samples=[];
  for(let t=0;t<=10000;t+=100){sw.state=t>0&&t<=400;
   const out=solver.solve(p,defs,{now:t});if(!out.stable||out.blocked||out.shortCircuit||out.oscillating)throw Error('unstable '+id+' '+t);
   if([0,400,500,1000,10000].includes(t))samples.push({ms:t,reading:Number(meter._meter?.value),capacitorVoltage:kind==='capacitor'?Number(reactive._capacitorVoltage):null});
  }
  const at=t=>samples.find(x=>x.ms===t),charged=at(400).reading,last=at(10000).reading;
  const measuredOffTauS=kind==='capacitor'&&charged>0&&last>0?(-9.6/Math.log(last/charged)):null;
  lessons.push({id,kind,nominalChargingOrLRTauS:nominal,highImpedanceMeterDischargeTauS:kind==='capacitor'?1e7*reactive.capacitance:null,measuredOffTauS,startedReading:at(0).reading,releaseReading:charged,readingAfter10s:last,stablePhases:101,canonicalUnchanged:JSON.stringify(l.project)===before,restoration:'REVIEW'});
 }
 return {lessons,capacitors:lessons.filter(x=>x.kind==='capacitor').length,inductors:lessons.filter(x=>x.kind==='reactor').length,nativePhases:lessons.reduce((n,x)=>n+x.stablePhases,0),physicalCalibrationAccepted:false,fullAcceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run,CAP_IDS,IND_IDS};
