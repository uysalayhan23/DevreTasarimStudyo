(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._pedagogyV119p31)return;L._pedagogyV119p31=true;L._pedagogyV119p30=true;L._pedagogyV119p29=true;L._pedagogyV119p28=true;L._pedagogyV119p27=true;L._pedagogyV119p26=true;L._pedagogyV119p25=true;L._pedagogyV119p24=true;L._pedagogyV119p23=true;L._pedagogyV119p22=true;L._pedagogyV119p21=true;L._pedagogyV119p20=true;L._pedagogyV119p19=true;L._pedagogyV119p18=true;L._pedagogyV119p17=true;L._pedagogyV119p16=true;L._pedagogyV119p15=true;L._pedagogyV119=true;
const clone=v=>JSON.parse(JSON.stringify(v));
const C=(id,typeId,x,y,ref,label,extra={})=>({id,typeId,x,y,rotation:0,ref,label:label||ref,state:false,address:'',note:'',...extra});
let wi=42000;
const W=(a,ap,b,bp,hint,why,color='#8b5a2b',role='CONTROL',size='1.5')=>({id:'pgw'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},color,role,size,points:[],tutorialHint:hint,tutorialWhy:why});
const base=(id,name,mode='control')=>({version:7,workspaceMode:mode,projectId:'tutorial-'+id,name,symbolNorm:'IEC',preferredAppearance:'material',components:[],wires:[],junctions:[],colorRoles:{'#e53935':'L1','#f97316':'L2','#f4c430':'L3','#1e88e5':'N','#16a34a':'PE','#8b5a2b':'+24V','#111827':'0V','#43a047':'SIGNAL','#808080':'CONTROL'}});
const specs=(rows,startX=100,startY=170,gapX=230,gapY=210)=>rows.map((r,i)=>C('pg'+i,r[0],startX+(i%5)*gapX,startY+Math.floor(i/5)*gapY,r[2]||('X'+(i+1)),r[1],r[3]||{}));
function board(id,title,rows,mode='control'){const p=base(id,title,mode);p.components=specs(rows);p.referenceOnly=true;return p}
function purposeFor(typeId,label=''){
 const id=String(typeId||''),n=String(label||'').toLocaleLowerCase('tr-TR');
 if(/supply|battery|bench-supply/.test(id))return 'Devrenin çalışması için gerekli elektrik enerjisini sağlar.';
 if(/resistor/.test(id))return 'Akıma karşı direnç oluşturur; Ohm Kanunu ve dirençli devrelerin temel elemanıdır.';
 if(/meter-ammeter/.test(id))return 'Akımı ölçer; ölçülen akımın içinden geçmesi için seri bağlanır.';
 if(/meter-voltmeter/.test(id))return 'İki nokta arasındaki gerilimi ölçer; ölçülecek elemana paralel bağlanır.';
 if(/multimeter|probe/.test(id))return 'Gerilim, direnç veya uygun kademede akım ölçümü için kullanılan ölçü aracıdır.';
 if(/push-|button|wall-switch|selector/.test(id))return 'Kullanıcının devreye komut vermesini sağlar; kontak durumu elektrik yolunu açar veya kapatır.';
 if(/coil-contactor|coil-relay/.test(id))return 'Enerjilendiğinde kendisiyle aynı referanstaki kontakları mekanik olarak kumanda eden bobindir.';
 if(/main-contact|contactor/.test(id))return 'Motor gibi güç yüklerinin ana akım yolunu açıp kapatır.';
 if(/contact-/.test(id))return 'Bobin veya mekanik kumandaya bağlı yardımcı kontak olarak kumanda mantığını oluşturur.';
 if(/mcb|fuse|overload|protection|rcd/.test(id))return 'Aşırı akım, kısa devre veya ilgili arıza koşulunda koruma görevini öğretmek için kullanılır.';
 if(/motor/.test(id)&&!/protection/.test(id))return 'Elektrik enerjisini mekanik harekete çeviren yük/aktüatördür; motor dersinin gerçek sonucunu gösterir.';
 if(/vfd|sinamics/.test(id))return 'Motorun besleme frekansını/gerilimini kontrol ederek çalışma ve hız komutlarını uygular.';
 if(/hcfa-sv-x2ea/.test(id))return 'Servo motoru konum/hız/tork komutlarına göre süren servo sürücüdür.';
 if(/^plc-|plc-hw/.test(id))return 'Girişleri okuyup program mantığını çalıştıran ve çıkışları kumanda eden PLC donanımıdır.';
 if(/sensor|proximity|photoeye|thermocouple|load-cell|encoder/.test(id))return 'Fiziksel büyüklüğü veya konumu algılayıp elektriksel bilgiye dönüştüren algılama elemanıdır.';
 if(/ground|terminal-pe|bar-pe/.test(id))return 'Koruma topraklama yolunu ve PE bağlantısının görevini göstermek için kullanılır.';
 if(/lamp|light|luminaire/.test(id))return 'Bu dersin konusu aydınlatma veya sinyal ise elektrik enerjisinin görünür sonucunu gösterir.';
 if(/capacitor/.test(id))return 'Elektrik yükü depolar; simülasyonda i=C·dv/dt bağıntısına göre şarj/deşarj olur ve AC devrede kapasitif reaktans oluşturur.';
 if(/reactor|inductor|winding/.test(id))return 'Manyetik alanda enerji depolayan bobin/endüktanstır; simülasyonda v=L·di/dt bağıntısına göre akımın ani değişimine karşı koyar.';
 if(/bd139|bjt-npn/.test(id))return 'Gerçek NPN BJT’dir; beyz-emetör gerilimi yeterli olduğunda kolektör-emetör akım yolunu sürer.';
 if(/bd140|bjt-pnp/.test(id))return 'Gerçek PNP BJT’dir; emitöre göre beyz yeterince aşağı çekildiğinde kolektör-emetör akım yolunu sürer.';
 if(/diode/.test(id))return 'Akımı esas olarak tek yönde ileten yarı iletken elemandır.';
 if(/tutorial-|arduino-/.test(id))return 'Başlığın anlattığı gerçek eleman veya kavramı başka bir cihazla karıştırmadan doğrudan temsil eder.';
 return 'Bu eleman ders başlığındaki gerçek işlevi doğrudan göstermek için seçildi.';
}
function materialRows(p){return p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref,why:c.tutorialPurpose||purposeFor(c.typeId,c.label||c.ref)}))}
function setLesson(l,p,opt={}){
 const effectiveKind=(opt.kind==='wiring'||(p.wires&&p.wires.length))?'wiring':(opt.kind||'quiz');
 p.projectId='tutorial-session-source-'+l.id;p.name='Öğretici · '+l.title;p.tutorialLesson={id:l.id,topicId:l.topicId,phase:effectiveKind==='wiring'?'demo':'quiz',step:0,level:l.variant};
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind=effectiveKind;
 const hasWires=Array.isArray(p.wires)&&p.wires.length>0;if(hasWires)l.kind='wiring';else if(!l.kind)l.kind='quiz';
 l.steps=l.kind==='wiring'?p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı dersin gerçek devre yolunu tamamlar.',color:w.color,role:w.role,size:w.size})):[];
 l.summary=opt.summary||l.summary;
 l.explanation=opt.explanation||('Bu derste yalnız “'+l.title+'” için gerekli elemanlar kullanılır. Önce elemanları tanıyın, sonra bağlantı veya konu kontrolüne geçin.');
 l.concepts=opt.concepts||l.concepts;
 l.quiz=opt.quiz||lessonQuiz(l);
 l.learningGoal=opt.goal||('Ders sonunda '+l.title.toLocaleLowerCase('tr-TR')+' konusunun hangi elemanlarla ve hangi temel mantıkla kurulduğunu açıklayabilmek.');
 l.beginnerSteps=opt.beginnerSteps||[
  'Önce ekrandaki elemanların adlarını okuyun; bilmediğiniz bir elemanı başka bir cihazla karıştırmayın.',
  'Besleme, kumanda, yük/algılama ve dönüş yolunu ayrı ayrı bulun.',
  l.kind==='wiring'?'Bağlantıları terminal isimlerine bakarak sırayla kurun; her bağlantının nedenini okuyun.':'Şemadaki elemanların görevini karşılaştırın; bu ders bağlantı yerine kavramı doğru elemanlarla tanıtır.',
  'Sonunda “enerji nereden gelir, hangi eleman karar verir, sonuç hangi elemanda görülür?” sorularını kendi cümlenizle cevaplayın.'
 ];
 l.materials=materialRows(p);
 l.pedagogyReview={version:'v1.19.0-pedagogy10',reviewed:true,title:l.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true};
}
function lessonQuiz(l){
 const t=l.title.toLocaleLowerCase('tr-TR');
 const q=(question,correct,d1,d2,why)=>({question,options:[correct,d1,d2],answer:0,why});
 if(/ohm/.test(t))return q('Ohm Kanunu deneyinde değişimini özellikle incelediğimiz temel devre elemanı hangisidir?','Direnç','Lamba','Kontaktör','Ohm Kanunu gerilim, akım ve direnç arasındaki ilişkiyi inceler; bu derste yük olarak direnç kullanılır.');
 if(/seri bağlan/.test(t))return q('Seri bağlantıda elemanlardan geçen akım için hangisi doğrudur?','Aynı yol üzerindeki elemanlardan aynı akım geçer','Her elemanın akımı bağımsızdır','Akım yalnız son elemandan geçer','Seri devrede akımın izleyebileceği tek ana yol vardır.');
 if(/paralel/.test(t))return q('Paralel kollarda ortak olan büyüklük hangisidir?','Kol uçlarındaki gerilim','Her kolun direnci','Her kolun akımı','Paralel kollar aynı iki düğüme bağlıdır; uç gerilimleri aynıdır.');
 if(/voltmetre/.test(t))return q('Voltmetre ölçülecek elemana nasıl bağlanır?','Paralel','Seri','PE hattına tek uçla','Gerilim iki nokta arasındaki potansiyel farkıdır; voltmetre bu iki noktaya paralel bağlanır.');
 if(/ampermetre/.test(t))return q('Ampermetre ölçülen akım yoluna nasıl bağlanır?','Seri','Paralel','Nötre bağlanmadan','Ölçülen akımın tamamının ampermetreden geçmesi gerekir.');
 if(/toprak|pe |koruma iletken|eş potansiyel/.test(t))return q('PE koruma iletkeninin temel görevi nedir?','Arıza durumunda güvenli koruma yoluna yardımcı olmak','Motor hızını artırmak','Faz sırasını değiştirmek','PE normal çalışma akımını taşımak için değil, elektriksel güvenlik için kullanılır.');
 if(/plc/.test(t))return q('PLC dersinde elektriksel karar/lojik işlemi yapan temel cihaz hangisidir?','PLC CPU / I/O sistemi','Lamba','Direnç','PLC girişleri okur, program mantığını yürütür ve çıkışları kumanda eder.');
 if(/vfd|invertör|frekans/.test(t))return q('Motor hızını frekans değiştirerek kontrol eden cihaz hangisidir?','Frekans konvertörü / VFD','Kontaktör bobini','Sigorta','VFD motor besleme frekansını ve gerilimini kontrollü biçimde değiştirir.');
 if(/servo/.test(t))return q('Servo sisteminde motor hareketini kontrollü yapan ana ikili hangisidir?','Servo sürücü + servo motor','Sigorta + lamba','Direnç + zil','Servo sürücü komutu işler ve servo motorun kontrollü hareketini sağlar.');
 if(/motor|dahlander|yıldız|üçgen|fren/.test(t))return q('Motor dersinde yük olarak hangi eleman gösterilmelidir?','Konunun anlattığı motor tipi','Sinyal lambası','Zil','Motor kumanda dersinde devre sonucu gerçek motor ve ilgili güç/kumanda elemanları üzerinde gösterilir.');
 if(/and| or |nand|nor|xor|xnor|buffer|lojik/.test(' '+t+' '))return q('Bu derste incelenen eleman türü hangisidir?','Dijital lojik elemanı','Üç faz kontaktörü','Kontaktör bobini','Dersin başlığı dijital lojik işlevi anlatır; çalışma alanında da ilgili lojik eleman gösterilir.');
 if(/op-amp|yükselteç|karşılaştırıcı|toplayıcı|çıkarıcı|integral|türev/.test(t))return q('Bu derste sinyal işleme için merkezde hangi eleman bulunur?','İşlemsel yükselteç','Üç faz motor','Zil','Bu derslerde temel aktif eleman op-amp ve onu çevreleyen direnç/kondansatör ağıdır.');
 return q('Bu derste ekrandaki malzemeler neden özellikle seçildi?','Ders başlığındaki gerçek kavramı temsil ettikleri için','Kütüphanede rastgele bulundukları için','Her derste aynı devre kullanıldığı için','Öğretici artık konu dışı şablon kullanmaz; görünen elemanlar dersin konusu ile eşleştirilir.');
}

function dcUsageProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','supply-dc-plus',90,235,'G1','1 · DC kaynak · 24 V',{tutorialPurpose:'Devreye sabit 24 V doğru gerilim sağlar. Doğru akımın yönü + uçtan yüke, oradan 0 V dönüşüne doğrudur.'}),
  C('r','resistor',650,235,'R1','2 · Direnç yük · 100 Ω',{resistance:100,tutorialPurpose:'100 Ω direnç doğru akım için yük görevi görür. İdeal devre akımı I=V/R=24/100=0,24 A olur.'}),
  C('m','unit-ut33d-plus',430,455,'M1','3 · Multimetre · UNI-T UT33D+',{meterPosition:4,tutorialPurpose:'Başlangıçta DCV 200 V kademesindedir. Probları farklı noktalara değdirerek potansiyel farkını gözlemleyin; akım ölçümü için doğru DCA kademesi ve seri bağlantı gerekir.'}),
  C('m-red','test-probe-red',250,520,'PR1','4 · Kırmızı prob',{tutorialPurpose:'Serbest ölçüm probudur. Öğrenci prob gövdesini sürükleyerek terminale, junction noktasına veya kabloya değdirebilir.'}),
  C('m-black','test-probe-black',790,520,'PB1','5 · Siyah prob',{tutorialPurpose:'COM referansına bağlı serbest ölçüm probudur. Öğrenci ölçmek istediği ikinci noktaya sürükleyebilir.'})
 ];
 const feed=W('g','P','r','1','T1 · +24 V → R1/1','Kaynağın pozitif ucu dirençli yüke enerji verir.','#e53935','+24V');
 const ret=W('r','2','g','M','R1/2 → T4 · 0 V','Akım yükten geçtikten sonra 0 V dönüşüne ulaşır.','#111827','0V');
 const red=W('m','V','m-red','PLUG','Kırmızı prob kablosu → VΩmA','Kırmızı prob multimetrenin VΩmA girişine takılıdır; prob ucu serbesttir.','#e53935','MEASURE','6 mm²');
 const black=W('m','COM','m-black','PLUG','Siyah prob kablosu → COM','Siyah prob COM girişine takılıdır; prob ucu serbesttir.','#111827','MEASURE','6 mm²');
 p.wires.push(feed,ret,red,black);
 p.tutorialExplore={
  type:'dc-usage',
  nominalVoltage:24,
  resistance:100,
  expectedCurrentA:.24,
  freeProbes:true,
  measurementPoints:['G1/P · +24 V','R1/1 · yük girişi','R1/2 · yük çıkışı','G1/M · 0 V']
 };
 return p;
}

function dcBatterySeriesProject(id,title){
 const p=base(id,title);
 p.components=[
  C('b1','tutorial-battery',160,135,'BT1','1 · Pil 1 · 1,5 V',{cellVoltage:1.5,seriesPackId:'SERIES-A',seriesIndex:0,tutorialPurpose:'Birinci 1,5 V hücredir. Seri paketin dış pozitif ucu BT1/+ olur; BT1/− ucu ikinci pilin + ucuna bağlanır.'}),
  C('b2','tutorial-battery',410,135,'BT2','2 · Pil 2 · 1,5 V',{cellVoltage:1.5,seriesPackId:'SERIES-A',seriesIndex:1,tutorialPurpose:'İkinci 1,5 V hücredir. BT2/+ seri köprüye, BT2/− ise paketin dış negatif ucuna dönüşür.'}),
  C('r1','resistor',760,230,'R1','3 · Yük direnci · 100 Ω',{resistance:100,tutorialPurpose:'İki pilin toplam 3 V gerilimini gerçek bir yüke uygular. İdeal akım I=3/100=0,03 A=30 mA olur.'}),
  C('v1','unit-ut33d-plus',485,485,'M1','4 · UNI-T UT33D+ · DCV 20 V',{meterPosition:3,tutorialPurpose:'Her pili ayrı ayrı yaklaşık 1,5 V, seri paketi ise yaklaşık 3,0 V ölçmek için DCV 20 V kademesinde kullanılır.'}),
  C('v1-red','test-probe-red',265,520,'PR1','5 · Kırmızı prob',{probeTarget:{c:'b1',p:'+'},tutorialPurpose:'VΩmA girişine bağlı serbest probdur. Pil 1, Pil 2 veya paket pozitif ucuna taşınabilir.'}),
  C('v1-black','test-probe-black',825,520,'PB1','6 · Siyah prob',{probeTarget:{c:'b2',p:'−'},tutorialPurpose:'COM girişine bağlı serbest referans probudur. İkinci ölçüm noktasına sürüklenebilir.'})
 ];
 const bridge=W('b1','−','b2','+','BT1/− → BT2/+ · seri köprü','Seri bağlantının temel adımıdır: birinci pilin eksi ucu ikinci pilin artı ucuna bağlanır.','#64748b','SERIES');
 const feed=W('b1','+','r1','1','Paket + → R1/1','Seri paketin dış pozitif ucu yükün girişini besler.','#e53935','+3V');
 const ret=W('r1','2','b2','−','R1/2 → paket −','Yükten geçen akım paketin dış negatif ucuna döner ve kapalı devre oluşur.','#111827','0V');
 const pr=W('v1','V','v1-red','PLUG','Kırmızı prob kablosu → VΩmA','Gerilim ölçümü için kırmızı prob VΩmA girişindedir.','#e53935','MEASURE','6 mm²');pr.probeLead=true;pr.flexOffset=22;
 const pb=W('v1','COM','v1-black','PLUG','Siyah prob kablosu → COM','Siyah prob COM referans girişindedir.','#111827','MEASURE','6 mm²');pb.probeLead=true;pb.flexOffset=-18;
 p.wires.push(bridge,feed,ret,pr,pb);
 p.tutorialExplore={type:'battery-series',cellVoltage:1.5,cellCount:2,packVoltage:3,resistance:100,expectedCurrentA:.03,freeProbes:true,measurementPoints:['BT1/+ ↔ BT1/− · ≈1,5 V','BT2/+ ↔ BT2/− · ≈1,5 V','BT1/+ ↔ BT2/− · ≈3,0 V']};
 return p;
}
function dcBatteryParallelProject(id,title){
 const p=base(id,title);
 p.components=[
  C('b1','tutorial-battery',150,125,'BT1','1 · Pil 1 · 1,5 V',{cellVoltage:1.5,tutorialPurpose:'Birinci 1,5 V hücredir. Paralel bağlantıda artı ucu diğer pilin artı ucuyla; eksi ucu diğer pilin eksi ucuyla ortaklaştırılır.'}),
  C('b2','tutorial-battery',405,125,'BT2','2 · Pil 2 · 1,5 V',{cellVoltage:1.5,tutorialPurpose:'İkinci 1,5 V hücredir. Aynı gerilimli iki eş hücrenin paralel bağlanması paket gerilimini yükseltmez; ortak uçlarda yaklaşık 1,5 V kalır.'}),
  C('r1','resistor',760,235,'R1','3 · Yük direnci · 100 Ω',{resistance:100,tutorialPurpose:'Ortak paralel paket uçlarına bağlı 100 Ω yüktür. İdeal toplam yük akımı I=1,5/100=0,015 A=15 mA olur.'}),
  C('v1','unit-ut33d-plus',490,485,'M1','4 · UNI-T UT33D+ · DCV 20 V',{meterPosition:3,tutorialPurpose:'Pil 1, Pil 2 ve ortak paralel raylar arasında yaklaşık aynı 1,5 V değeri görmeyi doğrulamak için DCV 20 V kademesinde kullanılır.'}),
  C('v1-red','test-probe-red',245,525,'PR1','5 · Kırmızı prob',{probeTarget:{c:'b1',p:'+'},tutorialPurpose:'VΩmA girişine bağlı serbest probdur. Pil 1, Pil 2 veya ortak pozitif raya taşınabilir.'}),
  C('v1-black','test-probe-black',835,525,'PB1','6 · Siyah prob',{probeTarget:{c:'b1',p:'−'},tutorialPurpose:'COM girişine bağlı serbest referans probudur. Pil 1, Pil 2 veya ortak negatif raya taşınabilir.'})
 ];
 const pos=W('b1','+','b2','+','BT1/+ → BT2/+ · pozitif ortak ray','Paralel bağlantının ilk şartı aynı kutupları birleştirmektir: artı uçlar ortak pozitif ray olur.','#e53935','PARALLEL+');
 const neg=W('b1','−','b2','−','BT1/− → BT2/− · negatif ortak ray','İkinci şart eksi uçları birleştirmektir: iki hücrenin negatif uçları ortak dönüş rayını oluşturur.','#111827','PARALLEL-');
 const feed=W('b1','+','r1','1','Ortak + ray → R1/1','Yük paralel paketin ortak pozitif ucuna bağlanır.','#e53935','+1.5V');
 const ret=W('r1','2','b1','−','R1/2 → ortak − ray','Yük akımı ortak negatif raya dönerek kapalı devreyi tamamlar.','#111827','0V');
 const pr=W('v1','V','v1-red','PLUG','Kırmızı prob kablosu → VΩmA','Gerilim ölçümü için kırmızı prob VΩmA girişindedir.','#e53935','MEASURE','6 mm²');pr.probeLead=true;pr.flexOffset=22;
 const pb=W('v1','COM','v1-black','PLUG','Siyah prob kablosu → COM','Siyah prob COM girişindedir.','#111827','MEASURE','6 mm²');pb.probeLead=true;pb.flexOffset=-18;
 p.wires.push(pos,neg,feed,ret,pr,pb);
 p.tutorialExplore={type:'battery-parallel',cellVoltage:1.5,cellCount:2,packVoltage:1.5,resistance:100,expectedCurrentA:.015,idealEqualCellShareA:.0075,freeProbes:true,measurementPoints:['BT1/+ ↔ BT1/− · ≈1,5 V','BT2/+ ↔ BT2/− · ≈1,5 V','Ortak + ↔ ortak − · ≈1,5 V']};
 return p;
}

function dcBatteryTypesProject(id,title){
 const p=base(id,title);
 p.components=[
  C('ba','tutorial-battery-alkaline',70,150,'BA1','1 · Alkalin AA · 1,5 V',{cellVoltage:1.5,tutorialPurpose:'Birincil (şarj edilmek için tasarlanmamış) 1,5 V alkalin hücredir. Kumanda, saat, oyuncak ve benzeri düşük/orta güç tüketimli cihazlarda sık görülür.'}),
  C('bn','tutorial-battery-nimh',255,150,'BN1','2 · NiMH AA · 1,2 V',{cellVoltage:1.2,tutorialPurpose:'Şarj edilebilir 1,2 V NiMH hücredir. Tekrar kullanım ve nispeten yüksek akım gerektiren taşınabilir uygulamalarda kullanılır.'}),
  C('bl','tutorial-battery-liion',440,150,'BL1','3 · Li-ion 18650 · 3,7 V',{cellVoltage:3.7,tutorialPurpose:'Nominal 3,7 V şarj edilebilir lityum-iyon hücredir. Yüksek enerji yoğunluğu sağlar; gerçek uygulamalarda uygun koruma ve şarj elektroniği gerektirir.'}),
  C('bk','tutorial-battery-leadacid',660,195,'BK1','4 · Kurşun-asit akü · 12 V',{cellVoltage:12,tutorialPurpose:'Şarj edilebilir 12 V kurşun-asit aküdür. Araç, UPS ve yedek enerji sistemlerinde yüksek akım kapasitesiyle kullanılır.'}),
  C('r1','resistor',930,245,'R1','5 · Sanal test yükü · 1 kΩ',{resistance:1000,tutorialPurpose:'Sanal laboratuvarda seçilen kaynağın yük altındaki teorik akımını Ohm Kanunuyla karşılaştırmak için kullanılan 1 kΩ dirençtir.'}),
  C('m','unit-ut33d-plus',500,485,'M1','6 · UNI-T UT33D+ · DCV 20 V',{meterPosition:3,tutorialPurpose:'1,2 V, 1,5 V, 3,7 V ve 12 V kaynakları aynı DCV 20 V kademesinde karşılaştırmak için kullanılır.'}),
  C('m-red','test-probe-red',260,530,'PR1','7 · Kırmızı prob',{probeTarget:{c:'ba',p:'+'},tutorialPurpose:'VΩmA girişine bağlı ölçüm probudur. Dört kaynak arasında hazır ölçüm noktalarına taşınabilir veya serbest bırakılabilir.'}),
  C('m-black','test-probe-black',850,530,'PB1','8 · Siyah prob',{probeTarget:{c:'ba',p:'−'},tutorialPurpose:'COM referans probudur. Ölçülecek kaynağın negatif ucuna veya seçilen ikinci noktaya taşınır.'})
 ];
 const feed=W('ba','+','r1','1','Alkalin + → sanal yük','Başlangıç karşılaştırmasında 1,5 V alkalin hücre 1 kΩ sanal yüke bağlanır.','#e53935','TESTLOAD');feed.batteryTypeLoad=true;
 const ret=W('r1','2','ba','−','Sanal yük → alkalin −','Sanal test yükünün dönüş yolunu tamamlar.','#111827','TESTLOAD');ret.batteryTypeLoad=true;
 const pr=W('m','V','m-red','PLUG','Kırmızı prob → VΩmA','Gerilim ölçümü için kırmızı prob VΩmA girişindedir.','#e53935','MEASURE','6 mm²');pr.probeLead=true;pr.flexOffset=22;
 const pb=W('m','COM','m-black','PLUG','Siyah prob → COM','Siyah prob COM girişindedir.','#111827','MEASURE','6 mm²');pb.probeLead=true;pb.flexOffset=-18;
 p.wires.push(feed,ret,pr,pb);
 p.tutorialExplore={
  type:'battery-types',
  virtualOnly:true,
  loadResistance:1000,
  batteryTypes:[
   {id:'ba',name:'Alkalin AA',nominalV:1.5,rechargeable:false,expectedLoadCurrentA:.0015},
   {id:'bn',name:'NiMH AA',nominalV:1.2,rechargeable:true,expectedLoadCurrentA:.0012},
   {id:'bl',name:'Li-ion 18650',nominalV:3.7,rechargeable:true,expectedLoadCurrentA:.0037},
   {id:'bk',name:'Kurşun-asit akü',nominalV:12,rechargeable:true,expectedLoadCurrentA:.012}
  ],
  freeProbes:true
 };
 return p;
}

function dcOhm(id,title){
 const p=base(id,title);p.components=[
  C('g','arduino-bench-supply',110,235,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'0–30 VDC ayarlanabilir masa kaynağıdır. Deneyde 6 V, 12 V, 18 V ve 24 V değerlerini karşılaştırmak için kullanılır.'}),
  C('a','unit-ut33d-plus',420,245,'A1','UNI-T UT33D+ · DCA 10 A · 10A girişi',{meterPosition:9,tutorialPurpose:'120 Ω direnç ve 24 V ayarında yaklaşık 200 mA beklendiğinden DCA 10 A kademesinde ve 10A yuvasında seri akım ölçer.'}),
  C('r','resistor',760,245,'R1','R1 · 120 Ω',{resistance:120,tutorialPurpose:'Ohm Kanununda akımı sınırlayan ve deney sırasında 120 Ω / 240 Ω / 470 Ω seçenekleriyle karşılaştırılan yük direncidir.'}),
  C('v','unit-ut33d-plus',760,500,'V1','UNI-T UT33D+ · DCV 200 V · VΩmA',{meterPosition:4,tutorialPurpose:'R1 uçlarındaki DC gerilimi devreyi kesmeden paralel ölçer; 24 V için DCV 200 V kademesi güvenli aralıktadır.'})
 ];
 p.wires.push(
  W('g','P','a','10A','G1 + → A1 10A','Ampermetre akım yoluna seri girer; kırmızı ölçüm ucu 10A girişindedir.','#e53935','OHM+'),
  W('a','COM','r','1','A1 COM → R1/1','Seri akım yolu ampermetreden sonra R1 yüküne devam eder.','#e53935','OHM+'),
  W('r','2','g','M','R1/2 → G1 −','Akımın ayarlı güç kaynağına dönüş yolunu tamamlar.','#111827','OHM-'),
  W('v','V','r','1','V1 VΩmA → R1/1','Voltmetre direncin giriş ucuna paralel temas eder.','#43a047','MEASURE'),
  W('v','COM','r','2','V1 COM → R1/2','Voltmetre direncin diğer ucuna paralel temas eder.','#111827','MEASURE')
 );
 p.tutorialExplore={type:'ohm-law-rich',sourceId:'g',resistorId:'r',ammeterId:'a',voltmeterId:'v',voltageSteps:[6,12,18,24],resistanceSteps:[120,240,470],defaultVoltage:24,defaultResistance:120,expectedCurrentA:.2,freeProbes:true};
 return p
}
function dcSeriesAnalysisProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',85,275,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'0–30 VDC ayarlanabilir masa kaynağıdır. Bu derste 24 V olarak kullanılır ve seri devrenin enerjisini sağlar.'}),
  C('a','unit-ut33d-plus',315,275,'A1','UNI-T UT33D+ · DCA 200 mA · VΩmA',{meterPosition:10,tutorialPurpose:'Seri devrede aynı akımın bütün elemanlardan geçtiğini kanıtlamak için akım yoluna seri bağlanır. Beklenen akım yaklaşık 75 mA olduğundan DCA 200 mA kademesi uygundur.'}),
  C('r1','resistor',555,190,'R1','R1 · 100 Ω',{resistance:100,tutorialPurpose:'Seri yolun ilk dirençli yüküdür. 75 mA akımda üzerinde yaklaşık 7,5 V gerilim düşümü oluşur.'}),
  C('r2','resistor',800,190,'R2','R2 · 220 Ω',{resistance:220,tutorialPurpose:'R1 ile seri bağlı ikinci dirençtir. 75 mA akımda üzerinde yaklaşık 16,5 V gerilim düşümü oluşur.'}),
  C('v1','unit-ut33d-plus',635,505,'V1','UNI-T UT33D+ · DCV 20 V · R1',{meterPosition:3,tutorialPurpose:'R1 üzerindeki yaklaşık 7,5 V gerilim düşümünü ölçmek için R1 uçlarına paralel bağlanır. Akım yolunu kesmez.'})
 ];
 p.wires.push(
  W('g','P','a','V','G1 + → A1 VΩmA','A1 akımı ölçebilmek için devre yoluna seri girer; 75 mA için DCA 200 mA ve VΩmA girişi kullanılır.','#e53935','SERIES+'),
  W('a','COM','r1','1','A1 COM → R1/1','Ölçülen akım ampermetreden çıktıktan sonra R1 üzerinden devam eder.','#e53935','SERIES+'),
  W('r1','2','r2','1','R1/2 → R2/1','Seri devrede dallanma yoktur; R1’den çıkan akımın tamamı R2’ye girer.','#e53935','SERIES+'),
  W('r2','2','g','M','R2/2 → G1 −','Tek akım yolu kaynağın negatif ucuna dönerek kapanır.','#111827','SERIES-'),
  W('v1','V','r1','1','V1 VΩmA → R1/1','Gerilim iki nokta arasındaki fark olduğu için voltmetre R1’in giriş ucuna paralel temas eder.','#43a047','MEASURE'),
  W('v1','COM','r1','2','V1 COM → R1/2','Voltmetrenin ikinci ucu R1’in çıkışına bağlanır; böylece R1 gerilimi devreyi kesmeden ölçülür.','#111827','MEASURE')
 );
 p.tutorialExplore={
  type:'series-analysis-rich',
  sourceVoltage:24,
  resistorValues:[100,220],
  totalResistance:320,
  expectedCurrentA:.075,
  expectedVoltageR1:7.5,
  expectedVoltageR2:16.5,
  currentPath:'G1 + → A1 → R1 → R2 → G1 −',
  measurementRule:'A1 seri · V1 paralel'
 };
 return p;
}
function dcParallelAnalysisProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',90,280,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'0–30 VDC ayarlanabilir masa kaynağıdır. Bu derste 24 V uygulanır ve iki paralel kola aynı gerilimi sağlar.'}),
  C('a','unit-ut33d-plus',330,280,'A1','UNI-T UT33D+ · DCA 10 A · 10A girişi',{meterPosition:9,tutorialPurpose:'R1 ve R2 kolları ayrılmadan önce toplam akımı seri ölçer. Beklenen toplam akım yaklaşık 349 mA olduğundan 200 mA kademesi yetersizdir; DCA 10 A ve 10A girişi kullanılır.'}),
  C('r1','resistor',650,165,'R1','R1 · 100 Ω',{resistance:100,tutorialPurpose:'Birinci paralel koldur. Uçlarında yaklaşık 24 V bulunur ve ideal kol akımı I1=24/100=0,240 A olur.'}),
  C('r2','resistor',650,420,'R2','R2 · 220 Ω',{resistance:220,tutorialPurpose:'İkinci paralel koldur. Uçlarında yaklaşık 24 V bulunur ve ideal kol akımı I2=24/220≈0,109 A olur.'}),
  C('v1','unit-ut33d-plus',930,280,'V1','UNI-T UT33D+ · DCV 200 V',{meterPosition:4,tutorialPurpose:'Paralel kollardaki gerilimin kaynakla aynı olduğunu göstermek için seçilen kolun iki ucuna paralel bağlanır. 24 V, DCV 20 V aralığını aştığından DCV 200 V kullanılır.'})
 ];
 p.wires.push(
  W('g','P','a','10A','G1 + → A1 10A','Toplam akım, paralel dallara ayrılmadan önce A1 üzerinden geçer.','#e53935','PAR+'),
  W('a','COM','r1','1','A1 COM → R1/1','Ortak pozitif düğüm birinci paralel kolu besler.','#e53935','PAR+'),
  W('a','COM','r2','1','A1 COM → R2/1','Aynı ortak pozitif düğüm ikinci paralel kolu da besler.','#e53935','PAR+'),
  W('r1','2','g','M','R1/2 → G1 −','Birinci kol ortak negatif düğüme döner.','#111827','PAR-'),
  W('r2','2','g','M','R2/2 → G1 −','İkinci kol ortak negatif düğüme döner.','#111827','PAR-'),
  W('v1','V','r1','1','V1 VΩmA → R1/1','Gerilim ölçümü için V1, R1’in pozitif ucuna paralel temas eder.','#43a047','MEASURE'),
  W('v1','COM','r1','2','V1 COM → R1/2','V1’in COM ucu R1’in dönüş ucundadır; başlangıçta R1 gerilimini ölçer.','#111827','MEASURE')
 );
 p.tutorialExplore={
  type:'parallel-analysis-rich',
  sourceVoltage:24,
  resistorValues:[100,220],
  equivalentResistance:68.75,
  branchCurrentR1A:.24,
  branchCurrentR2A:24/220,
  expectedTotalCurrentA:(24/100)+(24/220),
  expectedBranchVoltage:24,
  currentRule:'Itoplam = I1 + I2',
  voltageRule:'VR1 = VR2 = Vkaynak'
 };
 return p;
}
function dcMixedAnalysisProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',85,300,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'Karışık devreyi 24 VDC ile besler. R1 seri bölümü ile R2||R3 paralel bölümünün toplam gerilim paylaşımını oluşturur.'}),
  C('a','unit-ut33d-plus',300,300,'A1','UNI-T UT33D+ · DCA 200 mA · VΩmA',{meterPosition:10,tutorialPurpose:'Kaynak ile R1 arasına seri bağlanır ve devrenin toplam akımını ölçer. Beklenen yaklaşık 103 mA, DCA 200 mA aralığındadır.'}),
  C('r1','resistor',540,300,'R1','R1 · 100 Ω · seri',{resistance:100,tutorialPurpose:'R2||R3 paralel grubuyla seri olan dirençtir. Toplam yaklaşık 103 mA akımı taşır ve üzerinde yaklaşık 10,34 V düşer.'}),
  C('r2','resistor',800,180,'R2','R2 · 220 Ω · paralel kol',{resistance:220,tutorialPurpose:'Paralel grubun birinci koludur. Yaklaşık 13,66 V altında yaklaşık 62,07 mA akım taşır.'}),
  C('r3','resistor',800,420,'R3','R3 · 330 Ω · paralel kol',{resistance:330,tutorialPurpose:'Paralel grubun ikinci koludur. Aynı yaklaşık 13,66 V altında yaklaşık 41,38 mA akım taşır.'}),
  C('v1','unit-ut33d-plus',1020,300,'V1','UNI-T UT33D+ · DCV 20 V · seçilebilir ölçüm',{meterPosition:3,tutorialPurpose:'R1 üzerindeki yaklaşık 10,34 V veya R2||R3 paralel grup üzerindeki yaklaşık 13,66 V gerilim düşümünü paralel ölçer.'})
 ];
 p.wires.push(
  W('g','P','a','V','G1 + → A1 VΩmA','Toplam akımı ölçebilmek için A1 devrenin seri yoluna girer.','#e53935','MIX+'),
  W('a','COM','r1','1','A1 COM → R1/1','Toplam akım önce R1 seri elemanından geçer.','#e53935','MIX+'),
  W('r1','2','r2','1','R1 sonrası düğüm → R2/1','R1’den sonra akım birinci paralel kola ayrılır.','#e53935','BRANCH'),
  W('r1','2','r3','1','R1 sonrası düğüm → R3/1','Aynı düğüm ikinci paralel kolu besler.','#e53935','BRANCH'),
  W('r2','2','g','M','R2/2 → G1 −','R2 kolu ortak negatif düğüme döner.','#111827','MIX-'),
  W('r3','2','g','M','R3/2 → G1 −','R3 kolu ortak negatif düğüme döner.','#111827','MIX-'),
  W('v1','V','r1','1','V1 VΩmA → R1/1','Başlangıçta V1 R1 gerilimini ölçer.','#43a047','MEASURE'),
  W('v1','COM','r1','2','V1 COM → R1/2','R1’in iki ucu arasındaki gerilim düşümü paralel ölçülür.','#111827','MEASURE')
 );
 p.tutorialExplore={
  type:'mixed-analysis-rich',
  sourceVoltage:24,
  seriesResistance:100,
  parallelResistors:[220,330],
  parallelEquivalent:132,
  totalEquivalent:232,
  expectedTotalCurrentA:24/232,
  expectedSeriesVoltage:2400/232,
  expectedParallelVoltage:24-(2400/232),
  expectedR2CurrentA:(24-(2400/232))/220,
  expectedR3CurrentA:(24-(2400/232))/330,
  structure:'R1 + (R2 || R3)'
 };
 return p;
}
function dcKirchhoffControlProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',85,300,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'Kirchhoff akım ve gerilim kurallarını doğrulamak için devreye 24 VDC sağlar.'}),
  C('a1','unit-ut33d-plus',305,300,'A1','UNI-T UT33D+ · DCA 200 mA · seçilebilir akım ölçümü',{meterPosition:10,tutorialPurpose:'Tek akım ölçeri toplam akım, R2 kol akımı veya R3 kol akımı konumuna taşıyarak KCL ilişkisinin üç terimini ayrı ayrı ölçer.'}),
  C('r1','resistor',535,300,'R1','R1 · 100 Ω · seri',{resistance:100,tutorialPurpose:'Toplam akımın tamamını taşıyan seri dirençtir; yaklaşık 10,34 V gerilim düşümü oluşturur.'}),
  C('r2','resistor',790,180,'R2','R2 · 220 Ω · kol 1',{resistance:220,tutorialPurpose:'Birinci paralel koldur; yaklaşık 13,66 V altında yaklaşık 62,07 mA akım taşır.'}),
  C('r3','resistor',790,420,'R3','R3 · 330 Ω · kol 2',{resistance:330,tutorialPurpose:'İkinci paralel koldur; aynı yaklaşık 13,66 V altında yaklaşık 41,38 mA akım taşır.'}),
  C('v1','unit-ut33d-plus',1030,300,'V1','UNI-T UT33D+ · DCV 200 V · seçilebilir gerilim ölçümü',{meterPosition:4,tutorialPurpose:'R1, paralel bölüm veya 24 V kaynak uçları arasında taşınır. Kaynak 20 V sınırını aştığı için DCV 200 V kademesi kullanılır.'})
 ];
 p.wires.push(
  W('g','P','a1','V','G1 + → A1 VΩmA','A1 başlangıçta toplam akımı ölçmek için kaynak çıkışına seri bağlanır.','#e53935','KCL+'),
  W('a1','COM','r1','1','A1 COM → R1/1','Toplam akım A1’den sonra R1 seri elemanından geçer.','#e53935','KCL+'),
  W('r1','2','r2','1','R1 sonrası düğüm → R2/1','Düğümde akım R2 koluna ayrılır.','#e53935','BRANCH'),
  W('r1','2','r3','1','R1 sonrası düğüm → R3/1','Aynı düğümde ikinci akım R3 koluna ayrılır.','#e53935','BRANCH'),
  W('r2','2','g','M','R2/2 → G1 −','R2 kolu ortak dönüş düğümüne bağlanır.','#111827','KCL-'),
  W('r3','2','g','M','R3/2 → G1 −','R3 kolu ortak dönüş düğümüne bağlanır.','#111827','KCL-'),
  W('v1','V','r1','1','V1 VΩmA → R1/1','Başlangıçta V1, R1 gerilim düşümünü ölçer.','#43a047','KVL'),
  W('v1','COM','r1','2','V1 COM → R1/2','R1 uçlarındaki gerilim paralel ölçülür.','#111827','KVL')
 );
 p.tutorialExplore={
  type:'kirchhoff-control-rich',
  sourceVoltage:24,
  seriesResistance:100,
  branchResistors:[220,330],
  parallelEquivalent:132,
  totalEquivalent:232,
  totalCurrentA:24/232,
  r2CurrentA:(24-(2400/232))/220,
  r3CurrentA:(24-(2400/232))/330,
  r1Voltage:2400/232,
  branchVoltage:24-(2400/232),
  kcl:'Itoplam = I2 + I3',
  kvl:'Vkaynak = VR1 + Vparalel'
 };
 return p;
}
function dcNetwork(id,title,mode){
 const p=base(id,title),parallel=mode==='parallel'||mode==='mixed'||mode==='kirchhoff';
 const currentRange=mode==='parallel'?9:10,redJack=currentRange===9?'10A':'V';
 p.components=[C('g','supply-dc-plus',70,280,'G1','24 VDC kaynak'),C('a','unit-ut33d-plus',280,280,'A1',currentRange===9?'UNI-T UT33D+ · DCA 10 A · 10A girişi':'UNI-T UT33D+ · DCA 200 mA · VΩmA',{meterPosition:currentRange,tutorialPurpose:'Akım ölçümü için devre yolu açılarak UNI-T seri bağlanır; seçilen DCA kademesi ve kırmızı prob yuvası ölçüm değerine uygundur.'}),C('r1','resistor',520,180,'R1','R1 · 100 Ω',{resistance:100}),C('r2','resistor',760,180,'R2','R2 · 220 Ω',{resistance:220})];
 if(mode==='mixed'||mode==='kirchhoff')p.components.push(C('r3','resistor',760,420,'R3','R3 · 330 Ω',{resistance:330}));
 const voltageRange=mode==='parallel'?4:3;
 if(mode==='mixed')p.components.push(C('v1','unit-ut33d-plus',520,500,'V1','UNI-T UT33D+ · DCV 20 V · R1',{meterPosition:voltageRange,tutorialPurpose:'R1 üzerindeki 10,34 V düşümü 20 V DC kademesinde, VΩmA/COM ile paralel ölçülür.'}),C('v2','unit-ut33d-plus',760,500,'V2','UNI-T UT33D+ · DCV 20 V · paralel kol',{meterPosition:voltageRange,tutorialPurpose:'Paralel kol üzerindeki 13,66 V düşümü 20 V DC kademesinde, VΩmA/COM ile paralel ölçülür.'}));
 else p.components.push(C('v1','unit-ut33d-plus',520,430,'V1',voltageRange===4?'UNI-T UT33D+ · DCV 200 V':'UNI-T UT33D+ · DCV 20 V',{meterPosition:voltageRange,tutorialPurpose:'R1 üzerindeki gerilim düşümü UNI-T DCV kademesinde VΩmA/COM uçlarıyla paralel ölçülür.'}));
 if(mode==='series')p.wires.push(W('g','P','a',redJack,'+24 V → UNI-T '+redJack,'DCA 200 mA kademesi: kırmızı prob VΩmA girişinde.'),W('a','COM','r1','1','UNI-T COM → R1/1','Akım ölçeri seri bağlamak için akım yolunu açın.'),W('r1','2','r2','1','R1 → R2','Seri devrede aynı akım R2’den de geçer.'),W('r2','2','g','M','R2 → 0 V','Seri yol tamamlanır.','#111827','0V'));
 else if(mode==='parallel')p.wires.push(W('g','P','a',redJack,'+24 V → UNI-T 10A','Paralel toplam akım 200 mA’yı aştığı için DCA 10 A/10A girişi kullanılır.'),W('a','COM','r1','1','UNI-T COM → düğüm','Akım ölçeri iki paralel kolun önüne seri yerleştirin.'),W('a','COM','r2','1','Toplam akım düğümü → R2','İkinci paralel kola aynı akım ölçüm düğümü bağlanır.'),W('r1','2','g','M','R1 → 0 V','Birinci kol dönüşü.','#111827','0V'),W('r2','2','g','M','R2 → 0 V','İkinci kol dönüşü.','#111827','0V'));
 else p.wires.push(W('g','P','a',redJack,'+24 V → UNI-T VΩmA','DCA 200 mA kademesinde kırmızı prob VΩmA girişinde.'),W('a','COM','r1','1','UNI-T COM → R1/1','UNI-T toplam akım ölçümü için seri bağlanır.'),W('r1','2','r2','1','R1 sonrası düğüm → R2','Akım R2 koluna ayrılır.'),W('r1','2','r3','1','R1 sonrası düğüm → R3','Akım R3 koluna ayrılır.'),W('r2','2','g','M','R2 → 0 V','Bir kolun dönüşüdür.','#111827','0V'),W('r3','2','g','M','R3 → 0 V','Diğer kolun dönüşüdür.','#111827','0V'));
 if(mode==='mixed')p.wires.push(W('v1','V','r1','1','VΩmA → R1/1 ölçüm noktası','20 V DC kademesinde voltmetre R1’e paraleldir.','#43a047','SIGNAL'),W('v1','COM','r1','2','COM → R1/2 ölçüm noktası','Siyah prob ölçüm noktasının diğer ucundadır.','#111827','0V'),W('v2','V','r2','1','VΩmA → paralel kol ölçüm noktası','20 V DC kademesinde paralel kol gerilimini ölçer.','#43a047','SIGNAL'),W('v2','COM','r2','2','COM → kol dönüşü','R2 ve R3 uçlarındaki gerilim aynıdır.','#111827','0V'));
 else p.wires.push(W('v1','V','r1','1','VΩmA → R1/1 ölçüm noktası','UNI-T DCV girişini yük üzerine paralel bağlayın.','#43a047','SIGNAL'),W('v1','COM','r1','2','COM → R1/2 ölçüm noktası','Siyah prob yükün diğer ucundadır.','#111827','0V'));
 return p
}
function measurementProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/voltmetre/.test(t)){const p=base(id,title);p.components=[C('g','supply-dc-plus',90,240,'G1','24 VDC kaynak'),C('r','resistor',480,240,'R1','2.7 kΩ direnç',{resistance:2700}),C('v','unit-ut33d-plus',480,400,'V1','UNI-T UT33D+ · DCV 200 V',{meterPosition:4,tutorialPurpose:'24 VDC kaynak ölçümü 20 V kademesini aşacağı için DCV 200 V seçilir; kırmızı VΩmA, siyah COM.'})];p.wires.push(W('g','P','r','1','+24 V → R1/1','Direnç yük yolunu oluşturur.'),W('r','2','g','M','R1/2 → 0 V','Yük devresi tamamlanır.','#111827','0V'),W('v','V','r','1','VΩmA → R1/1 ölçüm noktası','20 V sınırını aşan 24 V ölçümü için DCV 200 V kademesini seçin.','#43a047','SIGNAL'),W('v','COM','r','2','COM → R1/2 ölçüm noktası','Siyah prob yükün diğer ucunda; gerilim ölçümü paraleldir.','#111827','0V'));return {p,kind:'wiring',explanation:'UNI-T UT33D+ ölçü aletini DCV 200 V kademesine getirin. Kırmızı probu VΩmA, siyah probu COM girişine takıp R1’in iki ucuna paralel bağlayın; 20 V kademesi 24 V kaynak için küçük kalır.'}}
 if(/ampermetre/.test(t)&&!/pens/.test(t)){const p=base(id,title);p.components=[C('g','supply-dc-plus',90,240,'G1','24 VDC kaynak'),C('a','unit-ut33d-plus',360,240,'A1','UNI-T UT33D+ · DCA 10 A · 10A girişi',{meterPosition:9,tutorialPurpose:'120 Ω dirençte yaklaşık 200 mA beklendiği için mA kademesinin sınırına dayanmamak üzere 10 A DC kademesi ve 10A girişi kullanılır.'}),C('r','resistor',650,240,'R1','120 Ω direnç',{resistance:120})];p.wires.push(W('g','P','a','10A','+24 V → UNI-T 10A','Kırmızı prob 10A girişinde ve seçici DCA 10 A konumunda.'),W('a','COM','r','1','UNI-T COM → R1/1','Akım ölçümü için seri devre yolunu açıp ölçü aletini araya bağlayın.'),W('r','2','g','M','R1/2 → 0 V','Akım yolu tamamlanır.','#111827','0V'));return {p,kind:'wiring',explanation:'UNI-T UT33D+ ölçü aletini DCA 10 A kademesine alın; kırmızı probu 10A, siyah probu COM girişine takın. Beklenen akım 24 V / 120 Ω ≈ 200 mA olduğundan 200 mA sınırına dayanmamak için 10 A aralığını seçin. Devreyi açıp ölçü aletini yüke seri bağlayın.'}}
 if(/multimetre.*direnç/.test(t))return {p:board(id,title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],['resistor','Beslemesiz ölçülecek direnç'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]),kind:'quiz',explanation:'Direnç ölçümü enerjisiz yapılır. Multimetre probları direncin iki ucuna bağlanır; harici besleme uygulanmaz.'};
 if(/pens/.test(t))return {p:board(id,title,[['tutorial-clamp-meter','Pens ampermetre'],['supply-dc-plus','DC kaynak'],['resistor','Akım geçen dirençli yük']]),kind:'quiz'};
 if(/^frekansmetre ile frekans ölçümü$/.test(t))return {p:frequencyMeasurementRichProject(id,title),kind:'explore',explanation:'Düşük gerilimli sanal sinyal jeneratörünün OUT/GND uçları, frekans ölçebilen gerçek UNI-T UT61E+ modelinin VΩHz/COM problarıyla ölçülür. 50 Hz, 1 kHz ve 10 kHz değerleri doğrudan multimetre ekranında okunur; T=1/f ile sırasıyla 20 ms, 1 ms ve 0,1 ms periyotları karşılaştırılır. UT33D+ modeline gerçekte bulunmayan sahte Hz kademesi eklenmez.'};
 if(/frekans/.test(t))return {p:board(id,title,[['arduino-signal-generator','Sinyal jeneratörü'],['tutorial-frequency-meter','Frekansmetre']],'arduino'),kind:'quiz'};
 if(/watt/.test(t))return {p:board(id,title,[['supply-1p','1 faz kaynak'],['tutorial-wattmeter','Wattmetre'],['resistor','Dirençli yük']]),kind:'quiz'};
 if(/kosin/.test(t))return {p:board(id,title,[['supply-1p','1 faz kaynak'],['tutorial-cosphimeter','Kosinüsfimetre'],['motor-1p','1 faz motor yükü']]),kind:'quiz'};
 if(/sayaç|enerji/.test(t))return {p:board(id,title,[['supply-1p','1 faz kaynak'],['meter-kwh-1p','Aktif enerji sayacı'],['resistor','Dirençli yük']]),kind:'quiz'};
 if(/devir|takometre/.test(t))return {p:board(id,title,[['motor-3p','Üç faz motor'],['encoder-incremental','Artımlı enkoder'],['tutorial-tachometer','Takometre']]),kind:'quiz'};
 return {p:board(id,title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob'],['resistor','Örnek ölçüm elemanı']]),kind:'quiz'}
}
function dcMultimeterPractice(id,title,mode){
 const p=base(id,title),current=mode==='current',pos=current?11:4;
 p.components=[C('g','supply-dc-plus',80,220,'G1','24 VDC kaynak'),C('r','resistor',430,220,'R1','2.7 kΩ direnç',{resistance:2700}),C('m','unit-ut33d-plus',700,220,'P1',current?'UNI-T UT33D+ · DCA 20 mA · VΩmA':'UNI-T UT33D+ · DCV 200 V · VΩmA',{meterPosition:pos,tutorialPurpose:current?'24 V / 2.7 kΩ ≈ 8.9 mA; 20 mA DC kademesi uygun, kırmızı VΩmA ve siyah COM girişinde, seri.':'24 V ölçümü için DCV 200 V kademesi; kırmızı VΩmA ve siyah COM girişinde, yüke paralel.'})];
 if(current)p.wires.push(W('g','P','m','V','+24 V → UNI-T VΩmA','Önce yük akımını hesaplayın: 24 V / 2,7 kΩ ≈ 8,9 mA; DCA 20 mA ve VΩmA girişi uygundur.'),W('m','COM','r','1','UNI-T COM → R1/1','Akımı ölçmek için devre yolunu açıp multimetreyi seri bağlayın.'),W('r','2','g','M','R1/2 → 0 V','Ölçüm yolu kaynağa döner.','#111827','0V'));
 else p.wires.push(W('g','P','r','1','+24 V → R1/1','Dirençli ölçüm yükü kaynağa bağlanır.'),W('r','2','g','M','R1/2 → 0 V','Devre dönüşü tamamlanır.','#111827','0V'),W('m','V','r','1','UNI-T VΩmA → + ölçüm noktası','24 V için DCV 200 V kademesini kullanın; DCV 20 V yetersiz kalır.','#43a047','SIGNAL'),W('m','COM','r','2','UNI-T COM → − ölçüm noktası','Siyah prob ikinci noktaya bağlanır; gerilim ölçümü paraleldir.','#111827','0V'));
 return {p,kind:'wiring',explanation:current?'R1 · 2.7 kΩ dirençten geçen akımı ölçmek için UNI-T UT33D+ seçicisini DCA 20 mA konumuna alın; kırmızı prob VΩmA, siyah prob COM girişinde kalır. 24 V / 2,7 kΩ ≈ 8,9 mA beklenir. Akım ölçerken devreyi açıp ölçü aletini seri bağlayın.':'R1 · 2.7 kΩ direnç uçlarından UNI-T UT33D+ seçicisini DCV 200 V konumuna alın; kırmızı prob VΩmA, siyah prob COM girişindedir. Probları ölçüm noktalarına paralel bağlayın. 24 V ölçümü için DCV 20 V kademesi aşırı aralıkta kalır.'};
}
function topicBoard(id,title,rows,mode='control'){return {p:board(id,title,rows,mode),kind:'quiz'}}
function dcProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/^doğru akım ve kullanım alanları$/.test(t))return {p:dcUsageProject(id,title),kind:'explore',explanation:'Serbest prob deneyi ile doğru akımın yönünü, gerilim farkını ve Ohm Kanunu ilişkisini gözlemleyin.'};
 if(/^karışık devre analizi$/.test(t))return {p:dcMixedAnalysisProject(id,title),kind:'wiring',explanation:'R1=100 Ω seri, R2=220 Ω ve R3=330 Ω paralel olacak şekilde R1+(R2||R3) karışık devresi kurulur. R2||R3=132 Ω, Rtoplam=232 Ω ve Itoplam≈103,45 mA beklenir. R1 üzerinde yaklaşık 10,34 V, paralel grup üzerinde yaklaşık 13,66 V düşer; I2≈62,07 mA ve I3≈41,38 mA olup I2+I3≈Itoplamdır.'};
 if(/seri.*paralel.*karışık|seri-paralel devrelerde/.test(t))return {p:dcMixedAnalysisProject(id,title),kind:'wiring',explanation:'R1 seri ve R2||R3 paralel bölümlerini tek devrede çözün; önce paralel eşdeğeri, sonra toplam direnci ve akım/gerilim paylaşımını hesaplayın.'};
 if(/^kirchhoff kanunlarıyla devre kontrolü$/.test(t))return {p:dcKirchhoffControlProject(id,title),kind:'wiring',explanation:'Kirchhoff akım kuralı için Itoplam≈103,45 mA, I2≈62,07 mA ve I3≈41,38 mA ölçülür; Itoplam≈I2+I3 kontrol edilir. Kirchhoff gerilim kuralı için Vkaynak=24 V, VR1≈10,34 V ve Vparalel≈13,66 V ölçülür; 24≈10,34+13,66 kontrol edilir.'};
 if(/kirchhoff|kirchoff|kirşof/.test(t)){
  const p=base(id,title);p.components=[
   C('g','supply-dc-plus',55,300,'G1','24 VDC kaynak'),C('at','unit-ut33d-plus',230,300,'A0','UNI-T UT33D+ · DCA 200 mA · A0',{meterPosition:10,tutorialPurpose:'Toplam akım yaklaşık 103 mA; DCA 200 mA kademesinde kırmızı prob VΩmA girişinde ve ölçü aleti seri.'}),
   C('r1','resistor',420,300,'R1','R1 · 100 Ω',{resistance:100}),C('a2','unit-ut33d-plus',620,120,'A2','UNI-T UT33D+ · DCA 200 mA · A2',{meterPosition:10,tutorialPurpose:'Birinci kol yaklaşık 62 mA; 200 mA DC kademesinde VΩmA/COM, seri.'}),
   C('r2','resistor',820,170,'R2','R2 · 220 Ω',{resistance:220}),C('a3','unit-ut33d-plus',620,430,'A3','UNI-T UT33D+ · DCA 200 mA · A3',{meterPosition:10,tutorialPurpose:'İkinci kol yaklaşık 41 mA; 200 mA DC kademesinde VΩmA/COM, seri.'}),
   C('r3','resistor',820,470,'R3','R3 · 330 Ω',{resistance:330}),C('v0','unit-ut33d-plus',420,500,'V0','UNI-T UT33D+ · DCV 2 V · A0 yükü',{meterPosition:2,tutorialPurpose:'A0 akım kademesinin yaklaşık 0,10 V ölçüm yükü; 2 V DC kademesinde A0 üzerine paralel.'}),C('v1','unit-ut33d-plus',420,570,'V1','UNI-T UT33D+ · DCV 20 V · R1',{meterPosition:3,tutorialPurpose:'R1 üzerindeki yaklaşık 10,28 V için 20 V DC kademesi; VΩmA/COM ile paralel.'}),
   C('v2','unit-ut33d-plus',820,540,'V2','UNI-T UT33D+ · DCV 20 V · paralel kol',{meterPosition:3,tutorialPurpose:'Paralel kol üzerindeki yaklaşık 13,62 V için 20 V DC kademesi; VΩmA/COM ile paralel.'})
  ];
  p.wires.push(
   W('g','P','at','V','+24 V → UNI-T A0 VΩmA','DCA 200 mA kademesinde kırmızı prob VΩmA girişinde.'),W('at','COM','r1','1','A0 COM → R1/1','A0 devrenin toplam akım yoluna seri girer.'),
   W('r1','2','a2','V','R1/2 → A2 VΩmA','R1 sonundaki düğüm akımı iki kola ayırır; A2 seri eklenir.'),W('r1','2','a3','V','R1/2 → A3 VΩmA','İkinci kol aynı düğümden beslenir; A3 seri eklenir.'),
   W('a2','COM','r2','1','A2 COM → R2/1','A2 yalnız birinci kol akımını ölçer.'),W('r2','2','g','M','R2/2 → 0 V','Birinci kol kaynağa döner.','#111827','0V'),
   W('a3','COM','r3','1','A3 COM → R3/1','A3 yalnız ikinci kol akımını ölçer.'),W('r3','2','g','M','R3/2 → 0 V','İkinci kol kaynağa döner.','#111827','0V'),
   W('v0','V','at','V','V0 VΩmA → A0/V','A0 akım ölçerin seri iç direncinde oluşan gerilim düşümünü 2 V DC kademesinde ölçer.','#43a047','SIGNAL'),W('v0','COM','at','COM','V0 COM → A0/COM','V0, ampermetrenin V ve COM giriş uçlarına paralel bağlanır.','#111827','0V'),
   W('v1','V','r1','1','V1 VΩmA → R1/1 ölçüm noktası','V1, R1 gerilimini 20 V DC kademesinde paralel ölçer.','#43a047','SIGNAL'),W('v1','COM','r1','2','V1 COM → R1/2 ölçüm noktası','Siyah prob R1’in diğer ucundadır.','#111827','0V'),
  W('v2','V','r1','2','V2 VΩmA → paralel kol başlangıcı','V2 paralel kol gerilimini, kol ayrım düğümünden ölçer.','#43a047','SIGNAL'),W('v2','COM','g','M','V2 COM → 0 V dönüşü','Siyah prob paralel kolun ortak dönüşündedir.','#111827','0V')
  );
  return {p,kind:'wiring',explanation:'Bu devrede 24 VDC kaynak ile Kirchhoff akım kuralı A0 = A2 + A3 üzerinden incelenir. Gerilim çevresinde kaynak gerilimi; A0 akım ölçerin küçük seri yükü, R1 ve paralel kol üzerindeki gerilim düşümlerinin toplamıdır. UNI-T UT33D+ · DCA 200 mA · A0, A2 ve A3 kademelerinde akım; UNI-T UT33D+ · DCV 2 V · A0 yükü, UNI-T UT33D+ · DCV 20 V · R1 ve UNI-T UT33D+ · DCV 20 V · paralel kol kademelerinde gerilim ölçülür. 100 Ω, 220 Ω ve 330 Ω için yaklaşık A0=103 mA, A2=62 mA, A3=41 mA; V0≈0,10 V, V1≈10,28 V ve V2≈13,62 V beklenir. Küçük farklar ölçü aletinin seri yükünden ve yuvarlamadan kaynaklanır.'};
 }
 if(/ohm/.test(t))return {p:dcOhm(id,title),kind:'wiring',explanation:'24 VDC kaynak R1 direncinden akım geçirir. Ampermetre akım yoluna seri, voltmetre ise yalnız R1’in iki ucuna paralel bağlanır. Böylece lamba gibi doğrusal olmayan bir yük yerine doğrudan direnç üzerinden U, I ve R ilişkisi görülür.'};
 if(/seri devre/.test(t))return {p:dcSeriesAnalysisProject(id,title),kind:'wiring',explanation:'24 V ayarlanabilir DC kaynak, A1 seri ampermetre, R1=100 Ω ve R2=220 Ω seri dirençleri ile V1 paralel voltmetre kullanılır. Toplam direnç 320 Ω, ideal akım 75 mA, R1 gerilimi 7,5 V ve R2 gerilimi 16,5 V beklenir. Amaç aynı akımın tüm seri elemanlardan geçtiğini ve kaynak geriliminin dirençler arasında paylaşıldığını ölçerek doğrulamaktır.'};
 if(/paralel devre/.test(t))return {p:dcParallelAnalysisProject(id,title),kind:'wiring',explanation:'Ayarlanabilir 24 VDC kaynak, A1 toplam akım ölçümü, R1=100 Ω ve R2=220 Ω paralel kolları ile V1 paralel gerilim ölçümü kullanılır. Her iki kolun gerilimi yaklaşık 24 V’tur. I1=240 mA, I2≈109 mA, Itoplam≈349 mA ve Req≈68,75 Ω beklenir.'};
 if(/karışık/.test(t))return {p:dcMixedAnalysisProject(id,title),kind:'wiring',explanation:'Karışık devrede önce paralel grubu eşdeğere indir, sonra seri toplamı çöz ve tekrar kol akımlarına dön.'};
 if(/kirchhoff/.test(t))return {p:dcNetwork(id,title,'kirchhoff'),kind:'wiring'};
 if(/pillerin seri-paralel/.test(t))return topicBoard(id,title,[['tutorial-battery','Pil 1'],['tutorial-battery','Pil 2'],['tutorial-battery','Pil 3'],['tutorial-battery','Pil 4'],['resistor','Örnek dirençli yük']]);
 if(/pillerin seri/.test(t))return topicBoard(id,title,[['tutorial-battery','Pil 1'],['tutorial-battery','Pil 2'],['resistor','Örnek dirençli yük']]);
 if(/pillerin paralel/.test(t))return topicBoard(id,title,[['tutorial-battery','Pil 1'],['tutorial-battery','Pil 2'],['resistor','Örnek dirençli yük']]);
 return topicBoard(id,title,[['supply-dc-plus','24 VDC kaynak'],['tutorial-battery','Pil / DC hücre'],['resistor','Dirençli yük'],['meter-voltmeter','Voltmetre']])
}
function groundingProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/eş potansiyel/.test(t))return topicBoard(id,title,[['bar-pe','PE / eş potansiyel bara'],['terminal-pe','PE klemensi'],['ground','Koruma toprağı']]);
 if(/motor gövde/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['motor-3p','Üç faz motor'],['terminal-pe','PE klemensi'],['ground','Koruma toprağı']]);
 if(/prizde/.test(t))return topicBoard(id,title,[['socket-power','Topraklı priz'],['terminal-pe','PE klemensi'],['ground','Koruma toprağı']]);
 if(/topraklama direnci/.test(t))return topicBoard(id,title,[['tutorial-earth-tester','Topraklama direnci ölçer'],['ground','Topraklama noktası']]);
 if(/yalıtkanlık/.test(t))return topicBoard(id,title,[['tutorial-insulation-tester','Yalıtkanlık direnci ölçer'],['terminal-2','Test edilecek iletken/klemens'],['ground','Referans / gövde']]);
 if(/paratoner/.test(t))return topicBoard(id,title,[['tutorial-lightning-protection','Paratoner ve iniş iletkeni'],['ground','Topraklama noktası']]);
 if(/kaçak akım/.test(t))return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['rcd-2p','Kaçak akım koruma düzeni'],['socket-power','Topraklı priz'],['ground','Koruma toprağı']]);
 if(/dağıtım panosu/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['mcb-3p','3 kutuplu otomatik sigorta'],['bar-pe','PE barası'],['ground','Koruma toprağı']]);
 return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['terminal-pe','PE klemensi'],['bar-pe','PE barası'],['ground','Koruma toprağı']])
}
function installationProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/telefon/.test(t))return topicBoard(id,title,[['phone-floor-box','Kat telefon terminal kutusu'],['phone-apartment-box','Daire telefon terminal kutusu']],'building');
 if(/anten|tv tesisat|receiver|koaksiyel|f konnektör|headend|multiswitch/.test(t))return topicBoard(id,title,[['antenna-distributor','Anten dağıtım kutusu']],'building');
 if(/busbar|bara hattı/.test(t))return topicBoard(id,title,[['one-line-bus-tap','Bara çıkış/tap noktası'],['mcb-3p','Çıkış koruması']],'building');
 if(/akıllı ev|knx|güneşlik|fan-coil|vrf|vrv/.test(t))return topicBoard(id,title,[['knx-logic','KNX lojik modül'],['knx-actuator','KNX anahtarlama aktüatörü'],['blind-motor','Panjur / aktüatör yükü']],'building');
 if(/priz|linye|sorti/.test(t))return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['mcb-1p','Linye sigortası'],['socket-power','Topraklı priz']],'building');
 if(/buat|boru|kanal|iletken çek|kablo çek/.test(t))return topicBoard(id,title,[['terminal-2-array-4','Buat / bağlantı klemensleri'],['cable-marker','İletken işaretleme']],'building');
 if(/vaviyen/.test(t))return {p:clone(L.byId['two-way-1'].project),kind:'wiring'};
 if(/komütatör/.test(t))return {p:clone(L.byId['commutator-1'].project),kind:'wiring'};
 if(/zil/.test(t))return {p:clone(L.byId['bells-1'].project),kind:'wiring'};
 if(/aydınlatma|armatür|fotosel/.test(t))return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['mcb-1p','Aydınlatma linye sigortası'],['wall-switch','Aydınlatma anahtarı'],['ceiling-light','Aydınlatma armatürü'],...(/fotosel/.test(t)?[['photoeye','Fotosel sensör']]:[])],'building');
 if(/üç fazlı fiş|üç fazlı priz|kuvvet/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['mcb-3p','3 kutuplu koruma'],['motor-3p','Örnek üç fazlı alıcı']],'building');
 if(/pano/.test(t))return topicBoard(id,title,[['mcb-3p','Ana koruma'],['terminal-2-array-4','Pano klemens grubu'],['bar-pe','PE barası']],'building');
 return topicBoard(id,title,[['terminal-2-array-4','Tesisat bağlantı klemensleri'],['cable-marker','İletken/kablo işaretleme']],'building')
}
function electronicProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/röle uç/.test(t))return topicBoard(id,title,[['coil-relay','Röle bobini A1/A2'],['contact-both','Röle değiştirici kontağı']]);
 if(/röle ile mühürleme/.test(t))return {p:clone(L.byId['seal-in-1'].project),kind:'wiring'};
 if(/röle ile motor yön/.test(t))return topicBoard(id,title,[['supply-dc-plus','DC kaynak'],['coil-relay','Röle bobini'],['contact-both','Değiştirici kontak'],['motor-dc','DC motor']]);
 if(/jfet|\bfet\b/.test(t)&&!/mosfet/.test(t))return topicBoard(id,title,[['tutorial-fet','JFET / FET'],['resistor','Bias / yük direnci']]);
 if(/mosfet/.test(t))return topicBoard(id,title,[['tutorial-mosfet','MOSFET'],['potentiometer','Gate / ayar potansiyometresi'],['motor-dc','DC motor yükü']]);
 if(/igbt/.test(t))return topicBoard(id,title,[['tutorial-igbt','IGBT'],['supply-1p','AC kaynak'],['standard-light','Dimmer yükü']]);
 if(/tristör|tristör/.test(t))return topicBoard(id,title,[['tutorial-scr','Tristör / SCR'],[/ac’de/.test(t)?'supply-1p':'supply-dc-plus',/ac’de/.test(t)?'AC kaynak':'DC kaynak'],['resistor','Kontrollü yük']]);
 if(/diyak/.test(t))return topicBoard(id,title,[['tutorial-diac','Diyak'],['tutorial-triac','Triyakla birlikte tetikleme örneği']]);
 if(/triyak/.test(t))return topicBoard(id,title,[['tutorial-triac','Triyak'],['supply-1p','AC kaynak'],['standard-light','AC yük']]);
 if(/opto/.test(t))return topicBoard(id,title,[['arduino-tlp521-1','TLP521-1 optokuplör'],['tutorial-triac','Triyak'],['standard-light','Yük']],'arduino');
 if(/zaman gecikmeli/.test(t))return {p:rcTransientProject(id,title),kind:'wiring'};
 if(/schmitt/.test(t))return {p:opampCircuitProject(id,title),kind:'wiring'};
 if(/potansiyometre/.test(t))return topicBoard(id,title,[['arduino-bd139','BD139 NPN transistör'],['arduino-pot','10 kΩ potansiyometre'],['arduino-resistor-1k','Beyz direnci']],'arduino');
 if(/transistör/.test(t))return {p:bjtSwitchProject(id,title,/pnp/.test(t)?'PNP':'NPN'),kind:'wiring'};
 if(/röle|manyetik röle/.test(t))return topicBoard(id,title,[['coil-relay','Röle bobini'],['contact-both','Röle değiştirici kontağı'],['arduino-diode-1n4007','Bobin koruma diyodu']]);
 return topicBoard(id,title,[['arduino-bd139','NPN transistör'],['resistor','Bias / yük direnci']],'arduino')
}
function resistiveSensorComparatorProject(id,title,sensorId,label){
 const p=base(id,title);p.components=[
  C('g1','supply-dc-plus',70,250,'G1','24 VDC kaynak'),
  C('s1',sensorId,300,220,'B1',label),
  C('r1','resistor',300,390,'R1','10 kΩ bölücü direnci',{resistance:10000}),
  C('u1','lm358p-opamp-a',620,280,'U1A','LM358P karşılaştırıcı'),
  C('r2','resistor',470,120,'R2','10 kΩ referans üst',{resistance:10000}),
  C('r3','resistor',470,190,'R3','10 kΩ referans alt',{resistance:10000}),
  C('v1','meter-voltmeter',880,300,'V1','Karşılaştırıcı çıkışı')
 ];
 p.wires.push(
  W('g1','P','s1','1','+24 V → sensör','Sensör direnç bölücünün üst koludur.','#8b5a2b','+24V'),
  W('s1','2','r1','1','Sensör → R1','Sensör direnci değişince orta nokta gerilimi değişir.','#43a047','SIGNAL'),
  W('r1','2','g1','M','R1 → 0 V','Bölücüyü tamamlar.','#111827','0V'),
  W('s1','2','u1','IN+','Sensör düğümü → IN+','Ölçülen sensör gerilimi karşılaştırıcıya uygulanır.','#43a047','SIGNAL'),
  W('g1','P','r2','1','+24 V → R2','Referans bölücünün üst koludur.','#8b5a2b','+24V'),
  W('r2','2','r3','1','R2 → R3','Yaklaşık 12 V karşılaştırma eşiği oluşturur.','#43a047','SIGNAL'),
  W('r3','2','g1','M','R3 → 0 V','Referans bölücüyü tamamlar.','#111827','0V'),
  W('r2','2','u1','IN-','Vref → IN−','Sensör gerilimi bu eşikle karşılaştırılır.','#43a047','SIGNAL'),
  W('g1','P','u1','V+','+24 V → LM358 V+','Op-amp beslemesidir.','#8b5a2b','+24V'),
  W('g1','M','u1','V-','0 V → LM358 V−','Op-amp referansıdır.','#111827','0V'),
  W('v1','1','u1','OUT','V1+ → OUT','Karşılaştırıcı çıkışı ölçülür.','#43a047','SIGNAL'),
  W('v1','2','g1','M','V1− → 0 V','Voltmetre dönüşüdür.','#111827','0V')
 );return p;
}
function industrialSensorLoadProject(id,title,sensorId,label){
 const p=base(id,title);p.components=[
  C('g1','supply-dc-plus',70,250,'G1','24 VDC kaynak'),
  C('s1',sensorId,330,250,'B1',label,{outputType:'PNP'}),
  C('k1','coil-relay',610,300,'K1','24 V röle bobini'),
  C('ka1','contact-no',650,500,'K1','K1 NO yardımcı kontak'),
  C('h1','lamp-green',900,500,'H1','Sensör kontrollü yük')
 ];
 p.wires.push(
  W('g1','P','s1','BN','+24 V → BN','3 telli sensörün kahverengi beslemesidir.','#8b5a2b','+24V'),
  W('g1','M','s1','BU','0 V → BU','3 telli sensörün mavi dönüşüdür.','#111827','0V'),
  W('s1','BK','k1','A1','BK çıkış → K1/A1','PNP sensör algıladığında röle bobinine +24 V verir.','#43a047','SIGNAL'),
  W('k1','A2','g1','M','K1/A2 → 0 V','Röle bobini dönüşüdür.','#111827','0V'),
  W('g1','P','ka1','13','+24 V → K1/13','Yük kolunun beslemesidir.','#8b5a2b','+24V'),
  W('ka1','14','h1','X1','K1/14 → H1','K1 çekince NO kontak kapanıp yükü besler.','#8b5a2b','+24V'),
  W('h1','X2','g1','M','H1 → 0 V','Yük dönüş yoludur.','#111827','0V')
 );return p;
}
function soundSensorProject(id,title){
 const p=base(id,title,'arduino');p.components=[C('ps','arduino-bench-supply',70,220,'PS1','5 V masa kaynağı',{dcVoltage:5}),C('s1','arduino-sound-sensor',330,220,'B1','Ses sensörü'),C('u1','arduino-uno',620,200,'A1','Arduino UNO'),C('bz','arduino-buzzer',980,260,'BZ1','Buzzer')];
 p.wires.push(W('ps','P','s1','VCC','5 V → sensör VCC','Ses sensörünün beslemesidir.','#8b5a2b','+24V'),W('ps','M','s1','GND','0 V → sensör GND','Sensör referansıdır.','#111827','0V'),W('ps','P','u1','5V','5 V → UNO 5V','UNO beslemesidir.','#8b5a2b','+24V'),W('ps','M','u1','GND','0 V → UNO GND','Ortak referanstır.','#111827','0V'),W('s1','DO','u1','D2','Sensör DO → D2','Ses eşiği dijital girişe gelir.','#43a047','SIGNAL'),W('u1','D9','bz','SIG','D9 → buzzer SIG','Program çıkışı buzzerı sürer.','#43a047','SIGNAL'),W('ps','P','bz','VCC','5 V → buzzer VCC','Buzzer beslemesidir.','#8b5a2b','+24V'),W('ps','M','bz','GND','0 V → buzzer GND','Buzzer dönüşüdür.','#111827','0V'));return p;
}
function sensorProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR'),practical=/temrin|uygulama|devre|kontrol|çalışan|seri ve paralel bağlan/.test(t);
 if(practical){
  if(/ntc/.test(t))return {p:resistiveSensorComparatorProject(id,title,'sensor-ntc','NTC sıcaklık sensörü'),kind:'wiring'};
  if(/ptc/.test(t))return {p:resistiveSensorComparatorProject(id,title,'sensor-ptc','PTC sıcaklık sensörü'),kind:'wiring'};
  if(/ldr/.test(t))return {p:resistiveSensorComparatorProject(id,title,'ldr-gl5528','GL5528 LDR foto direnç'),kind:'wiring'};
  if(/alkış|ses/.test(t))return {p:soundSensorProject(id,title),kind:'wiring'};
  if(/optik|ir/.test(t))return {p:industrialSensorLoadProject(id,title,'sensor-through-beam','Optik sensör'),kind:'wiring'};
  if(/kapasitif/.test(t))return {p:industrialSensorLoadProject(id,title,'capacitive-detector','Kapasitif sensör'),kind:'wiring'};
  if(/manyetik|hall/.test(t))return {p:industrialSensorLoadProject(id,title,'sensor-hall','Manyetik/Hall sensörü'),kind:'wiring'};
  if(/endüktif|sensör/.test(t))return {p:industrialSensorLoadProject(id,title,'proximity','Endüktif sensör'),kind:'wiring'};
 }
 const rows=[];
 if(/ntc/.test(t))rows.push(['sensor-ntc','NTC sıcaklık sensörü']);
 else if(/ptc/.test(t))rows.push(['sensor-ptc','PTC sıcaklık sensörü']);
 else if(/ldr/.test(t))rows.push(['ldr-gl5528','GL5528 LDR foto direnç']);
 else if(/termokupl/.test(t))rows.push(['thermocouple','Termokupl']);
 else if(/pt100/.test(t))rows.push(['sensor-pt100','PT100 direnç termometresi']);
 else if(/lm35/.test(t))rows.push(['arduino-lm35','LM35 sıcaklık sensörü']);
 else if(/reed/.test(t))rows.push(['arduino-reed','Reed sensörü']);
 else if(/hall/.test(t))rows.push(['sensor-hall','Hall etkili sensör']);
 else if(/piezo/.test(t))rows.push(['tutorial-piezo','Piezoelektrik sensör']);
 else if(/ağırlık|load cell/.test(t))rows.push(['load-cell','Yük hücresi'],['weighing-indicator','Tartım göstergesi']);
 else if(/ir|optik/.test(t))rows.push(['sensor-through-beam','Optik sensör']);
 else rows.push(['proximity','Endüktif sensör'],['capacitive-detector','Kapasitif sensör'],['photoeye','Optik sensör']);
 return topicBoard(id,title,rows,rows.some(r=>r[0].startsWith('arduino-'))?'arduino':'control')
}
function opampCircuitProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR'),p=base(id,title);
 const ac=/\bac\b|faz kaymalı|wien|filtre/.test(t),sigType=ac?'arduino-signal-generator':'potentiometer';
 p.components=[
  C('g1','supply-dc-plus',70,220,'G1','24 VDC op-amp beslemesi'),
  C('u1','lm358p-opamp-a',620,300,'U1A','LM358P · A kanalı'),
  C('in',sigType,100,500,ac?'FG1':'RV1',ac?'AC sinyal kaynağı':'10 kΩ giriş ayarı',ac?{_signalVoltage:2.5,signalFrequency:1000}:{potMax:10000,potentiometer:35}),
  C('r1','resistor',360,390,'R1','10 kΩ giriş direnci',{resistance:10000}),
  C('r2','resistor',610,500,'R2','47 kΩ geri besleme direnci',{resistance:47000}),
  C('v1','meter-voltmeter',900,330,'V1','Çıkış voltmetresi')
 ];
 p.wires.push(
  W('g1','P','u1','V+','+24 V → U1/V+','LM358 pozitif besleme rayıdır.','#8b5a2b','+24V'),
  W('g1','M','u1','V-','0 V → U1/V−','LM358 tek besleme referansıdır.','#111827','0V'),
  W('v1','1','u1','OUT','V1+ → OUT','Çıkış gerilimi op-amp çıkışından ölçülür.','#43a047','SIGNAL'),
  W('v1','2','g1','M','V1− → 0 V','Voltmetre referansıdır.','#111827','0V')
 );
 if(ac)p.wires.push(W('in','GND','g1','M','FG GND → 0 V','Sinyal jeneratörü ve op-amp ortak referansı paylaşır.','#111827','0V'));
 else p.wires.push(W('in','1','g1','P','RV1/1 → +24 V','Potansiyometrenin üst ucu beslemededir.','#8b5a2b','+24V'),W('in','3','g1','M','RV1/3 → 0 V','Potansiyometrenin alt ucu referanstadır.','#111827','0V'));
 const inputPin=ac?'OUT':'2';
 if(/gerilim izleyici|voltage follower/.test(t)){
  // Unity feedback is a direct wire, not an orphan resistor pair.
  p.components=p.components.filter(c=>c.id!=='r1'&&c.id!=='r2');
  p.wires.push(W('in',inputPin,'u1','IN+','Giriş → IN+','Gerilim izleyicide giriş evirmeyen uca uygulanır.','#43a047','SIGNAL'),W('u1','OUT','u1','IN-','OUT → IN−','Birim kazançlı negatif geri besleme doğrudan çıkıştan yapılır.','#43a047','SIGNAL'));
 }else if(/karşılaştırıcı|schmitt/.test(t)){
  // Comparator uses R3/R4 reference divider, Schmitt additionally uses R2 feedback.
  p.components=p.components.filter(c=>/schmitt/.test(t)|| (c.id!=='r1'&&c.id!=='r2'));
  p.components.push(C('ref1','resistor',350,180,'R3','10 kΩ referans üst',{resistance:10000}),C('ref2','resistor',350,270,'R4','10 kΩ referans alt',{resistance:10000}));
  p.wires.push(W('g1','P','ref1','1','+24 V → R3','Karşılaştırıcı için orta referans bölücüsüdür.','#8b5a2b','+24V'),W('ref1','2','ref2','1','R3 → R4','Yaklaşık 12 V referans düğümüdür.','#43a047','SIGNAL'),W('ref2','2','g1','M','R4 → 0 V','Referans bölücünün dönüşüdür.','#111827','0V'),W('ref1','2','u1','IN-','12 Vref → IN−','Karşılaştırma eşiği eviren girişe uygulanır.','#43a047','SIGNAL'),W('in',inputPin,'u1','IN+','Giriş → IN+','Giriş referansla karşılaştırılır.','#43a047','SIGNAL'));
  if(/schmitt/.test(t)){
   // Input resistance is essential: a direct low-impedance potentiometer wiper
   // bypasses the feedback contribution and does not teach usable hysteresis.
   p.wires=p.wires.filter(w=>!(w.from?.c==='in'&&w.to?.c==='u1'&&w.to?.p==='IN+'));
   p.components.find(c=>c.id==='r1').label='R1 · 10 kΩ giriş direnci';
   p.components.find(c=>c.id==='r2').label='R2 · 47 kΩ pozitif geri besleme';
   p.wires.push(
    W('in',inputPin,'r1','1','Giriş → R1/1','Sinyal IN+ girişine doğrudan değil, R1 üzerinden ulaşır.','#43a047','SIGNAL'),
    W('r1','2','u1','IN+','R1/2 → U1/IN+','Giriş direnci çıkış geri beslemesiyle IN+ düğümünde birleşir.','#43a047','SIGNAL'),
    W('u1','OUT','r2','1','OUT → R2','Pozitif geri besleme histerezis oluşturur.','#43a047','SIGNAL'),
    W('r2','2','u1','IN+','R2 → IN+','R1/R2 oranı yükselen ve düşen eşikleri ayırır.','#43a047','SIGNAL')
   );
  }
 }else if(/türev/.test(t)){
  // R1 is not used by this differentiator; do not display a misleading orphan resistor.
  p.components=p.components.filter(c=>c.id!=='r1');
  p.components.find(c=>c.id==='r2').x=760;
  p.components.find(c=>c.id==='r2').y=480;
  p.components.push(C('c1','capacitor',360,410,'C1','100 nF giriş kondansatörü',{capacitance:100e-9}));
  p.components.push(C('ref1','resistor',350,180,'R3','10 kΩ üst referans',{resistance:10000}),C('ref2','resistor',350,270,'R4','10 kΩ alt referans',{resistance:10000}));
  p.wires.push(W('g1','P','ref1','1','24 V → R3','Vref üst kolu.'),W('ref1','2','ref2','1','R3/2 → R4/1','Orta referans düğümü.'),W('ref2','2','g1','M','R4 → 0 V','Vref alt kolu.'));
  p.wires.push(W('in',inputPin,'c1','1','Giriş → C1','Türev alıcıda giriş elemanı kondansatördür.','#43a047','SIGNAL'),W('c1','2','u1','IN-','C1 → IN−','Kondansatörün akımı toplama düğümüne gelir.','#43a047','SIGNAL'),W('ref1','2','u1','IN+','12 V Vref → IN+','Tek beslemede 10 kΩ / 10 kΩ direnç bölücünün orta noktası referanstır.','#43a047','SIGNAL'),W('u1','OUT','r2','1','OUT → R2','Geri besleme direnci çıkıştan gelir.','#43a047','SIGNAL'),W('r2','2','u1','IN-','R2 → IN−','Rf-C ağı türev davranışını belirler.','#43a047','SIGNAL'));
 }else if(/integral/.test(t)){
  // C1 replaces R2 as the feedback element: remove the orphan R2 and overlap.
  p.components=p.components.filter(c=>c.id!=='r2');
  p.components.find(c=>c.id==='r1').x=350;
  p.components.find(c=>c.id==='r1').y=455;
  p.components.push(C('c1','capacitor',775,470,'C1','1 µF geri besleme kondansatörü',{capacitance:1e-6}));
  p.components.push(C('ref1','resistor',350,180,'R3','10 kΩ üst referans',{resistance:10000}),C('ref2','resistor',350,270,'R4','10 kΩ alt referans',{resistance:10000}));
  p.wires.push(W('g1','P','ref1','1','24 V → R3','Vref üst kolu.'),W('ref1','2','ref2','1','R3/2 → R4/1','Orta referans düğümü.'),W('ref2','2','g1','M','R4 → 0 V','Vref alt kolu.'));
  p.wires.push(W('in',inputPin,'r1','1','Giriş → R1','İntegratörde giriş direnci seri elemandır.','#43a047','SIGNAL'),W('r1','2','u1','IN-','R1 → IN−','Giriş akımı toplama düğümüne akar.','#43a047','SIGNAL'),W('ref1','2','u1','IN+','12 V Vref → IN+','Tek beslemede 10 kΩ / 10 kΩ direnç bölücünün orta noktası referanstır.','#43a047','SIGNAL'),W('u1','OUT','c1','1','OUT → C1','Geri besleme elemanı kondansatördür.','#43a047','SIGNAL'),W('c1','2','u1','IN-','C1 → IN−','C geri beslemesi integral davranışı oluşturur.','#43a047','SIGNAL'));
 }else if(/evirmeyen/.test(t)){
  p.wires.push(W('in',inputPin,'u1','IN+','Giriş → IN+','Sinyal evirmeyen girişe uygulanır.','#43a047','SIGNAL'),W('u1','IN-','r1','1','IN− → R1','Kazanç bölücüsünün alt koludur.','#43a047','SIGNAL'),W('r1','2','g1','M','R1 → 0 V','Alt geri besleme direnci referansa döner.','#111827','0V'),W('u1','OUT','r2','1','OUT → R2','Çıkıştan negatif geri besleme alınır.','#43a047','SIGNAL'),W('r2','2','u1','IN-','R2 → IN−','Kazanç 1+Rf/Rg oranıyla belirlenir.','#43a047','SIGNAL'));
 }else{
  /* Eviren / toplayıcı / çıkarıcı için Vref ile tek beslemeli gerçek geri besleme. */
  p.components.push(C('ref1','resistor',350,180,'R3','10 kΩ Vref üst',{resistance:10000}),C('ref2','resistor',350,270,'R4','10 kΩ Vref alt',{resistance:10000}));
  p.wires.push(W('g1','P','ref1','1','+24 V → R3','Tek beslemede 12 V sanal referans oluşturur.','#8b5a2b','+24V'),W('ref1','2','ref2','1','R3 → R4','Vref orta düğümüdür.','#43a047','SIGNAL'),W('ref2','2','g1','M','R4 → 0 V','Referans bölücüyü tamamlar.','#111827','0V'),W('ref1','2','u1','IN+','Vref → IN+','Eviren yükseltecin evirmeyen girişi sanal orta noktaya bağlanır.','#43a047','SIGNAL'),W('in',inputPin,'r1','1','Giriş → R1','Giriş sinyali Rin üzerinden gelir.','#43a047','SIGNAL'),W('r1','2','u1','IN-','R1 → IN−','Eviren toplama düğümüdür.','#43a047','SIGNAL'),W('u1','OUT','r2','1','OUT → R2','Negatif geri besleme çıkıştan alınır.','#43a047','SIGNAL'),W('r2','2','u1','IN-','R2 → IN−','Kapalı çevrim kazancı Rf/Rin oranıyla belirlenir.','#43a047','SIGNAL'));
 }
 const connected=new Set(p.wires.flatMap(w=>[w.from.c,w.to.c]));p.components=p.components.filter(x=>connected.has(x.id));
 p.workspaceMode=ac?'arduino':'control';return p;
}
function opampProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/uygulama|devre|eviren|evirmeyen|izleyici|karşılaştırıcı|toplayıcı|çıkarıcı|türev|integral|schmitt/.test(t))return {p:opampCircuitProject(id,title),kind:'wiring'};
 const rows=[['lm358p-opamp-a','LM358P gerçek op-amp · A kanalı'],['resistor','Geri besleme / giriş direnci']];
 if(/ldr/.test(t))rows.push(['arduino-ldr','LDR ışık sensörü']);
 if(/ntc/.test(t))rows.push(['sensor-ntc','NTC sıcaklık sensörü']);
 if(/kondansatör|kapasit/.test(t))rows.push(['capacitor','Kondansatör']);
 return topicBoard(id,title,rows)
}
function oscillatorProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/555/.test(t))return topicBoard(id,title,[['arduino-ne555','NE555 Timer'],['arduino-resistor-1k','Zamanlama direnci'],['arduino-capacitor-100u','Zamanlama kondansatörü']],'arduino');
 if(/kristal/.test(t))return topicBoard(id,title,[['tutorial-crystal','Kuvars kristal'],['arduino-bd139','Transistör'],['arduino-capacitor-100n','Kondansatör']],'arduino');
 if(/colpitts|hartley/.test(t))return topicBoard(id,title,[['arduino-bd139','Transistör'],['reactor','Bobin / endüktans'],['capacitor','Kondansatör']],'arduino');
 if(/wien|faz kaymalı/.test(t))return topicBoard(id,title,[['tutorial-opamp','İşlemsel yükselteç'],['resistor','Direnç'],['capacitor','Kondansatör']]);
 if(/multivibratör/.test(t))return topicBoard(id,title,[['arduino-bd139','NPN transistör 1'],['arduino-bd139','NPN transistör 2'],['arduino-resistor-1k','Direnç'],['arduino-capacitor-100u','Kondansatör']],'arduino');
 if(/kırpıcı/.test(t))return topicBoard(id,title,[['arduino-diode-1n4148','Diyot'],['resistor','Direnç'],['arduino-signal-generator','Sinyal jeneratörü']],'arduino');
 if(/kenetleyici/.test(t))return topicBoard(id,title,[['arduino-diode-1n4148','Diyot'],['capacitor','Kondansatör'],['resistor','Direnç']],'arduino');
 if(/filtre/.test(t))return topicBoard(id,title,[['tutorial-opamp','İşlemsel yükselteç'],['resistor','Direnç'],['capacitor','Kondansatör']]);
 if(/fm verici/.test(t))return topicBoard(id,title,[['tutorial-rf-transmitter','FM verici bloğu'],['arduino-signal-generator','Modülasyon / sinyal kaynağı']],'arduino');
 if(/fm alıcı/.test(t))return topicBoard(id,title,[['tutorial-rf-receiver','FM alıcı bloğu']]);
 if(/mikser|bas-tiz|eko|ön yükselteç|ses yükselteci|vu metre/.test(t))return topicBoard(id,title,[['tutorial-opamp','Sinyal yükselteç bloğu'],['potentiometer','Seviye / ton ayarı'],['resistor','Direnç'],['capacitor','Kondansatör']]);
 return topicBoard(id,title,[['arduino-bd139','Transistör'],['resistor','Direnç'],['capacitor','Kondansatör']],'arduino')
}
function logicProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 const gate=[['exnor','xnor'],['xnor','xnor'],['exor','xor'],['xor','xor'],['nand','nand'],['nor','nor'],['buffer','buffer'],['tampon','buffer'],['not','not'],['değil','not'],['and','and'],['ve kap','and'],['or','or'],['veya kap','or']].find(x=>new RegExp('(^|[^a-zçğıöşü])'+x[0]+'([^a-zçğıöşü]|$)','i').test(t));
 if(gate)return topicBoard(id,title,[['tutorial-logic-'+gate[1],title]]);
 if(/encoder|kodlayıcı/.test(t))return topicBoard(id,title,[['tutorial-logic-encoder','Kodlayıcı / Encoder']]);
 if(/7 segment/.test(t))return topicBoard(id,title,[['arduino-cd4511','CD4511 BCD → 7 segment'],['arduino-7segment','7 segment gösterge']],'arduino');
 if(/decoder|kod çözücü/.test(t))return topicBoard(id,title,[['tutorial-logic-decoder','Kod çözücü / Decoder']]);
 if(/demultiplexer/.test(t))return topicBoard(id,title,[['tutorial-logic-demux','Demultiplexer']]);
 if(/multiplexer/.test(t))return topicBoard(id,title,[['tutorial-logic-mux','Multiplexer']]);
 if(/toplayıcı/.test(t))return topicBoard(id,title,[['tutorial-full-adder','Tam toplayıcı']]);
 if(/karşılaştırıcı/.test(t))return topicBoard(id,title,[['tutorial-comparator','Dijital karşılaştırıcı']]);
 if(/lojik|mantık|kapı/.test(t))return topicBoard(id,title,[['tutorial-logic-and','AND kapısı'],['tutorial-logic-or','OR kapısı']]);
 return topicBoard(id,title,[['tutorial-concept',title]])
}
function sequentialProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 for(const [re,k,n] of [[/rs flip/,'rs','RS Flip-Flop'],[/jk flip/,'jk','JK Flip-Flop'],[/d flip/,'d','D Flip-Flop'],[/t flip/,'t','T Flip-Flop']])if(re.test(t))return topicBoard(id,title,[['tutorial-ff-'+k,n]]);
 if(/kaydedici|register/.test(t))return topicBoard(id,title,[['arduino-74hc595','74HC595 kaydırmalı kaydedici']],'arduino');
 if(/adc/.test(t))return topicBoard(id,title,[['tutorial-adc','ADC']]);
 if(/dac/.test(t))return topicBoard(id,title,[['tutorial-dac','DAC']]);
 return topicBoard(id,title,[['arduino-cd4017','CD4017 sayıcı'],['arduino-button','Clock butonu'],['arduino-led','Çıkış LED’i']],'arduino')
}
function mcuProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR'),rows=[['arduino-uno','Arduino UNO R3']];
 if(/dijital çıkış|led/.test(t)&&!/ldr/.test(t))rows.push(['arduino-resistor-220','220 Ω LED direnci'],['arduino-led','LED']);
 if(/buton/.test(t))rows.push(['arduino-button','Buton modülü']);
 if(/ldr/.test(t))rows.push(['arduino-ldr','LDR sensörü'],['arduino-led','LED']);
 if(/hc-sr04/.test(t))rows.push(['arduino-hcsr04','HC-SR04'],['arduino-buzzer','Buzzer']);
 if(/potansiyometre|adc/.test(t))rows.push(['arduino-pot','10 kΩ potansiyometre']);
 if(/pwm.*led/.test(t))rows.push(['arduino-resistor-220','220 Ω LED direnci'],['arduino-led','LED']);
 if(/dc motor/.test(t))rows.push(['arduino-l298n','L298N motor sürücü'],['arduino-dc-motor','DC motor']);
 if(/servo/.test(t))rows.push(['arduino-servo-sg90','SG90 servo']);
 if(/7 segment/.test(t))rows.push(['arduino-cd4511','CD4511 decoder'],['arduino-7segment','7 segment gösterge']);
 if(/lcd|oled/.test(t))rows.push([/oled/.test(t)?'arduino-oled-i2c':'arduino-lcd1602-i2c',/oled/.test(t)?'I2C OLED':'I2C LCD']);
 if(/dht11/.test(t))rows.push(['arduino-dht11','DHT11']);
 if(/load cell/.test(t))rows.push(['arduino-loadcell-20kg','20 kg load cell'],['arduino-hx711','HX711 ADC']);
 if(/rotary encoder/.test(t))rows.push(['arduino-rotary-encoder','KY-040 rotary encoder']);
 if(/hc-05/.test(t))rows.push(['arduino-hc05','HC-05 Bluetooth']);
 if(/i2c çevre/.test(t))rows.push(['arduino-mcp23017','MCP23017 I2C I/O expander']);
 if(/analog sensör/.test(t))rows.push(['arduino-lm35','LM35 analog sensör']);
 return topicBoard(id,title,rows,'arduino')
}
function motorDirectProject(id,title,current){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/etiket|klemens kutusu|asenkron motorun yapısı|stator|rotor|gövde|kapak|çalışma prensibi|elektrik motorları|alternatif akım motorları|üç fazlı asenkron|kısa devre rotorlu/.test(t))return topicBoard(id,title,[['motor-3p','Üç faz asenkron motor']]);
 if(/rotoru sargılı|bilezikli/.test(t))return topicBoard(id,title,[['motor-rotor','Rotoru sargılı motor']]);
 if(/doğru akım motor|şönt motor|seri motor|kompunt motor/.test(t))return topicBoard(id,title,[['motor-dc','DC motor eğitim modeli']]);
 if(/kumanda devre sembol|kumanda devresi eleman listesi|butonlar|anahtarlar|koruma ve kumanda röleleri/.test(t))return topicBoard(id,title,[['push-no','NO START butonu'],['push-nc','NC STOP butonu'],['coil-contactor','Kontaktör bobini'],['contact-no','Yardımcı NO kontak'],['overload','Aşırı akım koruması']]);
 if(/güç devre şem|güç ve kumanda devre/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['mcb-3p','Kısa devre koruması'],['main-contact','Kontaktör ana güç kontakları'],['overload','Termik aşırı akım rölesi'],['motor-3p','Üç faz motor']]);
 if(/kontaktör arıza|kontaktör seçimi|kontaktörle yol verme/.test(t))return topicBoard(id,title,[['coil-contactor','Kontaktör bobini'],['main-contact','Kontaktör güç kontakları'],['overload','Motor aşırı akım koruması']]);
 if(/yıldız ve üçgen klemens/.test(t))return topicBoard(id,title,[['motor-y-d','Altı uçlu yıldız-üçgen motor']]);
 if(/faz sırası/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['phase-sequence-relay','Faz sırası rölesi'],['motor-3p','Üç faz motor']]);
 if(/paket şalter/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['door-isolator-3p','3 kutuplu aç-kapa şalter'],['motor-3p','Üç faz motor']]);
 if(/zaman ayarlı/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['coil-delay-on','Zaman rölesi'],['coil-contactor','Kontaktör bobini'],['main-contact','Kontaktör güç kontakları'],['motor-3p','Üç faz motor']]);
 if(/sınır anahtarı|iki sınır/.test(t)){const p=clone(L.byId['motor-forward-reverse-1'].project);p.components.push(C('ls1','limit-nc',260,760,'S2','İleri sınır'),C('ls2','limit-nc',480,760,'S3','Geri sınır'));return {p,kind:'quiz'}}
 if(/koruma röleli|aşırı akım/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['mcb-3p','3P sigorta'],['main-contact','Kontaktör'],['overload','Termik aşırı akım rölesi'],['motor-3p','Üç faz motor']]);
 if(/faz koruma/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['motor-protection-relay','Faz koruma rölesi'],['motor-3p','Üç faz motor']]);
 if(/sağ-sol/.test(t))return {p:clone(L.byId['motor-forward-reverse-1'].project),kind:'wiring'};
 if(/plc-kontaktör/.test(t))return {p:current,kind:'wiring'};
 return {p:current,kind:/kesik|sürekli|jog|çalıştır/.test(t)?'wiring':'quiz'}
}
function motorStartProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/yıldız-üçgen/.test(t)){const key=/paket/.test(t)?'motor-star-delta-1':/otomatik/.test(t)?'motor-star-delta-3':'motor-star-delta-2';return {p:clone(L.byId[key].project),kind:'wiring'}}
 if(/soft starter/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['softstarter','Soft starter'],['motor-3p','Üç faz motor']]);
 if(/oto trafo/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['autotransformer','Ototransformatör'],['main-contact','Kontaktör'],['motor-3p','Üç faz motor']]);
 if(/direnç ile/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['resistor','Faz başlangıç direnci 1'],['resistor','Faz başlangıç direnci 2'],['resistor','Faz başlangıç direnci 3'],['motor-3p','Üç faz motor']]);
 if(/dahlander/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['motor-dahlender','Dahlander iki devirli motor'],['coil-contactor','Düşük/yüksek devir kontaktörü']]);
 if(/kalkış akımı/.test(t))return topicBoard(id,title,[['supply-3p','3 faz kaynak'],['meter-ammeter','Akım göstergesi'],['motor-3p','Üç faz motor']]);
 return topicBoard(id,title,[['motor-y-d','Yıldız-üçgen motor'],['coil-delay-on','Zaman rölesi'],['coil-contactor','Yıldız/üçgen kontaktörü']])
}
function motorBrakeProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR'),rows=[['motor-3p','Üç faz motor']];
 if(/balatalı|amacı/.test(t))rows.push(['tutorial-mechanical-brake','Mekanik motor freni']);
 if(/dinamik|dc enjeksiyon|otomatik|zaman/.test(t))rows.push(['supply-dc-plus','DC enjeksiyon kaynağı'],['coil-contactor','Fren kontaktörü']);
 if(/zaman/.test(t))rows.push(['coil-delay-on','Zaman rölesi']);
 if(/yıldız-üçgen/.test(t))rows[0]=['motor-y-d','Yıldız-üçgen motor'];
 return topicBoard(id,title,rows)
}
function motorSpecialProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/kondansatörlü motor/.test(t))return topicBoard(id,title,[['supply-1p','Tek faz AC kaynak'],['motor-1p','Bir fazlı asenkron motor'],['capacitor','Yardımcı sargı kondansatörü']]);
 if(/bir faz/.test(t))return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['motor-1p','Yardımcı sargılı bir faz motor'],...( /yön/.test(t)?[['coil-relay','Yön değiştirme rölesi']]:[])]);
 if(/sabit mıknatıslı/.test(t))return topicBoard(id,title,[['hcfa-sv-x2ea040a-a','HCFA servo sürücü'],['hcfa-sv-x2mh040a-n2ln','Sabit mıknatıslı servo motor']]);
 if(/invertör/.test(t))return topicBoard(id,title,[['vfd','Frekans konvertörü'],['tutorial-synchronous-motor','Senkron motor']]);
 if(/yardımcı motor/.test(t))return topicBoard(id,title,[['tutorial-synchronous-motor','Senkron motor'],['motor-3p','Yardımcı yol verme motoru']]);
 return topicBoard(id,title,[['tutorial-synchronous-motor','Senkron motor']])
}
function motorSequenceProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR'),rows=[['supply-3p','3 faz kaynak'],['motor-3p','M1 motor'],['motor-3p','M2 motor'],['coil-contactor','K1 kontaktör'],['coil-contactor','K2 kontaktör']];
 if(/zaman|periyodik|sıra/.test(t))rows.push(['coil-delay-on','Zaman rölesi']);
 if(/aşırı akım/.test(t))rows.push(['overload','M1 termik röle'],['overload','M2 termik röle']);
 if(/sınır/.test(t))rows.push(['limit-nc','İleri sınır'],['limit-nc','Geri sınır']);
 if(/konveyör/.test(t))rows.push(['proximity','Koşul sensörü']);
 return topicBoard(id,title,rows)
}
function plcProject(id,title,current){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/besleme bağlantısı|dijital giriş|transistor çıkış|motora direkt|farklı merkez|ileri-geri|zaman ayarlı durdur/.test(t))return {p:current,kind:'wiring'};
 const rows=[['plc-hw-6es7211-1ae40-0xb0','S7-1211C DC/DC/DC']];
 if(/donanım|seçimi/.test(t))rows.push(['plc-0-5','SM 1221 DI 8'],['plc-0-7','SM 1222 DO 8']);
 if(/buton|kapalı kontak|set-reset|kenar/.test(t))rows.push(['push-no','Giriş butonu'],['push-nc','NC giriş']);
 if(/zamanlayıcı/.test(t))rows.push(['push-no','START girişi'],['lamp-green','Çıkış göstergesi']);
 if(/sayıcı/.test(t))rows.push(['encoder-incremental','Pals / sayma kaynağı']);
 if(/analog giriş/.test(t))rows.push(['plc-0-10','SM 1231 AI 4'],['plc-0-12','SM 1232 AO 4'],['sensor-level-analog','Analog sensör']);
 if(/invertör/.test(t))rows.push(['sinamics-v20-1p','SINAMICS V20']);
 return topicBoard(id,title,rows)
}
function driveProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/servo/.test(t))return topicBoard(id,title,[['plc-hw-6es7211-1ae40-0xb0','S7-1211C'],['hcfa-sv-x2ea040a-a','HCFA servo sürücü'],['hcfa-sv-x2mh040a-n2ln','HCFA servo motor']]);
 const rows=[['sinamics-v20-1p','SINAMICS V20'],['motor-3p','Üç faz motor']];
 if(/potansiyometre|hız/.test(t))rows.push(['potentiometer','Hız referans potansiyometresi']);
 if(/start|stop|yön|buton/.test(t))rows.push(['push-no','START / yön butonu'],['push-nc','STOP butonu']);
 if(/plc/.test(t))rows.unshift(['plc-hw-6es7211-1ae40-0xb0','S7-1211C']);
 return topicBoard(id,title,rows)
}
function panelProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/din ray|kablo kanalı/.test(t))return topicBoard(id,title,[['layout-terminals','Ray klemensi'],['panel-duct','Kablo kanalı']]);
 if(/sinyal lambası|buton montajı/.test(t))return topicBoard(id,title,[['push-no','Buton'],['lamp-green','Sinyal lambası']]);
 if(/sigorta.*kaçak/.test(t))return topicBoard(id,title,[['mcb-1p','Otomatik sigorta'],['rcd-2p','Kaçak akım koruma düzeni']]);
 if(/kontaktör.*motor koruma/.test(t))return topicBoard(id,title,[['main-contact','Kontaktör'],['overload','Termik aşırı akım rölesi'],['motor-3p','Motor']]);
 if(/pabucu|yüksük|numaralandırma/.test(t))return topicBoard(id,title,[['terminal-2','Ray klemensi'],['cable-marker','Kablo markörü']]);
 if(/ray klemens/.test(t))return topicBoard(id,title,[['terminal-2-array-4','4 sıra geçiş klemensi'],['terminal-pe','PE klemensi']]);
 if(/izolasyon/.test(t))return topicBoard(id,title,[['tutorial-insulation-tester','Yalıtkanlık direnci ölçer'],['terminal-2','Pano klemensi']]);
 if(/sayaç|100\/5/.test(t))return topicBoard(id,title,[[/100\/5/.test(t)?'meter-combined-ct':'meter-kwh-3p',/100\/5/.test(t)?'X/5 kombi sayaç':'Üç faz enerji sayacı'],...( /100\/5/.test(t)?[['current-transformer','100/5 akım trafosu']]:[])]);
 if(/kompanzasyon/.test(t))return topicBoard(id,title,[['capacitor-bank-3p','Üç faz kondansatör grubu'],['reactor','Reaktör'],['main-contact','Kademe kontaktörü']]);
 if(/trafo/.test(t))return topicBoard(id,title,[['transformer-3p','Üç faz trafosu'],['mcb-3p','Koruma elemanı'],['surge-arrester','Parafudr']]);
 return topicBoard(id,title,[['mcb-3p','Ana koruma'],['main-contact','Kontaktör'],['terminal-2-array-4','Klemens grubu'],['bar-pe','PE barası']])
}
function energyAnalyzerPowerProject(id,title,character='resistive'){
 const p=base(id,title),pf=character==='resistive'?1:.8;
 p.components=[
  C('dcRef','arduino-bench-supply',55,515,'G0','Ayarlanabilir DC güç kaynağı · OFF · bu AC deneyinde kullanılmaz',{dcVoltage:0,currentLimit:1,tutorialPurpose:'Tüm öğretici sayfalardaki ortak ayarlı kaynak görselidir. Bu güç analizi AC olduğundan G0 OFF ve elektriksel olarak ayrıdır.'}),
  C('g1','supply-1p',75,245,'G1','Sanal 230 VAC · 50 Hz eğitim kaynağı',{tutorialPurpose:'Yalnız uygulama içindeki sanal güç analizi devresini besler; gerçek şebeke üzerinde çalışma talimatı değildir.'}),
  C('ct1','current-transformer-edu-1p',315,215,'CT1','CT · 100/5 A · sanal akım algılama',{ctPrimary:100,ctSecondary:5,tutorialPurpose:'Yük akımını analizörün ölçüm modeline aktarır. Simülasyonda CT oranı 100/5 A kabul edilir.'}),
  C('z1','energy-training-load-1p',645,225,'Z1',character==='resistive'?'Dirençli eğitim yükü · PF 1,00':character==='capacitive'?'Kapasitif eğitim yükü · PF 0,80':'Endüktif eğitim yükü · PF 0,80',{nominalVoltage:230,apparentPowerVA:230,powerFactor:pf,loadCharacter:character,tutorialPurpose:'230 VA eğitim yükü; dirençli, endüktif veya kapasitif karakter presetleri P/Q/S/PF ilişkisini fiziksel olarak tutarlı kompleks empedansla üretir.'}),
  C('ea1','energy-analyzer-1p',380,430,'EA1','Enerji analizörü · V/A/W/VA/var/PF/Hz/Wh',{tutorialPurpose:'Gerilim bilgisini L-N uçlarından, akım bilgisini CT modelinden alır; aktif, reaktif ve görünür güç ile güç faktörü ve frekansı aynı ekranda gösterir.'})
 ];
 p.wires.push(
  W('g1','L','ct1','P1','Sanal faz → CT/P1','Sanal AC yük akımı CT primer yolundan geçer.','#e53935','L1'),
  W('ct1','P2','z1','L','CT/P2 → eğitim yükü','CT primerinden çıkan sanal akım yük modeline gider.','#e53935','L1'),
  W('z1','N','g1','N','Eğitim yükü → sanal nötr','Sanal tek faz güç devresinin dönüş yoludur.','#1e88e5','N'),
  W('g1','L','ea1','L','Kaynak L → analizör L','Analizör sanal L-N gerilim bilgisini izler.','#43a047','SIGNAL'),
  W('g1','N','ea1','N','Kaynak N → analizör N','Gerilim ölçümünün sanal nötr referansıdır.','#43a047','SIGNAL'),
  W('ct1','S1','ea1','S1','CT S1 → analizör S1','CT sekonder modeli sanal akım bilgisini analizöre aktarır.','#8e44ad','SIGNAL'),
  W('ct1','S2','ea1','S2','CT S2 → analizör S2','CT ölçüm devresinin sanal dönüşüdür.','#8e44ad','SIGNAL')
 );
 p.tutorialExplore={type:'energy-analyzer-power-rich',simulationOnly:true,presets:[
  {id:'resistive',label:'Dirençli',powerFactor:1,apparentPowerVA:230,expected:{V:230,I:1,P:230,Q:0,S:230,PF:1}},
  {id:'inductive',label:'Endüktif',powerFactor:.8,apparentPowerVA:230,expected:{V:230,I:1,P:184,Q:138,S:230,PF:.8}},
  {id:'capacitive',label:'Kapasitif',powerFactor:.8,apparentPowerVA:230,expected:{V:230,I:1,P:184,Q:-138,S:230,PF:.8}}
 ]};
 return p;
}
function frequencyMeasurementRichProject(id,title){
 const p=base(id,title);
 p.components=[
  C('dcRef','arduino-bench-supply',75,500,'G0','Ayarlanabilir DC güç kaynağı · OFF · bu deneyde kullanılmaz',{dcVoltage:0,currentLimit:1,tutorialPurpose:'Tüm öğretici sayfalardaki ortak ayarlı kaynak görselidir. Frekans ölçümünde düşük gerilimli sinyal jeneratörü kullanıldığı için bu kaynak OFF ve elektriksel olarak ayrıdır.'}),
  C('fg','arduino-signal-generator',110,250,'FG1','Sanal düşük gerilimli sinyal jeneratörü · 1 kHz',{generatorEnabled:true,generatorWaveform:'square',generatorFrequency:1000,generatorAmplitude:5,generatorOffset:0,generatorDuty:50,tutorialPurpose:'0–5 V düşük gerilimli periyodik sinyal üretir. Frekans 50 Hz, 1 kHz veya 10 kHz olarak değiştirilebilir.'}),
  C('m1','unit-ut61e-plus',760,260,'M1','UNI-T UT61E+ · Hz kademesi · VΩHz/COM',{meterPosition:5,tutorialPurpose:'UT61E+ gerçek modelinde frekans ölçümü bulunur. Kırmızı prob VΩHz, siyah prob COM girişindedir; düşük gerilimli sanal sinyalin frekansını okur.'})
 ];
 p.tutorialExplore={
  type:'frequency-measurement-rich',
  multimeterModel:'UNI-T UT61E+',
  meterRange:'Hz',
  signalAmplitudeVpp:5,
  frequencies:[50,1000,10000],
  periodsMs:[20,1,.1],
  simulationOnly:true
 };
 return p;
}
function clampCurrentMeasurementRichProject(id,title){
 const p=base(id,title),phaseId='clamp-rich-phase-'+id,neutralId='clamp-rich-neutral-'+id;
 p.components=[
  C('dcRef','arduino-bench-supply',70,500,'G0','Ayarlanabilir DC güç kaynağı · referans · bu deneyde kullanılmaz',{dcVoltage:0,currentLimit:1,tutorialPurpose:'Tüm öğretici derslerdeki ayarlı kaynak görsel standardıdır. UT200A pens akım deneyi AC olduğundan bu kaynak OFF ve elektriksel olarak devreden ayrıdır.'}),
  C('ac','supply-1p',110,260,'G1','Sanal 230 VAC eğitim kaynağı',{tutorialPurpose:'UT200A pens ölçümünün gerçek AC çalışma devresini besler. Faz ve nötr iletkenleri ayrı gösterilir.'}),
  C('r1','resistor',760,260,'R1','R1 · 230 Ω AC yük',{resistance:230,tutorialPurpose:'230 VAC altında ideal olarak yaklaşık 1 A RMS çeken dirençli eğitim yüküdür.'}),
  C('cl','unit-ut200a',410,390,'P1','UNI-T UT200A · ACA 2 A · pens',{meterPosition:1,clampedWireId:phaseId,clampT:.52,tutorialPurpose:'ACA 2 A kademesinde yalnız tek AC iletkeni çeneden geçirerek akımı devreyi kesmeden ölçer.'})
 ];
 p.wires.push(
  {id:phaseId,from:{c:'ac',p:'L'},to:{c:'r1',p:'1'},color:'#e53935',role:'L1',size:'1.5',points:[],tutorialHint:'Faz iletkeni · G1/L → R1/1',tutorialWhy:'UT200A çenesi başlangıçta bu tek faz iletkenini kavrar; yaklaşık 1 A RMS beklenir.'},
  {id:neutralId,from:{c:'r1',p:'2'},to:{c:'ac',p:'N'},color:'#1e88e5',role:'N',size:'1.5',points:[],tutorialHint:'Nötr iletkeni · R1/2 → G1/N',tutorialWhy:'Aynı seri AC devresinin dönüş iletkenidir; tek başına kavrandığında akım büyüklüğü yine yaklaşık 1 A RMS olur.'}
 );
 p.tutorialExplore={
  type:'clamp-current-measurement-rich',
  nominalVoltageVrms:230,
  resistance:230,
  expectedCurrentA:1,
  clampRange:'ACA 2 A',
  phaseWireId:phaseId,
  neutralWireId:neutralId,
  presets:[
   {id:'phase',label:'Faz iletkeni',expected:'≈ 1,000 A RMS'},
   {id:'neutral',label:'Nötr iletkeni',expected:'≈ 1,000 A RMS'},
   {id:'none',label:'Çeneyi iletkenden çıkar',expected:'ölçüm yok / uyarı'}
  ]
 };
 return p;
}
function resistanceMeasurementRichProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',90,160,'G1','Ayarlanabilir DC güç kaynağı · OFF · devreden ayrılmış',{dcVoltage:0,currentLimit:1,tutorialPurpose:'Tüm öğretici sayfalarda ortak ayarlı kaynak görselidir. Direnç ölçümünde kaynak OFF durumundadır ve R1’e hiçbir elektriksel bağlantısı yoktur.'}),
  C('r1','resistor',600,275,'R1','R1 · 1 kΩ · enerjisiz ölçüm',{resistance:1000,tutorialPurpose:'Ölçülecek gerçek dirençtir. Harici besleme yokken problar iki ucuna değdirilir ve yaklaşık 1,000 kΩ okunur.'}),
  C('m1','unit-ut33d-plus',880,300,'M1','UNI-T UT33D+ · Ω 2 kΩ · VΩmA/COM',{meterPosition:15,tutorialPurpose:'1 kΩ direnç için 2 kΩ Ω kademesi uygundur. Kırmızı prob VΩmA, siyah prob COM girişindedir. Direnç ölçümü yalnız enerjisiz devrede yapılır.'})
 ];
 p.tutorialExplore={
  type:'resistance-measurement-rich',
  resistorOhms:1000,
  meterRange:'Ω 2 kΩ',
  sourceRequiredOff:true,
  presets:[
   {id:'resistor',label:'R1 ölçümü',expected:'≈ 1,000 kΩ'},
   {id:'short',label:'Probları kısa devre et',expected:'≈ 0 Ω'},
   {id:'open',label:'Probları ayır',expected:'OL'}
  ]
 };
 return p;
}
function dcCurrentMeasurementRichProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',100,280,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'1 kΩ yük üzerinden yaklaşık 24 mA akım oluşturur. Tüm öğretici derslerdeki ayarlı kaynak standardıdır.'}),
  C('a1','unit-ut33d-plus',470,300,'A1','UNI-T UT33D+ · DCA 200 mA · VΩmA/COM',{meterPosition:10,tutorialPurpose:'Beklenen 24 mA akım için DCA 200 mA kademesi uygundur. Kırmızı prob VΩmA, siyah prob COM girişindedir ve ölçü aleti akım yoluna seri girer.'}),
  C('r1','resistor',790,280,'R1','R1 · 1 kΩ yük',{resistance:1000,tutorialPurpose:'24 V altında ideal olarak I=24/1000=0,024 A=24 mA akım çeken dirençli yüktür.'})
 ];
 p.wires.push(
  W('g','P','a1','V','G1 +24 V → A1 VΩmA','Akım ölçmek için devre yolu açılır ve kırmızı prob tarafı kaynağın pozitif yönüne seri girer.','#e53935','MEASURE'),
  W('a1','COM','r1','1','A1 COM → R1/1','Ölçülen akımın tamamı ampermetreden çıkıp R1 yüküne akar.','#e53935','MEASURE'),
  W('r1','2','g','M','R1/2 → G1 0 V','Yük akımı 0 V dönüşünden kaynağa geri döner.','#111827','0V')
 );
 p.tutorialExplore={
  type:'current-measurement-rich',
  nominalVoltage:24,
  resistance:1000,
  expectedCurrentA:.024,
  meterRange:'DCA 200 mA',
  presets:[
   {id:'high',label:'Yük öncesi',expected:'≈ +24 mA'},
   {id:'low',label:'Yük sonrası',expected:'≈ +24 mA'},
   {id:'reverse',label:'Ters prob yönü',expected:'≈ −24 mA'}
  ]
 };
 return p;
}
function dcVoltageMeasurementRichProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g','arduino-bench-supply',100,280,'G1','Ayarlanabilir DC güç kaynağı · 24,0 V',{dcVoltage:24,currentLimit:1,tutorialPurpose:'Ölçüm devresine 24 VDC sağlar. Ayarlı masa kaynağı tüm öğretici derslerdeki ortak kaynak standardıdır.'}),
  C('r1','resistor',585,280,'R1','R1 · 1 kΩ yük',{resistance:1000,tutorialPurpose:'Kaynağa bağlı gerçek dirençli yüktür. 24 V altında ideal akım 24 mA olur; uç gerilimi kaynak gerilimine yaklaşık eşittir.'}),
  C('v1','unit-ut33d-plus',870,300,'V1','UNI-T UT33D+ · DCV 200 V · VΩmA/COM',{meterPosition:4,tutorialPurpose:'24 V ölçümü DCV 20 V sınırını aştığı için DCV 200 V kademesi kullanılır. Kırmızı prob VΩmA, siyah prob COM girişindedir.'})
 ];
 p.wires.push(
  W('g','P','r1','1','G1 +24 V → R1/1','Kaynağın pozitif ucu 1 kΩ yüke enerji verir.','#e53935','+24V'),
  W('r1','2','g','M','R1/2 → G1 0 V','Direnç üzerinden geçen akım 0 V dönüşüne ulaşarak güç yolunu kapatır.','#111827','0V')
 );
 p.tutorialExplore={
  type:'voltage-measurement-rich',
  nominalVoltage:24,
  resistance:1000,
  expectedCurrentA:.024,
  meterRange:'DCV 200 V',
  presets:[
   {id:'load',label:'R1 uçları',expected:'≈ +24 V'},
   {id:'source',label:'Kaynak uçları',expected:'≈ +24 V'},
   {id:'same',label:'Aynı düğüm',expected:'≈ 0 V'},
   {id:'reverse',label:'Ters polarite',expected:'≈ −24 V'}
  ]
 };
 return p;
}
function dcMeasurementProject(id,title,mode='voltage'){
 const p=base(id,title);p.components=[
  C('g1','supply-dc-plus',90,250,'G1','24 VDC kaynak'),
  ...(mode==='current'?[C('a1','meter-ammeter',330,250,'A1','Ampermetre')]:[]),
  C('r1','resistor',580,250,'R1','1 kΩ direnç',{resistance:1000}),
  ...(mode==='voltage'?[C('v1','meter-voltmeter',580,460,'V1','Voltmetre')]:[])
 ];
 if(mode==='current'){
  p.wires.push(W('g1','P','a1','1','+24 V → ampermetre','Ampermetre akım yoluna seri bağlanır.','#8b5a2b','+24V'),W('a1','2','r1','1','Ampermetre → R1','Ölçülen akım R1 üzerinden akar.','#8b5a2b','+24V'),W('r1','2','g1','M','R1 → 0 V','Dirençli yükün dönüş yoludur.','#111827','0V'));
 }else{
  p.wires.push(W('g1','P','r1','1','+24 V → R1','Direnç beslemeye bağlanır.','#8b5a2b','+24V'),W('r1','2','g1','M','R1 → 0 V','Direnç devresini tamamlar.','#111827','0V'),W('v1','1','r1','1','V1+ → R1/1','Voltmetrenin bir ucu direncin girişine paralel bağlanır.','#43a047','SIGNAL'),W('v1','2','r1','2','V1− → R1/2','Voltmetrenin diğer ucu direncin çıkışına paralel bağlanır.','#43a047','SIGNAL'));
 }
 return p;
}
function acReactiveProject(id,title,type){
 const capacitor=type==='capacitor',loadId=capacitor?'capacitor':'reactor',loadLabel=capacitor?'C1 · 4,7 µF':'L1 · 2 H';
 const extra=capacitor?{capacitance:4.7e-6}:{inductance:2};
 const p=base(id,title);p.components=[C('g1','supply-1p',80,260,'G1','230 VAC kaynak'),C('a1','meter-ammeter',300,260,'A1','AC akım ölçümü'),C('z1',loadId,550,260,capacitor?'C1':'L1',loadLabel,extra),C('v1','meter-voltmeter',550,470,'V1','Eleman gerilimi')];
 p.wires.push(W('g1','L','a1','1','L → ampermetre','Reaktif elemanın akımı seri ampermetreden geçer.','#e53935','L1'),W('a1','2','z1','1','Ampermetre → '+(capacitor?'C1':'L1'),'Akım ölçümü reaktif elemanla seri yapılır.','#e53935','L1'),W('z1','2','g1','N',(capacitor?'C1':'L1')+' → N','AC akım yolunu nötre tamamlar.','#1e88e5','N'),W('v1','1','z1','1','Voltmetre → giriş','Gerilim reaktif elemanın iki ucu arasında ölçülür.','#43a047','SIGNAL'),W('v1','2','z1','2','Voltmetre → çıkış','Voltmetre paralel bağlıdır.','#43a047','SIGNAL'));
 return p;
}
function regulatedSupplyProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-1p',80,240,'G1','230 VAC kaynak'),C('ps1','smps',370,240,'PS1','230 VAC / 24 VDC regüle güç kaynağı'),C('r1','resistor',680,240,'R1','1 kΩ DC yük',{resistance:1000}),C('v1','meter-voltmeter',680,450,'V1','24 VDC çıkış ölçümü')];
 p.wires.push(W('g1','L','ps1','L','L → PS1/L','Regüle güç kaynağının AC faz girişidir.','#e53935','L1'),W('g1','N','ps1','N','N → PS1/N','AC nötr dönüşüdür.','#1e88e5','N'),W('ps1','P','r1','1','+24 V → R1','Regüle DC çıkış gerçek dirençli yüke uygulanır.','#8b5a2b','+24V'),W('r1','2','ps1','M','R1 → 0 V','DC yük devresini tamamlar.','#111827','0V'),W('v1','1','ps1','P','V1+ → +24 V','Çıkış gerilimi paralel ölçülür.','#43a047','SIGNAL'),W('v1','2','ps1','M','V1− → 0 V','Voltmetre referans dönüşüdür.','#43a047','SIGNAL'));
 return p;
}

function rcTransientProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-dc-plus',70,260,'G1','24 VDC kaynak'),C('s1','push-no',280,260,'S1','ŞARJ butonu'),C('r1','resistor',500,260,'R1','10 kΩ şarj direnci',{resistance:10000}),C('c1','capacitor',730,260,'C1','100 µF kondansatör',{capacitance:100e-6}),C('v1','meter-voltmeter',730,500,'V1','C1 gerilimi')];
 p.wires.push(W('g1','P','s1','13','+24 V → S1/13','Buton kapandığında RC şarj yolu enerji alır.','#8b5a2b','+24V'),W('s1','14','r1','1','S1/14 → R1','R1 kondansatörün şarj akımını sınırlar; lamba yerine gerçek direnç kullanılır.','#8b5a2b','+24V'),W('r1','2','c1','1','R1 → C1','C1, R1 üzerinden zaman sabitine göre şarj olur.','#43a047','SIGNAL'),W('c1','2','g1','M','C1 → 0 V','Kondansatörün referans/dönüş ucudur.','#111827','0V'),W('v1','1','c1','1','V1+ → C1/1','Kondansatör gerilimi paralel ölçülür.','#43a047','SIGNAL'),W('v1','2','c1','2','V1− → C1/2','Voltmetre C1’in iki ucuna bağlanır.','#43a047','SIGNAL'));return p;
}
function rlTransientProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-dc-plus',70,260,'G1','24 VDC kaynak'),C('s1','push-no',270,260,'S1','ENERJİLE butonu'),C('a1','meter-ammeter',465,260,'A1','Bobin akımı'),C('r1','resistor',650,260,'R1','100 Ω akım sınırlama',{resistance:100}),C('l1','reactor',850,260,'L1','2 H gerçek bobin',{inductance:2}),C('v1','meter-voltmeter',850,500,'V1','Bobin gerilimi')];
 p.wires.push(W('g1','P','s1','13','+24 V → S1','Bobin devresine komut verir.','#8b5a2b','+24V'),W('s1','14','a1','1','S1 → ampermetre','Bobin akımı seri olarak ölçülür.','#8b5a2b','+24V'),W('a1','2','r1','1','A1 → R1','Gerçek devrede ilk akımı sınırlayan seri dirençtir.','#8b5a2b','+24V'),W('r1','2','l1','1','R1 → L1','L1 akımın ani değişimine karşı koyar.','#8b5a2b','+24V'),W('l1','2','g1','M','L1 → 0 V','RL akım yolunu tamamlar.','#111827','0V'),W('v1','1','l1','1','V1+ → L1/1','Bobin üzerindeki gerilim paralel ölçülür.','#43a047','SIGNAL'),W('v1','2','l1','2','V1− → L1/2','Bobin geriliminin ikinci ölçüm noktasıdır.','#43a047','SIGNAL'));return p;
}
function bjtSwitchProject(id,title,type='NPN'){
 const pnp=type==='PNP',qId=pnp?'bd140-pnp':'bd139-npn',p=base(id,title);
 p.components=[C('g1','supply-dc-plus',70,270,'G1','24 VDC kaynak'),C('s1','push-no',270,470,'S1',pnp?'PNP beyzini aşağı çek':'NPN beyzini sür'),C('rb','resistor',480,470,'RB','4,7 kΩ beyz direnci',{resistance:4700}),C('q1',qId,680,280,'Q1',pnp?'BD140 PNP':'BD139 NPN'),C('rl','resistor',900,270,'RL','1 kΩ kolektör yükü',{resistance:1000}),C('v1','meter-voltmeter',900,500,'V1','Yük/çıkış gerilimi')];
 if(pnp)p.wires.push(W('g1','P','q1','E','+24 V → Q1/E','PNP transistörün emitörü pozitif raya bağlanır.','#8b5a2b','+24V'),W('q1','C','rl','1','Q1/C → RL','PNP iletimde kolektör akımı gerçek dirençli yüke akar.','#43a047','SIGNAL'),W('rl','2','g1','M','RL → 0 V','Kolektör yükünün dönüş yoludur.','#111827','0V'),W('g1','M','s1','13','0 V → S1','Buton PNP beyzini emitöre göre aşağı çeker.','#111827','0V'),W('s1','14','rb','1','S1 → RB','Beyz akımı RB ile sınırlandırılır.','#43a047','SIGNAL'),W('rb','2','q1','B','RB → Q1/B','Butona basılınca VEB yeterli olur ve PNP iletime geçer.','#43a047','SIGNAL'),W('v1','1','q1','C','V1+ → Q1/C','PNP çıkış düğümü ölçülür.','#43a047','SIGNAL'),W('v1','2','g1','M','V1− → 0 V','Ölçüm referansıdır.','#111827','0V'));
 else p.wires.push(W('g1','P','rl','1','+24 V → RL','NPN kolektör yükü pozitif raydan beslenir.','#8b5a2b','+24V'),W('rl','2','q1','C','RL → Q1/C','NPN iletimde yük akımı kolektöre akar.','#43a047','SIGNAL'),W('q1','E','g1','M','Q1/E → 0 V','NPN emitör ortak 0 V referansındadır.','#111827','0V'),W('g1','P','s1','13','+24 V → S1','Buton beyz sürme yolunu açıp kapatır.','#8b5a2b','+24V'),W('s1','14','rb','1','S1 → RB','Beyz akımı RB ile sınırlandırılır.','#43a047','SIGNAL'),W('rb','2','q1','B','RB → Q1/B','VBE yaklaşık 0,62 V eşiğini aşınca NPN iletime geçer.','#43a047','SIGNAL'),W('v1','1','q1','C','V1+ → Q1/C','Kolektör düğümündeki anahtarlama gerilimi ölçülür.','#43a047','SIGNAL'),W('v1','2','g1','M','V1− → 0 V','Ölçüm referansıdır.','#111827','0V'));
 return p;
}
function resistorMeasureProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-dc-plus',70,250,'G1','12 VDC test kaynağı',{dcVoltage:12}),C('a1','meter-ammeter',300,250,'A1','Akım ölçümü'),C('r1','resistor',560,250,'R1','1 kΩ ölçülecek direnç',{resistance:1000}),C('v1','meter-voltmeter',560,470,'V1','Direnç uç gerilimi')];
 p.wires.push(W('g1','P','a1','1','+12 V → A1','Akım seri ölçülür.','#8b5a2b','+24V'),W('a1','2','r1','1','A1 → R1','Gerçek direnç üzerinden akım geçirilir.','#8b5a2b','+24V'),W('r1','2','g1','M','R1 → 0 V','Direnç devresi tamamlanır.','#111827','0V'),W('v1','1','r1','1','V1+ → R1/1','Direncin gerilimi paralel ölçülür.','#43a047','SIGNAL'),W('v1','2','r1','2','V1− → R1/2','Ohm değeri U/I ile doğrulanabilir.','#43a047','SIGNAL'));return p;
}


function frequencyMeasureProject(id,title){
 const p=base(id,title,'arduino');p.components=[C('gen','arduino-signal-generator',90,260,'GEN1','1 kHz sinyal jeneratörü',{generatorFrequency:1000,generatorAmplitude:5}),C('fm','tutorial-frequency-meter',500,260,'F1','Frekansmetre')];
 p.wires.push(W('gen','OUT','fm','1','GEN OUT → F1/1','Ölçülen sinyal frekansmetre girişine uygulanır.','#43a047','SIGNAL'),W('gen','GND','fm','2','GEN GND → F1/2','Sinyal ölçümünün ortak referansıdır.','#111827','0V'));return p;
}
function wattmeterProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-1p',70,250,'G1','230 VAC kaynak'),C('w1','tutorial-wattmeter',330,250,'W1','Wattmetre'),C('r1','resistor',650,250,'R1','1 kΩ dirençli yük',{resistance:1000})];
 p.wires.push(W('g1','L','w1','I+','L → W1 I+','Wattmetrenin akım yolu yükle seridir.','#e53935','L1'),W('w1','I−','r1','1','W1 I− → R1','Yük akımı wattmetreden geçer.','#e53935','L1'),W('r1','2','g1','N','R1 → N','Dirençli yük devresini tamamlar.','#1e88e5','N'),W('g1','L','w1','V+','L → W1 V+','Gerilim girişi faza paralel bağlanır.','#43a047','SIGNAL'),W('g1','N','w1','V−','N → W1 V−','Gerilim ölçümünün nötr referansıdır.','#43a047','SIGNAL'));return p;
}
function powerFactorProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-1p',70,250,'G1','230 VAC kaynak'),C('m1','motor-1p',560,250,'M1','1 faz asenkron motor'),C('pf1','tutorial-cosphimeter',330,470,'PF1','Kosinüsfimetre')];
 p.wires.push(W('g1','L','m1','U','L → M1/U','Motor faz beslemesidir.','#e53935','L1'),W('g1','N','m1','N','N → M1/N','Motor nötr dönüşüdür.','#1e88e5','N'),W('g1','PE','m1','PE','PE → M1/PE','Motor gövde koruma iletkenidir.','#16a34a','PE'),W('g1','L','pf1','L','L → PF1/L','Güç katsayısı ölçer faz gerilimini referans alır.','#43a047','SIGNAL'),W('g1','N','pf1','N','N → PF1/N','Ölçümün nötr referansıdır.','#43a047','SIGNAL'));return p;
}
function energyMeterProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-1p',70,250,'G1','230 VAC kaynak'),C('p1','meter-kwh-1p',360,250,'P1','Bir faz aktif enerji sayacı'),C('r1','resistor',700,250,'R1','1 kΩ test yükü',{resistance:1000})];
 p.wires.push(W('g1','L','p1','L','L → sayaç L','Sayaç faz girişidir.','#e53935','L1'),W('g1','N','p1','N','N → sayaç N','Sayaç nötr girişidir.','#1e88e5','N'),W('p1','L2','r1','1','Sayaç L2 → R1','Ölçülen yük akımı sayaç üzerinden yüke gider.','#e53935','L1'),W('r1','2','p1','N2','R1 → sayaç N2','Yük dönüşü sayaç nötr çıkışına bağlanır.','#1e88e5','N'));return p;
}


function tachometerProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-3p',70,220,'G1','3 faz kaynak'),C('m1','motor-3p',520,220,'M1','Üç faz motor'),C('t1','tutorial-tachometer',760,450,'T1','Temassız takometre')];
 p.wires.push(W('g1','L1','m1','U','L1 → M1/U','Motor faz 1 bağlantısıdır.','#e53935','L1'),W('g1','L2','m1','V','L2 → M1/V','Motor faz 2 bağlantısıdır.','#f97316','L2'),W('g1','L3','m1','W','Motor faz 3 bağlantısıdır.','#f4c430','L3'),W('g1','PE','m1','PE','PE → M1/PE','Motor gövde koruma bağlantısıdır.','#16a34a','PE'));return p;
}
function multimeterSensorProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-dc-plus',60,260,'G1','24 VDC kaynak'),C('s1','proximity',300,260,'B1','PNP endüktif sensör',{outputType:'PNP'}),C('mr','test-probe-red',570,180,'PR','Kırmızı prob'),C('mb','test-probe-black',570,350,'PB','Siyah prob'),C('mm','unit-ut33d-plus',850,230,'P1','UNI-T UT33D+',{multimeterMode:'VDC'})];
 p.wires.push(W('g1','P','s1','BN','+24 V → BN','Sensör kahverengi besleme ucudur.','#8b5a2b','+24V'),W('g1','M','s1','BU','0 V → BU','Sensör mavi 0 V ucudur.','#111827','0V'),W('s1','BK','mr','TIP','BK → kırmızı prob','PNP çıkış gerilimi kırmızı probla ölçülür.','#43a047','SIGNAL'),W('mr','PLUG','mm','V','Kırmızı prob → VΩmA','Gerilim ölçümünde kırmızı kablo V girişindedir.','#43a047','SIGNAL'),W('g1','M','mb','TIP','0 V → siyah prob','Siyah prob devre referansına dokundurulur.','#111827','0V'),W('mb','PLUG','mm','COM','Siyah prob → COM','Siyah kablo COM girişine takılır.','#111827','0V'));return p;
}
function pt100Project(id,title){
 const p=base(id,title);p.components=[C('pt','sensor-pt100',80,250,'B1','PT100 · 3 telli'),C('ctl','temperature-controller',470,220,'TIC1','ENDA ET4420'),C('g1','supply-1p',800,230,'G1','230 VAC besleme')];
 p.wires.push(W('pt','A','ctl','8','PT100 A → ET4420/8','RTD tek taraf ucu terminal 8’e bağlanır.','#43a047','SIGNAL'),W('pt','B1','ctl','9','PT100 B1 → ET4420/9','İlk kompanzasyon teli terminal 9’a gider.','#43a047','SIGNAL'),W('pt','B2','ctl','10','PT100 B2 → ET4420/10','İkinci kompanzasyon teli hat direnci telafisini sağlar.','#43a047','SIGNAL'),W('g1','L','ctl','11','L → ET4420/11','Kontrol cihazı besleme fazıdır.','#e53935','L1'),W('g1','N','ctl','12','N → ET4420/12','Kontrol cihazı besleme dönüşüdür.','#1e88e5','N'));return p;
}
function lm35Project(id,title){
 const p=base(id,title,'arduino');p.components=[C('ps','arduino-bench-supply',60,260,'G1','5 VDC kaynak',{defaultVoltage:5}),C('s1','arduino-lm35',330,260,'B1','LM35'),C('u1','arduino-uno',650,190,'ARD1','Arduino UNO R3')];
 p.wires.push(W('ps','P','s1','VCC','+5 V → LM35 VCC','LM35 sensör beslemesidir.','#8b5a2b','+24V'),W('ps','M','s1','GND','0 V → LM35 GND','Sensör referansıdır.','#111827','0V'),W('ps','P','u1','5V','+5 V → UNO 5V','UNO ve sensör aynı 5 V kaynağı paylaşır.','#8b5a2b','+24V'),W('ps','M','u1','GND','0 V → UNO GND','Ortak analog referanstır.','#111827','0V'),W('s1','AO','u1','A0','LM35 OUT → A0','10 mV/°C analog sıcaklık sinyali A0 girişinde okunur.','#43a047','SIGNAL'));return p;
}
function reedProject(id,title){
 const p=base(id,title,'arduino');p.components=[C('ps','arduino-bench-supply',60,260,'G1','5 VDC kaynak',{defaultVoltage:5}),C('s1','arduino-reed',330,260,'B1','KY-021 reed sensörü'),C('u1','arduino-uno',650,190,'ARD1','Arduino UNO R3')];
 p.wires.push(W('ps','P','s1','VCC','+5 V → reed VCC','Reed modülü beslemesidir.','#8b5a2b','+24V'),W('ps','M','s1','GND','0 V → reed GND','Reed modülü referansıdır.','#111827','0V'),W('ps','P','u1','5V','+5 V → UNO 5V','Arduino beslemesidir.','#8b5a2b','+24V'),W('ps','M','u1','GND','0 V → UNO GND','Arduino ve sensör ortak referansı paylaşır.','#111827','0V'),W('s1','DO','u1','D2','Reed S → UNO D2','Mıknatıs algılandığında dijital durum D2 girişine ulaşır.','#43a047','SIGNAL'));return p;
}


function thermocoupleProject(id,title){
 const p=base(id,title);p.components=[C('tc','thermocouple',90,250,'TC1','K tipi termokupl'),C('ctl','temperature-controller',480,220,'TIC1','ENDA ET4420'),C('g1','supply-1p',820,230,'G1','230 VAC besleme')];
 p.wires.push(W('tc','+','ctl','9','TC+ → ET4420/9','Termokupl pozitif ucu TC+ girişine bağlanır.','#43a047','SIGNAL'),W('tc','−','ctl','10','TC− → ET4420/10','Termokupl negatif ucu TC− girişine bağlanır.','#43a047','SIGNAL'),W('g1','L','ctl','11','L → ET4420/11','Sıcaklık kontrol cihazının faz beslemesidir.','#e53935','L1'),W('g1','N','ctl','12','N → ET4420/12','Sıcaklık kontrol cihazının nötr dönüşüdür.','#1e88e5','N'));return p;
}


function dcSourceProject(id,title){
 const p=base(id,title);
 p.components=[
  C('g1','supply-dc-plus',95,235,'G1','1 · DC kaynak · 24 V',{tutorialPurpose:'Kararlı +24 V ve 0 V referansı sağlar. DC kaynağın kutupları sabittir; yük akımı pozitif uçtan çıkar ve dönüş hattından kaynağa döner.'}),
  C('r1','resistor',620,235,'R1','2 · Direnç yük · 1 kΩ',{resistance:1000,tutorialPurpose:'Kaynağa bağlanan gerçek dirençli yüktür. 24 V / 1 kΩ = 24 mA akım çeker ve yaklaşık 0,576 W güç harcar.'}),
  C('v1','unit-ut33d-plus',430,475,'V1','3 · Multimetre · UNI-T UT33D+',{meterPosition:4,tutorialPurpose:'DCV 200 V kademesinde iki nokta arasındaki gerilimi paralel ölçer. 24 V ölçüm için kırmızı prob VΩmA, siyah prob COM girişindedir.'}),
  C('v1-red','test-probe-red',235,505,'PR1','4 · Kırmızı prob',{probeTarget:{c:'r1',p:'1'},tutorialPurpose:'VΩmA girişine bağlı kırmızı probdur. Simülasyon sırasında başka terminale, junction noktasına veya kabloya serbestçe taşınabilir.'}),
  C('v1-black','test-probe-black',790,505,'PB1','5 · Siyah prob',{probeTarget:{c:'r1',p:'2'},tutorialPurpose:'COM girişine bağlı referans probudur. Simülasyon sırasında istediğiniz ikinci ölçüm noktasına taşınabilir.'})
 ];
 const w1=W('g1','P','r1','1','+24 V → R1/1','Kaynağın pozitif ucu yükün girişine bağlanır. Bu, enerji yolunun başlangıcıdır.','#e53935','+24V');
 const w2=W('r1','2','g1','M','R1/2 → 0 V','Dirençten geçen akım 0 V dönüşü üzerinden kaynağa geri döner; devre ancak kapalı yol olduğunda çalışır.','#111827','0V');
 const pr=W('v1','V','v1-red','PLUG','Kırmızı prob kablosu → VΩmA','Gerilim ölçümünde kırmızı kablo VΩmA girişindedir.','#e53935','MEASURE','6 mm²');pr.probeLead=true;pr.flexOffset=22;
 const pb=W('v1','COM','v1-black','PLUG','Siyah prob kablosu → COM','Siyah kablo COM referans girişindedir.','#111827','MEASURE','6 mm²');pb.probeLead=true;pb.flexOffset=-18;
 p.wires.push(w1,w2,pr,pb);
 p.tutorialExplore={type:'dc-source-connections',nominalVoltage:24,resistance:1000,expectedCurrentA:.024,expectedPowerW:.576,freeProbes:true,measurementPoints:['G1/P · +24 V','R1/1 · yük girişi','R1/2 · yük çıkışı','G1/M · 0 V']};
 return p;
}
function groundingConductorProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-1p',80,240,'G1','L/N/PE kaynak'),C('x1','terminal-pe',390,250,'XPE1','PE klemensi'),C('e1','ground',700,250,'PE1','Topraklama elektrodu')];
 p.wires.push(W('g1','PE','x1','1','Kaynak PE → klemens','Koruma iletkeni PE klemensinden geçirilir.','#16a34a','PE'),W('x1','2','e1','PE','Klemens → toprak','PE iletkeninin topraklama noktasına sürekliliğini tamamlar.','#16a34a','PE'));return p;
}
function equipotentialProject(id,title){
 const p=base(id,title);p.components=[C('g1','supply-1p',70,250,'G1','L/N/PE kaynak'),C('b1','bar-pe',360,250,'BPE','Eş potansiyel PE barası'),C('x1','terminal-pe',650,180,'XPE1','PE klemensi'),C('s1','socket-power',650,400,'X1','Topraklı priz'),C('e1','ground',900,250,'PE1','Topraklama elektrodu')];
 p.wires.push(W('g1','PE','b1','1','Kaynak PE → bara/1','Ana PE iletkeni eş potansiyel baraya girer.','#16a34a','PE'),W('b1','4','x1','1','Bara/4 → PE klemensi','Koruma iletkeni dağıtılır.','#16a34a','PE'),W('x1','2','s1','PE','PE klemensi → priz PE','Priz gövde koruması eş potansiyel baraya bağlıdır.','#16a34a','PE'),W('b1','5','e1','PE','Bara/5 → toprak elektrodu','Eş potansiyel baranın toprak bağlantısıdır.','#16a34a','PE'));return p;
}
function junctionProject(id,title){
 // One physical box, two distinct conductor splice symbols. A single
 // building-junction electrically unites all its pins; L and N must never
 // share that one simulated node.
 const p=base(id,title,'building');
 p.components=[
  C('g1','supply-1p',60,240,'G1','1 faz kaynak'),
  C('j1','building-junction',350,140,'B1-L','Buat içi faz ek noktası'),
  C('j2','building-junction',350,360,'B1-N','Buat içi nötr ek noktası'),
  C('h1','ceiling-light',700,240,'H1','Aydınlatma armatürü')
 ];
 p.wires.push(
  W('g1','L','j1','1','L → buat faz eki/1','Faz ayrı iletken ekinden armatüre dağıtılır.','#e53935','L1'),
  W('j1','2','h1','X1','Buat faz eki/2 → armatür L','Faz yolu nötr ekinden fiziksel ve elektriksel olarak ayrıdır.','#e53935','L1'),
  W('g1','N','j2','3','N → buat nötr eki/3','Nötr, aynı kutudaki farklı ek noktası üzerinden geçer.','#1e88e5','N'),
  W('j2','4','h1','X2','Buat nötr eki/4 → armatür N','Nötr dönüşü faz ekine bağlanmadan armatüre ulaşır.','#1e88e5','N')
 );
 return p;
}
function busTapProject(id,title){
 const p=base(id,title,'building');p.components=[C('g1','supply-1p',70,240,'G1','1 faz kaynak'),C('bt','one-line-bus-tap',340,240,'BT1','Bara çıkış tapı'),C('f1','mcb-1p',580,240,'F1','Çıkış sigortası'),C('r1','resistor',820,240,'R1','1 kΩ örnek yük',{resistance:1000})];
 p.wires.push(W('g1','L','bt','1','L → bara tapı','Bara çıkış noktası fazdan beslenir.','#e53935','L1'),W('bt','2','f1','1','Tap → sigorta','Çıkış kolu koruma elemanından geçer.','#e53935','L1'),W('f1','2','r1','1','Sigorta → yük','Korunmuş faz yüke gider.','#e53935','L1'),W('r1','2','g1','N','Yük → N','Yük nötr dönüşüyle devreyi tamamlar.','#1e88e5','N'));return p;
}
function phoneProject(id,title){
 const p=base(id,title,'building');p.components=[C('f1','phone-floor-box',100,240,'KTK','Kat telefon terminal kutusu'),C('a1','phone-apartment-box',470,240,'DTK','Daire telefon terminal kutusu'),C('t1','telephone',800,240,'T1','Telefon cihazı')];
 p.wires.push(W('f1','a','a1','a','KTK a → DTK a','Telefon çiftinin a damarı aynı polariteyle devam eder.','#43a047','SIGNAL'),W('f1','b','a1','b','KTK b → DTK b','Telefon çiftinin b damarı aynı polariteyle devam eder.','#43a047','SIGNAL'),W('a1','a','t1','a','DTK a → telefon a','Daire kutusundan telefona ilk damar gider.','#43a047','SIGNAL'),W('a1','b','t1','b','DTK b → telefon b','İkinci damar telefon devresini tamamlar.','#43a047','SIGNAL'));return p;
}
function antennaProject(id,title){
 const p=base(id,title,'building');p.components=[C('d1','satellite-dish',90,240,'ANT1','Çanak anten'),C('a1','antenna-distributor',430,240,'AD1','Anten dağıtım kutusu'),C('tv','tv-socket',760,240,'TV1','TV prizi')];
 p.wires.push(W('d1','OUT','a1','IN','Anten OUT → dağıtıcı IN','Koaksiyel RF sinyali dağıtıcı girişine gelir.','#43a047','SIGNAL'),W('a1','OUT','tv','IN','Dağıtıcı OUT → TV prizi','Dağıtılmış RF hattı TV prizine gider.','#43a047','SIGNAL'));return p;
}
function knxLightingProject(id,title){
 const p=base(id,title,'building');p.components=[C('ps','knx-power',80,220,'PS1','KNX güç kaynağı'),C('lg','knx-logic',390,220,'A1','KNX lojik modül'),C('ac','knx-actuator',680,220,'A2','KNX anahtarlama aktüatörü'),C('h1','ceiling-light',930,220,'H1','Aydınlatma yükü')];
 p.wires.push(W('ps','BUS+','lg','BUS+','KNX BUS+ → lojik','KNX haberleşme/besleme pozitif hattıdır.','#43a047','SIGNAL'),W('ps','BUS−','lg','BUS−','KNX BUS− → lojik','KNX bus dönüş hattıdır.','#43a047','SIGNAL'),W('lg','1','ac','BUS+','Lojik çıkış → aktüatör BUS+','Eğitim gösteriminde lojik komut aktüatöre taşınır.','#43a047','SIGNAL'),W('lg','2','ac','BUS−','Lojik dönüş → aktüatör BUS−','Komut çiftinin dönüşüdür.','#43a047','SIGNAL'));p.controlRelation={actuator:'ac',load:'h1'};return p;
}

function componentBasicsProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/manyetik röle|röle uç/.test(t))return topicBoard(id,title,[['coil-relay','Manyetik röle bobini'],['contact-both','Röle değiştirici kontağı']]);
 if(/termostat/.test(t))return topicBoard(id,title,[['tutorial-thermostat','Termostat'],['sensor-ntc','Sıcaklık algılama örneği']]);
 if(/ir alıcı.*verici|ir verici.*alıcı/.test(t))return topicBoard(id,title,[['tutorial-ir-transmitter','IR verici'],['tutorial-ir-receiver','IR alıcı']]);
 if(/ir alıcı/.test(t))return topicBoard(id,title,[['tutorial-ir-receiver','IR alıcı'],['arduino-uno','Kontrol / okuma kartı']],'arduino');
 if(/mikrofon/.test(t))return topicBoard(id,title,[['tutorial-microphone','Mikrofon'],['tutorial-opamp','Ön yükselteç']]);
 if(/hoparlör/.test(t))return topicBoard(id,title,[['tutorial-speaker','Hoparlör'],['tutorial-opamp','Ses yükselteç bloğu']]);
 if(/alkışla/.test(t))return topicBoard(id,title,[['tutorial-microphone','Mikrofon'],['arduino-sound-sensor','Ses algılama modülü'],['coil-relay','Röle bobini']],'arduino');
 if(/zaman gecikmeli.*çalış|turn on/.test(t))return topicBoard(id,title,[['coil-delay-on','Gecikmeli çeken zaman rölesi']]);
 if(/zaman gecikmeli.*duran|turn off/.test(t))return topicBoard(id,title,[['coil-delay-off','Gecikmeli bırakan zaman rölesi']]);
 if(/arıza|test|sağlamlık|avometre|multimetre/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],['tutorial-troubleshooting','Arıza arama / ölçüm akışı']]);
 if(/direnç|rezist/.test(t)){if(/uygulama|devre|ölç|temrin|zaman sabit/.test(t))return {p:resistorMeasureProject(id,title),kind:'wiring'};return topicBoard(id,title,[['resistor','Direnç'],['unit-ut33d-plus','Multimetre']]);}
 if(/kondansatör/.test(t)){if(/uygulama|devre|ölç|temrin|zaman|r-c|rc/.test(t))return {p:rcTransientProject(id,title),kind:'wiring'};return topicBoard(id,title,[['capacitor','Kondansatör'],['unit-ut33d-plus','Multimetre']]);}
 if(/bobin|endüktans|reaktör/.test(t)){if(/uygulama|devre|ölç|temrin/.test(t))return {p:rlTransientProject(id,title),kind:'wiring'};return topicBoard(id,title,[['reactor','Bobin / endüktans'],['unit-ut33d-plus','Multimetre']]);}
 if(/foto diyot|fotodiyot/.test(t))return topicBoard(id,title,[['tutorial-diode','Fotodiyotun diyot yapısı'],['photoeye','Optik algılama örneği']]);
 if(/diyot|yarı iletken diyot/.test(t))return topicBoard(id,title,[['tutorial-diode','Diyot · anot/katot'],['arduino-diode-1n4007','1N4007 gerçek diyot']],'arduino');
 if(/transistör/.test(t)){const type=/pnp/.test(t)?'PNP':'NPN';if(/uygulama|devre|anahtar|temrin|çalış/.test(t))return {p:bjtSwitchProject(id,title,type),kind:'wiring'};return topicBoard(id,title,[[type==='PNP'?'bd140-pnp':'bd139-npn',type==='PNP'?'BD140 PNP transistör':'BD139 NPN transistör'],['unit-ut33d-plus','Multimetre']]);}
 if(/termistör|ntc/.test(t))return topicBoard(id,title,[['sensor-ntc','NTC termistör'],['unit-ut33d-plus','Multimetre']]);
 if(/ptc/.test(t))return topicBoard(id,title,[['sensor-ptc','PTC termistör'],['unit-ut33d-plus','Multimetre']]);
 if(/optik|foto transistör/.test(t))return topicBoard(id,title,[['photoeye','Optik sensör / fotoelektrik eleman']]);
 if(/breadboard|delikli plaket/.test(t))return topicBoard(id,title,[['tutorial-pcb','Breadboard / prototip plaket kavramı']]);
 return topicBoard(id,title,[['tutorial-concept',title]])
}
function numberSystemsProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/gray/.test(t))return topicBoard(id,title,[['tutorial-number-gray','Gray kod']]);
 if(/bcd/.test(t))return topicBoard(id,title,[['tutorial-number-bcd','BCD kod']]);
 if(/hex|onaltılık/.test(t))return topicBoard(id,title,[['tutorial-number-hex','Onaltılık sayı sistemi']]);
 if(/onluk|decimal/.test(t))return topicBoard(id,title,[['tutorial-number-decimal','Onluk sayı sistemi']]);
 if(/ikilik|binary/.test(t))return topicBoard(id,title,[['tutorial-number-binary','İkilik sayı sistemi']]);
 return topicBoard(id,title,[['tutorial-number-binary','İkilik sistem'],['tutorial-number-decimal','Onluk sistem'],['tutorial-number-hex','Onaltılık sistem']])
}
function pcbProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/gerber|üretim dosya/.test(t))return topicBoard(id,title,[['tutorial-gerber','Gerber üretim katmanları'],['tutorial-pcb-layout','PCB yerleşimi']]);
 if(/pcb|patern|yerleşim|baskı devre/.test(t))return topicBoard(id,title,[['tutorial-schematic-editor','Şematik çizim'],['tutorial-pcb-layout','PCB yerleşimi'],['tutorial-pcb','Fiziksel baskı devre']]);
 if(/sanal ölç|ölçü aleti/.test(t))return topicBoard(id,title,[['tutorial-virtual-instrument','Sanal ölçü aleti'],['unit-ut33d-plus','Gerçek multimetre karşılığı']]);
 if(/simülasyon|isis|proteus/.test(t))return topicBoard(id,title,[['tutorial-schematic-editor','Şematik devre çizimi'],['tutorial-virtual-instrument','Sanal simülasyon / ölçüm aracı']]);
 return topicBoard(id,title,[['tutorial-schematic-editor','Şematik devre çizimi'],['tutorial-pcb-layout','PCB yerleşimi']])
}
function workshopProject(id,title){
 const t=title.toLocaleLowerCase('tr-TR');
 if(/kişisel koruyucu|iş güvenliği|iş sağlığı|atölye.*risk|ilk yardım|koruyucu önlem/.test(t))return topicBoard(id,title,[['tutorial-ppe','Kişisel koruyucu donanım']]);
 if(/lehim|plaket|baskı devre/.test(t))return topicBoard(id,title,[[/baskı devre|plaket/.test(t)?'tutorial-pcb':'tutorial-soldering',/baskı devre|plaket/.test(t)?'Baskı devre / plaket':'Lehimleme istasyonu'],['tutorial-soldering','Lehimleme araçları']]);
 if(/uzunluk ölç|mikrometre|kesme|mengene|delme|vidalama|eğeleme|zımpara|taşlama|bükme|kıvırma|el alet|mekanik bağlantı/.test(t))return topicBoard(id,title,[['tutorial-hand-tools','İlgili atölye el aletleri']]);
 return topicBoard(id,title,[['tutorial-concept',title]])
}

function explicitTitleProject(l){
 const t=l.title.toLocaleLowerCase('tr-TR'),id=l.id,title=l.title;
 if(id==='sensor-analog-apps-src-13')return {p:industrialSensorLoadProject(id,title,'proximity','Endüktif PNP sensör'),kind:'wiring'};
 if(id==='sensor-analog-apps-src-14')return {p:industrialSensorLoadProject(id,title,'sensor-through-beam','Optik PNP algılama sensörü'),kind:'wiring'};
 if(id==='sensor-analog-apps-src-15')return topicBoard(id,title,[['tutorial-solar-cell','Fotovoltaik güneş hücresi'],['unit-ut33d-plus','DC gerilim ölçme aracı'],['resistor','Temsili direnç yükü']]);
 // MQ-07 targeted correction: an NTC lesson must actually contain an NTC, not RV1.
 if(id==='opamp-apps-src-08')return {p:resistiveSensorComparatorProject(id,title,'sensor-ntc','NTC sıcaklık sensörü'),kind:'wiring'};
 if(id==='opamp-apps-src-07')return {p:resistiveSensorComparatorProject(id,title,'ldr-gl5528','LDR foto direnç'),kind:'wiring'};
 if(l.topicId==='dc-circuits'&&t==='doğru akım ve kullanım alanları')return {p:dcUsageProject(id,title),kind:'explore',explanation:'Serbest prob deneyi ile doğru akımın yönünü, gerilim farkını ve Ohm Kanunu ilişkisini gözlemleyin.'};
 if(/soft starter/.test(t))return topicBoard(id,title,[['softstarter','Soft-starter güç modülü'],['motor-3p','Üç faz asenkron motor']]);
 if(/lcr metrelerin yapısı|lcr metre/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],['tutorial-lcr-meter','LCR metre'],['resistor','Ölçüm örneği direnç'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]);
 if(/voltmetre ile gerilim ölçümü/.test(t))return {p:dcVoltageMeasurementRichProject(id,title),kind:'wiring',explanation:'Ayarlanabilir 24 VDC kaynak, 1 kΩ yük ve UNI-T UT33D+ ile gerilim ölçümü yapılır. 24 V, DCV 20 V sınırını aştığı için DCV 200 V seçilir. Voltmetre devre yoluna seri girmez; ölçülecek iki noktaya paralel temas eder. R1 ve kaynak uçlarında yaklaşık +24 V, aynı düğümde 0 V, problar ters çevrilince yaklaşık −24 V beklenir.'};
 if(/^multimetre ile direnç ölçümü$/.test(t))return {p:resistanceMeasurementRichProject(id,title),kind:'explore',explanation:'R1=1 kΩ direnç harici beslemeden tamamen ayrılmış halde ölçülür. Ayarlanabilir kaynak yalnız OFF / devreden ayrılmış referans olarak görünür. UNI-T UT33D+ Ω 2 kΩ kademesinde, kırmızı VΩmA ve siyah COM problarıyla R1 uçlarına temas eder; yaklaşık 1,000 kΩ beklenir. Problar kısa devre edildiğinde ≈0 Ω, açık bırakıldığında OL görülür.'};
 if(/multimetre.*direnç ölçümü/.test(t))return {p:board(id,title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],['resistor','Beslemesiz ölçülecek direnç'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]),kind:'quiz',explanation:'Direnç ölçümü enerjisiz yapılır. Multimetre probları direncin iki ucuna bağlanır; harici besleme uygulanmaz.'};
 if(/multimetre.*direnç ölçme/.test(t))return {p:board(id,title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],...( /lcr/.test(t)?[['tutorial-lcr-meter','LCR metre']]:[]),['resistor','Beslemesiz ölçülecek direnç'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]),kind:'quiz',explanation:'Direnç ölçümü enerjisiz yapılır. Multimetre probları direncin iki ucuna bağlanır; harici besleme uygulanmaz.'};
 if(/ohm kanunu/.test(t)&&l.topicId==='dc-circuits'&&!l.project.components.some(c=>c.typeId==='meter-voltmeter'))return {p:dcOhm(id,title),kind:'wiring'};
 if(/dc kaynakları ve bağlantıları/.test(t))return {p:dcSourceProject(id,title),kind:'wiring'};
 if(/temel topraklama iletkeni bağlantısı/.test(t))return {p:groundingConductorProject(id,title),kind:'wiring'};
 if(/eş potansiyel bara bağlantısı/.test(t))return {p:equipotentialProject(id,title),kind:'wiring'};
 if(/buat içi bağlantı/.test(t))return {p:junctionProject(id,title),kind:'wiring'};
 if(/busbar çıkış kutusu ve yük bağlantısı/.test(t))return {p:busTapProject(id,title),kind:'wiring'};
 if(/telefon terminal kutusu bağlantısı/.test(t))return {p:phoneProject(id,title),kind:'wiring'};
 if(/anten tesisatı temel bağlantısı/.test(t))return {p:antennaProject(id,title),kind:'wiring'};
 if(/akıllı ev aydınlatma ve güneşlik kontrolü/.test(t))return {p:knxLightingProject(id,title),kind:'wiring'};
 if(/^ampermetre ile akım ölçümü$/.test(t))return {p:dcCurrentMeasurementRichProject(id,title),kind:'wiring',explanation:'Ayarlanabilir 24 VDC kaynak ve 1 kΩ yükte ideal akım 24 mA’dır. UNI-T UT33D+ DCA 200 mA kademesinde, kırmızı VΩmA ve siyah COM problarıyla akım yoluna seri bağlanır. Ampermetre yük öncesine veya dönüş tarafına taşındığında aynı yaklaşık 24 mA akım görülür; prob yönü ters çevrilince işaret negatif olur.'};
 if(/^pens ampermetre ile akım ölçümü$/.test(t))return {p:clampCurrentMeasurementRichProject(id,title),kind:'explore',explanation:'UNI-T UT200A pens ampermetre ACA 2 A kademesinde, 230 VAC / 230 Ω eğitim devresinin yalnız tek iletkenini çenesiyle kavrayarak yaklaşık 1 A RMS ölçer. Kablo kesilmez ve cihaz seri bağlanmaz. Ayarlanabilir DC kaynak görseli ortak öğretim standardı olarak OFF / devreden ayrılmış referans biçiminde korunur; UT200A pens akım işlevi DC akım ölçümü için kullanılmaz.'};
 if(/pens ampermetre ile akım ölçümü/.test(t))return {p:dcMeasurementProject(id,title,'current'),kind:'wiring'};
 if(/alternatif akımda kondansatör/.test(t))return {p:acReactiveProject(id,title,'capacitor'),kind:'wiring'};
 if(/alternatif akımda bobin/.test(t))return {p:acReactiveProject(id,title,'inductor'),kind:'wiring'};
 if(/regüle devre/.test(t))return {p:regulatedSupplyProject(id,title),kind:'wiring'};
 if(/r-c seri|rc seri|zaman sabiti/.test(t))return {p:rcTransientProject(id,title),kind:'wiring'};
 if(/(^|[^a-zçğıöşü])(bobin|endüktans|reaktör)([^a-zçğıöşü]|$)/.test(t)&&/uygulama|devre|ölç|alternatif akım/.test(t))return {p:/alternatif akım/.test(t)?acReactiveProject(id,title,'inductor'):rlTransientProject(id,title),kind:'wiring'};
 if(/pnp.*transistör|transistör.*pnp/.test(t))return {p:bjtSwitchProject(id,title,'PNP'),kind:'wiring'};
 if(/npn.*transistör|transistör.*npn/.test(t))return {p:bjtSwitchProject(id,title,'NPN'),kind:'wiring'};
 if(/transistör.*(anahtar|uygulama|devre)|temrin.*transistör/.test(t))return {p:bjtSwitchProject(id,title,'NPN'),kind:'wiring'};
 if(l.topicId==='opamp-apps'&&/uygulama|devre|eviren|evirmeyen|izleyici|karşılaştırıcı|toplayıcı|çıkarıcı|türev|integral|schmitt/.test(t))return {p:opampCircuitProject(id,title),kind:'wiring'};
 if(/senkron sayıcı|asenkron sayıcı/.test(t))return null; // burada “senkron” motor değil dijital zamanlamadır
 if(/mosfet/.test(t))return topicBoard(id,title,[['tutorial-mosfet','MOSFET'],...(/dc motor|motor hız/.test(t)?[['motor-dc','DC motor']]:[['resistor','Gate / yük direnci']])]);
 if(/[iı]gbt/.test(t))return topicBoard(id,title,[['tutorial-igbt','IGBT'],...(/dimmer/.test(t)?[['supply-1p','AC kaynak'],['standard-light','Kontrollü AC yük']]:[['resistor','Gate / yük direnci']])]);
 if(/lm35/.test(t))return topicBoard(id,title,[['arduino-lm35','LM35 sıcaklık sensörü'],['arduino-uno','Arduino UNO / ADC okuma']],'arduino');
 if(/flip.?floplar/.test(t))return topicBoard(id,title,[['tutorial-ff-rs','RS Flip-Flop'],['tutorial-ff-jk','JK Flip-Flop'],['tutorial-ff-d','D Flip-Flop'],['tutorial-ff-t','T Flip-Flop']]);
 if(/d tipi flip.?flop/.test(t))return topicBoard(id,title,[['tutorial-ff-d','D Flip-Flop']]);
 if(/t .*tipi flip.?flop|toggle.*flip.?flop/.test(t))return topicBoard(id,title,[['tutorial-ff-t','T Flip-Flop']]);
 if(/jk.*flip.?flop/.test(t))return topicBoard(id,title,[['tutorial-ff-jk','JK Flip-Flop']]);
 if(/rs.*flip.?flop/.test(t))return topicBoard(id,title,[['tutorial-ff-rs','RS Flip-Flop']]);
 if(/adc.*dac|dac.*adc/.test(t))return topicBoard(id,title,[['tutorial-adc','ADC · Analog → Dijital'],['tutorial-dac','DAC · Dijital → Analog']]);
 if(/potansiyometre.*adc|adc.*potansiyometre/.test(t))return topicBoard(id,title,[['arduino-uno','Arduino UNO'],['arduino-pot','Potansiyometre'],['tutorial-adc','UNO içindeki ADC işlevi']],'arduino');
 if(/enkoderler|incremental encoder|artımlı enkoder/.test(t))return topicBoard(id,title,[['encoder-incremental','Fotoelektrik artımlı enkoder'],...(/motor/.test(t)?[['motor-3p','Dönen motor / mil']]:[])]);

 if(/multimetre.*direnç|direnç.*multimetre|lcr.*direnç/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','Dijital multimetre'],...(/lcr/.test(t)?[['tutorial-lcr-meter','LCR metre']]:[]),['resistor','Ölçülecek direnç'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]);
 if(/multimetre.*gerilim|gerilim.*multimetre/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','Dijital multimetre'],['supply-dc-plus','24 VDC kaynak'],['resistor','Dirençli yük'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]);
 if(/multimetre.*akım|akım.*multimetre/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','Dijital multimetre'],['supply-dc-plus','24 VDC kaynak'],['resistor','Akım sınırlayan dirençli yük'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]);
 if(/dijital multimetre|multimetrelerin yapısı|uygun kademe seçimi/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','Dijital multimetre'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob'],['resistor','Örnek direnç']]);
 if(/diyot.*uç|diyot.*sağlamlık|sağlamlık.*diyot/.test(t))return topicBoard(id,title,[['tutorial-diode','Diyot · anot/katot'],['unit-ut33d-plus','Dijital multimetre']]);
 if(/takometre/.test(t))return topicBoard(id,title,[['tutorial-tachometer','Dijital takometre'],['motor-3p','Dönen motor / mil']]);
 if(/lcr metrelerin yapısı|lcr metre/.test(t))return topicBoard(id,title,[['tutorial-lcr-meter','LCR metre'],['resistor','Örnek direnç'],['capacitor','Örnek kondansatör'],['reactor','Örnek endüktans']]);
 if(/direnç-kondansatör|rc kuplaj|r-c seri/.test(t))return topicBoard(id,title,[['resistor','R · direnç'],['capacitor','C · kondansatör'],['arduino-bd139','Örnek yükselteç/anahtarlama transistörü']],'arduino');
 if(/dağıtım transformatör.*sargı direnç/.test(t))return topicBoard(id,title,[['transformer-3p','Üç faz dağıtım transformatörü'],['unit-ut33d-plus','Dijital multimetre']]);
 if(/kondansatörlü motor/.test(t))return topicBoard(id,title,[['motor-1p','Bir fazlı asenkron motor'],['capacitor','Yardımcı sargı kondansatörü']]);
 if(/güneş pilli.*aydınlat/.test(t))return topicBoard(id,title,[['tutorial-solar-cell','Güneş pili'],['tutorial-battery','Şarj edilen akü/pil'],['standard-light','Bahçe aydınlatma yükü']]);
 if(/plc-kontaktör.*motor güç|plc.*kontaktör.*motor güç/.test(t))return topicBoard(id,title,[['plc-hw-6es7211-1ae40-0xb0','S7-1211C PLC'],['coil-contactor','Kontaktör bobini'],['main-contact','Kontaktör güç kontakları'],['motor-3p','Üç faz motor']]);
 if(/kumanda butonları|buton çeşitleri|butonların devreye bağlantıları/.test(t))return topicBoard(id,title,[['push-no','NO buton'],['push-nc','NC buton'],['mushroom-nc','Acil durdurma / mantar buton']]);
 if(/sinyal lamba.*buton|buton.*sinyal lamba/.test(t))return topicBoard(id,title,[['push-no','NO kumanda butonu'],['push-nc','NC kumanda butonu'],['lamp-green','Yeşil sinyal lambası'],['lamp-red','Kırmızı sinyal lambası']]);
 if(/(^|\.\s*)sigortalar\s*$/.test(t))return topicBoard(id,title,[['fuse','Silindirik sigorta'],['mcb-1p','Otomatik sigorta']]);
 if(/aşırı akım.*faz koruma.*zaman röle.*sinyal lamba/.test(t))return topicBoard(id,title,[['overload','Aşırı akım rölesi'],['motor-protection-relay','Faz koruma rölesi'],['coil-delay-on','Zaman rölesi'],['lamp-green','Sinyal lambası']]);
 if(/sinyal lamba/.test(t)&&!/motor.*sinyal/.test(t))return topicBoard(id,title,[['lamp-green','Yeşil sinyal lambası'],['lamp-red','Kırmızı sinyal lambası']]);
 if(/yüksek gerilim sigorta/.test(t))return topicBoard(id,title,[['tutorial-hv-fuse','Yüksek gerilim sigortası']]);
 if(/servo mekanizma/.test(t))return topicBoard(id,title,[['hcfa-sv-x2ea040a-a','Servo sürücü'],['hcfa-sv-x2mh040a-n2ln','Servo motor']]);
 if(/plc.*kontaktör.*asenkron motor/.test(t))return topicBoard(id,title,[['plc-hw-6es7211-1ae40-0xb0','S7-1211C PLC'],['coil-contactor','Kontaktör bobini'],['main-contact','Kontaktör güç kontakları'],['motor-3p','Üç faz asenkron motor']]);
 if(/plc.*kontaktör/.test(t))return topicBoard(id,title,[['plc-hw-6es7211-1ae40-0xb0','S7-1211C PLC'],['coil-contactor','Kontaktör bobini'],['main-contact','Kontaktör güç kontakları']]);
 if(/üç fazlı asenkron motor.*devir yön|üç fazlı asenkron motor.*bir buton|motor yön değiştirme.*kontaktör/.test(t))return {p:clone(L.byId['motor-forward-reverse-1'].project),kind:/devir yön|yön değiştirme/.test(t)?'wiring':'quiz'};
 if(/aydınlatma.*priz|priz.*aydınlatma/.test(t))return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['mcb-1p','Linye sigortası'],['ceiling-light','Aydınlatma armatürü'],['socket-power','Topraklı priz']],'building');
 if(/prizlerde topraklama|priz.*topraklama/.test(t))return topicBoard(id,title,[['socket-power','Topraklı priz'],['terminal-pe','PE klemensi'],['ground','Koruma toprağı']],'building');
 if(/data.*telefon priz|telefon.*data.*priz/.test(t))return topicBoard(id,title,[['tutorial-data-outlet','Data prizi'],['phone-apartment-box','Telefon terminal/priz bağlantısı'],['tutorial-conduit','PVC kanal / güzergâh']],'building');
 if(/pvc kanal.*priz|priz.*pvc kanal/.test(t))return topicBoard(id,title,[['tutorial-conduit','PVC tesisat kanalı'],['socket-power','Topraklı enerji prizi']],'building');
 if(/döşeme altı.*enerji.*data.*telefon/.test(t))return topicBoard(id,title,[['socket-power','Enerji prizi'],['tutorial-data-outlet','Data prizi'],['phone-apartment-box','Telefon prizi/terminali']],'building');
 if(/busbar.*priz.*aydınlatma|busbar.*aydınlatma.*priz/.test(t))return topicBoard(id,title,[['one-line-bus-tap','Busbar çıkış modülü'],['socket-power','Priz modülü'],['ceiling-light','Aydınlatma modülü']],'building');
 if(/telefon ve anten tesisat/.test(t))return topicBoard(id,title,[['phone-floor-box','Telefon terminal kutusu'],['antenna-distributor','Anten dağıtım kutusu']],'building');
 if(/akıllı ev.*aydınlatma/.test(t))return topicBoard(id,title,[['knx-logic','KNX lojik modül'],['knx-actuator','KNX anahtarlama aktüatörü'],['ceiling-light','Aydınlatma yükü']],'building');
 if(/fan-coil/.test(t))return topicBoard(id,title,[['knx-logic','KNX kontrol'],['knx-actuator','KNX aktüatör'],['tutorial-fancoil','Fan-Coil ünitesi']],'building');
 if(/vrf|vrv/.test(t))return topicBoard(id,title,[['knx-logic','Bina otomasyon kontrolü'],['tutorial-vrf','VRF / VRV sistemi']],'building');
 if(/üç fazlı fiş.*priz|üç fazlı.*fiş ve priz/.test(t))return topicBoard(id,title,[['supply-3p','Üç faz kaynak'],['tutorial-threephase-plug','Üç fazlı fiş'],['tutorial-threephase-socket','Üç fazlı priz']],'building');
 if(/üç fazlı fiş/.test(t))return topicBoard(id,title,[['supply-3p','Üç faz kaynak'],['tutorial-threephase-plug','Üç fazlı fiş']],'building');
 if(/üç fazlı priz/.test(t))return topicBoard(id,title,[['supply-3p','Üç faz kaynak'],['tutorial-threephase-socket','Üç fazlı priz']],'building');
 if(/koaksiyel.*f konnektör|f konnektör/.test(t))return topicBoard(id,title,[['tutorial-f-connector','F konnektör'],['tutorial-tv-outlet','TV / anten prizi']],'building');
 if(/multiswitch/.test(t))return topicBoard(id,title,[['tutorial-multiswitch','Multiswitch'],['tutorial-tv-outlet','TV / anten prizi']],'building');
 if(/dış aydınlatma|sokak aydınlatma/.test(t))return topicBoard(id,title,[['tutorial-outdoor-light','Dış aydınlatma armatürü/direği'],...(/fotosel/.test(t)?[['photoeye','Fotosel sensör']]:[])],'building');
 if(/borulama|boruların döşen|pvc kanal/.test(t))return topicBoard(id,title,[['tutorial-conduit','Tesisat borusu / kanal']],'building');
 if(/kılavuz.*çek|iletken.*boru.*çek|kablo.*çek/.test(t))return topicBoard(id,title,[['tutorial-conduit','Tesisat borusu / kanal'],['tutorial-cable-pulling','İletken / kablo çekme']],'building');
 if(/buat/.test(t))return topicBoard(id,title,[['tutorial-junction-box','Buat / ek kutusu'],['terminal-2-array-4','Bağlantı klemensleri']],'building');
 if(/tam sayı veri tipi|kayan noktalı|merker|temel uygulama makro/.test(t))return topicBoard(id,title,[['plc-hw-6es7211-1ae40-0xb0','PLC CPU · veri belleği / programlama']]);
 if(/ikili sayı|onlu sayı|onaltılı sayı|binary|hexadecimal|bcd|gray kod|sayıların.*dönüştür/.test(t))return numberSystemsProject(id,title);
 if(/boolean/.test(t))return topicBoard(id,title,[['tutorial-boolean','Boolean mantığı']]);
 if(/karnaugh/.test(t))return topicBoard(id,title,[['tutorial-karnaugh','Karnaugh haritası']]);
 if(/temel lojik kap|lojik kapılar|değil \(not\)|exor|exnor|özel veya/.test(t))return logicProject(id,title);
 if(/tiva|driver yükleme/.test(t))return topicBoard(id,title,[['tutorial-tiva-board','TIVA TM4C123GXL geliştirme kartı']]);
 if(/sketch|ilk programın yazılması/.test(t))return topicBoard(id,title,[['arduino-uno','Arduino UNO / mikrodenetleyici kartı']],'arduino');
 if(/simülasyon program|programda simülasyon|yazılım arayüz|yeni proje oluşturma|bileşen kütüphanesi|tasarım alanı|snap|proje dosyası|terminaller modu/.test(t))return pcbProject(id,title);
 if(/osiloskop/.test(t))return topicBoard(id,title,[['arduino-signal-generator','Sinyal jeneratörü'],['arduino-oscilloscope','İki kanallı osiloskop']],'arduino');
 if(/toplam diren|kirşof/.test(t))return {p:dcNetwork(id,title,/kirşof/.test(t)?'kirchhoff':'series'),kind:'wiring'};
 if(/(^|\s)akım(\s|$)|akım birim/.test(t))return topicBoard(id,title,[['supply-dc-plus','DC kaynak'],['meter-ammeter','Ampermetre'],['resistor','Dirençli yük']]);
 if(/(^|\s)gerilim(\s|$)/.test(t))return topicBoard(id,title,[['supply-dc-plus','DC kaynak'],['meter-voltmeter','Voltmetre'],['resistor','Dirençli yük']]);
 if(/alternatif akım/.test(t))return topicBoard(id,title,[['supply-1p','1 faz AC kaynak'],['resistor','Dirençli AC yük'],['meter-voltmeter','AC gerilim ölçümü']]);
 if(/elektriksel güç|(^|\.)\s*güç\s*$/.test(t))return topicBoard(id,title,[['supply-1p','1 faz kaynak'],['tutorial-wattmeter','Wattmetre'],['resistor','Dirençli yük']]);
 if(/elektriksel iş|elektrik enerjisi|enerji tüketim|elektrik sayacı/.test(t))return topicBoard(id,title,[['meter-kwh-1p','Aktif enerji sayacı'],['resistor','Örnek tüketici']]);
 if(/bobin|endüktans/.test(t))return topicBoard(id,title,[['reactor','Bobin / endüktans'],['tutorial-lcr-meter','LCR metre']]);
 if(/transformatör/.test(t))return topicBoard(id,title,[['transformer-3p','Transformatör'],['unit-ut33d-plus','Ölçüm multimetresi']]);
 if(/faz fark|vektörlerle göster|tek ve üç fazlı sistem/.test(t))return topicBoard(id,title,[['supply-3p','Üç faz kaynak'],['tutorial-cosphimeter','Faz / güç katsayısı göstergesi']]);
 if(/polarma|polarizasyon/.test(t))return topicBoard(id,title,[['arduino-bd139','NPN transistör'],['resistor','Bias / polarma direnci']],'arduino');
 if(/iletken|kablo çeş|kablo bağlant|kablo.*özellik/.test(t))return topicBoard(id,title,[['tutorial-conductor-cable','İletken / kablo'],['terminal-2','Bağlantı klemensi']]);
 if(/elektronik devre çizim/.test(t))return topicBoard(id,title,[['tutorial-schematic-editor','Elektronik şematik çizimi']]);
 if(/diyod.*okun|diyot.*okun|diyod.*sağlamlık/.test(t))return topicBoard(id,title,[['tutorial-diode','Diyot'],['unit-ut33d-plus','Dijital multimetre']]);
 if(/röleli devre/.test(t))return topicBoard(id,title,[['coil-relay','Röle bobini'],['contact-both','Röle değiştirici kontağı']]);
 if(/doğrultma/.test(t))return topicBoard(id,title,[['rectifier','Doğrultucu köprü'],['capacitor','Filtre kondansatörü']]);
 if(/regüle devre/.test(t))return topicBoard(id,title,[['rectifier','Doğrultucu'],['capacitor','Filtre kondansatörü'],['smps','Regüle 24 VDC güç kaynağı']]);
 if(/patern/.test(t))return topicBoard(id,title,[['tutorial-pcb-layout','PCB patern / yerleşim'],['tutorial-pcb','Baskı devre kartı']]);
 if(/numaralandırma|pabuç|yüksük/.test(t))return topicBoard(id,title,[['terminal-2-array-4','Klemens grubu'],['cable-marker','Kablo / iletken numaralandırma']]);
 if(/genlik modül|frekans modül|verici devre|alıcı devre/.test(t))return topicBoard(id,title,[[/alıcı/.test(t)?'tutorial-rf-receiver':'tutorial-rf-transmitter',/alıcı/.test(t)?'Alıcı bloğu':'Verici bloğu'],['arduino-signal-generator','Test / modülasyon sinyali']],'arduino');
 if(/yükselteç|kuplaj|miller|boot strobe|schmitt/.test(t))return topicBoard(id,title,[['tutorial-opamp','Yükselteç / karşılaştırıcı bloğu'],['resistor','Direnç'],['capacitor','Kondansatör']]);
 if(/kırpıcı|kenetleyici|clamper|clipping|pals ürete/.test(t))return oscillatorProject(id,title);
 if(/kumanda elemanlarının sembol|elektriksel kumanda eleman/.test(t))return topicBoard(id,title,[['push-no','NO buton'],['push-nc','NC buton'],['coil-contactor','Kontaktör bobini'],['contact-no','Yardımcı kontak'],['overload','Koruma rölesi']]);
 if(/koruma ve kumanda röle/.test(t))return topicBoard(id,title,[['coil-relay','Kumanda rölesi'],['overload','Aşırı akım rölesi'],['motor-protection-relay','Faz koruma rölesi']]);
 if(/kumanda test devre/.test(t))return topicBoard(id,title,[['supply-dc-plus','24 VDC kaynak'],['push-no','START butonu'],['push-nc','STOP butonu'],['coil-relay','Röle bobini'],['lamp-green','Çıkış / sinyal lambası']]);
 if(/baz.?tiz/.test(t))return topicBoard(id,title,[['tutorial-opamp','Ses yükselteç / ton bloğu'],['potentiometer','Bas / tiz ayar potansiyometresi'],['resistor','Direnç'],['capacitor','Kondansatör']]);
 if(/\bgm verici/.test(t))return topicBoard(id,title,[['tutorial-rf-transmitter','GM / AM verici bloğu'],['arduino-signal-generator','Modülasyon sinyali']],'arduino');
 if(/temel mantık devre|birleşik mantık devre/.test(t))return topicBoard(id,title,[['tutorial-logic-and','AND kapısı'],['tutorial-logic-or','OR kapısı'],['tutorial-logic-not','NOT kapısı']]);
 if(/aritmetik mantık devre/.test(t))return topicBoard(id,title,[['tutorial-full-adder','Tam toplayıcı'],['tutorial-comparator','Dijital karşılaştırıcı']]);
 if(/ardışık mantık devre/.test(t))return topicBoard(id,title,[['tutorial-ff-d','D Flip-Flop'],['tutorial-ff-jk','JK Flip-Flop']]);
 if(/devre kurma malzemeleri|elektrik devre elemanları|temel elektrik devresi/.test(t))return topicBoard(id,title,[['supply-dc-plus','DC kaynak'],['resistor','Direnç'],['push-no','Anahtar / buton'],['tutorial-conductor-cable','İletken / kablo']]);
 if(/elektrik devre çeşitleri/.test(t))return topicBoard(id,title,[['resistor','Seri / paralel direnç örneği 1'],['resistor','Seri / paralel direnç örneği 2'],['supply-dc-plus','DC kaynak']]);
 if(/elektriksel büyüklük/.test(t))return topicBoard(id,title,[['meter-ammeter','Akım · ampermetre'],['meter-voltmeter','Gerilim · voltmetre'],['resistor','Direnç']]);
 if(/fiziksel ölçme uygulama/.test(t))return topicBoard(id,title,[['tutorial-hand-tools','Fiziksel ölçme / kontrol araçları']]);
 if(/elektriksel ölçme uygulama/.test(t))return topicBoard(id,title,[['unit-ut33d-plus','Dijital multimetre'],['tutorial-lcr-meter','LCR metre']]);
 if(/atölye ve laboratuvar/.test(t))return topicBoard(id,title,[['tutorial-ppe','Kişisel koruyucu donanım'],['tutorial-hand-tools','Atölye araçları']]);
 if(/el testeresi/.test(t))return topicBoard(id,title,[['tutorial-hand-tools','El testeresi / kesme aracı']]);
 return null;
}

/* Önce temel 80 ders: mevcut doğru devreleri koru, fakat çocuk için malzeme ve adım açıklamalarını ekle. */
for(const l of L.lessons){
 if(!/-src-/.test(l.id)){
  l.learningGoal='Ders sonunda '+l.title.toLocaleLowerCase('tr-TR')+' uygulamasındaki elemanları ve enerji/işaret yolunu kendi cümlenizle açıklayabilmek.';
  l.beginnerSteps=['Eleman adlarını ve terminal yazılarını okuyun.','Beslemenin hangi uçtan başladığını bulun.','Kumanda elemanının hangi durumda yolu açıp kapattığını izleyin.','Yükün veya çıkışın nasıl enerjilendiğini gözleyin.'];
  l.materials=materialRows(l.project);
  l.pedagogyReview={version:'v1.19.0-pedagogy10',reviewed:true,title:l.title,componentIds:l.project.components.map(c=>c.typeId),noSubstitute:true};
 }
}

const arduinoButtonLed=L.byId['button-led-5'];
if(arduinoButtonLed){
 arduinoButtonLed.learningGoal='Butonun D2 pininden okunmasını, programın bu durumu D13 çıkışına aktarmasını ve LED akımının 220 Ω dirençle sınırlandırılmasını açıklayabilmek.';
 arduinoButtonLed.beginnerSteps=['Ayarlı DC kaynağı 5 V olarak kullanın ve ortak 0 V referansını bulun.','Buton modülünün VCC, GND ve SIG uçlarını okuyun.','Buton SIG ucunun Arduino D2 girişine gittiğini izleyin.','Arduino D13 çıkışının 220 Ω seri direnç üzerinden LED anotuna gittiğini izleyin.','Simülasyonda giriş durumunun LED çıkışına nasıl aktarıldığını karşılaştırın.'];
}

/* Kaynaklardan genişletilen her ders tek tek başlığına göre yeniden eşleştirilir. */
for(const l of L.lessons.filter(x=>/-src-|-outline-/.test(x.id))){
 const originalProject=clone(l.project);
 let r=explicitTitleProject(l);
 if(!r)switch(l.topicId){
  case 'dc-circuits':r=dcProject(l.id,l.title);break;
  case 'measurement-workshop':r=measurementProject(l.id,l.title);break;
  case 'installation-grounding':r=groundingProject(l.id,l.title);break;
  case 'installation-systems':r=installationProject(l.id,l.title);break;
  case 'electronic-component-basics':r=componentBasicsProject(l.id,l.title);break;
  case 'electronic-switching':r=electronicProject(l.id,l.title);break;
  case 'sensor-analog-apps':r=sensorProject(l.id,l.title);break;
  case 'opamp-apps':r=opampProject(l.id,l.title);break;
  case 'oscillator-filter-apps':r=oscillatorProject(l.id,l.title);break;
  case 'digital-logic-apps':r=logicProject(l.id,l.title);break;
  case 'digital-sequential-apps':r=sequentialProject(l.id,l.title);break;
  case 'number-systems':r=numberSystemsProject(l.id,l.title);break;
  case 'microcontroller-apps':r=mcuProject(l.id,l.title);break;
  case 'motor-direct-power':r=motorDirectProject(l.id,l.title,l.project);break;
  case 'motor-start-speed':r=motorStartProject(l.id,l.title);break;
  case 'motor-braking':r=motorBrakeProject(l.id,l.title);break;
  case 'motor-special':r=motorSpecialProject(l.id,l.title);break;
  case 'motor-sequence':r=motorSequenceProject(l.id,l.title);break;
  case 'plc-hardware-programming':r=plcProject(l.id,l.title,l.project);break;
  case 'vfd-servo-control':r=driveProject(l.id,l.title);break;
  case 'panel-power-systems':r=panelProject(l.id,l.title);break;
  case 'workshop-safety-mechanics':r=workshopProject(l.id,l.title);break;
  case 'circuit-simulation-pcb':r=pcbProject(l.id,l.title);break;
 }
 if(!r)r=topicBoard(l.id,l.title,[]);
 /* Kaynak ders zaten tam kabloluysa ve başlıktaki ana cihaz ailesini gerçekten içeriyorsa,
    onu bileşen panosuna düşürmek yerine özgün bağlantılı devreyi koru. */
 if((r.kind||'quiz')!=='wiring'&&!(r.p?.wires?.length)&&originalProject?.wires?.length){
  const ids=originalProject.components.map(c=>c.typeId),topic=l.topicId;
  const relevant=(topic==='microcontroller-apps'&&ids.some(id=>id==='arduino-uno'))||
   (topic==='plc-hardware-programming'&&ids.some(id=>/^plc-/.test(id)))||
   (topic==='vfd-servo-control'&&ids.some(id=>/vfd|sinamics-v20|hcfa-sv-x2e/.test(id)))||
  (['motor-direct-power','motor-start-speed','motor-braking','motor-special','motor-sequence'].includes(topic)&&ids.some(id=>/(^|-)motor|hcfa-sv-x2mh/.test(id))&&!/mosfet|igbt|soft starter|oto trafo|ototrafo|dahlander|\bvfd\b|invertör/.test(l.title.toLocaleLowerCase('tr-TR'))&&!(topic==='motor-special'&&/kondansatörlü motor/.test(l.title.toLocaleLowerCase('tr-TR'))&&!ids.some(id=>/capacitor/.test(id))));
  if(relevant)r={p:originalProject,kind:'wiring',explanation:'Kaynak uygulamadaki gerçek terminal bağlantıları korunmuştur; devre başlığındaki cihazlarla çalışır.'};
 }
 setLesson(l,r.p,{kind:r.kind||'quiz',explanation:r.explanation});
}


/* Devre/uygulama/ölçüm diye adlandırılan R/L/C/BJT dersleri boş malzeme panosu olarak kalamaz. */
for(const l of L.lessons.filter(x=>/-src-|-outline-/.test(x.id))){
 if(l.topicId==='dc-circuits'&&/ohm kanunu/i.test(l.title)&&!l.project.components.some(c=>c.typeId==='meter-voltmeter'))setLesson(l,dcOhm(l.id,l.title),{kind:'wiring'});
 if(/multimetre.*direnç ölç(ümü|me)/i.test(l.title)){setLesson(l,board(l.id,l.title,[['unit-ut33d-plus','UNI-T UT33D+ multimetre'],...(/lcr/i.test(l.title)?[['tutorial-lcr-meter','LCR metre']]:[]),['resistor','Beslemesiz ölçülecek direnç'],['test-probe-red','Kırmızı prob'],['test-probe-black','Siyah prob']]),{kind:'quiz',explanation:'Direnç ölçümü enerjisiz yapılır. Multimetre probları direncin iki ucuna bağlanır; harici besleme uygulanmaz.'});continue}
 if(l.project?.wires?.length&&l.kind!=='wiring')setLesson(l,l.project,{kind:'wiring',explanation:l.explanation});
 if(l.project?.wires?.length)continue;
 const t=l.title.toLocaleLowerCase('tr-TR');let p=null;
 if(/ohm kanunu/.test(t))p=dcOhm(l.id,l.title);
 else if(/multimetre.*direnç|direnç.*ölçüm|direnç ölçümü/.test(t)&&!/multimetre ile direnç ölçümü/.test(t))p=resistorMeasureProject(l.id,l.title);
 else if(/frekansmetre.*frekans ölçümü/.test(t))p=frequencyMeasureProject(l.id,l.title);
 else if(/wattmetre.*güç ölçümü/.test(t))p=wattmeterProject(l.id,l.title);
 else if(/kosinüsfimetre.*güç katsayısı/.test(t))p=powerFactorProject(l.id,l.title);
 else if(/elektrik sayacı.*enerji ölçümü/.test(t))p=energyMeterProject(l.id,l.title);
 else if(/takometre.*ölçüm/.test(t))p=tachometerProject(l.id,l.title);
 else if(/sensör sinyalinin multimetre/.test(t))p=multimeterSensorProject(l.id,l.title);
 else if(/termokupl uygulaması/.test(t))p=thermocoupleProject(l.id,l.title);
 else if(/pt100 uygulaması/.test(t))p=pt100Project(l.id,l.title);
 else if(/lm35.*uygulama/.test(t))p=lm35Project(l.id,l.title);
 else if(/reed.*uygulama/.test(t))p=reedProject(l.id,l.title);
 else if(/r-c seri|rc seri|zaman sabiti|kondansatör.*(devre|uygulama|ölçüm)/.test(t))p=rcTransientProject(l.id,l.title);
 else if(/bobin|endüktans|reaktör/.test(t)&&/devre|uygulama|ölçüm|alternatif akım/.test(t))p=/alternatif akım/.test(t)?acReactiveProject(l.id,l.title,'inductor'):rlTransientProject(l.id,l.title);
 else if(/pnp.*transistör|transistör.*pnp/.test(t))p=bjtSwitchProject(l.id,l.title,'PNP');
 else if(/npn.*transistör|transistör.*npn|transistör.*(anahtar|uygulama|devre)|temrin.*transistör/.test(t))p=bjtSwitchProject(l.id,l.title,'NPN');
 if(p)setLesson(l,p,{kind:'wiring',explanation:/takometre/i.test(t)?'Temassız takometre motor miline yöneltilerek devir sayısını okur; elektrik terminaline bağlanmaz. Bu derste simüle edilen devre yalnızca üç faz motor beslemesidir; takometrenin optik ölçümü simüle edilmez.':'Bu uygulama dersinde elemanlar konuya özgü gerçek R/L/C/BJT davranışıyla ve eksiksiz terminal bağlantılarıyla çalışır.'});
}


/* QA: sınır anahtarı adı geçen yön devrelerinde anahtarlar gerçekten bobin yoluna seri girer. */
for(const l of L.lessons.filter(x=>/sınır anahtarı|iki sınır anahtarı/i.test(x.title))){
 const p=l.project,ids=new Set((p.components||[]).map(x=>x.id));
 if(!(ids.has('ls1')&&ids.has('ls2')&&ids.has('coilF')&&ids.has('coilR')))continue;
 for(const w of p.wires){
  if(w.to?.c==='coilF'&&w.to?.p==='A1'&&['startF','holdF'].includes(w.from?.c))w.to={c:'ls1',p:'21'};
  if(w.to?.c==='coilR'&&w.to?.p==='A1'&&['startR','holdR'].includes(w.from?.c))w.to={c:'ls2',p:'21'};
 }
 if(!p.wires.some(w=>w.from?.c==='ls1'&&w.to?.c==='coilF'))p.wires.push(W('ls1','22','coilF','A1','İleri sınır → K1/A1','İleri uç konuma gelince NC sınır anahtarı K1 bobinini bırakır.','#e53935','L1'));
 if(!p.wires.some(w=>w.from?.c==='ls2'&&w.to?.c==='coilR'))p.wires.push(W('ls2','22','coilR','A1','Geri sınır → K2/A1','Geri uç konuma gelince NC sınır anahtarı K2 bobinini bırakır.','#e53935','L1'));
 setLesson(l,p,{kind:'wiring',explanation:l.explanation});
}
/* QA: KNX dersindeki aydınlatma yükü aktüatörün fiziksel çıkışına bağlı kalır. */
for(const l of L.lessons.filter(x=>/akıllı ev aydınlatma ve güneşlik kontrolü/i.test(x.title))){
 const p=l.project;
 if(p.components.some(x=>x.id==='ac')&&p.components.some(x=>x.id==='h1')){
  if(!p.wires.some(w=>w.to?.c==='h1'))p.wires.push(W('ac','1','h1','X1','Aktüatör çıkışı → aydınlatma','KNX aktüatör çıkışı aydınlatma yüküne gider.','#e53935','L1'),W('ac','2','h1','X2','Aktüatör dönüşü → aydınlatma','Aydınlatma yükünün dönüş yolu tamamlanır.','#1e88e5','N'));
  setLesson(l,p,{kind:'wiring',explanation:l.explanation});
 }
}

/* Doğru akım ve kullanım alanları: generic konu panosu yerine gerçek serbest-prob laboratuvarı. */
for(const l of L.lessons.filter(x=>x.topicId==='dc-circuits'&&x.title.toLocaleLowerCase('tr-TR')==='doğru akım ve kullanım alanları')){
 l.kind='explore';
 l.steps=[];
 if(l.project?.tutorialLesson)l.project.tutorialLesson.phase='explore';
 l.summary='24 VDC kaynak, 100 Ω direnç yükü ve gerçek UNI-T multimetre üzerinden doğru akımın yönünü, gerilim farkını ve ölçüm mantığını serbest prob deneyiyle öğrenir.';
 l.learningGoal='DC kaynağın kutuplarını, akım yönünü, yükün görevini, iki nokta arasındaki gerilimi ve I=V/R ilişkisini kendi ölçümünle açıklayabilmek.';
 l.explanation='Devre 24 VDC kaynak ve 100 Ω dirençten oluşur. Teorik akım 0,24 A’dır. Multimetre başlangıçta DCV 200 V kademesindedir. Kırmızı ve siyah problar hiçbir ölçüm noktasına kilitli değildir; prob gövdelerini sürükleyerek kaynak ucuna, direnç ucuna veya kablo üzerine değdirip ölçüm sonucunu karşılaştırabilirsiniz.';
 l.beginnerSteps=[
  'Önce +24 V ve 0 V uçlarını bulun; doğru akımın + uçtan yüke doğru ilerlediğini düşünün.',
  'R1 · 100 Ω yükün devrede neden akım sınırladığını inceleyin.',
  'Simülasyonu başlatın ve kırmızı/siyah probu farklı iki noktaya sürükleyin.',
  'Aynı elektrik düğümündeki iki noktayı ölçtüğünüzde yaklaşık 0 V; +24 V ile 0 V arasında yaklaşık 24 V görmeyi bekleyin.',
  'Probları ters çevirince ölçüm işaretinin ters döndüğünü gözleyin.',
  'Akım ölçümünün gerilim ölçümü gibi paralel değil, devre açılarak seri yapılması gerektiğini öğrenin.'
 ];
 l.materials=materialRows(l.project);
 l.quiz={question:'Gerilim 24 V iken direnç 100 Ω ise ideal devre akımı kaç amperdir?',options:['0,24 A','2,4 A','24 A'],answer:0,why:'Ohm Kanunu: I=V/R=24/100=0,24 A.'};
 l.dcUsageRich=true;
}

/* Özel başlangıç seviyesi açıklamaları. */
for(const l of L.lessons.filter(x=>x.topicId==='dc-circuits')){
 if(/ohm/i.test(l.title)){
  l.summary='Ohm Kanununu lamba gibi farklı davranan bir yük üzerinden değil, doğrudan kütüphanedeki direnç üzerinden ölçerek öğrenir.';
  l.learningGoal='Gerilim, akım ve direncin ne olduğunu; ampermetrenin neden seri, voltmetrenin neden paralel bağlandığını açıklayabilmek.';
  l.beginnerSteps=['24 VDC kaynağın P (+) ve M (0 V) uçlarını bulun.','R1 direncinin iki ucu arasında gerilim düşümü oluşacağını bilin.','Ampermetreyi akım yolunu kesip araya seri bağlayın.','Voltmetreyi R1’in iki ucuna paralel bağlayın.','Simülasyonda U, I ve R değerlerinin birbirine bağlı olduğunu gözleyin.'];
 }
}

/* Faz 6: kaynak ders açıklamaları son ders içeriği, gerçek elemanlar ve bağlantı adımlarıyla örtüşür. */
for(const l of L.lessons.filter(x=>/-src-|-outline-/.test(x.id))){
 const p=l.project||{},cs=p.components||[],ws=p.wires||[],labels=cs.map(c=>String(c.label||c.ref||c.typeId)),hasPLC=cs.some(c=>/^plc-|^plc-hw/.test(c.typeId));
 const actual=labels.slice(0,6).join(', ')+(labels.length>6?' ve diğer '+(labels.length-6)+' eleman':'');
 l.summary=l.kind==='wiring'&&ws.length?'“'+l.title+'” dersi '+actual+' elemanları arasındaki '+ws.length+' gerçek terminal bağlantısını ve bunların çalışma amacını gösterir.':'“'+l.title+'” dersi bağlı devre simülasyonu değil, '+actual+' elemanlarının görevlerini tanıtan bir görsel/konu çalışmasıdır.';
 if(/^Bu derste yalnız|^Bu derste .* için gerekli elemanlar kullanılır|^Bu uygulama dersinde elemanlar konuya özgü gerçek R\/L\/C\/BJT davranışıyla/i.test(l.explanation||'')){
  if(l.kind==='wiring'&&ws.length){
   const pinName=(cid,pin)=>{const c=cs.find(x=>x.id===cid);return (c?.label||c?.ref||cid)+'/'+pin};
   const links=ws.slice(0,4).map(w=>w.tutorialHint||pinName(w.from?.c,w.from?.p)+' → '+pinName(w.to?.c,w.to?.p));
   let behavior='Bağlantı adımları projedeki gerçek terminal uçlarını izler.';
   if(cs.some(c=>/motor/.test(c.typeId))&&cs.some(c=>/main-contact/.test(c.typeId)))behavior='Kumanda elemanları kontaktör bobinini yönetir; ana kontaklar motorun güç bağlantısını taşır.';
   else if(cs.some(c=>/meter-ammeter/.test(c.typeId))&&cs.some(c=>/meter-voltmeter/.test(c.typeId)))behavior='Ampermetre akım yoluna seri, voltmetre ölçülen elemanın uçlarına paralel bağlanır.';
   else if(cs.some(c=>/meter-ammeter/.test(c.typeId)))behavior='Ampermetre ölçülen akım yoluna seri bağlanır.';
   else if(cs.some(c=>/meter-voltmeter/.test(c.typeId)))behavior='Voltmetre ölçülen elemanın iki ucuna paralel bağlanır; devrenin yük akım yoluna seri girmez.';
   else if(cs.some(c=>/capacitor/.test(c.typeId))||cs.some(c=>/reactor|inductor/.test(c.typeId)))behavior='Kondansatör gerilim değişimine, bobin akım değişimine karşı enerji depolayarak tepki verir.';
   else if(cs.some(c=>/diode|rectifier/.test(c.typeId)))behavior='Diyot akımı ileri yönde iletir; devrede yön ve doğrultma bağlantısı önemlidir.';
   else if(cs.some(c=>/bjt|mosfet|igbt|scr|triac/.test(c.typeId)))behavior='Yarı iletkenin kontrol ucu, ana akım yolunun iletime geçmesini belirler; model eğitim amaçlıdır.';
   else if(cs.some(c=>/push-|contact-|coil-/.test(c.typeId)))behavior='Buton ve yardımcı kontaklar kumanda yolunu açıp kapatır; bobin enerjilenince ilişkili kontak davranışı değişir.';
   if(hasPLC)behavior='PLC donanımı ve uçları tanıtım amaçlıdır; PLC programı ve çıkış mantığı simüle edilmez.';
   l.explanation='“'+l.title+'” dersi '+actual+' elemanlarını kullanır. Gerçek bağlantı adımları: '+links.join('; ')+(ws.length>links.length?'; devamında '+(ws.length-links.length)+' kablo adımı daha':'')+'. '+behavior;
  }else{
   const roles=cs.slice(0,4).map(c=>(c.label||c.ref||c.typeId)+': '+purposeFor(c.typeId,c.label||c.ref));
   l.explanation='“'+l.title+'” için görsel/konu çalışma alanıdır; projede bağlı bir devre olmadığı için devre simülasyonu yapılmaz. Gösterilen elemanların görevleri: '+roles.join(' ')+(hasPLC?' PLC program yürütmesi bu gösterimin kapsamında değildir.':'');
  }
 }
 if(labels.length&&!cs.some(c=>{const label=String(c.label||c.ref||'').trim();return label.length>3&&(l.explanation||'').toLocaleLowerCase('tr-TR').includes(label.toLocaleLowerCase('tr-TR'))}))l.explanation='Bu derste görünen elemanlar: '+labels.slice(0,6).join(', ')+(labels.length>6?' ve diğer '+(labels.length-6)+' eleman':'')+'. '+(l.explanation||'');
 if(hasPLC&&!/PLC programı.*simüle edilmez|PLC program yürütmesi.*kapsamında değildir|PLC programı çalıştırılmaz|PLC programı burada çalıştırılmaz/i.test(l.explanation||''))l.explanation+=' PLC modülleri ürün ve terminal tanıtımı olarak gösterilir; PLC programı simüle edilmez.';
 if(/^Ders sonunda .* konusunun hangi elemanlarla ve hangi temel mantıkla kurulduğunu açıklayabilmek\.$/.test(l.learningGoal||'')){
  const central=labels.slice(0,4).join(', ')||l.title;
  l.learningGoal=l.kind==='wiring'?'Bu dersin sonunda '+l.title+' devresinde '+central+' elemanlarının görevini ve bağlantıların çalışma sonucunu açıklayabilmek.':'Bu dersin sonunda '+l.title+' kapsamında '+central+' elemanlarının görevini ve ele aldıkları kavramı açıklayabilmek.';
 }
 if(labels.length&&!cs.some(c=>{const label=String(c.label||c.ref||'').trim();return label.length>3&&(l.learningGoal||'').toLocaleLowerCase('tr-TR').includes(label.toLocaleLowerCase('tr-TR'))}))l.learningGoal+=' Bu derste kullanılanlar: '+labels.slice(0,4).join(', ')+'.';
 if(l.quiz?.why&&labels.length&&!cs.some(c=>{const label=String(c.label||c.ref||'').trim();return label.length>3&&(l.quiz.why||'').toLocaleLowerCase('tr-TR').includes(label.toLocaleLowerCase('tr-TR'))}))l.quiz.why+=' Ekrandaki gerçek malzemeler: '+labels.slice(0,4).join(', ')+'.';
 if(l.beginnerSteps?.some(s=>/^Önce ekrandaki elemanların adlarını okuyun|^Eleman adlarını ve terminal yazılarını okuyun/.test(s))){
  if(l.kind==='wiring'&&ws.length){
   const first=ws[0],from=cs.find(c=>c.id===first.from?.c),to=cs.find(c=>c.id===first.to?.c),pinName=(c,pin)=>(c?.label||c?.ref||c?.typeId)+'/'+pin;
   l.beginnerSteps=['Ders başlığını ve elemanları okuyun: '+labels.slice(0,5).join(', ')+'.','Kaynağın veya giriş elemanının başladığı terminali bulun.',first.tutorialHint||pinName(from,first.from?.p)+' → '+pinName(to,first.to?.p)+': '+(first.tutorialWhy||'ilk bağlantı adımı.'),hasPLC?'PLC modülünü ürün/uç tanıtımı olarak inceleyin; programı çalıştırmayın.':'Her kablo ucunu elemanın üzerindeki gerçek pin adıyla karşılaştırın.',cs.some(c=>/motor|lamp|led|coil|meter/.test(c.typeId))?'Devrenin kapsamındaki hareket, ışık, bobin veya ölçüm sonucunu izleyin.':'Elemanların görevini ders başlığıyla ilişkilendirin.'];
  }else{
   l.beginnerSteps=['Ders başlığını ve gösterilen elemanları okuyun: '+labels.slice(0,5).join(', ')+'.','Her elemanın adını ve temel görevini kütüphane bilgisiyle eşleştirin.','Çalışma alanında bağlı devre bulunup bulunmadığını kontrol edin.',hasPLC?'PLC donanımını ürün ve terminal tanıtımı olarak inceleyin; PLC programı çalıştırılmaz.':'Elemanların başlıktaki kavramı nasıl temsil ettiğini belirleyin.','Dersin sonunda eleman görevlerini kendi cümlenizle açıklayın.'];
  }
 }
}
/* Temel devre analizinde başlıktaki seri/paralel ve Kirchhoff kazanımlarını gerçek bağlantı ve ölçümlerle göster. */
for(const l of L.lessons){
 if(/seri.*paralel.*karışık|seri-paralel devrelerde/i.test(l.title)||/kirchhoff|kirchoff|kirşof/i.test(l.title)){
  const r=dcProject(l.id,l.title);
  if(r?.p?.wires?.length){
   setLesson(l,r.p,{kind:'wiring',explanation:r.explanation});
   const k=/kirchhoff|kirchoff|kirşof/i.test(l.title);
   l.summary=k?'24 VDC kaynak, A0/A2/A3 akımlarını karşılaştırın. V0, V1 ve V2 ile A0 ölçü aletinin yükünü ve iki direnç bölümünün gerilim düşümlerini ölçün.':'24 VDC kaynak, A1 ampermetre, R1, R2 ve R3 dirençleri kullanılır. R1 seri, R2 ve R3 paralel bağlıdır; V1 ve V2 ile gerilimleri ölçün.';
   l.learningGoal=k?'24 VDC kaynak devresinde Kirchhoff akım kuralını A0=A2+A3 ve gerilim kuralını V0+V1+V2≈24 V ölçümleriyle doğrulayabilmek.':'R1 · 100 Ω seri, R2 · 220 Ω ve R3 · 330 Ω paralel devresinde eşdeğer direnci ve toplam akımı hesaplayabilmek; ampermetrenin seri ve voltmetrenin paralel bağlantısını açıklayabilmek.';
   l.beginnerSteps=k?['24 VDC kaynağı, A0 ampermetresini ve R1 seri direncini bulun.','R1 sonrasında A2–R2 ve A3–R3 paralel kollarının ayrıldığını izleyin.','Her ampermetrenin kendi akım koluna seri, V0/V1/V2 voltmetrelerinin ilgili ölçüm noktalarına paralel bağlandığını kontrol edin.','Simülasyonu çalıştırıp A0 değerini A2+A3 ile karşılaştırın.','A0 ölçü aletinin yük düşümü V0 ile R1 ve paralel kol düşümlerinin V1+V2 toplamının 24 V verdiğini doğrulayın.']:['24 VDC kaynağını, A1 ampermetresini ve R1, R2, R3 dirençlerini bulun.','Kaynak akımının önce R1’den, sonra R2 ve R3 paralel kollarından geçtiğini izleyin.','Ampermetrenin seri bağlı olduğunu ve R2 ile R3’ün iki ortak düğüme bağlandığını kontrol edin.','Simülasyonu çalıştırıp toplam akım ile direnç değerlerini karşılaştırın.','Paralel R2 ve R3 uçlarındaki gerilimin aynı olduğunu gözleyin.'];
  }
 }
}

/* Ölçü aleti derslerinde desteklenmeyen okumaları çalışan simülasyon gibi göstermeyin. */
for(const l of L.lessons){
 const t=l.title.toLocaleLowerCase('tr-TR');let rows=null,explanation='';
 if(/pens ampermetre/.test(t)){
  const p=base(l.id,l.title),lineId='pgw-ut200a-'+l.id;
  p.components=[
   C('g','supply-1p',100,260,'G1','Sanal 230 VAC eğitim kaynağı'),
   C('r','resistor',560,260,'R1','R1 · 230 Ω',{resistance:230}),
   C('cl','unit-ut200a',330,430,'P1','UNI-T UT200A',{meterPosition:1,clampedWireId:lineId,clampT:.5,tutorialPurpose:'UT200A · ACA 2 A: çene tek AC iletkeni kavrar; kabloyu elektriksel olarak kesmeden yaklaşık 1 A RMS akımı ölçer.'})
  ];
  p.wires.push({id:lineId,from:{c:'g',p:'L'},to:{c:'r',p:'1'},color:'#e53935',role:'L1',size:'1.5',points:[],tutorialHint:'L → R1/1 akım taşıyan iletken',tutorialWhy:'UT200A pensi bu tek iletkenin çevresine kapanır; ölçü aleti seri bağlanmaz.'},W('r','2','g','N','R1/2 → N','230 Ω yükün AC akım yolunu tamamlar.','#1e88e5','N'));
  setLesson(l,p,{kind:'wiring',explanation:'UNI-T UT200A seçicisini ACA 2 A kademesine getirin. Simülasyonda çeneyi yalnız faz iletkeninin üzerine bırakın; cihaz kabloyu bölmeden yaklaşık 1 A RMS akımı gösterir. Pens akım işlevi AC içindir; DC iletkende sayısal pens akımı üretilmez.'});
  l.summary='UNI-T UT200A, 230 VAC eğitim devresindeki tek faz iletkenini çenesiyle kavrar ve 2 A AC kademesinde yaklaşık 1 A RMS gösterir.';
  l.learningGoal='UNI-T UT200A pens ampermetreyi devreye seri eklemeden tek AC iletken üzerinde kullanıp uygun 2 A kademesinde simüle edilen akımı okuyabilmek.';
  l.beginnerSteps=['UT200A seçicisini 2 A AC pens kademesine getirin.','Çeneyi yalnız bir akım taşıyan iletkenin üzerine bırakın.','Kabloyu kesmeyin veya ölçü aletini akım yoluna seri eklemeyin.','Simülasyonu çalıştırıp yaklaşık 1 A RMS değerini gözleyin.','Pens akım ölçümünün UT200A modelinde AC akım için olduğunu unutmayın.'];
  continue;
 }else if(/frekansmetre.*frekans ölç|frekans ölç.*frekansmetre/.test(t)){
  rows=[['arduino-signal-generator','1 kHz sinyal kaynağı'],['tutorial-frequency-meter','Frekansmetre']];
  explanation='Frekansmetre giriş uçları ölçülecek sinyalin iki noktasına bağlanır. Bu çalışma alanı bağlantı görevini ve 1 kHz örneğini tanıtır; frekansmetrenin sayısal okuması bu simülatörde hesaplanmaz.';
  l.summary='1 kHz sinyal kaynağı ile frekansmetrenin ölçüm bağlantısı gösterilir; sayısal frekans okuması simüle edilmez.';
  l.learningGoal='Frekansmetreyi ölçülecek sinyalin girişine bağlamayı ve frekans okumasının bu çalışmada simüle edilmediğini açıklayabilmek.';
 }else if(/wattmetre.*kosinüsfimetre/.test(t)){
  rows=[['supply-1p','230 VAC kaynak'],['tutorial-wattmeter','Wattmetre'],['tutorial-cosphimeter','Kosinüsfimetre'],['resistor','Dirençli yük'],['motor-1p','1 faz motor yükü']];
  explanation='Wattmetrenin akım bobini seri, gerilim bobini yüke paralel bağlanır. Kosinüsfimetre aynı tek fazlı yükün gerilim-akım faz ilişkisini ölçer. Bu çalışma alanı iki ölçü aletinin görevini karşılaştırır; AC güç ve güç katsayısı sayısal olarak simüle edilmez.';
  l.summary='Wattmetre aktif gücü, kosinüsfimetre gerilim ile akım arasındaki faz ilişkisini ölçer; bağlantı düzeni tanıtılır ancak sayısal ölçüm simüle edilmez.';
  l.learningGoal='Wattmetre ile kosinüsfimetrenin ölçtüğü büyüklükleri ve bağlantı görevlerini ayırt edebilmek.';
 }else if(/wattmetre.*güç ölç|güç ölç.*wattmetre/.test(t)){
  rows=[['supply-1p','230 VAC kaynak'],['tutorial-wattmeter','Wattmetre'],['resistor','Dirençli yük']];
  explanation='Wattmetrenin akım bobini yüke seri, gerilim bobini ise yük uçlarına paralel bağlanır. Bu çalışma alanı bağlantı yöntemini tanıtır; AC güç ve wattmetre okuması sayısal olarak simüle edilmez.';
  l.summary='Wattmetrenin akım bobini seri, gerilim bobini yüke paralel bağlanır; bu örnekte ölçülen watt değeri simüle edilmez.';
  l.learningGoal='Wattmetrenin akım bobinini seri, gerilim bobinini yüke paralel bağlamayı açıklayabilmek.';
 }else if(/kosinüsfimetre.*güç katsayısı|güç katsayısı.*kosinüsfimetre/.test(t)){
  rows=[['supply-1p','230 VAC kaynak'],['tutorial-cosphimeter','Kosinüsfimetre'],['motor-1p','1 faz motor yükü']];
  explanation='Kosinüsfimetre, tek fazlı yükün gerilim ve akım faz ilişkisini ölçer; akım yolu seri, gerilim bağlantısı yüke paraleldir. Bu çalışma alanı ölçüm düzenini tanıtır; motorun güç katsayısı sayısal olarak simüle edilmez.';
  l.summary='Kosinüsfimetrenin akım ve gerilim bağlantıları 1 faz yük üzerinde tanıtılır; güç katsayısı okuması simüle edilmez.';
  l.learningGoal='Kosinüsfimetrenin akım ve gerilim bağlantılarını ayırt edip güç katsayısının neyi ifade ettiğini açıklayabilmek.';
 }else if(/takometre.*(devir|ölçüm)|devir.*takometre/.test(t)){
  rows=[['motor-3p','Üç faz motor'],['tutorial-tachometer','Temassız takometre']];
  explanation='Temassız takometre motor miline yöneltilir; ölçü aleti motorun elektrik terminallerine bağlanmaz. Bu derste devre simülasyonu yapılmaz; motor beslemesi ve optik RPM ölçümü sayısal olarak modellenmemiştir.';
  l.summary='Temassız takometre motor milinden devir ölçer; elektrik terminaline bağlanmaz ve RPM okuması simüle edilmez.';
  l.learningGoal='Temassız takometreyi motor miline yöneltmeyi ve elektrik bağlantısına dahil etmemeyi açıklayabilmek.';
 }
 if(rows){
  setLesson(l,board(l.id,l.title,rows),{kind:'quiz',explanation});
  l.summary=l.summary||('Bu çalışma alanı '+rows.map(x=>x[1]).join(', ')+' elemanlarını tanıtır; sayısal ölçüm simüle edilmez.');
  l.learningGoal=l.learningGoal||'Ölçü aletinin doğru bağlantı biçimini açıklayabilmek.';
  l.learningGoal+=' Kullanılan elemanlar: '+rows.map(x=>x[1]).join(', ')+'.';
  l.beginnerSteps=['Ders başlığını ve ölçü aletinin gerçek türünü okuyun.','Aletin hangi elektriksel büyüklüğü ölçtüğünü belirleyin.','Akım, gerilim veya temassız ölçüm bağlantı biçimini eleman etiketleriyle karşılaştırın.','Bu ölçümün bu çalışma alanında sayısal olarak simüle edilmediğini dikkate alın.','Doğru bağlantı yöntemini kendi cümlenizle açıklayın.'];
 }
}
for(const l of L.lessons.filter(x=>x.group==='Temel Elektrik')){
 const t=l.title.toLocaleLowerCase('tr-TR'),mode=/multimetre.*akım ölç|akım.*multimetre.*ölç/.test(t)?'current':/multimetre.*gerilim ölç|gerilim.*multimetre.*ölç/.test(t)?'voltage':null;
 if(!mode)continue;
 const r=dcMultimeterPractice(l.id,l.title,mode);setLesson(l,r.p,{kind:'wiring',explanation:r.explanation});
 l.summary=mode==='current'?'UNI-T UT33D+ · DCA 20 mA · VΩmA ile R1 · 2.7 kΩ direncin akımını seri ölçün; beklenen değer yaklaşık 8,9 mA.':'24 VDC kaynak, R1 · 2.7 kΩ direnç ve UNI-T UT33D+ · DCV 200 V · VΩmA ile besleme gerilimini paralel ölçün.';
 l.learningGoal=mode==='current'?'UNI-T UT33D+ · DCA 20 mA · VΩmA kademesini kullanıp R1 · 2.7 kΩ dirençten geçen yaklaşık 8,9 mA akımı seri ölçebilmek.':'24 VDC kaynakta R1 · 2.7 kΩ direnç gerilimini UNI-T UT33D+ · DCV 200 V · VΩmA kademesinde paralel ölçebilmek.';
 l.beginnerSteps=mode==='current'?['Devre akımını 24 V / 2,7 kΩ hesabıyla yaklaşık 8,9 mA bulun.','UNI-T UT33D+ seçicisini DCA 20 mA konumuna getirin.','Kırmızı probu VΩmA, siyah probu COM girişinde tutun.','Devreyi açıp ölçü aletini R1 ile seri bağlayın.','Simülasyonda yaklaşık 8,9 mA değerini ve seri akım yolunu kontrol edin.']:['Ölçülecek gerilimin 24 VDC olduğunu belirleyin.','UNI-T UT33D+ seçicisini DCV 200 V konumuna getirin; DCV 20 V aralığı küçük kalır.','Kırmızı probu VΩmA, siyah probu COM girişinde tutun.','Probları R1’in iki ucuna paralel bağlayın.','Simülasyonda yaklaşık 24 V değerini ve ölçüm noktalarını kontrol edin.'];
}

/* Aynı konu aynı başlıkla kaynak + outline içinde tekrar geldiyse en işlevsel tek dersi koru.
   İç başlıktaki teknik sayıları (14 W / 100 W, 2 bit / 3 bit gibi) silmeyiz. */
const canonicalTitle=s=>String(s||'').toLocaleLowerCase('tr-TR').replace(/^\s*\d+(?:\.\d+)*\.\s*/,'').replace(/^\s*\d+\s*\.?\s*temrin[:\s-]*/,'').replace(/^\s*temrin[:\s-]*/,'').replace(/^\s*uygulama[:\s-]*/,'').replace(/[“”"'’]/g,'').replace(/\s+/g,' ').trim();
const duplicateGroups=new Map();
for(const l of L.lessons){const k=l.topicId+'|'+canonicalTitle(l.title);if(!duplicateGroups.has(k))duplicateGroups.set(k,[]);duplicateGroups.get(k).push(l)}
const removedDuplicateIds=new Set();
const comparisonText=(l,value)=>String(value||'').toLocaleLowerCase('tr-TR').split(String(l.title||'').toLocaleLowerCase('tr-TR')).join('{ders}').replace(/\s+/g,' ').trim();
const lessonContentSignature=l=>JSON.stringify({
 kind:l.kind,
 components:(l.project?.components||[]).map(c=>[c.id,c.typeId,c.ref,c.label,c.resistance,c.capacitance,c.inductance,c.dcVoltage]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),
 wires:(l.project?.wires||[]).map(w=>[w.from?.c,w.from?.p,w.to?.c,w.to?.p,w.role,w.tutorialHint,w.tutorialWhy]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),
 quiz:l.quiz&&[l.quiz.question,l.quiz.options,l.quiz.answer,comparisonText(l,l.quiz.why)],
 goal:comparisonText(l,l.learningGoal),summary:comparisonText(l,l.summary),explanation:comparisonText(l,l.explanation),
 steps:(l.beginnerSteps||[]).map(s=>comparisonText(l,s)),materials:(l.materials||[]).map(m=>[m.typeId,m.label,comparisonText(l,m.why)]).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
});
for(const group of duplicateGroups.values())if(group.length>1){
 const sameContent=new Map();for(const l of group){const signature=lessonContentSignature(l);if(!sameContent.has(signature))sameContent.set(signature,[]);sameContent.get(signature).push(l)}
 for(const clones of sameContent.values())if(clones.length>1){
  const ranked=[...clones].sort((a,b)=>(b.kind==='wiring')-(a.kind==='wiring')+(/-src-/.test(b.id)?1:0)-(/-src-/.test(a.id)?1:0)+(b.project?.wires?.length||0)-(a.project?.wires?.length||0));
  for(const l of ranked.slice(1))removedDuplicateIds.add(l.id);
 }
}
if(removedDuplicateIds.size){L.lessons=L.lessons.filter(l=>!removedDuplicateIds.has(l.id));L.byId=Object.fromEntries(L.lessons.map(l=>[l.id,l]));}

/* Faz 10: tüm derslerde genel ampermetre/voltmetre yer tutucularını gerçek UNI-T cihazlarıyla değiştir.
   UT33D+ AC akım ölçmediği için AC akım derslerinde yeni UT200A pens kullanılır. */
const genericVoltId=id=>['meter-voltmeter','meter-v'].includes(id);
const genericAmpId=id=>['meter-ammeter','meter-a'].includes(id);
const acContext=(l,c)=>{
 const text=(l.title+' '+(c.label||'')+' '+(c.ref||'')).toLocaleLowerCase('tr-TR');
 if(/\bdc\b|4\s*[–-]\s*20\s*ma|24\s*vdc|12\s*vdc|5\s*vdc/.test(text))return false;
 if(/\bac\b|alternatif akım|230\s*vac|faz akımı|kalkış akımı|asenkron|üç faz|3 faz|reaktif/.test(text))return true;
 const ids=l.project.components.map(x=>x.typeId);
 if(ids.includes('arduino-bench-supply'))return false;
 return ids.some(id=>['supply-1p','supply-3p'].includes(id))&&!ids.includes('supply-dc-plus');
};
const otherEnd=(w,cid)=>w.from?.c===cid?clone(w.to):w.to?.c===cid?clone(w.from):null;
const replaceEnd=(w,cid,pin)=>{if(w.from?.c===cid)w.from.p=pin;if(w.to?.c===cid)w.to.p=pin};
const newProbe=(id,type,x,y,ref,label,target)=>C(id,type,x,y,ref,label,{probeTarget:target?clone(target):undefined,tutorialPurpose:type==='test-probe-red'?'Kırmızı UNI-T probu seçilen ölçüm noktasına temas eder.':'Siyah UNI-T probu COM referans ölçüm noktasına temas eder.'});
const directLinks=(p,cid,pin)=>p.wires.filter(w=>(w.from?.c===cid&&w.from?.p===pin)||(w.to?.c===cid&&w.to?.p===pin));
function ensureUT33Probes(l,m){
 const p=l.project,redJack=m.meterPosition===9?'10A':'V',existingRed=p.components.find(c=>c.id===m.id+'-red'),existingBlack=p.components.find(c=>c.id===m.id+'-black');
 if(existingRed&&existingBlack)return;
 const sides=[[redJack,'red'],['COM','black']];
 for(const [pin,color] of sides){
  const links=directLinks(p,m.id,pin),pid=m.id+'-'+color,type=color==='red'?'test-probe-red':'test-probe-black';
  let target=null;
  if(links.length===1){
   const old=links[0];target=otherEnd(old,m.id);p.wires=p.wires.filter(w=>w!==old);
  }
  const probe=newProbe(pid,type,m.x+(color==='red'?-150:150),m.y+170,(color==='red'?'PR':'PB')+(m.ref||m.id),color==='red'?'Kırmızı ölçüm probu':'Siyah ölçüm probu',target);
  p.components.push(probe);
  p.wires.push(W(m.id,pin,pid,'PLUG',(color==='red'?'Kırmızı':'Siyah')+' prob kablosu → '+pin,(color==='red'?'Kırmızı prob ölçüm kademesinin girişine bağlıdır.':'Siyah prob COM girişine bağlıdır.'),color==='red'?'#e53935':'#111827','MEASURE','6 mm²'));
 }
}
function normalizeMeters(l){
 const p=l.project;if(!p?.components)return;
 for(const c of [...p.components]){
  if(genericVoltId(c.typeId)){
   const ac=acContext(l,c),oldLabel=c.label||'';c.typeId='unit-ut33d-plus';c.meterPosition=ac?6:(/\b(5|12|15|18|20)\s*v\b/i.test(oldLabel+' '+l.title)?3:4);c.label='UNI-T UT33D+';c.tutorialPurpose=(ac?'UNI-T UT33D+ · ACV 600 V':'UNI-T UT33D+ · uygun DCV kademesi')+' ile gerilim iki ölçüm noktası arasında paralel ölçülür.';
   for(const w of p.wires){if((w.from?.c===c.id||w.to?.c===c.id)){replaceEnd(w,c.id,(w.from?.c===c.id?w.from.p:w.to.p)==='2'?'COM':'V')}}
  }else if(genericAmpId(c.typeId)){
   const ac=acContext(l,c),links=p.wires.filter(w=>w.from?.c===c.id||w.to?.c===c.id);
   if(ac){
    const oldLabel=c.label||'';c.typeId='unit-ut200a';c.meterPosition=/motor|kalkış/i.test(l.title+' '+oldLabel)?3:1;c.label='UNI-T UT200A';c.tutorialPurpose='UNI-T UT200A pensi tek AC iletkeni kavrayarak devreyi kesmeden akım ölçer.';
    if(links.length===2){
     const a=otherEnd(links[0],c.id),b=otherEnd(links[1],c.id),bridge={...clone(links[0]),id:'pgw-clamp-'+c.id+'-'+String(l.id).replace(/[^\w-]/g,'_'),from:a,to:b,tutorialHint:'UT200A pensinin kavradığı tek AC iletken',tutorialWhy:'Pens akımı devreye seri cihaz eklemeden bu iletken üzerinden ölçülür.'};
     p.wires=p.wires.filter(w=>!links.includes(w));p.wires.push(bridge);c.clampedWireId=bridge.id;c.clampT=.5;
    }
   }else{
    const low=/4\s*[–-]\s*20\s*ma|loop|miliamper|ma\b/i.test(l.title+' '+(c.label||'')),high=/bobin|motor|yük akımı/i.test(l.title+' '+(c.label||''))&&!low;
    c.typeId='unit-ut33d-plus';c.label='UNI-T UT33D+';c.meterPosition=high?9:10;c.tutorialPurpose='UNI-T UT33D+ uygun DCA kademesinde akım yoluna seri bağlanır.';
    const red=c.meterPosition===9?'10A':'V';for(const w of p.wires){if(w.from?.c===c.id)w.from.p=w.from.p==='2'?'COM':red;if(w.to?.c===c.id)w.to.p=w.to.p==='2'?'COM':red}
   }
  }
 }
 for(const m of [...p.components])if(m.typeId==='unit-ut33d-plus')ensureUT33Probes(l,m);
 if(/-src-|-outline-/.test(l.id)){
  const meter=p.components.find(c=>['unit-ut33d-plus','unit-ut200a'].includes(c.typeId)),name=meter?.label;
  if(name)for(const field of ['summary','explanation','learningGoal'])if(l[field]&&!l[field].toLocaleLowerCase('tr-TR').includes(name.toLocaleLowerCase('tr-TR')))l[field]+=' Ölçü aleti: '+name+'.';
 }
 const guided=l.kind==='wiring'||l.project?.tutorialLesson?.phase==='demo'||(Array.isArray(l.steps)&&l.steps.length>0);
 if(guided)l.kind='wiring';else if(!l.kind)l.kind='quiz';
 l.steps=guided?p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı dersin gerçek devre yolunu tamamlar.',color:w.color,role:w.role,size:w.size})):[];
 l.materials=materialRows(p);if(l.pedagogyReview)l.pedagogyReview.componentIds=p.components.map(c=>c.typeId);
}
for(const l of L.lessons)normalizeMeters(l);

/* Kullanıcı kararı: “Doğru akım kaynakları, Ohm ve devre analizi” konusunda yalnız ilk 10 ders kalır. */
const dcLessons=L.lessons.filter(l=>l.topicId==='dc-circuits'),dcKeep=new Set(dcLessons.slice(0,10).map(l=>l.id));
L.lessons=L.lessons.filter(l=>l.topicId!=='dc-circuits'||dcKeep.has(l.id));

/* Final acceptance lock: bu özel ders generic başlık/ölçüm normalizasyonları tarafından bir daha ezilemez. */
const dcUsageFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='doğru akım ve kullanım alanları');
if(dcUsageFinal){
 const p=dcUsageProject(dcUsageFinal.id,dcUsageFinal.title);
 p.projectId='tutorial-session-source-'+dcUsageFinal.id;
 p.name='Öğretici · '+dcUsageFinal.title;
 p.tutorialLesson={id:dcUsageFinal.id,topicId:dcUsageFinal.topicId,phase:'explore',step:0,level:dcUsageFinal.variant};
 dcUsageFinal.project=p;
 dcUsageFinal.workspaceMode=p.workspaceMode;
 dcUsageFinal.kind='explore';
 dcUsageFinal.steps=[];
 dcUsageFinal.summary='24 VDC kaynak, 100 Ω direnç yükü ve gerçek UNI-T multimetre üzerinden doğru akımın yönünü, gerilim farkını ve ölçüm mantığını serbest prob deneyiyle öğrenir.';
 dcUsageFinal.learningGoal='DC kaynağın kutuplarını, akım yönünü, yükün görevini, iki nokta arasındaki gerilimi ve I=V/R ilişkisini kendi ölçümünle açıklayabilmek.';
 dcUsageFinal.explanation='Devre 24 VDC kaynak ve 100 Ω dirençten oluşur. Teorik akım 0,24 A’dır. Multimetre başlangıçta DCV 200 V kademesindedir. Kırmızı ve siyah problar hiçbir ölçüm noktasına kilitli değildir; prob gövdelerini sürükleyerek kaynak ucuna, direnç ucuna veya kablo üzerine değdirip ölçüm sonucunu karşılaştırabilirsiniz.';
 dcUsageFinal.beginnerSteps=[
  'Önce +24 V ve 0 V uçlarını bulun; doğru akımın + uçtan yüke doğru ilerlediğini düşünün.',
  'R1 · 100 Ω yükün devrede neden akım sınırladığını inceleyin.',
  'Simülasyonu başlatın ve kırmızı/siyah probu farklı iki noktaya sürükleyin.',
  'Aynı elektrik düğümündeki iki noktayı ölçtüğünüzde yaklaşık 0 V; +24 V ile 0 V arasında yaklaşık 24 V görmeyi bekleyin.',
  'Probları ters çevirince ölçüm işaretinin ters döndüğünü gözleyin.',
  'Akım ölçümünün gerilim ölçümü gibi paralel değil, devre açılarak seri yapılması gerektiğini öğrenin.'
 ];
 dcUsageFinal.materials=materialRows(p);
 dcUsageFinal.quiz={question:'Gerilim 24 V iken direnç 100 Ω ise ideal devre akımı kaç amperdir?',options:['0,24 A','2,4 A','24 A'],answer:0,why:'Ohm Kanunu: I=V/R=24/100=0,24 A.'};
 dcUsageFinal.dcUsageRich=true;
 dcUsageFinal.pedagogyReview={version:'v1.19.20-pedagogy16-dc-rich',reviewed:true,title:dcUsageFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true};
}
/* Final acceptance lock: DC kaynakları ve bağlantıları dersi zengin bağlantı + ölçüm laboratuvarıdır. */
const dcSourceFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='dc kaynakları ve bağlantıları');
if(dcSourceFinal){
 const p=dcSourceProject(dcSourceFinal.id,dcSourceFinal.title);
 p.projectId='tutorial-session-source-'+dcSourceFinal.id;
 p.name='Öğretici · '+dcSourceFinal.title;
 p.tutorialLesson={id:dcSourceFinal.id,topicId:dcSourceFinal.topicId,phase:'demo',step:0,level:dcSourceFinal.variant};
 dcSourceFinal.project=p;dcSourceFinal.workspaceMode=p.workspaceMode;dcSourceFinal.kind='wiring';
 dcSourceFinal.steps=p.wires.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 dcSourceFinal.summary='24 VDC kaynağın kutuplarını ve kapalı akım yolunu gerçek 1 kΩ yük üzerinde öğrenir; UNI-T UT33D+ ve serbest problarla kaynak/yük gerilimini ölçerek teorik değerlerle karşılaştırır.';
 dcSourceFinal.learningGoal='Ders sonunda +24 V ile 0 V arasındaki farkı, kapalı devre yolunu, 24 V / 1 kΩ = 24 mA hesabını, yük gücünü ve gerilim ölçümünün neden paralel yapıldığını açıklayabilmek.';
 dcSourceFinal.explanation='Kaynak +24 V ucundan R1 yüküne enerji verir; akım R1 üzerinden geçip 0 V hattından kaynağa döner. 1 kΩ yükte teorik akım 24 mA, güç yaklaşık 0,576 W’tır. UNI-T DCV 200 V kademesinde problar R1 uçlarında yaklaşık 24 V görür; simülasyonda probları başka noktalara taşıyıp potansiyel farkını karşılaştırabilirsiniz.';
 dcSourceFinal.beginnerSteps=[
  '+24 V ve 0 V uçlarını ayırt edin; 0 V’un bu devrenin elektriksel referans/dönüş hattı olduğunu bilin.',
  'Kırmızı enerji yolunu izleyin: G1/P → R1/1.',
  'R1 üzerinden geçen akımın R1/2 → G1/M yoluyla kaynağa döndüğünü görün.',
  'Ölçmeden önce tahmin edin: 24 V / 1 kΩ = 24 mA.',
  'Simülasyonda R1 uçlarında yaklaşık 24 V ölçün; aynı düğümde iki nokta seçerseniz yaklaşık 0 V görmeyi bekleyin.',
  'Probları ters çevirerek ölçüm işaretinin değiştiğini gözleyin.',
  'Devreyi yeniden kur modunda yalnız gerçek güç yolunu +24 V → R1 → 0 V sırasıyla kendiniz bağlayın.'
 ];
 dcSourceFinal.materials=materialRows(p);
 dcSourceFinal.quiz={question:'24 VDC kaynak 1 kΩ dirence bağlandığında ideal akım yaklaşık kaç mA olur?',options:['24 mA','240 mA','2,4 A'],answer:0,why:'I=V/R=24/1000=0,024 A=24 mA.'};
 dcSourceFinal.dcSourceRich=true;
 dcSourceFinal.pedagogyReview={version:'v1.19.20-pedagogy17-dc-source-rich',reviewed:true,title:dcSourceFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true};
}

/* Final acceptance lock: Ohm Kanunu deneyi ayarlı kaynak + seri akım + paralel gerilim laboratuvarıdır. */
const ohmFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='ohm kanunu deneyi');
if(ohmFinal){
 const p=dcOhm(ohmFinal.id,ohmFinal.title);
 p.projectId='tutorial-session-source-'+ohmFinal.id;
 p.name='Öğretici · '+ohmFinal.title;
 p.tutorialLesson={id:ohmFinal.id,topicId:ohmFinal.topicId,phase:'explore',step:0,level:ohmFinal.variant};
 ohmFinal.project=p;ohmFinal.workspaceMode=p.workspaceMode;ohmFinal.kind='explore';
 for(const m of [...p.components].filter(c=>c.typeId==='unit-ut33d-plus'))ensureUT33Probes(ohmFinal,m);
 ohmFinal.steps=[];
 ohmFinal.summary='Ayarlanabilir 0–30 VDC masa kaynağı, R1 direnci, seri bağlı UNI-T ampermetre ve R1’e paralel UNI-T voltmetre ile V, I ve R ilişkisini gerçek ölçüm düzeninde keşfeder.';
 ohmFinal.learningGoal='Ayarlı kaynak gerilimi veya R1 direnci değiştiğinde akımın I=V/R bağıntısına göre nasıl değiştiğini ölçerek açıklamak; ampermetrenin seri, voltmetrenin paralel bağlanma nedenini göstermek.';
 ohmFinal.explanation='Başlangıçta G1=24 V ve R1=120 Ω olduğunda ideal akım 0,20 A’dır. G1 ayarını 6/12/18/24 V arasında, R1’i 120/240/470 Ω arasında değiştirerek ölçümü tekrar edin. A1 devre akımını seri, V1 ise R1 gerilimini paralel ölçer. Her durumda hesaplanan I=V/R değeriyle simülasyon sonucunu karşılaştırın.';
 ohmFinal.beginnerSteps=[
  'Ayarlanabilir güç kaynağında başlangıç değerini 24 V olarak okuyun ve +/− terminallerini bulun.',
  'A1 ampermetresinin güç yolu içine seri girdiğini izleyin; akım ölçümünde devre yolu ölçü aletinden geçer.',
  'V1 voltmetresinin R1’in iki ucuna paralel temas ettiğini görün; gerilim ölçümü devreyi kesmez.',
  '24 V ve 120 Ω için I=24/120=0,20 A hesabını yapın ve simülasyonda karşılaştırın.',
  'Kaynağı 6 V, 12 V, 18 V ve 24 V yaparak aynı dirençte akımın doğrusal değişimini gözleyin.',
  'Direnci 120 Ω, 240 Ω ve 470 Ω yaparak aynı gerilimde direnç arttıkça akımın azaldığını gözleyin.',
  'Sonuçları V=I×R, I=V/R ve R=V/I bağıntılarıyla açıklayın.'
 ];
 ohmFinal.materials=materialRows(p);
 ohmFinal.quiz={question:'R1=120 Ω sabitken kaynak gerilimi 12 V’tan 24 V’a çıkarılırsa ideal akım ne olur?',options:['İki katına çıkar','Yarıya düşer','Değişmez'],answer:0,why:'I=V/R. R sabitken V iki katına çıkarsa I de iki katına çıkar.'};
 ohmFinal.ohmRich=true;
 ohmFinal.pedagogyReview={version:'v1.19.20-pedagogy21-ohm-rich',reviewed:true,title:ohmFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true};
}

/* Final acceptance lock: Temel Elektrik 7 · Seri Devre Analizi zengin referans-format laboratuvarıdır. */
const seriesAnalysisFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='seri devre analizi');
if(seriesAnalysisFinal){
 const p=dcSeriesAnalysisProject(seriesAnalysisFinal.id,seriesAnalysisFinal.title);
 setLesson(seriesAnalysisFinal,p,{kind:'wiring',explanation:'Ayarlanabilir DC güç kaynağı 24 V değerindedir. A1 akımı seri ölçer; R1=100 Ω ve R2=220 Ω aynı tek akım yolundadır. V1, R1 uçlarına paralel bağlanır. Rtoplam=320 Ω, I=24/320=0,075 A; VR1=7,5 V ve VR2=16,5 V beklenir. Böylece seri devrede akımın aynı, gerilim düşümlerinin ise dirençlerle orantılı olduğu ölçümle doğrulanır.'});
 seriesAnalysisFinal.summary='Seri devrede tek akım yolunu, toplam direnci, ampermetrenin seri ve voltmetrenin paralel bağlanma nedenini; 24 V / 100 Ω / 220 Ω örneği üzerinden hesaplayıp ölçerek doğrular.';
 seriesAnalysisFinal.learningGoal='Rtoplam=R1+R2 bağıntısını kullanmak; seri devrede akımın her elemanda aynı kaldığını, kaynak geriliminin dirençler arasında paylaşıldığını ve A1/V1 ölçüm bağlantılarının neden seri/paralel olduğunu açıklayabilmek.';
 seriesAnalysisFinal.beginnerSteps=[
  'Önce G1 ayarlanabilir DC güç kaynağını 24 V olarak ve akım yolunu G1 + → A1 → R1 → R2 → G1 − şeklinde oku.',
  'R1 ve R2 seri olduğu için toplam direnci 100 Ω + 220 Ω = 320 Ω olarak hesapla.',
  'I=V/R ile devre akımının yaklaşık 75 mA olması gerektiğini tahmin et; A1’in neden seri bağlı olduğunu açıkla.',
  'V1’i R1 uçlarına paralel bağlı olarak incele; yaklaşık 7,5 V bekle. R2 için yaklaşık 16,5 V hesapla.',
  '7,5 V + 16,5 V ≈ 24 V ve tüm seri elemanlardan aynı 75 mA akım geçtiği sonucunu simülasyonla karşılaştır.'
 ];
 seriesAnalysisFinal.quiz={question:'24 V kaynağa seri bağlı 100 Ω ve 220 Ω dirençlerin ideal devre akımı kaç mA olur?',options:['75 mA','24 mA','320 mA'],answer:0,why:'Rtoplam=100+220=320 Ω ve I=24/320=0,075 A=75 mA.'};
 seriesAnalysisFinal.seriesAnalysisRich=true;
 seriesAnalysisFinal.designStandard='rich-reference-v1';
 seriesAnalysisFinal.pedagogyReview={version:'v1.19.20-pedagogy22-series-rich',reviewed:true,title:seriesAnalysisFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1'};
}

/* Final acceptance lock: Temel Elektrik 8 · Paralel Devre Analizi zengin referans-format laboratuvarıdır. */
const parallelAnalysisFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='paralel devre analizi');
if(parallelAnalysisFinal){
 const p=dcParallelAnalysisProject(parallelAnalysisFinal.id,parallelAnalysisFinal.title);
 setLesson(parallelAnalysisFinal,p,{kind:'wiring',explanation:'Ayarlanabilir DC güç kaynağı 24 V değerindedir. A1 toplam akımı paralel kollar ayrılmadan önce seri ölçer. R1=100 Ω ve R2=220 Ω aynı iki düğüme bağlıdır; bu nedenle VR1=VR2=Vkaynak≈24 V olur. I1=240 mA, I2≈109 mA ve Itoplam≈349 mA beklenir. Req=(100×220)/(100+220)=68,75 Ω’dur.'});
 parallelAnalysisFinal.summary='Paralel devrede ortak düğümleri, kollarda aynı gerilimi, akımın kollara bölünmesini ve toplam akımın kol akımlarının toplamı olmasını 24 V / 100 Ω / 220 Ω örneğiyle hesaplayıp ölçerek doğrular.';
 parallelAnalysisFinal.learningGoal='Paralel devrede VR1=VR2=Vkaynak ve Itoplam=I1+I2 kurallarını açıklamak; eşdeğer direnci hesaplamak; toplam akım için A1’in seri, kol gerilimi için V1’in paralel bağlanma nedenini göstermek.';
 parallelAnalysisFinal.beginnerSteps=[
  'Önce G1 ayarlanabilir DC güç kaynağını 24 V olarak oku; A1’den sonra akımın R1 ve R2 olmak üzere iki kola ayrıldığını gör.',
  'R1 ve R2 aynı pozitif ve negatif düğümlere bağlı olduğundan her iki kolun geriliminin yaklaşık 24 V olduğunu belirle.',
  'R1 için I1=24/100=240 mA, R2 için I2=24/220≈109 mA hesapla.',
  'Toplam akımı Itoplam=I1+I2≈349 mA olarak bul; A1’in neden dallanmadan önce seri bulunduğunu açıkla.',
  'Eşdeğer direnci Req=(100×220)/(100+220)=68,75 Ω olarak hesapla ve 24/68,75≈349 mA sonucuyla karşılaştır.',
  'V1’i R1, R2 ve kaynak uçları arasında kullanarak üç ölçümde de yaklaşık 24 V görmeyi doğrula.'
 ];
 parallelAnalysisFinal.quiz={question:'24 V kaynağa paralel bağlı 100 Ω ve 220 Ω dirençlerde ideal toplam akım yaklaşık kaç mA olur?',options:['349 mA','75 mA','109 mA'],answer:0,why:'I1=24/100=240 mA ve I2=24/220≈109 mA; Itoplam≈240+109=349 mA.'};
 parallelAnalysisFinal.parallelAnalysisRich=true;
 parallelAnalysisFinal.designStandard='rich-reference-v1';
 parallelAnalysisFinal.pedagogyReview={version:'v1.19.20-pedagogy23-parallel-rich',reviewed:true,title:parallelAnalysisFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1'};
}

/* Final acceptance lock: Temel Elektrik 9 · Karışık Devre Analizi zengin referans-format laboratuvarıdır. */
const mixedAnalysisFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='karışık devre analizi');
if(mixedAnalysisFinal){
 const p=dcMixedAnalysisProject(mixedAnalysisFinal.id,mixedAnalysisFinal.title);
 setLesson(mixedAnalysisFinal,p,{kind:'wiring',explanation:'Devre R1 + (R2 || R3) yapısındadır. R2||R3=(220×330)/(220+330)=132 Ω, Rtoplam=100+132=232 Ω ve Itoplam=24/232≈103,45 mA olur. VR1≈10,34 V; paralel grubun gerilimi ≈13,66 V’tur. Bu gerilim altında I2≈62,07 mA ve I3≈41,38 mA olup I2+I3≈103,45 mA ile toplam akımı verir.'});
 for(const m of [...p.components].filter(c=>c.typeId==='unit-ut33d-plus'))ensureUT33Probes(mixedAnalysisFinal,m);
 const mixedProbeIds=new Set(p.components.filter(c=>/^test-probe-/.test(c.typeId)).map(c=>c.id));
 mixedAnalysisFinal.steps=p.wires.filter(w=>!mixedProbeIds.has(w.from?.c)&&!mixedProbeIds.has(w.to?.c)).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı karışık devrenin gerçek yolunu tamamlar.',color:w.color,role:w.role,size:w.size}));
 mixedAnalysisFinal.materials=materialRows(p);
 mixedAnalysisFinal.summary='Seri ve paralel bölümleri aynı devrede ayırmayı; önce R2||R3 paralel eşdeğerini bulup R1 ile toplamayı, ardından toplam akım, gerilim paylaşımı ve kol akımlarını ölçümle doğrulamayı öğretir.';
 mixedAnalysisFinal.learningGoal='R1+(R2||R3) karışık devresini adım adım sadeleştirmek; Rparalel, Rtoplam, Itoplam, VR1, Vparalel, I2 ve I3 değerlerini hesaplamak; I2+I3=Itoplam ve VR1+Vparalel=Vkaynak ilişkilerini açıklamak.';
 mixedAnalysisFinal.beginnerSteps=[
  'Devreyi önce şekil olarak oku: R1 seri, R2 ile R3 ise aynı iki düğüme bağlı paralel kollardır.',
  'Önce paralel kısmı çöz: R2||R3=(220×330)/(220+330)=132 Ω.',
  'Seri toplamı bul: Rtoplam=R1+Rparalel=100+132=232 Ω.',
  'Toplam akımı hesapla: Itoplam=24/232≈103,45 mA. A1’in R1’den önce seri ölçtüğü değer budur.',
  'R1 gerilimini hesapla: VR1=Itoplam×100≈10,34 V. Geriye paralel grup için yaklaşık 13,66 V kalır.',
  'Kol akımlarını bul: I2≈13,66/220=62,07 mA ve I3≈13,66/330=41,38 mA.',
  'Son kontrol: 62,07+41,38≈103,45 mA ve 10,34+13,66≈24 V.'
 ];
 mixedAnalysisFinal.quiz={question:'R1=100 Ω seri ve R2=220 Ω ile R3=330 Ω paralel ise toplam eşdeğer direnç kaç Ω olur?',options:['232 Ω','650 Ω','132 Ω'],answer:0,why:'Önce R2||R3=132 Ω bulunur; sonra seri R1 eklenir: 100+132=232 Ω.'};
 mixedAnalysisFinal.mixedAnalysisRich=true;
 mixedAnalysisFinal.designStandard='rich-reference-v1';
 mixedAnalysisFinal.pedagogyReview={version:'v1.19.20-pedagogy24-mixed-rich',reviewed:true,title:mixedAnalysisFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',physicalProbes:true};
}

/* Final acceptance lock: Temel Elektrik 10 · Kirchhoff kanunlarıyla devre kontrolü. */
const kirchhoffControlFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='kirchhoff kanunlarıyla devre kontrolü');
if(kirchhoffControlFinal){
 const p=dcKirchhoffControlProject(kirchhoffControlFinal.id,kirchhoffControlFinal.title);
 setLesson(kirchhoffControlFinal,p,{kind:'wiring',explanation:'Aynı R1+(R2||R3) ağı üzerinde Kirchhoff akım ve gerilim kuralları ölçümle doğrulanır. Itoplam=24/232≈103,45 mA; I2≈62,07 mA; I3≈41,38 mA ve I2+I3≈Itoplamdır. VR1≈10,34 V; Vparalel≈13,66 V ve VR1+Vparalel≈24 V kaynak gerilimidir.'});
 for(const m of [...p.components].filter(c=>c.typeId==='unit-ut33d-plus'))ensureUT33Probes(kirchhoffControlFinal,m);
 const probeIds=new Set(p.components.filter(c=>/^test-probe-/.test(c.typeId)).map(c=>c.id));
 kirchhoffControlFinal.steps=p.wires.filter(w=>!probeIds.has(w.from?.c)&&!probeIds.has(w.to?.c)).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı Kirchhoff kontrol devresinin gerçek yolunu tamamlar.',color:w.color,role:w.role,size:w.size}));
 kirchhoffControlFinal.materials=materialRows(p);
 kirchhoffControlFinal.summary='Kirchhoff Akım Kanunu’nu aynı düğümde Itoplam=I2+I3; Kirchhoff Gerilim Kanunu’nu aynı çevrede Vkaynak=VR1+Vparalel ilişkileriyle, iki UNI-T ölçü aletini farklı ölçüm noktalarına taşıyarak doğrular.';
 kirchhoffControlFinal.learningGoal='Bir düğümde giren ve çıkan akımları karşılaştırmak; kapalı çevrede gerilim yükselme ve düşümlerinin cebirsel toplamını kontrol etmek; KCL ve KVL’yi aynı gerçek devrede ölçümle açıklamak.';
 kirchhoffControlFinal.beginnerSteps=[
  'Önce devreyi oku: G1 ve R1 seri, R1 sonrasında R2 ve R3 paralel iki kola ayrılır.',
  'A1 toplam akım konumundayken yaklaşık 103,45 mA ölç; sonra A1’i R2 koluna taşı ve yaklaşık 62,07 mA ölç.',
  'A1’i R3 koluna taşı ve yaklaşık 41,38 mA ölç; 62,07+41,38≈103,45 mA ile KCL’yi doğrula.',
  'V1 ile R1 üzerinde yaklaşık 10,34 V ölç.',
  'V1’i paralel bölümün uçlarına taşı ve yaklaşık 13,66 V ölç.',
  'V1’i kaynak uçlarına taşı ve yaklaşık 24 V ölç; 10,34+13,66≈24 V ile KVL’yi doğrula.',
  'Ölçüm cihazlarının devreyi neden seri veya paralel bağlanarak ölçtüğünü kendi cümlenle açıkla.'
 ];
 kirchhoffControlFinal.quiz={question:'Bir düğüme 103,45 mA giriyor ve kollardan birinde 62,07 mA akıyorsa diğer kol akımı yaklaşık kaç mA olmalıdır?',options:['41,38 mA','165,52 mA','10,34 mA'],answer:0,why:'Kirchhoff Akım Kanunu: giren akım çıkan akımların toplamıdır. 103,45−62,07≈41,38 mA.'};
 kirchhoffControlFinal.kirchhoffControlRich=true;
 kirchhoffControlFinal.designStandard='rich-reference-v1';
 kirchhoffControlFinal.pedagogyReview={version:'v1.19.20-pedagogy25-kirchhoff-rich',reviewed:true,title:kirchhoffControlFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',physicalProbes:true};
}

/* Final acceptance lock: Voltmetre ile gerilim ölçümü rich-reference-v1 ölçüm laboratuvarıdır. */
const voltageMeasureFinal=L.lessons.find(l=>l.title.toLocaleLowerCase('tr-TR')==='voltmetre ile gerilim ölçümü');
if(voltageMeasureFinal){
 const p=dcVoltageMeasurementRichProject(voltageMeasureFinal.id,voltageMeasureFinal.title);
 setLesson(voltageMeasureFinal,p,{kind:'wiring',explanation:'G1=24 V ve R1=1 kΩ yük devresinde UNI-T UT33D+ DCV 200 V kademesinde kullanılır. Kırmızı prob VΩmA, siyah prob COM girişindedir. Voltmetre ölçülecek iki noktaya paralel bağlanır; R1 uçlarında ve kaynak uçlarında yaklaşık +24 V, aynı elektriksel düğümde yaklaşık 0 V, problar ters çevrildiğinde yaklaşık −24 V beklenir.'});
 const meter=p.components.find(c=>c.id==='v1');ensureUT33Probes(voltageMeasureFinal,meter);
 const red=p.components.find(c=>c.id==='v1-red'),black=p.components.find(c=>c.id==='v1-black');
 if(red)red.probeTarget={c:'r1',p:'1'};if(black)black.probeTarget={c:'r1',p:'2'};
 const probeIds=new Set(p.components.filter(c=>/^test-probe-/.test(c.typeId)).map(c=>c.id));
 voltageMeasureFinal.steps=p.wires.filter(w=>!probeIds.has(w.from?.c)&&!probeIds.has(w.to?.c)).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı gerçek güç yolunu tamamlar.',color:w.color,role:w.role,size:w.size}));
 voltageMeasureFinal.materials=materialRows(p);
 voltageMeasureFinal.summary='UNI-T UT33D+ ile DC gerilim ölçümünü gerçek prob bağlantısıyla öğretir: uygun DCV kademesini seçme, VΩmA/COM girişlerini kullanma, voltmetreyi paralel bağlama, polarite işaretini ve aynı düğümde 0 V sonucunu yorumlama.';
 voltageMeasureFinal.learningGoal='Gerilimin iki nokta arasındaki potansiyel farkı olduğunu açıklamak; 24 V için DCV 200 V kademesini seçmek; kırmızı VΩmA ve siyah COM prob bağlantılarını yapmak; paralel ölçüm, polarite ve 0 V aynı-düğüm ölçümünü yorumlamak.';
 voltageMeasureFinal.beginnerSteps=[
  'Önce G1 ayarlanabilir güç kaynağının +24 V ve 0 V terminallerini ayırt et.',
  'R1=1 kΩ yükün kaynak uçlarına bağlı olduğunu ve ideal yük akımının 24 V / 1 kΩ = 24 mA olduğunu gör.',
  'UNI-T UT33D+ seçicisini DCV 200 V konumuna getir; 24 V ölçümünde DCV 20 V aralığı yetersizdir.',
  'Kırmızı probun VΩmA, siyah probun COM girişinde olduğunu kontrol et.',
  'R1’in iki ucunu ölç: kırmızı yüksek potansiyeldeyken yaklaşık +24 V gör.',
  'İki probu aynı elektriksel düğüme taşı: yaklaşık 0 V gör.',
  'Probları ters çevir: büyüklük aynı kalırken işaretin yaklaşık −24 V olduğunu gözle.',
  'Voltmetrenin neden seri değil paralel bağlandığını kendi cümlenle açıkla.'
 ];
 voltageMeasureFinal.quiz={question:'24 VDC kaynağı UNI-T UT33D+ ile ölçerken hangi kademe uygundur?',options:['DCV 200 V','DCV 20 V','DCA 200 mA'],answer:0,why:'24 V, 20 V DC ölçüm aralığını aşar. Bu nedenle DCV 200 V kademesi güvenli ve uygundur.'};
 voltageMeasureFinal.voltageMeasurementRich=true;
 voltageMeasureFinal.designStandard='rich-reference-v1';
 voltageMeasureFinal.pedagogyReview={version:'v1.19.20-pedagogy26-voltage-rich',reviewed:true,title:voltageMeasureFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',physicalProbes:true};
}

/* Final acceptance lock: Ampermetre ile akım ölçümü rich-reference-v1 ölçüm laboratuvarıdır. */
const currentMeasureFinal=L.lessons.find(l=>l.title.toLocaleLowerCase('tr-TR')==='ampermetre ile akım ölçümü');
if(currentMeasureFinal){
 const p=dcCurrentMeasurementRichProject(currentMeasureFinal.id,currentMeasureFinal.title);
 setLesson(currentMeasureFinal,p,{kind:'wiring',explanation:'G1=24 V ve R1=1 kΩ için ideal akım I=24/1000=24 mA’dır. UNI-T UT33D+ DCA 200 mA kademesinde kullanılır; kırmızı prob VΩmA, siyah prob COM girişindedir. Akım ölçmek için devre yolu açılır ve ölçü aleti seri araya girer. Yük öncesi ve yük sonrası ölçümlerde aynı yaklaşık 24 mA görülür; prob yönü ters çevrilirse yaklaşık −24 mA okunur.'});
 const meter=p.components.find(c=>c.id==='a1');ensureUT33Probes(currentMeasureFinal,meter);
 const red=p.components.find(c=>c.id==='a1-red'),black=p.components.find(c=>c.id==='a1-black');
 if(red)red.probeTarget={c:'g',p:'P'};if(black)black.probeTarget={c:'r1',p:'1'};
 const probeIds=new Set(p.components.filter(c=>/^test-probe-/.test(c.typeId)).map(c=>c.id));
 currentMeasureFinal.steps=p.wires.filter(w=>!probeIds.has(w.from?.c)&&!probeIds.has(w.to?.c)).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'İşaretlenen terminalleri bağlayın.',why:w.tutorialWhy||'Bu bağlantı gerçek akım yolunu tamamlar.',color:w.color,role:w.role,size:w.size}));
 currentMeasureFinal.materials=materialRows(p);
 currentMeasureFinal.summary='UNI-T UT33D+ ile DC akım ölçümünü gerçek seri bağlantıyla öğretir: uygun DCA kademesini seçme, VΩmA/COM girişlerini kullanma, devre yolunu açıp ölçü aletini araya alma ve seri devrenin farklı noktalarında aynı akımı doğrulama.';
 currentMeasureFinal.learningGoal='24 V / 1 kΩ devrede 24 mA beklenen akımı hesaplamak; DCA 200 mA kademesini ve VΩmA/COM girişlerini seçmek; ampermetrenin neden seri bağlandığını ve ters prob yönünde işaretin neden değiştiğini açıklamak.';
 currentMeasureFinal.beginnerSteps=[
  'G1 ayarlanabilir güç kaynağını 24 V, R1 yükünü 1 kΩ olarak oku.',
  'Ölçmeden önce akımı hesapla: I=V/R=24/1000=0,024 A=24 mA.',
  'UNI-T UT33D+ seçicisini DCA 200 mA konumuna getir; kırmızı prob VΩmA, siyah prob COM girişinde olsun.',
  'Akım ölçümünde devre yolunun açıldığını ve ampermetrenin bu açıklığa seri girdiğini gör.',
  'A1’i yük öncesinde ölç: yaklaşık +24 mA bekle.',
  'A1’i yük sonrasına taşı: seri devrede yine yaklaşık +24 mA bekle.',
  'Prob yönünü ters çevir: akım büyüklüğü yaklaşık 24 mA kalırken işaretin negatif olduğunu gözle.',
  'Ampermetrenin neden voltmetre gibi paralel bağlanmadığını kendi cümlenle açıkla.'
 ];
 currentMeasureFinal.quiz={question:'24 V kaynağa bağlı 1 kΩ yükün ideal akımı kaç mA olur?',options:['24 mA','240 mA','2,4 mA'],answer:0,why:'I=V/R=24/1000=0,024 A=24 mA. Bu nedenle DCA 200 mA kademesi uygundur.'};
 currentMeasureFinal.currentMeasurementRich=true;
 currentMeasureFinal.designStandard='rich-reference-v1';
 currentMeasureFinal.pedagogyReview={version:'v1.19.20-pedagogy27-current-rich',reviewed:true,title:currentMeasureFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',physicalProbes:true};
}

/* Final acceptance lock: Multimetre ile direnç ölçümü rich-reference-v1 ölçüm laboratuvarıdır. */
const resistanceMeasureFinal=L.lessons.find(l=>l.title.toLocaleLowerCase('tr-TR')==='multimetre ile direnç ölçümü');
if(resistanceMeasureFinal){
 const p=resistanceMeasurementRichProject(resistanceMeasureFinal.id,resistanceMeasureFinal.title);
 setLesson(resistanceMeasureFinal,p,{kind:'explore',explanation:'R1=1 kΩ direnç enerjisiz ölçülür. G1 ayarlanabilir güç kaynağı OFF durumunda ve elektriksel olarak R1’den ayrıdır. UNI-T UT33D+ Ω 2 kΩ kademesinde kullanılır; kırmızı prob VΩmA, siyah prob COM girişindedir. R1 uçlarında yaklaşık 1,000 kΩ; problar aynı noktada kısa devreyken yaklaşık 0 Ω; problar açıkken OL beklenir.'});
 const meter=p.components.find(c=>c.id==='m1');ensureUT33Probes(resistanceMeasureFinal,meter);
 const red=p.components.find(c=>c.id==='m1-red'),black=p.components.find(c=>c.id==='m1-black');
 if(red)red.probeTarget={c:'r1',p:'1'};if(black)black.probeTarget={c:'r1',p:'2'};
 resistanceMeasureFinal.kind='explore';
 resistanceMeasureFinal.steps=[];
 if(resistanceMeasureFinal.project?.tutorialLesson)resistanceMeasureFinal.project.tutorialLesson.phase='explore';
 resistanceMeasureFinal.materials=materialRows(p);
 resistanceMeasureFinal.summary='UNI-T UT33D+ ile direnç ölçümünü enerjisiz laboratuvarda öğretir: kaynağı devreden ayırma, uygun Ω kademesini seçme, VΩmA/COM problarını kullanma ve 1 kΩ / kısa devre / açık devre sonuçlarını yorumlama.';
 resistanceMeasureFinal.learningGoal='Direnç ölçümünün neden enerjisiz yapılması gerektiğini açıklamak; 1 kΩ için Ω 2 kΩ kademesini seçmek; kırmızı VΩmA ve siyah COM prob bağlantılarını yapmak; yaklaşık 1 kΩ, 0 Ω ve OL sonuçlarının ne anlama geldiğini yorumlamak.';
 resistanceMeasureFinal.beginnerSteps=[
  'İlk güvenlik kontrolü: G1 ayarlanabilir güç kaynağının OFF ve R1’den elektriksel olarak ayrılmış olduğunu doğrula.',
  'R1 değerini oku: 1 kΩ = 1000 Ω.',
  'UNI-T UT33D+ seçicisini Ω 2 kΩ konumuna getir; 1 kΩ bu aralığın içindedir.',
  'Kırmızı probun VΩmA, siyah probun COM girişinde olduğunu kontrol et.',
  'Probları R1’in iki ucuna değdir: yaklaşık 1,000 kΩ bekle.',
  'İki probu aynı noktaya değdir: yaklaşık 0 Ω gör; bu çok düşük direnç / kısa devre kontrolüdür.',
  'Probları hiçbir noktaya değdirmeden ayır: OL gör; bu açık devre / ölçüm yolunun tamamlanmadığı anlamına gelir.',
  'Enerjili bir devrede Ω ölçümü yapılmaması gerektiğini kendi cümlenle açıkla.'
 ];
 resistanceMeasureFinal.quiz={question:'1 kΩ direnç UNI-T UT33D+ ile ölçülecekse hangi kademe uygundur?',options:['Ω 2 kΩ','Ω 200 Ω','DCV 20 V'],answer:0,why:'1 kΩ = 1000 Ω, 200 Ω aralığını aşar; 2 kΩ Ω kademesi uygun aralıktır.'};
 resistanceMeasureFinal.resistanceMeasurementRich=true;
 resistanceMeasureFinal.designStandard='rich-reference-v1';
 resistanceMeasureFinal.pedagogyReview={version:'v1.19.20-pedagogy28-resistance-rich',reviewed:true,title:resistanceMeasureFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',physicalProbes:true,sourceOff:true};
}

/* Final acceptance lock: Wattmetre / cosφ dersleri tek enerji analizörü rich-reference-v1 laboratuvarıdır. */
const energyAnalyzerLessons=L.lessons.filter(l=>{const t=l.title.toLocaleLowerCase('tr-TR');return /wattmetre.*güç ölç|güç ölç.*wattmetre|kosinüsfimetre.*güç katsayısı|güç katsayısı.*kosinüsfimetre/.test(t)});
for(const energyLesson of energyAnalyzerLessons){
 const t=energyLesson.title.toLocaleLowerCase('tr-TR'),defaultCharacter=/kosinüsfimetre|güç katsayısı/.test(t)?'inductive':'resistive',p=energyAnalyzerPowerProject(energyLesson.id,energyLesson.title,defaultCharacter);
 setLesson(energyLesson,p,{kind:'explore',explanation:'Bu ders yalnız simülasyon laboratuvarıdır. Ayrı wattmetre ve cosφ metre yerine tek faz enerji analizörü kullanılır. Analizör sanal L-N gerilimini ve CT akım modelini birlikte değerlendirerek Vrms, Irms, aktif güç P, reaktif güç Q, görünür güç S, güç faktörü PF/cosφ, frekans ve enerji Wh değerlerini aynı ekranda gösterir.'});
 energyLesson.kind='explore';energyLesson.steps=[];
 if(energyLesson.project?.tutorialLesson)energyLesson.project.tutorialLesson.phase='explore';
 energyLesson.materials=materialRows(p);
 energyLesson.summary='Hazır sanal tek faz devresinde enerji analizörüyle V, I, P, Q, S, PF/cosφ, Hz ve Wh değerlerini birlikte izler; dirençli, endüktif ve kapasitif yük presetlerini karşılaştırır.';
 energyLesson.learningGoal='Aktif güç P, görünür güç S, reaktif güç Q ve güç faktörü PF/cosφ arasındaki ilişkiyi enerji analizörü ekranından yorumlamak; dirençli, endüktif ve kapasitif yük davranışlarını karşılaştırmak.';
 energyLesson.beginnerSteps=[
  'Bu çalışma yalnız sanal laboratuvardır; ekrandaki G1, CT1, Z1 ve EA1 bileşenlerinin görevlerini incele.',
  'Dirençli presetinde analizörde yaklaşık 230 V, 1 A, 230 W, 230 VA, 0 var ve PF 1,00 değerlerini karşılaştır.',
  'Endüktif presetinde aynı 230 VA görünür güce karşılık yaklaşık 184 W aktif güç, +138 var reaktif güç ve PF 0,80 gör.',
  'Kapasitif presetinde yaklaşık 184 W aktif güç, −138 var reaktif güç ve PF 0,80 değerlerini gözle.',
  'P = S × PF ve S² = P² + Q² ilişkilerini ekrandaki sayılarla doğrula.',
  'PF düştüğünde aynı görünür güçte aktif gücün neden azaldığını kendi cümlenle açıkla.'
 ];
 energyLesson.quiz={question:'230 VA görünür güçte güç faktörü 0,80 ise aktif güç yaklaşık kaç watt olur?',options:['184 W','230 W','138 W'],answer:0,why:'P = S × PF = 230 × 0,80 = 184 W.'};
 energyLesson.energyAnalyzerRich=true;energyLesson.designStandard='rich-reference-v1';
 energyLesson.pedagogyReview={version:'v1.19.20-pedagogy31-energy-analyzer-rich',reviewed:true,title:energyLesson.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',energyAnalyzer:'energy-analyzer-1p',simulationOnly:true};
}

/* Final acceptance lock: Frekansmetre ile frekans ölçümü UT61E+ rich-reference-v1 laboratuvarıdır. */
const frequencyMeasureFinal=L.lessons.find(l=>l.title.toLocaleLowerCase('tr-TR')==='frekansmetre ile frekans ölçümü');
if(frequencyMeasureFinal){
 const p=frequencyMeasurementRichProject(frequencyMeasureFinal.id,frequencyMeasureFinal.title);
 setLesson(frequencyMeasureFinal,p,{kind:'explore',explanation:'Frekans ölçümü güvenli düşük gerilimli sanal sinyal jeneratörüyle yapılır. M1 gerçek UNI-T UT61E+ modelidir ve Hz kademesindedir. Kırmızı prob VΩHz, siyah prob COM girişinde OUT/GND noktalarına temas eder. 50 Hz, 1 kHz ve 10 kHz ölçümlerinde T=1/f ilişkisiyle 20 ms, 1 ms ve 0,1 ms periyotları doğrulanır. UT33D+ frekans ölçmediği için bu derste kullanılmaz.'});
 const meter=p.components.find(c=>c.id==='m1');ensureUT33Probes(frequencyMeasureFinal,meter);
 const red=p.components.find(c=>c.id==='m1-red'),black=p.components.find(c=>c.id==='m1-black');
 if(red)red.probeTarget={c:'fg',p:'OUT'};if(black)black.probeTarget={c:'fg',p:'GND'};
 frequencyMeasureFinal.kind='explore';
 frequencyMeasureFinal.steps=[];
 if(frequencyMeasureFinal.project?.tutorialLesson)frequencyMeasureFinal.project.tutorialLesson.phase='explore';
 frequencyMeasureFinal.materials=materialRows(p);
 frequencyMeasureFinal.summary='Frekans ölçebilen UNI-T UT61E+ ile düşük gerilimli periyodik sinyalin Hz/kHz değerini doğrudan ölçer; 50 Hz, 1 kHz ve 10 kHz örneklerinde frekans-periyot ilişkisini T=1/f üzerinden karşılaştırır.';
 frequencyMeasureFinal.learningGoal='Frekansın saniyedeki çevrim sayısı olduğunu açıklamak; UT61E+ Hz kademesini ve VΩHz/COM girişlerini kullanmak; 50 Hz, 1 kHz ve 10 kHz değerlerini ölçmek ve karşılık gelen 20 ms, 1 ms, 0,1 ms periyotları hesaplamak.';
 frequencyMeasureFinal.beginnerSteps=[
  'Ölçüm kaynağını ayırt et: bu deneyde FG1 düşük gerilimli sanal sinyal jeneratörüdür; ayarlı DC kaynak G0 OFF ve devreden ayrıdır.',
  'UNI-T UT61E+ seçicisini Hz kademesine getir; kırmızı prob VΩHz, siyah prob COM girişinde olsun.',
  'Kırmızı probu FG1/OUT, siyah probu FG1/GND noktasına temas ettir.',
  'FG1=50 Hz iken yaklaşık 50 Hz oku ve T=1/50=20 ms hesabını yap.',
  'FG1=1 kHz iken yaklaşık 1,000 kHz oku ve T=1/1000=1 ms sonucunu doğrula.',
  'FG1=10 kHz iken yaklaşık 10,00 kHz oku ve T=0,1 ms sonucunu doğrula.',
  'Frekans yükselirken periyodun neden azaldığını kendi cümlenle açıkla.',
  'UT33D+ üzerinde Hz fonksiyonu olmadığı için bu derste neden UT61E+ kullanıldığını açıkla.'
 ];
 frequencyMeasureFinal.quiz={question:'1 kHz sinyalin periyodu kaç milisaniyedir?',options:['1 ms','10 ms','0,01 ms'],answer:0,why:'T=1/f=1/1000 s=0,001 s=1 ms.'};
 frequencyMeasureFinal.frequencyMeasurementRich=true;
 frequencyMeasureFinal.designStandard='rich-reference-v1';
 frequencyMeasureFinal.pedagogyReview={version:'v1.19.20-pedagogy30-frequency-rich',reviewed:true,title:frequencyMeasureFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',multimeterModel:'UNI-T UT61E+',simulationOnly:true};
}

/* Final acceptance lock: Pens ampermetre ile akım ölçümü rich-reference-v1 AC pens laboratuvarıdır. */
const clampMeasureFinal=L.lessons.find(l=>l.title.toLocaleLowerCase('tr-TR')==='pens ampermetre ile akım ölçümü');
if(clampMeasureFinal){
 const p=clampCurrentMeasurementRichProject(clampMeasureFinal.id,clampMeasureFinal.title);
 setLesson(clampMeasureFinal,p,{kind:'explore',explanation:'UNI-T UT200A, Sanal 230 VAC eğitim kaynağı ve 230 Ω yükle yaklaşık 1 A RMS akımı devreyi açmadan ölçer. ACA 2 A kademesi kullanılır. Çene yalnız tek faz veya tek nötr iletkenini kavrar; cihaz akım yoluna seri eklenmez. Ayarlanabilir DC güç kaynağı görseli sayfada ortak tasarım standardı olarak bulunur ancak OFF ve elektriksel olarak devreden ayrıdır.'});
 clampMeasureFinal.kind='explore';
 clampMeasureFinal.steps=[];
 if(clampMeasureFinal.project?.tutorialLesson)clampMeasureFinal.project.tutorialLesson.phase='explore';
 clampMeasureFinal.materials=materialRows(p);
 clampMeasureFinal.summary='UNI-T UT200A ile pens akım ölçümünü gerçek AC devrede öğretir: ACA 2 A kademesini seçme, devreyi kesmeden tek iletkeni çeneden geçirme, faz ve nötrde aynı akım büyüklüğünü görme ve çenede bir iletken yoksa ölçüm oluşmadığını yorumlama.';
 clampMeasureFinal.learningGoal='230 VAC / 230 Ω dirençli yükte yaklaşık 1 A RMS akımı hesaplamak; UT200A ACA 2 A kademesini seçmek; pensi tek iletken üzerine yerleştirmek; faz ve nötr iletkenlerinde seri devre akımının aynı büyüklükte olduğunu açıklamak.';
 clampMeasureFinal.beginnerSteps=[
  'Önce ölçüm devresini ayırt et: G1=Sanal 230 VAC eğitim kaynağı ve R1=230 Ω yük.',
  'Akımı tahmin et: I=V/R=230/230≈1 A RMS.',
  'UT200A seçicisini ACA 2 A pens kademesine getir.',
  'Çeneyi yalnız faz iletkeninin üzerine kapat; kabloyu kesme veya cihazı seri bağlama.',
  'Yaklaşık 1 A RMS değerini gözle.',
  'Çeneyi nötr iletkenine taşı: aynı seri devrede akım büyüklüğünün yine yaklaşık 1 A olduğunu gör.',
  'Çeneyi iletkenden çıkar: geçerli pens ölçümü kalmadığını gözle.',
  'Faz ve nötrü birlikte çeneden geçirmenin doğru pens ölçüm yöntemi olmadığını açıkla; karşıt manyetik alanlar birbirini azaltabilir.'
 ];
 clampMeasureFinal.quiz={question:'Pens ampermetreyle tek fazlı bir yükün akımı nasıl ölçülür?',options:['Çene yalnız tek akım taşıyan iletkeni kavrar','Faz ve nötr birlikte çeneden geçirilir','Cihaz yükün iki ucuna paralel bağlanır'],answer:0,why:'Pens ampermetre akımın oluşturduğu manyetik alanı ölçer; tek iletken kavranmalıdır. Gidiş ve dönüş iletkenlerini birlikte kavramak alanların birbirini azaltmasına yol açar.'};
 clampMeasureFinal.clampCurrentMeasurementRich=true;
 clampMeasureFinal.designStandard='rich-reference-v1';
 clampMeasureFinal.pedagogyReview={version:'v1.19.20-pedagogy29-clamp-rich',reviewed:true,title:clampMeasureFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true,designStandard:'rich-reference-v1',clampMeter:'UNI-T UT200A',acOnly:true};
}

/* Final acceptance lock: Pillerin seri bağlanması gerçek iki hücre + ölçüm + guided rebuild dersidir. */
const batterySeriesFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='pillerin seri bağlanması');
if(batterySeriesFinal){
 const p=dcBatterySeriesProject(batterySeriesFinal.id,batterySeriesFinal.title);
 p.projectId='tutorial-session-source-'+batterySeriesFinal.id;
 p.name='Öğretici · '+batterySeriesFinal.title;
 p.tutorialLesson={id:batterySeriesFinal.id,topicId:batterySeriesFinal.topicId,phase:'demo',step:0,level:batterySeriesFinal.variant};
 batterySeriesFinal.project=p;batterySeriesFinal.workspaceMode=p.workspaceMode;batterySeriesFinal.kind='wiring';
 batterySeriesFinal.steps=p.wires.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 batterySeriesFinal.summary='İki adet 1,5 V pili gerçek kutuplarıyla seri bağlayıp 3,0 V paket oluşturur; 100 Ω yük üzerinde yaklaşık 30 mA akımı ve UNI-T multimetreyle hücre/paket gerilimlerini uygulamalı gözlemler.';
 batterySeriesFinal.learningGoal='Birinci pilin eksi ucunu ikinci pilin artı ucuna bağlayarak seri paket oluşturmayı; toplam gerilimin Vtoplam=V1+V2 olduğunu; aynı akımın seri yol boyunca aktığını ve iki eş hücrede Ah kapasitesinin ideal olarak değişmediğini açıklayabilmek.';
 batterySeriesFinal.explanation='BT1/− ile BT2/+ birleştirildiğinde iki 1,5 V hücre aynı seri zincire girer. Dış uçlar BT1/+ ve BT2/− olur; ideal toplam gerilim 3,0 V’tur. 100 Ω yükte I=3/100=0,03 A=30 mA beklenir. UNI-T DCV 20 V kademesinde her hücreyi ayrı ve paketi toplam olarak ölçebilirsiniz.';
 batterySeriesFinal.beginnerSteps=[
  'İki pilde de + ve − kutupları bulun; seri bağlantıda kutup sırası kritik önemdedir.',
  'Önce BT1/− ucunu BT2/+ ucuna bağlayarak seri köprüyü oluşturun.',
  'Yükü paketin dış uçlarına bağlayın: BT1/+ → R1 → BT2/−.',
  'Simülasyonu başlatıp Pil 1 ve Pil 2 üzerinde ayrı ayrı yaklaşık 1,5 V ölçün.',
  'Sonra BT1/+ ile BT2/− arasında yaklaşık 3,0 V ölçerek gerilimlerin toplandığını doğrulayın.',
  'Aynı seri yoldan tek akım geçtiğini ve ideal 100 Ω yükte yaklaşık 30 mA beklediğinizi açıklayın.'
 ];
 batterySeriesFinal.materials=materialRows(p);
 batterySeriesFinal.quiz={question:'İki adet 1,5 V pil doğru kutuplarla seri bağlanırsa paketin ideal uç gerilimi kaç volt olur?',options:['3,0 V','1,5 V','0,75 V'],answer:0,why:'Seri bağlı kaynakların gerilimleri aynı yönde toplanır: 1,5 V + 1,5 V = 3,0 V.'};
 batterySeriesFinal.batterySeriesRich=true;
 batterySeriesFinal.pedagogyReview={version:'v1.19.20-pedagogy18-battery-series-rich',reviewed:true,title:batterySeriesFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true};
}
/* Final acceptance lock: Pillerin paralel bağlanması gerçek iki hücre + ortak ray + ölçüm + guided rebuild dersidir. */
const batteryParallelFinal=L.lessons.find(l=>l.topicId==='dc-circuits'&&l.title.toLocaleLowerCase('tr-TR')==='pillerin paralel bağlanması');
if(batteryParallelFinal){
 const p=dcBatteryParallelProject(batteryParallelFinal.id,batteryParallelFinal.title);
 p.projectId='tutorial-session-source-'+batteryParallelFinal.id;
 p.name='Öğretici · '+batteryParallelFinal.title;
 p.tutorialLesson={id:batteryParallelFinal.id,topicId:batteryParallelFinal.topicId,phase:'demo',step:0,level:batteryParallelFinal.variant};
 batteryParallelFinal.project=p;batteryParallelFinal.workspaceMode=p.workspaceMode;batteryParallelFinal.kind='wiring';
 batteryParallelFinal.steps=p.wires.filter(w=>!w.probeLead).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 batteryParallelFinal.summary='İki adet 1,5 V pili aynı kutupları ortaklaştırarak paralel bağlar; ortak uç geriliminin yaklaşık 1,5 V kaldığını, 100 Ω yükte toplam akımın yaklaşık 15 mA olduğunu ve eş hücrelerde kapasite/akım paylaşımı avantajını öğretir.';
 batteryParallelFinal.learningGoal='Artı uçları artıya, eksi uçları eksiye bağlayarak paralel pil paketi oluşturmayı; gerilimin neden 1,5 V kaldığını; eş hücrelerde toplam Ah kapasitesinin ideal olarak arttığını ve yük akımının kaynaklar arasında paylaşılabildiğini açıklayabilmek.';
 batteryParallelFinal.explanation='BT1/+ ile BT2/+ ve BT1/− ile BT2/− birleştirildiğinde iki 1,5 V hücre ortak iki raya bağlanır. Bu nedenle paket gerilimi seri bağlantıdaki gibi toplanmaz; idealde yaklaşık 1,5 V kalır. 100 Ω yükte toplam akım I=1,5/100=0,015 A=15 mA olur. Eş ideal hücrelerde bu yük akımı yaklaşık eşit paylaşılabilir; gerçek paylaşım iç direnç ve hücre durumuna bağlıdır.';
 batteryParallelFinal.beginnerSteps=[
  'İki pilin + ve − kutuplarını bulun; paralelde aynı kutupların birleştiğini unutmayın.',
  'Önce BT1/+ ile BT2/+ uçlarını bağlayıp ortak pozitif rayı oluşturun.',
  'Sonra BT1/− ile BT2/− uçlarını bağlayıp ortak negatif rayı oluşturun.',
  '100 Ω yükü bu iki ortak ray arasına bağlayın.',
  'UNI-T ile Pil 1, Pil 2 ve ortak raylar arasında ayrı ayrı yaklaşık 1,5 V ölçün.',
  'Seri bağlantıyla karşılaştırın: seri pakette 3,0 V görmüştünüz; paralel pakette gerilim 1,5 V kalır.',
  'Eş hücrelerde paralel bağlantının ideal Ah kapasitesini artırabildiğini; gerçek hücrelerde akım paylaşımının iç direnç ve doluluk durumuna göre değiştiğini açıklayın.'
 ];
 batteryParallelFinal.materials=materialRows(p);
 batteryParallelFinal.quiz={question:'İki adet aynı 1,5 V pil doğru şekilde paralel bağlanırsa ideal paket gerilimi yaklaşık kaç volt olur?',options:['1,5 V','3,0 V','0,75 V'],answer:0,why:'Paralelde aynı kutuplar ortak olduğundan kaynak gerilimi toplanmaz; ortak uçlar yaklaşık tek hücre gerilimi olan 1,5 V seviyesinde kalır.'};
 batteryParallelFinal.batteryParallelRich=true;
 batteryParallelFinal.pedagogyReview={version:'v1.19.20-pedagogy20-battery-parallel-rich',reviewed:true,title:batteryParallelFinal.title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true};
}

L.byId=Object.fromEntries(L.lessons.map(l=>[l.id,l]));
/* Resmî 10 derslik DC listesine eklenmeyen, seri pil dersinden erişilen tamamlayıcı karşılaştırma sayfası. */
{
 const id='dc-battery-types-rich',title='Pil ve akü tipleri',p=dcBatteryTypesProject(id,title);
 p.projectId='tutorial-session-source-'+id;p.name='Öğretici · '+title;p.tutorialLesson={id,topicId:'dc-circuits',phase:'explore',step:0,level:2};
 const lesson={
  id,topicId:'dc-circuits',title,variant:2,kind:'explore',workspaceMode:p.workspaceMode,project:p,steps:[],
  sourceDocs:['DC','EDEV','TEMEL9','TEMELOTO'],
  concepts:['birincil ve şarj edilebilir kaynak','nominal gerilim','kapasite Ah','enerji Wh','kimya ve kullanım alanı','uygun koruma/şarj sistemi'],
  summary:'Alkalin, NiMH, Li-ion ve kurşun-asit kaynakları aynı çalışma alanında görsel ve ölçülebilir biçimde karşılaştırır; nominal gerilim, şarj edilebilirlik, kapasite ve enerji kavramlarını birbirinden ayırır.',
  learningGoal:'Ders sonunda pil/akü türlerini nominal gerilim, şarj edilebilirlik, enerji yoğunluğu, tipik kullanım ve güvenlik gereksinimleri açısından karşılaştırabilmek; V, Ah ve Wh kavramlarını karıştırmamak.',
  explanation:'Bu sayfa dört farklı DC enerji kaynağını aynı sanal laboratuvarda karşılaştırır. UNI-T DCV 20 V kademesinde her kaynağın nominal gerilimini ölçebilir; 1 kΩ sanal yükü seçilen kaynağa bağlayıp teorik akımı I=V/R ile karşılaştırabilirsiniz. Gerçek hücrelerde kimya, iç direnç, sıcaklık ve doluluk durumu sonucu etkiler.',
  beginnerSteps:[
   'Önce dört kaynağın üzerindeki nominal gerilimleri ve şarj edilebilirlik durumunu karşılaştırın.',
   'Alkalin ile NiMH AA hücrelerin aynı boyutta olsalar bile nominal gerilimlerinin farklı olduğunu fark edin.',
   'Li-ion hücrenin daha yüksek hücre gerilimine, kurşun-asit akünün ise çok hücreli 12 V paket yapısına sahip olduğunu görün.',
   'UNI-T ile her kaynağı ayrı ayrı ölçün; sonra 1 kΩ sanal yükü seçilen kaynağa bağlayıp I=V/R hesabıyla akımı karşılaştırın.',
   'Kapasiteyi Ah, enerjiyi Wh olarak düşünün: aynı Ah değeri farklı gerilimlerde farklı enerji anlamına gelir.',
   'Bu deney yalnız uygulama içindeki sanal laboratuvar içindir; gerçek hücreleri kısa devre etmeyin veya uygun olmayan şarj işlemi uygulamayın.'
  ],
  materials:materialRows(p),
  quiz:{question:'Aynı 2 Ah kapasiteye sahip 1,5 V ve 3,7 V iki kaynak için hangisi doğrudur?',options:['3,7 V kaynak ideal olarak daha fazla Wh enerji taşır','İkisi her zaman aynı Wh enerjiyi taşır','1,5 V kaynak daha fazla Wh taşır'],answer:0,why:'Enerji yaklaşık Wh = V × Ah ile karşılaştırılır; aynı Ah değerinde gerilimi yüksek olan kaynağın Wh değeri daha yüksektir.'},
  batteryTypesRich:true,
  pedagogyReview:{version:'v1.19.20-pedagogy19-battery-types-rich',reviewed:true,title,componentIds:p.components.map(c=>c.typeId),noSubstitute:true}
 };
 L.byId[id]=lesson;L.supplementalLessons=[...(L.supplementalLessons||[]),lesson];
}
function tutorialDcVoltage(c){
 const n=Number(c.dcVoltage);if(Number.isFinite(n)&&n>0)return n;
 const m=String(c.label||'').match(/(\d+(?:[.,]\d+)?)\s*V/i);return m?Number(m[1].replace(',','.')):24;
}
function upgradeTutorialDcSupplies(){
 const all=[...L.lessons,...(L.supplementalLessons||[])];
 for(const l of all){
  const p=l.project;if(!p?.components)continue;
  for(const c of p.components){
   if(c.typeId!=='supply-dc-plus')continue;
   const volts=tutorialDcVoltage(c);
   c.typeId='arduino-bench-supply';c.dcVoltage=volts;c.currentLimit=Number(c.currentLimit)||1;
   c.label='Ayarlanabilir DC güç kaynağı · '+volts.toFixed(volts%1?1:0)+' V';
   c.tutorialPurpose=(c.tutorialPurpose?c.tutorialPurpose+' ':'')+'Bu derste sabit sembol yerine 0–30 VDC ayarlanabilir masa güç kaynağı kullanılır; mevcut ders gerilimi '+volts+' V olarak korunur.';
  }
  l.materials=materialRows(p);
  if(l.pedagogyReview)l.pedagogyReview.componentIds=p.components.map(c=>c.typeId);
 }
}
upgradeTutorialDcSupplies();


/* Gerçek elektronik parça kapanışı: fiziksel devre elemanı gerektiren tutorial kutuları
   satın alınabilir gerçek paket/model tanımlarıyla değiştirilir. Kablolu endpoint taşıyan
   komponentler fail-closed bırakılır; otomatik remap yalnız kavram panolarına uygulanır. */
const REAL_ELECTRONICS_REPLACEMENTS={
 'tutorial-mosfet':'irf540n-mosfet','tutorial-igbt':'fga25n120antd-igbt','tutorial-scr':'tyn612rg-scr',
 'tutorial-triac':'bta16-600b-triac','tutorial-diac':'db3-diac','tutorial-opamp':'lm358p-dip8',
 'tutorial-logic-and':'sn74hc08n','tutorial-logic-or':'sn74hc32n','tutorial-logic-not':'sn74hc04n',
 'tutorial-logic-buffer':'sn74hc125n','tutorial-logic-nand':'sn74hc00n','tutorial-logic-nor':'sn74hc02n',
 'tutorial-logic-xor':'sn74hc86n','tutorial-logic-xnor':'cd4077be','tutorial-ff-rs':'sn74hc00n',
 'tutorial-ff-jk':'cd4027be','tutorial-ff-d':'sn74hc74n','tutorial-ff-t':'cd4027be',
 'tutorial-adc':'adc0804lcn','tutorial-dac':'dac0808lcn','tutorial-logic-mux':'sn74hc151n',
 'tutorial-logic-demux':'sn74hc138n','tutorial-logic-decoder':'sn74hc138n','tutorial-logic-encoder':'sn74hc148n',
 'tutorial-full-adder':'cd74hc283e','tutorial-comparator':'cd74hc85e','tutorial-fet':'j113-jfet',
 'tutorial-crystal':'hc49-4mhz-crystal','tutorial-microphone':'electret-9767-mic','tutorial-speaker':'speaker-8ohm-1w'
};
for(const l of L.lessons){
 const title=l.title.toLocaleLowerCase('tr-TR');let changed=false;
 for(const comp of l.project?.components||[]){
  const wired=(l.project.wires||[]).some(w=>w.from.c===comp.id||w.to.c===comp.id);if(wired)continue;
  let next=REAL_ELECTRONICS_REPLACEMENTS[comp.typeId]||null;
  if(comp.typeId==='tutorial-diode'){
   if(/foto diyot/.test(title))next='bpw34-photodiode';
   else if(/röleler için koruma diyot|doğrult/.test(title))next='1n4007-do41';
   else next='1n4148-do35';
  }
  if(next){comp.typeId=next;comp.realElectronicsReplacement=true;changed=true}
 }
 if(changed){
  l.materials=materialRows(l.project);l.realElectronicsParts=true;
  l.pedagogyReview={...(l.pedagogyReview||{}),realElectronicsParts:true,realPackagePolicy:'orthographic-top-pin-aligned'};
 }
}


/* Legacy LM358 unit-photo closure.
   Every lesson that still uses lm358p-opamp-a is upgraded to the full physical
   LM358P PDIP-8 component. Existing logical wire endpoints are translated to the
   actual package pins: OUT=1, IN-=2, IN+=3, V-=4, V+=8. */
const LM358_A_PIN_MAP={'OUT':'1','IN-':'2','IN+':'3','V-':'4','V+':'8'};
function upgradeLegacyLm358PhysicalPackage(l){
 const p=l.project;if(!p?.components)return false;
 const ids=new Set();
 for(const comp of p.components){
  if(comp.typeId!=='lm358p-opamp-a')continue;
  comp.typeId='lm358p-dip8';
  if(comp.ref==='U1A')comp.ref='U1';
  comp.label=String(comp.label||'LM358P').replace(/A kanalı|Unit A/gi,'').replace(/\s+·\s*$/,'').trim()||'LM358P';
  comp.realElectronicsReplacement=true;comp.physicalPackageUpgrade='PDIP-8';
  ids.add(comp.id);
 }
 if(!ids.size)return false;
 for(const w of p.wires||[]){
  if(ids.has(w.from?.c)&&LM358_A_PIN_MAP[w.from.p])w.from.p=LM358_A_PIN_MAP[w.from.p];
  if(ids.has(w.to?.c)&&LM358_A_PIN_MAP[w.to.p])w.to.p=LM358_A_PIN_MAP[w.to.p];
 }
 for(const step of l.steps||[]){
  if(ids.has(step.from?.c)&&LM358_A_PIN_MAP[step.from.p])step.from.p=LM358_A_PIN_MAP[step.from.p];
  if(ids.has(step.to?.c)&&LM358_A_PIN_MAP[step.to.p])step.to.p=LM358_A_PIN_MAP[step.to.p];
 }
 for(const comp of p.components||[]){
  const t=comp.probeTarget;if(t&&ids.has(t.c)&&LM358_A_PIN_MAP[t.p])t.p=LM358_A_PIN_MAP[t.p];
 }
 if(/Eviren yükselteç DC giriş/i.test(l.title)){
  const input=p.components.find(x=>x.id==='in'&&x.typeId==='potentiometer');
  if(input&&Number(input.potentiometer)===35)input.potentiometer=55;
 }
 l.materials=materialRows(p);
 l.realElectronicsParts=true;
 l.pedagogyReview={...(l.pedagogyReview||{}),realElectronicsParts:true,lm358PhysicalPackage:true,realPackagePolicy:'orthographic-top-pin-aligned'};
 return true;
}
for(const l of L.lessons)upgradeLegacyLm358PhysicalPackage(l);

// RS conceptual cards use an SN74HC00N (four NAND gates), not a standalone
// RS flip-flop IC. Never claim a functional latch when the lesson has no wires.
for(const l of L.lessons){
 if(!/RS Flip-Flop/i.test(l.title)||l.kind!=='quiz'||l.project?.wires?.length)continue;
 const nand=l.project.components.find(c=>c.typeId==='sn74hc00n');if(!nand)continue;
 nand.label='SN74HC00N · 4 NAND kapısı (RS mandal yapı taşı)';
 l.summary='RS mandalın iki NAND kapısının çapraz geri beslemesiyle nasıl kurulacağını kavramsal olarak öğrenir; gösterilen SN74HC00N tek başına hazır bir RS flip-flop değildir.';
 l.explanation='SN74HC00N dört adet NAND kapısı içerir. RS mandal kurmak için iki NAND kapısının çıkışları karşılıklı diğerinin girişine geri beslenir; S ve R girişleri durum değişimini belirler. Bu dersteki görünümde bağlantı kablosu bulunmadığından çalışan bir RS devresi simüle edilmez.';
 l.learningGoal='SN74HC00N NAND kapısı ile tamamlanmış RS mandalı arasındaki farkı, iki kapı ve çapraz geri beslemenin neden gerekli olduğunu açıklamak.';
 l.materials=materialRows(l.project);
 l.pedagogyReview={...(l.pedagogyReview||{}),conceptualNandLatch:true};
}

// Physical probes are part of the rich series/parallel labs. Keep the simulated
// electric path intact: current probe contacts substitute for the jack-to-wire
// joins while the black parallel probe touches one shared branch node.
for(const id of ['dc-circuits-src-07','dc-circuits-src-08']){
 const l=L.byId[id];if(!l)continue;const p=l.project;
 if(id==='dc-circuits-src-08'){
  const branchWires=p.wires.filter(w=>w.from?.c==='a'&&w.from?.p==='COM'&&['r1','r2'].includes(w.to?.c)&&w.to?.p==='1');
  if(branchWires.length===2){
   p.wires=p.wires.filter(w=>!branchWires.includes(w));
   p.wires.push(W('r1','1','r2','1','R1 ve R2 ortak pozitif kola bağlanır.','Paralel dirençler iki ortak düğüm arasında bulunur.'));
  }
 }
 for(const m of [...p.components].filter(c=>c.typeId==='unit-ut33d-plus'))ensureUT33Probes(l,m);
 if(id==='dc-circuits-src-08'){
  const black=p.components.find(c=>c.id==='a-black');
  if(black&&!black.probeTarget)black.probeTarget={c:'r1',p:'1'};
 }
 const probeIds=new Set(p.components.filter(c=>/^test-probe-/.test(c.typeId)).map(c=>c.id));
 l.steps=p.wires.filter(w=>!w.probeLead&&!probeIds.has(w.from?.c)&&!probeIds.has(w.to?.c)).map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'Güç devresinin terminallerini bağlayın.',why:w.tutorialWhy||'Bu iletken ölçüm devresinin gerçek yolunu tamamlar.',color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 if(l.pedagogyReview){l.pedagogyReview.componentIds=p.components.map(c=>c.typeId);l.pedagogyReview.physicalProbes=true}
}

// MQ-07 pedagogy pilot: explanation is grounded in the actual canonical terminal graph.
const ntcLesson=L.byId['opamp-apps-src-08'];
if(ntcLesson){
 const p=ntcLesson.project;
 const hasNTC=p.components.some(c=>c.id==='s1'&&c.typeId==='sensor-ntc');
 const hasPot=p.components.some(c=>c.typeId==='potentiometer');
 const hasPins=['8','4','2','3','1'].every(pin=>p.components.some(c=>c.id==='u1'&&c.typeId==='lm358p-dip8'));
 if(!hasNTC||hasPot||!hasPins)throw Error('NTC comparator lesson mismatched with actual circuit');
 ntcLesson.summary='Bu devre sıcaklığın değişmesini iki seviyeli bir elektriksel karara dönüştürür: NTC ısındığında direnci azalır; R1 üzerindeki sensör düğümü gerilimi yükselerek LM358P karşılaştırıcının yaklaşık 12 V eşiğini geçebilir. Çıkış değişimi UNI-T UT33D+ ile izlenir. Bu yalnız sanal eğitim devresidir.';
 ntcLesson.explanation='G1 ayarlı kaynak +24 V verir. LM358P U1 entegresinde pin 8 (V+) besleme ucuna +24 V, pin 4 (V−) ucuna 0 V bağlanır. R2 ve R3 10 kΩ dirençler +24 V ile 0 V arasında gerilim bölücü kurar: Vref = 24 × 10/(10+10) = 12 V. Ortak düğüm U1 pin 2 (IN−, eviren giriş) ucuna gider. B1 NTC sensörü +24 V ile R1=10 kΩ arasında, R1 ise 0 V hattındadır. NTC ile R1 birleşimi U1 pin 3 (IN+, evirmeyen giriş) ucuna bağlanır. Giriş gerilimi V(IN+) = 24 × 10 kΩ/(R_NTC + 10 kΩ) bağıntısıyla değişir. Modelde 25 °C için R_NTC ≈ 10 kΩ ve giriş yaklaşık 12 V olur. Sıcaklık yükselip NTC direnci azalınca pin 3 gerilimi artar. Pin 3, pin 2 üzerindeki 12 V referansı aştığında karşılaştırıcı pin 1 (OUT) yüksek seviyeye geçer; altında kaldığında düşük seviyede kalır. Sanal solver yüksek durumda yaklaşık 22 V, düşük durumda yaklaşık 0 V gösterir; gerçek LM358P çıkışı ideal +24 V olmak zorunda değildir. UNI-T UT33D+ DCV ölçümünde kırmızı prob OUT/pin 1 noktasına, siyah prob 0 V referansına temas ettirilerek iki durum gözlenir.';
 ntcLesson.learningGoal='LM358P besleme uçları 8/4, karşılaştırma girişleri 2/3 ve çıkış ucu 1 ile NTC/R1 sensör bölücüsünü, R2/R3 12 V referansını ve sıcaklık arttıkça çıkışın neden değiştiğini ölçümle açıklamak.';
 ntcLesson.beginnerSteps=[
  'Önce U1 beslemesini izle: pin 8 → +24 V, pin 4 → 0 V. Bu bağlantılar olmadan op-amp karşılaştırma yapamaz.',
  'R2 ve R3 dirençlerinin 10 kΩ + 10 kΩ olduğunu bul. +24 V kaynağın orta noktadaki referansı yaklaşık 12 V yapmasını hesapla; U1 pin 2 (IN−) ucuna ulaşan hattı izle.',
  'B1 NTC → R1 (10 kΩ) → 0 V bağlantısını bul. NTC/R1 birleşimini U1 pin 3 (IN+) ucuna kadar takip et.',
  'Yalnız sanal laboratuvarda NTC sıcaklığını 15 °C ve 35 °C olarak değiştir. Direnç azaldıkça pin 3 geriliminin neden yükseldiğini açıkla.',
  'UNI-T UT33D+ DCV kademesinde kırmızı probu U1 pin 1 (OUT), siyah probu 0 V referansına getir. Düşük ve yüksek çıkışı karşılaştır; ölçülen değeri kaydet.',
  'Sonuç: V(IN+) > 12 V ise OUT yüksek, V(IN+) < 12 V ise OUT düşük. Bunun yalnız simülasyon sonucu olduğunu ve gerçek devrede ayrıca üretici sınırlarının kontrol edilmesi gerektiğini söyle.'
 ];
 const why={s1:'NTC sıcaklığa bağlı dirençtir; sıcaklık yükseldikçe R_NTC düşer ve sensör bölücüsünün gerilimi yükselir.',r1:'10 kΩ alt direnç; NTC ile birlikte U1 pin 3 için sıcaklığa bağlı gerilim bölücüsünü kurar.',r2:'10 kΩ üst referans direnci; R3 ile +24 V kaynaktan 12 V referans üretir.',r3:'10 kΩ alt referans direnci; R2 ile U1 pin 2 için 12 V eşik oluşturur.',u1:'LM358P pin 8/+24 V ve pin 4/0 V ile beslenir; pin 3 sensörü, pin 2 referansı kıyaslar; pin 1 çıkışı bildirir.',v1:'UNI-T UT33D+ DCV kademesinde OUT/pin 1 ile 0 V arasındaki çıkış gerilimini ölçer.'};
 ntcLesson.materials=materialRows(p).map(m=>why[m.componentId]?{...m,why:why[m.componentId]}:m);
 ntcLesson.pedagogyReview={...(ntcLesson.pedagogyReview||{}),ntcTopicGraphCorrected:true,causalPinNarrativeAdded:true,physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
}


/* MQ-07: ilk 10 şablon anlatımlı kablolu dersin konuya özgü açıklamaları.
   Bu alan yalnız açıklama/deney ve malzeme gerekçelerini değiştirir;
   proje şemaları, terminaller, source IDs ve accepted rich dersler sabittir.
   Tüm deneyler sanal ortam içindir; fiziksel şebeke işlemi öğretilmez. */
const mq07SemanticPilot=[{"id":"installation-grounding-src-01","parts":["supply-1p","terminal-pe","ground"],"wires":2,"summary":"PE koruma iletkeninin kaynak PE terminalinden XPE1 klemensine ve topraklama noktasına nasıl ulaştığını inceler. Amaç normal işletme akımını taşımak değil, koruma iletkeninin sürekliliğini ve neden ayrı tutulduğunu anlamaktır.","explanation":"Şemada G1 kaynağının PE ucu XPE1 klemensinin 1 ucuna, XPE1'in 2 ucu PE1 elektrodunun PE terminaline bağlıdır. Faz L ve nötr N bu iki bağlantının parçası değildir: koruma iletkeni normal işletmede yük akımı taşıyan dönüş hattı olarak kullanılmaz. İzolasyon arızasında koruma düzeninin çalışabilmesi için uygun hata akımı yolu ve tesisatın bütün koruma koşulları gerekir; toprak elektrodunu çizmek tek başına koruma cihazının açacağını kanıtlamaz. Şemada elektrot direnci, kaçak akım veya açma süresi verilmediği için sayısal sonuç hesaplanamaz. Bu dersin sanal deneyi uçları takip etmek ve PE ile L/N hatlarının karıştırılmadığını kontrol etmektir.","goal":"G1/PE → XPE1/1 → XPE1/2 → PE1/PE koruma güzergâhını anlatmak, PE'nin görevini nötrden ayırmak ve bilinmeyen ölçüm değerini uydurmamak.","steps":["Sanal şemada G1 üzerindeki PE, L ve N uçlarını ayırt et; hiçbir gerçek enerji bağlantısı yapma.","G1/PE → XPE1/1 ve XPE1/2 → PE1/PE hatlarını ayrı ayrı izle.","Devrede yük ve gerilim ölçüm elemanı olmadığını belirle; ekranda görünmeyen bir direnç veya hata akımı değeri yazma.","G1'in N ucuyla PE güzergâhını neden aynı çalışma dönüşü sayamayacağını açıkla.","Gözlem: PE zincirinin iki gerçek kablosunu işaretle ve bağlantı sürekliliği hakkında yalnız şema düzeyinde yorum yap."],"why":{"g1":"L/N/PE uçlu şebeke kaynak temsilidir; bu derste yalnız PE koruma çıkışı kullanılır.","x1":"XPE1/1 ile XPE1/2 koruma iletkeninin klemens üzerinden sürdürülmesini temsil eder.","e1":"PE1/PE koruma-toprak bağlantısı noktasıdır; gerçek topraklama direnci modelde doğrulanmamıştır."}},{"id":"installation-grounding-src-02","parts":["bar-pe","terminal-pe","socket-power"],"wires":4,"summary":"Eş potansiyel PE barasının kaynak, priz koruma ucu ve topraklama elektrodunu ortak koruma bağlantısında buluşturma görevini gösterir.","explanation":"G1/PE hattı BPE eş potansiyel barasının 1 ucuna gelir. BPE/4 → XPE1/1, XPE1/2 → X1/PE yolu priz koruma ucuna gider; BPE/5 → PE1/PE ise elektrot bağlantısıdır. Bara, koruma iletkenlerini aynı koruma potansiyelinde tutmaya yardımcı olur; faz ve nötrü PE barasına bağlayan çalışma hattı değildir. Ekrandaki prizde L/N yük besleme bağlantısı çizilmediğinden bu sahnede prize enerji verildiği veya bir cihazın çalıştığı söylenemez. İdeal eş potansiyel düşüncesinde koruma uçları arasındaki gerilim farkı küçük olmalıdır; ancak gerçek direnç ve dokunma gerilimi parametreleri yoktur, bu yüzden sıfır ohm veya sayısal bir gerilim ölçülmüş sayılmaz.","goal":"BPE/1, BPE/4, BPE/5 ve X1/PE hatlarını doğru ayırmak; ortak koruma potansiyelinin neden gerekli olduğunu şemadan açıklamak.","steps":["Sanal ekranda kaynağın PE ucu ile BPE/1 arasındaki hattı bul.","BPE/4 → XPE1/1 → XPE1/2 → X1/PE güzergâhını izle ve bunun priz koruma ucu olduğunu söyle.","BPE/5 → PE1/PE kolunu ayrı bir dal olarak işaretle.","Priz L/N beslemesi ve sayısal süreklilik ölçümü bu sahnede yok; varmış gibi sonuç çıkarma.","Gözlem: BPE koruma bağlantıları ayrılırsa hangi PE noktasının şemada bağlantısız kalacağını karşılaştır."],"why":{"g1":"Koruma bağlantısının kaynak tarafındaki PE temsilini sağlar.","b1":"BPE barası, kaynak PE, priz koruması ve elektrot kollarının ortak bağlantı noktasıdır.","x1":"PE klemensi baradan gelen koruma hattını priz koruma ucuna geçirir.","s1":"X1/PE, prizin koruma temasıdır; sahnede enerji sağlayan L/N kolu yoktur.","e1":"Topraklama elektrodunun bağlantı noktasıdır; toprak direnci ölçümü burada yapılmaz."}},{"id":"installation-systems-src-02","parts":["wall-commutator","ceiling-light","lampholder-e27"],"wires":6,"summary":"Komütatörün iki ayrı anahtarlama koluyla H1 ve H2 lambalarını birbirinden bağımsız kontrol etmesini gösterir.","explanation":"Sanal şemada 230 V AC faz ucu G1/L, komütatör S1/1 ve S1/3 girişlerine iki ayrı kabloyla gelir. İlk anahtar kolunun S1/2 çıkışı H1/X1'e; ikinci kolun S1/4 çıkışı H2/X1'e bağlıdır. Her lambanın X2 ucu ayrı hatla G1/N nötrüne döner. İlk kontak kapanırsa yalnız H1'in, ikinci kontak kapanırsa yalnız H2'nin faz yolu tamamlanır; iki kontak kapanırsa ikisi birlikte çalışabilir. Kaynak etiketi 230 VAC'tir fakat lambaların güç/empedans değerleri verilmemiştir; I=P/U ile sayısal lamba akımı bu dersten çıkarılamaz. Bu anlatım yalnız simülasyondaki kontak durumlarını yorumlamak içindir; gerçek şebeke üzerinde uygulama yapılmaz.","goal":"S1'in iki bağımsız kolunu 1–2 ve 3–4 terminalleriyle tanımak, H1/H2 çıkışlarını ve nötr dönüşünü açıklamak.","steps":["Sanal devrede G1/L → S1/1 ve G1/L → S1/3 besleme dallarını ayır.","S1/2 → H1/X1 ve S1/4 → H2/X1 çıkışlarını takip et.","H1/X2 ve H2/X2'nin G1/N üzerinde kapandığını belirle.","Sanal anahtarın iki kolunu ayrı ayrı değiştir; H1/H2 durumlarını gözlemle, çıkış değişmiyorsa REVIEW olarak not et.","Yüklerin güç bilgisi olmadığı için sayı uydurmadan açık/kapalı tabloyu çıkar."],"why":{"g1":"230 VAC simülasyon besleme modelidir; gerçek şebeke bağlantısı yapılmaz.","s":"S1'in 1–2 ve 3–4 kontakları iki lambayı bağımsız kumanda eder.","h1":"H1, komütatörün ilk koluna bağlı aydınlatma yüküdür.","h2":"H2, komütatörün ikinci koluna bağlı aydınlatma yüküdür."}},{"id":"installation-systems-src-03","parts":["wall-vavien","ceiling-light"],"wires":5,"summary":"İki vaviyen anahtarla aynı H1 lambasının iki ayrı noktadan açılıp kapatılmasının gezgin iletken mantığını açıklar.","explanation":"G1/L fazı ilk vaviyenin ortak ucu S1/11'e gelir. S1/12 → S2/12 ve S1/14 → S2/14 gezgin hatları, iki anahtarın seçtiği yolu taşır. İkinci vaviyenin ortak S2/11 ucu H1/X1'e gider; H1/X2 G1/N'ye döner. Anahtarlar aynı gezgini seçtiğinde faz lambaya erişebilir, farklı gezginleri seçtiklerinde devre yolu açıktır. Öğrenci ikinci anahtarı değiştirdiğinde ışığın konumuna bağlı olarak değişmesini gözler. Işık yükünün gücü tanımlanmadığından akım ve güç hesabı sayı ile yapılamaz; G1 üzerindeki 230 VAC etiketi ise kaynak referansıdır, ölçülmüş sonuç değildir.","goal":"S1/S2 ortak 11 uçlarını, iki gezgin 12/14 hattını ve lambanın X1/X2 dönüşünü açıklamak.","steps":["Sanal şemada G1/L → S1/11 ortak besleme ucunu bul.","S1/12 → S2/12 ile S1/14 → S2/14 gezgin çiftini ayrı renkli hat olarak izle.","S2/11 → H1/X1 ve H1/X2 → G1/N yük yolunu tamamla.","Simülasyonda S1 veya S2'nin konumunu tek tek değiştir; H1'in hangi durumda açık/kapalı olduğunu tabloya yaz.","Kontak değiştiği hâlde H1 değişmiyorsa beklenen sonucu değil, gerçek simülasyon davranışını REVIEW'a kaydet."],"why":{"g1":"Simüle edilen tek faz beslemenin L/N uçlarını sağlar.","s1":"İlk vaviyen ortak 11 ile 12 veya 14 gezginini seçer.","s2":"İkinci vaviyen seçili gezgini ortak 11 çıkışına aktarır.","h":"H1, iki konum seçimiyle faz yolu tamamlandığında çalışan yükü temsil eder."}},{"id":"installation-systems-src-04","parts":["wall-vavien","ceiling-light"],"wires":5,"review":"MISSING_INTERMEDIATE_SWITCH","summary":"Üç noktadan aydınlatma kontrolünün mantığını öğretmesi gereken derste mevcut çizim yalnız iki vaviyen anahtar içerir; ara vaviyen henüz bulunmadığından üç noktadan çalışma doğrulanamaz.","explanation":"Bu sahnede G1/L → S1/11, S1/12 → S2/12, S1/14 → S2/14, S2/11 → H1/X1, H1/X2 → G1/N bağlantıları vardır. Bu topoloji iki noktadan vaviyen kontrolüdür. Üç noktadan kontrol için iki gezgin hattının arasında bir ara vaviyen/çapraz anahtar gerekir; burada üçüncü anahtar ve ona ait fiziksel terminaller çizili değildir. Bu nedenle öğrenciye üç anahtarla çalışan bir devre varmış gibi anlatım veya simülasyon sonucu sunulamaz. Gerilim 230 VAC kaynak etiketi dışında bir ölçüm yapılmamıştır. Eksik ara anahtar/topoloji, terminal ve simülasyon kabulü tamamlanana kadar ders pedagojik olarak REVIEW'dur.","goal":"İki mevcut vaviyen hattını doğru tanımak ve ara vaviyen eksikliğinin neden üç noktadan kontrol kabulünü engellediğini açıklamak.","steps":["Sanal şemada S1/11 ve S2/11 ortak uçlarını bul.","S1/12 → S2/12 ile S1/14 → S2/14 arasında doğrudan iki gezgin olduğunu göster.","Başlıktaki üçüncü anahtarın neden görünmediğini tespit et; olmayan bir terminali bağlantı adımı diye gösterme.","İki mevcut anahtarın durumunu simülasyonda gözlemleyebilirsin; üç anahtarlı çalışma sonucu üretme.","Bu dersin üç noktadan fiziksel davranış ve anlatım kabulünü REVIEW olarak işaretle."],"why":{"g1":"Yalnız sanal 230 VAC kaynak temsilidir.","s1":"İki noktadan kontrolün ilk vaviyen anahtarı; üçüncü ara anahtar mevcut değildir.","s2":"İkinci vaviyen anahtar; gezginler doğrudan bağlandığından üç noktadan kontrol sağlanmaz.","h":"İki mevcut vaviyen üzerinden kumanda edilen simülasyon yüküdür."}},{"id":"installation-systems-src-05","parts":["bell-push","bell-electronic"],"wires":3,"summary":"Bir normalde açık B1 zil butonuna basılınca Z1 elektronik zilinin enerji yolunun tamamlanmasını anlatır.","explanation":"G1/L sanal faz hattı B1 butonunun 13 ucuna gelir. B1/14, Z1 zilinin 1 ucuna gider; Z1/2 ise G1/N nötrüne bağlıdır. B1 normalde açık olduğu için bırakıldığında 13–14 arası kesik ve zil suskundur. Sanal butona basıldığında kontak kapanır; kaynaktan buton üzerinden zile ve nötr dönüşüne devre yolu oluşur. Buton bırakıldığında normalde açık kontak yeniden açılır. 230 VAC etiketi kaynak tanımıdır; zili oluşturan iç devrenin empedansı ve gücü verilmediğinden sayısal akım hesaplanamaz. Gerçek şebeke üzerinde buton-zil deneyi yapılmaz; yalnız uygulama simülasyonu izlenir.","goal":"G1/L → B1/13–14 → Z1/1 → Z1/2 → G1/N sırasını ve bırakıldığında açılan kontak davranışını açıklamak.","steps":["Sanal şemada G1/L → B1/13 besleme hattını ve B1/14 → Z1/1 kolunu takip et.","Z1/2 → G1/N hattını dönüş olarak tanı.","Başlangıçta normalde açık B1 ile zilin beklenen durumunu belirt.","Sanal butona bas-bırak yaparak zilin yalnız basılı durumda etkinleşip etkinleşmediğini gözle.","Kaynak gerilimini yük akımı sanma; zildeki gerçek akım parametresi verilmemiştir."],"why":{"g1":"Sanal zil devresinin L/N besleme uçlarını temsil eder.","b0":"B1, 13–14 normalde açık kontağıyla zilin faz yolunu keser veya tamamlar.","z":"Z1, anahtarlanan besleme ile çalışan simüle edilmiş zil yüküdür."}},{"id":"installation-systems-src-06","parts":["bell-push","bell-electronic"],"wires":3,"review":"MISSING_SECOND_AND_THIRD_BUTTON","summary":"İki/üç butonla ortak zilin çalışmasını göstermesi gereken dersin mevcut sahnesinde yalnız B1 butonu vardır; bir butonun etkisi incelenebilir, çoklu buton davranışı henüz doğrulanamaz.","explanation":"Mevcut gerçek kablolar G1/L → B1/13, B1/14 → Z1/1 ve Z1/2 → G1/N biçimindedir. Bu, yalnız bir normalde açık butonun Z1 zilini kumanda ettiği devredir. Başlıktaki iki veya üç ayrı butonun paralel dalları şemada bulunmaz; B2/B3 terminalleri uydurulamaz. Çok butonlu gerçek işlevde her bağımsız butonun çalışması aynı zil yüküne ulaşmalıdır; fakat bu dersin mevcut 3 kablosu bu davranışı kanıtlamıyor. Zilin çektiği akım/güç belirtilmediği için ölçülmüş değer olarak verilemez. Eksik buton ve kaynak topolojisi tamamlanıncaya kadar çoklu buton konusu REVIEW'dur.","goal":"B1/13–14 mevcut kumanda yolunu tanımak ve ikinci/üçüncü zil butonu eksikliğinin neden ders kazanımını engellediğini göstermek.","steps":["Sanal sahnede görülen gerçek tek B1 butonunu say ve 13–14 uçlarını göster.","B1/14 → Z1/1 → Z1/2 → G1/N yolunun işlevini açıkla.","Başlıktaki ikinci/üçüncü butonun ve bunların paralel bağlantılarının bulunmadığını tespit et.","B1'e sanal bas-bırak uygula; yalnız tek buton davranışını gözlemle.","Eksik ek butonlar düzeltilmeden iki/üç butonlu çalışmayı PASS kabul etme."],"why":{"g1":"Mevcut yalnız tek butonlu sanal faz/nötr kaynağıdır.","b0":"Sahnede tek B1 butonu bulunur; B2 ve B3 yoktur.","z":"Z1 zil yükü şimdilik yalnız B1 üzerinden kumanda edilir."}},{"id":"installation-systems-src-08","parts":["building-junction","ceiling-light"],"wires":4,"summary":"Bir buat içinde faz ve nötrün birbirine karıştırılmadan ayrı ek noktalarından armatüre taşınmasını gösterir.","explanation":"G1/L fazı B1-L buat bağlantısının 1 ucuna, bu ekin 2 ucu H1 aydınlatmanın X1 terminaline gider. G1/N nötrü ayrı B1-N ekinin 3 ucuna, 4 ucu H1/X2'ye ulaşır. Böylece faz ve nötr iki ayrı güzergâhta taşınır; birbirine doğrudan bağlanmaları kısa devre olur. Bu eğitim şemasında armatür PE koruma bağlantısı ve aydınlatma anahtarı bulunmadığından gerçek bina tesisatının eksiksiz uygulanmış olduğu kabul edilmez. Kaynak etiketinden ayrı ölçüm probu/yük gücü verilmediği için akım değeri uydurulmaz. Öğrenci sanal sahnede faz ve nötr eklerinin birbirinden fiziksel olarak ayrı kaldığını gözlemler.","goal":"B1-L/1–2 faz ve B1-N/3–4 nötr eklerini H1/X1–X2 ile doğru eşlemek; PE/anahtar eksiklerini görerek güvenli tasarım kabulünü ayırmak.","steps":["Sanal şemada G1/L → B1-L/1 → B1-L/2 → H1/X1 hattını takip et.","G1/N → B1-N/3 → B1-N/4 → H1/X2 dönüş hattını ayrı tut.","Faz ve nötr ek noktalarının farklı olduğunu göster; aynı terminal sanma.","Şemada anahtar ve armatür PE bağlantısı gösterilmediğini belirt; sahneyi tamamlanmış saha kurulumu olarak görme.","Sanal gözlem: her dört mevcut bağlantıyı listeden bul, bilinmeyen akım değerini hesaplamış gibi gösterme."],"why":{"g1":"L ve N kaynak uçları ayrı eklerden aydınlatma yüküne gider.","j1":"B1-L yalnız faz hattı için kullanılan buat ekidir.","j2":"B1-N yalnız nötr için ayrılmış buat ekidir.","h1":"H1 armatürü X1–X2 uçları arasındaki sanal yükü temsil eder."}},{"id":"installation-systems-src-09","parts":["one-line-bus-tap","mcb-1p","resistor"],"wires":4,"summary":"Bara çıkış noktasından alınan fazın koruma elemanı üzerinden R1 örnek yüküne gitmesini ve nötrden kaynağa dönmesini anlatır.","explanation":"G1/L → BT1/1 bara tap girişidir; BT1/2 → F1/1 çıkış koruma elemanına, F1/2 → R1/1 yükün üst ucuna gider. R1/2 → G1/N dönüşü kapatır. F1 simülasyondaki tek kutuplu otomatik sigorta temsilidir; gerçek açma eğrisi ve arıza kesme yeteneği doğrulanmadıkça bu sahneden koruma performansı çıkarılamaz. Kaynak 230 V RMS kabul edilirse R1=1 kΩ için ideal dirençli yük akımı I=230/1000=0,23 A, güç P=U²/R=52,9 W olur; bu yalnız kuramsal hesaptır, ölçülmüş değer veya gerçek direncin güç dayanımının yeterliliği değildir. Öğrenci sanal devrede F1'in durumunu değiştirerek yük yolundaki etkisini izler.","goal":"BT1/1–2, F1/1–2, R1/1–2 uçlarını ve ideal 0,23 A / 52,9 W hesabının varsayımlarını açıklamak.","steps":["Sanal devrede G1/L → BT1/1 → BT1/2 → F1/1 hattını izle.","F1/2 → R1/1 ve R1/2 → G1/N dönüşünü ayır.","230 V RMS ve R=1 kΩ varsayımıyla I=U/R ve P=U²/R hesaplarını yap.","Simülasyonda F1 açık/kapalı olduğunda R1'in durumunu karşılaştır; ekrandaki sonucu gözlemle.","Direncin gerçek güç değeri ve MCB trip eğrisi belirtilmediğinden fiziksel güvenlik PASS sonucuna varma."],"why":{"g1":"230 VAC tek faz kaynağın L/N simülasyon uçlarıdır.","bt":"BT1, bara kolundan alınan fazı F1'e aktarır.","f1":"F1 çıkış kolunun tek kutuplu koruma/anahtarlama elemanıdır; gerçek trip davranışı bu dersle kabul edilmez.","r1":"1 kΩ örnek yük, ideal 230 V RMS varsayımıyla akım ve güç hesabı yapmaya yarar."}},{"id":"installation-systems-src-10","parts":["phone-floor-box","phone-apartment-box","telephone"],"wires":4,"summary":"Telefon çiftinin kat kutusundan daire kutusuna ve telefon cihazına a/b damar kimliğini koruyarak ulaşmasını açıklar.","explanation":"KTK kat kutusunun a terminali DTK daire kutusunun a ucuna, KTK/b ise DTK/b'ye bağlanır. DTK/a → T1/a ve DTK/b → T1/b ile iki damar telefon cihazına ulaşır. Bu şemada besleme santrali, hat gerilimi, zil sinyali veya konuşma devresi modeli görünmüyor; bu nedenle telefon görüşmesi çalışıyor, zil çalıyor veya belirli gerilim ölçüldü denemez. Öğrencinin inceleyebileceği kazanım a/b çiftinin yol boyunca ayrılmadan ve birbirine kısa devre edilmeden eşlenmesidir. İki damar için sayısal akım/gerilim ancak gerçek kaynak ve ölçüm modeli eklendiğinde değerlendirilebilir.","goal":"KTK/a-b → DTK/a-b → T1/a-b güzergâhını ayırt etmek; fiziksel bağlantı sürekliliğini sinyal/görüşme kabulüyle karıştırmamak.","steps":["Sanal sahnede KTK/a → DTK/a → T1/a hattını baştan sona izle.","KTK/b → DTK/b → T1/b hattını ayrı takip et.","a ile b damarlarının yanlış çaprazlanıp çaprazlanmadığını gözlemle.","Bu sahnede santral beslemesi veya zil/konuşma simülasyonu olmadığı için ses ve sayısal voltaj bekleme.","İki damar eşlemesinin tam olduğunu şemadaki dört bağlantıyla doğrula; gerçek haberleşme işlevini REVIEW bırak."],"why":{"f1":"KTK kat tarafındaki telefon çiftinin a/b giriş kutusudur.","a1":"DTK a/b damarlarını daireye devam ettiren ara kutudur.","t1":"T1 çiftin son noktasıdır; sesli haberleşme davranışı bu sade şemada gösterilmez."}}];
for(const spec of mq07SemanticPilot){
 const lesson=L.byId[spec.id];
 if(!lesson)throw Error('MQ07 semantik pilot dersi eksik: '+spec.id);
 if(lesson.designStandard==='rich-reference-v1')throw Error('Accepted rich lesson cannot be changed: '+spec.id);
 const actual=lesson.project;
 if(!actual||actual.wires.length!==spec.wires||spec.parts.some(t=>!actual.components.some(c=>c.typeId===t)))
  throw Error('MQ07 lesson source topology drift: '+spec.id);
 lesson.summary=spec.summary;
 lesson.explanation=spec.explanation;
 lesson.learningGoal=spec.goal;
 lesson.beginnerSteps=spec.steps;
 lesson.materials=materialRows(actual).map(row=>spec.why[row.componentId]?{...row,why:spec.why[row.componentId]}:row);
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
  semanticPilot:'MQ07_WIRED_FIRST10_20261014',
  descriptionGroundedInActualPins:true,
  titleTopologyStatus:spec.review?'REVIEW':'SOURCE_ALIGNED',
  titleTopologyIssue:spec.review||null,
  numericalMeasurementStatus:'THEORY_ONLY_UNLESS_ACTUAL_INSTRUMENT_PRESENT',
  independentPedagogicalAcceptance:false,
  windowsVisualAcceptance:false};
}


// MQ-07 Batch 001–200: upgrade explanations IN the running curriculum.
// Scope is original lesson order; rich/accepted narratives and the earlier 10+NTC pilots are untouched.
// All connections are read from the current canonical graph; never invent a missing terminal.
const mq07Concepts={
'installation-grounding-src-03':['PE hattının kolon, linye ve sorti boyunca aynı koruma amacıyla sürekliliğini öğrenmek','PE, normal çalışma akımının dönüş hattı değildir; bir arıza durumunda koruma düzeninin çalışmasına yardımcı olan ayrı iletkendir. Kolon ana dağıtımdan, linye son devreye, sorti yük noktasına uzanır.','Sanal tabloda PE ile nötrün işlevlerini karşılaştır; şemada bağlantı ağı olmadığını belirt.'],
'installation-grounding-src-04':['Dağıtım panosundaki koruma barasının işlevini anlamak','İletken gövdelerin eşpotansiyele bağlanmasıyla dokunma gerilimi riski azaltılır. PE barasının nötr barasıyla aynı görevde olduğu varsayılmaz; düzen, tesisat topraklama sistemine göre değerlendirilir.','Pano modelinde PE, nötr ve fazın nerelerde ayrılması gerektiğini kavramsal olarak açıklamak.'],
'installation-grounding-src-05':['Motorun iletken gövdesindeki koruma bağlantısının amacını anlamak','Motorun çalışma akımı sargılardan akar; koruma iletkeni arıza akımı yolu ve koruma açması içindir. Koruma iletkeninin varlığı tek başına izolasyon testinin yapıldığı anlamına gelmez.','Motor gövdesi ile besleme uçlarını ayrı sınıflandır; gerçek PE sürekliliği bu sahnede ölçülmüyor.'],
'installation-grounding-src-06':['Topraklı prizde L, N ve PE işlevlerini ayırt etmek','Faz enerjiyi, nötr normal dönüşü, PE korumayı üstlenir. Sadece renk veya görünüşten süreklilik, kutuplama ve koruma başarısı doğrulanamaz.','Sanal priz görselinde üç farklı işlevi eşleştir; ölçüm kanıtının eksik olduğunu söyle.'],
'installation-grounding-src-07':['Topraklama direnci ölçer ile koruma toprağı noktasının farklı görevlerini tanımak','Topraklama direnci ölçer (sanal MET referansı) ve topraklama noktası bu kartta iki ayrı malzemedir. Ölçerin katalogda bağlantı terminalleri ve çalışır toprak direnci ölçüm çözümü yoktur; zemin koşulları, elektrot geometrisi ve PE sürekliliği ölçülmüş sayılmaz.','Topraklama direnci ölçer ile topraklama noktasını isimlendir; kablo ve gerçek ölçüm modeli bulunmadığından Ω değeri üretme.'],
'installation-grounding-src-08':['Yalıtkanlık direnci ölçer, iletken ve referans gövdeyi kavramsal olarak ayırt etmek','Yalıtkanlık direnci ölçer (sanal megohmmetre referansı), test edilecek iletken/klemens ve referans gövde ayrı materyallerdir. Ölçer görselinde L/E terminal kimlikleri bulunsa da bu kartta bağlantı kabloları, gerçek test gerilimi ve doğrulanmış MΩ ölçüm modeli yoktur.','Yalıtkanlık direnci ölçeri ve diğer iki referans materyali adlandır; enerjili kurulum veya gerçek izolasyon testi yapmadan MΩ sonucu uydurma.'],
'installation-grounding-src-09':['Yıldırımdan korunma iletkeninin görevini öğrenmek','İniş iletkeni, yıldırım akımı için tasarlanmış koruma sisteminin parçasıdır; bina PE ağından bağımsız bir oyuncak devre değildir. Kesit ve iniş güzergâhı standarda göre tasarlanır.','Sanal materyalde yakalama ucu, iniş iletkeni ve topraklayıcıyı kavramsal sırayla belirt.'],
'installation-grounding-src-10':['Kaçak akım koruma düzeninin neyi algıladığını açıklamak','Kaçak akım koruma cihazı faz ve dönüş akımlarının farkını değerlendirir; aşırı akım korumasıyla aynı görevde değildir. Gerçek açma süresi ve kaçak akım sonucu ölçülmedikçe doğrulanmış sayılmaz.','Sanal gösterimde akım farkı ve aşırı akım arızası kavramlarını ayır.'],
'installation-systems-src-01':['Adi anahtarın aydınlatmadaki kumanda görevini açıklamak','Tek kutuplu anahtarın açık konumu yük yolunu keser; kapalı konumu devre yolunu tamamlar. Bu derste henüz kayıtlı kablo olmadığı için lambanın gerçek enerjilenmesi gösterilmiş sayılmaz.','Sanal elemanların görevini ayır ve eksik kablo topolojisini REVIEW olarak tanımla.'],
'installation-systems-src-07':['Aydınlatma ile priz devrelerinin farklı yük ve koruma amaçlarını öğrenmek','Armatür aydınlatma yükü, priz çeşitli cihazların besleme noktasıdır. Koruma ve iletken seçimi yük/standart verilerine bağlıdır; bu sayfa gerçek kablolu devre doğrulaması değildir.','Sanal tabloda aydınlatma ve priz işlevlerini karşılaştır; eksik hatları işaretle.'],
'electronic-switching-src-01':['Röle bobin uçları ile değiştirici kontak uçlarının farklı işlevlerini tanımak','Bobinin enerjilenmesi elektromıknatıs oluşturur ve mekanik kontağı değiştirir; bobin akımı ile anahtarlanan yük devresi birbirinden ayrı olabilir. A1/A2 ve 11/12/14 yalnız ilgili modelde doğrulanır.','Katalogdaki bobin/kontak pinlerini incele; kayıtlı kablolu ölçüm olmadığını belirt.'],
'electronic-switching-src-03':['Motor yön değişiminin neden kutup/faz sırasına bağlı olduğunu anlamak','DC motorda uygun polarite terslemesi, üç fazlı asenkron motorda ise iki fazın yer değiştirmesi dönüş yönünü değiştirebilir. Elektriksel/mekanik kilitleme olmadan iki yönü birlikte seçmek doğru değildir.','Kavramsal motor–kontaktör öğelerini göster; şemada yön devresi bulunmadığı için sonuç uydurma.'],
'electronic-switching-src-08':['Schmitt tetikleyicinin neden iki ayrı eşik kullandığını öğrenmek','Pozitif geri besleme yükselirken ve düşerken farklı anahtarlama eşikleri (histerezis) oluşturur; bu nedenle giriş gürültüsü çıkışın sürekli titremesine yol açmaz.','İki eşik arasındaki bölgeyi tarif et; burada kablolu ölçüm devresi olmadığı için V değerini varsayma.'],
'electronic-switching-src-09':['FET ile gecikmeli kapatma fikrini öğrenmek','FET kapı geriliminin RC devresiyle zamanla değişmesi anahtarlama gecikmesine neden olabilir. τ=R×C zaman sabitidir; gerçek R/C ve eşik verilmeden gecikme süresi hesaplanamaz.','Sanal kartta kapı, drenç/akım yolu ve depolama elemanı görevlerini ayır.'],
'electronic-switching-src-10':['MOSFET sağlamlık kontrolünün prensibini tanımak','MOSFET gate ucunun yalıtılmış oluşu ve drain–source yolunun gate potansiyeline bağlı olması ölçümün temelidir; sadece tek direnç okumasıyla cihaz sağlam ilan edilemez.','Gate, drain, source konumlarını karşılaştır; ölçüm senaryosu eksikliğini bildir.'],
'electronic-switching-src-11':['MOSFET ile DC motor hızının neden PWM ile değiştiğini öğrenmek','PWM anahtarın açık kalma oranını değiştirerek motora uygulanan ortalama enerjiyi düzenler; sürücü, akım sınırı ve geri EMK motor davranışında önemlidir.','Duty cycle arttığında beklenen eğilimi açıkla; motor/PWM simülasyonu yoksa sonucu sayısallaştırma.'],
'electronic-switching-src-12':['IGBT tabanlı güç anahtarlamanın temelini ayırt etmek','IGBT kontrol edilen gate sürmesiyle güç yolunu anahtarlar; AC dimmer topolojisi uygun anahtarlama ve tetikleme gerektirir. Tek IGBT simgesi eksiksiz dimmer sayılmaz.','Sanal elemanları incelerken tetikleme ve yük yolunun bulunup bulunmadığını göster.'],
'electronic-switching-src-13':['SCR tristörün tetiklenmesini anlamak','Anot–katot yönünde uygun kutuplama ve gate tetiklemesiyle iletim başlayabilir; iletim akımı tutma akımının altına düşene dek sürdürülebilir.','Gate ile anot–katot yolunu ayırt et; gerçek tetikleme devresi olmadığı için TURN-ON ölçülmüş sayılmaz.'],
'electronic-switching-src-14':['SCR kesiminin neden gate bırakmakla her zaman sağlanmadığını açıklamak','SCR tetiklendikten sonra anot akımı tutma akımının altına düşürülmedikçe iletim sürebilir. Bu nedenle sıradan anahtarın bırakılmasıyla eşdeğer değildir.','Sanal materyal üzerinde gate ve ana akım yolunu ayır; komütasyon deneyi henüz yok.'],
'electronic-switching-src-15':['SCR’nin AC yarım periyot davranışını incelemek','Alternatif akımın sıfır geçişinde anot akımı azalır, SCR tutma akımını kaybedebilir. Uygun gate zamanlaması ile iletilen yarım periyot değişir.','Sinyal dalgası ve tetikleme açısını kavramsal olarak karşılaştır; mevcut sayfada gerçek dalga simülasyonu yok.'],
'electronic-switching-src-16':['Triyakın çift yönlü anahtarlama özelliğini ayırt etmek','Triyak AC yönlerinin ikisinde de uygun tetiklemeyle iletebilir; doğru akımda doğal sıfır geçişi olmadığından kesim şartları farklıdır.','Triyakın MT1, MT2 ve gate işlevlerini katalog üzerinden tanı; kablolu deney yok.'],
'electronic-switching-src-17':['Triyak dimmerde ateşleme açısının etkisini açıklamak','Ateşleme gecikmesi AC yükün etkin gerilimini ve gücünü değiştirir. Gerçek RMS hesaplaması için kaynak dalgası, açı ve yük gereklidir.','Sanal karttaki triyak ile kontrol sinyalinin işlevini ayır; görüntüden güç sonucu çıkarma.'],
'electronic-switching-src-18':['Optokuplörün giriş ve çıkış arasındaki optik izolasyonunu anlamak','Giriş LED’i ışıkla çıkış fotoelemanını etkiler; iki taraf doğrudan iletkenle bağlanmaz. İletim oranı ve polarite modele bağlıdır.','Giriş LED’i ile çıkış uçlarını ayır; bu ekranda gerçek izolasyon ölçümü yapılmıyor.'],
'electronic-switching-src-19':['Opto-triyakla güç triyakının sürülme mantığını anlamak','Kontrol LED’i optik çıkışı tetikleyebilir; yük enerjisi ile düşük gerilimli kumanda ayrılır. Flașörün periyodu ayrıca bir zamanlayıcı gerektirir.','Optik giriş, anahtarlanan taraf ve zamanlayıcı eksiklerini belirle.'],
'sensor-analog-apps-src-09':['Yük hücresinin kuvveti nasıl elektriksel işarete çevirdiğini anlamak','Strain gauge köprü düzeninde kuvvetle dirençler değişir; küçük diferansiyel çıkış bir yükselteç/ADC ile okunabilir. mV/V değeri besleme ve yüke bağlıdır.','Yük hücresi uçlarını ve gerekiyorsa yükselteç ihtiyacını açıkla; bu sahnede ölçüm devresi yok.'],
'sensor-analog-apps-src-12':['IR ışık vericisi ve alıcısının farklı görevlerini öğrenmek','IR verici ışık yayar; alıcı gelen modülasyon/ışık şiddetine tepki verir. Ortam ışığı ve uygun sürme akımı sonuçları etkiler.','Verici ve alıcıyı ayırt et; gerçek optik iletişim kanıtı olmayan sahnede algılama PASS verme.'],
'sensor-analog-apps-src-13':['Sensör kumandasının algılama ve çıkış katmanlarını ayırmak','Algılayıcı fiziksel büyüklüğü elektriksel çıkışa çevirir; kontrol yükü ise çıkış tipine ve beslemeye göre bağlanır. PNP/NPN/analog farkı önemlidir.','Gösterilen elemanların çıkış tiplerini karşılaştır; kablo yoksa kontrol devresi gibi değerlendirme.'],
'sensor-analog-apps-src-14':['IR alıcı sinyalinin yük anahtarlamasına nasıl dönüşebileceğini açıklamak','Alıcı çıkışı çoğu zaman doğrudan yük akımı süremez; arada uygun sürücü/denetleyici gerekebilir. Sistem optik algılama ve yük beslemesini ayrı ele alır.','Hangi gerçek sürücü elemanlarının eksik olduğunu göster.'],
'sensor-analog-apps-src-15':['Güneş hücresinin ışığı elektrik enerjisine dönüştürmesini öğrenmek','Fotovoltaik hücrenin uç gerilimi ve akımı ışınım ile yüke bağlıdır; açık devre gerilimi çalışan yük gerilimi değildir.','Hücre ve yük arasındaki farkı açıkla; mevcut sahnede I-V ölçüm eğrisi yok.'],
'sensor-analog-apps-src-17':['Sensörlerde enerji dönüşümü ile işaret şartlandırmayı ayırmak','Termistör direnç, termokupl küçük gerilim, Hall elemanı manyetik etki ve piezo eleman gerilme/kuvvet değişimini farklı elektriksel büyüklüklere dönüştürür.','En az iki sensörü giriş büyüklüğü ve çıkış büyüklüğüne göre karşılaştır.'],
'sensor-analog-apps-src-18':['Otomobillerde sensörlerin neden farklı fiziksel ilkeler kullandığını öğrenmek','Sıcaklık, devir, konum ve basınç farklı algılama modelleri gerektirir; ECU giriş seviyesi ve arıza teşhisi sensör tipine bağlıdır.','Sanal karttaki örnekleri ölçtükleri fiziksel büyüklüğe göre ayır.'],
'sensor-analog-apps-src-19':['NTC, PT100 ve termokupl gibi sıcaklık sensörlerini karşılaştırmak','NTC doğrusal olmayan direnç verir; PT100 platin direnç ölçümüne, termokupl termoelektrik gerilime dayanır. Ölçüm devreleri ve doğruluk sınırları farklıdır.','Uygun ölçüm türünü seç; şemada bulunmayan cihaz için sıcaklık değeri üretme.'],
'sensor-analog-apps-src-20':['Hall etkisiyle manyetik alan algılama mantığını öğrenmek','Hall elemanı akım taşıyıcısının manyetik alan içindeki sapmasına dayalı sinyal üretir; anahtar ve doğrusal sensör çıkışları farklıdır.','Manyetik hedefi, beslemeyi ve olası çıkışı rol olarak ayır; gerçek test yok.'],
'sensor-analog-apps-src-21':['Güneş pilli aydınlatmada üretim, depolama ve yük akışını ayırmak','Güneş hücresi enerji üretir, uygun şarj denetimi pili korur, ışık algılama ise lambanın ne zaman çalışacağını belirler. Bunlar farklı görevlerdir.','Sanal elemanlarda panel, pil, kontrol ve lamba rollerini eşleştir; şarj akımı simüle edilmedi.'],
'sensor-analog-apps-src-22':['Optik verici-alıcı algılamasında ışık yolunu anlamak','Verici–alıcı arasındaki ışığın kesilmesi ya da yansıması bir algılama olayıdır; mesafe ve ortam koşulları sonucu etkiler.','Karşılıklı ve yansımalı optik sensör farkını anlat; gerçek ışın simülasyonu yok.'],
'opamp-apps-src-09':['Op-amp turn-on gecikmesinin eşik/zaman davranışını öğrenmek','RC ağının gerilimi zamanla bir karşılaştırma eşiğine ulaşabilir; çıkışın gecikmesi direnç, kondansatör ve eşik gerilimine bağlıdır.','τ=R×C bağıntısını açıkla; burada kablolu RC deneyi bulunmadığını belirt.'],
'opamp-apps-src-10':['Op-amp turn-off gecikmesini turn-on gecikmesinden ayırmak','Kondansatörün şarj ve deşarj yolu farklıysa kapanış eşiğine ulaşma zamanı açılıştan farklı olabilir.','Sanal kartta RC ve eşik kavramlarını ayır; gerçek süre ölçülmedi.'],
'opamp-apps-src-15':['Hassas doğrultucu ile sıradan diyot doğrultucunun farkını anlamak','Op-amp geri beslemesi diyotun ileri gerilim etkisini azaltacak biçimde düzenlenebilir; gerçek yarım dalga doğrultma için diyot ve geri besleme topolojisi gerekir.','Sahnede eksik diyot/geri besleme varsa gerçek doğrultucu kabulünü REVIEW bırak.'],
'opamp-apps-src-16':['Enstrümantasyon yükseltecinin ortak-mod bastırma amacını tanımak','İki ölçüm noktasının küçük diferansiyel gerilimi ortak-mod bileşen yanında ölçülür; kazanç ve direnç eşleşmesi önemlidir.','Diferansiyel ve ortak-mod girişleri kavramsal olarak ayır; burada tam yükselteç topolojisi yok.'],
'oscillator-filter-apps-src-01':['Colpitts osilatörün geri besleme prensibini anlamak','LC rezonans ağında kapasite bölücüsü geribesleme oranını belirler. İdeal rezonans frekansı L ve eşdeğer C değerlerine bağlıdır.','İki kondansatörün ve bobinin işlevini ayır; sanal osilasyon ölçülmedi.'],
'oscillator-filter-apps-src-02':['Hartley osilatörün endüktif geribesleme mantığını öğrenmek','Bobin bölümü/tap noktası geri beslemeyi sağlar; LC rezonans enerji alışverişi osilasyon frekansını belirler.','Colpitts kapasite bölücüsü ile Hartley endüktans bölücüsünü karşılaştır.'],
'oscillator-filter-apps-src-03':['Kristal osilatörün frekans kararlılığı avantajını anlamak','Piezoelektrik kristalin mekanik rezonansı dar bantlı yüksek Q tepkisi oluşturur. Gerçek çalışma için uygun sürücü devresi gerekir.','Kristal rezonatörü bağımsız güç kaynağı sanma; çalışan osilatör devresi henüz yok.'],
'oscillator-filter-apps-src-04':['RC faz kaymalı osilatörün faz koşulunu kavramak','RC kademeleri giriş işaretinin fazını değiştirir; eviren yükselteç ilave faz ve yeterli çevrim kazancı sağlayarak salınım koşulunu tamamlar. Kademelerin direnç/kondansatör değerleri frekansı belirler; yalnız kondansatör varlığı kendi kendine çalışan osilatör demek değildir.','RC değerleri/kat sayısı belli değilse frekans uydurma.'],
'oscillator-filter-apps-src-05':['Wien köprüsü osilatörün frekans seçici geri beslemesini tanımak','Wien RC köprüsü belirli frekansta uygun faz/kazanç sağlar; genlik kontrolü gerekir. Eşit R ve C varsayımıyla f≈1/(2πRC) olur.','Gerçek R/C yoksa bu bağıntıyı örnek formül olarak ele al.'],
'oscillator-filter-apps-src-06':['Tek kararlı multivibratörün tetikleme ve geri dönüş özelliğini anlamak','Bu devrenin bir doğal kararlı durumu vardır. Uygun tetikleme çıkışı geçici olarak diğer duruma taşır; enerji depolayan RC ağının gelişimi eşik seviyesini geçtiğinde sistem önceki kararlı konuma döner. Tetikleme genliği, eşik ve R/C değerleri olmadan zaman hesaplanamaz.','Sahnedeki zamanlayıcı ağı yoksa süre/çıkış ölçümü olarak sunma.'],
'oscillator-filter-apps-src-07':['Çift kararlı multivibratörde durum belleğini anlamak','Karşılıklı geri besleme iki ayrı kararlı durum yaratır. Tetikleme bir transistör/anahtarlama kolunu etkinleştirirken diğerini bastırır; tetik kaldırıldığında seçilen durum korunabilir. Bu davranış bir bit bellek etkisidir, serbest çalışan osilatör değildir.','Bunu kendiliğinden salınan kararsız multivibratörden ayır.'],
'oscillator-filter-apps-src-08':['Kararsız multivibratörün periyodik değişimini kavramak','Kararlı durum yoktur; iki kısım sırayla iletime geçerek alternatif çıkış üretir. RC yolları periyodu etkiler.','Periyot hesabı için gerçekte bulunmayan R/C uydurma.'],
'oscillator-filter-apps-src-09':['Kırpıcının sinyal genliğini nasıl sınırladığını öğrenmek','Diyot ya da referans eşik devresi dalga biçiminin bir bölümünü sınırlar; eşik/polarite hangi kısmın kırpılacağını belirler.','Giriş ve kırpılmış çıkış arasındaki farkı kavramsal olarak çiz; canlı dalga yok.'],
'oscillator-filter-apps-src-10':['Kenetleyicinin dalga biçiminin DC seviyesini neden değiştirdiğini öğrenmek','Diyot–kondansatör ağı, uygun zaman sabitiyle dalgaya DC ofset ekleyebilir; kırpıcı gibi tepe kesmek temel amacı değildir.','Kırpma ve kenetleme çıktılarını karşılaştır.'],
'oscillator-filter-apps-src-11':['Miller etkisinin eşdeğer giriş kapasitesine etkisini tanımak','Giriş-çıkış arasındaki geri besleme kapasitesi kazançla birlikte girişte daha büyük eşdeğer kapasite gibi görünebilir.','Kazancın kapasite etkisi ve bant genişliğine nasıl bağlandığını açıklamak.'],
'oscillator-filter-apps-src-12':['Bootstrap devresinin neden gerilim kaydırma kullandığını anlamak','Kondansatör belirli anahtarlama çevrimlerinde şarj edilip yüksek taraftaki sürücüye göre yüzer bir besleme oluşturabilir; topolojiye bağlıdır.','Bootstrap yüklenmesi ve yeniden şarj ihtiyacını açıklamak; gerçek sürücü gösterilmemiştir.'],
'oscillator-filter-apps-src-13':['Schmitt Trigger devresinin histerezis ile kararlılık sağlamasını öğrenmek','İki eşik giriş dalgalanmasının tek eşiği tekrar tekrar geçip çıkışı titreştirmesini önler. Pozitif geri besleme kullanılır.','Yükselen ve düşen eşikleri karşılaştır; sayısal değer verilmediyse hesaplanmış sayma.'],
'oscillator-filter-apps-src-14':['NE555 osilatörün eşik ve zamanlama işleyişini öğrenmek','555 devresinde kondansatörün 1/3 ve 2/3 besleme eşikleri arasında şarj/deşarj olması salınım oluşturabilir. R ve C periyodu belirler.','Discharge, trigger ve threshold uçlarının farklı rollerini açıkla.'],
'oscillator-filter-apps-src-15':['555 PWM ile doluluk oranının nasıl ayarlandığını anlamak','Zamanlama ağının şarj/deşarj yolları değiştirildiğinde çıkışın ON/OFF süre oranı değişebilir; frekans ve duty ayrı parametrelerdir.','Aynı frekansta iki farklı duty sonucu nasıl değiştirir açıkla; çıkış ölçülmedi.'],
'oscillator-filter-apps-src-16':['555 tek kararlı kipinin tetik ve zamanlama işleyişini öğrenmek','Tetikleme ile tek çıkış darbesi başlar, kondansatör eşik gerilimine ulaşınca biter. Yaklaşık T≈1,1RC bağıntısı standart temel tek-kararlı bağlamı içindir.','R/C sayıları bilinmiyorsa sayısal süre verme.'],
'oscillator-filter-apps-src-17':['555 çift kararlı kontrol kipini tek kararlıdan ayırmak','Set/reset etkileri çıkış durumunu korur; zamanlayıcı kondansatörün otomatik süre sonu dönüşü her çift kararlı kurulumda zorunlu değildir.','Tetik/RESET durumlarını karşılaştır; henüz gerçek TTL dalga simülasyonu yok.'],
'oscillator-filter-apps-src-18':['Alçak geçiren aktif filtrenin frekans seçiciliğini öğrenmek','Düşük frekanslar daha az zayıflarken yüksek frekanslar bastırılır; RC ağı ve op-amp topolojisi kesim frekansını belirler.','Kavramsal f_c=1/(2πRC) bağıntısını incele; gerçek bileşen değerleri olmadan sayı hesaplama.'],
'oscillator-filter-apps-src-19':['Yüksek geçiren aktif filtrenin frekans seçiciliğini öğrenmek','Yüksek frekanslar geçirilirken DC/düşük frekanslar bastırılır. Kazanç ve kesim frekansı gerçek aktif filtre topolojisine bağlıdır.','Girişte DC ve AC için beklenen farkı kavramsal olarak açıklamak; burada kablolu deney yok.']
};
const mq07WiredFocus={
'installation-systems-src-11':['Anten hattının bölümler arasındaki sinyal sürekliliğini göstermek','Koaksiyel bağlantıda merkez iletken sinyali taşır; kalkan/şase dönüş ve parazitten korunma için ayrı yoldur. Konnektörün sinyal ve kalkan terminalleri karıştırılırsa kayıp oluşabilir.','Kayıtlı kablo uçlarını izle; şemada RF kaynak/uygun test cihazı yoksa sinyal seviyesi uydurma.'],
'installation-systems-src-12':['KNX kontrolü ile aydınlatma/güneşlik yükünü ayırmak','Kontrol haberleşme yolu ve yük besleme bağlantıları aynı elektriksel hat değildir. Aktüatörün çıkışı yük yolunu anahtarlar; tek başına yazılım komutu fiziksel enerjiyi üretmez.','Sanal aktüatör–yük bağlantılarını izle; haberleşme telegramı doğrulanmıyorsa bus kabulünü REVIEW tut.'],
'electronic-switching-src-02':['Röle mühürlemesinde START bırakıldıktan sonra enerjinin neden sürdüğünü öğrenmek','START normalde açık kontağı bobini başlatır; yardımcı NO kontak START’a paralel kapanır ve STOP normalde kapalı yol üzerinden bobini besler. STOP açılınca her iki yol da enerjisiz kalmalıdır.','Başlat→bırak→STOP sanal sırasını uygula; bobin ve kontağın değişimini izle.'],
'electronic-switching-src-04':['BJT transistörün küçük kumanda sinyaliyle yük akımını anahtarlamasını anlamak','NPN için B-E sürmesi ile C-E yük yolunun iletime geçmesi farklı akım yollarıdır. Baz direnci akımı sınırlar; yük beslemesi kendi geri dönüş yolunu tamamlamalıdır.','Giriş ve çıkış kaynaklarını ayır; baz akımının kolektör akımıyla aynı olmadığını açıkla.'],
'electronic-switching-src-05':['Potansiyometre ile BJT eşik/öngerilim ilişkisinin anlaşılması','Potansiyometrenin sürgü konumu baz kutuplamasını etkileyebilir; transistörün akım sürmesi yük ve baz dirençlerine bağlıdır.','Sanal RV ayarını değiştirip ölçülebilen yük değişimini izle; eşik ölçülmediyse volt belirtme.'],
'electronic-switching-src-06':['Zaman gecikmeli devrede giriş anahtarı ve depolama etkisini ayırmak','RC şarj/deşarj ve BJT eşik davranışı gecikme oluşturabilir; gerçek şemada R/C yolu bulunmuyorsa gecikme süresi doğrulanamaz.','Sanal tetikleme sonrası yük gecikmesini ölçmeden kesin süre iddia etme.'],
'electronic-switching-src-07':['Gecikmeli bırakmada enerji depolama ve kesim eşiğini anlamak','Sürücü gerilimi azaldıktan sonra kondansatördeki enerji geçici süre transistörü etkileyebilir; gerçek kapatma süresi ve güvenli yük davranışı parametreye bağlıdır.','Sanal OFF sonrası yük durumunu karşılaştır; kayıtsız kapasiteyle saniye hesabı verme.'],
'sensor-analog-apps-src-01':['NTC sıcaklık artışının direnç bölücüyü nasıl değiştirdiğini açıklamak','NTC sıcaklıkla direnci düşen elemandır. Üst kolda NTC ve altta 10 kΩ R1 varsa V(IN+)=24×R1/(R_NTC+R1) yükselir; karşılaştırıcı bunu 12 V referansla kıyaslar.','Sanal sıcaklığı değiştirerek bölücü/çıkış ilişkisini incele; analog ölçümü gerçek sanal çıkıştan oku.'],
'sensor-analog-apps-src-02':['PTC sıcaklık artışının gerilim bölücünün yönünü nasıl etkilediğini açıklamak','PTC direnci ısınınca artar. Üst kolda PTC olduğunda sabit alt dirençte sensör düğümü gerilimi düşer; 12 V karşılaştırma eşiğine göre çıkış durumunu değiştirir.','NTC ve PTC bölücü yönlerinin neden ters olduğunu açıklamak.'],
'sensor-analog-apps-src-03':['Termokuplun sıcaklık farkını küçük termoelektrik gerilime çevirmesini öğrenmek','Termokuplun ölçüm gerilimi sıcak/soğuk birleşim farkına bağlıdır; doğrudan NTC gibi 10 kΩ direnç kabul edilemez. Kaynak ve ölçüm katı varsa gerçek terminaller izlenir.','Sanal termokupl uçlarını ve referans gereksinimini göster; koşulları doğrulanmayan °C/mV üretme.'],
'sensor-analog-apps-src-04':['PT100 direnç termometresinin bağlantı/topoloji gereksinimini öğrenmek','PT100 nominal 0 °C’de 100 Ω platin dirençli sensördür; kablo direncinin etkisi 2/3/4 telli okumada farklıdır. Kaynaktaki ölçme modeline bağlı kal.','Mevcut gerçek pinleri kontrol et; farklı terminali uydurarak hassasiyet iddia etme.'],
'sensor-analog-apps-src-05':['LM35 sensörünün sıcaklığı gerilim işaretine dönüştürmesini anlamak','LM35 sınıfı sıcaklık sensörü çıkışı mV/°C ölçeğine göre yorumlanır; uygun besleme, GND ve çıkış hattı ayrı olmalıdır.','Sanal modeldeki VCC/GND/OUT uçlarını eşleştir; fiziksel sıcaklık deneyini onaylama.'],
'sensor-analog-apps-src-06':['Reed kontakta manyetik alanın anahtarlama etkisini açıklamak','Mıknatıs yaklaşınca reed kontak açılır/kapanır; kontak pasif olduğundan yük enerjisini üretmez.','Kontak uçlarını izle ve yük beslemesini ayır; model durumunu değiştirip tepki gözle.'],
'sensor-analog-apps-src-07':['Hall algılamasında manyetik alan ile elektriksel çıkışı ayırmak','Hall elemanı manyetik alana tepki verir; modül analog veya sayısal olabilir. Bağlanan çıkış terminali yükün/denetleyicinin girişine uygun olmalıdır.','Sanal hedef değişimi ile varsa çıkış durumunu karşılaştır; ölçüm yoksa mT belirtme.'],
'sensor-analog-apps-src-08':['Piezo sensörün mekanik basınç/titreşimi gerilime çevirmesini kavramak','Piezo malzeme dinamik mekanik zorlama altında elektrik yükü üretir; doğrudan sabit DC kaynağa eşdeğer değildir.','Giriş/ölçüm terminallerini göster; gerçek mekanik kuvvet ve çıkış ölçümü eksikse REVIEW bırak.'],
'sensor-analog-apps-src-10':['LDR ışık azaldığında direnç artışını karşılaştırıcı eşiğine bağlamak','LDR genellikle ışık azalınca direnci yükselir. Üst kol LDR ve alt kol sabit dirençse sensör düğümü karanlıkta düşebilir; 12 V referansa göre çıkış yönü yorumlanır.','Sanal aydınlık–karanlık değişiminde IN+/IN− seviyelerini izle.'],
'sensor-analog-apps-src-11':['LDR ile dimmer başlığının gerekli kontrol/topoloji farkını anlamak','Işık algılama, AC faz kontrolü ve yük akımı birbirinden farklı işlerdir. Şemada yalnız karşılaştırıcı ağı varsa gerçek faz açısı dimmeri doğrulanmış sayılmaz.','Kontrol sinyali ile AC güç sürücüsü eksiklerini ayır; dimmer çıktısına REVIEW ver.'],
'sensor-analog-apps-src-16':['Ses algılamasında sensör çıkışı ile buzzer sürücüsünü ayırmak','Ses sensörü ortam seviyesini analog/dijital eşikle algılar; denetleyici çıkışının buzzerı tetiklemesi ayrı bir sinyal/yük hattıdır.','Sanal mikrofon eşiği ve kontrol çıkışının varsa durumunu karşılaştır; desibel ölçümü yapıldığını söyleme.'],
'opamp-apps-src-01':['Eviren yükselteçte giriş ve geri beslemenin kazanç işaretini belirlemesi','Tek beslemeli devrede 12 V orta referans kullanılıyorsa R1=10 kΩ giriş ve R2=47 kΩ geri besleme ile ideal küçük işaret kazancı −R2/R1=−4,7 olur; çıkış fiziksel besleme sınırlarını aşamaz.','IN− üzerinden R1 ve OUT→R2 geri besleme yolunu incele; sanal AC sinyal kaynağını izle.'],
'opamp-apps-src-02':['DC eviren yükselteçte orta referans ve sınırlı çıkış salınımı','+24 V tek beslemede giriş işareti 12 V sanal referans etrafında evirilebilir. −47/10=−4,7 fark kazancı geçerlidir; 0–24 V sınırı nedeniyle ideal formül doygunluğa girer.','RV sürgüsünü sanal olarak değiştir; Vout ile girişin değişim yönünü karşılaştır.'],
'opamp-apps-src-03':['Evirmeyen AC yükselteçte geri beslemeyle kazancın belirlenmesi','IN+ sinyali alır; OUT→R2→IN− ve IN−→R1→0 V geri beslemede ideal kazanç 1+47/10=5,7 olur. Tek besleme giriş/çıkış ortak-mod sınırlamalarını ayrıca gerektirir.','Sanal giriş ile çıkış genliğini karşılaştır; 5,7 çarpanını doygunluğun dışında hesapla.'],
'opamp-apps-src-04':['Evirmeyen DC yükselteçte giriş ve geri besleme uçlarını ayırmak','IN+ DC potansiyometre işaretini alır; R2=47 kΩ ve R1=10 kΩ ile ideal kapalı çevrim kazancı 5,7 olur. Çıkışın kaynak geriliminden büyük olacağı iddia edilemez.','Sanal RV ayarı ile çıkışı karşılaştır; doygunluk durumunu kayıtla.'],
'opamp-apps-src-05':['Gerilim izleyicinin çıkışı girişe geri besleyerek birim kazanç sağlaması','OUT doğrudan IN− ucuna bağlanır, sinyal IN+ ucundadır. İdeal durumda çıkış giriş gerilimini izler; bu devre gerilim kazancı için değil yüksek giriş empedansı/ara kat amaçlıdır.','Sanal giriş ve çıkış gerilimi farkını izle; besleme sınırlarını koru.'],
'opamp-apps-src-06':['Op-amp karşılaştırıcının girişleri hangi eşikle kıyasladığını öğrenmek','R3/R4 eşit 10 kΩ ile +24 V kaynaktan yaklaşık 12 V eşik oluşur; IN− bu referansı, IN+ RV sinyalini alır. IN+>IN− durumunda OUT yüksek, düşük olduğunda OUT düşük beklenir.','RV sürgüsünü değiştirerek sanal OUT davranışını izle; LM358 çıkışı ideal 24 V olamaz.'],
'opamp-apps-src-07':['LDR sensörünün aydınlığa bağlı direncini LM358P karşılaştırma eşiğiyle ilişkilendirmek','LDR üst kol, 10 kΩ R1 alt kol olarak +24 V ve 0 V arasında bölücü oluşturur; IN+ gerilimi V=24×10k/(R_LDR+10k) bağıntısını izler. R2/R3 referans bölücüsü U1 pin 2 (IN−) için 12 V oluşturur; ışık arttığında LDR direncinin düşmesi IN+ gerilimini yükseltir. Karşılaştırıcı çıkışının gerçek seviyesini ölçüm belirler.','Sanal aydınlık değişimi mümkünse R_LDR, IN+/pin 3 ve OUT/pin 1 sonuçlarını izle; gerçek Lux değeri gösterilmiyorsa uydurma.'],
'opamp-apps-src-11':['Çıkarıcı yükseltecin iki bağımsız giriş gereksinimini anlamak','Gerçek fark yükselteci V2−V1 gibi iki girişin uygun direnç ağıyla kıyaslanmasını ister. Şemada tek RV giriş ve R1/R2 eviren yolu varsa eldeki düzen fark yükselteci olarak doğrulanamaz.','İkinci bağımsız sinyal girişini ve gerekli direnç eşleşmesini bulamazsan REVIEW bırak.'],
'opamp-apps-src-12':['Toplayıcı devrenin birden çok giriş akımını toplama şartını öğrenmek','Toplama yükseltecinde farklı girişlerden akımlar ortak IN− düğümünde toplanır. Tek girişli R1/R2 ağı varsa başlıktaki çoklu giriş işlevi doğrulanamaz.','İki ayrı sinyal kaynağı ve giriş dirençlerini şemada ara; yoksa gerçek toplamı iddia etme.'],
'opamp-apps-src-13':['Op-amp türev alıcıda giriş kondansatörünün rolünü açıklamak','IN− giriş yolundaki kondansatör gerilim değişim hızına bağlı akım oluşturur; Rf çıkış geri beslemesiyle ideal vout∝−RC·dvin/dt ilişkisi kurulur.','Girişte C1 ve çıkışta R2’yi göster; gerçek dalga tepkisi için simülasyon gereklidir.'],
'opamp-apps-src-14':['Op-amp integratörde geri besleme kondansatörünün rolünü açıklamak','R1 giriş akımını sınırlar; IN−/OUT arasındaki C1 üzerinde yük birikir ve ideal vout∝−(1/RC)∫vin dt davranışı oluşur.','C1 geri besleme yolu ile R1 giriş yolunu ayır; doygunluk ve DC ofset koşullarını not et.'],
'opamp-apps-src-17':['Schmitt tetikleyicide pozitif geri beslemenin eşiği kaydırmasını öğrenmek','OUT→R2→IN+ pozitif geri beslemesi çıkış durumuna bağlı iki eşik yaratır. Bu histerezis, tek eşik yakınında gürültüyle sürekli anahtarlamayı önler.','RV girişini ve OUT geri beslemesini izle; eşikleri direnç/model olmadan sayı olarak verme.']
};
function mq07DescribePin(p,r){
 if(!r)return '?';
 if(r.j!==undefined)return 'J'+String(r.j);
 const c=(p.components||[]).find(x=>x.id===r.c);
 return (c?.ref||c?.label||r.c||'?')+'/'+(r.p??'?');
}
function mq07MaterialReason(c){
 const id=String(c.typeId||'').toLowerCase(),label=c.label||c.ref||c.id;
 if(/supply|bench-supply|source/.test(id))return label+' besleme/dönüş potansiyellerinin sanal kaynağıdır; akım ölçümü değildir.';
 if(/lm358|opamp/.test(id))return label+' besleme ve IN+/IN− girişlerini karşılaştırır ya da geri besleme ile yükseltir; OUT terminalinin besleme sınırları vardır.';
 if(/ntc/.test(id))return label+' sıcaklık artınca direnci azalan sensör elemanıdır.';
 if(/ptc/.test(id))return label+' sıcaklık artınca direnci artabilen sensör elemanıdır.';
 if(/ldr|photoresist/.test(id))return label+' ışıkla direnç değişimini elektriksel işarete dönüştürür.';
 if(/resistor/.test(id))return label+' gerilim bölme, giriş akımı sınırlama veya geri besleme görevi görür; kesin işlevini bağlı uçlardan takip et.';
 if(/capacitor/.test(id))return label+' gerilim değişiminde yük depolar; RC zamanlaması veya işaret işleme etkisi bağlı ağda incelenir.';
 if(/potentiometer/.test(id))return label+' sürgü konumuyla ara düğüm gerilimini değiştirir; sıcaklık/ışık sensörü değildir.';
 if(/relay|contactor|coil|contact/.test(id))return label+' bobin veya kontak grubuyla kumanda ve yük devresini birbirinden ayırır.';
 if(/probe-red/.test(id))return label+' uygun ölçüm noktasına temas eden kırmızı sanal probdur.';
 if(/probe-black/.test(id))return label+' sanal COM/referans noktasına temas eden siyah probdur.';
 if(/meter|unit-ut/.test(id))return label+' yalnız uygun kademe/temas noktalarıyla sanal ölçüm yapar; sayı gerçek okumayla doğrulanır.';
 if(/sensor|thermocouple|pt100|hall|piezo|lm35/.test(id))return label+' fiziksel büyüklüğü modeline özgü direnç, gerilim veya dijital çıkışa çevirir.';
 if(/motor|lamp|light|buzzer|bell/.test(id))return label+' sürücü/anahtarlama sonucunun görüldüğü yük veya göstergedir.';
 return label+' devrenin kayıtlı elemanıdır; rolü şemadaki gerçek terminal bağlantılarına göre değerlendirilir.';
}
mq07WiredFocus['sensor-analog-apps-src-13']=mq07Concepts['sensor-analog-apps-src-13'];
mq07WiredFocus['sensor-analog-apps-src-14']=mq07Concepts['sensor-analog-apps-src-14'];
const mq07Batch200={examined:0,richProtected:0,earlierProtected:0,enrichedWired:0,enrichedReference:0,reviewIds:[],updatedIds:[]};
for(const lesson of L.lessons.slice(0,200)){
 mq07Batch200.examined++;
 if(lesson.designStandard==='rich-reference-v1'||!/-src-|-outline-/.test(lesson.id)||lesson.topicId==='dc-circuits'||(lesson.topicId==='measurement-workshop'&&Number(lesson.variant)<=10)){mq07Batch200.richProtected++;continue}
 if(lesson.pedagogyReview?.semanticPilot||lesson.id==='opamp-apps-src-08'){mq07Batch200.earlierProtected++;continue}
 const p=lesson.project||{components:[],wires:[]},wires=(p.wires||[]).filter(w=>w.from&&w.to);
 const active=wires.length&&lesson.kind!=='quiz'&&!p.referenceOnly;
 const domain=active?mq07WiredFocus[lesson.id]:mq07Concepts[lesson.id];
 if(!domain)throw Error('MQ07 Batch200 requires specific teaching text for '+lesson.id);
 const edges=wires.filter(w=>!w.probeLead&&!String(w.role||'').includes('MEASURE')).slice(0,8).map(w=>mq07DescribePin(p,w.from)+' → '+mq07DescribePin(p,w.to));
 const title=lesson.title;
 lesson.summary=domain[0]+'. '+(active?'Bu sanal devrede '+p.components.length+' gerçek kayıtlı eleman ve '+wires.length+' terminal bağlantısı gösterilir.':'Bu sayfa kablolu deney değil; yalnız kavram ve materyal referansıdır.');
 lesson.explanation=domain[1]+(active?' Kayıtlı şemadan izlenecek bağlantılar: '+edges.join('; ')+'.':' Devre çizimi ve fiziksel sonuç bu sayfada doğrulanmış değildir.');
 lesson.learningGoal=domain[0]+'; hangi sonucun kuramsal, hangisinin gerçek sanal simülasyon gözlemi olduğunu ayırabilmek.';
 lesson.beginnerSteps=[
   'Önce devrenin amacı: '+domain[0]+'.',
   ...(active?edges.slice(0,4).map(e=>'Sanal şemadaki '+e+' hattını izleyip iki terminalin görevini açıkla.'):['Ekranda kablolu bir laboratuvar ağı olmadığını tespit et; referans materyalini canlı devre sanma.']),
   domain[2],
   active?'Simülasyonda farklı kontrol durumlarını karşılaştır; gerçek solver çıktısı olmadan sayısal değeri ölçülmüş gibi belirtme.':'Bu dersin kablolu simülasyon ve gerçek ölçüm sonucu henüz kabul edilmemiştir.'
 ];
 lesson.materials=(lesson.materials||[]).map(m=>{
   const c=p.components.find(x=>x.id===m.componentId);
   return c?{...m,why:mq07MaterialReason(c)}:m;
 });
 const requiresPart=/(ldr|ntc|ptc|lm35|hall|piezo|reed|termokupl|pt100)/i.exec(title.toLocaleLowerCase('tr-TR'));
 const familyMissing=requiresPart&&active&&!p.components.some(c=>new RegExp(requiresPart[1]==='termokupl'?'thermocouple':requiresPart[1], 'i').test(c.typeId||''));
 const review=!active?'NO_WIRED_CIRCUIT':familyMissing?'TITLE_MISSING_REQUIRED_PART':/opamp-apps-src-(11|12)$/.test(lesson.id)?'MISSING_REQUIRED_SECOND_INPUT':/sensor-analog-apps-src-11/.test(lesson.id)?'MISSING_DIMMER_POWER_STAGE':/electronic-switching-src-0[67]/.test(lesson.id)&&!p.components.some(c=>/capacitor/.test(c.typeId))?'NO_RC_TIMING_EVIDENCE':null;
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',terminalGrounded:true,
  semanticNarrativeAdded:true,titleTopologyStatus:review?'REVIEW':'SOURCE_ALIGNED',
  titleTopologyIssue:review||null,physicalAcceptance:false,
  windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
 if(review)mq07Batch200.reviewIds.push({id:lesson.id,reason:review});
 mq07Batch200.updatedIds.push(lesson.id);
 if(active)mq07Batch200.enrichedWired++;else mq07Batch200.enrichedReference++;
}
L.mq07Batch200=mq07Batch200;
/* MQ07_SC36_SC38_AC_METER_REVIEW: the legacy AC examples combine a
   1 kHz virtual generator with a 24 V DC LM358 supply. UT33D+ ACV can
   display OL due to its existing mixed-source protection; do not present
   that as verified AC output or silently weaken the meter/solver guard.
   Changes below affect ONLY learner-facing explanations, not circuits. */
for(const id of ['opamp-apps-src-01','opamp-apps-src-03']){
 const lesson=L.byId[id],p=lesson?.project;
 const meter=p?.components?.find(c=>c.id==='v1'),signal=p?.components?.find(c=>c.id==='in');
 const supply=p?.components?.find(c=>c.id==='g1');
 const row=lesson?.materials?.find(m=>m.componentId==='v1');
 if(lesson?.kind==='wiring'&&p?.wires?.length>0&&
    signal?.typeId==='arduino-signal-generator'&&supply?.typeId==='supply-dc-plus'&&
    meter?.typeId==='unit-ut33d-plus'&&meter?.meterPosition===6&&
    row?.typeId===meter.typeId&&lesson?.pedagogyReview?.mq07Batch==='001_200'){
   const limit=' Bu modelde 1 kHz sanal giriş jeneratörü ve 24 V DC op-amp beslemesi birlikte bulunur. UNI-T UT33D+ ACV 600 V konumunda karışık AC/DC kaynak uyarısı ve OL gösterebilir; bu bir ölçülmüş AC kazanç veya çıkış RMS değeri değildir. Op-amp AC transferi ve dalga biçimi dinamik solver kanıtına kadar REVIEW durumundadır.';
   lesson.explanation+=limit;
   lesson.beginnerSteps.push('V1 ACV 600 V göstergesi OL veya AC/DC uyumsuzluğu verirse bunu kazanç ölçümü olarak kabul etme; önce kaynak ve besleme koşullarını ayırt et.');
   lesson.materials=lesson.materials.map(m=>m.componentId==='v1'?{...m,why:'UNI-T UT33D+ çıkış probu ACV 600 V kademesindedir; 24 V DC beslemeli sanal devrede karışık kaynak uyarısı/OL verebilir. Kayıtlı dinamik AC RMS ve kazanç ölçümü olmadığından göstergeyi doğrulanmış sonuç sayma.'}:m);
 }
}
/* MQ07_SC10_RCD_REFERENCE_MATERIAL: residual-current protection must not
   be described as overcurrent/short-circuit protection. This is an unwired
   conceptual lesson, not a verified trip-time or leakage-current experiment. */
{
 const lesson=L.byId['installation-grounding-src-10'];
 const p=lesson?.project;
 const types=['supply-1p','rcd-2p','socket-power','ground'];
 if(lesson&&p&&lesson.kind==='quiz'&&p.referenceOnly===true&&
    p.wires.length===0&&p.components.length===types.length&&
    lesson.materials?.length===types.length&&
    p.components.every((c,i)=>c.typeId===types[i]&&
      lesson.materials[i].componentId===c.id&&
      lesson.materials[i].typeId===c.typeId)){
   const roles=[
    'Tek faz besleme kaynağı faz ve nötrün kavramsal başlangıç noktasıdır; bu kartta RCD üzerinden akım dolaşan gerçek bir bağlantı yoktur.',
    'Kaçak akım koruma düzeni (RCD), faz ile nötrden geçen akımların farkını izleme ilkesini temsil eder; tek başına aşırı akım veya kısa devre koruma cihazı değildir. Burada açma eşiği, süresi veya gerçek akım farkı simüle edilmez.',
    'Topraklı priz yükün bağlanabileceği tesisat noktasını temsil eder; bu kartta beslenmiş veya RCD çıkışına kablolanmış değildir.',
    'Koruma toprağı (PE) sembolik güvenlik referansıdır; RCD içinden normal çalışma akımının dönüş yolu olarak gösterilmez, PE sürekliliği ölçülmez.'
   ];
   lesson.materials=lesson.materials.map((m,i)=>({...m,why:roles[i]}));
 }
}
/* MQ07_GROUNDING_MEASUREMENT_REFERENCE: SC07/SC08 are deliberately unwired
   conceptual cards. Give each real displayed product a grounded material role
   without inventing earth-resistance, insulation or mains test measurements. */
const mq07GroundingReferenceMaterials=[
 ['installation-grounding-src-07',[
  ['tutorial-earth-tester','Topraklama direnci ölçer, topraklama direnci ölçümünün kavramsal cihazıdır; bu sanal referansta ölçüm terminalleri, bağlanan ölçü devresi ve doğrulanmış Ω sonucu yoktur.'],
  ['ground','Topraklama noktası koruma toprağının sembolik referansıdır; görünen elektrot sembolü ölçülmüş topraklama direnci veya PE sürekliliği değildir.']]],
 ['installation-grounding-src-08',[
  ['tutorial-insulation-tester','Yalıtkanlık direnci ölçer (megohmmetre) yalnız kavramsal cihaz modelidir; L/E uçları görsel referanstır, bu kartta kablo, ölçüm gerilimi ve MΩ hesabı simüle edilmez.'],
  ['terminal-2','Test edilecek iletken/klemens referansı, ölçümün değerlendirildiği öğeyi tanıtır; bu sayfada test devresine bağlanmamıştır.'],
  ['ground','Referans gövde/toprak sembolü ölçümle ilişkili kavramsal referanstır; gerçek bir test veya yalıtım yeterliliği onayı değildir.']]]
];
for(const [id,roles] of mq07GroundingReferenceMaterials){
 const lesson=L.byId[id],p=lesson?.project;
 if(!lesson||lesson.kind!=='quiz'||!p||p.wires?.length||p.components?.length!==roles.length||
    lesson.materials?.length!==roles.length||lesson.pedagogyReview?.mq07Batch!=='001_200')
  throw Error('MQ07 grounding conceptual material baseline changed: '+id);
 for(let i=0;i<roles.length;i++){
  const c=p.components[i],m=lesson.materials[i],[expectedType,why]=roles[i];
  if(c.typeId!==expectedType||m.componentId!==c.id||m.typeId!==c.typeId)
   throw Error('MQ07 grounding material identity changed: '+id+' '+i);
  m.why=why;
 }
 if(lesson.pedagogyReview.titleTopologyIssue!=='NO_WIRED_CIRCUIT'||
    lesson.pedagogyReview.physicalAcceptance!==false||
    lesson.pedagogyReview.windowsVisualAcceptance!==false||
    lesson.pedagogyReview.independentPedagogicalAcceptance!==false)
  throw Error('MQ07 grounding unaccepted scope changed: '+id);
}
/* MQ07_SC182_SC200_PLC: accurately distinguish PLC live DOL demo from unwired concept cards. */
const mq07PlcScope182to200=[
 ['01','NO_WIRED_CIRCUIT','PLC, girişleri okuyup tanımlı lojik programa göre çıkışları süren endüstriyel denetleyicidir.','Bu kartta PLC modeli vardır fakat fiziksel giriş, çıkış, program veya röleli karşılaştırma devresi kablolanmamıştır.'],
 ['02','NO_WIRED_CIRCUIT','PLC CPU, besleme ve dijital/analog giriş-çıkış modüllerinin farklı görevleri vardır.','Gösterilen CPU/modüller malzeme referansıdır; slot, hat, veri yolu ve besleme bağlantısı oluşturulmamıştır.'],
 ['03','NO_WIRED_CIRCUIT','PLC seçimi gerçek 24 VDC besleme, giriş/çıkış sayısı, PNP/NPN seviyesi, transistor/röle çıkışı ve modül uyumuna göre yapılır.','Gösterilen donanım özellik karşılaştırmasıdır; yeterli I/O hesabı veya yük akımı kabulü yapılmamıştır.'],
 ['04',null,'S7-1211C DC/DC/DC sanal PLC besleme uçları X10:1 ve X10:2, 24 VDC güç kaynağının +/0 V hatlarından beslenir.','X10:6 dijital giriş ortak referansı, X12:1/2 çıkış beslemesi, X12:3 bobin kontrol çıkışıdır. Bu aynı kablolu örnek START/STOP mühürleme programını da içerir; gerçek PLC donanım güvenliği sınanmamıştır.'],
 ['05',null,'PLC dijital START girişi X10:7, normalde kapalı STOP giriş devresi X10:8 ile okunur; giriş ortak referansı X10:6 dır.','START basıldığında X10:7 HIGH, STOP basıldığında X10:8 LOW olur. Mevcut simülasyon aynı start-stop-latch programını çalıştırır; farklı giriş modları kanıtlanmaz.'],
 ['06',null,'Transistör PLC çıkışı X12:3 sanal kontaktör bobini A1 ucuna, bobin A2 ise 0 V a bağlanmıştır.','S7-1211C DC/DC/DC çıkış beslemesi X12:1/2 dir; bobin gerçek akım kapasitesi, söndürme diyodu veya ısıl koruma burada doğrulanmaz.'],
 ['07','NO_WIRED_CIRCUIT','LAD (merdiven diyagramı) kontak-bobin mantığı, FBD ise işlev bloklarıyla aynı lojik ilişkileri ifade edebilir.','PLC ürün kartında çalıştırılan LAD/FBD programı veya ekranda doğrulanmış çevrim tablosu yoktur.'],
 ['08','NO_WIRED_CIRCUIT','PLC programındaki normalde kapalı mantık kontağı, bir giriş bitinin tersini sınar; fiziksel STOP NC terminali ile birebir aynı kavram değildir.','Kartta yalnız PLC ve buton referansları bulunur; LAD kontak durumu fiziksel terminalle bağlanmamıştır.'],
 ['09','NO_WIRED_CIRCUIT','START ve STOP butonlarının NO/NC kontak farkı, PLC girişine bağlanınca doğru sinyal seviyesinde yorumlanmalıdır.','Bu kartta butonlar ve PLC kablolanmamıştır, çalışan giriş değişimi ölçülmez.'],
 ['10','NO_WIRED_CIRCUIT','PLC mantık fonksiyonlarında AND, OR, NOT davranışı giriş bitleri ve tanımlı programla doğrulanır.','Kablolu lojik test veya PLC programındaki doğruluk tablosu simüle edilmez.'],
 ['11','NO_WIRED_CIRCUIT','Ara vaviyen benzeri iki noktadan anahtarlamada girişlerin XOR/kenar veya durum mantığıyla yorumlanması gerekir.','İki anahtar sinyali, gerçek PLC girişleri ve yazılmış program bu kartta yoktur.'],
 ['12',null,'PLC ile motora doğrudan yol vermede X10:7 START ve X10:8 STOP koşulları çıkış X12:3 üzerinden kontaktör bobinini yönetir.','Mevcut sanal start-stop-latch programı, kontaktörün ana kontaklarını ve üç fazlı motorun çalışmasını gösterir; gerçek termik koruma ve şebeke testi değildir.'],
 ['13','TWO_STATION_NATIVE_PENDING','Birden fazla noktadan PLC motor kumandası, iki istasyonun START girişlerini OR, iki bağımsız NC STOP girişini AND mantığıyla ve STOP önceliğiyle değerlendirir.','S1 START X10:7 / S0 STOP X10:8 ile ikinci S2 START X10:9 / S3 STOP X10:10 fiziksel uçları ayrı bağlanmıştır; PLC iki istasyonlu mühürleme programı için sanal dinamik/Windows kabul henüz yapılmamıştır.'],
 ['14','REVERSING_NATIVE_PENDING','PLC ileri–geri motor kumandasında K1 ileri ve K2 geri yön kontaktörleri ayrı DO çıkışlarından sürülür, karşılıklı NC kilitleri ve iki fazın takasıyla ters yön güç yolu kurulur.','İleri S1 X10:7 ve geri S2 X10:9 girişleri, NC STOP X10:8, X12:3/K1 ve X12:4/K2 çıkışları fiziksel olarak bağlanmıştır. K1/K2 karşılıklı 21–22 NC yardımcı kontakları seri kilitler; 3 faz güç yolunun yön/çakışma ve yerel Windows çalışması henüz native kabul edilmemiştir.'],
 ['15','NO_WIRED_CIRCUIT','SET/RESET mantığı bir bitin tutulması ve sıfırlanması için iki farklı giriş koşulu tanımlar.','Kartta PLC, START/STOP butonları referans olarak vardır; gerçek SET/RESET programı yürütülmez.'],
 ['16','NO_WIRED_CIRCUIT','Tek butonla çalıştır-durdur için yükselen kenarda saklanan durumu tersleyen toggle mantığı gerekir.','Tek butonlu program ve giriş kenarı simülasyonu bu kartta yoktur.'],
 ['17','NO_WIRED_CIRCUIT','Kenar tetiklemesi, girişin 0→1 ya da 1→0 geçişinde yalnız tek çevrimlik olay üretir.','Çalışan kenar algılama programı veya PLC tarama çevrimi izlemesi bulunmaz.'],
 ['18','NO_WIRED_CIRCUIT','PLC zamanlayıcılarında TON, TOF veya TP çıkışı zaman ve tetik şartına göre farklı değişir.','PLC ve lamba ürünleri yalnız referanstır; zamanlayıcı bloğu, ayarlı süre, kablo veya zaman eğrisi bulunmaz.'],
 ['19','NO_WIRED_CIRCUIT','PLC sayıcılarında CTU/CTD sayma girişinin uygun kenarlarıyla değeri değişir; reset ve preset ayrı ele alınır.','Enkoder ve PLC malzeme kartları kablosuzdur; gerçek pals, sayım değeri veya çalışan program yoktur.']
];
/* MQ07 SC194 completion: add the real second command station.
   Four catalog-valid wires preserve every prior 18-wire DOL connection.
   No other PLC lesson, source golden or global electrical model is modified. */
function mq07BuildTwoStationPlc(lesson){
 const p=lesson.project;
 if(!p||p.wires?.length!==18||!Array.isArray(lesson.steps)||
    !p.components.some(c=>c.id==='start'&&c.typeId==='push-no')||
    !p.components.some(c=>c.id==='stop'&&c.typeId==='push-nc')||
    !p.components.some(c=>c.id==='plc'&&c.typeId==='plc-hw-6es7211-1ae40-0xb0')||
    p.components.some(c=>['start2','stop2'].includes(c.id)))
  throw Error('SC194 source baseline changed; refusing second-station rewrite');
 const start2=C('start2','push-no',500,500,'S2','İstasyon 2 · START',{
  tutorialPurpose:'İkinci kumanda merkezinin bağımsız NO başlatma butonu. 24 V kaynağı PLC X10:9 DI a.2 girişine bağlar.'});
 const stop2=C('stop2','push-nc',500,690,'S3','İstasyon 2 · STOP',{
  tutorialPurpose:'İkinci kumanda merkezinin bağımsız NC durdurma butonu. PLC X10:10 DI a.3=LOW olduğunda iki START girişinden de gelen komutlar durdurulur.'});
 p.components.push(start2,stop2);
 const added=[
  W('ps','P','start2','13','+24 V → istasyon 2 START/13','Ayrı ikinci START kontak giriş beslemesidir.','#8b5a2b','+24V'),
  W('start2','14','plc','X10:9','İstasyon 2 START/14 → X10:9','DI a.2 bağımsız ikinci START bilgisidir.','#43a047','SIGNAL'),
  W('ps','P','stop2','21','+24 V → istasyon 2 STOP/21','Ayrı ikinci NC STOP giriş beslemesidir.','#8b5a2b','+24V'),
  W('stop2','22','plc','X10:10','İstasyon 2 STOP/22 → X10:10','DI a.3 herhangi bir STOP basıldığında LOW olur.','#43a047','SIGNAL')
 ];
 p.wires.push(...added);
 p.components.find(c=>c.id==='plc').plcProgram='two-station-start-stop';
 lesson.materials.push(...materialRows({components:[start2,stop2]}));
 lesson.steps.push(...added.map(w=>({
  from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,
  color:w.color,role:w.role,size:w.size
 })));
}
/* MQ07 SC195: actual forward / reverse motor topology, confined to this
   source lesson. Two power paths swap L1/L3; K1/K2 auxiliary NC contacts
   interlock coil power electrically as a second gate beside PLC logic. */
function mq07BuildReversingPlc(lesson){
 const p=lesson.project,baseline=p?.wires||[];
 const oldIndex=baseline.findIndex(w=>w.from?.c==='plc'&&w.from.p==='X12:3'&&
   w.to?.c==='coil'&&w.to.p==='A1');
 if(baseline.length!==18||oldIndex<0||!Array.isArray(lesson.steps)||
    p.components.some(c=>['reverse','coilR','mainR','ncF','ncR'].includes(c.id))||
    !p.components.some(c=>c.id==='coil'&&c.typeId==='coil-contactor'&&c.ref==='K1')||
    !p.components.some(c=>c.id==='main'&&c.typeId==='main-contact'&&c.ref==='K1'))
  throw Error('SC195 original PLC DOL baseline changed, refusing reversal rewrite');
 // The original forward control lead is rerouted through K2's NC contact.
 // All 17 other DOL wires, the original motor and the PE connection remain.
 p.wires.splice(oldIndex,1);
 lesson.steps.splice(oldIndex,1);
 const reverse=C('reverse','push-no',490,490,'S2','GERİ START · S2',{
  tutorialPurpose:'Geri yön komutu X10:9 DI a.2; yalnız iki yön kontaktörü bırakılmışken geri yön başlatılır.'});
 const coilR=C('coilR','coil-contactor',1050,690,'K2','K2 · geri yön bobini',{
  tutorialPurpose:'PLC X12:4 DQ a.1 ve K1 21–22 NC kilidi izin verirse geri yön ana güç kontaktörünü çeker.'});
 const mainR=C('mainR','main-contact',1270,530,'K2','K2 · geri güç kontakları',{
  tutorialPurpose:'L1/L3 faz sırası ters motor güç yolu. K1 ile aynı anda etkinleşmemelidir.'});
 const ncF=C('ncF','contact-nc',850,660,'K1','K1 · NC 21–22 kilit',{
  tutorialPurpose:'K1 ileri kontaktörü aktifken K2 geri bobin yolunu fiziksel olarak kesen NC yardımcı kontaktır.'});
 const ncR=C('ncR','contact-nc',850,510,'K2','K2 · NC 21–22 kilit',{
  tutorialPurpose:'K2 geri kontaktörü aktifken K1 ileri bobin yolunu fiziksel olarak kesen NC yardımcı kontaktır.'});
 p.components.push(reverse,coilR,mainR,ncF,ncR);
 const added=[
  W('ps','P','reverse','13','+24 V → geri START/13','Geri yön butonunun ayrı giriş beslemesidir.','#8b5a2b','+24V'),
  W('reverse','14','plc','X10:9','Geri START/14 → X10:9','PLC DI a.2 geri yön girişidir.','#43a047','SIGNAL'),
  W('plc','X12:3','ncR','21','Q0.0 ileri çıkış → K2 NC','Geri kontaktör aktifken ileri yön bobin beslemesi kesilir.','#43a047','SIGNAL'),
  W('ncR','22','coil','A1','K2 NC → K1 bobin','İleri bobini yalnız K2 serbestken çekebilir.','#43a047','SIGNAL'),
  W('plc','X12:4','ncF','21','Q0.1 geri çıkış → K1 NC','İleri kontaktör aktifken geri yön bobin beslemesi kesilir.','#43a047','SIGNAL'),
  W('ncF','22','coilR','A1','K1 NC → K2 bobin','Geri bobini yalnız K1 serbestken çekebilir.','#43a047','SIGNAL'),
  W('coilR','A2','ps','M','K2/A2 → 0V','Geri kontaktör bobin dönüşüdür.','#111827','0V'),
  ...[['L1','1','#e53935'],['L2','3','#f97316'],['L3','5','#f4c430']].map(([phase,pin,color])=>
    W('ac',phase,'mainR',pin,phase+' → K2/'+pin,'K2 geri güç kontaktörü girişidir.',color,phase,'2.5')),
  ...[['2','W','L1','#e53935'],['4','V','L2','#f97316'],['6','U','L3','#f4c430']].map(([pin,motor,phase,color])=>
    W('mainR',pin,'motor',motor,'K2/'+pin+' → M1/'+motor,
      'K2 geri yolunda L1/L3 motor U/W uçlarında yer değiştirir.',color,phase,'2.5'))
 ];
 p.wires.push(...added);
 p.components.find(c=>c.id==='plc').plcProgram='forward-reverse-interlocked';
 lesson.materials.push(...materialRows({components:[reverse,coilR,mainR,ncF,ncR]}));
 lesson.steps.push(...added.map(w=>({
  from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,
  color:w.color,role:w.role,size:w.size
 })));
}
for(const [suffix,issue,concept,limits] of mq07PlcScope182to200){
 const id='plc-hardware-programming-src-'+suffix,lesson=L.byId[id],i=Number(suffix);
 const wired=[4,5,6,12,13,14].includes(i),p=lesson?.project;
 if(i===13)mq07BuildTwoStationPlc(lesson);
 if(i===14)mq07BuildReversingPlc(lesson);
 if(!lesson||!p||lesson.kind!==(wired?'wiring':'quiz')||p.wires.length!==(wired?(i===13?22:i===14?30:18):0)||
    !p.components.some(c=>c.typeId==='plc-hw-6es7211-1ae40-0xb0'))
  throw Error('MQ07 SC182–SC200 PLC canonical card changed: '+id);
 if(wired){
  if(p.components.filter(c=>c.typeId==='motor-3p').length!==1||
     p.components.filter(c=>c.typeId==='coil-contactor').length!==(i===14?2:1)||
     p.components.filter(c=>c.typeId==='push-no').length!==(i===13||i===14?2:1)||
     p.components.filter(c=>c.typeId==='push-nc').length!==(i===13?2:1)||
     (i===14&&(p.components.filter(c=>c.typeId==='main-contact').length!==2||
       p.components.filter(c=>c.typeId==='contact-nc').length!==2)))
   throw Error('MQ07 PLC DOL hardware mismatch '+id);
 }
 lesson.summary=concept+' Gösterilen kartın gerçek bağlantı kapsamı sınırlıdır.';
 lesson.explanation=concept+' '+limits+' Yalnız kaydedilmiş sanal bağlantı ve Node durumu incelenmiştir; fiziksel PLC veya şebeke uygunluğu doğrulanmamıştır.';
 lesson.learningGoal=concept+' Kablolu örnek ile eksik PLC programı veya ürün referansını ayırt etmek.';
 lesson.beginnerSteps=[
  'PLC modelini ve mevcut fiziksel terminal etiketlerini kontrol et.',
  'İşlev: '+concept,
  limits,
  'Kablo, program veya çalışma zamanı ölçümü yoksa elektriksel PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',mq07PlcScope:'SC182_SC200',
  titleTopologyStatus:issue?'REVIEW':'SOURCE_ALIGNED',titleTopologyIssue:issue,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  plcAdvancedLogicAcceptance:false};
}


/* MQ07_SC201_SC203_PLC: next three source cards retain original quiz/DOL graphs and reject unsupported acceptance. */
const mq07PlcFollowup201to203=[
 ['20','NO_ANALOG_IO_WIRING',false,
  'PLC analog girişte gerilim/akım sensör sinyali A/D dönüşümü ve kanal ölçeklemesi, analog çıkışta ise uygun modül ve D/A referansıyla kontrol yapar.',
  'SM 1231 AI, SM 1232 AO, analog seviye sensörü ve S7-1211C burada yalnız referans malzemeleridir. Besleme, modül ortak uçları, analog kanal ve sensör kabloları yoktur; gerçek kanal okuması, PLC konfigürasyonu veya ölçülen analog çıkış bulunmaz.'],
 ['21','MISSING_TIMED_STOP_PROGRAM',true,
  'PLC ile motorun zaman ayarlı durdurulması, bir süre koşulu ve durdurma önceliğini belirleyen program davranışı gerektirir.',
  'Kayıtlı 18 kablolu örnek yalnız bir START X10:7, NC STOP X10:8, X12:3 kontaktör çıkışı ve start-stop-latch programıdır. Zamanlayıcı bloğu, ayarlı gecikme ve gecikmeli STOP çıkışı yoktur; sanal STOP kontaktörü doğrudan bırakır.'],
 ['22','NO_PLC_VFD_CONTROL_WIRING',false,
  'PLC ile invertör kontrolü için ortak referans, uygun dijital/analog kontrol uçları, sürücü komut kaynağı ve gerçek hız/yön parametre eşleşmesi gerekir.',
  'S7-1211C ve SINAMICS V20 yalnız malzeme kartları olarak gösterilir. PLC–V20 kontrol kablosu, sürücü parametresi, motor güç yolu ve canlı PLC komut programı yoktur; hız, yön veya haberleşme kontrolü simüle edilmez.']
];
for(const [suffix,issue,wired,concept,limits] of mq07PlcFollowup201to203){
 const id='plc-hardware-programming-src-'+suffix,lesson=L.byId[id],p=lesson?.project;
 if(!lesson||!p||lesson.kind!==(wired?'wiring':'quiz')||p.wires.length!==(wired?18:0))
  throw Error('MQ07 SC201–SC203 PLC canonical scope changed: '+id);
 const types=p.components.map(c=>c.typeId);
 if(!types.includes('plc-hw-6es7211-1ae40-0xb0')||
    (suffix==='20'&&(!types.includes('plc-0-10')||!types.includes('plc-0-12')||!types.includes('sensor-level-analog')))||
    (suffix==='21'&&(['motor-3p','coil-contactor','push-no','push-nc'].some(t=>types.filter(x=>x===t).length!==1)))||
    (suffix==='22'&&!types.includes('sinamics-v20-1p')))
  throw Error('MQ07 SC201–SC203 PLC component mismatch: '+id);
 lesson.summary=concept+' Bu dersin mevcut malzeme/şema kapsamı ayrıca sınırlandırılmıştır.';
 lesson.explanation=concept+' '+limits+' Bu değerlendirme sanal kaynak grafiği içindir; gerçek donanım, üretici kabulü veya Windows görsel testi değildir.';
 lesson.learningGoal=concept+' Kaydedilen terminal ve kabloları gerekli program, ölçüm ve bağlantı şartlarıyla karşılaştırmak.';
 lesson.beginnerSteps=[
  'Ekrandaki cihazların gerçek terminal bağlantılarını ve devrenin kablolu olup olmadığını say.',
  'Beklenen işlev: '+concept,
  limits,
  'Gerçek kablo, program, zaman ya da ölçüm kanıtı olmadan işlevsel veya fiziksel PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
  mq07PlcScope:'SC201_SC203',titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  plcAdvancedLogicAcceptance:false};
}


/* MQ07_SC204_SC213_VFD_SERVO: no-wire source truth, protect quizzes and remove unrelated DOL steps. */
const mq07DriveScope204to213=[["01","NO_VFD_ARCHITECTURE_PARAMETER_EVIDENCE",["sinamics-v20-1p","motor-3p"],"VFD çıkış frekansı ve gerilimiyle motor davranışını düzenleme ilkesi.","Sürücü kablosu, parametre değerleri veya ölçülmüş motor çalışması yoktur."],["02","NO_VFD_START_STOP_WIRING",["sinamics-v20-1p","motor-3p","push-no","push-nc"],"VFD START/STOP işlevi kontrol kaynağı ve sürücünün duruş tanımına bağlıdır.","Butonlar V20'ye bağlı değildir, start/stop çalışma kanıtı yoktur."],["03","NO_VFD_REVERSE_CONTROL_WIRING",["sinamics-v20-1p","motor-3p","push-no","push-nc"],"VFD yön komutu uygun sürücü mantığıyla değerlendirilir, doğrudan motor faz değiştirmesi değildir.","Kablolu yön seçimi, parametreler ve ölçülmüş ileri/geri hareket yoktur."],["04","NO_VFD_POT_ANALOG_REFERENCE",["sinamics-v20-1p","motor-3p","potentiometer"],"Potansiyometre referansı doğru analog giriş ve ölçekleme ister.","Potansiyometre-V20 analog bağlantısı veya ölçülen hız sonucu yoktur."],["05","NO_MAINTAINED_DIRECTION_SELECTOR",["sinamics-v20-1p","motor-3p","push-no","push-nc"],"Kalıcı yön seçici ve anlık NO/NC basma düğmeleri aynı davranışta değildir.","Kalıcı seçim cihazı, VFD kablosu veya işleyen yön komutu yoktur."],["06","NO_VFD_COMBINED_IO_CONTROL",["sinamics-v20-1p","motor-3p","potentiometer","push-no","push-nc"],"START/STOP, yön ve analog hız ayrı sürücü komutlarıdır.","Buton/pot kontrol hatları, VFD parametreleri veya birlikte çalışan komut dizisi yoktur."],["07","NO_PLC_VFD_COMMAND_CHANNEL",["plc-hw-6es7211-1ae40-0xb0","sinamics-v20-1p","motor-3p"],"PLC–VFD kontrolü desteklenen komut ve geri bildirim arayüzü ister.","PLC ile V20 arasında kablo, program, haberleşme veya motor kontrolü yoktur."],["08","NO_VFD_NAMEPLATE_PARAMETER_WRITE",["sinamics-v20-1p","motor-3p"],"Etiket verilerinin sürücü ayarına eşlenmesi kaynak ve model kontrolü gerektirir.","Motor etiket veri seti, V20 parametre yazma/okuma kanıtı yoktur."],["09","NO_PLC_SERVO_CONNECTION",["plc-hw-6es7211-1ae40-0xb0","hcfa-sv-x2ea040a-a","hcfa-sv-x2mh040a-n2ln"],"PLC, servo sürücü ve servo motor kumandası ayrı işlevsel katmanlardır.","Kablo, hareket programı, geri bildirim veya doğrulanmış servo hareketi yoktur."],["10","NO_SERVO_PARAMETER_MOTION_VERIFICATION",["plc-hw-6es7211-1ae40-0xb0","hcfa-sv-x2ea040a-a","hcfa-sv-x2mh040a-n2ln"],"Servo ayarı kontrol modu ve motor-geribildirim uyumuna bağlıdır.","Servo parametre kayıtları, ölçüm veya yürütülen hareket yoktur."]];
for(const [suffix,issue,expected,concept,limitation] of mq07DriveScope204to213){
 const id='vfd-servo-control-src-'+suffix,lesson=L.byId[id],p=lesson?.project;
 if(!lesson||!p||lesson.kind!=='quiz'||p.referenceOnly!==true||p.wires.length!==0)
  throw Error('MQ07 VFD/servo canonical no-wire lesson changed '+id);
 const types=p.components.map(c=>c.typeId);
 if(types.length!==expected.length||expected.some((type,i)=>types[i]!==type))
  throw Error('MQ07 VFD/servo canonical components changed '+id);
 lesson.summary=concept+' Bu kart kablolu veya çalışan bir sürücü devresi değildir.';
 lesson.explanation=concept+' '+limitation+' Yalnız kaynak malzemesi incelenir; gerçek ürün veya motor kabulü verilmez.';
 lesson.learningGoal=concept+' Malzeme referansını kanıtlanmış sanal devre ve fiziksel ölçümden ayırmak.';
 lesson.beginnerSteps=['Önce bu referans kartında kablo bulunmadığını tespit et.','Kavram: '+concept,limitation,
  'Sürücü işlevi, parametre veya hareket çalıştırılmadığı için PASS verme.'];
 lesson.powerExplanation='Bu kartta motor güç devresi veya sürücü kumanda hattı kablolanmamıştır; gerçek elektriksel güvenlik doğrulaması değildir.';
 lesson.powerSteps=[];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07DriveScope:'SC204_SC213',
  titleTopologyIssue:issue,titleTopologyStatus:'REVIEW',physicalAcceptance:false,
  windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  driveRuntimeAcceptance:false,manufacturerParameterAcceptance:false};
}

/* MQ07_MOTOR_UNACCEPTED_MATERIAL: keep the actual motor product/pins,
   but tell students why this existing product does not prove the title.
   Material IDs, labels and electrical graphs remain immutable here. */
function mq07MotorMaterialLimit(lesson,typeId,limit,actual){
 const p=lesson.project,matches=p?.components?.filter(c=>c.typeId===typeId)||[];
 if(matches.length!==1||!Array.isArray(lesson.materials)||!lesson.pedagogyReview?.titleTopologyIssue)
  return;
 const component=matches[0],row=lesson.materials.find(m=>m.componentId===component.id);
 if(!row||row.typeId!==component.typeId||
    row.label!==String(component.label||component.ref||''))
  return; // fail closed; inventory reports any pre-existing stale label
 const why='Bu malzeme '+(component.label||component.ref)+' gerçek '+actual+
  ' örneğindeki motordur. '+limit+
  ' Başlıkta geçen ek işlev bu motor/kablo grafiğinde doğrulanmadığı için fiziksel veya sanal işlev PASS değildir.';
 lesson.materials=lesson.materials.map(m=>m.componentId===component.id?{...m,why}:m);
}
/* MQ07_SC172_SC181_MOTOR_SEQUENCE: preserve canonical DOL; disclose absent multiple motors and control. */
const mq07SequenceScope172to181=[
 ['01','MISSING_SECOND_MOTOR_SEQUENCING','İki motor sıralı kumandası M1/M2, K1/K2 ve ikinci motoru başlatan koşul gerektirir.','Kaydedilmiş devre tek motorlu START–mühürleme–STOP devresidir; ikinci motor veya sıra yoktur.'],
 ['02','MISSING_PERIODIC_TWO_MOTOR_CYCLE','İki motorun periyodik çalışması ayrı motor yolları ve zamanlama/sayma döngüsü gerektirir.','Yalnız tek motor ve tek kontaktör vardır; iki motor veya periyodik timer bulunmaz.'],
 ['03','MISSING_REVERSE_DELAYED_SEQUENCE','Bir motor ileri, ikinci motor ters zamanlı çalışacaksa iki motor, yön kumandası ve zaman koşulları gerekir.','Tek motorlu DOL örneğinde ikinci motor, yön değiştirme ve zamanlayıcı yoktur.'],
 ['04','MISSING_DUAL_OVERLOAD_CHAIN','İki motorun ortak aşırı akım duruşu ayrı termik rölelerin NC kontakları ve iki motor çıkışı gerektirir.','Tek motorlu devrede M2 ve M1/M2 termikleri bulunmadığından aşırı akım ortak STOP testi yoktur.'],
 ['05','MISSING_LIMIT_REVERSE_CONTINUOUS','Sınır anahtarlı ileri/geri hareket iki yön kontaktörü, kilitleme ve uç konum bilgisi gerektirir.','Kayıtlı tek kontaktörde ileri/geri değişimi veya limit switch yoktur.'],
 ['06','MISSING_TIMED_FORWARD_REVERSE','Zaman ayarlı ileri/geri çalıştırma yön kontaktörleri, timer ve karşılıklı kilit gerektirir.','Kaydedilen DOL motor devresinde ikinci yön kontaktörü veya zamanlayıcı yoktur.'],
 ['07','UNSPECIFIED_MOTOR_PROBLEM_1','Üç fazlı motor problem tasarımı ölçülebilir özel problem koşulları üzerinden sınanmalıdır.','Bu kart yalnız standart tek motor mühürlemeli DOL içerir; problem-1 özel koşulları doğrulanmadı.'],
 ['08','UNSPECIFIED_MOTOR_PROBLEM_2','İkinci motor tasarım problemi ilkinden farklı şartlar ve ayrı doğrulama gerektirir.','Problem-1 ile aynı DOL devresi açılır; problem-2 farkı veya özel test sonucu yoktur.'],
 ['09','MISSING_INDEPENDENT_TWO_MOTOR_CONTROL','İki motorun isteğe bağlı kumandasında ayrı motor, kontaktör ve seçim kontrolü gerekir.','Kaydedilmiş devrede tek motor, tek kontaktör ve tek START vardır; ikinci motor seçimi yoktur.'],
 ['10','MISSING_CONVEYOR_CONDITIONAL_SEQUENCE','Konveyörde koşullu motor sırası iki motor ve algılayıcıdan kontrol edilen başlatma şartı gerektirir.','Tek motorlu DOL devresinde ikinci konveyör motoru, koşul sensörü ve sıralama lojik yolu yoktur.']
];
/* MQ07 sequence lesson CONTENT (not a generic QA overlay).
   SC172: real two-motor automatic dependent sequence. M1 starts by
   existing START/STOP K1; its K1/13–14 contact enables K2 and M2.
   SC180: K1 and K2 independently held by distinct START/STOP stations.
   Use only existing IEC three-phase motor, contactor and button pins. */
function mq07RealTwoMotorSequence(lesson,variant){
 const p=lesson.project;
 if(!p||p.wires.length!==13||!Array.isArray(lesson.materials)||
    !Array.isArray(lesson.steps)||
    p.components.filter(c=>c.typeId==='motor-3p').length!==1||
    p.components.filter(c=>c.typeId==='coil-contactor').length!==1||
    !p.components.some(c=>c.id==='g1'&&c.typeId==='supply-3p')||
    !p.components.some(c=>c.id==='motor'&&c.ref==='M1')||
    !p.components.some(c=>c.id==='coil'&&c.ref==='K1')||
    !p.components.some(c=>c.id==='main'&&c.ref==='K1'))
  throw Error('MQ07 SC172/SC180 original 13-wire DOL graph changed');
 const motor2=C('motor2','motor-3p',1800,260,'M2','M2 · ikinci üç fazlı asenkron motor');
 const main2=C('main2','main-contact',1470,210,'K2','K2 · ikinci motor güç kontakları');
 const coil2=C('coil2','coil-contactor',1460,600,'K2','K2 · ikinci motor kontaktör bobini');
 const added=[motor2,main2,coil2];
 const wires=[
  ...[['L1','1','2','U','#e53935'],['L2','3','4','V','#f97316'],
      ['L3','5','6','W','#f4c430']].flatMap(([phase,input,output,terminal,color])=>[
   W('g1',phase,'main2',input,phase+' → K2/'+input,
    'K2 ikinci motor için bağımsız üç faz güç girişidir.',color,phase,'2.5'),
   W('main2',output,'motor2',terminal,'K2/'+output+' → M2/'+terminal,
    'K2 çektiğinde M2 sargısı '+terminal+' enerjilenir.',color,phase,'2.5')
  ]),
  W('g1','PE','motor2','PE','PE → M2/PE',
    'M2 gövdesi kaynak PE koruma hattına bağlıdır.','#16a34a','PE','2.5')
 ];
 if(variant==='dependent'){
  const allow=C('k1Permit','contact-no',1220,620,'K1','K1 NO · M2 sıralama izni');
  added.push(allow);
  wires.push(
   W('g1','L1','k1Permit','13','L1 → K1 yardımcı NO/13',
    'M2 beslemesi K1 birinci motor kontaktörü çekmeden açılmaz.','#e53935','L1'),
   W('k1Permit','14','coil2','A1','K1 NO/14 → K2/A1',
    'M1 kontaktörü etkinleştiğinde ikinci kontaktör ve M2 sıralı açılır.','#e53935','L1'),
   W('coil2','A2','g1','N','K2/A2 → N',
    'M2 kontaktör bobinini nötre döndürür.','#1e88e5','N')
  );
 }else if(variant==='independent'){
  const stop2=C('stop2','push-nc',1140,780,'S2','M2 · bağımsız STOP');
  const start2=C('start2','push-no',1210,520,'S3','M2 · bağımsız START');
  const hold2=C('hold2','contact-no',1230,710,'K2','K2 NO · M2 mühürleme');
  added.push(stop2,start2,hold2);
  wires.push(
   W('g1','L1','stop2','21','L1 → M2 STOP/21',
    'İkinci motorun ayrı NC durdurma butonu kendi kontrol kolunu keser.','#e53935','L1'),
   W('stop2','22','start2','13','M2 STOP/22 → START/13',
    'S3 yalnız M2 bobinini tetikler.','#e53935','L1'),
   W('start2','14','coil2','A1','M2 START/14 → K2/A1',
    'M2 bağımsız START, K2 kontaktörünü çeker.','#e53935','L1'),
   W('coil2','A2','g1','N','K2/A2 → N',
    'M2 bobin dönüş yoludur.','#1e88e5','N'),
   W('stop2','22','hold2','13','M2 STOP/22 → K2 NO/13',
    'M2 mühürlemesi yalnız ikinci durdurma devresinde kalır.','#e53935','L1'),
   W('hold2','14','coil2','A1','K2 NO/14 → K2/A1',
    'S3 bırakıldığında K2, M2 için ayrı mühürleme sağlar.','#e53935','L1')
  );
 }else throw Error('Unsupported two-motor lesson variant '+variant);
 p.components.push(...added);p.wires.push(...wires);
 lesson.materials.push(...materialRows({components:added}));
 lesson.steps.push(...wires.map(w=>({
  from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,
  why:w.tutorialWhy,color:w.color,role:w.role,size:w.size
 })));
 if(p.wires.length!==(variant==='dependent'?23:26)||
    p.components.filter(c=>c.typeId==='motor-3p').length!==2||
    p.components.filter(c=>c.typeId==='coil-contactor').length!==2||
    p.components.filter(c=>c.typeId==='main-contact').length!==2)
  throw Error('Two-motor source topology did not match expected canonical pins');
}
/* SC173/175/181 real motor circuits, explicitly opt-in, all golden intact.
   The existing SC172 dependent K1→K2 source is a safe starting graph. */
function mq07SeqRebuildGuide(lesson){
 const p=lesson.project;
 lesson.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint||'Gerçek uçları bağla.',why:w.tutorialWhy||'Elektriksel bağlantı yolu.',
  color:w.color,role:w.role,size:w.size}));
}
function mq07SeqWire(lesson,mode){
 mq07RealTwoMotorSequence(lesson,'dependent');
 const p=lesson.project;
 const exact=(from,fp,to,tp)=>{
  const matches=p.wires.filter(w=>w.from?.c===from&&w.from?.p===fp&&
    w.to?.c===to&&w.to?.p===tp);
  if(matches.length!==1)throw Error('Motor '+mode+' expected source route missing '+from+'/'+fp+' > '+to+'/'+tp);
  return matches[0];
 };
 const wires=[],added=[];
 if(mode==='periodic'){
  const flasher=C('ktPulse','coil-flasher',1710,730,'KT','KT · periyodik zamanlayıcı',
   {flashOn:2,flashOff:2,tutorialPurpose:'K1 etkin olduğu sürece 2 s AÇIK/2 s KAPALI sürelerle M2 besleme kontaktörünü sürer.'});
  const pulse=C('ktContact','contact-no',1290,790,'KT','KT NO · M2 periyodik kontak',
   {tutorialPurpose:'KT flaşör çıkışı ON durumunda K2/M2 güç kolunu çalıştırır.'});
  added.push(flasher,pulse);
  exact('k1Permit','14','coil2','A1').to={c:'ktPulse',p:'A1'};
  wires.push(
   W('ktPulse','A2','g1','N','KT/A2 → N','Zamanlayıcı bobini N dönüşüdür.','#1e88e5','N'),
   W('g1','L1','ktContact','13','L1 → KT NO/13','K2 bobinine periyodik enerji izni.','#e53935','L1'),
   W('ktContact','14','coil2','A1','KT NO/14 → K2/A1','K2 yalnız KT aktifken çeker.','#e53935','L1')
  );
 }else if(mode==='thermal'){
  const ol1=C('ol1','overload',1010,420,'FR1','M1 termik · FR1',
   {tutorialPurpose:'M1 üç fazını 1–2/3–4/5–6 üzerinden korur; 95–96 NC tripte ortak bobin zincirini açar.'});
  const ol2=C('ol2','overload',1650,420,'FR2','M2 termik · FR2',
   {tutorialPurpose:'M2 üç fazının ayrı termiğidir; tripte 95–96 NC ortak STOP zincirini açar.'});
  added.push(ol1,ol2);
  for(const [src,motor,thermal] of [['main','motor','ol1'],['main2','motor2','ol2']]){
   for(const [out,inPin,outPin,motorPin,color,role] of [
    ['2','1','2','U','#e53935','L1'],['4','3','4','V','#f97316','L2'],
    ['6','5','6','W','#f4c430','L3']]){
    exact(src,out,motor,motorPin).to={c:thermal,p:inPin};
    wires.push(W(thermal,outPin,motor,motorPin,thermal+'/'+outPin+' → '+motor+'/'+motorPin,
      'Termik ana güç yolu faz motor sargısına seri girer.',color,role,'2.5'));
   }
  }
  for(const id of ['start','hold']){
   exact(id,'14','coil','A1').to={c:'ol1',p:'95'};
  }
  wires.push(
   W('ol1','96','ol2','95','FR1/96 → FR2/95',
    'İki termiğin 95–96 NC kontakları seri: biri trip yaparsa her iki motor STOP.','#e53935','L1'),
   W('ol2','96','coil','A1','FR2/96 → K1/A1',
    'Ortak termik güvenlik zincirinden sonra K1 beslenir.','#e53935','L1')
  );
 }else if(mode==='conveyor'){
  const supply=C('psSensor','supply-dc-plus',1110,950,'G3','K1 izinli 24 VDC sensör/kontaktör kaynağı');
  const sensor=C('convSensor','proximity',1650,690,'B1','Konveyör · PNP endüktif algılayıcı',
   {tutorialPurpose:'Hedef algılandığında BK PNP çıkışı K2 bobinini besler; BN +24V, BU 0V. M1 izin kontağı seri.'});
  added.push(supply,sensor);
  exact('g1','L1','k1Permit','13').from={c:'psSensor',p:'P'};
  exact('k1Permit','14','coil2','A1').to={c:'convSensor',p:'BN'};
  exact('coil2','A2','g1','N').to={c:'psSensor',p:'M'};
  wires.push(
   W('convSensor','BU','psSensor','M','BN/BU sensör 0V dönüş',
    'Sensör elektronik beslemesi yalnız ayrı 24 VDC kaynaktan tamamlanır.','#111827','0V'),
   W('convSensor','BK','coil2','A1','PNP BK → K2/A1',
    'Hedef algısı ve K1 izin kontağı birlikte M2 kontaktörünü açar.','#43a047','SIGNAL')
  );
 }else throw Error('Unrecognized motor content mode '+mode);
 p.components.push(...added);
 p.wires.push(...wires);
 lesson.materials.push(...materialRows({components:added}));
 mq07SeqRebuildGuide(lesson);
 const count={periodic:26,thermal:31,conveyor:25}[mode];
 if(p.wires.length!==count||p.components.filter(c=>c.typeId==='motor-3p').length!==2||
    p.components.filter(c=>c.typeId==='coil-contactor').length!==2)
  throw Error('Unexpected two-motor '+mode+' source graph');
}

/* SC174/177 actual two-motor timer circuits; all additions are confined to
   explicitly selected lessons. Both use the existing two-motor K1/K2 power
   graph; their control contacts are physically connected to native timers. */
function mq07SeqTimedMotors(lesson,mode){
 mq07RealTwoMotorSequence(lesson,'dependent');
 const p=lesson.project,added=[],wires=[];
 const find=(a,ap,b,bp)=>{
  const matches=p.wires.filter(w=>w.from?.c===a&&w.from?.p===ap&&
   w.to?.c===b&&w.to?.p===bp);
  if(matches.length!==1)throw Error('MQ07 '+mode+' circuit route changed '+a+'/'+ap+' → '+b+'/'+bp);
  return matches[0];
 };
 const term=(a,ap,b,bp,msg)=>W(a,ap,b,bp,msg,
  'Zamanlı motor güç/kumanda yolu, gerçek katalog uçlarını kullanır.',
  '#e53935','L1');
 if(mode==='alternating'){
  // Master K0 holds the original START/STOP circuit. KT flasher toggles
  // complementary K1/K2 coils; neither contact is fed after master STOP.
  const master=C('master','coil-contactor',1070,840,'K0','K0 · ana çalışma bobini');
  const flash=C('cycleKT','coil-flasher',1410,850,'KT','KT · iki motor 2 s / 2 s',
   {flashOn:2,flashOff:2,tutorialPurpose:'K0 izni varken KT periyodik faz değiştirir.'});
  const enable=C('masterNO','contact-no',1200,790,'K0','K0 NO · zaman izni');
  const ktNO=C('cycleNO','contact-no',1700,790,'KT','KT NO · M1 fazı');
  const ktNC=C('cycleNC','contact-nc',1700,920,'KT','KT NC · M2 fazı');
  added.push(master,flash,enable,ktNO,ktNC);
  for(const id of ['start','hold'])find(id,'14','coil','A1').to={c:'master',p:'A1'};
  p.components.find(c=>c.id==='hold').ref='K0';
  p.components.find(c=>c.id==='k1Permit').ref='K0';
  find('k1Permit','14','coil2','A1').to={c:'cycleKT',p:'A1'};
  wires.push(
   term('master','A2','g1','N','K0/A2 → N'),
   term('cycleKT','A2','g1','N','KT/A2 → N'),
   term('k1Permit','14','cycleNO','13','K0 izin → KT NO/13'),
   term('cycleNO','14','coil','A1','KT NO → K1 M1'),
   term('k1Permit','14','cycleNC','21','K0 izin → KT NC/21'),
   term('cycleNC','22','coil2','A1','KT NC → K2 M2')
  );
  // Existing K1 coil return and M2 K2 coil return remain wired.
  // K0 auxiliary contact is the already wired k1Permit; do not add an
  // unused duplicate device to the scene.
  added.splice(added.indexOf(enable),1);
 }else if(mode==='delayed-reverse-m2'){
  const timer=C('delayedKT','coil-delay-on',1460,790,'KT','KT · gecikmeli geri M2',
   {delayValue:3,delayUnit:'s',tutorialPurpose:'K1 çekmesinden 3 s sonra KT/13–14 geri M2 yoluna izin verir.'});
  const contact=C('delayedNO','contact-no',1590,920,'KT','KT gecikme sonrası NO 13–14');
  added.push(timer,contact);
  // M2 power swaps L1/L3 on two phases while M1 K1 keeps forward U/V/W.
  for(const [pin,newTerminal] of [['2','W'],['6','U']]){
   const old=pin==='2'?'U':'W';
   find('main2',pin,'motor2',old).to={c:'motor2',p:newTerminal};
  }
  find('k1Permit','14','coil2','A1').to={c:'delayedKT',p:'A1'};
  wires.push(
   term('delayedKT','A2','g1','N','KT/A2 → N'),
   term('k1Permit','14','delayedNO','13','K1 izin → KT TON/13'),
   term('delayedNO','14','coil2','A1','KT TON/14 → K2/A1')
  );
 }else throw Error('Unexpected motor timer mode '+mode);
 p.components.push(...added);p.wires.push(...wires);
 lesson.materials.push(...materialRows({components:added}));
 mq07SeqRebuildGuide(lesson);
 const count=mode==='alternating'?29:26;
 if(p.wires.length!==count||p.components.filter(c=>c.typeId==='motor-3p').length!==2||
    p.components.filter(c=>c.typeId==='coil-contactor').length!==(mode==='alternating'?3:2))
  throw Error('Incomplete timed motor source graph '+mode);
}
/* SC176: use the already-existing proven 3P forward/reverse example, clone
   to avoid mutating locked motor-forward-reverse-1. Each NC limit is placed
   AFTER both START and holding paths: no bypass around the limit switch.
   Reverse direction is still a separate manual request, not automatic. */
/* SC178: START latches independent KM run relay. KT1 starts immediately:
   K1 forward runs for 3 seconds. KT1 NC opens K1 at 3 s; a second KT2
   delay adds a 1-second neutral interval before K2 reverse is allowed.
   Original contactor cross-NC locks and opposite phase power paths stay. */
function mq07SeqTimedReverse(lesson){
 const reference=L.byId['motor-forward-reverse-1']?.project;
 if(!reference?.wires?.length)throw Error('Missing locked forward/reverse reference');
 const p=clone(reference);
 const route=(from,fp,to,tp)=>{
  const hits=p.wires.filter(w=>w.from?.c===from&&w.from?.p===fp&&
    w.to?.c===to&&w.to?.p===tp);
  if(hits.length!==1)throw Error('SC178 source route changed '+from+'/'+fp+' → '+to+'/'+tp);
  return hits[0];
 };
 for(const id of ['startF','holdF','coilF','lockF','lockR','startR','holdR','coilR']){
  if(!p.components.some(c=>c.id===id))throw Error('SC178 missing original '+id);
 }
 const master=C('master','coil-relay',1160,970,'KM','KM · zamanlı çevrim mühürleme');
 const enable=C('enable','contact-no',1370,890,'KM','KM NO · timer beslemesi');
 const ktForward=C('ktForward','coil-delay-on',1510,770,'KT1','KT1 · ileri 3 saniye',
  {delayValue:3,delayUnit:'s',tutorialPurpose:'START sonrası 3 s ileri sürüş, ardından K1 bırakır.'});
 const ktFStop=C('ktFStop','contact-nc',1650,610,'KT1','KT1 NC · ileri bitiş');
 const ktReverseStart=C('ktReverseStart','contact-no',1710,850,'KT1','KT1 NO · geçiş başlatma');
 const ktNeutral=C('ktNeutral','coil-delay-on',1820,1000,'KT2','KT2 · 1 s boşluk',
  {delayValue:1,delayUnit:'s',tutorialPurpose:'İleri kontaktör bıraktıktan sonra geri yöne geçiş öncesi 1 saniye ölü zaman.'});
 const ktRRun=C('ktRRun','contact-no',1950,850,'KT2','KT2 NO · geri başlatma');
 const added=[master,enable,ktForward,ktFStop,ktReverseStart,ktNeutral,ktRRun];
 for(const id of ['startF','holdF'])route(id,'14','coilF','A1').to={c:'master',p:'A1'};
 for(const id of ['startF','holdF'])route('lockR','22',id,'13').from={c:'stop',p:'22'};
 p.components.find(c=>c.id==='holdF').ref='KM';
 // Original reverse manual START / holding path is replaced with a
 // single delayed interlocked K2 command: avoid hidden duplicate requests.
 p.wires=p.wires.filter(w=>!['startR','holdR'].includes(w.from?.c)&&
   !['startR','holdR'].includes(w.to?.c));
 p.components=p.components.filter(c=>!['startR','holdR'].includes(c.id));
 const add=[
  W('master','A2','g1','N','KM/A2 → N','Ana program rölesinin dönüşüdür.','#1e88e5','N'),
  W('g1','L1','enable','13','L1 → KM NO/13','Zamanlayıcı beslemesi ancak KM mühürlenince mümkündür.','#e53935','L1'),
  W('enable','14','ktForward','A1','KM NO → KT1/A1','İleri sürüş 3 saniyelik geri sayım başlar.','#e53935','L1'),
  W('ktForward','A2','g1','N','KT1/A2 → N','KT1 bobin dönüşüdür.','#1e88e5','N'),
  W('lockR','22','ktFStop','21','K2 NC → KT1 NC','KT1 süresi bitene dek ileri kontaktöre izin verir.','#e53935','L1'),
  W('ktFStop','22','coilF','A1','KT1 NC → K1/A1','3 s sonunda ileri bobin bırakır.','#e53935','L1'),
  W('enable','14','ktReverseStart','13','KM izni → KT1 NO','İleri dönem sonrasında geri geçiş hazırlığıdır.','#e53935','L1'),
  W('ktReverseStart','14','ktNeutral','A1','KT1 NO → KT2/A1','İleri yön bıraktıktan sonra 1 s gecikme başlar.','#e53935','L1'),
  W('ktNeutral','A2','g1','N','KT2/A2 → N','Boşluk gecikmesi bobin dönüşüdür.','#1e88e5','N'),
  W('lockF','22','ktRRun','13','K1 NC → KT2 NO','K1 çalışırken geri kontaktöre fiziksel izin yoktur.','#e53935','L1'),
  W('ktRRun','14','coilR','A1','KT2 NO → K2/A1','Nötr gecikmesi sonrası K2 ters fazlı motoru sürer.','#e53935','L1')
 ];
 p.components.push(...added);p.wires.push(...add);
 p.projectId='tutorial-session-source-'+lesson.id;
 p.name='Öğretici · '+lesson.title;
 p.tutorialLesson={id:lesson.id,topicId:lesson.topicId,phase:'demo',step:0,level:lesson.variant};
 lesson.project=p;lesson.kind='wiring';lesson.materials=materialRows(p);
 mq07SeqRebuildGuide(lesson);
 if(p.wires.length!==reference.wires.length-4+11||
    p.components.filter(c=>c.typeId==='motor-3p').length!==1||
    p.components.filter(c=>c.typeId==='coil-contactor').length!==2||
    p.components.filter(c=>c.typeId==='coil-delay-on').length!==2)
  throw Error('SC178 timed reverse wiring differs from source reference');
}
/* SC176 fully wired single-motor limit reversal: NC limit switches
   energize monitoring relays during normal travel. Relay NO enables the
   active direction and relay NC becomes the opposite-direction auto-start
   when its limit opens. The original opposing NC K1/K2 interlocks remain. */
function mq07SeqLimit(lesson){
 const sample=L.byId['motor-forward-reverse-1']?.project;
 if(!sample?.wires?.length)throw Error('Missing locked forward/reverse reference');
 const p=clone(sample);
 const must=(a,ap,b,bp)=>{
  const set=p.wires.filter(w=>w.from?.c===a&&w.from?.p===ap&&
    w.to?.c===b&&w.to?.p===bp);
  if(set.length!==1)throw Error('SC176 source route changed '+a+'/'+ap+' → '+b+'/'+bp);
  return set[0];
 };
 const original=['startF','holdF','coilF','lockF','startR','holdR','coilR','lockR'];
 if(!original.every(id=>p.components.some(c=>c.id===id))||
    p.components.some(c=>['ls1','ls2','senseF','senseR'].includes(c.id)))
   throw Error('Original motor reversing graph no longer matches SC176');
 const ls1=C('ls1','limit-nc',1300,760,'LS1','İleri uç sınırı · NC');
 const ls2=C('ls2','limit-nc',1550,760,'LS2','Geri uç sınırı · NC');
 const senseF=C('senseF','coil-relay',1450,920,'KR1','LS1 sağlam rölesi');
 const senseR=C('senseR','coil-relay',1700,920,'KR2','LS2 sağlam rölesi');
 const passF=C('passF','contact-no',1070,540,'KR1','KR1 NO · ileri izin');
 const passR=C('passR','contact-no',1070,840,'KR2','KR2 NO · geri izin');
 const autoR=C('autoR','contact-nc',1270,840,'KR1','KR1 NC · otomatik geri START');
 const autoF=C('autoF','contact-nc',1270,540,'KR2','KR2 NC · otomatik ileri START');
 const added=[ls1,ls2,senseF,senseR,passF,passR,autoR,autoF];
 p.components.push(...added);
 for(const id of ['startF','holdF'])must(id,'14','coilF','A1').to={c:'passF',p:'13'};
 for(const id of ['startR','holdR'])must(id,'14','coilR','A1').to={c:'passR',p:'13'};
 const add=[
  W('g1','L1','ls1','21','L1 → LS1/21','LS1 normalde kapalı sınır beslemesidir.','#e53935','L1'),
  W('ls1','22','senseF','A1','LS1/22 → KR1/A1','İleri uç tetiklenince KR1 bırakır.','#e53935','L1'),
  W('senseF','A2','g1','N','KR1/A2 → N','LS1 algılama rölesi nötr dönüşüdür.','#1e88e5','N'),
  W('g1','L1','ls2','21','L1 → LS2/21','LS2 normalde kapalı sınır beslemesidir.','#e53935','L1'),
  W('ls2','22','senseR','A1','LS2/22 → KR2/A1','Geri uç tetiklenince KR2 bırakır.','#e53935','L1'),
  W('senseR','A2','g1','N','KR2/A2 → N','LS2 algılama rölesi nötr dönüşüdür.','#1e88e5','N'),
  W('passF','14','coilF','A1','KR1 NO → K1/A1','KR1 aktif değilken ileri motor bıraktırılır.','#e53935','L1'),
  W('passR','14','coilR','A1','KR2 NO → K2/A1','KR2 aktif değilken geri motor bıraktırılır.','#e53935','L1'),
  W('lockF','22','autoR','21','K1 NC → KR1 NC','İleri kontaktör serbest bırakınca LS1 sınırı geri yön isteği üretir.','#e53935','L1'),
  W('autoR','22','passR','13','KR1 NC → geri izin','LS1 açık kaldığında geri kontaktör başlatma yolu hazırdır.','#e53935','L1'),
  W('lockR','22','autoF','21','K2 NC → KR2 NC','Geri kontaktör serbest bırakınca LS2 sınırı ileri yön isteği üretir.','#e53935','L1'),
  W('autoF','22','passF','13','KR2 NC → ileri izin','LS2 açık kaldığında ileri kontaktör başlatma yolu hazırdır.','#e53935','L1')
 ];
 p.wires.push(...add);
 p.projectId='tutorial-session-source-'+lesson.id;
 p.name='Öğretici · '+lesson.title;
 p.tutorialLesson={id:lesson.id,topicId:lesson.topicId,phase:'demo',step:0,level:lesson.variant};
 lesson.project=p;lesson.kind='wiring';lesson.materials=materialRows(p);
 mq07SeqRebuildGuide(lesson);
 if(p.components.filter(c=>c.typeId==='limit-nc').length!==2||
   p.components.filter(c=>c.typeId==='coil-relay').length!==2||
   p.components.filter(c=>c.typeId==='coil-contactor').length!==2||
   p.wires.length!==sample.wires.length+12)
  throw Error('SC176 automatic limit reversing paths inconsistent');
}

for(const [suffix,issue,concept,limitation] of mq07SequenceScope172to181){
 const id='motor-sequence-src-'+suffix,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='wiring'||lesson.project?.wires?.length!==13||
    lesson.project.components.filter(c=>c.typeId==='motor-3p').length!==1||
    lesson.project.components.filter(c=>c.typeId==='coil-contactor').length!==1)
  throw Error('MQ07 SC172–181 original topology changed: '+id);
 const dependent=suffix==='01',independent=suffix==='09';
 const mode=({'02':'periodic','04':'thermal','10':'conveyor'})[suffix]||null;
 const timed=({'03':'alternating','06':'delayed-reverse-m2'})[suffix]||null;
 const timedReverse=suffix==='07',limit=suffix==='05';
 if(dependent||independent)mq07RealTwoMotorSequence(lesson,dependent?'dependent':'independent');
 if(mode)mq07SeqWire(lesson,mode);
 if(timed)mq07SeqTimedMotors(lesson,timed);
 if(timedReverse)mq07SeqTimedReverse(lesson);
 if(limit)mq07SeqLimit(lesson);
 const real=dependent||independent||!!mode||!!timed||timedReverse||limit;
 const actual=dependent?
  'M1 START/STOP ile K1 çekince K1 NO/13–14 kolu K2 ve M2 motorunu sırayla enerjilendirir. M1 STOP ile iki motor da bırakır.':
  independent?'M1 ve M2 ayrı START, STOP ve K1/K2 mühürleme koluna sahiptir. Her motor bağımsız başlatılır veya durdurulur.':
  mode==='periodic'?'M1 kontaktörü KT flaşörünü besler; KT NO kontağı 2 s AÇIK/2 s KAPALI iken K2 üzerinden M2 dönemsel çalışır. M1 sürekli çalışır, iki motorun karşılıklı dönüşümü henüz modellenmemiştir.':
  mode==='thermal'?'M1 ve M2 ayrı üç kutuplu FR1/FR2 termik ana güç yollarından geçer; iki 95–96 NC yardımcı kontak seri kumanda zincirinde ortak duruş sağlar.':
  mode==='conveyor'?'K1 izin kontağı ayrı 24 VDC kaynaktan PNP yakınlık sensörünü besler; BK çıkışı algılama olduğunda K2 ve konveyör M2 devreye girer.':
  timed==='alternating'?'K0 START/STOP ve mühürleme ana kumandası; KT flaşörün birbirini tamamlayan NO/NC kontakları K1/M1 ve K2/M2 motorlarını 2 saniyelik fazlarda sırayla çalıştıracak gerçek elektriksel yolları oluşturur.':
  timed==='delayed-reverse-m2'?'K1/M1 ileri güç yolu önce çalışır, K1 NO ile beslenen KT üç saniye sonra K2/M2 geri güç yoluna izin verir; K2 motorunda L1 ve L3 yer değiştirir.':
  timedReverse?'KM ana çalışma rölesi START ile mühürlenir; KT1 gecikmeli çıkışı ilk 3 saniyede K1 ileri kontaktörüne izin verir. KT1 tamamlanınca K1 bırakır, KT2 ayrı 1 saniyelik nötr geçişten sonra K2 geri kontaktörünü kilitli güç yolundan sürer. STOP tüm çevrimi sıfırlar; ters motorun mekanik durma süresi modellenmez.':
  limit?'İleri uç LS1 ve geri uç LS2 normalde kapalı sınırları KR1/KR2 algılama bobinlerini besler; sınır açıldığında karşı yönün NC röle tetik kontağı karşı kontaktörü kilitli güç yolundan otomatik başlatır. Gerçek motorun mekanik konumu simülasyonda otomatik ilerlemez; sınır tetiklemesi sanal kullanıcı girişidir.':null;
 lesson.summary=concept+(limit?' Tek motorlu ileri/geri güç yolu iki NC sınır anahtarıyla kesilebilir.':
  real?' İki ayrı motorun güç ve kumanda bağlantıları şimdi çizilmiştir.':
  ' Bu sayfada yalnız tek motorlu doğrudan yol verme (DOL) devresi vardır.');
 lesson.explanation=concept+' '+(actual||limitation)+
  (real?' Değiştirilen devrenin dinamik Node ve Windows sonucu henüz doğrulanmamıştır; fiziksel/üretici kabulü verilmez.':
  ' Node ile tek motorun START/hold/STOP davranışı sınanır; çok motorlu veya fiziksel çalışma kabul edilmemiştir.');
 lesson.learningGoal=concept+' Başlıktaki şartları çizilmiş motor, kontaktör ve kumanda kablolarıyla karşılaştırmak.';
 lesson.beginnerSteps=[
  'Ekrandaki motorları ve ayrı kontaktörleri say.',
  'START, mühürleme ve STOP tepkilerini sanal Node çözümünde karşılaştır.',
  actual||limitation,
  'Yalnız gerçek çalışan motor koşullarını doğrula; eksik timer, limit ya da termik işlevine PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07MotorScope:'SC172_SC181',
  titleTopologyStatus:'REVIEW',
  titleTopologyIssue:dependent?'TWO_MOTOR_SEQUENTIAL_NATIVE_PENDING':
    independent?'TWO_MOTOR_INDEPENDENT_NATIVE_PENDING':
    mode==='periodic'?'TWO_MOTOR_PERIODIC_M2_NATIVE_PENDING':
    mode==='thermal'?'TWO_MOTOR_DUAL_THERMAL_NATIVE_PENDING':
    mode==='conveyor'?'TWO_MOTOR_CONVEYOR_SENSOR_NATIVE_PENDING':
    timed==='alternating'?'TWO_MOTOR_ALTERNATING_TIMER_NATIVE_PENDING':
    timed==='delayed-reverse-m2'?'TWO_MOTOR_DELAYED_REVERSE_NATIVE_PENDING':
    timedReverse?'TIMED_FORWARD_REVERSE_NATIVE_PENDING':
    limit?'LIMIT_AUTO_REVERSE_SOURCE_NATIVE_PENDING':issue,
  multiMotorAcceptance:false,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
 if(!real)mq07MotorMaterialLimit(lesson,'motor-3p',limitation,'tek motorlu DOL');
}

/* MQ07 actual motor-type authoring SC164–171. Catalog-valid U/N/PE
   single-phase supply circuits demonstrate real contactor command paths.
   The global motor model does NOT expose a separately wired Z1/Z2 auxiliary
   winding, so neither the starting capacitor nor rotation is accepted.
   Unsupported synchronous/reverse cases become accurate product references,
   not the previously unrelated three-phase forward/reverse running demo. */
function mq07CorrectSpecialMotorLesson(lesson,suffix){
 const previous=lesson.project;
 if(!previous||previous.wires.length!==30||
    previous.components.filter(c=>c.typeId==='motor-3p').length!==1||
    !previous.components.some(c=>c.id==='coilF')||
    !previous.components.some(c=>c.id==='coilR'))
  throw Error('SC164–171 three-phase surrogate changed; cannot replace');
 let p;
 if(suffix==='01'||suffix==='02'){
  const retained=suffix==='02';
  p=base(lesson.id,lesson.title,'control');
  p.components.push(
   C('g1','supply-1p',90,170,'G1','Tek faz AC kaynağı'),
   C('stop','push-nc',290,570,'S0','Motor STOP'),
   C('start','push-no',510,500,'S1','Motor START'),
   C('coil','coil-contactor',900,590,'K1','K1 kontaktör bobini'),
   C('main','main-contact',940,250,'K1','K1 güç kontağı'),
   C('motor','motor-1p',1280,300,'M1','Tek fazlı motor · U/N/PE')
  );
  if(retained)p.components.push(C('hold','contact-no',680,710,'K1','K1 NO mühürleme'));
  const lines=[
   W('g1','L','stop','21','L → NC STOP/21','Kumanda devresinin kesme noktası.','#e53935','L1'),
   W('stop','22','start','13','STOP/22 → START/13','Motor kontaktörünü yalnız START kapatır.','#e53935','L1'),
   W('start','14','coil','A1','START/14 → K1/A1','K1 bobin başlangıç kumandasıdır.','#e53935','L1'),
   W('coil','A2','g1','N','K1/A2 → N','Kumanda bobini AC dönüşüdür.','#1e88e5','N'),
   W('g1','L','main','1','L → K1/1','Motorun tek faz güç kolu.','#e53935','L1','2.5'),
   W('main','2','motor','U','K1/2 → motor/U','Motorun mevcut katalog U güç terminali.','#e53935','L1','2.5'),
   W('g1','N','motor','N','N → motor/N','Motor katalog nötr terminali.','#1e88e5','N','2.5'),
   W('g1','PE','motor','PE','PE → motor/PE','Motor koruma toprağı.','#16a34a','PE','2.5')
  ];
  if(retained)lines.push(
   W('stop','22','hold','13','STOP/22 → K1 NO/13','K1 mühürleme yolu NC STOP arkasından beslenir.','#e53935','L1'),
   W('hold','14','coil','A1','K1 NO/14 → K1/A1','START bırakılınca K1 kontaktörü tutulur.','#e53935','L1')
  );
  p.wires.push(...lines);
  if(p.wires.length!==(retained?10:8))throw Error('SC164/165 live contactor wire mismatch');
 }else{
  const refParts={
   '03':[['supply-1p','Tek faz AC kaynak'],['motor-1p','Yön değiştirme için yardımcı sargısı ayrı gösterilemeyen tek faz motor'],['capacitor','Yardımcı sargı kondansatörü · referans']],
   '04':[['supply-3p','Üç faz besleme · kavramsal'],['tutorial-synchronous-motor','Senkron motor eğitim sembolü']],
   '05':[['tutorial-synchronous-motor','Senkron motor sembolü'],['motor-3p','Yardımcı asenkron başlatma motoru · referans']],
   '06':[['supply-3p','Üç faz besleme · kavramsal'],['tutorial-synchronous-motor','Senkron motor sembolü']],
   '08':[['hcfa-sv-x2ea040a-a','Servo sürücü · tip kontrolü gerekli'],['hcfa-sv-x2mh040a-n2ln','Servo motor · mıknatıslı rotor kabulü henüz yok']]
  }[suffix];
  if(!refParts)throw Error('Unsupported special motor source '+suffix);
  p=board(lesson.id,lesson.title,refParts);
 }
 p.projectId=previous.projectId;p.name=previous.name;
 p.tutorialLesson={...clone(previous.tutorialLesson),phase:p.wires.length?'demo':'quiz'};
 lesson.project=p;lesson.kind=p.wires.length?'wiring':'quiz';
 lesson.steps=p.wires.map(w=>({
  from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,
  why:w.tutorialWhy,color:w.color,role:w.role,size:w.size
 }));
 lesson.materials=materialRows(p);
}
/* MQ07_SC164_SC171_SPECIAL_MOTOR: documented mismatch only; canonical physical graph remains unchanged. */
const mq07SpecialMotorScope164to171=[
 ['01','MISSING_SINGLE_PHASE_AUX_WINDING','Tek faz yardımcı sargılı asenkron motorda ana ve yardımcı sargılar ayrı uçlara bağlanır; yol verme yöntemi kapasitör/anahtar türüne bağlıdır.','Gerçek tek faz AC beslemesi, K1 kontaktörü, motor U/N ve koruma PE uçları çizilmiştir; motorun ayrı Z1/Z2 yardımcı sargı terminalleri mevcut katalogda bulunmadığı için yardımcı sargı ve kalkış anahtarı simüle edilemez.'],
 ['02','MISSING_SINGLE_PHASE_START_RUN','Tek faz motorun sürekli çalıştırılması, uygun tek faz motor beslemesi ve yardımcı sargı başlangıç/çalışma düzeni gerektirir.','Tek fazlı motorun U/N/PE güç hattı ve K1 mühürlemeli START/STOP kumandası çizilmiştir. Yardımcı sargının ayrı gerçek terminali ve güvenilir kalkış dinamiği bu modelde bulunmadığından tam motor işlevi kabul edilmemiştir.'],
 ['03','MISSING_SINGLE_PHASE_AUX_REVERSAL','Tek faz motor yön değiştirmede motor tipine göre ana ya da yardımcı sargı bağlantısının göreli yönü değiştirilir.','Doğru tek faz kaynak, motor ve yardımcı kondansatör katalog referansları gösterilir; yardımcı sargının yönünü değiştirecek ayrı uçlar olmadığı için hiçbir ileri/geri devresi kablolanmış sayılmaz.'],
 ['04','MISSING_SYNCHRONOUS_MOTOR_MODEL','Senkron motorda rotor manyetik alanı stator döner alanıyla senkron hızda kilitlenir; kutup sayısı ve besleme frekansı belirleyicidir.','Doğru senkron motor eğitim sembolü ve üç faz besleme referansı gösterilir; rotor uyartımı, senkron kilitlenme, yük açısı ve gerçek hız modellemesi yoktur.'],
 ['05','MISSING_AUX_STARTER_MOTOR','Yardımcı motorla senkron motoru yol verme uygulamasında ayrı bir tahrik motoru, kuplaj ve senkrona bağlama/ayırma kontrolü gerekir.','Senkron motor ve ayrı yardımcı asenkron motor ürünleri birlikte gösterilir; aralarında mekanik kuplaj, güç bağlantısı, senkrona geçiş veya ayırma programı bulunmaz.'],
 ['06','MISSING_INDUCTION_START_OF_SYNCHRONOUS','Senkron motoru asenkron gibi başlatmak için uygun damper sargısı/başlatma düzeni ve senkron alana geçiş izlenmelidir.','Doğru senkron motor ürünü referans olarak gösterilir, fakat damper/uyartım sargıları ile senkrona çekilme ve anahtarlama işlevi simüle edilmez.'],
 ['07','NO_WIRED_CIRCUIT','Senkron motora invertörle yol vermede VFD çıkış frekansı, gerilim/akım sınırları ve motora uygun sürüş yöntemi gerekir.','Bu kartta VFD ile senkron motor yalnız malzeme referansıdır; çıkış uçları kablolanmamış, hız/frekans rampası simüle edilmemiştir.'],
 ['08','MISSING_PERMANENT_MAGNET_SYNCHRONOUS','Sabit mıknatıslı senkron motorun rotoru kalıcı mıknatıslıdır; sürücü ile akım/faz komütasyonu ve rotor pozisyonu ilişkisi belirlenir.','Servo sürücü ve servo motor gerçek ürün sınıfında gösterilir; model etiketi kalıcı mıknatıslı rotor tipini, sürücü komütasyonunu ve rotor pozisyon bilgisini doğrulamaz.']
];
for(const [suffix,issue,concept,limitation] of mq07SpecialMotorScope164to171){
 const id='motor-special-src-'+suffix,lesson=L.byId[id],ref=suffix==='07';
 if(!lesson||lesson.kind!==(ref?'quiz':'wiring')||!!lesson.project.wires.length===ref)
  throw Error('MQ07 SC164–171 source lesson structure changed: '+id);
 if(!ref)mq07CorrectSpecialMotorLesson(lesson,suffix);
 const p=lesson.project,onePhase=suffix==='01'||suffix==='02';
 if(ref&&(p.components.length!==2||!p.components.some(c=>c.typeId==='vfd')||
    !p.components.some(c=>c.typeId==='tutorial-synchronous-motor')))
  throw Error('MQ07 SC170 canonical VFD reference changed');
 if(onePhase&&(p.components.filter(c=>c.typeId==='motor-1p').length!==1||
    p.components.some(c=>c.typeId==='motor-3p')||
    p.wires.length!==(suffix==='01'?8:10)))throw Error('Single-phase source mismatch '+id);
 lesson.summary=concept+(onePhase?' Tek faz U/N/PE ve K1 kumanda devresi kuruludur; ayrı yardımcı sargı yoktur.':
   ' Başlığa uygun ürünler kavramsal referanstır; çalışma şeması değildir.');
 lesson.explanation=concept+' '+(onePhase?
  'Gerçek tek faz L/N/PE, K1 bobin/güç ve START/STOP devresi çizilmiştir. Motor kataloğu Z1/Z2 yardımcı sargı terminallerini sunmadığı için yardımcı sargı/kalkış ve gerçek dönme kabul edilmez. ':
  'Ekranda kaynak katalogda bulunan doğru sınıf ürünler gösterilir; bağımsız besleme, sürücü veya mekanik senkronizasyon devresi kurulmamıştır. ')+limitation+
  ' Node ve Windows gerçek motor işlevi henüz doğrulanmamıştır.';
 lesson.learningGoal=concept+' Gerçek terminal/kumanda grafiğini ve desteklenmeyen sargı ya da rotor işlevini ayırt etmek.';
 lesson.beginnerSteps=[
  'Ekrandaki ürün sınıfı ve motorun katalogdaki terminallerini incele.',
  onePhase?'K1 güç yolu ve ayrı STOP/START kumandasını incele.':'Bu kartın fiziksel kablosuz ürün referansı olduğunu doğrula.',
  limitation,
  'Yardımcı sargı, senkron rotor veya fiziksel motor sonucu doğrulanmadığı sürece PASS verme.'
 ];
 // Exact-topic content for catalog-backed special-motor references.
 // Native simulation has no separate Z1/Z2 winding, synchronous rotor or
 // verified servo commutation. These are real educational comparisons, not
 // a disguised three-phase running circuit or a fabricated motor PASS.
 const specialStudy={
  '03':{
   question:'Tek fazlı yardımcı sargılı motor yön değiştirmede hangi bilgi gereklidir?',
   options:['Ana/yardımcı sargının göreli bağlantı yönü','Sadece besleme sigortasının rengi','Üç faz şebekede rastgele iki faz değişimi'],
   why:'Yardımcı sargı ayrı katalog uçlarıyla sunulmuyorsa bu motorda gerçek ileri/geri işlevi simüle edilemez.',
   roles:{'motor-1p':'U/N/PE terminali olan bir faz motor; ayrı yardımcı sargı uçları bu modelde yok.',
    capacitor:'Yardımcı sargının kapasitörle çalışma ilkesini temsil eder, kablolu dinamik model değildir.'}},
  '04':{
   question:'Senkron motoru üç fazlı asenkron motordan ayıran temel hız özelliği nedir?',
   options:['Rotorun döner manyetik alanla senkron hızda kilitlenmesi',
    'Rotor hızının besleme frekansından bağımsız olması','Her durumda doğrudan sabit 1000 d/d dönmesi'],
   why:'Senkron hareket için rotor alanı, kutup/frekans ve senkronizasyon koşulları gerekir; bu kartta sayısal rotor modeli yoktur.',
   roles:{'tutorial-synchronous-motor':'Senkron motorun kavramsal sembolüdür; dinamik hız/uyartım modeli değildir.'}},
  '05':{
   question:'Yardımcı motorla senkron motor başlatma kartında hangi işlev modellenmemiştir?',
   options:['Mekanik kuplaj ve senkrona bağlama geçişi','İki ayrı motor türünün adları',
    'Senkron motorun konu başlığı'],
   why:'İki motorun yalnız katalogda görünmesi, mekanik birlikte çalışmayı ya da senkrona geçişi kanıtlamaz.',
   roles:{'tutorial-synchronous-motor':'Uyartımı ve eşzamanlı kilitlenmesi simüle edilmeyen senkron motor sembolü.',
    'motor-3p':'Yardımcı tahrik motorunu temsil eder; mekanik kuplaj kurulu değildir.'}},
  '06':{
   question:'Senkron motorun asenkron gibi kalkışını yalnız bu ürün kartıyla neden doğrulayamayız?',
   options:['Damper sargı ve senkrona geçiş dinamiği modellenmediği için',
    'Yalnız motor adı İngilizce olduğu için','Motorun hiç kutbu bulunmadığı için'],
   why:'Asenkron ilk kalkıştan senkron kilitlenmeye geçiş bağımsız motor fiziği gerektirir.',
   roles:{'tutorial-synchronous-motor':'Damper/uyartım sargısı ve rotor dinamiği bulunmayan senkron motor referansı.'}},
  '07':{
   question:'Senkron motora invertörle yol vermede sadece sürücü ve motor kartlarının görünmesi neyi kanıtlar?',
   options:['Yalnız doğru eleman türlerinin seçildiğini',
    'Sürücü frekans rampasının ölçüldüğünü','Senkron rotorun tam yükle çalıştığını'],
   why:'Sürücü parametreleri, motor uygunluğu ve çıkış/yük ölçümleri yoktur.',
   roles:{'vfd':'İnvertörün kavramsal ürünüdür; motorla elektriksel bağlantı veya frekans rampası yok.',
    'tutorial-synchronous-motor':'Uyumlu sürüşü ve rotor açısı doğrulanmamış motor referansı.'}},
  '08':{
   question:'Servo sürücü ve motor ürün kartlarından hangisi tek başına kesinleşmez?',
   options:['Kalıcı mıknatıslı rotor tipi ve geri besleme/komütasyon davranışı',
    'Kartta bir sürücü ve motor bulunduğu','İki cihazın aynı ders başlığında gösterildiği'],
   why:'Ürün sınıfı tek başına gerçek rotor tasarımını veya dinamik servo uyumluluğunu kanıtlamaz.',
   roles:{'hcfa-sv-x2ea040a-a':'Gerçek servo sürücü sınıfı; motor uyumu ve komütasyon kabulü henüz yok.',
    'hcfa-sv-x2mh040a-n2ln':'Gerçek servo motor sınıfı; PM rotor ve hareket davranışı doğrulanmadı.'}}
 }[suffix];
 if(specialStudy){
  lesson.quiz={question:specialStudy.question,options:specialStudy.options,
   answer:0,why:specialStudy.why};
  lesson.materials=lesson.materials.map(m=>specialStudy.roles[m.typeId]?
   {...m,why:specialStudy.roles[m.typeId]}:m);
 }
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07MotorScope:'SC164_SC171',
  titleTopologyStatus:'REVIEW',
  titleTopologyIssue:onePhase?'SINGLE_PHASE_AUX_WINDING_NATIVE_PENDING':issue,
  specialMotorAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
}

/* MQ07 real brake TOPIC repair: the current simulator has no brake
   torque or DC-injection model and tutorial-mechanical-brake has no pins.
   Therefore SC156 overview, SC157 mechanical brake and SC160 DC-injection
   calculation must show honest manufacturer-type catalog references rather
   than the unrelated live star/delta START demo. No fake brake wires. */
function mq07RepairBrakeReference(lesson,suffix){
 const old=lesson.project;
 if(!old||old.wires.length!==38||
    !old.components.some(c=>c.typeId==='motor-y-d')||
    !old.components.some(c=>c.typeId==='coil-delay-on'))
  throw Error('SC156/157/160 original star/delta graph changed');
 const parts={
  '01':[['motor-3p','Üç faz motor · kavram'],['tutorial-mechanical-brake','Mekanik balatalı fren sembolü'],
    ['supply-dc-plus','DC enjeksiyon kaynağı · referans'],['coil-delay-on','Zaman kontrollü frenleme · referans']],
  '02':[['motor-3p','Üç faz motor · kavram'],['tutorial-mechanical-brake','Yaylı balatalı fren · terminal ve tork modeli yok']],
  '05':[['supply-dc-plus','DC gerilim kaynağı · referans'],['resistor','Sargı direnci · yalnız R eşdeğeri'],
    ['meter-ammeter','DC akım ölçümü · yalnız referans'],['motor-y-d','Altı uçlu motor · gerçek DC enjeksiyon devresi kurulmadı']],
  '03':[['motor-y-d','Yıldız bağlantılı altı uçlu motor · referans'],
    ['supply-dc-plus','DC fren kaynağı · yalnız kavramsal'],
    ['coil-contactor','Şebekeden ayırma kontaktörü · referans'],
    ['contact-nc','Ayrı frenleme güvenlik kilidi · referans']],
  '04':[['motor-y-d','Üçgen bağlantılı altı uçlu motor · referans'],
    ['supply-dc-plus','DC fren kaynağı · yalnız kavramsal'],
    ['coil-contactor','Şebeke/fren geçiş kontaktörü · referans'],
    ['contact-nc','Ayrı frenleme kilidi · referans']],
  '06':[['motor-y-d','Yıldız–üçgen yol verilen motor · referans'],
    ['coil-delay-on','Yıldız–üçgen yol verme zaman rölesi · referans'],
    ['coil-contactor','Ayrı frenleme kontaktörü · yalnız kavramsal'],
    ['supply-dc-plus','DC enjeksiyon referansı · gerçek fren yolu yok'],
    ['contact-nc','Şebeke/fren karşılıklı kilidi · referans']],
  '07':[['motor-3p','Üç faz motor · frenleme için kavram'],
    ['tutorial-mechanical-brake','Mekanik fren · tork/terminal modeli yok'],
    ['coil-contactor','Fren komut kontaktörü · referans'],
    ['coil-delay-on','Otomatik fren zaman koşulu · referans']],
  '08':[['motor-3p','Üç faz motor · durma konusu'],
    ['tutorial-mechanical-brake','Fren elemanı · hareket modeli yok'],
    ['coil-delay-on','Frenleme zamanlayıcısı · referans'],
    ['contact-nc','Frenleme durumu kilidi · referans']]
 }[suffix];
 if(!parts)throw Error('Unknown brake reference '+suffix);
 const p=board(lesson.id,lesson.title,parts);
 p.projectId=old.projectId;p.name=old.name;
 p.tutorialLesson={...clone(old.tutorialLesson),phase:'quiz'};
 lesson.project=p;lesson.kind='quiz';lesson.steps=[];lesson.materials=materialRows(p);
}
/* MQ07_SC156_SC163_BRAKING: preserve existing Y-Delta sample and disclose missing braking mechanisms. */
const mq07BrakingScope156to163=[
 ['01','BRAKE_OVERVIEW_YDELTA_SUBSTITUTE','Frenleme sistemleri motorun enerjisinin kesilmesinden farklı olarak mekanik veya elektriksel yavaşlama/enerji kontrolünü hedefler.','Bu örnek yıldız–üçgen yol verme, zamanlı geçiş ve STOP ile beslemeyi kesme devresidir; mekanik fren, dinamik fren veya DC enjeksiyon devresi değildir.'],
 ['02','MISSING_MECHANICAL_BRAKE','Balatalı fren mekanik sürtünme ile motor miline fren momenti uygular; fren bobini ve mekanik kilit durumu ayrıca değerlendirilir.','Kayıtlı devrede balata, yaylı fren veya fren bobini mevcut değildir; sadece yıldız–üçgen kontaktörleri vardır.'],
 ['03','MISSING_STAR_DC_BRAKE','Yıldız bağlı motorun dinamik frenlemesi için güçten ayrılma ve frenleme enerjisinin kontrollü uygulandığı ayrı bir düzen gerekir.','Motor yıldız konumundan üçgene başlatılır; fren beslemesi, fren kontaktörü veya enerji sönümleme yolu bulunmaz.'],
 ['04','MISSING_DELTA_DC_BRAKE','Üçgen bağlı motorun dinamik frenlenmesinde frenleme akımı, sargı konumu ve geçiş kilidi ayrı değerlendirilir.','Kaydedilmiş devre normal yıldız–üçgen çalıştırmadır; üçgen konumunda ayrı DC enjeksiyon ya da frenleme yolu bulunmaz.'],
 ['05','MISSING_DC_INJECTION_CALC','DC enjeksiyon freninde gerilim seçimi, sargı direnci, akım, ısıl sınırlar ve uygulama süresine bağlıdır.','Kartta DC enjeksiyon kaynağı, sargı direnci ölçümü, fren akımı veya hesap parametreleri bulunmadığından sayısal enjeksiyon gerilimi hesaplanamaz.'],
 ['06','MISSING_STAR_DELTA_BRAKE_TRANSFER','Yıldız–üçgen yol verilen bir motorda durdurma sonrası dinamik frenleme ayrı kumanda, kontaktör kilidi ve uygulama süresi gerektirir.','Kayıtlı devre yalnız START, yıldız–üçgen geçişi ve STOP ile enerjiyi kesmeyi gösterir; dinamik frenlemeye geçiş yolu yoktur.'],
 ['07','MISSING_AUTOMATIC_BRAKE','Otomatik frenlemede hareketin durdurulması ayrı fren algısı/komutu ve frenleme kontrolünün zaman ya da durum geçişini gerektirir.','Şemada otomatik fren kontaktörü ya da fren algılama durumu bulunmaz; otomatik olan yıldız–üçgen geçişidir.'],
 ['08','MISSING_TIMED_BRAKE','Zaman ayarlı frenlemede zamanlayıcı motor besleme kontaktöründen bağımsız frenleme durumunu belirlemelidir.','Mevcut zaman rölesi yalnız yıldızdan üçgene geçişi yönetir; frenleme zamanlayıcısı veya ölçülen durma süresi değildir.']
];
for(const [suffix,issue,concept,limitation] of mq07BrakingScope156to163){
 const id='motor-braking-src-'+suffix,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='wiring'||lesson.project?.wires?.length!==38||
    !lesson.project.components.some(c=>c.typeId==='motor-y-d')||
    !lesson.project.components.some(c=>c.typeId==='coil-delay-on')||
    lesson.project.components.some(c=>c.typeId==='supply-dc-plus'||c.typeId==='tutorial-mechanical-brake'))
   throw Error('MQ07 SC156–163 original braking source changed '+id);
 // All eight brake lesson titles differ from a START/Y-Delta operation.
 // The native model lacks brake torque and DC injection. A genuine topic
 // reference, not fictitious live brake wires, is the correct lesson here.
 const conceptual=true;
 mq07RepairBrakeReference(lesson,suffix);
 lesson.summary=concept+(conceptual?
  ' İlgili frenleme ürünleri doğru türde kavram kartıdır; kablolu frenleme simülasyonu değildir.':
  ' Ekrandaki canlı yıldız–üçgen devresi başlıktaki frenleme işlemini gerçekleştirmez.');
 lesson.explanation=concept+' '+(conceptual?
  'Gösterilen fren, motor ve ölçüm malzemeleri başlığa uygun referanslardır; gerçek fren torku, fren bobini veya DC enjeksiyon kablosu yoktur. ':
  'Yıldız–üçgen START, geçiş ve STOP devresi fren sistemi değildir. ')+
  (conceptual?'Katalogdaki elemanların işlev sınırı önemlidir. ':limitation+' ')+
  'Frenleme süreci ve fiziksel şebeke güvenliği doğrulanmamıştır.';
 lesson.learningGoal=concept+' Gösterilen ürünün gerçek terminali ile desteklenmeyen frenleme işlemini ayırt etmek.';
 lesson.beginnerSteps=conceptual?[
  'Frenleme, motor ve ölçüm/kumanda ürünlerinin gerçek katalog türlerini karşılaştır.',
  'Bu kartın kablosuz kavramsal referans olduğunu, fren hareketinin simüle edilmediğini doğrula.',
  limitation,
  'Fren momenti, kalkış/duruş güvenliği veya DC enjeksiyon sonucu olmadan PASS verme.'
 ]:[
  'Üç faz besleme, yıldız ve üçgen kontaktörlerini ayırt et.',
  'Sanal START, geçiş zamanı ve STOP tepkilerini yalnız yol verme grafiği üzerinde incele.',
  limitation,
  'Frenleme momenti ve durma süresi ölçülmediği için frenlemeye PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07MotorScope:'SC156_SC163',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:
    ('BRAKE_REFERENCE_NATIVE_PENDING_'+suffix),brakingAcceptance:false,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
 // Specific conceptual questions replace the generic motor START quiz,
 // while making no promise that a motor was electrically braked.
 const question={
  '03':['Yıldız bağlantılı motorun frenlendiği nasıl kanıtlanır?',
    'Ayrı frenleme enerjisi ve motorun durma davranışı doğrulanarak',
    'Sadece yıldız kontaktörü çekince','START lambası yandığında',
    'Yıldız bağlantısı tek başına dinamik frenleme değildir.'],
  '04':['Üçgen yol verme devresi neden tek başına dinamik fren değildir?',
    'Ayrı kontrollü frenleme işlevi ve enerjiyi kesme koşulları olmadığı için',
    'Üçgen motorlarda fren gerekmediği için','Nötr her zaman takılı olduğu için',
    'Motoru çalıştırmak ve fren momenti üretmek iki ayrı fiziksel işlemdir.'],
  '06':['Yıldız–üçgen motoru frenlemeye geçirmek için hangisi ayrıca doğrulanmalıdır?',
    'Yol verme ile frenleme durumlarının ayrı kontrol edilmesi',
    'Yalnız yıldız zaman rölesinin çalışması','STOP butonunun renginin değişmesi',
    'Kalkış zamanlayıcısı frenleme zamanlayıcısının yerini almaz.'],
  '07':['Otomatik frenleme öğretiminde yalnız STOP komutu yeterli midir?',
    'Hayır, frenin durumu ve etkisi ayrıca doğrulanmalıdır',
    'Evet, her STOP fren torku üretir','Evet, START bırakılınca rotor anında durur',
    'Elektrik beslemesini kesmek frenin etkinliğini tek başına kanıtlamaz.'],
  '08':['Zaman rölesinin bulunması fren süresini doğrudan kanıtlar mı?',
    'Hayır, fren hareketi veya etkinliği ayrıca modellenmeli ya da ölçülmelidir',
    'Evet, motor her zaman ayar süresinde durur','Evet, süre akımdan bağımsızdır',
    'Zaman koşulu, motorun gerçek yavaşlaması veya durma süresi değildir.']
 }[suffix];
 if(question)lesson.quiz={question:question[0],
  options:[question[1],question[2],question[3]],answer:0,why:question[4]};
}


/* MQ07 real motor lesson content: use existing golden-derived circuit
   templates only for scoped lesson clones, never mutate source exemplars. */
function mq07ReplaceMotorLesson(lesson,source,kind){
 const p=clone(source);
 if(kind==='wiring'&&!p.wires.length||kind==='quiz'&&(p.wires.length||!p.referenceOnly))
  throw Error('MQ07 replacement has wrong source type');
 setLesson(lesson,p,{kind,quiz:lesson.quiz});
}
function mq07SecondStationDOL(lesson){
 const p=lesson.project;
 if(p.wires.length!==13||!p.components.some(c=>c.id==='start'&&c.typeId==='push-no')||
    !p.components.some(c=>c.id==='stop'&&c.typeId==='push-nc')||
    !p.components.some(c=>c.id==='hold'&&c.typeId==='contact-no'))
  throw Error('SC132 DOL baseline changed');
 for(const target of ['start','hold']){
  const i=p.wires.findIndex(w=>w.from?.c==='stop'&&w.from.p==='22'&&
   w.to?.c===target&&w.to.p==='13');
  if(i<0)throw Error('SC132 original STOP branch missing '+target);
  p.wires.splice(i,1);
 }
 const stop2=C('stop2','push-nc',260,760,'S2','İkinci merkez STOP',{
  tutorialPurpose:'İki NC STOP seri bağlıdır; herhangi bir STOP iki merkezden K1 enerjisini keser.'});
 const start2=C('start2','push-no',490,760,'S3','İkinci merkez START',{
  tutorialPurpose:'S1 ile paralel START; ikinci merkez K1 bobinini başlatabilir.'});
 const added=[
  W('stop','22','stop2','21','S0/22 → S2/21','İkinci NC STOP seri kontrol zinciridir.','#e53935','L1'),
  W('stop2','22','start','13','S2/22 → S1/13','Birinci START iki STOP sonrasında beslenir.','#e53935','L1'),
  W('stop2','22','hold','13','S2/22 → K1/13','Mühürleme iki STOP üzerinden beslenir.','#e53935','L1'),
  W('stop2','22','start2','13','S2/22 → S3/13','İkinci START paralel kontrol koludur.','#e53935','L1'),
  W('start2','14','coil','A1','S3/14 → K1/A1','İkinci START K1 bobinine bağlanır.','#e53935','L1')
 ];
 p.components.push(stop2,start2);p.wires.push(...added);
 lesson.materials.push(...materialRows({components:[stop2,start2]}));
 lesson.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 if(p.wires.length!==16||p.components.filter(c=>c.typeId==='push-no').length!==2||
    p.components.filter(c=>c.typeId==='push-nc').length!==2)
  throw Error('SC132 two-center terminal graph mismatch');
}
function mq07DirectMotorContent(lesson,suffix){
 const sourceId=suffix==='02'?'motor-star-delta-1':
  suffix==='03'?'motor-forward-reverse-1':null;
 if(sourceId){
  const source=L.byId[sourceId]?.project;
  if(!source?.wires?.length)throw Error('Missing source motor graph '+sourceId);
  mq07ReplaceMotorLesson(lesson,source,'wiring');
 }else if(suffix==='07')mq07SecondStationDOL(lesson);
}
function mq07StartMotorContent(lesson,suffix){
 if(suffix==='12'){
  const source=L.byId['motor-star-delta-2']?.project;
  if(!source?.wires?.length||!source.components.some(c=>c.typeId==='coil-delay-on'))
   throw Error('Missing proven star/delta timer circuit');
  mq07ReplaceMotorLesson(lesson,source,'wiring');
 }
 if(suffix==='06')mq07ReplaceMotorLesson(lesson,topicBoard(lesson.id,lesson.title,[
  ['supply-3p','Üç faz besleme'],['resistor','L1 kalkış direnci'],
  ['resistor','L2 kalkış direnci'],['resistor','L3 kalkış direnci'],
  ['main-contact','K1 direnç bypass kontaktörü'],['motor-3p','M1 üç faz motor']
 ]),'quiz');
 if(suffix==='11')mq07ReplaceMotorLesson(lesson,topicBoard(lesson.id,lesson.title,[
  ['supply-3p','Üç faz şebeke'],['meter-ammeter','Kalkış akımı ölçüm cihazı'],
  ['motor-3p','M1 üç faz motor'],['overload','F1 termik koruma']
 ]),'quiz');
}
/* MQ07_SC144_SC155_START_SPEED: truthful reference/solver scope without modifying canonical wires. */
const mq07StartSpeedScope144to155=[
 ['01',null,'Paket şalter konumları 0, YILDIZ ve ÜÇGEN olarak seçilir; kayıtlı altı uçlu motor bu konumlarla sınanabilir.','Paket şalterli yıldız/üçgen seçimi Node modelinde doğrulanabilir; güvenlik, gerçek kalkış akımı ve mekanik performans ölçülmemiştir.'],
 ['02',null,'START ile ana kontaktör ve yıldız kontaktörü etkinleşir, zaman rölesinin ardından yıldız açılıp üçgen devreye girer.','Zaman geçişi ve karşılıklı kilitleme Node durumlarında görülebilir; fiziksel kontaktör mekanik kilidi veya gerçek şebeke uygunluğu kanıtı değildir.'],
 ['03',null,'Otomatik yıldız–üçgen devresinde mühürleme, zaman rölesi, karşılıklı NC kilitleme ve iki durum lambası vardır.','Dersin iki kontaktörlü durum değişimi, ortak besleme ve STOP tepkisi Node ile sınanabilir; gerçek kalkış akımı ve fiziksel güvenlik ayrı kabul ister.'],
 ['04','NO_WIRED_CIRCUIT','Soft starter, kontrollü kalkış gerilimi/akımı için uygun bir güç elektroniği sürücüsüdür.','Bu kartta yalnız ürün referansları bulunur; besleme, motor ve kumanda kablosu ya da rampa/akım simülasyonu yoktur.'],
 ['05','NO_WIRED_CIRCUIT','Ototransformatör ile yol verme, kalkışta motora azaltılmış gerilim uygulamak için uygun güç ve geçiş yolu gerektirir.','Ototransformatör/motor malzemeleri listelenir; kademeli çıkış, bypass, kumanda veya akım ölçümü kurulu değildir.'],
 ['06','MISSING_SERIES_START_RESISTORS','Dirençle yol verme, başlangıçta motor besleme yolunda seri güç dirençleri ve daha sonra dirençlerin devreden çıkarıldığı bir anahtarlama yolu gerektirir.','Kaydedilmiş devre seri kalkış direnci içermez; yıldız–üçgen kontaktör/zaman rölesi devresi vardır. Dirençle yol verme başarılı kabul edilemez.'],
 ['07','NO_WIRED_CIRCUIT','Dahlander motorun düşük devir çalışması sargı bağlantısı ve kutup sayısı değişimine bağlıdır.','Kart kablosuzdur; gösterilen Dahlander motorun gerçek düşük devir uçları, kontaktör ve güç devresi bağlanmamıştır.'],
 ['08','NO_WIRED_CIRCUIT','Dahlander motorun yüksek devir çalışması uygun farklı sargı/kutup düzeni ve kilitli geçiş gerektirir.','Kart kablosuzdur; yüksek devir kontaktör bağlantısı ve ölçülmüş hız bulunmaz.'],
 ['09','NO_WIRED_CIRCUIT','Dahlander düşükten yükseğe zaman ayarlı geçişi için ayrı kontaktör yolları, zaman rölesi ve geçiş kilitlemesi gerekir.','Kartta gerçek timer, kontak kablosu ve düşük–yüksek geçiş dizisi bulunmaz.'],
 ['10','NO_WIRED_CIRCUIT','Dahlander ileri/geri ve iki hız kontrolü, yön kontaktörleri ile hız kontaktörlerinin karşılıklı kilitlenmesini gerektirir.','Bu kart referanstır; yön değiştiren veya hız seçen güç ve kumanda kabloları bulunmaz.'],
 ['11','MISSING_STARTING_CURRENT_MEASUREMENT','Kalkış akımının şebekeye etkisi değerlendirilirken kalkış anındaki akım, gerilim düşümü ve zamana bağlı motor yükü ölçülmelidir.','Kayıtlı devre ileri/geri motor kontaktörlerini gösterir; akım sensörü, kalkış akımı eğrisi veya şebeke gerilim düşümü modeli bulunmaz.'],
 ['12','MISSING_STAR_TIMER_SELECTION','Yıldız çalışma süresinin seçilmesi, yıldızdan üçgene geçiş süresi ve motorun hızlanma koşullarının birlikte değerlendirilmesini gerektirir.','Kayıtlı devre ileri/geri kontaktör bağlantılarıdır; yıldız kontaktörü, üçgen kontaktörü veya ayarlanabilir geçiş timerı bulunmaz.']
];
for(const [suffix,issue,concept,limitation] of mq07StartSpeedScope144to155){
 const id='motor-start-speed-src-'+suffix,lesson=L.byId[id];
 if(!lesson)throw Error('MQ07 SC144–155 missing '+id);
 const i=Number(suffix),oldRef=[4,5,7,8,9,10].includes(i);
 if((lesson.kind==='quiz')!==oldRef||(lesson.project.wires.length===0)!==oldRef)
  throw Error('MQ07 SC144–155 original lesson scope drifted '+id);
 if(['06','11','12'].includes(suffix))mq07StartMotorContent(lesson,suffix);
 const isRef=[4,5,6,7,8,9,10,11].includes(i),p=lesson.project;
 if((lesson.kind==='quiz')!==isRef||(p.wires.length===0)!==isRef)
  throw Error('MQ07 SC144–155 content repair result drifted '+id);
 const pending=suffix==='12'?'STAR_DELTA_TIME_SELECTION_NATIVE_PENDING':
  suffix==='06'?'RESISTOR_START_MODEL_NOT_AVAILABLE':
  suffix==='11'?'STARTING_CURRENT_MODEL_NOT_AVAILABLE':issue;
 const actual=suffix==='12'?
  'Altı terminalli motor, NC kilitli yıldız ve üçgen kontaktörleri ve seçilebilir gecikmesi olan zaman rölesi bağlanmıştır. Uygun zamanın yükte seçimi veya gerçek akım doğrulanmamıştır.':
  suffix==='06'?
  'Üç faz kalkış direnci ve bypass kontaktörü yalnız katalog referansıdır; üç faz başlangıç akımı ve direncin anahtarlama hesabı çözümlenmez.':
  suffix==='11'?
  'Motor, ampermetre, termik ve şebeke gerçek ürün kartlarıdır; motor kalkış akımı/gerilim çökmesi eğrisi simüle edilmemektedir.':limitation;
 lesson.summary=concept+' '+(suffix==='12'?'Gerçek zaman röleli bağlantı çizilmiştir.':'Kaynak kapsamı ayrıca belirtilir.');
 lesson.explanation=concept+' '+actual+' Gerçek şebeke veya fiziksel motor güvenliği bu derste kabul edilmemiştir.';
 lesson.learningGoal=concept+' Gösterilen gerçek terminalleri, hesaplanamayan fiziksel büyüklüklerden ayırabilmek.';
 lesson.beginnerSteps=['Gösterilen ürünleri ve bağlı terminal sayılarını kontrol et.',concept,limitation,
  'Eksik donanım veya gerçek ölçüm yerine yalnız açıklamadan elektriksel PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07MotorScope:'SC144_SC155',
  titleTopologyStatus:pending?'REVIEW':'SOURCE_ALIGNED',titleTopologyIssue:pending,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
}


/* MQ07_SC126_SC143_MOTOR: no replacement of canonical project wires or products.
 * Distinguish a shared DOL sample from a working lesson-specific function.
 * A stable numerical result does not prove physical safety or title coverage. */
const mq07MotorScope126to143=[
 ['01','DOL_SAMPLE_NOT_MOTOR_NAMEPLATE','Motor etiketi için anma gerilimi, güç, frekans, yıldız/üçgen tanımı ve altı uçlu klemens kutusu gerekir.','Ekrandaki gerçek devre STOP/START/kontaktör ve U/V/W uçlu üç faz motoruyla doğrudan yol verme örneğidir; motor etiketi veya altı uçlu klemens şeması değildir.'],
 ['02','MISSING_SIX_TERMINAL_STAR_DELTA','Yıldız bağlantıda U2/V2/W2 ortak, üçgende sargı uçları çapraz köprülenir; etiket gerilimi bağlantıyı belirler.','Bu kartta yalnız U/V/W uçlu motor ve DOL kontaktör vardır; U1/V1/W1/U2/V2/W2 klemensleri ve köprüleri bulunmaz.'],
 ['03','MISSING_PHASE_SEQUENCE_CHANGE','Üç faz motorun yönü, uygulanan faz sırasının değişmesine bağlıdır.','Burada fazları yer değiştiren yön kontrol yolu yoktur: tek kontaktörlü DOL örneği aynı faz sırasını korur.'],
 ['04',null,'Kesik çalıştırmada START basılıyken bobin ve motor etkin, START bırakıldığında her ikisi pasif olmalıdır.','Sanal devrede mühürleme kontağı bulunmaz; gerçek Node START bas/bırak testiyle davranış sınanır.'],
 ['05',null,'Sürekli çalıştırmada START geçici basıldıktan sonra mühürleme yardımcı kontağı bobini enerjili tutar; STOP bu durumu sıfırlar.','Bu örnek START, STOP ve hold yardımcı kontağıyla DOL mühürleme davranışını gösterir; gerçek motor koruma donanımı kapsam dışında kalır.'],
 ['06','MISSING_JOG_RUN_SELECTOR','Kesik/sürekli kip seçimi için mühürlemeyi devreye alan veya atlayan ayrı kip kumandası gerekir.','Kartta yalnız mühürlemeli DOL devresi vardır; kesik çalışma için gerekli mod seçimi ve bypass yolu yoktur.'],
 ['07','MISSING_SECOND_CONTROL_STATION','Birden fazla kumanda merkezinde START komutları uygun paralel, STOP komutları güvenli seri kontrol mantığında birleştirilir.','Kartta ikinci merkez/ikinci START/STOP bileşenleri yoktur; yalnız tek merkezli DOL gösterilir.'],
 ['08','MISSING_PACKAGE_SWITCH','Paket şalter ile kontrol, şalterin ayrı kontak ve anahtarlama durumlarını gerektirir.','Kartta paket şalter bulunmaz; START/STOP ve kontaktörlü DOL örneği gösterilir.'],
 ['09','MISSING_ON_DELAY_RELAY','Düz zaman rölesinin zamanlama ve kontak davranışı, seçilen gecikme ve bağlantıya göre sınanmalıdır.','Bu devrede zaman rölesi veya gecikmeli kontak yoktur; DOL START/STOP örneği zaman ayarlı durdurma kanıtı değildir.'],
 ['10','MISSING_OFF_DELAY_RELAY','Ters zaman/gecikmeli bırakma için ayrı zamanlayıcı/kontak davranışı ve durdurma dizisi gerekir.','Kartta zaman rölesi ve zaman gecikmeli bırakma yolu yoktur; DOL devresinin anlık STOP sonucu gecikme kanıtı değildir.'],
 ['11','MISSING_SPEED_CONTROL','İki yönlü motor kumandasında çapraz kilitleme ve iki sınır NC kontağı bulunur.','Kart ileri/geri kontaktörlerinin yön ve sınır durdurma mantığını gösterir; farklı motor devir hızı/tek başına otomatik ters dönüş kanıtlanmaz.'],
 ['12','MISSING_SINGLE_BUTTON_TOGGLE','Tek butonla aç/kapa hafıza veya darbe rölesi gibi durum saklayan mantık gerektirir.','Kartta ayrı START ve STOP butonları bulunur; tek butonlu toggle devresi değildir.'],
 ['13','MISSING_PROTECTION_RELAY','Koruma rölesiyle motor çalıştırmada gerçek koruma algısı ve açtırma kontak yolu doğrulanmalıdır.','Bu kartta ayrı koruma rölesi yer almaz; yalnız kontaktörlü DOL devresi vardır.'],
 ['14',null,'Sağ/sol kontrol iki kontaktör, karşılıklı NC kilitleme ve karşı yönde iki fazın yer değiştirmesiyle temsil edilir.','Sanal devrenin yön geçişini ve iki bobinin aynı anda etkin olmamasını gerçek Node çözümüyle doğrula.'],
 ['15','MISSING_OVERLOAD_RELAY','Termik aşırı akım koruması için gerçek motor termiği ve yardımcı NC kesme yolu gereklidir.','Kartta termik aşırı akım rölesi veya aşırı yük tetik simülasyonu bulunmaz; yalnız DOL yol verme örneğidir.'],
 ['16','MISSING_PHASE_MONITOR','Faz sırası/faz kaybı rölesi üç faz girişlerini ve güvenlik çıkışını izlemelidir.','Kartta faz koruma veya faz sırası izleme rölesi bulunmaz; üç faz motorun bağlı olması faz izleme testi değildir.'],
 ['17','MISSING_AUTOMATIC_RETURN','İleri/geri yön kilitlemesi ve iki NC sınır anahtarı ilgili yönde hareketi durdurabilir.','Sınır anahtarına basınca ilgili bobin açılır; otomatik ters yönde yeniden başlatan yol veya PLC dizisi bu kartta kurulmamıştır.'],
 ['18','PLC_PROGRAM_NOT_VALIDATED','PLC-kontaktör güç katında PLC çıkışı bobine bağlanırken PLC giriş/çıkış programının çalışması ayrı kanıt ister.','PLC, START/STOP, kontaktör ve güç katı bağlıdır; gerçek PLC programı/komut dizisi kabul edilmeden otomatik motor çalışması PASS sayılamaz.']
];
for(const [suffix,issue,concept,limitation] of mq07MotorScope126to143){
 const id='motor-direct-power-src-'+suffix,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='wiring'||!lesson.project?.wires?.length||!lesson.project.components.some(c=>c.typeId==='motor-3p'))
  throw Error('MQ07 SC126–143 motor graph unexpectedly changed: '+id);
 if(['02','03','07'].includes(suffix))mq07DirectMotorContent(lesson,suffix);
 const p=lesson.project;
 const actual=p.components.some(c=>c.id==='mainF')?'iki kontaktörlü ileri/geri':
  p.components.some(c=>c.typeId==='motor-y-d')?'altı terminalli yıldız–üçgen':
  p.components.some(c=>c.id==='start2')?'iki merkezli seri STOP/paralel START':
  p.components.some(c=>c.id==='plc')?'PLC kontaktör güç':'tek kontaktörlü DOL';
 const fixed=suffix==='02'||suffix==='03'||suffix==='07';
 const pending=suffix==='02'?'SIX_TERMINAL_STAR_DELTA_NATIVE_PENDING':
  suffix==='03'?'PHASE_REVERSAL_NATIVE_PENDING':
  suffix==='07'?'TWO_STATION_NATIVE_PENDING':issue;
 const note=suffix==='02'?
  'Gerçek altı terminalli motor, yıldız ve üçgen konumları olan paket şalteriyle katalog uçlarından bağlanmıştır.':
  suffix==='03'?
  'Gerçek iki kontaktörlü karşılıklı kilitli ileri–geri güç yolunda iki faz yer değiştirir.':
  suffix==='07'?
  'İkinci NC STOP seri, ikinci NO START paralel eklenerek K1 mühürleme her iki kumanda merkezinden denetlenir.':limitation;
 lesson.summary=concept+' Bu sayfadaki kayıtlı devre '+actual+' örneğidir.';
 lesson.explanation=concept+' '+note+' Fiziksel motor, gerçek şebeke veya güvenlik uygunluğu bu dersle doğrulanmış değildir.';
 lesson.learningGoal=concept+' Gösterilen devrenin desteklediği işlev ile başlıktaki ek işlevleri doğru ayırabilmek.';
 lesson.beginnerSteps=['Önce ekrandaki gerçek motor/kontaktör/buton ürünlerini belirle.',
  'Sanal bağlantıların hangi işlevi desteklediğini kontrol et: '+actual+'.',
  limitation,
  'Sadece gerçek Node çıktısıyla çalışmayı yorumla; eksik başlık işlevine veya fiziksel kuruluma PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07MotorScope:'SC126_SC143',
  titleTopologyStatus:pending?'REVIEW':'SOURCE_ALIGNED',titleTopologyIssue:pending,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
}


/* MQ07_SC110_SC125_ARDUINO_SCOPE: source-grounded virtual lesson references, not working firmware. */
const mq07ArduinoScope110to125=[
 ['01','arduino-led','Dijital LED çıkışı: Arduino UNO dijital çıkışı, seri 220 Ω direnç üzerinden LED akımını sınırlar.','pinMode(çıkış, OUTPUT) ve digitalWrite(HIGH/LOW) kavramsal komutlardır; LED polaritesi, seri direnç ve ortak GND gerçek bağlantıda gerekir.'],
 ['02','arduino-button','Buton girişi: digitalRead dijital giriş seviyesini okur.','INPUT_PULLUP seçildiğinde basılmayan düğme HIGH, GND’ye basılan düğme LOW okunur; mekanik sıçrama (debounce) ayrıca ele alınmalıdır.'],
 ['03','arduino-ldr','LDR ile ışık algılama: ışıkla değişen direnç analog gerilim bölücüyle okunur.','LDR tek başına sabit bir dijital seviye üretmez; ek direnç, UNO analog girişi ve yazılımsal eşik gereklidir. LED çıkış yolu bu kartta bağlı değildir.'],
 ['04','arduino-hcsr04','HC-SR04 mesafe algılama: TRIG darbesi başlatır, ECHO yüksek darbe süresi yankının gidiş-dönüş süresidir.','Yaklaşık mesafe = ses hızı × ECHO süresi / 2; buzzer kontrolü için eşik, GND ve yazılım gerekir; bu kartta mesafe ölçülmez.'],
 ['05','adc0804lcn','Arduino UNO potansiyometre ADC: A0 üzerindeki gerilim, UNO dahili ADC ve analogRead ile örneklenir.','Varsayılan UNO 10-bit okuma 0–1023 aralığındadır; kartta görülen ADC0804 harici 8-bit entegredir ve UNO’nun dahili ADC birimi değildir. Vref ve bağlantı test edilmemiştir.'],
 ['06','arduino-led','PWM ile LED: analogWrite uygun UNO PWM pininde darbe doluluk oranını değiştirir.','0–255 PWM değeri doğrudan sürekli analog gerilim veya ölçülmüş parlaklık değildir; ayrı LED ve dirençler gösterim amaçlıdır, bağlı değildir.'],
 ['07','arduino-l298n','PWM ile DC motor: Arduino PWM sinyali L298N etkinleştirme girişine, yön sinyalleri sürücü kontrol girişlerine gider.','Motor akımı UNO pininden doğrudan sağlanmaz; ayrı uygun motor beslemesi, ortak GND ve gerçek sürücü bağlantısı gerekir; hız ölçülmemiştir.'],
 ['08','arduino-servo-sg90','SG90 servo: komut açısı, servo denetim darbeleriyle belirlenir.','Servo için güç/GND/sinyal hatları gerekir; hedef açıyı göndermek gerçek mekanik açı ölçümü değildir ve bu kartta hareket simüle edilmez.'],
 ['09','arduino-cd4511','CD4511 BCD→7 segment sürücüdür; dört bitlik kod çözülerek uygun ortak katotlu göstergede segmentler sürülür.','Segment akım sınırlama dirençleri, BCD girişleri, latch/blank/test uçları ve ortak uç bağlantısı kartta kurulmamıştır.'],
 ['10','arduino-oled-i2c','I2C OLED: Arduino UNO R3 üzerinde SDA=A4, SCL=A5 kullanılır; ekran ayrıca besleme ve GND ister.','Kart OLED örneği gösterir, LCD1602 modülü değildir; görünen ayrı LED ve 220 Ω direnç OLED’in I2C veya arka aydınlatma bağlantısı değildir. I2C veri aktarımı yapılmamıştır.'],
 ['11','arduino-dht11','DHT11 sıcaklık ve nem verisini tek dijital veri hattı üzerinden zamanlamalı protokolle iletir.','DHT11 normal I2C sensörü değildir; uygun besleme, GND ve modüle göre pull-up gerekir. Bu kartta gerçek sıcaklık/nem okuması bulunmaz.'],
 ['12','arduino-hx711','Tartım: strain-gauge köprü yük hücresi çok küçük fark gerilimi üretir; HX711 bunu sayısallaştırır.','HX711 DT/SCK arayüzü, uygun köprü beslemesi, dara ve bilinen kütleyle kalibrasyon olmadan gerçek kilogram çıktısı doğrulanamaz.'],
 ['13','arduino-rotary-encoder','KY-040 rotary enkoderin A/B faz dizisi dönüş yönü ve adım sayımına yardımcı olur.','Saat yönü/ters yön için A ve B kenar sırası izlenir, kontak sıçraması değerlendirilir; kartta gerçek sayma yoktur.'],
 ['14','arduino-hc05','HC-05, Arduino UART TX/RX ile seri Bluetooth veri köprüsü oluşturabilir.','TX↔RX çapraz seri bağlantı, ortak GND ve modüle uygun RX lojik seviye koruması gereklidir. Eşleştirme veya gerçek kablosuz haberleşme simüle edilmez.'],
 ['15','arduino-oled-i2c','I2C çevre birimi örneğinde UNO R3 SDA=A4, SCL=A5 ile OLED modülün SDA/SCL uçları eşleşir.','Çevre biriminin VCC ve GND bağlantısı, adres seçimi ve modüle uygun lojik seviyeler gerekir. Bu referans kartında I2C kabloları ve gerçek veri aktarımı yoktur.'],
 ['16','arduino-lm35','LM35 analog sıcaklık sensörü yaklaşık 10 mV/°C ölçekli analog çıkış üretir.','UNO analog girişi bu gerilimi okur; seçilen ADC referansı ve eşik/histerezis mantığı olmadan tam sıcaklık veya çıkış durumu ölçümü yapılmış sayılmaz.']
];
for(const [suffix,chip,concept,limitations] of mq07ArduinoScope110to125){
 const id='microcontroller-apps-src-'+suffix,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='quiz'||(lesson.project?.wires||[]).length||(suffix!=='15'&&!lesson.project.components.some(c=>c.typeId===chip)))
   throw Error('MQ07 SC110–125 Arduino reference mismatch '+id);
 if(suffix==='05'){
   const external=lesson.project.components.find(c=>c.typeId==='adc0804lcn');
   if(!external||external.label!=='UNO içindeki ADC işlevi')throw Error('SC114 unexpected ADC label');
   const material=(lesson.materials||[]).find(m=>m.componentId===external.id);
   if(!material||material.typeId!==external.typeId||material.label!==external.label)
    throw Error('SC114 external ADC material baseline changed');
   // Both the physical component caption and its learner-facing material row
   // must identify ADC0804 as an EXTERNAL 8-bit IC, not the UNO's internal ADC.
   external.label='ADC0804 — harici ADC (UNO dahili ADC değildir)';
   material.label=external.label;
   material.why='ADC0804 bağımsız harici 8-bit analog-sayısal dönüştürücü entegredir; UNO analogRead işlevi ise mikrodenetleyicinin dahili 10-bit ADC birimini kullanır. Karttaki ADC0804 için besleme, referans ve bağlantılar kurulmadığından gerçek bir dönüşüm ölçülmemiştir.';
 }
 if(suffix==='15'){
   if(lesson.project.components.length!==1||lesson.project.components[0].typeId!=='arduino-uno')throw Error('SC124 I2C board baseline changed');
   const uno=lesson.project.components[0],oldMaterials=lesson.materials||[];
   if(oldMaterials.length!==1||oldMaterials[0].componentId!==uno.id||oldMaterials[0].typeId!==uno.typeId)
    throw Error('SC124 UNO material baseline changed');
   const oled={id:'pg1',typeId:'arduino-oled-i2c',x:350,y:170,rotation:0,ref:'X2',label:'I2C OLED çevre birimi',state:false,address:'',note:''};
   lesson.project.components.push(oled);
   // This is a genuine second reference component. Preserve the UNO explanation,
   // and give OLED its own truthful material description (no invented I2C wiring).
   lesson.materials.push({componentId:oled.id,typeId:oled.typeId,label:oled.label,
    why:'I2C OLED çevre birimi, Arduino UNO ile SDA/SCL veri ve saat hatları üzerinden haberleşen ekranın referans modelidir; bu kartta hatlar, besleme ve çalışan veri aktarımı bağlı değildir.'});
   lesson.pedagogyReview.componentIds=['arduino-uno','arduino-oled-i2c'];
 }
 lesson.summary=concept+' Bu ders kablosuz kavram ve ürün referansıdır.';
 lesson.explanation=concept+' '+limitations+' Bu kartta gerçek kablo bağlantısı, çalışan Arduino programı veya ölçülmüş çıktı yoktur.';
 lesson.learningGoal=concept+' '+limitations;
 lesson.beginnerSteps=['Arduino UNO ve gerçek ürünün görevini karşılaştır.','İlgili pin/protokol kavramını oku: '+concept,limitations,'Gerçek kablo, program ve ölçüm kanıtı bulunmadan elektriksel PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',semanticNarrativeAdded:true,titleTopologyStatus:'REVIEW',titleTopologyIssue:'NO_WIRED_CIRCUIT',terminalGrounded:false,physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
}


/* MQ07_SC98_SC109_SEQUENTIAL: exact IC behavior; these are not wired simulations. */
const mq07SequentialReference98to109=[
 ['01','sn74hc00n','RS mandalı iki NAND kapısının çapraz geri beslemesiyle kurulur; karttaki SN74HC00N tek başına hazır bir flip-flop değildir.','Aktif-düşük /S,/R için 11→önceki Q korunur, 01→Q=1 (SET), 10→Q=0 (RESET), 00→yasak/belirsiz; besleme ve bağlantı kurulmamıştır.'],
 ['02','cd4027be','CD4027BE JK flip-flop saat kontrollü durum saklar.','Etkin saat olayında JK=00→koru, 01→RESET, 10→SET, 11→TOGGLE; doğrudan SET/RESET uçları ayrıca değerlendirilmelidir.'],
 ['03','sn74hc74n','SN74HC74N pozitif saat kenarında D bilgisini Q çıkışına aktaran D flip-floptur.','Pozitif CLK kenarında Q(n+1)=D, diğer zamanlarda Q korunur; /PRE ve /CLR aktif-düşük asenkron girişlerdir.'],
 ['04','cd4027be','T davranışı, CD4027BE JK flip-flopun J=K=T bağlanmasıyla elde edilebilir; ürün ayrı bir T flip-flop değildir.','Etkin saat olayında T=0→Q korunur, T=1→Q terslenir; J/K bağları ve saat kablolanmadan toggle simülasyonu yoktur.'],
 ['05','arduino-cd4017','Asenkron yukarı sayıcıda taşıma bir kademeden sonraki kademeye geçer; farklı flip-flopların saatleri aynı anda tetiklenmez.','Kartta gösterilen CD4017 çözümlenmiş on çıkışlı Johnson sayaçtır, asenkron ikili ripple sayaç değildir; burada çalışan 3-bit asenkron zincir yoktur.'],
 ['06','arduino-cd4017','Senkron ikili yukarı sayaçta tüm flip-floplar ortak saat alır ve sonraki durum mantığı aynı saat kenarında güncellenir.','Gösterilen CD4017 Johnson/on çıkışlı sayaçtır; 3-bit senkron ikili up-counter bağlantısı bu kartta kurulmamıştır.'],
 ['07','arduino-cd4017','Johnson sayacı terslenmiş son kademe bitini ilk kademeye geri besleyen kaydırma dizisidir.','CD4017 iç mimarisi Johnson sayıcı ve çözülmüş Q0–Q9 çıkışları kullanır; burada clock/reset kablolanmamıştır.'],
 ['08','arduino-cd4017','CD4017, uygun saat ve reset ile Q0–Q9 arasında sırayla seçili çıkış üretir.','On sayımda sıfıra dönen mod-10 çıkış dizisiyle, dört bit BCD sayaç durumlarını birbirine karıştırma; kartta gerçek clock kablosu yoktur.'],
 ['09','arduino-cd4017','Halka sayıcıda tek etkin bit kaydırma kayıtları arasında dolaşır; Johnson sayaçta ise ters geri besleme kullanılır.','CD4017 iç yapısı Johnson sayacıdır, Q0–Q9 çıkışları tek etkin çıkış şeklinde kod çözülür; bu kartta ayrı halka sayaç bağlantısı yoktur.'],
 ['10','arduino-74hc595','74HC595 seri girişli sekiz bit kaydırmalı register ve ayrıca çıkış tutma/latch katı içerir.','SER verisi SHCP/SRCLK kenarında kaydırılır, STCP/RCLK kenarında çıkış latchine aktarılır; /OE etkinliği ayrı kontroldür.'],
 ['11','adc0804lcn','ADC0804LCN analog giriş seviyesini 8 bit dijital koda dönüştüren ADC entegresidir.','Referans, saat ve /WR–/RD dönüştürme/okuma uçları doğru bağlanmadan gerçek ölçüm ve sayısal dönüşüm doğrulanmış sayılamaz.'],
 ['12','dac0808lcn','DAC0808LCN dijital giriş koduna ve referans akımına göre analog akım çıkışı üretir.','Doğrudan hassas gerilim çıkışı varsayma; akım-gerilim dönüştürücü op-amp veya yük ağı, Vref ve gerçek bağlantılar bu kartta yoktur.']
];
for(const [suffix,chip,concept,table] of mq07SequentialReference98to109){
 const id='digital-sequential-apps-src-'+suffix,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='quiz'||(lesson.project?.wires||[]).length||
    !lesson.project.components.some(c=>c.typeId===chip))
   throw Error('MQ07 SC98–109 sequential reference mismatch '+id);
 lesson.summary=concept+' Bu kablosuz referans kartıdır.';
 lesson.explanation=concept+' '+table+' Çalışan lojik devre veya zaman diyagramı simüle edilmiş değildir.';
 lesson.learningGoal=concept+' '+table;
 lesson.beginnerSteps=[
  'Başlıktaki sıralı devreyi ve gösterilen entegreyi karşılaştır.',
  'Saat/etkinleştirme ve durum kuralını oku: '+table,
  'Gösterilen çipin devre başlığıyla hangi açılardan farklı olduğunu belirle.',
  'Gerçek bağlantı ve saat testi bulunmadığı için elektriksel PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',
  semanticNarrativeAdded:true,titleTopologyStatus:'REVIEW',
  titleTopologyIssue:'NO_WIRED_CIRCUIT',terminalGrounded:false,
  physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
}



/* MQ07_SC83_SC97_LOGIC: truthful digital truth-table reference lessons; no fabricated wires. */
const mq07LogicCases83to97=[
 ['01','sn74hc08n','İki girişli VE kapısı; Y=A∧B.','A B → Y: 00→0, 01→0, 10→0, 11→1.','Yalnız iki giriş de 1 ise çıkış 1 olur.'],
 ['02','sn74hc32n','İki girişli VEYA kapısı; Y=A∨B.','A B → Y: 00→0, 01→1, 10→1, 11→1.','Girişlerden en az biri 1 ise çıkış 1 olur.'],
 ['03','sn74hc04n','DEĞİL evirici kapısı; Y=¬A.','A → Y: 0→1, 1→0.','Girişin lojik seviyesinin tersini üretir.'],
 ['04','sn74hc125n','Üç durumlu BUFFER; çıkış etkinleştirmesi /OE aktiftir.','/OE=0 iken Y=A; /OE=1 iken Y=Z (yüksek empedans).','BUFFER yalnız etkinleştirildiğinde giriş seviyesini aktarır; Z lojik 0 değildir.'],
 ['05','sn74hc00n','İki girişli VE-DEĞİL kapısı; Y=¬(A∧B).','A B → Y: 00→1, 01→1, 10→1, 11→0.','Yalnız iki giriş de 1 iken çıkış 0 olur.'],
 ['06','sn74hc02n','İki girişli VEYA-DEĞİL kapısı; Y=¬(A∨B).','A B → Y: 00→1, 01→0, 10→0, 11→0.','Yalnız iki giriş de 0 iken çıkış 1 olur.'],
 ['07','sn74hc86n','İki girişli özel VEYA kapısı; Y=A⊕B.','A B → Y: 00→0, 01→1, 10→1, 11→0.','Girişler birbirinden farklıysa çıkış 1 olur.'],
 ['08','cd4077be','İki girişli özel VEYA-DEĞİL kapısı; Y=¬(A⊕B).','A B → Y: 00→1, 01→0, 10→0, 11→1.','Girişler aynıysa çıkış 1 olur.'],
 ['09','sn74hc148n','Öncelikli 8→3 kodlayıcı; 74HC148 etkin girişleri ve kod çıkışları aktif düşüktür.','Birden fazla aktif giriş varsa daha yüksek öncelikli giriş kodlanır; kod doğrudan aktif-yüksek üç bit sanılamaz.','Etkinleştirme, öncelik ve aktif-düşük kutuplamayı ayrı yorumla.'],
 ['10','sn74hc138n','3→8 kod çözücü; G1=1, /G2A=0 ve /G2B=0 iken seçilen tek Y hattı LOW olur.','S2 S1 S0 adresi 000→Y0 LOW, 111→Y7 LOW; diğer Y hatları HIGH.','Aktif-düşük çıkış ile lojik 1 seçili çıkışı karıştırma.'],
 ['11','arduino-cd4511','CD4511 BCD→7 segment sürücü; uygun ortak katotlu gösterge için aktif-yüksek segment kontrolü üretir.','Geçerli BCD 0000→0, 0001→1, ... 1001→9; blank/latch/test işlevleri ayrı kontrol edilmelidir.','Gerçek segment direnci, ortak uç ve sürücü bağlantısı kartta kurulmamıştır.'],
 ['12','sn74hc151n','74HC151 tipi 8→1 multiplexer; seçim girişleriyle sekiz veri girişinden biri seçilir.','S2 S1 S0=000→D0; 111→D7, izin/etkinleştirme ve ters çıkış uçları ayrıca kontrol edilir.','Multiplexer seçici; ayrı çoklu veri kaynağı ve çıkış bağlantısı olmadan aktarım simüle edilmez.'],
 ['13','sn74hc138n','74HC138 ile aktif-düşük tek çıkış seçimi, demultiplexer öğretimi için ancak veri/izin kapılaması belirtilerek yorumlanabilir.','Adres 000 seçili Y0 LOW; 111 seçili Y7 LOW; gerçek 1→8 veri yönlendirme devresi kablolanmamıştır.','Kod çözücü ile veri yönlendiricinin farkını belirt; 74HC138 kendiliğinden 1→8 tam demux değildir.'],
 ['14','cd74hc283e','74HC283 dört bit ikili toplayıcı; A[3:0]+B[3:0]+Cin → S[3:0], Cout.','Tek bit tam toplayıcıda S=A⊕B⊕Cin ve Cout=(A∧B)∨(Cin∧(A⊕B)).','Gösterilen entegre dört bitliktir; giriş/taşıma bağlantıları olmadan hesaplanmış çıktı iddia etme.'],
 ['15','cd74hc85e','74HC85 dört bit büyüklük karşılaştırıcısı; A>B, A=B veya A<B ilişkisini üretir.','4 bit A=0101 ve B=0011 için A>B; eşit girişte A=B beklenir.','Kademeli karşılaştırma girişleri ve çıkış pinleri bağlanmadan ölçüm varmış gibi gösterme.']
];
for(const [suffix,chip,definition,table,point] of mq07LogicCases83to97){
 const id='digital-logic-apps-src-'+suffix,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='quiz'||(lesson.project?.wires||[]).length||
    !lesson.project.components.some(c=>c.typeId===chip))
   throw Error('MQ07 SC83–SC97 canonical digital reference mismatch '+id);
 lesson.summary=definition+' Bu ders kablosuz bir referans kartıdır.';
 lesson.explanation=definition+' '+table+' '+point+' Gerçek besleme, giriş, çıkış ve gösterge bağlantısı yapılmadığından bu bir elektriksel simülasyon sonucu değildir.';
 lesson.learningGoal=definition+' '+point;
 lesson.beginnerSteps=[
  'Gösterilen entegreyi ve başlıktaki lojik işlevi eşleştir.',
  'Kuramsal doğruluk/işlev ilişkisini incele: '+table,
  point,
  'Bu kartta gerçek kablo ve besleme yok; giriş değişimi veya donanım çalışması için PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',
  semanticNarrativeAdded:true,titleTopologyStatus:'REVIEW',
  titleTopologyIssue:'NO_WIRED_CIRCUIT',terminalGrounded:false,
  physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
}


/* MQ07_SC72_SC82_SCOPE: keep unwired reference lessons educationally truthful.
 * No virtual AC/RF/audio power output is synthesized by these cards.
 */
const mq07ReferenceScope72to82={
 '20':['Bant geçiren filtre, seçilen alt ve üst kesim frekansları arasında kalan bileşenleri geçirir.','Bu kartta alçak/yüksek geçiren aşamaların bağlantısı, gerçek kesim frekansları ve frekans taraması yoktur.'],
 '21':['Bant durduran filtre, belirli frekans bandını zayıflatırken bu bandın dışındaki bileşenleri geçirir.','Devrede direnç ve kondansatör değerleriyle bağlanmış bir notch ağı ve frekans cevabı ölçümü yoktur.'],
 '22':['FM vericide bilgi, taşıyıcı işaretin anlık frekansını değiştirerek iletilir.','Gösterilen RF bloğu kablosuz referanstır; modülasyon spektrumu, anten gücü veya gerçek yayın simülasyonu değildir.'],
 '23':['FM alıcı, RF seçimi ve frekans demodülasyonu ile taşınan ses veya veri işaretini ayırır.','Gösterilen alıcı bloğunda bağlantılı RF katı, hassasiyet ya da demodülasyon testi yoktur.'],
 '24':['Ön yükselteç, düşük seviyeli giriş sinyalini sonraki kat için uygun seviyeye çıkarır.','LM358 referans elemanıdır; kazanç, gürültü veya bant genişliği sanal devrede ölçülmedi.'],
 '25':['Ses mikseri, birden çok bağımsız ses kanalının seviyesini dengeleyerek ortak çıkışa birleştirir.','Bu kartta kablolanmış çoklu giriş ve gerçek ses karıştırma ölçümü yoktur.'],
 '26':['Bas-tiz kontrolü, düşük ve yüksek frekans bantlarının seviyelerini ayrı ayarlar.','Kartta potansiyometreler ve RC elemanları yer alır ama gerçek frekans cevabı veya ton ayarı simülasyonu yoktur.'],
 '27':['Eko etkisi, işaretin gecikmiş ve çoğu zaman zayıflatılmış kopyasının asıl işaretle birleştirilmesiyle oluşur.','Bu kartta gecikme hattı, bellek veya ses örnekleme zinciri simüle edilmez.'],
 '28':['VU metre, ses işaretinin düzeyini belirli bir gösterge tepkisiyle görselleştirmeyi amaçlar.','Gerçek ses RMS ölçümü, göstergenin zaman tepkisi ve kalibrasyonu burada mevcut değildir.'],
 '29':['14 W ses yükselteci, yükü sürmek için yeterli güç katı ve ısıl tasarım gerektirir.','Gösterilen LM358, 14 W hoparlörü tek başına süren güç katı değildir; bu kartta güç sürücü bağlantısı, yük ve watt ölçümü yoktur.'],
 '30':['100 W ses yükselteci, uygun güç transistörleri/entegresi, besleme, koruma ve ısıl tasarım gerektirir.','Gösterilen LM358, 100 W hoparlörü tek başına süren güç katı değildir; gerçek güç yükselteç şeması ve watt doğrulaması yoktur.']
};
for(const [index,notes] of Object.entries(mq07ReferenceScope72to82)){
 const id='oscillator-filter-apps-src-'+index,lesson=L.byId[id];
 if(!lesson||lesson.kind!=='quiz'||(lesson.project?.wires||[]).length!==0)
  throw Error('MQ07 SC72–82 must remain unwired reference: '+id);
 lesson.summary=notes[0]+' Bu ders şimdilik kablosuz kavram ve materyal referansıdır.';
 lesson.explanation=notes[0]+' '+notes[1];
 lesson.learningGoal=notes[0]+' Çalışan devre ile kablosuz referans kartını ayırt edebilmek.';
 lesson.beginnerSteps=[
  'Önce başlıktaki devrenin gerçek çalışma amacını oku.',
  'Kullanılan elemanların görevlerini ve eksik bağlantıları karşılaştır.',
  notes[1],
  'Gerçek kablo bağlantısı ve ölçüm sonucu olmadan devreye elektriksel PASS verme.'
 ];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',
  semanticNarrativeAdded:true,titleTopologyStatus:'REVIEW',
  titleTopologyIssue:'NO_WIRED_CIRCUIT',terminalGrounded:false,
  physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
}



/* BELL_TRANSFORMER_V1: source circuits and learner explanations must agree. */
for(const id of ['installation-systems-src-05','installation-systems-src-06']){
 const l=L.byId[id];if(!l)continue;
 if(id==='installation-systems-src-06'){
  // Old source was a single-bell button: upgrade only after the locked
  // historic pilot audit. Preserve the user project ID and lesson identity.
  l.project=clone(L.byId['bells-3'].project);
  l.project.projectId='tutorial-session-source-'+id;
  l.project.name='Öğretici · '+l.title;
  l.project.tutorialLesson={id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
  l.steps=l.project.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  l.kind='wiring';l.workspaceMode=l.project.workspaceMode;
 }
 const p=l.project;
 if(!p?.components?.some(c=>c.typeId==='bell-transformer')||p.components.some(c=>c.typeId==='supply-1p'))
   throw Error('Unsafe direct-mains teaching bell '+id);
 l.summary=id.endsWith('05')
   ?'Zil trafosunun sanal, yalıtılmış 12 V AC çıkışı ile normalde açık B1 butonu Z1 zilini yalnız basılıyken çalıştırır. Şebeke bağlantısı butonda veya zilde bulunmaz.'
   :'Zil trafosunun yalıtılmış sanal 12 V AC çıkışını paylaşan B1, B2 ve B3 butonlarından herhangi biri Z1 zilini çalıştırır. İki butonlu örnek B1 ve B2 ile; üç butonlu örnek üç ayrı çağrı noktasıyla anlaşılır.';
 l.explanation='Bu örnekte TR1 sanal zil trafosunun şebeke tarafı simülasyon içinde yalıtılmıştır ve öğrencinin kablolayacağı primer uç yoktur. TR1/S1 alçak gerilim tarafı B1/13 girişine ulaşır. B1 basılınca normalde açık 13–14 kontağı kapanır, B1/14 ile Z1/1 arasındaki yol tamamlanır; zilin Z1/2 ucu TR1/S2 sekonder dönüşündedir. B1 bırakılınca kontak açılır, zil durur. Düşün: buton bırakılınca neden zil susar? Bu örneğin 12 V AC değeri simülasyon modelidir; gerçek ürünün anma verisi doğrulanmamıştır. Kayıtlı şemadan izlenecek bağlantılar: TR1/S1 → B1/13; B1/14 → Z1/1; Z1/2 → TR1/S2.'+
 (id.endsWith('06')?' B2 ve B3 butonları da aynı yalıtılmış sekondere paralel bağlanır: biri basıldığında yalnız kendi 13–14 kontağı kapanarak ortak Z1 zilini çaldırır. İki butonlu modeli ilk iki kol, üç butonlu modeli üç kol ile gözlemle.':'');
 l.learningGoal='Sanal zil trafosunun yalıtılmış 12 V AC çıkışını, B1 13–14 normalde açık kontağını ve Z1 zilinin kapanan/yeniden açılan akım yolunu açıklayabilmek.';
 l.beginnerSteps=['TR1 içten yalıtılmış sanal trafodur; burada şebeke fazı bağlantısı kurulmaz.','Yalnız 12 V AC S1/S2 çıkışı ile çağrı butonları ve Z1 arasındaki devreyi gör.','Sanal TR1 trafosunun enerjisi yokken butona basılsa bile zilin neden çalmayacağını tartış; doğrudan şebeke bağlantısı kullanılmaz.','Sanal B1 butonuna bas: 13–14 kapanınca zilin neden çaldığını söyle.','B1 butonunu bırak: kontak açılınca zilin neden sustuğunu açıkla.',...(id.endsWith('06')?['Sırayla B2 ve B3 çağrı butonlarına da bas-bırak yap; biri basılıyken diğerlerinin basılmasına neden gerek olmadığını açıkla.']:[])];
 const role={
  tr:'TR1 şebekeden kablo bağlanabilir girişleri bulunmayan, yalnız sanal yalıtılmış 12 VAC S1/S2 sekonderini sağlayan zil trafosudur.',
  b0:'B1 normalde açık 13–14 çağrı kontağıdır; basılınca yalnız kendi 12 VAC yolunu kapatır, bırakılınca açar.',
  b1:'B2 ikinci paralel çağrı butonudur; B1 basılı değilken de 13–14 kontağını kapatarak ortak zili çalıştırabilir.',
  b2:'B3 üçüncü paralel çağrı butonudur; diğer butonlardan bağımsız sanal çağrı noktasıdır.',
  z:'Z1 yalnız izole 12 VAC sanal sekonderden beslenen elektronik zildir; herhangi bir buton basılıyken çalar, tüm butonlar bırakıldığında susar.'
 };
 l.materials=materialRows(p).map(m=>({...m,why:role[m.componentId]||m.why}));
 l.safety='Yalnız sanal eğitimde yalıtılmış 12 V AC zil trafosu kullanılır; şebeke fazı buton/zile doğrudan bağlanmaz.';
 l.pedagogyReview={...l.pedagogyReview,bellTransformerModel:'BELL_TRANSFORMER_V1',independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
}

/* MQ-07 lesson repair: reuse the already-modeled, solver-tested three-position
   virtual lighting circuit. Do not silently mutate saved student projects. */
const threePointLesson=L.byId['installation-systems-src-04'];
const threePointSource=L.byId['intermediate-1'];
if(threePointLesson&&threePointSource){
 const p=clone(threePointSource.project);
 const types=p.components.map(c=>c.typeId);
 if(types.filter(x=>x==='wall-vavien').length!==2||
    types.filter(x=>x==='wall-intermediate').length!==1||
    p.wires.length!==7)throw Error('Three-position canonical virtual circuit incomplete');
 const id=threePointLesson.id;
 p.projectId='tutorial-session-source-'+id;
 p.name='Öğretici · '+threePointLesson.title;
 p.tutorialLesson={id,topicId:threePointLesson.topicId,phase:'demo',step:0,level:threePointLesson.variant};
 threePointLesson.project=p;
 threePointLesson.kind='wiring';
 threePointLesson.workspaceMode=p.workspaceMode;
 threePointLesson.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 threePointLesson.summary='Bu sanal aydınlatma devresinde H1 lambasını üç ayrı noktadan kontrol edebilirsin. İki uçtaki S1 ve S3 vaviyenleri yolu seçer; ortadaki S2 ara vaviyen iki gezgin hattı düz ya da çapraz geçirir. Üç anahtardan herhangi birinin konumu değiştiğinde lambanın durumu değişir.';
 threePointLesson.explanation='Önce devrenin amacını düşün: Bir koridorun üç ucundan aynı H1 lambasını açıp kapatabilmek. Sanal G1 kaynağının L ucu ilk vaviyen S1/11 ortak girişine gelir. S1 anahtarı faz yolunu S1/12 ya da S1/14 gezginine yönlendirir. İlk gezgin S2 ara vaviyenin 1 ucuna, ikinci gezgin S2/3 ucuna gider. S2 ortadaki çapraz anahtardır: bir konumda gelen iki hattı sırasıyla 2 ve 4 uçlarına, diğer konumda çapraz çıkışlara bağlar. S2/2 hattı son vaviyenin S3/12 ucuna, S2/4 hattı S3/14 ucuna ulaşır. S3 son vaviyeni 12 veya 14 gezginini ortak S3/11 çıkışına seçer. S3/11 → H1/X1 hattı lambaya gider; H1/X2 → G1/N hattı dönüş yoludur. Böylece S1, S2 veya S3 konumu tek başına değiştirilince süreklilik tersine döner ve sanal H1 açıkken kapanır ya da kapalıyken açılır. Sayısal lamba akımı veya gücü tanımlanmadığından bunları ölçülmüş gibi söyleme. G1 üzerindeki 230 VAC kaynak etiketi gerçek bir ölçüm veya fiziksel tesisat uygulama talimatı değildir. Kayıtlı şemadan izlenecek bağlantılar: G1/L → S1/11; S1/12 → S2/1; S1/14 → S2/3; S2/2 → S3/12; S2/4 → S3/14; S3/11 → H1/X1; H1/X2 → G1/N. Bu yalnız sanal laboratuvardır; gerçek şebeke bağlantısı yaptırılmaz.';
 threePointLesson.learningGoal='İlk vaviyenin ortak 11 ve gezgin 12/14 uçlarını; ara vaviyenin 1, 3 giriş ve 2, 4 çıkışlarını; son vaviyenin 11 ortak çıkışını ve H1 lambasının X1/X2 dönüşünü anlatmak. Üç anahtardan herhangi birinin lambayı neden değiştirdiğini açıklayabilmek.';
 threePointLesson.beginnerSteps=[
  'Sanal devrede önce S1 ve S3 uç vaviyenleri, aradaki S2 ara vaviyeni ve H1 lambasını bul. Üç kontrol elemanı olduğunu say.',
  'Sanal L kaynağı → S1/11 ortak girişi, S1/12 → S2/1 ve S1/14 → S2/3 gezgin hatlarını devre üzerinden izle.',
  'S2/2 → S3/12 ve S2/4 → S3/14 çıkışlarını izle. Ara anahtarın düz/çapraz durumu değişince hangi gezginin diğerine aktarıldığını kendi cümlenle söyle.',
  'S3/11 → H1/X1 hattını ve H1/X2 → sanal N dönüşünü ayırt et. Bu dönüşün S2 ara anahtardan geçmediğini gör.',
  'Yalnız simülasyonda S1 ve S3 sabitken S2 konumunu değiştir. H1 açık/kapalı durumunu iki kez gözlemleyip kaydet.',
  'S2 sabitken önce S1, sonra S3 anahtarını tek tek değiştir. Neden her bir değişimin lambayı ters duruma geçirdiğini açıkla.',
  'Öğrendiğini anlat: Neden iki uç vaviyen yetmez; ortadaki ara vaviyen olmadan üç noktadan kontrol sağlanamaz?'
 ];
 const byId={g1:'G1 yalnız sanal L/N kaynağıdır; gerçek tesisat bağlantısı görevi değildir.',s1:'S1 ortak 11 ile 12/14 gezginlerini seçen ilk vaviyendir.',sx:'S2 ara vaviyen; 1/3 giriş çiftini 2/4 çıkışına düz veya çapraz aktarır.',s2:'S3 ortak 11 ile 12/14 gezginlerini seçen son vaviyendir.',h:'H1 iki anahtar yolu tamamlanınca ışık veren sanal lamba yüküdür.'};
 threePointLesson.materials=materialRows(p).map(m=>({...m,why:byId[m.componentId]||m.why}));
 threePointLesson.pedagogyReview={...(threePointLesson.pedagogyReview||{}),mq07CircuitMatch:'SOURCE_ALIGNED',titleTopologyStatus:'SOURCE_ALIGNED',titleTopologyIssue:null,threePositionCircuitSource:'intermediate-1',virtualTruthTablePending:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,physicalAcceptance:false};
}
/* BELL_TRANSFORMER_V1 remains mandatory; correct stale source metadata after
   the earlier 1-button/3-button transformer repairs. */
for(const id of ['installation-systems-src-05','installation-systems-src-06']){
 const lesson=L.byId[id];if(!lesson)continue;
 const parts=lesson.project?.components||[];
 const expected=id.endsWith('06')?3:1;
 if(parts.filter(c=>c.typeId==='bell-transformer').length!==1||
    parts.filter(c=>c.typeId==='bell-push').length!==expected||
    parts.some(c=>c.typeId==='supply-1p'))
   throw Error('BELL_TRANSFORMER_V1 locked teaching circuit mismatch '+id);
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07CircuitMatch:'SOURCE_ALIGNED',titleTopologyStatus:'SOURCE_ALIGNED',titleTopologyIssue:null,bellTransformerModel:'BELL_TRANSFORMER_V1',independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
}
if(L.mq07FirstTenDepth?.topologyReview)
 L.mq07FirstTenDepth.topologyReview=L.mq07FirstTenDepth.topologyReview.filter(id=>!['installation-systems-src-04','installation-systems-src-06'].includes(id));


// MQ-07 P1 first-200 real repair: one-switch lighting. Virtual teaching only.
// A heading plus four floating parts is NOT a functional lighting circuit.
const singleLight=L.byId['installation-systems-src-01'];
if(singleLight){
 const p=singleLight.project;
 const types=p.components.map(c=>c.typeId);
 if(JSON.stringify(types)!==JSON.stringify(['supply-1p','mcb-1p','wall-switch','ceiling-light'])||p.wires.length)
  throw Error('MQ07 single-lighting unexpected source topology; refuse to overwrite canonical graph');
 p.wires=[
  W('pg0','L','pg1','1','Sanal kaynak L → Q1/1','Koruma elemanı aydınlatma kolunun başındadır.','#e53935','L1'),
  W('pg1','2','pg2','13','Q1/2 → S1/13','Koruma elemanından çıkan sanal hat tek kutuplu anahtarın girişine ulaşır.','#e53935','L1'),
  W('pg2','14','pg3','X1','S1/14 → H1/X1','Anahtar kapalı konuma geçince armatürün besleme tarafındaki yol tamamlanır.','#e53935','L1'),
  W('pg3','X2','pg0','N','H1/X2 → sanal kaynak N','Armatürün sanal dönüş hattı devrenin elektriksel halkasını tamamlar.','#1e88e5','N')
 ];
 p.referenceOnly=false;
 p.tutorialLesson.phase='demo';p.tutorialLesson.step=0;
 const q=p.components.find(c=>c.id==='pg1'),s=p.components.find(c=>c.id==='pg2');
 q.ref='Q1';q.label='Tek kutuplu sanal koruma anahtarı';
 s.ref='S1';s.label='Adi aç/kapa anahtarı';
 p.components.find(c=>c.id==='pg3').ref='H1';
 p.components.find(c=>c.id==='pg0').ref='G1';
 q.state=false; // in this solver false is closed, true is open
 singleLight.kind='wiring';
 singleLight.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 singleLight.summary='Bu sanal aydınlatma devresinde S1 anahtarı tek bir H1 lambasını açıp kapatır. Anahtar açıkken lambaya enerji yolu tamamlanmaz; kapalıyken Q1 üzerinden gelen sanal besleme lambaya ulaşır. Devre yalnız yazılım içindeki elektrik modelidir; gerçek şebekede bağlantı uygulaması değildir.';
 singleLight.explanation='Bu devrenin amacı, bir odadaki lambayı tek noktadan kumanda etmenin mantığını göstermektir. G1 sanal beslemedir; Q1 koruma anahtarı, S1 adi anahtar, H1 ise armatürdür. Şemada sanal L hattı Q1/1 girişine, Q1/2 çıkışı S1/13 girişine, S1/14 çıkışı H1/X1 noktasına ve H1/X2 dönüşü G1/N noktasına gider. Anahtarın 13–14 kontağı açıksa elektriksel halka kesilir: H1 ışık vermez. S1 sanal anahtarı kapatılınca 13–14 birleşir ve H1 besleme–dönüş halkası tamamlanır; lamba yanabilir. Q1 sanal olarak açıldığında S1 kapalı olsa da besleme kesilir. Öğrenci sanal S1 konumunu değiştirerek H1 yanıyor mu gözler; ardından Q1 durumunun sonuca etkisini karşılaştırır. Bu test bir elektrik tesisatı montaj tarifi değil, simülasyon içindeki neden–sonuç incelemesidir. Kaynak gerilimine ve armatür modeline ait kesin sayısal değer ölçülmedikçe varsayılmaz. Kayıtlı şemadan izlenecek bağlantılar: G1/L → Q1/1; Q1/2 → S1/13; S1/14 → H1/X1; H1/X2 → G1/N.';
 singleLight.learningGoal='Sanal Q1 koruma elemanının, S1/13–14 aç/kapa kontağının ve H1 armatürünün görevlerini; açık, kapalı ve koruma kesik hallerinde devrenin neden farklı davrandığını açıklamak.';
 singleLight.beginnerSteps=[
  'Ekranda G1 sanal kaynak, Q1 koruma anahtarı, S1 adi anahtar ve H1 armatürünü bul; dördünün görevlerini ayır.',
  'S1 açıkken H1 durumunu simülasyonda gözle ve devre halkasının nerede kesildiğini anlat.',
  'S1 sanal anahtarını kapatıp simülasyonu yeniden çalıştır; H1’in davranışının neden değiştiğini kendi cümlenle söyle.',
  'S1 kapalı kalırken Q1’i sanal olarak aç; koruma kesildiğinde lambanın niçin enerjisiz kaldığını gözle.',
  'Sanal testten sonra farkı özetle: bir anahtarın kontrol etmesi ile koruma elemanının devreyi ayırması aynı amaç değildir.'
 ];
 const roles={pg0:'G1 sanal enerjiyi temsil eder; gerçek şebeke üzerinde işlem yapılmaz.',pg1:'Q1 aydınlatma kolunu sanal olarak ayırabilen koruma elemanıdır.',pg2:'S1 yalnız H1 için 13–14 kontağını açıp kapatan tek kutuplu anahtardır.',pg3:'H1 anahtarın durumuna göre etkinleşen görsel armatür yüküdür.'};
 singleLight.materials=materialRows(p).map(m=>({...m,why:roles[m.componentId]||m.why}));
 singleLight.pedagogyReview={...singleLight.pedagogyReview,titleTopologyIssue:null,titleTopologyStatus:'SOURCE_ALIGNED',mq07CircuitRepair:'SINGLE_SWITCH_LIGHTING_VIRTUAL_V1',electricalSourcePending:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,physicalAcceptance:false};
 singleLight.safety='Yalnızca yazılım içindeki sanal aydınlatma devresidir. Gerçek şebeke bağlantısı uygulaması değildir.';
 const before=L.mq07Batch200?.reviewIds||[];
 if(!before.some(x=>x.id===singleLight.id&&x.reason==='NO_WIRED_CIRCUIT'))throw Error('Expected MQ07 review entry absent');
 L.mq07Batch200.reviewIds=before.filter(x=>x.id!==singleLight.id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),singleLight.id];
}


// MQ-07 physical tutorial repair: relay terminal discovery must be simulated.
const relayLesson=L.byId['electronic-switching-src-01'];
const relayReference=L.byId['button-relay-2'];
if(relayLesson&&relayReference){
 if(relayLesson.project.wires.length||JSON.stringify(relayLesson.project.components.map(c=>c.typeId))!==JSON.stringify(['coil-relay','contact-both']))
  throw Error('MQ07 relay lesson unexpected source graph');
 const p=clone(relayReference.project);
 p.projectId='tutorial-session-source-'+relayLesson.id;
 p.name='Öğretici · '+relayLesson.title;
 p.tutorialLesson={id:relayLesson.id,topicId:relayLesson.topicId,phase:'demo',step:0,level:relayLesson.variant};
 p.components.push(C('nc','contact-nc',720,475,'K1','K1 normalde kapalı NC 21–22'));
 p.components.push(C('h2','lamp-red',940,475,'H2','K1 bırakıldığında yanan kırmızı gösterge'));
 p.wires.push(
  W('g1','P','nc','21','+24 V → K1/21','NC kontağın sanal enerji girişi.','#8b5a2b','+24V'),
  W('nc','22','h2','X1','K1/22 → H2/X1','Bobin enerjisizken kırmızı H2 yanar.','#43a047','SIGNAL'),
  W('h2','X2','g1','M','H2/X2 → sanal 0 V','H2 gösterge yükünün dönüşü.','#111827','0V')
 );
 relayLesson.project=p;
 relayLesson.workspaceMode=p.workspaceMode;
 relayLesson.kind='wiring';
 relayLesson.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint||'Sanal terminal yolunu incele.',
  why:w.tutorialWhy||'Bu terminal devre yolunun bir parçasıdır.',
  color:w.color,role:w.role,size:w.size}));
 relayLesson.summary='Bu düşük gerilimli sanal derste K1 rölesinin A1/A2 bobini ile normalde açık 13–14 ve normalde kapalı 21–22 yardımcı kontaklarının iki lambayı neden ters sırayla çalıştırdığı öğrenilir.';
 relayLesson.explanation='Röleyi elektrikle çalışan bir görevli gibi düşün: S1 butonu bobine komut verir, K1 yardımcı kontakları başka devre yollarını açıp kapatır. Sanal G1 kaynağının +24 V ucu S1/13 noktasına, S1/14 çıkışı K1 bobininin A1 ucuna gider; bobinin A2 ucu G1/0 V dönüşündedir. Buton basılı değilken bobin enerjisizdir. K1/13–14 normalde açık (NO) olduğu için yeşil H1 sönüktür; K1/21–22 normalde kapalı (NC) olduğu için kırmızı H2 yanar. Sanal S1 butonuna basılınca K1 bobini çeker: NO 13–14 kapanır ve +24 V H1/X1 yoluna iletilir; H1/X2 0 V kaynağına döner. Aynı anda NC 21–22 açılır, H2 söner. Buton bırakılınca bobin serbest kalır, yeşil H1 söner ve kırmızı H2 yeniden yanar. Böylece A1/A2 bobin uçlarının NO/NC kontaklarından farklı görevde olduğu görülür. Bu sanal modelin gerilimi 24 VDC’dir; gerçek bobin akımı ve lambaların güç/direnç değerleri verilmediğinden uydurma bir I veya P sayısı hesaplanmaz. Bu şema fiziksel montaj talimatı değildir.';
 relayLesson.learningGoal='A1/A2 bobin, NO 13/14 ve NC 21/22 kontaklarını tanıyarak S1 OFF→ON→OFF senaryosunda H1 ile H2 göstergelerinin neden ters davrandığını açıklamak.';
 relayLesson.beginnerSteps=[
  'Sanal G1 kaynağını, S1 butonunu ve K1 rölesinin A1/A2 bobin uçlarını bul.',
  'Buton bırakılmışken K1/13–14 yolunun açık, K1/21–22 yolunun kapalı olmasını yeşil H1 ve kırmızı H2 ile karşılaştır.',
  'Sanal S1 butonuna bas ve bobin çektikten sonra NO ile NC kontaklarının durumunu gözlemle.',
  'Butonu bırakınca iki göstergenin ilk duruma döndüğünü kontrol et.',
  'Bobinin A1/A2 uçları ile kontakların 13–14 ve 21–22 uçlarının farklı elektriksel görevini kendi cümlenle anlat.'
 ];
 relayLesson.materials=materialRows(p).map(m=>m.componentId==='k'?{...m,why:'K1 bobini A1/A2; yalnız sanal kumanda gerilimiyle çekerek yardımcı kontak durumunu değiştirir.'}:
 m.componentId==='q'?{...m,why:'K1 NO 13–14; bobin çektiğinde kapanır ve H1 göstergesini yakar.'}:
 m.componentId==='nc'?{...m,why:'K1 NC 21–22; bobin enerjisizken kapalı olduğu için H2 yanar.'}:m);
 relayLesson.pedagogyReview={...(relayLesson.pedagogyReview||{}),titleTopologyIssue:null,
  mq07CircuitMatch:'SOURCE_ALIGNED',relayTerminalSource:'button-relay-2',
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,physicalAcceptance:false};
 const pending=L.mq07Batch200?.reviewIds||[];
 if(!pending.some(x=>x.id===relayLesson.id&&x.reason==='NO_WIRED_CIRCUIT'))throw Error('MQ07 relay pending REVIEW missing');
 L.mq07Batch200.reviewIds=pending.filter(x=>x.id!==relayLesson.id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),relayLesson.id];
}


/* MQ-07: physically routed low-voltage virtual sensor-control examples.
   The immutable bell transformer and the already accepted rich lessons stay untouched. */
for(const id of ['sensor-analog-apps-src-13','sensor-analog-apps-src-14']){
 const lesson=L.byId[id];if(!lesson)throw Error('Missing virtual sensor lesson '+id);
 const p=lesson.project,optic=id.endsWith('14');
 const required=[['g1','arduino-bench-supply'],['s1',optic?'sensor-through-beam':'proximity'],
  ['k1','coil-relay'],['ka1','contact-no'],['h1','lamp-green']];
 for(const [cid,typeId] of required)
  if(!p.components.some(c=>c.id===cid&&c.typeId===typeId))throw Error('Sensor circuit component mismatch '+id+'/'+cid);
 const connected=(a,ap,b,bp)=>p.wires.some(w=>w.from?.c===a&&w.from?.p===ap&&w.to?.c===b&&w.to?.p===bp);
 if(![
  ['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],['k1','A2','g1','M'],
  ['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']
 ].every(x=>connected(...x)))throw Error('Incomplete sensor-control terminal wiring '+id);
 const name=optic?'optik algılama birimi':'endüktif yaklaşım sensörü';
 lesson.summary=optic
  ?'Bu sanal optik sensör devresi bir cismin ışık yolunda algılandığı bilgisini ayrı bir röleye aktarır. K1 bobini çekince normalde açık K1/13–14 kontağı kapanır, H1 yeşil gösterge yanar. Algılama kalkınca lamba söner. Böylece algılama sinyali ile yükü çalıştıran enerji yolunun farklı olduğu öğrenilir.'
  :'Bu sanal devrede endüktif PNP sensör bir metal hedefin algılandığını bildirir. Sensörün BK çıkışı K1 rölesini çalıştırır; rölenin normalde açık 13–14 kontağı H1 lambasını yakar. Algılama kalkınca röle bırakır ve lamba söner. Sensörün görevini bir anahtarla karıştırmadan öğreniriz.';
 lesson.explanation='Önce sanal G1 güç kaynağının +24 V ucunu bul: G1/P hattı B1 sensörünün BN (kahverengi besleme) ucuna gider. G1/M ise B1/BU (0 V, mavi dönüş) ucuna bağlıdır. '+(optic
  ?'B1, ışık yolundaki değişimi algılayan üç terminalli sanal optik sensör modelidir; bu sahne gerçek verici–alıcı çiftinin fiziksel montajını göstermez. '
  :'B1, sanal metal algılama durumu etkinleştiğinde PNP tipinde çıkış verir. ')+
 'B1/BK (siyah işaret çıkışı) doğrudan K1/A1 bobin ucuna gider; K1/A2 ucu G1/M hattına döner. Sensör çıkışı aktif değilken K1 bobini enerjisizdir ve K1/13–14 normalde açık kontağı aralıktır: H1 yanmaz. Sanal algılama ON olduğunda B1/BK bobini enerjilendirir, K1/13–14 kapanır. Artık G1/P → K1/13 → K1/14 → H1/X1 → H1/X2 → G1/M üzerinden yük yolu tamamlanır ve yeşil H1 yanar. Algılama OFF olunca bobin bırakır, 13–14 yeniden açılır ve H1 söner. Bobinin A1/A2 uçları ile yük kontağının 13/14 uçları birbirine karıştırılmamalıdır. Besleme bu modelde 24 VDC’dir; bobinin ve lambanın sayısal direnç/güç verileri doğrulanmadığı için uydurma akım veya watt hesabı gösterilmez. Bu yalnız yazılım simülasyonudur, gerçek montaj talimatı değildir.';
 lesson.learningGoal='Sanal 24 VDC kaynağın P/M uçlarını, PNP sensör BN/BU/BK bağlantılarını, röle bobini A1/A2 ve normalde açık 13/14 uçlarını tek tek göstererek OFF→ON→OFF sırasında H1 lambasının neden söndüğünü, yandığını ve tekrar söndüğünü anlatabilmek.';
 lesson.beginnerSteps=[
  'Şemada G1/P (+24 V) ve G1/M (0 V) uçlarını bul; B1/BN ve B1/BU sensör beslemesini takip et.',
  'B1/BK çıkışının K1/A1 ucuna ve K1/A2 ucunun 0 V’a dönmesine bak. Bu yol sensörden gelen röle kumandasıdır.',
  'G1/P → K1/13 → K1/14 → H1/X1 → H1/X2 → G1/M yolunu incele; yük enerjisi için kontak neden gereklidir?',
  'Sanal sensör algılama durumunu önce OFF, sonra ON yap: K1 bobini ile H1 lambasının değişimini karşılaştır.',
  'Algılamayı tekrar OFF yap; kontak neden yeniden açılıyor ve H1 neden sönüyor, kendi cümlenle söyle.',
  'Sanal modelde yalnız 24 V kaynak değeri verilmiştir; gerçek cihazın akım/güç hesabını malzeme değerleri yokken tahmin etme.'
 ];
 const reasons={
  g1:'G1, bu sanal dersin 24 VDC P/M beslemesini sağlar; şebeke devresi değildir.',
  s1:optic?'B1, ışık algılama durumunu BK üzerinden PNP sanal çıkışına dönüştürür; fiziksel optik montajı ayrıca doğrulanmalıdır.':'B1, metal hedefin algılama durumunu PNP tipinde BK sanal işaretine dönüştürür.',
  k1:'K1 bobini A1/A2 uçlarıyla çalışır; sensör BK çıkışının etkisini anahtarlama hareketine dönüştürür.',
  ka1:'K1/13–14 normalde açık kontağı yalnız bobin çekince kapanır; H1 yük yolunu kontrol eder.',
  h1:'H1, NO kontak üzerinden beslenince yanan sanal göstergedir; bağlantı döngüsünün dönüşü X2→0 V’tur.'
 };
 lesson.materials=materialRows(p).map(m=>({...m,why:reasons[m.componentId]||m.why}));
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',
  sourceGraphRepaired:true,causalTerminalsExplained:true,sourceSimulationVerified:true,
  titleTopologyIssue:null,titleTopologyStatus:'SOURCE_ALIGNED',
  physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
}

/* MQ-07: two additional 24 V low-voltage virtual detection/relay/indicator lessons.
   No real-world energised installation; no data are stamped accepted without a native solver trace. */
const mq07LowVoltageSensors=[
 {id:'sensor-analog-apps-src-20',kind:'sensor-hall',label:'Hall etkili PNP manyetik algılayıcı',target:'magnet',range:4,what:'manyetik hedefin algılanmasını',act:'Sanal Hall sensörünün algılama durumunu kapalı → açık → kapalı yap; hedef hareketi modeli desteklemiyorsa bunun bir yazılım anahtarlama deneyi olduğunu belirt.'},
 {id:'sensor-analog-apps-src-22',kind:'sensor-through-beam',label:'IR optik ışık bariyeri',target:'wood',range:40,what:'optik hedefin varlığını',act:'Sanal optik hedefi uzaktan yakına ve geri taşı; kontrolün röle ve lambayı değiştirip değiştirmediğini izle.'}
]
for(const item of mq07LowVoltageSensors){
 const lesson=L.byId[item.id];
 if(!lesson||lesson.project.wires.length||lesson.designStandard==='rich-reference-v1')throw Error('MQ07 sensor scene cannot be replaced '+item.id);
 const originalReview=L.mq07Batch200?.reviewIds||[];
 if(!originalReview.some(x=>x.id===item.id&&x.reason==='NO_WIRED_CIRCUIT'))throw Error('MQ07 expected review missing '+item.id);
 const p=industrialSensorLoadProject(lesson.id,lesson.title,item.kind,item.label);
 const s=p.components.find(c=>c.id==='s1');
 s.sensing={target:item.target,range:item.range,distance:item.range*2,offset:0,auto:false};
 s.state=false;
 p.workspaceMode='control';
 setLesson(lesson,p,{kind:'wiring'});
 lesson.summary='Bu sanal 24 V DC uygulamasında '+item.what+' bir röleyle lambaya bildiriyoruz. Öğrenci sensörün, röle bobininin, normalde açık kontağın ve lambanın görevlerini gerçek bağlantı üzerinden öğrenir.';
 lesson.explanation='Bu derste yalnız yazılım içindeki 24 V DC devre kullanılır. G1 kaynağının P (+24 V) ve M (0 V) uçları, B1 sensörünün BN (besleme) ve BU (dönüş) uçlarına bağlanır. B1 algıladığında BK adlı PNP çıkışından K1 rölesinin A1 bobin ucuna sanal +24 V sinyali ulaşır. K1 bobininin A2 ucu G1/M dönüşüne bağlıdır; bobin enerji aldığında K1 ile eşleşen 13–14 numaralı normalde açık kontak kapanır. Ayrı lamba yolunda G1/P → K1/13 → K1/14 → H1/X1 → H1/X2 → G1/M bulunur. Başlangıçta hedef uzaktaysa K1 bırakır ve H1 söner; hedef algılama alanına geldiğinde K1 çekip H1 yanar; hedef yeniden uzaklaşınca kontak açılıp lamba söner. Bu gözlem, sensörün düşük güçlü karar bilgisini röleyle yük kontrolüne dönüştürdüğünü gösterir. Sanal deney için sensörün durumu değiştirilebilir; gerçek ürün algılama mesafesi veya donanım kabulü bu ders tarafından doğrulanmış sayılmaz.';
 lesson.learningGoal='G1 +24 V/0 V, B1 BN/BU/BK, K1 A1/A2, K1 13/14 ve H1 X1/X2 sanal terminallerini göstererek sensör algılamasının neden röle ve lamba durumunu değiştirdiğini anlatabilmek.';
 lesson.beginnerSteps=[
  'Devreyi incele: G1 24 V DC kaynak, B1 sensör, K1 bobin ve normalde açık 13–14 kontak, H1 lambayı bul.',
  'Besleme bağlantılarının B1/BN ile B1/BU üzerinde; BK işaret çıkışının K1/A1 üzerinde olduğunu göster.',
  'K1/A2 dönüşünü ve G1/P → 13 → 14 → H1/X1 → H1/X2 → G1/M yük halkasını izle.',
  item.act,
  'K1 bobini ve H1 lambası OFF → ON → OFF değişimini kontrol et; yalnız sensörün kendi durumu değişti diye sonucu doğru kabul etme.',
  'Neden-sonuç sorusu: B1/BK çıkışı etkinleşse fakat K1/13–14 kapanmasa H1 lambası neden yanmaz?'
 ];
 const why={g1:'Sanal +24 V/0 V beslemeyi sağlar; gerçek tesisat şebekesi değildir.',s1:'B1 algılama durumunu BK PNP çıkışına aktarır; BN ve BU besleme terminalleridir.',k1:'K1 A1/A2 bobini BK çıkışından sanal kumanda alır.',ka1:'Aynı K1 bobini enerjilenince 13–14 NO kontağı kapanıp yük yolunu tamamlar.',h1:'H1 X1/X2 yükü, kontağın kapanmasının öğrencinin görebileceği sonucudur.'};
 lesson.materials=materialRows(p).map(m=>why[m.componentId]?{...m,why:why[m.componentId]}:m);
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',mq07CircuitMatch:'SOURCE_ALIGNED',titleTopologyStatus:'SOURCE_ALIGNED',titleTopologyIssue:null,previousReason:'NO_WIRED_CIRCUIT',sensor24vV1:true,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,physicalAcceptance:false};
 lesson.safety='Yalnız sanal düşük gerilimli laboratuvar. Gerçek devre bağlantısı veya enerji verme yönergesi değildir.';
 L.mq07Batch200.reviewIds=originalReview.filter(x=>x.id!==lesson.id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),lesson.id];
}



/* MQ07 001-200: real independently controllable A/B inputs for two op-amp lessons. */
for(const lessonId of ['opamp-apps-src-11','opamp-apps-src-12']){
 const lesson=L.byId[lessonId],subtract=lessonId.endsWith('-11'),p=lesson?.project;
 if(!lesson||lesson.designStandard==='rich-reference-v1'||!p||p.components.some(c=>c.id==='in2')||!p.components.some(c=>c.id==='u1'&&c.typeId==='lm358p-dip8'))throw Error('MQ07 unexpected opamp lesson '+lessonId);
 const component=x=>p.components.find(c=>c.id===x);
 component('in').label='RV1 · giriş A';component('in').potentiometer=35;
 component('r2').resistance=10000;component('r2').label='R2 · 10 kΩ geri besleme';
 p.components.push(C('in2','potentiometer',150,650,'RV2','RV2 · giriş B',{potMax:10000,potentiometer:60}));
 p.wires.push(W('in2','1','g1','P','RV2/1 → sanal +24 V','B potansiyometresinin üst beslemesidir.','#8b5a2b','+24V'),W('in2','3','g1','M','RV2/3 → sanal 0 V','B potansiyometresinin alt referansıdır.','#111827','0V'));
 p.components.push(C('r5','resistor',445,570,'R5','10 kΩ B giriş direnci',{resistance:10000}));
 if(subtract){
  const old=p.wires.filter(w=>w.from?.c==='ref1'&&w.from?.p==='2'&&w.to?.c==='u1'&&w.to?.p==='3');
  if(old.length!==1)throw Error('MQ07 subtractor Vref direct connection mismatch');
  p.wires=p.wires.filter(w=>!old.includes(w));
  p.components.push(C('r6','resistor',490,215,'R6','10 kΩ Vref giriş direnci',{resistance:10000}));
  p.wires.push(
   W('in2','2','r5','1','RV2/2 → R5/1','B girişini U1 evirmeyen girişe taşır.','#43a047','SIGNAL'),
   W('r5','2','u1','3','R5/2 → U1 pin 3','B gerilimi evirmeyen girişe uygulanır.','#43a047','SIGNAL'),
   W('ref1','2','r6','1','R3–R4 orta nokta → R6','12 V sanal referans aynı girişte ağırlıklandırılır.','#43a047','SIGNAL'),
   W('r6','2','u1','3','R6/2 → U1 pin 3','Evirmeyen giriş için referans koludur.','#43a047','SIGNAL')
  );
 }else{
  p.wires.push(W('in2','2','r5','1','RV2/2 → R5','İkinci giriş için bağımsız direnç koludur.','#43a047','SIGNAL'),W('r5','2','u1','2','R5 → U1 pin 2','A ve B sinyalleri eviren toplama noktasında birleşir.','#43a047','SIGNAL'));
 }
 p.referenceOnly=false;lesson.kind='wiring';
 lesson.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 const common='Bu sanal eğitim devresinde G1 +24 V ile 0 V arasındaki güç kaynağıdır; LM358P U1 pin 8 üzerinden beslenir, pin 4 ise 0 V referansıdır. R3=R4=10 kΩ dirençleri +24 V kaynağı ikiye bölerek 12 V orta referans oluşturur (24 × 10/(10+10) = 12 V). RV1 (A) ve RV2 (B) iki ayrı ayarlanabilir sinyal kaynağıdır. U1 pin 1 çıkışı, UNI-T multimetrenin DCV kademesiyle sanal OUT–0 V arasında ölçülür. ';
 if(subtract){
  lesson.summary='Bu iki girişli çıkarıcı sanal devrede LM358P, RV2 girişindeki B gerilimi ile RV1 girişindeki A geriliminin farkını gösterir. İki giriş eşitken çıkış yaklaşık 12 V referansta kalır; B büyürse çıkış artar, A büyürse azalır.';
  lesson.explanation=common+'A sinyali RV1/2 → R1=10 kΩ → U1 pin 2 (IN−) yolunu izler; R2=10 kΩ pin 1 (OUT) ile pin 2 arasında negatif geri besleme kurar. B sinyali RV2/2 → R5=10 kΩ → U1 pin 3 (IN+) yoluyla gelir. R3–R4 orta noktasındaki 12 V referans da R6=10 kΩ üzerinden aynı pin 3 noktasına ulaşır. Dört direnç eşit olduğunda, doyuma girilmeyen bölgede yaklaşık Vout=12 V+B−A olur. Bu denklem yalnızca besleme sınırları içindeki ideal çalışma bölgesine aittir; gerçek değer sanal simülasyonda ölçülmelidir. Öğrenci önce A=B ayarlar, sonra B yükseltir, sonra A yükseltir ve OUT seviyesinin neden değiştiğini kendi sözleriyle açıklar. Kayıtlı şemadan izlenecek bağlantılar: RV1/2 → R1 → pin 2; RV2/2 → R5 → pin 3; 12 Vref → R6 → pin 3; OUT → R2 → pin 2.';
  lesson.learningGoal='Bağımsız A ve B girişleri, U1 pin 2/3, R1/R2/R5/R6 dirençleri ve 12 V orta referans üzerinden fark hesabını sözlü anlatmak.';
  lesson.beginnerSteps=['G1 +24 V ve 0 V uçlarını U1 pin 8 ve 4 ile eşleştir.','R3/R4 gerilim bölücüsünü bul ve neden 12 V oluştuğunu hesapla.','RV1 ve RV2 sanal ayarlarını eşit yap; OUT gerilimini izle.','RV1 sabitken RV2 ayarını büyüt; çıkış değişimini gözle.','RV2 sabitken RV1 ayarını büyüt; çıkış yönünün neden ters değiştiğini açıkla.','R1/R2/R5/R6 dirençleri üzerinden hesap ve ölçüm farkını değerlendir.'];
 }else{
  lesson.summary='Bu iki girişli eviren toplayıcı devrede LM358P, RV1 ve RV2 ile ayarlanan A/B sinyallerinin 12 V orta referansa göre etkilerini birleştirir. Her giriş çıkışı etkiler.';
  lesson.explanation=common+'A sinyali RV1/2 → R1=10 kΩ → U1 pin 2 (IN−) yolundan gelir. B sinyali RV2/2 → R5=10 kΩ → aynı pin 2 düğümüne ulaşır. R2=10 kΩ OUT/pin 1 ile pin 2 arasında negatif geri besleme oluşturur. R3–R4 bölücüsünün 12 V orta noktası U1 pin 3 (IN+) girişidir. Doyum dışında eşit dirençler için ideal matematiksel ilişki Vout≈3×12 V−A−B olur: A veya B artınca eviren çıkış düşer. Gerilim 0–24 V çalışma sınırına yaklaştığında ideal hesap geçerli olmayabilir; bu yüzden öğrenci simüle edilen değeri gözlemlemelidir. Önce yalnız A ayarını, sonra yalnız B ayarını değiştirip iki girişin çıkışa katkısını açıkla. Kayıtlı şemadan izlenecek bağlantılar: RV1/2 → R1 → pin 2; RV2/2 → R5 → pin 2; 12 Vref → pin 3; OUT → R2 → pin 2.';
  lesson.learningGoal='İki ayrı A/B girişini gerçek pin 2 toplama düğümünde tanımak; R1/R5 ve R2 geri beslemenin eviren toplama işlemini nasıl gerçekleştirdiğini açıklamak.';
  lesson.beginnerSteps=['U1 pin 8/4 beslemesini ve R3/R4 üzerinden 12 V referansını bul.','RV1/2 ile R1 ve RV2/2 ile R5 giriş yollarının U1 pin 2 de birleştiğini göster.','RV1 ayarını değiştirip sanal OUT/pin 1 seviyesini gözlemle.','RV1 sabitken RV2 ayarını değiştir; iki girişin etkisini karşılaştır.','R2 negatif geri besleme ve ideal 3×12−A−B hesabını anlat.','İdeal hesap ile sanal ölçüm farklıysa doyum/çalışma sınırı etkisini değerlendir.'];
 }
 const purpose={in:'A adlı ilk bağımsız sanal giriş gerilimidir.',in2:'B adlı ikinci bağımsız sanal giriş gerilimidir.',g1:'+24 V/0 V sanal besleme kaynağıdır.',u1:'LM358P pin 8/4 beslenir; pin 2 IN−, pin 3 IN+, pin 1 OUT.',r1:'A girişini 10 kΩ üzerinden evirmeyen değil eviren pin 2 ye iletir.',r2:'OUT ile IN− arasında 10 kΩ negatif geri besleme oluşturur.',r5:'B girişini 10 kΩ üzerinden ilgili toplama düğümüne getirir.',r6:'12 V referansını 10 kΩ üzerinden IN+ girişine getirir.',ref1:'R3 10 kΩ üst referans bölücüdür.',ref2:'R4 10 kΩ alt referans bölücüdür.'};
 lesson.materials=materialRows(p).map(m=>purpose[m.componentId]?{...m,why:purpose[m.componentId]}:m);
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',twoInputOpampVirtual:true,titleTopologyIssue:null,titleTopologyStatus:'SOURCE_ALIGNED',independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,physicalAcceptance:false};
 lesson.safety='Yalnızca sanal düşük gerilimli laboratuvar; fiziksel donanım talimatı değildir.';
 if(!L.mq07Batch200?.reviewIds?.some(x=>x.id===lessonId&&x.reason==='MISSING_REQUIRED_SECOND_INPUT'))throw Error('Unexpected review baseline '+lessonId);
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==lessonId);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),lessonId];
}



/* MQ-07 first-200: genuine IR optical receiver/transmitter teaching stage.
   Reuse the proven low-voltage optical sensor graph without mutating its source.
   Physical separate TX/RX product and browser acceptance remain REVIEW. */
{
 const id='sensor-analog-apps-src-12',lesson=L.byId[id],reference=L.byId['sensor-analog-apps-src-22'];
 if(!lesson||!reference||lesson.project?.wires?.length||!reference.project?.wires?.length)
  throw Error('IR virtual optical teaching source not in expected state');
 const unresolved=L.mq07Batch200?.reviewIds?.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT');
 if(!unresolved)throw Error('IR title-topology review baseline missing');
 const p=clone(reference.project);
 const detector=p.components.find(c=>c.id==='s1'&&c.typeId==='sensor-through-beam');
 if(!detector||p.wires.length!==7)throw Error('IR optical graph expected 7 real wires');
 detector.ref='B1';detector.label='IR optik algılama modülü (sanal gönderici/alıcı)';
 detector.sensing={target:'plastic',distance:80,range:40,offset:0,auto:false};
 detector.tutorialPurpose='B1 sanal optik modülü kızılötesi verici/alıcı çiftinin algılama işlevini tek modelde gösterir; bu gerçek iki ayrı fiziksel cihazın üretici onayı değildir.';
 p.projectId='tutorial-session-source-'+id;
 p.name='Öğretici · '+lesson.title;
 p.tutorialLesson={id,topicId:lesson.topicId,phase:'demo',step:0,level:lesson.variant};
 lesson.project=p;lesson.workspaceMode=p.workspaceMode||'control';lesson.kind='wiring';
 lesson.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'Sanal terminalleri izle.',why:w.tutorialWhy||'Kayıtlı kontrol yolu tamamlanır.',color:w.color,role:w.role,size:w.size}));
 lesson.summary='IR alıcı-verici düzeneği kızılötesi ışıkla bir hedefin optik algılama alanına girip girmediğini anlamayı sağlar. Bu sanal modelde B1 hedefi gördüğünde K1 rölesi ve H1 göstergesi etkinleşir; hedef uzaklaşınca ikisi de kapanır. Tek parça B1 modeli gerçek verici/alıcı donanım çiftinin fiziksel çizimi değildir.';
 lesson.explanation='Bu dersin amacı, optik algılama bilgisinin bir elektrik kumandasına nasıl dönüştüğünü öğrenmektir. Sanal G1 kaynağının +24 V ucu B1/BN kahverengi besleme girişine, 0 V ucu B1/BU mavi referansına bağlanır. B1 optik modülü hedefin varlığını simüle eder: hedef 80 mm uzaktayken 40 mm sanal algılama sınırının dışındadır; algılama yoktur. Hedef 2 mm yakına getirildiğinde B1/BK siyah PNP çıkışı K1/A1 bobin ucuna kumanda verir; bobinin K1/A2 ucu 0 V hattındadır. Röle enerjilenince K1/13 ve K1/14 normalde açık kontakları birleşir. Kaynağın +24 V hattı K1/13 üzerinden, K1/14 ise H1/X1 üzerinden lambaya ulaşır; H1/X2 dönüşü 0 V hattındadır. Böylece optik hedef yaklaştığında gösterge yanar, hedef 80 mm uzağa geri taşındığında söner. B1 gönderici ve alıcının optik işlevini tek sanal bileşende temsil eder: ayrı gerçek verici/alıcı optiği, ışın güvenilirliği ve üretici ölçüleri henüz doğrulanmış değildir. Yalnız düşük gerilimli uygulama simülasyonunda gözlem yap; gerçek tesisat talimatı değildir.';
 lesson.learningGoal='B1/BN-BU beslemesini, BK ile K1/A1 röle kumandasını, K1/13-14 kontağını ve H1/X1-X2 yük yolunu açıklayıp 80→2→80 mm sanal hedef hareketinde neden OFF→ON→OFF sonucu oluştuğunu kendi sözleriyle anlatabilmek.';
 lesson.beginnerSteps=[
  'Önce B1 algılayıcıyı ve H1 göstergeyi bul. Devrenin amacı bir hedefin algılandığını göstermek.',
  'Sanal G1 kaynağından B1/BN (+24 V) ve B1/BU (0 V) bağlantılarını, sonra B1/BK → K1/A1 hattını izle.',
  'K1/A2 → 0 V dönüşünü ve ayrı yük yolunu bul: +24 V → K1/13 → K1/14 → H1/X1 → H1/X2 → 0 V.',
  'B1 hedefi plastik ve 80 mm uzakta iken sanal devreyi çalıştır; K1 ve H1 kapalı olmalıdır.',
  'Sanal hedefi 2 mm yakına taşı. B1 algıladığında K1 bobini ve H1 lambasının birlikte açılmasını gözle.',
  'Hedefi 80 mm uzağa götür. OFF→ON→OFF değişiminin neden röle kontağını açıp kapattığını açıklayıp kaydet.'
 ];
 const purpose={
  g1:'Yalnız sanal 24 VDC enerji kaynağı; sensör besleme ve lamba devresine enerji sağlar.',
  s1:'Kızılötesi gönderici/alıcı işlevinin birleştirilmiş sanal optik modelidir; 40 mm algılama sınırı eğitim ayarıdır.',
  k1:'B1/BK sanal PNP sinyali gelince K1/A1-A2 bobini enerjilenir.',
  ka1:'K1/13-14 normalde açık kontağı, bobin enerjilenince lambanın akım yolunu tamamlar.',
  h1:'H1/X1-X2 lamba, hedef algılandığında röle kontağının kapandığını gösterir.'
 };
 lesson.materials=materialRows(p).map(m=>purpose[m.componentId]?{...m,why:purpose[m.componentId]}:m);
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07Batch:'001_200',titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_OPTICAL_SOURCE_ALIGNED',
  irVirtualGraphRepair:true,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,physicalAcceptance:false,
  separateTransmitterReceiverVerified:false};
 lesson.safety='Yalnız 24 VDC sanal eğitim; gerçek IR verici/alıcı ve optik mesafe ürün ölçüleri henüz kabul edilmedi.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
}

/* MQ-07: Piezo is a passive two-electrode voltage transient, not a PNP proximity sensor. */
{
 const id='sensor-analog-apps-src-08',l=L.byId[id];
 if(!l||!L.mq07Batch200?.reviewIds?.some(x=>x.id===id&&x.reason==='TITLE_MISSING_REQUIRED_PART'))
  throw Error('Piezo: canonical REVIEW baseline missing');
 if(!l.project?.components?.some(c=>c.typeId==='proximity')||l.project.components.some(c=>/piezo/i.test(c.typeId)))
  throw Error('Piezo: baseline source graph changed');
 const p=base(id,l.title);
 p.components=[
  C('pz','tutorial-piezo',260,255,'B1','Piezoelektrik eleman · sanal iki elektrot',{piezoTapAt:null,piezoTapMv:100}),
  C('r1','resistor',545,265,'R1','1 MΩ ölçüm yükü',{resistance:1000000}),
  C('v1','unit-ut33d-plus',765,280,'V1','UNI-T UT33D+ · DCV 200 mV',{meterPosition:1}),
  C('v1-red','test-probe-red',785,495,'PRV1','Kırmızı sanal prob',{probeTarget:{c:'pz',p:'+'}}),
  C('v1-black','test-probe-black',985,495,'PBV1','Siyah sanal prob',{probeTarget:{c:'pz',p:'−'}})
 ];
 p.wires.push(
  W('pz','+','r1','1','B1/+ → R1/1','Piezo elektrodu sanal ölçüm yükünün ilk ucuna bağlanır.','#43a047','SIGNAL'),
  W('r1','2','pz','−','R1/2 → B1/−','Direnç, iki elektrot arasındaki sanal elektriksel yük yolunu tamamlar.','#111827','0V'),
  W('v1','V','v1-red','PLUG','V1/VΩmA → kırmızı prob','DCV 200 mV ölçümünde kırmızı prob VΩmA girişindedir.','#e53935','MEASURE'),
  W('v1','COM','v1-black','PLUG','V1/COM → siyah prob','Siyah prob COM referans girişindedir.','#111827','MEASURE')
 );
 p.projectId='tutorial-session-source-'+id;p.name='Öğretici · '+l.title;
 p.tutorialLesson={id,topicId:l.topicId,phase:'demo',step:0,level:l.variant};
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary='B1 piezoelektrik sensörün kısa mekanik darbede geçici elektrik gerilimi üretmesini ve darbe bittikten sonra sönmesini incele. Bu, harici besleme gerektiren 24 V PNP yakınlık algılama rölesi değil; iki elektrotlu sanal piezo eğitim eşdeğeridir.';
 l.explanation='B1 piezo elemanının + ve − elektrotları arasındaki mekanik şekil değişimi elektrik yükünün yer değiştirmesine ve kısa süreli potansiyel farkına neden olabilir. B1/+ → R1/1 ve R1/2 → B1/− bağlantıları 1 MΩ sanal yük yolunu oluşturur. UNI-T V1’in VΩmA girişi kırmızı PRV1/PLUG kablosuna, COM girişi siyah PBV1/PLUG kablosuna bağlıdır; iki probun uçları B1/+ ve B1/− elektrotlarına temas eder. UT33D+ DCV 200 mV kademesi düşük genlikli sanal gerilimi gösterir. “Sanal darbe uygula” komutuyla model varsayımsal +100 mV ilk EMK üretir; eğitimde 220 ms sönüm zaman sabiti kullanılır. Yaklaşık 1,6 saniye sonra model sıfıra döner. Bu sayılar ölçülmüş üretici parametreleri değildir ve 1 MΩ yükle gerçek piezo kapasitansının hesaplanmış RC sonucu olarak sunulmaz. Darbe yokken sabit gerilim üretilmez. Sanal sensörde harici 24 V besleme, BN/BU/BK terminalleri, endüktif metal hedef algılaması ve K1 rölesi bulunmaz. Model kalibre edilmiş kuvvet ölçümü veya tam SPICE piezo devresi değildir.';
 l.learningGoal='B1/+ ve B1/− piezo elektrotlarını, R1 yükünü ve V1 DCV 200 mV ölçümünü doğru eşlemek; sanal darbe → sönüm → sıfır sonucunu açıklamak.';
 l.beginnerSteps=[
  'B1 üzerindeki + ve − elektrotlarını bul; bu elemanda BN/BU/BK PNP sensör uçları bulunmaz.',
  'B1/+ → R1/1 ve R1/2 → B1/− bağlantılarını takip et; 1 MΩ yük elemanını tanı.',
  'V1 kırmızı probunun VΩmA, siyah probunun COM girişinde olduğunu ve iki probun B1 elektrotlarına temas ettiğini doğrula.',
  'Sanal darbe öncesinde UT33D+ göstergesinin sıfıra yakın olduğunu gözlemle.',
  'Sanal darbe uygula; mV değerini 150 ms sonraki değerle karşılaştır.',
  '1000 ms sonraki sönümü incele; sanal 100 mV değerini gerçek bir üretici hassasiyeti olarak sunma.'
 ];
 const reasons={pz:'B1 iki elektrotlu geçici EMK kaynağıdır; dijital PNP çıkışı veya harici 24 V besleme yoktur.',
  r1:'R1 1 MΩ sanal dirençtir; iki piezo elektrodu arasında yük/ölçüm yolu sağlar.',
  v1:'V1 UT33D+ DCV 200 mV kademesinde sanal küçük geçici gerilimi ölçer.',
  'v1-red':'Kırmızı prob VΩmA girişinden B1/+ elektroduna temas eder.',
  'v1-black':'Siyah prob COM girişinden B1/− elektroduna temas eder.'};
 l.materials=materialRows(p).map(m=>({...m,why:reasons[m.componentId]||m.why}));
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyStatus:'VIRTUAL_PIEZO_SOURCE_ALIGNED',titleTopologyIssue:null,
  piezoVirtualSource:'TWO_TERMINAL_PASSIVE_TRANSIENT_EMF',
  previousReason:'TITLE_MISSING_REQUIRED_PART',manufacturerCalibrationVerified:false,
  physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal düşük gerilimli piezo gösterimi. Gerilim ve sönüm süresi öğretici varsayımdır; gerçek donanım testi veya üretici doğrulaması değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
}


/* MQ-07: two separate physical RC/BJT topology exercises.  The capacitor's
   implicit-Euler state is advanced by the existing native current-model solver.
   These are educational 24 V virtual circuits, not manufacturer SPICE models. */
for(const spec of [
 {id:'electronic-switching-src-06',mode:'on',chargeOhm:47000,bleedOhm:10000,capFarad:.001,chargeLabel:'47 kΩ',bleedLabel:'10 kΩ',capLabel:'1000 µF'},
 {id:'electronic-switching-src-07',mode:'off',chargeOhm:1000,bleedOhm:2000,capFarad:.0001,chargeLabel:'1 kΩ',bleedLabel:'2 kΩ',capLabel:'100 µF'}
]){
 const l=L.byId[spec.id],id=spec.id;
 if(!l||!L.mq07Batch200?.reviewIds?.some(x=>x.id===id&&x.reason==='NO_RC_TIMING_EVIDENCE'))
  throw Error('MQ07 RC canonical baseline not in review: '+id);
 if(!l.project?.components.some(x=>x.typeId==='bd139-npn')||l.project.components.some(x=>x.typeId==='capacitor'))
  throw Error('MQ07 RC unexpected source graph: '+id);
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',80,150,'G1','Sanal 24 VDC masa kaynağı',{dcVoltage:24}),
  C('s1','push-no',285,160,'S1','Sanal START / bırak butonu'),
  C('rb','resistor',475,160,'RB','Şarj direnci · '+spec.chargeLabel,{resistance:spec.chargeOhm}),
  C('c1','capacitor',680,195,'C1','Depolama kondansatörü · '+spec.capLabel,{capacitance:spec.capFarad}),
  C('rp','resistor',880,190,'RP','Deşarj direnci · '+spec.bleedLabel,{resistance:spec.bleedOhm}),
  C('q1','bd139-npn',690,405,'Q1','BD139 NPN anahtar'),
  C('rl','resistor',900,410,'RL','1 kΩ kolektör yükü',{resistance:1000}),
  C('v1','unit-ut33d-plus',1100,160,'V1','UNI-T UT33D+ · DCV 20 V',{meterPosition:3}),
  C('v1-red','test-probe-red',1050,370,'PRV1','Kırmızı prob',{probeTarget:{c:'c1',p:'1'}}),
  C('v1-black','test-probe-black',1260,375,'PBV1','Siyah prob',{probeTarget:{c:'c1',p:'2'}})
 ];
 p.wires.push(
  W('g1','P','s1','13','G1/P → S1/13','Sanal +24 V besleme normalde açık S1 butonuna ulaşır.'),
  W('s1','14','rb','1','S1/14 → RB/1','S1 basıldığında RB üzerinden kondansatör düğümüne şarj akımı akar.'),
  W('rb','2','c1','1','RB/2 → C1/1','C1 üst elektrodu zamanla potansiyel kazanır.','#43a047','SIGNAL'),
  W('rb','2','q1','B','RC düğümü → Q1/B','Şarj gerilimi BJT baz eşiğine ulaştığında NPN iletime geçebilir.','#43a047','SIGNAL'),
  W('rp','1','c1','1','RP/1 → C1/1','RP, C1 üst elektroduna bağlı paralel sönümleme yoludur.'),
  W('rp','2','g1','M','RP/2 → G1/M','Buton bırakıldığında C1 gerilimi RP üzerinden boşalır.','#111827','0V'),
  W('c1','2','g1','M','C1/2 → G1/M','Kondansatörün alt elektrodu 0 V referansıdır.','#111827','0V'),
  W('q1','E','g1','M','Q1/E → G1/M','NPN emitter 0 V sanal referans yoluna bağlıdır.','#111827','0V'),
  W('g1','P','rl','1','G1/P → RL/1','RL kolektör yükü +24 V kaynağa bağlıdır.'),
  W('rl','2','q1','C','RL/2 → Q1/C','Q1 iletimdeyken kolektör yükünden akım akar.'),
  W('v1','V','v1-red','PLUG','V1/VΩmA → kırmızı prob','Kondansatör geriliminin DCV 20 V ölçümü için kırmızı prob girişidir.','#e53935','MEASURE'),
  W('v1','COM','v1-black','PLUG','V1/COM → siyah prob','Siyah prob kondansatör alt elektrodundaki 0 V noktasına temas eder.','#111827','MEASURE')
 );
 p.projectId='tutorial-session-source-'+id;
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 const focus=spec.mode==='on'?'Gecikmeli açmada C1 şarj olurken baz gerilimi eşik altında kalır; Q1 başlangıçta OFF durumundadır.':'Gecikmeli kapamada C1 depoladığı enerjiyi RP üzerinden boşaltırken, S1 bırakılmış olsa bile Q1 bir süre ON kalabilir.';
 l.summary=focus+' Şebeke üzerinde değil, gerçek RC durumunu kullanan 24 V sanal BD139 dersinde bas-bırak zaman çizelgesini gözlemle.';
 l.explanation='Sanal G1/P (+24 V) → S1/13–14 → RB/1–2 ('+spec.chargeLabel+') → C1/1 ve Q1/B düğümüne gider. C1 ('+spec.capLabel+') alt elektrodu C1/2 → G1/M yoluyla 0 V’a döner. RP ('+spec.bleedLabel+') C1/1 ile 0 V arasında paraleldir: S1 açıldığında depolanan yük bu yoldan azalır. Q1 BD139 emitter E → 0 V, collector C → RL/2, RL/1 → +24 V. BJT baz–emitter gerilimi simülasyon eşiği yaklaşık 0,62 V’u geçtiğinde kolektör anahtarlaması açılır. V1 UNI-T UT33D+ DCV 20 V konumundadır; VΩmA ve COM girişlerindeki fiziksel kırmızı/siyah problar C1/1 ve C1/2 elektrotlarını ölçer. Bu devrede süre, RB, RP, C1, başlangıç gerilimi ve BJT eşiğiyle değişir; yalnız RB×C1 hesabını doğrudan anahtarlama süresi ilan etme. '+'Sanal buton S1 ve C1 durumları orijinal simülasyon çözücüsüyle 250 ms aralıklarda ilerletilir. '+(spec.mode==='on'?'Basıldıktan sonra başlangıç OFF → eşik sonrası ON geçişini izle.':'Basılı durumda hızlı ON olduktan sonra bırakmayı izle; gerilim azalana kadar ON kalır, sonra OFF olur.')+' Değerler üretici veri sayfasına göre kalibre edilmiş bir zamanlama veya fiziksel devre güvenlik kabulü değildir.';
 l.learningGoal='S1/13-14, RB/1-2, C1/1-2, RP/1-2, Q1/B-C-E, RL/1-2 ve V1 prob temaslarını bulup '+(spec.mode==='on'?'gecikmeli AÇMA':'gecikmeli KAPAMA')+' durum değişimini V1 ve Q1 üzerinden doğrulamak.';
 l.beginnerSteps=[
  'Sanal G1/P → S1/13–14 → RB/1-2 kablolarını ve C1/1 üzerinden C1/2 → 0 V hattını izle.',
  'Q1/B, Q1/E ve Q1/C terminallerini; RL/1–2 kolektör yük yolunu ayırt et.',
  'RP direncinin C1 ile paralel bağlantısının buton bırakılınca enerji boşalma yolu olduğunu göster.',
  'V1 kırmızı/siyah problarını C1/1 ve C1/2 uçlarında doğrula; DCV 20 V kademesini seç.',
  '“Sıfırla” düğmesiyle kapasitörün ve Q1’in başlangıç değerlerini sıfırla.',
  'S1’e sanal bas–tut komutunu uygula; Q1 ON zamanını ve C1 gerilim değişimini izle.',
  'S1’i bırak; C1 deşarjının ve Q1 OFF geçişinin neden aynı anda oluşmadığını gözlemle.',
  'Bu sonuçları yalnız sanal solver davranışı olarak yorumla; üretici fiziksel testini PASS sayma.'
 ];
 const purpose={g1:'G1 düşük gerilimli sanal DC enerjiyi sağlar.',
  s1:'S1 13–14 butonu RC ağını beslemeye bağlar veya ayırır.',
  rb:'RB '+spec.chargeLabel+' ile C1 şarj akımını sınırlar.',
  c1:'C1 '+spec.capLabel+' kapasitansıyla gerçek sanal depolanan gerilimi taşır.',
  rp:'RP '+spec.bleedLabel+' ile C1 elektriksel deşarj yolu oluşturur.',
  q1:'Q1 BD139 B/C/E terminalinde baz eşiğine bağlı anahtar durumudur.',
  rl:'RL 1 kΩ, Q1 kolektör yoluna seri sanal yük oluşturur.',
  v1:'V1 UT33D+ 20 V DCV kademesiyle C1 gerilimini ölçer.',
  'v1-red':'Kırmızı prob C1/1 üst elektroduna temas eder.',
  'v1-black':'Siyah prob C1/2 alt elektroduna temas eder.'};
 l.materials=materialRows(p).map(m=>({...m,why:purpose[m.componentId]||m.why}));
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_RC_SOURCE_ALIGNED',
  mq07RcTiming:{mode:spec.mode,chargeOhm:spec.chargeOhm,bleedOhm:spec.bleedOhm,capacitanceF:spec.capFarad,
    nativeSolverRequired:true,stepMs:250,manufacturerTimeAcceptance:false},
  previousReason:'NO_RC_TIMING_EVIDENCE',physicalAcceptance:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız simüle edilen düşük gerilimli RC/BJT eğitim devresi. 24 V ve RC sayıları model varsayımıdır; gerçek donanım/üretici kabulü değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
}

/* MQ-07 LDR dimmer: a wired 12 VDC linear-pass teaching model.
   The native nodal solver resolves real LDR/resistor gate voltage and lamp
   power through the bounded MOSFET channel, without inventing AC phase control. */
{
 const id='sensor-analog-apps-src-11',l=L.byId[id];
 if(!l||!L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='MISSING_DIMMER_POWER_STAGE'))
  throw Error('MQ07 LDR dimmer REVIEW baseline missing');
 if(!l.project.components.some(c=>c.typeId==='ldr-gl5528')||l.project.components.some(c=>c.typeId==='mosfet-n'))
  throw Error('MQ07 LDR dimmer source has changed unexpectedly');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',85,160,'G1','12 VDC sanal laboratuvar beslemesi',{dcVoltage:12}),
  C('s1','ldr-gl5528',335,165,'B1','GL5528 LDR · ortam aydınlığı',{illuminationLux:10}),
  C('r1','resistor',335,335,'R1','10 kΩ kontrol bölücü',{resistance:10000}),
  C('q1','mosfet-n',770,310,'Q1','N-kanal MOSFET · sanal lineer sürücü',{virtualLdrDimmer:true,physicalAcceptance:false}),
  C('h1','standard-light',990,245,'H1','12 V sanal dirençli lamba',{resistance:120,lampRatedVoltage:12,virtualLdrLamp:true})
 ];
 p.wires.push(
  W('g1','P','s1','1','G1/P → B1/1','12 V sanal kaynak LDR bölücünün üst kolunu besler.','#8b5a2b','DC+'),
  W('s1','2','r1','1','B1/2 → R1/1','Işığa göre direnç değişimi kontrol düğümünü oluşturur.','#43a047','SIGNAL'),
  W('r1','2','g1','M','R1/2 → G1/M','10 kΩ bölücü alt kolu 0 V referansına döner.','#111827','0V'),
  W('s1','2','q1','G','Kontrol düğümü → Q1/G','Gerçek sanal düğüm gerilimi MOSFET G terminalini sürer.','#43a047','SIGNAL'),
  W('g1','P','h1','X1','G1/P → H1/X1','Yük güç yolu kontrol bölücüsünden ayrıdır.','#8b5a2b','DC+'),
  W('h1','X2','q1','D','H1/X2 → Q1/D','Lamba akımı MOSFET drain ucundan geçer.'),
  W('q1','S','g1','M','Q1/S → G1/M','Sürücü üzerinden gelen yük akımı 0 V dönüşüne gider.','#111827','0V')
 );
 p.projectId='tutorial-session-source-'+id;
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary='12 VDC sanal devrede B1 LDR, R1 bölücü ve Q1 N-kanal MOSFET lineer güç katı H1 lambasının akımını değiştirir. Daha aydınlık ortamda GL5528 direnci küçülür, Q1/G gerilimi yükselir ve H1 gücü artar. Bu AC triyak faz-açısı dimmeri değildir.';
 l.explanation='Bu ders mevcut AC faz kontrolünü taklit etmez: düşük gerilimli DC lineer karartmayı öğretir. Kontrol kolunda G1/P (12 V) → B1/1-2 GL5528 LDR → R1/1-2 (10 kΩ) → G1/M vardır. B1/2–R1/1 düğümü Q1/G terminaline gider. Aydınlık yükseldikçe LDR direnci gerçek sanal GL5528 direnç bağıntısına göre düşer ve Q1 gate gerilimi yükselir. Güç kolu bağımsızdır: +12 V → H1/X1–X2 (120 Ω örnek dirençli lamba) → Q1/D–S → G1/M. Q1, yalnız bu ders için atanmış, gate gerilimiyle kanal direnci değişen sanal N-kanal lineer-pass eşdeğeridir; diğer MOSFET modelini değiştirmez. Orijinal elektriksel düğüm çözücüsü gate gerilimini kontrol bölücüsünden, lamba akım ve gücünü güç yolundan hesaplar. Ortalama lamba parlaklık yüzdesi nominal 12 V / 120 Ω güç referansına göre hesaplanır. Sanal Q1 kaybı I²Rdir, yüksek ara dirençte fiziksel ısınma olabilir; bu nedenle gerçek cihaz ve soğutucu seçimi burada doğrulanmış değildir. Eğitsel noktalar: 0,1 lux ≈ %0, 10 lux ≈ %12, 100 lux ≈ %70, 1000 lux ≈ %98. Bu yüzdeler hesaplanan örnek modelin çıktısıdır, fiziksel lümen veya üretici verisi değildir. Gerçek AC faz açısı dimmeri ve kalibre edilmiş fiziksel Q1 güç davranışı hâlâ kabul edilmemiştir.';
 l.learningGoal='B1 LDR–R1 gerilim bölücü kontrol kolunu Q1/G terminaline; H1/X1-X2–Q1/D-S kolunu ayrı güç yoluna bağlamak, aydınlık değişiminde hesaplanan akım/güç/parlaklığı ölçüp açıklamak.';
 l.beginnerSteps=[
  'B1 GL5528 LDR ve R1 10 kΩ ile 12 V sanal kontrol gerilim bölücüsünü bul.',
  'B1/2–R1/1 ortak düğümünü Q1/G terminaline bağla; Q1/S referansının G1/M olduğunu göster.',
  'G1/P → H1/X1 → H1/X2 → Q1/D → Q1/S → G1/M güç yolunu ayrıca izle.',
  '0,1 lux karanlık sanal ölçümünü çalıştır; Q1/G ve lamba gücünün neden düşük olduğunu gözlemle.',
  '10, 100 ve 1000 lux sanal değerlerini sırayla uygula; Q1/G, H1 akımını ve parlaklığı karşılaştır.',
  'Kontrol kolu veya güç kolu kesilirse lamba akımının nasıl etkilendiğini incele.',
  'Bu DC lineer modelin gerçek AC triyak dimmer veya kalibre IRF540N/SPICE güç katı olmadığını açıkla.'
 ];
 const why={
  g1:'Yalnız 12 VDC sanal masa kaynağı; AC şebeke değildir.',
  s1:'B1 GL5528 LDR, aydınlık arttıkça kendi simüle edilen gerçek direnç bağıntısıyla daha küçük direnç verir.',
  r1:'R1 10 kΩ, LDR ile birlikte gate kontrol gerilimini oluşturur.',
  q1:'Q1 G/D/S sanal N kanal lineer güç elemanı; gate gerilimine bağlı kanal direnci gerçek kaynak kodunda düğüm çözücüye eklenir.',
  h1:'H1 sanal 12 V / 120 Ω dirençli yük; I, V ve P çözümünden eğitim parlaklığı hesaplanır.'
 };
 l.materials=materialRows(p).map(m=>({...m,why:why[m.componentId]||m.why}));
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_DC_LINEAR_DIMMER_SOURCE_ALIGNED',
  ldrVirtualDimmer:{source:'GL5528_REAL_NUMERIC_RESISTANCE',power:'N_MOSFET_GATE_DEPENDENT_LINEAR_CHANNEL',output:'LAMP_MEASURED_POWER',supplyV:12,acPhaseControl:false},
  previousReason:'MISSING_DIMMER_POWER_STAGE',physicalAcceptance:false,
  manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 12 VDC sanal lineer karartma eğitim eşdeğeri; gerçek MOSFET SOA/termal güvenlik, fiziksel kalibrasyon ve AC şebeke dimmer onayı yoktur.';
 // SC30 source correction: no LM358 package exists in this new DC MOSFET project.
 // Use the selected physical product IDs, not obsolete pre-repair component IDs.
 l.pedagogyReview.componentIds=p.components.map(c=>c.typeId);
 delete l.pedagogyReview.lm358PhysicalPackage;
 delete l.pedagogyReview.realPackagePolicy;
 l.pedagogyReview.ldrVirtualDimmer.domain='DC_12V_ONLY';
 l.pedagogyReview.ldrVirtualDimmer.manufacturerPowerStageVerified=false;
 l.pedagogyReview.ldrVirtualDimmer.calibratedLuminanceVerified=false;
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
}


/* MQ-07: classify all 51 previously reference-only quiz scenes.  These
   buckets do NOT promote a quiz to accepted working simulation. */
{
 const original=L.mq07Batch200?.reviewIds||[];
 if(original.length!==51||original.some(x=>x.reason!=='NO_WIRED_CIRCUIT'))throw Error('MQ07 triage source ledger changed');
 const protectedIds=[
  'installation-grounding-src-03','installation-grounding-src-04',
  'installation-grounding-src-05','installation-grounding-src-06',
  'installation-grounding-src-09','installation-systems-src-07',
  'sensor-analog-apps-src-09','sensor-analog-apps-src-17',
  'sensor-analog-apps-src-18','sensor-analog-apps-src-19',
  'electronic-switching-src-08','opamp-apps-src-16',
  'oscillator-filter-apps-src-11','oscillator-filter-apps-src-12'
 ];
 const protect=new Set(protectedIds);
 for(const id of protectedIds){if(!original.some(x=>x.id===id)||L.byId[id]?.kind!=='quiz')throw Error('MQ07 protected concept changed: '+id)}
 const pending=original.map(x=>x.id).filter(id=>!protect.has(id));
 L.mq07Batch200.noWireTriage={
  originalTotal:51,conceptPreservedIds:protectedIds,
  applicationRepairIds:pending,requiredEvidence:'WORKING_TERMINAL_GRAPH_PLUS_NATIVE_DYNAMIC_SOLVER',
  rule:'Kavramsal quizler sırf kablo yok diye değiştirilmez. Uygulama adayları canlı topoloji, solver ve MQ-00 onayı olmadan DONE değildir.'
 };
}
{
 const id='electronic-switching-src-03',l=L.byId[id];
 if(!l||l.kind!=='quiz'||!L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))
  throw Error('MQ07 DC motor reversal canonical quiz source not in REVIEW');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',70,240,'G1','Sanal 24 VDC kaynak',{dcVoltage:24}),
  C('sw','push-no',340,90,'S1','Sanal yön değiştirme butonu',{state:false}),
  C('k1','coil-relay',610,90,'K1','24 V DC röle bobini'),
  C('ka','contact-both',370,335,'K1','K1A değiştirici kontağı'),
  C('kb','contact-both',630,335,'K1','K1B değiştirici kontağı'),
  C('m1','motor-dc',900,370,'M1','24 V sanal DC motor')
 ];
 p.wires.push(
  W('g1','P','sw','13','G1/P → S1/13','S1 butonunun sanal +24 V kontrol girişidir.','#8b5a2b','+24V'),
  W('sw','14','k1','A1','S1/14 → K1/A1','S1 basılırsa K1 bobini enerjilenir.','#43a047','CONTROL'),
  W('k1','A2','g1','M','K1/A2 → G1/M','Bobin dönüşü 0 V referansıdır.','#111827','0V'),
  W('g1','P','ka','21','G1/P → K1A/21','K1A normalde kapalı tarafta M1 pozitif kutbuna +24 V verir.','#8b5a2b','+24V'),
  W('g1','P','kb','13','G1/P → K1B/13','K1B normalde açık tarafta M1 ters dönüş için +24 V verir.','#8b5a2b','+24V'),
  W('g1','M','ka','13','G1/M → K1A/13','K1A normalde açık tarafta ters kutup 0 V verir.','#111827','0V'),
  W('g1','M','kb','21','G1/M → K1B/21','K1B normalde kapalı tarafta 0 V verir.','#111827','0V'),
  W('ka','11','m1','+','K1A/11 → M1/+','Ortak A kontağı M1/+ kutbuna bağlanır.','#43a047','CONTROL'),
  W('kb','11','m1','−','K1B/11 → M1/−','Ortak B kontağı M1/− kutbuna bağlanır.','#43a047','CONTROL')
 );
 p.projectId='tutorial-session-source-'+id;
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary='24 VDC yalnız sanal eğitim modelinde bir K1 röle bobini aynı anda K1A/K1B iki değiştirici kontağı kumanda eder. S1 bırakılmışken M1 kutbu +/− ve ileri, basılmışken −/+ ve geri olur. Motor yönü sahte animasyonla değil gerçek devre kutupluluğuyla çözülür.';
 l.explanation='Bu devrede kontrol ve yük kontakları ayrıdır. Kontrol yolu: sanal G1/P → S1/13-14 → K1/A1, K1/A2 → G1/M. K1A/11 ve K1B/11 ortak terminalleri M1/+ ve M1/− motor uçlarına gider. K1 bobini enerjisizken (normal durum) K1A/11-21 ve K1B/11-21 kapalıdır; K1A/21 +24 V, K1B/21 0 V olduğundan motor ileri döner. S1 basılı iken K1 enerjilenir, K1A/11-13 ve K1B/11-13 kapanır; K1A/13 0 V ve K1B/13 +24 V olduğundan motor kutupluluğu tersine döner. Kontakların aynı K1 referansını paylaşması iki kutbun birlikte değiştirilmesi için zorunludur. Bu bir düşük gerilimli ideal değiştirici röle/motor sanal modelidir; gerçek kontaktaki geçiş boşluğu, ters akım darbeleri, mekanik frenleme, kilitleme, yük altında anlık tersleme ve bobin diyodu güvenliği modellenmiş değildir. Gerçek motor veya tesisat üzerinde doğrudan uygulama talimatı değildir.';
 l.learningGoal='K1/A1-A2 röle bobinini, K1A/K1B 11–13–21 kontaklarını ve M1/+–M1/− kutup değişimini açıklamak; sanal S1 OFF→ON→OFF dizisinde motor _spin işaretinin +1→−1→+1 olmasını özgün solver ile göstermek.';
 l.beginnerSteps=[
  'Yalnız sanal 24 V G1 ve M1 motor modelini bul; S1 butonunun bobine bağlı kontrol yolu olduğunu göster.',
  'K1 bobini ile K1A ve K1B kontaklarının aynı K1 referansını paylaştığını doğrula.',
  'S1 bırakılmışken K1A/11–21 ve K1B/11–21 normal kapalı kontak yolunu incele.',
  'İleri motor kutupluluğunun M1/+ = +24 V ve M1/− = 0 V olduğunu sanal solver ile gözlemle.',
  'Sanal S1 butonuna bas; iki ortak kontağın 11–13 tarafına geçtiğini ve motor spin işaretinin ters döndüğünü kontrol et.',
  'S1’i bırakıp ileri dönüşün geri geldiğini göster. Fiziksel yük altında ani yön terslemenin burada güvenlik doğrulaması yapılmadığını belirt.'
 ];
 const purpose={
  g1:'G1 yalnız sanal 24 VDC kaynak; gerçek pano veya şebeke beslemesi değildir.',
  sw:'S1 13–14 normalde açık sanal buton K1 bobinini besler.',
  k1:'K1 A1–A2 kumanda bobini iki mekanik değiştirici kontağı aynı referansla sürer.',
  ka:'K1A/11–21 (NC), 11–13 (NO) ilk motor kutbunun seçicisidir.',
  kb:'K1B/11–21 (NC), 11–13 (NO) ikinci motor kutbunun seçicisidir.',
  m1:'M1/+ ve M1/− kutupluluk farkına göre ileri/geri dönüş işareti alan ideal DC motor modelidir.'
 };
 l.materials=materialRows(p).map(m=>({...m,why:purpose[m.componentId]||m.why}));
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  previousReason:'NO_WIRED_CIRCUIT',titleTopologyIssue:null,
  titleTopologyStatus:'VIRTUAL_DUAL_CHANGEOVER_MOTOR_REVERSAL_ALIGNED',
  relayReversalVirtual:{coilRef:'K1',contactIds:['ka','kb'],motorId:'m1',sourceV:24,
    forwardSpin:1,reverseSpin:-1,physicalInterlockVerified:false,mechanicalTransientVerified:false},
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,
  manufacturerCalibrationVerified:false,physicalAcceptance:false};
 l.safety='Yalnız sanal 24 VDC motor yönü eğitim modeli. Gerçek motorda aniden yön değiştirme, kilitleme, kontaktör seçimi ve fiziksel güvenlik bu dersin simülasyonunda doğrulanmamıştır.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[id];
}


/* MQ-07 / FET delay-stop: replace the legacy two-symbol unwired JFET quiz
   with a virtual 12 VDC MOSFET + physical terminal-based RC hold-up circuit.
   This is a simplified threshold-switch educational MOSFET, not J113 SPICE. */
{
 const id='electronic-switching-src-09',l=L.byId[id];
 if(!l||l.kind!=='quiz'||!L.mq07Batch200?.reviewIds?.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))
  throw Error('MQ07 delay-stop canonical review baseline missing');
 if(!L.mq07Batch200.noWireTriage?.applicationRepairIds?.includes(id))
  throw Error('MQ07 delay-stop target not in application-repair triage');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',70,205,'G1','Sanal 12 V DC kaynağı',{dcVoltage:12}),
  C('sw','push-no',300,155,'S1','Bas / bırak kontrol butonu',{state:false}),
  C('rc','resistor',505,130,'RŞ','1 kΩ şarj direnci',{resistance:1000}),
  C('c1','capacitor',710,200,'C1','100 µF enerji depolama',{capacitance:.0001}),
  C('rd','resistor',900,190,'RD','20 kΩ kapı deşarj direnci',{resistance:20000}),
  C('q1','mosfet-n',785,430,'Q1','N-kanal FET · sanal eşik anahtarı',{mq07FetRcDelay:true,physicalAcceptance:false}),
  C('h1','standard-light',1090,385,'H1','12 V sanal yük lambası',{resistance:120}),
  C('v1','unit-ut33d-plus',1130,115,'V1','UNI-T UT33D+ · DCV 20 V',{meterPosition:3}),
  C('v1-red','test-probe-red',1130,270,'PRV1','Kırmızı sanal prob',{probeTarget:{c:'c1',p:'1'}}),
  C('v1-black','test-probe-black',1335,265,'PBV1','Siyah sanal prob',{probeTarget:{c:'c1',p:'2'}})
 ];
 p.wires.push(
  W('g1','P','sw','13','G1/P → S1/13','12 V sanal kaynak butonun 13 girişine ulaşır.'),
  W('sw','14','rc','1','S1/14 → RŞ/1','Buton basılınca şarj akımı RŞ üzerinden akar.'),
  W('rc','2','c1','1','RŞ/2 → C1/1','Şarj edilen C1 üst elektrodudur.','#43a047','SIGNAL'),
  W('rc','2','q1','G','RC düğümü → Q1/G','Depolanmış elektrik potansiyeli N-kanal FET gate ucunda kalır.','#43a047','SIGNAL'),
  W('c1','2','g1','M','C1/2 → G1/M','Kondansatörün alt elektrodu sanal sıfır volt referansıdır.','#111827','0V'),
  W('rd','1','c1','1','RD/1 → C1/1','20 kΩ boşalma direnci gate düğümüne bağlıdır.'),
  W('rd','2','g1','M','RD/2 → G1/M','Bırakınca gate yükü RD üzerinden azalır.','#111827','0V'),
  W('q1','S','g1','M','Q1/S → G1/M','Kaynak (source) ucu 0 V referansına döner.','#111827','0V'),
  W('g1','P','h1','X1','G1/P → H1/X1','Lamba gücü kontrol kapasitöründen değil beslemeden alınır.'),
  W('h1','X2','q1','D','H1/X2 → Q1/D','Lamba akımı FET drain-source anahtar yolundan akar.'),
  W('v1','V','v1-red','PLUG','V1/VΩmA → kırmızı prob','DCV 20 V ölçümünün giriş prob kablosudur.','#e53935','MEASURE'),
  W('v1','COM','v1-black','PLUG','V1/COM → siyah prob','COM referans prob kablosudur.','#111827','MEASURE')
 );
 p.projectId='tutorial-session-source-'+id;
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary='Sanal 12 VDC FET gecikmeli durma devresi: S1 basılınca C1 gate düğümünü şarj eder, Q1 iletime geçip H1 yük lambasını yakar. S1 bırakılınca C1 RD üzerinden boşalır; Q1/H1 bir süre ON kalır, gate yaklaşık 4 V altına düşünce OFF olur. Gecikme, gerçek sayısal RC ve anahtarlama eşiğiyle çözülür.';
 l.explanation='Kontrol yolu: G1/P 12 V → S1/13-14 → RŞ/1-2 1 kΩ → C1/1 ve Q1/G. C1/2 → G1/M; RD 20 kΩ direnci C1/1 ve 0 V arasında boşalma sağlar. Güç yolu ayrıdır: +12 V → H1/X1-X2 (120 Ω sanal yük) → Q1/D-S → 0 V. V1 UNI-T UT33D+ DCV 20 V modunda, kırmızı VΩmA ve siyah COM probları C1/1 ile C1/2 elektrotlarına temas eder. Modelde S1 basıldığı anda kapasitör gerilimi yükselir ve MOSFET eşiği yaklaşık 4 V’u geçince H1 çalışır. S1 bırakılınca gate hemen sıfıra düşmez; C1 ve RD üzerinden deşarj ile yaklaşık 2 saniye daha eşik üstünde kalır. Eğitsel R×C=20 kΩ×100 µF=2 s zaman sabiti, OFF geçişi ile birebir aynı süre demek değildir: eşik ve başlangıç gerilimi ayrıca rol oynar. Sayısal çözücü 250 ms’lik ayrık anlarla örneklenir. Q1, eski J113 grafik sembolünün yerine geçen **işlevsel sanal N-MOSFET eşdeğeridir**; birebir üretici J113 veya IRF540N veri sayfası/SPICE modeli değildir. Gerçek kapı sızıntısı, eşik toleransı, sıcaklık, güvenli çalışma bölgesi ve fiziksel devre kabulü modellenmemiştir.';
 l.learningGoal='S1/13–14, C1/1–2, RŞ/1–2, RD/1–2, Q1/G-D-S ve H1/X1–X2 bağlantılarını tanımlayıp sanal S1 OFF→ON→OFF dizisinde Q1 ON→gecikmeli OFF davranışını V1 ölçümüyle açıklamak.';
 l.beginnerSteps=[
  'Sanal G1 12 VDC ve S1/13-14 butonuyla şarj kontrol kolunu bul.',
  'RŞ 1 kΩ sonrası C1/1 ile Q1/G’nin aynı kontrol düğümünde olduğunu göster.',
  'C1/2 ve Q1/S terminallerinin 0 V hattına döndüğünü, RD 20 kΩ direncinin kapasitörü boşalttığını açıkla.',
  'H1/X1-X2 → Q1/D-S yük yolunun kontrol sinyali hattından ayrı olduğunu doğrula.',
  'UT33D+ DCV 20 V kırmızı/siyah fiziksel sanal problarının C1/1 ve C1/2 üzerinde olduğunu kontrol et.',
  'Sıfırla; S1 bas / 1 saniye tut; H1 ON ve C1 yükselişini gözlemle.',
  'S1 bırak / zamanla ilerlet; H1’in yaklaşık 2 saniye daha yanıp ardından OFF olduğunu göster.',
  'Bunu yalnız sanal N-kanal FET eşdeğeri say; gerçek JFET ve üretici kalibrasyonunu kabul edilmiş sayma.'
 ];
 const why={
  g1:'12 VDC sanal düşük gerilim besleme; şebeke kaynağı değildir.',
  sw:'S1/13-14 enerji verdiğinde C1 şarj olur, bırakıldığında besleme yolu açılır.',
  rc:'RŞ 1 kΩ C1’e ilk şarj akımını sınırlar.',
  c1:'C1 100 µF gate gerilimini geçici olarak saklayan gerçek sayısal reaktif elemandır.',
  rd:'RD 20 kΩ C1’in kademeli deşarj yoludur; R×C ≈2 saniye yalnız zaman sabitidir.',
  q1:'Q1, G-S gate eşiğine dayalı eğitim MOSFET’idir; D-S lambanın akım yoludur.',
  h1:'H1 12 V sanal lamba Q1 iletim durumuna göre enerji alır.',
  v1:'V1 UT33D+ DCV 20 V ile C1 üst ve alt elektrotları arasındaki gerilimi ölçer.',
  'v1-red':'Kırmızı prob VΩmA girişinden C1/1 noktasına temas eder.',
  'v1-black':'Siyah prob COM girişinden C1/2 noktasına temas eder.'
 };
 l.materials=materialRows(p).map(m=>({...m,why:why[m.componentId]||m.why}));
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_FET_RC_DELAY_STOP_SOURCE_ALIGNED',
  previousReason:'NO_WIRED_CIRCUIT',fetRcDelayVirtual:{
   gateMode:'NUMERIC_GS_RC_SAMPLED',chargeOhm:1000,bleedOhm:20000,capacitanceF:.0001,
   sourceV:12,thresholdV:4,sampleMs:250,physicalJfetVerified:false},
  manufacturerCalibrationVerified:false,physicalAcceptance:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 12 V sanal MOSFET/RC zamanlama eğitimi; üretici fiziksel JFET modeli, gerçek motor güvenliği, gerçek kablolu donanım ve termal kabul değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}


/* MQ-07: powered low-voltage G/D/S functional MOSFET screening with two
   electrically simulated UT33D+ probe pairs. Not a diode-mode/physical
   manufacturer device-health certification or a test on live equipment. */
{
 const id='electronic-switching-src-10',l=L.byId[id];
 if(!l||l.kind!=='quiz'||!L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))
  throw Error('MOSFET health canonical REVIEW baseline absent');
 if(!L.mq07Batch200.noWireTriage?.applicationRepairIds?.includes(id))
  throw Error('MOSFET health not in application review class');
 if(!l.project.components.some(x=>x.typeId==='irf540n-mosfet')||l.project.wires.length)
  throw Error('MOSFET health source changed unexpectedly');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',80,160,'G1','Sanal 12 VDC test beslemesi',{dcVoltage:12}),
  C('sw','push-no',310,155,'S1','Sanal gate test butonu',{state:false}),
  C('rg','resistor',485,160,'RG','1 kΩ gate sınırlama direnci',{resistance:1000}),
  C('rp','resistor',525,390,'RP','100 kΩ gate pull-down',{resistance:100000}),
  C('q1','irf540n-mosfet',810,360,'Q1','IRF540N G/D/S terminal test modeli',{mq07MosfetHealth:true,physicalAcceptance:false}),
  C('h1','standard-light',1070,340,'H1','12 V test lambası',{resistance:120}),
  C('vg','unit-ut33d-plus',775,65,'VG','UNI-T UT33D+ · gate ölçümü DCV 20 V',{meterPosition:3}),
  C('vl','unit-ut33d-plus',1150,85,'VL','UNI-T UT33D+ · yük ölçümü DCV 20 V',{meterPosition:3}),
  C('vg-red','test-probe-red',680,560,'PRG','VG kırmızı prob',{probeTarget:{c:'q1',p:'G'}}),
  C('vg-black','test-probe-black',850,560,'PBG','VG siyah prob',{probeTarget:{c:'q1',p:'S'}}),
  C('vl-red','test-probe-red',1040,555,'PRL','VL kırmızı prob',{probeTarget:{c:'h1',p:'X1'}}),
  C('vl-black','test-probe-black',1260,555,'PBL','VL siyah prob',{probeTarget:{c:'h1',p:'X2'}})
 ];
 p.wires.push(
  W('g1','P','sw','13','G1/P → S1/13','Gate test anahtarı 12 V sanal beslemeden enerjilenir.'),
  W('sw','14','rg','1','S1/14 → RG/1','Basılınca RG üzerinden gate test gerilimi oluşur.'),
  W('rg','2','q1','G','RG/2 → Q1/G','IRF540N G terminaline sınırlanmış gate kontrolü ulaşır.','#43a047','SIGNAL'),
  W('rp','1','q1','G','RP/1 → Q1/G','Gate bırakılınca RP üst ucu üzerinden G-S düşürülür.','#43a047','SIGNAL'),
  W('rp','2','g1','M','RP/2 → G1/M','RP 100 kΩ gate pull-down 0 V dönüşüdür.','#111827','0V'),
  W('q1','S','g1','M','Q1/S → G1/M','IRF540N Source 0 V referansıdır.','#111827','0V'),
  W('g1','P','h1','X1','G1/P → H1/X1','Sanal test lambası 12 V yük beslemesine bağlanır.'),
  W('h1','X2','q1','D','H1/X2 → Q1/D','Yük akımı Q1 drain-source kanalından akar.'),
  W('vg','V','vg-red','PLUG','VG/VΩmA → kırmızı gate probu','VG kırmızı VΩmA girişini Q1/G test probuna bağlar.','#e53935','MEASURE'),
  W('vg','COM','vg-black','PLUG','VG/COM → siyah source probu','VG COM probu Q1/S referansına temas eder.','#111827','MEASURE'),
  W('vl','V','vl-red','PLUG','VL/VΩmA → kırmızı yük probu','VL kırmızı probu H1/X1 besleme noktasına temas eder.','#e53935','MEASURE'),
  W('vl','COM','vl-black','PLUG','VL/COM → siyah yük probu','VL siyah probu H1/X2 noktasına temas eder.','#111827','MEASURE')
 );
 p.projectId='tutorial-session-source-'+id;
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary='Sanal IRF540N G/D/S fonksiyon taraması: 12 VDC düşük gerilimli kaynak ve S1 gate komutu ile VG multimetrede VGS ve VL multimetrede 120 Ω yük gerilimi ölçülür. S1 bırakıkken VG≈0 V, VL≈0 V; S1 basılıyken VG≈11,88 V, VL≈12 V. Tek test/tek ohm okuması gerçek cihazın kesin sağlamlığını kanıtlamaz.';
 l.explanation='Sanal test kaynağı G1/P 12 V → S1/13-14 → RG/1-2 1 kΩ → Q1/G. RP 100 kΩ, Q1/G → G1/M pull-down hattıdır; Q1/S → G1/M. Güç yolu ayrıdır: G1/P → H1/X1–X2 (120 Ω sanal yük) → Q1/D → Q1/S → G1/M. Q1 IRF540N modelinin G, D, S uçları katalogdan birebir alınır; MOSFET gate gerilimi özgün düğüm çözücüsünde RG/RP direnç bölücüsünden türetilir. VG UNI-T UT33D+ DCV 20 V ölçümünde kırmızı fiziksel sanal prob Q1/G, siyah Q1/S üzerindedir. VL ikinci UT33D+ DCV 20 V cihazında kırmızı prob H1/X1, siyah H1/X2 üzerindedir. S1 OFF→ON→OFF olduğunda VG ≈0→11,88→0 V, VL ≈0→12→0 V ve H1 OFF→ON→OFF beklenir. RG ile gate bağlantısı kopuk senaryosu MOSFET sağlam olsa bile VL=0 gösterir: bu kablo arızasıdır, bozuk MOSFET teşhisi değildir. S1 OFF iken D–S sanal köprüleme VL=12 V oluşturur: bu istenmeyen sürekli iletim davranışıdır, ancak köprüleme testinde fiziksel MOSFET arızası kanıtı sayılmaz. Bu model ideal 4 V gate eşiği kullanan sanal N-MOS anahtardır; üretici IRF540N toleransları, RDS(on), gate kapasitansı, body-diode ölçümü, termal/SOA, fiziksel üretici ve gerçek cihaz sağlamlığı doğrulanmış değildir.';
 l.learningGoal='IRF540N G, D, S terminallerini güç ve kontrol yollarında ayırt etmek; VG ve VL UT33D+ gerçek sanal prob ölçümlerinde S1 OFF/ON/OFF işlev taramasını görmek, kopuk gate ve D–S istenmeyen iletim işaretlerini kesin fiziksel arıza teşhisi olmadan karşılaştırmak.';
 l.beginnerSteps=[
  'Sanal 12 V kaynak, IRF540N G/D/S, RG 1 kΩ, RP 100 kΩ ve H1 test lambasını tanı.',
  'S1/13–14 üzerinden RG/1-2 ve Q1/G kontrol yolunu; Q1/S 0 V referansını incele.',
  'H1/X1–X2 ve Q1/D–S yük yolunun gate hattından ayrı olduğunu doğrula.',
  'VG kırmızı VΩmA ve siyah COM fiziksel sanal problarının Q1/G ve Q1/S uçlarında olduğunu kontrol et.',
  'VL kırmızı/siyah UT33D+ problarını H1/X1-X2 terminal uçlarında doğrula.',
  'Sanal S1 OFF iken iki multimetre yaklaşık 0 V ve H1 OFF okumalı.',
  'Sanal S1 ON yap: VG≈11,88 V, VL≈12 V ve H1 ON sonucunu özgün solver ölçümünden oku.',
  'Sanal S1 OFF yap: gate pull-down VL≈0 V ve H1 OFF durumuna dönmeli.',
  'Gate kopuk veya drain-source baypas simülasyonu olasılıklarını ayırt et; gerçek MOSFET sağlam ilan etme.'
 ];
 const purposes={
 g1:'Sadece 12 VDC sanal test kaynağıdır; şebeke veya fiziksel güvenlik testi değildir.',
 sw:'S1 sanal gate kontrol anahtarı; Q1’in gate sürmesini başlatır/bırakır.',
 rg:'RG 1 kΩ sanal gate yoluna seri yerleştirilmiş kontroldür.',
 rp:'RP 100 kΩ gate-source gerilimini test OFF durumunda sıfıra indirir.',
 q1:'IRF540N Q1 için G/D/S doğrulanmış katalog uçları; threshold eğitim MOSFET modelidir.',
 h1:'H1 120 Ω test yükü Q1’in D–S gücü anahtarladığını gözlemletir.',
 vg:'VG UT33D+ DCV 20 V sanal multimetre G–S gerilimini ölçer.',
 vl:'VL UT33D+ DCV 20 V sanal multimetre H1 yük uçları arasını ölçer.',
 'vg-red':'VG/VΩmA üzerinden kırmızı sanal prob Q1/G üzerinde.',
 'vg-black':'VG/COM üzerinden siyah sanal prob Q1/S üzerinde.',
 'vl-red':'VL/VΩmA üzerinden kırmızı sanal prob H1/X1 üzerinde.',
 'vl-black':'VL/COM üzerinden siyah sanal prob H1/X2 üzerinde.'
 };
 l.materials=materialRows(p).map(m=>({...m,why:purposes[m.componentId]||m.why}));
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_IRF540N_GDS_FUNCTIONAL_SCREEN_ALIGNED',
  mosfetHealthVirtual:{supplyV:12,device:'irf540n-mosfet',pins:['G','D','S'],
    meterGate:'vg',meterLoad:'vl',realManufacturerDiagnosis:false,
    bodyDiodeAndRdsMeasured:false,operationalThresholdV:4},
  previousReason:'NO_WIRED_CIRCUIT',physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız düşük gerilimli sanal MOSFET işlev taraması; bu sonuç fiziksel devrenin güvenli olduğunu veya gerçek IRF540N ürününün sağlam olduğunu kanıtlamaz.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}


/* MQ-07 SC11: virtual PWM-to-native-solver wired motor lesson.
   The switch state is clocked inside Simulation.solve; RPM and current control
   are deliberately NOT manufacturer-calibrated. */
{
 const id='electronic-switching-src-11',l=L.byId[id];
 if(!l||l.kind!=='quiz'||!L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT')||
    !L.mq07Batch200.noWireTriage?.applicationRepairIds?.includes(id)||l.project.wires.length)
   throw Error('SC11 canonical no-wire review baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',80,135,'G1','12 V yalnız sanal besleme',{dcVoltage:12}),
  C('pwm1','virtual-pwm-generator-v1',300,120,'PWM1','Beslemeli sanal PWM sinyal üreteci',{dutyPercent:50,frequencyHz:1000}),
  C('rg','resistor',485,145,'RG','1 kΩ gate direnci',{resistance:1000}),
  C('rp','resistor',600,375,'RP','100 kΩ gate pull-down',{resistance:100000}),
  C('q1','irf540n-mosfet',810,345,'Q1','Sanal IRF540N G/D/S anahtar modeli',{mq07MosfetHealth:true}),
  C('m1','motor-dc',1080,275,'M1','12 V sanal DC motor'),
  C('vg','unit-ut33d-plus',840,70,'VG','Gate-source sanal DC voltmetre',{meterPosition:3}),
  C('vgr','test-probe-red',700,535,'PR','VG kırmızı sanal prob',{sc11MeasurementProbe:true,probeTarget:{c:'q1',p:'G'}}),
  C('vgb','test-probe-black',880,535,'PB','VG siyah sanal prob',{sc11MeasurementProbe:true,probeTarget:{c:'q1',p:'S'}})
 ];
 p.colorRoles={...p.colorRoles,'#b57b40':'DC+','#8b5cf6':'SIGNAL','#111827':'0V'};
 p.wires.push(
  W('g1','P','pwm1','V+','G1/P → PWM1/V+','PWM üreteci 12 V pozitif besleme.','#b57b40','DC+'),
  W('pwm1','GND','g1','M','PWM1/GND → G1/M','PWM üreteci 0 V ortak referans.','#111827','0V'),
  W('pwm1','OUT','rg','1','PWM1/OUT → RG/1','PWM gate komutu, motor güç hattı değildir.','#8b5cf6','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','Q1 Gate kontrol noktasıdır.','#8b5cf6','SIGNAL'),
  W('rp','1','q1','G','RP/1 → Q1/G','Gate pull-down kontrol düğümü.','#8b5cf6','SIGNAL'),
  W('rp','2','g1','M','RP/2 → G1/M','Gate pull-down 0 V dönüşü.','#111827','0V'),
  W('q1','S','g1','M','Q1/S → G1/M','MOSFET Source 0 V güç dönüşü.','#111827','0V'),
  W('g1','P','m1','+','G1/P → M1/+','Motorun ayrı 12 V güç beslemesi.','#b57b40','DC+'),
  W('m1','−','q1','D','M1/− → Q1/D','Motorun MOSFET üzerinden anahtarlanan yük güç yolu.','#b57b40','DC+'),
  W('vg','V','vgr','PLUG','VG/VΩmA → kırmızı prob','Sanal gate voltaj ölçüm kablosu.','#e53935','CONTROL'),
  W('vg','COM','vgb','PLUG','VG/COM → siyah prob','Sanal source referans ölçüm kablosu.','#111827','CONTROL')
 );
 p.projectId='tutorial-session-source-'+id;
 l.project=p;l.workspaceMode=p.workspaceMode;l.kind='wiring';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.summary='MOSFET ile DC motor PWM kontrolü — G1 12 V sanal kaynak, Q1 IRF540N, M1 DC motor. %0 / %50 / %100 duty değerlerinde yalnız özgün solverın anlık anahtarlama/enerji durumunu incele; gerçek devir hesabı yoktur.';
 l.explanation='AMAÇ VE KULLANIM: Bir DC motorun enerjisini MOSFET ile kesikli anahtarlamanın temelini öğretir. Bu, gerçek sürücü tasarımı değildir. MALZEMELER: G1 12 V sanal DC kaynaktır; PWM1 besleme ve referans terminalleri olan sanal PWM üretecidir; RG 1 kΩ gate yolundadır, RP 100 kΩ gate referansını sağlar; Q1 IRF540N G/D/S anahtarıdır; M1 sanal DC motordur; VG UNI-T UT33D+ ile G–S arasındaki anlık gerilim gözlenir. BAĞLANTILAR: Kontrol kolu G1/P → PWM1/V+, PWM1/GND → G1/M ve PWM1/OUT → RG/1-2 → Q1/G, RP/1 → Q1/G ve RP/2 → G1/M; Q1/S → G1/M. Güç kolu G1/P → M1/+ ve M1/− → Q1/D → Q1/S → G1/M şeklindedir. ÖZGÜN ÇÖZÜCÜ: PWM1 üretecinin duty ve 1000 Hz frekansı, OUT terminalinin sinyalini zamana göre değiştirir; elektriksel çözüm Q1 ile M1 için anlık iletim ve enerji durumunu hesaplar. HESAP ÖRNEĞİ: T=1/1000 Hz=1 ms; %50 duty için teorik ON süresi 0,5 ms, OFF süresi 0,5 ms; %0 hiç ON olmaz, %100 sürekli ON komutudur. 12 V × %50 = 6 V yalnız ideal PWM komutunun aritmetik ortalamasıdır; motor uçlarında ölçülmüş DC gerilim ya da hız değildir. SENARYOLAR: Başlangıçta %0 seçip M1 OFF gözle; %50 seçip 0 / 0,25 / 0,75 ms anlık durumlarını karşılaştır; %100 seçip anahtarlamanın sürekli ON komutuna döndüğünü gör; tekrar %0 ile durdur. ÖLÇÜM: VG cihazının kırmızı sanal probu Q1/G, siyah sanal probu Q1/S noktasındadır; yalnız çözücünün desteklediği G–S ölçümünü değerlendir. ÖĞRENCİ DENEYİ: %50 duty için 0,25 ms ile 0,75 ms durumunun neden farklı olduğunu periyot üzerinden açıkla; RG→G veya M1→D kopuk olduğunda motor neden enerjilenmemelidir sorusunu cevapla. KONTROL SORULARI: PWM1 kontrol kolu ile M1 güç kolu neden ayrıdır? %50 duty neden doğrudan %50 RPM demek değildir? Gate pull-down olmazsa komut bırakıldığında neden güvenilir OFF kabulü yapılamaz? SINIRLAR: Motorun RPM, tork, geri EMK, akım dalgalanması, diyot geçişi, sıcaklık ve üretici kalibrasyonu modellenmediği için fiziksel güvenlik veya hız kabulü yapılmaz.';
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_PWM_MOSFET_MOTOR_NATIVE_SWITCHING',
  mq05PwmVirtual:{supplyV:12,frequencyHz:1000,validDuty:[0,50,100],
    realRpmModel:false,motorSpeedVerified:false,physicalAcceptance:false},
  previousReason:'NO_WIRED_CIRCUIT',physicalAcceptance:false,
  manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal düşük gerilimli anahtarlama ve öğretici veri; gerçek bir motor sürücüsü veya fiziksel kablolama talimatı değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}


/* MQ-07 SC13: real wired virtual DC SCR gate test; native solver owns state.
   This is an educational trigger test, NOT calibrated holding-current physics. */
{
 const id='electronic-switching-src-13',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||
    !L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT')||
    !L.mq07Batch200.noWireTriage.applicationRepairIds.includes(id))
  throw Error('SC13 original REVIEW baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',70,150,'G1','Sanal 12 V DC kaynak',{dcVoltage:12}),
  C('sw','push-no',325,160,'S1','Sanal gate tetikleme butonu',{state:false}),
  C('rg','resistor',520,175,'RG','1 kΩ sanal gate direnci',{resistance:1000}),
  C('q1','mq07-scr-virtual',810,335,'Q1','Elektriksel SCR gate-anot-katot sanal modeli',{mq07ScrHoldLesson:true}),
  C('h1','standard-light',1090,330,'H1','120 Ω sanal DC yük',{resistance:120})
 ];
 p.wires.push(
  W('g1','P','sw','13','G1/P → S1/13','Sanal gate komutu 12 V kaynaktan gelir.'),
  W('sw','14','rg','1','S1/14 → RG/1','S1 açıkken gate kontrol yolu ayrılır.'),
  W('rg','2','q1','G','RG/2 → Q1/G','RG üzerinden SCR gate tetikleme girişi.'),
  W('g1','P','h1','X1','G1/P → H1/X1','Yük için sanal pozitif güç yolu.'),
  W('h1','X2','q1','A','H1/X2 → Q1/A','Yükten SCR anot terminaline güç yolu.'),
  W('q1','K','g1','M','Q1/K → G1/M','Katot sanal dönüş referansına bağlanır.')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'DC SCR tetikleme/tutma deneyi: S1 kısa gate darbesi sonrasında anot akımı yeterliyse iletimin sürmesini gözle.',
  explanation:'AMAÇ: Tristörün gate (G) ile kontrol edilen anot (A)–katot (K) iletimini düşük gerilimli sanal ortamda gözlemek. MALZEMELER: G1 sanal 12 V DC kaynak; S1 gate komutu; RG 1 kΩ gate direnci; Q1 SCR A/K/G terminalleri; H1 120 Ω eğitim yükü. KONTROL YOLU: G1/P → S1/13-14 → RG/1-2 → Q1/G. GÜÇ YOLU: G1/P → H1/X1-X2 → Q1/A → Q1/K → G1/M. Gate geri dönüşü katotun 0 V referansına göredir. HESAP ÖRNEĞİ: İdeal direnç yükünde kaynak 12 V ve yük 120 Ω ise yalnız güç yolu ilettiği varsayımında teorik I=12/120=0,1 A, P=12×0,1=1,2 W; bunlar özgün solverda ölçülmüş akım ya da gerçek SCR gerilim düşümü değildir. ÇALIŞMA: Başlangıç S1 OFF; S1 ON yapıldığında gate yolunu ve H1 durumunu özgün elektriksel solverda incele; S1 bırakılınca yeniden çözüm al. Model gerçek SCR tutma akımıyla latch etme, ters gerilim, anahtarlama süresi veya termal davranış hesaplamaz; S1 bırakıldığında sanal modelin sonucu fiziksel SCR kesim garantisi değildir. ÖĞRENCİ DENEYİ: RG→G bağlantısı kaldırılırsa H1 neden iletim göstermemelidir? H1→A bağlantısı kesilirse gate komutu neden yükü enerjileyemez? KONTROL SORULARI: A/K güç yolu ile G kontrol yolu neden farklıdır; hesaplanan 0,1 A değeri hangi ideal varsayıma dayanır; bu basitleştirilmiş model neden gerçek tristörün tutma akımını doğrulamaz? GERÇEK DONANIM UYARISI: Yalnız yazılım tabanlı kavram gösterimidir.'});
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'VIRTUAL_DC_SCR_GATE_SOURCE_ALIGNED',
  previousReason:'NO_WIRED_CIRCUIT',scrVirtual:{nativeHoldingCurrentThreshold:true,manufacturerCalibrated:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal 12 V SCR tutma akımı ve gate tetikleme modeli; gerçek ürün ölçümleri ve ısıl/fiziksel kabul yoktur.';
 l.learningGoal='Gate bırakıldığında DC SCR akım tutmasının sürmesini, anot/katot yolu kesildiğinde latch durumunun sıfırlanmasını gözlemlemek.';
 l.explanation='AMAÇ: DC SCR gate komutu ile anot akımı tutmasını ayırt etmek. ELEMANLAR: G1 sanal 12 V kaynak, S1 gate butonu, RG 1 kΩ, Q1 TYN612RG kimlikli SCR ve H1 dirençli eğitim yükü. KUMANDA: G1/P → S1/13–14 → RG/1–2 → Q1/G. GÜÇ: G1/P → H1/X1–X2 → Q1/A → Q1/K → G1/M. GÖZLEM: İlk durumda S1 OFF/H1 OFF. S1 basılıyken sayısal gate-katot gerilimi hesaplanır; A–K güç yolunda en az sanal tutma akımı varsa SCR latch olur. S1 bırakıldığında gate düşer ama anot akımı eşik üzerindeyse H1 ON kalır. Anot/kathot yolu kesilince akım düşer; tekrar bağlansa bile yeni gate tetiklemesi gerekir. 12 V/120 Ω ideal yüke göre 0,1 A teoriktir; üreticinin fiziksel tetikleme/tutma, sıcaklık ve güç kaybı davranışı kalibre edilmemiştir. Yalnız düşük gerilimli yazılım simülasyonudur.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}


/* MQ-07 SC14: SCR STOP distinguishes gate-release from true interruption
   of the 12 V DC anode current; reuses the proven SC13 native latch. */
{
 const id='electronic-switching-src-14',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||
    !L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT')||
    !L.mq07Batch200.noWireTriage.applicationRepairIds.includes(id))
   throw Error('SC14 canonical no-wire REVIEW changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',65,160,'G1','Yalnız sanal 12 V DC',{dcVoltage:12}),
  C('sg','push-no',310,130,'SG','Gate tetikleme',{state:false}),
  C('rg','resistor',495,160,'RG','1 kΩ gate sınırlama',{resistance:1000}),
  C('sp','push-nc',340,365,'SP','Anot akım yolunu kesen sanal STOP',{state:false}),
  C('q1','mq07-scr-virtual',830,365,'Q1','Elektriksel SCR A/K/G sanal model',{mq07ScrHoldLesson:true}),
  C('h1','standard-light',1100,315,'H1','120 Ω sanal yük',{resistance:120})
 ];
 p.wires.push(
  W('g1','P','sg','13','G1/P → SG/13','Sanal gate komut başlangıcı.'),
  W('sg','14','rg','1','SG/14 → RG/1','Gate butonu RG girişini besler.'),
  W('rg','2','q1','G','RG/2 → Q1/G','Tetikleme yolu gate terminalinde biter.'),
  W('g1','P','sp','21','G1/P → SP/21','Güç kolunda ayrı bir durdurma kontrolü.'),
  W('sp','22','h1','X1','SP/22 → H1/X1','STOP açıkken güç kaynağı yükten ayrılır.'),
  W('h1','X2','q1','A','H1/X2 → Q1/A','Yük akımı anot terminaline yönlenir.'),
  W('q1','K','g1','M','Q1/K → G1/M','Sanal katot dönüş referansı.')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'SCR DC durdurma deneyi: kısa gate tetiklemesinden sonra SG bırakıldığında iletim sürer; SP STOP anot akımını kesince SCR kapanır ve kendiliğinden yeniden başlamaz.',
  explanation:'AMAÇ: DC tristörün gate bırakıldığında neden açık kalabildiğini, ancak anot akımı kesildiğinde neden durduğunu gözlemlemek. MALZEMELER: G1 düşük gerilimli sanal kaynak; SG normalde açık kısa gate tetikleme butonu; RG 1 kΩ; SP normalde kapalı STOP butonu; Q1 TYN612RG SCR ve H1 dirençli gösterge yükü. KUMANDA: G1/P → SG/13–14 → RG/1–2 → Q1/G; Q1/K → G1/M. GÜÇ: G1/P → SP/21–22 → H1/X1–X2 → Q1/A → Q1/K → G1/M. SANAL ÇALIŞMA: Başlangıçta SG OFF, SP kapalı ve H1 OFF. SG kısa süre basıldığında Q1 gate-katot gerilimi sayısal çözülür; anot akımı sanal tutma eşiğini karşılayınca SCR latch olur ve H1 yanar. SG bırakıldığında gate sinyali kesilir, fakat anot akımı devam ettiği için H1 yanmaya devam eder. SP basıldığında güç akımı kesilir ve SCR latch bırakır; SP bırakılıp güç yolu yeniden kapansa bile SG tekrar tetiklenmeden H1 yanmaz. SG STOP sırasında hâlâ basılı tutulursa SP bırakıldığı anda yeni gate komutuyla yeniden tetiklenmesi mümkündür; önce SG bırakılmalıdır. Gate hattının tek başına ayrılması latched SCR yi durdurmaz. Elektriksel model yalnız eğitim amaçlıdır: gerçek tetikleme akımı, tutma akımı eğrisi, sıcaklık, transient ve üretici kalibrasyonu doğrulanmış değildir.'});
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',titleTopologyIssue:null,
  titleTopologyStatus:'DC_SCR_LATCH_ANODE_STOP_RETRIGGER_REQUIRED',
  previousReason:'NO_WIRED_CIRCUIT',scrStopVirtual:{nativeHoldingCurrentThreshold:true,anodeInterruption:true,retriggerAfterStop:true},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız düşük gerilimli sanal SCR tetikleme/tutma deneyi. Gerçek üretici akım, sıcaklık ve fiziksel devre kabulü değildir.';
 l.learningGoal='Gate komutunu bırakmakla DC anot akımını kesmenin farkını ve STOP sonrası yeniden tetikleme gereğini simülasyonda gözlemlemek.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}


/* MQ-07 SC16: low-voltage virtual DC holding / power-interruption experiment.
   Physical ST BTA16 product identity but not manufacturer-calibrated electrical behavior.
   A DC supply has NO natural zero crossing; do not call this an AC triac dimmer. */
{
 const id='electronic-switching-src-16',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length)throw Error('SC16 source baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',95,175,'G1','12 V sanal DC güç kaynağı',{dcVoltage:12}),
  C('sg','push-no',342,182,'SG','Kısa gate tetikleme butonu',{state:false}),
  C('rg','resistor',595,187,'RG','1 kΩ gate akım sınırlama',{resistance:1000}),
  C('sp','push-nc',355,430,'SP','Normalde kapalı STOP · güç kesme',{state:false}),
  C('q1','bta16-600b-triac',1010,415,'Q1','ST BTA16-600B · MT1/MT2/G',{mq07DcTriacLesson:true,mq07VirtualHoldingCurrentA:0.03}),
  C('h1','standard-light',1320,235,'H1','120 Ω düşük gerilimli sanal yük',{resistance:120})
 ];
 p.wires.push(
  W('g1','P','sg','13','G1/P → SG/13','Gate tetiklemesinin sanal pozitif kaynağı.','#e53935','+24V'),
  W('sg','14','rg','1','SG/14 → RG/1','Tetikleme butonu üzerinden 1 kΩ sınırlama.','#8b5cf6','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','BTA16 G tetikleme terminali.','#8b5cf6','SIGNAL'),
  W('g1','P','sp','21','G1/P → SP/21','MT2 yük akımını kesen STOP kolunun beslemesi.','#e53935','+24V'),
  W('sp','22','h1','X1','SP/22 → H1/X1','Normalde kapalı STOP ve lamba seri güç yoludur.','#8b5cf6','CONTROL'),
  W('h1','X2','q1','MT2','H1/X2 → Q1/MT2','BTA16 gerçek isimli MT2 güç ucu.','#8b5cf6','LOAD'),
  W('q1','MT1','g1','M','Q1/MT1 → G1/M','MT1 ve gate için ortak DC eksi referansı.','#111827','0V')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'ST BTA16 MT1/MT2/G ile 12 V sanal DC tetikleme: SG gate darbesiyle aç, gate bırakınca akımı koru, SP STOP ile güç akımını kes.',
  explanation:'AMAÇ: BTA16 triyakın DC ortamında doğal sıfır geçişi olmadığını ve ana akım devam ederken gate bırakmanın iletimi durdurmayacağını gözlemlemek. MALZEMELER: 12 V sanal DC G1, SG normalde açık gate tetikleme, 1 kΩ RG, SP normalde kapalı STOP, ST BTA16-600B MT1/MT2/G ürün kaydı, sanal H1 120 Ω yük. KUMANDA: G1/P → SG/13–14 → RG/1–2 → Q1/G. GÜÇ: G1/P → SP/21–22 → H1/X1–X2 → Q1/MT2 → Q1/MT1 → G1/M. Başlangıçta SG bırakılmış ve H1 OFF olur. SG kısa süre tetiklendiğinde gate-MT1 farkı sayısal ağ üzerinden hesaplanır, akım sanal tutma eşiğinin üzerine çıkarsa triyak latch olur; SG bırakıldığında H1 yanmaya devam eder. SP STOP açılınca yük akımı kesilir ve latch düşer; SP tekrar kapatılsa bile yeni SG darbesi gelmeden H1 yanmaz. SG hâlâ basılı tutuluyorsa STOP bırakılır bırakılmaz yeniden tetiklenebilir. Yalnız DC sanal eğitim modelidir: çift yönlü AC faz, fiziksel BTA16 tutma/gate akımı, sıcaklık ve gerçek donanım güvenliği doğrulanmış değildir.'
 });
 l.materials=materialRows(p);
 l.learningGoal='DC triyak tetiklemesini, tutma akımını ve güç kesme ile durdurmayı birbirinden ayırt etmek; AC çift yönlü iletimi DC sonuçlarına dayanarak iddia etmemek.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',titleTopologyIssue:null,
  titleTopologyStatus:'REVIEW_LOW_VOLTAGE_DC_TRIAC_HOLDING',
  originalVirtualTypeId:'mq07-triac-virtual',catalogProductId:'bta16-600b-triac',
  catalogManufacturerSource:'https://www.st.com/resource/en/datasheet/bta16.pdf',
  virtualDcBehavior:{gateMt1Nodal:true,holdingCurrentA:0.03,stopOpensMainCurrent:true,manufacturerCalibrated:false,acBidirectionalVerified:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız düşük gerilimli sanal DC triyak deneyi. Gerçek şebeke, triyak sürme bağlantısı veya donanım kullanım kılavuzu değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}

/* MQ-07: case-specific source teaching for unsupported AC/opto control lessons.
   Keep NO_WIRED_CIRCUIT open; these are honest explanatory repairs, not solver acceptance. */
/* MQ-07 SC15: Isolated 12V RMS sine, explicit AC phase trigger and SCR A/K/G load. */
{
 const id='electronic-switching-src-15',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||!L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))throw Error('SC15 original REVIEW baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('ac1','virtual-isolated-ac-12v',90,220,'AC1','Yalıtılmış sanal AC',{"rmsVoltage":12,"frequencyHz":50,"sourceEnabled":true}),
  C('trg1','virtual-ac-scr-trigger-v1',380,185,'TRG1','SCR faz tetikleyici',{"triggerAngleDeg":90,"pulseWidthDeg":25,"triggerEnabled":true}),
  C('rg','resistor',680,250,'RG','1 kΩ gate direnci',{"resistance":1000}),
  C('q1','tyn612rg-scr',1030,420,'Q1','TYN612RG SCR',{}),
  C('h1','standard-light',1350,245,'H1','120 Ω sanal AC yük',{"resistance":120}) 
 ];
 p.wires.push(
  W('ac1','AC','h1','X1','ac1/AC → h1/X1','Sanal düşük gerilimli faz ve terminal bağlantısı.','#e53935','L1'),
  W('h1','X2','q1','A','h1/X2 → q1/A','Sanal düşük gerilimli faz ve terminal bağlantısı.','#8b5cf6','LOAD'),
  W('q1','K','ac1','RET','q1/K → ac1/RET','Sanal düşük gerilimli faz ve terminal bağlantısı.','#1e88e5','N'),
  W('ac1','AC','trg1','AC','ac1/AC → trg1/AC','Sanal düşük gerilimli faz ve terminal bağlantısı.','#e53935','L1'),
  W('ac1','RET','trg1','RET','ac1/RET → trg1/RET','Sanal düşük gerilimli faz ve terminal bağlantısı.','#1e88e5','N'),
  W('trg1','OUT','rg','1','trg1/OUT → rg/1','Sanal düşük gerilimli faz ve terminal bağlantısı.','#8b5cf6','SIGNAL'),
  W('rg','2','q1','G','rg/2 → q1/G','Sanal düşük gerilimli faz ve terminal bağlantısı.','#8b5cf6','SIGNAL')
 );
 setLesson(l,p,{kind:'wiring',summary:'Yalıtılmış 12 V RMS/50 Hz sanal AC kaynağı ve gate tetikleyiciyle SCR pozitif yarım periyot ve sıfır geçişini incele.',
  explanation:'AC1 yalnızca 12 V RMS yalıtılmış yazılımsal sinüs kaynağıdır. TRG1, AC1/AC ve RET uçlarından faz referansı alır; çıkışı RG direnci üzerinden TYN612RG SCR gate ucunu sürer. AC1/AC → H1/X1–X2 → Q1/A–K → AC1/RET güç yoludur. Ateşleme açısı 0°–170° arasında değişir; gate darbesinden sonra sanal tutma akımı yeterliyse SCR yalnız pozitif yarım periyotta iletir ve sıfır geçişinde kapanır. Negatif yarım periyotta anot akımı yoktur. Panelde zaman dalgası, gate darbesi ve hesaplanan yük RMS gerilimi izlenebilir. Gerçek TYN612RG üretici SPICE, termal davranış veya fiziksel uygulama kabulü değildir.'});
 l.materials=materialRows(p);
 l.learningGoal='SCR gate gecikmesini, pozitif/negatif yarım periyot farkını ve sıfır geçişinde akım tutmasının kaybını incele.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',titleTopologyIssue:null,titleTopologyStatus:'REVIEW_ISOLATED_AC_SCR_WAVE',acSc15Virtual:{waveform:true,zeroCrossing:true,isolatedLowVoltage:true,manufacturerCalibrated:false},physicalAcceptance:false,manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız yazılımsal 12 V AC deneyidir. Şebeke ve fiziksel devre bağlantı talimatı değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}
/* MQ-07 SC17: isolated virtual 12 V RMS AC *dual-half* TRIAC dimmer.
   Two signed gate pulses per full cycle and computed load waveform RMS. */
{
 const id='electronic-switching-src-17',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||
   !L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))
   throw Error('SC17 unwired baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('ac1','virtual-isolated-ac-12v',100,200,'AC1','Yalıtılmış 12 V RMS 50 Hz sanal kaynak',{rmsVoltage:12,frequencyHz:50,sourceEnabled:true}),
  C('trg1','virtual-ac-triac-trigger-v1',390,210,'TRG1','Çift yarım periyot faz tetikleyici',{triggerAngleDeg:90,pulseWidthDeg:25,triggerEnabled:true}),
  C('rg','resistor',680,255,'RG','Sanal gate akımı sınırlama · 1 kΩ',{resistance:1000}),
  C('q1','bta16-600b-triac',1040,440,'Q1','ST BTA16-600B · MT1/MT2/G',{mq07VirtualHoldingCurrentA:0.03}),
  C('h1','standard-light',1365,245,'H1','Dirençli sanal dimmer yükü · 120 Ω',{resistance:120,mq07Sc17AcLoad:true})
 ];
 p.wires.push(
  W('ac1','AC','h1','X1','AC1/AC → H1/X1','Sanal yükün izole AC girişi.','#e53935','L1'),
  W('h1','X2','q1','MT2','H1/X2 → Q1/MT2','AC yükün güç yolu.','#8b5cf6','LOAD'),
  W('q1','MT1','ac1','RET','Q1/MT1 → AC1/RET','AC referansı, DC GND olarak gösterilmez.','#1e88e5','N'),
  W('ac1','AC','trg1','AC','AC1/AC → TRG1/AC','İki yarım periyodun kaynak faz referansı.','#e53935','L1'),
  W('ac1','RET','trg1','RET','AC1/RET → TRG1/RET','Yalıtılmış kaynak referansı.','#1e88e5','N'),
  W('trg1','OUT','rg','1','TRG1/OUT → RG/1','Her yarım periyoda ayrı sanal gate darbesi.','#8b5cf6','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','BTA16 G terminaline sanal kumanda.','#8b5cf6','SIGNAL')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'ST BTA16 MT1/MT2/G ile yalıtılmış sanal 12 V AC dimmer: pozitif ve negatif yarım periyotlarda ayarlanabilir tetikleme, akım tutma, sıfır geçişinde sönme ve örneklenmiş yük RMS.',
  explanation:'AMAÇ: Gerçek ürün kimlikli BTA16 triyakın yazılım içindeki AC dimmer modelini incelemek. SANAL DEVRE: AC1 yalıtılmış 12 V RMS/50 Hz sanal kaynak; TRG1 iki yarım periyotlu, sıfır geçişine eşzamanlı sanal tetikleyici; RG 1 kΩ; ST BTA16-600B MT1/MT2/G; H1 120 Ω sanal dirençli yük. Güç yolu AC1/AC → H1/X1–X2 → Q1/MT2 → Q1/MT1 → AC1/RET, kontrol yolu AC1/AC ve RET referansından TRG1/AC–RET; TRG1/OUT → RG/1–2 → Q1/G. GÖZLEM: Tetikleme açısı 0°, 45°, 90°, 135° veya 170° değiştikçe her iki yarım periyot için sanal gate darbesi zamanlanır. Yük akımı sanal tutma eşiğinin üstündeyken gate darbesinden sonra iletim sürer, her sıfır geçişinde ana akım eşiğin altına düştüğü için kapanır, sonraki ters polariteli yarım periyotta yeniden tetiklenir. Anlık yük geriliminin işareti AC polaritesiyle birlikte değişir. Yük RMS değeri sinüs ve iletim dalgasının 360° sayısal örneklerinden hesaplanır; fiziksel lümen, faz kesme donanımı, gerçek üretici gate quadrant değerleri, ısı ve üretici SPICE kalibrasyonu değildir. Şebeke veya gerçek bağlantı uygulaması değildir.'
 });
 l.materials=materialRows(p);
 l.learningGoal='BTA16 MT1/MT2/G görevlerini, iki yarım periyotta ayrı gate tetiklemesini, sıfır geçişinde sönmeyi ve yük RMS faz açısı ilişkisini sanal dalgada ayırt etmek.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'REVIEW_ISOLATED_AC_TRIAC_DUAL_HALF',
  catalogProductId:'bta16-600b-triac',catalogManufacturerSource:'https://www.st.com/resource/en/datasheet/bta16.pdf',
  acTriacVirtual:{bidirectionalWaveform:true,zeroCrossing:true,simulatedHoldingCurrentA:0.03,calibratedManufacturerQuadrants:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız yazılımsal yalıtılmış düşük gerilimli sanal AC deneyidir; şebeke bağlantısı veya gerçek triyak sürücü kılavuzu değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}
/* MQ-07 SC18: TLP521-1 optically isolated LED/phototransistor software test.
   Two sources are independent; never join their ground return rails. */
{
 const id='electronic-switching-src-18',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||
    !L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))
    throw Error('SC18 unwired review baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',70,180,'G1','Sanal 5 V LED giriş beslemesi',{dcVoltage:5}),
  C('sg','push-no',300,150,'SG','Sanal LED tetikleme butonu',{state:false}),
  C('rin','resistor',530,160,'RIN','1 kΩ sanal LED giriş direnci',{resistance:1000}),
  C('u1','arduino-tlp521-1',840,310,'U1','TLP521-1 PDIP-4 · 1=A 2=K 3=E 4=C',{mq07OptoVirtual:true,mq07VirtualCtr:0.5,mq07VirtualLedDropV:1.2,mq07VirtualVceSatV:0.2}),
  C('g2','arduino-bench-supply',1030,120,'G2','Bağımsız 5 V sanal çıkış beslemesi',{dcVoltage:5}),
  C('rout','resistor',1320,200,'ROUT','4,7 kΩ sanal fototransistör yükü',{resistance:4700})
 ];
 p.wires.push(
  W('g1','P','sg','13','G1/P → SG/13','Giriş LED devresi pozitif sanal kaynağı.','#e53935','+24V'),
  W('sg','14','rin','1','SG/14 → RIN/1','Sanal LED akım sınırlama hattı.','#8b5cf6','SIGNAL'),
  W('rin','2','u1','1','RIN/2 → U1/1','TLP521 pin 1 LED anot.','#8b5cf6','SIGNAL'),
  W('u1','2','g1','M','U1/2 → G1/M','TLP521 pin 2 LED katot giriş referansına döner.','#111827','0V'),
  W('g2','P','rout','1','G2/P → ROUT/1','Bağımsız sanal çıkış pozitif hattı.','#e53935','+24V'),
  W('rout','2','u1','4','ROUT/2 → U1/4','Pin 4 çıkış fototransistörü collector.','#8b5cf6','SIGNAL'),
  W('u1','3','g2','M','U1/3 → G2/M','Pin 3 emitter yalnızca G2 negatif hattına döner.','#111827','0V')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'TLP521-1 optokuplörde sanal giriş LED akımını ve ayrı beslemeli fototransistör kolektör gerilimini karşılaştır. LED tetikleme OFF/ON/OFF olduğunda ışıkla iletim değişmeli; iki tarafta ortak kablo veya ortak GND olmamalı.',
  explanation:'AMAÇ: Yalnız yazılımsal 5 V DC devrede TLP521-1 optokuplörün LED girişini (1 anot, 2 katot) ve fototransistör çıkışını (3 emitter, 4 collector) elektriksel olarak ayrı görmek. Sanal G1 → SG → RIN 1 kΩ → U1/1 → U1/2 → G1/M giriş akımı yoludur. Bağımsız G2 → ROUT 4,7 kΩ → U1/4 → U1/3 → G2/M çıkış akımı yoludur. G1/M ile G2/M kabloyla birleştirilmez. SG OFF iken LED akımı sıfır, fototransistör OFF ve collector yaklaşık 5 V gözlenir. SG ON iken idealize 1,2 V LED ileri düşümüyle giriş akımı 3,8 mA, temsilî ve üretici tarafından doğrulanmamış yüzde 50 CTR varsayımıyla yeterli çıkış akımı oluşursa collector yaklaşık 0,2 V seviyesine iner. SG bırakılınca çıkış yeniden açık hale döner. Giriş ya da çıkış kablosu koparıldığında devrenin ayrı tepkileri incelenir. DİKKAT: Bu işlev testi gerçek TLP521-1 cihazının kesin sağlamlığı, izolasyon dayanımı veya üretici CTR ölçümü değildir; gerçek donanım testi yapılmamıştır.'
 });
 l.materials=materialRows(p);
 l.learningGoal='TLP521-1 dört DIP terminalini tanı; giriş LED akımı ile çıkış fototransistörü iletimini ve fiziksel kablo olmadan optik yalıtımı sanal değerlerle ayırt et.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'REVIEW_TLP521_OPTICALLY_ISOLATED_SIM',
  catalogProductId:'arduino-tlp521-1',
  virtualOpto:{separateSourceDomains:true,virtualCtr:0.5,manufacturerCtrCalibrated:false,physicalIsolationTested:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız yazılım içi iki ayrı düşük gerilimli sanal kaynak; gerçek izolasyon dayanım veya sağlamlık testi değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}
/* SC19 — MOC3021 LED-driven opto TRIAC + ST BTA16. Virtual, isolated, low voltage. */
{
 const id='electronic-switching-src-19',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||
   !L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT'))
   throw Error('SC19 unwired source baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',60,130,'G1','5 V sanal DC giriş kaynağı',{dcVoltage:5}),
  C('t1','virtual-opto-flasher-timer-v1',280,155,'T1','5 V beslemeli sanal flaşör',{frequencyHz:2,dutyPercent:50}),
  C('rin','resistor',520,170,'RIN','LED akım sınırlama · 330 Ω',{resistance:330}),
  C('u1','moc3021-opto-triac',830,250,'U1','MOC3021 · 1=A,2=K,4=T1,6=T2',{virtualLedDropV:1.2,virtualLedThresholdA:0.006}),
  C('ac1','virtual-isolated-ac-12v',80,500,'AC1','Bağımsız yalıtılmış 12 V RMS · 50 Hz',{rmsVoltage:12,frequencyHz:50,sourceEnabled:true}),
  C('h1','standard-light',500,570,'H1','120 Ω sanal AC yük',{resistance:120,mq07Sc19Load:true}),
  C('q1','bta16-600b-triac',1100,565,'Q1','ST BTA16-600B · MT1/MT2/G',{mq07VirtualHoldingCurrentA:0.03}),
  C('rdrive','resistor',1080,285,'RDR','330 Ω sanal opto güç yolu',{resistance:330}),
  C('rg','resistor',1090,385,'RG','180 Ω sanal gate yolu',{resistance:180}),
  C('rref','resistor',1310,565,'RREF','10 kΩ sanal gate–MT1 referansı',{resistance:10000})
 ];
 p.wires.push(
  W('g1','P','t1','V+','G1/P → T1/V+','Sanal flaşör DC pozitif beslemesi.','#e53935','+24V'),
  W('t1','GND','g1','M','T1/GND → G1/M','DC kontrol referansı.','#111827','0V'),
  W('t1','OUT','rin','1','T1/OUT → RIN/1','Zamanlayıcı LED çıkışı.','#8b5cf6','SIGNAL'),
  W('rin','2','u1','1','RIN/2 → U1/1','MOC3021 LED anot pin 1.','#8b5cf6','SIGNAL'),
  W('u1','2','g1','M','U1/2 → G1/M','MOC3021 LED katot pin 2.','#111827','0V'),
  W('ac1','AC','h1','X1','AC1/AC → H1/X1','Bağımsız yalıtılmış AC yük beslemesi.','#e53935','L1'),
  W('h1','X2','q1','MT2','H1/X2 → Q1/MT2','ST BTA16 MT2 güç terminali.','#8b5cf6','LOAD'),
  W('q1','MT1','ac1','RET','Q1/MT1 → AC1/RET','Yalıtılmış AC dönüşü; DC GND ile birleşmez.','#1e88e5','N'),
  W('q1','MT2','rdrive','1','Q1/MT2 → RDR/1','Opto-triyak AC tarafındaki tetikleme enerjisi.','#8b5cf6','SIGNAL'),
  W('rdrive','2','u1','6','RDR/2 → U1/6','MOC3021 AC T2 pin 6.','#8b5cf6','SIGNAL'),
  W('u1','4','rg','1','U1/4 → RG/1','MOC3021 AC T1 pin 4.','#8b5cf6','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','BTA16 gate MT1 referanslı sanal tetikleme.','#8b5cf6','SIGNAL'),
  W('q1','G','rref','1','Q1/G → RREF/1','Gate referans/kaçak yolu.','#8b5cf6','SIGNAL'),
  W('rref','2','q1','MT1','RREF/2 → Q1/MT1','AC tarafı gate referansı.','#1e88e5','N')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'Sanal 5 V flaşör, MOC3021 opto-triyak ve BTA16 ile yalıtılmış 12 V AC yükün iki yarım periyotta yanıp sönmesini incele. Kumanda ve yük kabloları fiziksel olarak ayrı kalır.',
  explanation:'AMAÇ: Sanal DC flaşörün LED akımıyla MOC3021 üzerinden BTA16 triyakını tetiklemesini ve bağımsız yalıtılmış AC yükün iki yarım periyotta davranışını incelemek. DC GİRİŞ: G1/P → T1/V+, T1/GND → G1/M, T1/OUT → RIN/1–2 → MOC3021 pin 1 LED anodu, pin 2 → G1/M. AC GÜÇ: AC1/AC → H1/X1–X2 → BTA16/MT2 → MT1 → AC1/RET. OPTİK ÇIKIŞ TARAFI: MT2 → RDR → MOC3021 pin 6 (AC T2), pin 4 (AC T1) → RG → BTA16 G; RREF gate–MT1 referansı. G1/M ile AC1/RET arasında hiçbir doğrudan bağlantı yoktur. Sanal T1 flaşör 2 Hz, yüzde 50 duty ile LED kontrol eder; optik iletim yalnız hesaplanan giriş akımı eşiği aşıldığında etkinleşir. BTA16 sanal modeli, her iki AC yarım periyotta optik tetikleme ile iletime geçer ve ana yük akımı tutma eşiği üstündeyken gate LED kapansa bile aynı yarım periyot boyunca tutar. Sıfır geçişine yakın kapanır; LED kapalıyken yeni yarım periyot tetiklenmez. Gerilim, akım ve RMS dalga üzerinden hesaplanır. DERS SINIRI: Bu bir fiziksel MOC3021 izolasyon/IGT testi, gerçek şebeke, üretici SPICE veya garantili sürücü devresi değildir. Tüm değerler yazılım içi düşük gerilimli sanal eğitim modelidir.'
 });
 l.materials=materialRows(p);
 l.learningGoal='MOC3021 LED girişini (1/2) opto-triyak çıkışından (4/6), ST BTA16 MT1/MT2/G güç devresinden ve T1 flaşör zamanlamasından ayırarak sanal DC/AC izolasyonunu gözlemlemek.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',titleTopologyIssue:null,
  titleTopologyStatus:'REVIEW_ISOLATED_OPTO_TRIAC_AC_FLASHER',
  catalogProductIds:['moc3021-opto-triac','bta16-600b-triac'],
  virtualOptoTriac:{softwareIsolationOnly:true,manufacturerIsolationTested:false,opticalThresholdCalibrated:false,zeroCrossModel:true,acBidirectionalVirtual:true},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız iki ayrı yazılım içi düşük gerilimli sanal devredir. AC şebeke veya gerçek fiziksel opto-triyak sürme yönergesi değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}

/* SC12 — IGBT driven LOW-VOLTAGE DC PWM brightness experiment.
   This is not an AC phase-angle dimmer or manufacturer-calibrated photometry. */
{
 const id='electronic-switching-src-12',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.wires.length||
    !L.mq07Batch200.reviewIds.some(x=>x.id===id&&x.reason==='NO_WIRED_CIRCUIT')||
    !L.mq07Batch200.noWireTriage.applicationRepairIds.includes(id))throw Error('SC12 source REVIEW baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',100,200,'G1','12 V sanal DC kaynak',{dcVoltage:12}),
  C('pwm1','virtual-pwm-generator-v1',330,180,'PWM1','Beslemeli PWM üreteci · DC',{dutyPercent:50,frequencyHz:1000}),
  C('rg','resistor',610,215,'RG','1 kΩ gate direnci',{resistance:1000}),
  C('rp','resistor',740,510,'RP','100 kΩ gate-emitter referansı',{resistance:100000}),
  C('q1','fga25n120antd-igbt',1020,420,'Q1','FGA25N120ANTD · IGBT G/C/E',{mq07DcPwmDimmer:true}),
  C('h1','standard-light',1320,240,'H1','12 V sanal dimmer yükü',{resistance:120,mq07DcPwmLamp:true})
 ];
 p.wires.push(
  W('g1','P','pwm1','V+','G1/P → PWM1/V+','PWM üretecinin gerçek elektriksel besleme ucu.'),
  W('pwm1','GND','g1','M','PWM1/GND → G1/M','PWM üreteci ile IGBT ortak referansı.','#111827','0V'),
  W('pwm1','OUT','rg','1','PWM1/OUT → RG/1','Kare dalga gate direnç yoluna gider.','#8b5cf6','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','IGBT gate kontrolü.','#8b5cf6','SIGNAL'),
  W('rp','1','q1','G','RP/1 → Q1/G','Gate referans direnci.','#8b5cf6','SIGNAL'),
  W('rp','2','g1','M','RP/2 → G1/M','Gate referansı emitter ile ortak.','#111827','0V'),
  W('q1','E','g1','M','Q1/E → G1/M','IGBT emitter DC dönüş hattı.','#111827','0V'),
  W('g1','P','h1','X1','G1/P → H1/X1','Sanal lambanın beslemesi.'),
  W('h1','X2','q1','C','H1/X2 → Q1/C','IGBT collector yük akım yolu.','#8b5cf6','SIGNAL')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'12 V DC PWM ile IGBT kontrollü sanal ışık kısma. Duty 0–100% elektriksel ON/OFF örneklenir; AC faz dimmeri değildir.',
  explanation:'AMAÇ: IGBT ile PWM duty değiştirildiğinde düşük gerilimli DC yükün enerjili kaldığı zaman oranını incelemek. MALZEMELER: G1 12 V sanal DC kaynak, PWM1 fonksiyonel sanal PWM sinyal üreteci, RG 1 kΩ, RP 100 kΩ, FGA25N120ANTD IGBT (G/C/E), H1 sanal ışık yükü. KUMANDA: G1/P → PWM1/V+, PWM1/GND → G1/M, PWM1/OUT → RG/1–2 → Q1/G, RP/1 → Q1/G, RP/2 ve Q1/E → G1/M. GÜÇ: G1/P → H1/X1–X2 → Q1/C → Q1/E → G1/M. İŞLEYİŞ: PWM1 OUT kare dalgası gate-emitter gerilimini sürer; özgün solver C-E iletimini ve yükün anlık enerjisini her fazda çözer. Duty %0 / %25 / %50 / %75 / %100 seçerek yükün zaman içindeki iletim oranını gözle. Gösterilen parlaklık yüzdesi faz örneklerinden türetilmiş eğitim amaçlı normalize gösterimdir; ölçülmüş lümen, gerçek sürücü kaybı, doğrulanmış IGBT doyum gerilimi veya AC şebeke faz kontrolü değildir. PWM1 OUT kesilirse ya da gate, collector veya emitter yolu koparsa dimmer devre dışı kalmalıdır.'
 });
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  titleTopologyIssue:null,titleTopologyStatus:'REVIEW_DC_PWM_IGBT_DIMMER_NOT_AC_PHASE',
  previousReason:'NO_WIRED_CIRCUIT',
  igbtVirtual:{realAcDimmer:false,manufacturerCalibrated:false,normalizedBrightnessOnly:true},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 12 V DC sanal PWM/IGBT yük deneyi. AC şebeke faz dimmeri ve gerçek sürücü tasarımı değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...(L.mq07Batch200.circuitRepairs||[]),id];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id];
}


/* Canonical LM358P differentiator/integrator graphs were already wired.
   Preserve their physical DIP-8 pins, probes and accepted original elements. */
// Mandatory no-substitutes gate: never show an unrelated transmitter or 4-20 mA
// loop as an op-amp circuit even when later lesson overrides change.
for(let n=1;n<=17;n++){
 const id='opamp-apps-src-'+String(n).padStart(2,'0'),l=L.byId[id];
 if(!l)continue;
 if((l.project?.components||[]).some(c=>/420|transmitter|loop-ammeter/i.test(c.typeId||'')))
  throw Error('LESSON_MATERIAL_FIDELITY: wrong op-amp device '+id);
 if(l.kind==='wiring'&&!l.project.components.some(c=>['lm358p-opamp-a','lm358p-dip8'].includes(c.typeId)))
  throw Error('LESSON_MATERIAL_FIDELITY: missing functional op-amp '+id);
}

/* MQ07 001–200 — subject-faithful op-amp ON/OFF delay lessons.
 * The previous generic inverting-amplifier project contained no timing capacitor.
 * Build two native DC RC/comparator graphs instead. No acceptance is inferred. */
for(const specification of [
 {id:'opamp-apps-src-09',name:'Op-amp turn-on gecikme',mode:'ON',
  chargeOhms:100000,bleedOhms:1000000,capFarads:100e-6},
 {id:'opamp-apps-src-10',name:'Op-amp turn-off gecikme',mode:'OFF',
  chargeOhms:1000,bleedOhms:100000,capFarads:100e-6}
]){
 const l=L.byId[specification.id];
 if(!l||l.designStandard==='rich-reference-v1'||!l.project||l.kind!=='quiz'||
    (l.project.wires||[]).length||l.project.components.some(c=>c.id==='c1'||c.id==='rch'))
    throw Error('MQ07 timing lesson baseline changed: '+specification.id);
 const on=specification.mode==='ON',p=base(specification.id,l.title);
 p.components=[
  C('g1','supply-dc-plus',70,245,'G1','Sanal 24 V DC kaynak',{dcVoltage:24}),
  C('s1','push-no',290,110,'S1','Başlatma butonu',{state:false}),
  C('rch','resistor',465,125,'R1',on?'100 kΩ yavaş şarj':'1 kΩ hızlı şarj',{resistance:specification.chargeOhms}),
  C('c1','capacitor',680,155,'C1','100 µF zamanlama kondansatörü',{capacitance:specification.capFarads}),
  C('rd','resistor',510,410,'R2',on?'1 MΩ boşalma yolu':'100 kΩ boşalma yolu',{resistance:specification.bleedOhms}),
  C('ref1','resistor',420,590,'R3','10 kΩ Vref üst kol',{resistance:10000}),
  C('ref2','resistor',610,590,'R4','10 kΩ Vref alt kol',{resistance:10000}),
  C('u1','lm358p-opamp-a',895,270,'U1A','LM358P · komparatör'),
  C('v1','meter-voltmeter',1120,370,'V1','Çıkış DC voltmetresi')
 ];
 p.wires.push(
  W('g1','P','s1','13','G1/P → S1/13','Kontrol kaynağının pozitif ucu.'),
  W('s1','14','rch','1','S1/14 → R1/1','S1 yalnızca RC şarj yolunu açıp kapatır.'),
  W('rch','2','c1','1','R1/2 → C1/1','R1 üzerindeki akım kondansatörü şarj eder.','#43a047','SIGNAL'),
  W('c1','2','g1','M','C1/2 → G1/M','Kondansatör dönüş yoludur.','#111827','0V'),
  W('rch','2','rd','1','C1/1 → R2/1','R2 zamanlama düğümünün boşalma yoludur.','#43a047','SIGNAL'),
  W('rd','2','g1','M','R2/2 → G1/M','Boşalma yolu besleme referansına döner.','#111827','0V'),
  W('rch','2','u1','IN+','C1/1 → U1/IN+','Kondansatör gerilimi evirmeyen girişte izlenir.','#43a047','SIGNAL'),
  W('g1','P','ref1','1','G1/P → R3/1','Eşik bölücüsünün üst beslemesi.'),
  W('ref1','2','ref2','1','R3/2 → R4/1','Eşik orta düğümü Vref ≈ 12 V.','#43a047','SIGNAL'),
  W('ref2','2','g1','M','R4/2 → G1/M','Eşik bölücüsü 0 V dönüşü.','#111827','0V'),
  W('ref1','2','u1','IN-','Vref → U1/IN−','U1 eviren girişte 12 V referansı karşılaştırır.','#43a047','SIGNAL'),
  W('g1','P','u1','V+','G1/P → U1/V+','LM358P pozitif besleme.'),
  W('g1','M','u1','V-','G1/M → U1/V−','LM358P negatif besleme/0 V.','#111827','0V'),
  W('u1','OUT','v1','1','U1/OUT → V1/1','OUT gerilimi seri yüke bağlanmadan ölçülür.','#43a047','SIGNAL'),
  W('v1','2','g1','M','V1/2 → G1/M','Voltmetre ortak 0 V referansı.','#111827','0V')
 );
 const tauCharge=on?'100 kΩ × 100 µF = 10 s nominal R1×C':'1 kΩ × 100 µF = 0,1 s nominal R1×C';
 const tauDischarge=on?'1 MΩ × 100 µF = 100 s':'100 kΩ × 100 µF = 10 s';
 const calc=on?
  'R2 yüklemesi altında son RC düğüm gerilimi yaklaşık 21,82 V, eşdeğer şarj zaman sabiti 9,09 s ve 12 V eşiğe teorik ulaşım yaklaşık 7,26 s olur. Buton bırakıldığında boşalma çok daha uzundur; yeni deneyden önce C1 sıfırlanmalıdır.':
  'S1 basılıyken R1=1 kΩ üzerinden hızlı şarj olur. S1 bırakılınca C1, R2=100 kΩ üzerinden deşarj olur; 24 V civarından 12 V eşiğe teorik süre yaklaşık 10 × ln(2) = 6,93 s olur.';
 setLesson(l,p,{kind:'wiring',
  summary:l.title+' — LM358P karşılaştırıcısı, R1–R2–C1 zamanlama ağı ve R3–R4 referans bölücüsüyle '+(on?'gecikmeli açma':'gecikmeli kapama')+' için kablolu sanal deney.',
  explanation:'DERSİN AMACI: '+(on?'Başlatma butonu basılıyken kondansatör gerilimi yavaşça yükselir ve referansı geçince çıkış durumu değişir.':'Başlatma butonu bırakıldıktan sonra C1 yavaşça boşalır ve referansın altına düşünce çıkış durumu değişir.')+
   ' MALZEMELER: G1 24 VDC sanal kaynak, S1 normalde açık buton, R1 şarj direnci, C1 100 µF kondansatör, R2 boşalma direnci, R3/R4 10 kΩ eşik bölücüsü, LM358P U1A ve V1 DC voltmetre. BAĞLANTILAR: G1/P→S1/13–14→R1/1–2→C1/1; C1/2→G1/M. R2, C1 ile paralel boşalma yoludur. C1/1→U1/IN+; R3/R4 orta noktası→U1/IN−. U1 V+/V− uçları G1 P/M raylarına, OUT→V1/1 ve V1/2→G1/M bağlıdır. HESAP: '+tauCharge+'; boşalma sabiti '+tauDischarge+'. '+calc+
   ' ÖĞRENCİ DENEYİ: Devre enerjili fakat S1 bırakılmışken OUT değerini incele; butona bas, C1 gerilimi 12 V eşiğini geçene kadar zamanın etkisini izlemeyi dene; S1 bırakıldığında çıkışın değişme koşulunu açıkla. KONTROL SORUSU: S1 ve R2 görevleri nedir? R2 çıkarılırsa C1 ne şekilde boşalır? R3/R4 oranı değişirse eşik neden kayar? SINIRLAR: Süreler ideal RC tahminleridir. Kaydedilmiş özgün solver zaman adımları ve Windows UI görsel doğrulaması olmadan gözlenen süre PASS ilan edilmez.',
  goal: 'LM358P karşılaştırıcısı ile R-C zamanlama düğümünün hangi terminal ve eşik değerine göre gecikme ürettiğini ayırt etmek.',
  beginnerSteps:[
   'Sanal G1/P ve G1/M uçlarını, U1A V+/V− besleme terminallerini ayır.',
   'S1/13–14 ve R1/1–2 seri kolundan C1/1 zamanlama düğümüne ulaş.',
   'R2 boşalma direncinin C1/1 ve 0 V arasındaki paralel görevini göster.',
   'R3/R4 10 kΩ gerilim bölücüsünden U1/IN− için 12 V eşiğini hesapla.',
   'C1/1→U1/IN+ ve OUT→V1 ölçüm bağlantılarını takip et.',
   on?'Buton basılı tutulduğunda gecikmeli çıkış değişimini, bırakıldıktan sonraki boşalmayla karşılaştır.':'Buton basılıyken hızlı şarjı, bırakıldıktan sonra R2 üzerinden yavaş boşalmayı karşılaştır.'
  ]
 });
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  previousTopologyIssue:'MISSING_RC_TIMING_STAGE',titleTopologyIssue:null,
  titleTopologyStatus:'RC_COMPARATOR_GRAPH_REPAIRED_DYNAMIC_QA_PENDING',
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,dynamicTimingAccepted:false};
 l.safety='Yalnız düşük gerilimli sanal RC ve karşılaştırıcı deneyi. Gerçek donanım veya fiziksel ölçüm kabulü yoktur.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==specification.id);
 L.mq07Batch200.circuitRepairs=[...new Set([...(L.mq07Batch200.circuitRepairs||[]),specification.id])];
}


/* MQ07 001–200 — replace the false 'precision half-wave rectifier'
   inverting amplifier (no diode) with a real 1N4148 superdiode network.
   Input potentiometer samples positive/negative excursions relative to Vref;
   this is a DC transfer demonstration, not verified sine-wave rectification. */
{
 const id='opamp-apps-src-15',l=L.byId[id];
 if(!l||l.designStandard==='rich-reference-v1'||!l.project||
   l.kind!=='quiz'||(l.project.wires||[]).length||
   l.project.components.some(c=>c.typeId==='1n4148-do35'))throw Error('MQ07 precision rectifier baseline changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','supply-dc-plus',65,190,'G1','Sanal 24 V DC kaynak',{dcVoltage:24}),
  C('rv1','potentiometer',245,200,'RV1','10 kΩ sanal giriş ayarı',{potMax:10000,potentiometer:50}),
  C('r3','resistor',370,445,'R3','10 kΩ Vref üst direnç',{resistance:10000}),
  C('r4','resistor',570,445,'R4','10 kΩ Vref alt direnç',{resistance:10000}),
  C('u1','lm358p-opamp-a',680,255,'U1A','LM358P A kanalı · hassas doğrultucu'),
  C('d1','1n4148-do35',900,260,'D1','1N4148 DO-35 gerçek diyot A/K'),
  C('r5','resistor',970,445,'R5','100 kΩ çıkış referans yükü',{resistance:100000}),
  C('v1','meter-voltmeter',1135,300,'V1','Vrect − Vref voltmetresi')
 ];
 p.wires.push(
  W('g1','P','rv1','1','G1/P → RV1/1','Giriş ayarının +24 V tarafı.'),
  W('rv1','3','g1','M','RV1/3 → G1/M','Giriş ayarının 0 V tarafı.','#111827','0V'),
  W('rv1','2','u1','IN+','RV1/2 → U1/IN+','Sanal pozitif/negatif yarım periyot örneklemesi için giriş seviyesi.','#43a047','SIGNAL'),
  W('g1','P','r3','1','G1/P → R3/1','Referans bölücünün üst kolu.'),
  W('r3','2','r4','1','R3/2 → R4/1','12 V orta referans düğümü.','#43a047','SIGNAL'),
  W('r4','2','g1','M','R4/2 → G1/M','Referans bölücüsü 0 V dönüşü.','#111827','0V'),
  W('g1','P','u1','V+','G1/P → U1/V+','LM358P besleme rayı.'),
  W('g1','M','u1','V-','G1/M → U1/V−','LM358P negatif besleme rayı.','#111827','0V'),
  W('u1','OUT','d1','A','U1/OUT → D1/A','Op-amp çıkışı diyot anodunu sürer.','#43a047','SIGNAL'),
  W('d1','K','u1','IN-','D1/K → U1/IN−','Diyot katodundan negatif geri besleme alınır.','#43a047','SIGNAL'),
  W('d1','K','r5','1','D1/K → R5/1','Doğrultulmuş çıkış düğümü.','#43a047','SIGNAL'),
  W('r5','2','r3','2','R5/2 → Vref','Diyot kesimdeyken ölçüm çıkışı orta referansta tutulur.','#43a047','SIGNAL'),
  W('d1','K','v1','1','D1/K → V1/1','Doğrultulmuş çıkış ölçümünün pozitif ucu.','#43a047','SIGNAL'),
  W('v1','2','r3','2','V1/2 → Vref','Ölçüm gerilimi 12 V referansa göre tanımlıdır.','#43a047','SIGNAL')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'LM358P + gerçek 1N4148 DO-35 diyot ile 12 V orta referanslı hassas pozitif yarım-dalga aktarım devresi. Genel eviren yükselteç yerine diyotlu geri besleme kurulur.',
  explanation:'DERSİN AMACI: Normal yarım dalga diyotta yaklaşık 0,7 V ileri gerilim düşümü varken op-amp ile çıkış geri beslemesine dahil edilen D1 diyotun düşük seviyeli sinyallerdeki hatası azaltılabilir. PARÇALAR: G1 sanal 24 V DC; RV1 10 kΩ giriş ayarı; LM358P U1 A kanalı; 1N4148 DO-35 D1 (A/K gerçek terminalleri); R3=R4=10 kΩ orta referans; R5=100 kΩ referans yükü; V1 voltmetre. REFERANS: R3/R4 gerilimi yaklaşık 12 V yapar; RV1 bunun altına/üstüne ayarlanarak sırasıyla negatif/pozitif yarım dalga örneklemesi yapılır. BAĞLANTILAR: RV1/2→U1/IN+; U1/OUT→D1/A; D1/K→U1/IN−, R5/1 ve V1/1. R5/2 ile V1/2 12 Vref düğümüne bağlıdır. U1 V+ ve V− G1/P ve G1/M uçlarındadır. İDEAL DAVRANIŞ: RV1 giriş gerilimi Vref üzerindeyken D1 ile geri besleme kapanır ve V1 ≈ Vin−Vref okunması beklenir; giriş Vref altında kalınca D1 kesime gider ve R5 çıkışı Vref yakınında tutar, V1 ≈ 0 gösterir. Bu ifade ideal, doyuma girmeyen çalışma için geçerlidir. ÖĞRENCİ DENEYİ: RV1 %25, %50 ve %75 konumlarıyla girişin eşik altı/üstü etkisini karşılaştır; D1 diyodunun A/K uçlarını bul ve ters bağlanırsa neyin değişeceğini açıkla. SINIR: Bu devre sanal DC giriş taramasıyla doğrultma aktarımını öğretir; özgün solverda zamanla değişen AC sinüsün fiziksel yarım dalga çıktısı, gerçek LM358 çıkış sınırları ve dinamik toparlanma henüz doğrulanmadığından AC dalga PASS verilemez.',
  goal:'Op-amp çıkış diyodu D1 ve negatif geri besleme terminalleri üzerinden hassas yarım dalga doğrultmanın çalışma mantığını göstermek.',
  beginnerSteps:[
   'LM358P V+/V− beslemesini ve R3/R4 ile 12 V orta referans düğümünü bul.',
   'RV1 10 kΩ giriş potansiyometresinin 1/2/3 terminallerini ayırt et.',
   'U1/OUT → D1/A ve D1/K → U1/IN− ile diyotlu geri beslemeyi izle.',
   'R5 çıkış yükünün 12 V referansa bağlanma nedenini açıkla.',
   'Voltmetrenin D1/K ile 12 Vref arasını ölçtüğünü doğrula.',
   'RV1 ayarı referansın altında/eşitinde/üstünde iken teorik V1 davranışını karşılaştır.'
  ]
 });
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',
  previousTopologyIssue:'MISSING_PRECISION_RECTIFIER_DIODE',titleTopologyIssue:null,
  titleTopologyStatus:'1N4148_PRECISION_RECTIFIER_GRAPH_DYNAMIC_QA_PENDING',
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,
  acWaveformAcceptance:false,dcTransferAccepted:false};
 l.safety='24 V düşük gerilimli sanal DC eğitim modeli. Fiziksel AC şebeke uygulaması değildir.';
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...new Set([...(L.mq07Batch200.circuitRepairs||[]),id])];
}


/* MQ-07: replace conceptual source boards with actual supported native
   diode-clipping and op-amp Schmitt terminal graphs. Dynamic QA remains open. */
{
 const id='oscillator-filter-apps-src-09',l=L.byId[id];
 if(!l||l.designStandard==='rich-reference-v1'||l.kind!=='quiz'||(l.project?.wires||[]).length)
  throw Error('MQ07 clipper canonical source changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','supply-dc-plus',70,205,'G1','Sanal 24 VDC besleme'),
  C('rv','potentiometer',235,205,'RV1','10 kΩ sanal giriş ayarı',{potMax:10000,potentiometer:50}),
  C('rin','resistor',470,185,'R1','22 kΩ seri sınırlama',{resistance:22000}),
  C('d1','1n4148-do35',800,220,'D1','Gerçek 1N4148 DO-35 diyot, A/K'),
  C('load','resistor',800,425,'R2','100 kΩ çıkış yükü',{resistance:100000}),
  C('ref1','resistor',420,490,'R3','1 kΩ referans üst',{resistance:1000}),
  C('ref2','resistor',600,490,'R4','1 kΩ referans alt',{resistance:1000}),
  C('v1','meter-voltmeter',1095,280,'V1','DC çıkış voltmetresi')
 ];
 p.wires.push(
  W('g1','P','rv','1','+24 V → RV1/1','Giriş üst ucu.'),
  W('rv','3','g1','M','RV1/3 → 0 V','Giriş alt ucu.','#111827','0V'),
  W('rv','2','rin','1','RV1/2 → R1/1','Giriş gerilimi 22 kΩ akım sınırlama yoluna girer.','#43a047','SIGNAL'),
  W('rin','2','d1','A','R1/2 → D1/A','Sınırlandırılacak düğüm diyot anodudur.','#43a047','SIGNAL'),
  W('rin','2','load','1','R1/2 → R2/1','Aynı düğümden çıkış yükü beslenir.','#43a047','SIGNAL'),
  W('load','2','g1','M','R2/2 → 0 V','Yük dönüşü.','#111827','0V'),
  W('g1','P','ref1','1','G1/P → R3/1','Referans bölücüsü üst kolu.'),
  W('ref1','2','ref2','1','R3/2 → R4/1','Yaklaşık 12 V referans orta düğümü.','#43a047','SIGNAL'),
  W('ref2','2','g1','M','R4/2 → G1/M','Referans alt kolu.','#111827','0V'),
  W('d1','K','ref1','2','D1/K → 12 Vref','Katot referans tarafından tutulur.','#43a047','SIGNAL'),
  W('rin','2','v1','1','Kırpılan çıkış → V1/1','Çıkış voltmetresinin artı ucu.','#43a047','SIGNAL'),
  W('v1','2','g1','M','V1/2 → 0 V','DC ölçüm referansı.','#111827','0V')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'Kırpıcı devre, gerçek 1N4148 A/K diyot uçlarıyla 12 V referansına bağlı akım sınırlamalı ve ölçülebilir DC giriş aktarımıdır.',
  explanation:'AMAÇ: Diyotlu genlik sınırlama işlevini sıradan buton veya çizim sembolü kullanmadan kurmak. MALZEMELER: 24 V sanal DC kaynak, RV1 10 kΩ, R1=22 kΩ, R2=100 kΩ yük, R3/R4=1 kΩ eşik bölücüsü, elektronik kütüphanesindeki 1N4148 DO-35 D1 ve V1 voltmetre. GERÇEK BAĞLANTILAR: G1/P→RV1/1, RV1/3→G1/M, RV1/2→R1/1, R1/2→D1/A ve R2/1, R2/2→G1/M. D1/K→R3/R4 orta referans düğümü; voltmetre çıkış ile 0 V arasındadır. ELEKTRİKSEL ÇALIŞMA: RV1 düşükken D1 kesimdedir, çıkışı R1/R2 gerilim bölücüsü belirler. RV1 yükselince çıkış, yaklaşık 12 V referans üzerine diyot ileri gerilimi kadar yükselmeye çalıştığında D1 iletime geçip üst genliği sınırlar. Diyotun gerçek ileri eğrisi ve bölücünün yüklendiğinde referans kayması vardır; ideal 12,7 V sert eşik varsayılmaz. ÖĞRENCİ DENEYİ: RV1 %10, %50, %90 konumlarını karşılaştır; D1/A ve D1/K yönünü, seri R1 olmadan akımın neden artacağını açıkla. SINIRLAR: Bu DC giriş taramalı bir kırpma örneğidir, AC sinüs dalgası ve ısıl ölçüm doğrulanmış değildir.',
  goal:'Seri giriş direnci, diyot A/K polaritesi, referans bölücüsü ve yükü ayırt ederek gerçek DC kırpma topolojisi kurmak.',
  beginnerSteps:[
   'Kütüphanedeki 1N4148 diyotun A ve K uçlarını tespit et.',
   'RV1/2 girişinden 22 kΩ R1 üzerinden çıkış düğümünü izle.',
   'R3/R4 bölücüsünün nominal 12 V referansını hesapla.',
   'D1/K katodunun referansa, D1/A anodunun kırpılan çıkışa bağlandığını göster.',
   'Voltmetrenin giriş yerine çıkışı ölçtüğünü kontrol et.',
   'Diyot ters yönde bağlansa kırpma davranışı neden değişir açıkla.'
  ]});
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',previousReason:'NO_WIRED_CIRCUIT',
  titleTopologyIssue:null,titleTopologyStatus:'DIODE_CLIPPER_GRAPH_REPAIRED',
  physicalAcceptance:false,manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,
  windowsVisualAcceptance:false,dcTransferAccepted:false,acWaveformAcceptance:false};
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...new Set([...(L.mq07Batch200.circuitRepairs||[]),id])];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...new Set([...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id])];
}
{
 const id='oscillator-filter-apps-src-13',l=L.byId[id];
 if(!l||l.designStandard==='rich-reference-v1'||l.kind!=='quiz'||(l.project?.wires||[]).length)
  throw Error('MQ07 oscillator Schmitt canonical source changed');
 const p=opampCircuitProject(id,'Schmitt Trigger');
 if(!p.components.some(c=>c.typeId==='lm358p-opamp-a')||
    !p.wires.some(w=>w.from.c==='r1'&&w.to.c==='u1'&&w.to.p==='IN+')||
    !p.wires.some(w=>w.from.c==='r2'&&w.to.c==='u1'&&w.to.p==='IN+'))
  throw Error('MQ07 Schmitt input/feedback graph not created');
 setLesson(l,p,{kind:'wiring',
  summary:'LM358P Schmitt tetikleyici: RV1 giriş, R1=10 kΩ seri direnç, R2=47 kΩ pozitif geri besleme ve R3/R4 gerilim bölücü.',
  explanation:'AMAÇ: Histerezisi gerçek pozitif geri beslemeli komparatör bağlantılarıyla öğretmek. MALZEMELER: Sanal 24 VDC kaynak, LM358P U1A, 10 kΩ RV1, R1=10 kΩ giriş, R2=47 kΩ OUT→IN+ geri besleme, R3/R4=10 kΩ 12 Vref bölücü ve V1 voltmetre. BAĞLANTILAR: RV1/2→R1/1→R1/2→U1/IN+. U1/OUT→R2/1→R2/2→U1/IN+; R3/R4 orta noktası U1/IN− ucundadır. U1 V+/V− 24/0 V raylarındadır. ÇALIŞMA: R1 ve R2 aynı IN+ düğümünde birleştiği için çıkış yüksekken ve düşükken eşik farklıdır. İdeal eşik formülü Vin≈12×(1+R1/R2)−Vout×R1/R2 olur. Gerçek LM358P çıkış salınımı güç raylarına tam ulaşmaz. ÖĞRENCİ DENEYİ: RV1 gerilimini yavaşça artırıp azalt; çıkışın açılış ve kapanış koşullarını karşılaştır. R2 kaldırılırsa pozitif geri besleme olmaz ve histerezis kaybolur. SINIR: Dinamik eşik davranışının solver ve Windows görsel kabulü henüz çalıştırılmadı.',
  goal:'Giriş seri direnci ile OUT pozitif geri besleme direncini ayırmak ve iki farklı giriş eşiğini açıklamak.',
  beginnerSteps:[
   'LM358P V+/V− besleme uçlarını ve R3/R4 12 V referans bölücüsünü tanı.',
   'RV1/2→R1/1→R1/2→IN+ giriş yolunu göster.',
   'OUT→R2/1→R2/2→IN+ pozitif geri besleme döngüsünü göster.',
   'IN− üzerindeki 12 V referansı doğrula.',
   'RV1 ayarını artırırken ve azaltırken çıkış davranışını karşılaştır.',
   'R2 çıkarıldığında neden histerezis oluşmayacağını açıkla.'
  ]});
 l.materials=materialRows(p);
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07Batch:'001_200',previousReason:'NO_WIRED_CIRCUIT',
  titleTopologyIssue:null,titleTopologyStatus:'LM358_SCHMITT_GRAPH_REPAIRED',
  physicalAcceptance:false,manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,
  windowsVisualAcceptance:false,dynamicHysteresisAccepted:false};
 L.mq07Batch200.reviewIds=L.mq07Batch200.reviewIds.filter(x=>x.id!==id);
 L.mq07Batch200.circuitRepairs=[...new Set([...(L.mq07Batch200.circuitRepairs||[]),id])];
 L.mq07Batch200.noWireTriage.applicationRepairIds=L.mq07Batch200.noWireTriage.applicationRepairIds.filter(x=>x!==id);
 L.mq07Batch200.noWireTriage.repairedVirtualIds=[...new Set([...(L.mq07Batch200.noWireTriage.repairedVirtualIds||[]),id])];
}


/* MQ-07 manufacturer part integrity: newly repaired teaching circuits must use
   the visible LM358P PDIP-8 product, not hidden legacy A-channel logical alias.
   Only the A channel pins are connected; B channel remains unused. */
for(const id of ['opamp-apps-src-09','opamp-apps-src-10','opamp-apps-src-15','oscillator-filter-apps-src-13']){
 const l=L.byId[id],p=l?.project,u=p?.components?.find(c=>c.id==='u1');
 if(!l||l.designStandard==='rich-reference-v1'||l.kind!=='wiring'||!u)
  throw Error('MQ07 physical LM358 source changed: '+id);
 if(u.typeId!=='lm358p-opamp-a')throw Error('Expected original logical unit before DIP-8 migration: '+id);
 u.typeId='lm358p-dip8';u.ref='U1';u.label='Texas Instruments LM358P PDIP-8 · kanal A · 1/2/3, besleme 8/4';
 const pins={'OUT':'1','IN-':'2','IN+':'3','V-':'4','V+':'8'};
 for(const wire of p.wires){
  for(const point of ['from','to']){
   const end=wire[point];
   if(end.c==='u1'){
    if(!pins[end.p]&&!['1','2','3','4','8'].includes(end.p))
     throw Error('Unrecognized LM358 pin '+end.p+' in '+id);
    if(pins[end.p])end.p=pins[end.p];
   }
  }
 }
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint||'',why:w.tutorialWhy||'',color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.explanation+=' FİZİKSEL KÜTÜPHANE EŞLEMESİ: U1 LM358P DIP-8 çift op-amp paketidir. Kullanılan A kanalı OUT=1, IN−=2, IN+=3, V−=4, V+=8 gerçek paket pinleriyle çizilmiştir. Diğer B kanalı bu çalışmada kullanılmaz. Bu pin bilgisi şemanın doğrulanmış ürün kimliğine dayanır; dinamik/Windows kabulünün yapıldığı anlamına gelmez.';
 l.pedagogyReview={...(l.pedagogyReview||{}),manufacturerPartId:'lm358p-dip8',
  manufacturerPinMap:'LM358P A: 1=OUT,2=IN-,3=IN+,4=V-,8=V+',
  physicalAcceptance:false,windowsVisualAcceptance:false};
}


/* MQ-07 material-fidelity correction: replace simulated stand-in part identity
   with the real existing semiconductor catalog product (still low-voltage software
   demonstrations, NEVER manufacturer-calibrated power-circuit acceptance). */
for(const repair of [
 {id:'electronic-switching-src-12',from:'mq07-igbt-virtual',to:'fga25n120antd-igbt',
  label:'onsemi FGA25N120ANTD · TO-3P · G/C/E (sanal 12 V eğitim devresi)',
  source:'https://www.onsemi.com/pdf/datasheet/fga25n120antdtu-d.pdf',
  kind:'IGBT',pins:['G','C','E']},
 {id:'electronic-switching-src-16',from:'mq07-triac-virtual',to:'bta16-600b-triac',
  label:'ST BTA16-600B · TO-220AB yalıtılmış · MT1/MT2/G; AC devre henüz kurulmadı',
  source:'https://www.st.com/resource/en/datasheet/bta16.pdf',
  kind:'TRIAC',pins:['MT1','MT2','G']}
]){
 const lesson=L.byId[repair.id],p=lesson?.project;
 const device=p?.components?.find(c=>c.id==='q1');
 // SC12 is now already constructed with the real IGBT identity. It must not
 // be converted a second time from the removed virtual stand-in.
 if(['electronic-switching-src-12','electronic-switching-src-16'].includes(repair.id)&&
    device?.typeId===repair.to&&lesson?.kind==='wiring'&&p.wires.length>0){
   lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
     catalogProductId:repair.to,catalogManufacturerSource:repair.source,
     actualManufacturerModelRecorded:true,physicalAcceptance:false,
     manufacturerCalibrationVerified:false,independentPedagogicalAcceptance:false,
     windowsVisualAcceptance:false};
   continue;
 }
 if(!lesson||lesson.designStandard==='rich-reference-v1'||!device||
    device.typeId!==repair.from)throw Error('MQ07 catalog replacement baseline changed: '+repair.id);
 device.typeId=repair.to;device.label=repair.label;
 device.tutorialPurpose='Gerçek ürün kimliği ve '+repair.pins.join('/')+' terminalleriyle eğitim amaçlı karşılaştırma; güç elektroniğinin üretici özellikleri sanal solverda kalibre değildir.';
 lesson.materials=materialRows(p);
 lesson.explanation+=' ÜRÜN KÜTÜPHANESİ: Şemadaki Q1 artık genel sanal sembol değil, serbest elektronik atölye kütüphanesindeki '+repair.label+'. Üretici kaynağı: '+repair.source+'. Çizim ve terminal kimliği ürün kaydına dayanır; fiziksel paket boyutu, uzun süreli iletim, ısıl kayıp veya AC faz çözümü doğrulanmadan donanım kabulü yapılmaz.';
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
   catalogProductId:repair.to,catalogManufacturerSource:repair.source,
   originalVirtualTypeId:repair.from,actualManufacturerModelRecorded:true,
   physicalAcceptance:false,manufacturerCalibrationVerified:false,
   independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 if(repair.kind==='TRIAC'){
  if(lesson.kind!=='quiz'||(p.wires||[]).length||!p.referenceOnly)
   throw Error('TRIAC AC source must remain unwired REVIEW');
  lesson.pedagogyReview.titleTopologyIssue='NO_WIRED_CIRCUIT';
  lesson.pedagogyReview.titleTopologyStatus='REVIEW_REAL_BTA16_AC_DRIVE_UNAVAILABLE';
 }
}


/* MQ-07: SC13/SC14 manufacturer-product identity correction.
   Preserve existing teaching wires, only replace the virtual SCR stand-in.
   Manufacturer pin order is K-A-G on TO-220AB front view, while software
   terminals are named K/A/G independently of physical pin number. */
for(const id of ['electronic-switching-src-13','electronic-switching-src-14']){
 const l=L.byId[id],p=l?.project,q=p?.components.find(c=>c.id==='q1');
 if(!l||l.designStandard==='rich-reference-v1'||l.kind!=='wiring'||
    !q||q.typeId!=='mq07-scr-virtual'||
    !p.wires.some(w=>(w.from.c==='q1'||w.to.c==='q1')&&(w.from.p==='G'||w.to.p==='G'))||
    !p.wires.some(w=>(w.from.c==='q1'||w.to.c==='q1')&&(w.from.p==='A'||w.to.p==='A'))||
    !p.wires.some(w=>(w.from.c==='q1'||w.to.c==='q1')&&(w.from.p==='K'||w.to.p==='K')))
   throw Error('Manufacturer SCR graph baseline changed: '+id);
 q.typeId='tyn612rg-scr';
 q.label='STMicroelectronics TYN612RG · TO-220AB SCR · fiziksel pin 1 K / 2 A / 3 G';
 q.tutorialPurpose='ST TYN612RG gerçek ürün kimliği; terminal adları K/A/G, veri sayfasında ön görünümde 1=K, 2=A, 3=G. Native solver kapı-eşik örneğidir; gerçek tutma/latch fiziği kabul edilmedi.';
 l.materials=materialRows(p);
 l.explanation+=' MALZEME DOĞRULAMASI: Q1 artık sanal çizim yerine elektronik atölyesi kütüphanesinin TYN612RG TO-220AB ürün kaydıdır. ST üretici çiziminde pin 1=K, 2=A, 3=G sırasındadır. Buradaki 12 V sanal öğretici devre fiziksel SCR tutma akımını, gate akımı sınırını ve ısıl karakteristiği tam hesaplamaz. Ürün kaynağı: https://www.st.com/resource/en/datasheet/tyn612.pdf .';
 l.pedagogyReview={...(l.pedagogyReview||{}),catalogProductId:'tyn612rg-scr',
  catalogManufacturerSource:'https://www.st.com/resource/en/datasheet/tyn612.pdf',
  originalVirtualTypeId:'mq07-scr-virtual',manufacturerPinMap:'front view 1=K,2=A,3=G',
  manufacturerGeometryAccepted:false,manufacturerCalibrationVerified:false,
  physicalAcceptance:false,independentPedagogicalAcceptance:false,
  windowsVisualAcceptance:false,dynamicLatchingAccepted:false};
}


/* MQ-07 SC20 only: retain LM358P NTC divider and add a separate IRF540N
   virtual 24 V temperature-controlled load. No SC11-SC19 modification. */
{
 const id='sensor-analog-apps-src-01',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==9||p.wires.length!==12||
  !p.components.some(x=>x.id==='u1'&&x.typeId==='lm358p-dip8')||
  !p.components.some(x=>x.id==='s1'&&x.typeId==='sensor-ntc')||
  p.components.some(x=>x.id==='h1'||x.id==='q1'))
  throw Error('SC20 NTC baseline changed');
 p.components.push(
  C('rg','resistor',810,105,'RG','10 kΩ gate üst',{resistance:10000}),
  C('rp','resistor',810,300,'RP','10 kΩ gate alt',{resistance:10000}),
  C('q1','irf540n-mosfet',1050,360,'Q1','IRF540N sanal G/D/S yük anahtarı',{mq07NtcThermalSwitch:true}),
  C('h1','standard-light',1200,205,'H1','240 Ω sanal 24 V gösterge',{resistance:240})
 );
 p.wires.push(
  W('u1','1','rg','1','U1/1 OUT → RG/1','Karşılaştırıcı çıkışı gate bölücüsünü besler.','#43a047','SIGNAL'),
  W('rg','2','rp','1','RG/2 → RP/1','Sanal MOSFET gate düğümünün 10k/10k direnç bölücüsü.','#43a047','SIGNAL'),
  W('rg','2','q1','G','Bölücü → Q1/G','Kontrol akımı gate yüküne doğrudan değil bölücüyle aktarılır.','#43a047','SIGNAL'),
  W('rp','2','g1','M','RP/2 → 0 V','Gate düğümü için dirençli dönüş yolu.','#111827','0V'),
  W('g1','P','h1','X1','+24 V → H1/X1','Yük enerjisi op-amp OUT üzerinden çekilmez.','#8b5a2b','+24V'),
  W('h1','X2','q1','D','H1/X2 → Q1/D','Ayrı güç kolunun drain bağlantısı.','#8b5a2b','+24V'),
  W('q1','S','g1','M','Q1/S → 0 V','Yük akımının sıfır volt dönüşü.','#111827','0V')
 );
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='NTC sıcaklık artışında çalışan sanal yük: B1 sıcaklığa duyarlı direnç, LM358P karşılaştırıcı, RG/RP kapı bölücüsü, IRF540N anahtar ve ayrı H1 yükü.';
 l.explanation='B1 NTC üst kol, R1 10 kΩ alt koldur; B1/2 U1 pin 3 IN+ ucuna bağlıdır. G1 24 V sanal besleme, R2/R3 10 kΩ orta düğümünü U1 pin 2 IN− için 12 V referans yapar; U1 pin 8 +24 V ve pin 4 0 V. LM358P U1 pin 1 OUT → RG 10 kΩ → IRF540N Q1/G; RP 10 kΩ Q1/G düğümünden 0 V noktasına gider, gate yüksek düzeyi yaklaşık 11 V ile sınırlar. Ayrı güç akımı: G1/P → H1/X1–X2 (240 Ω) → Q1/D–S → G1/M. Sanal 15 °C için NTC yaklaşık 15,84 kΩ, IN+ yaklaşık 9,29 V, OUT LOW, H1 OFF; sanal 35 °C için NTC yaklaşık 6,51 kΩ, IN+ yaklaşık 14,54 V, OUT HIGH, H1 ON yaklaşık 100 mA. B1 sıcaklığını özellikler panelinden 15→35→15 °C ayarla. Mevcut UNI-T UT33D+ DCV ve kırmızı/siyah VΩmA/COM problarıyla sanal düğüm gerilimini ölç. 25 °C yakınında Schmitt histerezisi yoktur; fiziksel LM358P çıkış akımı, IRF540N gerçek eşik/ısıl toleransı, güç kayıpları ve fiziksel donanım kabulü hesaplanmamıştır.';
 l.learningGoal='NTC sıcaklığını 15→35→15 °C değiştirerek LM358P çıkışını, IRF540N G/D/S terminalini ve H1 sanal yük OFF→ON→OFF akımını açıklamak.';
 l.beginnerSteps=[
  'B1 NTC ve R1 10 kΩ algılama bölücüsünü incele.',
  'R2/R3 10 kΩ ile U1 pin 2 referansında 12 V oluştuğunu doğrula.',
  'B1/2 → U1 pin 3 ve U1 pin 8/4 besleme bağlantılarını ayırt et.',
  'U1 pin 1 → RG/RP gate bölücüsü → IRF540N Q1/G yolunu takip et.',
  'G1/P → H1 → Q1/D-S → 0 V güç yolunu op-amp çıkışından ayrı göster.',
  'B1 sıcaklığını sanal 15 °C ayarla ve H1 OFF durumunu gözlemle.',
  'Sıcaklığı 35 °C yap; H1 ON ve yaklaşık 100 mA sayısal akımını gözlemle.',
  '15 °C ye geri dönerek H1 OFF durumunu karşılaştır; gerçek donanım kabulü çıkarma.'
 ];
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'NTC_THERMAL_LOADED_SWITCH_SOURCE_ALIGNED',
  ntcThermalSwitch:{supplyV:24,referenceV:12,ntcR25Ohm:10000,
   ntcBetaK:3950,gateDividerOhm:[10000,10000],loadOhm:240,
   isolatedSolverVerified:true,nodeSuiteExecuted:false,manufacturerCalibrated:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 24 V düşük gerilimli sanal NTC devresi; gerçek ürün, ısıl, şebeke ve üretici donanım kabulü yapılmadı.';
}


/* MQ-07 SC21: PTC thermistor changes the comparator polarity and drives a
   real separate virtual load. Existing NTC and SC11-SC19 remain untouched. */
{
 const id='sensor-analog-apps-src-02',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==9||p.wires.length!==12||
    !p.components.some(x=>x.id==='s1'&&x.typeId==='sensor-ptc')||
    !p.components.some(x=>x.id==='u1'&&x.typeId==='lm358p-dip8')||
    p.components.some(x=>x.id==='q1'||x.id==='h1'))
   throw Error('MQ07 SC21 PTC canonical baseline changed');
 const r1=p.components.find(x=>x.id==='r1');
 if(!r1||r1.resistance!==10000)throw Error('PTC original R1 baseline changed');
 r1.resistance=2000;r1.label='R1 · 2 kΩ PTC alt bölücü';
 const sensorInput=p.wires.find(w=>w.from.c==='s1'&&w.from.p==='2'&&w.to.c==='u1'&&w.to.p==='3');
 const referenceInput=p.wires.find(w=>w.from.c==='r2'&&w.from.p==='2'&&w.to.c==='u1'&&w.to.p==='2');
 if(!sensorInput||!referenceInput)throw Error('PTC original LM358P input wire mismatch');
 sensorInput.to.p='2';sensorInput.tutorialHint='PTC algılama → U1 pin 2 IN−';
 sensorInput.tutorialWhy='PTC ısınınca direnç artar ve alt düğüm gerilimi düşer.';
 referenceInput.to.p='3';referenceInput.tutorialHint='12 V referans → U1 pin 3 IN+';
 referenceInput.tutorialWhy='Sıcaklık yükseldiğinde IN+ > IN− olduğunda çıkış yükselir.';
 p.components.push(
  C('rg','resistor',810,105,'RG','10 kΩ gate üst',{resistance:10000}),
  C('rp','resistor',810,300,'RP','10 kΩ gate alt',{resistance:10000}),
  C('q1','irf540n-mosfet',1050,360,'Q1','IRF540N sanal G/D/S yük anahtarı',{mq07PtcThermalSwitch:true}),
  C('h1','standard-light',1200,205,'H1','240 Ω / 24 V sanal yük',{resistance:240})
 );
 p.wires.push(
  W('u1','1','rg','1','U1/1 OUT → RG/1','Karşılaştırıcı çıkışı 10 kΩ gate bölücüsüne bağlıdır.','#43a047','SIGNAL'),
  W('rg','2','rp','1','RG/2 → RP/1','Gate gerilimi 10k/10k direnç bölücüsüyle sınırlandırılır.','#43a047','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','Elektriksel gerilim MOSFET kontrol ucuna iletilir.','#43a047','SIGNAL'),
  W('rp','2','g1','M','RP/2 → 0 V','Gate kontrol kolunun dirençli dönüşü.','#111827','0V'),
  W('g1','P','h1','X1','+24 V → H1/X1','Ayrı 24 V güç kolunun beslemesidir.','#8b5a2b','+24V'),
  W('h1','X2','q1','D','H1/X2 → Q1/D','H1 akımı MOSFET drain yolundan akar.','#8b5a2b','+24V'),
  W('q1','S','g1','M','Q1/S → 0 V','Sanal yük akımı 0 V referansına döner.','#111827','0V')
 );
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='PTC ısındığında artan sensör direnci 2 kΩ alt bölücünün gerilimini düşürür; LM358P 12 V referansıyla karşılaştırıp IRF540N sanal yükü yaklaşık 53 °C eşik üzerinde açar.';
 l.explanation='Yalnız düşük gerilimli 24 V sanal PTC eğitim devresinde B1 sensör direnci 25 °C’de 1 kΩ, sıcaklıkla üstel artış modeli 0,025/°C katsayılıdır. G1/P → B1/1–2 → R1 2 kΩ → G1/M bölücüsü; B1/2 U1 pin 2 IN− ucuna bağlanır. R2/R3 10k/10k bölücüsü U1 pin 3 IN+ için 12 V referansı verir. LM358P U1 pin 8 +24 V ve pin 4 0 V. Isınırken PTC artar, IN− gerilimi düşer; yaklaşık 52,7 °C civarında IN− = 12 V geçilir ve karşılaştırıcı OUT (pin 1) yükselir. OUT → RG 10 kΩ → IRF540N Q1/G; RP 10 kΩ gate ile 0 V arasında, yüksek gate yaklaşık 11 V. Ayrı yük kolu G1/P → H1/X1-X2 (240 Ω) → Q1/D-S → G1/M. 35 °C’de PTC ≈1,284 kΩ, IN− ≈14,62 V, H1 OFF. 65 °C’de PTC ≈2,718 kΩ, IN− ≈10,17 V, H1 ON yaklaşık 100 mA. PTC sıcaklık ayarı B1 özelliklerinden 35→65→35 °C seçilir. UNI-T UT33D+ mevcut kırmızı VΩmA ve siyah COM probuyla sanal karşılaştırma düğümleri ölçülür. Basitleştirilmiş modelde histerezis yoktur; gerçek PTC, LM358P çıkış yükü, IRF540N sıcaklık/ısıl kaybı ve fiziksel güvenlik onaylanmamıştır.';
 l.learningGoal='PTC sıcaklığı 35→65→35 °C değiştiğinde algılama direnci artarken IN− geriliminin düştüğünü, IN+/IN− eşik geçişini ve sanal H1 yükünün OFF→ON→OFF olmasını açıklamak.';
 l.beginnerSteps=[
  '24 V besleme, B1 PTC ve 2 kΩ R1 alt bölücüsünü bul.',
  'R2/R3 10 kΩ üzerinden 12 V referansı LM358P pin 3 IN+ üzerinde göster.',
  'B1/2 → U1 pin 2 IN− ve U1 pin 8/4 besleme uçlarını doğrula.',
  'U1 pin 1 çıkışı, RG/RP 10 kΩ ve IRF540N Q1/G kontrol yolunu incele.',
  'G1/P → H1 → Q1/D-S → 0 V ana yük akım yolunu izle.',
  'PTC sıcaklığını 35 °C yap, karşılaştırıcı düşük ve H1 OFF durumunu kontrol et.',
  '65 °C yap, PTC direnci yükseldiğinde H1 ON yaklaşık 100 mA sonucunu gözlemle.',
  '35 °C ye dön, H1 OFF olduğunu gözlemle. Gerçek cihaz testi yaptığını iddia etme.'
 ];
 l.quiz={question:'Sanal PTC ısı kontrollü devrede 65 °C olduğunda H1 neden açılır?',
  options:['PTC direnci artar, IN− düşer ve LM358P çıkışı Q1 gate ucunu sürer.',
   'PTC direnci azalır ve doğrudan H1 üzerinden akım geçirir.',
   'R2 ve R3 dirençleri fiziksel sıcaklık sensörüne dönüşür.'],answer:0,
  why:'PTC artan sıcaklıkla artan dirençtir; bu bağlantıda 12 V referansına göre IN− düşmesi MOSFET kontrolünü açar.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'PTC_THERMAL_LOADED_SWITCH_SOURCE_ALIGNED',
  ptcThermalSwitch:{supplyV:24,referenceV:12,ptcR25Ohm:1000,
    betaPerC:.025,r1Ohm:2000,nominalThresholdC:52.73,gateDividerOhm:[10000,10000],
    loadOhm:240,isolatedSolverVerified:true,fullNodeSuiteExecuted:false,
    manufacturerCalibrated:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 24 V sanal PTC devresi; gerçek ürün, ısıl limit, eşik toleransı ve üretici donanım kabulü yapılmadı.';
}


/* MQ07 SC22: only target thermocouple lesson uses native numeric
   UT33D+ DCV 200mV via virtual probe-to-plug connection. */
{
 const id='sensor-analog-apps-src-03',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==3||p.wires.length!==4||
  !p.components.some(c=>c.id==='tc'&&c.typeId==='thermocouple')||
  !p.components.some(c=>c.id==='ctl'&&c.typeId==='temperature-controller')||
  !p.components.some(c=>c.id==='g1'&&c.typeId==='supply-1p'))
  throw Error('SC22 canonical baseline changed');
 const tc=p.components.find(c=>c.id==='tc'),ctl=p.components.find(c=>c.id==='ctl');
 Object.assign(tc,{temperature:100,coldJunction:25,thermocoupleType:'K'});
 ctl.instrumentSettings={...(ctl.instrumentSettings||{}),input:'K',supply:'UV',displayOnly:'on',set:150,filter:1};
 p.components.push(
  C('v1','unit-ut33d-plus',1000,155,'V1','UNI-T UT33D+ sanal DCV 200 mV',{meterPosition:1}),
  C('v1-red','test-probe-red',920,380,'PRV1','Kırmızı sanal TC+ probu',
    {probeTarget:{c:'tc',p:'+'},mq07ThermocoupleMeterProbe:true}),
  C('v1-black','test-probe-black',1180,380,'PBV1','Siyah sanal TC− probu',
    {probeTarget:{c:'tc',p:'−'},mq07ThermocoupleMeterProbe:true})
 );
 p.wires.push(
  W('v1','V','v1-red','PLUG','V1/VΩmA → kırmızı sanal prob',
    'DCV 200 mV gerilim ölçümü için VΩmA giriş kablosu.','#e53935','MEASURE'),
  W('v1','COM','v1-black','PLUG','V1/COM → siyah sanal prob',
    'Termokupl soğuk ucu karşılaştırma COM giriş kablosu.','#111827','MEASURE')
 );
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='Sanal K tipi termokuplun sıcak-soğuk birleşim farkından üretilen milivolt sinyali UNI-T UT33D+ DCV 200 mV ve ET4420 sıcaklık göstergesiyle karşılaştırılır.';
 l.explanation='YALNIZ YAZILIM: K tipi TC1 sıcak birleşim sıcaklığı ve coldJunction soğuk birleşim referansı ayrı değerlerdir. Referans 25 °C iken sıcak uç 25 °C için 0,000 mV, 100 °C için yaklaşık 3,096 mV, 200 °C için yaklaşık 7,138 mV üretir (NIST tabanlı eğri). Önceden kayıtlı TC+/TC− uçları ENDA ET4420 kontrolörün sanal K sensör girişindedir; ET4420 ekranı ölçüm gerilimini değil yaklaşık °C sıcaklık değerini gösterir. Yazılımda kontrolör salt gösterge modundadır ve çıkış rölesi veya SSR sıcaklık yükü kontrolü olarak kabul edilmez. Besleme terminalinin görüntüsü gerçek şebeke bağlantısı talimatı değildir. V1 UNI-T UT33D+ 200 mV DCV modunda kırmızı VΩmA prob TC+ hedefine, siyah COM prob TC− hedefine temas eder. Özgün sayısal çözücüde 100 °C durumunda V1 yaklaşık 3,100 mV gösterir; sanal ölçüm probu kutupları terslenirse eksi işaretli okunur. ET4420 TC sensörü ters ya da kopuksa geçerli PV yerine hata verir. Kullanıcı sanal sıcaklığı TC özelliklerinden değiştirir. Soğuk birleşim telafisi, üretici kalibrasyonu, gerçek donanım toleransı veya fiziksel güvenlik onaylanmış değildir.';
 l.learningGoal='Sanal K tipi termokupl için 25, 100 ve 200 °C sıcaklıkta TC+/TC− milivolt farkını ET4420 sıcaklık PV değerinden ayırmak ve ters/kopuk sensör hatasını tanımak.';
 l.beginnerSteps=[
  'Sanal TC+/TC− uçlarını ve ET4420 K sensör girişini tanımla.',
  'ET4420 yalnız gösterge modundadır; kontrol rölesi/yük kullanımı kapsam dışıdır.',
  'UT33D+ sanal DCV 200 mV ayarını, kırmızı VΩmA ve siyah COM kablolarını bul.',
  'Prob uçlarını sanal TC+ ve TC− hedeflerinde doğrula; mV ile °C birimlerini ayır.',
  'Sanal sıcaklığı 25 °C seç: referans 25 °C iken V1≈0 mV.',
  '100 °C seç: V1≈3,1 mV ve ET4420 PV≈100 °C.',
  '200 °C seç: V1≈7,1 mV ve ET4420 PV≈200 °C.',
  'Sanal probları tersle, sonra TC sensör bağlantısını aç/tersle; işaret ve hata durumunu karşılaştır.'
 ];
 l.quiz={question:'Sanal K termokupl 100 °C ve soğuk birleşim 25 °C iken ne beklenir?',
  options:['UT33D+ yaklaşık +3,1 mV ölçer, ET4420 yaklaşık 100 °C gösterir.',
   'Termokupl direnci her zaman 10 kΩ olur.','Termokupl 100 VDC üretir.'],
  answer:0,why:'Termokupl mV üretir; kontrolörün °C sıcaklık gösterimi mV ile aynı birim değildir.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'TC_K_CJC_MV_METER_SOURCE_ALIGNED',
  mq07ThermocoupleExperiment:{type:'K',coldJunctionC:25,meterRangeV:.2,
    onlyTargetProbeOptIn:true,sourceV8Verified:true,fullNodeSuiteExecuted:false,manufacturerCalibrated:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal yazılım termokupl ve kontrolör deneyi; gerçek elektrik, şebeke, üretici, ısıl veya donanım güvenlik kabulü yapılmaz.';
}


/* MQ-07 SC23 / PT100: three distinct virtual leads and matching ET4420
   software terminals. This source change is scoped to only this lesson. */
{
 const id='sensor-analog-apps-src-04',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==3||p.wires.length!==5||
    !p.components.some(c=>c.id==='pt'&&c.typeId==='sensor-pt100')||
    !p.components.some(c=>c.id==='ctl'&&c.typeId==='temperature-controller')||
    !p.components.some(c=>c.id==='g1'&&c.typeId==='supply-1p'))
   throw Error('MQ07 SC23 PT100 canonical graph changed');
 const pt=p.components.find(c=>c.id==='pt'),ctl=p.components.find(c=>c.id==='ctl');
 const wA=p.wires.find(w=>w.from.c==='pt'&&w.from.p==='A'&&w.to.c==='ctl'&&w.to.p==='8');
 const wB1=p.wires.find(w=>w.from.c==='pt'&&w.from.p==='B1'&&w.to.c==='ctl'&&w.to.p==='9');
 const wB2=p.wires.find(w=>w.from.c==='pt'&&w.from.p==='B2'&&w.to.c==='ctl'&&w.to.p==='10');
 if(!wA||!wB1||!wB2)throw Error('MQ07 SC23 original PT100 lead endpoints changed');
 wA.to.p='10';wA.tutorialHint='PT100 tek uç → sanal TIC1/10';
 wA.tutorialWhy='Üç telli sanal RTD ölçümündeki tek taraf ucudur.';
 wB1.to.p='8';wB1.tutorialHint='PT100 B1 → sanal TIC1/8';
 wB1.tutorialWhy='Ortak tarafın ilk ayrı sanal ölçüm telidir.';
 wB2.to.p='9';wB2.tutorialHint='PT100 B2 → sanal TIC1/9';
 wB2.tutorialWhy='Ortak tarafın ikinci ayrı sanal ölçüm telidir.';
 pt.temperature=25;
 ctl.mq07Pt100ThreeWireInput=true;
 ctl.instrumentSettings={...(ctl.instrumentSettings||{}),input:'PT100',supply:'UV',displayOnly:'on',set:150,filter:1};
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='Sanal 3 telli PT100 ölçümü: ideal 0 °C 100 Ω, 25 °C 109,73 Ω ve 100 °C 138,51 Ω; üç ayrı terminal yolu geçerliyse ET4420 ideal sıcaklığı gösterir.';
 l.explanation='Yalnız düşük riskli yazılım simülasyonudur. PT100 sensöründe A bir uç tarafı, B1 ve B2 ortak diğer uç tarafının iki ayrı kablosudur. ET4420 sanal giriş modelinde A, tek uç 10 numaralı sanal noktaya; B1 ve B2 eşdeğer ortak uç kabloları bağımsız 8 ve 9 numaralı sanal noktalara gider. Üç kablo da ayrı ayrı doğrulanır, B1/B2 yer değişimi aynı sensör tarafı olduğu için kabul edilir. İki telli PT100 için 8–9 simülasyon köprüsü politikası ayrıdır; burada üçüncü telin yerine geçmez. ET4420 yalnız gösterge modundadır; röle/SSR yük çıkışları etkin eğitim yükü olarak kabul edilmez. İdeal PT100 direnç modeli 0 °C=100 Ω, 25 °C≈109,735 Ω, 100 °C≈138,505 Ω üretir ve yazılım kontrolörü buna uygun ideal PV gösterir. Bu hesap gerçek kablo direnci telafisini, dengesiz hatları, belirsizlik kalibrasyonunu veya fiziksel ürün/üretici hassasiyetini modellemez. Sensör sıcaklığını yazılım özelliklerinden değiştir; üç sanal sensör hattından biri kopuk veya yanlış uçta ise gösterge hata vermelidir. Görseldeki besleme uçları gerçek şebeke veya fiziksel pano bağlantısı için talimat değildir.';
 l.learningGoal='Sanal PT100 için 3 ayrı hat varlığını ve 0/25/100 °C ideal direnç-PV ilişkisini gözlemek; tel kopukluğu ve yanlış terminali geçerli sıcaklıkla karıştırmamak.';
 l.beginnerSteps=[
  'Sanal PT100 üzerinde A tek uç ve B1/B2 ortak taraf uçlarını ayırt et.',
  'Üç ayrı sanal sensör sinyal yolunun ET4420 farklı girişlerine ulaştığını gör.',
  'ET4420 sanal PT100 seçimini ve yalnız gösterge modunu doğrula.',
  '0 °C sıcaklıkta ideal 100 Ω ve PV≈0 °C sonucunu denetle.',
  '25 °C sıcaklıkta ideal 109,73 Ω ve PV≈25 °C sonucunu denetle.',
  '100 °C sıcaklıkta ideal 138,51 Ω ve PV≈100 °C sonucunu denetle.',
  'Sanal B1/B2 eşdeğer uçlarını yer değiştir: sonuç korunmalıdır.',
  'Yalnız yazılımda herhangi bir RTD telini kopart veya yanlış girişle eşleştir: kontrolör hata göstermelidir; fiziksel kablo telafisi onaylı değildir.'
 ];
 l.quiz={question:'3 telli sanal PT100 ölçümünde hangi ifade doğrudur?',
   options:['0 °C için yaklaşık 100 Ω olur; üç ayrı tel doğruysa ideal sıcaklık PV okunur.',
    'PT100 ısı artınca sıfır direnç olur.',
    'PT100 termokupl gibi aynı sensör mV gerilimini üretir.'],
   answer:0,why:'PT100 bir direnç sıcaklık sensörüdür. Yazılım ayrı üç kabloyu denetler ama gerçek kablo telafisi yapmaz.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
   titleTopologyStatus:'PT100_THREE_WIRE_VIRTUAL_TERMINAL_ALIGNED',
   mq07Pt100ThreeWire:{nominalOhmAt0C:100,leadCount:3,
    explicitWirePresenceChecked:true,physicalLeadCompensationVerified:false,
    isolatedNativeSourceVerified:true,fullNodeSuiteExecuted:false},
   physicalAcceptance:false,manufacturerCalibrationVerified:false,
   independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal PT100 ölçüm ve sıcaklık görüntüleme deneyidir; gerçek enerjili şebeke/donanım bağlantısı ve üretici fiziksel kabulü yoktur.';
}


/* MQ-07 SC24 only: turn LM35 10mV/C analog output into a real Arduino
   A0 ADC source. Other Arduino sensors and SC11–SC23 remain unchanged. */
{
 const id='sensor-analog-apps-src-05',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==3||p.wires.length!==5||
  !p.components.some(x=>x.id==='ps'&&x.typeId==='arduino-bench-supply')||
  !p.components.some(x=>x.id==='s1'&&x.typeId==='arduino-lm35')||
  !p.components.some(x=>x.id==='u1'&&x.typeId==='arduino-uno'))
  throw Error('MQ-07 SC24 LM35 canonical graph changed');
 const ps=p.components.find(x=>x.id==='ps'),s=p.components.find(x=>x.id==='s1'),
       uno=p.components.find(x=>x.id==='u1');
 const wired=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 if(![['ps','P','s1','VCC'],['ps','M','s1','GND'],
       ['ps','P','u1','5V'],['ps','M','u1','GND'],['s1','AO','u1','A0']].every(x=>wired(...x)))
  throw Error('MQ-07 SC24 original LM35 terminal path changed');
 ps.dcVoltage=5; s.arduinoValue=25; s.mq07Lm35Model=true;
 uno.arduinoSketch='int adc=0;float voltage=0;float tempC=0;void setup(){}void loop(){adc=analogRead(A0);voltage=adc*5.0/1023.0;tempC=voltage*100.0;delay(1);}';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='Yalnız sanal 5 V LM35 sıcaklık ölçümü: sensör 10 mV/°C analog gerilim üretir ve Arduino UNO A0 üzerinde 10-bit analogRead ile sıcaklık hesaplanır.';
 l.explanation='Sadece sanal Arduino laboratuvarı: G1 5 VDC masa kaynağı P/+ ucu LM35 VCC ve UNO 5V ucuna, G1 M/0 V ucu LM35 GND ve UNO GND ucuna bağlanır. Sensör AO/OUT terminali UNO A0 analog girişine ayrı bir kabloyla bağlıdır. Yalnız bu dersteki MQ07 LM35 sayısal modelinde çıkış gerilimi Vout=temperature(°C)×0,010 V olarak hesaplanır; eğitim aralığı 0–125 °C, ADC referansı 5,00 V, beklenen ADC kodu round(Vout/5×1023). 0 °C→0 V→0, 25 °C→0,25 V→51, 50 °C→0,50 V→102, 100 °C→1,00 V→205, 125 °C→1,25 V→256. UNO sketch analogRead(A0) değerini adc değişkeninde tutar; voltage=adc×5/1023, tempC=voltage×100 ile yaklaşık sıcaklığı hesaplar. Arduino kodu A0 ADC kuantalaması nedeniyle hesaplanan sıcaklık ideal sensör ayarından biraz farklı olabilir. G1 sanal 5 V besleme, VCC ya da GND bağlantısı hatalıysa LM35 analog sıcaklık modeli enerjisiz sayılır ve ADC 0 okur; AO–A0 kablosu koparsa A0 kaynaktan veri alamaz. Sensor arayüzündeki arduinoValue değeri bu ders için °C sıcaklıktır, ham ADC kodu DEĞİLDİR. Başka Arduino temperature sensörleri veya normal analog modül ADC davranışları değiştirilmez. Sensörün gerçek akım sınırlaması, ADC gürültüsü, besleme toleransı, üretici sıcaklık doğruluğu, uç termal kayıpları ve donanım kalibrasyonu modellenmemiştir. Bu yalnız bilgisayar simülasyonudur; fiziksel elektrik devresi kurulum yönergesi değildir.';
 l.learningGoal='Sanal LM35 sıcaklığının 10 mV/°C gerilimine ve UNO 10 bit A0 ADC sayısına dönüşmesini, ortak 5 V referansın zorunluluğunu ve açık AO/VCC/GND kablosundaki sıfır ölçümünü ayırmak.';
 l.beginnerSteps=[
  'Sanal 5 VDC G1 kaynağının +/0 V hatlarını LM35 VCC/GND ve UNO 5V/GND ile karşılaştır.',
  'LM35 AO/OUT kablosunun gerçek UNO A0 girişine bağlı olduğunu göster.',
  'Arduino sketch içinde analogRead(A0), adc, voltage ve tempC değişkenlerini incele.',
  'LM35 arduinoValue ayarını 0 °C seç ve 0 V / ADC 0 okunduğunu gözle.',
  '25 °C seç, 0,25 V ve ADC yaklaşık 51 değerini karşılaştır.',
  '50 °C seç, 0,50 V ve ADC yaklaşık 102 değerini karşılaştır.',
  '100 °C seç, 1,00 V ve ADC yaklaşık 205 değerini karşılaştır.',
  'Yalnız yazılım içinde AO, VCC ya da GND kablosunu ayır; ADC’nin ölçümü neden kaybettiğini ve bunun gerçek ürün kalibrasyonu olmadığını açıkla.'
 ];
 l.quiz={question:'Sanal LM35 25 °C ve UNO 5 V ADC referansındayken doğru A0 okuması nedir?',
  options:['Yaklaşık 0,25 V ve ADC kodu 51.',
   'Yaklaşık 25 V ve ADC kodu 1023.',
   'Sıcaklık direnç gibi 25 Ω olur.'],
  answer:0,why:'LM35 sanal modeli 10 mV/°C, UNO A0 5 V / 1023 kod ölçeklemesi kullanır.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'LM35_5V_ANALOG_ADC_SOURCE_ALIGNED',
  mq07Lm35Arduino:{supplyV:5,referenceV:5,millivoltPerC:10,adcBits:10,
   temperatureMinC:0,temperatureMaxC:125,sourceV8ScenariosPassed:10,
   voltageAndGndWiresChecked:true,fullNodeSuiteExecuted:false,
   physicalCalibrated:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız yazılım sanal 5 V Arduino/LM35 deneyi. Gerçek donanım, üretici kalibrasyonu veya fiziksel güvenlik kabulü yapılmadı.';
}


/* MQ-07 SC25 only: KY-021 Reed magnetic slider (>=65%) -> powered
   5 V digital output -> actual Arduino UNO D2 read. SC11–SC24 unchanged. */
{
 const id='sensor-analog-apps-src-06',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==3||p.wires.length!==5||
  !p.components.some(c=>c.id==='ps'&&c.typeId==='arduino-bench-supply')||
  !p.components.some(c=>c.id==='s1'&&c.typeId==='arduino-reed')||
  !p.components.some(c=>c.id==='u1'&&c.typeId==='arduino-uno'))
  throw Error('MQ-07 SC25 Reed canonical source graph changed');
 const power=p.components.find(c=>c.id==='ps'),sensor=p.components.find(c=>c.id==='s1'),
       uno=p.components.find(c=>c.id==='u1');
 const has=(a,ap,b,bp)=>p.wires.some(w=>w.from.c===a&&w.from.p===ap&&w.to.c===b&&w.to.p===bp);
 if(![['ps','P','s1','VCC'],['ps','M','s1','GND'],
       ['ps','P','u1','5V'],['ps','M','u1','GND'],['s1','DO','u1','D2']].every(row=>has(...row)))
  throw Error('MQ-07 SC25 original Reed terminal connections changed');
 power.dcVoltage=5;sensor.reedMagnet=0;sensor.state=false;
 sensor.mq07ReedDigitalModel=true;
 uno.arduinoSketch='int reed=0;void setup(){pinMode(2,INPUT);}void loop(){reed=digitalRead(2);delay(1);}';
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='Sanal KY-021 Reed uygulaması: mıknatıs sürgüsü %65 veya üzerine geldiğinde 5 V beslemeli sensörün DO sinyali HIGH olur, Arduino UNO D2 digitalRead değeri 1 okur; uzaklaştırılınca 0.';
 l.explanation='Bu ders yalnız yazılım simülasyonudur. KY-021 mini Reed sensörü görselinde manyetik sürgü reedMagnet=0..100 olarak değişir; malzeme görünümü zaten %65 ve üstünü yakın mıknatıs olarak renklendirir. Yalnız SC25 opt-in dijital modelinde mıknatıs ≥65 ise mantık HIGH (1), daha küçükse LOW (0) olarak hesaplanır. Bir önceki elle saklanan state değeri ölçümün yerine geçmez; sürgü gerçekte hangi konumdaysa o okunur. G1 sanal 5 VDC kaynağının P/M uçları sensör VCC/GND ve UNO 5V/GND ile ortak doğru elektriksel düğümlerde olmalıdır. KY-021 DO ayrı Arduino UNO D2 girişindedir. UNO sketch pinMode(2,INPUT); reed=digitalRead(2) kullanır ve 0/1 değerini gösterir. Mıknatıs 0/60/64 konumunda D2 LOW, 65/80/100 konumunda D2 HIGH olur; mıknatıs 0→80→20→100→0 hareket ettirilince Arduino sırasıyla 0→1→0→1→0 izler. Sensörün 5 V beslemesi ya da ortak GND kesilirse DO düşük/enerjisiz kabul edilir; DO/D2 kablosu kesilirse sensör doğru tetiklense bile Arduino D2 üzerinde geçerli HIGH okunamaz. Bu yalnız dijital eğitim modelidir: gerçek KY-021 çıkış modülü iç topolojisi, farklı modül NO/NC polaritesi, çekme direnci karakteristiği, gerçek manyetik alan şiddeti ve histerezis üretici kalibrasyonuyla doğrulanmamıştır. Reed temasının tek başına enerji üretmediği; 5 V beslemenin sanal modüle ait olduğu ve gerçek devre bağlantı tarifi yapılmadığı vurgulanır.';
 l.learningGoal='Sanal mıknatıs sürgüsü ve 5 V beslemeye bağlı KY-021 DO terminalindeki 0/1 durumunu Arduino D2 digitalRead ile karşılaştırmak; eski state verisi ve kopuk güç/sinyal kablolarından yanlış HIGH çıkarılmasını önlemek.';
 l.beginnerSteps=[
  'Sanal KY-021 ve UNO arasındaki P→VCC, M→GND, DO→D2 bağlantılarını bul.',
  'Arduino sketch içinde pinMode(2,INPUT) ve reed=digitalRead(2) ifadelerini göster.',
  'Mıknatısı görsel sürgüde 0 ve 60 değerine taşı: D2 0 olmalı.',
  'Mıknatısı 64 değerine getir: sınırın altı LOW durumudur.',
  'Mıknatısı 65 ve ardından 80 değerine getir: D2 1 olmalı.',
  'Mıknatısı uzaklaştırıp 20 değerine dön: D2 yeniden 0 olmalı.',
  '0→80→20→100→0 sanal geçişinde okumanın 0→1→0→1→0 olduğunu doğrula.',
  'Yalnız sanal devrede VCC/GND veya DO/D2 bağlantısını açıp sensör DO ile Arduino D2 okumasını ayır; bu fiziksel ürün kabulü değildir.'
 ];
 l.quiz={question:'Sanal Reed sürgüsü 80 konumunda iken DO→D2 kablosu koparsa ne olur?',
  options:['Sanal sensör tetiklenmiş olabilir fakat Arduino D2 geçerli HIGH okumaz.',
   'Arduino D2 kablo olmadan sürekli HIGH olur.',
   'Reed sensörü elektrik enerjisi ürettiğinden besleme gerekmez.'],
  answer:0,why:'Sensör çıkışındaki durum ile Arduino girişindeki elektriksel okuma ayrı kontrol edilir; kablo kopuksa sensör sinyali D2’ye ulaşmaz.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'KY021_REED_MAGNET_D2_SOURCE_ALIGNED',
  mq07ReedArduino:{virtualSupplyV:5,magnetSliderThreshold:65,
   expectedLogic:[0,1,0,1,0],sourceScenariosPassed:13,
   digitalInput:'D2',sourceTested:true,fullNodeSuiteExecuted:false,
   physicalProductPolarityCalibrated:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız bilgisayarda sanal KY-021 Reed ve Arduino dijital girişi; fiziksel modül polaritesi, gerçek elektriksel tasarım ve üretici kabulü yapılmamıştır.';
}


/* MQ-07 SC26: only Hall sensor lesson's magnetic target and PNP 24V relay load. */
{
 const id='sensor-analog-apps-src-07',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==5||p.wires.length!==7||
  !p.components.some(x=>x.id==='s1'&&x.typeId==='sensor-hall')||
  !p.components.some(x=>x.id==='k1'&&x.typeId==='coil-relay')||
  !p.components.some(x=>x.id==='ka1'&&x.typeId==='contact-no')||
  !p.components.some(x=>x.id==='h1'&&x.typeId==='lamp-green')||
  !p.components.some(x=>x.id==='g1'&&x.typeId==='arduino-bench-supply'))
  throw Error('MQ-07 SC26 canonical Hall source graph changed');
 const wired=(a,ap,b,bp)=>p.wires.some(w=>w.from?.c===a&&w.from.p===ap&&w.to?.c===b&&w.to.p===bp);
 if(![['g1','P','s1','BN'],['g1','M','s1','BU'],['s1','BK','k1','A1'],
 ['k1','A2','g1','M'],['g1','P','ka1','13'],['ka1','14','h1','X1'],
 ['h1','X2','g1','M']].every(x=>wired(...x)))
  throw Error('MQ-07 SC26 Hall PNP/relay/lamp terminals changed');
 const g=p.components.find(x=>x.id==='g1'),s=p.components.find(x=>x.id==='s1');
 g.dcVoltage=24;s.outputType='PNP';s.state=false;
 s.sensing={target:'magnet',range:10,distance:20,offset:0,face:'right',auto:false,travelDirection:-1};
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='24 V sanal Hall PNP sensöründe mıknatıs algılanınca BK çıkışı K1 bobinini enerjiler; K1 NO 13/14 kontağı ayrı yük kolundaki H1 lambasını çalıştırır.';
 l.explanation='Yalnız yazılımsal 24 VDC deneydir. Gerçek katalogdaki ayarlanabilir G1 sanal masa güç kaynağı P (+) ucundan B1 Hall sensör BN (kahverengi) ucuna, M (0 V) ucundan BU (mavi) ucuna gider. PNP BK (siyah) çıkışı K1 bobin A1 ucuna, K1 A2 ise 0 V a bağlıdır. H1 yük kolu ayrı güç döngüsüdür: G1 P → K1 NO 13/14 → H1 X1 → H1 X2 → G1 M. Mıknatıs yakınken BK hattı +24 V taşır, K1 çeker, NO kontak kapanır ve H1 yanar; mıknatıs uzaklaştığında K1 ve H1 söner. Eğitimde sanal magnet hedefi için 10 mm örnek algılama eşiği ve 6 mm hizalama sınırı kullanılır. Bunlar ürün datasheet gerçek manyetik alan şiddeti, ölçülmüş mT veya algılama mesafesi olarak yorumlanamaz. Varsayılan sanal mıknatıs 20 mm uzaktadır; 5 mm ye yaklaştırıldığında sensör algılar. Plastik hedef algılanmaz, hizalama bozulursa OFF olur. BN veya BU beslemesi koparsa sensör çıkışı çalışmaz; BK sinyali kesilirse sensör algılasa da röle ve lamba çalışmaz. Sanal masa kaynağı 0 V olursa hem K1 hem H1 OFF, 12 V olursa bu 24 V nominal sensör-kumanda modeli OFF kalır. Güç kaynağı elektriksel çözücüde zaten c.dcVoltage ile izlendiğinden global kaynak davranışı değiştirilmez. Fiziksel pano, sigorta, bobin ters EMK bastırma, gerçek Hall eşik kalibrasyonu ve üretici arayüz kabulü bu derste doğrulanmamıştır.';
 l.learningGoal='Mıknatısın Hall sanal algılama hedefi oluşunu, PNP BK kontrol sinyalini, K1 bobin ve 13/14 NO kontakla ayrı H1 yük beslemesini ayırt edip kesinti ve sıcak/sinyal hatlarını karşılaştırmak.';
 l.beginnerSteps=[
  'G1 sanal 24 VDC P/M çıkışlarını Hall BN/BU sensör besleme uçlarında kontrol et.',
  'Hall PNP BK ucundan K1/A1 bobine ve K1/A2 ucundan 0 V hattına bak.',
  'K1 NO 13/14 kontağının H1 yük kolunu ayrı anahtarladığını göster.',
  'Mıknatıs uzakta (20 mm) K1 ve H1 OFF olduğunu gözle.',
  'Mıknatısı 5 mm sanal yaklaştır: BK PNP HIGH, K1 ON, NO kapalı ve H1 ON.',
  'Mıknatısı tekrar uzaklaştır: K1 bırakır, H1 söner.',
  'Sanal BN/BU besleme veya BK sinyal kablosunu ayır ve H1 fail-closed OFF durumunu doğrula.',
  'Sanal 24 V kaynağını 0 V yap: H1 OFF. 10 mm eşik sanal eğitim ayarıdır, üretici toleransı değildir.'
 ];
 l.quiz={question:'Sanal 24 V Hall PNP sensörü mıknatısı algıladığında H1 neden yanar?',
 options:['Hall BK PNP sinyali K1 bobinini çeker; K1 NO 13/14 kontağı H1 yük devresini kapatır.',
 'Hall sensörü tek başına şebekeden 230 V üretir ve lambayı besler.',
 'PNP BK yalnız direnç ölçer ve bobini etkileyemez.'],
 answer:0,why:'PNP sensör bobin kontrol yoluna sinyal üretir, lamba ayrı K1 NO güç kontağıyla beslenir.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'HALL_PNP_24V_RELAY_LAMP_SOURCE_ALIGNED',
  mq07HallMagnetic:{virtualNominalV:24,target:'magnet',exampleThresholdMm:10,
  isolatedSourceTested:true,manufacturerCalibrationVerified:false,fullNodeSuiteExecuted:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 24 VDC sanal ders; gerçek fiziksel bağlantı, manyetik ölçüm/kalibrasyon, üretici röle koruma ve saha güvenliği kabul edilmedi.';
}


/* MQ-07 SC27: source-aligned passive Piezo, real virtual impulse button and
   continuously refreshed transient on the UT33D+ 200 mV voltage range. */
{
 const id='sensor-analog-apps-src-08',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==5||p.wires.length!==4||
  l.pedagogyReview?.titleTopologyStatus!=='VIRTUAL_PIEZO_SOURCE_ALIGNED')
  throw Error('MQ07 SC27 Piezo canonical source graph changed');
 const lead=(a,ap,b,bp)=>p.wires.some(w=>w.from?.c===a&&w.from.p===ap&&w.to?.c===b&&w.to.p===bp);
 if(![['pz','+','r1','1'],['r1','2','pz','−'],['v1','V','v1-red','PLUG'],['v1','COM','v1-black','PLUG']].every(x=>lead(...x)))
  throw Error('MQ07 SC27 Piezo measurement source terminals changed');
 const pz=p.components.find(c=>c.id==='pz'),v=p.components.find(c=>c.id==='v1'),
  red=p.components.find(c=>c.id==='v1-red'),black=p.components.find(c=>c.id==='v1-black');
 if(!pz||pz.typeId!=='tutorial-piezo'||!v||v.typeId!=='unit-ut33d-plus'||
  !red||red.typeId!=='test-probe-red'||!black||black.typeId!=='test-probe-black'||
  red.probeTarget?.c!=='pz'||red.probeTarget.p!=='+'||
  black.probeTarget?.c!=='pz'||black.probeTarget.p!=='−')
  throw Error('MQ07 SC27 Piezo original physical contact identity changed');
 pz.mq07PiezoTapUi=true;pz.piezoTapAt=null;pz.piezoTapMv=100;
 v.meterPosition=1;
 l.summary='Piezoelektrik sanal elemana ekranındaki “Sanal darbe uygula” denetimiyle kısa mekanik darbe uygula; UT33D+ 200 mV DCV kademesinde geçici gerilimi ve kendiliğinden sıfıra sönmesini izle. Gerçek kuvvet kalibrasyonu yapılmış değildir.';
 l.explanation+=' Sanal ders sırasında önce SİMÜLE ET başlatılır; yalnız B1 piezo bileşeninde görünen “Sanal darbe uygula” denetimine tıklanınca geçen süre performans saatiyle yeniden başlatılır ve UT33D+ göstergesi darbe devam ederken otomatik yenilenir. Her yeni sanal darbe 100 mV başlangıç, 220 ms ideal üstel sönüm varsayımıdır; yaklaşık 1,6 saniye sonunda 0 mV olur. Kırmızı veya siyah prob fiş kablosu ayrılırsa multimetre OL gösterir; probun Piezo elektroduna temas ucu ayrılırsa ölçülen gerilim 0 mV olur. Problar terslenirse DCV negatif işaret gösterir. Direnç teli ayrılsa bile yazılımdaki gerilim kaynağı ideal geçici EMK olduğu için 1 MΩ yükün gerçek fiziksel sönüm süresi hesaplanmaz. Fiziksel Piezo karakteristiği, tam SPICE eşdeğeri, üretici parametreleri veya gerçek mekanik kuvvet ölçümü doğrulanmamıştır.';
 l.beginnerSteps=[
  'B1 üzerindeki + ve − elektrotları ile R1 1 MΩ sanal yükün bağlantılarını kontrol et.',
  'V1 UT33D+ ölçü aletinin DCV 200 mV kademesini, kırmızı VΩmA ve siyah COM prob fişlerini doğrula.',
  'SİMÜLE ET komutunu başlat; darbe öncesi UT33D+ değerinin 0 mV olduğunu gözle.',
  'Piezo B1 bileşeni üzerindeki “Sanal darbe uygula” kontrolüne tıkla: yaklaşık +100 mV anlık gerilim oluşur.',
  'Gösterge otomatik yenilenirken yaklaşık 150 ms sonra +50,57 mV, 500 ms sonra +10,30 mV ve 1.601 ms sonra 0 mV model sonucunu izle.',
  'Yalnız sanal devrede ölçü problarını ters çevir; işaretin eksiye dönmesini incele. Prob kablosunu çıkararak OL ve temas ucunu ayırarak 0 mV durumunu gör.',
  'Bu değerlerin gerçek Piezo sensörün kuvvet hassasiyetine veya gerçek 1 MΩ/kapasitans RC çözümüne ait olmadığını açıkla.'
 ];
 l.learningGoal='Sanal kullanıcı darbesi → iki elektrot arasında geçici 100 mV → otomatik sönüm ve UT33D+ gerilim ölçümü zincirini, prob polaritesini ve eksik bağlantı arızasını ayırt etmek.';
 l.quiz={question:'SC27 Piezo sanal darbe sonrası UT33D+ ne göstermelidir?',
  options:['Başta geçici +100 mV, 220 ms zaman sabitiyle azalan değer ve darbe sonrasında 0 mV.',
   'Harici 24 V besleme olmadan sürekli sabit 24 V.',
   'Mekanik basınç değişmeden sonsuz süre +100 mV.'],
  answer:0,why:'Piezo ideal geçici EMK eğitim modelidir; gerçek üretici kuvvet/kapasitans kalibrasyonu değildir.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyStatus:'PIEZO_INTERACTIVE_IMPULSE_MV_SOURCE_ALIGNED',
  mq07PiezoImpulse:{virtualAmplitudeMv:100,virtualTauMs:220,endAfterMs:1600,probeMeter:'UT33D+ 200 mV DCV',
   sourceVoltageDecayVerified:true,targetedMeterLeadFailureVerified:true,
   physicalCalibrationVerified:false,fullNodeSuiteExecuted:false,windowsInteractiveTestExecuted:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız yazılım içi Piezo sanal darbesi ve mV ölçümüdür. Gerçek mekanik vurma, enerjili devre, kuvvet kalibrasyonu, gerçek cihaz hassasiyeti veya fiziksel kabul değildir.';
}


/* MQ-07 SC28: explicit user-approved upgrade from historically protected
 * NO_WIRED_CIRCUIT Load Cell quiz to dynamically measured source wiring.
 * Historic MQ07 reviewIds remain an immutable record of the original gap.
 * Only this target ID changes; the other concept quiz guards stay in force. */
{
 const id='sensor-analog-apps-src-09',l=L.byId[id];
 if(!l||l.kind!=='quiz'||l.project.components.length!==2||l.project.wires.length!==0||
   l.pedagogyReview?.titleTopologyStatus!=='REVIEW'||
   !L.mq07Batch200?.noWireTriage?.conceptPreservedIds?.includes(id))
  throw Error('MQ-07 SC28 protected initial Load Cell source changed');
 const p=base(id,l.title);
 p.components=[
  C('g1','arduino-bench-supply',75,220,'G1','Sanal 24 VDC TX11 besleme',{dcVoltage:24,currentLimit:1}),
  C('lc','load-cell',320,240,'B1','Kobastar SB2 · ideal 2 mV/V köprü',{loadCapacity:1000,loadWeight:500}),
  C('tx','weighing-indicator',675,225,'TX1','BAYKON TX11 · tartım göstergesi',{
   instrumentSettings:{zeroMv:0,spanMv:10,capacity:1000,output:'4-20mA'}
  })
 ];
 p.wires.push(
  W('g1','P','tx','+','24 VDC sanal besleme → TX11/+','TX11 gösterge elektroniğini sanal 24 VDC kaynağı besler.','#8b5a2b','+24V'),
  W('g1','M','tx','−','0 VDC → TX11/−','Gösterge elektronik besleme ortak dönüşüdür.','#111827','0V'),
  W('tx','EX+','lc','EX+','TX11 +Ex → SB2 EX+','TX11 5 VDC sanal Wheatstone köprüsü uyartımıdır.','#e53935','EXCITE'),
  W('tx','EX−','lc','EX−','TX11 −Ex → SB2 EX−','Köprünün uyartım dönüş noktasıdır.','#111827','EXCITE'),
  W('lc','SIG+','tx','S+','SB2 SIG+ → TX11 +Si','Köprünün pozitif mV diferansiyel ölçüm hattıdır.','#43a047','SIGNAL'),
  W('lc','SIG−','tx','S−','SB2 SIG− → TX11 −Si','Köprünün negatif mV diferansiyel ölçüm hattıdır.','#111827','SIGNAL')
 );
 setLesson(l,p,{kind:'wiring',
  summary:'Sanal Kobastar SB2 ideal 2 mV/V yük hücresi, BAYKON TX11 tartım göstergesinden 5 V uyartım alır. 1000 kg ayarında 0/250/500/750/1000 kg yük → 0/2,5/5/7,5/10 mV ve göstergede 0/250/500/750/1000 kg.',
  explanation:'Yalnız SANAL ölçüm deneyi: Dört aktif Wheatstone köprüsü kolunun fiziksel direnç ve sıcaklık dengesizlikleri değil, katalogdaki 2 mV/V tam skala ideal köprü fark gerilimi hesaplanır. G1 sanal 24 VDC kaynağı TX11 güç girişini çalıştırır. TX11 EX+ / EX− uçlarından köprüye 5 VDC sağlar. SB2 EX+ / EX− uyartımı alır; SIG+ / SIG− birbirinden ayrı milivolt ölçüm yolları olarak TX11 S+ / S− girişlerine bağlanır. Yük hücresinin ayarlı kapasitesi 1000 kg, başlangıç yükü 500 kg ve TX11 sıfır/span eşleşmesi 0/10 mV → 0/1000 kg olarak ayarlanmıştır. İdeal çıkış mV = [2 mV/V]×[5 V]×[yük / 1000 kg]. Böylece yük 0, 250, 500, 750 ve 1000 kg olduğunda diferansiyel çıkış sırasıyla 0, 2,5, 5, 7,5 ve 10 mV olur. İndikatörün giriş ölçümü ile gösterdiği ağırlık solver tarafından hesaplanır; güç, herhangi bir uyartım veya SIG kablosu kesilirse geçerli ölçüm yerine hata çıkar. Fiziksel strain-gauge köprü kollarının dirençlerinin tek tek çözümü, sıcaklık telafisi, gerçek üretici ebatı/kalibrasyon sertifikası ve 4–20 mA çıkış yükü burada kanıtlanmaz: son çıkış terminalleri I/G harici yüke bağlanmadığı için analog çıkış döngüsü uyarısı olabilir. Gerçek cihaz enerjilendirmesi veya gerçek ağırlık kaldırma yönergesi DEĞİLDİR.',
  goal:'Sanal yük/köprü gerilim değişimi, TX11 uyartımı ve mV/V fark sinyalinin TX11 ağırlık göstergesine dönüşmesini, besleme ve tel kopukluğu hatalarını ayırt et.',
  beginnerSteps:[
   'Önce sanal G1 ve TX11 enerji kaynak uçlarının ayrı olduğunu bul.',
   'TX11 gösterge EX+ ve EX− ucunun sensörün iki uyartım ucuna ayrı ayrı bağlı olduğunu göster.',
   'SB2 SIG+ ve SIG− uçlarının TX11 S+ ve S− diferansiyel girişlerine gittiğini doğrula.',
   'TX11 sanal 24 VDC gücü açıkken loadWeight değerini 0 kg yap: 0 mV ve 0 kg gözle.',
   '250 kg ayarında ideal 2,5 mV ve 250 kg bekle.',
   '500 kg ayarında ideal 5,0 mV ve 500 kg bekle.',
   '750 kg ayarında ideal 7,5 mV ve 750 kg bekle.',
   '1000 kg ayarında ideal 10,0 mV ve 1000 kg bekle.',
   'Yalnız sanal devrede EX+ / EX− / SIG+ / SIG− hatlarından birini çıkar: TX11 hata gösterir.',
   'G1 beslemesini 0 V yap: göstergede besleme hatası bulunur. İdeal modelin üretici kalibrasyonu olmadığını belirt.'
  ]
 });
 l.quiz={question:'Sanal 2 mV/V hassasiyetli, 5 V uyartımlı, 1000 kg kapasiteli load cell 500 kg yükte kaç mV üretir?',
  options:['5 mV diferansiyel sinyal','500 mV diferansiyel sinyal','24 V sabit sinyal'],
  answer:0,why:'2 mV/V × 5 V × (500/1000)=5 mV; göstergenin 24 V beslemesi ayrı enerjidir.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyIssue:null,
  titleTopologyStatus:'LOAD_CELL_TX11_5V_MVV_VIRTUAL_SOURCE_ALIGNED',
  mq07LoadCell:{bridge:'ideal 2mV/V differential equivalent, physical arms not modeled',
   sourceSupplyV:24,nominalExcitationV:5,ratedMassKg:1000,fullScaleMv:10,
   fourSensorLeadsChecked:true,indicatorMassReadoutChecked:true,
   fourToTwentyMilliampExternalLoadVerified:false,realBridgeCalibrationVerified:false,
   isolatedV8NativeSourceVerified:true,fullNodeSuiteExecuted:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal düşük gerilimli load cell/tartım göstergesi deneyi. Gerçek ağırlık kaldırma, elektriksel cihaz kurma veya üretici fiziksel kabulü yapılmadı.';
 const triage=L.mq07Batch200.noWireTriage;
 triage.conceptPreservedIds=triage.conceptPreservedIds.filter(x=>x!==id);
 if(!triage.applicationRepairIds.includes(id))triage.applicationRepairIds.push(id);
 triage.explicitUserOverrideForSc28='User requested proven dynamic wiring for Load Cell; original NO_WIRED_CIRCUIT review ledger remains unchanged';
}

/* MQ-07 SC29 — LDR dark-triggered comparator + protected 24 V virtual load.
   Separate from SC20/SC21 thermistor and SC30 DC linear-dimmer models. */
{
 const id='sensor-analog-apps-src-10',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==9||p.wires.length!==12||
    l.pedagogyReview?.titleTopologyStatus!=='SOURCE_ALIGNED'||
    !p.components.some(c=>c.id==='s1'&&c.typeId==='ldr-gl5528')||
    !p.components.some(c=>c.id==='u1'&&c.typeId==='lm358p-dip8')||
    !p.components.some(c=>c.id==='v1'&&c.typeId==='unit-ut33d-plus'))
  throw Error('MQ-07 SC29 canonical LDR comparator baseline changed');
 const one=(a,ap,b,bp)=>p.wires.filter(w=>w.from?.c===a&&w.from.p===ap&&w.to?.c===b&&w.to.p===bp);
 const sense=one('s1','2','u1','3'),reference=one('r2','2','u1','2');
 if(sense.length!==1||reference.length!==1)
  throw Error('MQ-07 SC29 original comparator inputs missing or ambiguous');
 // Dark: upper GL5528 increases its resistance, LOWERING sense node.
 // Comparator must therefore compare Vref on pin 3 versus Vsense on pin 2.
 sense[0].to.p='2';
 sense[0].tutorialHint='B1 sensör düğümü → U1/2 (IN−)';
 sense[0].tutorialWhy='Karanlıkta GL5528 direnci yükselince IN− gerilimi düşer.';
 reference[0].to.p='3';
 reference[0].tutorialHint='R2/R3 12 V sanal eşik → U1/3 (IN+)';
 reference[0].tutorialWhy='IN+ > IN− olduğunda LM358P sanal çıkışı yüksek olur.';
 const src=p.components.find(c=>c.id==='g1'),ldr=p.components.find(c=>c.id==='s1');
 if(src.dcVoltage!==24||p.wires.some(w=>w.from?.c==='u1'&&w.from.p==='1'))
  throw Error('MQ-07 SC29 expected 24 V comparator output graph changed');
 ldr.illuminationLux=100;
 p.components.push(
  C('rg','resistor',850,135,'RG','10 kΩ gate üst',{resistance:10000}),
  C('rp','resistor',850,330,'RP','10 kΩ gate alt',{resistance:10000}),
  C('q1','irf540n-mosfet',1090,365,'Q1','IRF540N sanal düşük-taraf anahtarı',{mq07LdrDarkSwitch:true}),
  C('h1','standard-light',1190,180,'H1','24 V / 240 Ω sanal karanlık lambası',{resistance:240})
 );
 p.wires.push(
  W('u1','1','rg','1','LM358P/1 → RG/1','Karşılaştırıcı OUT işareti gerçek gate bölücüsüne gider.','#43a047','SIGNAL'),
  W('rg','2','rp','1','RG/2 → RP/1','RG/RP gerçek seri bölücüsü gate gerilimini sınırlamaya yardım eder.','#43a047','SIGNAL'),
  W('rg','2','q1','G','RG/2 → Q1/G','MOSFET G yalnız gerçek sanal düğümden sürülür.','#43a047','SIGNAL'),
  W('rp','2','g1','M','RP/2 → G1/M','Gate pull-down enerji kesilince sıfıra indirir.','#111827','0V'),
  W('g1','P','h1','X1','G1/P → H1/X1','24 V sanal yük beslemesi kendi güç kolundadır.','#8b5a2b','+24V'),
  W('h1','X2','q1','D','H1/X2 → Q1/D','Gövde akımı MOSFET drain ucundan geçer.','#8b5a2b','+24V'),
  W('q1','S','g1','M','Q1/S → G1/M','Gerçek sanal yük dönüş yolu 0 V’dur.','#111827','0V')
 );
 l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=materialRows(p);
 l.summary='Karanlıkta yükselen GL5528 direnci, R1 ile 24 V bölücünün sensör düğümünü düşürür. U1 LM358P 12 V eşikle karşılaştırır, sanal IRF540N Q1 anahtarı ile 24 V / 240 Ω H1 lambayı karanlıkta çalıştırır. Ürün kalibrasyonu değil, yalnız eğitim eşdeğeridir.';
 l.explanation='Yalnız sanal deneydir. G1 24 V kaynak ve GL5528 B1 LDR üst kolu ile R1 10 kΩ alt kol bir gerilim bölücüsü yapar: Vsens=24×10000/(R_LDR+10000). R2/R3 her biri 10 kΩ olduğundan Vref≈12 V. GL5528 foto direncinin gölgede artan direnci Vsens düğümünü DÜŞÜRÜR: B1/2 → U1 pin 2 IN−, referans R2/2 → U1 pin 3 IN+ olarak düzeltilmiştir. Karanlıkta (ör. 1–10 lux) IN+ > IN− ve LM358P model çıkışı yüksek olur. Çıkış RG ve RP 10 kΩ üzerinden gerçek U1/1→Q1/G bölücüsüne aktarılır; sanal MOSFET kaynak 0 V ve H1 240 Ω yük 24 V ile ayrı güç devresinde çalışır. G1/P→H1→Q1/D→Q1/S→G1/M sanal yolu tamamlanınca H1 ≈0,1 A (≈2,4 W) akım çeker. Daha aydınlıkta (ör. 50/100 lux) sensör direnci düşer, IN− artar, karşılaştırıcı çıkışı ve Q1 gate düşer, H1 söner. Eğitim eşiği verilen GL5528 R10=15 kΩ ve gamma=0,6 modeli altında yaklaşık 19,66 lux’tur; gerçek optik kalibrasyon değildir. U1 ve MOSFET devresinde gerçek kapasitans/histerezis/bobin yoktur; eşiğe yakın titreme, gerçek LM358P çıkış akımı, MOSFET ısınması, üretici gate hassasiyeti, fiziksel sigorta ve saha güvenliği DOĞRULANMAMIŞTIR. UT33D+ V1 probu U1/1 ve 0 V arasındaki gerilimi gözlemlemek içindir; multimetrenin fiziksel cihaz kabulü veya gerçek lamp gücü ölçümü sayılmaz. Elektriksel çizimdeki 24 V hatları gerçek enerjili bağlantı yönergesi değildir.';
 l.learningGoal='LDR ışık seviyesi ↓ → R_LDR ↑ → 24 V bölücü sensör düğümü ↓ → LM358P eşik sonucu ↑ → IRF540N gate ↑ → 24 V sanal lamba ON zincirini ve aydınlıkta OFF durumunu ayırt etmek.';
 l.beginnerSteps=[
 'Yalnız sanal devrede B1 LDR, R1 10 kΩ alt kol ve G1 24 V sanal beslemesini tanı.',
 'B1/2–U1/2 IN− sensör düğümü ile R2/R3 12 V–U1/3 IN+ referansını ayırt et.',
 '100 lux seç: düşük GL5528 direnci, IN− > IN+, U1/1 LOW ve H1 OFF olmalı.',
 '10 lux seç: GL5528≈15 kΩ, Vsens≈9,6 V, U1/1 HIGH, H1 ON olmalı.',
 '1 lux seç: GL5528≈59,7 kΩ, Vsens≈3,44 V, Q1 gate ≈11 V ve H1 ≈0,1 A olmalı.',
 'Kontrolü G1/24 V, U1/1→RG/RP→Q1/G ve ayrı H1→Q1/D/S yük kolu üzerinde izle.',
 'Sanal MOSFET G veya H1 güç yolu kablosunu çıkar: yük OFF olmalı; enerjisiz gerçek donanım deneyi yapma.',
 'Tekrar 50 lux seç: karşılaştırıcı ve H1 LOW/OFF durumuna dönmeli.'
 ];
 l.quiz={question:'Üst kolda LDR, alt kolda 10 kΩ R1 varsa karanlıkta H1’in yanması için LM358P girişleri nasıl olmalı?',
  options:['Sensör düğümü IN− pin 2, 12 V referans IN+ pin 3; karanlıkta OUT HIGH ile Q1 anahtarı açılır.',
   'Sensör düğümü IN+ pin 3, referans IN− pin 2; karanlıkta her zaman OUT HIGH olur.',
   'B1 LDR tek başına 24 V lamba akımı üretir.'],
  answer:0,why:'GL5528 karanlıkta yüksek dirençli olduğu için üst LDR/alt R1 bölücünün Vsens gerilimi azalır.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),titleTopologyStatus:'LDR_DARK_SWITCH_LOADED_SOURCE_ALIGNED',titleTopologyIssue:null,
  mq07LdrDark:{source:'GL5528_LUX_DEPENDENT_RESISTANCE',supplyV:24,referenceV:12,gateResistorsOhm:[10000,10000],loadOhm:240,output:'IRF540N_LOADED_SWITCH',nominalLampCurrentA:0.1,
    sourceIsolatedElectricalTestsVerified:true,manufacturerIlluminanceCalibrationVerified:false,fullNodeSuiteExecuted:false,windowsVisualAcceptance:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 24 VDC sanal karşılaştırıcı + dirençli yük öğretim devresi; üretici, fiziksel elektrik, ısı, EMC ve saha güvenliği kabulü yoktur.';
}


/* MQ-07 SC32: only the endüktif PNP sensor-control lesson. Native
   Sensors.detect and CCSSimulation already model the relay and NO lamp;
   this opt-in lesson defines a physically meaningful draggable metal target. */
{
 const id='sensor-analog-apps-src-13',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==5||p.wires.length!==7||
    !p.components.some(c=>c.id==='s1'&&c.typeId==='proximity')||
    !p.components.some(c=>c.id==='g1'&&c.typeId==='arduino-bench-supply')||
    !p.components.some(c=>c.id==='k1'&&c.typeId==='coil-relay')||
    !p.components.some(c=>c.id==='ka1'&&c.typeId==='contact-no')||
    !p.components.some(c=>c.id==='h1'&&c.typeId==='lamp-green'))
    throw Error('MQ-07 SC32 original PNP sensor load graph changed');
 const canonical=[
  ['g1','P','s1','BN'],['g1','M','s1','BU'],
  ['s1','BK','k1','A1'],['k1','A2','g1','M'],
  ['g1','P','ka1','13'],['ka1','14','h1','X1'],['h1','X2','g1','M']
 ];
 if(!canonical.every(([a,ap,b,bp])=>p.wires.some(w=>
    w.from?.c===a&&w.from.p===ap&&w.to?.c===b&&w.to.p===bp)))
   throw Error('MQ-07 SC32 source pin order changed');
 const s=p.components.find(c=>c.id==='s1'),g=p.components.find(c=>c.id==='g1');
 if(s.sensing||s.outputType!=='PNP'||Number(g.dcVoltage)!==24)
   throw Error('MQ-07 SC32 sensor baseline modified');
 s.sensing={target:'metal',range:4,distance:8,offset:0,face:'right',auto:false};
 s.state=false;
 s.tutorialPurpose='Sanal indüktif metal hedefini sürükleyerek röle ve lambanın tepkisini incele. 4 mm eğitim eşiği üretici algılama mesafesi değildir.';
 l.summary='24 VDC sanal sensör kumandası: B1 üç telli indüktif PNP sensör metal hedefi algıladığında BK çıkışından K1 röle bobinini sürer; K1 NO 13/14 kapanınca H1 yanar. Algılama mesafesi ve kablo bütünlüğü test edilir.';
 l.explanation='Yalnız sanal 24 VDC eğitim devresidir: G1 P (+24 V) → B1 BN (kahverengi), G1 M (0 V) → B1 BU (mavi), B1 BK (PNP çıkış) → K1 A1 ve K1 A2 → G1 M. Yük kolu ayrıdır: G1 P → K1 13/14 normalde açık kontak → H1 X1/X2 → G1 M. B1 sanal indüktif sensör sadece metal hedefi algılar. Metal hedef başlangıçta 8 mm uzakta ve OFF; eğitim için varsayılan menzil 4 mm olarak gösterilir. Aynı hizada metal hedef 2 mm ya da 4 mm içeri çekildiğinde B1 algılar, PNP çıkış K1 bobinini enerjilendirir ve H1 yanar; 5 mm uzaklaştırınca röle ve lamba kapanır. Plastik hedef veya 8 mm sanal hizalama hatasında algılama yoktur. Besleme 0 V/12 V olursa, BN ya da BU koparsa algılama çıkışı enerjisiz kalır. BK koparsa sensör algılasa bile K1 bobini çalışmaz; NO kontak ve H1 kapanır. Yük kablosu koparsa sensör ve bobin algılamayı sürdürür ama H1 enerjilenmez. Bu dersin 4 mm algılama eşiği ve 6 mm hizalama toleransı gerçek üretici hassasiyeti, montaj açıklığı veya fiziksel ölçüm değildir. DC sanal yük rölesi ve lamba yalnız yazılımdaki sayısal elektrik modeliyle sınanır; fiziksel ürün seçimi ve gerçek enerjili bağlantı onayı verilmez.';
 l.learningGoal='İndüktif metal algılaması → PNP BK → K1 A1/A2 bobini → K1 13/14 NO → H1 lamba zincirini ayırmak; sanal hedef uzaklığı, farklı hedef materyali ve kopuk telin sonuçlarını karşılaştırmak.';
 l.beginnerSteps=[
  'B1 sanal indüktif PNP sensörün BN, BU ve BK uçlarını tanımla.',
  'G1 sanal 24 VDC beslemenin B1 BN ve BU üzerindeki farklı görevlerini ayırt et.',
  'B1 BK çıkışının K1 A1 bobinine ve K1 A2 ucunun 0 V hattına gittiğini izle.',
  'K1 13/14 normalde açık kontağın H1 yük güç kolundan ayrı olduğunu göster.',
  'Sanal metal hedefi başlangıçtaki 8 mm konumundan 2 mm yakına getir, B1/K1/H1 değişimini gözle.',
  'Hedefi 5 mm uzaklaştır veya plastik hedef seç; K1 ve H1 kapalı kalmalı.',
  'Sanal BK kablosunu kaldır: B1 algılayabilir ancak K1 bobini ve H1 enerjisiz kalmalı.',
  'Yalnız yazılımda kaynak/besleme/yük kablosu bağlantılarını kaldır; ON sanılan ama enerjisiz kalan kolu belirle.'
 ];
 l.quiz={question:'Sanal indüktif PNP sensör metal algıladığında BK telini kaldırırsan H1 ne olur?',
  options:['B1 algılar, fakat K1 bobini beslenmez ve H1 sönük kalır.',
   'K1 bobini otomatik olarak metalden bağımsız beslenir.',
   'Plastik hedef metal gibi mutlaka algılanır.'],
  answer:0,why:'B1 BK uçtaki sinyal K1 A1’e ancak gerçek sanal kablo yoluyla ulaşır.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),
  titleTopologyIssue:null,
  titleTopologyStatus:'INDUCTIVE_PNP_SENSOR_RELAY_LAMP_SOURCE_ALIGNED',
  mq07SensorControl:{target:'metal',virtualRangeMm:4,virtualAlignmentMm:6,
   falseTargetRejected:true,isolatedNativeSolverScenariosPassed:14,
   fullNodeSuiteExecuted:false,manufacturerDetectionRangeVerified:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız 24 VDC sanal sensör/röle/lamba modeli; fiziksel indüktif menzil ve gerçek devre güvenlik kabulü yoktur.';
}


/* MQ-07 SC33: only source-14 IR virtual target and measured PNP K1/H1 chain. */
{
 const id='sensor-analog-apps-src-14',l=L.byId[id],p=l?.project;
 if(!l||l.kind!=='wiring'||p.components.length!==5||p.wires.length!==7||
   l.pedagogyReview?.titleTopologyStatus!=='SOURCE_ALIGNED')
  throw Error('MQ07 SC33 original IR circuit changed');
 const items=[['g1','arduino-bench-supply'],['s1','sensor-through-beam'],
  ['k1','coil-relay'],['ka1','contact-no'],['h1','lamp-green']];
 const paths=[['g1','P','s1','BN'],['g1','M','s1','BU'],
  ['s1','BK','k1','A1'],['k1','A2','g1','M'],['g1','P','ka1','13'],
  ['ka1','14','h1','X1'],['h1','X2','g1','M']];
 if(items.some(([cid,t])=>!p.components.some(c=>c.id===cid&&c.typeId===t))||
   paths.some(([a,ap,b,bp])=>!p.wires.some(w=>w.from?.c===a&&
     w.from.p===ap&&w.to?.c===b&&w.to.p===bp)))
  throw Error('MQ07 SC33 protected pin route changed');
 const supply=p.components.find(c=>c.id==='g1'),sensor=p.components.find(c=>c.id==='s1');
 if(supply.dcVoltage!==24||sensor.outputType!=='PNP'||sensor.sensing)
  throw Error('MQ07 SC33 source settings changed');
 sensor.state=false;
 sensor.sensing={target:'plastic',range:40,distance:80,offset:0,face:'right',auto:false};
 sensor.tutorialPurpose='Tek sanal IR optik sensör: 80 mm uzakta OFF, 40 mm ve yakında PNP BK ON; fiziksel ayrı verici/alıcı veya üretici mesafe onayı değildir.';
 l.summary='Sanal IR alıcıyla optik hedef algılama ve yük kontrolü: B1 plastik hedefi 40 mm içinde algılayınca 24 V PNP BK çıkışı K1 bobinini çalıştırır; K1/13–14 normalde açık kontaktan H1 lamba yanar. Uzak hedefte yük OFF kalır.';
 l.explanation='Sadece 24 VDC YAZILIM SİMÜLASYONU: B1, ayrı fiziksel IR verici ve alıcı çiftinin optik hedef algılama işlevini tek sanal modelde temsil eder; taşıyıcı frekansı ve gerçek optik demodülasyon modellenmez. Plastik sanal hedef başlangıçta 80 mm dışarıdadır. Eğitim amaçlı sanal 40 mm algılama menzilinin içinde ve sanal 6 mm hizalama toleransıyla hedef algılanır; bunlar gerçek üretici değerleri değildir. G1 24 VDC P/M uçları sensörün BN pozitif besleme ve BU sıfır volt dönüş hatlarına gider. B1/BK, PNP modelin anahtarlamalı dijital çıkışıdır. BK üzerinden K1/A1 beslenir, K1/A2 sıfır volta döner; röle çekince K1/13–14 NO kontak kapanır. Ayrı H1 yük kolu G1/P → K1/13 → K1/14 → H1/X1 → H1/X2 → G1/M yolundan enerji alır. Hedef 41 veya 80 mm uzaklaşınca röle ve lamba OFF kalır. B1 BN/BU kablosu kopuksa optik hedef görülse bile elektriksel PNP çıkış çalışmaz. BK kopuksa sensör algılar ama K1 ve H1 OFF kalır; bobin A2 kopuksa röle çekmez; H1 X2 kopuksa bobin çekebilir ama lamba OFF kalır. Yalnız sanal 24 V besleme geçerlidir, 0/12 V kaynağı hata senaryosudur. Burada ayrı bir güç transistörü yoktur; PNP çıkışı doğrudan sanal röleyi sürer. Gerçek sensör çıkış akımı, bobin akımı, bobin koruması, optik verici-alıcı ayrımı ve kalibrasyon fiziksel kabul görmemiştir; gerçek donanım kurulum yönergesi değildir.';
 l.learningGoal='Sanal optik plastik hedef için 80→2→80 mm OFF→ON→OFF durumunu takip etmek, PNP sensör BK çıkışı, K1 bobini, 13–14 NO kontak ve H1 yük akım yolunu ayrı ayrı tanımlamak.';
 l.beginnerSteps=[
  'Sanal G1 24 VDC kaynağı ve B1 BN/BU sensör besleme uçlarını tanı.',
  'B1 plastik sanal hedefi 80 mm uzakta tut: sensör, bobin ve lamba OFF.',
  'Hedefi 2 mm yaklaştır: B1/BK PNP çıkışı ve K1/A1 bobini ON olur; K1/13–14 kapanır ve H1 yanar.',
  'Hedefi 40 mm sınırına getir: ON; sonra 41 mm uzakta: OFF.',
  'Uyumsuz sıvı hedefini veya 7 mm yanal kaymayı dene: algılama OFF.',
  'Yalnız sanal şemada BN veya BU hattını çıkar: sensör çıkışı ve yük OFF.',
  'BK hattını çıkar: sensör optik olarak algılasa bile K1 ve H1 OFF.',
  'H1 X2 yük dönüşünü çıkar: K1 ON olabilir ama H1 OFF.',
  'Gerçek PNP akım sınırı, bobin bastırma ve fiziksel optik kalibrasyonun bu deneyde yapılmadığını açıkla.'
 ];
 l.quiz={question:'B1 optik hedefi algıladığı sırada PNP BK ile K1 A1 arası koparsa ne olur?',
  options:['B1 algılayabilir fakat K1 bobini ve H1 lamba OFF kalır.',
   'H1 kesinlikle ON kalır; bobin bağlantısı gerekmez.',
   'B1 gerçek şebeke gerilimi üretir.'],
  answer:0,why:'Algılama, röle bobini sürme ve NO yük kontağı üç ayrı neden-sonuç aşamasıdır.'};
 l.pedagogyReview={...(l.pedagogyReview||{}),
  titleTopologyIssue:null,titleTopologyStatus:'IR_RECEIVER_OPTICAL_PNP_RELAY_SOURCE_ALIGNED',
  mq07IrReceiver:{virtualTarget:'plastic',virtualRangeMm:40,virtualAlignmentMm:6,
   isolatedSolverScenariosPassed:13,relayDriver:'virtual-direct-PNP',
   physicalOpticalCalibrationVerified:false,manufacturerCurrentLimitVerified:false,
   fullNodeSuiteExecuted:false,windowsVisualAcceptance:false},
  physicalAcceptance:false,manufacturerCalibrationVerified:false,
  independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Sadece sanal 24 VDC optik PNP röle deneyi; fiziksel IR alıcı-verici, bobin koruma ve gerçek cihaz güvenliği onaylı değildir.';
}


/* MQ-07 SC35: wiring demonstrates signal roles, not proven clap firmware. */
{
 const l=L.byId['sensor-analog-apps-src-16'],p=l?.project;
 if(!l||l.kind!=='wiring'||p?.components?.length!==4||p?.wires?.length!==8)
  throw Error('MQ07 SC35 protected sound-sensor topology changed');
 const expected=[['ps','arduino-bench-supply'],['s1','arduino-sound-sensor'],
  ['u1','arduino-uno'],['bz','arduino-buzzer']];
 if(expected.some(([id,typeId])=>!p.components.some(c=>c.id===id&&c.typeId===typeId)))
  throw Error('MQ07 SC35 source component mismatch');
 // This lesson is 5 V; the generic brown supply role is historically +24V.
 for(const w of p.wires){
  if(w.from?.c==='ps'&&w.from?.p==='P'&&w.role==='+24V')w.role='+5V';
 }
 if(p.colorRoles?.['#8b5a2b']==='+24V')p.colorRoles['#8b5a2b']='+5V';
 const uno=p.components.find(c=>c.id==='u1');
 if(uno.arduinoSketch)throw Error('MQ07 SC35 original UNO sketch unexpectedly changed');
 uno.arduinoSketch='void setup(){pinMode(2,INPUT);pinMode(9,OUTPUT);digitalWrite(9,LOW);}' +
  ' void loop(){digitalWrite(9,digitalRead(2)==HIGH?HIGH:LOW);delay(10);}';
 uno.arduinoProgramName='SC35 sanal ses eşiği → buzzer';

 l.summary='Sanal 5 V ses sensörü → Arduino D2 dijital giriş → D9 buzzer çıkışı bağlantıları; sanal ses eşiğine göre buzzerı Arduino D2→D9 programı anahtarlar; gerçek alkış/desibel tanıma değildir.';
 l.explanation='Kablolu eğitim şemasında PS1 5 VDC besleme sensör VCC/GND, UNO 5V/GND ve buzzer VCC/GND hatlarına gider. Ses sensörünün DO çıkışı UNO D2 girişine, UNO D9 çıkışı buzzer SIG girişine bağlıdır. Bu fiziksel bağlantı düzeni ses algılama, sayısal giriş, karar mantığı ve çıkış sürme katmanlarını ayırt etmeyi öğretir. SC35 için özel sanal Arduino programı D2 dijital eşiğini D9 çıkışına aktarır. KY-037/038 sanal ses değeri 120→800→120 olarak değiştirildiğinde gerçek Arduino runtime ile buzzer OFF→ON→OFF testi yapılmıştır. Bu, gerçek mikrofonun akustik alkış ayrıştırması, desibel kalibrasyonu veya gerçek buzzer akım limiti değildir; yalnız sanal 5 V ve dijital eşik modelidir.';
 l.learningGoal='PS1→ses sensörü VCC/GND, DO→UNO D2, UNO D9→buzzer SIG bağlantılarını ayırmak ve otomatik alkış tepkisi için doğrulanmış program gereksinimini açıklamak.';
 l.beginnerSteps=[
  'PS1 kaynağının sanal 5 V ve ortak 0 V hatlarını incele.',
  'Ses sensörü VCC/GND ve dijital DO uçlarını tanı.',
  'DO→UNO D2 bağlantısının yalnız giriş sinyali taşıdığını doğrula.',
  'UNO D9→buzzer SIG bağlantısını çıkış sinyal yolundan ayır.',
  'Sanal ses değeri 120→800→120 değiştiğinde D2 ve D9 çıkışının OFF→ON→OFF tepkisini izle.',
  'Gerçek ses seviyesi, algılama eşiği ve buzzer akımı için ölçüm kanıtının eksik olduğunu belirt.'
 ];
 l.pedagogyReview={...(l.pedagogyReview||{}),
  mq07ClapCircuit:{components:4,wires:8,programExecutionVerified:true,
   automaticClapResponseVerified:true,actualDbCalibrationVerified:false,
   fullNodeSuiteExecuted:false,windowsVisualAcceptance:false},
  physicalAcceptance:false,independentPedagogicalAcceptance:false,
  windowsVisualAcceptance:false};
 l.safety='Yalnız sanal 5 V bağlantı eğitimi; gerçek alkış algılama, Arduino programı ve buzzer sürme güvenliği doğrulanmamıştır.';
}


/* MQ07_SC214_SC227_PANEL_SCOPE: repair two irrelevant DC meter cards; never infer wiring acceptance. */
const mq07PanelRows=[["01","NO_PANEL_WIRING_SCHEMATIC","Pano şeması koruma, kumanda, klemens ve PE yollarını ayırır.","Genel MCB, kontaktör, klemens ve PE barası vardır; gerçek pano bağlantı şeması yoktur."],["02","NO_DIN_RAIL_DUCT_LAYOUT","DIN ray ve kablo kanalının ölçüsü gerçek pano yerleşimine bağlıdır.","Ray klemensi ve kanal malzeme referansıdır; mm yerleşim, kanal doluluğu ve montaj testi yoktur."],["03","NO_BUTTON_LAMP_MOUNTING_CIRCUIT","NO/NC butonlar ile sinyal lambaları farklı elektriksel görevler taşır.","Bu malzemelerin panel montajı, terminal bağlantısı ve çalışan lamba devresi yoktur."],["04","NO_MCB_RCD_INSTALLED_TEST","MCB ve RCD farklı koruma ilkelerine sahiptir.","Yanlış DC ampermetre/prob grafiği kaldırıldı; yeni MCB/RCD kartında gerçek kaçak testi veya montaj yoktur."],["05","NO_MOTOR_PROTECTION_SWITCH_SELECTION","Kontaktör, termik aşırı yük rölesi ve motor görevleri ayrı değerlendirilir.","Kartta ayrı motor koruma şalteri veya doğrulanmış ayar ve koordinasyon bulunmaz."],["06","NO_FERRULE_CRIMP_LABEL_VALIDATION","İletken pabucu, yüksük ve numaralandırma farklı sonlandırma/izleme işleridir.","Klemens ve kablo markörü referanstır; krimp, pabuç/yüksük ve doğrulanmış iletken kodu yoktur."],["07","NO_TERMINAL_CONDUCTOR_CONNECTION","PE klemensi ile geçiş klemensi farklı elektriksel bağlantı rollerine sahiptir.","Gerçek iletken, terminal bağlantısı, kesit denetimi veya PE süreklilik ölçümü bulunmaz."],["08","NO_INSULATION_MEASUREMENT_EVIDENCE","Yalıtkanlık direnci ölçümü uygun cihaz ve güvenli uzman kontrolü gerektirir.","Yalıtım test cihazı yalnız referanstır; gerçek test, ölçüm değeri ve pano kabulü yoktur."],["09","NO_ELEVATOR_CONTROL_TOPOLOGY","Asansör panosunda özel kumanda ve emniyet işlevleri ayrıca kanıtlanmalıdır.","Kart genel koruma/kontaktör/klemenslerden ibarettir, gerçek asansör kontrolü yoktur."],["10","NO_INDUSTRIAL_METER_TERMINAL_WIRING","Üç faz sayaç bağlantısı seçili sayaç ve enerji sistemi yapısına bağlıdır.","Sayaç malzeme referansıdır; gerçek sayaç uç bağlantısı veya ölçüm sonucu yoktur."],["11","NO_CT_SECONDARY_METER_WIRING","100/5 akım trafosu ile kombi sayaç eşleşmesi primer/sekonder ölçüm sistemidir.","Yanlış DC ampermetre/prob grafiği kaldırıldı; CT/kombi sayaç kartında gerçek bağlantı veya ölçüm yoktur."],["12","NO_DISTRIBUTION_SINGLE_LINE_SCHEMATIC","Dağıtım panosu güç ve koruma şemaları ürün bağlantılarıyla ilişkilendirilmelidir.","Yalnız genel semboller yer alır; gerçek tek hat, seçicilik veya güç dağıtım devresi yoktur."],["13","NO_TWELVE_STAGE_COMPENSATION_SYSTEM","12 kademeli kompanzasyon ayrı kademe, ölçüm ve kontrol gerektirir.","Sadece tek kondansatör, reaktör ve kontaktör vardır; 12 kademe veya kontrol programı yoktur."],["14","NO_TRANSFORMER_PROTECTION_COORDINATION","Trafo ile koruma ve parafudr eşleşmesi kaynak verisi gerektirir.","Malzeme referansı vardır; gerçek trafo bağlantısı, koordinasyon hesabı veya donanım kabulü yoktur."]];
for(const [suffix,issue,concept,limits] of mq07PanelRows){
 const id='panel-power-systems-src-'+suffix,lesson=L.byId[id],p=lesson?.project,n=Number(suffix);
 if(!lesson||lesson.kind!=='quiz'||!p?.referenceOnly)
  throw Error('MQ07 panel canonical reference changed '+id);
 if(n===4||n===11){
  const stale=['arduino-bench-supply','unit-ut33d-plus','resistor','test-probe-red','test-probe-black'];
  if(p.wires.length!==2||p.components.length!==stale.length||
     stale.some((x,i)=>p.components[i].typeId!==x))
   throw Error('MQ07 panel stale meter graph changed '+id);
  const parts=n===4?
   [['mcb-1p','Otomatik sigorta'],['rcd-2p','Kaçak akım koruma düzeni']]:
   [['meter-combined-ct','X/5 kombi sayaç'],['current-transformer','100/5 akım trafosu']];
  const replacement=board(id,lesson.title,parts);
  replacement.projectId=p.projectId;replacement.name=p.name;
  replacement.tutorialLesson={...p.tutorialLesson,phase:'quiz'};
  lesson.project=replacement;lesson.workspaceMode=replacement.workspaceMode;
  lesson.steps=[];lesson.materials=materialRows(replacement);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
   componentIds:replacement.components.map(c=>c.typeId)};
 }else if(p.wires.length)throw Error('MQ07 unexpected panel wires '+id);
 lesson.summary=concept+' Bu sayfa gerçek kablolu pano uygulaması değildir.';
 lesson.explanation=concept+' '+limits+' Referans kartı kurulmuş pano veya üretici kaynaklı mühendislik kabulü değildir.';
 lesson.learningGoal=concept+' Referans malzeme ile doğrulanmış elektriksel/pano uygulamasını ayırt etmek.';
 lesson.beginnerSteps=[
  'Karttaki gerçek elemanları ve kablo sayısını incele.',
  'Kavram: '+concept,limits,
  'Gerçek pano, ölçüm veya işlev doğrulaması yoksa PASS verme.'
 ];
 lesson.safety='Yalnız çevrimdışı sanal malzeme referansıdır; gerçek pano montajı, enerjili tesisat uygulaması veya güvenlik kabulü değildir.';
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
  mq07PanelScope:'SC214_SC227',titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  panelEngineeringAcceptance:false,electricalSafetyAcceptance:false};
}


/* MQ07_SC228_SC237_WORKSHOP_SCOPE: accurate reference materials, original quizzes preserved. */
const mq07WorkshopRows=[["01","NO_WORKSHOP_HAZARD_ASSESSMENT","tutorial-ppe","Atölye güvenliğinde genel risk değerlendirmesi ve gözetimli çalışma gerekir.","Kart yalnız KKD referansı; gerçek risk kontrolü gözlenmedi."],["02","NO_PPE_SUITABILITY_VERIFICATION","tutorial-ppe","KKD seçimi uygunluk ve risk koşullarına göre değerlendirilir.","Görsel KKD, gerçek uygunluk belgesi veya kullanım yeterliği değildir."],["03","NO_DIMENSION_MEASUREMENT_EVIDENCE","tutorial-hand-tools","Uzunluk kontrolü ölçü aracı, tolerans ve birim bilgisi gerektirir.","Kartta kalibre ölçüm cihazı, gerçek mm okuması veya kontrol sonucu yok."],["04","NO_CUTTING_VISE_PROCESS_VERIFICATION","tutorial-hand-tools","Kesme ve mengene farklı ve gözetim gerektiren işlemlerdir.","Yalnız genel el aleti referansı; gerçek işlem sonucu yok."],["05","NO_DRILLING_FASTENER_PROCESS_VERIFICATION","tutorial-hand-tools","Delme ve vidalama ayrı araçlar ve güvenlik değerlendirmeleri gerektirir.","Yalnız genel el aleti görseli; montaj veya işlem kanıtı yok."],["06","NO_SURFACE_BENDING_PROCESS_VERIFICATION","tutorial-hand-tools","Eğeleme, zımparalama ve bükme malzeme yüzey/şekil işlemleridir.","Kart gerçek parça, ölçüm veya işleme kalitesi kanıtı değildir."],["07","NO_SOLDER_JOINT_QUALITY_TEST","tutorial-soldering,tutorial-soldering","Lehim türü ve bağlantı kalitesi ayrı kavramlardır.","İki lehimleme aracı referansı var; lehimli bağlantı/kalite testi yok."],["08","NO_CONDUCTOR_SPLICE_SOLDER_JOINT","tutorial-conductor-cable,tutorial-soldering","İletken eki ve lehimli bağlantı malzeme ve kalite bakımından ayrı değerlendirilir.","İletken ve lehimleme referansı var; gerçek ek, bağlantı veya ölçüm yok."],["09","NO_PERFORATED_BOARD_SOLDER_VERIFICATION","tutorial-pcb,tutorial-soldering","Delikli plaket bileşen taşıyıcı ve bağlantı kavramlarını gösterir.","Gerçek lehimli plaket, bileşen yerleşimi veya devre testi yok."],["10","NO_PCB_PREPARATION_INSPECTION_EVIDENCE","tutorial-pcb,tutorial-soldering","PCB hazırlama ve kontrol farklı tasarım ve kalite kanıtları gerektirir.","Gerçek üretim çıktısı, ölçüm ve PCB test sonucu yok."]];
for(const [suffix,reason,partSpec,concept,limitation] of mq07WorkshopRows){
 const id='workshop-safety-mechanics-src-'+suffix,l=L.byId[id],p=l?.project;
 if(!l||!p||l.kind!=='quiz'||p.referenceOnly!==true||p.wires.length)
  throw Error('MQ07 workshop canonical scope changed: '+id);
 if(suffix==='08'){
  if(p.components.length!==2||p.components[0].typeId!=='tutorial-conductor-cable'||p.components[1].typeId!=='terminal-2')
   throw Error('MQ07 conductor lesson original reference changed: '+id);
  const q=board(id,l.title,[['tutorial-conductor-cable','İletken/kablo'],['tutorial-soldering','Lehimleme referansı']]);
  q.projectId=p.projectId;q.name=p.name;q.tutorialLesson={...p.tutorialLesson,phase:'quiz'};
  l.project=q;l.materials=materialRows(q);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:q.components.map(c=>c.typeId)};
 }
 const expected=partSpec.split(','),actual=l.project.components.map(c=>c.typeId);
 if(actual.length!==expected.length||expected.some((x,i)=>actual[i]!==x))
  throw Error('MQ07 workshop parts mismatch '+id);
 l.summary=concept+' Bu kayıt kablolu gerçek atölye deneyi değildir.';
 l.explanation=concept+' '+limitation+' Fiziksel işlev/kalite veya güvenlik kabulü verilmemiştir.';
 l.learningGoal=concept+' Kaynak kartını gerçekten doğrulanmış atölye çalışmasından ayırmak.';
 l.beginnerSteps=['Karttaki malzemeleri ve kablo olmadığını belirle.','Kavram: '+concept,
  limitation,'Gerçek işlem veya ölçüm kanıtı olmadan PASS verme.'];
 l.safety='Yalnız kavramsal referanstır; gerçek kesme, delme, ısı, enerjili cihaz veya atölye işi onaylı değildir. Gerçek uygulama yetkin yetişkin gözetimi gerektirir.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07WorkshopScope:'SC228_SC237',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:reason,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  workshopProcessAcceptance:false,toolSafetyAcceptance:false};
}


/* MQ07_SC238_SC251_FAULT_RELAY_SCOPE: source-aligned acceptance; preserve legacy schematic graphs/unique quizzes. */
const mq07FaultRelayRows=[["electronic-component-basics-outline-001","NO_FAULT_METHOD_MEASUREMENT",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"],"Arıza arama yöntemleri, belirtiler ve güvenli ön değerlendirme ile uygun ölçümün ayrı aşamalar olduğunu gösterir.","Burada prob uçları yalnız multimetreye takılıdır; arızalı devre, ölçüm noktası ve sonuç yoktur."],["electronic-component-basics-outline-002","NO_FAULT_DETECTION_SCENARIO",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"],"Arıza tespiti gözlem ve karşılaştırılabilir veri gerektirir.","Yalnız ölçüm araçları ve iki prob fişi bulunur; gerçek arıza veya arıza tespit sonucu yoktur."],["electronic-component-basics-outline-003","NO_PREINSPECTION_TEST_EVIDENCE",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"],"Ön kontrol, işlev denemesinden farklı bir hazırlık ve uygunluk incelemesidir.","Kartta gerçek donanım ön kontrolü, kusur kaydı ve emniyet doğrulaması yapılmaz."],["electronic-component-basics-outline-004","NO_COMPONENT_TEST_SCENARIO",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"],"Elektronik eleman testi elemanın türüne özgü beklenti ve karşılaştırmalı ölçüm gerektirir.","Test edilen bileşen, ölçülen uç, kademe veya ölçüm sonucu gösterilmez."],["electronic-component-basics-outline-005","NO_FAULT_REPAIR_CONFIRMATION",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"],"Arıza giderme, nedenin belirlenmesi ve düzeltmenin güvenli olarak yeniden doğrulanmasını içerir.","Tamir edilmiş eleman, önce/sonra ölçümü veya düzeltme başarı kanıtı bu kartta yoktur."],["electronic-switching-outline-020","NO_RELAY_SWITCHING_CIRCUIT",0,["coil-relay","contact-both","arduino-diode-1n4007"],"Röleli anahtarlamada bobin, değiştirici kontak ve varsa koruma elemanı farklı görevlerdedir.","Kart bir malzeme karşılaştırmasıdır; bobin enerjisi, kontak üzerinden yük veya gerçek röle geçişi kablolanmamıştır."],["electronic-component-basics-outline-006","NO_RELAY_MECHANICAL_VERIFICATION",0,["coil-relay","contact-both"],"Manyetik röle, bobin ile mekanik kontak işlevlerini birlikte içerir.","Bobin/kontak simgeleri vardır, ancak gerçek röle modeli için bağlantı, üretici ölçüsü ve mekanik hareket kanıtı yoktur."],["electronic-component-basics-outline-007","NO_RELAY_NAMEPLATE_RATING_EVIDENCE",0,["coil-relay","contact-both"],"Röle üzerindeki nominal değerler bobin ve kontaklar için farklı anlamlar taşır.","Kart belirli rölenin doğrulanmış bobin gerilimi, akım veya kontak kapasitesi verilerini sağlamaz."],["electronic-component-basics-outline-008","NO_RELAY_OPERATION_RUNTIME",0,["coil-relay","contact-both"],"Bobin uyarımı ve kontak konumunun değişmesi röle çalışma prensibinin temelidir.","Bobin beslemesi, kontak yükü ve simülasyonda doğrulanmış geçiş döngüsü bulunmaz."],["electronic-component-basics-outline-009","NO_RELAY_FLYBACK_PROTECTION_CIRCUIT",0,["1n4007-do41","coil-relay"],"Röle bobini ve 1N4007 diyodunun ayrı görevleriyle, bobin enerjisinin kesilmesinde indüktif etkiyi kavramsal olarak karşılaştırır.","Önceki iki diyot malzeme kartından biri röle bobiniyle düzeltildi; gerçek bobin-diyot bağlantısı, polarite deneyi ve bastırma ölçümü yoktur."],["electronic-component-basics-outline-010","NO_RELAY_FAULT_DIAGNOSIS",2,["unit-ut33d-plus","tutorial-troubleshooting","test-probe-red","test-probe-black"],"Röle arızası bobin ve kontak koşulları ile ölçüm kanıtına göre ayırt edilir.","Sanal kartta ölçülen röle bobini veya kontak arızası yoktur; iki bağlantı sadece prob fişlerini gösterir."],["electronic-component-basics-outline-011","NO_RELAY_PIN_IDENTIFICATION_MEASUREMENT",0,["coil-relay","contact-both"],"Röle uçlarının tanınması bobin ile ortak/NO/NC kontak görevlerini ayırmayı gerektirir.","Röle referans sembolleri bulunur; gerçek uç bulma ölçümü, pin eşlemesi ve saha doğrulaması yoktur."],["motor-direct-power-outline-019","CONTACTOR_SEAL_IN_NOT_STANDALONE_RELAY",13,["supply-3p","push-nc","push-no","coil-contactor","main-contact","motor-3p","contact-no"],"Mevcut 13 kablolu kaynak örneği START, NC STOP, K1 bobini ve K1 yardımcı NO mühürleme kontağıyla tek motoru sürer.","Devre bağımsız küçük röle uygulaması değil, üç faz motoru süren kontaktörlü mühürleme örneğidir; gerçek koruma cihazı ve donanım kabulü yoktur."],["motor-direct-power-outline-020","MISSING_MOTOR_REVERSAL_CONTACTOR_INTERLOCK",13,["supply-3p","push-nc","push-no","coil-contactor","main-contact","motor-3p","contact-no"],"Mevcut 13 kablolu tek kontaktörlü START–mühürleme–STOP devresi motoru yalnız sabit faz sırasında besler.","Röle ile motor yönü başlığı için ikinci yön kontaktörü, karşılıklı kilitleme ve faz sırası değiştirme yolu yoktur; ileri-geri simülasyonu kabul edilemez."]];
for(const [id,reason,wireCount,expectedParts,concept,limits] of mq07FaultRelayRows){
 const l=L.byId[id],p=l?.project;
 if(!l||!p||p.wires.length!==wireCount||l.kind!==(wireCount===13?'wiring':'quiz'))
  throw Error('MQ07 SC238–SC251 source topology changed '+id);
 if(wireCount!==13&&p.referenceOnly!==true)
  throw Error('MQ07 source reference status changed '+id);
 const sourceParts=p.components.map(c=>c.typeId);
 const original= id==='electronic-component-basics-outline-009'
   ?['1n4007-do41','arduino-diode-1n4007']:expectedParts;
 if(sourceParts.length!==original.length||original.some((x,i)=>sourceParts[i]!==x))
  throw Error('MQ07 source component set changed '+id);
 if(id==='electronic-component-basics-outline-009'){
  const replacement=board(id,l.title,[['1n4007-do41','1N4007 koruma diyodu'],['coil-relay','Röle bobini · sanal referans']]);
  replacement.projectId=p.projectId;replacement.name=p.name;
  replacement.tutorialLesson={...p.tutorialLesson,phase:'quiz'};
  l.project=replacement;l.materials=materialRows(replacement);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:replacement.components.map(c=>c.typeId)};
 }
 l.summary=concept+' Bu dersin mevcut sanal şema kapsamı aşağıdaki sınırlarla geçerlidir.';
 l.explanation=concept+' '+limits+' Gerçek üretici/veri sayfası, elektriksel güvenlik veya Windows görsel onayı bu kayıttan çıkarılamaz.';
 l.learningGoal=concept+' Gösterilen bağlantı ve cihazlarla başlığın kapsamını karşılaştırmak.';
 l.beginnerSteps=[
  'Başlıktaki işlevi, ekrandaki cihaz sayısı ve kablo sayısı ile karşılaştır.',
  'Kavram: '+concept,limits,
  'Gösterilmeyen çalışma, ölçüm veya fiziksel emniyet için PASS verme.'
 ];
 l.pedagogyReview={...(l.pedagogyReview||{}),
  mq07FaultRelayScope:'SC238_SC251',titleTopologyStatus:'REVIEW',titleTopologyIssue:reason,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  faultDiagnosisAcceptance:false,relayDynamicsAcceptance:false,motorReversalAcceptance:false};
 l.safety='Bu sanal eğitim kaydı, gerçek enerjili pano, motor, ölçüm, onarım veya röle güvenliği için uygulama talimatı veya cihaz kabulü değildir.';
}


/* MQ07_SC252_SC265_BJT_RC: source-aligned RC topology and no unsupported dynamic acceptance. */
const mq07Sc252Scope=[["electronic-switching-outline-021","BJT_SWITCH_RUNTIME_PENDING",8,"Transistör anahtarlama yük ve beyz akımıyla ilişkilidir.","BD139 bağlantısı bulunur; dinamik davranış ayrıca doğrulanmalıdır."],["electronic-switching-outline-022","BJT_CUTOFF_RUNTIME_PENDING",8,"Kesim için beyz sürmesinin olmadığı durum incelenir.","Kesim bölgesi VCE ve kolektör akımıyla ölçülmeden kabul edilemez."],["electronic-switching-outline-023","BJT_SATURATION_RUNTIME_PENDING",8,"Doyum yeterli beyz akımı ve uygun kolektör yükü gerektirir.","Doyum noktası ölçüm ve gerçek model analiziyle doğrulanmamıştır."],["electronic-switching-outline-024","RC_BJT_ON_DELAY_NATIVE_PENDING",12,"RC şarjı ve BD139 eşik davranışı gecikmeye neden olabilir.","Eski anlık buton devresi, mevcut 47 kΩ şarj, 10 kΩ deşarj, 1000 µF, BD139 gerçek sanal grafiğine çevrildi; native gecikme ölçümü henüz yapılmadı."],["electronic-component-basics-outline-012","RC_CHARGE_DISCHARGE_TRACE_PENDING",6,"10 kΩ×100 µF nominal zaman sabiti 1 saniyedir.","Altı telli RC şarj örneğinde ayrı deşarj devresi ve onaylanmış zaman eğrisi yoktur."],["electronic-component-basics-outline-013","NO_OFF_DELAY_RUNTIME",0,"Gecikmeli bırakma bir zaman sonrası çıkış değişimidir.","Yalnız gecikmeli röle sembolü vardır; kablolu çalışan zaman testi yoktur."],["electronic-component-basics-outline-014","NO_ON_DELAY_RUNTIME",0,"Gecikmeli çekme belirli gecikme sonrası çıkış değişimidir.","Yalnız gecikmeli röle sembolü vardır; dinamik süre ölçümü yoktur."],["electronic-component-basics-outline-015","NO_SCHMITT_HYSTERESIS_NETWORK",0,"Schmitt Trigger için iki eşik ve pozitif geri besleme gereklidir.","LM358/direnç/kondansatör yalnız malzeme kartıdır; histerezis yoktur."],["electronic-switching-outline-025","BJT_SWITCH_PRACTICE_TRACE_PENDING",8,"BD139 anahtarında beyz ve kolektör devresi görevleri farklıdır.","Sanal anahtar vardır; yeni gerçek zaman ölçümü ve fiziksel kabul yoktur."],["electronic-switching-outline-026","NO_POTENTIOMETER_SWITCHING_WIRING",0,"Potansiyometre ayarlı beyz sürmesi kavramsal olarak gösterilir.","Önceki sekiz telli BD139/4,7 kΩ devresi ayar potansiyometresi içermiyordu; yeni kart yalnız BD139+pot+direnç malzeme referansıdır."],["electronic-component-basics-outline-016","NO_ON_DELAY_PRACTICE_RUNTIME",0,"ON-delay temrini süre sonundaki çıkış değişimini gerektirir.","Sadece röle sembolü vardır; uygulama devresi yoktur."],["electronic-component-basics-outline-017","NO_OFF_DELAY_PRACTICE_RUNTIME",0,"OFF-delay temrini komut kaldırıldıktan sonra çıkışı inceler.","Sadece röle sembolü vardır; gecikme devresi yoktur."],["electronic-switching-outline-027","NO_TRANSISTOR_SCHMITT_FEEDBACK",0,"Transistörlü Schmitt için iki durumlu eşik ve geri besleme gerekir.","Eski tek BD139 START şeması histerezis değildi; iki NPN ve direnç artık kablosuz kavram kartıdır."],["electronic-switching-outline-028","NO_FET_MOSFET_DRIVE_WIRING",0,"FET/MOSFET anahtarlamada gate, drain ve source ayrılır.","MOSFET ve direnç referansından gerçek sürme, ölçüm veya JFET karşılaştırması çıkarılamaz."]];
for(const [id,reason,expectedWires,concept,limit] of mq07Sc252Scope){
 const l=L.byId[id],old=l?.project;if(!l||!old)throw Error('MQ07 missing '+id);
 if(id==='electronic-switching-outline-024'){
  const golden=L.byId['electronic-switching-src-06']?.project;
  if(l.kind!=='wiring'||old.wires.length!==8||golden?.wires.length!==12||
     golden.components.find(c=>c.id==='c1')?.capacitance!==.001)
   throw Error('MQ07 RC golden baseline changed');
  const p=clone(golden);
  p.projectId=old.projectId;p.name=old.name;p.tutorialLesson={...old.tutorialLesson,phase:'demo'};
  l.project=p;
  l.steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'Terminali incele.',
   why:w.tutorialWhy||'RC/BJT yolu.',color:w.color,role:w.role,size:w.size}));
  l.materials=materialRows(p);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 if(id==='electronic-switching-outline-026'||id==='electronic-switching-outline-027'){
  if(l.kind!=='wiring'||old.wires.length!==8)throw Error('MQ07 BJT generic baseline changed '+id);
  const parts=id.endsWith('-026')?
   [['bd139-npn','BD139 NPN'],['potentiometer','Potansiyometre'],['resistor','Sınırlayıcı direnç']]:
   [['bd139-npn','NPN Q1'],['bd139-npn','NPN Q2'],['resistor','Geri besleme kavramı']];
  const p=board(id,l.title,parts);
  p.projectId=old.projectId;p.name=old.name;p.tutorialLesson={...old.tutorialLesson,phase:'quiz'};
  l.project=p;l.kind='quiz';l.steps=[];l.materials=materialRows(p);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 if(l.project.wires.length!==expectedWires||Boolean(l.project.referenceOnly)!==(expectedWires===0))
  throw Error('MQ07 topology changed '+id);
 l.summary=concept+' Kaynak kapsamı ayrıca belirtilmiştir.';
 l.explanation=concept+' '+limit+' Gerçek donanım, üretici kabulü veya görsel Windows onayı değildir.';
 l.learningGoal=concept+' Gösterilen materyal ve doğrulanmış davranış arasındaki farkı açıklamak.';
 l.beginnerSteps=['Malzemeleri ve kabloları kaynak başlığıyla karşılaştır.',
  'Kavram: '+concept,limit,'Dinamik iz veya ölçüm kanıtı olmadan PASS verme.'];
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07BjtRcScope:'SC252_SC265',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:reason,nativeDynamicAcceptance:false,
  physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false};
 l.safety='Yalnız sanal düşük gerilimli eğitim; fiziksel cihaz, ısı veya elektrik güvenlik kabulü değildir.';
}


/* MQ07_SC266_SC279_FET_IGBT_SCOPE: reference cards are not verified live MOSFET/JFET/IGBT circuits. */
const mq07FetIgbtRows=[["electronic-switching-outline-029","SINGLE_JFET_NOT_ALL_FET_FAMILIES",["j113-jfet","resistor"],"FET ailesinde kapı alan etkisiyle kanalın kontrol edilmesi temel ilkedir.","Kart yalnız J113 JFET ile direnç gösterir; tüm FET türlerinin terminal/karakteristik/ölçüm karşılaştırmasını yapmaz."],["electronic-switching-outline-030","FET_VARIETIES_REFERENCE_ONLY",["j113-jfet","irf540n-mosfet"],"JFET ve MOSFET farklı kapı yapısı ve sürme koşullarına sahip alan etkili transistörlerdir.","Önceki tek JFET ve direnç kartı, J113 ve IRF540N örnekleriyle düzeltildi; tür tablosu, ölçüm veya işleyen anahtarlama bulunmaz."],["electronic-switching-outline-031","JFET_TERMINALS_NOT_MEASURED",["j113-jfet","resistor"],"JFET üzerinde G/D/S görevleri ve kapı-kanal özellikleri ayrı incelenmelidir.","J113 sembolü bulunur, ancak gerçek G/D/S uç ölçümü veya bias çalışma eğrisi yoktur."],["electronic-switching-outline-032","MOSFET_TERMINALS_NOT_MEASURED",["irf540n-mosfet","resistor"],"MOSFET gate, drain ve source uçlarının model etiketleriyle tanınması gerekir.","IRF540N malzeme kartı fiziksel sağlamlık veya çalışan MOSFET sürme devresi değildir."],["electronic-switching-outline-033","NO_JFET_MOSFET_HEALTH_TEST",["j113-jfet","irf540n-mosfet"],"JFET ve MOSFET sağlamlık kontrolü cihaz türüne özgü uç ve ölçüm kanıtı gerektirir.","Önceki tek MOSFET kartına J113 eklendi; ölçü aleti, prob bağlantısı ve gerçek arıza tespit sonucu yoktur."],["electronic-switching-outline-034","NO_FET_RC_DELAY_RUNTIME",["j113-jfet","resistor","capacitor"],"FET gecikmeli durdurma başlığı enerji depolama, RC yolu ve kontrollü çıkış davranışı gerektirir.","J113 ve direnç yanına kondansatör kavramı eklendi. Kablo, RC yük/deşarj yolu, eşik ve ölçülmüş gecikme yoktur; MOSFET uygulamasıyla eşdeğer sayılmaz."],["electronic-switching-outline-035","NO_MOSFET_HEALTH_EXERCISE",["irf540n-mosfet","resistor"],"MOSFET sağlamlık uygulamasında modelin G/D/S uçları ile doğrulanabilir test sonucu gerekir.","IRF540N referansı gerçekte ölçülmüş MOSFET testi veya üretici uygunluk kanıtı değildir."],["motor-direct-power-outline-021","NO_MOSFET_PWM_MOTOR_SPEED_RUNTIME",["irf540n-mosfet","virtual-pwm-generator-v1","motor-dc"],"DC motor hız kontrolünde PWM komut kaynağı, MOSFET güç yolu ve motor yükü farklı işlevlerdir.","PWM, IRF540N ve DC motor kavramı aynı kartta gösterilir; kontrol/güç uçları kablosuzdur ve değişen motor hızı veya RPM kanıtlanmamıştır."],["electronic-switching-outline-036","NO_IGBT_SWITCHING_RUNTIME",["fga25n120antd-igbt","resistor"],"IGBT gate kontrolü ve kolektör-emiter güç yolu ayrı değerlendirilir.","IGBT ve direnç referansı gerçek sürücü ve yük anahtarlama devresi değildir."],["electronic-component-basics-outline-018","NO_IGBT_CHARACTERISTIC_MEASUREMENT",["fga25n120antd-igbt","resistor"],"IGBT birleşik MOS kapı ve bipolar iletim ilkesiyle açıklanır.","Tek IGBT örneğinde VGE, VCE veya anahtarlama ölçümü bulunmaz."],["electronic-component-basics-outline-019","NO_IGBT_INTERNAL_STRUCTURE_MEASUREMENT",["fga25n120antd-igbt","resistor"],"IGBT iç yapısı kapı yalıtımı ve akım taşıyan yarıiletken katmanlarla ilişkilidir.","Malzeme kartı ayrıntılı fiziksel kesit veya çip ölçümü değildir."],["electronic-component-basics-outline-020","SINGLE_IGBT_NOT_FULL_DEVICE_VARIETY",["fga25n120antd-igbt","resistor"],"IGBT çeşitleri paket, gerilim, akım ve anahtarlama özelliklerine göre ayrılır.","Kart yalnız tek FGA25N120ANTD örneği taşır; çeşitlerin karşılaştırması veya üretici katalog kabulü değildir."],["electronic-component-basics-outline-021","NO_AC_IGBT_DIMMER_RUNTIME",["fga25n120antd-igbt","supply-1p","standard-light"],"IGBT ile dimmer kavramında kontrollü anahtar, kaynak ve yük ayrı görevler üstlenir.","AC kaynak, IGBT ve lambanın kablosuz referansı gerçek AC faz-kesme veya PWM dimmer devresi değildir; şebeke bağlantısı/ışık eğrisi gösterilmez."],["electronic-switching-outline-037","NO_SCR_TRIGGER_LATCH_CIRCUIT",["tyn612rg-scr","arduino-bench-supply","resistor"],"Tristör tetikleme ve tutma davranışı kapı komutu, anot-katot yük yolu ve tutma akımıyla değerlendirilir.","SCR, DC kaynak ve direnç kablosuz malzeme kartıdır; latch, tetik ve akım davranışı simüle edilmemiştir."]];
const mq07FetIgbtFixes={"electronic-switching-outline-030":{"old":["j113-jfet","resistor"],"parts":[["j113-jfet","J113 JFET"],["irf540n-mosfet","IRF540N MOSFET"]]},"electronic-switching-outline-033":{"old":["irf540n-mosfet","resistor"],"parts":[["j113-jfet","J113 JFET"],["irf540n-mosfet","IRF540N MOSFET"]]},"electronic-switching-outline-034":{"old":["j113-jfet","resistor"],"parts":[["j113-jfet","J113 JFET"],["resistor","Direnç"],["capacitor","RC zamanlama kondansatörü"]]},"motor-direct-power-outline-021":{"old":["irf540n-mosfet","motor-dc"],"parts":[["irf540n-mosfet","IRF540N MOSFET"],["virtual-pwm-generator-v1","PWM kavramı"],["motor-dc","DC motor"]]}};
for(const [id,issue,types,concept,limitation] of mq07FetIgbtRows){
 const l=L.byId[id],p=l?.project;
 if(!l||!p||l.kind!=='quiz'||p.referenceOnly!==true||p.wires.length!==0)
  throw Error('MQ07 SC266-279 canonical source changed '+id);
 const fix=mq07FetIgbtFixes[id];
 if(fix){
  const actual=p.components.map(c=>c.typeId);
  if(actual.length!==fix.old.length||fix.old.some((type,i)=>actual[i]!==type))
   throw Error('MQ07 reference baseline changed '+id);
  const replacement=board(id,l.title,fix.parts);
  replacement.projectId=p.projectId;replacement.name=p.name;
  replacement.tutorialLesson={...p.tutorialLesson,phase:'quiz'};
  l.project=replacement;l.materials=materialRows(replacement);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:replacement.components.map(c=>c.typeId)};
 }
 const current=l.project.components.map(c=>c.typeId);
 if(current.length!==types.length||types.some((type,i)=>current[i]!==type))
  throw Error('MQ07 SC266-279 unexpected device set '+id);
 l.summary=concept+' Bu kart gerçek kablolu veya onaylı devre değildir.';
 l.explanation=concept+' '+limitation+' Sanal malzeme referansı, üretici test veya gerçek fiziksel güvenlik kabulü yerine geçmez.';
 l.learningGoal=concept+' Başlığı mevcut malzeme ve doğrulanmış simülasyon sınırlarıyla karşılaştırmak.';
 l.beginnerSteps=['Cihaz kimliklerini, görevlerini ve sıfır kablo durumunu kontrol et.',
  'Kavramsal ilke: '+concept,limitation,
  'Elektriksel ölçüm, gerçek sürme veya dinamik test kanıtı olmadan PASS verme.'];
 l.safety='Yalnız çevrimdışı sanal malzeme referansıdır. Gerçek motor, şebeke, ısı veya elektronik güvenlik kontrolü yapılmamıştır.';
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07FetIgbtScope:'SC266_SC279',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  nativeDynamicAcceptance:false,manufacturerDeviceAcceptance:false};
}


/* MQ07_SC280_SC293_SCR_TRIAC: reflect source component truth; no invented AC/SCR/triac runtime. */
const mq07ScrTriacScope=[["electronic-switching-outline-038","SCR_CONSTRUCTION_REFERENCE_ONLY","SCR üç uçlu, kendinden kilitleme gösterebilen kontrollü yarı iletkendir.","SCR/DC direnç sembolleri iç yapı, üretici pin kimliği veya gerçek iletim ölçümü değildir.",null],["electronic-switching-outline-039","NO_SCR_LATCHING_RUNTIME","SCR anottan katoda giden yol ve kapı tetiklemesi için ayrı koşullar gerektirir.","DC kaynağı ve SCR yalnız görsel referanstır; tutma akımı, kapı darbesi ve kilitlenme deneyi yoktur.",null],["electronic-switching-outline-040","NO_SCR_TRIGGER_METHOD_RUNTIME","SCR tetiklemede gate komutu ve anot yük yolu kavramsal olarak ayrılmalıdır.","Buton ve direnç sembolleri gerçek tetikleme devresi, açı ayarı, kapı akımı veya dinamik latch kabulü değildir.",[["tyn612rg-scr","SCR A/K/G"],["push-no","Sanal tetikleme butonu"],["resistor","Gate direnci"]]],["electronic-switching-outline-041","INTRO_SWITCHING_FAMILY_REFERENCE_ONLY","Anahtarlama malzemelerinde BJT, SCR ve triyak farklı terminal ve çalışma ilkeleri taşır.","Eski yalnız BD139/direnç kartı geniş bölüm başlığını temsil etmiyordu; yeni üç ürün yalnız kavram karşılaştırmasıdır.",[["bd139-npn","NPN BJT"],["tyn612rg-scr","SCR"],["bta16-600b-triac","Triyak"]]],["electronic-component-basics-outline-022","SAFETY_SIGNS_VISUAL_NOT_VERIFIED","Güvenlik işaretleri uyarı, yasak ve zorunluluk gibi farklı anlam kategorileri taşır.","Yalnız genel kavram sembolü gösterilir; doğrulanmış işaret görseli, mevzuata uygun piktogram veya atölye denetimi yoktur.",null],["electronic-switching-outline-042","NO_SCR_COMMUTATION_STOP_RUNTIME","SCR durdurma anottaki akımın tutma koşulunu kaybetmesiyle ilişkilidir.","STOP butonu sembolü gerçek seri güç kesme, tutma akımı ölçümü veya tekrar tetiklenme davranışı değildir.",[["tyn612rg-scr","SCR"],["push-nc","STOP / kavram"],["standard-light","Yük kavramı"]]],["electronic-switching-outline-043","NO_SCR_AKG_IDENTIFICATION_TEST","Tristör uçları A, K ve G olarak işlevsel bakımdan farklıdır.","SCR ve multimetre referansı gerçek üretici terminal haritası, prob bağlantısı veya ölçüm sonucu değildir.",[["tyn612rg-scr","SCR · A K G"],["unit-ut33d-plus","UNI-T referans multimetre"]]],["electronic-switching-outline-044","NO_SCR_DC_LATCH_PRACTICE","DC SCR tetikleme temrini gate komutu ve DC anot yük yolunun birlikte sınanmasını gerektirir.","SCR, izole sanal buton, direnç ve yük sadece malzeme kartıdır; canlı iletim ve latch simülasyonu mevcut değildir.",[["tyn612rg-scr","SCR"],["arduino-bench-supply","Sanal 24 VDC kaynak"],["push-no","Gate tetik komutu"],["resistor","Gate direnci"],["standard-light","Sanal DC yük"]]],["electronic-switching-outline-045","NO_SCR_STOP_AND_RETRIGGER_PRACTICE","Tristör durdurma temrini anottaki akımın kesilmesi ve yeni gate komutu koşullarını ayırmalıdır.","SCR/STOP/yük referansları canlı durdurma, tutma akımı veya tekrar tetikleme kanıtı sunmaz.",[["tyn612rg-scr","SCR"],["push-nc","STOP kavramı"],["standard-light","Sanal yük"]]],["electronic-switching-outline-046","NO_ISOLATED_AC_SCR_TRIGGER_RUNTIME","SCR AC davranışı, polarite ve uygun gate tetiklemesi ile dalga biçimine bağlıdır.","Önceki DC kaynaklı referans düzeltildi: yalıtılmış sanal AC, SCR, AC tetikleyici ve yük gösterilir; AC dalga ve akım simülasyonu burada kablolanmamıştır.",[["virtual-isolated-ac-12v","Yalıtılmış sanal 12 VAC"],["tyn612rg-scr","SCR"],["virtual-ac-scr-trigger-v1","AC tetikleyici kavramı"],["standard-light","Sanal AC yük"]]],["electronic-switching-outline-047","NO_TRIAC_SWITCHING_RUNTIME","Triyak çift yönlü AC anahtarlamada MT1/MT2 ve gate görevlerine dayanır.","Triyak, kaynak ve lamba kablosuzdur; gerçek iletim, ateşleme açısı ve AC dalga kabulü yoktur.",null],["electronic-switching-outline-048","NO_DIAC_BREAKOVER_MEASUREMENT","Diyak eşik aşımına bağlı çift yönlü davranış kavramıyla ilişkilidir.","DB3 ve triyak gösterilir; gerçek kırılma gerilimi, geçiş eğrisi veya sürücü bağlantısı yoktur.",null],["electronic-switching-outline-049","NO_TRIAC_PACKAGE_PIN_VALIDATION","Triyak yapısında MT1, MT2 ve G görevleri üretici terminallerine göre incelenmelidir.","Karttaki triyağın gerçek terminal haritası ve paket/üretici fiziksel kabulü yapılmamıştır.",null],["electronic-switching-outline-050","NO_TRIAC_BIDIRECTIONAL_RUNTIME","Triyakın AC çift yönlü davranışı tetikleme ve tutma koşullarıyla ayrı sınanır.","AC kaynak ve lamba malzeme kartıdır; iki yarım dalga, gate komutu ve yük akımı simülasyonu yoktur.",null]];
for(const [id,issue,concept,limits,correction] of mq07ScrTriacScope){
 const lesson=L.byId[id],previous=lesson?.project;
 if(!lesson||!previous||lesson.kind!=='quiz'||previous.wires.length!==0||previous.referenceOnly!==true)
  throw Error('MQ07 SC280-293 original reference changed '+id);
 if(correction){
  const project=board(id,lesson.title,correction);
  project.projectId=previous.projectId;project.name=previous.name;
  project.tutorialLesson={...previous.tutorialLesson,phase:'quiz'};
  lesson.project=project;lesson.materials=materialRows(project);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:project.components.map(c=>c.typeId)};
 }
 lesson.summary=concept+' Bu kayıt gerçek kablolu devre değildir.';
 lesson.explanation=concept+' '+limits+' Kaynak kartı, üretici/veri sayfası veya işlevsel emniyet kabulü yerine geçmez.';
 lesson.learningGoal=concept+' Başlık ile gerçekten gösterilen malzeme ve bağlantı kanıtını ayırt etmek.';
 lesson.beginnerSteps=['SCR/triyak/ölçüm simgelerini ve sıfır kabloyu karşılaştır.',
  'Kavram: '+concept,limits,'Gerçek tetikleme, iletim veya ölçüm olmadan PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
  mq07ScrTriacScope:'SC280_SC293',titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  scrLatchAcceptance:false,triacAcRuntimeAcceptance:false,manufacturerPinAcceptance:false};
 lesson.safety='Yalnız sanal, enerjisiz malzeme referansı; gerçek şebeke gerilimi, SCR/triyak test düzeneği veya fiziksel çalışma talimatı değildir.';
}


/* MQ07_SC294_SC307_TRIAC_OPTO: exact source devices, no fabricated electrical/runtime acceptance. */
const mq07TriacOptoRows=[["electronic-switching-outline-051","NO_TRIAC_TRIGGER_REFERENCE_RUNTIME",["bta16-600b-triac","virtual-isolated-ac-12v","virtual-ac-triac-trigger-v1"],"Triyak gate tetikleme koşulları AC dalga ve seçili ateşleme kaynağından bağımsız doğrulanır.","Sadece sanal malzemeler vardır; MT1/MT2/G bağlantısı, tetikleme çeyreği ve ölçülmüş AC yük tepkisi yoktur."],["electronic-switching-outline-052","NO_TRIAC_MULTIMETER_HEALTH_MEASUREMENT",["bta16-600b-triac","unit-ut33d-plus"],"Triyak sağlamlık konusu MT1, MT2 ve gate görevlerini üretici terminal tanımıyla ayırt eder.","AVOmetre önceki AC/lamba kartında yoktu; şimdi multimetre referansı vardır fakat prob, test koşulu ve gerçek sağlamlık sonucu yoktur."],["electronic-switching-outline-053","NO_TRIAC_MULTIMETER_PIN_IDENTIFICATION",["bta16-600b-triac","unit-ut33d-plus"],"Triyak uç tanıma üretici paket şeması ve cihaz terminal kimliği gerektirir.","Önceki kartta AVOmetre yoktu; eklenen multimetre gerçek MT1/MT2/G ölçümünün kanıtı değildir."],["electronic-switching-outline-054","NO_TRIAC_DC_LATCH_APPLICATION",["bta16-600b-triac","arduino-bench-supply","push-no","resistor","standard-light"],"Triyak DC uygulamasında kapı tetikleme ve akım tutma koşulları AC çalışma durumundan farklıdır.","Başlıktaki DC için önceki AC kaynak referansı kaldırıldı; sanal DC/tri yak/gate/yük elemanları kablosuzdur, çalışan DC latch yoktur."],["electronic-switching-outline-055","NO_ISOLATED_AC_TRIAC_DIMMER_RUNTIME",["virtual-isolated-ac-12v","bta16-600b-triac","virtual-ac-triac-trigger-v1","standard-light"],"Triyaklı dimmer, faz açıları ile yüke aktarılan AC dalga biçimini ilişkilendirir.","İzole sanal AC ve tetikleyici kavramı referanstır; gerçek faz kontrolü, lambanın RMS gerilimi veya dimmer testi yoktur."],["electronic-switching-outline-056","NO_OPTOCOUPLER_FAMILY_REFERENCE",["arduino-tlp521-1","moc3021-opto-triac"],"Optokuplörler ışıkla ayrılmış giriş ve çıkış yolları sunar; fototransistörlü ve opto-triyaklı türler farklıdır.","Önceki BD139/direnç kartı optokuplör içermiyordu; iki temsilî optik tür gösterilir fakat bağlantı/izolasyon ölçümü yoktur."],["electronic-switching-outline-057","NO_OPTOCOUPLER_ISOLATION_FUNCTION_TEST",["arduino-tlp521-1","resistor"],"TLP521-1 optokuplörün giriş LED'i ve çıkış fototransistörü ayrı görevler taşır.","Önceki triyak ve lamba referansları görev açıklaması için uygun değildi; yeni kartta optik iletim veya galvanik izolasyon testi yoktur."],["electronic-switching-outline-058","NO_OPTOCOUPLER_VARIETY_RUNTIME",["arduino-tlp521-1","moc3021-opto-triac"],"Fototransistör çıkışlı optokuplör ve opto-triyak tetikleyici farklı cihaz aileleridir.","Eski karttaki güç triyağı optokuplör türü değildir; her iki doğru optik eleman kablosuz referans olarak gösterilir."],["electronic-switching-outline-059","NO_TLP521_HEALTH_PROBE_RESULT",["arduino-tlp521-1","unit-ut33d-plus"],"Optokuplör sağlamlık incelemesi giriş ve çıkışın farklı elektriksel görevlerini ayırt eder.","Önceki triyak/lamba test malzemeleri kaldırıldı; multimetre ile gerçek LED/çıkış ölçümü yapılmadı."],["electronic-switching-outline-060","NO_OPTO_TRIAC_FLASHER_RUNTIME",["moc3021-opto-triac","bta16-600b-triac","virtual-opto-flasher-timer-v1","virtual-isolated-ac-12v","standard-light"],"Opto-triyak flaşör kavramı optik tetikleme, güç triyağı ve periyodik kontrolü ayırır.","Önceki kartta opto elemanı veya flaşör kaynağı yoktu; bunlar eklendi ama gerçek sinyal bağlantısı veya dinamik yanıp sönme kabulü yoktur."],["sensor-analog-apps-outline-023","NO_SENSOR_TRANSDUCER_IO_EVIDENCE",null,"Sensör ve transdüser giriş büyüklüğü ile elektriksel çıkışın rolünü ayırt eden kavramlardır.","Endüktif, kapasitif ve optik sensörler yalnız referanstır; elektriksel çıkış veya algılama ölçümü yapılmamıştır."],["sensor-analog-apps-outline-024","NO_SENSOR_CHARACTERISTIC_MEASUREMENT",null,"Sensör karakteristiği için algılama mesafesi, eşik, besleme ve çıkış türü verisi gerekir.","Karttaki üç sensör sembolü üretici karakteristik eğrisi, menzil veya PNP/NPN çalışması kanıtı değildir."],["sensor-analog-apps-outline-025","NO_SENSOR_TYPE_RUNTIME_COMPARISON",null,"Farklı algılama ilkelerini malzeme ve uygulama koşuluna göre karşılaştırmak gerekir.","Üç kablosuz sensör referansı gerçek algılama deneyi veya katalog kıyas ölçümü değildir."],["electronic-component-basics-outline-023","NO_SENSOR_USAGE_DOMAIN_EVIDENCE",["proximity","photoeye","sensor-level-analog"],"Endüktif yaklaşım, optik algılama ve analog seviye sensörü farklı kullanım alanlarını temsil eder.","Eski genel kavram kartı sensör çeşitlerini göstermiyordu; ürünler referanstır, canlı sinyal ve saha kullanım kabulü yoktur."]];
for(const [id,issue,conceptTypes,concept,limits] of mq07TriacOptoRows){
 const l=L.byId[id],p=l?.project;
 if(!l||!p||l.kind!=='quiz'||p.referenceOnly!==true||p.wires.length!==0)
  throw Error('MQ07 SC294-307 original reference scope changed '+id);
 if(conceptTypes){
  const replacements=conceptTypes.map((type,i)=>[type,['Triyak/optik/sensör referansı','Kavram cihazı','Kaynak malzeme','Sanal referans','Eğitim öğesi'][i%5]]);
  const q=board(id,l.title,replacements);
  q.projectId=p.projectId;q.name=p.name;q.tutorialLesson={...p.tutorialLesson,phase:'quiz'};
  l.project=q;l.materials=materialRows(q);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:q.components.map(c=>c.typeId)};
 }
 l.summary=concept+' Bu kart kaynak malzemesi içindir; çalışan uygulama değildir.';
 l.explanation=concept+' '+limits+' Bu eğitim kaydı gerçek güvenlik ve üretici uygunluk onayı vermez.';
 l.learningGoal=concept+' Kaynak başlığı ile temsilî malzemelerin sınırını ayırt etmek.';
 l.beginnerSteps=['Önce malzeme türlerini ve sıfır gerçek kabloyu kontrol et.',
  'Kavram: '+concept,limits,'Test, ölçüm veya simülasyon kanıtı olmadan PASS verme.'];
 l.pedagogyReview={...(l.pedagogyReview||{}),
  mq07TriacOptoScope:'SC294_SC307',titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  isolationAcceptance:false,acPhaseRuntimeAcceptance:false,optoFlasherRuntimeAcceptance:false,
  sensorIoAcceptance:false};
 l.safety='Bu çevrimdışı malzeme kartı gerçek şebeke, yarı iletken veya endüstriyel sensör kablolama ve test talimatı değildir.';
}


/* MQ07_SC308_SC321_SENSOR_SCOPE: truthful temperature sensor references and no unproven runtime claims. */
const mq07SensorSc308to321=[["sensor-analog-apps-outline-026","NO_SENSOR_SELECTION_DATASHEET_EVIDENCE",0,["proximity","capacitive-detector","photoeye"],"Sensör seçimi hedef ortam, çıkış türü ve üretici veri sayfasıyla uyumlu değerlendirilmelidir.","Görünen üç sensör yalnız kavram referansıdır; kapsama, besleme, koruma sınıfı veya ölçüm karşılaştırması yapılmamıştır."],["sensor-analog-apps-outline-027","NO_DIGITAL_ANALOG_SIGNAL_MEASUREMENT",0,["proximity","sensor-level-analog","arduino-lm35"],"Sensör çıkışında dijital anahtarlama ve analog gerilim/akım verisi ayrı ele alınır.","Endüktif algılama, analog seviye ve LM35 referansları gösterilir; elektriksel çıkış kablosu, kalibrasyon ve ölçüm yoktur."],["sensor-analog-apps-outline-028","NO_TEMPERATURE_APPLICATION_WIRING",0,["sensor-ntc","sensor-ptc","thermocouple","sensor-pt100","arduino-lm35"],"NTC, PTC, termokupl, PT100 ve LM35 farklı sıcaklık algılama ilkelerini temsil eder.","Eski yakınlık sensörüyle çalışan röle/lamba çizimi sıcaklık ölçümü değildi; mevcut kart yalnız doğru sıcaklık malzemelerinin kavramsal listesidir, gerçek karşılaştırıcı veya test değildir."],["electronic-component-basics-outline-024","NO_THERMISTOR_PROBE_SENSOR_CONTACT",2,["sensor-ntc","unit-ut33d-plus","test-probe-red","test-probe-black"],"NTC ve PTC termistörlerin direnç değişimi sıcaklıkla ilişkilidir.","Kartta iki tel yalnız UT33D+ ölçüm problarının cihaz fişleridir; NTC sensör ucuna erişen gerçek ölçüm kablosu ve sıcaklık/direnç değeri yoktur."],["sensor-analog-apps-outline-029","NO_THERMOCOUPLE_MV_MEASUREMENT",0,["thermocouple"],"Termokupl iki metalin sıcaklık farkından düşük seviyeli termoelektrik sinyal üretmesiyle tanımlanır.","Tek termokupl referansı vardır; soğuk uç kompanzasyonu, ölçüm cihazı, polarite veya mV testi yoktur."],["electronic-component-basics-outline-025","NO_PT100_RTD_MEASUREMENT_CONNECTION",0,["sensor-pt100","unit-ut33d-plus"],"RTD/PT100 direnç tabanlı sıcaklık algılama elemanıdır; ölçüm için uygun köprü/cihaz bağlantısı gerektirir.","Eski genel direnç ve yalnız multimetre fişlerine takılmış problar yerine gerçek PT100 ile ölçü cihazı referansı kondu; üç telli bağlantı veya sıcaklık/ohm ölçümü doğrulanmadı."],["electronic-component-basics-outline-026","NO_THERMOSTAT_CONTROL_RUNTIME",0,["tutorial-thermostat","sensor-ntc"],"Termostat, sıcaklık durumuna göre ayarlanmış bir eşik çevresinde anahtarlama işlevini temsil eder.","NTC ve termostat malzemesi gösterilir, bağlı çıkış, eşik/ölü bant veya sıcaklık geçiş simülasyonu yoktur."],["sensor-analog-apps-outline-030","NO_LM35_ANALOG_ADC_CONNECTION",0,["arduino-lm35","arduino-uno"],"LM35 entegre sıcaklık sensörü analog gerilim sinyalinin okunması kavramını tanıtır.","Eski yakınlık/kapasitif/optik sensörler yerine LM35 ve Arduino referansı kondu; gerçek besleme, A0 bağlantısı veya ADC sıcaklık testi bulunmaz."],["sensor-analog-apps-outline-031","NTC_COMPARATOR_OUTLINE_NATIVE_UNVERIFIED",12,["arduino-bench-supply","sensor-ntc","resistor","lm358p-dip8","resistor","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"],"NTC bölücü ve LM358P karşılaştırıcı sıcaklık gerilimini bir eşikle karşılaştırma kavramını gösterir.","12 kablolu ders grafiği korunmuştur; kaynak topolojisi tek başına 15/35 derece motor/yük davranışını veya gerçek üretici onayını kanıtlamaz."],["sensor-analog-apps-outline-032","PTC_COMPARATOR_OUTLINE_NATIVE_UNVERIFIED",12,["arduino-bench-supply","sensor-ptc","resistor","lm358p-dip8","resistor","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"],"PTC ve karşılaştırıcı çıkışı sıcaklıkla değişen direnç eşiği kavramını açıklar.","12 kablolu ders grafiği korunmuştur; gerçek 35/65 derece çıkış davranışı ayrı dinamik test olmadan kabul edilemez."],["electronic-component-basics-outline-027","LM35_ARDUINO_OUTLINE_NATIVE_UNVERIFIED",5,["arduino-bench-supply","arduino-lm35","arduino-uno"],"LM35 gerilimi Arduino analog okumasıyla sıcaklık değeri olarak yorumlanabilir.","Beş uçlu sanal kaynak grafiği korunmuştur; Arduino ADC ve sıcaklık dönüşümü, gerçek çalışma kanıtı olmadan kabul edilmez."],["sensor-analog-apps-outline-035","HALL_RELAY_OUTLINE_DYNAMIC_UNVERIFIED",7,["arduino-bench-supply","sensor-hall","coil-relay","contact-no","lamp-green"],"Hall algılayıcı ile röle bobini ve kontak çıkışı farklı devre görevlerine sahiptir.","Yedi kablolu kaynak örneği korunmuştur; manyetik alan geçişi ve röle/lamba dinamiği bu ders için test edilmemiştir."],["sensor-analog-apps-outline-036","NO_REED_SWITCH_RUNTIME",0,["arduino-reed"],"Reed algılama manyetik alan ile kontak durumunun değişmesine dayanır.","Tek reed elemanı referansı, canlı mıknatıs, devre bağlantısı veya kontak geçişi ölçümü değildir."],["sensor-analog-apps-outline-037","NO_HALL_OUTPUT_RUNTIME",0,["sensor-hall"],"Hall sensöründe manyetik alana tepki uygun besleme ve sensör türüyle ilişkilidir.","Tek Hall sensörü referansında çıkış kablosu, alan değişimi veya ölçüm bulunmaz."]];
const mq07SensorReplacements={"sensor-analog-apps-outline-027":{"old":["proximity","capacitive-detector","photoeye"],"parts":[["proximity","Dijital endüktif sensör"],["sensor-level-analog","Analog seviye sensörü"],["arduino-lm35","LM35 analog sıcaklık sensörü"]],"wires":0},"sensor-analog-apps-outline-028":{"old":["arduino-bench-supply","proximity","coil-relay","contact-no","lamp-green"],"parts":[["sensor-ntc","NTC"],["sensor-ptc","PTC"],["thermocouple","Termokupl"],["sensor-pt100","PT100 RTD"],["arduino-lm35","LM35"]],"wires":7},"electronic-component-basics-outline-025":{"old":["resistor","unit-ut33d-plus","test-probe-red","test-probe-black"],"parts":[["sensor-pt100","PT100 3 telli RTD"],["unit-ut33d-plus","UNI-T ölçüm referansı"]],"wires":2},"sensor-analog-apps-outline-030":{"old":["proximity","capacitive-detector","photoeye"],"parts":[["arduino-lm35","LM35 sıcaklık sensörü"],["arduino-uno","Arduino A0 okuma referansı"]],"wires":0}};
for(const [id,reason,expectedWires,types,concept,limits] of mq07SensorSc308to321){
 const lesson=L.byId[id],initial=lesson?.project;
 if(!lesson||!initial||!Array.isArray(initial.wires))throw Error('MQ07 missing sensor scene '+id);
 const newCard=mq07SensorReplacements[id];
 if(newCard){
  const oldTypes=initial.components.map(c=>c.typeId);
  if(initial.wires.length!==newCard.wires||
     oldTypes.length!==newCard.old.length||newCard.old.some((x,i)=>oldTypes[i]!==x))
   throw Error('MQ07 sensor original baseline changed '+id);
  const p=board(id,lesson.title,newCard.parts);
  p.projectId=initial.projectId;p.name=initial.name;
  p.tutorialLesson={...initial.tutorialLesson,phase:'quiz'};
  lesson.project=p;lesson.kind='quiz';lesson.steps=[];lesson.workspaceMode=p.workspaceMode;
  lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 const p=lesson.project,actual=p.components.map(c=>c.typeId);
 if(p.wires.length!==expectedWires||actual.length!==types.length||types.some((x,i)=>actual[i]!==x))
  throw Error('MQ07 sensor terminal/material scope changed '+id);
 if(Boolean(p.referenceOnly)!==(lesson.kind==='quiz'))
  throw Error('MQ07 sensor wiring/reference mode mismatch '+id);
 lesson.summary=concept+' Bu dersin gerçek kaynak kapsamı ayrıca sınırlandırılmıştır.';
 lesson.explanation=concept+' '+limits+' Elektriksel çalışma, fiziksel üretici testi ve görsel Windows kabulü kaynak kartından çıkarılamaz.';
 lesson.learningGoal=concept+' Başlığı, gerçek malzemeyi ve doğrulanmış terminal/ölçüm kapsamını ayırt etmek.';
 lesson.beginnerSteps=['Ekranda görünen sensör türlerini ve gerçek kablo sayısını karşılaştır.',
  'Kavram: '+concept,limits,'Dinamik ölçüm veya fiziksel emniyet kanıtı olmadan PASS verme.'];
 lesson.safety='Yalnız çevrimdışı sanal sensör eğitimi; gerçek enerjili devre ve fiziksel elektrik güvenlik testi değildir.';
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07TemperatureScope:'SC308_SC321',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:reason,
  nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false,sensorCalibrationAcceptance:false};
}


/* MQ07_SC322_SC335_PRESSURE_FORCE: fix nonpressure proximity graphs; preserve golden piezo/TX11 solvers without false native PASS. */
const mq07PressureCases=[["038","REED_ARDUINO_OUTLINE_NATIVE_UNVERIFIED",5,["arduino-bench-supply","arduino-reed","arduino-uno"],"Reed sensörü ile Arduino girişini gösteren mevcut sanal bağlantı korunur.","Gerçek mıknatıs hareketi, debounce veya Arduino programı bu yeni ders ID'sinde ayrıca test edilmedi."],["039","HALL_RELAY_OUTLINE_NATIVE_UNVERIFIED",7,["arduino-bench-supply","sensor-hall","coil-relay","contact-no","lamp-green"],"Hall sensörü, 24 V bobin ve K1 kontak yükü farklı elektriksel görevlere sahiptir.","Bu yeni dersin sensör manyetik alan dinamiği ve röle yük tepkisi bağımsız native test görmedi."],["040","NO_PRESSURE_TRANSDUCER_WIRING",0,["capacitor","resistor","tutorial-piezo","load-cell"],"Basınç/kuvvet algılamada kapasitif, dirençsel, piezoelektrik ve köprü tabanlı ölçüm ilkeleri farklıdır.","Önceki endüktif proximity–röle–lamba devresi basınç sensörü değildi. Karttaki öğeler sadece prensip karşılaştırmasıdır; gerçek basınç dönüştürücü ve kalibre basınç okuması bulunmaz."],["041","NO_CAPACITIVE_PRESSURE_SENSOR_MODEL",0,["capacitor","tutorial-concept"],"Kapasitif basınç algılama, membran yer değiştirmesinin kapasiteye etkisi kavramına dayanır.","Gösterilen kondansatör ve kavram kartı gerçek basınç elemanı veya kalibre ölçüm değildir; önceki endüktif/optik sensörler çıkarıldı."],["042","NO_RESISTIVE_FORCE_SENSOR_MODEL",0,["resistor","tutorial-concept"],"Dirençsel kuvvet/basınç algılamada mekanik etkiyle direnç değerinin değişmesi incelenir.","Genel direnç, FSR basınç elemanının doğrulanmış transfer eğrisi değildir; endüktif/optik kartın yerine kavram gösterilir."],["043","NO_PIEZORESISTIVE_PRESSURE_BRIDGE",0,["resistor","tutorial-concept"],"Piezodirençli sensör, basıncın mekanik gerinim üzerinden direnç değişimine etkisini kullanır.","Bu piezoelektrik darbe sensörü değildir; gerçek köprü, basınç transdüseri, sıcaklık telafisi ve kalibrasyon yoktur."],["044","NO_PIEZOELECTRIC_PRESSURE_CALIBRATION",0,["tutorial-piezo"],"Piezoelektrik dönüştürücü değişen mekanik gerilimde elektriksel darbe tepkisi üretebilir.","Bu kart gerçek mutlak/statik basınç ölçeri, kalibrasyon veya bağlantılı ölçüm senaryosu değildir."],["045","NO_STRAIN_GAUGE_ELEMENT_CALIBRATION",0,["load-cell","tutorial-concept"],"Gerinim ölçer küçük direnç değişimlerinin köprü üzerinden ölçülmesi ilkesine dayanır.","Load-cell ürünü gerinim ölçer kullanımına örnektir, fakat tekil strain-gauge elemanı, yapıştırma, köprü kalibrasyonu ve gerçek kuvvet testi yoktur."],["046","NO_LOAD_CELL_MVV_WIRING",0,["load-cell","weighing-indicator"],"Yük hücresi ile göstergenin uyartım ve diferansiyel sinyal bağlantıları birlikte değerlendirilir.","Görüntüdeki ürünler kablosuz referanstır; ağırlık göstergesinde gerçek mV/V ölçümü, dara ve gerçek tartım testi yapılmamıştır."],["047","PIEZO_IMPULSE_OUTLINE_NATIVE_UNVERIFIED",4,["tutorial-piezo","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"],"Piezoelektrik sensör darbesi sanal UT33D+ ve yük direnciyle ölçülebilir.","Önceki endüktif yakınlık–röle kartı, depoda önceden doğrulanan sanal piezo dört telli devreyle değiştirildi; yeni outline kimliğinde darbe izinin native Node kabulü yapılmadı."],["048","LOAD_CELL_TX11_OUTLINE_NATIVE_UNVERIFIED",6,["arduino-bench-supply","load-cell","weighing-indicator"],"Load cell köprüsü, 5 V uyartım ve TX11 diferansiyel mV/V girişine dayanır.","Önceki proximity–röle devresi, mevcut TX11 6 telli sanal kaynak şemasıyla değiştirildi; yeni ders için ayrı çözücü ve gerçek kalibrasyon kabulü yoktur."],["049","OPTICAL_RELAY_OUTLINE_NATIVE_UNVERIFIED",7,["arduino-bench-supply","sensor-through-beam","coil-relay","contact-no","lamp-green"],"Optik sensörün 24 V çıkışının röleyi ve kontağı sürmesi kaynak şemadaki bir sanal örnektir.","Yeni outline kimliğinde gerçek ışık kesilmesi ve röle çıkış dinamiği ölçülmedi."],["050","NO_LDR_VOLTAGE_DIVIDER_WIRING",0,["ldr-gl5528"],"LDR'nin direnci aydınlatma ile değişebilir; gerilim için uygun kaynak ve bölücü gerekir.","Görsel LDR referansında ışık şiddeti, direnç eğrisi, devre kablosu veya ölçüm yoktur."],["electronic-component-basics-outline-028","NO_PHOTODIODE_BIAS_READOUT",0,["bpw34-photodiode","photoeye"],"Fotodiyodun ışığa bağlı akımı uygun bias ve okuma yoluyla ölçülebilir.","Bu referans kartındaki BPW34 ve optik eleman tek başına fotodiyot akım ölçümü veya çalışan devre değildir."]];
for(const [suffix,issue,wireCount,types,concept,limits] of mq07PressureCases){
 const id=suffix.startsWith('electronic-')?suffix:'sensor-analog-apps-outline-'+suffix;
 const lesson=L.byId[id],old=lesson?.project;
 if(!lesson||!old)throw Error('MQ07 pressure scope missing '+id);
 const conceptual={
  '040':[['capacitor','Kapasitif basınç prensibi'],['resistor','Dirençsel basınç prensibi'],['tutorial-piezo','Piezoelektrik basınç prensibi'],['load-cell','Gerinim köprüsü kuvvet örneği']],
  '041':[['capacitor','Kapasitif algılama prensibi'],['tutorial-concept','Basınç membranı kavramı']],
  '042':[['resistor','Dirençsel algılama prensibi'],['tutorial-concept','FSR/kuvvet algılama kavramı']],
  '043':[['resistor','Piezodirençli değişim prensibi'],['tutorial-concept','Köprü ve basınç dönüştürücü kavramı']],
  '045':[['load-cell','Gerinim köprüsü örneği'],['tutorial-concept','Strain-gauge elemanı kavramı']]
 };
 if(conceptual[suffix]){
  const oldTypes=old.components.map(c=>c.typeId);
  if(suffix==='040'){
   if(old.wires.length!==7||!oldTypes.includes('proximity')||!oldTypes.includes('coil-relay'))
    throw Error('MQ07 pressure chapter stale schematic changed');
  }else if(!old.referenceOnly||old.wires.length!==0)
   throw Error('MQ07 pressure concept reference changed '+id);
  const p=board(id,lesson.title,conceptual[suffix]);
  p.projectId=old.projectId;p.name=old.name;
  p.tutorialLesson={...old.tutorialLesson,phase:'quiz'};
  lesson.project=p;lesson.kind='quiz';lesson.steps=[];lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 if(suffix==='047'||suffix==='048'){
  if(old.wires.length!==7||old.components.find(c=>c.typeId==='proximity')===undefined)
   throw Error('MQ07 false proximity application changed '+id);
  const sourceId=suffix==='047'?'sensor-analog-apps-src-08':'sensor-analog-apps-src-09';
  const known=L.byId[sourceId];
  if(!known||known.project.wires.length!==(suffix==='047'?4:6)||
     known.steps.length!==known.project.wires.length)
   throw Error('MQ07 golden piezo/TX11 source changed '+sourceId);
  const p=clone(known.project);
  p.projectId=old.projectId;p.name=old.name;
  p.tutorialLesson={...old.tutorialLesson,phase:'demo'};
  lesson.project=p;lesson.kind='wiring';
  lesson.steps=known.steps.map(x=>clone(x));
  lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId),
   sourceTopologyReusedFrom:sourceId};
 }
 const p=lesson.project,actual=p.components.map(c=>c.typeId);
 if(p.wires.length!==wireCount||actual.length!==types.length||types.some((x,i)=>actual[i]!==x))
  throw Error('MQ07 pressure/source topology mismatch '+id);
 if(Boolean(p.referenceOnly)!==(wireCount===0))throw Error('MQ07 pressure reference flag '+id);
 lesson.summary=concept+' Bu dersin sanal örnek ve kabul sınırı açıkça ayrılır.';
 lesson.explanation=concept+' '+limits+' Bu kaynak açıklaması üretici kalibrasyonu, gerçek laboratuvar veya Windows görsel kabulü değildir.';
 lesson.learningGoal=concept+' Basınç/kuvvet/optik sensör kaynak şemasının gerçek elemanlarını ve sınırlarını ayırt etmek.';
 lesson.beginnerSteps=['Gerçek sensör ve ölçüm cihazı türlerini; kablo ve terminal sayılarını kontrol et.',
  'Temel kavram: '+concept,limits,
  'Native çözücü veya gerçek fiziksel ölçüm yapılmadan işlevsel PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07PressureScope:'SC322_SC335',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,nativeDynamicAcceptance:false,
  physicalAcceptance:false,independentPedagogicalAcceptance:false,windowsVisualAcceptance:false,
  sensorCalibrationAcceptance:false};
 lesson.safety='Sanal ders ve referans kartıdır; basınçlı sistem, gerçek ağırlık kaldırma, enerjili devre veya laboratuvar güvenlik kabulü değildir.';
}


/* MQ07_SC336_SC349_OPTICAL_SCOPE: correct source-material graphs, keep source-specific quizzes, fail-close dynamic acceptance. */
const mq07OpticalRows=[["electronic-switching-outline-061","NO_DISCRETE_PHOTOTRANSISTOR_OPTICAL_RUNTIME",0,["arduino-tlp521-1","resistor"],"Fototransistör optik uyarmayla kolektör-emiter iletimini değiştiren fotoalgılayıcıdır.","Eski BD139 ve basmalı düğme ışığa duyarlı değildi. TLP521-1 içindeki fototransistör ve yük direnci yalnız kavramsal referanstır; ayrık fototransistör modeli, optik akı ve akım ölçümü yoktur."],["sensor-analog-apps-outline-051","LDR_DARK_COMPARATOR_NO_LOAD_DYNAMIC",12,["arduino-bench-supply","ldr-gl5528","resistor","lm358p-dip8","resistor","resistor","unit-ut33d-plus","test-probe-red","test-probe-black"],"LDR ışıkla değişen direnç, LM358P ise referansla karşılaştırılan sanal sinyal üretir.","Karanlıkta çalışan yük/aydınlatma çıkışı yoktur. Gerçek lux-eşik taraması, karanlık geçişi ve optik kalibrasyon ayrıca doğrulanmamıştır."],["sensor-analog-apps-outline-052","LDR_DC_DIMMER_OUTLINE_NATIVE_UNVERIFIED",7,["arduino-bench-supply","ldr-gl5528","resistor","mosfet-n","standard-light"],"LDR, 12 V sanal DC MOSFET güç yolunda lambanın aydınlatma kontrollü yükünü kavramsal olarak sürer.","Önceki LM358P karşılaştırıcı kartında lamba ya da dimmer güç yolu yoktu. Kaynak SC11 yedi kablolu 12 VDC LDR/MOSFET topolojisi kopyalandı; AC faz kontrolü, üretici kalibrasyonu ve bu yeni outline kimliğinde native ışık/güç eğrisi henüz doğrulanmadı."],["electronic-component-basics-outline-029","NO_IR_TX_RX_OPTICAL_LINK",0,["tutorial-ir-transmitter","tutorial-ir-receiver"],"IR verici kızılötesi ışık sinyali yayar, alıcı bu ışığı algılayan devrenin girişidir.","Verici ve alıcı malzeme referansları gösterilir; optik mesafe, modülasyon, bağlantı veya sayısal alıcı tepkisi simüle edilmez."],["digital-logic-apps-outline-016","NO_COMMAND_TEST_CONTROL_WIRING",0,["arduino-bench-supply","push-no","push-nc","coil-relay","lamp-green"],"Kumanda testinde START/STOP, röle bobini ve yük yolunun işlevleri ayrı değerlendirilir.","Ürünler kablosuz referanstır; gerçek mühürleme, test tepkisi, NC emniyeti veya kaynak-çıkış devresi bulunmaz."],["electronic-component-basics-outline-030","NO_IR_RECEIVER_LOAD_CONTROL",0,["tutorial-ir-receiver","coil-relay","lamp-green"],"IR alıcıdan röle ve lambaya uzanan kumanda zinciri kavramsal bir sinyal-yük örneğidir.","Gerçek IR alıcı terminali, röle sürme devresi, besleme, optik program ve yük tepkisi bulunmaz."],["sensor-analog-apps-outline-053","SOUND_SENSOR_ARDUINO_RUNTIME_UNVERIFIED",8,["arduino-bench-supply","arduino-sound-sensor","arduino-uno","arduino-buzzer"],"5 V sanal besleme, ses sensörü dijital çıkışı, Arduino UNO D2 girişi ve D9 buzzer işlevlerini temsil eder.","Sekiz terminal bağlantısı vardır; bu outline dersinde ses eşiği değişimi, Arduino program yürütümü ve buzzer aç/kapa zaman izi native ölçülmedi."],["electronic-component-basics-outline-031","NO_MIC_PREAMP_GAIN_WIRING",0,["electret-9767-mic","lm358p-dip8"],"Elektret mikrofonun düşük seviyeli ses sinyali ile ön yükseltecin görevleri ayrıdır.","Mikrofon ve LM358P referansları kablosuzdur; gerçek akustik gerilim, kazanç ve sinyal-gürültü ölçümü yapılmamıştır."],["electronic-component-basics-outline-032","NO_SPEAKER_AMPLIFIER_OUTPUT_WIRING",0,["speaker-8ohm-1w","lm358p-dip8"],"Hoparlör yükünün ve yükselteç çıkışının güç/empedans sınırları vardır.","Hoparlör ve LM358P malzeme kartında gerçek çıkış sürücüsü, ses dalgası, güç ve distorsiyon ölçümü yoktur."],["electronic-component-basics-outline-033","NO_CLAP_TRIGGER_RELAY_RUNTIME",0,["electret-9767-mic","arduino-sound-sensor","coil-relay"],"Alkışla tetiklemede mikrofon, eşik işleme ve röle çıkışı farklı bloklardır.","Gerçek alkış algısı, eşik filtresi, kontrol bağlantısı veya röle tepki döngüsü bulunmaz."],["opamp-apps-outline-018","NO_OPAMP_INPUT_OUTPUT_CHARACTERIZATION",0,["lm358p-dip8","resistor","capacitor"],"İşlemsel yükselteçlerin giriş ve çıkış sınırları gerçek besleme, kazanç ve geri beslemeye bağlıdır.","Yalnız sembol malzemeleri vardır; yükselteç kazancı, giriş ofseti veya frekans yanıtı kablolu değildir."],["electronic-component-basics-outline-034","NO_GENERAL_AMPLIFIER_GAIN_VERIFICATION",0,["lm358p-dip8","resistor","capacitor"],"Yükselteç kavramında giriş işareti, çıkış ve doğrulanmış kazanç ayrılmalıdır.","LM358P, direnç ve kondansatör sadece kavram kartıdır; ölçülen kazanç veya güç modeli yoktur."],["opamp-apps-outline-019","NO_LM358_INTERNAL_STRUCTURE_TEST",0,["lm358p-dip8","resistor","capacitor"],"LM358P PDIP-8, giriş/çıkış ve besleme uçları olan çift op-amp paketidir.","Kart genel referanstır; iç transistor yapısı veya gerçek eşdeğer devre açıklaması ve kalibrasyon yoktur."],["opamp-apps-outline-020","OPAMP_GAIN_OUTLINE_NATIVE_UNVERIFIED",14,["arduino-bench-supply","lm358p-dip8","potentiometer","resistor","resistor","unit-ut33d-plus","resistor","resistor","test-probe-red","test-probe-black"],"LM358P'nin 14 kablolu sanal uygulamasında giriş potansiyometresi, referans bölücü, geri besleme ve ölçüm probu görevleri bulunur.","Kablolu model korunur; bu outline kimliği için giriş/çıkış sayısal kazanç, op-amp doyumu, fiziksel 24 V uygunluk ve native zaman izi ayrıca doğrulanmamıştır."]];
for(const [id,reason,expectedWires,partIds,concept,limits] of mq07OpticalRows){
 const lesson=L.byId[id],previous=lesson?.project;
 if(!lesson||!previous)throw Error('MQ07 SC336-349 lesson absent '+id);
 if(id==='electronic-switching-outline-061'){
  if(lesson.kind!=='wiring'||previous.wires.length!==8||
     previous.components.filter(c=>c.typeId==='bd139-npn').length!==1)
   throw Error('SC336 old generic BJT project changed');
  const p=board(id,lesson.title,[['arduino-tlp521-1','TLP521-1 iç fototransistör örneği'],['resistor','Kolektör yükü kavramı']]);
  p.projectId=previous.projectId;p.name=previous.name;p.tutorialLesson={...previous.tutorialLesson,phase:'quiz'};
  lesson.project=p;lesson.kind='quiz';lesson.steps=[];lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }else if(id==='sensor-analog-apps-outline-052'){
  const g=L.byId['sensor-analog-apps-src-11'];
  if(lesson.kind!=='wiring'||previous.wires.length!==12||
     !previous.components.some(c=>c.typeId==='lm358p-dip8')||g?.project.wires.length!==7||
     !g.project.components.some(c=>c.typeId==='mosfet-n')||
     g.project.components.find(c=>c.id==='g1')?.dcVoltage!==12)
   throw Error('SC338/golden LDR dimmer topology changed');
  const p=clone(g.project);
  p.projectId=previous.projectId;p.name=previous.name;p.tutorialLesson={...previous.tutorialLesson,phase:'demo'};
  lesson.project=p;lesson.kind='wiring';lesson.steps=clone(g.steps);lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId),
   sourceTopologyReusedFrom:'sensor-analog-apps-src-11',virtualDcOnly:true,acPhaseAcceptance:false};
 }else if(id==='electronic-component-basics-outline-029'||id==='electronic-component-basics-outline-030'){
  if(lesson.kind!=='quiz'||previous.wires.length!==0||previous.components.length!==1||
     previous.components[0].typeId!=='tutorial-concept')throw Error('IR baseline changed '+id);
  const parts=id.endsWith('-029')
   ?[['tutorial-ir-transmitter','IR verici'],['tutorial-ir-receiver','IR alıcı']]
   :[['tutorial-ir-receiver','IR alıcı'],['coil-relay','Röle bobini'],['lamp-green','Sanal gösterge lambası']];
  const p=board(id,lesson.title,parts);
  p.projectId=previous.projectId;p.name=previous.name;p.tutorialLesson={...previous.tutorialLesson,phase:'quiz'};
  lesson.project=p;lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 const project=lesson.project,types=project.components.map(c=>c.typeId);
 if(project.wires.length!==expectedWires||types.length!==partIds.length||partIds.some((x,i)=>types[i]!==x)||
   Boolean(project.referenceOnly)!==(expectedWires===0))
  throw Error('MQ07 optical source graph mismatch '+id);
 lesson.summary=concept+' Bu dersin sanal kapsam sınırı ayrıca belirtilmiştir.';
 lesson.explanation=concept+' '+limits+' Gerçek cihaz veya fiziksel güvenlik kabulü değildir.';
 lesson.learningGoal=concept+' Başlık, sanal malzeme/terminal ve kanıtlanan davranışı ayırt etmek.';
 lesson.beginnerSteps=['Kaynak başlığını ve görünen malzemelerin gerçek uç/kablo sayısını karşılaştır.',
  'Kavramsal hedef: '+concept,limits,'Dinamik optik/elektriksel ölçüm yapılmadan PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),mq07OpticalScope:'SC336_SC349',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:reason,
  nativeDynamicAcceptance:false,physicalAcceptance:false,
  windowsVisualAcceptance:false,independentPedagogicalAcceptance:false,
  opticalCalibrationAcceptance:false,acPhaseAcceptance:false};
 lesson.safety='Yalnız çevrimdışı sanal kavram/cihaz ve düşük gerilimli eğitim referansı; gerçek optik, elektriksel veya üretici cihaz güvenliği kabulü değildir.';
}


/* MQ07_SC350_SC363_OPAMP_FEEDBACK: LM358P real pins, virtual-probe output, fail-closed gain/dynamics. */
const mq07Opamp350Rows=[["opamp-apps-outline-021","NO_NEGATIVE_FEEDBACK_CIRCUIT",0,"Negatif geri besleme, çıkış pin 1’den eviren giriş pin 2’ye uygun direnç dönüşüdür.","Malzeme kartında giriş ve geri besleme dirençleri var; gerçek kablo, ölçülen kazanç yok."],["opamp-apps-outline-022","INVERTING_DEMO_NOT_COMPLETE_OPAMP_APPLICATIONS",14,"Bu genel başlık 14 telli yalnız eviren LM358P örneğini gösterir.","Diğer op-amp işlevleri ve kazanç dinamiği test edilmedi."],["opamp-apps-outline-023","INVERTING_GAIN_NATIVE_PENDING",14,"10 kΩ giriş, 47 kΩ negatif geri besleme pin 2’ye; pin 3 referansa gider.","Gerilim kazancı ve besleme sınırı farklı girişlerde ölçülmedi."],["opamp-apps-outline-024","INVERTING_AC_RESPONSE_NATIVE_PENDING",13,"AC jeneratör pin 2’yi giriş direnci üzerinden sürer, çıkış pin 1 geri beslemeye bağlıdır.","Frekans cevabı, kırpılma ve genlik doğrulaması yok."],["opamp-apps-outline-025","INVERTING_DC_RESPONSE_NATIVE_PENDING",14,"DC potansiyometre giriş direnciyle pin 2’ye, Rf çıkış pin 1’den pin 2’ye bağlıdır.","DC transfer eğrisi ve gerçek çıkış sınırları test edilmedi."],["opamp-apps-outline-026","NONINVERTING_GAIN_NATIVE_PENDING",11,"Evirmeyen giriş pin 3’tedir; pin 2 dirençli negatif geri besleme düğümüdür.","Gerçek sayısal kazanç ve yük davranışı native olarak doğrulanmadı."],["opamp-apps-outline-027","NONINVERTING_AC_RESPONSE_NATIVE_PENDING",10,"AC jeneratör pin 3’e bağlı, Rf çıkış pin 1’den pin 2’ye bağlıdır.","AC kazanç ve doyum sınırı native olarak ölçülmedi."],["opamp-apps-outline-028","NONINVERTING_DC_RESPONSE_NATIVE_PENDING",11,"DC potansiyometre pin 3’ü; çıkış geri beslemesi pin 2’yi besler.","Çoklu DC giriş/çıkış testi yok."],["opamp-apps-outline-029","VOLTAGE_FOLLOWER_NATIVE_PENDING",8,"Gerilim izleyicide çıkış pin 1 doğrudan eviren giriş pin 2’ye döner.","Birim kazanç, çıkış akım ve farklı giriş gerilimleri native ölçülmedi."],["opamp-apps-outline-030","FOLLOWER_PRACTICE_NATIVE_PENDING",8,"Gerilim izleyici temrininde pin 1→pin 2 doğrudan geri beslemedir.","Girişe karşı gerçek sanal çıkış izleme ölçümü yapılmadı."],["opamp-apps-outline-031","COMPARATOR_THRESHOLD_NATIVE_PENDING",11,"Karşılaştırıcıda ölçülen giriş pin 3, dirençli referans pin 2 ve çıkış pin 1’dir.","Çıkış sanal multimetre probuyla okunur; Schmitt histerezisi ve yeni ders için eşik taraması kanıtlanmadı."],["opamp-apps-outline-032","COMPARATOR_PRACTICE_NATIVE_PENDING",11,"Karşılaştırıcı temrini giriş pin 3, referans pin 2 ve çıkış pin 1 topolojisini gösterir.","Ölçüm probu modeli kabloyla aynı şey değildir; native eşik taraması yapılmadı."],["sensor-analog-apps-outline-054","LDR_COMPARATOR_LUX_NATIVE_PENDING",12,"GL5528 ve dirençli bölücü pin 3 girişini, referans bölücü pin 2’yi besler.","SC42 golden 12 tel grafiğiyle eşleşir; yeni outline lux→çıkış dinamik ölçümü yapılmadı."],["sensor-analog-apps-outline-055","NTC_COMPARATOR_TEMPERATURE_NATIVE_PENDING",12,"NTC bölücüsü pin 3 girişini, referans bölücü pin 2’yi besler.","SC43 golden 12 tel grafiğiyle eşleşir; yeni outline °C→çıkış ölçümü yapılmadı."]];
for(const [id,reason,expectedWires,concept,limit] of mq07Opamp350Rows){
 const l=L.byId[id],before=l?.project;
 if(!l||!before||before.wires.length!==expectedWires||
    l.kind!==(expectedWires?'wiring':'quiz'))throw Error('MQ07 source topology changed '+id);
 if(id==='opamp-apps-outline-021'){
  const original=before.components.map(c=>c.typeId);
  if(original.join(',')!=='lm358p-dip8,resistor,capacitor')
   throw Error('SC350 source concept material changed');
  const p=board(id,l.title,[['lm358p-dip8','LM358P DIP-8'],['resistor','Giriş direnci'],
    ['resistor','Negatif geri besleme direnci']]);
  p.projectId=before.projectId;p.name=before.name;
  p.tutorialLesson={...before.tutorialLesson,phase:'quiz'};
  l.project=p;l.materials=materialRows(p);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 const p=l.project,u=p.components.find(c=>c.typeId==='lm358p-dip8');
 if(!u||p.wires.length!==expectedWires)throw Error('MQ07 LM358P scope changed '+id);
 if(expectedWires){
  const endpoint=(pin)=>p.wires.some(w=>(w.from.c===u.id&&w.from.p===pin)||
   (w.to.c===u.id&&w.to.p===pin))||
   p.components.some(c=>c.probeTarget?.c===u.id&&c.probeTarget?.p===pin);
  for(const pin of ['1','2','3','4','8'])
   if(!endpoint(pin))throw Error('MQ07 LM358P virtual terminal missing '+id+'/'+pin);
  if(!p.components.some(c=>c.typeId==='unit-ut33d-plus'))
   throw Error('MQ07 virtual voltmeter missing '+id);
 }
 l.summary=concept+' Kaynak ve işlev kabul sınırları ayrıca belirtilmiştir.';
 l.explanation=concept+' '+limit+' Ekrandaki terminal ve probeTarget varlığı tek başına native, Windows veya fiziksel kabul değildir.';
 l.learningGoal=concept+' Kaynak terminal ve geri besleme şemasını gerçek ölçüm kanıtından ayırt etmek.';
 l.beginnerSteps=['LM358P 1/2/3/4/8 pinlerini ve varsa sanal prob hedeflerini incele.',
  'Kavram: '+concept,limit,'Native dinamik veya fiziksel ölçüm olmadan PASS verme.'];
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07OpampScope:'SC350_SC363',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:reason,nativeDynamicAcceptance:false,
  feedbackGainAcceptance:false,manufacturerLimitsAcceptance:false,
  physicalAcceptance:false,windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
 l.safety='Yalnız sanal elektronik dersi; gerçek donanım, üretici sınırları ve elektrik güvenliği kabulü değildir.';
}


/* MQ07_SC364_SC377_OPAMP_SPECIAL: preserve verified LM358 pins, refuse invented special functionality. */
const mq07SpecialOpampRows=[["033","NO_OPAMP_ON_DELAY_STORAGE",14,"ON-delay işlevi ancak giriş tepkisinden sonra eşik/RC gecikmesiyle tanımlanabilir.","Önceki 14 kablolu eviren yükselteçte zamanlama kondansatörü ve gecikmeli çıkış yoktu.",["lm358p-dip8","resistor","capacitor"]],["034","NO_OPAMP_OFF_DELAY_STORAGE",14,"OFF-delay işlevinde tetik kalktıktan sonra kontrollü bırakma davranışı gerekir.","Önceki eviren yükselteçte enerji depolama/deşarj ağı veya gecikmeli bırakma yoktu.",["lm358p-dip8","resistor","capacitor"]],["035","NO_SUBTRACTOR_TWO_INDEPENDENT_INPUTS",14,"Fark yükselteci iki bağımsız girişi tanımlanmış direnç oranlarıyla karşılaştırır.","Önceki 14 kablolu eviren yükselteçte bağımsız ikinci çıkarma girişi yoktu.",["lm358p-dip8","resistor","resistor","potentiometer","potentiometer"]],["036","NO_SUBTRACTOR_PRACTICE_TWO_INPUTS",14,"Çıkarıcı devre temrini iki bağımsız girişin çıkışta fark oluşturduğunu göstermelidir.","Önceki devrede yalnız bir ayar potansiyometresi vardı; çıkarma ölçümü yoktu.",["lm358p-dip8","resistor","resistor","potentiometer","potentiometer"]],["037","NO_SUMMER_INDEPENDENT_INPUT_BRANCHES",14,"Toplayıcı yükselteç ayrı giriş dirençleri ve işaret toplamı ile değerlendirilir.","Önceki eviren örnekte ikinci giriş dalı ve gerçek toplam çıkışı yoktu.",["lm358p-dip8","resistor","resistor","potentiometer","potentiometer"]],["038","NO_SUMMER_PRACTICE_INPUT_BRANCHES",14,"Toplayıcı uygulama her girişin ayrı dirençli toplama düğümüne ulaşmasını gerektirir.","Tek kaynaklı önceki devre iki giriş toplamı değildi.",["lm358p-dip8","resistor","resistor","potentiometer","potentiometer"]],["039","DIFFERENTIATOR_NATIVE_AC_RESPONSE_PENDING",14,"Türev alıcıda seri giriş kondansatörü ve çıkıştan eviren girişe dirençli geri besleme bulunur.","100 nF C1, 47 kΩ Rf ve fiziksel LM358P pinleri vardır; AC darbe tepkisi native olarak ölçülmedi.",null],["040","DIFFERENTIATOR_PRACTICE_NATIVE_PENDING",14,"Türev alıcı temrini giriş değişim hızının çıkışla ilişkisini ölçmeyi gerektirir.","Giriş kondansatörü ve dirençli geri besleme çizilidir; zaman/frekans cevabı native kabul edilmedi.",null],["041","INTEGRATOR_NATIVE_RAMP_PENDING",14,"İntegral alıcıda giriş direnci ve çıkıştan eviren girişe kondansatör geri beslemesi bulunur.","10 kΩ R1, 1 µF C1 vardır; sanal ramp/saturasyon ve sıfırlama zaman davranışı ölçülmedi.",null],["042","INTEGRATOR_PRACTICE_NATIVE_PENDING",14,"İntegral uygulama çıkışın girişin zamansal toplamını izlediğini göstermelidir.","Fiziksel LM358P pinleri ve kapasitif geri besleme çizilidir; gerçek dinamik kabul yoktur.",null],["component-035","RECTIFIER_BRIDGE_REFERENCE_ONLY",0,"Doğrultmaç, akım yönlendiren diyot elemanları ve isteğe bağlı filtrelemeden oluşur.","Köprü ve filtre kondansatörü malzeme referansıdır; giriş-çıkış dalga biçimi veya kablo yoktur.",null],["043","NO_PRECISION_HALF_WAVE_DIODE_PATH",14,"Op-amp destekli yarım dalga doğrultmada diyot yönü ve giriş/çıkış geri besleme yolunun tanımlanması gerekir.","Önceki 14 kablolu eviren yükselteçte doğrultucu diyot yoktu, yarım dalga davranışı iddia edilemez.",["lm358p-dip8","1n4007-do41","resistor"]],["component-036","NO_INSTRUMENTATION_AMPLIFIER_TOPOLOGY",0,"Enstrümantasyon yükselteci çok kademeli diferansiyel giriş ve eşleştirilmiş direnç oranları gerektirir.","Mevcut LM358P, direnç ve kondansatör yalnız semboliktir; üç yükselteçli devre ve CMRR ölçümü yoktur.",null],["044","SCHMITT_HYSTERESIS_SWEEP_NATIVE_PENDING",14,"Schmitt devresinde LM358P çıkış pin 1 pozitif geri besleme ile pin 3 girişini etkiler; pin 2 referanstır.","47 kΩ pozitif geri besleme ve 10 kΩ eşik ağı çizilidir; yukarı/aşağı giriş taraması ve eşik-histerezis farkı native ölçülmedi.",null]];

for(const [suffix,issue,wireCount,concept,limits,parts] of mq07SpecialOpampRows){
 const id=suffix.startsWith('component-')?'electronic-component-basics-outline-'+suffix.slice(10):'opamp-apps-outline-'+suffix;
 const lesson=L.byId[id],old=lesson?.project;
 if(!lesson||!old||old.wires.length!==wireCount||lesson.kind!==(wireCount?'wiring':'quiz'))
  throw Error('MQ07 SC364–377 canonical scope changed '+id);
 if(parts){
  if(old.components.filter(x=>x.typeId==='lm358p-dip8').length!==1||
     old.components.some(x=>x.typeId==='1n4007-do41'))
   throw Error('MQ07 prior generic amplifier template changed '+id);
  const p=board(id,lesson.title,parts.map((t,i)=>[t,
   t==='lm358p-dip8'?'LM358P · kavram':t==='1n4007-do41'?'Diyot · doğrultmaç kavramı':
   t==='potentiometer'?'Bağımsız giriş referansı '+(i+1):
   t==='capacitor'?'RC/zamanlama kavramı':'Direnç · bağlantısız referans']));
  p.projectId=old.projectId;p.name=old.name;p.tutorialLesson={...old.tutorialLesson,phase:'quiz'};
  lesson.project=p;lesson.kind='quiz';lesson.steps=[];lesson.workspaceMode=p.workspaceMode;
  lesson.materials=materialRows(p);
  lesson.pedagogyReview={...(lesson.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 if(Boolean(lesson.project.referenceOnly)!==(lesson.project.wires.length===0))
  throw Error('MQ07 SC364–377 reference flag mismatch '+id);
 lesson.summary=concept+' Bu dersin gerçek topoloji ve kabul sınırları ayrıca belirtilmiştir.';
 lesson.explanation=concept+' '+limits+' Çizim gerçek cihaz/üretici fiziksel kabulü veya kesin sayısal dinamik kanıtı değildir.';
 lesson.learningGoal=concept+' Beklenen özel analog işlev ile mevcut şemadaki doğrulanabilir parçaları ve terminalleri karşılaştırmak.';
 lesson.beginnerSteps=['Önce fiziksel LM358P ve malzeme/bağlantı kimliklerini kontrol et.',
  'Kavramsal işlev: '+concept,limits,'Dinamik ölçüm, kaynak devresi veya gerçek donanım kanıtı olmadan PASS verme.'];
 lesson.pedagogyReview={...(lesson.pedagogyReview||{}),
  mq07SpecialOpampScope:'SC364_SC377',titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
 lesson.safety='Bu sanal referans gerçek op-amp, ölçüm, ısı, besleme ve donanım güvenliği kabulü değildir.';
}


/* MQ07_SC378_SC391_OSCILLATOR_SCOPE: honest oscillator/multivibrator references; protect original questions and existing native gates. */
const mq07OscillatorRows=[["oscillator-filter-apps-outline-031","LC_TANK_NO_OSCILLATION_RUNTIME",["arduino-bd139","reactor","capacitor"],"LC osilatör kavramı bobin ve kondansatör rezonansı ile uygun aktif geri besleme yolunu gerektirir.","LC malzeme referansı var; rezonans çevrimi, gerçek bobin L değeri, geri besleme ve osilasyon dalga biçimi yoktur."],["oscillator-filter-apps-outline-032","CRYSTAL_DRIVE_LOAD_CAPACITOR_NOT_VERIFIED",null,"Kristal osilatör bir kuvars rezonatör, uygun sürücü ve yük koşullarına dayanır.","HC49 kristal, NPN ve kapasitörün malzeme olarak görünmesi gerçek frekans, yükleme veya osilasyon kabulü değildir."],["oscillator-filter-apps-outline-033","RC_OSCILLATION_FEEDBACK_NOT_WIRED",null,"RC osilatör geri besleme faz ve kazanç koşullarına dayanır.","Transistör, direnç ve kondansatör kablosuzdur; RC ağ, frekans veya sürdürülen osilasyon ölçülmemiştir."],["oscillator-filter-apps-outline-034","MULTIVIBRATOR_MODES_NOT_DISTINGUISHED",null,"Tek, çift ve kararsız multivibratörler durum sayısı ve tetikleme açısından ayrılır.","İki transistörlü malzeme kartında çapraz bağlantı, geçiş, tetik veya periyot ölçümü yoktur."],["oscillator-filter-apps-outline-035","COLPITTS_CAPACITIVE_DIVIDER_NOT_WIRED",["arduino-bd139","reactor","capacitor","capacitor"],"Colpitts osilatörün LC geri beslemesinde iki kapasitörlü kapasitif bölücü kullanılır.","İki kondansatör ve bobin yalnız ayrı referanslardır; bağlı bölücü, tank frekansı veya osilasyon yoktur."],["oscillator-filter-apps-outline-036","HARTLEY_TAPPED_INDUCTOR_NOT_VERIFIED",["arduino-bd139","reactor","reactor","capacitor"],"Hartley osilatör geri beslemesi sarım oranı veya kuplajlı/tapli endüktansla ilgilidir.","İki ayrı bobin sembolü tapli gerçek bobin modeli, kuplaj veya bağlanmış Hartley devresi yerine geçmez."],["oscillator-filter-apps-outline-037","CRYSTAL_OSCILLATION_NOT_WIRED",null,"Kristal osilatör deneyi gerçek sürme yolu ve yük kapasitansı ile değerlendirilebilir.","Kristal transistör ve kondansatör kartında çalışma frekansı, pinler arası devre veya çıkış ölçümü yoktur."],["oscillator-filter-apps-outline-038","RC_PHASE_SHIFT_THREE_STAGES_NOT_WIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor","resistor","capacitor"],"RC faz kaymalı osilatör geleneksel üç RC kademesi ve yeterli aktif kazanç gerektirir.","Üç RC kademe ayrı malzeme simgeleridir; faz kayması, LM358 gerçek geri beslemesi ve dalga biçimi doğrulanmamıştır."],["oscillator-filter-apps-outline-039","WIEN_BRIDGE_GAIN_CONTROL_NOT_WIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor"],"Wien köprüsünde seri ve paralel RC kolları ile amplifikatör kazancı/denge şartı birlikte incelenir.","İki R ve iki C sadece referanstır; frekans seçici köprü, kazanç sabitleme ve gerçek osilasyon ölçülmemiştir."],["oscillator-filter-apps-outline-040","MONOSTABLE_TRIGGER_PULSE_RUNTIME_ABSENT",["bd139-npn","bd139-npn","resistor","capacitor"],"Tek kararlı multivibratörde bir kararlı durum ve tetikle ortaya çıkan geçici süre söz konusudur.","Önceki tek BD139'lu anlık anahtar monostable değildi; iki NPN, R/C yalnız kavram kartıdır; tetik/darbe süresi yoktur."],["oscillator-filter-apps-outline-041","BISTABLE_CROSS_COUPLED_STATES_ABSENT",["bd139-npn","bd139-npn","resistor","resistor"],"Çift kararlı multivibratör iki kararlı durum ve uygun karşılıklı geri besleme içerir.","Önceki tek BD139'lu devre iki kararlı durum üretmez; iki NPN ve iki direnç yalnız kavramsal referanstır."],["oscillator-filter-apps-outline-042","ASTABLE_CROSS_COUPLED_RC_RUNTIME_ABSENT",["bd139-npn","bd139-npn","resistor","resistor","capacitor","capacitor"],"Kararsız multivibratör iki transistörlü çapraz RC ve kendiliğinden periyodik geçişle ilişkilidir.","Eski sekiz kablolu tek anahtar salınım üretmez; iki NPN/iki R/iki C referanstır, gerçek çıkış periyodu veya dalga biçimi yoktur."],["electronic-component-basics-outline-038","PULSE_CIRCUITS_CONCEPT_ONLY",null,"Pals devreleri kırpma, kenetleme ve darbe üretimi gibi ayrı işlevleri kapsar.","Tek kavram simgesi vardır; herhangi bir pals kaynağı veya ölçülmüş çıkış bulunmaz."],["electronic-component-basics-outline-039","CLIPPER_DIODE_PATH_NOT_WIRED",null,"Diyotlu kırpıcıda eşik ve sinyal yönü eleman polaritesi ile bağlantı yoluna bağlıdır.","Diyot, direnç ve jeneratör yalnız referanstır; gerçek kırpılmış sinyal ya da ölçüm yoktur."]];
for(const [id,issue,newParts,concept,limits] of mq07OscillatorRows){
 const l=L.byId[id],old=l?.project;
 if(!l||!old||l.kind!==(id.endsWith('-040')||id.endsWith('-041')||id.endsWith('-042')?'wiring':'quiz'))
   throw Error('MQ07 oscillator baseline mismatch '+id);
 if(id.startsWith('oscillator-filter-apps-outline-04')&&['040','041','042'].some(x=>id.endsWith('-'+x))){
  if(old.wires.length!==8||old.components.filter(c=>c.typeId==='bd139-npn').length!==1)
   throw Error('MQ07 multivibrator baseline changed '+id);
 }else if(old.wires.length!==0||!old.referenceOnly){
   throw Error('MQ07 oscillator reference baseline changed '+id);
 }
 if(newParts){
  const parts=newParts.map((type,i)=>[type,concept.slice(0,52)+' · malzeme '+(i+1)]);
  const p=board(id,l.title,parts);
  p.projectId=old.projectId;p.name=old.name;p.tutorialLesson={...old.tutorialLesson,phase:'quiz'};
  l.project=p;l.kind='quiz';l.steps=[];l.materials=materialRows(p);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 const p=l.project;
 if(l.kind!=='quiz'||p.wires.length||p.referenceOnly!==true)
  throw Error('MQ07 oscillator reference must not claim runtime '+id);
 l.summary=concept+' Bu kaynak yalnız kavramsal malzeme referansıdır.';
 l.explanation=concept+' '+limits+' Sinyal üretimi, gerçek frekans ve donanım kabulü verilmedi.';
 l.learningGoal=concept+' Gösterilen parçaları gerçek geri besleme ve osilasyon devresinden ayırt etmek.';
 l.beginnerSteps=['Önce bileşenleri ve kartta kablo olmadığını kontrol et.',
  'Kavramsal bilgi: '+concept,limits,
  'Periyot, durum geçişi veya çıkış sinyali ölçülmeden PASS verme.'];
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07OscillatorScope:'SC378_SC391',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,oscillationAcceptance:false,
  nativeDynamicAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
 l.safety='Bu ekran yalnız sanal, kablosuz malzeme referansıdır; gerçek osilatör, laboratuvar frekans testi veya enerjili donanım güvenliği kabulü değildir.';
}


/* MQ07_SC392_SC405_PULSE_555_FILTER: source-grounded no-wire lessons with explicit negative dynamic gates. */
const mq07PulseScope=[["electronic-component-basics-outline-040","CLAMPER_DIODE_CAP_BIAS_NOT_WIRED",null,"Kenetleme, diyot ve kondansatörle giriş işaretinin DC referansının kaydırılması kavramıdır.","Kartta diyot, C ve R bulunur; gerçek polarite, şarj/deşarj ve kaydırılmış sinyal çıkışı ölçülmemiştir."],["electronic-component-basics-outline-041","PULSE_GENERATOR_OSCILLATION_NOT_WIRED",null,"Pals üretimi zamanla değişen anahtarlama ve bir çıkış işareti gerektirir.","NPN, R ve C yalnız kavram kartıdır; osilasyon, frekans, darbe genişliği veya çıkış kablosu yoktur."],["electronic-component-basics-outline-042","CLIPPER_DIODE_SIGNAL_NOT_WIRED",null,"Diyotlu kırpma belirlenen referansın üstünde/altında işaret sınırlama ile açıklanır.","Diyot, direnç ve sinyal üreteci kablosuzdur; iletim eşikleri ve kırpılmış dalga ölçülmemiştir."],["electronic-component-basics-outline-043","CLAMPER_EXERCISE_NO_SHIFTED_WAVE",null,"Kenetleyici uygulaması, diyot yönü, RC zaman sabiti ve giriş-çıkış karşılaştırması ister.","Kartta diyot, R ve C vardır; bağlanmış kenetleme yolu veya doğrulanmış gerilim kayması yoktur."],["electronic-component-basics-outline-044","MILLER_CAP_FEEDBACK_NOT_WIRED",null,"Miller etkisi etkin kapasite ve geri besleme kazancı bağlamında ele alınır.","LM358, R, C referansları bir Miller geri besleme devresi veya ölçülmüş frekans yanıtı değildir."],["electronic-component-basics-outline-045","BOOTSTRAP_CAP_REFERENCE_NOT_WIRED",null,"Bootstrap uygulamaları kapasitif bağlaşım ve uygun sürme/topoloji koşullarına dayanır.","LM358, R, C kablosuz malzemelerdir; yüzer referans, yükselen gerilim veya çalışma güvenliği doğrulanmamıştır."],["electronic-component-basics-outline-046","SCHMITT_UPPER_LOWER_THRESHOLDS_UNWIRED",["lm358p-dip8","resistor","resistor","capacitor"],"Schmitt devresinde pozitif geri besleme ile üst/alt geçiş eşikleri kavramsal olarak ayrılır.","İkinci direnç geri besleme kavramını temsil eder; gerçek LM358 pin bağlantıları, üst/alt eşik ve histerezis ölçümü yoktur."],["oscillator-filter-apps-outline-043","NE555_ASTABLE_FREQUENCY_UNWIRED",["arduino-ne555","resistor","resistor","capacitor"],"555 astable osilatörde iki zamanlama direnç kolu ve bir kondansatör periyot/duty kavramını açıklar.","İkinci R, astable zamanlama kollarının ayrımını gösterir; 555 pinleri, gerçek salınım veya ölçülmüş periyot yoktur."],["oscillator-filter-apps-outline-044","NE555_PWM_DUTY_ADJUSTMENT_UNWIRED",["arduino-ne555","resistor","potentiometer","capacitor"],"555 PWM kavramı duty oranı ayarının sabit frekans hedefinden ayrı izlenmesini gerektirir.","Eklenen potansiyometre yalnız ayar elemanı referansıdır; diyotlu ayrı şarj/deşarj yolu, gerçek PWM çıkışı veya duty ölçümü yoktur."],["oscillator-filter-apps-outline-045","NE555_MONOSTABLE_TRIGGER_UNWIRED",["arduino-ne555","resistor","capacitor","push-no"],"555 tek kararlı davranışında ayrı tetikleme girişi ve bir RC zamanlama aralığı gerekir.","Buton tetik kaynağı referansı olarak eklendi; trigger/reset eşikleri ve çıkış darbesi kablolanmadı, ölçülmedi."],["oscillator-filter-apps-outline-046","NE555_BISTABLE_SET_RESET_UNWIRED",["arduino-ne555","push-no","push-no","resistor"],"555 çift kararlı durumda SET/RESET işlevleri ve korunan çıkış durumu birbirinden ayrılır.","İki komut butonu yalnız SET/RESET kavramıdır; latch hafızası, iç pin durumu ve çıkış davranışı simüle edilmez."],["oscillator-filter-apps-outline-047","FILTER_TOPOLOGY_RESPONSE_UNWIRED",null,"Filtreleme pasif ve aktif devrelerde farklı transfer işlevlerine dayanır.","LM358, R ve C referansları tek başına bir filtre frekans cevabı veya kazanç değeri oluşturmaz."],["oscillator-filter-apps-outline-048","PASSIVE_FILTER_MUST_NOT_HAVE_OPAMP",["resistor","capacitor","reactor"],"Pasif filtre yalnız direnç, kondansatör ve endüktans gibi pasif devre elemanlarına dayanabilir.","Yanlış LM358 op-amp karttan çıkarıldı; R, C ve L kablosuz sembolleri gerçek alçak/yüksek geçiren topoloji ya da frekans yanıtı değildir."],["oscillator-filter-apps-outline-049","ACTIVE_FILTER_OPAMP_TRANSFER_UNWIRED",null,"Aktif filtrelerde op-amp beslemesi, geri besleme ve RC frekans seçici yollar gerekir.","LM358, R ve C malzeme referansları var; besleme ve geri besleme terminali kablolu olmadığından kesim frekansı veya kazanç simüle edilmez."]];
for(const [id,issue,corrected,concept,limits] of mq07PulseScope){
 const l=L.byId[id],source=l?.project;
 if(!l||!source||l.kind!=='quiz'||!source.referenceOnly||source.wires.length!==0||l.steps.length!==0)
  throw Error('MQ07 SC392–405 original no-wire scope changed '+id);
 if(corrected){
  const originals={
   'electronic-component-basics-outline-046':['lm358p-dip8','resistor','capacitor'],
   'oscillator-filter-apps-outline-043':['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u'],
   'oscillator-filter-apps-outline-044':['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u'],
   'oscillator-filter-apps-outline-045':['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u'],
   'oscillator-filter-apps-outline-046':['arduino-ne555','arduino-resistor-1k','arduino-capacitor-100u'],
   'oscillator-filter-apps-outline-048':['lm358p-dip8','resistor','capacitor']
  };
  const oldParts=source.components.map(c=>c.typeId),expected=originals[id];
  if(!expected||JSON.stringify(oldParts)!==JSON.stringify(expected))
   throw Error('MQ07 SC392–405 canonical parts changed '+id);
  const p=board(id,l.title,corrected.map((type,i)=>[type,({
   'arduino-ne555':'NE555 zamanlama entegresi','lm358p-dip8':'LM358P referansı',
   'potentiometer':'PWM ayar elemanı','push-no':i===1?'SET/tetik komutu':'RESET/tetik komutu',
   'reactor':'Bobin / endüktans','capacitor':'Zaman/frekans kondansatörü',
   'resistor':'Direnç / geri besleme öğesi'})[type]||type]));
  p.projectId=source.projectId;p.name=source.name;
  p.tutorialLesson={...source.tutorialLesson,phase:'quiz'};
  l.project=p;l.materials=materialRows(p);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 l.summary=concept+' Bu kart kablolu ve çalışan bir elektronik deney değildir.';
 l.explanation=concept+' '+limits+' Gerçek dijital/analog dalga izi, üretici verisi veya elektriksel güvenlik kabulü yoktur.';
 l.learningGoal=concept+' Gerçek çizili terminal/devre kanıtıyla kaynak başlığının kapsam farkını tespit etmek.';
 l.beginnerSteps=['Dersin gerçek malzeme kimliklerini ve sıfır kablo durumunu tespit et.',
  'Kavramsal kazanım: '+concept,limits,
  'Osilasyon, PWM, eşik, frekans yanıtı veya fiziksel ölçüm kanıtı olmadan PASS verme.'];
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07PulseScope:'SC392_SC405',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,
  nativeDynamicAcceptance:false,frequencyResponseAcceptance:false,
  waveformAcceptance:false,physicalAcceptance:false,windowsVisualAcceptance:false,
  independentPedagogicalAcceptance:false};
 l.safety='Bu sayfa yalnız çevrimdışı kablosuz kavram/malzeme referansıdır; gerçek çalışma, cihaz besleme veya elektriksel güvenlik onayı değildir.';
}


/* MQ07_SC406_SC419_ACTIVE_RF: correct filter and RF reference parts, no imaginary runtime. */
const mq07ActiveRfCases=[["oscillator-filter-apps-outline-050","ACTIVE_LOWPASS_CUTOFF_UNWIRED",null,"Alçak geçiren aktif filtre, düşük frekansı geçirip üst frekansları bastıran bir aktarım işlevi taşır.","LM358, direnç ve kondansatör yalnız parça referansıdır; opamp besleme, RC konumu, kazanç ve kesim frekansı ölçülmemiştir."],["oscillator-filter-apps-outline-051","ACTIVE_HIGHPASS_CUTOFF_UNWIRED",["capacitor","resistor","lm358p-dip8","resistor"],"Yüksek geçiren aktif filtrede kapasitif giriş ile direnç referansı, yükselteç geri beslemesinden ayrılmalıdır.","Giriş C, R ve geri besleme direnci görsel kavramdır; terminaller, alt kesim frekansı ve gerçek çıkış bağlı değildir."],["oscillator-filter-apps-outline-052","ACTIVE_BANDPASS_TWO_CUTOFFS_UNWIRED",["lm358p-dip8","resistor","capacitor","resistor","capacitor"],"Bant geçiren aktif filtre, alt ve üst frekans sınırlayıcı iki farklı RC etkiye dayanabilir.","İki R–C referansı ayrı alt/üst sınırları temsil eder; bu malzemeler kablolu devre, transfer fonksiyonu veya ölçülmüş bant değildir."],["oscillator-filter-apps-outline-053","ACTIVE_BANDSTOP_NOTCH_UNWIRED",["lm358p-dip8","resistor","resistor","resistor","capacitor","capacitor","capacitor"],"Bant durduran filtre bir frekans aralığını bastırır; uygun pasif çentik ağı ve aktif tampon işlevi farklı bölümlerdir.","Üç R–C sembolü yalnız örnek çentik ağı kavramıdır; twin-T bağlantısı, direnç eşleşmesi, opamp beslemesi ve notch cevabı yoktur."],["oscillator-filter-apps-outline-054","MODULATION_DEMODULATION_RF_CHAIN_UNWIRED",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"],"Modülasyon ve demodülasyon bilgi sinyali, taşıyıcı/verici ve alıcı/çözme basamaklarını içerir.","Eski LM358+R+C filtre kartı bu RF konusu için uygun değildi. Yeni RF verici, alıcı ve sinyal üreteci malzeme referansında gerçek RF yolu yoktur."],["electronic-component-basics-outline-047","AM_MODULATION_DEMODULATION_UNWIRED",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"],"Genlik modülasyonunda bilgi taşıyıcının genliğiyle, demodülasyon ise alıcı ayıklama işleviyle ilişkilidir.","Verici ve alıcı aynı referans kartındadır; modülatör, detektör, demodüle edilmiş işaret ve taşıyıcı dalga ölçümü yoktur."],["electronic-component-basics-outline-048","FM_MODULATION_DEMODULATION_UNWIRED",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"],"Frekans modülasyonunda bilgi taşıyıcının anlık frekans değişimine, demodülasyon ise alıcı işlevine bağlıdır.","FM taşıyıcı dalga, frekans sapması, algılayıcı/demodülatör bağlantısı ve ölçüm bulunmaz."],["electronic-component-basics-outline-049","RF_TRANSMITTER_SIGNAL_PATH_UNWIRED",null,"Verici, modülasyon ve RF çıkış işlevlerini kaynak modeline göre ayrı değerlendirir.","RF modülü ve işaret kaynağı kablosuzdur; gerçek çıkış, taşıyıcı, anten ve spektrum ölçümü yoktur."],["electronic-component-basics-outline-050","AM_TRANSMITTER_MODULATOR_UNWIRED",null,"GM vericisi genlik modülasyonu için taşıyıcı ve bilgi sinyalinin birleşimini gerektirir.","Kart verici+işaret üreteci malzemesinden ibarettir; gerçek modülatör ve genlik zarfı kanıtlanmamıştır."],["oscillator-filter-apps-outline-055","FM_TRANSMITTER_DEVIATION_UNWIRED",null,"FM vericisinde bilgi sinyali taşıyıcı frekansını kontrollü değiştirir.","Frekans sapması, RF sinyal yolu ve taşıyıcı spektrumu simüle edilmemiştir."],["oscillator-filter-apps-outline-056","FM_TRANSMITTER_EXERCISE_UNWIRED",null,"FM verici uygulaması modülasyon kontrolü ve ölçülen çıkış gerektirir.","Temrin adına rağmen malzemeler bağlantısızdır; çalışan devre/frekans izi gösterilmemiştir."],["electronic-component-basics-outline-051","RF_RECEIVER_TUNING_UNWIRED",null,"RF alıcıda anten, seçicilik, demodülasyon ve ses/veri çıkışı farklı bloklardır.","RF alıcı ve işaret jeneratörü ayrı referanstır; sinyal yolu veya seçici kanal ölçümü yoktur."],["electronic-component-basics-outline-052","AM_RECEIVER_DEMODULATOR_UNWIRED",null,"GM alıcısı modüleli taşıyıcıdan genlik zarfı bilgisini ayrıştırır.","Alıcı/demodülatör kablolanmamıştır; detektör, alıcı çıkışı veya zarf ölçümü bulunmaz."],["oscillator-filter-apps-outline-057","FM_RECEIVER_DISCRIMINATOR_UNWIRED",null,"FM alıcısında kanal seçimi ve frekans değişiminden bilgi çıkarma ayrı aşamalardır.","RF alıcı ve üreteç yalnız görsel malzemedir; FM demodülasyon çıkışı veya sinyal kalitesi ölçülmemiştir."]];
const mq07ActiveRfReplacements=[["oscillator-filter-apps-outline-051",["capacitor","resistor","lm358p-dip8","resistor"],["Giriş C — yüksek geçiren sınır","Giriş R — referans","LM358P — aktif blok","Rf — geri besleme kavramı"]],["oscillator-filter-apps-outline-052",["lm358p-dip8","resistor","capacitor","resistor","capacitor"],["LM358P aktif blok","R1 — alt sınır","C1 — alt sınır","R2 — üst sınır","C2 — üst sınır"]],["oscillator-filter-apps-outline-053",["lm358p-dip8","resistor","resistor","resistor","capacitor","capacitor","capacitor"],["LM358P aktif tampon kavramı","R1 çentik ağı","R2 çentik ağı","R3 çentik ağı","C1 çentik ağı","C2 çentik ağı","C3 çentik ağı"]],["oscillator-filter-apps-outline-054",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"],["RF verici — taşıyıcı","RF alıcı — çözme","Bilgi işareti kaynağı"]],["electronic-component-basics-outline-047",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"],["AM verici kavramı","AM alıcı/demodülatör kavramı","Bilgi işareti kaynağı"]],["electronic-component-basics-outline-048",["tutorial-rf-transmitter","tutorial-rf-receiver","arduino-signal-generator"],["FM verici kavramı","FM alıcı/demodülatör kavramı","Bilgi işareti kaynağı"]]];
for(const [id,issue,expected,concept,limit] of mq07ActiveRfCases){
 const l=L.byId[id],old=l?.project;
 if(!l||!old||l.kind!=='quiz'||old.referenceOnly!==true||old.wires.length||l.steps.length)
  throw Error('MQ07 active RF reference baseline changed: '+id);
 const replacement=mq07ActiveRfReplacements.find(x=>x[0]===id);
 if(replacement){
  const types=old.components.map(c=>c.typeId),names=replacement[1],labels=replacement[2];
  const orig=id.startsWith('oscillator-filter-apps-outline-')
   ?['lm358p-dip8','resistor','capacitor']:['tutorial-rf-transmitter','arduino-signal-generator'];
  if(types.length!==orig.length||orig.some((x,i)=>types[i]!==x))
   throw Error('MQ07 active RF original materials changed: '+id);
  if(!expected||labels.length!==names.length||names.some((x,i)=>x!==expected[i]))
   throw Error('MQ07 active RF expectation mismatch: '+id);
  const p=board(id,l.title,names.map((x,i)=>[x,labels[i]]));
  p.projectId=old.projectId;p.name=old.name;p.tutorialLesson={...old.tutorialLesson,phase:'quiz'};
  l.project=p;l.materials=materialRows(p);
  l.pedagogyReview={...(l.pedagogyReview||{}),componentIds:p.components.map(c=>c.typeId)};
 }
 if(expected){
  const types=l.project.components.map(c=>c.typeId);
  if(types.length!==expected.length||expected.some((x,i)=>types[i]!==x))
   throw Error('MQ07 active RF component expectation failed: '+id);
 }
 l.summary=concept+' Bu kart gerçek kablolu uygulama değildir.';
 l.explanation=concept+' '+limit+' Fiziksel cihaz, RF yayını, üretici ve Windows ölçüm kabulü verilmemiştir.';
 l.learningGoal=concept+' Referans malzeme ile gerçek aktarım/demodülasyon ve frekans cevabı arasındaki farkı ayırt etmek.';
 l.beginnerSteps=['Önce referans malzemeleri ve kablo bulunmadığını doğrula.',
  'Kavramsal hedef: '+concept,limit,
  'Aktarım eğrisi, genlik/frekans dalgası veya fiziksel ölçüm yoksa PASS verme.'];
 l.pedagogyReview={...(l.pedagogyReview||{}),mq07ActiveRfScope:'SC406_SC419',
  titleTopologyStatus:'REVIEW',titleTopologyIssue:issue,nativeDynamicAcceptance:false,
  frequencyResponseAcceptance:false,modulationRuntimeAcceptance:false,physicalAcceptance:false,
  windowsVisualAcceptance:false,independentPedagogicalAcceptance:false};
 l.safety='Bu kart gerçek RF verici/alıcı kullanımı veya elektriksel bağlantı talimatı değil, çevrimdışı malzeme referansıdır.';
}

L.count=L.lessons.length;
L.pedagogy={version:'v1.19.20-pedagogy65-lm358-output',designStandard:'rich-reference-v1',reviewedLessons:L.lessons.length,removedExactDuplicates:removedDuplicateIds.size,dcCircuitsKept:dcKeep.size,rule:'Yalnız konu, kazanım, amaç, komponent, uygulama/devre ve materyal anlatımı aynı olan ders kopyaları birleştirilir; DC devre analizi konusu kullanıcı kararıyla ilk 10 dersle sınırlıdır; ölçüm derslerinde UNI-T cihazları ve fiziksel problar kullanılır; tüm yeni/zenginleştirilen öğretici sayfaları rich-reference-v1 standardını izler: ayarlı güç kaynağı görseli, devrenin amacı, eleman görevleri, ölçüm yöntemi, bağlantı nedeni ve beklenen sonuç tek bakışta anlaşılır; düzen zengin fakat sıkışık değildir; DC derslerinde ayarlanabilir 0–30 VDC masa kaynağı işlevsel beslemedir, AC/3-faz/pil derslerinde yanlış elektriksel besleme olarak kullanılmaz; Ohm, Seri Devre Analizi, Paralel Devre Analizi, Karışık Devre Analizi ve Kirchhoff devre kontrolü kabul kilitleri korunur; wattmetre ve güç faktörü derslerinde enerji analizörü kabul kilidi korunur; pil seri/paralel derslerinin kabul kilitleri korunur.'};
})(typeof window==='undefined'?globalThis:window);
