(function(root){
 'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const connected=(project,cid,pid)=>project.wires.some(w=>(w.from?.c===cid&&w.from?.p===pid)||(w.to?.c===cid&&w.to?.p===pid));
 const mag=v=>v?Math.hypot(v[0]||0,v[1]||0):0;
 function measure(c,d,context){
  const {project,byId,voltages,pin,now}=context;
  const a=voltages.get(pin(c,'L')),b=voltages.get(pin(c,'N'));
  const vrms=a&&b?Math.hypot((a[0]||0)-(b[0]||0),(a[1]||0)-(b[1]||0)):0;
  const ct=project.components.find(x=>byId[x.typeId]?.kind==='current-transformer');
  const load=project.components.find(x=>byId[x.typeId]?.kind==='energy-training-load');
  const lm=load?._energyLoad||{};
  const irms=Number(ct?._primaryCurrent??lm.currentA??0)||0;
  const apparent=vrms*irms;
  const pf=apparent>1e-9?clamp(Number(lm.powerFactor??1),0,1):0;
  const active=Number.isFinite(lm.activePowerW)?lm.activePowerW:apparent*pf;
  const reactive=Number.isFinite(lm.reactivePowerVar)?lm.reactivePowerVar:(apparent?Math.sqrt(Math.max(0,apparent*apparent-active*active)):0);
  const frequency=Number(lm.frequencyHz||50);
  const fullyConnected=['L','N','S1','S2'].every(p=>connected(project,c.id,p));
  const warning=!fullyConnected?'Analizör ölçüm girişleri tamamlanmamış.':'';
  const t=Number(now??Date.now()),last=Number(c._energyAnalyzerLast||t),dt=Math.max(0,Math.min(1,(t-last)/3600000));
  const energyWh=Math.max(0,Number(c._energyWh)||0)+(warning?0:Math.max(0,active)*dt);
  c._energyWh=energyWh;c._energyAnalyzerLast=t;
  c._energyAnalyzer={
   voltageV:vrms,currentA:irms,activePowerW:active,
   apparentPowerVA:apparent,reactivePowerVar:reactive,
   powerFactor:pf,frequencyHz:frequency,energyWh,
   loadCharacter:lm.loadCharacter||'resistive',warning
  };
  return c._energyAnalyzer;
 }
 const fmt=(v,d=2)=>Number.isFinite(Number(v))?Number(v).toFixed(d):'—';
 const api={measure,fmt};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSEnergyAnalyzer=api;
})(typeof window==='undefined'?globalThis:window);
