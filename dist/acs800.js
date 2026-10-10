(function(root){
 'use strict';
 // ABB 3AFE68372984 Rev F and 3AFE64527592 Rev L. See ACS800_KILAVUZU.md.
 const id='abb-acs800-r5',rating={model:'ACS800-04-0075-3',frame:'R5',voltage:400,current:141,continuous:145,peak:170,heavyCurrent:100,power:75};
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),num=(x,d=0)=>Number.isFinite(Number(x))?Number(x):d;
 const parameters=[],key=(g,n)=>g+'.'+String(n).padStart(2,'0');
 function param(k,name,value,group,min,max,unit='',choices=null,stopped=false){parameters.push({key:k,name,value,group,min,max,unit,choices,stopped});}
 const yn={0:'NO · kapalı',65535:'YES · açık'},diChoices={1:'Seçilmedi',2:'DI1',3:'DI2',4:'DI3',5:'DI4',6:'DI5',7:'DI6'};
 const commands={1:'NOT SEL',2:'DI1 · başlat/durdur',3:'DI1,2 · başlat + yön',4:'DI1P,2P · üç telli',5:'DI1P,2P,3 · üç telli + yön',6:'DI1P,2P,3P · ileri/geri buton',7:'DI6 · başlat/durdur',8:'DI6,5 · başlat + yön',9:'KEYPAD · panel',17:'DI1 ileri / DI2 geri'};
 for(let n=1;n<=2;n++)param(key(10,n),'EXT'+n+' STRT/STP/DIR',n===1?3:1,'10 · Kumanda',1,17,'',commands,true);
 param('10.03','REF DIRECTION · yön izni',1,'10 · Kumanda',1,3,'',{1:'FORWARD · ileri sabit',2:'REVERSE · geri sabit',3:'REQUEST · yön komutu'},true);
 param('10.06','JOG SPEED SELECT',1,'10 · Kumanda',1,5,'',{1:'NOT SEL',2:'DI3',3:'DI4',4:'DI5',5:'DI6'},true);
 param('11.01','KEYPAD REF SEL',1,'11 · Referans',1,2,'',{1:'REF1 · rpm / Hz',2:'REF2 · %'});
 param('11.02','EXT1/EXT2 SELECT',7,'11 · Referans',1,8,'',{1:'DI1',2:'DI2',3:'DI3',4:'DI4',5:'DI5',6:'DI6',7:'EXT1',8:'EXT2'},true);
 const refs={1:'KEYPAD',2:'AI1',3:'AI2',4:'AI3',5:'AI1 / JOYST',6:'AI2 / JOYST',7:'AI1 + AI3',8:'AI2 + AI3',9:'AI1 − AI3',10:'AI2 − AI3',11:'AI1 × AI3',12:'AI2 × AI3',13:'MIN(AI1,AI3)',14:'MIN(AI2,AI3)',15:'MAX(AI1,AI3)',16:'MAX(AI2,AI3)',17:'DI3 artır / DI4 azalt · sıfırla',18:'DI3 artır / DI4 azalt',19:'DI5 artır / DI6 azalt',38:'AI1 BIPOLAR · ±10 V'};
 param('11.03','EXT REF1 SELECT',2,'11 · Referans',1,38,'',refs,true);
 param('11.04','EXT REF1 MINIMUM',0,'11 · Referans',0,18000,'rpm / Hz');
 param('11.05','EXT REF1 MAXIMUM',1500,'11 · Referans',0,18000,'rpm / Hz');
 param('11.06','EXT REF2 SELECT',1,'11 · Referans',1,38,'',refs,true);
 param('11.07','EXT REF2 MINIMUM',0,'11 · Referans',0,100,'%');
 param('11.08','EXT REF2 MAXIMUM',100,'11 · Referans',0,600,'%');
 param('12.01','CONST SPEED SEL',10,'12 · Sabit hız',1,14,'',{1:'NOT SEL',2:'DI1 (hız 1)',3:'DI2 (hız 2)',4:'DI3 (hız 3)',5:'DI4 (hız 4)',6:'DI5 (hız 5)',7:'DI6 (hız 6)',8:'DI1,2',9:'DI3,4',10:'DI5,6',11:'DI1,2,3',12:'DI3,4,5',13:'DI4,5,6',14:'DI3,4,5,6'},true);
 for(let n=1;n<=15;n++)param(key(12,n+1),'CONST SPEED '+n,[300,600,900,300][n-1]||0,'12 · Sabit hız',n>=12&&n!==14?-18000:0,18000,'rpm / Hz');
 for(let n=0;n<3;n++){
  const base=n*5,unit=n?'mA':'V';
  param(key(13,base+1),'MINIMUM AI'+(n+1),1,'13 · Analog giriş',1,2,'',{1:'0 '+unit,2:(n?4:2)+' '+unit});
  param(key(13,base+2),'MAXIMUM AI'+(n+1),1,'13 · Analog giriş',1,1,'',{1:(n?20:10)+' '+unit});
  param(key(13,base+3),'SCALE AI'+(n+1),100,'13 · Analog giriş',0,1000,'%');
  param(key(13,base+4),'FILTER AI'+(n+1),.1,'13 · Analog giriş',0,10,'s');
  param(key(13,base+5),'INVERT AI'+(n+1),0,'13 · Analog giriş',0,65535,'',yn);
 }
 const ro={1:'NOT USED',2:'READY',3:'RUNNING',4:'FAULT',5:'FAULT(−1)',11:'ACS TEMP WRN',12:'ACS TEMP FLT',13:'FAULT/WARN',14:'WARNING',15:'REVERSED',16:'EXT CTRL',17:'REF 2 SEL',18:'CONST SPEED',19:'DC OVERVOLT',20:'DC UNDERVOLT',28:'STARTED',29:'LOSS OF REF',30:'AT SPEED'};
 for(let n=0;n<3;n++){
  param(key(14,n+1),'RELAY RO'+(n+1)+' OUTPUT',[2,3,5][n],'14 · Röleler',1,30,'',ro,true);
  param(key(14,4+n*2),'RO'+(n+1)+' TON DELAY',0,'14 · Röleler',0,3600,'s',null,true);
  param(key(14,5+n*2),'RO'+(n+1)+' TOFF DELAY',0,'14 · Röleler',0,3600,'s',null,true);
 }
 const ao={1:'NOT USED',3:'SPEED',4:'FREQUENCY',5:'CURRENT',6:'TORQUE',7:'POWER',8:'DC BUS VOLT',9:'OUTPUT VOLT',10:'APPL OUTPUT',11:'REFERENCE',12:'CONTROL DEV',13:'ACTUAL 1',14:'ACTUAL 2'};
 for(let n=0;n<2;n++){
  param(key(15,1+n*5),'ANALOGUE OUTPUT'+(n+1),n?5:3,'15 · Analog çıkış',1,14,'',ao,true);
  param(key(15,2+n*5),'INVERT AO'+(n+1),0,'15 · Analog çıkış',0,65535,'',yn);
  param(key(15,3+n*5),'MINIMUM AO'+(n+1),1,'15 · Analog çıkış',1,2,'',{1:'0 mA',2:'4 mA'});
  param(key(15,4+n*5),'FILTER AO'+(n+1),n?2:.1,'15 · Analog çıkış',0,10,'s');
  param(key(15,5+n*5),'SCALE AO'+(n+1),100,'15 · Analog çıkış',10,1000,'%');
 }
 param('16.01','RUN ENABLE',1,'16 · İzinler',1,7,'',{...diChoices,1:'YES · izin var'},true);
 param('16.02','PARAMETER LOCK',0,'16 · İzinler',0,65535,'',{0:'OPEN',65535:'LOCKED'});
 param('16.03','PASS CODE',0,'16 · İzinler',0,30000);
 param('16.04','FAULT RESET SEL',1,'16 · İzinler',1,9,'',{...diChoices,9:'ON STOP'},true);
 param('16.06','LOCAL LOCK',0,'16 · İzinler',0,65535,'',yn);
 param('16.09','CTRL BOARD SUPPLY',1,'16 · İzinler',1,2,'',{1:'INTERNAL 24V',2:'EXTERNAL 24V'});
 param('20.01','MINIMUM SPEED',-1500,'20 · Sınırlar',-18000,18000,'rpm');
 param('20.02','MAXIMUM SPEED',1500,'20 · Sınırlar',-18000,18000,'rpm');
 param('20.03','MAXIMUM CURRENT',170,'20 · Sınırlar',0,200,'A');
 param('20.07','MINIMUM FREQ',-50,'20 · Sınırlar',-300,50,'Hz');
 param('20.08','MAXIMUM FREQ',50,'20 · Sınırlar',-50,300,'Hz');
 param('21.03','STOP FUNCTION',1,'21 · Duruş',1,2,'',{1:'COAST · serbest',2:'RAMP · rampalı'});
 param('21.07','RUN ENABLE FUNC',2,'21 · Duruş',1,4,'',{1:'RAMP STOP',2:'COAST STOP',3:'OFF2 STOP',4:'OFF3 STOP'});
 param('21.09','START INTRL FUNC · DIIL',1,'21 · Duruş',1,2,'',{1:'OFF2 · serbest duruş',2:'OFF3 · acil rampa'});
 param('22.01','ACC/DEC SEL',6,'22 · Rampalar',1,8,'',{1:'ACC/DEC 1',2:'ACC/DEC 2',3:'DI1',4:'DI2',5:'DI3',6:'DI4',7:'DI5',8:'DI6'},true);
 for(const [n,name,val] of [[2,'ACCEL TIME 1',20],[3,'DECEL TIME 1',20],[4,'ACCEL TIME 2',60],[5,'DECEL TIME 2',60],[7,'EM STOP RAMP',3]])param(key(22,n),name,val,'22 · Rampalar',0,1800,'s');
 param('30.01','AI<MIN FUNCTION',1,'30 · Arızalar',1,2,'',{1:'FAULT',2:'NO'});
 param('30.03','EXTERNAL FAULT',1,'30 · Arızalar',1,7,'',diChoices);
 param('40.01','PID GAIN',1,'40 · PID',.1,100);
 param('40.02','PID INTEG TIME',60,'40 · PID',.02,320,'s');
 param('40.03','PID DERIV TIME',0,'40 · PID',0,10,'s');
 param('40.04','PID DERIV FILTER',1,'40 · PID',.04,10,'s');
 param('40.05','ERROR VALUE INV',0,'40 · PID',0,65535,'',yn);
 param('40.06','ACTUAL VALUE SEL',1,'40 · PID',1,9,'',{1:'ACT1',2:'ACT1−ACT2',3:'ACT1+ACT2',4:'ACT1×ACT2',5:'ACT1/ACT2',6:'MIN',7:'MAX',8:'sqrt(A1−A2)',9:'sqrt(A1)+sqrt(A2)'});
 for(let n=7;n<=8;n++)param(key(40,n),'ACTUAL'+(n-6)+' INPUT SEL',n===7?2:3,'40 · PID',1,3,'',{1:'AI1',2:'AI2',3:'AI3'});
 for(let n=9;n<=12;n++)param(key(40,n),'ACT'+(n<=10?1:2)+(n%2?' MINIMUM':' MAXIMUM'),n%2?0:100,'40 · PID',-1000,1000,'%');
 param('40.13','PID INTEGRATION',2,'40 · PID',1,2,'',{1:'OFF',2:'ON'});
 param('40.19','ACTUAL FILT TIME',.04,'40 · PID',.04,10,'s');
 param('99.02','APPLICATION MACRO',1,'99 · Motor ve makro',1,9,'',{1:'FACTORY',2:'HAND/AUTO',3:'PID-CTRL',5:'SEQ CTRL',6:'USER 1 LOAD',7:'USER 1 SAVE',8:'USER 2 LOAD',9:'USER 2 SAVE'},true);
 param('99.04','MOTOR CTRL MODE',0,'99 · Motor ve makro',0,65535,'',{0:'DTC · hız modeli',65535:'SCALAR · V/f'},true);
 for(const [n,name,val,min,max,unit] of [[5,'MOTOR NOM VOLTAGE',400,200,800,'V'],[6,'MOTOR NOM CURRENT',141,.01,200,'A'],[7,'MOTOR NOM FREQ',50,8,300,'Hz'],[8,'MOTOR NOM SPEED',1480,1,18000,'rpm'],[9,'MOTOR NOM POWER',75,0,9000,'kW']])param(key(99,n),name,val,'99 · Motor ve makro',min,max,unit,null,true);
 const definitions=Object.fromEntries(parameters.map(p=>[p.key,p]));
 const faults={'2310':'OVERCURRENT · aşırı akım','3210':'DC OVERVOLT · yüksek bara','3220':'DC UNDERVOLT · düşük bara','3130':'SUPPLY PHASE · şebeke fazı eksik','4210':'ACS800 TEMP · sürücü sıcaklığı','8110':'AI < MIN · analog sinyal kaybı','9000':'EXTERNAL FAULT · harici arıza'};
 function defaults(){return Object.fromEntries(parameters.map(d=>[d.key,d.value]));}
 function create(c){return c.acs800={schema:1,params:defaults(),local:true,run:false,reverse:false,reference:0,reset:0,load:50,temperature:30,j1:true,diilBridge:true,users:{}};}
 function config(c){if(!c.acs800||typeof c.acs800!=='object')create(c);const v=c.acs800;v.params={...defaults(),...v.params};for(const d of parameters){const n=Number(v.params[d.key]);v.params[d.key]=Number.isFinite(n)&&n>=d.min&&n<=d.max&&(!d.choices||String(n) in d.choices)?n:d.value;}v.users||={};return v;}
 const peek=c=>config({...c,acs800:c.acs800?{...c.acs800,params:{...c.acs800.params}}:undefined});
 function applyMacro(c,n){
  const v=config(c),p=v.params;if(p['16.02'])return {ok:false,error:'Parametre kilitli; 16.03 = 358 ile açın.'};if(c._acs800?.started||c._acs800?.running)return {ok:false,error:'Makro değişimi için sürücüyü durdurun.'};
  if([7,9].includes(n)){v.users[n===7?1:2]=JSON.parse(JSON.stringify(p));return {ok:true};}
  if([6,8].includes(n)){const saved=v.users[n===6?1:2];if(!saved)return {ok:false,error:'Bu kullanıcı makrosu henüz kaydedilmedi.'};v.params={...saved,'99.02':n};v.run=false;return {ok:true};}
  if(![1,2,3,5].includes(n))return {ok:false,error:'Bu makro eğitim modelinde bulunmuyor.'};
  const motor=Object.fromEntries(Object.entries(p).filter(([k])=>k.startsWith('99.')));v.params={...defaults(),...motor,'99.02':n};const q=v.params;
  if(n===2)Object.assign(q,{'10.02':8,'10.03':3,'11.02':3,'11.06':3,'12.01':5,'22.01':1});
  if(n===3)Object.assign(q,{'10.01':2,'10.02':7,'11.02':3,'11.06':2,'12.01':5,'16.01':6,'22.01':1});
  if(n===5)Object.assign(q,{'10.03':3,'12.01':13,'12.05':1200,'12.06':1500,'12.07':2400,'12.08':3000,'21.03':2,'22.01':5});
  v.run=false;return {ok:true};
 }
 function set(c,k,value){
  const v=config(c),d=definitions[k],n=Number(value),p=v.params;
  if(!d||!Number.isFinite(n)||n<d.min||n>d.max||(d.choices&&!(String(n) in d.choices)))return {ok:false,error:'Değer, bu parametrenin izin verilen aralığında değil.'};
  if(p['16.02']&&k!=='16.03')return {ok:false,error:'Parametre kilitli. 16.03 alanına 358 girerek açabilirsiniz.'};
  if(d.stopped&&(c._acs800?.running||c._acs800?.started))return {ok:false,error:'Bu parametre yalnız sürücü dururken değiştirilebilir.'};
  if(k==='99.02')return applyMacro(c,n);
  const pairs={'20.01':'20.02','20.07':'20.08','11.04':'11.05','11.07':'11.08','40.09':'40.10','40.11':'40.12'};
  if(pairs[k]&&n>=p[pairs[k]]||Object.entries(pairs).some(([a,b])=>b===k&&p[a]>=n))return {ok:false,error:'Alt sınır üst sınırdan küçük olmalı.'};
  if(k==='16.03'){if(n===358)p['16.02']=0;p[k]=0;return {ok:true};}
  p[k]=n;
  if(k==='99.08'){p['20.01']=-n;p['20.02']=n;}
  if(k==='99.04'){p['11.04']=0;p['11.05']=n?p['99.07']:1500;v.reference=0;}
  return {ok:true};
 }
 function action(c,a){
  const v=config(c),p=v.params,s=c._acs800;
  if(a==='local'){if(!v.local&&p['16.06'])return {ok:false,error:'16.06 LOCAL LOCK etkin.'};v.local=!v.local;v.run=false;return {ok:true};}
  if(a==='reset'){v.reset=(v.reset||0)+1;return {ok:true};}
  if(a==='restore')return applyMacro(c,p['99.02']);
  if(a==='display'){v.display=((v.display||0)+1)%2;return {ok:true};}
  const ext2=s?.ext2||p['11.02']===8;
  if(!v.local&&p[ext2?'10.02':'10.01']!==9)return {ok:false,error:'Harici kumanda etkin. Panelden çalıştırmak/durdurmak için LOC/REM ile LOCAL seçin.'};
  if(a==='run')v.run=true;
  if(a==='stop')v.run=false;
  if(a==='reverse'||a==='forward'){if(p['10.03']!==3)return {ok:false,error:'Yön komutu için 10.03 = REQUEST seçin.'};v.reverse=a==='reverse';}
  if(a==='up'||a==='down'){const step=p['11.01']===2||p['99.04']?1:10;v.reference=clamp(num(v.reference)+(a==='up'?step:-step),0,p['11.01']===2?600:p['99.04']?300:18000);}
  return {ok:true};
 }
 function clear(c){delete c._acs800;delete c._acs800Frame;}
 function links(c,actuators=new Map()){
  const v=peek(c),pairs=[['PE','PE2'],['X20:2','X21:2'],['X22:7','X22:8']];
  if(v.j1!==false)pairs.push(['X22:9','X22:10']);
  if(v.diilBridge!==false)pairs.push(['X22:8','X22:11']);
  for(let i=0;i<3;i++)pairs.push(['X'+(25+i)+':2','X'+(25+i)+':'+(actuators.get('@'+c.id+':acsro'+i)?3:1)]);
  return pairs;
 }
 const filter=(last,next,t,dt)=>t<=0?next:last+(next-last)*(1-Math.exp(-dt/t));
 function ramp(from,to,up,down,max,dt){
  const move=(a,b,t,d)=>a+Math.sign(b-a)*Math.min(Math.abs(b-a),t?max*d/t:Infinity);
  if(from*to<0){const t=down?Math.abs(from)*down/max:0;return dt<t?move(from,0,down,dt):move(0,to,up,dt-t);}
  return move(from,to,Math.abs(to)>Math.abs(from)?up:down,dt);
 }
 function tick(c,input,now){
  const v=config(c),p=v.params;
  if(c._acs800Frame?.now!==now)c._acs800Frame={now,base:c._acs800?JSON.parse(JSON.stringify(c._acs800)):null};
  const b=c._acs800Frame.base||{now,hz:0,di:[],reset:v.reset,ro:[]},dt=Math.max(0,(now-b.now)/1000),power=input.voltage>0,board=power||input.external24>=21.6&&input.external24<=26.4;
  const di=input.di||Array(6).fill(false),edge=i=>di[i]&&!b.di[i],fall=i=>!di[i]&&b.di[i],scalar=!!p['99.04'];
  const ai=[0,1,2].map(i=>{const raw=num(input.ai?.[i])*(i?10:1),n=i*5,min=p[key(13,n+1)]===2?(i?4:2):0,max=i?20:10;
   const f=filter(b.ai?.[i]?.filtered??raw,raw,p[key(13,n+4)],dt),r=(f-min)/(max-min),percent=(p[key(13,n+5)]?1-r:r)*p[key(13,n+3)];return {raw,filtered:f,percent,min,max};});
  const ext2=p['11.02']===8||p['11.02']<=6&&di[p['11.02']-1],mode=p[ext2?'10.02':'10.01'],src=p[ext2?'11.06':'11.03'],edgeRun=v.run&&!b.panelRun;
  let run=false,reverse=false,latch=b.latch||false,latchReverse=b.latchReverse||false;
  if(v.local||mode===9){run=!!v.run;reverse=!!v.reverse;}
  else if([2,3].includes(mode)){run=di[0];reverse=mode===3&&di[1];}
  else if([7,8].includes(mode)){run=di[5];reverse=mode===8&&di[4];}
  else if([4,5,6].includes(mode)){
   if(mode===6){if(!di[2])latch=false;else if(edge(0)!==edge(1)){latch=true;latchReverse=edge(1);}reverse=latchReverse;}
   else{if(!di[1])latch=false;else if(edge(0))latch=true;reverse=mode===5&&di[2];}run=latch;
  }else if(mode===17){run=di[0]!==di[1];reverse=di[1];}
  const enable=p['16.01']===1||di[p['16.01']-2],interlock=!!input.diil;
  let restart=!!b.restart;if(!run)restart=false;
  if(!interlock||!enable&&p['21.07']>=3)restart=true;
  const acceptedRun=run&&enable&&interlock&&!restart;
  const reset=v.reset!==b.reset||!v.local&&(p['16.04']>=2&&p['16.04']<=7?edge(p['16.04']-2):p['16.04']===9&&b.commandRun&&!run);
  let mop=num(b.mop,num(v.mop)),indices=src===19?[4,5]:[2,3];
  if(src>=17&&src<=19){if(src===17&&!run)mop=0;else if(di[indices[0]]!==di[indices[1]])mop=clamp(mop+(di[indices[0]]?1:-1)*dt*100/(p['22.04']||.001),0,100);}
  const [a,z,q]=ai.map(a=>a.percent),values={2:a,3:z,4:q,5:2*a-100,6:2*z-100,7:a+q,8:z+q,9:a-q,10:z-q,11:a*q/100,12:z*q/100,13:Math.min(a,q),14:Math.min(z,q),15:Math.max(a,q),16:Math.max(z,q),17:mop,18:mop,19:mop,38:Math.sign(ai[0].filtered)*Math.max(0,(Math.abs(ai[0].filtered)-ai[0].min)/(10-ai[0].min))*p['13.03']*(p['13.05']?-1:1)};
  const lo=p[ext2?'11.07':'11.04'],hi=p[ext2?'11.08':'11.05'];let ref=src===1?num(v.reference):lo+(hi-lo)*((src===38||src===5||src===6)?clamp(values[src],-100,100):Math.max(0,values[src]||0))/100;
  if([5,6,38].includes(src)&&src!==1){const signed=clamp(values[src],-100,100);ref=Math.sign(signed)*(lo+(hi-lo)*Math.abs(signed)/100);}
  if(v.local)ref=num(v.reference);
  const percentMode=v.local?p['11.01']===2:ext2,maxHz=scalar?Math.max(Math.abs(p['20.07']),Math.abs(p['20.08']),.01):Math.max(Math.abs(p['20.01']),Math.abs(p['20.02']),1)/p['99.08']*p['99.07'];
  let target=percentMode?ref/100*maxHz:scalar?ref:ref/p['99.08']*p['99.07'],constant=0;
  if(!v.local){const sel=p['12.01'];if(sel>=2&&sel<=7)constant=di[sel-2]?sel-1:0;else{const bits={8:[0,1],9:[2,3],10:[4,5],11:[0,1,2],12:[2,3,4],13:[3,4,5],14:[2,3,4,5]}[sel]||[];constant=bits.reduce((m,i,k)=>m+(di[i]?1<<k:0),0);}
   if(scalar&&constant>5&&constant!==15)constant=0;
   if(constant)target=scalar?p[key(12,constant+1)]:p[key(12,constant+1)]/p['99.08']*p['99.07'];
  }
  let integral=num(b.integral),derivative=num(b.derivative),pidFeedback=0,pidSet=ref,pidError=0,pidOutput=0;
  const act=[0,1].map(i=>{const raw=ai[p[key(40,7+i)]-1].percent;return 100*(raw-p[key(40,9+i*2)])/(p[key(40,10+i*2)]-p[key(40,9+i*2)]);});
  if(p['99.02']===3&&percentMode&&!constant){const [x,y]=act;pidFeedback=filter(num(b.pidFeedback),({1:x,2:x-y,3:x+y,4:x*y/100,5:y?100*x/y:0,6:Math.min(x,y),7:Math.max(x,y),8:Math.sqrt(Math.max(0,x-y))*10,9:(Math.sqrt(Math.max(0,x))+Math.sqrt(Math.max(0,y)))*10})[p['40.06']],p['40.19'],dt);
   pidError=(ref-pidFeedback)*(p['40.05']?-1:1);const ki=p['40.01']/p['40.02'];if(acceptedRun&&p['40.13']===2)integral=clamp(integral+ki*pidError*dt,-100,100);else if(!acceptedRun)integral=0;
   derivative=filter(derivative,dt?p['40.03']*(pidError-num(b.pidError))/dt:0,p['40.04'],dt);pidOutput=clamp(p['40.01']*pidError+integral+derivative,0,100);target=pidOutput/100*maxHz;
  }
  const jog=!v.local&&!run&&p['10.06']>=2&&di[p['10.06']];if(jog)target=scalar?p['12.15']:p['12.15']/p['99.08']*p['99.07'];
  if(p['10.03']===1)target=Math.abs(target);else if(p['10.03']===2)target=-Math.abs(target);else if(reverse)target=-target;
  target=clamp(target,scalar?p['20.07']:p['20.01']/p['99.08']*p['99.07'],scalar?p['20.08']:p['20.02']/p['99.08']*p['99.07']);
  let cause='';
  if(board){if(input.phases>0&&input.phases<3)cause='3130';else if(power&&input.voltage<.6*380)cause='3220';else if(power&&input.voltage>1.3*415)cause='3210';else if(!power&&p['16.09']===1&&b.powered)cause='3220';else if(input.outputShort&&(run||b.running))cause='2310';else if(num(v.temperature)>=100)cause='4210';else if(p['30.03']>1&&!di[p['30.03']-2])cause='9000';
   const used=src===3?[1]:src===4?[2]:src>=7&&src<=16?[src%2===0?1:0,2]:src===6?[1]:src===1||src>=17&&src<=19?[]:[0];if(p['99.02']===3&&percentMode)used.push(p['40.07']-1,p['40.08']-1);
   if(!cause&&p['30.01']===1&&!v.local&&used.some(i=>ai[i].min>0&&ai[i].raw<ai[i].min))cause='8110';
  }
  let fault=board?(cause||(!reset?b.fault||'':'')):'';
  const started=board&&power&&!fault&&enable&&interlock&&!restart&&(run||jog),pair=jog||b.jog||p['22.01']===2||p['22.01']>=3&&di[p['22.01']-3]?2:1;
  if(!started)target=0;
  const emergency=!interlock&&p['21.09']===2||!enable&&p['21.07']===4;
  const coast=!interlock&&p['21.09']===1||!enable&&[2,3].includes(p['21.07'])||!run&&!jog&&!b.jog&&p['21.03']===1;
  let hz=!power||fault||coast?0:ramp(num(b.hz),target,p[pair===2?'22.04':'22.02'],emergency?p['22.07']:p[pair===2?'22.05':'22.03'],maxHz,dt);if(Math.abs(hz)<1e-7)hz=0;
  const currentDemand=Math.max(.2,clamp(num(v.load,50),0,250)/100)*p['99.06'],current=hz&&input.motorConnected?Math.min(currentDemand,p['20.03']):0;
  const warning=board?(num(v.temperature)>=90?'ACS800 TEMP · sıcaklık yüksek':current&&currentDemand>p['20.03']?'CURRENT LIMIT · akım sınırı':hz&&!input.motorConnected?'MOTOR YOK':''):'';
  const s={now,powered:power,board,voltageIn:input.voltage,hz,target,rpm:hz/p['99.07']*p['99.08'],voltage:hz?Math.min(input.voltage,p['99.05'])*Math.min(1,Math.abs(hz)/p['99.07']):0,current,bus:power?input.voltage*1.35:0,torque:current/p['99.06']*100,power:current/p['99.06']*p['99.09']*Math.abs(hz)/p['99.07'],running:!!hz,started,status:!board?'ENERJİ YOK':fault?'ARIZA':!power?'HARİCİ 24V · ŞEBEKE YOK':!interlock?'DIIL · BAŞLATMA KİLİDİ':!enable?'RUN ENABLE YOK':restart?'YENİ START BEKLİYOR':hz?(Math.abs(hz-target)<.005?'ÇALIŞIYOR':target===0?'DURUYOR':'RAMPA'):started?'ÇALIŞIYOR · 0 HIZ':'HAZIR',fault,warning,di,diil:interlock,enable,ai,ext2,local:!!v.local,latch,latchReverse,commandRun:run,panelRun:!!v.run,reset:v.reset,restart,constant,pair,mop,integral,derivative,pidFeedback,pidSet,pidError,pidOutput,act,ref,jog};
  s.history=[...(b.history||[])];if(fault&&fault!==b.fault)s.history.unshift({code:fault,time:now});s.history=s.history.slice(0,16);
  s.ro=[];s.roPending=[];
  for(let i=0;i<3;i++){
   const signals={1:false,2:power&&enable&&!fault,3:started,4:!!fault,5:!fault,11:num(v.temperature)>=90,12:fault==='4210',13:!!fault||!!warning,14:!!warning,15:hz<0,16:!v.local,17:ext2,18:!!constant,19:fault==='3210',20:fault==='3220',28:run,29:ref===0,30:started&&Math.abs(hz-target)<=.1*p['99.07']};
   const requested=board&&!!signals[p[key(14,i+1)]],old=!!b.ro[i],prev=b.roPending?.[i],pending=prev?.value===requested?prev:{value:requested,since:now},delay=p[key(14,4+i*2+(requested?0:1))];
   s.ro[i]=!board?false:requested===old?old:now-pending.since>=delay*1000?requested:old;s.roPending[i]=pending;
  }
  s.ao=[0,1].map(i=>{const sel=p[key(15,1+i*5)],ratios={1:0,3:Math.abs(s.rpm)/p['99.08'],4:Math.abs(hz)/p['99.07'],5:current/p['99.06'],6:Math.abs(s.torque)/100,7:s.power/p['99.09'],8:s.bus/540,9:s.voltage/p['99.05'],10:target/maxHz,11:ref/(percentMode?100:scalar?p['99.07']:p['99.08']),12:(pidError+100)/200,13:act[0]/100,14:act[1]/100};
   const ratio=clamp((ratios[sel]||0)*p[key(15,5+i*5)]/100,0,1),min=p[key(15,3+i*5)]===2?4:0,out=sel===1?0:min+(20-min)*(p[key(15,2+i*5)]?1-ratio:ratio);return board?filter(num(b.ao?.[i]),out,p[key(15,4+i*5)],dt):0;});
  if([18,19].includes(src))v.mop=mop;c._acs800=s;return s;
 }
 const api={id,rating,parameters,definitions,faults,create,config,peek,set,applyMacro,action,clear,links,tick};
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSACS800=api;
})(typeof window==='undefined'?globalThis:window);
