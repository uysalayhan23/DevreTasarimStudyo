/* MQ-07 next teaching batch: authentic control circuits, no reconstructed wiring. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._controlBatchF)return;
const rows=[["button-led-1","NO butonla LED akım yolunu keşfet","+24 V sanal kaynağın NO buton, akım sınırlama direnci ve yeşil LED üzerinde nasıl kapalı bir yol oluşturduğunu açıkla.","Sanal devrede NO butonun basılı ve serbest hâlini karşılaştır. LED'in yalnız buton basılıyken neden yanacağını 2,7 kΩ direncin göreviyle açıkla.","NO buton serbest bırakılınca LED neden söner?",["NO kontak yeniden açılır","Direnç sıfırlanır","Kaynak gerilimi iki katına çıkar"]],["button-led-2","NC butonla durdurmayı öğren","NC butonun normalde kapalı devreyi sağladığını, basıldığında seri LED yolunu açtığını anla.","Sanal devrede NC butona bas ve bırak; LED'in iki konumda nasıl değiştiğini gözlemle. NO ile NC arasındaki farkı anlat.","NC butona basıldığında seri akım yoluna ne olur?",["Akım yolu açılır","Direnç kısa devre olur","Kaynak iki kat güçlenir"]],["button-led-3","Sanal aydınlatma anahtarında açık/kapalı yol","Yalnız yazılım simülasyonunda gösterilen AC aydınlatma anahtarının lambayı nasıl kontrol ettiğini kavra.","Yalnız sanal devrede anahtarı açıp kapat; lambanın neden farklı davrandığını gözlemle. Bu ders gerçek şebekede bağlantı yaptırmaz.","Anahtarın açık durumunda sanal lamba neden sönüktür?",["Lamba akım yolu tamamlanmaz","Frekans 0 Hz olur","Lamba direnci kaybolur"]],["button-led-4","24 VDC ikaz lambasıyla durum bilgisi","Anlık NO kumanda ve kırmızı ikaz lambasıyla sanal uyarı devresinin durumunu yorumla.","Sanal butona basılı ve serbest durumda lambayı karşılaştır; anlık butonun neden kalıcı hafıza oluşturmadığını açıkla.","Anlık buton serbest bırakılınca ne olur?",["İkaz lambasının akım yolu açılır","Buton kendini mühürler","Lamba kalıcı olarak açık kalır"]],["button-led-5","Arduino D2 buton ve D13 LED yolu","Arduino UNO'da 5 V modül beslemesi, D2 dijital giriş ve D13 LED çıkışının görevlerini ayrı ayrı belirle.","Sanal UNO projesinde D2 buton bilgisi ile D13 LED davranışını izle. 220 Ω direncin LED akımını neden sınırladığını açıkla.","Arduino'da buton hangi dijital girişten okunur?",["D2","D13","GND"]],["button-relay-1","NO buton röle bobinini nasıl enerjiler?","Röle bobininin bir kumanda elemanı olduğunu, basılı tutulan anlık NO butonla enerji aldığını açıkla.","Sanal devrede NO butonun serbest/basılı durumlarını karşılaştır ve bobin enerjisinin neden değiştiğini açıkla.","NO buton serbestken sanal röle bobini neden enerjisizdir?",["Kumanda yolu açık kalır","Bobin direnci sıfırlanır","Girişin polaritesi kendiliğinden değişir"]],["button-relay-2","Röle bobini ve NO yardımcı kontak ayrımı","Bobin kumanda yolu ile NO yardımcı kontak üzerinden çalışan yeşil lambanın görevlerini birbirinden ayır.","Sanal butonla K1 bobinini çalıştır; ayrı NO yardımcı kontağın durum lambasını nasıl etkilediğini incele.","K1 bobini etkinleştiğinde ona bağlı NO kontak ne yapar?",["Kapanır","Açık kalır","Direnç olur"]],["button-relay-3","Kontaktör bobininin kumanda mantığı","Anlık butonla 24 V sanal kontaktör bobininin enerjilenmesi ile güç kontaklarının görevlerini karıştırma.","Sanal kumanda devresinde butona basıp bırak; kontaktör bobininin aktif/enerjisiz durumlarını karşılaştır.","Kontaktör bobini bırakma sonrası mühürleme yoksa ne olur?",["Enerjisiz kalır","Sonsuza dek çekili kalır","Güç gerilimi yükselir"]],["button-relay-4","Arduino D8 ile sanal röle modülü","Sanal UNO D2 buton bilgisinin D8 ile 5 V röle modülüne nasıl kumanda gönderebildiğini öğren.","Sanal 5 V kaynağı, UNO D2 girişi ve D8 röle modülünü incele; ortak GND'nin neden önemli olduğunu açıkla.","Röle modülünün kumanda sinyali hangi çıkışa atanmıştır?",["D8","D2","GND"]],["seal-in-1","Start/Stop ile mühürleme hafızası","Start butonu bırakıldıktan sonra yardımcı K1 NO kontağının röle bobinini neden enerjili tuttuğunu kavra.","Sanal Start'a basıp bırak. Tutma yolunu K1 yardımcı kontak üzerinden izle. Sonra Stop'a bas ve bobinin neden bıraktığını açıkla.","Start bırakıldıktan sonra K1 bobini nasıl enerjili kalır?",["K1 NO mühürleme kontağıyla","Stop'un kısa devresiyle","Kaynağın gerilim yükseltmesiyle"]],["seal-in-2","Mühürleme ve durum lambasını yorumla","Start/Stop tutma devresindeki bobin hafızasıyla yeşil durum lambasının neden birlikte değiştiğini öğren.","Sanal Start, bırak, Stop sırasını uygula. K1 bobini ve durum lambası arasındaki ilişkiyi açıkla.","Stop butonuna basınca neden lamba söner?",["Stop tutma yolunu keser","Lamba kendi direncini değiştirir","NO kontak kaynak olur"]],["seal-in-3","Mühürleme pekiştirme: arıza teşhisi","Start'a basılmasına rağmen yardımcı NO kontak kapanmıyorsa bobinin neden Start bırakılınca tuttuğu bilgiyi kaybettiğini analiz et.","Sanal devrede normal Start/bırak/Stop sırasını incele. Sonra K1 yardımcı kontağın görevini devre üzerinden işaretle.","K1 yardımcı kontak kapanmazsa Start bırakıldığında ne olur?",["Bobin tutamaz","Bobin daima çekili kalır","Stop butonu işlevsizleşir"]],["seal-in-4","Kontaktör yardımcı kontakla tutma","Kontaktör bobini, Start NO, Stop NC ve kendi yardımcı NO kontağıyla tutma devresini yorumla.","Sanal kontaktör bobinini Start ile etkinleştir; Start bırakıldıktan sonra yardımcı kontak rolünü ve Stop'un zinciri açmasını açıkla.","Kontaktörün tutma yolu hangi elemanla sağlanır?",["Kontaktörün kendi NO yardımcı kontağı","Motorun koruma iletkeni","Stop NC butonunun açık konumu"]]];
const clone=x=>JSON.parse(JSON.stringify(x));
// Content only: the first thirteen lessons in the current curriculum order.
const teachingById={
 'button-led-1':{
  summary:'NO buton basılıyken LED yanar, bırakıldığında söner. Bu devreyle kapalı akım yolunu ve seri direncin görevini tanıyacaksın.',
  explanation:'Önce butona basmadan LED’e bak: sönük olmalı. NO, “normalde açık” demektir; buton serbestken kontakları arasında akım yolu yoktur. Butona basılı tuttuğunda +24 V kaynaktan buton, 2,7 kΩ direnç ve LED üzerinden 0 V’a dönen yol tamamlanır; LED yanar. Direnç, LED’den geçen akımı sınırlar. Butonu bırakınca kontak yeniden açılır ve LED söner. Şimdi sonucu kendi cümlenle anlat: LED’in yanması için bu yol neden kesintisiz olmalı? Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['NO butonu, 2,7 kΩ direnci ve yeşil LED’i bul.','Butona basmadan LED’in durumunu tahmin et; simülasyonu başlatıp karşılaştır.','Butona basılı tut. Kaynaktan LED’e ve 0 V’a dönen akım yolunu takip et.','Butonu bırak. Açılan kontağın LED’i neden söndürdüğünü anlat.','Direncin bu yolda LED akımını neden sınırladığını kendi cümlenle açıkla.'],
  why:'Buton bırakılınca NO kontak açılır. LED’in kaynakla arasındaki seri yol kesildiği için LED’den akım geçmez ve LED söner.',
  materials:{g1:'Bu devrede 24 VDC beslemeyi sağlar; akım yolu +24 V ucundan başlayıp 0 V ucuna döner.',b:'Serbestken açık, basılı tutulduğunda kapalıdır; LED’i yalnız basılı tuttuğun sürece yakar.',r:'LED ile seri bağlı 2,7 kΩ dirençtir; LED’den geçen akımı sınırlar.',l:'Seri yol tamamlandığında yanan yeşil göstergedir; yanması butonun kapandığını gösterir.'}
 },
 'button-led-2':{
  summary:'NC buton serbestken LED yanar, basıldığında söner. Bu devreyle normalde kapalı kontağın NO kontaktan farkını göreceksin.',
  explanation:'Bu kez butona dokunmadan LED’in yandığını gözlemle. NC, “normalde kapalı” demektir; serbest buton akım yolunu tamamlar. Butona basınca kontak açılır ve seri bağlı LED söner. Bırakınca kontak yeniden kapanır, LED tekrar yanar. 2,7 kΩ direnç LED akımını sınırlar; butonun NO veya NC olmasını değiştirmez. Önceki NO devresiyle karşılaştır: iki buton da akım yolunu yönetir, fakat serbest durumları farklıdır. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['NC butonu, 2,7 kΩ direnci ve yeşil LED’i bul.','Buton serbestken LED’in yanıp yanmayacağını tahmin et; simülasyonda gözlemle.','Butona basılı tut; açılan kontağın seri akım yolunu nerede kestiğini göster.','Butonu bırak ve LED’in yeniden yandığını gözlemle.','NO ve NC butonların serbest durumları arasındaki farkı anlat.'],
  why:'NC kontak serbestken kapalıdır. Butona basıldığında açılır; seri LED yolundan akım geçemediği için LED söner.',
  materials:{g1:'NC buton ve LED’in seri yoluna 24 VDC besleme sağlar.',b:'Serbestken kapalıdır; basınca açılarak LED’in akım yolunu keser.',r:'LED ile seri bağlı 2,7 kΩ dirençtir; kontak kapalıyken LED akımını sınırlar.',l:'NC buton serbestken yanar, basılıyken söner; kontağın durumunu görünür kılar.'}
 },
 'button-led-3':{
  summary:'Anahtar kapandığında sanal tavan lambası yanar; açıldığında söner. Faz, anahtar, lamba ve nötr üzerinden tamamlanan yolu inceleyeceksin.',
  explanation:'Sanal anahtarı açık konuma getir: lamba sönük olmalı. Açık anahtar, fazdan lambaya giden yolu keser. Anahtarı kapatınca faz, anahtar ve lamba üzerinden nötre dönen yol tamamlanır; lamba yanar. Buradaki “kapalı”, lambanın söndüğü değil, anahtar kontağının iletim yolunu tamamladığı anlamına gelir. Butondan farklı olarak bu anahtar seçtiğin konumda kalır. Bu çalışma yalnız yazılımın sanal devre ortamındadır; gösterilen 230 VAC değeri gerçek şebekede deneme yapma talimatı değildir.',
  steps:['Sanal kaynak, anahtar ve tavan lambasını bul.','Anahtarı açık konuma getir; lambanın durumunu gözlemle.','Fazdan anahtara, lambaya ve nötre giden yolu takip et; açık kontakta nerede kesildiğini göster.','Anahtarı kapat; lambanın neden yandığını açıkla.','Anahtarı yeniden aç. Açık ve kapalı sözcüklerinin kontak durumunu anlattığını kendi cümlenle söyle.'],
  why:'Açık anahtar faz ile lamba arasındaki yolu keser. Nötr bağlantısı bulunsa da kapalı bir akım yolu oluşmadığından lamba yanmaz.',
  materials:{g1:'Bu sanal aydınlatma devresinde 230 VAC faz ve nötr beslemesini temsil eder.',b:'Faz yolunu açıp kapatır ve seçilen konumda kalır; anlık buton gibi bırakınca geri dönmez.',l:'Anahtar kapandığında fazdan nötre tamamlanan yoldan beslenen tavan lambasıdır.'}
 },
 'button-led-4':{
  summary:'Kırmızı ikaz lambası yalnız butona basılı tuttuğun sürece yanar. Anlık kumandanın neden kendiliğinden devam etmediğini inceleyeceksin.',
  explanation:'Önce kırmızı lambanın durumunu tahmin et. NO buton serbestken açık olduğundan lamba sönüktür. Butona basılı tuttuğunda 24 V kaynaktan lambaya ve 0 V’a dönen yol tamamlanır; lamba yanar. Bırakınca kontak açılır ve lamba söner. Devrede butonun yerine akım yolunu kapalı tutacak yardımcı kontak yoktur; bu yüzden başlatma komutu saklanmaz. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['24 V kaynağı, NO butonu ve kırmızı ikaz lambasını bul.','Buton serbestken lambanın durumunu tahmin et ve simülasyonda kontrol et.','Butona basılı tut; tamamlanan lamba yolunu takip et.','Butonu bırak ve lambanın söndüğünü gözlemle.','Buton bırakılınca akım yolunu kapalı tutacak bir eleman bulunup bulunmadığını anlat.'],
  why:'Anlık NO buton bırakılınca açılır. Lambayı besleyen seri yol kesilir; devrede bu yolu tutan bir mühürleme kontağı yoktur.',
  materials:{g1:'Kırmızı ikaz lambasının devresine 24 VDC besleme sağlar.',b:'Basılıyken lamba yolunu kapatır; bırakılınca ilk açık durumuna döner.',l:'Buton kapalıyken yanan kırmızı göstergedir; bu devrede renk, gerçek bir arıza algılandığı anlamına gelmez.'}
 },
 'button-led-5':{
  summary:'Butonun bilgisi D2 girişinden okunur ve program D13 çıkışını değiştirir. D13 ile harici LED arasındaki bağlantıyı inceleyeceksin.',
  explanation:'Önce 5 V beslemeyi ve ortak GND bağlantılarını bul. Buton modülünün SIG ucu D2’ye gider: bu hat butonun bilgisini taşır. Kayıtlı program D2’yi giriş, D13’ü çıkış yapar; döngüde D2’den okuduğu değeri D13’e yazar. D13, 220 Ω seri direnç üzerinden harici LED’e bağlıdır; direnç LED akımını sınırlar. Bu sürümün sanal uygulamasında D13 sinyali değişse de harici LED görseli yanmıyor. Bu yüzden gözlemini D13 çıkışıyla sınırla; LED’in yanmasını gerçekleşmiş sonuç olarak yazma. D2 okuma, D13 kumanda içindir. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  task:'Sanal butona basıp bırak; kayıtlı programın D2 bilgisini D13 çıkışına nasıl aktardığını incele. Harici LED görselinin mevcut simülasyonda yanmadığını dikkate al.',
  steps:['Kaynağın 5 V olduğunu ve UNO ile butonun ortak GND kullandığını incele.','Buton SIG ucundan D2 girişine giden hattı takip et.','Kayıtlı programda D2 girişini ve D13 çıkışını bul.','D13’ten 220 Ω direnç ve LED’e giden çıkış yolunu izle.','Butona basıp bırak; D13 çıkışındaki değişimi incele. Harici LED’in yanmadığını da ayrı bir simülasyon sınırı olarak kaydet.'],
  why:'Butonun SIG hattı D2’ye bağlıdır ve program D2’yi giriş olarak okur. D13 ise okunan bilgiye göre LED’i kumanda eden çıkıştır.',
  materials:{ps:'UNO ve buton modülünün bu devrede kullandığı 5 V beslemeyi sağlar.',uno:'D2’den buton bilgisini okur ve kayıtlı programla D13 çıkışını günceller.',btn:'Butona basılma bilgisini SIG hattından D2’ye gönderir; VCC ve GND uçları besleme içindir.',r:'D13 ile LED arasındaki 220 Ω seri dirençtir; LED akımını sınırlar.',led:'D13’e seri direnç üzerinden bağlanmış harici LED’dir; bu sürümde görselinin yanması doğrulanmış değildir.'}
 },
 'button-relay-1':{
  summary:'NO buton bu kez bir lambayı değil, röle bobinini çalıştırır. Bobinin neden yalnız buton basılıyken çektiğini göreceksin.',
  explanation:'K1 rölesinin A1 ve A2 uçları bobine aittir. Buton serbestken +24 V ile A1 arasındaki yol açık olduğundan bobin enerjisizdir. Butona basınca yol kapanır; akım bobinden geçip A2 üzerinden 0 V’a döner ve röle çeker. Bırakınca bobin enerjisini kaybeder. Bu şemada ayrı bir yük kontağı veya lamba bulunmaz; gözleyeceğin sonuç bobinin durumudur. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['S1 butonunu ve K1 bobininin A1/A2 uçlarını bul.','+24 V → S1 → A1 yolunu ve A2’den 0 V’a dönüşü takip et.','Buton serbestken bobinin durumunu tahmin et.','Simülasyonda butona basıp bırak; bobinin çekme ve bırakma durumlarını karşılaştır.','Bu şemada bobin dışında kumanda edilen bir yük bulunup bulunmadığını söyle.'],
  why:'NO buton serbestken açıktır. Kaynaktan bobine giden yol tamamlanmadığı için K1 enerjisiz kalır.',
  materials:{g1:'S1 butonu üzerinden K1 bobinine 24 VDC besleme sağlar.',b:'K1 bobininin besleme yolunu yalnız basılı tutulduğunda tamamlar.',k:'A1/A2 uçlarından enerjilenince çeken röle bobinidir; bu şemada ayrı bir yük kontağı yoktur.'}
 },
 'button-relay-2':{
  summary:'Buton K1 bobinini çalıştırır; K1’in ayrı NO kontağı yeşil lambayı yakar. Kumanda yolu ile lamba yolunu karşılaştıracaksın.',
  explanation:'Devrede iki yol var. İlkinde S1 butonu K1 bobininin A1/A2 uçlarını besler. İkincisinde K1’in 13–14 NO kontağı yeşil H1 lambasının yolunu açıp kapatır. Bobin ile kontak aynı K1 referansını taşır; bobin çekince kontak kapanır. Butona basınca K1 çeker, 13–14 kapanır ve H1 yanar. Butonu bırakınca bobin bırakır, kontak açılır ve lamba söner. Lamba akımı bobinin içinden geçmez; her yol kendi 0 V dönüşünü tamamlar. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['K1 bobinini ve aynı K1 referanslı 13–14 kontağını bul.','S1’den A1’e giden bobin kumanda yolunu takip et.','Kaynak → K1 kontağı → H1 → 0 V lamba yolunu ayrı incele.','Butona basıp bırak; bobin, kontak ve lambanın değişme sırasını gözlemle.','Lambanın bobin yerine neden yardımcı kontak üzerinden beslendiğini anlat.'],
  why:'K1 bobini çektiğinde aynı referanstaki NO yardımcı kontak kapanır. Böylece H1’in besleme yolu tamamlanır ve lamba yanar.',
  materials:{g1:'Bobin ve lamba kollarının kullandığı ortak 24 VDC beslemeyi sağlar.',b:'K1 bobinini çalıştırır; lamba yolundaki yardımcı kontağın yerine geçmez.',k:'A1/A2’den enerjilenir ve K1 NO yardımcı kontağını kapatır.',q:'K1 bobini çekince 13–14 arasında iletim sağlar; H1’in akım yolunu tamamlar.',h:'K1 NO kontağı kapandığında yanan yeşil durum lambasıdır.'}
 },
 'button-relay-3':{
  summary:'Anlık butonla kontaktör bobininin çekmesini ve bırakmasını inceleyeceksin. Bu şema bobin kumandasını gösterir.',
  explanation:'Kontaktör bobini de A1 ve A2 uçları arasından beslenir. S1’e basınca +24 V yolu kapanır ve K1 bobini çeker; bırakınca yol açılır ve bobin enerjisiz kalır. Bu devrede yardımcı tutma kontağı bulunmadığından butonu bırakmak çalışmayı bitirir. Şemada motor veya güç kontakları yoktur; bobinin çekmesi bir motorun çalıştığını göstermez. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['Kontaktör bobininin A1 ve A2 uçlarını bul.','S1 üzerinden A1’e giden beslemeyi ve A2’nin 0 V dönüşünü takip et.','Butona basılı tutarak bobinin durumunu gözlemle.','Butonu bırak; bobinin neden çekili kalmadığını anlat.','Şemada güç kontağı ve motor olup olmadığını kontrol et.'],
  why:'Buton bırakılınca NO kontak açılır. Bobini besleyen başka bir tutma yolu olmadığından kontaktör bobini enerjisiz kalır.',
  materials:{g1:'Bu kontaktör bobini kumandasına 24 VDC besleme sağlar.',b:'Basılı tutulduğu sürece K1 bobininin enerji yolunu tamamlar.',k:'A1/A2 uçlarından çalışan kontaktör bobinidir; bu derste motor ve ana güç kontakları bulunmaz.'}
 },
 'button-relay-4':{
  summary:'UNO, D2’den okuduğu buton bilgisini D8 ile röle modülüne aktarır. Bu devrede röle kumandasını izleyeceksin.',
  explanation:'5 V kaynak UNO’yu, buton modülünü ve röle modülünü besler. Ortak GND, sinyallerin aynı gerilim referansıyla yorumlanmasını sağlar. Butonun SIG ucu D2’ye, rölenin SIG ucu D8’e bağlıdır. Kayıtlı program D2’yi giriş ve D8’i çıkış yapar; D2’den okunan değeri D8’e yazar. Simülasyonda buton ile röle modülünün durumunu karşılaştır. Rölenin COM/NO/NC yük uçlarına bir yük bağlanmamıştır; bu ders bir lambanın veya motorun sürüldüğünü göstermez. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['5 V kaynaktan UNO, buton ve röle modülüne giden beslemeleri bul.','Üç cihazın GND bağlantılarının ortak olduğunu incele.','Buton SIG → D2 ve D8 → röle SIG yollarını ayrı takip et.','Kayıtlı programda D2’den okunan değerin D8’e yazıldığını bul.','Butona basıp bırak; röle modülünün durumunu gözlemle ve yük uçlarının boş olduğunu göster.'],
  why:'Röle modülünün SIG ucu D8’e bağlıdır. Program buton bilgisini D2’den okur, röleye kumanda etmek için D8 çıkışına yazar.',
  materials:{ps:'UNO, buton ve röle modülünün ortak 5 V beslemesini sağlar.',uno:'D2’deki buton bilgisini kayıtlı programla D8 röle çıkışına aktarır.',b:'SIG hattıyla D2’ye buton bilgisini verir; VCC/GND uçları modülü besler.',k:'D8’den kumanda alan 5 V röle modülüdür; COM/NO/NC uçlarında bağlı bir yük yoktur.'}
 },
 'seal-in-1':{
  summary:'START’a kısa süre basmak K1’i başlatır; yardımcı kontak bobini tutar. STOP’un bu tutma yolunu nasıl kestiğini göreceksin.',
  explanation:'Başlangıçta START ve K1 NO kontağı açık, STOP NC kontağı kapalıdır. START’a basınca K1 bobini çeker; ona bağlı NO kontak da kapanır. Bu kontak START’a paralel ikinci yol oluşturduğu için START’ı bıraksan da bobin beslenir. STOP her iki kolun önündedir: basılınca iki yolu da keser, bobin bırakır ve NO kontak açılır. STOP’u bırakmak tek başına yeniden başlatmaz; tekrar START gerekir. Bu tutma enerji varken sürer, kalıcı bir kayıt değildir. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['START NO, STOP NC ve K1 NO yardımcı kontağını bul.','START ile K1 kontağının paralel kollarını ve önlerindeki ortak STOP’u takip et.','START’a basıp bırak; K1’in çekili kaldığını gözlemle.','STOP’a bas; bobinin ve tutma kontağının neden bıraktığını anlat.','STOP’u bırakınca yeniden başlatmak için ne gerektiğini dene.'],
  why:'K1 çekince kendi NO kontağı kapanır. START’a paralel bu kol, START bırakıldıktan sonra STOP üzerinden bobinin beslenmesini sürdürür.',
  materials:{g1:'Bobin ve tutma kollarına 24 VDC besleme sağlar.',stop:'Normalde kapalıdır; basılınca START ve tutma kollarının ortak beslemesini keser.',start:'İlk çalıştırmada bobini enerjilendiren anlık NO butondur.',hold:'K1 çekince kapanır; START’a paralel yoldan bobini enerjili tutar.',coil:'A1/A2’den enerjilenince kendi K1 yardımcı kontağını kapatan röle bobinidir.'}
 },
 'seal-in-2':{
  summary:'Mühürleme devresine eklenen yeşil lamba, bobinin beslenme durumunu gösterir. START, bırakma ve STOP sırasını lambayla izleyeceksin.',
  explanation:'START’a basınca K1 bobini çeker ve yardımcı NO kontağı tutma yolunu kapatır. H1 lambası bobinin A1 hattı ile 0 V arasına bağlıdır; bobinle birlikte beslenir. START bırakılınca K1 kontağı iki elemanın da beslenmesini sürdürür. STOP’a basınca ortak besleme kesilir; bobin bırakır ve H1 söner. H1’in yanması bu şemada bobin beslemesini gösterir; bağlı bir motorun çalıştığını göstermez. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['Temel mühürleme devresine eklenen H1 lambasını bul.','H1’in X1 ucunun bobinin A1 hattına, X2 ucunun 0 V’a bağlı olduğunu takip et.','START’a basıp bırak; bobin ile lambanın durumunu karşılaştır.','STOP’a bas; iki elemanın beslemesinin nerede kesildiğini göster.','Lambanın bu devrede hangi bilgiyi verdiğini kendi cümlenle anlat.'],
  why:'STOP, hem START hem tutma kolunun önündeki ortak yolu açar. Bobin ve ona paralel H1 lambası beslenemediği için bobin bırakır, lamba söner.',
  materials:{g1:'K1 bobini ve H1 lambası için 24 VDC besleme sağlar.',stop:'Basılınca bobin ile lambanın ortak beslemesini kesen NC durdurma butonudur.',start:'Bobini ve lambayı ilk kez besleyen yolu kapatan NO başlatma butonudur.',hold:'START bırakıldıktan sonra bobin ve lambanın beslemesini sürdürür.',coil:'Çektiğinde K1 tutma kontağını kapatır; H1 ile aynı besleme hattındadır.',h:'Bobinin A1 hattı ile 0 V arasına bağlı yeşil durum lambasıdır; bobin beslemesini görünür kılar.'}
 },
 'seal-in-3':{
  summary:'Bu pekiştirme dersinde tutma kontağının görevini açıklayacaksın: START bırakıldıktan sonra bobin hangi yoldan beslenir?',
  explanation:'Önce çalışan devrede START’a basıp bırak ve bobinin çekili kaldığını gözlemle. Ardından START kolunu gözünle ayırıp K1 yardımcı kontağı üzerinden kalan yolu takip et. Şimdi düşün: bu yardımcı kontak kapanamasaydı START bırakılınca ne olurdu? Bobine giden iki kol da açık kalacağından bobin bırakırdı. Bu bir arıza üzerine düşünme sorusudur; mevcut devrede arıza eklenmiş değildir. STOP’a basarak normal tutmanın nasıl bittiğini de kontrol et. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['START’a basıp bırak; bobin çekili kalırken henüz STOP’a basma.','START bırakılmışken bobine enerji taşıyan K1 yardımcı kontağını göster.','K1 kontağının START’a neden paralel bağlandığını anlat.','Kontak kapanamasaydı START bırakılınca bobinin durumunu tahmin et; mevcut devrede böyle bir arıza olmadığını ayır.','Son olarak STOP’a bas; hem başlatma hem tutma yolunun nasıl kesildiğini göster.'],
  why:'START bırakılınca onun kolu açılır. K1 yardımcı kontak da kapanmıyorsa paralel tutma kolu açık kalır; bobini besleyen yol kalmaz.',
  materials:{g1:'Arıza sorusunda izleyeceğin 24 VDC enerji yolunun başlangıcı ve dönüşüdür.',stop:'Her iki kolun önündeki NC kontakla normal durdurmayı sağlar.',start:'İlk enerjiyi verir; bırakıldığında kendi kolunu açar.',hold:'Bu derste görevini sorguladığın K1 NO tutma kontağıdır; mevcut modelde çalışır durumdadır.',coil:'START veya kapalı K1 tutma kolu üzerinden beslenebilen röle bobinidir.'}
 },
 'seal-in-4':{
  summary:'Kontaktör bobini de kendi NO yardımcı kontağıyla tutulabilir. Röleli mühürleme mantığını kontaktör kumandasında kullanacaksın.',
  explanation:'START’a basınca kontaktör bobini çeker ve aynı K1 referansını taşıyan yardımcı NO kontak kapanır. START bırakıldığında bu kontak kapalı kalır; bobine giden akım yolu böylece tamamlanmaya devam eder. STOP’a basılınca ortak besleme kesilir ve kontaktör bırakır. Burada yalnız kumanda devresi bulunur; motor ve ana güç kontakları çizilmemiştir. Bobinin tutulması bir motorun çalıştığını kanıtlamaz. Bu çalışma yalnız yazılımın sanal devre ortamındadır.',
  steps:['K1 kontaktör bobinini ve aynı referanslı NO yardımcı kontağını bul.','START ile yardımcı kontağın paralel, STOP’un ikisine ortak olduğunu incele.','START’a basıp bırak; bobinin çekili kalmasını kapalı yardımcı kontakla açıkla.','STOP’a basıp bırak; tekrar çalıştırmak için START gerektiğini gözlemle.','Bu kumanda şemasında motor ve ana güç kontağı bulunup bulunmadığını söyle.'],
  why:'Kontaktör çekince kendi NO yardımcı kontağı kapanır. START’a paralel olan bu kontak bobini beslemeyi sürdürür; STOP açılınca tutma biter.',
  materials:{g1:'Kontaktörün 24 VDC kumanda devresini besler.',stop:'START ve tutma kolunu birlikte kesen NC durdurma butonudur.',start:'Kontaktör bobinine ilk enerjiyi veren anlık NO butondur.',hold:'K1 kontaktör bobini çekince kapanan ve START’ı bıraktığında tutmayı sürdüren NO yardımcı kontaktır.',coil:'Kendi yardımcı K1 kontağını kumanda eden kontaktör bobinidir; şemada motor ve güç kontakları yoktur.'}
 }
};
for(const [id,heading,goal,task,question,options] of rows){
 const l=L.byId[id];
 if(!l||!['button-led','button-relay','seal-in'].includes(l.topicId))throw Error('Control lesson not found: '+id);
 if(!l.project?.components?.length||!l.project?.wires?.length||!l.steps?.length)throw Error('Real circuit required: '+id);
 const components=new Set(l.project.components.map(c=>c.id));
 const wires=new Set(l.project.wires.map(w=>JSON.stringify([w.from.c,w.from.p,w.to.c,w.to.p])));
 for(const step of l.steps){
  if(!components.has(step.from?.c)||!components.has(step.to?.c)||!wires.has(JSON.stringify([step.from.c,step.from.p,step.to.c,step.to.p])))
    throw Error('Guided terminal not in real circuit: '+id);
 }
 // Preserve original project, pins, steps, simulator state, selected components and canonical geometry.
 const previous=l.pedagogyReview?.version||null;
 l.designStandard='rich-reference-v1';
 l.measurementUpgrade={heading,goal,task,question,options,simulationOnly:true};
 l.learningGoal=goal;
 l.summary=goal;
 l.explanation=task+' Bu uygulama yalnız yazılımın sanal devre ortamındadır; gerçek enerjili tesisata dokunma.';
 l.beginnerSteps=[
  'Devredeki gerçek malzemeleri ve NO/NC işlevini tanı.',
  'Sanal bağlantıları terminalden terminale adım adım incele.',
  task,
  'Devreyi yeniden kur akışıyla mevcut bağlantıları tekrar oluştur.',
  'Beklenen davranışı tahmin et, sanal simülasyonda gözle ve konu kontrolünü cevapla.'
 ];
 l.pedagogyReview={...l.pedagogyReview,version:'v1.19.20-control-batch-f',previousVersion:previous,reviewed:true,codeImplemented:true,visualAcceptance:false,designStandard:'rich-reference-v1',preserveSourceCircuit:true,simulationOnly:true,componentIds:l.project.components.map(c=>c.typeId)};
 l.quiz={question,options:clone(options),answer:0,why:goal};
 const teaching=teachingById[id];
 if(teaching){
  l.summary=teaching.summary;
  l.explanation=teaching.explanation+' Gerçek enerjili tesisata dokunma.';
   if(teaching.task)l.measurementUpgrade.task=teaching.task;
  l.beginnerSteps=clone(teaching.steps);
  l.quiz.why=teaching.why;
  const definedMaterials=Array.isArray(l.materials)?l.materials:l.project.components.map(c=>({componentId:c.id,typeId:c.typeId,label:c.label||c.ref||c.id,why:c.tutorialPurpose||'Sanal devre bileşeni'}));
 l.materials=definedMaterials.map(m=>({...m,why:teaching.materials[m.componentId]||m.why}));
 }
}
L._controlBatchF=true;
})(typeof window==='undefined'?globalThis:window);
