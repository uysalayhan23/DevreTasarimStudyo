/* v1.19.20 — MQ-07 complete measurement topic coverage: real electrical labs / clearly labeled virtual calculations. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._measurementBatchD)return;
const clone=x=>JSON.parse(JSON.stringify(x));
const entries=[["src-08","energy","Elektrik sayacıyla biriken enerjiyi oku","Anlık güç (W) ile zaman boyunca biriken enerji (Wh/kWh) arasındaki farkı gerçek sanal analizör modeliyle öğren.","Sanal dirençli yükü çalıştır, 0/15/30/60 dakikalık eğitim zaman adımlarında Wh ve kWh endekslerini karşılaştır.","230 W tüketici bir saat çalışırsa kaç kWh enerji kullanır?",["0,230 kWh","230 kWh","0,023 kWh"]],["outline-038","energy","Enerji sayaç endeksini yorumla","Bir fazlı enerji sayacının tüketimi neden kWh cinsinden biriktirdiğini, W × saat hesabıyla öğren.","230 W yükü 15 ve 60 dakika sanal çalıştır; oluşan Wh değerlerini ve sayacın neden anlık wattmetre olmadığını açıkla.","230 W, 30 dakikada kaç Wh eder?",["115 Wh","230 Wh","460 Wh"]],["src-10","sensor","PNP sensör ve BK sinyalini incele","Gerçek simülasyondaki PNP sensörün BN/BU besleme ve BK çıkış kontak durumunu metal hedef uzaklığına göre oku.","Metal hedefi 2 mm ve 10 mm uzağa al; sensörün gerçek _contactStates.output durumunu ve besleme kontrolünü karşılaştır.","Metal hedef algılama mesafesindeyken PNP BK çıkışı hangi durumdadır?",["Çıkış aktif","Besleme kapanır","COM kopar"]],["outline-017","electrical:src-01","Programda ölçüm işlemlerini uygula","Sanal editörde gerçek UNI-T problarını seç, VΩmA/COM uçlarını doğru kullan ve kaynağı ölç.","24 V kaynak gerilimini, aynı düğümde 0 V değerini ve ters polaritede işaret değişimini serbest problarla dene.","Gerilim ölçümünde hangi iki uç kullanılır?",["VΩmA ve COM","10A ve 10A","L1 ve PE"]],["outline-018","ruler","Metreyle uzunluk ölçme","mm/cm/m birimleri ile çizgili ölçek üzerinde başlangıç çizgisi ve son noktanın nasıl okunduğunu öğren.","Sanal cetvelde 25, 75 ve 125 mm örneklerini seç; ölçüyü santimetreye dönüştür.","75 mm kaç cm eder?",["7,5 cm","75 cm","0,75 cm"]],["outline-019","caliper","Kumpasla hassas uzunluk ölçme","Kumpasın sabit ana ölçeği ve sürgü/verniyer okumasını sanal ölçek modelinde birleştir.","12,4; 25,6 ve 40,2 mm örneklerinde ana ölçek ile kesirli kısmı ayırt et.","25,6 mm okumasında tam milimetre kısmı kaçtır?",["25 mm","26 mm","6 mm"]],["outline-020","micrometer","Mikrometreyle ölçüm ilkeleri","Mikrometrede gövde ölçeği ve döner tambur adımlarının toplam uzunluğu verdiğini öğren.","5,25; 8,50 ve 12,75 mm sanal örneklerini sırayla incele; her ölçüde 0,01 mm basamağını belirle.","8,50 mm kaç mikrometre eder?",["8500 µm","850 µm","85 µm"]],["outline-021","micrometer","Mikrometreyle dış çap ölç","Dış çap okumasını güvenli sanal mikrometre ekranında sabit ve döner ölçeklerden birleştir.","4,32; 6,78 ve 9,05 mm sanal mil çaplarını sırayla karşılaştır; büyükten küçüğe sırala.","6,78 mm ölçümde yüzde birler basamağı kaçtır?",["8","7","6"]],["outline-022","lux","Lüksmetreyle aydınlık düzeyi hesapla","Aydınlık düzeyinin lüks (lx) olduğunu; noktasal kaynak için uzaklık iki katına çıkınca ideal düzeyin dörtte bire düştüğünü öğren.","Sanal 100 cd nokta kaynağında 1 m, 2 m ve 4 m uzaklık seç; ideal E=I/r² değerlerini karşılaştır.","100 cd kaynağa 2 m uzaklıktaki ideal aydınlık kaç lx?",["25 lx","50 lx","100 lx"]],["outline-025","sound","Desibelmetreyle ses düzeyi modelini anla","Ses basıncı ile dB SPL arasındaki logaritmik ilişkiyi yalnız eğitim modelinde hesapla; gerçek mikrofon ölçümü yapıldığını sanma.","0,02; 0,2 ve 2 Pa sanal basınçları için 60, 80 ve 100 dB SPL karşılaştırmasını incele.","Ses basıncı on kat artarsa SPL yaklaşık kaç dB artar?",["20 dB","10 dB","2 dB"]],["outline-026","temperature","Termometre ve sıcaklık dönüşümü","°C, °F ve PT100 direnç yaklaşımının farklı büyüklükler olduğunu öğren; sensör bağlanmış gibi göstermeden sanal hesapla.","0, 25, 100 °C seçeneklerini uygula; °F ve PT100 yaklaşık Ω değerlerini karşılaştır.","25 °C kaç °F eder?",["77 °F","25 °F","57 °F"]],["outline-027","ruler","Tekrarlı uzunluk ölçümü ve birimler","Uzunluk ölçümünde sıfır noktasını, ölçek çözünürlüğünü ve mm/cm dönüşümünü öğren.","25, 75 ve 125 mm örneklerini tekrar oku; 1 mm çözünürlüğün altındaki ayrıntıların tahmin olduğunu açıkla.","125 mm kaç cm eder?",["12,5 cm","1,25 cm","125 cm"]],["outline-028","electrical:src-01","Elektriksel ölçü aletlerini sınıflandır","Voltmetre, ampermetre ve ohmmetrenin seri/paralel, enerji açık/kapalı kullanım farklarını öğren.","UNI-T ile gerçek 24 V ölçümünü yap; ardından akım ve Ω ölçümünde bağlantıların neden değişeceğini açıkla.","Voltmetre yükle nasıl bağlanır?",["Paralel","Seri","Topraklama hattına"]],["outline-029","electrical:src-03","Elektriksel ölçü cihazlarının türlerini karşılaştır","Enerjisiz direnç ölçümüyle voltmetre/ampermetre/klemens seçiminin neden farklı olduğunu öğren.","1 kΩ enerjisiz direncin iki ucunu ölç, açık probda OL ve aynı uçta 0 Ω durumunu karşılaştır.","Ω modunda dış devre enerjisi ne olmalıdır?",["Kapalı/enerjisiz","24 V açık","230 V açık"]],["outline-030","electrical:src-02","Elektriksel ölçüm terimlerini uygula","A, V, Ω, ölçüm aralığı, polarite ve seri yol kavramlarını gerçek sanal ölçüm üzerinde ayır.","UNI-T DCA 200 mA ile yaklaşık 24 mA değerini ölç; birim dönüştürüp ölçüm sınırını açıkla.","0,024 A kaç mA eder?",["24 mA","240 mA","2,4 mA"]],["outline-039","electrical:outline-016","Elektronik devrede temel sinyal ölçümü","Elektronik devreyi analiz ederken dalga genliği, frekansı, ortak GND ve probun işlevini tanı.","5 Vpp sanal jeneratörü osiloskopta incele; 50 Hz ve 1 kHz frekansta değişmeyen genliği gözle.","Frekans değişip genlik sabitse hangi değer aynı kalır?",["Vpp","Periyot","Çevrim sayısı"]],["outline-040","lcr","LCR metre ve multimetre işlevleri","Ohm (Ω), Henry (H), Farad (F) büyüklüklerini ve frekansa bağlı reaktans kavramını ayır.","Sanal R=1 kΩ, C=1 µF, L=10 mH referanslarını seç; XL ve XC değerini frekans değiştirdikçe hesapla.","Kapasitif reaktans, frekans artınca nasıl değişir?",["Azalır","Artar","Değişmez"]],["outline-041","lcr","RLC referans devresini hesapla","Seri RLC örneğinde R, XL ve XC büyüklüklerinin empedansa katkısını hesapla; gerçek LCR cihazı ölçümüyle karıştırma.","100 Hz, 1 kHz, 10 kHz seçeneklerinde R=100 Ω, L=10 mH, C=1 µF referans empedansını hesapla.","Endüktif reaktans XL hangi bağıntıdır?",["2πfL","1/(2πfL)","R×C"]]];
const array=(id,title,components)=>({version:7,workspaceMode:'control',projectId:'tutorial-session-source-'+id,name:'Öğretici · '+title,symbolNorm:'IEC',preferredAppearance:'material',components:components.map((c,i)=>({id:'d'+i,typeId:c[0],x:90+210*i,y:240,rotation:0,ref:'X'+(i+1),label:c[1],tutorialPurpose:c[2]})),wires:[],junctions:[],referenceOnly:true,tutorialLesson:{id,topicId:'measurement-workshop',phase:'explore',step:0},tutorialExplore:{type:'measurement-virtual-workbench',simulationOnly:true}});
const instrument={
 ruler:[['tutorial-hand-tools','Ölçü cetveli · sembolik','mm → cm → m, sıfır çizgisi ve ölçek çözünürlüğü'],['tutorial-concept','Ölçülecek nesne · sanal','Cetvel üzerinde okunan sanal referans uzunluğu']],
 caliper:[['tutorial-hand-tools','Kumpas · eğitim şeması','Sabit skala + verniyer, 0,1 mm sanal çözünürlük'],['tutorial-concept','Sanal çap numunesi','Yalnız ölçek okuması; gerçek çene modeli değildir']],
 micrometer:[['tutorial-hand-tools','Mikrometre · eğitim şeması','Sabit milimetre çizgisi + tambur çizgisi, sanal 0,01 mm'],['tutorial-concept','Sanal mil numunesi','Yalnız gösterimli mikrometre okuması']],
 lux:[['tutorial-concept','Noktasal ışık kaynağı · 100 cd','İdeal E=I/r² sanal optik modeli'],['tutorial-concept','Lüksmetre eğitim görünümü','Gerçek ışık algılayıcısı/kalibrasyon yok']],
 sound:[['tutorial-microphone','Mikrofon ve basınç kavramı','Sanal ses basıncı referansı, kalibre mikrofon değildir'],['tutorial-concept','Ses seviyesi eğitim kartı','20 log10(p/20 µPa) dB SPL hesabı']],
 temperature:[['tutorial-concept','Termometre · eğitim ölçeği','°C ve °F birim dönüşümü'],['sensor-pt100','PT100 direnç eğitimi','0–100 °C aralığı için basit 0,00385/°C yaklaşımı']],
 lcr:[['tutorial-lcr-meter','LCR metre · kavram modeli','Frekansla değişen XL/XC teorik hesabı'],['resistor','Direnç · R'],['capacitor','Kapasitör · C'],['reactor','Bobin · L']]
};
function display(l,project){
 const u=l?.measurementUpgrade;if(!u?.workbench)return null;
 const mode=u.workbench,options=project?.tutorialExplore?.choices||[];
 const idx=Math.max(0,Math.min(options.length-1,Number(project?.tutorialExplore?.choiceIndex)||0));
 const x=options[idx]||0;let n=Number(x),value='',formula='',caveat='';
 if(mode==='energy'){
  const ea=project?.components?.find(c=>c.typeId==='energy-analyzer-1p'),e=ea?._energyAnalyzer;
  if(!e||e.warning)return {label:'Ölçüm bekleniyor: sanal analizörü çalıştır.',formula:'Enerji = P × t / 3600; 1 kWh = 1000 Wh',index:idx,choices:options,caveat:'Enerji endeksi, enerji analizörü sanal modelinden gelir; bağımsız fiziksel sayaç kalibrasyonu değildir.'};
  value=e.energyWh.toFixed(3)+' Wh · '+(e.energyWh/1000).toFixed(6)+' kWh · P='+e.activePowerW.toFixed(1)+' W';
  formula='E = P × t; t = '+n+' dakika';caveat='Gerçek sanal enerji analizörünün biriken Wh modeli, hızlandırılmış eğitim süresi.';
 }else if(mode==='sensor'){
  const s=project?.components?.find(c=>c.typeId==='proximity');
  const supply=s?._sensorSupply==='ok',closed=!!s?._contactStates?.output,mm=project?.components?.find(c=>c.typeId==='unit-ut33d-plus'),v=mm?._meter?.value,valid=supply&&mm?._meter?.mode==='DCV'&&Number.isFinite(v)&&!mm._meter.warning;
  value='Metal hedef '+n+' mm · PNP BK: '+(supply?(closed?'AKTİF':'PASİF'):'geçersiz')+' · UNI-T DCV: '+(valid?v.toFixed(1)+' V':'ölçüm bekleniyor');
  formula='Gerçek sensör temas modeli: algılama aralığı 4 mm';caveat='UNI-T değeri gerçek sanal prob temaslarından ve PNP kontak/supply modelinden okunur; yalnız simülasyon laboratuvarıdır.';
 }else if(mode==='ruler'||mode==='caliper'||mode==='micrometer'){
  value=n.toLocaleString('tr-TR',{minimumFractionDigits:mode==='ruler'?0:2,maximumFractionDigits:2})+' mm · '+(n/10).toLocaleString('tr-TR')+' cm';
  formula=mode==='ruler'?'mm / 10 = cm':mode==='caliper'?'tam mm + verniyer payı':'gövde mm + tambur (0,01 mm)';
  caveat='Ölçek okuma örneği: sanal referans; gerçek kumpas/mikrometre kalibrasyonu değildir.';
 }else if(mode==='lux'){value=(100/(n*n)).toFixed(2)+' lx';formula='E = 100 cd / ('+n+' m)²';caveat='Yalnız ideal noktasal kaynak, eksene dik yüzey ve mesafe modeli; gerçek lüksmetre sensörü yok.';}
 else if(mode==='sound'){value=(20*Math.log10(n/0.00002)).toFixed(1)+' dB SPL';formula='Lp = 20 × log10(p/20 µPa)';caveat='Sanal ses basıncı hesabı; çevresel ses ölçümü ve kalibrasyon yok.';}
 else if(mode==='temperature'){value=n+' °C = '+(n*9/5+32).toFixed(1)+' °F · PT100 ≈ '+(100*(1+.00385*n)).toFixed(2)+' Ω';formula='°F=1,8×°C+32; R≈100(1+0,00385T)';caveat='0–100 °C aralığında yaklaşık RTD eğitim modeli; gerçek sıcaklık ölçümü değildir.';}
 else if(mode==='lcr'){const f=n,xl=2*Math.PI*f*.01,xc=1/(2*Math.PI*f*.000001);value='f='+f+' Hz · XL='+xl.toFixed(2)+' Ω · XC='+xc.toFixed(2)+' Ω · |Z|='+Math.hypot(100,xl-xc).toFixed(2)+' Ω';formula='XL=2πfL; XC=1/(2πfC); |Z|=√(R²+(XL−XC)²)';caveat='R=100 Ω, L=10 mH, C=1 µF seri RLC teorik hesap; LCR metre cihazının ölçtüğü iddia edilmez.';}
 return {label:value,formula,index:idx,choices:options,caveat};
}
/* Compact model illustrations, not manufacturer photos or instrument calibration images. */
function diagram(l,p){
 const u=l?.measurementUpgrade,mode=u?.workbench;
 if(!mode)return '';
 const st=display(l,p),index=st?.index||0,v=p?.tutorialExplore?.choices?.[index]||0;
 const open='<svg class="measurement-workbench-sketch" viewBox="0 0 244 74" role="img" aria-label="Sanal ölçümün kavramsal çizimi" xmlns="http://www.w3.org/2000/svg">';
 const close='</svg>';
 const base='<rect width="244" height="74" rx="9" fill="#eaf5fa"/>';
 if(['ruler','caliper','micrometer'].includes(mode)){
  const ticks=Array.from({length:21},(_,i)=>'<line x1="'+(24+i*9.8)+'" x2="'+(24+i*9.8)+'" y1="43" y2="'+(i%5===0?24:32)+'" stroke="#225a78" stroke-width="'+(i%5===0?2:1)+'"/>').join('');
  const pos=24+Math.min(19.6,Math.max(0,index*9.8))*10;
  const jaws=mode==='caliper'?'<path d="M24 15v36h8V34h148v17h8V15" fill="none" stroke="#3c617a" stroke-width="3"/>':mode==='micrometer'?'<path d="M26 16h8v36h-8m150-36h10v36h-10" fill="none" stroke="#3c617a" stroke-width="3"/>':'';
  return open+base+jaws+'<path d="M24 44h196" stroke="#245a80" stroke-width="2"/>'+ticks+'<path d="M'+pos+' 10v52" stroke="#cc433b" stroke-width="2.5"/><text x="23" y="68" font-size="10" fill="#214d66">Sanal ölçek · '+mode+'</text>'+close;
 }
 if(mode==='lux')return open+base+'<circle cx="43" cy="35" r="12" fill="#fbbf24"/><path d="M56 35l130-24v48z" fill="#fde68a" opacity=".55"/><rect x="188" y="13" width="7" height="47" rx="2" fill="#447b99"/><text x="70" y="69" font-size="11" fill="#214d66">100 cd → '+v+' m</text>'+close;
 if(mode==='sound')return open+base+'<path d="M12 40h220" stroke="#a8c5d6"/><path d="M12 40Q27 5 42 40T72 40T102 40T132 40T162 40T192 40T222 40" stroke="#2b83b4" stroke-width="2.5" fill="none"/><text x="22" y="68" font-size="10" fill="#214d66">Sanal ses basıncı · '+v+' Pa</text>'+close;
 if(mode==='temperature')return open+base+'<rect x="39" y="10" width="11" height="44" rx="5" fill="#d5e6ef" stroke="#376682"/><rect x="42" y="'+(50-v*.3)+'" width="5" height="'+(v*.3+4)+'" fill="#d74e4b"/><circle cx="44" cy="57" r="8" fill="#e05d52"/><text x="69" y="38" font-size="16" font-weight="700" fill="#245b79">'+v+' °C</text>'+close;
 if(mode==='lcr')return open+base+'<path d="M12 37h24l8-13 9 26 9-26 9 26 8-13h22m3 0h6m9-13v26m9-26v26m0-13h10m0-13c4-9 8-9 12 0s8 9 12 0s8-9 12 0h20" fill="none" stroke="#235c7c" stroke-width="2"/><text x="22" y="68" font-size="10" fill="#245b79">R · C · L · f='+v+' Hz</text>'+close;
 if(mode==='sensor')return open+base+'<rect x="15" y="23" width="67" height="30" rx="6" fill="#beddeb" stroke="#38718e"/><text x="25" y="42" font-size="12" fill="#214d66">PNP B1</text><path d="M83 37h80" stroke="#27798d" stroke-dasharray="6 4"/><rect x="'+(172+index*7)+'" y="24" width="23" height="27" fill="#9aa8b2" stroke="#486273"/><text x="20" y="66" font-size="10" fill="#245b79">Metal hedef: '+v+' mm</text>'+close;
 if(mode==='energy')return open+base+'<rect x="14" y="17" width="66" height="40" rx="5" fill="#edf8ff" stroke="#3580a4"/><text x="25" y="33" font-size="9" fill="#286684">Wh → kWh</text><text x="24" y="48" font-size="11" font-weight="700" fill="#245b79">'+v+' dk</text><path d="M87 39h138" stroke="#aac8d8" stroke-width="7"/><path d="M87 39h'+(87+138*index/3)+'" stroke="#22806f" stroke-width="7"/>'+close;
 return '';
}
function choose(l,p,index,solve,byId){
 const u=l?.measurementUpgrade;if(!u?.workbench||!p?.tutorialExplore)return null;
 const options=p.tutorialExplore.choices||[];const i=Number(index);
 if(!Number.isInteger(i)||i<0||i>=options.length)return null;
 p.tutorialExplore.choiceIndex=i;
 if(u.workbench==='energy'&&typeof solve==='function'){
  const ea=p.components.find(c=>c.typeId==='energy-analyzer-1p');
  if(ea){ea._energyWh=0;delete ea._energyAnalyzerLast}
  solve(p,byId,{now:1000});solve(p,byId,{now:1000+Number(options[i])*60000});
 }
 if(u.workbench==='sensor'&&typeof solve==='function'){
  const sen=p.components.find(c=>c.typeId==='proximity');
  if(sen)sen.sensing={target:'metal',distance:Number(options[i]),range:4,offset:0};
  solve(p,byId,{now:1000});
 }
 return display(l,p);
}
for(const [suffix,mode,heading,goal,task,question,answers] of entries){
 const id='measurement-workshop-'+suffix,l=L.byId[id];if(!l||l.topicId!=='measurement-workshop')throw Error('Missing workshop lesson '+id);
 let p,workbench=null;
 if(mode==='energy'){
  const src=L.byId['measurement-workshop-src-06'];if(!src?.project?.tutorialExplore?.presets)throw Error('Canonical power analyzer not present');
  p=clone(src.project);workbench='energy';l.energyAnalyzerRich=true;l.kind='explore';l.steps=[];
 }else if(mode==='sensor'){
  p=clone(l.project);workbench='sensor';l.kind='explore';l.steps=p.wires.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'Sensör terminalini bağla',why:w.tutorialWhy||'Sensör çıkışını incele'}));
  const sensor=p.components.find(c=>c.typeId==='proximity');if(!sensor)throw Error('PNP sensor missing');sensor.sensing={target:'metal',distance:10,range:4,offset:0};
  p.components=p.components.filter(c=>!['mr','mb'].includes(c.id));
  p.wires=p.wires.filter(w=>!['mr','mb'].includes(w.from?.c)&&!['mr','mb'].includes(w.to?.c));
  const m=p.components.find(c=>c.typeId==='unit-ut33d-plus'),red=p.components.find(c=>c.id==='mm-red'),black=p.components.find(c=>c.id==='mm-black');
  if(!m||!red||!black)throw Error('PNP UNI-T probe model incomplete');
  m.meterPosition=4;m.multimeterMode='DCV';red.probeTarget={c:sensor.id,p:'BK'};black.probeTarget={c:sensor.id,p:'BU'};
  l.steps=p.wires.filter(w=>w.role!=='MEASURE'&&!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'Sensörü besleme terminaline bağla',why:w.tutorialWhy||'Besleme referansı'}));
 }else if(mode.startsWith('electrical:')){
  const token=mode.split(':')[1],source=token.startsWith('outline-')?L.byId['measurement-workshop-'+token]:L.byId['measurement-workshop-'+token];
  if(!source?.project?.components?.length)throw Error('Electrical reference missing '+token);
  p=clone(source.project);l.kind=source.kind;l.steps=clone(source.steps||[]);
 }else{
  workbench=mode;p=array(id,l.title,instrument[mode]);l.kind='explore';l.steps=[];
 }
 p.projectId='tutorial-session-source-'+id;p.name='Öğretici · '+l.title;p.tutorialLesson={id,topicId:l.topicId,phase:'explore',step:0,level:l.variant};
 if(workbench){
  const choices={energy:[0,15,30,60],sensor:[10,2,6],ruler:[25,75,125],caliper:[12.4,25.6,40.2],micrometer: suffix==='outline-021'?[4.32,6.78,9.05]:[5.25,8.50,12.75],lux:[1,2,4],sound:[.02,.2,2],temperature:[0,25,100],lcr:[100,1000,10000]}[workbench];
  p.tutorialExplore={...p.tutorialExplore,workbench,choices,choiceIndex:0,simulationOnly:true,explicitModelSource:workbench==='energy'?'energy-analyzer-1p':workbench==='sensor'?'CCSSensors+CCSSimulation':'educational formula with selected virtual reference values'};
 }else p.tutorialExplore={...p.tutorialExplore,simulationOnly:true};
 l.project=p;l.workspaceMode=p.workspaceMode;l.designStandard='rich-reference-v1';
 l.measurementUpgrade={heading,goal,task,question,options:answers,workbench};
 l.summary=goal;l.learningGoal=goal;l.explanation=task+' Simülasyon dışında gerçek enerjili cihaz kullanılması gerekmez.';
 l.beginnerSteps=['Ölçüm cihazının neyi ölçtüğünü öğren.','Önce beklediğin sonucu tahmin et.',task,'Ölçek, birim ve modelin sınırlarını açıkla.','Konu kontrolünde ölçümün nedenini yanıtla.'];
 l.quiz={question,options:answers,answer:0,why:goal};
 l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref||c.id,why:c.tutorialPurpose||'Sanal ders nesnesi'}));
 l.pedagogyReview={version:'v1.19.20-measure-batch-d',reviewed:true,codeImplemented:true,visualAcceptance:false,model:workbench||mode,source:workbench==='energy'?'verified energy analyzer':workbench==='sensor'?'verified proximity switch contact':'explicit simulated educational calculation / existing lab'};
}
L._measurementBatchD=true;
root.DTSMeasurementWorkbench={display,choose,diagram};
})(typeof window==='undefined'?globalThis:window);
