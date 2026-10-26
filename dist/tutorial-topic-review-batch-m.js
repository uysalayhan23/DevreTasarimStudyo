(function enhance(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._topicReviewBatchM)return;
const rules={
'motor-direct-power':['Motorun güç devresi, kumanda devresi ve koruma işlevleri ayrı değerlendirilir.','Kontaktör bobini motor koruması yerine geçer.','Her motor klemensi aynı amaçla kullanılır.'],
'installation-systems':['Faz anahtarlama, nötr dönüşü ve PE koruması farklı görevler üstlenir.','PE her durumda nötr olarak kullanılabilir.','Yük dönüş hattı gerekli değildir.'],
'sensor-analog-apps':['Sensörün giriş/çıkış ve besleme uçları modelinin terminal tanımıyla doğrulanır.','PNP ve NPN her zaman aynı bağlanır.','Sensör uçları gövde renginden belirlenir.'],
'workshop-safety-mechanics':['Riskler değerlendirilmeden enerjili veya hareketli gerçek donanımda deneme yapılmaz.','Koruma koşulları eğitimde gereksizdir.','Enerji durumu kontrol edilmez.'],
'electronic-component-basics':['Bileşenin uçları, görevi ve sınırları gerçek teknik tanımla karşılaştırılır.','Aynı gövdeli her parça aynı pin işlevindedir.','Kondansatör ve direnç aynıdır.'],
'electronic-switching':['Anahtarlama bileşeninin kumanda ve yük uçları ayrı işlevlerle incelenir.','Röle bobini doğrudan yük çıkışıdır.','NO ve NC aynı başlangıç durumundadır.'],
'oscillator-filter-apps':['Osilatör üretimi ve filtrenin frekansa bağlı aktarımı farklı işlevlerdir.','Her filtre kendi başına osilatördür.','Filtre davranışı frekansa bağlı değildir.'],
'panel-power-systems':['Güç, kumanda ve PE bağlantıları ayrı güvenlik/yerleşim koşullarıyla değerlendirilir.','PE normal yük akımının dönüşüdür.','Terminal yerleşimi kontrol edilmez.'],
'plc-hardware-programming':['PLC girişleri durum algılar; çıkışları uygun yük veya sürücüye kumanda eder.','Her PLC girişi bir güç çıkışıdır.','PLC adresleri programda önemsizdir.'],
'opamp-apps':['İşlemsel yükselteç çıkışı besleme, giriş ve geri besleme ilişkisine bağlıdır.','İşlemsel yükselteç çıkışı sınırsızdır.','Artı ve eksi girişler daima aynıdır.'],
'digital-logic-apps':['Kapı çıkışı, girişler ve doğruluk tablosuyla belirlenir.','AND ile OR her zaman aynı sonucu verir.','Girişler çıkışı etkileyemez.'],
'motor-start-speed':['Yol verme ve hız kontrolü motorun ve sürücünün sınırlarına göre seçilir.','Motor etiketi önemli değildir.','Motor hızı yalnız buton sayısıyla belirlenir.'],
'installation-grounding':['PE koruma içindir; normal dönüş iletkeni olarak kullanılmaz.','PE daima faz yerine geçer.','Eşpotansiyel bağlantı motoru hızlandırır.'],
'digital-sequential-apps':['Ardışıl devrelerde saklanan durum veya saat işareti çıkışı etkileyebilir.','Ardışıl devre durum saklayamaz.','Flip-flop kombinasyonel kapıyla her zaman aynıdır.'],
'microcontroller-apps':['Giriş/çıkış ve besleme pinleri gerilim sınırı ve ortak referansla incelenir.','Her GPIO sınırsız güç verir.','Ortak referans gereksizdir.'],
'vfd-servo-control':['Frekans sürücüsü ile geri beslemeli servo kontrolü farklı görevler üstlenebilir.','Servo geri beslemesi her zaman gereksizdir.','Motor ve sürücü sınırları kontrol edilmez.'],
'motor-braking':['Frenleme yöntemi yük enerjisi ve motor/sürücü sınırlarıyla değerlendirilir.','Motor her zaman anında durur.','Frenleme enerji dönüşümüyle ilişkisizdir.'],
'motor-special':['Özel motorların terminal ve sürme koşulları kendi modeline göre belirlenir.','Her motorun pinleri lamba ile aynıdır.','Motor türü sürücüyü etkilemez.'],
'circuit-simulation-pcb':['Şema, net listesi ve PCB izlerinin elektriksel bağlantıları tutarlı olmalıdır.','PCB izi şemadan tamamen bağımsızdır.','Yalnız görünüm kısa devre testidir.'],
'motor-sequence':['Sıralı kumandada ön koşullar ve kilitlemeler ayrı sınanır.','Zıt iki kontaktörün eşzamanlı çalışması daima uygundur.','Aşamaların geri bildirimle ilişkisi yoktur.'],
'number-systems':['Taban dönüşümü, sayı değerini ve basamak ağırlıklarını korur.','Her tabanın basamak ağırlığı aynıdır.','Dönüşüm sayı değerini rastgele değiştirir.']
};
const generic=new Set(['Bu derste ekrandaki malzemeler neden özellikle seçildi?','Motor dersinde yük olarak hangi eleman gösterilmelidir?','Bu derste incelenen eleman türü hangisidir?','Bu derste sinyal işleme için merkezde hangi eleman bulunur?','PLC dersinde elektriksel karar/lojik işlemi yapan temel cihaz hangisidir?','PE koruma iletkeninin temel görevi nedir?','Motor hızını frekans değiştirerek kontrol eden cihaz hangisidir?','Servo sisteminde motor hareketini kontrollü yapan ana ikili hangisidir?','Paralel kollarda ortak olan büyüklük hangisidir?']);
/* MQ07_TOPIC_REVIEW_11: eleven circuit-specific sensor questions are deliberately preserved. */
const sourceSpecificSensorIds=new Set([
 'sensor-analog-apps-src-02','sensor-analog-apps-src-03','sensor-analog-apps-src-04',
 'sensor-analog-apps-src-05','sensor-analog-apps-src-06','sensor-analog-apps-src-07',
 'sensor-analog-apps-src-08','sensor-analog-apps-src-09','sensor-analog-apps-src-10',
 'sensor-analog-apps-src-13','sensor-analog-apps-src-14'
]);
const seen=new Set(),stats={version:'topic-review-m1',scanned:0,replaced:0,richUntouched:0,keptNonGeneric:0,sourceSpecificPreserved:0,missingRules:[],byTopic:{}};
for(const lesson of L.lessons){
 if(lesson.designStandard==='rich-reference-v1'){stats.richUntouched++;continue}
 stats.scanned++;
 if(!generic.has(lesson.quiz?.question)){
  stats.keptNonGeneric++;
  if(sourceSpecificSensorIds.has(lesson.id)){
   const q=lesson.quiz;
   if(lesson.topicId!=='sensor-analog-apps'||!q||!q.question||!Array.isArray(q.options)||q.options.length<3||q.answer!==0||!q.why)
    throw Error('Source-specific sensor quiz requires manual review: '+lesson.id);
   lesson.topicReview={version:stats.version,scope:'source-specific-quiz-preserved',sourceLesson:lesson.id,
    sourceQuestionPreserved:true,simulationAcceptance:false,visualAcceptance:false,sourceCircuitPreserved:true};
   stats.sourceSpecificPreserved++;
  }
  continue;
 }
 const options=rules[lesson.topicId];if(!options){stats.missingRules.push(lesson.id);continue}
 const title=String(lesson.title||lesson.topic||lesson.id).trim();
 let question='“'+title+'” konusunda hangi temel teknik ilke doğrudur?';
 if(seen.has(question))question='“'+title+'” ('+lesson.id+') konusunda hangi teknik ilke doğrudur?';
 seen.add(question);
 lesson.quiz={question,options:[...options],answer:0,why:'İlgili temel ilke: '+options[0]+' Bu soru bir fiziksel testin veya özgün kaynak ayrıntılarının yerine geçmez.'};
 lesson.topicReview={version:stats.version,scope:'topic-check-only-not-rich-acceptance',sourceLesson:lesson.id,simulationAcceptance:false,visualAcceptance:false,sourceCircuitPreserved:true};
 stats.replaced++;stats.byTopic[lesson.topicId]=(stats.byTopic[lesson.topicId]||0)+1;
}
if(stats.sourceSpecificPreserved!==sourceSpecificSensorIds.size||stats.sourceSpecificPreserved!==11)
 throw Error('Source-specific sensor topic-review coverage changed: '+stats.sourceSpecificPreserved);

/* SC469 / SC642: source-level physical repairs; not pedagogy-only acceptance. */
const backfillClone=o=>JSON.parse(JSON.stringify(o));
const physical469=L.lessons[468];
if(physical469?.id==='digital-logic-apps-outline-016'&&physical469.kind==='quiz'&&
 physical469.project?.components?.length===5&&physical469.project?.wires?.length===0&&
 physical469.pedagogyReview?.titleTopologyIssue==='NO_COMMAND_TEST_CONTROL_WIRING'&&
 physical469.pedagogyReview?.independentPedagogicalAcceptance!==true){
 const p=physical469.project,get=id=>p.components.find(c=>c.id===id);
 if([['pg0','arduino-bench-supply'],['pg1','push-no'],['pg2','push-nc'],
     ['pg3','coil-relay'],['pg4','lamp-green']].every(([id,type])=>get(id)?.typeId===type)){
  const prev=physical469.pedagogyReview.titleTopologyIssue;
  for(const [id,ref] of [['pg0','G1'],['pg1','S1'],['pg2','S0'],['pg3','K1'],['pg4','H1']])get(id).ref=ref;
  get('pg0').dcVoltage=24;
  const add=(id,typeId,ref,label,x,y)=>({id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:''});
  p.components.push(add('hold','contact-no','K1','K1 yardımcı mühürleme NO',345,380));
  p.components.push(add('load','contact-no','K1','K1 lamba yük NO',820,410));
  const graph=[
   ['pg0','P','pg2','21','24 V sanal kaynak STOP NC girişine gelir.'],
   ['pg2','22','pg1','13','STOP sonrası START yolu hazırlanır.'],
   ['pg2','22','hold','13','Mühürleme STOP üzerinden beslenir.'],
   ['pg1','14','pg3','A1','START ilk K1 bobin enerjisini verir.'],
   ['hold','14','pg3','A1','K1 yardımcı kontak START bırakıldığında bobini tutar.'],
   ['pg3','A2','pg0','M','K1 bobini 0 V referansa döner.'],
   ['pg0','P','load','13','K1 yük kontağı ayrı pozitif kaynağı alır.'],
   ['load','14','pg4','X1','K1 yük kontağı çekince lamba beslenir.'],
   ['pg4','X2','pg0','M','Lamba 0 V hattına döner.']
  ];
  p.wires=graph.map(([a,ap,b,bp,why],i)=>({
    id:'sc469-repair-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
    color:[5,8].includes(i)?'#111827':i===7?'#43a047':'#8b5a2b',
    role:[5,8].includes(i)?'0V':i===7?'SIGNAL':'DC+',size:'1.5',points:[],
    tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
  }));
  delete p.referenceOnly;p.tutorialLesson.phase='demo';p.tutorialLesson.step=0;
  physical469.kind='wiring';
  physical469.steps=p.wires.map(w=>({from:backfillClone(w.from),to:backfillClone(w.to),
   hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
  physical469.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,
   why:c.id==='pg0'?'Yalnız sanal 24 V DC besleme sağlar.':
    c.id==='pg1'?'İlk başlatma komutunu veren NO butondur.':
    c.id==='pg2'?'STOP basılınca kumandayı kesen NC butondur.':
    c.id==='pg3'?'Röle bobini aynı K1 referansındaki kontakları değiştirir.':
    c.id==='pg4'?'Yük devresinin durumunu sanal lambayla gösterir.':
    c.id==='hold'?'START bırakılınca bobini tutan K1 yardımcı NO kontağıdır.':
    'K1 çektiğinde lambayı besleyen NO güç yolu kontağıdır.'}));
  physical469.quiz={question:'START bırakıldığında lamba neden yanmaya devam eder?',
    options:['K1 yardımcı NO kontağı bobini mühürler.','STOP kendiliğinden açılır.','K1 bobini artık enerji istemez.'],
    answer:0,why:'START sadece ilk enerjiyi verir; K1 NO kontağı tutar. STOP veya kopuk hat ikisini de keser.'};
  const review=physical469.pedagogyReview;
  review.preRepairTitleTopologyIssue=prev;
  review.titleTopologyIssue='WINDOWS_3D_PHYSICAL_ACCEPTANCE_PENDING';
  review.titleTopologyStatus='REVIEW';
  review.nativeDynamicAcceptance=true;review.physicalAcceptance=false;
  review.windowsVisualAcceptance=false;review.independentPedagogicalAcceptance=false;
  review.componentIds=p.components.map(c=>c.typeId);
  review.sc469PhysicalRepair='SC469-START-STOP-RELAY-NATIVE-V1';
  if(physical469.topicReview){physical469.topicReview.simulationAcceptance=true;
    physical469.topicReview.sourceCircuitPreserved=false}
 }
}
const physical642=L.lessons[641];
if(physical642?.id==='motor-direct-power-outline-031'&&physical642.kind==='wiring'&&
 physical642.project?.wires?.length===13&&physical642.project?.components?.length===7&&
 physical642.project.components.some(c=>c.id==='main'&&c.typeId==='main-contact')&&
 physical642.pedagogyReview?.independentPedagogicalAcceptance!==true){
 const p=physical642.project;
 const make=(id,typeId,ref,label,x,y,extra={})=>({
  id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',...extra
 });
 p.components=[
  make('g1','supply-3p','G1','Sanal üç faz + PE',80,180),
  make('sw','packet-reversing-3p','S1','İleri / 0 / Geri paket şalteri',480,220,{position:0}),
  make('motor','motor-3p','M1','Üç fazlı asenkron motor',860,280)
 ];
 const graph=[
  ['g1','L1','sw','L1','L1 fazı paket şalter girişine gelir.'],
  ['g1','L2','sw','L2','L2 fazı paket şalter girişine gelir.'],
  ['g1','L3','sw','L3','L3 fazı paket şalter girişine gelir.'],
  ['sw','U','motor','U','Seçilen U fazı motora gider.'],
  ['sw','V','motor','V','Seçilen V fazı motora gider.'],
  ['sw','W','motor','W','Seçilen W fazı motora gider.'],
  ['g1','PE','motor','PE','Koruma iletkeni motor gövdesine bağlı kalır.']
 ];
 p.wires=graph.map(([a,ap,b,bp,why],i)=>({
  id:'sc642-repair-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:i===6?'#16a34a':['#e53935','#f97316','#f4c430'][i%3],
  role:i===6?'PE':['L1','L2','L3'][i%3],size:'2.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
 }));
 delete p.referenceOnly;p.tutorialLesson.phase='demo';p.tutorialLesson.step=0;
 physical642.steps=p.wires.map(w=>({from:backfillClone(w.from),to:backfillClone(w.to),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 physical642.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,
  why:c.id==='sw'?'0 kapalı, 1 ileri, 2 geri; faz sırasını sanal modelde değiştirir.':
  c.id==='motor'?'Faz sırasına göre ileri ve geri sanal dönüşü gözlemle.':
  'Yalnız sanal üç faz + PE kaynağıdır.'}));
 physical642.quiz={question:'İleri ve geri paket şalter konumları motoru nasıl ters çevirir?',
  options:['İki fazın motora geliş sırasını değiştirir.','Koruma iletkenini keser.','Motor hızını rastgele artırır.'],
  answer:0,why:'Sanal şalter 1 durumunda dönüş +1, 2 durumunda −1, 0 konumunda durma üretir.'};
 const review=physical642.pedagogyReview;
 review.preRepairTitleTopologyIssue='REVERSING_TITLE_HAS_ONE_FORWARD_CONTACTOR';
 review.titleTopologyStatus='REVIEW';
 review.titleTopologyIssue='WINDOWS_3D_PHYSICAL_ACCEPTANCE_PENDING';
 review.nativeDynamicAcceptance=true;review.physicalAcceptance=false;
 review.windowsVisualAcceptance=false;review.independentPedagogicalAcceptance=false;
 review.componentIds=p.components.map(c=>c.typeId);
 review.sc642PacketRepairNative='SC642-PACKET-REVERSE-NATIVE-V1';
 if(physical642.topicReview){physical642.topicReview.simulationAcceptance=true;
  physical642.topicReview.sourceCircuitPreserved=false}
}


/* SC644 repair: physical single-phase motor with separately connected main
   U/N and auxiliary Z1/Z2 winding pins, native-tested in virtual simulator. */
const repaired644=L.lessons[643];
if(repaired644?.id==='motor-special-outline-009'&&repaired644.kind==='wiring'&&
 repaired644.project?.wires?.length===30&&repaired644.project?.components?.length===15&&
 repaired644.project.components.some(c=>c.id==='motor'&&c.typeId==='motor-3p')&&
 repaired644.pedagogyReview?.independentPedagogicalAcceptance!==true){
 const p=repaired644.project;
 const description={
 g1:'Yalnız sanal tek faz beslemesidir; gerçek şebeke deneyi değildir.',
 stop:'STOP basılınca kumanda bırakır.',
 start:'Bobine ilk komutu verir.',
 coil:'K1 yardımcı ve yük kontaklarını kumanda eder.',
 hold:'START bırakılınca K1 bobinini tutan NO kontaktır.',
 power:'Motor yükü doğrudan butona değil K1 kontağına bağlıdır.',
 motor:'Ana U/N ve yardımcı Z1/Z2 uçlarının bağlantısını öğretir; gerçek kalkış kondansatörü veya santrifüj anahtarı modellenmemiştir.'
 };
 const parts=[["g1","supply-1p","G1","Sanal tek faz + N + PE","90","180"],["stop","push-nc","S0","STOP NC","300","65"],["start","push-no","S1","START NO","470","65"],["coil","coil-contactor","K1","K1 kumanda bobini","660","85"],["hold","contact-no","K1","K1 mühürleme NO","470","260"],["power","contact-no","K1","K1 motor yük NO","660","400"],["motor","motor-1p","M1","Ana/yardımcı sargılı sanal motor","920","365"]];
 const edges=[["g1","L","stop","21","Sanal kumanda fazı STOP'a gelir"],["stop","22","start","13","STOP sonrası START girişine ulaşır"],["start","14","coil","A1","START bobini besler"],["coil","A2","g1","N","Kumanda bobininin dönüşü"],["stop","22","hold","13","Mühürleme STOP üzerinden çalışır"],["hold","14","coil","A1","K1 kontağı bobini tutar"],["g1","L","power","13","K1 yük kontağına sanal faz"],["power","14","motor","U","Motorun ana sargısına komutlu faz"],["g1","N","motor","N","Motor ana sargı dönüşü"],["motor","U","motor","Z1","Yardımcı sargının sanal faz eşlemesi"],["motor","N","motor","Z2","Yardımcı sargının sanal nötr eşlemesi"],["g1","PE","motor","PE","Koruma PE ayrı kalır"]];
 p.components=parts.map(([id,typeId,ref,label,x,y])=>({
 id,typeId,ref,label,x:Number(x),y:Number(y),rotation:0,state:false,
 address:'',note:'',...(id==='motor'?{windingConnection:'external'}:{})
 }));
 p.wires=edges.map(([a,ap,b,bp,why],i)=>({
  id:'sc644-aux-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:i===11?'#16a34a':[3,8,10].includes(i)?'#1e88e5':'#b45309',
  role:i===11?'PE':[3,8,10].includes(i)?'N':'L',
  size:i>=6?'2.5':'1.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
 }));
 delete p.referenceOnly;
 if(p.tutorialLesson){p.tutorialLesson.phase='demo';p.tutorialLesson.step=0}
 repaired644.steps=p.wires.map(w=>({
 from:backfillClone(w.from),to:backfillClone(w.to),
 hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size
 }));
 repaired644.materials=p.components.map(c=>({
 componentId:c.id,typeId:c.typeId,label:c.label,why:description[c.id]
 }));
 repaired644.quiz={
 question:'Sanal yardımcı sargının bir ucu koparsa kalkış modeli ne yapar?',
 options:['Motor etkinleşmez.','Motor üç fazlı olur.','PE çalışma sargısına dönüşür.'],
 answer:0,why:'Native model hem U/N hem de Z1/Z2 bağlantısının varlığını arar.'
 };
 const review=repaired644.pedagogyReview;
 review.preRepairTitleTopologyIssue='SINGLE_PHASE_AUX_WINDING_TITLE_HAS_THREE_PHASE_MOTOR';
 review.titleTopologyStatus='REVIEW';
 review.titleTopologyIssue='SINGLE_PHASE_HARDWARE_DETAILS_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
 review.nativeDynamicAcceptance=true;
 review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
 review.independentPedagogicalAcceptance=false;
 review.componentIds=p.components.map(c=>c.typeId);
 review.sc644Native='SC644-MOTOR-1P-AUX-WINDING-NATIVE-V1';
 if(repaired644.topicReview){repaired644.topicReview.simulationAcceptance=true;
  repaired644.topicReview.sourceCircuitPreserved=false}
}


/* SC648: replace misleading contactor-only graph with independently actuated
   auxiliary relay/lamp and power contactor/motor, native verified. */
const sc648=L.lessons[647];
if(sc648?.id==='motor-direct-power-outline-034'&&sc648.kind==='wiring'&&
 sc648.project?.wires?.length===13&&sc648.project?.components?.length===7&&
 sc648.project.components.some(c=>c.id==='motor'&&c.typeId==='motor-3p')&&
 sc648.pedagogyReview?.independentPedagogicalAcceptance!==true){
 const p=sc648.project,parts=[["g1","supply-3p","G1","Sanal üç faz + N + PE",80,190],["stopR","push-nc","SR","Röle STOP NC",270,65],["startR","push-no","S1","Röle START NO",440,65],["coilR","coil-relay","K2","Yardımcı röle bobini",650,65],["holdR","contact-no","K2","Röle mühürleme NO",440,220],["loadR","contact-no","K2","Röle lamba kontağı",650,215],["lamp","lamp-green","H1","K2 kontrol lambası",870,215],["stopK","push-nc","SK","Kontaktör STOP NC",270,370],["startK","push-no","S2","Kontaktör START NO",440,370],["coilK","coil-contactor","K1","Kontaktör bobini",650,370],["holdK","contact-no","K1","Kontaktör mühürleme NO",440,510],["mainK","main-contact","K1","K1 üç kutuplu ana kontak",740,550],["motor","motor-y-d","M1","Sanal üç fazlı motor (yıldız uçları)",980,550]],links=[["g1","L1","stopR","21","Röle STOP giriş fazı"],["stopR","22","startR","13","Röle START hattı"],["startR","14","coilR","A1","K2 bobinine ilk komut"],["coilR","A2","g1","N","K2 bobin dönüşü"],["stopR","22","holdR","13","K2 mühürleme girişi"],["holdR","14","coilR","A1","K2 mühürleme dönüşü"],["g1","L1","loadR","13","Röle lamba kontak beslemesi"],["loadR","14","lamp","X1","K2 çektiğinde lamba beslenir"],["lamp","X2","g1","N","Lamba nötr dönüşü"],["g1","L1","stopK","21","Kontaktör STOP giriş fazı"],["stopK","22","startK","13","Kontaktör START hattı"],["startK","14","coilK","A1","K1 bobinine ilk komut"],["coilK","A2","g1","N","K1 bobin dönüşü"],["stopK","22","holdK","13","K1 mühürleme girişi"],["holdK","14","coilK","A1","K1 mühürleme dönüşü"],["g1","L1","mainK","1","K1 birinci güç fazı"],["g1","L2","mainK","3","K1 ikinci güç fazı"],["g1","L3","mainK","5","K1 üçüncü güç fazı"],["mainK","2","motor","U1","K1 ana kontak birinci motor ucu"],["mainK","4","motor","V1","K1 ana kontak ikinci motor ucu"],["mainK","6","motor","W1","K1 ana kontak üçüncü motor ucu"],["g1","PE","motor","PE","Motor gövdesinin koruma iletkeni"]];
 p.components=parts.map(([id,typeId,ref,label,x,y])=>({
  id,typeId,ref,label,x,y,rotation:0,state:false,address:'',note:'',
  ...(id==='motor'?{motorConnection:'star'}:{})
 }));
 p.wires=links.map(([a,ap,b,bp,why],i)=>({
  id:'sc648-compare-'+(i+1),from:{c:a,p:ap},to:{c:b,p:bp},
  color:i===21?'#16a34a':[3,8,12].includes(i)?'#1e88e5':'#a16207',
  role:i===21?'PE':[3,8,12].includes(i)?'N':i>=15?'POWER':'CONTROL',
  size:i>=15?'2.5':'1.5',points:[],
  tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why
 }));
 delete p.referenceOnly;
 if(p.tutorialLesson){p.tutorialLesson.phase='demo';p.tutorialLesson.step=0}
 sc648.steps=p.wires.map(w=>({
  from:backfillClone(w.from),to:backfillClone(w.to),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size
 }));
 const roles={
 g1:'Yalnız sanal üç faz ve nötr kaynağıdır; fiziksel kurulum değildir.',
 stopR:'Sanal röle kumandasını keser.',startR:'Yardımcı röleye başlangıç komutu verir.',
 coilR:'K2 bobini yalnız H1 lamba kolundaki yardımcı kontakları kumanda eder.',
 holdR:'K2 rölesinin yardımcı mühürleme kontağıdır.',
 loadR:'H1 lambasını açıp kapatan K2 yardımcı kontağıdır.',
 lamp:'Röle kumandasının durumunu gösterir.',
 stopK:'Kontaktör kumandasını keser.',startK:'K1 bobinine başlangıç komutu verir.',
 coilK:'K1 ana kontaklarını çektiren bobindir.',
 holdK:'K1 yardımcı mühürleme kontağıdır.',
 mainK:'Motorun üç ayrı güç fazını anahtarlayan üç kutuplu kontaktördür.',
 motor:'K1 kontaktörü ile kumanda edilen sanal üç fazlı motordur.'
 };
 sc648.materials=p.components.map(c=>({
  componentId:c.id,typeId:c.typeId,label:c.label,why:roles[c.id]
 }));
 sc648.quiz={
 question:'Yalnız K2 röle START komutu etkinleşirse hangi sanal yük çalışır?',
 options:['H1 lambası çalışır, M1 motoru çalışmaz.','M1 motoru çalışır.','PE kontağı kapanır.'],
 answer:0,
 why:'K2 bobini sadece lamba kontağını; ayrı K1 kontaktörü motorun güç kontaklarını kontrol eder.'
 };
 const review=sc648.pedagogyReview;
 review.preRepairTitleTopologyIssue='RELAY_CONTACTOR_COMPARISON_HAS_ONLY_CONTACTOR';
 review.titleTopologyStatus='REVIEW';
 review.titleTopologyIssue='RELAY_CONTACTOR_3D_PHYSICAL_ACCEPTANCE_PENDING';
 review.nativeDynamicAcceptance=true;review.physicalAcceptance=false;
 review.windowsVisualAcceptance=false;review.independentPedagogicalAcceptance=false;
 review.componentIds=p.components.map(c=>c.typeId);
 review.sc648ComparisonNative='SC648-INDEPENDENT-RELAY-CONTACTOR-NATIVE-V1';
 if(sc648.topicReview){sc648.topicReview.simulationAcceptance=true;
  sc648.topicReview.sourceCircuitPreserved=false}
}


/* SC431: genuine TLP521 input/output and probe-tipped DC measurement,
   reusing the existing verified isolated virtual SC429 graph. */
const sc431=L.lessons[430],sc429=L.lessons[428];
if(sc431?.id==='electronic-switching-outline-059'&&sc431.kind==='quiz'&&
 sc431.project?.wires?.length===0&&sc431.project?.components?.length===2&&
 sc431.project.components[0]?.typeId==='arduino-tlp521-1'&&
 sc431.pedagogyReview?.titleTopologyIssue==='NO_TLP521_HEALTH_PROBE_RESULT'&&
 sc431.pedagogyReview?.independentPedagogicalAcceptance!==true&&
 sc429?.id==='electronic-switching-outline-057'&&
 sc429.project?.wires?.length===7&&sc429.project?.components?.length===6&&
 sc429.project.components.some(c=>c.id==='u1'&&c.typeId==='arduino-tlp521-1'&&c.mq07OptoVirtual===true)){
 const old=sc431.project,p=backfillClone(sc429.project);
 p.projectId=old.projectId;
 p.tutorialLesson={...old.tutorialLesson,phase:'demo',step:0};
 p.components.push({
  id:'v1',typeId:'unit-ut33d-plus',ref:'V1',label:'UNI-T DCV optokuplör çıkışı',
  x:715,y:430,rotation:0,state:false,address:'',note:'',meterPosition:4
 },{
  id:'v1-red',typeId:'test-probe-red',ref:'PRV1',label:'Kırmızı DCV probu',
  x:665,y:515,rotation:0,state:false,address:'',note:'',
  probeTarget:{c:'u1',p:'4'}
 },{
  id:'v1-black',typeId:'test-probe-black',ref:'PBV1',label:'Siyah DCV probu',
  x:825,y:515,rotation:0,state:false,address:'',note:'',
  probeTarget:{c:'u1',p:'3'}
 });
 for(const [id,a,ap,b,bp,label] of [
  ['sc431-vprobe','v1','V','v1-red','PLUG','DCV kırmızı ölçüm ucu bağlanır.'],
  ['sc431-comprobe','v1','COM','v1-black','PLUG','DCV siyah referans probu bağlanır.']
 ]){
  p.wires.push({id,from:{c:a,p:ap},to:{c:b,p:bp},
   color:id==='sc431-vprobe'?'#c2410c':'#111827',role:'MEASUREMENT',
   size:'0.75',points:[],tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:label});
 }
 sc431.project=p;sc431.kind='wiring';
 sc431.steps=p.wires.map(w=>({
  from:backfillClone(w.from),to:backfillClone(w.to),
  hint:w.tutorialHint||'Sanal ölçüm bağlantısı',why:w.tutorialWhy||
   'İki elektriksel bölge bağlantı yapılmadan birbirinden yalıtılmıştır.',
  color:w.color||'#64748b',role:w.role||'SIGNAL',size:w.size||'1'
 }));
 sc431.materials=p.components.map(c=>({
  componentId:c.id,typeId:c.typeId,label:c.label,
  why:c.id==='g1'?'LED girişini bağımsız 5 V ile besler.':
    c.id==='g2'?'Fototransistör çıkışının ayrı 5 V sanal kaynağıdır.':
    c.id==='u1'?'TLP521-1 pin 1/2 LED, pin 4/3 C/E; optik aktarım ve elektriksel yalıtım sağlar.':
    c.id==='sg'?'Sanal sağlamlık kontrolünde LED girişine komut verir.':
    c.id==='rin'?'Giriş LED akımını sınırlar.':
    c.id==='rout'?'Çıkış transistorunun yükünü oluşturur.':
    c.id==='v1'?'Kollektör-emiter yönünde DCV okuma kademesi için sanal ölçü aleti.':
    'Probu seçilen fototransistör terminaline yöneltir.'
 }));
 sc431.quiz={
  question:'Sağlam sanal TLP521-1 giriş LED’i tetiklenince kolektörün sanal DCV değeri nasıl değişir?',
  options:['Yaklaşık 5 V’dan 0,2 V’a düşer.','İki beslemenin eksi uçları birleşir.','Hiç değişmeden 5 V kalır.'],
  answer:0,why:'Yerel native optik aktarım modelinde çıkış iletime geçer; LED kopukluğu ve izolasyon köprüsü ayrı negatif kontroldür.'
 };
 const review=sc431.pedagogyReview;
 review.preRepairTitleTopologyIssue='NO_TLP521_HEALTH_PROBE_RESULT';
 review.titleTopologyStatus='REVIEW';
 review.titleTopologyIssue='TLP521_METER_DISPLAY_AND_WINDOWS_3D_ACCEPTANCE_PENDING';
 review.sourceReusedFrom='electronic-switching-outline-057';
 review.nativeDynamicAcceptance=true;
 review.meterDisplayAcceptance=false;
 review.isolationAcceptance=true;
 review.physicalAcceptance=false;
 review.windowsVisualAcceptance=false;
 review.independentPedagogicalAcceptance=false;
 review.componentIds=p.components.map(c=>c.typeId);
 review.sc431OptoNative='SC431-TLP521-DCV-ISOLATION-NATIVE-V1';
 if(sc431.topicReview){sc431.topicReview.simulationAcceptance=true;
  sc431.topicReview.sourceCircuitPreserved=false}
}


/* SC440 actual virtual unpowered NTC resistance check: connect both
   UT33D+ ohmmeter probe tips to canonical sensor 1/2 terminals. */
const sc440=L.lessons[439];
if(sc440?.id==='electronic-component-basics-outline-024'&&
 sc440.kind==='quiz'&&sc440.project?.wires?.length===2&&
 sc440.project.components?.length===4&&
 sc440.project.components[0]?.typeId==='sensor-ntc'&&
 sc440.project.components[1]?.typeId==='unit-ut33d-plus'&&
 sc440.pedagogyReview?.titleTopologyIssue==='NO_THERMISTOR_PROBE_SENSOR_CONTACT'&&
 sc440.pedagogyReview?.independentPedagogicalAcceptance!==true){
 const p=sc440.project,read=c=>p.components.find(x=>x.id===c);
 if(read('pg0')&&read('pg1')&&read('pg1-red')&&read('pg1-black')){
  read('pg0').temperatureC=25;
  read('pg1').meterPosition=16; // UT33D+ 20 kΩ range
  read('pg1-red').probeTarget={c:'pg0',p:'1'};
  read('pg1-black').probeTarget={c:'pg0',p:'2'};
  p.sc440NtcOhms='SC440-NTC-OHMMETER-V1';
  p.tutorialLesson={...(p.tutorialLesson||{}),id:sc440.id};
  p.wires.push(
   {id:'sc440-ntc-red',from:{c:'pg1-red',p:'TIP'},to:{c:'pg0',p:'1'},
    color:'#d32f2f',role:'MEASUREMENT',size:'0.75',points:[],
    tutorialHint:'Kırmızı prob TIP → NTC 1',
    tutorialWhy:'Enerjisiz NTC sensörünün ilk ucuna temas eden gerçek ölçüm bağlantısı.'},
   {id:'sc440-ntc-black',from:{c:'pg1-black',p:'TIP'},to:{c:'pg0',p:'2'},
    color:'#111827',role:'MEASUREMENT',size:'0.75',points:[],
    tutorialHint:'Siyah prob TIP → NTC 2',
    tutorialWhy:'İkinci NTC ucu ile ohmmetre COM dönüşünü tamamlar.'}
  );
  sc440.kind='wiring';
  sc440.steps=p.wires.map(w=>({
    from:JSON.parse(JSON.stringify(w.from)),to:JSON.parse(JSON.stringify(w.to)),
    hint:w.tutorialHint||'Sanal NTC ölçüm bağlantısı',
    why:w.tutorialWhy||'Enerjisiz sensörün direnci ölçülür.',
    color:w.color||'#64748b',role:w.role||'SIGNAL',size:w.size||'1'
  }));
  sc440.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,
    why:c.id==='pg0'?'Sıcaklık artınca direnci düşen 10 kΩ (25 °C) NTC modeli.':
     c.id==='pg1'?'Yalnız enerjisiz NTC üzerinde 20 kΩ ohmmetre kademesi.':
     'Fiziksel ölçüm temasını temsil eden sanal prob.'}));
  sc440.quiz={question:'Sanal NTC 25 °C’den 45 °C’ye ısıtıldığında ohmmetrede ne olur?',
    options:['Direnç azalır.','Direnç artar.','Ölçüm hep 10 kΩ kalır.'],
    answer:0,why:'Beta modelinde sıcaklık artışı NTC direncini düşürür; probu sökme ve yanlış kademe ayrı negatif testtir.'};
  const review=sc440.pedagogyReview;
  review.preRepairTitleTopologyIssue='NO_THERMISTOR_PROBE_SENSOR_CONTACT';
  review.titleTopologyStatus='REVIEW';
  review.titleTopologyIssue='SC440_NTC_NATIVE_OK_WINDOWS_3D_PENDING';
  review.nativeDynamicAcceptance=true;
  review.sensorCalibrationAcceptance=false;
  review.physicalAcceptance=false;review.windowsVisualAcceptance=false;
  review.independentPedagogicalAcceptance=false;
  review.componentIds=p.components.map(c=>c.typeId);
  review.sc440NtcNative='SC440-NTC-OHMMETER-V1';
 }
}


