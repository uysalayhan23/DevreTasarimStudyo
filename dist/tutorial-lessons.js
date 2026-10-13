(function(root){
'use strict';
const clone=v=>JSON.parse(JSON.stringify(v));
const C=(id,typeId,x,y,ref,label,extra={})=>({id,typeId,x,y,rotation:0,ref,label:label||ref,state:false,address:'',note:'',...extra});
let wi=0;
const W=(a,ap,b,bp,hint,why,color='#8b5a2b',role='CONTROL',size='1.5')=>({id:'tw'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},color,role,size,points:[],tutorialHint:hint,tutorialWhy:why});
const base=(id,name,mode='control',norm='IEC')=>({version:7,workspaceMode:mode,projectId:'tutorial-'+id,name,symbolNorm:norm,preferredAppearance:'material',components:[],wires:[],junctions:[],colorRoles:{'#e53935':'L1','#1e88e5':'N','#8b5a2b':'+24V','#111827':'0V','#43a047':'SIGNAL','#7c3aed':'SIGNAL','#f9a825':'CONTROL'}});
const dc=(p,x=90,y=170,ref='G1')=>p.components.push(C(ref.toLowerCase(),'supply-dc-plus',x,y,ref,'24 VDC besleme'));
const ac=(p,x=90,y=170,ref='G1')=>p.components.push(C(ref.toLowerCase(),'supply-1p',x,y,ref,'1 Faz 230 VAC'));
const finish=(p,meta)=>({...meta,project:p,steps:p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint,why:w.tutorialWhy,color:w.color,role:w.role,size:w.size}))});
const levels=[
 {key:'guided',name:'1 · Rehberli',help:'Her bağlantıda iki terminal birlikte yanıp söner; açıklama ayrıntılıdır.'},
 {key:'practice',name:'2 · Uygulama',help:'Terminal ipuçları korunur; açıklama daha kısa tutulur.'},
 {key:'challenge',name:'3 · Pekiştirme',help:'Bağlantı sırası verilir; nedenini öğrencinin düşünmesi beklenir.'},
 {key:'mastery',name:'4 · Ustalık',help:'En az ipucu ile aynı ilkeyi farklı bir düzen üzerinde kurarsınız.'}
];
const meta=(topicId,topic,group,summary,concepts)=>({topicId,topic,group,summary,concepts});
const topics=[
 meta('button-led','Buton ile LED / lamba yakma','Temel Kumanda','NO butonla LED’i yakmayı ve NC butonla yanan LED’i söndürmeyi; seri devre ve doğru akım sınırlamayı öğretir.',['NO / NC buton','24 VDC','LED akım sınırlama direnci','seri devre']),
 meta('button-relay','Buton ile röle çektirme','Temel Kumanda','Butonla doğrudan yük sürmek yerine röle bobini enerjilendirmeyi öğretir.',['röle bobini','A1/A2','kontrol devresi']),
 meta('seal-in','Röle ile mühürleme','Temel Kumanda','Anlık başlatma komutunun yardımcı kontakla nasıl hafızaya alındığını öğretir.',['mühürleme','yardımcı kontak','bobin']),
 meta('timer-flipflop','Zaman rölesi ile flip-flop ışık','Temel Kumanda','Zaman rölesi / flaşör kontağıyla iki lambanın dönüşümlü davranışını gösterir.',['zaman rölesi','NO/NC','periyodik çalışma']),
 meta('commutator','Komütatör anahtarla iki lamba','Tesisat','İki bağımsız anahtar kontağıyla iki yükün birlikte veya ayrı kontrolünü öğretir.',['komütatör','iki kutup','aydınlatma']),
 meta('two-way','Vaviyen anahtar kullanımı','Tesisat','Bir lambayı iki farklı noktadan kumanda etmeyi öğretir.',['vaviyen','gezgin iletken','ortak uç']),
 meta('intermediate','Vaviyen + ara vaviyen','Tesisat','Bir lambayı üç veya daha fazla noktadan kumanda etmenin temelini öğretir.',['ara vaviyen','çaprazlama','gezgin iletken']),
 meta('bells','1 / 2 / 3 butonlu zil devreleri','Tesisat','Bir veya birden fazla çağırma butonunun aynı zili nasıl çalıştırdığını öğretir.',['paralel buton','zil','faz dönüşü']),
 meta('control-combinations','Kumanda devresi kombinasyonları','Temel Kumanda','Kütüphane elemanlarını gerçek kumanda mantıklarında birlikte kullanmayı öğretir.',['seri/paralel','röle','kontaktör','sinyal']),
 meta('loop-420','4–20 mA loop','Analog / Enstrümantasyon','Akım döngüsünün besleme, transmitter ve ölçüm elemanı üzerinden tek seri yol oluşturduğunu öğretir.',['4–20 mA','seri loop','transmitter','alıcı']),
 meta('loop-powered','Loop powered nedir?','Analog / Enstrümantasyon','İki telli transmitterin hem enerjisini hem sinyalini aynı iki iletkenden almasını öğretir.',['2 telli transmitter','loop power','burden']),
 meta('active-passive','Aktif ve pasif bağlantı','Analog / Enstrümantasyon','Akımı hangi cihazın sağladığını ayırt etmeyi ve iki aktif kaynağı yanlışlıkla karşı karşıya bağlamamayı öğretir.',['aktif çıkış','pasif giriş','harici besleme']),
 meta('pnp-npn','PNP ve NPN sensör','Sensörler','PNP sensörün akımı yüke verdiğini, NPN sensörün yük akımını 0 V tarafına çektiğini öğretir.',['PNP sourcing','NPN sinking','BN/BU/BK']),
 meta('inductive-capacitive','Endüktif ve kapasitif sensör','Sensörler','Metal algılayan endüktif sensör ile dielektrik değişimine duyarlı kapasitif sensörü karşılaştırır.',['endüktif','kapasitif','algılama prensibi']),
 meta('source-sink','Sourcing ve sinking','Sensörler','Sinyal kaynağı ve alıcının akım yönü bakımından birbirini nasıl tamamladığını öğretir.',['source','sink','common']),
 meta('open-collector','Open Collector çıkış','Sensörler','Transistör kolektörünün harici besleme/pull-up ile bir lojik veya yük devresini nasıl anahtarladığını öğretir.',['open collector','pull-up','NPN']),
 meta('bero','BERO sensör','Sensörler','Siemens terminolojisindeki BERO endüktif yaklaşımını ve temassız metal algılama kullanımını öğretir.',['BERO','indüktif yaklaşım','temassız anahtarlama']),
 meta('motor-forward-reverse','Motor ileri / geri kontaktör kumandası','Motor Kumanda','Üç fazlı motorun iki kontaktör, mühürleme ve çapraz elektriksel kilitleme ile güvenli biçimde iki yönde çalıştırılmasını öğretir.',['ileri geri','kontaktör','mühürleme','elektriksel kilitleme','faz sırası']),
 meta('motor-star-delta','Motor yıldız / üçgen yol verme','Motor Kumanda','Altı uçlu üç fazlı motorun yıldızda düşük kalkış akımıyla başlatılıp zaman rölesiyle üçgene geçirilmesini öğretir.',['yıldız üçgen','zaman rölesi','kontaktör kilitleme','altı uçlu motor']),
 meta('dual-dc','İki farklı DC güç kaynağı aynı devrede','Güç / Referans','İki DC kaynağın izole, ortak 0 V veya röle izolasyonlu kullanımını öğretir.',['ortak referans','izolasyon','ground loop'])
];
const T=Object.fromEntries(topics.map(t=>[t.topicId,t]));
function lampCircuit(v){
 wi=0;
 if(v===0||v===1){
  const normallyClosed=v===1,p=base('button-led-'+v,normallyClosed?'24 VDC NC buton ile LED söndürme':'24 VDC NO buton ile LED yakma');dc(p);
  p.components.push(C('b',normallyClosed?'push-nc':'push-no',350,220,'S1',normallyClosed?'NC söndürme butonu':'NO yakma butonu'),C('r','resistor',590,210,'R1','2.7 kΩ LED akım sınırlama direnci',{resistance:2700,rotation:270}),C('l','led',850,220,'H1','Yeşil LED'));
  if(normallyClosed)p.wires.push(W('g1','P','b','21','+24 V → NC buton 21','NC kontağa basılmadığında kapalı olan yol üzerinden pozitif besleme gelir.'),W('b','22','r','1','NC buton 22 → R1/1','Butona basınca NC kontak açılır ve LED akımı kesilir.'),W('r','2','l','A','R1/2 → LED anot','2.7 kΩ direnç 24 V kaynaktan LED’e giden akımı sınırlar.'),W('l','K','g1','M','LED katot → 0 V','LED’in 0 V dönüşünü tamamlar.','#111827','0V'));
  else p.wires.push(W('g1','P','b','13','+24 V → NO buton 13','Pozitif besleme NO butonun girişine gelir.'),W('b','14','r','1','NO buton 14 → R1/1','Butona basınca NO kontak kapanır ve LED akım yolu tamamlanır.'),W('r','2','l','A','R1/2 → LED anot','2.7 kΩ direnç 24 V kaynaktan LED’e giden akımı sınırlar.'),W('l','K','g1','M','LED katot → 0 V','LED’in 0 V dönüşünü tamamlar.','#111827','0V'));
  return p;
 }
 const originalVariant=v>=2?v-1:v;
 if(v===4){
  const p=base('button-led-'+v,'Buton + LED · Arduino giriş/çıkış','arduino');
  p.components.push(C('ps','arduino-bench-supply',70,250,'G1','Ayarlı DC güç kaynağı',{dcVoltage:5}),C('uno','arduino-uno',300,250,'ARD1','Arduino UNO',{arduinoSketch:'void setup(){pinMode(2,INPUT);pinMode(13,OUTPUT);}\nvoid loop(){digitalWrite(13,digitalRead(2));delay(5);}'}),C('btn','arduino-button',760,180,'S1','Buton modülü'),C('r','resistor',650,450,'R1','220 Ω LED akım sınırlama direnci',{resistance:220}),C('led','arduino-led',820,450,'H1','LED'));
  p.wires.push(W('ps','P','btn','VCC','Ayarlı kaynak +5 V → buton VCC','Ayarlı güç kaynağı buton modülünü 5 V ile besler.','#b57b40','DC+'),W('ps','M','btn','GND','Ayarlı kaynak 0 V → buton GND','Butonun besleme dönüşünü tamamlar.','#111827','0V'),W('ps','P','uno','5V','Kaynak +5 V → UNO 5V','Arduino UNO’nun beslemesini açıkça sağlar.','#b57b40','DC+'),W('ps','M','uno','GND','Kaynak 0 V → UNO GND','Harici kaynak ile Arduino girişinin ortak referansını kurar.','#111827','0V'),W('btn','SIG','uno','D2','Buton SIG → UNO D2','D2 buton modülünün sinyalini okur.','#43a047','SIGNAL'),W('uno','D13','r','1','UNO D13 → R1/1','D13 çıkışı LED akımını 220 Ω seri direnç üzerinden sınırlar.','#43a047','SIGNAL'),W('r','2','led','A','R1/2 → LED anot','Seri direnç LED akımını sınırlar.','#43a047','SIGNAL'),W('led','K','uno','GND2','LED katot → UNO GND','LED akımının dönüş yolunu tamamlar.','#111827','0V'));
  return p;
 }
 const p=base('button-led-'+v,'Buton ile '+(originalVariant===1?'230 V lamba':'24 V sinyal lambası'),originalVariant===1?'building':'control',originalVariant===1?'TSE':'IEC');
 if(originalVariant===1){ac(p);p.components.push(C('b','wall-switch',360,220,'S1','Adi anahtar'),C('l','ceiling-light',680,220,'H1','Tavan armatürü'));p.wires.push(W('g1','L','b','13','L → anahtar 13','Faz önce anahtara girer.','#e53935','L1'),W('b','14','l','X1','Anahtar 14 → lamba X1','Anahtar kapanınca faz lambaya ulaşır.','#e53935','L1'),W('l','X2','g1','N','Lamba X2 → N','Nötr dönüş yolu devreyi tamamlar.','#1e88e5','N'));return p}
 dc(p);p.components.push(C('b','push-no',360,220,'S1','Başlat butonu'),C('l','lamp-red',680,220,'H1','Kırmızı ikaz lambası'));p.wires.push(W('g1','P','b','13','+24 V → buton 13','Butonun girişine pozitif besleme gelir.'),W('b','14','l','X1','Buton 14 → ikaz lambası X1','Butona basınca enerji ikaz lambasına aktarılır.'),W('l','X2','g1','M','Lamba X2 → 0 V','Akımın 0 V dönüş yolunu tamamlar.','#111827','0V'));return p;
}
function relayCircuit(v){
 wi=0;if(v===3){const p=base('button-relay-'+v,'Arduino buton ile röle modülü','arduino');p.components.push(C('ps','arduino-bench-supply',70,250,'G1','Ayarlı 5 V kaynak',{dcVoltage:5}),C('uno','arduino-uno',300,250,'ARD1','Arduino UNO',{arduinoSketch:'void setup(){pinMode(2,INPUT);pinMode(8,OUTPUT);}\nvoid loop(){digitalWrite(8,digitalRead(2));delay(5);}'}),C('b','arduino-button',720,160,'S1','Buton modülü'),C('k','arduino-relay-1ch',760,430,'K1','5 V röle modülü'));p.wires.push(W('ps','P','b','VCC','Ayarlı +5 V → buton VCC','Buton modülü harici ayarlı kaynaktan beslenir.','#b57b40','DC+'),W('ps','M','b','GND','Kaynak 0 V → buton GND','Butonun dönüş yoludur.','#111827','0V'),W('ps','P','k','VCC','Ayarlı +5 V → röle VCC','Röle modülünün bobin/lojik beslemesidir.','#b57b40','DC+'),W('ps','M','k','GND','Kaynak 0 V → röle GND','Röle modülünün dönüş yoludur.','#111827','0V'),W('ps','P','uno','5V','Kaynak +5 V → UNO 5V','Arduino UNO’nun beslemesini açıkça sağlar.','#b57b40','DC+'),W('ps','M','uno','GND','Kaynak 0 V → UNO GND','Arduino ve harici modüller ortak referans kullanır.','#111827','0V'),W('b','SIG','uno','D2','Buton SIG → UNO D2','Arduino buton durumunu D2 üzerinden okur.','#43a047','SIGNAL'),W('uno','D8','k','SIG','UNO D8 → röle SIG','Program D8 seviyesini değiştirerek röleyi çektirir.','#43a047','SIGNAL'));return p}
 const p=base('button-relay-'+v,'Buton ile '+(v===2?'kontaktör':'röle')+' çektirme');dc(p);const coil=v===2?'coil-contactor':'coil-relay';p.components.push(C('b','push-no',350,220,'S1','Anlık başlat'),C('k',coil,680,220,'K1',v===2?'Kontaktör bobini':'Röle bobini'));p.wires.push(W('g1','P','b','13','+24 V → S1/13','Kontrol enerjisini butona getirir.'),W('b','14','k','A1','S1/14 → K1/A1','Butona basınca bobin A1 enerjilenir.'),W('k','A2','g1','M','K1/A2 → 0 V','Bobin akımının dönüş yoludur.','#111827','0V'));if(v===1||v===3){p.components.push(C('h','lamp-green',980,220,'H1','Röle aktif lambası'),C('q','contact-no',820,420,'K1','K1 NO yardımcı'));p.wires.push(W('g1','P','q','13','+24 V → K1/13','Röle çektiğinde kullanılacak kontak beslenir.'),W('q','14','h','X1','K1/14 → H1/X1','K1 çekince NO kontak kapanıp lambayı besler.'),W('h','X2','g1','M','H1/X2 → 0 V','Lamba dönüş hattını tamamlar.','#111827','0V'))}return p;
}
function sealCircuit(v){
 wi=0;const p=base('seal-'+v,'Mühürleme · '+(v===0?'temel Start/Stop':v===1?'Start/Stop + sinyal lambası':v===2?'Start/Stop pekiştirme':'kontaktörlü Start/Stop'));dc(p);
 const coil=v===3?'coil-contactor':'coil-relay';
 p.components.push(C('stop','push-nc',210,340,'S0','Durdur'),C('start','push-no',420,250,'S1','Başlat'),C('hold','contact-no',420,460,'K1','K1 mühürleme kontağı'),C('coil',coil,780,340,'K1','K1 bobini'));
 p.wires.push(
  W('g1','P','stop','21','+24 V → STOP/21','Mühürlemeli devrede ilk eleman mutlaka durdurma zinciridir; STOP basılınca tüm tutma yolu kesilir.'),
  W('stop','22','start','13','STOP/22 → START/13','Normalde kapalı STOP üzerinden anlık START butonuna enerji gelir.'),
  W('stop','22','hold','13','STOP/22 → K1/13','Mühürleme kolu da STOP sonrasından beslenir; böylece STOP hem START hem tutma yolunu aynı anda keser.'),
  W('start','14','coil','A1','START/14 → K1/A1','START basıldığında bobin ilk kez enerjilenir.'),
  W('hold','14','coil','A1','K1/14 → K1/A1','Bobin çekince yardımcı NO kontak kapanır ve START bırakıldıktan sonra bobini tutar.'),
  W('coil','A2','g1','M','K1/A2 → 0 V','Bobin akımının 0 V dönüş yoludur.','#111827','0V')
 );
 if(v===1){
  p.components.push(C('h','lamp-green',1060,340,'H1','Mühürleme aktif'));
  p.wires.push(W('coil','A1','h','X1','K1/A1 hattı → H1/X1','Mühürleme aktifken durum lambası da kontrol gerilimini görür.'),W('h','X2','g1','M','H1/X2 → 0 V','Sinyal lambası dönüşüdür.','#111827','0V'));
 }
 return p;
}
function flasherCircuit(v){
 wi=0;const p=base('timer-flipflop-'+v,'Zaman rölesi ile dönüşümlü iki lamba');dc(p);p.components.push(C('t','coil-flasher',350,280,'KT1','Flaşör / zaman rölesi',{flashOn:v===1?500:v===2?1500:1000,flashOff:v===1?1500:v===2?500:1000}),C('no','contact-no',610,190,'KT1','KT1 NO'),C('nc','contact-nc',610,430,'KT1','KT1 NC'),C('g','lamp-green',920,190,'H1','Yeşil'),C('r','lamp-red',920,430,'H2','Kırmızı'));p.wires.push(W('g1','P','t','A1','+24 V → KT1/A1','Zaman rölesini sürekli besler.'),W('t','A2','g1','M','KT1/A2 → 0 V','Zaman rölesi dönüşüdür.','#111827','0V'),W('g1','P','no','13','+24 V → KT1 NO/13','NO çıkış kolunu besler.'),W('no','14','g','X1','KT1 NO/14 → H1/X1','Flaşörün ON evresinde yeşil lamba yanar.'),W('g','X2','g1','M','H1/X2 → 0 V','Yeşil lamba dönüşüdür.','#111827','0V'),W('g1','P','nc','21','+24 V → KT1 NC/21','NC çıkış kolunu besler.'),W('nc','22','r','X1','KT1 NC/22 → H2/X1','Diğer evrede kırmızı lamba yanar.'),W('r','X2','g1','M','H2/X2 → 0 V','Kırmızı lamba dönüşüdür.','#111827','0V'));return p;
}
function commutatorCircuit(v){
 wi=0;const p=base('commutator-'+v,'Komütatör ile iki lamba','building','TSE');ac(p);p.components.push(C('s','wall-commutator',360,220,'S1','Komütatör'),C('h1',v%2?'led-luminaire':'ceiling-light',700,140,'H1','Lamba 1'),C('h2',v%2?'ceiling-light':'lampholder-e27',700,420,'H2','Lamba 2'));p.wires.push(W('g1','L','s','1','L → S1/1','Birinci komütatör kutbunun faz girişidir.','#e53935','L1'),W('g1','L','s','3','L → S1/3','İkinci kutbun faz girişidir.','#e53935','L1'),W('s','2','h1','X1','S1/2 → H1/X1','Birinci kontak birinci lambayı anahtarlar.','#e53935','L1'),W('s','4','h2','X1','S1/4 → H2/X1','İkinci kontak ikinci lambayı anahtarlar.','#e53935','L1'),W('h1','X2','g1','N','H1/X2 → N','Birinci lambanın nötr dönüşüdür.','#1e88e5','N'),W('h2','X2','g1','N','H2/X2 → N','İkinci lambanın nötr dönüşüdür.','#1e88e5','N'));return p;
}
function twoWayCircuit(v,intermediate=false){
 wi=0;const id=intermediate?'intermediate':'two-way',p=base(id+'-'+v,(intermediate?'Ara vaviyenli':'Vaviyen')+' aydınlatma','building','TSE');ac(p);p.components.push(C('s1','wall-vavien',330,220,'S1','Vaviyen 1'));if(intermediate)p.components.push(C('sx','wall-intermediate',560,220,'S2','Ara vaviyen'));p.components.push(C('s2','wall-vavien',intermediate?800:650,220,intermediate?'S3':'S2','Vaviyen '+(intermediate?'2':'2')),C('h',v%2?'lampholder-e27':'ceiling-light',intermediate?1050:930,220,'H1','Aydınlatma'));
 p.wires.push(W('g1','L','s1','11','L → ilk vaviyen/11','Faz ilk vaviyenin ortak ucuna gelir.','#e53935','L1'));
 if(intermediate){p.wires.push(W('s1','12','sx','1','S1/12 → ara/1','Birinci gezgin ara vaviyene gider.','#f9a825','CONTROL'),W('s1','14','sx','3','S1/14 → ara/3','İkinci gezgin ara vaviyene gider.','#7c3aed','CONTROL'),W('sx','2','s2','12','Ara/2 → S3/12','Ara vaviyenden çıkan birinci gezgin son vaviyene gider.','#f9a825','CONTROL'),W('sx','4','s2','14','Ara/4 → S3/14','Ara vaviyenden çıkan ikinci gezgin son vaviyene gider.','#7c3aed','CONTROL'))}else{p.wires.push(W('s1','12','s2','12','S1/12 → S2/12','Birinci gezgin iletken iki anahtarı bağlar.','#f9a825','CONTROL'),W('s1','14','s2','14','S1/14 → S2/14','İkinci gezgin iletken iki anahtarı bağlar.','#7c3aed','CONTROL'))}
 p.wires.push(W('s2','11','h','X1','Son vaviyen/11 → lamba X1','Son anahtarın ortak ucu lambaya anahtarlanan fazı taşır.','#e53935','L1'),W('h','X2','g1','N','Lamba X2 → N','Nötr doğrudan lambaya gider.','#1e88e5','N'));return p;
}
function bellCircuit(v){
 wi=0;const p=base('bells-'+v,(v+1)+' butonlu / çağırma zil devresi','building','TSE');ac(p);const count=Math.min(3,v+1);for(let i=0;i<count;i++)p.components.push(C('b'+i,'bell-push',300+i*180,180+i*100,'B'+(i+1),'Zil butonu '+(i+1)));p.components.push(C('z','bell-electronic',920,320,'Z1','Elektronik zil'));for(let i=0;i<count;i++){p.wires.push(W('g1','L','b'+i,'13','L → B'+(i+1)+'/13','Her zil butonu aynı fazdan beslenir.','#e53935','L1'),W('b'+i,'14','z','1','B'+(i+1)+'/14 → Z1/1','Butonlardan herhangi biri basılınca zilin faz girişi enerjilenir.','#e53935','L1'))}p.wires.push(W('z','2','g1','N','Z1/2 → N','Zilin nötr dönüşü ortak ve sabittir.','#1e88e5','N'));if(v===3){p.components.push(C('bl','bell-light-push',650,600,'B4','Işıklı çağırma'));p.wires.push(W('g1','L','bl','13','L → ışıklı buton/13','Ek çağırma butonunu fazdan besler.','#e53935','L1'),W('bl','14','z','1','Işıklı buton/14 → zil/1','Ek buton da aynı zil girişine paralel bağlanır.','#e53935','L1'))}return p;
}
function comboCircuit(v){
 wi=0;if(v===0)return sealCircuit(2);
 if(v===1){const p=relayCircuit(1);p.name='Röle kontağıyla sinyal lambası';return p}
 if(v===2){const p=base('combo-sensor','PNP sensör → röle → lamba');dc(p);p.components.push(C('s','proximity',350,220,'B1','PNP endüktif sensör'),C('k','coil-relay',650,220,'K1','Röle'),C('q','contact-no',840,400,'K1','Röle NO'),C('h','lamp-green',1080,400,'H1','Lamba'));p.wires.push(W('g1','P','s','BN','+24 V → sensör BN','Kahverengi sensör beslemesidir.'),W('s','BU','g1','M','Sensör BU → 0 V','Mavi sensör dönüşüdür.','#111827','0V'),W('s','BK','k','A1','Sensör BK → K1/A1','PNP çıkış algılamada bobine +24 V sağlar.','#43a047','SIGNAL'),W('k','A2','g1','M','K1/A2 → 0 V','Röle bobini dönüşüdür.','#111827','0V'),W('g1','P','q','13','+24 V → K1/13','Röle kontağı yük beslemesini taşır.'),W('q','14','h','X1','K1/14 → H1/X1','Röle çekince lamba yanar.'),W('h','X2','g1','M','H1/X2 → 0 V','Lamba dönüşüdür.','#111827','0V'));return p}
 const p=sealCircuit(3);p.projectId='tutorial-combo-contactor';p.name='Başlat-stop kontaktör ve sinyal';p.components.push(C('q','contact-no',930,430,'K1','Çalışma sinyali kontağı'),C('h','lamp-green',1120,430,'H1','Çalışıyor'));p.wires.push(W('g1','P','q','13','+24 V → K1/13','Kontaktör çekince çalışma sinyali kontağı kapanır.'),W('q','14','h','X1','K1/14 → H1/X1','Kontaktör çektiğinde lamba yanar.'),W('h','X2','g1','M','H1/X2 → 0 V','Sinyal lambasının dönüş yoludur.','#111827','0V'));return p;
}
function loopCircuit(v,kind='loop'){
 wi=0;const p=base(kind+'-'+v,kind==='loop'?'4–20 mA seri akım döngüsü':kind==='loop-powered'?'Loop powered iki telli transmitter':'Aktif / pasif analog bağlantı');dc(p);if(kind==='active-passive'&&v>=2){p.components.push(C('tx','converter-pressure',390,200,'U1','WAZ5 aktif dönüştürücü'),C('m','meter-ammeter',760,260,'P1','4–20 mA alıcı'));p.wires.push(W('g1','P','tx','10','+24 V → dönüştürücü 10','Aktif dönüştürücünün kendi beslemesini sağlar.'),W('tx','11','g1','M','Dönüştürücü 11 → 0 V','Cihaz besleme dönüşüdür.','#111827','0V'),W('tx','7','m','1','Aktif OUT+ 7 → alıcı +','Aktif çıkış loop akımını kendisi sürer.','#43a047','SIGNAL'),W('m','2','tx','8','Alıcı − → OUT− 8','Akım aktif çıkışa geri döner.','#43a047','SIGNAL'));return p}
 p.components.push(C('tx','converter-temperature',390,220,'B1','2 telli 4–20 mA transmitter'),C('m','meter-ammeter',760,220,'P1','Loop ampermetresi'));p.wires.push(W('g1','P','tx','2','+24 V → LOOP+ / 2','Loop beslemesi transmitterin pozitif ucuna girer.'),W('tx','1','m','1','LOOP− / 1 → ampermetre 1','Aynı akım transmitterden alıcıya seri akar.','#43a047','SIGNAL'),W('m','2','g1','M','Ampermetre 2 → 0 V','Seri döngü kaynağın 0 V ucunda kapanır.','#111827','0V'));if(v===1||v===3){p.components.push(C('r','resistor',980,220,'R1','250 Ω eğitim yükü',{resistance:250}));p.wires.pop();p.wires.push(W('m','2','r','1','Ampermetre 2 → 250 Ω','250 Ω yükte 4–20 mA yaklaşık 1–5 V oluşturur.','#43a047','SIGNAL'),W('r','2','g1','M','250 Ω → 0 V','Loop dönüşünü tamamlar.','#111827','0V'))}return p;
}
function sensorCircuit(v,topic){
 wi=0;const p=base(topic+'-'+v,T[topic].topic);dc(p);let sensor='proximity',pnp=true;
 if(topic==='pnp-npn'||topic==='source-sink'||topic==='open-collector'){pnp=v%2===0;sensor=pnp?'proximity':'autonics-pr12-npn'}
 else if(topic==='inductive-capacitive'){sensor=v%2===0?(v<2?'proximity':'sensor-inductive-4wire-pnp'):(v<2?'sensor-capacitive-npn':'sensor-capacitive-nc');pnp=!/npn/.test(sensor)}
 else if(topic==='bero'){sensor=v%2===0?'proximity':'sensor-inductive-4wire-pnp';pnp=true}
 p.components.push(C('s',sensor,390,220,'B1',pnp?'PNP sensör':'NPN sensör'),C('h','lamp-green',780,220,'H1','24 V gösterge'));p.wires.push(W('g1','P','s','BN','+24 V → BN','Kahverengi BN sensörün pozitif beslemesidir.'),W('s','BU','g1','M','BU → 0 V','Mavi BU sensörün 0 V beslemesidir.','#111827','0V'));
 if(pnp){p.wires.push(W('s','BK','h','X1','BK → yük X1','PNP/sourcing çıkış aktifken yükün girişine +24 V verir.','#43a047','SIGNAL'),W('h','X2','g1','M','Yük X2 → 0 V','PNP yükü çıkış ile 0 V arasındadır.','#111827','0V'))}
 else{p.wires.push(W('g1','P','h','X1','+24 V → yük X1','NPN devrede yük pozitif hatta bağlanır.'),W('h','X2','s','BK','Yük X2 → BK','NPN/open-collector çıkış aktifken akımı BK üzerinden 0 V tarafına çeker.','#43a047','SIGNAL'))}
 if(topic==='open-collector'&&(v===2||v===3)){
  const pullDown=v===2; // PNP sourcing needs a pull-down, NPN sinking a pull-up.
  p.components.push(C('r','resistor',780,430,'R1',pullDown?'10 kΩ pull-down direnci':'1 kΩ pull-up direnci',{resistance:pullDown?10000:1000}));
  p.wires.push(
   W('g1',pullDown?'M':'P','r','1',pullDown?'0 V → pull-down R1/1':'+24 V → pull-up R1/1',pullDown?'PNP BK çıkışını algılama yokken 0 V seviyesinde tutar.':'NPN BK çıkışını algılama yokken pozitif seviyede tutar.'),
   W('r','2','s','BK',pullDown?'Pull-down R1/2 → BK':'Pull-up R1/2 → BK',pullDown?'10 kΩ direnç PNP çıkış düğümünü 0 V tarafına referanslar; göstergeye bağımsız besleme taşımaz.':'NPN çıkış iletime geçtiğinde BK düğümünü 0 V tarafına çeker.','#43a047','SIGNAL')
  );
}
 return p;
}
function dualDcCircuit(v){
 wi=0;const p=base('dual-dc-'+v,'İki DC güç kaynağı · '+(v===0?'izole yükler':v===1?'ortak 0 V':v===2?'röle izolasyonu':'ortak referanslı sensör'));p.components.push(C('g1','supply-dc-plus',80,170,'G1','DC kaynak 1'),C('g2','supply-dc-plus',80,520,'G2','DC kaynak 2'));
 if(v===0){p.intentionalElectricalIslands=2;p.components.push(C('h1','lamp-green',520,150,'H1','Kaynak 1 yükü'),C('h2','lamp-red',520,500,'H2','Kaynak 2 yükü'));p.wires.push(W('g1','P','h1','X1','G1 + → H1','Birinci kaynak yalnız kendi yükünü besler.'),W('h1','X2','g1','M','H1 → G1 0 V','Birinci devre kendi dönüşünde kapanır.','#111827','0V'),W('g2','P','h2','X1','G2 + → H2','İkinci kaynak bağımsız yükü besler.'),W('h2','X2','g2','M','H2 → G2 0 V','İkinci devre kendi dönüşünde kapanır.','#111827','0V'))}
 else if(v===1){p.components.push(C('s','autonics-pr12-npn',480,220,'B1','G1 NPN sensörü'),C('h','lamp-green',850,220,'H1','G2 yükü'));p.wires.push(W('g1','M','g2','M','G1 0 V → G2 0 V','İki kaynağın sinyal referansı bilinçli olarak ortaklanır.','#111827','0V'),W('g1','P','s','BN','G1 + → sensör BN','Sensör birinci kaynaktan beslenir.'),W('s','BU','g1','M','Sensör BU → G1 0 V','Sensör besleme dönüşüdür.','#111827','0V'),W('g2','P','h','X1','G2 + → yük','Yük ikinci kaynaktan enerji alır.'),W('h','X2','s','BK','Yük → sensör BK','Ortak 0 V sayesinde sinyal devresi iki kaynağın referansını paylaşabilir.','#43a047','SIGNAL'))}
 else if(v===2){p.intentionalElectricalIslands=2;p.components.push(C('b','push-no',360,180,'S1','Kaynak 1 butonu'),C('k','coil-relay',620,180,'K1','İzolasyon rölesi'),C('q','contact-no',620,520,'K1','K1 kuru kontak'),C('h','lamp-red',900,520,'H1','Kaynak 2 yükü'));p.wires.push(W('g1','P','b','13','G1 + → S1','Birinci kaynak kontrol devresini besler.'),W('b','14','k','A1','S1 → K1/A1','Röle bobini yalnız G1 ile çalışır.'),W('k','A2','g1','M','K1/A2 → G1 0 V','G1 kontrol döngüsü kapanır.','#111827','0V'),W('g2','P','q','13','G2 + → K1 kuru kontak','Röle kontağı iki beslemeyi galvanik olarak ayırır.'),W('q','14','h','X1','K1 → G2 yük','Kontak kapanınca ikinci kaynak yükü sürer.'),W('h','X2','g2','M','Yük → G2 0 V','G2 güç döngüsü kendi dönüşünde kapanır.','#111827','0V'))}
 else{p.components.push(C('s','autonics-pr12-npn',470,260,'B1','NPN sensör'),C('h','lamp-green',850,260,'H1','İkinci kaynak yükü'));p.wires.push(W('g1','M','g2','M','G1 0 V → G2 0 V','Sinyal aktarımı için ortak referans oluşturur.','#111827','0V'),W('g1','P','s','BN','G1 + → sensör BN','Sensör G1 ile beslenir.'),W('s','BU','g1','M','Sensör BU → ortak 0 V','Sensör dönüşü ortak referanstadır.','#111827','0V'),W('g2','P','h','X1','G2 + → yük X1','Yük enerjisi G2 kaynağından gelir.'),W('h','X2','s','BK','Yük X2 → NPN BK','NPN sensör ortak 0 V üzerinden G2 yük akımını sink eder.','#43a047','SIGNAL'))}
 return p;
}

