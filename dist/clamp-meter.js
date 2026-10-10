(function(root){
 'use strict';
 const ranges=[['OFF',0],['ACA',2],['ACA',20],['ACA',200],['ACV',600],['DCV',600],['Ω',20000],['diode',2]];
 const setting=c=>ranges[Math.max(0,Math.min(ranges.length-1,Math.round(Number(c.meterPosition)||0)))];
 const label=i=>{const [mode,r]=ranges[i];if(mode==='OFF')return 'OFF';if(mode==='ACA')return r+' A AC · pens';if(mode==='ACV')return '600 V AC · problar';if(mode==='DCV')return '600 V DC · problar';if(mode==='Ω')return '20 kΩ · problar';return 'Diyot / Süreklilik · problar'};
 const endpointKey=r=>r?.j?'j:'+r.j:JSON.stringify([r?.c,r?.p]);
 const definition={id:'unit-ut200a',name:'UNI-T UT200A Dijital Pens Ampermetre',brand:'UNI-T',model:'UT200A',category:'Ölçü aletleri',catalogGroup:'measurement',library:'Üretici cihazları',standard:'Üretici bağlantısı',kind:'clamp-meter',w:180,h:340,pins:[{id:'COM',label:'COM',x:55,y:320,side:'bottom'},{id:'V',label:'VΩ',x:125,y:320,side:'bottom'}],bookSymbol:'display',bookMark:'A~ / V / Ω',refPrefix:'P',clampJawMm:28,displayCount:2000,ut200a:true,sourceUrl:'https://meters.uni-trend.com/product/ut200a/'};
 function register(lib){if(Array.isArray(lib)&&!lib.some(d=>d.id===definition.id))lib.push({...definition,pins:definition.pins.map(p=>({...p}))})}
 if(root?.COMPONENT_LIBRARY)register(root.COMPONENT_LIBRARY);

 function partitions(project,target){
  const wires=project.wires.filter(w=>w.id!==target.id&&!w.probeLead&&!w.mechanical&&w.role!=='MECHANICAL'),adj=new Map();
  const add=(a,b)=>{if(!adj.has(a))adj.set(a,new Set());adj.get(a).add(b)};
  for(const w of wires){const a=endpointKey(w.from),b=endpointKey(w.to);add(a,b);add(b,a)}
  const walk=start=>{const seen=new Set(),q=[start];while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);for(const z of adj.get(n)||[])q.push(z)}return seen};
  const a=endpointKey(target.from),b=endpointKey(target.to),left=walk(a),right=walk(b);
  return {left,right,ambiguous:left.has(b)||right.has(a)};
 }
 function branchVector(b,voltages){
  if(!b?.c||!b.ap||!b.bp)return [0,0];
  if(b.role==='current-source'&&b.source)return [-Number(b.source.value||0),0];
  const a=voltages.get(b.a)||[0,0],z=voltages.get(b.b)||[0,0],vr=a[0]-z[0],vi=a[1]-z[1];
  if(b.role==='diode')return [Math.max(0,(vr-(b.drop||.7))/Math.max(1e-9,b.r)),0];
  if(b.y)return [vr*b.y[0]-vi*b.y[1],vr*b.y[1]+vi*b.y[0]];
  const r=Math.max(1e-9,Number(b.r)||1e9);return [vr/r,vi/r];
 }
 function sideCurrent(side,context){
  let re=0,im=0,ac=false,crossings=0;
  for(const b of context.branches){
   if(!b?.c||!b.ap||!b.bp)continue;
   const ka=endpointKey({c:b.c.id,p:b.ap}),kb=endpointKey({c:b.c.id,p:b.bp}),ia=side.has(ka),ib=side.has(kb);
   if(ia===ib)continue;
   crossings++;
   const v=branchVector(b,context.voltages),sign=ia?1:-1;re+=sign*v[0];im+=sign*v[1];
   if(context.acNodes?.has(b.a)||context.acNodes?.has(b.b))ac=true;
  }
  return {value:Math.hypot(re,im),ac,crossings};
 }
 function wireCurrent(project,wireId,context){
  const target=project.wires.find(w=>w.id===wireId);
  if(!target||target.probeLead||target.mechanical||target.role==='MECHANICAL')return {ok:false,reason:'Pens yalnız normal devre iletkenini kavrayabilir.'};
  const p=partitions(project,target);if(p.ambiguous)return {ok:false,reason:'Bu iletkende alternatif ideal kablo yolu var; tek iletken akımı ayrılamıyor.'};
  const a=sideCurrent(p.left,context),b=sideCurrent(p.right,context),best=a.value>=b.value?a:b;
  return {ok:true,value:best.value,ac:a.ac||b.ac,crossings:Math.max(a.crossings,b.crossings)};
 }
 function format(value,mode,range,continuity=false){
  if(!Number.isFinite(value))return {display:'OL',unit:mode==='Ω'?'kΩ':mode==='ACA'?'A':'V'};
  if(mode==='ACA'){if(Math.abs(value)>range+range*1e-9)return {display:'OL',unit:'A'};const digits=range===2?3:range===20?2:1;return {display:value.toFixed(digits),unit:'A'}}
  if(mode==='Ω'){if(value>range)return {display:'OL',unit:'kΩ'};return {display:(value/1000).toFixed(value<1000?3:2),unit:'kΩ'}}
  if(mode==='diode'){if(continuity)return {display:Number.isFinite(value)?value.toFixed(1):'OL',unit:'Ω'};return {display:value<=2?value.toFixed(3):'OL',unit:'V'}}
  if(Math.abs(value)>600)return {display:'OL',unit:'V'};return {display:value.toFixed(1),unit:'V'};
 }
 function measure(c,d,context){
  const [mode,range]=setting(c),project=context.project;
  if(mode==='OFF'){c._clamp={display:'',unit:'',value:null,warning:'',beep:false,mode,range};return c._clamp}
  let value=null,warning='',beep=false,unit='',display='—';
  if(mode==='ACA'){
   if(!c.clampedWireId)warning='Çene bir devre iletkenini kavramıyor.';
   else{const r=wireCurrent(project,c.clampedWireId,context);if(!r.ok)warning=r.reason;else if(!r.ac)warning='UT200A pens akımı yalnız AC akım ölçer; DC iletkende pens okuması üretilmez.';else{value=r.value;const f=format(value,mode,range);display=f.display;unit=f.unit;if(display==='OL')warning=range+' A AC kademesi aşıldı.'}}
  }else{
   const red=context.pin(c,'V'),black=context.pin(c,'COM'),wired=p=>project.wires.some(w=>[w.from,w.to].some(e=>e.c===c.id&&e.p===p));
   if(!wired('V')||!wired('COM'))warning='Prob bağlantısı eksik: kırmızı VΩ, siyah COM girişinde olmalı.';
   const circuit=context.branches.filter(b=>b.c!==c),seen=new Set(),q=[red,black];while(q.length){const n=q.pop();if(seen.has(n))continue;seen.add(n);for(const b of circuit){if(b.a===n)q.push(b.b);if(b.b===n)q.push(b.a)}}
   const isAC=[...seen].some(n=>context.acNodes.has(n)),isDC=[...seen].some(n=>context.dcNodes.has(n));
   if(!warning&&['Ω','diode'].includes(mode)){
    if(isAC||isDC)warning='Direnç / diyot ölçümü enerjili devrede simüle edilmez.';
    else{
     const ohms=context.solveGraph(circuit,new Map([[black,[0,0]]]),new Map([[red,[1,0]],[black,[-1,0]]]));const reachable=new Set(),queue=[red];while(queue.length){const n=queue.pop();if(reachable.has(n))continue;reachable.add(n);for(const b of circuit){if(b.a===n)queue.push(b.b);if(b.b===n)queue.push(b.a)}}
     value=red===black?0:reachable.has(black)?Math.abs((ohms.get(red)?.[0]||0)-(ohms.get(black)?.[0]||0)):Infinity;
     if(mode==='diode'&&!c.meterContinuity){const diode=project.components.find(p=>context.byId[p.typeId]?.kind==='diode'&&context.pin(p,context.byId[p.typeId].pins[0].id)===red&&context.pin(p,context.byId[p.typeId].pins[1].id)===black);value=diode?.65:value<10?0:Infinity}else beep=mode==='diode'&&value<10;
     const f=format(value,mode,range,!!c.meterContinuity);display=f.display;unit=f.unit;
    }
   }else if(!warning){
    const a=context.voltages.get(red),z=context.voltages.get(black);value=a&&z?mode==='DCV'?a[0]-z[0]:Math.hypot(a[0]-z[0],a[1]-z[1]):0;
    if(mode==='DCV'&&isAC||mode==='ACV'&&isDC)warning='AC/DC gerilim kademesi devredeki besleme türüyle uyuşmuyor.';
    const f=format(value,mode,range);display=f.display;unit=f.unit;if(display==='OL'&&!warning)warning='600 V ölçüm sınırı aşıldı.';
   }
  }
  if(warning&&display==='—'&&mode!=='ACA')display='OL';
  if(c.meterHold&&c._clamp?.mode===mode&&c._clamp.range===range&&!warning){display=c._clamp.display;unit=c._clamp.unit;value=c._clamp.value;beep=c._clamp.beep}
  c._clamp={display,unit,value,warning,beep,mode,range,clampedWireId:c.clampedWireId||null};return c._clamp;
 }
 const api={ranges,setting,label,definition,register,wireCurrent,format,measure};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSClampMeter=api;
})(typeof window==='undefined'?globalThis:window);
