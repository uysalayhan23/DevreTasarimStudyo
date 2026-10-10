(function(root){
  'use strict';
  // SINAMICS V20 6SL3210-5BB21-5UV1 educational model.
  // Sources and the intentionally bounded physical model are in V20_KILAVUZU.md.
  const id='sinamics-v20-1p',clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
  const parameters=[];
  function parameter(key,name,value,group,min,max,unit='',live=false,choices=null){parameters.push({key,name,value,group,min,max,unit,live,choices});}
  parameter('P0003','Erişim seviyesi',1,'Genel',1,3,'',true,{1:'Standart',2:'Genişletilmiş',3:'Uzman'});
  parameter('P0010','Devreye alma',0,'Genel',0,30,'',false,{0:'Çalışmaya hazır',1:'Hızlı devreye alma',30:'Fabrika ayarları'});
  parameter('P0304','Motor anma gerilimi',230,'Motor',10,2000,'V');
  parameter('P0305','Motor anma akımı',7.8,'Motor',.01,10000,'A');
  parameter('P0307','Motor anma gücü',1.5,'Motor',.01,2000,'kW');
  parameter('P0308','Motor cos φ',.8,'Motor',.1,1);
  parameter('P0310','Motor anma frekansı',50,'Motor',12,550,'Hz');
  parameter('P0311','Motor anma devri',1400,'Motor',1,40000,'dev/dk');
  parameter('P0640','Motor aşırı yük katsayısı',150,'Motor',10,400,'%',true);
  parameter('P0700','Komut kaynağı',1,'Kumanda',1,2,'',false,{1:'BOP · ön panel',2:'Klemensler'});
  const diFunctions={0:'Devre dışı',1:'ON / OFF1',2:'Ters ON / OFF1',3:'OFF2 · serbest duruş (NC)',4:'OFF3 · hızlı duruş (NC)',9:'Hata onayı',10:'JOG ileri',11:'JOG geri',12:'Yönü ters çevir',13:'MOP artır',14:'MOP azalt',15:'Sabit hız bit 0',16:'Sabit hız bit 1',17:'Sabit hız bit 2',18:'Sabit hız bit 3',29:'Harici arıza (NC)'};
  for(let i=1;i<=4;i++)parameter('P070'+i,'DI'+i+' işlevi',0,'Dijital G/Ç',0,29,'',false,diFunctions);
  parameter('P0727','Kumanda yöntemi',0,'Kumanda',0,3,'',false,{0:'İki telli',2:'Üç telli ileri / geri',3:'Üç telli ON / OFF'});
  const doFunctions={'52.0':'Sürücü hazır','52.1':'Çalışmaya hazır','52.2':'Sürücü çalışıyor','52.3':'Arıza yok (arıza olunca açar)','52.7':'Uyarı var'};
  parameter('P0731','DO1 transistör çıkışı',52.2,'Dijital G/Ç',0,99,'',false,doFunctions);
  parameter('P0732','DO2 röle çıkışı',52.3,'Dijital G/Ç',0,99,'',false,doFunctions);
  parameter('P0748','Dijital çıkış tersleme',0,'Dijital G/Ç',0,3,'',false,{0:'Yok',1:'DO1 ters',2:'DO2 ters',3:'Her ikisi ters'});
  for(let i=0;i<2;i++){
    parameter('P0756.'+i,'AI'+(i+1)+' sinyal türü',0,'Analog G/Ç',0,i?3:4,'',false,{0:'0–10 V',1:'Gerilim · kopukluk izleme',2:'0–20 mA / 4–20 mA',3:'Akım · kopukluk izleme',...(!i?{4:'−10 … +10 V'}:{})});
    parameter('P0757.'+i,'AI'+(i+1)+' alt giriş x1',0,'Analog G/Ç',-20,20,'V / mA',true);
    parameter('P0758.'+i,'AI'+(i+1)+' alt ölçek y1',0,'Analog G/Ç',-99999,99999,'%',true);
    parameter('P0759.'+i,'AI'+(i+1)+' üst giriş x2',10,'Analog G/Ç',-20,20,'V / mA',true);
    parameter('P0760.'+i,'AI'+(i+1)+' üst ölçek y2',100,'Analog G/Ç',-99999,99999,'%',true);
    parameter('P0761.'+i,'AI'+(i+1)+' ölü bant',0,'Analog G/Ç',0,20,'V / mA',true);
  }
  parameter('P0771','AO1 izlenen değer',21,'Analog G/Ç',21,27,'',false,{21:'Frekans / P2000',24:'Çıkış frekansı / P2000',25:'Çıkış gerilimi / P2001',26:'DC bara / P2001',27:'Motor akımı / P2002'});
  parameter('P0775','AO1 mutlak değer',0,'Analog G/Ç',0,1,'',false,{0:'İşaretli',1:'Mutlak değer'});
  for(const [key,name,val,min,max,unit] of [['P0777','AO1 x1',0,-99999,99999,'%'],['P0778','AO1 y1',0,0,20,'mA'],['P0779','AO1 x2',100,-99999,99999,'%'],['P0780','AO1 y2',20,0,20,'mA']])parameter(key,name,val,'Analog G/Ç',min,max,unit,true);
  parameter('P1000','Frekans kaynağı',1,'Hız',0,23,'',false,{0:'Referans yok',1:'MOP · panel frekansı',2:'AI1',3:'Sabit frekanslar',7:'AI2',23:'AI1 + sabit frekans (Cn005)'});
  for(let i=1;i<=15;i++)parameter('P'+(1000+i),'Sabit frekans '+i,({1:10,2:15,3:25,4:50}[i]||0),'Sabit hızlar',-550,550,'Hz',true);
  parameter('P1016','Sabit frekans seçimi',1,'Sabit hızlar',1,2,'',false,{1:'Doğrudan · seçilen hızları topla',2:'İkili · bitlerle hız seç'});
  parameter('P1040','MOP frekans referansı',0,'Hız',-550,550,'Hz',true);
  parameter('P1047','MOP artırma süresi',10,'Hız',0,650,'s',true);
  parameter('P1048','MOP azaltma süresi',10,'Hız',0,650,'s',true);
  parameter('P1058','JOG ileri frekansı',5,'Hız',0,550,'Hz',true);
  parameter('P1059','JOG geri frekansı',5,'Hız',0,550,'Hz',true);
  parameter('P1060','JOG kalkış rampası',10,'Rampalar',0,650,'s',true);
  parameter('P1061','JOG duruş rampası',10,'Rampalar',0,650,'s',true);
  parameter('P1080','Minimum frekans',0,'Hız',0,550,'Hz',true);
  parameter('P1082','Maksimum frekans',50,'Hız',0,550,'Hz');
  parameter('P1110','Negatif frekansı engelle',0,'Hız',0,1,'',false,{0:'Yön değiştirme açık',1:'Yalnız ileri'});
  parameter('P1120','Kalkış rampası',10,'Rampalar',0,650,'s',true);
  parameter('P1121','Duruş rampası',10,'Rampalar',0,650,'s',true);
  parameter('P1135','OFF3 hızlı duruş',5,'Rampalar',0,650,'s',true);
  parameter('P1300','Kontrol yöntemi',0,'Motor',0,2,'',false,{0:'Doğrusal V/f',2:'Karesel V/f · fan / pompa'});
  parameter('P2000','Referans frekansı',50,'Ölçekler',1,550,'Hz');
  parameter('P2001','Referans gerilimi',230,'Ölçekler',10,2000,'V');
  parameter('P2002','Referans akımı',7.8,'Ölçekler',.01,10000,'A');
  parameter('P2200','PID denetimi',0,'PID',0,1,'',false,{0:'Kapalı',1:'Açık'});
  for(let i=1;i<=3;i++)parameter('P220'+i,'Sabit PID referansı '+i,[10,20,50][i-1],'PID',-200,200,'%',true);
  parameter('P2280','PID oransal kazanç',3,'PID',0,65,'',true);
  parameter('P2285','PID integral süresi',0,'PID',0,60,'s',true);
  const definitions=Object.fromEntries(parameters.map(p=>[p.key,p]));
  const macros=[['Cn001','Ön panel (BOP)'],['Cn002','Terminaller · analog hız'],['Cn003','Üç sabit hız'],['Cn004','İkili sabit hız seçimi'],['Cn005','Analog + sabit hız'],['Cn006','Üç telli buton + MOP'],['Cn007','Üç telli ileri / geri + analog'],['Cn008','PID · AI1 referans / AI2 geri besleme'],['Cn009','PID · sabit referans / AI2 geri besleme']];
  const faults={F1:'Aşırı akım / çıkış kısa devresi',F2:'DC bara aşırı gerilimi',F3:'Düşük şebeke gerilimi',F4:'Sürücü aşırı sıcaklığı',F5:'Sürücü aşırı yükü (I²t)',F11:'Motor aşırı yükü',F80:'Analog giriş sinyali kayıp',F85:'Harici arıza'};
  function fresh(){return {schema:1,macro:'Cn001',params:Object.fromEntries(parameters.map(p=>[p.key,p.value])),run:false,reverse:false,reset:0,load:50,temperature:30};}
  function config(c){
    if(!c.v20||typeof c.v20!=='object'){c.v20=fresh();const p=c.v20.params;p.P0700=c.driveControl==='local'?1:2;p.P1000=c.driveSpeedSource==='analog'?2:1;p.P1040=num(c.driveFrequency,50);[1,12,9,10].forEach((v,i)=>p['P070'+(i+1)]=v);c.v20.run=!!c.driveRun;c.v20.reverse=!!c.driveReverse;c.v20.macro='Özel';}
    const v=c.v20;v.params={...Object.fromEntries(parameters.map(p=>[p.key,p.value])),...v.params};
    for(const d of parameters){const n=Number(v.params[d.key]);v.params[d.key]=Number.isFinite(n)&&n>=d.min&&n<=d.max&&(!d.choices||Object.keys(d.choices).some(k=>Number(k)===n))?n:d.value;}
    v.params.P1080=Math.min(v.params.P1080,v.params.P1082);return v;
  }
  function create(c){c.v20=fresh();return c.v20;}
  function peek(c){return config({...c,v20:c.v20?{...c.v20,params:{...c.v20.params}}:undefined});}
  function applyMacro(c,macro){
    if(c._v20?.running)return {ok:false,error:'Makroyu değiştirmek için sürücüyü durdurun.'};
    if(!macros.some(m=>m[0]===macro))return {ok:false,error:'Bu bağlantı makrosu desteklenmiyor.'};
    const v=config(c),p=v.params;p.P0700=macro==='Cn001'?1:2;p.P1000=1;p.P0727=0;p.P2200=0;p.P1016=1;
    const i=Number(macro.slice(2));let di=[0,0,0,0];
    if(i===2){p.P1000=2;di=[1,12,9,10];}
    if(i===3){p.P1000=3;di=[1,15,16,17];}
    if(i===4){p.P1000=3;p.P1016=2;di=[15,16,17,18];}
    if(i===5){p.P1000=23;di=[1,15,16,9];}
    if(i===6){p.P0727=3;di=[2,1,13,14];p.P1040=0;}
    if(i===7){p.P0727=2;p.P1000=2;di=[1,2,12,9];}
    if(i===8||i===9){p.P2200=1;di=i===8?[1,0,9,0]:[1,15,16,17];p['P0756.1']=2;p['P0759.1']=20;}
    di.forEach((n,k)=>p['P070'+(k+1)]=n);p.P0731=52.2;p.P0732=52.3;p.P0748=0;
    if(i>=2&&i<=9){p['P0756.0']=0;p['P0757.0']=0;p['P0758.0']=0;p['P0759.0']=10;p['P0760.0']=100;}
    v.macro=macro;v.run=false;v.reverse=false;return {ok:true};
  }
  function set(c,key,value){
    const d=definitions[key],v=config(c),p=v.params,n=Number(value);
    if(!d||!Number.isFinite(n)||n<d.min||n>d.max||(d.choices&&!Object.keys(d.choices).some(k=>Number(k)===n)))return {ok:false,error:'Parametre değeri izin verilen aralıkta değil.'};
    if(c._v20?.running&&!d.live)return {ok:false,error:'Bu parametre yalnızca sürücü dururken değiştirilebilir.'};
    if((key==='P1080'&&n>p.P1082)||(key==='P1082'&&n<p.P1080))return {ok:false,error:'Minimum frekans maksimum frekansı aşamaz.'};
    const pair=key.startsWith('P0757.')?key.replace('0757','0759'):key.startsWith('P0759.')?key.replace('0759','0757'):key==='P0777'?'P0779':key==='P0779'?'P0777':null;
    if(pair&&n===p[pair])return {ok:false,error:'Ölçekleme x1 ve x2 değerleri farklı olmalı.'};
    p[key]=n;
    if(/^P070[1-4]$/.test(key)&&n===1)for(let i=1;i<=4;i++)if('P070'+i!==key&&p['P070'+i]===1)p['P070'+i]=0;
    if(key.startsWith('P0756.')){const i=key.split('.')[1];p['P0757.'+i]=n===3?4:0;p['P0759.'+i]=[2,3].includes(n)?20:10;p['P0761.'+i]=n===3?4:n===1?2:0;}
    v.macro='Özel';return {ok:true};
  }
  function action(c,key){
    const v=config(c),p=v.params;
    if(key==='reset'){v.reset=(v.reset||0)+1;v.run=false;return {ok:true};}
    if(key==='finish'){p.P0010=0;return {ok:true};}
    if(key==='factory'){if(c._v20?.running)return {ok:false,error:'Önce sürücüyü durdurun.'};if(p.P0010!==30)return {ok:false,error:'Fabrika ayarları için önce P0010 = 30 seçin.'};create(c);return {ok:true};}
    if(key==='display'){v.display=((v.display||0)+1)%5;return {ok:true};}
    if(key==='stop'||key==='off2'){v.run=false;v.jog=false;v.stopSerial=(v.stopSerial||0)+1;v.stopMode=key;return {ok:true};}
    if(p.P0700!==1)return {ok:false,error:'Çalıştırma/yön komutu klemenslerden alınır (P0700 = 2).'};
    if(key==='run')v.run=true;
    if(key==='reverse')v.reverse=!v.reverse;
    if(key==='up'||key==='down')p.P1040=clamp(p.P1040+(key==='up'?1:-1),-p.P1082,p.P1082);
    if(key==='jog')v.jog=true;
    if(key==='jog-release')v.jog=false;
    return {ok:true};
  }
  function clear(c){delete c._v20;delete c._v20Frame;delete c._driveFrequency;delete c._driveIO;delete c._v20Numeric;delete c._v20MotorHz;}
  const lerp=(x,x1,y1,x2,y2)=>Math.abs(x2-x1)<1e-12?0:y1+(x-x1)*(y2-y1)/(x2-x1);
  function move(from,to,rate,dt){if(!Number.isFinite(rate))return to;return from+Math.sign(to-from)*Math.min(Math.abs(to-from),rate*dt);}
  function ramp(from,to,up,down,max,dt){
    const ur=up>0?max/up:Infinity,dr=down>0?max/down:Infinity;
    if(from*to<0){const t=dr===Infinity?0:Math.abs(from)/dr;return dt<=t?move(from,0,dr,dt):move(0,to,ur,dt-t);}
    return move(from,to,Math.abs(to)>Math.abs(from)?ur:dr,dt);
  }
  function tick(c,input,now){
    const v=config(c),p=v.params;
    if(c._v20Frame?.now!==now)c._v20Frame={now,base:c._v20?JSON.parse(JSON.stringify(c._v20)):null};
    const b=c._v20Frame.base||{now,hz:0,di:[false,false,false,false],integral:0,overload:0,reset:v.reset,stopSerial:v.stopSerial||0},dt=Math.max(0,(now-b.now)/1000);
    const power=input.voltage>0,di=input.di||[false,false,false,false],ai=(input.ai||[0,0]).map((volts,i)=>{
      const raw=[2,3].includes(p['P0756.'+i])?volts/235*1000:volts;
      const scaled=lerp(raw,p['P0757.'+i],p['P0758.'+i],p['P0759.'+i],p['P0760.'+i]);
      return {raw,percent:clamp(Math.abs(raw)<p['P0761.'+i]&&![1,3].includes(p['P0756.'+i])?0:scaled,p['P0756.'+i]===4?-100:0,100)};
    });
    const has=f=>di.some((on,i)=>on&&p['P070'+(i+1)]===f),assigned=f=>[1,2,3,4].some(i=>p['P070'+i]===f),edge=i=>di[i]&&!b.di[i];
    const reset=has(9)&&!b.di.some((on,i)=>on&&p['P070'+(i+1)]===9)||v.reset!==b.reset;
    const local=p.P0700===1,serial=v.stopSerial||0,newStop=serial!==b.stopSerial;
    let latch=b.latch||false,reverse=local?!!v.reverse:has(12),run=local?!!v.run:has(1)||has(2),mop=b.mopParam===p.P1040?(b.mop??p.P1040):p.P1040;
    if(!local&&p.P0727){
      if(!di[0])latch=false;
      else if(edge(1)){latch=true;reverse=false;}
      else if(p.P0727===2&&edge(2)){latch=true;reverse=true;}
      else reverse=p.P0727===2?!!b.latchedReverse:reverse;
      run=latch;
    }else if(!local&&has(2))reverse=true;
    if(has(13)!==has(14)){const up=has(13),t=up?p.P1047:p.P1048;mop=clamp(mop+(up?1:-1)*(t?p.P1082*dt/t:p.P1082),-p.P1082,p.P1082);}
    let mask=0;for(let i=0;i<4;i++){const f=p['P070'+(i+1)];if(di[i]&&f>=15&&f<=18)mask|=1<<(f-15);}
    let fixed=p.P1016===2?(mask?p['P'+(1000+mask)]||0:0):[0,1,2,3].reduce((sum,i)=>sum+(mask&(1<<i)?p['P'+(1001+i)]:0),0);
    if(!local&&p.P1016===2&&p.P1000===3)run=mask!==0;
    const sources={0:0,1:mop,2:ai[0].percent*p.P2000/100,3:fixed,7:ai[1].percent*p.P2000/100,23:mask?fixed:ai[0].percent*p.P2000/100};
    let target=sources[p.P1000]||0,integral=b.integral||0,pidSet=0,pidFeedback=ai[1].percent;
    if(p.P2200){pidSet=v.macro==='Cn009'?[0,1,2].reduce((sum,i)=>sum+(mask&(1<<i)?p['P220'+(i+1)]:0),0):ai[0].percent;const err=pidSet-pidFeedback,addition=run&&p.P2285>0?err*p.P2280*dt/p.P2285:0;integral=clamp(integral+addition,-100,100);target=clamp(p.P2280*err+integral,0,100)*p.P2000/100;}
    const jog=local?!!v.jog:has(10)||has(11);
    if(jog){run=true;reverse=!local&&has(11);target=reverse?p.P1059:p.P1058;}
    if(reverse)target=-target;
    if(p.P1110)target=Math.max(0,target);
    target=Math.sign(target)*clamp(Math.abs(target),p.P1080,p.P1082);
    if(!target&&run&&p.P1080)target=(reverse&&!p.P1110?-1:1)*p.P1080;
    let inhibit=!!b.inhibit;
    if(!run||(local&&run&&!b.commandRun))inhibit=false;
    if(newStop||reset)inhibit=true;
    const off2=(!local&&assigned(3)&&!has(3))||(inhibit&&v.stopMode==='off2'),off3=!local&&assigned(4)&&!has(4);
    if(off2||off3)inhibit=true;
    let cause='';
    if(power){if(input.voltage<170)cause='F3';else if(input.voltage>264)cause='F2';else if(input.outputShort&&(run||b.running))cause='F1';else if(v.temperature>=100)cause='F4';else if(assigned(29)&&!has(29))cause='F85';else if(ai.some((a,i)=>[1,3].includes(p['P0756.'+i])&&a.raw<Math.max(.1,p['P0761.'+i]/2)))cause='F80';}
    let fault=power?(cause||(!reset?b.fault||'':'')):'';
    if(fault)inhibit=true;
    if(!run||inhibit||off3||p.P0010||!power||fault)target=0;
    const down=off3?1.1*p.P1135:jog||b.jog?p.P1061:p.P1121,up=jog?p.P1060:p.P1120;
    let hz=!power||fault||off2?0:ramp(b.hz||0,target,up,down,p.P1082,dt);
    if(Math.abs(hz)<1e-6)hz=0;
    const running=power&&!fault&&Math.abs(hz)>0,ratio=Math.min(1,Math.abs(hz)/p.P0310),voltage=running?Math.min(input.voltage,p.P0304)*(p.P1300===2?ratio*ratio:ratio):0;
    // Estimated induction motor load, not a switching/PWM or electromechanical solver.
    const current=running&&input.motorConnected?Math.max(.2,clamp(num(v.load,50),0,250)/100)*p.P0305:0;
    const overload=current>7.8?(b.overload||0)+dt*Math.max(0,(current/7.8)**2-1):Math.max(0,(b.overload||0)-dt);
    if(power&&!fault&&(overload>=75||current>p.P0305*p.P0640/100)){fault=overload>=75?'F5':'F11';hz=0;inhibit=true;}
    const active=power&&!fault&&Math.abs(hz)>0,warning=power?(v.temperature>=80?'A504':current>7.8?'A505':input.motorConnected===false&&active?'MOTOR YOK':''):'';
    const status=!power?'ENERJİ YOK':fault?'ARIZA':p.P0010?'DEVREYE ALMA':off2?'SERBEST DURUŞ':active?(off3?'HIZLI DURUYOR':Math.abs(hz-target)<.005?'ÇALIŞIYOR':target===0?'DURUYOR':hz*target<0?'YÖN DEĞİŞTİRİYOR':Math.abs(hz)<Math.abs(target)?'HIZLANIYOR':'YAVAŞLIYOR'):inhibit?'YENİ KOMUT BEKLİYOR':target?'HIZLANIYOR':'HAZIR';
    const s={now,powered:power,voltageIn:input.voltage,hz,target,voltage:active?voltage:0,current:active?current:0,bus:power?input.voltage*Math.SQRT2:0,rpm:active?hz/p.P0310*p.P0311:0,running:active,status,fault,warning,di,ai,mop,mopParam:p.P1040,latch,latchedReverse:reverse,reset:v.reset,stopSerial:serial,inhibit,commandRun:run,integral,pidSet,pidFeedback,overload,jog};
    const output=k=>{const functionId=String(p[k]),signals={'52':power&&!fault,'52.0':power&&!fault,'52.1':power&&!fault&&!p.P0010,'52.2':active,'52.3':power&&!fault,'52.7':!!warning};return !!signals[functionId];};
    s.do1=power&&(output('P0731')!==!!(p.P0748&1));s.do2=power&&(output('P0732')!==!!(p.P0748&2));
    let ao=({21:s.hz/p.P2000,24:s.hz/p.P2000,25:s.voltage/p.P2001,26:s.bus/p.P2001,27:s.current/p.P2002}[p.P0771]||0)*100;if(p.P0775)ao=Math.abs(ao);
    s.ao=power?clamp(lerp(ao,p.P0777,p.P0778,p.P0779,p.P0780),0,20):0;
    c._v20=s;c._driveFrequency=Math.abs(s.hz);return s;
  }
  function links(c,actuators){return [['13','13b'],['14','14b'],['14','5'],['PE','PE2'],['19',actuators.get('@'+c.id+':v20do2')?'18':'17'],...(actuators.get('@'+c.id+':v20do1')?[['15','16']]:[])];}
  const api={id,parameters,definitions,macros,faults,config,peek,create,applyMacro,set,action,tick,clear,links,ramp};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSV20=api;
})(typeof window==='undefined'?globalThis:window);
