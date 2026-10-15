(function(root){
 'use strict';
 const T=typeof module==='object'&&module.exports?require('./thermal.js'):root.DTSThermal;
 const num=(v,a,b,f)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
 const key=(c,p)=>JSON.stringify([c.id,p]);
 const same=(net,a,ap,b,bp)=>net.find(key(a,ap))===net.find(key(b,bp));
 const cfg=(c,k,f)=>c.instrumentSettings?.[k]??f;
 const output=(fraction,mode='4-20mA')=>{const f=num(fraction,0,1,0);return mode==='0-10V'?{value:10*f,unit:'V'}:mode==='2-10V'?{value:2+8*f,unit:'V'}:mode==='0-20mA'?{value:20*f,unit:'mA'}:{value:4+16*f,unit:'mA'}};
 function powered(c,d,net){
  const pins=d.instrument==='waz5'?['4','5']:d.instrument==='hmt'?['2','1']:d.instrument==='et4420'?['11','12']:['+','−'];
  const dc=net.dcVoltage(c,...pins);
  if(d.instrument==='et4420'&&cfg(c,'supply','UV')==='UV')return net.at(c,pins[0]).some(a=>a.type==='ac'&&/^L/.test(a.leg)&&a.volts>=90&&a.volts<=250&&net.at(c,pins[1]).some(b=>b.domain===a.domain&&b.leg==='N'));
  if(d.instrument==='et4420'&&cfg(c,'supply','UV')==='LV'&&net.at(c,pins[0]).some(a=>a.type==='ac'&&a.leg!=='N'&&a.volts>=8&&a.volts<=24&&net.at(c,pins[1]).some(b=>b.domain===a.domain&&b.leg==='N')))return true;
  const range=d.instrument==='hmt'?[cfg(c,'input','PT100')==='PT100'?8:10,36]:d.instrument==='waz5'?[18,30]:d.instrument==='ht2'?[21.6,26.4]:d.instrument==='et4420'?[10,30]:[12,28];
  return dc!==null&&dc>=range[0]&&dc<=range[1];
 }
 function sensor(c,d,project,byId,net){
  if(cfg(c,'input','K')==='L')return {error:'L tipi için sayısal eğri desteklenmiyor'};
  const pt=cfg(c,'input',d.instrument==='hmt'?'PT100':'K').startsWith('PT'),a=d.instrument==='hmt'?'4':'9',b=d.instrument==='hmt'?'5':'10';

  // MQ-07 SC23: explicit THREE-lead ET4420 PT100 virtual source validation.
  // B1/B2 are equivalent sensor-side contacts but independent lead edges;
  // the 8-9 bridge from the TWO-wire model must not certify a three-wire lead.
  if(pt&&d.instrument==='et4420'&&c.mq07Pt100ThreeWireInput===true){
   const sensors=project.components.filter(s=>byId[s.typeId]?.id==='sensor-pt100'&&byId[s.typeId]?.ptWires===3);
   if(sensors.length!==1)return {error:'PT100 3 telli sensör eksik / belirsiz'};
   const s=sensors[0],has=(a,b)=>project.wires.some(w=>
    w.from?.c===s.id&&w.from.p===a&&w.to?.c===c.id&&w.to.p===b||
    w.to?.c===s.id&&w.to.p===a&&w.from?.c===c.id&&w.from.p===b);
   const paired=has('B1','8')&&has('B2','9')||has('B1','9')&&has('B2','8');
   if(!has('A','10')||!paired)return {error:'PT100 3 telli giriş bağlantısı eksik / yanlış'};
   const value=num(s.temperature,-200,850,25);
   return {value,source:s.id,resistance:T.resistance(value),leadModel:'ideal-3-wire-no-resistance-compensation'};
  }

  for(const s of project.components){const sd=byId[s.typeId];if(!sd)continue;
   if(pt&&sd.ptWires){
    const direct=same(net,s,'A',c,a)&&same(net,s,'B1',c,b),reverse=same(net,s,'A',c,b)&&same(net,s,'B1',c,a);
    if(!direct&&!reverse)continue;
    if(d.instrument==='hmt'&&(!same(net,c,'5',c,'6')||sd.ptWires!==2))continue;
    if(d.instrument==='et4420'&&!same(net,c,'8',c,'9'))continue;
    const value=num(s.temperature,-200,850,25);if(d.instrument==='hmt'&&value>840)return {error:'HMT-R üst ölçüm sınırı: 840 °C'};
    return {value,source:s.id,resistance:T.resistance(value)};
   }
   if(!pt&&sd.id==='thermocouple'){
    for(let j=0;j+1<sd.pins.length;j+=2){const plus=sd.pins[j].id,minus=sd.pins[j+1].id;
      if(same(net,s,plus,c,a)&&same(net,s,minus,c,b))return (s.thermocoupleType||'K')===cfg(c,'input','K')?{value:num(s.temperature,...T.range(sd,s),25),source:s.id}:{error:'Sensör tipi uyuşmuyor'};
      if(same(net,s,plus,c,b)&&same(net,s,minus,c,a))return {error:'Termokupl polaritesi ters'};
    }
   }
  }
  return {error:pt?'PT100 bağlantısı açık / köprü eksik':'Termokupl bağlantısı açık'};
 }
 function state(c,d,project,byId,net){
  const on=powered(c,d,net),type=d.instrument,s={on,voltage:[],current:[],error:on?'':'Besleme yok / geçersiz'};
  const signal=(a,b,o)=>{s[o.unit==='V'?'voltage':'current'].push({a,b,value:o.unit==='V'?o.value:o.value/1000});return o};
  if(!on)return s;
  if(type==='ht2'){
   s.temperature=num(cfg(c,'temperature',25),-40,80,25);s.humidity=num(cfg(c,'humidity',50),0,100,50);
   const mode=cfg(c,'output','4-20mA');s.t=signal('T','−',output((s.temperature+40)/120,mode));s.rh=signal('RH','−',output(s.humidity/100,mode));
  }else if(type==='waz5'){
   s.input=cfg(c,'source','manual')==='manual'?num(cfg(c,'inputValue',5),0,10,5):net.dcVoltage(c,'2','3');
   if(s.input===null||s.input<0||s.input>10){s.error='Giriş yok / 0–10 V dışında';return s}
   s.output=signal('7','8',output(s.input/10));
  }else if(type==='hmt'){
   const r=sensor(c,d,project,byId,net);if(r.error){s.error=r.error;return s}s.temperature=r.value;
   const lo=num(cfg(c,'low',0),-200,1800,0),hi=num(cfg(c,'high',100),-199,1800,100);if(hi<=lo){s.error='Üst sınır alt sınırdan büyük olmalı';return s}
   s.output=signal('1','2',output((r.value-lo)/(hi-lo)));s.model=cfg(c,'input','PT100')==='PT100'?'HMT-R':'HMT-T';
  }else if(type==='tx11'){
   s.voltage.push({a:'EX+',b:'EX−',value:5});
   const cell=project.components.find(p=>byId[p.typeId]?.id==='load-cell'&&same(net,p,'EX+',c,'EX+')&&same(net,p,'EX−',c,'EX−')&&same(net,p,'SIG+',c,'S+')&&same(net,p,'SIG−',c,'S−'));
   if(!cell){s.error='Loadcell bağlantısı eksik / ters';return s}
   s.input=net.dcVoltage(c,'S+','S−');if(s.input===null){s.error='Loadcell sinyali yok';return s}
   s.input*=1000;
   const zero=num(cfg(c,'zeroMv',0),-19,19,0),span=num(cfg(c,'spanMv',10),.01,38,10),capacity=num(cfg(c,'capacity',1000),.01,1e6,1000),f=(s.input-zero)/span;
   s.weight=f*capacity;s.outputMode=same(net,c,'T',c,'R')?'0-10V':cfg(c,'output','4-20mA');s.output=output(f,s.outputMode);s.outputPins=s.output.unit==='V'?['V','G']:['I','G'];
   if(s.input< -19||s.input>19||f>1.05){s.error='Ölçüm aralığı aşıldı';s.output.value=s.output.unit==='V'?11:24}else if(f<-.05){s.error='Sıfır altı';s.output.value=s.output.unit==='V'?-4:0}
   signal(s.output.unit==='V'?'V':'I','G',s.output);
  }
  return s;
 }
 function links(c,d,actuators){
  if(d.instrument==='waz5')return [['4','10'],['5','11']];
  if(d.instrument==='tx11'&&cfg(c,'output','4-20mA')==='0-10V')return [['T','R']];
  if(d.instrument==='et4420')return [["14",actuators.get('@'+c.id+':main')?'15':'13'],...(actuators.get('@'+c.id+':alarm1')?[['16','17']]:[])];
  return [];
 }
 const limits={PT100:[-200,600],K:[-30,1300],J:[-30,600],L:[-30,600],T:[-30,400],S:[-40,1700],R:[-40,1700],B:[200,1700]};
 function alarm(c,n,pv,sp,old,error){
  if(error)return cfg(c,'a'+n+'Error','off')==='on';
  const set=Number(cfg(c,'a'+n+'Set',500)),hy=num(cfg(c,'a'+n+'Hy',2),1,50,2),type=cfg(c,'a'+n+'Type','indE'),high=cfg(c,'a'+n+'State','Hi')==='Hi';
  if(type==='band'||type==='bAni'){const outside=Math.abs(pv-sp)>Math.abs(set)+(old?-hy:0);if(type==='bAni'&&!c['_alarmArmed'+n]){if(!outside)c['_alarmArmed'+n]=true;return false}return high?outside:!outside}
  const threshold=type==='dE'?sp+set:set;
  return high?pv>=threshold-(old?hy:0):pv<=threshold+(old?hy:0);
 }
 function controller(c,d,project,byId,net,now){
  const prev=c._controller||{},on=powered(c,d,net);if(!on){delete c._pid;delete c._alarmArmed1;delete c._alarmArmed2;return c._controller={on:false,main:false,alarm1:false,ssr:false,error:'Besleme yok'}}
  const input=cfg(c,'input','K'),read=sensor(c,d,project,byId,net),baseRange=limits[input]||limits.K,range=cfg(c,'decimal','off')==='on'?[baseRange[0],Math.min(baseRange[1],999.9)]:baseRange;
  let error=read.error||'',pv=read.value;
  if(!error&&(pv<range[0]||pv>range[1]))error=pv<range[0]?'Alt ölçüm sınırı':'Üst ölçüm sınırı';
  if(!error)pv+=num(cfg(c,'offset',0),-10,10,0);
  const din=same(net,c,'6',c,'7'),dinFn=cfg(c,'din','none'),manual=cfg(c,'mode','auto')==='manual'||din&&dinFn==='manual',second=cfg(c,'secondSet','off')==='on'||din&&dinFn==='second';
  const lo=Number(cfg(c,'setLow',0)),hi=Number(cfg(c,'setHigh',600)),sp=num(cfg(c,second?'set2':'set',400),lo,Math.max(lo,hi),400),heat=cfg(c,'direction','heat')==='heat',pb=num(cfg(c,'pb',4),0,100,4),hy=num(cfg(c,'hy',2),1,50,2);
  let pid=c._pid||{at:now,start:now,integral:0,lastPV:pv,power:0,filtered:pv};
  if(!error&&Number.isFinite(pv)){const elapsed=Math.max(0,now-pid.at)/1000;if(elapsed>=.1||!c._pid){const filter=num(cfg(c,'filter',10),1,200,10);pid.filtered=Number.isFinite(pid.filtered)?pid.filtered+(pv-pid.filtered)/filter:pv;pv=pid.filtered;const e=(sp-pv)*(heat?1:-1),band=(range[1]-range[0])*pb/100,ti=num(cfg(c,'ti',4),0,100,4)*60,td=num(cfg(c,'td',1),0,10,1)*60;
    if(pb){const p=e/band*100,bias=num(cfg(c,'bias',0),0,100,0),delta=ti?p*elapsed/ti:0,derivative=elapsed?-(pv-pid.lastPV)*(heat?1:-1)/band*100*td/elapsed:0,trial=p+pid.integral+delta+derivative+bias;if(trial>=0&&trial<=100||trial>100&&delta<0||trial<0&&delta>0)pid.integral+=delta;pid.power=num(p+pid.integral+derivative+bias,0,100,0)}else pid.power=(heat?(pv<sp-(prev.power>0?0:hy)):(pv>sp+(prev.power>0?0:hy)))?100:0;
    pid.at=now;pid.lastPV=pv;
   }else pv=pid.filtered;
  }
  let power=error?(cfg(c,'failure','percent')==='last'?prev.power||0:num(cfg(c,'errorPower',0),0,100,0)):manual?num(cfg(c,'manualPower',50),0,100,50):pid.power;
  let tune=c._autoTune;
  if(tune?.active){
   if(error||manual){tune.active=false;tune.status='Durduruldu: sensör / elle kontrol'}
   else if(tune.start===undefined){if(pv>sp*.6){tune.active=false;tune.status='Başlangıç sıcaklığı ayarın %60 altında olmalı'}else Object.assign(tune,{start:now,high:true,min:pv,max:pv,crossings:[],status:'PID hesaplanıyor; proses cevabı bekleniyor'})}
   if(tune.active){tune.min=Math.min(tune.min,pv);tune.max=Math.max(tune.max,pv);const high=pv<=sp-hy?true:pv>=sp+hy?false:tune.high;if(high!==tune.high){tune.crossings.push(now);tune.high=high}power=tune.high?100:0;
    if(tune.crossings.length>=6&&tune.max-tune.min>hy){const a=(tune.max-tune.min)/2,ku=4*50/(Math.PI*a),pu=(tune.crossings.at(-1)-tune.crossings.at(-5))/2000;c.instrumentSettings={...(c.instrumentSettings||{}),pb:num(10000/(.6*ku*(range[1]-range[0])),.1,100,4),ti:num(pu/120,.1,100,4),td:num(pu/480,.01,10,1)};tune.active=false;tune.status='PID ayarları hesaplandı';pid.integral=0}
   }
  }
  const soft=num(cfg(c,'softStart',0),0,250,0)*60000;if(soft)power=Math.min(power,Math.max(0,(now-pid.start)/soft)*100);
  const displayOnly=cfg(c,'displayOnly','off')==='on'||din&&dinFn==='display';if(displayOnly)power=0;
  const period=num(cfg(c,'cycle',20),1,125,20)*1000,active=power>0&&(now-pid.start)%period<period*power/100,ssr=cfg(c,'controlOutput','relay')==='ssr';
  let a1=alarm(c,1,pv,sp,prev.alarm1,error);const a2=alarm(c,2,pv,sp,prev.alarm2,error),a1mode=cfg(c,'a1Type','indE');
  if(['cool','relativeCool'].includes(a1mode)){
   const ap=num(cfg(c,'a1Pb',0),0,100,0),aset=num(cfg(c,'a1Set',500),Number(cfg(c,'a1Low',0)),Number(cfg(c,'a1High',600)),500)+(a1mode==='relativeCool'?sp:0),e=pv-aset,a=c._a1pid||{at:now,integral:0,lastPV:pv,power:0};
   if(now-a.at>=100||!c._a1pid){const dt=Math.max(.1,(now-a.at)/1000),band=(range[1]-range[0])*ap/100,ti=num(cfg(c,'a1Ti',0),0,100,0)*60,td=num(cfg(c,'a1Td',0),0,25,0)*60,p=ap?e/band*100:0;if(ti&&a.power>0&&a.power<100)a.integral+=p*dt/ti;a.power=ap?num(p+a.integral+(pv-a.lastPV)/dt/band*100*td+Number(cfg(c,'a1Bias',0)),0,100,0):pv>aset+(prev.alarm1?0:Number(cfg(c,'a1Hy',2)))?100:0;a.at=now;a.lastPV=pv}
   const powerA=error?num(cfg(c,'a1ErrorPower',0),0,100,0):a.power,periodA=num(cfg(c,'a1Cycle',20),1,125,20)*1000;a1=powerA>0&&(now-pid.start)%periodA<periodA*powerA/100;c._a1pid=a;
  }
  if(displayOnly)a1=false;
  c._pid=pid;return c._controller={on,pv,sp,power,error,main:!displayOnly&&(ssr?a2:active),alarm1:a1,alarm2:!displayOnly&&a2,ssr:ssr&&active,manual,displayOnly,tune:tune?.status};
 }
 function migrate(project,byId){for(const c of project.components){const d=byId[c.typeId];if(!d?.instrument)continue;if(project.wires.some(w=>[w.from,w.to].some(e=>e.c===c.id&&!d.pins.some(p=>p.id===e.p)))&&byId[c.typeId+'-legacy-v114'])c.typeId+='-legacy-v114'}return project}
 const api={cfg,num,output,powered,sensor,state,links,controller,limits,migrate};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSInstruments=api;
})(typeof window==='undefined'?globalThis:window);
