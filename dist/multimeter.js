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


  // SC770: detached ammeter/voltmeter tips must warn OL, not report 0.
  if(project?.tutorialLesson?.id==='electronic-component-basics-outline-087'&&
     project.sc770MeterGuard==='SC770-RESISTOR-REAL-UT33D-PROBE-TIPS-V1'&&
     ['a1','v1'].includes(c.id)&&d.id==='unit-ut33d-plus'){
   const part=id=>project.components.find(x=>x.id===id);
   const link=(a,ap,b,bp)=>project.wires.some(w=>
     (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
     (w.from?.c===b&&w.from?.p===bp&&w.to?.c===a&&w.to?.p===ap));
   const target=(id,cid,pin)=>part(id)?.probeTarget?.c===cid&&part(id)?.probeTarget?.p===pin;
   const series=link('a1','V','a1-red','PLUG')&&
     link('a1','COM','a1-black','PLUG')&&
     link('a1-red','TIP','g1','P')&&link('a1-black','TIP','r1','1')&&
     target('a1-red','g1','P')&&target('a1-black','r1','1');
   const parallel=link('v1','V','v1-red','PLUG')&&
     link('v1','COM','v1-black','PLUG')&&
     link('v1-red','TIP','r1','1')&&link('v1-black','TIP','r1','2')&&
     target('v1-red','r1','1')&&target('v1-black','r1','2');
   const source=link('r1','2','g1','M')&&part('g1')?.sourceEnabled!==false;
   if(!series||!parallel||!source||(c.id==='a1'?mode!=='DCA':mode!=='DCV')){
     c._meter={display:'OL',unit:c.id==='a1'?'mA':'V',value:null,
       warning:!series?'Seri akım probu çıkarılmış.':!parallel?
       'Paralel voltmetre probu çıkarılmış.':!source?'12 V kaynak dönüşü eksik.':
       'A1 DCA veya V1 DCV kademesi gerekli.',beep:false,mode,range};
     return;
   }
  }

  // Only SC718: a detached TIP or missing supply/feedback is not a 0 V reading.
  if(project?.tutorialLesson?.id==='opamp-apps-outline-056'&&
    project.sc718MeasurementGuard==='SC718-LM358-DIP8-INPUT-OUTPUT-UT33D-V1'&&
    c.id==='v1'&&d.id==='unit-ut33d-plus'){
   const part=id=>project.components.find(x=>x.id===id),
     wire=(a,ap,b,bp)=>project.wires.some(w=>
       (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
       (w.from?.c===b&&w.from?.p===bp&&w.to?.c===a&&w.to?.p===ap));
   const red=part('v1-red'),black=part('v1-black');
   const contacts=red?.probeTarget?.c==='u1'&&red?.probeTarget?.p==='1'&&
     black?.probeTarget?.c==='g1'&&black?.probeTarget?.p==='M'&&
     wire('v1','V','v1-red','PLUG')&&wire('v1','COM','v1-black','PLUG')&&
     wire('v1-red','TIP','u1','1')&&wire('v1-black','TIP','g1','M');
   const power=wire('g1','P','u1','8')&&wire('g1','M','u1','4')&&
     part('g1')?.sourceEnabled!==false;
   const feedback=wire('u1','1','r2','1')&&wire('r2','2','u1','2')&&
     wire('r1','2','u1','2')&&wire('ref1','2','u1','3');
   if(mode!=='DCV'||!contacts||!power||!feedback){
     c._meter={display:'OL',unit:'V',value:null,beep:false,mode,range,
       warning:!contacts?'UNI-T kırmızı OUT / siyah COM prob bağlantısı yok.':
         !power?'LM358 beslemesi eksik.':!feedback?'LM358 geri besleme hattı eksik.':
         'DCV kademesini seçin.'};
     return;
   }
  }

  if(mode==='OFF'){c._meter={display:'',warning:'',beep:false};return}

  // SC424–425: strictly scoped unpowered TRIAC model, only after real probe
  // wiring validation. A diode/ohm reading is not a physical health certificate.
  if(['electronic-switching-outline-052','electronic-switching-outline-053'].includes(project?.tutorialLesson?.id)&&
     ['SC424-TRIAC-UNPOWERED-AVO-V1','SC425-TRIAC-UNPOWERED-PINS-V1'].includes(project.virtualTriacAvo)&&
     c.id==='pg1'&&d.id==='unit-ut33d-plus'){
    const isHealth=project.virtualTriacAvo==='SC424-TRIAC-UNPOWERED-AVO-V1';
    const rp=isHealth?'MT1':'G',bp=isHealth?'MT2':'MT1',needed=isHealth?'Ω':'diode';
    const part=project.components.find(x=>x.id==='pg0'&&x.typeId==='bta16-600b-triac');
    const redProbe=project.components.find(x=>x.id==='pg1-red'&&x.typeId==='test-probe-red');
    const blackProbe=project.components.find(x=>x.id==='pg1-black'&&x.typeId==='test-probe-black');
    const linked=(a,ap,b,bp)=>project.wires.some(w=>
     (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
     (w.to?.c===a&&w.to?.p===ap&&w.from?.c===b&&w.from?.p===bp));
    const touched=!!part&&!!redProbe&&!!blackProbe&&
      linked('pg1','V','pg1-red','PLUG')&&linked('pg1','COM','pg1-black','PLUG')&&
      linked('pg1-red','TIP','pg0',rp)&&linked('pg1-black','TIP','pg0',bp)&&
      redProbe.probeTarget?.c==='pg0'&&redProbe.probeTarget?.p===rp&&
      blackProbe.probeTarget?.c==='pg0'&&blackProbe.probeTarget?.p===bp;
    if(!touched||mode!==needed){
      c._meter={display:'OL',unit:isHealth?'Ω':'V',value:null,
        warning:!touched?'Ölçüm uçları sanal triyak MT1/MT2/G terminallerine bağlı değil.':
        'Sanal ölçüm için uygun enerjisiz '+(isHealth?'Ω':'diyot')+' kademesini seçin.',
        beep:false,mode,range};return;
    }
    const fault=String(part.virtualFault||'normal');
    if(fault==='open'||fault==='open-gate'){
      c._meter={display:'OL',unit:isHealth?'Ω':'V',value:null,
       warning:isHealth?'Bu ölçüm tek başına açık arızayı ayırt edemez.':'Sanal kapı bileşkesinde iletim yok.',
       beep:false,mode,range};return;
    }
    const resistance=isHealth?(fault==='mt-shorted'?1.5:Infinity):null;
    const value=isHealth?resistance:(fault==='gate-shorted'?0:.72);
    const formatted=format(value,mode,range,c.meterContinuity);
    c._meter={display:formatted.display,unit:formatted.unit,value,
      warning:isHealth&&formatted.display==='OL'?
       'MT1–MT2 kapalı konumda OL: kısa devre görülmedi; çalışır durum kanıtı değildir.':'',
      beep:false,mode,range};
    return;
  }


  // SC440: targeted unpowered UT33D+ resistance reading across the actual
  // NTC probe TIP contacts, not a fake reading from detached probe graphics.
  if(project?.tutorialLesson?.id==='electronic-component-basics-outline-024'&&
     project.sc440NtcOhms==='SC440-NTC-OHMMETER-V1'&&
     c.id==='pg1'&&d.id==='unit-ut33d-plus'){
    const linked=(a,ap,b,bp)=>project.wires.some(w=>
      (w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp)||
      (w.to?.c===a&&w.to?.p===ap&&w.from?.c===b&&w.from?.p===bp));
    const sensor=project.components.find(x=>x.id==='pg0'&&x.typeId==='sensor-ntc');
    const rprobe=project.components.find(x=>x.id==='pg1-red'&&x.typeId==='test-probe-red');
    const bprobe=project.components.find(x=>x.id==='pg1-black'&&x.typeId==='test-probe-black');
    const touch=!!sensor&&!!rprobe&&!!bprobe&&
      linked('pg1','V','pg1-red','PLUG')&&linked('pg1','COM','pg1-black','PLUG')&&
      linked('pg1-red','TIP','pg0','1')&&linked('pg1-black','TIP','pg0','2')&&
      rprobe.probeTarget?.c==='pg0'&&rprobe.probeTarget?.p==='1'&&
      bprobe.probeTarget?.c==='pg0'&&bprobe.probeTarget?.p==='2';
    if(mode!=='Ω'||!touch){
      c._meter={display:'OL',unit:'Ω',value:null,
        warning:mode!=='Ω'?'NTC için enerjisiz direnç (Ω) kademesini seçin.':
        'Sanal NTC 1/2 uçlarında kırmızı ve siyah prob teması eksik.',
        beep:false,mode,range};return;
    }
    const temp=Number(sensor.temperatureC);
    if(!Number.isFinite(temp)||temp< -40||temp>125){
      c._meter={display:'OL',unit:'Ω',value:null,
        warning:'Sanal NTC sıcaklık değeri geçersiz.',beep:false,mode,range};return;
    }
    const resistance=10000*Math.exp(3950*(1/(temp+273.15)-1/298.15));
    const reading=format(resistance,mode,range);
    c._meter={display:reading.display,unit:reading.unit,value:resistance,
      warning:reading.display==='OL'?'Sanal ohmmetre kademesi düşük; Ω kademesini yükseltin.':'',
      beep:false,mode,range};
    return;
  }


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
