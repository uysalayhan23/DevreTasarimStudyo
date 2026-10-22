/* MQ-07 Batch K: BERO and motor controls: teaching metadata only; electrical graphs immutable. */
(function(root){'use strict';
const L=root.DTSTutorialLessons;if(!L||L._motorBatchK)return;
const rows={
 'bero':['BERO temassız endüktif algılama','Sanal BERO sensöründe BN pozitif, BU sıfır volt ve BK çıkış uçlarını ayırt et. Algılama ve yük akım yolunu takip et.','BERO yaklaşım sensörünün temel işlevi nedir?',['Metali temassız algılamak','Besleme frekansını değiştirmek','Motor faz sırasını ters çevirmek']],
 'motor-forward-reverse':['Motor ileri ve geri yön kumandası','Sanal ileri ve geri kontaktörlerinin karşılıklı kilitlemesini, STOP işlevini ve mühürleme yolunu gözlemle. İki kontaktörün aynı anda çekili kalmaması gerektiğini açıkla.','İleri ve geri kontaktörleri neden kilitlenir?',['Eşzamanlı kapanmayı engellemek için','Motor hızını iki katına çıkarmak için','Nötr ile PE yi birleştirmek için']],
 'motor-star-delta':['Motor yıldız/üçgen geçişi','Altı uçlu motorun sanal yıldız ve üçgen bağlantısını, zamanlama ve karşılıklı kilitleme ilkesini incele. Gerçek elektrik tesisatında uygulama yapma.','Yıldız ve üçgen kontaktörleri neden birlikte etkin olmamalıdır?',['Kısa devre tehlikesi doğurabileceği için','Motor etiketi kaybolduğu için','Buton rengi değiştiği için']]
};
const copy=x=>JSON.parse(JSON.stringify(x));
for(const [topic,cfg] of Object.entries(rows))for(let n=1;n<=4;n++){
 const id=topic+'-'+n,l=L.byId[id];if(!l||l.topicId!==topic)throw Error('Missing canonical '+id);
 const p=l.project;if(!p?.components?.length||!p.wires?.length||l.steps?.length!==p.wires.length)throw Error('Invalid graph '+id);
 const ids=new Set(p.components.map(c=>c.id)),wireKeys=new Set(p.wires.map(w=>JSON.stringify([w.from?.c,w.from?.p,w.to?.c,w.to?.p])));
 for(const w of p.wires)if(!ids.has(w.from?.c)||!ids.has(w.to?.c))throw Error('Broken component '+id);
 for(const st of l.steps)if(!wireKeys.has(JSON.stringify([st.from?.c,st.from?.p,st.to?.c,st.to?.p])))throw Error('Broken step '+id);
 const goal=cfg[1],task='Yalnız sanal çalışma alanında '+goal+' '+n+'. uygulamanın mevcut kaynak devresini ve terminal adımlarını izle; gerçek solver sonucu ölçülmeden çıktıyı geçmiş kabul etme.';
 l.designStandard='rich-reference-v1';l.learningGoal=goal;l.summary=goal;l.explanation=task;
 l.measurementUpgrade={heading:cfg[0]+' · '+n+'. uygulama',goal,task,question:cfg[2],options:copy(cfg[3]),simulationOnly:true,canonicalCircuitPreserved:true};
 l.beginnerSteps=['Gerçek sanal malzemelerin terminal adlarını tanı.','Mevcut kablo bağlantılarının izleğini göster.',task,'Kanonik devre bağlantılarını rehberle yeniden kur.','Sanal simülasyon sonucunu doğrula ve konu sorusunu yanıtla.'];
 l.quiz={question:cfg[2],options:copy(cfg[3]),answer:0,why:goal};
 l.pedagogyReview={...l.pedagogyReview,previousVersion:l.pedagogyReview?.version||null,version:'v1.19.20-motor-batch-k',codeImplemented:true,visualAcceptance:false,simulationAcceptance:false,sourceCircuitPreserved:true};
}

/* SC070–073 motor reversal: circuit-specific virtual lessons; no field wiring. */
const motorReversalDetails={
  "motor-forward-reverse-1": {
    "goal": "İleri/geri kontaktörlerinin çapraz NC kilitleme ve mühürleme mantığını öğren.",
    "task": "Sanal S1 İleri komutuyla K1 bobini çalışır; K1/13–14 mühürleme kontağı S1 bırakıldığında K1'i tutar. K1'in 21–22 NC kilidi K2 Geri yolunu keser. S0 Stop iki bobini bırakır; sanal S2 Geri seçilince motorun U ile W fazları yer değiştirir.",
    "question": "K1 İleri çalışırken S2 Geri komutu neden K2'yi çalıştırmaz?",
    "answers": [
      "K1'e bağlı 21–22 NC kilit K2 bobin yolunu kestiği için",
      "S2 gerilimi iki katına çıkardığı için",
      "Motorun PE ucu yön değiştirdiği için"
    ],
    "obs": [
      "S0/21–22 ortak Stop kumandasıdır.",
      "K1/13–14 ve K2/13–14, ilgili Start butonuna paralel mühürleme kontağıdır.",
      "K1'in NC kilidi K2 bobin yolundadır; K2'nin NC kilidi K1 bobin yolundadır.",
      "İleri L1/L2/L3→U/V/W, geri L3/L2/L1→U/V/W."
    ],
    "steps": [
      "Sanal S0, S1, S2 ile iki kontaktörün bobinini bul.",
      "S1'i sanal olarak basıp bırak, K1 mühürlemesini izle.",
      "K1 çalışırken S2 komutunu dene ve kilidi gözlemle.",
      "S0 ile durdurup S2'yle geri dönüşü gözlemle.",
      "26 kablolu devreyi değiştirmeden uçlarını takip et."
    ]
  },
  "motor-forward-reverse-2": {
    "goal": "Mühürlemeli ileri/geri kumandasında H1 yeşil ve H2 kırmızı yön lambalarının bobinlere bağlılığını anla.",
    "task": "Sanal K1 İleri bobini enerjilenince K1/A1'e bağlı H1 yeşil yanar; K2 Geri bobininden beslenen H2 kırmızı söner. Stop her iki bobini ve lambayı bırakır. Karşılıklı NC kilit iki yönü birlikte çalıştırmaz.",
    "question": "Sanal K2 Geri bobini çalışırken hangi yön lambası yanar?",
    "answers": [
      "H2 kırmızı",
      "H1 yeşil",
      "İki lamba birlikte"
    ],
    "obs": [
      "H1/X1, K1/A1 düğümüne; H1/X2, G1/N'ye bağlıdır.",
      "H2/X1, K2/A1 düğümüne; H2/X2, G1/N'ye bağlıdır.",
      "İleri K1 ve geri K2 bobinleri ayrı mühürlenir.",
      "Geri ana kontakta motorun ilk ve üçüncü fazları yer değiştirir."
    ],
    "steps": [
      "Sanal K1/K2 ve H1/H2 göstergelerini tanı.",
      "İleri komutunda H1'i izle.",
      "Start bırakılınca K1 mühürlemeyi gözlemle.",
      "Stop sonrası Geri komutunda H2'yi izle.",
      "30 mevcut kablonun bobin ve gösterge uçlarını kontrol et."
    ]
  },
  "motor-forward-reverse-3": {
    "goal": "Geri yönde L1 ve L2 fazlarının yer değiştirildiğini sanal motor yönünden öğren.",
    "task": "K1 İleri ana kontağı G1/L1–L2–L3'ü motor U–V–W'ye taşır. K2 Geri ana kontağı ilk iki fazı çaprazlar: motorun U–V–W uçları L2–L1–L3 olur. S0 Stop, NC kilitler ve mühürleme bu sanal seçimi güvenli sırada tutar.",
    "question": "Üçüncü motor varyantında Geri yön için hangi iki fazın yeri değişir?",
    "answers": [
      "L1 ve L2",
      "L1 ve L3",
      "L2 ve L3"
    ],
    "obs": [
      "İleri: L1→U, L2→V, L3→W.",
      "Geri: L2→U, L1→V, L3→W.",
      "İki kontaktör birlikte çekmez.",
      "PE ucu koruma bağlantısıdır; faz değişiminde kullanılmaz."
    ],
    "steps": [
      "Sanal K1'in U/V/W faz sırasını incele.",
      "K2 Geri yolunda ilk iki fazın çaprazlandığını göster.",
      "Stop araya girerek sanal İleri/Geri komutlarını karşılaştır.",
      "NC kilidi ve mühürlemeyi gözlemle.",
      "26 devre kablosunu değiştirmeden fazları takip et."
    ]
  },
  "motor-forward-reverse-4": {
    "goal": "İlk iki fazın çaprazlandığı ileri/geri devrede yön lambalarıyla kilitleme ve mühürlemeyi birlikte yorumla.",
    "task": "Sanal K1 İleri ve K2 Geri kontaktörleri karşılıklı NC kontakla kilitlenir; K2 Geri ana kontağında L1 ve L2 yer değiştirir. K1/A1'e bağlı H1 yeşil, K2/A1'e bağlı H2 kırmızı gösterge seçilen yönü bildirir. S0 Stop tüm bobinleri ve göstergeleri bırakır.",
    "question": "Dördüncü varyantta K1 İleri bobini mühürlenmişken hangi gösterge yanar?",
    "answers": [
      "H1 yeşil",
      "H2 kırmızı",
      "İki gösterge aynı anda"
    ],
    "obs": [
      "İleri: L1/L2/L3→U/V/W.",
      "Geri: L2/L1/L3→U/V/W.",
      "H1/X1→K1/A1, H2/X1→K2/A1; X2 dönüşleri G1/N'dir.",
      "NC çapraz kilit iki kontaktörün birlikte çekmesini önler."
    ],
    "steps": [
      "Sanal Stop/İleri/Geri komutlarını tanı.",
      "İleri çalışırken H1 ile mühürleme durumunu izle.",
      "K1 açıkken Geri komutunda kilidi kontrol et.",
      "Stop sonrası Geri komutunda H2'yi izle.",
      "30 kablolu devrede faz, bobin ve gösterge bağlantılarını göster."
    ]
  }
};
for(const [id,t] of Object.entries(motorReversalDetails)){
 const l=L.byId[id],expectedWires=id.endsWith('-2')||id.endsWith('-4')?30:26;
 if(!l||l.project?.wires?.length!==expectedWires||l.steps?.length!==expectedWires)throw Error('Motor graph altered: '+id);
 l.learningGoal=t.goal;l.summary=t.goal;
 l.explanation=t.task+' Bu bir sanal eğitim uygulamasıdır, gerçek elektrik tesisatı uygulama yönergesi değildir.';
 l.measurementUpgrade={...l.measurementUpgrade,goal:t.goal,task:t.task,question:t.question,options:copy(t.answers),observationPoints:copy(t.obs),simulationOnly:true,canonicalCircuitPreserved:true};
 l.beginnerSteps=copy(t.steps);
 l.quiz={question:t.question,options:copy(t.answers),answer:0,why:t.goal};
}

/* SC074–077: canonical virtual star/delta, not physical mains instructions. */
const starDeltaTeaching={
  "motor-star-delta-1": {
    "goal": "Manuel 0–Yıldız–Üçgen paket şalterinin üç sanal konumunu ayırt et.",
    "task": "S1 paket şalterin 0 konumunda motor durur; Yıldız konumunda U2/V2/W2 uçları ortak noktaya alınır; Üçgen konumunda sargı uçları eşleştirilir. Bu ders sanal paket şalter seçimine dayanır; otomatik 2 saniyelik bir zaman rölesi yoktur.",
    "q": "Birinci yıldız/üçgen uygulamasında geçişi kim seçer?",
    "answers": [
      "S1 manuel paket şalter",
      "KT1 zaman rölesi",
      "H1 yön lambası"
    ],
    "points": [
      "G1/L1, L2 ve L3, S1 paket şalter beslemesidir.",
      "S1'in U1/V1/W1 ve U2/V2/W2 çıkışları motorun altı sargı terminaline gider.",
      "0 konumu devreyi açık bırakır; Yıldız ve Üçgen ayrı sanal şalter konumlarıdır."
    ],
    "steps": [
      "G1, S1 paket şalter ve altı uçlu M1 motoru tanı.",
      "Sanal 0 konumunda motorun durumunu izle.",
      "Yıldız konumunda motor bağlantısını gözlemle.",
      "Üçgen konumunda değişen sargı bağlantısını karşılaştır.",
      "On gerçek sanal bağlantıyı değiştirmeden kontrol et."
    ]
  },
  "motor-star-delta-2": {
    "goal": "2 saniye ayarlı sanal otomatik yıldız/üçgen geçişini ve kontaktör kilidini öğren.",
    "task": "Sanal S1 Start ile K1 ana kontaktör ve KT1 zaman rölesi beslenir. KT1'in süre dolmadan kapalı NC yolu K2 Yıldız bobinini, süre dolunca kapattığı NO yolu K3 Üçgen bobinini etkinleştirir. K2/K3 çapraz NC kilit aynı anda çekmeyi engeller. S0 Stop kumandayı keser.",
    "q": "Bu ikinci uygulamada yaklaşık 2 saniye sonra hangi sanal kontaktör devreye girer?",
    "answers": [
      "K3 Üçgen",
      "K2 Yıldız sürekli kalır",
      "K1 ana kontaktör bırakır"
    ],
    "points": [
      "K1 mühürleme kontağı Start'a paralel yoldadır.",
      "KT1 NC→K2 Yıldız, KT1 NO→K3 Üçgen kumandasını ayırır.",
      "K2/K3 karşılıklı NC kilitli yardımcı yollardır.",
      "Motor U2/V2/W2 yıldız noktası ile üçgen bağları ayrı kontaktörlerde kurulmuştur."
    ],
    "steps": [
      "Sanal K1 ana, K2 Yıldız, K3 Üçgen ve KT1 zaman rölesini tanı.",
      "S1 sanal Start ile önce K2 Yıldız durumunu gözlemle.",
      "Süre dolduğunda K2'nin bırakıp K3'ün çekmesini karşılaştır.",
      "K2/K3'ün eşzamanlı kapanmadığını, S0 Stop etkisini incele.",
      "34 mevcut kablonun sanal görevlerini takip et."
    ]
  },
  "motor-star-delta-3": {
    "goal": "4 saniyelik yıldız/üçgen geçişinde H1/H2 göstergelerinin bobin durumunu izle.",
    "task": "Sanal KT1 zaman rölesi 4 saniyeye ayarlıdır. Start sonrasında K2 Yıldız ile H1 yeşil gösterge etkindir. Süre dolunca K2 bırakır, K3 Üçgen devreye girer ve H2 kırmızı gösterge yanar. Karşılıklı NC kilit eşzamanlı çekmeyi engeller; Stop her iki göstergeyi söndürür.",
    "q": "Bu üçüncü uygulamada 4 saniye sonrasındaki Üçgen durumunu hangi gösterge bildirir?",
    "answers": [
      "H2 kırmızı",
      "H1 yeşil",
      "İkisi aynı anda"
    ],
    "points": [
      "KT1'in ayarı 4 saniyedir.",
      "H1/X1, K2/A1 Yıldız bobini düğümündedir.",
      "H2/X1, K3/A1 Üçgen bobini düğümündedir.",
      "K2/K3 karşılıklı NC kilitleri ve Start mühürlemesi korunur."
    ],
    "steps": [
      "K1, K2, K3 ve KT1 sanal kumanda elemanlarını tanı.",
      "Start sonrası K2 Yıldız ve H1 göstergesini izle.",
      "Dört saniyelik zaman geçişinde H1'den H2'ye değişimi gözlemle.",
      "Sanal Stop ile bobinlerin ve iki lambanın bırakmasını doğrula.",
      "38 devre kablosunun göstergeler dahil görevlerini incele."
    ]
  },
  "motor-star-delta-4": {
    "goal": "6 saniyelik yıldız/üçgen geçişini ve iki ayrı çalışma lambasını birlikte yorumla.",
    "task": "Bu sanal uygulamada KT1, 6 saniyelik Yıldız süresi için ayarlıdır. K1 ana kontaktör mühürlenirken önce K2 Yıldız ve H1 yeşil, süre dolunca K3 Üçgen ve H2 kırmızı etkinleşir. K2/K3 NC kilitler birlikte çalışmayı engeller. S0 Stop devreyi bırakır.",
    "q": "Dördüncü uygulamada yaklaşık 4. saniyede hangi sanal durum devam eder?",
    "answers": [
      "K2 Yıldız ve H1 yeşil",
      "K3 Üçgen ve H2 kırmızı",
      "Her iki kontaktör birlikte"
    ],
    "points": [
      "KT1 Yıldız zaman ayarı 6 saniyedir.",
      "K2 Yıldız bobini ve H1 aynı kumanda düğümünde bulunur.",
      "K3 Üçgen bobini ve H2 diğer düğüme bağlıdır.",
      "S0 Stop her iki bobini ve lambayı kapatır."
    ],
    "steps": [
      "Sanal KT1'in 6 saniye ayarını tanı.",
      "Start sonrası Yıldız/H1 durumunu gözlemle.",
      "Dördüncü saniyede geçişin henüz tamamlanmadığını ayırt et.",
      "Altıncı saniyeden sonra Üçgen/H2 durumunu ve kilidi incele.",
      "Stop sonrası 38 kablolu sanal devreyi değiştirmeden karşılaştır."
    ]
  }
};
for(const [id,t] of Object.entries(starDeltaTeaching)){
 const lesson=L.byId[id],expectedWires=id.endsWith('-1')?10:id.endsWith('-2')?34:38;
 if(!lesson||lesson.project?.wires?.length!==expectedWires||lesson.steps?.length!==expectedWires)
   throw Error('Star/delta lesson graph changed '+id);
 lesson.learningGoal=t.goal;lesson.summary=t.goal;
 lesson.explanation=t.task+' Yalnız sanal eğitim ortamı içindir; gerçek elektrik tesisatı uygulama yönergesi değildir.';
 lesson.measurementUpgrade={...lesson.measurementUpgrade,goal:t.goal,task:t.task,question:t.q,options:copy(t.answers),observationPoints:copy(t.points),simulationOnly:true,canonicalCircuitPreserved:true};
 lesson.beginnerSteps=copy(t.steps);
 lesson.quiz={question:t.q,options:copy(t.answers),answer:0,why:t.goal};
}

/* SC070–073: short conversational observations, no graph changes. */
const motorStories={
  "motor-forward-reverse-1": {
    "summary": "Motoru ileri ve geri çalıştırmak için iki kontaktörün sırayla görev yapmasını sağlıyoruz.",
    "goal": "Düğmeyi bıraksan da motorun neden çalıştığını ve geri gitmek için neden önce durdurduğunu anlayacaksın.",
    "story": "Bir atölyedeki küçük taşıma bandını düşün. İleri'ye bastığında K1 motoru çalıştırır. Parmağını çekersin, yine de durmaz: mühürleme kontağı K1'i çalışır tutar. Geri'ye basınca K2 hemen devreye girmez; kilit bunu engeller. Önce Durdur'a, sonra Geri'ye bastığında motorun yönü değişir.",
    "task": "İleri'ye basıp bırak. Motoru izle. Geri'yi dene; sonra Durdur'a basıp yeniden Geri'yi seç.",
    "steps": [
      "İleri'ye bas, motoru izle.",
      "Düğmeyi bırakınca ne olduğunu gör.",
      "İleri çalışırken Geri'yi dene.",
      "Durdur'a bas, ardından Geri'yi seç.",
      "İki kontaktörün neden birlikte çalışmadığını anlat."
    ]
  },
  "motor-forward-reverse-2": {
    "summary": "Motorun hangi yönde çalıştığını yeşil ve kırmızı ışıklara bakarak anlayabiliyoruz.",
    "goal": "Yeşil H1 ile kırmızı H2'nin ne zaman yandığını ve iki yönün neden birlikte çalışmadığını göreceksin.",
    "story": "Küçük bir depodaki taşıma bandını hayal et. İleri'ye bastığında K1 çalışır, yeşil H1 yanar. Düğmeden elini çeksen de motor hemen durmaz; mühürleme onu çalışır tutar. Şimdi Geri'ye dokun: kilit iki yönün birden çalışmasını önler. Önce Durdur'a bas, sonra Geri'yi seç. Bu kez K2 çalışır ve kırmızı H2 yanar. Işıklar sana motorun hangi yönde olduğunu anlatır.",
    "task": "Önce İleri'yi seçip yeşili izle. Düğmeyi bırak. Sonra Durdur ve Geri'yi dene: hangi ışık yandı?",
    "steps": [
      "İleri'ye bas ve yeşil H1'i izle.",
      "Düğmeyi bırak; motor devam ediyor mu?",
      "İleri çalışırken Geri'yi dene.",
      "Durdur'a basıp Geri'yi seç.",
      "Kırmızı H2 neden şimdi yanıyor?"
    ]
  },
  "motor-forward-reverse-3": {
    "summary": "Geri dönüş için yeni bir motor gerekmiyor; bu devrede L1 ile L2'nin yeri değişiyor.",
    "goal": "İleri ve geri çalışmada ilk iki fazın değişmesinin yönü nasıl etkilediğini fark edeceksin.",
    "story": "Motorun ileri döndüğünü düşün. K1 çalışırken fazlar motorun U, V, W uçlarına sırayla gider. Önce Durdur'a basıp ardından Geri'yi seçtiğinde K2 devreye girer. Bu kez L1 ile L2 yer değiştirir ve aynı motor ters yönde döner. Kilit iki kontaktörün aynı anda çalışmasına izin vermez.",
    "task": "İleri ve Geri komutlarını Durdur ile ayır. Motorun yönünü ve L1 ile L2 yollarını karşılaştır.",
    "steps": [
      "İleri'yi seç; motorun yönüne bak.",
      "İleri devresinde L1 ve L2'yi bul.",
      "Durdur'a basıp Geri'yi seç.",
      "Faz yollarında ne değiştiğini gör.",
      "Yönün neden tersine döndüğünü anlat."
    ]
  },
  "motor-forward-reverse-4": {
    "summary": "Bu kez motorun yönüyle birlikte yeşil ve kırmızı gösterge lambaları da değişiyor.",
    "goal": "Faz değişimi, mühürleme ve yön lambalarının birlikte nasıl çalıştığını göreceksin.",
    "story": "Bir taşıma bandını yönettiğini hayal et. İleri'ye basınca K1 çalışır ve yeşil H1 yanar. Elini çekince mühürleme motoru çalışır tutar. Ters yöne geçmek istediğinde önce Durdur'a basarsın. Ardından Geri'yi seçince K2 devreye girer, iki fazın yeri değişir ve kırmızı H2 yanar. Kilit, iki yönün birden açılmasına engel olur.",
    "task": "İleri'de yeşili, Durdur'dan sonra Geri'de kırmızıyı izle. Motorun yönünü de karşılaştır.",
    "steps": [
      "İleri'ye basıp yeşil H1'i gözlemle.",
      "Düğmeyi bırakınca motoru izle.",
      "Geri komutunun neden engellendiğini gör.",
      "Durdur'a bas, ardından Geri'yi seç.",
      "Kırmızı H2 ile ters dönüşü karşılaştır."
    ]
  }
};
for(const [id,t] of Object.entries(motorStories)){
 const l=L.byId[id];if(!l||l.project?.wires?.length!==l.steps?.length)throw Error('Motor graph changed '+id);
 l.summary=t.summary;l.learningGoal=t.goal;l.explanation=t.story+' Bu yalnız sanal eğitim devresidir.';
 l.measurementUpgrade={...l.measurementUpgrade,goal:t.summary,task:t.task};l.beginnerSteps=copy(t.steps);
}
L._motorBatchK=true;
})(typeof window==='undefined'?globalThis:window);
