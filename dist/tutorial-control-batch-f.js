/* MQ-07 next teaching batch: authentic control circuits, no reconstructed wiring. */
(function(root){
'use strict';
const L=root.DTSTutorialLessons;if(!L||L._controlBatchF)return;
const rows=[["button-led-1","NO butonla LED akım yolunu keşfet","+24 V sanal kaynağın NO buton, akım sınırlama direnci ve yeşil LED üzerinde nasıl kapalı bir yol oluşturduğunu açıkla.","Sanal devrede NO butonun basılı ve serbest hâlini karşılaştır. LED'in yalnız buton basılıyken neden yanacağını 2,7 kΩ direncin göreviyle açıkla.","NO buton serbest bırakılınca LED neden söner?",["NO kontak yeniden açılır","Direnç sıfırlanır","Kaynak gerilimi iki katına çıkar"]],["button-led-2","NC butonla durdurmayı öğren","NC butonun normalde kapalı devreyi sağladığını, basıldığında seri LED yolunu açtığını anla.","Sanal devrede NC butona bas ve bırak; LED'in iki konumda nasıl değiştiğini gözlemle. NO ile NC arasındaki farkı anlat.","NC butona basıldığında seri akım yoluna ne olur?",["Akım yolu açılır","Direnç kısa devre olur","Kaynak iki kat güçlenir"]],["button-led-3","Sanal aydınlatma anahtarında açık/kapalı yol","Yalnız yazılım simülasyonunda gösterilen AC aydınlatma anahtarının lambayı nasıl kontrol ettiğini kavra.","Yalnız sanal devrede anahtarı açıp kapat; lambanın neden farklı davrandığını gözlemle. Bu ders gerçek şebekede bağlantı yaptırmaz.","Anahtarın açık durumunda sanal lamba neden sönüktür?",["Lamba akım yolu tamamlanmaz","Frekans 0 Hz olur","Lamba direnci kaybolur"]],["button-led-4","24 VDC ikaz lambasıyla durum bilgisi","Anlık NO kumanda ve kırmızı ikaz lambasıyla sanal uyarı devresinin durumunu yorumla.","Sanal butona basılı ve serbest durumda lambayı karşılaştır; anlık butonun neden kalıcı hafıza oluşturmadığını açıkla.","Anlık buton serbest bırakılınca ne olur?",["İkaz lambasının akım yolu açılır","Buton kendini mühürler","Lamba kalıcı olarak açık kalır"]],["button-led-5","Arduino D2 buton ve D13 LED yolu","Arduino UNO'da 5 V modül beslemesi, D2 dijital giriş ve D13 LED çıkışının görevlerini ayrı ayrı belirle.","Sanal UNO projesinde D2 buton bilgisi ile D13 LED davranışını izle. 220 Ω direncin LED akımını neden sınırladığını açıkla.","Arduino'da buton hangi dijital girişten okunur?",["D2","D13","GND"]],["button-relay-1","NO buton röle bobinini nasıl enerjiler?","Röle bobininin bir kumanda elemanı olduğunu, basılı tutulan anlık NO butonla enerji aldığını açıkla.","Sanal devrede NO butonun serbest/basılı durumlarını karşılaştır ve bobin enerjisinin neden değiştiğini açıkla.","NO buton serbestken sanal röle bobini neden enerjisizdir?",["Kumanda yolu açık kalır","Bobin direnci sıfırlanır","Girişin polaritesi kendiliğinden değişir"]],["button-relay-2","Röle bobini ve NO yardımcı kontak ayrımı","Bobin kumanda yolu ile NO yardımcı kontak üzerinden çalışan yeşil lambanın görevlerini birbirinden ayır.","Sanal butonla K1 bobinini çalıştır; ayrı NO yardımcı kontağın durum lambasını nasıl etkilediğini incele.","K1 bobini etkinleştiğinde ona bağlı NO kontak ne yapar?",["Kapanır","Açık kalır","Direnç olur"]],["button-relay-3","Kontaktör bobininin kumanda mantığı","Anlık butonla 24 V sanal kontaktör bobininin enerjilenmesi ile güç kontaklarının görevlerini karıştırma.","Sanal kumanda devresinde butona basıp bırak; kontaktör bobininin aktif/enerjisiz durumlarını karşılaştır.","Kontaktör bobini bırakma sonrası mühürleme yoksa ne olur?",["Enerjisiz kalır","Sonsuza dek çekili kalır","Güç gerilimi yükselir"]],["button-relay-4","Arduino D8 ile sanal röle modülü","Sanal UNO D2 buton bilgisinin D8 ile 5 V röle modülüne nasıl kumanda gönderebildiğini öğren.","Sanal 5 V kaynağı, UNO D2 girişi ve D8 röle modülünü incele; ortak GND'nin neden önemli olduğunu açıkla.","Röle modülünün kumanda sinyali hangi çıkışa atanmıştır?",["D8","D2","GND"]],["seal-in-1","Start/Stop ile mühürleme hafızası","Start butonu bırakıldıktan sonra yardımcı K1 NO kontağının röle bobinini neden enerjili tuttuğunu kavra.","Sanal Start'a basıp bırak. Tutma yolunu K1 yardımcı kontak üzerinden izle. Sonra Stop'a bas ve bobinin neden bıraktığını açıkla.","Start bırakıldıktan sonra K1 bobini nasıl enerjili kalır?",["K1 NO mühürleme kontağıyla","Stop'un kısa devresiyle","Kaynağın gerilim yükseltmesiyle"]],["seal-in-2","Mühürleme ve durum lambasını yorumla","Start/Stop tutma devresindeki bobin hafızasıyla yeşil durum lambasının neden birlikte değiştiğini öğren.","Sanal Start, bırak, Stop sırasını uygula. K1 bobini ve durum lambası arasındaki ilişkiyi açıkla.","Stop butonuna basınca neden lamba söner?",["Stop tutma yolunu keser","Lamba kendi direncini değiştirir","NO kontak kaynak olur"]],["seal-in-3","Mühürleme pekiştirme: arıza teşhisi","Start'a basılmasına rağmen yardımcı NO kontak kapanmıyorsa bobinin neden Start bırakılınca tuttuğu bilgiyi kaybettiğini analiz et.","Sanal devrede normal Start/bırak/Stop sırasını incele. Sonra K1 yardımcı kontağın görevini devre üzerinden işaretle.","K1 yardımcı kontak kapanmazsa Start bırakıldığında ne olur?",["Bobin tutamaz","Bobin daima çekili kalır","Stop butonu işlevsizleşir"]],["seal-in-4","Kontaktör yardımcı kontakla tutma","Kontaktör bobini, Start NO, Stop NC ve kendi yardımcı NO kontağıyla tutma devresini yorumla.","Sanal kontaktör bobinini Start ile etkinleştir; Start bırakıldıktan sonra yardımcı kontak rolünü ve Stop'un zinciri açmasını açıkla.","Kontaktörün tutma yolu hangi elemanla sağlanır?",["Kontaktörün kendi NO yardımcı kontağı","Motorun koruma iletkeni","Stop NC butonunun açık konumu"]]];
const clone=x=>JSON.parse(JSON.stringify(x));
// Content only: the first three lessons in the current curriculum order.
const firstLessons={
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
 const teaching=firstLessons[id];
 if(teaching){
  l.summary=teaching.summary;
  l.explanation=teaching.explanation+' Gerçek enerjili tesisata dokunma.';
  l.beginnerSteps=clone(teaching.steps);
  l.quiz.why=teaching.why;
  l.materials=l.materials.map(m=>({...m,why:teaching.materials[m.componentId]||m.why}));
 }
}
L._controlBatchF=true;
})(typeof window==='undefined'?globalThis:window);
