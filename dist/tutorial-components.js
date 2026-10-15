(function(root){
'use strict';
const lib=root.COMPONENT_LIBRARY;if(!Array.isArray(lib))return;
const P=(id,label,x,y,side)=>({id,label,x,y,side});
const box=(id,name,model,pins=[],extra={})=>({id,name,model,kind:'diagram',w:150,h:100,pins,tutorialOnly:true,visualOnly:true,diagramOnly:true,catalogGroup:'drawing',refPrefix:'X',symbolSource:{file:'Öğretici Modu',pages:'yerel',basis:'Yalnız ders anlatımında kullanılan kavram sembolü; başka bir cihazın yerine geçirilmez.'},...extra});
const add=d=>{if(!lib.some(x=>x.id===d.id))lib.push(d)};

/* Yalnız doğru ders malzemesini göstermek için kullanılan, normal kütüphanede gizli eğitim sembolleri. */
add({id:'tutorial-battery',name:'Pil / DC Hücre',model:'1,5 V AA eğitim pili',kind:'battery',w:110,h:220,pins:[P('+','+',55,0,'top'),P('−','−',55,220,'bottom')],tutorialOnly:true,catalogGroup:'drawing',refPrefix:'BT',batteryCell:true,defaultVoltage:1.5,symbolSource:{file:'Öğretici Modu',pages:'yerel',basis:'Seri/paralel pil bağlantılarını gerçek kutup ve gerilim davranışıyla öğretmek için kullanılan işlevsel DC hücre.'}});
add({id:'tutorial-battery-alkaline',name:'Alkalin AA Pil',model:'1,5 V alkalin birincil hücre',kind:'battery',w:110,h:220,pins:[P('+','+',55,0,'top'),P('−','−',55,220,'bottom')],tutorialOnly:true,catalogGroup:'drawing',refPrefix:'BA',batteryCell:true,batteryChemistry:'alkaline',rechargeable:false,defaultVoltage:1.5});
add({id:'tutorial-battery-nimh',name:'NiMH AA Şarjlı Pil',model:'1,2 V NiMH ikincil hücre',kind:'battery',w:110,h:220,pins:[P('+','+',55,0,'top'),P('−','−',55,220,'bottom')],tutorialOnly:true,catalogGroup:'drawing',refPrefix:'BN',batteryCell:true,batteryChemistry:'nimh',rechargeable:true,defaultVoltage:1.2});
add({id:'tutorial-battery-liion',name:'Li-ion 18650 Hücre',model:'3,7 V Li-ion şarjlı hücre',kind:'battery',w:110,h:220,pins:[P('+','+',55,0,'top'),P('−','−',55,220,'bottom')],tutorialOnly:true,catalogGroup:'drawing',refPrefix:'BL',batteryCell:true,batteryChemistry:'liion',rechargeable:true,defaultVoltage:3.7});
add({id:'tutorial-battery-leadacid',name:'12 V Kurşun-Asit Akü',model:'12 V şarj edilebilir akü',kind:'battery',w:190,h:130,pins:[P('+','+',48,0,'top'),P('−','−',142,0,'top')],tutorialOnly:true,catalogGroup:'drawing',refPrefix:'BK',batteryCell:true,batteryChemistry:'leadacid',rechargeable:true,defaultVoltage:12});
add(box('tutorial-clamp-meter','Pens Ampermetre','Akım iletkeni çevresinden temassız ölçüm',[],{refPrefix:'PA'}));
add(box('tutorial-frequency-meter','Frekansmetre','Hz ölçümü',[P('1','1',0,35,'left'),P('2','2',0,70,'left')],{refPrefix:'F'}));
add({
 id:'unit-ut61e-plus',
 name:'UNI-T UT61E+ True RMS Multimetre',
 model:'UT61E+ · 22000 count · frekans 220 MHz',
 kind:'multimeter',
 multimeterModel:'UT61E+',
 w:180,h:380,
 pins:[
  P('A','20A',28,380,'bottom'),
  P('mA','mA/µA',70,380,'bottom'),
  P('COM','COM',112,380,'bottom'),
  P('V','VΩHz',154,380,'bottom')
 ],
 tutorialOnly:true,
 catalogGroup:'measurement',
 refPrefix:'M',
 brand:'UNI-T',
 series:'UT61+',
 physicalDimensionsMm:{width:90,height:190,depth:50},
 physicalWidthMm:90,
 physicalHeightMm:190,
 physicalDepthMm:50,
 searchTerms:'UNI-T UT61E+ UT61E plus true rms multimetre frekans Hz 220 MHz frequency multimeter',
 symbolSource:{file:'Öğretici Modu',pages:'yerel',basis:'UNI-T UT61E+ gerçek ürün özelliklerine göre frekans ölçümü için kullanılan işlevsel eğitim modeli.'}
});
add(box('tutorial-wattmeter','Wattmetre','Gerilim + akım devresi',[P('I+','I+',0,25,'left'),P('I−','I−',0,55,'left'),P('V+','V+',150,25,'right'),P('V−','V−',150,55,'right')],{refPrefix:'W'}));
add({
 id:'energy-analyzer-1p',
 name:'Tek Faz Enerji Analizörü',
 model:'DTS EA-1P · V/A/W/VA/var/PF/Hz/Wh',
 kind:'energy-analyzer',
 w:230,h:280,
 pins:[
  P('L','L · gerilim',0,58,'left'),
  P('N','N · gerilim',0,102,'left'),
  P('S1','CT S1',0,190,'left'),
  P('S2','CT S2',0,232,'left'),
  P('A','RS485 A',230,205,'right'),
  P('B','RS485 B',230,245,'right')
 ],
 catalogGroup:'measurement',
 refPrefix:'EA',
 liveMaterial:true,
 energyAnalyzer:true,
 brand:'DTS Eğitim',
 series:'EA',
 physicalDimensionsMm:{width:96,height:96,depth:62},
 searchTerms:'enerji analizörü şebeke analizörü wattmetre cos phi cosφ güç faktörü aktif reaktif görünür güç frekans enerji CT',
 symbolSource:{file:'Öğretici Modu',pages:'yerel',basis:'Tek fazlı sanal eğitim enerji analizörü; V, I, P, Q, S, PF, Hz ve Wh değerlerini aynı ekranda öğretmek için kullanılır.'}
});
add({
 id:'current-transformer-edu-1p',
 name:'Eğitim Akım Trafosu',
 model:'CT · 100/5 A · simülasyon',
 kind:'current-transformer',
 w:150,h:150,
 pins:[P('P1','P1',0,48,'left'),P('P2','P2',150,48,'right'),P('S1','S1',48,150,'bottom'),P('S2','S2',104,150,'bottom')],
 catalogGroup:'measurement',
 refPrefix:'CT',
 ctPrimary:100,
 ctSecondary:5,
 searchTerms:'akım trafosu CT current transformer 100 5 enerji analizörü'
});
add({
 id:'energy-training-load-1p',
 name:'AC Güç Analizi Eğitim Yükü',
 model:'230 VA · R / L / C karakter seçilebilir',
 kind:'energy-training-load',
 w:190,h:150,
 pins:[P('L','L',0,48,'left'),P('N','N',190,48,'right')],
 tutorialOnly:true,
 catalogGroup:'passives',
 refPrefix:'Z',
 nominalVoltage:230,
 apparentPowerVA:230,
 powerFactor:1,
 loadCharacter:'resistive',
 searchTerms:'güç faktörü eğitim yükü resistive inductive capacitive cos phi'
});
add(box('tutorial-cosphimeter','Kosinüsfimetre','Güç katsayısı cos φ',[P('L','L',0,35,'left'),P('N','N',0,70,'left')],{refPrefix:'PF'}));
add(box('tutorial-tachometer','Takometre','Devir sayısı / rpm',[],{refPrefix:'TAC'}));

add(box('tutorial-opamp','İşlemsel Yükselteç','Genel op-amp eğitim sembolü',[P('+','+',0,32,'left'),P('−','−',0,68,'left'),P('OUT','OUT',150,50,'right'),P('V+','V+',75,0,'top'),P('V−','V−',75,100,'bottom')],{refPrefix:'U'}));
for(const [k,n] of [['and','AND (VE)'],['or','OR (VEYA)'],['not','NOT (DEĞİL)'],['buffer','BUFFER (TAMPON)'],['nand','NAND'],['nor','NOR'],['xor','XOR'],['xnor','XNOR']])
 add(box('tutorial-logic-'+k,n+' Kapısı','Dijital lojik kapı',[P('A','A',0,30,'left'),...(k==='not'||k==='buffer'?[]:[P('B','B',0,70,'left')]),P('Q','Q',150,50,'right')],{refPrefix:'U'}));
for(const [k,n,pins] of [
 ['rs','RS Flip-Flop',['S','R','Q','Q̅']],['jk','JK Flip-Flop',['J','K','CLK','Q','Q̅']],['d','D Flip-Flop',['D','CLK','Q','Q̅']],['t','T Flip-Flop',['T','CLK','Q','Q̅']]
])add(box('tutorial-ff-'+k,n,'Durum saklayan ardışıl lojik',pins.map((x,i)=>P(x,x,i<pins.length-2?0:150,25+(i%3)*28,i<pins.length-2?'left':'right')),{refPrefix:'U'}));
add(box('tutorial-adc','ADC · Analog → Dijital','Analog-dijital dönüştürücü',[P('AIN','AIN',0,50,'left'),P('DOUT','DOUT',150,50,'right')],{refPrefix:'U'}));
add(box('tutorial-dac','DAC · Dijital → Analog','Dijital-analog dönüştürücü',[P('DIN','DIN',0,50,'left'),P('AOUT','AOUT',150,50,'right')],{refPrefix:'U'}));

add(box('tutorial-mosfet','MOSFET','Alan etkili güç anahtarı',[P('G','G',0,50,'left'),P('D','D',150,30,'right'),P('S','S',150,72,'right')],{refPrefix:'Q'}));
add(box('tutorial-igbt','IGBT','Yalıtılmış kapılı güç transistörü',[P('G','G',0,50,'left'),P('C','C',150,30,'right'),P('E','E',150,72,'right')],{refPrefix:'Q'}));
// Functional software-only SCR for MQ-07 low-voltage virtual teaching.
// Never use the diagram-only tutorial-scr as a conductive semiconductor.
add({id:'mq07-scr-virtual',name:'Sanal SCR (DC gate)',model:'İdealize gate-eşik eğitim modeli',
 kind:'scr',w:150,h:100,pins:[P('G','G',0,50,'left'),P('A','A',150,30,'right'),P('K','K',150,72,'right')],
 tutorialOnly:true,catalogGroup:'electronics',refPrefix:'Q',
 physicalAcceptance:false,symbolSource:{file:'MQ-07',pages:'SC13',basis:'Özgün SCR solver gate-eşik / A-K anahtarlama; fiziksel tutma akımı yoktur.'}});
add(box('tutorial-scr','Tristör / SCR','Anot-katot-kapı',[P('G','G',0,50,'left'),P('A','A',150,30,'right'),P('K','K',150,72,'right')],{refPrefix:'V'}));
// Functional low-voltage virtual triac for MQ-07 SC16, distinct from diagram-only symbol.
add({id:'mq07-triac-virtual',name:'Sanal triyak (DC gate)',model:'Eşik anahtarlamalı eğitim modeli',kind:'triac',w:150,h:100,
 pins:[P('G','G',0,50,'left'),P('MT1','MT1',150,72,'right'),P('MT2','MT2',150,30,'right')],
 tutorialOnly:true,physicalAcceptance:false,catalogGroup:'electronics',refPrefix:'Q',
 symbolSource:{file:'MQ-07',pages:'SC16',basis:'Yalnız özgün solver gate/MT1 eşiği ve MT1-MT2 anahtarlama; fiziksel AC faz modeli değildir.'}});
add(box('tutorial-triac','Triyak','MT1-MT2-kapı',[P('G','G',0,50,'left'),P('MT1','MT1',150,30,'right'),P('MT2','MT2',150,72,'right')],{refPrefix:'V'}));

add(box('tutorial-synchronous-motor','Senkron Motor','Senkron motor eğitim sembolü',[P('U','U',0,25,'left'),P('V','V',0,50,'left'),P('W','W',0,75,'left'),P('PE','PE',150,75,'right')],{refPrefix:'M'}));
add(box('tutorial-mechanical-brake','Motor Freni','Balatalı / mekanik fren kavramı',[],{refPrefix:'BR'}));

add(box('tutorial-ppe','Kişisel Koruyucu Donanım','KKD · gözlük / eldiven / uygun iş kıyafeti',[],{refPrefix:'ISG'}));
add(box('tutorial-hand-tools','Atölye El Aletleri','Ölçme / kesme / delme / eğeleme araçları',[],{refPrefix:'ISG'}));
add(box('tutorial-soldering','Lehimleme İstasyonu','Havya · lehim · plaket',[],{refPrefix:'ISG'}));
add(box('tutorial-pcb','Baskı Devre / Delikli Plaket','PCB / prototip plaket',[],{refPrefix:'PCB'}));
add(box('tutorial-earth-tester','Topraklama Direnci Ölçer','Topraklama ölçüm cihazı',[],{refPrefix:'MET'}));
add(box('tutorial-insulation-tester','Yalıtkanlık Direnci Ölçer','Megohmmetre / izolasyon test cihazı',[P('L','L',0,35,'left'),P('E','E',0,70,'left')],{refPrefix:'MET'}));
add(box('tutorial-lightning-protection','Paratoner / Yıldırımdan Korunma','Yakalama ucu + iniş iletkeni + topraklama',[],{refPrefix:'LP'}));
add(box('tutorial-crystal','Kuvars Kristal','Kristal rezonatör',[P('1','1',0,50,'left'),P('2','2',150,50,'right')],{refPrefix:'X'}));
add(box('tutorial-logic-encoder','Kodlayıcı / Encoder','Çoklu giriş → kodlu çıkış',[P('IN','Girişler',0,50,'left'),P('OUT','Kod',150,50,'right')],{refPrefix:'U'}));
add(box('tutorial-logic-decoder','Kod Çözücü / Decoder','Kodlu giriş → çoklu çıkış',[P('IN','Kod',0,50,'left'),P('OUT','Çıkışlar',150,50,'right')],{refPrefix:'U'}));
add(box('tutorial-logic-mux','Multiplexer','Çoklu girişten birini seçer',[P('IN','Girişler',0,35,'left'),P('SEL','Seçim',0,70,'left'),P('Q','Q',150,50,'right')],{refPrefix:'U'}));
add(box('tutorial-logic-demux','Demultiplexer','Bir girişi seçilen çıkışa yollar',[P('D','D',0,35,'left'),P('SEL','Seçim',0,70,'left'),P('OUT','Çıkışlar',150,50,'right')],{refPrefix:'U'}));
add(box('tutorial-full-adder','Tam Toplayıcı','A + B + Cin → Sum + Cout',[P('A','A',0,25,'left'),P('B','B',0,50,'left'),P('Cin','Cin',0,75,'left'),P('S','S',150,35,'right'),P('Cout','Cout',150,70,'right')],{refPrefix:'U'}));
add(box('tutorial-comparator','Dijital Karşılaştırıcı','A ve B büyüklük karşılaştırması',[P('A','A',0,35,'left'),P('B','B',0,70,'left'),P('OUT','>,=,<',150,50,'right')],{refPrefix:'U'}));
add(box('tutorial-rf-transmitter','RF Verici Bloğu','Taşıyıcı + modülasyon + çıkış',[],{refPrefix:'TX'}));
add(box('tutorial-rf-receiver','RF Alıcı Bloğu','RF giriş + demodülasyon + ses/işaret çıkışı',[],{refPrefix:'RX'}));
add(box('tutorial-solar-cell','Güneş Pili','Fotovoltaik enerji kaynağı',[P('+','+',150,35,'right'),P('−','−',150,70,'right')],{refPrefix:'PV'}));
add(box('tutorial-piezo','Piezoelektrik Sensör','Mekanik titreşim → elektrik sinyali',[P('+','+',0,35,'left'),P('−','−',150,70,'right')],{refPrefix:'B',kind:'piezo',diagramOnly:false,visualOnly:false,piezoVirtual:true,model:'İki elektrotlu sanal piezo · eğitim modeli',physicalAcceptance:false,simulationNote:'Mekanik darbe sonrası kısa süreli mV gerilim; gerçek üretici kalibrasyonu veya SPICE modeli değildir.'}));
add(box('tutorial-number-binary','İkilik Sayı Sistemi','Binary · 0 ve 1',[],{refPrefix:'NUM'}));
add(box('tutorial-number-decimal','Onluk Sayı Sistemi','Decimal · 0…9',[],{refPrefix:'NUM'}));
add(box('tutorial-number-hex','Onaltılık Sayı Sistemi','Hexadecimal · 0…9 / A…F',[],{refPrefix:'NUM'}));
add(box('tutorial-number-bcd','BCD Kod','Her onluk basamak 4 bit ile kodlanır',[],{refPrefix:'NUM'}));
add(box('tutorial-number-gray','Gray Kod','Ardışık değerlerde tek bit değişimi',[],{refPrefix:'NUM'}));
add(box('tutorial-schematic-editor','Şematik Devre Çizimi','Sembol · terminal · net / bağlantı',[],{refPrefix:'CAD'}));
add(box('tutorial-pcb-layout','PCB Yerleşimi','Footprint · bakır yol · kart yerleşimi',[],{refPrefix:'PCB'}));
add(box('tutorial-gerber','Gerber Üretim Dosyaları','PCB üretim çıktı katmanları',[],{refPrefix:'GER'}));
add(box('tutorial-virtual-instrument','Sanal Ölçü Aleti','Simülasyon içinde ölçüm aracı',[],{refPrefix:'VI'}));
add(box('tutorial-troubleshooting','Arıza Arama Akışı','Belirti → ölçüm → karşılaştırma → arıza noktası',[],{refPrefix:'TS'}));
add(box('tutorial-diode','Diyot','Anot · katot',[P('A','A',0,50,'left'),P('K','K',150,50,'right')],{refPrefix:'D'}));
add(box('tutorial-fet','JFET / FET','Gate · Drain · Source',[P('G','G',0,50,'left'),P('D','D',150,30,'right'),P('S','S',150,72,'right')],{refPrefix:'Q'}));
add(box('tutorial-diac','Diyak','İki yönlü tetikleme elemanı',[P('A1','A1',0,50,'left'),P('A2','A2',150,50,'right')],{refPrefix:'V'}));
add(box('tutorial-hv-fuse','Yüksek Gerilim Sigortası','YG devrelerde aşırı akım / kısa devre koruması',[P('1','1',0,50,'left'),P('2','2',150,50,'right')],{refPrefix:'F'}));
add(box('tutorial-data-outlet','Data Prizi','RJ45 / veri tesisatı bağlantı noktası',[],{refPrefix:'X'}));
add(box('tutorial-tv-outlet','TV / Anten Prizi','Koaksiyel TV bağlantı noktası',[],{refPrefix:'X'}));
add(box('tutorial-f-connector','F Konnektör','Koaksiyel kablo konnektörü',[],{refPrefix:'X'}));
add(box('tutorial-multiswitch','Multiswitch','Merkezi uydu/TV sinyal dağıtımı',[],{refPrefix:'MS'}));
add(box('tutorial-threephase-plug','Üç Fazlı Fiş','L1 · L2 · L3 · N · PE',[P('L1','L1',0,20,'left'),P('L2','L2',0,40,'left'),P('L3','L3',0,60,'left'),P('N','N',0,80,'left'),P('PE','PE',150,80,'right')],{refPrefix:'XP'}));
add(box('tutorial-threephase-socket','Üç Fazlı Priz','L1 · L2 · L3 · N · PE',[P('L1','L1',0,20,'left'),P('L2','L2',0,40,'left'),P('L3','L3',0,60,'left'),P('N','N',0,80,'left'),P('PE','PE',150,80,'right')],{refPrefix:'XS'}));
add(box('tutorial-conduit','Tesisat Borusu / Kanalı','İletkenlerin mekanik koruma ve güzergâh elemanı',[],{refPrefix:'K'}));
add(box('tutorial-junction-box','Buat / Ek Kutusu','Tesisat iletkenlerinin güvenli ek ve dağıtım noktası',[],{refPrefix:'B'}));
add(box('tutorial-cable-pulling','Kablo / İletken Çekme','Kılavuz ile boru veya kanal içine iletken çekme',[],{refPrefix:'K'}));
add(box('tutorial-outdoor-light','Dış Aydınlatma Armatürü ve Direği','Sokak / çevre aydınlatma donanımı',[P('L','L',0,35,'left'),P('N','N',0,70,'left'),P('PE','PE',150,70,'right')],{refPrefix:'H'}));
add(box('tutorial-fancoil','Fan-Coil Ünitesi','Akıllı bina HVAC son elemanı',[],{refPrefix:'FC'}));
add(box('tutorial-vrf','VRF / VRV İç-Dış Ünite Sistemi','Akıllı bina iklimlendirme sistemi',[],{refPrefix:'VRF'}));
add(box('tutorial-concept','Kavramsal Ders Kartı','Bu başlıkta devre kurulmaz; konu ve gerçek elemanlar tanıtılır.',[],{refPrefix:'DERS'}));
add(box('tutorial-lcr-meter','LCR Metre','Endüktans · kapasitans · direnç ölçer',[P('HI','HI',0,35,'left'),P('LO','LO',0,70,'left')],{refPrefix:'LCR'}));
add(box('tutorial-tiva-board','TIVA TM4C123GXL Geliştirme Kartı','ARM Cortex-M4F mikrodenetleyici eğitim kartı',[],{refPrefix:'MCU'}));
add(box('tutorial-conductor-cable','İletken / Kablo','Elektrik enerjisi veya sinyal taşıyan iletken yapı',[],{refPrefix:'W'}));
add(box('tutorial-boolean','Boolean Mantığı','0/1 değişkenleri ve lojik ifadeler',[],{refPrefix:'LOG'}));
add(box('tutorial-karnaugh','Karnaugh Haritası','Lojik ifadeyi görsel olarak sadeleştirme yöntemi',[],{refPrefix:'LOG'}));
add(box('tutorial-thermostat','Termostat','Sıcaklığa göre elektrik kontağını açıp kapatan anahtar',[P('11','11',0,50,'left'),P('14','14',150,50,'right')],{refPrefix:'B'}));
add(box('tutorial-ir-transmitter','IR Verici','Kızılötesi ışık yayan verici eleman',[],{refPrefix:'IRTX'}));
add(box('tutorial-ir-receiver','IR Alıcı','Kızılötesi ışığı elektriksel sinyale dönüştüren alıcı',[],{refPrefix:'IRRX'}));
add(box('tutorial-microphone','Mikrofon','Ses basıncı → elektriksel sinyal',[P('+','+',150,35,'right'),P('−','−',150,70,'right')],{refPrefix:'MIC'}));
add(box('tutorial-speaker','Hoparlör','Elektriksel ses sinyali → akustik ses',[P('+','+',0,35,'left'),P('−','−',0,70,'left')],{refPrefix:'SPK'}));





})(typeof window==='undefined'?globalThis:window);