function motorForwardReverseCircuit(v){
 wi=0;
 const p=base('motor-forward-reverse-'+v,'Motor ileri / geri · '+(v<2?'L1-L3 faz değişimi':'L1-L2 faz değişimi'));
 p.components.push(
  C('g1','supply-3p',70,120,'G1','3 Faz + N + PE besleme'),
  C('stop','push-nc',130,520,'S0','STOP · iki yönü de bırakır'),
  C('startF','push-no',360,390,'S1','İLERİ START'),
  C('holdF','contact-no',360,545,'K1','K1 ileri mühürleme'),
  C('lockR','contact-nc',590,470,'K2','K2 NC · ileri kilidi'),
  C('coilF','coil-contactor',820,470,'K1','İleri kontaktör bobini'),
  C('startR','push-no',360,720,'S2','GERİ START'),
  C('holdR','contact-no',360,875,'K2','K2 geri mühürleme'),
  C('lockF','contact-nc',590,800,'K1','K1 NC · geri kilidi'),
  C('coilR','coil-contactor',820,800,'K2','Geri kontaktör bobini'),
  C('mainF','main-contact',1030,230,'K1','İleri güç kontaktörü'),
  C('mainR','main-contact',1030,560,'K2','Geri güç kontaktörü'),
  C('motor','motor-3p',1320,400,'M1','3 Faz asenkron motor')
 );
 p.wires.push(
  W('g1','L1','stop','21','L1 → STOP/21','STOP butonu her iki yönün kumanda beslemesinin en başındadır.','#e53935','L1'),
  W('stop','22','lockR','21','STOP/22 → K2 NC/21','İleri komutu, geri kontaktörün NC elektriksel kilidinden geçer.','#e53935','L1'),
  W('lockR','22','startF','13','K2 NC/22 → İLERİ START/13','K2 bırakmışsa ileri başlatma yolu hazırdır.','#e53935','L1'),
  W('lockR','22','holdF','13','K2 NC/22 → K1 mühürleme/13','İleri mühürleme kolu da aynı çapraz kilidin arkasındadır.','#e53935','L1'),
  W('startF','14','coilF','A1','İLERİ START/14 → K1/A1','İlk basışta K1 ileri kontaktörünü çektirir.','#e53935','L1'),
  W('holdF','14','coilF','A1','K1/14 → K1/A1','K1 yardımcı NO kapanınca START bırakıldıktan sonra ileri yön tutulur.','#e53935','L1'),
  W('stop','22','lockF','21','STOP/22 → K1 NC/21','Geri komutu, ileri kontaktörün NC elektriksel kilidinden geçer.','#e53935','L1'),
  W('lockF','22','startR','13','K1 NC/22 → GERİ START/13','K1 bırakmışsa geri başlatma yolu hazırdır.','#e53935','L1'),
  W('lockF','22','holdR','13','K1 NC/22 → K2 mühürleme/13','Geri mühürleme kolu da ileri kontaktörün NC kilidinin arkasındadır.','#e53935','L1'),
  W('startR','14','coilR','A1','GERİ START/14 → K2/A1','İlk basışta K2 geri kontaktörünü çektirir.','#e53935','L1'),
  W('holdR','14','coilR','A1','K2/14 → K2/A1','K2 yardımcı NO kapanınca geri yön mühürlenir.','#e53935','L1'),
  W('coilF','A2','g1','N','K1/A2 → N','İleri kontaktör bobininin nötr dönüşüdür.','#1e88e5','N'),
  W('coilR','A2','g1','N','K2/A2 → N','Geri kontaktör bobininin nötr dönüşüdür.','#1e88e5','N')
 );
 for(const [phase,pin,color] of [['L1','1','#e53935'],['L2','3','#f97316'],['L3','5','#f4c430']]){
  p.wires.push(
   W('g1',phase,'mainF',pin,phase+' → K1/'+pin,'İleri güç kontaktörüne '+phase+' fazını getirir.',color,phase,'2.5'),
   W('g1',phase,'mainR',pin,phase+' → K2/'+pin,'Geri güç kontaktörüne '+phase+' fazını getirir.',color,phase,'2.5')
  );
 }
 p.wires.push(
  W('mainF','2','motor','U','K1/2 → M1/U','İleri yönde L1 motorun U ucuna gider.','#e53935','L1','2.5'),
  W('mainF','4','motor','V','K1/4 → M1/V','İleri yönde L2 motorun V ucuna gider.','#f97316','L2','2.5'),
  W('mainF','6','motor','W','K1/6 → M1/W','İleri yönde L3 motorun W ucuna gider.','#f4c430','L3','2.5')
 );
 if(v<2){
  p.wires.push(
   W('mainR','2','motor','W','K2/2 → M1/W','Geri yönde L1 ile L3 yer değiştirir; L1 W ucuna gider.','#e53935','L1','2.5'),
   W('mainR','4','motor','V','K2/4 → M1/V','L2 geri yönde de V ucunda kalır.','#f97316','L2','2.5'),
   W('mainR','6','motor','U','K2/6 → M1/U','Geri yönde L3 U ucuna taşınır.','#f4c430','L3','2.5')
  );
 }else{
  p.wires.push(
   W('mainR','2','motor','V','K2/2 → M1/V','Bu uygulamada L1 ile L2 yer değiştirir; L1 V ucuna gider.','#e53935','L1','2.5'),
   W('mainR','4','motor','U','K2/4 → M1/U','L2 U ucuna taşınır ve faz sırası tersine döner.','#f97316','L2','2.5'),
   W('mainR','6','motor','W','K2/6 → M1/W','L3 W ucunda kalır.','#f4c430','L3','2.5')
  );
 }
 p.wires.push(W('g1','PE','motor','PE','PE → M1/PE','Motor gövdesi koruma iletkenine bağlanır.','#16a34a','PE','2.5'));
 if(v===1||v===3){
  p.components.push(C('lampF','lamp-green',1110,900,'H1','İleri yön aktif'),C('lampR','lamp-red',1320,900,'H2','Geri yön aktif'));
  p.wires.push(
   W('coilF','A1','lampF','X1','K1/A1 → H1/X1','K1 çektiğinde ileri yön lambası yanar.','#43a047','SIGNAL'),
   W('lampF','X2','g1','N','H1/X2 → N','İleri yön lambasının nötr dönüşüdür.','#1e88e5','N'),
   W('coilR','A1','lampR','X1','K2/A1 → H2/X1','K2 çektiğinde geri yön lambası yanar.','#43a047','SIGNAL'),
   W('lampR','X2','g1','N','H2/X2 → N','Geri yön lambasının nötr dönüşüdür.','#1e88e5','N')
  );
 }
 return p;
}
function motorStarDeltaCircuit(v){
 wi=0;
 if(v===0){
  const p=base('motor-star-delta-0','Manuel yıldız / üçgen paket şalter');
  p.components.push(C('g1','supply-3p',110,100,'G1','3 Faz + PE besleme'),C('sw','packet-star-delta',430,210,'S1','0 · YILDIZ · ÜÇGEN paket şalter'),C('motor','motor-y-d',900,470,'M1','Altı uçlu yıldız-üçgen motor',{motorConnection:'external',windingConnection:'external'}));
  p.wires.push(
   W('g1','L1','sw','L1','L1 → paket/L1','Paket şalterin birinci faz girişidir.','#e53935','L1','2.5'),
   W('g1','L2','sw','L2','L2 → paket/L2','Paket şalterin ikinci faz girişidir.','#f97316','L2','2.5'),
   W('g1','L3','sw','L3','L3 → paket/L3','Paket şalterin üçüncü faz girişidir.','#f4c430','L3','2.5'),
   W('sw','U1','motor','U1','Paket/U1 → M1/U1','Motorun U1 sargı başlangıcını paket şaltere bağlar.','#808080','CONTROL','2.5'),
   W('sw','V1','motor','V1','Paket/V1 → M1/V1','Motorun V1 sargı başlangıcını paket şaltere bağlar.','#808080','CONTROL','2.5'),
   W('sw','W1','motor','W1','Paket/W1 → M1/W1','Motorun W1 sargı başlangıcını paket şaltere bağlar.','#808080','CONTROL','2.5'),
   W('sw','U2','motor','U2','Paket/U2 → M1/U2','Motorun U2 sargı sonunu paket şaltere bağlar.','#808080','CONTROL','2.5'),
   W('sw','V2','motor','V2','Paket/V2 → M1/V2','Motorun V2 sargı sonunu paket şaltere bağlar.','#808080','CONTROL','2.5'),
   W('sw','W2','motor','W2','Paket/W2 → M1/W2','Motorun W2 sargı sonunu paket şaltere bağlar.','#808080','CONTROL','2.5'),
   W('g1','PE','motor','PE','PE → M1/PE','Motor gövdesinin koruma iletkenidir.','#16a34a','PE','2.5')
  );
  return p;
 }
 const delay=v===1?2:v===2?4:6;
 const p=base('motor-star-delta-'+v,'Otomatik yıldız / üçgen · '+delay+' s geçiş');
 p.components.push(
  C('g1','supply-3p',70,100,'G1','3 Faz + N + PE besleme'),
  C('stop','push-nc',120,620,'S0','STOP'),
  C('start','push-no',340,535,'S1','START'),
  C('hold','contact-no',340,690,'K1','K1 mühürleme'),
  C('coilMain','coil-contactor',590,610,'K1','Ana kontaktör bobini'),
  C('timer','coil-delay-on',820,610,'KT1','Yıldız-üçgen zaman rölesi',{delayValue:delay,delayUnit:'sec'}),
  C('timerNC','contact-nc',1020,520,'KT1','KT1 NC · yıldız süresi'),
  C('lockDelta','contact-nc',1220,520,'K3','K3 NC · yıldız kilidi'),
  C('coilStar','coil-contactor',1430,520,'K2','Yıldız kontaktörü'),
  C('timerNO','contact-no',1020,760,'KT1','KT1 NO · üçgen geçişi'),
  C('lockStar','contact-nc',1220,760,'K2','K2 NC · üçgen kilidi'),
  C('coilDelta','coil-contactor',1430,760,'K3','Üçgen kontaktörü'),
  C('main','main-contact',430,210,'K1','Ana güç kontaktörü'),
  C('star','main-contact',760,250,'K2','Yıldız güç kontaktörü'),
  C('delta','main-contact',1060,250,'K3','Üçgen güç kontaktörü'),
  C('motor','motor-y-d',1370,250,'M1','Altı uçlu asenkron motor',{motorConnection:'external',windingConnection:'external'})
 );
 p.wires.push(
  W('g1','L1','stop','21','L1 → STOP/21','Otomatik yol verme kumandası STOP ile başlar.','#e53935','L1'),
  W('stop','22','start','13','STOP/22 → START/13','START yolu normalde kapalı STOP sonrasından beslenir.','#e53935','L1'),
  W('stop','22','hold','13','STOP/22 → K1 mühürleme/13','Ana kontaktörün tutma kolu da STOP sonrasındadır.','#e53935','L1'),
  W('start','14','coilMain','A1','START/14 → K1/A1','START basılınca ana kontaktör K1 çeker.','#e53935','L1'),
  W('hold','14','coilMain','A1','K1/14 → K1/A1','K1 yardımcı NO, START bırakıldıktan sonra ana kontaktörü mühürler.','#e53935','L1'),
  W('coilMain','A2','g1','N','K1/A2 → N','Ana kontaktör bobininin nötr dönüşüdür.','#1e88e5','N'),
  W('coilMain','A1','timer','A1','K1/A1 → KT1/A1','Ana kontaktörle birlikte zaman rölesi saymaya başlar.','#e53935','L1'),
  W('timer','A2','g1','N','KT1/A2 → N','Zaman rölesinin nötr dönüşüdür.','#1e88e5','N'),
  W('coilMain','A1','timerNC','21','K1/A1 → KT1 NC/21','İlk anda kapalı zaman kontağı yıldız kolunu besler.','#e53935','L1'),
  W('timerNC','22','lockDelta','21','KT1 NC/22 → K3 NC/21','Yıldız bobini, üçgen kontaktörün NC kilidinden geçer.','#e53935','L1'),
  W('lockDelta','22','coilStar','A1','K3 NC/22 → K2/A1','K3 bırakmış ve süre dolmamışsa yıldız kontaktörü K2 çeker.','#e53935','L1'),
  W('coilStar','A2','g1','N','K2/A2 → N','Yıldız kontaktörü bobininin nötr dönüşüdür.','#1e88e5','N'),
  W('coilMain','A1','timerNO','13','K1/A1 → KT1 NO/13','Süre dolunca kapanacak kontak üçgen kolunun girişidir.','#e53935','L1'),
  W('timerNO','14','lockStar','21','KT1 NO/14 → K2 NC/21','Üçgen bobini, yıldız kontaktörünün NC kilidinden geçer.','#e53935','L1'),
  W('lockStar','22','coilDelta','A1','K2 NC/22 → K3/A1','Yıldız tamamen bıraktıktan sonra üçgen kontaktörü K3 çekebilir.','#e53935','L1'),
  W('coilDelta','A2','g1','N','K3/A2 → N','Üçgen kontaktörü bobininin nötr dönüşüdür.','#1e88e5','N'),
  W('g1','L1','main','1','L1 → K1/1','Ana kontaktörün L1 güç girişidir.','#e53935','L1','2.5'),
  W('g1','L2','main','3','L2 → K1/3','Ana kontaktörün L2 güç girişidir.','#f97316','L2','2.5'),
  W('g1','L3','main','5','L3 → K1/5','Ana kontaktörün L3 güç girişidir.','#f4c430','L3','2.5'),
  W('main','2','motor','U1','K1/2 → M1/U1','L1 motorun U1 sargı başlangıcına gider.','#e53935','L1','2.5'),
  W('main','4','motor','V1','K1/4 → M1/V1','L2 motorun V1 sargı başlangıcına gider.','#f97316','L2','2.5'),
  W('main','6','motor','W1','K1/6 → M1/W1','L3 motorun W1 sargı başlangıcına gider.','#f4c430','L3','2.5'),
  W('motor','U2','star','1','M1/U2 → K2/1','Yıldız kontaktörü U2 sargı sonunu yıldız noktasına taşır.','#808080','CONTROL','2.5'),
  W('motor','V2','star','3','M1/V2 → K2/3','Yıldız kontaktörü V2 sargı sonunu yıldız noktasına taşır.','#808080','CONTROL','2.5'),
  W('motor','W2','star','5','M1/W2 → K2/5','Yıldız kontaktörü W2 sargı sonunu yıldız noktasına taşır.','#808080','CONTROL','2.5'),
  W('star','2','star','4','K2/2 → K2/4','K2 çıkışları dışarıdan birleştirilerek yıldız noktası oluşturulur.','#808080','CONTROL','2.5'),
  W('star','4','star','6','K2/4 → K2/6','Üç sargı sonunun ortak yıldız noktası tamamlanır.','#808080','CONTROL','2.5'),
  W('main','2','delta','1','K1/2 → K3/1','Üçgen kontaktörüne L1 hattını getirir.','#e53935','L1','2.5'),
  W('main','4','delta','3','K1/4 → K3/3','Üçgen kontaktörüne L2 hattını getirir.','#f97316','L2','2.5'),
  W('main','6','delta','5','K1/6 → K3/5','Üçgen kontaktörüne L3 hattını getirir.','#f4c430','L3','2.5'),
  W('delta','2','motor','W2','K3/2 → M1/W2','Üçgende L1, W2 ucuna bağlanarak U1-W2 köprüsü oluşur.','#e53935','L1','2.5'),
  W('delta','4','motor','U2','K3/4 → M1/U2','Üçgende L2, U2 ucuna bağlanarak V1-U2 köprüsü oluşur.','#f97316','L2','2.5'),
  W('delta','6','motor','V2','K3/6 → M1/V2','Üçgende L3, V2 ucuna bağlanarak W1-V2 köprüsü oluşur.','#f4c430','L3','2.5'),
  W('g1','PE','motor','PE','PE → M1/PE','Motor gövdesi koruma iletkenine bağlanır.','#16a34a','PE','2.5')
 );
 if(v>=2){
  p.components.push(C('lampStar','lamp-green',1160,940,'H1','Yıldız aktif'),C('lampDelta','lamp-red',1380,940,'H2','Üçgen aktif'));
  p.wires.push(
   W('coilStar','A1','lampStar','X1','K2/A1 → H1/X1','Yıldız kontaktörü çektiğinde H1 yanar.','#43a047','SIGNAL'),
   W('lampStar','X2','g1','N','H1/X2 → N','Yıldız lambasının nötr dönüşüdür.','#1e88e5','N'),
   W('coilDelta','A1','lampDelta','X1','K3/A1 → H2/X1','Üçgen kontaktörü çektiğinde H2 yanar.','#43a047','SIGNAL'),
   W('lampDelta','X2','g1','N','H2/X2 → N','Üçgen lambasının nötr dönüşüdür.','#1e88e5','N')
  );
 }
 return p;
}

