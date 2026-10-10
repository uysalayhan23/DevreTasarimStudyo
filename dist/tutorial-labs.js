(function(root,factory){
'use strict';
const api=factory(root);
if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSTutorialLabs=api;
})(typeof window==='undefined'?globalThis:window,function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(Number(v))?Number(v):a)),num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const fmt=(v,d=1)=>Number.isFinite(v)?Number(v).toLocaleString('tr-TR',{maximumFractionDigits:d}):'—';
const T0={mode:'step-down',n1:1000,n2:104,vin:230,freq:50,ratedVA:500,loadPct:60,pf:.9,efficiency:92,regulationPct:4,coreAreaCm2:20,bMax:1.5,coreLossW:10,magnetizingPct:5};
const M0={type:'induction',voltage:400,ratedVoltage:400,freq:50,poles:4,loadPct:75,ratedKW:2.2,efficiency:88,pf:.82,slipPct:4,connection:'star',direction:'cw',fieldPct:100,ratedSpeed:1500};
const state={transformer:{...T0,running:false,phase:0,last:null},motor:{...M0,running:false,angle:0,last:null}};let active='',raf=0,last=0;

function transformerMode(n1,n2){const r=n2/Math.max(1,n1);return r>1.02?'step-up':r<.98?'step-down':'isolation'}
function calcTransformer(raw={}){
 const x={...T0,...raw},n1=clamp(x.n1,1,1e5),n2=clamp(x.n2,1,1e5),vin=clamp(x.vin,0,1e4),freq=clamp(x.freq,1,1e3),ratedVA=clamp(x.ratedVA,1,1e7);
 const loadPct=clamp(x.loadPct,0,150),load=loadPct/100,pf=clamp(x.pf,.05,1),eta=clamp(x.efficiency,1,100)/100,reg=clamp(x.regulationPct,0,30);
 const ratio=n2/n1,v2Ideal=vin*ratio,v2=Math.max(0,v2Ideal*(1-reg*load/100)),soutVA=ratedVA*load,i2=v2?soutVA/v2:0,poutW=soutVA*pf;
 const loss=poutW?poutW*(1/eta-1):0,coreLoss=Math.min(clamp(x.coreLossW,0,1e6),loss),copperLoss=Math.max(0,loss-coreLoss),pinW=poutW+loss;
 const magI=vin?(ratedVA/vin)*(clamp(x.magnetizingPct,0,30)/100):0,loadI=vin?pinW/(vin*Math.max(.05,pf)):0,i1=Math.hypot(loadI,magI);
 const phiMax=vin/(4.44*freq*n1),area=Math.max(.01,num(x.coreAreaCm2,20))*1e-4,fluxDensity=phiMax/area,bMax=clamp(x.bMax,.1,3);
 return {n1,n2,vin,freq,ratedVA,loadPct,pf,ratio,v2Ideal,v2,soutVA,i1,i2,poutW,pinW,totalLoss:loss,coreLoss,copperLoss,magI,phiMax,fluxDensity,bMax,actualMode:transformerMode(n1,n2),saturation:fluxDensity>bMax,overload:loadPct>100,regulationActual:v2Ideal?100*(v2Ideal-v2)/v2Ideal:0};
}
function calcMotor(raw={}){
 const x={...M0,...raw},type=x.type||'induction',ratedKW=clamp(x.ratedKW,.01,1e4),loadPct=clamp(x.loadPct,0,150),load=loadPct/100,eta=clamp(x.efficiency,1,100)/100;
 const voltage=clamp(x.voltage,0,1e4),ratedVoltage=clamp(x.ratedVoltage,1,1e4),direction=x.direction==='ccw'?'ccw':'cw',poutKW=ratedKW*load,pinKW=poutKW/eta;
 if(type==='dc'){const fieldPct=clamp(x.fieldPct,20,150),ratedSpeed=clamp(x.ratedSpeed,10,1e5),speed=Math.max(0,ratedSpeed*(voltage/ratedVoltage)*(100/fieldPct)*(1-.06*load)),current=voltage?pinKW*1000/voltage:0,torque=speed?9550*poutKW/speed:0;return {type,direction,ratedKW,loadPct,poutKW,pinKW,voltage,ratedVoltage,fieldPct,ratedSpeed,speed,current,torque,status:loadPct>100?'overload':fieldPct<70?'field-weakening':'normal'};}
 const freq=clamp(x.freq,1,400),poles=Math.max(2,Math.round(clamp(x.poles,2,24)/2)*2),pf=clamp(x.pf,.05,1),connection=x.connection==='delta'?'delta':'star',ns=120*freq/poles;
 const slip=type==='synchronous'?0:(clamp(x.slipPct,0,20)/100)*(.18+.82*load),speed=ns*(1-slip),current=voltage?pinKW*1000/(Math.sqrt(3)*voltage*pf):0,torque=speed?9550*poutKW/speed:0;
 const phaseVoltage=connection==='star'?voltage/Math.sqrt(3):voltage,nominalPhase=connection==='star'?ratedVoltage/Math.sqrt(3):ratedVoltage,vf=phaseVoltage/freq,vfRel=vf/(nominalPhase/50);
 return {type,direction,ratedKW,loadPct,poutKW,pinKW,voltage,ratedVoltage,freq,poles,pf,connection,synchronousSpeed:ns,speed,slipPct:slip*100,current,torque,phaseVoltage,vf,vfRel,status:loadPct>100?'overload':vfRel>1.12?'over-flux':vfRel<.72?'under-flux':'normal'};
}
const meter=(a,b,u='',c='')=>'<div class="lab-meter '+c+'"><small>'+a+'</small><strong>'+b+'</strong><span>'+u+'</span></div>';
const field=(a,k,v,min,max,step,u='',cls='')=>'<label class="lab-field '+cls+'"><span>'+a+(u?' <em>'+u+'</em>':'')+'</span><input type="number" data-lab-field="'+k+'" value="'+v+'" min="'+min+'" max="'+max+'" step="'+step+'"></label>';
const select=(a,k,v,o,cls='')=>'<label class="lab-field '+cls+'"><span>'+a+'</span><select data-lab-field="'+k+'">'+o.map(x=>'<option value="'+x[0]+'" '+(String(x[0])===String(v)?'selected':'')+'>'+x[1]+'</option>').join('')+'</select></label>';

