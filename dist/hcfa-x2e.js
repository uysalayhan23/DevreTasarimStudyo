(function(root){
'use strict';
const id='hcfa-sv-x2ea040a-a',motorId='hcfa-sv-x2mh040a-n2ln';
const motor={id:motorId,model:'SV-X2MH040A-N2LN',powerW:400,ratedTorque:1.27,peakTorque:4.46,ratedCurrent:2.1,peakCurrent:10.4,ratedRpm:3000,maxRpm:5000,encoderBits:17,encoderCounts:131072,brake:false,flange:60};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number(v)||0)),num=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
const parameters=[];
function p(key,name,value,group,min,max,unit='',live=false,choices=null,readonly=false){parameters.push({key,name,value,group,min,max,unit,live,choices,readonly});}
p('P00.00','Motor pozitif yön tanımı',0,'P00 · Temel',0,1,'',false,{0:'Standart yön',1:'Ters yön'});
p('P00.01','Kontrol modu seçimi',0,'P00 · Temel',0,5,'',false,{0:'Pozisyon',1:'Hız',2:'Tork',3:'Pozisyon / Hız',4:'Pozisyon / Tork',5:'Hız / Tork'});
p('P00.05','Pozisyon talimat kaynağı',0,'P00 · Temel',0,2,'',false,{0:'Harici pulse',2:'Dahili pozisyon'});
p('P00.07','Pulse tren biçimi',0,'P00 · Temel',0,3,'',false,{0:'Pulse + yön',1:'CW / CCW',2:'A/B quadrature',3:'Pulse + yön · ters'});
p('P00.08','Bir motor turu komut birimi',10000,'P00 · Temel',1,1073741824,'unit/rev');
p('P00.10','Elektronik dişli payı',0,'P00 · Temel',0,1073741824);
p('P00.12','Elektronik dişli paydası',10000,'P00 · Temel',1,1073741824);
p('P03.00','Hız talimat kaynağı',0,'P03 · Hız/Tork',0,3,'',false,{0:'P03.03 dahili hız',1:'Analog',2:'İletişim',3:'Panel'});
p('P03.03','Dahili hız talimatı',0,'P03 · Hız/Tork',-5000,5000,'rpm',true);
p('P03.04','Panel JOG hızı',200,'P03 · Hız/Tork',0,5000,'rpm',true);
p('P03.25','Dahili tork talimatı',0,'P03 · Hız/Tork',-300,300,'%',true);
p('P03.27','İleri hız limiti',5000,'P03 · Hız/Tork',0,5000,'rpm',true);
p('P03.28','Geri hız limiti',5000,'P03 · Hız/Tork',0,5000,'rpm',true);
const diNames={0:'Fonksiyon yok',1:'S_ON · Servo enable',2:'ERR_RST · Hata reset',5:'PERR_CLR · Pozisyon sapma temizle',6:'MI_SEL1 · dahili pozisyon bit0',7:'MI_SEL2 · bit1',8:'MI_SEL3 · bit2',9:'MI_SEL4 · bit3',25:'Dahili pozisyon tetik',28:'Dahili pozisyon seçimi'};
for(let i=1;i<=8;i++)p('P04.'+String(i).padStart(2,'0'),'DI'+i+' terminal fonksiyonu',i===1?1:i===2?25:i>=4&&i<=7?i+2:0,'P04 · Dijital G/Ç',0,32,'',false,diNames);
for(let i=1;i<=8;i++)p('P04.'+String(i+10).padStart(2,'0'),'DI'+i+' terminal lojik seçimi',0,'P04 · Dijital G/Ç',0,1,'',true,{0:'Normal',1:'Ters'});
p('P07.00','Panel başlangıç ekranı',0,'P07 · Panel',0,5,'',true,{0:'Servo durumu',1:'Motor hızı',2:'Hız talimatı',3:'Tork',4:'Akım',5:'DC bara'});
for(let i=1;i<=5;i++)p('P07.'+String(i).padStart(2,'0'),'Monitor '+i+' · P21 seçim',i===1?1:i===2?3:i===3?4:i===4?5:6,'P07 · Panel',0,99,'',true);
p('P08.00','Dahili pozisyon yürütme modeli',2,'P08 · Dahili pozisyon',0,3,'',false,{0:'Sıralı',1:'Döngü',2:'DI aşama seçimi',3:'İletişim'});
p('P08.01','Başlangıç aşaması',1,'P08 · Dahili pozisyon',1,16);
p('P08.02','Bitiş aşaması',16,'P08 · Dahili pozisyon',1,16);
p('P08.04','Pozisyon talimat tipi',0,'P08 · Dahili pozisyon',0,1,'',false,{0:'Relative',1:'Absolute'});
for(let i=1;i<=16;i++){const b=6+(i-1)*5;p('P08.'+String(b).padStart(2,'0'),i+'. pozisyon uzunluğu',i===1?10000:0,'P08 · Dahili pozisyon',-1073741824,1073741824,'unit',true);p('P08.'+String(b+2).padStart(2,'0'),i+'. pozisyon max hızı',i===1?200:200,'P08 · Dahili pozisyon',1,5000,'rpm',true);p('P08.'+String(b+3).padStart(2,'0'),i+'. pozisyon acc/dec',10,'P08 · Dahili pozisyon',0,65535,'ms',true);p('P08.'+String(b+4).padStart(2,'0'),i+'. pozisyon bekleme',0,'P08 · Dahili pozisyon',0,65535,'ms',true);}
p('P08.88','Home start modu',4,'P08 · Home',0,4,'',false,{4:'Servo enable ile home'});
p('P08.89','Home modu',3,'P08 · Home',0,8,'',false,{3:'Home sensörü OFF→ON'});
p('P08.90','Home Z fazı modu',2,'P08 · Home',0,4,'',false,{2:'Sensörden sonra Z bekleme'});
p('P08.92','Home hızı',500,'P08 · Home',1,5000,'rpm',true);
p('P09.00','Modbus eksen adresi',1,'P09 · Haberleşme',1,247,'',true);
p('P09.01','Modbus baud rate',2,'P09 · Haberleşme',0,6,'',true,{0:'2400',1:'4800',2:'9600',3:'19200',4:'38400',5:'57600',6:'115200'});
p('P09.02','Modbus data formatı',0,'P09 · Haberleşme',0,3,'',true,{0:'N,8,2',1:'E,8,1',2:'O,8,1',3:'N,8,1'});
p('P09.05','İletişim DI etkin bitleri',0,'P09 · Haberleşme',0,65535,'hex',true);
p('P20.00','Panel JOG',0,'P20 · Panel/Fonksiyon',0,1,'',true);
p('P20.06','Sistem başlangıç işlevi',0,'P20 · Panel/Fonksiyon',0,7,'',false,{0:'İşlem yok',1:'Fabrika ayarları',2:'Hata kayıtlarını temizle',7:'Mutlak enkoder reset'});
const definitions=Object.fromEntries(parameters.map(x=>[x.key,x]));
const faults={'Err.002':'Ürün/model seçimi hatası','Err.005':'Motor-sürücü eşleşme hatası','Err.007':'Enkoder başlangıç hatası','Err.013':'Enkoder haberleşme hatası','Err.020':'DC bara aşırı gerilim','Err.021':'DC bara düşük gerilim','Err.024':'Aşırı hız','Err.045':'Sürücü çıkış faz kaybı','Err.046':'Sürücü aşırı yük','Err.047':'Motor aşırı yük','Err.048':'Elektronik dişli ayarı hatası','Err.049':'Soğutucu aşırı sıcak','Err.050':'Pulse girişi anormal','Err.056':'Ana devre enerjisi yok'};
const alarms={'AL.080':'Düşük gerilim uyarısı','AL.081':'Sürücü aşırı yük uyarısı','AL.082':'Motor aşırı yük uyarısı','AL.083':'Yeniden başlatma gerekli','AL.084':'Servo hazır değil','AL.086':'Pozitif limit','AL.087':'Negatif limit','AL.095':'Acil stop'};
function defaults(){return Object.fromEntries(parameters.map(x=>[x.key,x.value]));}
function fresh(){return {schema:1,params:defaults(),panelLevel:0,monitor:0,load:50,temperature:35,virtualPulseHz:0,virtualDirection:1,virtualPulse:false,commDI:0,modbusLog:[],positionUnits:0,commandPosition:0,home:false,resetSerial:0};}
function config(c){if(!c.hcfa||typeof c.hcfa!=='object')c.hcfa=fresh();c.hcfa.params={...defaults(),...c.hcfa.params};return c.hcfa;}
function peek(c){const h=c.hcfa?{...c.hcfa,params:{...c.hcfa.params}}:fresh();return h;}
function set(c,key,value){const d=definitions[key],h=config(c);if(!d||d.readonly)return {ok:false,error:'Parametre yazılamaz.'};const n=Number(value);if(!Number.isFinite(n)||n<d.min||n>d.max)return {ok:false,error:key+' izin verilen aralık dışında.'};if(c._hcfa?.running&&!d.live)return {ok:false,error:key+' yalnız servo dururken değiştirilebilir.'};h.params[key]=n;if(key==='P20.06'&&n===1){const keep={load:h.load,temperature:h.temperature};c.hcfa=fresh();Object.assign(c.hcfa,keep);return {ok:true,restart:true}}if(key==='P20.06'&&n===2){h.faultHistory=[];h.params[key]=0}if(key==='P20.06'&&n===7){h.positionUnits=0;h.commandPosition=0;h.params[key]=0}return {ok:true};}
function address(key){const m=/^P(\d{2})\.(\d{2})$/.exec(key);return m?((parseInt(m[1],10)<<8)|parseInt(m[2],10)):null;}
function keyFromAddress(a){a=Number(a);if(a>=0xE000)a-=0xE000;return parameters.find(x=>address(x.key)===a)?.key||null;}
function writeModbus(c,a,value){const h=config(c),addr=typeof a==='string'?parseInt(a.replace(/H$/i,''),16):Number(a);if(!Number.isFinite(addr))return {ok:false,error:'Geçersiz Modbus adresi'};if(addr===0x3607){h.commDI=Number(value)&0xffff;h.modbusLog.unshift({a:'3607H',v:h.commDI,t:Date.now()});return {ok:true};}const key=keyFromAddress(addr),r=key?set(c,key,value):{ok:false,error:'Bu adres eğitim modelinde eşlenmedi.'};if(r.ok)h.modbusLog.unshift({a:addr.toString(16).toUpperCase()+'H',key,v:Number(value),eeprom:addr>=0xE000,t:Date.now()});h.modbusLog=h.modbusLog.slice(0,20);return r;}
function diEffective(c,input){const h=config(c),p=h.params,arr=Array.from({length:8},(_,i)=>!!input.di?.[i]);for(let i=0;i<8;i++){const bit=1<<(i+1);if((p['P09.05']&bit)&&(h.commDI&bit))arr[i]=true;if(p['P04.'+String(i+11).padStart(2,'0')])arr[i]=!arr[i];}return arr;}
const diHas=(p,di,fn)=>di.some((on,i)=>on&&Number(p['P04.'+String(i+1).padStart(2,'0')])===fn);
function stageNo(p,di){let mask=0;for(let i=0;i<8;i++){const fn=Number(p['P04.'+String(i+1).padStart(2,'0')]);if(di[i]&&fn>=6&&fn<=9)mask|=1<<(fn-6);}return clamp(mask+1,1,16);}
function stageParam(n,offset){return 'P08.'+String(6+(n-1)*5+offset).padStart(2,'0');}
function move(from,to,rate,dt){if(!rate||rate<=0)return to;const d=to-from;return from+Math.sign(d)*Math.min(Math.abs(d),rate*dt);}
function resetFault(c){const h=config(c);h.resetSerial++;if(c._hcfa)c._hcfa.fault='';return {ok:true};}
function action(c,key){const h=config(c),p=h.params;if(key==='reset')return resetFault(c);if(key==='mode'){h.panelLevel=(h.panelLevel+1)%4;return {ok:true};}if(key==='shift'){h.monitor=(h.monitor+1)%6;return {ok:true};}if(key==='up'||key==='down'){const dir=key==='up'?1:-1;if(h.virtualPulse||Number(p['P00.01'])===0){h.virtualPulseHz=clamp(num(h.virtualPulseHz)+dir*100,0,500000);}else p['P03.03']=clamp(p['P03.03']+dir*10,-motor.maxRpm,motor.maxRpm);return {ok:true};}if(key==='set'||key==='servo'){h.panelServo=!h.panelServo;return {ok:true};}if(key==='jog'){h.jog=true;return {ok:true};}if(key==='jog-release'){h.jog=false;return {ok:true};}if(key==='pulse'){h.virtualPulse=!h.virtualPulse;if(h.virtualPulse&&num(h.virtualPulseHz)<=0)h.virtualPulseHz=1000;return {ok:true};}if(key==='home'){h.home=true;return {ok:true};}return {ok:false,error:'Bilinmeyen HCFA komutu'};}
function monitorValues(c,s){const h=config(c),p=h.params;return {'P21.00':s.servoOn?1:0,'P21.01':s.rpm||0,'P21.03':s.commandRpm||0,'P21.04':s.torquePercent||0,'P21.05':s.current||0,'P21.06':s.bus||0,'P21.07':Math.round(s.encoderCounts||0),'P21.10':s.mechanicalAngle||0,'P21.13':Math.round((s.commandPosition||0)-(s.positionUnits||0)),'P21.15':Math.round(s.inputPulseCount||0)};}
function tick(c,input,now=Date.now()){
 const h=config(c),p=h.params,b=c._hcfa||{now,rpm:0,positionUnits:h.positionUnits||0,commandPosition:h.commandPosition||0,inputPulseCount:0,trigger:false,overload:0,resetSerial:h.resetSerial};const dt=Math.max(0,Math.min(1,(now-(b.now??now))/1000));
 const voltage=num(input.voltage),powered=voltage>20,di=diEffective(c,input),reset=diHas(p,di,2)||h.resetSerial!==b.resetSerial;
 let fault=reset?'':(b.fault||'');if(powered&&voltage<180)fault='Err.021';else if(powered&&voltage>264)fault='Err.020';else if(powered&&input.motorCompatible===false)fault='Err.005';else if(powered&&input.motorConnected&&!input.encoderConnected)fault='Err.013';else if(powered&&input.outputPhaseLoss)fault='Err.045';else if(powered&&h.temperature>=100)fault='Err.049';
 const enableRequested=!!(h.panelServo||diHas(p,di,1)||((p['P09.05']&2)&&(h.commDI&2)));
 // Interrupted power blocks a still-held Servo ON command until it is released
 // after restoration. Neither the panel nor DI / communication may auto-restart.
 let powerRearmRequired=!!b.powerRearmRequired||(!powered&&!!b.powered);
 if(powered&&!enableRequested)powerRearmRequired=false;
 const servoOn=!!(powered&&!fault&&enableRequested&&!powerRearmRequired);
 let mode=Number(p['P00.01']);if(mode>2)mode=mode===5?1:0;
 let commandRpm=0,commandTorque=0,positionUnits=num(b.positionUnits,h.positionUnits),commandPosition=num(b.commandPosition,h.commandPosition),inputPulseCount=num(b.inputPulseCount),trigger=diHas(p,di,25),stage=stageNo(p,di);
 const pulseHz=Math.max(0,num(input.pulseHz,h.virtualPulse?h.virtualPulseHz:0)),pulseDir=(input.pulseDirection??h.virtualDirection??1)>=0?1:-1;
 if(servoOn&&mode===0){
   if(p['P00.05']===2){
     if(trigger&&!b.trigger){const len=num(p[stageParam(stage,0)]),abs=p['P08.04']===1;commandPosition=abs?len:commandPosition+len;}
     const diff=commandPosition-positionUnits,maxR=num(p[stageParam(stage,2)],200);commandRpm=Math.sign(diff)*Math.min(maxR,Math.abs(diff)*60/Math.max(1,p['P00.08']));
   }else{
     inputPulseCount+=pulseHz*dt*pulseDir;commandPosition+=pulseHz*dt*pulseDir;commandRpm=pulseDir*pulseHz*60/Math.max(1,p['P00.08']);
   }
 }else if(servoOn&&mode===1)commandRpm=num(p['P03.03']);
 else if(servoOn&&mode===2){commandTorque=num(p['P03.25']);commandRpm=commandTorque>=0?num(p['P03.27']): -num(p['P03.28']);}
 if(h.jog&&servoOn)commandRpm=num(p['P03.04']);
 if(h.home&&servoOn){commandPosition=0;commandRpm=positionUnits===0?0:-Math.sign(positionUnits)*num(p['P08.92']);if(Math.abs(positionUnits)<Math.max(1,p['P00.08']/200)){positionUnits=0;h.home=false;commandRpm=0;}}
 commandRpm=clamp(commandRpm,-motor.maxRpm,motor.maxRpm)*(p['P00.00']? -1:1);
 if(Math.abs(commandRpm)>motor.maxRpm)fault='Err.024';if(input.pulseAbnormal)fault='Err.050';if(!servoOn||fault)commandRpm=0;
 const accelMs=mode===0&&p['P00.05']===2?num(p[stageParam(stage,3)],10):100;const accel=motor.maxRpm/Math.max(.001,accelMs/1000);
 let rpm=move(num(b.rpm),commandRpm,accel,dt);if(Math.abs(rpm)<.01)rpm=0;
 if(servoOn&&!fault){const rev=rpm*dt/60;positionUnits+=rev*p['P00.08'];}
 const loadPct=clamp(h.load,0,350),torquePercent=mode===2?clamp(Math.abs(commandTorque),0,300):rpm?Math.min(300,Math.max(5,loadPct)):0,torqueNm=motor.ratedTorque*torquePercent/100,current=rpm?Math.min(motor.peakCurrent,motor.ratedCurrent*Math.max(.12,torquePercent/100)):0;
 let overload=num(b.overload);overload=current>motor.ratedCurrent?overload+dt*((current/motor.ratedCurrent)**2-1):Math.max(0,overload-dt*.5);if(!fault&&overload>45)fault=current>motor.ratedCurrent*2?'Err.047':'Err.046';if(fault){rpm=0;}
 const bus=powered?voltage*Math.SQRT2:0,encoderCounts=positionUnits/Math.max(1,p['P00.08'])*motor.encoderCounts,mechanicalAngle=((positionUnits/Math.max(1,p['P00.08'])*360)%360+360)%360;
 const warning=!powered?'AL.084':voltage<190?'AL.080':overload>25?'AL.082':!servoOn?'AL.084':'';
 const status=!powered?'ENERJİ YOK':fault?'FAULT':!servoOn?'S-rdy':mode===0?'Pcrun':mode===1?'Scrun':'tcrun';
 const s={now,powered,servoOn,running:servoOn&&!fault&&Math.abs(rpm)>.01,status,fault,warning,voltageIn:voltage,bus,rpm,commandRpm,torquePercent,torqueNm,current,di,mode,stage,positionUnits,commandPosition,inputPulseCount,encoderCounts,mechanicalAngle,trigger,overload,resetSerial:h.resetSerial,motorConnected:!!input.motorConnected,encoderConnected:!!input.encoderConnected,pulseHz,pulseDirection:pulseDir,powerRearmRequired};
 s.monitors=monitorValues(c,s);c._hcfa=s;h.positionUnits=positionUnits;h.commandPosition=commandPosition;return s;
}
function clear(c){delete c._hcfa;delete c._hcfaFrame;delete c._motorHz;delete c._motorRPM;delete c._motorDrive;}
const api={id,motorId,motor,parameters,definitions,faults,alarms,fresh,config,peek,set,address,keyFromAddress,writeModbus,action,tick,clear,monitorValues,stageParam};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSHCFA=api;
})(typeof window==='undefined'?globalThis:window);
