(function(root){
 'use strict';
 const ranges=[['OFF',0],['DCV',.2],['DCV',2],['DCV',20],['DCV',200],['DCV',600],['ACV',600],['ACV',200],['NCV',0],['DCA',10],['DCA',.2],['DCA',.02],['DCA',.002],['diode',2],['Ω',200],['Ω',2000],['Ω',20000],['Ω',200000],['Ω',20000000],['Ω',200000000]];
 const ut61Ranges=[['OFF',0],['DCV',220],['ACV',220],['Ω',220000000],['diode',2],['Hz',220000000]];
 const isUT61=d=>d?.id==='unit-ut61e-plus'||d?.multimeterModel==='UT61E+';
 const rangesFor=d=>isUT61(d)?ut61Ranges:ranges;
 const setting=(c,d)=>{const rs=rangesFor(d);return rs[Math.max(0,Math.min(rs.length-1,Math.round(Number(c.meterPosition)||0)))]};
 const label=(i,d)=>{const rs=rangesFor(d),[mode,r]=rs[i]||rs[0];return ['OFF','NCV','diode'].includes(mode)?({OFF:'OFF',NCV:'NCV',diode:'Diyot / Süreklilik'}[mode]):mode==='Hz'?'Hz · Frekans (220 MHz max)':mode==='Ω'?(r>=1e6?r/1e6+' MΩ':r>=1000?r/1000+' kΩ':r+' Ω'):mode==='DCA'?(r>=1?r+' A DC':r*1000+' mA DC'):(r<1?r*1000+' mV ':r+' V ')+(mode==='DCV'?'DC':'AC')};
 const jack=(c,d)=>setting(c,d)[0]==='DCA'&&setting(c,d)[1]===10?'10A':'V';
 const targetOf=(project,id)=>project.components.find(x=>x.id===id)?.probeTarget||null;
 const sameTarget=(a,c,p)=>a?.c===c&&a?.p===p;
 function frequencySignal(c,context){
  const {project,byId,pin}=context,redTarget=targetOf(project,c.id+'-red'),blackTarget=targetOf(project,c.id+'-black');
  for(const src of project.components){
   const sd=byId[src.typeId];if(sd?.arduinoRole!=='signal-generator'||src.generatorEnabled===false)continue;
   const direct=(sameTarget(redTarget,src.id,'OUT')&&sameTarget(blackTarget,src.id,'GND'))||(sameTarget(redTarget,src.id,'GND')&&sameTarget(blackTarget,src.id,'OUT'));
   const red=pin(c,'V'),black=pin(c,'COM'),wired=(pin(src,'OUT')===red&&pin(src,'GND')===black)||(pin(src,'OUT')===black&&pin(src,'GND')===red);
   if(direct||wired)return Math.max(.01,Math.min(220000000,Number(src.generatorFrequency??sd.generatorFrequency??src._signalFrequency??1000)));
  }
  return null;
 }
 function measure(c,d,context){
  const {branches,fixed,voltages,solveGraph,acNodes,dcNodes,pin,project}=context,[mode,range]=setting(c,d),red=pin(c,jack(c,d)),black=pin(c,'COM'),wired=p=>project.wires.some(w=>[w.from,w.to].some(e=>e.c===c.id&&e.p===p));
  let value=null,unit='',warning='',beep=false,display='—';
  if(mode==='OFF'){c._meter={display:'',warning:'',beep:false};return}

  // SC024 only: floating/detached UNI-T probe tips cannot indicate 0 V.
  if(project?.tutorialLesson?.id==='opamp-apps-outline-024'&&
     c.id==='v1'&&d.id==='unit-ut33d-plus'&&['DCV','ACV'].includes(mode)){
    const Leads=typeof module==='object'&&module.exports?
      require('./probe-leads.js'):root.DTSProbeLeads;
    const contacted=id=>{
      const lead=project.components.find(x=>x.id===id),target=lead?.probeTarget;
      const ep=target&&Leads?.resolve(project,context.byId,target);
      return !!(ep&&(!ep.j||project.wires.some(w=>[w.from,w.to].some(e=>e?.j===ep.j))));
    };
    if(!contacted('v1-red')||!contacted('v1-black')){
      c._meter={display:'OL',unit:'V',value:null,
        warning:'Ölçüm probu açık veya temas yok. Kırmızı ve siyah prob uçlarını ölçüm noktalarına dokundurun.',
        beep:false,mode,range};
      return;
    }
  }

  if(mode==='NCV'){const sensed=!!c._ncv;c._meter={display:sensed?'EF':'—',warning:'',beep:sensed};return}
  if(!wired('COM')||!wired(jack(c,d))||(!isUT61(d)&&wired(jack(c,d)==='V'?'10A':'V')))warning='Prob yuvaları yanlış. Siyah prob COM, kırmızı prob '+(isUT61(d)?'VΩHz':(jack(c,d)==='V'?'VΩmA':'10A'))+' yuvasına bağlanmalı.';
  const circuit=branches.filter(b=>b.c!==c),seen=new Set(),q=[red,black];while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);for(const b of circuit){if(b.a===n)q.push(b.b);if(b.b===n)q.push(b.a)}}
  const isAC=[...seen].some(n=>acNodes.has(n)),isDC=[...seen].some(n=>dcNodes.has(n));
  if(!warning&&['Ω','diode'].includes(mode)){
   if(isAC||isDC)warning='Direnç / diyot ölçümü için devrenin enerjisini kesin.';
   else{
    const ohms=solveGraph(circuit,new Map([[black,[0,0]]]),new Map([[red,[1,0]],[black,[-1,0]]])),reachable=new Set(),queue=[red];while(queue.length){const n=queue.pop();if(reachable.has(n))continue;reachable.add(n);for(const b of circuit){if(b.a===n)queue.push(b.b);if(b.b===n)queue.push(b.a)}}
    value=red===black?0:reachable.has(black)?Math.abs((ohms.get(red)?.[0]||0)-(ohms.get(black)?.[0]||0)):Infinity;
    if(mode==='diode'&&!c.meterContinuity){const diode=project.components.find(p=>context.byId[p.typeId]?.kind==='diode'&&pin(p,context.byId[p.typeId].pins[0].id)===red&&pin(p,context.byId[p.typeId].pins[1].id)===black);value=diode?.65:value<10?0:Infinity;unit='V'}else{unit='Ω';beep=mode==='diode'&&value<10}
   }
  }else if(!warning){
   if(mode==='Hz'){value=frequencySignal(c,context);unit='Hz';if(value===null)warning='Frekans sinyali bulunamadı. VΩHz ve COM problarını düşük gerilimli sinyal kaynağının OUT/GND uçlarına bağlayın.';else if(value>range)warning='Frekans ölçüm sınırı aşıldı.';
   }else if(mode==='DCA'){
    if(isAC)warning='UT33D+ akım kademeleri yalnız DC içindir.';
    if(fixed.has(red)&&fixed.has(black))warning='Akım probu beslemeye paralel bağlı. Devreyi açıp ölçü aletini seri bağlayın.';
    const b=branches.find(b=>b.c===c&&b.role==='ut-current'),a=voltages.get(red),z=voltages.get(black);value=b&&a&&z?(a[0]-z[0])/b.r:null;unit='A';if((!b||!a||!z)&&!warning)warning='Akım ölçüm yolu açık veya prob teması yok.';
    if(Math.abs(value)>(range===10?10:.2)){if(!warning)warning='Akım girişinin '+(range===10?'10 A':'200 mA')+' sınırı aşıldı.';beep=true}else if(Math.abs(value)>range&&!warning)warning='Seçilen akım ölçüm kademesi aşıldı.';
   }else{const a=voltages.get(red),z=voltages.get(black);value=a&&z?mode==='DCV'?a[0]-z[0]:Math.hypot(a[0]-z[0],a[1]-z[1]):null;unit='V';if(!a||!z)warning='Ölçüm noktası açık veya prob teması yok.';else if(mode==='DCV'&&isAC||mode==='ACV'&&isDC)warning='AC/DC ölçüm kademesi devredeki besleme ile uyuşmuyor.';if(Math.abs(value)>600){warning='600 V ölçüm sınırı aşıldı.';beep=true}else if(value!==null&&Math.abs(value)>range&&!warning)warning='Seçilen gerilim ölçüm kademesi aşıldı.';}
  }
  const fmt=format(value,mode,range,c.meterContinuity);unit=fmt.unit;display=warning?'OL':fmt.display;
  if(c.meterHold&&c._meter?.mode===mode&&c._meter.range===range&&!warning){display=c._meter.display;unit=c._meter.unit;value=c._meter.value}
  c._meter={display,unit,value,warning,beep,mode,range};
 }
 function format(value,mode,range,continuity=false){
  if(mode==='Hz'){if(!Number.isFinite(value)||value<0||value>range)return {display:'OL',unit:'Hz'};const scale=value>=1e6?1e-6:value>=1e3?1e-3:1,unit=value>=1e6?'MHz':value>=1e3?'kHz':'Hz',v=value*scale,digits=v>=100?1:v>=10?2:3;return {display:v.toFixed(digits),unit}}
  const scale=mode==='DCA'&&range<1||['DCV','ACV'].includes(mode)&&range<1?1000:mode==='Ω'&&range>=1e6?1e-6:mode==='Ω'&&range>=1000?.001:1;
  const unit=mode==='DCA'?(scale===1000?'mA':'A'):mode==='Ω'?(scale===1e-6?'MΩ':scale===.001?'kΩ':'Ω'):mode==='diode'&&continuity?'Ω':scale===1000?'mV':'V';
  if(!Number.isFinite(value)||(mode!=='diode'&&Math.abs(value)>range+Math.max(1e-12,range*1e-9)))return {display:'OL',unit};
  const resolution=mode==='diode'?(continuity?.1:.001):range/(range===600?600:range===10?1000:2000),digits=scale!==1?3:Math.max(0,Math.min(6,-Math.floor(Math.log10(resolution))));
  return {display:(Math.round(value/resolution)*resolution*scale).toFixed(digits),unit};
 }
 const api={format,ranges,ut61Ranges,rangesFor,setting,label,jack,measure};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSMultimeter=api;
})(typeof window==='undefined'?globalThis:window);