function transformerTemplate(){
 const s=state.transformer;
 return '<div class="lab-page"><header class="lab-page-head"><button data-tutorial-lab-back>← Laboratuvarlar</button><div><span>ELEKTRİK MAKİNELERİ</span><h2>Transformatörler Laboratuvarı</h2><p>Sarım, gerilim, frekans, yük ve nüve parametrelerini değiştir.</p></div><button class="lab-run" data-lab-sim-toggle>▶ Simülasyonu başlat</button></header>'+
 '<div class="lab-safety">Sanal eğitim alanıdır; gerçek şebeke üzerinde deneme yapmayın.</div>'+
 '<div class="lab-preset-row"><b>Hazır deney:</b><button data-lab-preset="step-down">230→24 V step-down</button><button data-lab-preset="step-up">230→400 V step-up</button><button data-lab-preset="isolation">1:1 izolasyon</button><button data-lab-preset="freq-drop">Frekansı düşür</button></div>'+
 '<div class="lab-workbench"><section class="lab-controls"><h3>Parametreler</h3>'+
 select('Çalışma seçimi','mode',s.mode,[['step-down','Step-down'],['step-up','Step-up'],['isolation','1:1 izolasyon'],['custom','Serbest']])+
 field('Primer sarım','n1',s.n1,10,10000,10,'tur')+field('Sekonder sarım','n2',s.n2,10,10000,10,'tur')+field('Giriş gerilimi','vin',s.vin,0,1000,1,'V RMS')+field('Frekans','freq',s.freq,10,400,1,'Hz')+
 field('Anma gücü','ratedVA',s.ratedVA,10,100000,10,'VA')+field('Yük','loadPct',s.loadPct,0,150,1,'%')+field('Güç katsayısı','pf',s.pf,.1,1,.01,'cosφ')+field('Verim','efficiency',s.efficiency,50,100,.1,'%')+
 field('Regülasyon','regulationPct',s.regulationPct,0,20,.1,'%')+field('Nüve kesiti','coreAreaCm2',s.coreAreaCm2,1,500,.5,'cm²')+field('Bmax','bMax',s.bMax,.2,2.5,.05,'T')+field('Nüve kaybı','coreLossW',s.coreLossW,0,10000,1,'W')+field('Mıknatıslanma akımı','magnetizingPct',s.magnetizingPct,0,25,.1,'%')+
 '</section><section class="lab-visual"><div class="transformer-graphic"><div class="coil"><b>N₁</b><span data-t-n1></span></div><div class="core"><i data-flux-pointer></i><strong>Φ</strong></div><div class="coil"><b>N₂</b><span data-t-n2></span></div></div><div class="lab-live-line"><span>v₁(t): <b data-live-v1>0 V</b></span><span>v₂(t): <b data-live-v2>0 V</b></span></div><div class="lab-ratio-banner" data-transformer-mode></div><div class="lab-experiment"><h3>Dene ve gözle</h3><ol><li>N₂’yi artır: V₂ artar.</li><li>Yükü artır: regülasyon gerilim düşümünü büyütür.</li><li>V sabitken f’yi azalt: akı ve B artar.</li><li>Step-up/down arasında geç: gerilim-akım ilişkisini karşılaştır.</li></ol></div></section><section class="lab-readout"><h3>Canlı sonuçlar</h3><div class="lab-meter-grid" data-transformer-meters></div><div class="lab-warning" data-transformer-warning></div></section></div>'+
 '<section class="lab-theory"><h3>Önemli bilgiler</h3><div class="lab-theory-grid"><article><b>Dönüşüm oranı</b><p>V₂/V₁≈N₂/N₁. N₂>N₁ step-up, N₂<N₁ step-down.</p></article><article><b>Akım ilişkisi</b><p>Gerilim yükselirken idealde akım azalır; güç yaklaşık korunur.</p></article><article><b>Faraday / nüve</b><p>Φmax≈V/(4,44·f·N). Frekans düşerse doyum riski artar.</p></article><article><b>Yük ve verim</b><p>Bakır+nüve kayıpları giriş gücünü artırır; yükte çıkış gerilimi düşebilir.</p></article></div></section></div>';
}
function motorTemplate(){
 const s=state.motor;
 return '<div class="lab-page"><header class="lab-page-head"><button data-tutorial-lab-back>← Laboratuvarlar</button><div><span>ELEKTRİK MAKİNELERİ</span><h2>Motorlar Laboratuvarı</h2><p>Asenkron, senkron ve DC motorların temel parametrelerini karşılaştır.</p></div><button class="lab-run" data-lab-sim-toggle>▶ Simülasyonu başlat</button></header>'+
 '<div class="lab-safety">Sanal eğitim alanıdır; gerçek motor/şebeke bağlantısını tek başınıza denemeyin.</div>'+
 '<div class="lab-preset-row"><b>Hazır deney:</b><button data-lab-preset="motor-nominal">50 Hz · 4 kutup</button><button data-lab-preset="motor-vf">25 Hz · V/f sabit</button><button data-lab-preset="motor-overload">%120 yük</button><button data-lab-preset="motor-reverse">Yönü tersle</button><button data-lab-preset="motor-sync">Senkron</button><button data-lab-preset="motor-dc">DC</button></div>'+
 '<div class="lab-workbench"><section class="lab-controls"><h3>Parametreler</h3>'+
 select('Motor tipi','type',s.type,[['induction','3~ asenkron'],['synchronous','3~ senkron'],['dc','DC motor']])+field('Uygulanan gerilim','voltage',s.voltage,0,1000,1,'V')+field('Anma gerilimi','ratedVoltage',s.ratedVoltage,12,1000,1,'V')+
 field('Frekans','freq',s.freq,5,200,1,'Hz','motor-ac-only')+select('Kutup sayısı','poles',s.poles,[['2','2'],['4','4'],['6','6'],['8','8'],['10','10'],['12','12']],'motor-ac-only')+select('Bağlantı','connection',s.connection,[['star','Yıldız Y'],['delta','Üçgen Δ']],'motor-ac-only')+
 field('Güç katsayısı','pf',s.pf,.1,1,.01,'cosφ','motor-ac-only')+field('Tam yük kayması','slipPct',s.slipPct,0,15,.1,'%','motor-induction-only')+field('Anma mekanik gücü','ratedKW',s.ratedKW,.05,1000,.05,'kW')+field('Mekanik yük','loadPct',s.loadPct,0,150,1,'%')+field('Verim','efficiency',s.efficiency,40,100,.1,'%')+
 select('Dönüş yönü','direction',s.direction,[['cw','CW'],['ccw','CCW']])+field('Alan akısı','fieldPct',s.fieldPct,20,150,1,'%','motor-dc-only')+field('Anma devri','ratedSpeed',s.ratedSpeed,100,10000,10,'rpm','motor-dc-only')+
 '</section><section class="lab-visual"><div class="motor-graphic"><div class="stator"><div class="rotor" data-motor-rotor><i></i><b>M</b></div><span class="phase a">U</span><span class="phase b">V</span><span class="phase c">W</span></div><div class="motor-speed"><strong data-motor-rpm>0</strong><span>rpm</span></div></div><div class="lab-ratio-banner" data-motor-status></div><div class="lab-experiment"><h3>Dene ve gözle</h3><ol><li>50 Hz/4 kutupta nₛ=1500 rpm.</li><li>Yükü artır: kayma, akım ve tork değişir.</li><li>25 Hz’e inerken gerilimi de yarıya indir: V/f sabit kalır.</li><li>Yıldız/üçgen faz gerilimini karşılaştır.</li><li>DC motorda armatür gerilimi ve alan akısını değiştir.</li></ol></div></section><section class="lab-readout"><h3>Canlı sonuçlar</h3><div class="lab-meter-grid" data-motor-meters></div><div class="lab-warning" data-motor-warning></div></section></div>'+
 '<section class="lab-theory"><h3>Motorlarda temel kavramlar</h3><div class="lab-theory-grid"><article><b>Asenkron</b><p>nₛ=120·f/p; rotor nₛ’den biraz yavaştır, fark kaymadır.</p></article><article><b>Senkron</b><p>Rotor döner alanla kilitlenir; kararlı durumda kayma sıfırdır.</p></article><article><b>Yıldız / üçgen</b><p>Yıldızda faz gerilimi Uhat/√3, üçgende Uhat’tır.</p></article><article><b>V/f kontrolü</b><p>Frekansla gerilimi orantılı azaltmak manyetik akıyı yaklaşık sabit tutar.</p></article><article><b>Tork</b><p>T≈9550·P(kW)/n(rpm).</p></article><article><b>DC motor</b><p>Armatür gerilimi ve alan akısı hız-tork dengesini belirler.</p></article></div></section></div>';
}
function read(panel,target){panel.querySelectorAll('[data-lab-field]').forEach(el=>{target[el.dataset.labField]=el.tagName==='SELECT'?el.value:num(el.value,target[el.dataset.labField])})}
function set(panel,k,v){const el=panel.querySelector('[data-lab-field="'+k+'"]');if(el)el.value=v}
function updateT(panel){
 read(panel,state.transformer);const r=calcTransformer(state.transformer);state.transformer.last=r;
 panel.querySelector('[data-t-n1]').textContent=fmt(r.n1,0)+' tur';panel.querySelector('[data-t-n2]').textContent=fmt(r.n2,0)+' tur';
 const mode=r.actualMode==='step-up'?'STEP-UP · yükseltici':r.actualMode==='step-down'?'STEP-DOWN · düşürücü':'1:1 · izolasyon';
 panel.querySelector('[data-transformer-mode]').innerHTML='<b>'+mode+'</b><span>N₂/N₁='+fmt(r.ratio,3)+' · '+fmt(r.vin,1)+' V → '+fmt(r.v2,1)+' V</span>';
 panel.querySelector('[data-transformer-meters]').innerHTML=[
  meter('Sekonder ideal',fmt(r.v2Ideal,2),'V'),meter('Sekonder yüklü',fmt(r.v2,2),'V',r.overload?'warn':''),
  meter('Primer akımı',fmt(r.i1,3),'A'),meter('Sekonder akımı',fmt(r.i2,3),'A'),meter('Çıkış görünür güç',fmt(r.soutVA,1),'VA'),meter('Çıkış aktif güç',fmt(r.poutW,1),'W'),
  meter('Giriş aktif güç',fmt(r.pinW,1),'W'),meter('Toplam kayıp',fmt(r.totalLoss,1),'W'),meter('Gerilim düşümü',fmt(r.regulationActual,2),'%'),
  meter('Φ max',fmt(r.phiMax*1000,3),'mWb'),meter('Akı yoğunluğu B',fmt(r.fluxDensity,3),'T',r.saturation?'danger':''),meter('Mıknatıslanma',fmt(r.magI,3),'A')
 ].join('');
 const w=[];if(r.saturation)w.push('⚠ Nüve doyum riski: B='+fmt(r.fluxDensity,2)+' T > Bmax='+fmt(r.bMax,2)+' T.');if(r.overload)w.push('⚠ Yük %100’ü aşıyor.');if(!w.length)w.push('✓ Çalışma noktası ayarlanan sınırlar içinde.');
 panel.querySelector('[data-transformer-warning]').innerHTML=w.join('<br>');panel.querySelector('[data-lab-sim-toggle]').textContent=state.transformer.running?'■ Simülasyonu durdur':'▶ Simülasyonu başlat';
}
function updateM(panel){
 read(panel,state.motor);const r=calcMotor(state.motor);state.motor.last=r;const dc=r.type==='dc';
 panel.querySelectorAll('.motor-ac-only').forEach(x=>x.hidden=dc);panel.querySelectorAll('.motor-induction-only').forEach(x=>x.hidden=r.type!=='induction');panel.querySelectorAll('.motor-dc-only').forEach(x=>x.hidden=!dc);
 panel.querySelector('[data-motor-rpm]').textContent=fmt(r.speed,0);
 panel.querySelector('[data-motor-status]').innerHTML='<b>'+(r.type==='induction'?'3~ ASENKRON':r.type==='synchronous'?'3~ SENKRON':'DC MOTOR')+'</b><span>'+fmt(r.poutKW,2)+' kW · '+r.direction.toUpperCase()+'</span>';
 panel.querySelector('[data-motor-meters]').innerHTML=[
  r.synchronousSpeed!=null?meter('Senkron hız nₛ',fmt(r.synchronousSpeed,0),'rpm'):'',meter('Mil hızı',fmt(r.speed,0),'rpm'),r.slipPct!=null?meter('Kayma',fmt(r.slipPct,2),'%'):'',
  meter(dc?'Armatür akımı':'Hat akımı',fmt(r.current,2),'A'),meter('Mil torku',fmt(r.torque,2),'N·m'),meter('Çıkış gücü',fmt(r.poutKW,3),'kW'),meter('Giriş gücü',fmt(r.pinKW,3),'kW'),
  !dc?meter('Faz gerilimi',fmt(r.phaseVoltage,1),'V'):'',!dc?meter('V/f',fmt(r.vf,2),'V/Hz',r.status==='over-flux'?'danger':''):'',!dc?meter('V/f bağıl',fmt(r.vfRel*100,0),'%'):'',dc?meter('Alan akısı',fmt(r.fieldPct,0),'%'):'',meter('Yük',fmt(r.loadPct,0),'%',r.status==='overload'?'warn':'')
 ].join('');
 const w=[];if(r.status==='overload')w.push('⚠ Aşırı mekanik yük.');if(r.status==='over-flux')w.push('⚠ V/f yüksek: doyum/ısınma riski.');if(r.status==='under-flux')w.push('⚠ V/f düşük: kullanılabilir tork azalır.');if(r.status==='field-weakening')w.push('ℹ DC alan zayıflatma: hız artabilir, tork kapasitesi azalır.');if(!w.length)w.push('✓ Eğitim modeli normal çalışma bölgesinde.');
 panel.querySelector('[data-motor-warning]').innerHTML=w.join('<br>');panel.querySelector('[data-lab-sim-toggle]').textContent=state.motor.running?'■ Simülasyonu durdur':'▶ Simülasyonu başlat';
}
function preset(panel,n){
 if(active==='transformer'){
  const s=state.transformer;if(n==='step-down')Object.assign(s,{mode:'step-down',n1:1000,n2:104,vin:230,freq:50,loadPct:60,coreAreaCm2:20});if(n==='step-up')Object.assign(s,{mode:'step-up',n1:500,n2:870,vin:230,freq:50,loadPct:60,coreAreaCm2:25});if(n==='isolation')Object.assign(s,{mode:'isolation',n1:800,n2:800,vin:230,freq:50,loadPct:50});if(n==='freq-drop')Object.assign(s,{mode:'custom',n1:500,n2:250,vin:230,freq:25,loadPct:40,coreAreaCm2:20,bMax:1.5});Object.keys(T0).forEach(k=>set(panel,k,s[k]));updateT(panel);
 }else{
  const s=state.motor;if(n==='motor-nominal')Object.assign(s,{type:'induction',voltage:400,ratedVoltage:400,freq:50,poles:4,loadPct:75,ratedKW:2.2,efficiency:88,pf:.82,slipPct:4,connection:'star',direction:'cw'});if(n==='motor-vf')Object.assign(s,{type:'induction',voltage:200,ratedVoltage:400,freq:25,poles:4,loadPct:70});if(n==='motor-overload')Object.assign(s,{type:'induction',voltage:400,freq:50,poles:4,loadPct:120});if(n==='motor-reverse')s.direction=s.direction==='cw'?'ccw':'cw';if(n==='motor-sync')Object.assign(s,{type:'synchronous',voltage:400,ratedVoltage:400,freq:50,poles:4,loadPct:70,ratedKW:3,efficiency:92,pf:.9});if(n==='motor-dc')Object.assign(s,{type:'dc',voltage:230,ratedVoltage:230,loadPct:70,ratedKW:1.5,efficiency:86,fieldPct:100,ratedSpeed:1500,direction:'cw'});Object.keys(M0).forEach(k=>set(panel,k,s[k]));updateM(panel);
 }
}
function modePreset(panel,v){const s=state.transformer;s.mode=v;if(v==='step-down'){s.n1=1000;s.n2=104}if(v==='step-up'){s.n1=500;s.n2=870}if(v==='isolation'){s.n1=800;s.n2=800}set(panel,'n1',s.n1);set(panel,'n2',s.n2);updateT(panel)}
function open(name){const panel=root.document?.querySelector('#tutorialLabPanel'),dash=root.document?.querySelector('#tutorialDashboard');if(!panel||!dash)return;active=name;panel.hidden=false;dash.classList.add('lab-open');panel.innerHTML=name==='transformer'?transformerTemplate():motorTemplate();name==='transformer'?updateT(panel):updateM(panel);panel.scrollIntoView({block:'start'});animate()}
function close(){const p=root.document?.querySelector('#tutorialLabPanel'),d=root.document?.querySelector('#tutorialDashboard');active='';if(p){p.hidden=true;p.innerHTML=''}d?.classList.remove('lab-open')}
function animate(){if(raf||!root.requestAnimationFrame)return;const loop=ts=>{const dt=Math.min(100,Math.max(0,ts-last||0));last=ts;const p=root.document?.querySelector('#tutorialLabPanel');if(p&&!p.hidden&&active==='transformer'&&state.transformer.running&&state.transformer.last){state.transformer.phase=(state.transformer.phase+dt*.0025)%(Math.PI*2);const s=Math.sin(state.transformer.phase),r=state.transformer.last;p.querySelector('[data-live-v1]').textContent=fmt(r.vin*Math.SQRT2*s,0)+' V';p.querySelector('[data-live-v2]').textContent=fmt(r.v2*Math.SQRT2*s,0)+' V';p.querySelector('[data-flux-pointer]').style.transform='translateX('+Math.round(s*32)+'px)'}if(p&&!p.hidden&&active==='motor'&&state.motor.running&&state.motor.last){const r=state.motor.last;state.motor.angle=(state.motor.angle+(r.direction==='ccw'?-1:1)*dt*Math.max(0,r.speed)*.00012)%360;p.querySelector('[data-motor-rotor]').style.transform='rotate('+state.motor.angle+'deg)'}raf=root.requestAnimationFrame(loop)};raf=root.requestAnimationFrame(loop)}
function bind(){const d=root.document;if(!d||d.documentElement.dataset.tutorialLabsBound)return;d.documentElement.dataset.tutorialLabsBound='1';
 d.addEventListener('click',e=>{const o=e.target.closest?.('[data-tutorial-lab-open]');if(o){e.preventDefault();open(o.dataset.tutorialLabOpen);return}if(e.target.closest?.('[data-tutorial-lab-back]')){e.preventDefault();close();return}if(e.target.closest?.('[data-tutorial-back],[data-open-tutorial]')){close();return}const p=d.querySelector('#tutorialLabPanel');if(!p||p.hidden)return;const s=e.target.closest?.('[data-lab-sim-toggle]');if(s){const st=active==='transformer'?state.transformer:state.motor;st.running=!st.running;active==='transformer'?updateT(p):updateM(p);animate();return}const pr=e.target.closest?.('[data-lab-preset]');if(pr)preset(p,pr.dataset.labPreset)});
 d.addEventListener('input',e=>{const el=e.target.closest?.('[data-lab-field]');if(!el)return;const p=d.querySelector('#tutorialLabPanel');if(!p||p.hidden)return;if(active==='transformer'){read(p,state.transformer);el.dataset.labField==='mode'?modePreset(p,el.value):updateT(p)}else if(active==='motor')updateM(p)});
}
const api={calcTransformer,calcMotor,transformerMode,open,close,state,defaults:{transformer:T0,motor:M0},bind};if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',bind,{once:true});else bind()}return api;
});