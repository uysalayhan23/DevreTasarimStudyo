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
  p.wires.push(W('in',inputPin,'u1','IN+','Giriş → IN+','Gerilim izleyicide giriş evirmeyen uca uygulanır.','#43a047','SIGNAL'),W('u1','OUT','u1','IN-','OUT → IN−','Birim kazançlı negatif geri besleme doğrudan çıkıştan yapılır.','#43a047','SIGNAL'));
 }else if(/karşılaştırıcı|schmitt/.test(t)){
  p.components.push(C('ref1','resistor',350,180,'R3','10 kΩ referans üst',{resistance:10000}),C('ref2','resistor',350,270,'R4','10 kΩ referans alt',{resistance:10000}));
  p.wires.push(W('g1','P','ref1','1','+24 V → R3','Karşılaştırıcı için orta referans bölücüsüdür.','#8b5a2b','+24V'),W('ref1','2','ref2','1','R3 → R4','Yaklaşık 12 V referans düğümüdür.','#43a047','SIGNAL'),W('ref2','2','g1','M','R4 → 0 V','Referans bölücünün dönüşüdür.','#111827','0V'),W('ref1','2','u1','IN-','12 Vref → IN−','Karşılaştırma eşiği eviren girişe uygulanır.','#43a047','SIGNAL'),W('in',inputPin,'u1','IN+','Giriş → IN+','Giriş referansla karşılaştırılır.','#43a047','SIGNAL'));
  if(/schmitt/.test(t))p.wires.push(W('u1','OUT','r2','1','OUT → R2','Pozitif geri besleme histerezis oluşturur.','#43a047','SIGNAL'),W('r2','2','u1','IN+','R2 → IN+','Schmitt trigger eşiğini çıkış durumuna göre kaydırır.','#43a047','SIGNAL'));
 }else if(/türev/.test(t)){
  p.components.push(C('c1','capacitor',360,390,'C1','100 nF giriş kondansatörü',{capacitance:100e-9}));
  p.wires.push(W('in',inputPin,'c1','1','Giriş → C1','Türev alıcıda giriş elemanı kondansatördür.','#43a047','SIGNAL'),W('c1','2','u1','IN-','C1 → IN−','Kondansatörün akımı toplama düğümüne gelir.','#43a047','SIGNAL'),W('u1','IN+','g1','M','IN+ → 0 V','Evirmeyen giriş referanslanır.','#111827','0V'),W('u1','OUT','r2','1','OUT → R2','Geri besleme direnci çıkıştan gelir.','#43a047','SIGNAL'),W('r2','2','u1','IN-','R2 → IN−','Rf-C ağı türev davranışını belirler.','#43a047','SIGNAL'));
 }else if(/integral/.test(t)){
  p.components.push(C('c1','capacitor',610,500,'C1','1 µF geri besleme kondansatörü',{capacitance:1e-6}));
  p.wires.push(W('in',inputPin,'r1','1','Giriş → R1','İntegratörde giriş direnci seri elemandır.','#43a047','SIGNAL'),W('r1','2','u1','IN-','R1 → IN−','Giriş akımı toplama düğümüne akar.','#43a047','SIGNAL'),W('u1','IN+','g1','M','IN+ → 0 V','Evirmeyen giriş referanslanır.','#111827','0V'),W('u1','OUT','c1','1','OUT → C1','Geri besleme elemanı kondansatördür.','#43a047','SIGNAL'),W('c1','2','u1','IN-','C1 → IN−','C geri beslemesi integral davranışı oluşturur.','#43a047','SIGNAL'));
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
 const p=base(id,title,'building');p.components=[C('g1','supply-1p',60,240,'G1','1 faz kaynak'),C('j1','building-junction',350,240,'B1','Tesisat buatı'),C('h1','ceiling-light',700,240,'H1','Aydınlatma armatürü')];
 p.wires.push(W('g1','L','j1','1','L → buat/1','Faz buat üzerinden armatüre dağıtılır.','#e53935','L1'),W('j1','2','h1','X1','Buat/2 → armatür L','Fazın armatüre devamıdır.','#e53935','L1'),W('g1','N','j1','3','N → buat/3','Nötr buat üzerinden taşınır.','#1e88e5','N'),W('j1','4','h1','X2','Buat/4 → armatür N','Nötr dönüşü armatüre ulaşır.','#1e88e5','N'));return p;
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
 l.materials=materialRows(p);
 l.realElectronicsParts=true;
 l.pedagogyReview={...(l.pedagogyReview||{}),realElectronicsParts:true,lm358PhysicalPackage:true,realPackagePolicy:'orthographic-top-pin-aligned'};
 return true;
}
for(const l of L.lessons)upgradeLegacyLm358PhysicalPackage(l);

L.count=L.lessons.length;
L.pedagogy={version:'v1.19.20-pedagogy64-real-ic-visuals',designStandard:'rich-reference-v1',reviewedLessons:L.lessons.length,removedExactDuplicates:removedDuplicateIds.size,dcCircuitsKept:dcKeep.size,rule:'Yalnız konu, kazanım, amaç, komponent, uygulama/devre ve materyal anlatımı aynı olan ders kopyaları birleştirilir; DC devre analizi konusu kullanıcı kararıyla ilk 10 dersle sınırlıdır; ölçüm derslerinde UNI-T cihazları ve fiziksel problar kullanılır; tüm yeni/zenginleştirilen öğretici sayfaları rich-reference-v1 standardını izler: ayarlı güç kaynağı görseli, devrenin amacı, eleman görevleri, ölçüm yöntemi, bağlantı nedeni ve beklenen sonuç tek bakışta anlaşılır; düzen zengin fakat sıkışık değildir; DC derslerinde ayarlanabilir 0–30 VDC masa kaynağı işlevsel beslemedir, AC/3-faz/pil derslerinde yanlış elektriksel besleme olarak kullanılmaz; Ohm, Seri Devre Analizi, Paralel Devre Analizi, Karışık Devre Analizi ve Kirchhoff devre kontrolü kabul kilitleri korunur; wattmetre ve güç faktörü derslerinde enerji analizörü kabul kilidi korunur; pil seri/paralel derslerinin kabul kilitleri korunur.'};
})(typeof window==='undefined'?globalThis:window);
