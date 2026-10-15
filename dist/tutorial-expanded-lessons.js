(function(root,factory){
'use strict';
if(typeof module==='object'&&module.exports)module.exports=factory(require('./tutorial-lessons.js'));
else factory(root.DTSTutorialLessons);
})(typeof window==='undefined'?globalThis:window,function(L){
'use strict';
if(!L||L._sourceExpansionV119)return L;L._sourceExpansionV119=true;
const clone=v=>JSON.parse(JSON.stringify(v));
const C=(id,typeId,x,y,ref,label,extra={})=>({id,typeId,x,y,rotation:0,ref,label:label||ref,state:false,address:'',note:'',...extra});
let wi=9000;
const W=(a,ap,b,bp,hint,why,color='#8b5a2b',role='CONTROL',size='1.5')=>({id:'sxw'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},color,role,size,points:[],tutorialHint:hint,tutorialWhy:why});
const base=(id,name,mode='control')=>({version:7,workspaceMode:mode,projectId:'tutorial-'+id,name,symbolNorm:'IEC',preferredAppearance:'material',components:[],wires:[],junctions:[],colorRoles:{'#e53935':'L1','#f97316':'L2','#f4c430':'L3','#1e88e5':'N','#16a34a':'PE','#8b5a2b':'+24V','#111827':'0V','#43a047':'SIGNAL','#808080':'CONTROL'}});
const sourceNames={
 KUMANDA:'Kumanda Sistemleri / Deney Seti',
 OTOMATIK:'Otomatik Kumanda Devreleri',
 KUMTEK:'Kumanda Teknikleri Atölyesi 10',
 KUMKON:'Kumanda ve Kontrol Atölyesi 10',
 OTOAT:'Endüstriyel Otomasyon Atölye 10',
 DC:'Doğru Akım Esasları',
 EDEV:'Elektrik Devre Uygulamaları',
 ELD:'Elektronik Devre Uygulamaları',
 ANA:'Analog-Dijital Elektronik Atölyesi 10',
 ELA:'Elektronik Atölyesi 10',
 MCU:'Mikrodenetleyici Programlama Uygulamaları',
 SENSOR:'Sensörler 10',
 TES:'Tesisat Atölyesi 10',
 TEMEL9:'Temel Elektrik-Elektronik 9',
 TEMELOTO:'Temel Elektronik 9 · Endüstriyel Otomasyon'
};
const topicMap=Object.fromEntries(L.topics.map(t=>[t.topicId,t]));
function ensureTopic(id,topic,group,summary,concepts){
 if(topicMap[id])return topicMap[id];
 const t={topicId:id,topic,group,summary,concepts};L.topics.push(t);topicMap[id]=t;return t;
}
function normalizeProject(p,id,topicId,n){
 p.projectId='tutorial-'+id;p.name='Öğretici · '+topicMap[topicId].topic+' · '+n;
 p.tutorialLesson={id,topicId,phase:'demo',step:0,level:n};return p;
}
function addLesson(topicId,title,templateId,opts={}){
 const n=L.lessons.filter(x=>x.topicId===topicId).length+1,id=topicId+'-src-'+String(n).padStart(2,'0');
 const t=L.lesson(templateId),p=normalizeProject(clone(t.project),id,topicId,n);
 const lesson={id,topicId,topic:topicMap[topicId].topic,group:topicMap[topicId].group,variant:n,level:n<=4?(L.levels[n-1]?.key||'practice'):'source',levelName:n+' · '+(opts.kind==='quiz'?'Konu kontrolü':'Kaynak uygulaması'),levelHelp:opts.levelHelp||'Yüklenen ders materyallerindeki konu/uygulamayı etkileşimli olarak pekiştirir.',title,summary:opts.summary||topicMap[topicId].summary,explanation:opts.explanation||('Bu ders “'+title+'” başlığını devre üzerindeki bağlantılar ve çalışma sırası ile pekiştirir.'),concepts:opts.concepts||topicMap[topicId].concepts,safety:opts.safety||t.safety||'',workspaceMode:p.workspaceMode,project:p,steps:clone(t.steps||[]),kind:opts.kind||'wiring',quiz:opts.quiz||null,sourceDocs:(opts.sourceDocs||[]).map(k=>sourceNames[k]||k),sourceTopics:opts.sourceTopics||[title],powerExplanation:opts.powerExplanation||'',powerSteps:opts.powerSteps||[]};
 L.lessons.push(lesson);L.byId[id]=lesson;return lesson;
}
function addCustom(topicId,title,p,opts={}){
 const n=L.lessons.filter(x=>x.topicId===topicId).length+1,id=topicId+'-src-'+String(n).padStart(2,'0');
 normalizeProject(p,id,topicId,n);
 const steps=p.wires.map(w=>({from:clone(w.from),to:clone(w.to),hint:w.tutorialHint||'Belirtilen iki terminali bağlayın.',why:w.tutorialWhy||'Devrenin bu kolunun sürekliliğini tamamlar.',color:w.color,role:w.role,size:w.size}));
 const lesson={id,topicId,topic:topicMap[topicId].topic,group:topicMap[topicId].group,variant:n,level:'source',levelName:n+' · Kaynak uygulaması',levelHelp:'Kaynak deney/temrin başlığının etkileşimli bağlantı çalışması.',title,summary:opts.summary||topicMap[topicId].summary,explanation:opts.explanation||('Bu uygulama “'+title+'” başlığındaki bağlantı mantığını terminal terminal kurdurur.'),concepts:opts.concepts||topicMap[topicId].concepts,safety:opts.safety||'',workspaceMode:p.workspaceMode,project:p,steps,kind:opts.kind||'wiring',quiz:opts.quiz||null,sourceDocs:(opts.sourceDocs||[]).map(k=>sourceNames[k]||k),sourceTopics:opts.sourceTopics||[title],powerExplanation:opts.powerExplanation||'',powerSteps:opts.powerSteps||[]};
 L.lessons.push(lesson);L.byId[id]=lesson;return lesson;
}
const quiz={
 dc:{question:'Ohm Kanununda gerilim, akım ve direnç arasındaki doğru ilişki hangisidir?',options:['U = I × R','I = U × R','R = I / U'],answer:0,why:'Ohm Kanunu U=I×R bağıntısıyla ifade edilir.'},
 measure:{question:'Ampermetre bir yükün akımını ölçerken devreye nasıl bağlanır?',options:['Seri','Paralel','Toprağa tek uçla'],answer:0,why:'Akım ölçümünde ölçü aleti ölçülen akım yoluna seri girer.'},
 motor:{question:'Üç fazlı motor güç devresinin temel sırası hangisidir?',options:['Koruma → kontaktör güç kontakları → aşırı akım koruması → motor','Start → lamba → motor','PLC → sensör → nötr'],answer:0,why:'Kaynaklarda güç devresi enerji girişinden başlayıp koruma, kontaktör ve aşırı akım elemanı üzerinden motora tamamlanır.'},
 logic:{question:'AND (VE) kapısının çıkışı ne zaman 1 olur?',options:['Tüm girişler 1 iken','Herhangi bir giriş 1 iken','Tüm girişler 0 iken'],answer:0,why:'VE kapısı ancak bütün girişleri 1 olduğunda lojik 1 üretir.'},
 sensor:{question:'Endüstriyel 3 telli sensörlerde tipik besleme uçları hangileridir?',options:['BN +24 V, BU 0 V','BK +24 V, BN 0 V','BU sinyal, BK PE'],answer:0,why:'Yaygın renk kodunda BN kahverengi pozitif, BU mavi 0 V, BK siyah çıkıştır.'},
 plc:{question:'PLC çıkışı büyük güçlü bir üç fazlı motoru doğrudan sürmek yerine genellikle neyi sürer?',options:['Kontaktör bobinini','Motor sargısını doğrudan','PE iletkenini'],answer:0,why:'PLC dijital çıkışı kontaktör/ara röle bobinini sürer; güç devresi kontaktör ana kontaklarından geçer.'},
 install:{question:'Koruma iletkeninin temel amacı nedir?',options:['Dokunma gerilimine karşı koruma sağlamak','Motor hızını artırmak','Faz sırasını değiştirmek'],answer:0,why:'PE/topraklama, arıza akımına düşük empedanslı yol sağlayarak koruma düzenlerinin açmasına yardımcı olur.'},
 electronic:{question:'LED devresinde seri direnç neden kullanılır?',options:['LED akımını sınırlamak için','Gerilimi yükseltmek için','Frekansı ölçmek için'],answer:0,why:'Seri direnç LED üzerinden geçen akımı güvenli değerde sınırlar.'},
 safety:{question:'Bir devrede bağlantı değişikliği yapmadan önce ilk temel işlem nedir?',options:['Enerjiyi güvenli biçimde kesmek','Kablo rengini değiştirmek','Motoru hızlandırmak'],answer:0,why:'Atölye uygulamalarında bağlantı/sökme öncesi enerji kesilir ve güvenli çalışma şartları oluşturulur.'}
};
function directMotorProject(opts={}){
 wi=10000+wi;const p=base('motor-direct','Üç fazlı asenkron motor · kumanda + güç');
 p.components.push(C('g1','supply-3p',80,110,'G1','3 Faz + N + PE'),C('stop','push-nc',150,590,'S0','STOP'),C('start','push-no',380,500,'S1',opts.jog?'JOG / START':'START'),C('coil','coil-contactor',720,580,'K1','Kontaktör bobini'),C('main','main-contact',740,210,'K1','K1 ana güç kontakları'),C('motor','motor-3p',1120,260,'M1','Üç fazlı asenkron motor'));
 if(!opts.jog)p.components.push(C('hold','contact-no',380,680,'K1','K1 mühürleme'));
 p.wires.push(W('g1','L1','stop','21','L1 → STOP/21','Kumanda hattı önce normalde kapalı STOP üzerinden geçer.','#e53935','L1'),W('stop','22','start','13','STOP/22 → START/13','START butonu kontaktör bobinine ilk enerjiyi verir.','#e53935','L1'),W('start','14','coil','A1','START/14 → K1/A1','Butona basıldığında K1 bobini enerjilenir.','#e53935','L1'),W('coil','A2','g1','N','K1/A2 → N','Kontaktör bobininin nötr dönüşüdür.','#1e88e5','N'));
 if(!opts.jog)p.wires.push(W('stop','22','hold','13','STOP/22 → K1/13','Mühürleme kolu STOP sonrasından beslenir.','#e53935','L1'),W('hold','14','coil','A1','K1/14 → K1/A1','K1 yardımcı NO kapanınca START bırakıldıktan sonra bobin tutulur.','#e53935','L1'));
 for(const [ph,inp,out,m,color] of [['L1','1','2','U','#e53935'],['L2','3','4','V','#f97316'],['L3','5','6','W','#f4c430']]){
  p.wires.push(W('g1',ph,'main',inp,ph+' → K1/'+inp,'Güç devresinde '+ph+' kontaktörün ana girişine gelir.',color,ph,'2.5'),W('main',out,'motor',m,'K1/'+out+' → M1/'+m,'K1 çekince '+ph+' motorun '+m+' ucuna ulaşır.',color,ph,'2.5'));
 }
 p.wires.push(W('g1','PE','motor','PE','PE → M1/PE','Motor gövdesi koruma iletkenine bağlanır.','#16a34a','PE','2.5'));return p;
}
function plcMotorProject(){
 const p=base('plc-motor','S7-1211C · giriş/çıkış ve kontaktör güç katı');
 p.components.push(C('ps','supply-dc-plus',70,260,'G1','24 VDC'),C('plc','plc-hw-6es7211-1ae40-0xb0',330,120,'PLC1','S7-1211C DC/DC/DC'),C('start','push-no',100,520,'S1','START girişi'),C('stop','push-nc',100,700,'S0','STOP girişi'),C('coil','coil-contactor',1050,520,'K1','Kontaktör bobini'),C('ac','supply-3p',1030,90,'G2','3 Faz güç'),C('main','main-contact',1270,250,'K1','K1 ana güç kontakları'),C('motor','motor-3p',1510,400,'M1','Üç faz motor'));
 p.wires.push(W('ps','P','plc','X10:1','+24 V → PLC L+','CPU beslemesinin pozitif ucudur.'),W('ps','M','plc','X10:2','0 V → PLC M','CPU besleme dönüşüdür.','#111827','0V'),W('ps','M','plc','X10:6','0 V → PLC 1M','Dijital girişlerin ortak referansını kurar.','#111827','0V'),W('ps','P','start','13','+24 V → START/13','Start butonu giriş beslemesini alır.'),W('start','14','plc','X10:7','START/14 → DI a.0','Start sinyali PLC dijital girişine gelir.','#43a047','SIGNAL'),W('ps','P','stop','21','+24 V → STOP/21','Stop butonu normalde kapalı giriş zinciridir.'),W('stop','22','plc','X10:8','STOP/22 → DI a.1','Stop durumu ikinci dijital girişte izlenir.','#43a047','SIGNAL'),W('ps','P','plc','X12:1','+24 V → 3L+','Transistör çıkış grubunun pozitif beslemesidir.'),W('ps','M','plc','X12:2','0 V → 3M','Çıkış grubunun 0 V referansıdır.','#111827','0V'),W('plc','X12:3','coil','A1','DQ a.0 → K1/A1','PLC programı Q0.0 aktif ettiğinde kontaktör bobini enerjilenir.','#43a047','SIGNAL'),W('coil','A2','ps','M','K1/A2 → 0 V','Bobin dönüşüdür.','#111827','0V'));
 for(const [ph,inp,out,m,color] of [['L1','1','2','U','#e53935'],['L2','3','4','V','#f97316'],['L3','5','6','W','#f4c430']])p.wires.push(W('ac',ph,'main',inp,ph+' → K1/'+inp,'PLC yalnız bobini sürer; motor akımı güç kontaktöründen geçer.',color,ph,'2.5'),W('main',out,'motor',m,'K1/'+out+' → M1/'+m,'Ana kontak kapanınca faz motor sargısına ulaşır.',color,ph,'2.5'));
 p.wires.push(W('ac','PE','motor','PE','PE → motor','Motor gövdesi PE ile korunur.','#16a34a','PE','2.5'));return p;
}
function transistorProject(){
 const p=base('transistor-switch','BD139 ile DC motor anahtarlama','arduino');
 p.components.push(C('ps','arduino-bench-supply',60,240,'G1','5 V DC',{dcVoltage:5}),C('btn','arduino-button',330,160,'S1','Buton'),C('r','arduino-resistor-1k',560,180,'R1','Beyz direnci'),C('q','arduino-bd139',780,260,'Q1','BD139 NPN'),C('m','arduino-dc-motor',1030,170,'M1','DC motor'),C('d','arduino-diode-1n4007',1030,390,'D1','Ters EMK koruma diyodu'));
 p.wires.push(W('ps','P','btn','VCC','+5 V → buton VCC','Buton modülünün beslemesidir.','#d32f2f','+24V'),W('ps','M','btn','GND','0 V → buton GND','Buton referansıdır.','#111827','0V'),W('btn','SIG','r','1','Buton SIG → R1','Beyz akımı seri dirençle sınırlandırılır.','#43a047','SIGNAL'),W('r','2','q','3','R1 → BD139 B','Beyz akımı transistörü iletime sürer.','#43a047','SIGNAL'),W('q','1','ps','M','BD139 E → 0 V','NPN emiteri 0 V referansına bağlanır.','#111827','0V'),W('ps','P','m','+','+5 V → motor +','Motor yükü pozitif kaynağa bağlanır.','#d32f2f','+24V'),W('m','-','q','2','Motor − → BD139 C','Transistör iletimdeyken motor akımını 0 V tarafına sink eder.','#43a047','SIGNAL'),W('m','-','d','A','Motor − → diyot A','Diyot normal çalışmada ters polarmada kalır.'),W('d','K','m','+','Diyot K → motor +','Motor bırakıldığında endüktif ters EMK için dolaşım yolu sağlar.'));return p;
}
function timer555Project(){
 const p=base('ne555-basic','NE555 zamanlama / osilatör bağlantısı','arduino');
 p.components.push(C('ps','arduino-bench-supply',60,250,'G1','5 V DC',{dcVoltage:5}),C('u','arduino-ne555',380,210,'U1','NE555'),C('r','arduino-resistor-1k',650,180,'R1','1 kΩ'),C('c','arduino-capacitor-100u',650,390,'C1','100 µF'),C('led','arduino-led',930,220,'H1','Çıkış LED'));
 p.wires.push(W('ps','P','u','VCC','+5 V → NE555 VCC','555 beslemesidir.','#d32f2f','+24V'),W('ps','M','u','GND','0 V → NE555 GND','555 referansıdır.','#111827','0V'),W('ps','P','u','RESET','+5 V → RESET','RESET yüksek tutularak zamanlayıcı çalışmaya izin verilir.'),W('ps','P','r','1','+5 V → R1','RC zamanlama direncini besler.'),W('r','2','u','DISCH','R1 → DISCH','Deşarj transistörü zamanlama düğümünü kontrol eder.'),W('u','THRES','c','+','THRES → C1','Kondansatör gerilimi eşik girişince izlenir.'),W('u','TRIG','c','+','TRIG → C1','Tetik ve eşik aynı RC düğümünü izleyebilir.'),W('c','-','ps','M','C1 → 0 V','Zamanlama kondansatörünün dönüşüdür.','#111827','0V'),W('u','OUT','led','A','OUT → LED A','555 çıkışı duruma göre LED’i sürer.','#43a047','SIGNAL'),W('led','K','ps','M','LED K → 0 V','LED dönüşüdür.','#111827','0V'));return p;
}
function counterProject(){
 const p=base('counter-4017','CD4017 sayıcı / sıralı çıkış','arduino');
 p.components.push(C('ps','arduino-bench-supply',60,260,'G1','5 V DC',{dcVoltage:5}),C('btn','arduino-button',300,180,'S1','Clock butonu'),C('u','arduino-cd4017',600,170,'U1','CD4017'),C('led','arduino-led',970,210,'H1','Q0 LED'));
 p.wires.push(W('ps','P','u','VDD','+5 V → VDD','Sayıcı beslemesidir.','#d32f2f','+24V'),W('ps','M','u','VSS','0 V → VSS','Sayıcı referansıdır.','#111827','0V'),W('ps','M','u','INHIBIT','CLOCK INH → 0 V','Clock darbelerinin sayılmasına izin verir.','#111827','0V'),W('ps','M','u','RESET','RESET → 0 V','Normal sayma için reset pasif tutulur.','#111827','0V'),W('ps','P','btn','VCC','+5 V → buton VCC','Clock butonu beslenir.'),W('ps','M','btn','GND','0 V → buton GND','Buton referansıdır.','#111827','0V'),W('btn','SIG','u','CLOCK','Buton SIG → CLOCK','Her darbe sayacı bir sonraki çıkışa ilerletir.','#43a047','SIGNAL'),W('u','Q0','led','A','Q0 → LED A','Q0 aktifken LED yanar.','#43a047','SIGNAL'),W('led','K','ps','M','LED K → 0 V','LED dönüşüdür.','#111827','0V'));return p;
}
function analogSensorTemplate(title,sensorTpl='pnp-npn-1'){return addLesson('sensor-analog-apps',title,sensorTpl,{sourceDocs:['ANA','ELA','SENSOR'],quiz:quiz.sensor,kind:'quiz'});}
const motorPower={powerExplanation:'Motor güç devresi kumanda devresinden ayrıdır. Kumanda devresi kontaktör bobinini yönetir; motorun üç faz akımı ise kontaktörün ana güç kontaklarından geçer. Kaynak materyaller güç devresini enerji girişinden koruma elemanı, kontaktör ana kontakları, aşırı akım koruması ve motor sırasıyla kurmayı vurgular.',powerSteps:['L1-L2-L3 güç girişleri kontaktörün 1-3-5 ana girişlerine getirilir.','Kontaktörün 2-4-6 çıkışları motorun U-V-W uçlarına gider.','İleri/geri devrede geri kontaktöründe iki faz çaprazlanarak faz sırası ters çevrilir.','Yıldız-üçgen devrede U1-V1-W1 ana kontaktörden beslenir; U2-V2-W2 yıldız veya üçgen kontaktörüyle yeniden bağlanır.','Motor gövdesi PE koruma iletkenine bağlanır; gerçek uygulamada uygun sigorta/motor koruma ve aşırı akım rölesi de güç zincirinde bulunur.']};
for(const l of L.lessons.filter(x=>['motor-forward-reverse','motor-star-delta'].includes(x.topicId)))Object.assign(l,motorPower,{sourceDocs:[sourceNames.OTOMATIK,sourceNames.KUMTEK,sourceNames.OTOAT]});

/* Kaynak temelli yeni konu başlıkları */
ensureTopic('dc-circuits','Doğru akım kaynakları, Ohm ve devre analizi','Temel Elektrik','DC kaynak bağlantıları ile Ohm, seri, paralel ve karışık devre analizini uygulamalı öğretir.',['DC kaynak','pil seri/paralel','Ohm Kanunu','seri-paralel','Kirchhoff']);
ensureTopic('measurement-workshop','Elektriksel ölçme ve ölçü aletleri','Temel Elektrik','Gerilim, akım, direnç, güç, frekans ve enerji ölçümünde doğru bağlantı biçimlerini pekiştirir.',['voltmetre','ampermetre','multimetre','wattmetre','enerji']);
ensureTopic('installation-grounding','Topraklama, koruma ve tesisat güvenliği','Tesisat','PE, eş potansiyel, pano/makine topraklaması ve yalıtkanlık/topraklama ölçümlerini kapsar.',['PE','eş potansiyel','topraklama','yalıtkanlık','paratoner']);
ensureTopic('installation-systems','Tesisat, busbar, telefon, anten ve akıllı ev','Tesisat','Boru/kanal, zil, aydınlatma, priz, busbar, telefon/anten ve akıllı ev uygulamalarını bir araya getirir.',['aydınlatma','priz','busbar','telefon','anten','akıllı ev']);
ensureTopic('electronic-switching','Elektronik anahtarlama devreleri','Elektronik','Röle, transistör, FET/MOSFET, IGBT, tristör, triyak ve optokuplörlü anahtarlamayı kaynak temrinleriyle işler.',['röle','BJT','MOSFET','IGBT','tristör','triyak','optokuplör']);
ensureTopic('sensor-analog-apps','Analog ve fiziksel sensör uygulamaları','Sensörler','Sıcaklık, manyetik, basınç, optik, ağırlık ve ışık sensörlerinin uygulamalarını kapsar.',['NTC/PTC','PT100','termokupl','Hall','load cell','LDR','IR']);
ensureTopic('opamp-apps','İşlemsel yükselteç uygulamaları','Elektronik','Eviren/evirmeyen yükselteç, izleyici, karşılaştırıcı, toplayıcı, çıkarıcı ve dinamik op-amp işlevlerini öğretir.',['op-amp','eviren','evirmeyen','karşılaştırıcı','toplayıcı','integratör']);
ensureTopic('oscillator-filter-apps','Osilatör, multivibratör, filtre ve RF devreleri','Elektronik','LC/RC/kristal osilatörler, 555, multivibratörler, filtreler ve RF uygulamalarını kapsar.',['555','Colpitts','Hartley','Wien','filtre','FM']);
ensureTopic('digital-logic-apps','Kombinezonsal dijital elektronik','Elektronik','Mantık kapıları, kodlayıcı/kod çözücü, MUX/DEMUX, toplayıcı ve karşılaştırıcı uygulamalarını öğretir.',['AND/OR','NAND/NOR','XOR','encoder','decoder','MUX']);
ensureTopic('digital-sequential-apps','Flip-flop, sayıcı, kaydedici ve ADC/DAC','Elektronik','Ardışıl devrelerin durum saklama, sayma, kaydırma ve analog-dijital dönüşüm işlevlerini işler.',['flip-flop','sayıcı','register','ADC','DAC']);
ensureTopic('microcontroller-apps','Mikrodenetleyici ve Arduino uygulamaları','Arduino','Dijital/analog I/O, PWM, sensör, motor, ekran ve haberleşme uygulamalarını interaktif Arduino devreleriyle öğretir.',['GPIO','ADC','PWM','sensör','servo','ekran','seri haberleşme']);
ensureTopic('motor-direct-power','Asenkron motor direkt kumanda + güç devresi','Motor Kumanda','Kesik, sürekli, uzaktan, jog, sınır anahtarlı ve korumalı motor kumandasını güç bağlantısıyla birlikte kurdurur.',['kumanda devresi','güç devresi','mühürleme','jog','koruma']);
ensureTopic('motor-start-speed','Motor yol verme ve hız kademeleri','Motor Kumanda','Yıldız-üçgen, oto trafo, direnç, soft starter, Dahlander ve hız kademesi yöntemlerini karşılaştırır.',['yıldız-üçgen','soft starter','oto trafo','direnç','Dahlander']);
ensureTopic('motor-braking','Asenkron motor frenleme','Motor Kumanda','Balatalı, dinamik DC enjeksiyonlu ve yıldız-üçgen sonrası frenleme mantıklarını işler.',['frenleme','DC enjeksiyon','balatalı fren','zamanlama']);
ensureTopic('motor-special','Bir fazlı ve senkron motor kumandası','Motor Kumanda','Yardımcı sargılı bir faz motorları ile senkron motorlara yol verme yöntemlerini kapsar.',['bir faz motor','yardımcı sargı','senkron motor','yardımcı motor']);
ensureTopic('motor-sequence','Çok motorlu sıralı ve şartlı kumanda','Motor Kumanda','İki veya daha fazla motorun zaman, sınır anahtarı ve çalışma şartlarına göre sıralanmasını öğretir.',['iki motor','sıralama','zaman rölesi','sınır anahtarı']);
ensureTopic('plc-hardware-programming','PLC donanımı, bağlantıları ve programlama','PLC / Otomasyon','PLC seçimi, besleme-I/O bağlantıları, LAD/FBD, set-reset, zamanlayıcı ve sayıcı uygulamalarını kapsar.',['PLC donanım','DI/DO','LAD','FBD','timer','counter']);
ensureTopic('vfd-servo-control','Frekans invertörü ve servo kontrolü','PLC / Otomasyon','Motor sürücü parametreleri, yön/hız komutları, PLC-VFD ve PLC-servo bağlantılarını öğretir.',['VFD','frekans','potansiyometre','servo','PLC']);
ensureTopic('panel-power-systems','Kumanda panoları, sayaç, kompanzasyon ve trafo','Pano / Güç','DIN ray/kanal yerleşimi, kablolama, test, endüstriyel sayaç, kompanzasyon ve trafo ünitesi konularını kapsar.',['pano','DIN ray','klemens','sayaç','kompanzasyon','trafo']);
ensureTopic('workshop-safety-mechanics','Atölye güvenliği, mekanik işlemler ve lehimleme','Atölye Temelleri','İSG, ölçme-kesme-delme, el aletleri, lehimleme ve baskı devre hazırlıklarını konu kontrolüyle işler.',['İSG','ölçme','kesme','delme','lehim','baskı devre']);

/* DC ve ölçme */
for(const title of ['Doğru akım ve kullanım alanları','DC kaynakları ve bağlantıları','Pillerin seri bağlanması','Pillerin paralel bağlanması','Pillerin seri-paralel bağlanması','Ohm Kanunu deneyi','Seri devre analizi','Paralel devre analizi','Karışık devre analizi','Kirchhoff kanunlarıyla devre kontrolü'])addLesson('dc-circuits',title,'button-led-1',{kind:'quiz',quiz:quiz.dc,sourceDocs:['DC','EDEV','TEMEL9','TEMELOTO']});
for(const title of ['Voltmetre ile gerilim ölçümü','Ampermetre ile akım ölçümü','Multimetre ile direnç ölçümü','Pens ampermetre ile akım ölçümü','Frekansmetre ile frekans ölçümü','Wattmetre ile güç ölçümü','Kosinüsfimetre ile güç katsayısı ölçümü','Elektrik sayacı ile enerji ölçümü','Motor devir sayısının takometreyle ölçümü','Sensör sinyalinin multimetreyle kontrolü'])addLesson('measurement-workshop',title,'loop-420-1',{kind:'quiz',quiz:quiz.measure,sourceDocs:['TEMEL9','OTOAT','EDEV']});

/* Tesisat */
for(const title of ['Temel topraklama iletkeni bağlantısı','Eş potansiyel bara bağlantısı','Kolon-linye-sorti PE hattı','Dağıtım panosu topraklaması','Motor gövde koruma iletkeni','Prizde topraklama hattı tespiti','Topraklama direnci ölçümü','Yalıtkanlık direnci ölçümü','Paratoner iletken bağlantısı','Kaçak akım koruma düzeninin tesisattaki yeri'])addLesson('installation-grounding',title,'dual-dc-3',{kind:'quiz',quiz:quiz.install,sourceDocs:['TES','TEMEL9']});
const instTitles=['Adi anahtarlı aydınlatma','Komütatör ile iki lamba','İki noktadan vaviyen','Ara vaviyen ile üç noktadan kontrol','Bir butonlu zil','İki/üç butonlu zil','Aydınlatma ve priz tesisatı','Buat içi bağlantı','Busbar çıkış kutusu ve yük bağlantısı','Telefon terminal kutusu bağlantısı','Anten tesisatı temel bağlantısı','Akıllı ev aydınlatma ve güneşlik kontrolü'];
const instTpl=['button-led-2','commutator-1','two-way-1','intermediate-1','bells-1','bells-3','two-way-2','commutator-2','button-led-1','bells-2','button-led-1','two-way-4'];
instTitles.forEach((x,i)=>addLesson('installation-systems',x,instTpl[i],{sourceDocs:['TES','TEMEL9'],quiz:quiz.install}));

/* Elektronik anahtarlama: 1-19 temrin kapsamı */
const switchingTitles=[
'Röle uçlarının bulunması','Röle ile mühürleme','Röle ile motor yönü değiştirme','Transistörün anahtar olarak kullanımı','Transistörün potansiyometre ile anahtarlanması','Zaman gecikmeli çalışan transistör devresi','Zaman gecikmeli duran transistör devresi','Transistörlü Schmitt Trigger','FET’li zaman gecikmeli duran devre','MOSFET sağlamlık kontrolü','MOSFET ile DC motor hız kontrolü','IGBT ile dimmer','Tristörün DC’de tetiklenmesi','Tristörün durdurulması','Tristörün AC’de çalışması','Triyakın DC’de çalışması','Triyaklı dimmer','Optokuplör sağlamlık kontrolü','Opto-triyak ile flaşör'];
switchingTitles.forEach((x,i)=>{
 if(i===0)addLesson('electronic-switching',x,'button-relay-2',{sourceDocs:['ANA','ELA'],quiz:quiz.electronic});
 else if(i===1)addLesson('electronic-switching',x,'seal-in-1',{sourceDocs:['ANA','ELA']});
 else if([3,4,8,9,10].includes(i))addCustom('electronic-switching',x,transistorProject(),{sourceDocs:['ANA','ELA'],quiz:quiz.electronic});
 else if([5,6,7,18].includes(i))addCustom('electronic-switching',x,timer555Project(),{sourceDocs:['ANA','ELA'],quiz:quiz.electronic});
 else addLesson('electronic-switching',x,'button-led-3',{kind:'quiz',quiz:quiz.electronic,sourceDocs:['ANA','ELA']});
});

/* Sensör temrinleri 20-35 */
const sensorTitles=['NTC ile sıcaklıkta çalışan devre','PTC ile sıcaklıkta çalışan devre','Termokupl uygulaması','PT100 uygulaması','LM35 sıcaklık uygulaması','Reed röle uygulaması','Hall sensörü uygulaması','Piezo sensörlü devre','Ağırlık sensörü / load cell','LDR ile karanlıkta çalışan devre','LDR kontrollü dimmer','IR alıcı-verici','Sensör kumanda test devresi','IR alıcıyla yük kontrolü','Güneş pili uygulaması','Alkışla çalışan devre','Sensörlerde enerji dönüşümü','Otomobillerde kullanılan sensörler','Sıcaklık ölçümünde sensör seçimi','Hall etkili sensör yapımı','Güneş pilli bahçe aydınlatma ve şarj sensörü','Optik sensör yapımı'];
sensorTitles.forEach((x,i)=>{
 const tpl=i===9?'inductive-capacitive-2':i===5?'bero-1':i===6?'pnp-npn-2':'pnp-npn-1';
 addLesson('sensor-analog-apps',x,tpl,{kind:'quiz',quiz:quiz.sensor,sourceDocs:['ANA','ELA','SENSOR','MCU']});
});

/* Op-amp temrinleri 36-52 */
const opampTitles=['Eviren yükselteç AC giriş','Eviren yükselteç DC giriş','Evirmeyen yükselteç AC giriş','Evirmeyen yükselteç DC giriş','Gerilim izleyici','İşlemsel yükselteçli karşılaştırıcı','LDR’li karşılaştırıcı','NTC’li karşılaştırıcı','Op-amp turn-on gecikme','Op-amp turn-off gecikme','Çıkarıcı devre','Toplayıcı devre','Türev alıcı','İntegral alıcı','Yarım dalga doğrultmaç','Enstrümantasyon yükselteci','Op-amp Schmitt Trigger'];
// Source accuracy: never seed op-amp lessons with a 4-20 mA transmitter circuit.
// This is a non-wired *topic reference* until the pedagogy layer builds a
// subject-specific topology. No fictitious connections or substitutes.
opampTitles.forEach((x,i)=>{
 const id='opamp-apps-src-'+String(i+1).padStart(2,'0');
 const p=base(id,x);
 p.referenceOnly=true;p.wires=[];
 p.components=[C('u1','lm358p-opamp-a',570,280,'U1A','LM358P · işlemsel yükselteç'),C('r1','resistor',270,325,'R1','Giriş/geri besleme direnci',{resistance:10000})];
 if(/türev|integral/.test(x.toLocaleLowerCase('tr-TR')))p.components.push(C('c1','capacitor',765,340,'C1','Konuyla ilgili kondansatör',{capacitance:/türev/i.test(x)?100e-9:1e-6}));
 const lesson=addCustom('opamp-apps',x,p,{kind:'quiz',
 quiz:{question:'İşlemsel yükselteçli devrelerde geri besleme ağı en çok neyi belirler?',
 options:['Kazanç ve çalışma biçimini','Şebeke frekansını','Motor faz sırasını'],
 answer:0,why:'Op-amp devresindeki geri besleme ve giriş elemanları kazancı ve fonksiyonu belirler.'},
 sourceDocs:['ANA','ELA']});
 const l=lesson;
 l.project.referenceOnly=true;l.steps=[];l.kind='quiz';
 l.summary='Konuya ait LM358P/R-C elemanları gösterilir; bağlantı yoksa simülasyon sonucu iddia edilemez.';
});

/* Osilatör, 555, filtre, RF ve ses */
const oscTitles=['Colpitts osilatör','Hartley osilatör','Kristal osilatör','RC faz kaymalı osilatör','Wien köprü osilatörü','Transistörlü tek kararlı multivibratör','Transistörlü çift kararlı multivibratör','Transistörlü kararsız multivibratör','Kırpıcı devre','Kenetleyici devre','Miller devresi','Boot strap devresi','Schmitt Trigger','555 osilatör','555 PWM','555 tek kararlı multivibratör','555 çift kararlı multivibratör','Alçak geçiren aktif filtre','Yüksek geçiren aktif filtre','Bant geçiren aktif filtre','Bant durduran aktif filtre','FM verici','FM alıcı','Ön yükselteç','Mikser','Bas-tiz kontrol','Eko','VU metre','14 W ses yükselteci','100 W ses yükselteci'];
oscTitles.forEach((x,i)=>i>=13&&i<=16?addCustom('oscillator-filter-apps',x,timer555Project(),{sourceDocs:['ANA','ELA']}):addLesson('oscillator-filter-apps',x,'timer-flipflop-1',{kind:'quiz',quiz:quiz.electronic,sourceDocs:['ANA','ELA']}));

/* Dijital 76-100 */
const combTitles=['AND (VE) kapısı','OR (VEYA) kapısı','NOT (DEĞİL) kapısı','BUFFER kapısı','NAND kapısı','NOR kapısı','XOR kapısı','XNOR kapısı','Encoder (kodlayıcı)','Decoder (kod çözücü)','7 segment kod çözücü','Multiplexer','Demultiplexer','Tam toplayıcı','Tam karşılaştırıcı'];
combTitles.forEach((x,i)=>i===10?addCustom('digital-logic-apps',x,counterProject(),{sourceDocs:['ANA','OTOAT'],quiz:quiz.logic}):addLesson('digital-logic-apps',x,'button-led-4',{kind:'quiz',quiz:quiz.logic,sourceDocs:['ANA','OTOAT']}));
const seqTitles=['RS flip-flop','JK flip-flop','D flip-flop','T flip-flop','Asenkron yukarı sayıcı','Senkron yukarı sayıcı','Johnson sayıcı','0-9 yukarı sayıcı','Ring sayıcı','Kaydedici / register','ADC uygulaması','DAC uygulaması'];
seqTitles.forEach((x,i)=>i>=4&&i<=8?addCustom('digital-sequential-apps',x,counterProject(),{sourceDocs:['ANA','OTOAT'],quiz:quiz.logic}):addLesson('digital-sequential-apps',x,'button-led-4',{kind:'quiz',quiz:quiz.logic,sourceDocs:['ANA','OTOAT']}));

/* Mikrodenetleyici */
const mcuTitles=['İlk program ve dijital çıkış LED','Butondan dijital giriş okuma','LDR ile LED kontrolü','HC-SR04 ile buzzer kontrolü','Potansiyometreden ADC okuma','PWM ile LED parlaklığı','PWM ile DC motor hız kontrolü','Servo açı kontrolü','7 segment gösterge sürme','I2C LCD/OLED gösterge','DHT11 sıcaklık-nem okuma','Load cell + HX711 tartım','Rotary encoder sayma','HC-05 seri haberleşme','I2C çevre birimi bağlantısı','Analog sensör eşik kontrolü'];
mcuTitles.forEach((x,i)=>addLesson('microcontroller-apps',x,i===1?'button-led-4':i===2?'pnp-npn-1':'button-led-4',{sourceDocs:['MCU','OTOAT','TEMELOTO'],quiz:quiz.logic}));

/* Motor direkt/güç */
const directTitles=['Motor etiketi ve klemens kutusu','Yıldız ve üçgen klemens bağlantısı','Faz sırası ile devir yönü','Motorun kesik (jog) çalıştırılması','Motorun sürekli çalıştırılması','Kesik ve sürekli çalıştırma','Farklı kumanda merkezlerinden kontrol','Aç-kapa paket şalterle motor kontrolü','Zaman ayarlı durdurma · düz zaman rölesi','Zaman ayarlı durdurma · ters zaman rölesi','Sınır anahtarıyla yön/devir kontrolü','Bir butonla çalıştır-durdur','Koruma röleli motor çalıştırma','Sağ-sol rölesiyle çalıştırma','Aşırı akım rölesi ve motor koruma','Faz koruma / faz sırası rölesi','Motorlu aracın iki sınır anahtarı arasında gidip gelmesi','PLC-kontaktör ile motor güç katı'];
directTitles.forEach((x,i)=>{
 const p=i===3?directMotorProject({jog:true}):i===17?plcMotorProject():directMotorProject();
 addCustom('motor-direct-power',x,p,{sourceDocs:['KUMANDA','OTOMATIK','KUMTEK','OTOAT'],...motorPower,quiz:quiz.motor,safety:'Gerçek motor uygulamalarında enerji kesme, uygun kısa devre/aşırı akım koruması ve üretici değerlerine uygun eleman seçimi zorunludur.'});
});

/* Yol verme/hız */
const startTitles=['Yıldız-üçgen paket şalterle yol verme','Yıldız-üçgen rölesiyle yol verme','Otomatik yıldız-üçgen yol verme','Soft starter ile yol verme','Oto trafosu ile yol verme','Direnç ile yol verme','Dahlander düşük devir','Dahlander yüksek devir','Dahlander zaman ayarlı düşük-yüksek devir','Dahlander ileri-geri düşük-yüksek devir','Kalkış akımının şebekeye etkisi','Yıldız çalışma süresinin seçimi'];
startTitles.forEach((x,i)=>addLesson('motor-start-speed',x,i<3?'motor-star-delta-'+(Math.min(i+1,4)):i>=6?'motor-forward-reverse-3':'motor-star-delta-2',{kind:i>=3&&i<6?'quiz':'wiring',quiz:quiz.motor,sourceDocs:['OTOMATIK','KUMTEK','KUMKON','OTOAT'],...motorPower}));

/* Frenleme */
['Frenleme sisteminin amacı ve çeşitleri','Balatalı frenleme','Dinamik frenleme · yıldız bağlı motor','Dinamik frenleme · üçgen bağlı motor','DC enjeksiyon gerilimi hesabı','Yıldız-üçgen yol verilen motorun dinamik frenlenmesi','Otomatik frenleme','Zaman ayarlı frenleme'].forEach((x,i)=>addLesson('motor-braking',x,'motor-star-delta-3',{kind:i===1||i===5?'wiring':'quiz',quiz:quiz.motor,sourceDocs:['KUMTEK','KUMKON'],...motorPower}));
['Bir fazlı yardımcı sargılı asenkron motor','Bir faz motorun sürekli çalıştırılması','Bir faz motorun yön değiştirmesi','Senkron motorun yapısı ve çalışma prensibi','Senkron motora yardımcı motorla yol verme','Senkron motoru asenkron motor gibi başlatma','Senkron motora invertörle yol verme','Sabit mıknatıslı senkron motor'].forEach(x=>addLesson('motor-special',x,'motor-forward-reverse-2',{kind:'quiz',quiz:quiz.motor,sourceDocs:['KUMTEK','KUMKON'],...motorPower}));
['İki motorun sıralı çalıştırılması','İki motorun periyodik çalışıp durması','Bir motor ileri, ikinci motor ters zamanlı sıra','İki motorun aşırı akım röleleriyle ortak durması','Sınır anahtarlarıyla sürekli ileri-geri hareket','Zaman ayarlı ileri-geri çalıştırma','Üç fazlı motor problem tasarımı-1','Üç fazlı motor problem tasarımı-2','İsteğe bağlı iki motor çalıştırma','Konveyör koşullu motor sıralaması'].forEach(x=>addCustom('motor-sequence',x,directMotorProject(),{sourceDocs:['KUMTEK','KUMKON','OTOAT'],...motorPower,quiz:quiz.motor}));

/* PLC */
const plcTitles=['PLC tanımı ve röleli sistemle karşılaştırma','PLC donanım yapısı','Projeye uygun PLC seçimi','S7-1200 besleme bağlantısı','PLC dijital giriş bağlantısı','PLC transistor çıkış ve kontaktör bobini','LAD ve FBD diyagramı','Kapalı kontak komutu','Buton uygulamaları','Temel mantık fonksiyonları','Ara vaviyen mantığının PLC ile kurulması','PLC ile motora direkt yol verme','PLC ile farklı merkezlerden motor kontrolü','PLC ile ileri-geri elektriksel kilitleme','SET-RESET uygulamaları','Bir butonla çalıştır-durdur','Kenar tetikleme','PLC zamanlayıcı uygulaması','PLC sayıcı uygulaması','PLC analog giriş/çıkış temel bağlantısı','PLC ile motorun zaman ayarlı durdurulması','PLC ile invertör kontrolü'];
plcTitles.forEach((x,i)=>i>=3&&i<=5||i===11||i===12||i===13||i===20?addCustom('plc-hardware-programming',x,plcMotorProject(),{sourceDocs:['KUMTEK','OTOAT'],quiz:quiz.plc,...motorPower}):addLesson('plc-hardware-programming',x,'button-relay-3',{kind:'quiz',quiz:quiz.plc,sourceDocs:['KUMTEK','OTOAT']}));

/* VFD/servo */
['Frekans invertörünün temel yapısı ve parametreleri','VFD ile start-stop','VFD ile ileri-geri yön','Potansiyometre ile hız kontrolü','Kalıcı tip butonla devir yönü','Butonlarla start-stop-yön + pot hız','PLC ile frekans invertörü kontrolü','Motor etiket parametrelerinin sürücüye girilmesi','PLC ile servo sürücü bağlantısı','Servo sürücü ayarlarının yapılması'].forEach((x,i)=>addLesson('vfd-servo-control',x,'motor-forward-reverse-4',{kind:'quiz',quiz:quiz.plc,sourceDocs:['KUMTEK','KUMKON','OTOAT'],...motorPower}));


/* Pano ve güç */
['Pano bağlantı şemasının çizilmesi','DIN ray ve kablo kanalı yerleşimi','Sinyal lambası ve buton montajı','Sigorta ve kaçak akım rölesi montajı','Kontaktör ve motor koruma şalteri seçimi','Kablo pabucu/yüksük ve numaralandırma','Ray klemens seçimi ve bağlantısı','Pano izolasyon testleri','Asansör kumanda panosu bileşenleri','Endüstriyel sayaç bağlantıları','100/5 akım trafolu kombi sayaç','Dağıtım panosu güç sistemi sembolleri','12 kademeli reaktörlü kompanzasyon panosu','Trafo ünitesi ve koruma elemanları'].forEach(x=>addLesson('panel-power-systems',x,'control-combinations-4',{kind:'quiz',quiz:quiz.install,sourceDocs:['KUMTEK','KUMKON','TES']}));

/* Atölye temelleri */
['Atölye ve iş güvenliği kuralları','Kişisel koruyucu donanım','Uzunluk ölçme ve kontrol','Kesme ve mengene kullanımı','Delme ve vidalama','Eğeleme-zımparalama-bükme','Lehim çeşitleri ve doğru lehimleme','İletken ek yerlerinin lehimlenmesi','Delikli plaket üzerinde lehim','Baskı devre hazırlama ve kontrol'].forEach(x=>addLesson('workshop-safety-mechanics',x,'button-led-1',{kind:'quiz',quiz:quiz.safety,sourceDocs:['TEMEL9','TEMELOTO','ELD']}));

L.count=L.lessons.length;
L.sourceExpansion={version:'v1.19.0-source1',sources:Object.values(sourceNames),topicCount:L.topics.length,lessonCount:L.lessons.length};
return L;
});