// SC424–425: real probe-to-triac terminal links and a bounded, unpowered
// virtual continuity/diode study. Neither reading certifies a physical TRIAC.
for(const [sc,oldIssue,redPin,blackPin,position,tag] of [
 [424,'NO_TRIAC_MULTIMETER_HEALTH_MEASUREMENT','MT1','MT2',14,'SC424-TRIAC-UNPOWERED-AVO-V1'],
 [425,'NO_TRIAC_MULTIMETER_PIN_IDENTIFICATION','G','MT1',13,'SC425-TRIAC-UNPOWERED-PINS-V1']
]){
 const l=L.lessons[sc-1],p=l?.project;
 if(l?.id!=='electronic-switching-outline-'+String(sc-372).padStart(3,'0')||
    l.kind!=='quiz'||p?.wires?.length!==0||p.components?.length!==2||
    p.components[0].typeId!=='bta16-600b-triac'||
    p.components[1].typeId!=='unit-ut33d-plus'||
    l.pedagogyReview?.titleTopologyIssue!==oldIssue||
    l.pedagogyReview?.independentPedagogicalAcceptance===true)continue;
 const meter=p.components[1];meter.meterPosition=position;
 const red={id:'pg1-red',typeId:'test-probe-red',x:170,y:340,rotation:0,ref:'PRX2',
  label:'Kırmızı sanal AVOmetre ölçüm probu',probeTarget:{c:'pg0',p:redPin}};
 const black={id:'pg1-black',typeId:'test-probe-black',x:470,y:340,rotation:0,ref:'PBX2',
  label:'Siyah sanal AVOmetre ölçüm probu',probeTarget:{c:'pg0',p:blackPin}};
 p.components.push(red,black);
 p.virtualTriacAvo=tag;p.tutorialLesson={...(p.tutorialLesson||{}),id:l.id,phase:'demo'};
 for(const [id,a,ap,b,bp,why] of [
  ['sc42-avo-red-plug','pg1','V','pg1-red','PLUG','Kırmızı probu VΩ yuvasına tak.'],
  ['sc42-avo-black-plug','pg1','COM','pg1-black','PLUG','Siyah probu COM yuvasına tak.'],
  ['sc42-avo-red-tip','pg1-red','TIP','pg0',redPin,'Kırmızı prob '+redPin+' terminaline temas eder.'],
  ['sc42-avo-black-tip','pg1-black','TIP','pg0',blackPin,'Siyah prob '+blackPin+' terminaline temas eder.']
 ]){
  p.wires.push({id,from:{c:a,p:ap},to:{c:b,p:bp},
   color:id.includes('red')?'#dc2626':'#111827',role:'MEASUREMENT',size:'0.75',points:[],
   tutorialHint:a+'/'+ap+' → '+b+'/'+bp,tutorialWhy:why});
 }
 l.kind='wiring';
 l.steps=p.wires.map(w=>({from:JSON.parse(JSON.stringify(w.from)),to:JSON.parse(JSON.stringify(w.to)),
  hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}));
 l.materials=p.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label,
  why:c.id==='pg0'?'BTA16-600B gerçek katalog MT1/MT2/G terminal kimlikleri.':
      c.id==='pg1'?'Enerjisiz sanal direnç/diyot ölçüm kademesi.':
      'Sanal ölçüm cihazından eleman terminaline fiziksel temas bağlantısı.'}));
 l.quiz=sc===424?
  {question:'Enerjisiz sanal MT1–MT2 ölçümünde OL görülmesi tek başına neyi kanıtlamaz?',
   options:['Triyakın bütün çalışma koşullarında sağlam olduğunu.','MT1 ile MT2 arasında bu ölçümde düşük direnç bulunmadığını.','Prob uçlarının kabloyla bağlı olduğunu.'],
   answer:0,why:'Bu sanal test yalnız belirgin MT1–MT2 kısa devresini ayırt eder; kapı tetiklemesi ayrıca sınanmalıdır.'}:
  {question:'BTA16-600B ön görünüşünde üretici pin sırası hangi işlevlerdir?',
   options:['MT1 – MT2 – G','G – MT2 – MT1','MT1 – G – MT2'],
   answer:0,why:'Üretici katalog pin sırası kullanılır. Sanal diyot kademesi G–MT1 temasını öğretir; gerçek 3D geometrisi ayrıca bekler.'};
 l.pedagogyReview.preRepairTitleTopologyIssue=oldIssue;
 l.pedagogyReview.titleTopologyIssue=sc===424?'SC424_VIRTUAL_SHORT_SCREEN_ONLY_WINDOWS_3D_PENDING':
  'SC425_VIRTUAL_GATE_PIN_MODEL_WINDOWS_3D_PENDING';
 l.pedagogyReview.titleTopologyStatus='REVIEW';
 l.pedagogyReview.nativeDynamicAcceptance=true;
 l.pedagogyReview.physicalAcceptance=false;
 l.pedagogyReview.windowsVisualAcceptance=false;
 l.pedagogyReview.independentPedagogicalAcceptance=false;
 l.pedagogyReview.manufacturerGeometryAccepted=false;
 l.pedagogyReview.componentIds=p.components.map(c=>c.typeId);
 l.pedagogyReview.virtualTriacAvo=tag;
}

L.topicReviewBatchM=stats;L._topicReviewBatchM=true;
})(typeof window==='undefined'?globalThis:window);