function factory(id,v){
 if(id==='button-led')return lampCircuit(v);
 if(id==='button-relay')return relayCircuit(v);
 if(id==='seal-in')return sealCircuit(v);
 if(id==='timer-flipflop')return flasherCircuit(v);
 if(id==='commutator')return commutatorCircuit(v);
 if(id==='two-way')return twoWayCircuit(v,false);
 if(id==='intermediate')return twoWayCircuit(v,true);
 if(id==='bells')return bellCircuit(v);
 if(id==='control-combinations')return comboCircuit(v);
 if(id==='loop-420')return loopCircuit(v,'loop');
 if(id==='loop-powered')return loopCircuit(v,'loop-powered');
 if(id==='active-passive')return loopCircuit(v,'active-passive');
 if(['pnp-npn','inductive-capacitive','source-sink','open-collector','bero'].includes(id))return sensorCircuit(v,id);
 if(id==='motor-forward-reverse')return motorForwardReverseCircuit(v);
 if(id==='motor-star-delta')return motorStarDeltaCircuit(v);
 if(id==='dual-dc')return dualDcCircuit(v);
 throw Error('Unknown tutorial topic '+id);
}
const extra={
 'button-led':['24 VDC NO buton ile yeşil LED yakma','24 VDC NC buton ile yanan LED’i söndürme','230 VAC adi anahtar ile aydınlatma','24 VDC kırmızı ikaz lambası','Arduino UNO: buton girişinden LED çıkışı'],
 'button-relay':['24 V buton-röle bobini','Röle + NO kontak + lamba','Buton ile kontaktör bobini','Arduino buton → 5 V röle modülü'],
 'seal-in':['Start/Stop ile temel mühürleme','Start/Stop + mühürleme + durum lambası','Start/Stop mühürleme pekiştirme','Start/Stop kontaktör mühürleme'],
 'timer-flipflop':['1 s / 1 s flip-flop','0,5 s / 1,5 s asimetrik','1,5 s / 0,5 s asimetrik','Zaman rölesi NO/NC karşılaştırma'],
 'commutator':['İki ayrı tavan lambası','LED armatür + tavan lambası','İki yükü aynı komütatörle kontrol','Komütatör terminal tekrar çalışması'],
 'two-way':['İki noktadan tavan lambası','İki noktadan E27 duy','Gezgin hat renklerini öğren','Vaviyen ustalık uygulaması'],
 'intermediate':['Üç noktadan aydınlatma','Ara vaviyen çaprazlama','Gezgin uçları pekiştirme','Permütatör ustalık uygulaması'],
 'bells':['1 buton + 1 zil','2 paralel buton + 1 zil','3 paralel buton + 1 zil','3 buton + ışıklı çağırma butonu'],
 'control-combinations':['Start/Stop mühürleme','Röle kontağıyla lamba','PNP sensör → röle → lamba','Kontaktör + çalışma sinyali'],
 'loop-420':['2 telli transmitter + ampermetre','4–20 mA + 250 Ω yük','Seri loop bağlantı tekrarı','4–20 mA → 1–5 V dönüşümü'],
 'loop-powered':['İki telli loop-powered transmitter','Loop-powered + 250 Ω burden','Loop besleme polaritesi','Loop-powered ölçüm zinciri'],
 'active-passive':['Harici beslemeli pasif loop','Pasif alıcı + burden','Aktif WAZ çıkışı → pasif alıcı','Aktif kaynak/aktif kaynak hatasını önleme'],
 'pnp-npn':['PNP sensör → 0 V’a bağlı yük','NPN sensör → +24 V’a bağlı yük','PNP sourcing uygulaması','NPN sinking uygulaması'],
 'inductive-capacitive':['PNP endüktif metal algılama','NPN kapasitif algılama','4 telli endüktif NO/NC','Kapasitif NC uygulaması'],
 'source-sink':['Sourcing PNP çıkış','Sinking NPN çıkış','Source/sink terminal eşleşmesi','Sourcing–sinking pekiştirme'],
 'open-collector':['PNP sourcing sensörle yük sürme','NPN sink bağlantısı','Open collector + pull-up','Pull-up düğümüyle lojik seviye'],
 'bero':['BERO tipi PNP endüktif yaklaşım','4 telli endüktif BERO mantığı','Temassız metal sayma','BERO ile konum algılama'],
 'motor-forward-reverse':['İleri/geri · çapraz elektriksel kilitleme','İleri/geri + yön sinyal lambaları','İleri/geri · farklı iki fazı değiştir','İleri/geri ustalık · kilit + sinyal'],
 'motor-star-delta':['Manuel yıldız/üçgen paket şalter','Otomatik yıldız/üçgen · 2 s','Otomatik yıldız/üçgen · 4 s + sinyal','Otomatik yıldız/üçgen ustalık · 6 s + sinyal'],
 'dual-dc':['İki tamamen izole DC devre','İki kaynağın 0 V ortaklanması','Röle kuru kontakla kaynak izolasyonu','İki kaynak + NPN sensör ortak referansı']
};
const explanation={
 'button-led':'NO butona basıldığında seri LED devresi kapanır ve LED yanar. NC devrede kontak normalde kapalı olduğu için LED yanar; butona basılınca kontak açılır ve LED söner. 24 V kaynağı LED’den önce akım sınırlama direnci kullanır.',
 'button-relay':'Buton yükü doğrudan sürmek yerine bobine kumanda eder. Bobin çekince aynı röle referansındaki yardımcı kontaklar durum değiştirir.',
 'seal-in':'START yalnız ilk enerjiyi verir. K1 bobini çekince K1 NO yardımcı kontak START’a paralel ikinci yol oluşturur ve bobini tutar. Normalde kapalı STOP butonu hem START hem mühürleme kolunun önündedir; STOP’a basılınca tutma yolu kesilir. Simülasyonda START ve STOP defalarca kullanılarak devre tekrar tekrar çalıştırılıp durdurulabilir.',
 'timer-flipflop':'Zaman rölesinin birbirinin tersi NO ve NC durumları iki lambaya dağıtılır. Periyodik kontak değişimi lambaları dönüşümlü yakar.',
 'commutator':'Komütatör aynı mekanizma içindeki iki bağımsız kontağı kumanda eder. Faz, iki anahtarlanan kola ayrılarak ayrı lambalara gider; nötr her lambaya doğrudan ulaşır.',
 'two-way':'İki vaviyenin ortak uçları faz ve lamba tarafındadır. 12 ve 14 numaralı iki gezgin hattın seçilen kombinasyonu akım yolunu açar veya kapatır.',
 'intermediate':'Ara vaviyen iki gezgini düz veya çapraz bağlar. Böylece iki uç vaviyenin arasına eklenen her ara anahtar, hattın sürekliliğini bir kez daha değiştirebilir.',
 'bells':'Birden çok zil butonu aynı çağırma girişine paralel bağlanır. Herhangi bir buton kapandığında faz zil bobinine/elektroniğine ulaşır.',
 'control-combinations':'Kumanda devrelerinde düşük güçlü algılama/komut elemanları röle veya kontaktör bobinlerini; onların kontakları da yükleri sürer.',
 'loop-420':'4–20 mA döngüsünde aynı akım seri bağlı tüm elemanlardan geçer. 4 mA canlı sıfırı, 20 mA ölçek üstünü temsil eder; 250 Ω üzerinde yaklaşık 1–5 V oluşur.',
 'loop-powered':'İki telli loop-powered transmitter ayrıca besleme kablosu istemez; çalışma enerjisini de ölçüm akımını da aynı iki loop iletkeninden alır.',
 'active-passive':'Aktif analog çıkış loop akımını sağlayabilir; pasif giriş/çıkış ise dışarıdan loop beslemesine ihtiyaç duyar. Akım kaynağının tek ve açıkça belirlenmiş olması gerekir.',
 'pnp-npn':'PNP çıkış aktif olduğunda BK ucundan pozitif tarafa doğru kaynak sağlar; NPN çıkış ise BK ucunu 0 V tarafına çeker.',
 'inductive-capacitive':'Endüktif sensör osilatör/bobin alanındaki metalin oluşturduğu kayıpları algılar. Kapasitif sensör ise hedefin dielektrik etkisiyle elektrik alan/kapasitans değişimini algılar.',
 'source-sink':'Sourcing eleman akımı yük tarafına verir; sinking eleman akımı 0 V tarafına çeker. Çalışan bir devrede source ve sink davranışları birbirini tamamlar.',
 'open-collector':'Open collector çıkışın kendi başına pozitif seviye üreten üst transistoru yoktur. Harici yük veya pull-up pozitif seviyeyi kurar; NPN transistor iletince düğümü 0 V’a çeker.',
 'bero':'BERO, Siemens dokümanlarında temassız yaklaşım algılamada kullanılan bir adlandırmadır. Endüktif BERO metal hedefi mekanik temas olmadan algılayarak anahtarlama sinyali üretir.',
 'motor-forward-reverse':'İleri ve geri kontaktörleri aynı anda çekmemelidir. K1 ve K2 NC yardımcı kontakları çapraz elektriksel kilit oluşturur; her yön kendi NO yardımcı kontağıyla mühürlenir. Güç devresinde herhangi iki fazın yer değiştirmesi motorun dönüş yönünü tersine çevirir. STOP iki mühürlemeyi de keser; simülasyonda ileri–stop–geri–stop çevrimi istenildiği kadar tekrarlanabilir.',
 'motor-star-delta':'Yıldız bağlantıda U2–V2–W2 ortaklanır ve sargıların faz gerilimi düşer; kalkış akımı azalır. Ana kontaktör K1 ve zaman rölesi KT1 birlikte başlar. Süre dolmadan K2 yıldız kontaktörü aktiftir; KT1 kontağı değişince K2 bırakır ve onun NC kilidi kapandıktan sonra K3 üçgen kontaktörü devreye girer. K2/K3 karşılıklı NC kilitleri yıldız ve üçgenin aynı anda kapanmasını önler. STOP tüm tutma zincirini çözer.',
 'dual-dc':'İki DC kaynak aynı devrede tamamen izole tutulabilir, kontrollü biçimde 0 V referansları ortaklanabilir veya röle/opto gibi galvanik izolasyonla sinyal aktarılabilir.'
};
const safety={
 'button-led':'230 VAC aydınlatma dersi yalnızca eğitim simülasyonudur; gerçek şebeke tesisatında güvenli çalışma ve yetkinlik kuralları uygulanmalıdır.',
 'commutator':'230 VAC tesisat bağlantıları yalnız yetkili ve güvenli çalışma koşullarında yapılmalıdır.',
 'two-way':'230 VAC tesisat bağlantıları yalnız yetkili ve güvenli çalışma koşullarında yapılmalıdır.',
 'intermediate':'230 VAC tesisat bağlantıları yalnız yetkili ve güvenli çalışma koşullarında yapılmalıdır.',
 'bells':'Gerçek şebeke gerilimli zil devrelerinde uygun koruma ve üretici bağlantı kuralları uygulanmalıdır.',
 'motor-forward-reverse':'Gerçek motor devrelerinde uygun kısa devre/aşırı akım koruması ve kontaktörler arası mekanik kilit de kullanılmalıdır; simülasyon eğitim amaçlıdır.',
 'motor-star-delta':'Gerçek yıldız-üçgen yol vermede motor etiket gerilimi, termik/aşırı akım koruması, kontaktör boyutları ve yıldız-üçgen geçiş süresi üretici verilerine göre seçilmelidir.'
};
const lessons=[];
for(const t of topics)for(let v=0;v<(t.topicId==='button-led'?5:4);v++){
 const p=factory(t.topicId,v),id=t.topicId+'-'+(v+1),lv=t.topicId==='button-led'&&v===4?{key:'transfer',name:'5 · Yeni ortama aktarım',help:'Aynı buton ve LED mantığını Arduino giriş/çıkışına aktarın.'}:levels[v];
 const isArduinoButtonLed=t.topicId==='button-led'&&v===4;
 const isArduinoButtonRelay=t.topicId==='button-relay'&&v===3;
 const isIlluminatedCallBell=t.topicId==='bells'&&v===3;
 const lessonSummary=isArduinoButtonLed?'Buton modülü 5 V ile beslenir; Arduino D2 girişi butonu okur, D13 çıkışı LED’i 220 Ω seri direnç üzerinden sürer.':isArduinoButtonRelay?'5 V kaynak UNO, buton modülünü ve röle modülünü besler. UNO D2’den butonu okur ve D8 ile röleyi kumanda eder; tüm modüller ortak 0 V kullanır.':isIlluminatedCallBell?'Üç zil butonu ve gösterge halkalı butonun çağrı kontakları aynı elektronik zili paralel çalıştırır. Bu alıştırmada gösterge halkası görseldir; elektriksel olarak simüle edilmez.':t.summary;
 const lessonExplanation=isArduinoButtonLed?'Ayarlı kaynak buton modülünü 5 V ile besler. Butonun SIG ucu Arduino D2 girişine, Arduino GND ortak 0 V referansına bağlanır. Program D2 durumunu okuyup D13 çıkışına aktarır; harici LED’e giden akım 220 Ω seri dirençle sınırlandırılır.':isArduinoButtonRelay?'Ayarlı 5 V kaynak UNO’yu, buton modülünü ve tek kanallı röle modülünü besler. Butonun SIG ucu D2’ye bağlanır; program D2 durumunu okuyup D8 çıkışına aktarır. D8 röle modülünün SIG girişini sürer. Kaynağın 0 V ucu, UNO GND, buton GND ve röle GND arasında ortak referans oluşturur.':isIlluminatedCallBell?'Üç normal zil butonu ile gösterge halkalı butonun 13–14 çağrı kontakları zil girişine paralel bağlanır. Herhangi birine basıldığında zil çalar. Butonun ışık halkası bu devrede yalnızca görseldir; ayrı terminali ve elektriksel modeli olmadığı için yanıp sönmesi simüle edilmez.':explanation[t.topicId];
 const lessonConcepts=isArduinoButtonLed?['Arduino UNO','5 VDC','D2 sayısal giriş','D13 sayısal çıkış','220 Ω seri direnç']:isArduinoButtonRelay?['Arduino UNO','5 VDC','D2 buton girişi','D8 röle çıkışı','ortak 0 V']:t.concepts;
 p.tutorialLesson={id,topicId:t.topicId,phase:'demo',step:0,level:v+1};p.projectId='tutorial-'+id;p.name='Öğretici · '+t.topic+' · '+(v+1);
 const lessonSafety=t.topicId==='button-led'&&v!==2?'':safety[t.topicId]||'';
 lessons.push(finish(p,{id,topicId:t.topicId,topic:t.topic,group:t.group,variant:v+1,level:lv.key,levelName:lv.name,levelHelp:lv.help,title:extra[t.topicId][v],summary:lessonSummary,explanation:lessonExplanation,concepts:lessonConcepts,safety:lessonSafety,workspaceMode:p.workspaceMode}));
}
const byId=Object.fromEntries(lessons.map(x=>[x.id,x]));
const api={topics,levels,lessons,byId,clone,lesson:id=>byId[id]?clone(byId[id]):null,count:lessons.length};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSTutorialLessons=api;
})(typeof window==='undefined'?globalThis:window);
